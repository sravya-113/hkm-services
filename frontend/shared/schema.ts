import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("staff"),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  gstin: text("gstin"),
  address: text("address"), // Storing as JSON string
  customerType: text("customerType").notNull().default("individual"),
  notes: text("notes"),
  tags: text("tags"), // Storing as comma-separated or JSON string
  totalOrders: text("totalOrders").default("0"),
  outstandingBalance: text("outstandingBalance").default("0"),
  isActive: text("isActive").notNull().default("true"),
});

export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: text("price").notNull(), // text to support decimal precision simply in this env
  isVeg: text("isVeg").notNull().default("true"),
  description: text("description"),
  image: text("image"), // URL or file path
  isActive: text("isActive").notNull().default("true"),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("orderNumber").notNull(),
  customerId: varchar("customerId").notNull(),
  customerName: text("customerName").notNull(),
  eventName: text("eventName"),
  eventDate: text("eventDate").notNull(),
  venue: text("venue").notNull(),
  pax: text("pax").notNull(),
  status: text("status").notNull().default("Draft"),
  totalAmount: text("totalAmount").notNull(),
  amountPaid: text("amountPaid").notNull().default("0"),
  amountDue: text("amountDue").notNull(),
  isArchived: text("isArchived").notNull().default("false"),
  itemsCount: text("itemsCount").notNull().default("0"),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoiceNumber").notNull(),
  orderId: varchar("orderId").notNull(),
  orderNumber: text("orderNumber").notNull(),
  customerId: varchar("customerId").notNull(),
  customerName: text("customerName").notNull(),
  date: text("date").notNull(),
  totalAmount: text("totalAmount").notNull(),
  amountPaid: text("amountPaid").notNull().default("0"),
  balance: text("balance").notNull(),
  status: text("status").notNull().default("Sent"),
});

export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteNumber: text("quoteNumber").notNull(),
  customerId: varchar("customerId").notNull(),
  customerName: text("customerName").notNull(),
  date: text("date").notNull(),
  expiryDate: text("expiryDate").notNull(),
  totalAmount: text("totalAmount").notNull(),
  status: text("status").notNull().default("Draft"),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: text("transactionId").notNull(),
  customerId: varchar("customerId").notNull(),
  customerName: text("customerName").notNull(),
  orderId: varchar("orderId"),
  amount: text("amount").notNull(),
  method: text("method").notNull(),
  status: text("status").notNull().default("Success"),
  date: text("date").notNull(),
});

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  amount: text("amount").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull().default("Paid"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
  role: true,
});

export const insertCustomerSchema = createInsertSchema(customers);
export const insertMenuItemSchema = createInsertSchema(menuItems);
export const insertOrderSchema = createInsertSchema(orders);
export const insertInvoiceSchema = createInsertSchema(invoices);
export const insertQuoteSchema = createInsertSchema(quotes);
export const insertPaymentSchema = createInsertSchema(payments);
export const insertExpenseSchema = createInsertSchema(expenses);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
