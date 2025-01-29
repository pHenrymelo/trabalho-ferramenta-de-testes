import request from 'supertest';
import { server } from "../../server"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from 'fastify';

describe("Testes de Deleção", () => {

    let app: FastifyInstance

    beforeAll(async () => {
        app = server
        await app.ready()
    })

    afterAll(async () => {
        app = server
        await server.close()
    })

    test("deletar missão com sucesso", async () => {

        jest.spyOn(prisma.quest, "delete").mockResolvedValue({
            id: "550e8400-e29b-41d4-a716-446655440000",
            title: "Coragem do fraco",
            description: "Você tem a determinação para sobreviver em grandes perigos, complete missões para ficar mais forte",
            completed: false,
            createdAt: new Date("2024-11-16T10:00:00.000Z"),
            updatedAt: new Date("2024-11-16T10:00:00.000Z"),
          })

        const res = await request(app.server).delete("/quests/550e8400-e29b-41d4-a716-446655440000")

        expect(res.status).toBe(200)
        expect(res.text).toBe("missão deletada")

    })
    test("retorna erro na requisição ao deletar missão que não existe", async () => {

        jest.spyOn(prisma.quest, "delete").mockRejectedValue(new Error("Erro na requisição, a missão não existe"))

        const res = await request(app.server).delete("/quests/550e8400-e29b-41d4-a716-446655440000")

        expect(res.status).toBe(500)
    })

})