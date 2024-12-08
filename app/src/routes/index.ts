import { Router, json } from "express";
import userRouter from "./user";
import { PrismaClient } from "@prisma/client";

const router = Router();
router.use(json());

// Conexões do Prisma
const primaryDb = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://user_pg:password_pg@localhost:5432/database_pg?schema=public",
    },
  },
});

const secondaryDb = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://user_pg_secondary:password_pg_secondary@localhost:5433/database_pg_secondary?schema=public",
    },
  },
});

const tertiaryDb = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://user_pg_tertiary:password_pg_tertiary@localhost:5434/database_pg_tertiary?schema=public",
    },
  },
});

// Rotas para diferentes conexões
router.get("/", (req, res) => {
  res.send("Olá mundo cruel!");
});
router.use("/user/primary", userRouter(primaryDb));
router.use("/user/secondary", userRouter(secondaryDb));
router.use("/user/tertiary", userRouter(tertiaryDb));

export default router;
