import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 3000;

// Conexões com as instâncias
const databases = {
  primary: new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://user_pg:password_pg@localhost:5432/database_pg?schema=public",
      },
    },
  }),
  secondary: new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://user_pg_secondary:password_pg_secondary@localhost:5433/database_pg_secondary?schema=public",
      },
    },
  }),
  tertiary: new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://user_pg_tertiary:password_pg_tertiary@localhost:5434/database_pg_tertiary?schema=public",
      },
    },
  }),
};

// Função para verificar as conexões
const checkConnections = async () => {
  try {
    await databases.primary.$connect();
    console.log("Conexão com a instância primária bem-sucedida!");

    await databases.secondary.$connect();
    console.log("Conexão com a instância secundária bem-sucedida!");

    await databases.tertiary.$connect();
    console.log("Conexão com a instância terciária bem-sucedida!");
  } catch (error) {
    console.error("Erro ao conectar às instâncias:", error);
  } finally {
    // Opcionalmente desconectar após o teste
    await Promise.all([
      databases.primary.$disconnect(),
      databases.secondary.$disconnect(),
      databases.tertiary.$disconnect(),
    ]);
  }
};

// Executar verificação de conexões
checkConnections();

// Inicializar o servidor
app.listen(PORT, () => console.log(`⚡ Server is running on port: ${PORT}`));
