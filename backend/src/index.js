import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
app.get('/api/health', (c) => c.json({ ok: true, service: 'plot-farm-api' }))
app.get('/api/plots', (c) => c.json({ plots: [] }))

const port = Number(process.env.API_PORT || 4000)
const host = process.env.API_HOST || '127.0.0.1'

console.log(`Plot Farm API running at http://${host}:${port}`)
serve({ fetch: app.fetch, port, hostname: host })
