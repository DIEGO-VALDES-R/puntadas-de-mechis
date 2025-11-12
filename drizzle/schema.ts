import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Customer registration table for amigurumi requests
 */
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  referralCode: varchar("referralCode", { length: 50 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

/**
 * Amigurumi requests table
 */
export const amigurumiRequests = mysqlTable("amigurumiRequests", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  description: text("description").notNull(),
  referenceImageUrl: varchar("referenceImageUrl", { length: 500 }),
  packageType: mysqlEnum("packageType", ["wooden_box", "paper_bag", "chest_box", "glass_dome"]).notNull(),
  depositAmount: int("depositAmount").notNull(), // Amount in cents
  totalAmount: int("totalAmount"), // Amount in cents
  status: mysqlEnum("status", ["pending", "deposit_paid", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  paymentId: varchar("paymentId", { length: 100 }),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AmigurumiRequest = typeof amigurumiRequests.$inferSelect;
export type InsertAmigurumiRequest = typeof amigurumiRequests.$inferInsert;

/**
 * Payment records table
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  customerId: int("customerId").notNull(),
  amount: int("amount").notNull(), // Amount in cents
  currency: varchar("currency", { length: 3 }).default("COP").notNull(),
  boldTransactionId: varchar("boldTransactionId", { length: 100 }).unique(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Communication/Response table for admin-customer interactions
 */
export const communications = mysqlTable("communications", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  customerId: int("customerId").notNull(),
  senderType: mysqlEnum("senderType", ["customer", "admin"]).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = typeof communications.$inferInsert;

/**
 * Gallery items table for showcasing amigurumi creations
 */
export const galleryItems = mysqlTable("galleryItems", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  price: int("price"), // Price in cents
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = typeof galleryItems.$inferInsert;

/**
 * QR Code tracking table for amigurumi production tracking
 */
export const qrCodeTracking = mysqlTable("qrCodeTracking", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  qrCode: varchar("qrCode", { length: 500 }).notNull().unique(),
  status: mysqlEnum("status", ["created", "in_production", "ready", "shipped", "delivered"]).default("created").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QRCodeTracking = typeof qrCodeTracking.$inferSelect;
export type InsertQRCodeTracking = typeof qrCodeTracking.$inferInsert;

/**
 * Completion notifications table
 */
export const completionNotifications = mysqlTable("completionNotifications", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  customerId: int("customerId").notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  deliveryStatus: mysqlEnum("deliveryStatus", ["pending", "sent", "failed"]).default("pending").notNull(),
});

export type CompletionNotification = typeof completionNotifications.$inferSelect;
export type InsertCompletionNotification = typeof completionNotifications.$inferInsert;

/**
 * Referrals table for tracking customer referrals
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(), // Customer who referred
  referredId: int("referredId").notNull(), // Customer who was referred
  discountPercentage: int("discountPercentage").default(10).notNull(), // Discount percentage
  status: mysqlEnum("status", ["pending", "active", "inactive"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Discounts/Coupons table
 */
export const discounts = mysqlTable("discounts", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  description: text("description"),
  discountPercentage: int("discountPercentage").notNull(),
  discountAmount: int("discountAmount"), // Fixed amount in cents
  maxUses: int("maxUses"), // Null = unlimited
  currentUses: int("currentUses").default(0).notNull(),
  validFrom: timestamp("validFrom"),
  validUntil: timestamp("validUntil"),
  applicableToReferrals: boolean("applicableToReferrals").default(false).notNull(),
  customerId: int("customerId"), // If null, applies to all customers
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Discount = typeof discounts.$inferSelect;
export type InsertDiscount = typeof discounts.$inferInsert;

/**
 * Inventory table for tracking purchases and stock
 */
export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  productName: varchar("productName", { length: 200 }).notNull(),
  productType: varchar("productType", { length: 100 }).notNull(), // e.g., "yarn", "thread", "eyes", etc.
  referenceNumber: varchar("referenceNumber", { length: 100 }),
  quantity: int("quantity").notNull(),
  unit: varchar("unit", { length: 50 }).notNull(), // e.g., "kg", "meters", "units"
  unitCost: int("unitCost").notNull(), // Cost in cents
  totalCost: int("totalCost").notNull(), // quantity * unitCost
  supplier: varchar("supplier", { length: 200 }),
  purchaseDate: timestamp("purchaseDate"),
  status: mysqlEnum("status", ["pending", "received", "used"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;

/**
 * Financial transactions table for accounting
 */
export const financialTransactions = mysqlTable("financialTransactions", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["income", "expense", "refund"]).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "amigurumi_sale", "materials", "shipping"
  amount: int("amount").notNull(), // Amount in cents
  description: text("description"),
  referenceId: int("referenceId"), // Link to request, inventory, etc.
  referenceType: varchar("referenceType", { length: 50 }), // e.g., "request", "inventory"
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type InsertFinancialTransaction = typeof financialTransactions.$inferInsert;

/**
 * Admin credentials table for password-based access
 */
export const adminCredentials = mysqlTable("adminCredentials", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["super_admin", "admin", "accountant"]).default("admin").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminCredential = typeof adminCredentials.$inferSelect;
export type InsertAdminCredential = typeof adminCredentials.$inferInsert;

/**
 * Community patterns table
 */
export const patterns = mysqlTable("patterns", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  price: int("price").notNull(), // Price in cents
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  createdBy: int("createdBy"), // Admin user ID
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pattern = typeof patterns.$inferSelect;
export type InsertPattern = typeof patterns.$inferInsert;

/**
 * Knitting classes table
 */
export const knittingClasses = mysqlTable("knittingClasses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  videoUrl: varchar("videoUrl", { length: 500 }),
  price: int("price").notNull(), // Price in cents
  duration: int("duration"), // Duration in minutes
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  createdBy: int("createdBy"), // Admin user ID
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnittingClass = typeof knittingClasses.$inferSelect;
export type InsertKnittingClass = typeof knittingClasses.$inferInsert;

/**
 * Challenges/Retos table
 */
export const challenges = mysqlTable("challenges", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  prize: text("prize"), // Description of prize
  createdBy: int("createdBy"), // Admin user ID
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;

/**
 * Customer purchases of patterns/classes
 */
export const customerPurchases = mysqlTable("customerPurchases", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  itemType: mysqlEnum("itemType", ["pattern", "class", "challenge"]).notNull(),
  itemId: int("itemId").notNull(),
  price: int("price").notNull(), // Price in cents at time of purchase
  purchaseDate: timestamp("purchaseDate").defaultNow().notNull(),
  accessUntil: timestamp("accessUntil"), // Null = permanent access
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomerPurchase = typeof customerPurchases.$inferSelect;
export type InsertCustomerPurchase = typeof customerPurchases.$inferInsert;

/**
 * Community forum/posts table
 */
export const communityPosts = mysqlTable("communityPosts", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  category: varchar("category", { length: 100 }), // e.g., "projects", "tips", "questions"
  likes: int("likes").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = typeof communityPosts.$inferInsert;

/**
 * Community comments table
 */
export const communityComments = mysqlTable("communityComments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  customerId: int("customerId").notNull(),
  content: text("content").notNull(),
  likes: int("likes").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommunityComment = typeof communityComments.$inferSelect;
export type InsertCommunityComment = typeof communityComments.$inferInsert;
