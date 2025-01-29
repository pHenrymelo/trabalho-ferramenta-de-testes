import type { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from 'zod'
import { error } from "console"

export async function questsRoutes(server: FastifyInstance) {

    // listar todas as quests
    server.get("/quests", async () => {
    
        const quests = await prisma.quest.findMany({
            orderBy: {
                createdAt: "asc"
            },
        })
        console.log(quests)
        return quests
    
    })

    // visualizar uma quest especifica
    server.get("/quests/:id", async (req) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(req.params)

        const quest = await prisma.quest.findUniqueOrThrow({
            where: {
                id,
            },
        })
        console.log(quest)
        return quest
    })

    // criar uma quest
    server.post("/quests", async (req) => {

        const bodySchema = z.object({
            title: z.string({"message": "O titulo deve ser um texto"})
            .nonempty("O titulo da missão não pode ser vazio")
            .max(30, "O titulo é grande demais, deve ter no maximo 30 caracteres"),
            description: z.string({"message": "A descrição deve ser um texto"})
            .min(20, "A descrição fornecida é muito curta, preencha com pelo menos 20 caracteres")
            .max(300, "A descrição é grande demais, deve ter no maximo 300 caracteres"),
        }).strict("Um valor inesperado foi delcarado, não foi possivel criar a missão")
        try {
            const { title, description} = bodySchema.parse(req.body)
    
            const newQuest = prisma.quest.create({
                data: {
                    title,
                    description,
                }
            })
            console.log(`A missão "${(await newQuest).title}" foi criada com sucesso`)
            return `A missão "${(await newQuest).title}" foi criada com sucesso`
        } catch (err) {
            if (err instanceof z.ZodError) {
                console.error(err.errors)
                return {
                    error: err.errors
                }
            }
            console.error("Aconteceu um erro inesperado:", err);
            throw err;
        }
    })

    server.put("/quests/:id", async (req) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const bodySchema = z.object({
            title: z.string(),
            description: z.string(),
            completed: z.coerce.boolean().default(false),
        })

        const { id } = paramsSchema.parse(req.params)
        const { title, description, completed } = bodySchema.parse(req.body)

        const quest = await prisma.quest.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                completed,
            }
        })
        console.log(`a missão ${quest.title} foi atualizada`)
        return `A missão "${await quest.title}" foi atualizada`
    })

    // deletar uma quest
    server.delete("/quests/:id", async (req) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(req.params)

        const quest = await prisma.quest.delete({
            where: {
                id,
            }
        })
        console.log(`a missão ${quest.title} foi deletada`)
        return "missão deletada"
    })
}
