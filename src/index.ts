import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { swaggerUI } from '@hono/swagger-ui'
import { getConnInfo } from 'hono/cloudflare-workers'
import postgres from "postgres";

import randomRoutes from './routes/random'
import accountRoutes from './routes/account'

const app = new OpenAPIHono<{
  Bindings: {
    DATABASE_URL: string
  }
}>()

const description = `
This is a random data generator API. It uses the \`faker-js\` library to generate random data.
`

app.use('*', async (c, next) => {
  const info = getConnInfo(c)
  const sql = postgres(c.env.DATABASE_URL);

  if (info.remote.address) {
    c.executionCtx.waitUntil(
      sql`INSERT INTO visitors (ip) VALUES (${info.remote.address})`
        .then(() => {
          console.log('inserted')
        })
    );
  }
  return next()
})

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'Faker Random',
    description: description
  },
  tags: [
    {
      name: 'random',
      description: 'Random generator'
    },
    {
      name: 'account',
      description: 'Account generator'
    }
  ],
})

app.get('/', swaggerUI({ url: '/openapi.json' }))

app.route('/random', randomRoutes)
app.route('/random', accountRoutes)

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
