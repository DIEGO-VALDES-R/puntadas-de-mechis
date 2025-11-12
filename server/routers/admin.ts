import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getAdminByUsername, createAdminCredential } from "../db";
import { hashPassword, verifyPassword, generateToken } from "../auth";

export const adminRouter = router({
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const admin = await getAdminByUsername(input.username);
        
        if (!admin) {
          throw new Error("Usuario o contraseña incorrectos");
        }

        const isPasswordValid = await verifyPassword(input.password, admin.passwordHash);
        
        if (!isPasswordValid) {
          throw new Error("Usuario o contraseña incorrectos");
        }

        if (!admin.isActive) {
          throw new Error("Esta cuenta ha sido desactivada");
        }

        const token = generateToken(admin.id, admin.role);
        
        return {
          success: true,
          token,
          role: admin.role,
          username: admin.username,
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error al iniciar sesión");
      }
    }),

  createAdmin: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        email: z.string().email().optional(),
        role: z.enum(["super_admin", "admin", "accountant"]).default("admin"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if admin already exists
        const existing = await getAdminByUsername(input.username);
        if (existing) {
          throw new Error("Este usuario ya existe");
        }

        const passwordHash = await hashPassword(input.password);

        await createAdminCredential({
          username: input.username,
          passwordHash,
          email: input.email,
          role: input.role,
          isActive: true,
        });

        return { success: true, message: "Admin creado exitosamente" };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error al crear admin");
      }
    }),
});
