import { HTTPException } from 'hono/http-exception'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono()

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'Faker Random',
  },
})

app.get('/', swaggerUI({ url: '/openapi.json' }))

app.get('/random.json', (c) => {
  return c.json({ random: Math.random() })
})

app.notFound((c) => {
  return c.text('', 404)
})

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  return c.text('', 500)
})

export default app
