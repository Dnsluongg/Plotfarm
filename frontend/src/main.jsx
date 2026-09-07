import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Sprout, Droplets, Wheat, Leaf, LayoutDashboard, Package,
  History, Bot, Bell, UserRound, LogOut, Plus, Tractor,
  CheckCircle2, Clock3, ShieldCheck
} from "lucide-react";
import "./styles.css";

import Login from "./components/LoginPage";
import Signup from "./components/Signup";

const initialPlots = [
  { id: 1, name: "Plot A-01", crop: "Tomato", stage: "Flowering", progress: 72, water: true, fertilizer: false, ready: false },
  { id: 2, name: "Plot A-02", crop: "Carrot", stage: "Mature", progress: 100, water: false, fertilizer: true, ready: true },
  { id: 3, name: "Plot B-01", crop: "Corn", stage: "Growing", progress: 44, water: false, fertilizer: false, ready: false },
  { id: 4, name: "Plot B-02", crop: null, stage: "Available", progress: 0, water: false, fertilizer: false, ready: false }
];

function App() {
  const [authPage, setAuthPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("plotFarmLoggedUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const user = currentUser;

  const [page, setPage] = useState("farm");
  const [plots, setPlots] = useState(initialPlots);
  const [automation, setAutomation] = useState(false);
  const [notifications, setNotifications] = useState([
    "Plot A-02 is ready to harvest.",
    "Plot A-01 needs watering."
  ]);
  const [inventory, setInventory] = useState([
    { item: "Carrot", quantity: 12 },
    { item: "Tomato", quantity: 6 }
  ]);

  function handleLogin(user) {
    localStorage.setItem("plotFarmLoggedUser", JSON.stringify(user));
    setCurrentUser(user);
  }

  function handleSignup(user) {
    localStorage.setItem("plotFarmLoggedUser", JSON.stringify(user));
    setCurrentUser(user);
  }

  function handleLogout() {
    localStorage.removeItem("plotFarmLoggedUser");
    setCurrentUser(null);
    setAuthPage("login");
  }

  if (!currentUser) {
    if (authPage === "signup") {
      return (
        <Signup
          onSignup={handleSignup}
          onGoLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onGoSignup={() => setAuthPage("signup")}
      />
    );
  }

  function updatePlot(id, changes) {
    setPlots(ps => ps.map(p => p.id === id ? { ...p, ...changes } : p));
  }

  function rentPlot(id) {
    updatePlot(id, { stage: "Rented", crop: null });
    setNotifications(ns => [`Plot #${id} has been rented.`, ...ns]);
  }

  function plantCrop(id, crop) {
    updatePlot(id, { crop, stage: "Seedling", progress: 8, ready: false });
    setNotifications(ns => [`${crop} planted in Plot #${id}.`, ...ns]);
  }

  function action(id, type) {
    const p = plots.find(x => x.id === id);
    if (!p) return;
    if (type === "water") updatePlot(id, { water: true, progress: Math.min(100, p.progress + 5) });
    if (type === "fertilize") updatePlot(id, { fertilizer: true, progress: Math.min(100, p.progress + 8) });
    setNotifications(ns => [`${type === "water" ? "Watered" : "Fertilized"} ${p.name}.`, ...ns]);
  }

  function harvest(id) {
    const p = plots.find(x => x.id === id);
    if (!p?.ready) return;
    setInventory(items => {
      const found = items.find(x => x.item === p.crop);
      return found
        ? items.map(x => x.item === p.crop ? { ...x, quantity: x.quantity + 5 } : x)
        : [...items, { item: p.crop, quantity: 5 }];
    });
    updatePlot(id, { crop: null, stage: "Rented", progress: 0, ready: false, water: false, fertilizer: false });
    setNotifications(ns => [`Harvested ${p.crop} from ${p.name}.`, ...ns]);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="brandIcon"><Sprout size={24} /></div><span>Plot Farm</span></div>
        <nav>
          <NavItem icon={<LayoutDashboard />} text="My Farm" active={page === "farm"} onClick={() => setPage("farm")} />
          <NavItem icon={<Package />} text="Inventory" active={page === "inventory"} onClick={() => setPage("inventory")} />
          <NavItem icon={<History />} text="Farming History" active={page === "history"} onClick={() => setPage("history")} />
          <NavItem icon={<Bot />} text="Manage Farmer" active={page === "farmer"} onClick={() => setPage("farmer")} />
          <NavItem icon={<Bell />} text="Notifications" active={page === "notifications"} onClick={() => setPage("notifications")} badge={notifications.length} />
        </nav>
        <div className="sidebarBottom">
          <div className="userBox">
            <div className="avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <b>{user.name}</b>
              <small>{user.role}</small>
            </div>
          </div>
          <button className="logout" onClick={handleLogout}><LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{page === "farm" ? "My Farm" : page === "inventory" ? "Inventory" : page === "history" ? "Farming History" : page === "farmer" ? "Manage Farmer" : "Notifications"}</h1>
            <p>Welcome back, {user.name}. Let's grow something!</p>
          </div>
          <div className="headerActions">
            <button className="iconBtn" onClick={() => setPage("notifications")}><Bell size={20} /><span className="dot" /></button>
            <div className="miniUser">
              <div className="avatar small">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span>{user.name}</span>
            </div>
          </div>
        </header>

        {page === "farm" && <Farm plots={plots} rentPlot={rentPlot} plantCrop={plantCrop} action={action} harvest={harvest} automation={automation} />}
        {page === "inventory" && <Inventory inventory={inventory} />}
        {page === "history" && <HistoryPage />}
        {page === "farmer" && <Farmer automation={automation} setAutomation={setAutomation} />}
        {page === "notifications" && <Notifications notifications={notifications} />}
      </main>
    </div>
  );
}

function NavItem({ icon, text, active, onClick, badge }) {
  return <button className={`navItem ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{text}</span>{badge ? <b className="badge">{badge}</b> : null}</button>;
}

function Farm({ plots, rentPlot, plantCrop, action, harvest, automation }) {
  return <div className="content">
    <section className="stats">
      <Stat icon={<LayoutDashboard />} value={plots.length} label="Total Plots" />
      <Stat icon={<Leaf />} value={plots.filter(p => p.crop).length} label="Growing Crops" />
      <Stat icon={<Wheat />} value={plots.filter(p => p.ready).length} label="Ready to Harvest" />
      <Stat icon={<Bot />} value={automation ? "ON" : "OFF"} label="Farmer Automation" />
    </section>

    <div className="sectionHead">
      <div><h2>Your Plots</h2><p>Manage your rented land and crops.</p></div>
      <button className="primary"><Plus size={18} /> Rent New Plot</button>
    </div>

    <div className="plotGrid">
      {plots.map(plot => <PlotCard key={plot.id} plot={plot} rentPlot={rentPlot} plantCrop={plantCrop} action={action} harvest={harvest} />)}
    </div>

    {automation && <div className="automationBanner"><Bot size={24} /><div><b>Farmer automation is active</b><span>Your Farmer will perform authorized farming actions automatically.</span></div><CheckCircle2 size={22} /></div>}
  </div>
}

function Stat({ icon, value, label }) {
  return <div className="stat"><div className="statIcon">{icon}</div><div><strong>{value}</strong><span>{label}</span></div></div>
}

function PlotCard({ plot, rentPlot, plantCrop, action, harvest }) {
  const [cropChoice, setCropChoice] = useState("Tomato");
  const colors = { Tomato: "🍅", Carrot: "🥕", Corn: "🌽" };
  return <article className="plotCard">
    <div className="plotVisual">
      {plot.crop ? <div className="cropEmoji">{colors[plot.crop] || "🌱"}</div> : <div className="emptyPlot"><Plus size={30} /><span>Empty Plot</span></div>}
      <span className={`status ${plot.ready ? "ready" : plot.crop ? "growing" : "available"}`}>{plot.ready ? "Ready" : plot.crop ? "Growing" : plot.stage}</span>
    </div>
    <div className="plotBody">
      <div className="plotTitle"><h3>{plot.name}</h3><span>{plot.crop || "No crop"}</span></div>
      {plot.crop && <>
        <div className="progressRow"><span>{plot.stage}</span><b>{plot.progress}%</b></div>
        <div className="progress"><i style={{ width: `${plot.progress}%` }} /></div>
        <div className="detailRow"><span><Clock3 size={15} /> {plot.ready ? "Ready now" : `${Math.max(1, 10 - Math.floor(plot.progress / 10))} days left`}</span><span>{plot.water ? "💧 Watered" : "⚠ Needs water"}</span></div>
        <div className="actions">
          <button onClick={() => action(plot.id, "water")}><Droplets size={16} /> Water</button>
          <button onClick={() => action(plot.id, "fertilize")}><Leaf size={16} /> Fertilize</button>
          <button className="harvest" disabled={!plot.ready} onClick={() => harvest(plot.id)}><Wheat size={16} /> Harvest</button>
        </div>
      </>}
      {!plot.crop && plot.stage !== "Available" && <>
        <div className="plantRow"><select value={cropChoice} onChange={e => setCropChoice(e.target.value)}><option>Tomato</option><option>Carrot</option><option>Corn</option></select><button className="primary" onClick={() => plantCrop(plot.id, cropChoice)}><Sprout size={16} /> Plant</button></div>
      </>}
      {plot.stage === "Available" && <button className="primary full" onClick={() => rentPlot(plot.id)}><Tractor size={17} /> Rent this plot</button>}
    </div>
  </article>
}

function Inventory({ inventory }) {
  return <div className="content"><div className="pageIntro"><h2>Harvested Inventory</h2><p>Resources collected from your farm.</p></div><div className="inventoryGrid">{inventory.map(x => <div className="inventoryItem" key={x.item}><div className="itemIcon">📦</div><div><b>{x.item}</b><span>{x.quantity} units</span></div></div>)}</div></div>
}

function HistoryPage() {
  const rows = [["Today, 08:42", "Harvest", "Plot A-02", "Carrot", "Completed"], ["Today, 08:15", "Water", "Plot A-01", "Tomato", "Completed"], ["Yesterday", "Fertilize", "Plot B-01", "Corn", "Completed"], ["Sep 04", "Plant", "Plot A-01", "Tomato", "Completed"], ["Sep 03", "Rent", "Plot A-01", "—", "Completed"]];
  return <div className="content"><div className="pageIntro"><h2>Farming History</h2><p>A record of your previous farming actions.</p></div><div className="tableCard"><table><thead><tr><th>Time</th><th>Action</th><th>Plot</th><th>Crop</th><th>Status</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 4 ? <span className="success">{c}</span> : c}</td>)}</tr>)}</tbody></table></div></div>
}

function Farmer({ automation, setAutomation }) {
  return <div className="content"><div className="pageIntro"><h2>Manage Farmer</h2><p>Configure which actions your Farmer can perform automatically.</p></div>
    <div className="farmerCard"><div className="farmerHero"><div className="farmerAvatar"><Tractor size={40} /></div><div><h3>Farm Assistant</h3><p>Automation helper</p></div><label className="switch"><input type="checkbox" checked={automation} onChange={e => setAutomation(e.target.checked)} /><span /></label></div>
      <div className="permission"><div><b>Water crops</b><span>Allow Farmer to water crops when needed.</span></div><ShieldCheck size={20} /><span className="allowed">Allowed</span></div>
      <div className="permission"><div><b>Fertilize crops</b><span>Allow Farmer to fertilize crops according to schedule.</span></div><ShieldCheck size={20} /><span className="allowed">Allowed</span></div>
      <div className="permission"><div><b>Harvest mature crops</b><span>Allow Farmer to harvest when crops reach 100%.</span></div><ShieldCheck size={20} /><span className="allowed">Allowed</span></div>
    </div>
  </div>
}

function Notifications({ notifications }) {
  return <div className="content"><div className="pageIntro"><h2>Notifications</h2><p>Updates and reminders from your farm.</p></div><div className="notificationList">{notifications.map((n, i) => <div className="notification" key={i}><div className="notifIcon"><Bell size={18} /></div><div><b>{n}</b><span>{i === 0 ? "Just now" : `${i}h ago`}</span></div></div>)}</div></div>
}

createRoot(document.getElementById("root")).render(<App />);