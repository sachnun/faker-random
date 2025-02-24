import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'

import random from './routes/random'
import account from './routes/account'

const app = new OpenAPIHono()

app.use(cors())

const description = `
This is **api** service based on [Faker.js](https://fakerjs.dev/guide/) library.\n
**100% free**, without any limits.
`.trim()

app.doc('/openapi.json', {
  openapi: '3.0.3',
  info: {
    version: '0.0.2',
    title: 'Faker Random',
    description: description
  },
  tags: [
    {
      name: 'Generate Random',
      description: 'make random data'
    },
    {
      name: 'Generate Account',
      description: 'make random account'
    }
  ],
})

app.get(
  '/',
  apiReference({
    pageTitle: 'Faker Random',
    spec: {
      url: '/openapi.json',
    },
    hideDownloadButton: true,
    hideClientButton: true,
  }),
)

app.route('/random', random)
app.route('/random/account', account)

app.notFound((c) => {
  return c.text('', 404)
})

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.text('', err.status)
  }
  return c.text('', 500)
})

export default app
