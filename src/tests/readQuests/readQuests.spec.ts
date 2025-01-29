import request from 'supertest';
import { server } from "../../server"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from 'fastify';

describe("Testes de consulta", () => {

    let app: FastifyInstance

    beforeAll(async () => {
        app = server
        await app.ready()
    })

    afterAll(async () => {
        app = server
        await server.close()
    })

    test("retorna objeto lista com objetos questões", async () => {

        jest.spyOn(prisma.quest, "findMany").mockResolvedValue([
            {
                id: "550e8400-e29b-41d4-a716-446655440000",
                title: "Coragem do fraco",
                description: "Você tem a determinação para sobreviver em grandes perigos, complete missões para ficar mais forte",
                completed: false,
                createdAt: new Date("2024-11-16T10:00:00.000Z"),
                updatedAt: new Date("2024-11-16T10:00:00.000Z"),
              },
              {
                id: "660e8400-e29b-41d4-a716-446655440001",
                title: "Fortalecimento fisico",
                description: "faça 100 flexões, 100 abdominais, 100 agachamentos e corra 10km",
                completed: false,
                createdAt: new Date("2025-01-03T12:30:00.000Z"),
                updatedAt: new Date("2025-01-03T12:30:00.000Z"),
              }
        ]);

        const res = await request(app.server).get("/quests")

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)

    })
    test("retorna objeto unico questão", async () => {

        jest.spyOn(prisma.quest, "findUniqueOrThrow").mockResolvedValue({
            id: "550e8400-e29b-41d4-a716-446655440000",
            title: "Coragem do fraco",
            description: "Você tem a determinação para sobreviver em grandes perigos, complete missões para ficar mais forte",
            completed: false,
            createdAt: new Date("2024-11-16T10:00:00.000Z"),
            updatedAt: new Date("2024-11-16T10:00:00.000Z"),
          });

        const res = await request(app.server).get("/quests/550e8400-e29b-41d4-a716-446655440000")

        expect(res.status).toBe(200)
        expect( typeof res.body).toBe("object")

    })
    test("retorna erro na requisição ao buscar objeto unico questão inexistente", async () => {

        jest.spyOn(prisma.quest, "findUniqueOrThrow").mockRejectedValue(new Error ("Erro na requisição, a missão não existe"));

        const res = await request(app.server).get("/quests/550e8400-e29b-41d4-a716-446655440000")

        expect(res.status).toBe(500)

    })

})