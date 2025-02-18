import { createRoute, z } from '@hono/zod-openapi'
import { faker } from '@faker-js/faker'
import { OpenAPIHono } from '@hono/zod-openapi'

const router = new OpenAPIHono()

router.openapi(
    createRoute({
        method: 'get',
        path: '/version.json',
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

router.openapi(
    createRoute({
        method: 'get',
        path: '/ip.json',
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

export default router
