import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, customers, InsertCustomer, amigurumiRequests, InsertAmigurumiRequest, payments, InsertPayment, communications, InsertCommunication, galleryItems, InsertGalleryItem, qrCodeTracking, InsertQRCodeTracking, completionNotifications, InsertCompletionNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Customer queries
export async function createCustomer(data: InsertCustomer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customers).values(data);
  return result;
}

export async function getCustomerByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCustomerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Amigurumi request queries
export async function createAmigurumiRequest(data: InsertAmigurumiRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(amigurumiRequests).values(data);
  return result;
}

export async function getAmigurumiRequestById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(amigurumiRequests).where(eq(amigurumiRequests.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAmigurumiRequestsByCustomerId(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(amigurumiRequests).where(eq(amigurumiRequests.customerId, customerId));
}

export async function getAllAmigurumiRequests() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(amigurumiRequests);
}

export async function updateAmigurumiRequest(id: number, data: Partial<InsertAmigurumiRequest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(amigurumiRequests).set(data).where(eq(amigurumiRequests.id, id));
}

// Payment queries
export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(payments).values(data);
  return result;
}

export async function getPaymentByBoldTransactionId(boldTransactionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(payments).where(eq(payments.boldTransactionId, boldTransactionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePayment(id: number, data: Partial<InsertPayment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(payments).set(data).where(eq(payments.id, id));
}

// Communication queries
export async function createCommunication(data: InsertCommunication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(communications).values(data);
  return result;
}

export async function getCommunicationsByRequestId(requestId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(communications).where(eq(communications.requestId, requestId));
}

// Gallery queries
export async function createGalleryItem(data: InsertGalleryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(galleryItems).values(data);
  return result;
}

export async function getAllGalleryItems() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(galleryItems).where(eq(galleryItems.isActive, true));
}

export async function updateGalleryItem(id: number, data: Partial<InsertGalleryItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(galleryItems).set(data).where(eq(galleryItems.id, id));
}

export async function deleteGalleryItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(galleryItems).set({ isActive: false }).where(eq(galleryItems.id, id));
}

// QR Code tracking queries
export async function createQRCodeTracking(data: InsertQRCodeTracking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(qrCodeTracking).values(data);
  return result;
}

export async function getQRCodeTrackingByRequestId(requestId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(qrCodeTracking).where(eq(qrCodeTracking.requestId, requestId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateQRCodeTracking(id: number, data: Partial<InsertQRCodeTracking>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(qrCodeTracking).set(data).where(eq(qrCodeTracking.id, id));
}

// Completion notification queries
export async function createCompletionNotification(data: InsertCompletionNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(completionNotifications).values(data);
  return result;
}

export async function getCompletionNotificationsByRequestId(requestId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(completionNotifications).where(eq(completionNotifications.requestId, requestId));
}
