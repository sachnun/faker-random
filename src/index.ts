import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// /random
app.get('/random', (c) => {
  return c.json({ random: Math.random() })
})

export default app
