import { pgTable, text, timestamp, varchar, boolean, integer, serial, pgEnum } from "drizzle-orm/pg-core";

// Definir enums de PostgreSQL
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const packageTypeEnum = pgEnum("packageType", ["wooden_box", "paper_bag", "chest_box", "glass_dome"]);
export const requestStatusEnum = pgEnum("requestStatus", ["pending", "deposit_paid", "in_progress", "completed", "cancelled"]);
export const paymentStatusEnum = pgEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]);
export const senderTypeEnum = pgEnum("senderType", ["customer", "admin"]);
export const qrStatusEnum = pgEnum("qrStatus", ["created", "in_production", "ready", "shipped", "delivered"]);
export const deliveryStatusEnum = pgEnum("deliveryStatus", ["pending", "sent", "failed"]);
export const referralStatusEnum = pgEnum("referralStatus", ["pending", "active", "inactive"]);
export const inventoryStatusEnum = pgEnum("inventoryStatus", ["pending", "received", "used"]);
export const transactionTypeEnum = pgEnum("transactionType", ["income", "expense", "refund"]);
export const adminRoleEnum = pgEnum("adminRole", ["super_admin", "admin", "accountant"]);
export const difficultyEnum = pgEnum("difficulty", ["beginner", "intermediate", "advanced"]);
export const itemTypeEnum = pgEnum("itemType", ["pattern", "class", "challenge"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Customer registration table for amigurumi requests
 */
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  referralCode: varchar("referralCode", { length: 50 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

/**
 * Amigurumi requests table
 */
export const amigurumiRequests = pgTable("amigurumiRequests", {
  id: serial("id").primaryKey(),
  customerId: integer("customerId").notNull(),
  description: text("description").notNull(),
  referenceImageUrl: varchar("referenceImageUrl", { length: 500 }),
  packageType: packageTypeEnum("packageType").notNull(),
  depositAmount: integer("depositAmount").notNull(),
  totalAmount: integer("totalAmount"),
  status: requestStatusEnum("status").default("pending").notNull(),
  paymentId: varchar("paymentId", { length: 100 }),
  trackingCode: varchar("trackingCode", { length: 6 }).unique(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AmigurumiRequest = typeof amigurumiRequests.$inferSelect;
export type InsertAmigurumiRequest = typeof amigurumiRequests.$inferInsert;

/**
 * Payment records table
 */
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  requestId: integer("requestId").notNull(),
  customerId: integer("customerId").notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("COP").notNull(),
  boldTransactionId: varchar("boldTransactionId", { length: 100 }).unique(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Communication/Response table for admin-customer interactions
 */
export const communications = pgTable("communications", {
  id: serial("id").primaryKey(),
  requestId: integer("requestId").notNull(),
  customerId: integer("customerId").notNull(),
  senderType: senderTypeEnum("senderType").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = typeof communications.$inferInsert;

/**
 * Gallery items table for showcasing amigurumi creations
 */
export const galleryItems = pgTable("galleryItems", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  price: integer("price"),
  category: varchar("category", { length: 100 }),
  isHighlighted: boolean("isHighlighted").default(false).notNull(),
  highlightOrder: integer("highlightOrder"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = typeof galleryItems.$inferInsert;

/**
 * QR Code tracking table for amigurumi production tracking
 */
export const qrCodeTracking = pgTable("qrCodeTracking", {
  id: serial("id").primaryKey(),
  requestId: integer("requestId").notNull(),
  qrCode: varchar("qrCode", { length: 500 }).notNull().unique(),
  status: qrStatusEnum("status").default("created").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type QRCodeTracking = typeof qrCodeTracking.$inferSelect;
export type InsertQRCodeTracking = typeof qrCodeTracking.$inferInsert;

/**
 * Completion notifications table
 */
export const completionNotifications = pgTable("completionNotifications", {
  id: serial("id").primaryKey(),
  requestId: integer("requestId").notNull(),
  customerId: integer("customerId").notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  deliveryStatus: deliveryStatusEnum("deliveryStatus").default("pending").notNull(),
});

export type CompletionNotification = typeof completionNotifications.$inferSelect;
export type InsertCompletionNotification = typeof completionNotifications.$inferInsert;

/**
 * Referrals table for tracking customer referrals
 */
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrerId").notNull(),
  referredId: integer("referredId").notNull(),
  discountPercentage: integer("discountPercentage").default(10).notNull(),
  status: referralStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Discounts/Coupons table
 */
export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  description: text("description"),
  discountPercentage: integer("discountPercentage").notNull(),
  discountAmount: integer("discountAmount"),
  maxUses: integer("maxUses"),
  currentUses: integer("currentUses").default(0).notNull(),
  validFrom: timestamp("validFrom"),
  validUntil: timestamp("validUntil"),
  applicableToReferrals: boolean("applicableToReferrals").default(false).notNull(),
  customerId: integer("customerId"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Discount = typeof discounts.$inferSelect;
export type InsertDiscount = typeof discounts.$inferInsert;

/**
 * Inventory table for tracking purchases and stock
 */
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productName: varchar("productName", { length: 200 }).notNull(),
  productType: varchar("productType", { length: 100 }).notNull(),
  referenceNumber: varchar("referenceNumber", { length: 100 }),
  quantity: integer("quantity").notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  unitCost: integer("unitCost").notNull(),
  totalCost: integer("totalCost").notNull(),
  supplier: varchar("supplier", { length: 200 }),
  purchaseDate: timestamp("purchaseDate"),
  status: inventoryStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;

/**
 * Financial transactions table for accounting
 */
export const financialTransactions = pgTable("financialTransactions", {
  id: serial("id").primaryKey(),
  type: transactionTypeEnum("type").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  referenceId: integer("referenceId"),
  referenceType: varchar("referenceType", { length: 50 }),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type InsertFinancialTransaction = typeof financialTransactions.$inferInsert;

/**
 * Admin credentials table for password-based access
 */
export const adminCredentials = pgTable("adminCredentials", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  role: adminRoleEnum("role").default("admin").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AdminCredential = typeof adminCredentials.$inferSelect;
export type InsertAdminCredential = typeof adminCredentials.$inferInsert;

/**
 * Community patterns table
 */
export const patterns = pgTable("patterns", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  price: integer("price").notNull(),
  difficulty: difficultyEnum("difficulty").default("beginner").notNull(),
  createdBy: integer("createdBy"),
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Pattern = typeof patterns.$inferSelect;
export type InsertPattern = typeof patterns.$inferInsert;

/**
 * Knitting classes table
 */
export const knittingClasses = pgTable("knittingClasses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  videoUrl: varchar("videoUrl", { length: 500 }),
  price: integer("price").notNull(),
  duration: integer("duration"),
  level: difficultyEnum("level").default("beginner").notNull(),
  createdBy: integer("createdBy"),
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type KnittingClass = typeof knittingClasses.$inferSelect;
export type InsertKnittingClass = typeof knittingClasses.$inferInsert;

/**
 * Challenges/Retos table
 */
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  difficulty: difficultyEnum("difficulty").default("beginner").notNull(),
  prize: text("prize"),
  createdBy: integer("createdBy"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;

/**
 * Customer purchases of patterns/classes
 */
export const customerPurchases = pgTable("customerPurchases", {
  id: serial("id").primaryKey(),
  customerId: integer("customerId").notNull(),
  itemType: itemTypeEnum("itemType").notNull(),
  itemId: integer("itemId").notNull(),
  price: integer("price").notNull(),
  purchaseDate: timestamp("purchaseDate").defaultNow().notNull(),
  accessUntil: timestamp("accessUntil"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomerPurchase = typeof customerPurchases.$inferSelect;
export type InsertCustomerPurchase = typeof customerPurchases.$inferInsert;

/**
 * Community forum/posts table
 */
export const communityPosts = pgTable("communityPosts", {
  id: serial("id").primaryKey(),
  customerId: integer("customerId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  category: varchar("category", { length: 100 }),
  likes: integer("likes").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = typeof communityPosts.$inferInsert;

/**
 * Community comments table
 */
export const communityComments = pgTable("communityComments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  customerId: integer("customerId").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CommunityComment = typeof communityComments.$inferSelect;
export type InsertCommunityComment = typeof communityComments.$inferInsert;

/**
 * Gallery categories table
 */
export const galleryCategories = pgTable("galleryCategories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  order: integer("order").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type GalleryCategory = typeof galleryCategories.$inferSelect;
export type InsertGalleryCategory = typeof galleryCategories.$inferInsert;

/**
 * Promotion/Discount table for percentage-based discounts
 */
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  discountPercentage: integer("discountPercentage").notNull(),
  galleryItemId: integer("galleryItemId"),
  validFrom: timestamp("validFrom"),
  validUntil: timestamp("validUntil"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = typeof promotions.$inferInsert;
