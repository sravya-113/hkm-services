import { 
  type User, type InsertUser, 
  type Customer, type InsertCustomer, 
  type MenuItem, type InsertMenuItem,
  type Order, type InsertOrder,
  type Invoice, type InsertInvoice,
  type Quote, type InsertQuote,
  type Payment, type InsertPayment,
  type Expense, type InsertExpense
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Customer methods
  getCustomers(params?: { search?: string, customerType?: string }): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  // Menu methods
  getMenuItems(category?: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;

  // Order methods
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;

  // Invoice methods
  getInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;

  // Quote methods
  getQuotes(): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;

  // Payment methods
  getPayments(): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  // Expense methods
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;

  // Dashboard methods
  getDashboardStats(): Promise<any>;
  getDashboardFinancial(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private customers: Map<string, Customer>;
  private menuItems: Map<string, MenuItem>;
  private orders: Map<string, Order>;
  private invoices: Map<string, Invoice>;
  private quotes: Map<string, Quote>;
  private payments: Map<string, Payment>;
  private expenses: Map<string, Expense>;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.invoices = new Map();
    this.quotes = new Map();
    this.payments = new Map();
    this.expenses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role ?? "staff"
    };
    this.users.set(id, user);
    return user;
  }

  // Customer implementations
  async getCustomers(params?: { search?: string, customerType?: string }): Promise<Customer[]> {
    let result = Array.from(this.customers.values()).filter(c => c.isActive !== "false");
    if (params?.search) {
      const s = params.search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.phone.toLowerCase().includes(s) ||
        (c.company && c.company.toLowerCase().includes(s))
      );
    }
    if (params?.customerType && params.customerType !== 'all') {
      result = result.filter(c => c.customerType === params.customerType);
    }
    return result;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = {
      ...insertCustomer,
      id,
      isActive: String(insertCustomer.isActive ?? "true"),
      totalOrders: String(insertCustomer.totalOrders ?? "0"),
      outstandingBalance: String(insertCustomer.outstandingBalance ?? "0")
    } as Customer;
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existing = this.customers.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const existing = this.customers.get(id);
    if (!existing) return false;
    this.customers.set(id, { ...existing, isActive: "false" });
    return true;
  }

  // Menu implementations
  async getMenuItems(category?: string): Promise<MenuItem[]> {
    let result = Array.from(this.menuItems.values()).filter(i => i.isActive !== "false");
    if (category && category !== 'All') {
      result = result.filter(i => i.category === category);
    }
    return result;
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const item: MenuItem = {
      ...insertItem,
      id,
      isActive: String(insertItem.isActive ?? "true")
    } as MenuItem;
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: string, data: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existing = this.menuItems.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const existing = this.menuItems.get(id);
    if (!existing) return false;
    this.menuItems.set(id, { ...existing, isActive: "false" });
    return true;
  }

  // Generic Getters/Creators
  async getOrders() { return Array.from(this.orders.values()); }
  async createOrder(o: InsertOrder) { 
    const id = randomUUID(); 
    const order: Order = { 
      ...o, 
      id, 
      status: o.status ?? "Draft", 
      amountPaid: o.amountPaid ?? "0", 
      isArchived: o.isArchived ?? "false", 
      itemsCount: o.itemsCount ?? "0",
      eventName: o.eventName ?? null
    }; 
    this.orders.set(id, order); 
    return order; 
  }

  async getInvoices() { return Array.from(this.invoices.values()); }
  async createInvoice(i: InsertInvoice) { 
    const id = randomUUID(); 
    const invoice: Invoice = { 
      ...i, 
      id, 
      status: i.status ?? "Sent", 
      amountPaid: i.amountPaid ?? "0" 
    }; 
    this.invoices.set(id, invoice); 
    return invoice; 
  }

  async getQuotes() { return Array.from(this.quotes.values()); }
  async createQuote(q: InsertQuote) { 
    const id = randomUUID(); 
    const quote: Quote = { 
      ...q, 
      id, 
      status: q.status ?? "Draft" 
    }; 
    this.quotes.set(id, quote); 
    return quote; 
  }

  async getPayments() { return Array.from(this.payments.values()); }
  async createPayment(p: InsertPayment) { 
    const id = randomUUID(); 
    const payment: Payment = { 
      ...p, 
      id, 
      status: p.status ?? "Success",
      orderId: p.orderId ?? null
    }; 
    this.payments.set(id, payment); 
    return payment; 
  }

  async getExpenses() { return Array.from(this.expenses.values()); }
  async createExpense(e: InsertExpense) { 
    const id = randomUUID(); 
    const expense: Expense = { 
      ...e, 
      id, 
      status: e.status ?? "Paid" 
    }; 
    this.expenses.set(id, expense); 
    return expense; 
  }

  // Dashboard Implementations
  async getDashboardStats() {
    return {
      summary: {
        todayOrders: { count: 0, change: 0 },
        pendingCollection: 0,
        activeQuotes: 0,
        totalCustomers: this.customers.size
      },
      todayWorkList: [],
      tomorrowPrep: [],
      nextWeekForecast: []
    };
  }

  async getDashboardFinancial() {
    const summary = {
      totalRevenue: 0,
      totalOrders: this.orders.size,
      pendingPayments: 0,
      totalExpenses: 0
    };
    return {
      summary,
      recentOrders: Array.from(this.orders.values()).slice(0, 5),
      recentPayments: Array.from(this.payments.values()).slice(0, 5)
    };
  }
}

export const storage = new MemStorage();
