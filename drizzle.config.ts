import { defineConfig } from "drizzle-kit";

// Obtener la URL de conexión de la base de datos desde las variables de entorno
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // ← CAMBIADO: de "mysql" a "postgresql" para Neon
  dbCredentials: {
    url: connectionString,
  },
});
