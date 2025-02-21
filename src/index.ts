import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { apiReference } from '@scalar/hono-api-reference'

import randomRoutes from './routes/random'
import accountRoutes from './routes/account'

const app = new OpenAPIHono<{
  Bindings: {
    DATABASE_URL: string
  }
}>()

const description = `
This is **api** service based on [Faker.js](https://fakerjs.dev/guide/) library.\n
**100% free**, without any limits.
`

// app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
//   type: 'http',
//   scheme: 'bearer',
// })

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
  // security: [{ Bearer: [] }]
})

app.get(
  '/',
  apiReference({
    spec: {
      url: '/openapi.json',
    },
    hideDownloadButton: true,
    hideClientButton: true,
  }),
)

app.route('/random', randomRoutes)
app.route('/random/account/', accountRoutes)

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
