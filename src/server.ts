import fastify from "fastify"
import cors from "@fastify/cors"
import { questsRoutes } from "./routes/quests"

export const server = fastify()

server.register(questsRoutes)
server.register(require('@fastify/cors'), {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

server.listen({
    port: 4130
}).then(() => {
    console.log("Server is running on http://localhost:4130")
})
