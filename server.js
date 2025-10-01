import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

// Servidor iniciado
app.listen(PORT, () => {
  console.log(`Iniciado na porta: ${PORT}`);
});

// Buscar dados de usuário por ID
app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
  res.status(200).json(user);
});

// Buscar todos os usuários
app.get("/usuarios", async (req, res) => {
  const { name } = req.query;
  if (name) {
    const user = await prisma.user.findFirst({
      where: {
        name: name,
      },
    });

    res.status(200).json(user);
  } else {
    const allUsers = await prisma.user.findMany();
    res.status(200).json(allUsers);
  }
});

// Adicionar um usuário
app.post("/usuarios", async (req, res) => {
  const { name, email, age } = req.body;

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      age: age,
    },
  });

  res.status(201).json({
    mensage: "Usuário criado com sucesso!",
    newUser,
  });
});

// Editar um usuário via ID
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  const userUpdate = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      email: email,
      age: age,
    },
  });

  res.status(200).json({
    mensage: "Usuario atualizado com sucesso!",
    userUpdate,
  });
});

// Deletar um usuário via ID
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  const userDelete = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  res.status(200).json({
    mensage: "Usuário deletado com sucesso!",
    userDelete,
  });
});

// Deletar todos os usuários
app.delete("/usuarios", async (req, res) => {

  await prisma.user.deleteMany();
 
  res.status(200).json({
    mensage: "Todos os usuário foram deletados com sucesso!",
  });
});
