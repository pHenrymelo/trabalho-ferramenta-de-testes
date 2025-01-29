import request from 'supertest';
import { server } from "../../server"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from 'fastify';

describe("Testes de Edição", () => {

    let app: FastifyInstance

    beforeAll(async () => {
        app = server
        await app.ready()
    })

    afterAll(async () => {
        app = server
        await server.close()
    })

    test("atualizar missão com sucesso", async () => {

        jest.spyOn((prisma.quest), "update").mockResolvedValue({
            id: "550e8400-e29b-41d4-a716-446655440000",
            title: "Titulo editado",
            description: "Descrição da missão de classes validas editada",
            completed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          const res = await request(app.server).put("/quests/550e8400-e29b-41d4-a716-446655440000").send({
            title: "Titulo editado",
            description: "Descrição da missão de classes validas editada",
            completed: true
          })

          expect(res.status).toBe(200)
          expect(res.text).toBe('A missão "Titulo editado" foi atualizada')
    })
    test("atualizar missão que não existe no sistema", async () => {

        jest.spyOn((prisma.quest), "update").mockRejectedValue(new Error ("Erro na requisição, a missão não existe"))

          const res = await request(app.server).put("/quests/550e8400-e29b-41d4-a716-446655440000").send({
            title: "Titulo editado",
            description: "Descrição da missão de classes validas editada",
            completed: true
          })

          expect(res.status).toBe(500)

    })

    test("atualizar missão com titulo vazio", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("O titulo da missão não pode ser vazio"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "",
            description: "Descrição da missão de classes invalidas"
          })
        
          expect(res.body).toEqual({
            error: [{
                code: "too_small",
                exact: false,
                inclusive: true,
                message: "O titulo da missão não pode ser vazio",
                minimum: 1,
                path: ["title"],
                "type": "string"
              }],
          })
    })

    test("atualizar missão com titulo grande demais", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("O titulo é grande demais, deve ter no maximo 30 caracteres"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "titulo extremamente grande para testar as classes de equivalencia invalidas",
            description: "Descrição da missão de classes invalidas"
          })
        
          expect(res.body).toEqual({
            error: [{
                code: "too_big",
                exact: false,
                inclusive: true,
                message: "O titulo é grande demais, deve ter no maximo 30 caracteres",
                maximum: 30,
                path: ["title"],
                "type": "string"
              }],
          })
    })
    
    test("atualizar missão com titulo diferente de texto", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("O titulo deve ser um texto"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: true,
            description: "Descrição da missão de classes invalidas"
          })
        
          expect(res.body).toEqual({
            error: [{
                code: "invalid_type",
                message: "O titulo deve ser um texto",
                expected: "string",
                path: ["title"],
                "received": "boolean"
              }],
          })
    })

    test("atualizar missão com descrição curta demais", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("A descrição fornecida é muito curta, preencha com pelo menos 20 caracteres"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "classe invalida",
            description: "texto pequeno"
          })
        
          expect(res.body).toEqual({
            error: [{
                code: "too_small",
                exact: false,
                inclusive: true,
                message: "A descrição fornecida é muito curta, preencha com pelo menos 20 caracteres",
                minimum: 20,
                path: ["description"],
                "type": "string"
              }],
          })
    })

    test("atualizar missão com descrição vazia", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("A descrição fornecida é muito curta, preencha com pelo menos 20 caracteres"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "classe invalida",
            description: ""
          })
        
          expect(res.body).toEqual({
            error: [{
                code: "too_small",
                exact: false,
                inclusive: true,
                message: "A descrição fornecida é muito curta, preencha com pelo menos 20 caracteres",
                minimum: 20,
                path: ["description"],
                "type": "string"
              }],
          })
    })

    test("atualizar missão com descrição grande demais", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("A descrição é grande demais, deve ter no maximo 300 caracteres"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "organizar documentos",
            description: "A tarefa consiste em revisar, organizar e categorizar todos os documentos e arquivos digitais de um determinado projeto ou setor. Primeiro, é necessário analisar os arquivos existentes, remover duplicatas e realocar aqueles que estejam em pastas incorretas. Em seguida, deve-se criar uma estrutura de diretórios clara e lógica, garantindo que os arquivos estejam nomeados de forma padronizada para facilitar buscas futuras. Além disso, recomenda-se a realização de backups em nuvem e em um armazenamento local seguro para evitar perdas de dados. Por fim, documente todo o processo e registre diretrizes para a manutenção contínua da organização dos arquivos."
          })
        
          expect(res.body).toEqual({
            error: [{
                code: "too_big",
                exact: false,
                inclusive: true,
                message: "A descrição é grande demais, deve ter no maximo 300 caracteres",
                maximum: 300,
                path: ["description"],
                "type": "string"
              }],
          })
    })

    test("atualizar missão com descrição diferente de texto", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("A descrição deve ser um texto"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "classe invalida",
            description: true
          })
        
          expect(res.body).toEqual({
            error: [{
                code: "invalid_type",
                message: "A descrição deve ser um texto",
                expected: "string",
                path: ["description"],
                "received": "boolean"
              }],
          })
    })

    test("atualizar missão com completude não booleano", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("Um valor inesperado foi delcarado, não foi possivel atualizar a missão"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "classe invalida",
            description: "Descrição da missão de classes invalidas",
            completed: "não completo"
          })
        
          expect(res.body).toEqual({
            error: [{
               "code": "unrecognized_keys",
                "keys": [
                    "completed"
                ],
                "path": [],
                "message": "Um valor inesperado foi delcarado, não foi possivel atualizar a missão"
              }],
          })
    })


    test("atualizar missão com createdAt diferente de uma data", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("Um valor inesperado foi delcarado, não foi possivel atualizar a missão"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "classe invalida",
            description: "Descrição da missão de classes invalidas",
            createdAt: "agora"
          })
        
          expect(res.body).toEqual({
            error: [{
               "code": "unrecognized_keys",
                "keys": [
                    "createdAt"
                ],
                "path": [],
                "message": "Um valor inesperado foi delcarado, não foi possivel atualizar a missão"
              }],
          })
    })

    test("atualizar missão com updatedAt diferente de uma data", async () => {

        jest.spyOn(prisma.quest, "update").mockRejectedValue(new Error("Um valor inesperado foi delcarado, não foi possivel atualizar a missão"))

        const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "classe invalida",
            description: "Descrição da missão de classes invalidas",
            updatedAt: "agora"
          })
        
          expect(res.body).toEqual({
            error: [{
               "code": "unrecognized_keys",
                "keys": [
                    "updatedAt"
                ],
                "path": [],
                "message": "Um valor inesperado foi delcarado, não foi possivel atualizar a missão"
              }],
          })
    })

    test("atualzar missão para titulo repetido", async () => {

        jest.spyOn((prisma.quest), "update").mockRejectedValue({
          code: "P2002",
          message: "Unique constraint failed on the fields: (`title`)"
      })

          const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
            title: "Titulo teste",
            description: "Descrição da missão de classes validas"
          })

            expect(res.status).toBe(500)
            expect(res.body.code).toBe("P2002")
            expect(res.body.message).toBe( "Unique constraint failed on the fields: (`title`)")
    })

    test("editar missão com titulo e descrição vazios", async () => {

            const res = await request(app.server).put("/quests/fb6a55bd-2080-4c75-9a96-9ff898c4e891").send({
                title: "",
                description: ""
              })
            
              expect(res.body).toEqual({
                error: [{
                    code: "too_small",
                    exact: false,
                    inclusive: true,
                    message: "O titulo da missão não pode ser vazio",
                    minimum: 1,
                    path: ["title"],
                    "type": "string"
                  },
                  {
                    code: "too_small",
                    exact: false,
                    inclusive: true,
                    message: "A descrição fornecida é muito curta, preencha com pelo menos 20 caracteres",
                    minimum: 20,
                    path: ["description"],
                    "type": "string"
                  }
                ],
              })
        })

})