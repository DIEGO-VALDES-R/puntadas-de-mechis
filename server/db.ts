import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, customers, InsertCustomer, amigurumiRequests, InsertAmigurumiRequest, payments, InsertPayment, communications, InsertCommunication, galleryItems, InsertGalleryItem, qrCodeTracking, InsertQRCodeTracking, completionNotifications, InsertCompletionNotification, adminCredentials, InsertAdminCredential, referrals, InsertReferral, discounts, InsertDiscount, inventory, InsertInventory, financialTransactions, InsertFinancialTransaction, patterns, InsertPattern, knittingClasses, InsertKnittingClass, challenges, InsertChallenge, customerPurchases, InsertCustomerPurchase, communityPosts, InsertCommunityPost, communityComments, InsertCommunityComment, galleryCategories, InsertGalleryCategory, promotions, InsertPromotion } from "../drizzle/schema";
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


// Admin credentials queries
export async function createAdminCredential(data: InsertAdminCredential) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(adminCredentials).values(data);
  return result;
}

export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(adminCredentials).where(eq(adminCredentials.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAdminLastLogin(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(adminCredentials).set({ lastLogin: new Date() }).where(eq(adminCredentials.id, id));
}

// Referral queries
export async function createReferral(data: InsertReferral) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(referrals).values(data);
  return result;
}

export async function getReferralsByReferrerId(referrerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(referrals).where(eq(referrals.referrerId, referrerId));
}

// Discount queries
export async function createDiscount(data: InsertDiscount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(discounts).values(data);
  return result;
}

export async function getDiscountByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(discounts).where(eq(discounts.code, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllDiscounts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(discounts).where(eq(discounts.isActive, true));
}

// Inventory queries
export async function createInventoryItem(data: InsertInventory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(inventory).values(data);
  return result;
}

export async function getAllInventory() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(inventory);
}

export async function updateInventoryItem(id: number, data: Partial<InsertInventory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(inventory).set(data).where(eq(inventory.id, id));
}

// Financial transaction queries
export async function createFinancialTransaction(data: InsertFinancialTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(financialTransactions).values(data);
  return result;
}

export async function getAllFinancialTransactions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(financialTransactions);
}

export async function getFinancialTransactionsByType(type: 'income' | 'expense' | 'refund') {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(financialTransactions).where(eq(financialTransactions.type, type));
}


// Gallery category queries
export async function createGalleryCategory(data: InsertGalleryCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(galleryCategories).values(data);
  return result;
}

export async function getAllGalleryCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(galleryCategories).where(eq(galleryCategories.isActive, true));
}

export async function updateGalleryCategory(id: number, data: Partial<InsertGalleryCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(galleryCategories).set(data).where(eq(galleryCategories.id, id));
}

// Promotion queries
export async function createPromotion(data: InsertPromotion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(promotions).values(data);
  return result;
}

export async function getAllPromotions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(promotions);
}

export async function getActivePromotions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(promotions).where(eq(promotions.isActive, true));
}

export async function updatePromotion(id: number, data: Partial<InsertPromotion>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(promotions).set(data).where(eq(promotions.id, id));
}

export async function deletePromotion(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(promotions).set({ isActive: false }).where(eq(promotions.id, id));
}

export async function getHighlightedGalleryItems() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(galleryItems).where(eq(galleryItems.isHighlighted, true)).orderBy(galleryItems.highlightOrder);
}

export async function getGalleryItemsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(galleryItems).where(eq(galleryItems.category, category));
}
