import { COOKIE_NAME } from "@shared/const";
import QRCode from "qrcode";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createCustomer,
  getCustomerByEmail,
  getCustomerById,
  createAmigurumiRequest,
  getAmigurumiRequestById,
  getAmigurumiRequestsByCustomerId,
  getAllAmigurumiRequests,
  updateAmigurumiRequest,
  createPayment,
  getPaymentByBoldTransactionId,
  updatePayment,
  createCommunication,
  getCommunicationsByRequestId,
  createGalleryItem,
  getAllGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
  createQRCodeTracking,
  getQRCodeTrackingByRequestId,
  updateQRCodeTracking,
  createCompletionNotification,
  getCompletionNotificationsByRequestId,
} from "./db";
import { notifyNewRequest, notifyPaymentReceived } from "./notifications";
import { mapBoldStatusToInternal } from "./bold";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Customer registration
  customer: router({
    register: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(7),
        })
      )
      .mutation(async ({ input }) => {
        // Check if customer already exists
        const existing = await getCustomerByEmail(input.email);
        if (existing) {
          return { success: false, message: "Este correo ya está registrado", customer: existing };
        }

        // Generate referral code
        const referralCode = `REF-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        await createCustomer({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          referralCode,
        });

        const customer = await getCustomerByEmail(input.email);
        return { success: true, message: "Registro exitoso", customer };
      }),

    getByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        return await getCustomerByEmail(input.email);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getCustomerById(input.id);
      }),
  }),

  // Amigurumi requests
  request: router({
    create: publicProcedure
      .input(
        z.object({
          customerId: z.number(),
          description: z.string().min(10),
          referenceImageUrl: z.string().optional(),
          packageType: z.enum(["wooden_box", "paper_bag", "chest_box", "glass_dome"]),
          depositAmount: z.number().min(1000),
        })
      )
      .mutation(async ({ input }) => {
        const customer = await getCustomerById(input.customerId);
        if (!customer) {
          throw new Error("Cliente no encontrado");
        }

        await createAmigurumiRequest({
          customerId: input.customerId,
          description: input.description,
          referenceImageUrl: input.referenceImageUrl,
          packageType: input.packageType,
          depositAmount: input.depositAmount,
          status: "pending",
        });

        // Get the newly created request
        const requests = await getAmigurumiRequestsByCustomerId(input.customerId);
        const request = requests[requests.length - 1];

        // Notify owner
        const packageTypeLabel: Record<string, string> = {
          wooden_box: "Caja de Madera",
          paper_bag: "Bolsa de Papel",
          chest_box: "Caja Cofre",
          glass_dome: "Cúpula de Vidrio",
        };

        await notifyNewRequest(
          `${customer.firstName} ${customer.lastName}`,
          customer.email,
          customer.phone,
          packageTypeLabel[input.packageType],
          input.description
        );

        return { success: true, request };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getAmigurumiRequestById(input.id);
      }),

    getByCustomerId: publicProcedure
      .input(z.object({ customerId: z.number() }))
      .query(async ({ input }) => {
        return await getAmigurumiRequestsByCustomerId(input.customerId);
      }),

    getAll: protectedProcedure.query(async () => {
      return await getAllAmigurumiRequests();
    }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          adminNotes: z.string().optional(),
          status: z.enum(["pending", "deposit_paid", "in_progress", "completed", "cancelled"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await updateAmigurumiRequest(input.id, {
          adminNotes: input.adminNotes,
          status: input.status as any,
        });
        return { success: true };
      }),
  }),

  // Payments
  payment: router({
    create: publicProcedure
      .input(
        z.object({
          requestId: z.number(),
          customerId: z.number(),
          amount: z.number().min(1000),
        })
      )
      .mutation(async ({ input }) => {
        await createPayment({
          requestId: input.requestId,
          customerId: input.customerId,
          amount: input.amount,
          currency: "COP",
          status: "pending",
        });

        return { success: true };
      }),

    updateFromWebhook: publicProcedure
      .input(
        z.object({
          boldTransactionId: z.string(),
          status: z.string(),
          amount: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const payment = await getPaymentByBoldTransactionId(input.boldTransactionId);
        if (!payment) {
          throw new Error("Pago no encontrado");
        }

        const internalStatus = mapBoldStatusToInternal(input.status);
        await updatePayment(payment.id, {
          status: internalStatus as any,
        });

        // If payment is completed, update request status
        if (internalStatus === "completed") {
          await updateAmigurumiRequest(payment.requestId, {
            status: "deposit_paid",
            paymentId: input.boldTransactionId,
          });

          const customer = await getCustomerById(payment.customerId);
          if (customer) {
            await notifyPaymentReceived(
              `${customer.firstName} ${customer.lastName}`,
              input.amount,
              payment.requestId
            );
          }
        }

        return { success: true };
      }),
  }),

  // Communications
  communication: router({
    create: publicProcedure
      .input(
        z.object({
          requestId: z.number(),
          customerId: z.number(),
          senderType: z.enum(["customer", "admin"]),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        await createCommunication({
          requestId: input.requestId,
          customerId: input.customerId,
          senderType: input.senderType,
          message: input.message,
        });

        return { success: true };
      }),

    getByRequestId: publicProcedure
      .input(z.object({ requestId: z.number() }))
      .query(async ({ input }) => {
        return await getCommunicationsByRequestId(input.requestId);
      }),
  }),

  // Gallery management
  gallery: router({
    getAll: publicProcedure.query(async () => {
      return await getAllGalleryItems();
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().url(),
          price: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can create gallery items");
        }
        await createGalleryItem({
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          price: input.price,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can update gallery items");
        }
        await updateGalleryItem(input.id, {
          title: input.title,
          description: input.description,
          price: input.price,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can delete gallery items");
        }
        await deleteGalleryItem(input.id);
        return { success: true };
      }),
  }),

  // QR Code tracking
  qrTracking: router({
    generateForRequest: protectedProcedure
      .input(z.object({ requestId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can generate QR codes");
        }

        const qrData = `https://puntadas-de-mechis.com/track/${input.requestId}`;
        const qrCode = await QRCode.toDataURL(qrData);

        await createQRCodeTracking({
          requestId: input.requestId,
          qrCode,
        });

        return { qrCode, success: true };
      }),

    getByRequestId: publicProcedure
      .input(z.object({ requestId: z.number() }))
      .query(async ({ input }) => {
        return await getQRCodeTrackingByRequestId(input.requestId);
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          requestId: z.number(),
          status: z.enum(["created", "in_production", "ready", "shipped", "delivered"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can update QR status");
        }

        const qrTracking = await getQRCodeTrackingByRequestId(input.requestId);
        if (!qrTracking) {
          throw new Error("QR code not found");
        }

        await updateQRCodeTracking(qrTracking.id, { status: input.status });
        return { success: true };
      }),
  }),

  // Completion notifications
  completionNotification: router({
    markAsReady: protectedProcedure
      .input(
        z.object({
          requestId: z.number(),
          customerId: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can mark items as ready");
        }

        const message = "¡Tu amigurumi está listo! Contáctanos para coordinar la entrega.";

        await createCompletionNotification({
          requestId: input.requestId,
          customerId: input.customerId,
          message,
          deliveryStatus: "pending",
        });

        // Update request status to "completed"
        await updateAmigurumiRequest(input.requestId, { status: "completed" });

        return { success: true, message };
      }),

    getByRequestId: publicProcedure
      .input(z.object({ requestId: z.number() }))
      .query(async ({ input }) => {
        return await getCompletionNotificationsByRequestId(input.requestId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
