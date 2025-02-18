import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { swaggerUI } from '@hono/swagger-ui'

import { faker } from '@faker-js/faker';

const app = new OpenAPIHono()

const description = `
This is a random data generator API. It uses the \`faker-js\` library to generate random data.
`

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
        major: faker.number.int({ min: 0, max: 100 }),
        minor: faker.number.int({ min: 0, max: 100 }),
        patch: faker.number.float({ min: 1, max: 10 })
      }
    })
  }
)

app.openapi(
  createRoute({
    method: 'get',
    path: '/random/ip.json',
    tags: ['random'],
    responses: {
      200: {
        description: 'Respond a random IP address',
        content: {
          'application/json': {
            schema: z.object({
              ipv4: z.string(),
              ipv6: z.string(),
            })
          }
        }
      }
    }
  }),
  (c) => {
    return c.json({
      ipv4: faker.internet.ipv4(),
      ipv6: faker.internet.ipv6()
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

// password only
app.openapi(
  createRoute({
    method: 'get',
    path: '/random/password.txt',
    tags: ['account'],
    parameters: [
      {
        name: 'n',
        in: 'query',
        schema: { type: 'number' },
        example: 12,
        description: 'Password length',
        required: false
      }
    ],
    responses: {
      200: {
        description: 'Respond a random password',
        content: {
          'text/plain': {
            schema: z.string()
          }
        }
      }
    }
  }),
  (c) => {
    const length = Number(c.req.query('n')) || 12
    return c.text(faker.internet.password({ length }))
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
