import request from "supertest"; // importando o supertest
import { prisma } from "@/database/prisma"; // importando o prisma para manipular o banco de dados durante os testes

import { app } from "@/app"; // importando o app para fazer as requisições




// 22.1 criando o supertest para o user-controller.test.ts
describe("UsersController", () => {
  let user_id: string;

  // 22.1.1 lógica para deletar o usuário criado durante os testes DEPOIS de todos os testes serem executados
  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id }});
  });
  
  // ! 22.1.1 Teste para criação de usuário
  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    // expectativas para o teste
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test User");

    user_id = response.body.id; // armazenando o id do usuário criado para testes futuros
  });

  // ! 22.1.2 Teste para criação de usuário com email duplicado
  it("should throw an error when creating a user with an existing email", async () => {
    const response = await request(app).post("/users").send({
      name: "Duplicate User",
      email: "testuser@example.com", // mesmo email do usuário criado anteriormente
      password: "password123",
    });

    // expectativas para o teste
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Este email já está em uso.");
  })

  // ! 22.1.3 Teste para criação de usuário com email inválido
  it('should throw a validation error if email is invalid', async () => {
    const response = await request(app).post('/users').send({
      name: 'Invalid Email User',
      email: 'invalid-email', // email inválido
      password: 'password123',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error por Zod");
  });

});