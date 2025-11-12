import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const admins = [
  { username: "diego.valdes", email: "diego@example.com", role: "super_admin" },
  { username: "sandra.buitrago", email: "sandra@example.com", role: "admin" },
  { username: "aida.tamayo", email: "aida@example.com", role: "admin" },
];

const password = "Lashijasdemechis";

async function createAdmins() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "amigurumi_requests",
  });

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    for (const admin of admins) {
      try {
        await connection.execute(
          "INSERT INTO adminCredentials (username, passwordHash, email, role, isActive) VALUES (?, ?, ?, ?, ?)",
          [admin.username, passwordHash, admin.email, admin.role, true]
        );
        console.log(`✓ Admin creado: ${admin.username}`);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(`⚠ Admin ya existe: ${admin.username}`);
        } else {
          console.error(`✗ Error al crear ${admin.username}:`, error.message);
        }
      }
    }

    console.log("\n✓ Proceso completado");
  } finally {
    await connection.end();
  }
}

createAdmins().catch(console.error);
