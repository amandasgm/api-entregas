import request from "supertest"; // importando o supertest
import { prisma } from "@/database/prisma"; // importando o prisma para manipular o banco de dados durante os testes

import { app } from "@/app"; // importando o app para fazer as requisições

// 22.2 criando o supertest para o sessions-controller.test.ts
describe("SessionControllers", () => {
  let user_id: string;

  // 22.2.1 ANTES de todos os testes: cria um usuário para testar a sessão
  beforeAll(async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Auth Test User",
      email: "authtestuser@example.com",
      password: "password123",
    });

    user_id = userResponse.body.id;
  });

  // 22.2.2 depois de todos os testes, deleta o usuário criado para testar a sessão
  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id }});
  });

  // 22.2.3 Teste para criação de sessão
  it("should create a new session successfully", async () => {
    const sessionResponse = await request(app).post("/sessions").send({
      email: "authtestuser@example.com",
      password: "password123",
    });

    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.token).toEqual(expect.any(String));
  });
})