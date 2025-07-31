import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const player = await prisma.player.create({
  data: {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password, 
   },

    });
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ error: "Player creation failed", details: err });
  }
});

router.get("/", async (req, res) => {
  const players = await prisma.player.findMany();
  res.json(players);
});

export default router;
