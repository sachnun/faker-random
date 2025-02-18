import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { swaggerUI } from '@hono/swagger-ui'

import { faker } from '@faker-js/faker';

const app = new OpenAPIHono()

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'Faker Random',
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

app.openapi(
  createRoute({
    method: 'get',
    path: '/random/version.json',
    tags: ['random'],
    responses: {
      200: {
        description: 'Respond a random number',
        content: {
          'application/json': {
            schema: z.object({
              version: z.object({
                major: z.number(),
                minor: z.number(),
                patch: z.number(),
              }),
            })
          }
        }
      }
    }
  }),
  (c) => {
    return c.json({
      version: {
        major: Math.random(),
        minor: Math.random(),
        patch: Math.random(),
      }
    })
  }
)

app.openapi(
  createRoute({
    method: 'get',
    path: '/random/user.json',
    tags: ['account'],
    responses: {
      200: {
        description: 'Respond a random user',
        content: {
          'application/json': {
            schema: z.object({
              user: z.object({
                name: z.string(),
                email: z.string(),
                password: z.string(),
              }),
            })
          }
        }
      }
    }
  }),
  (c) => {
    return c.json({
      user: {
        name: faker.person.fullName({ sex: 'male' }),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
  }
)



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
