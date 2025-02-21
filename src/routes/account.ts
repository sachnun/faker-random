import { createRoute, z } from '@hono/zod-openapi'
import { faker } from '@faker-js/faker'
import { OpenAPIHono } from '@hono/zod-openapi'

const router = new OpenAPIHono()

router.openapi(
    createRoute({
        method: 'get',
        path: '/user.json',
        summary: 'Random user',
        tags: ['Generate Account'],
        responses: {
            200: {
                description: 'Success response',
                content: {
                    'application/json': {
                        schema: z.object({
                            name: z.object({
                                first: z.string().openapi({ description: 'First name', example: 'John' }),
                                last: z.string().openapi({ description: 'Last name', example: 'Doe' }),
                                fullname: z.string().openapi({ description: 'Full name', example: 'John Doe' }),
                            }),
                            email: z.string().openapi({ description: 'Email address', example: 'john.doe@example.com' }),
                            password: z.string().openapi({ description: 'Password', example: 'qwerty1234' }),
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
        summary: 'Random password',
        tags: ['Generate Account'],
        parameters: [
            {
                name: 'n',
                in: 'query',
                schema: { type: 'number', default: 12 },
                example: 12,
                description: 'Password length',
                required: false
            }
        ],
        responses: {
            200: {
                description: 'Success response',
                content: {
                    'text/plain': {
                        schema: z.string().openapi({
                            description: 'Password',
                            example: 'a1b2c3d4e5f6'
                        })
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
