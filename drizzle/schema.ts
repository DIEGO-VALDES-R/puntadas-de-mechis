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