import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getAllGalleryItems,
  createGalleryCategory,
  getAllGalleryCategories,
  updateGalleryCategory,
  createPromotion,
  getAllPromotions,
  getActivePromotions,
  updatePromotion,
  deletePromotion,
  getHighlightedGalleryItems,
  getGalleryItemsByCategory,
  updateGalleryItem,
  createGalleryItem,
  deleteGalleryItem,
} from "../db";
import { storagePut } from "../storage";

export const galleryRouter = router({
  // Get all gallery items
  getAll: publicProcedure.query(async () => {
    return await getAllGalleryItems();
  }),

  // Get highlighted items
  getHighlighted: publicProcedure.query(async () => {
    return await getHighlightedGalleryItems();
  }),

  // Get items by category
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return await getGalleryItemsByCategory(input.category);
    }),

  // Get all categories
  getCategories: publicProcedure.query(async () => {
    return await getAllGalleryCategories();
  }),

  // Create category (admin only)
  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("No autorizado");
      }

      return await createGalleryCategory({
        name: input.name,
        description: input.description,
        icon: input.icon,
        order: input.order || 0,
        isActive: true,
      });
    }),

  // Update category (admin only)
  updateCategory: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("No autorizado");
      }

      await updateGalleryCategory(input.id, {
        name: input.name,
        description: input.description,
        icon: input.icon,
        order: input.order,
      });

      return { success: true };
    }),

  // Get all promotions (admin only)
  getPromotions: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("No autorizado");
    }

    return await getAllPromotions();
  }),

  // Get active promotions (public)
  getActivePromotions: publicProcedure.query(async () => {
    return await getActivePromotions();
  }),

  // Create promotion (admin only)
  createPromotion: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        discountPercentage: z.number().min(0).max(100),
        galleryItemId: z.number().optional(),
        validFrom: z.date().optional(),
        validUntil: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("No autorizado");
      }

      return await createPromotion({
        name: input.name,
        description: input.description,
        discountPercentage: input.discountPercentage,
        galleryItemId: input.galleryItemId,
        validFrom: input.validFrom,
        validUntil: input.validUntil,
        isActive: true,
      });
    }),

  // Update promotion (admin only)
  updatePromotion: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        discountPercentage: z.number().min(0).max(100).optional(),
        galleryItemId: z.number().optional(),
        validFrom: z.date().optional(),
        validUntil: z.date().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("No autorizado");
      }

      await updatePromotion(input.id, {
        name: input.name,
        description: input.description,
        discountPercentage: input.discountPercentage,
        galleryItemId: input.galleryItemId,
        validFrom: input.validFrom,
        validUntil: input.validUntil,
        isActive: input.isActive,
      });

      return { success: true };
    }),

  // Delete promotion (admin only)
  deletePromotion: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("No autorizado");
      }

      await deletePromotion(input.id);
      return { success: true };
    }),

  // Create gallery item (admin only)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().url(),
        price: z.number().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("No autorizado");
      }
      await createGalleryItem({
        title: input.title,
        description: input.description,
        imageUrl: input.imageUrl,
        price: input.price,
        category: input.category,
      });
      return { success: true };
    }),

  // Delete gallery item (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("No autorizado");
      }
      await deleteGalleryItem(input.id);
      return { success: true };
    }),

  // Upload image to S3 (admin only)
  uploadImage: protectedProcedure
    .input(
      z.object({
        imageBase64: z.string(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("No autorizado");
      }

      try {
        const buffer = Buffer.from(input.imageBase64.split(",")[1], "base64");
        const { url } = await storagePut(
          `gallery/${input.fileName}-${Date.now()}`,
          buffer,
          "image/png"
        );
        return { imageUrl: url, success: true };
      } catch (error) {
        console.error("Image upload error:", error);
        throw new Error("Error al cargar la imagen");
      }
    }),

  // Update gallery item (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        imageUrl: z.string().optional(),
        category: z.string().optional(),
        isHighlighted: z.boolean().optional(),
        highlightOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("No autorizado");
      }

      await updateGalleryItem(input.id, {
        title: input.title,
        description: input.description,
        price: input.price,
        imageUrl: input.imageUrl,
        category: input.category,
        isHighlighted: input.isHighlighted,
        highlightOrder: input.highlightOrder,
      });

      return { success: true };
    })
});
