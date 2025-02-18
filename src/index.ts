import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Random Faker!')
})

// route /random
app.get('/random', (c) => {
  return c.json({ random: Math.random() })
})

app.notFound((c) => {
  // 404 without body
  return c.text('', 404)
})

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse()
  }
  // 500 without body
  return c.text('', 500)
})

export default app
