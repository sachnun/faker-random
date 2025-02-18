import { createRoute, z } from '@hono/zod-openapi'
import { faker } from '@faker-js/faker'
import { OpenAPIHono } from '@hono/zod-openapi'

const router = new OpenAPIHono().basePath('/account')

router.openapi(
    createRoute({
        method: 'get',
        path: '/user.json',
        tags: ['account'],
        responses: {
            200: {
                description: 'Respond a random user',
                content: {
                    'application/json': {
                        schema: z.object({
                            name: z.object({
                                first: z.string(),
                                last: z.string(),
                                fullname: z.string(),
                            }),
                            email: z.string(),
                            password: z.string(),
                        })
                    }
                }
            }
        }
    }),
    (c) => {
        const firstName = faker.person.firstName('male')
        const lastName = faker.person.lastName('male')
        return c.json({
            name: {
                first: firstName,
                last: lastName,
                fullname: faker.person.fullName({ firstName, lastName })
            },
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            password: faker.internet.password({ length: 16 })
        })
    }
)

router.openapi(
    createRoute({
        method: 'get',
        path: '/password.txt',
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

export default router
