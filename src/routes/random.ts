import { createRoute, z } from '@hono/zod-openapi'
import { faker } from '@faker-js/faker'
import { OpenAPIHono } from '@hono/zod-openapi'

const router = new OpenAPIHono()

router.openapi(
    createRoute({
        method: 'get',
        path: '/version.json',
        summary: 'Random version',
        tags: ['Generate Random'],
        responses: {
            200: {
                description: 'Success response',
                content: {
                    'application/json': {
                        schema: z.object({
                            version: z.object({
                                major: z.number().openapi({
                                    description: 'Major version',
                                    example: 30
                                }),
                                minor: z.number().openapi({
                                    description: 'Minor version',
                                    example: 21
                                }),
                                patch: z.number().openapi({
                                    description: 'Patch version',
                                    example: 3.34281234
                                })
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
        summary: 'Random IP address',
        tags: ['Generate Random'],
        responses: {
            200: {
                description: 'Success response',
                content: {
                    'application/json': {
                        schema: z.object({
                            ipv4: z.string().openapi({
                                description: 'IPv4 address',
                                example: '192.168.1.1'
                            }),
                            ipv6: z.string().openapi({
                                description: 'IPv6 address',
                                example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
                            })
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
