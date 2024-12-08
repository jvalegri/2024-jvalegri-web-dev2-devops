import { RequestHandler, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z, ZodSchema } from "zod";

// Função para criar o roteador com uma instância específica do Prisma
const createUserRouter = (prisma: PrismaClient) => {
  const router = Router();

  const postInputDataFilter = z.object({
    name: z.string(),
    email: z.string({ message: "o campo email precisa ser do tipo string" }),
  });

  const putInputDataFilter = z.object({
    name: z.optional(z.string()),
    email: z.optional(z.string({ message: "o campo email precisa ser do tipo string" })),
  });

  const middleZodTestSchema = (zodSchema: ZodSchema): RequestHandler => {
    return (req, res, next) => {
      const testResult = zodSchema.safeParse(req.body);
      if (!testResult.success) {
        res.status(422).json(testResult);
        return;
      }
      next();
    };
  };

  router.get("/", async (req, res) => {
    const data = await prisma.user.findMany();
    res.json(data);
  });

  router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const data = await prisma.user.findFirst({ where: { id } });
    res.json(data);
  });

  router.post("/", middleZodTestSchema(postInputDataFilter), async (req, res) => {
    const { name, email } = req.body;
    const data = await prisma.user.create({ data: { name, email } });
    res.json(data);
  });

  router.put("/:id", middleZodTestSchema(putInputDataFilter), async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const data = await prisma.user.update({ data: { name, email }, where: { id } });
    res.json(data);
  });

  router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const data = await prisma.user.delete({ where: { id } });
    res.json(data);
  });

  return router;
};

export default createUserRouter;
