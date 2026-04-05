import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/customers", async (req, res) => {
    try {
      const { search, customerType } = req.query;
      const customers = await storage.getCustomers({ 
        search: search as string, 
        customerType: customerType as string 
      });
      // Map id to _id for frontend compatibility
      const mapped = customers.map(c => {
        let addressObj = { street: "", city: "", state: "", pincode: "" };
        if (c.address) {
          try {
            addressObj = typeof c.address === 'string' ? JSON.parse(c.address) : c.address;
          } catch (e) {
            console.error("Failed to parse address for customer:", c.id);
          }
        }
        return { 
          ...c, 
          _id: c.id,
          totalOrders: Number(c.totalOrders || 0),
          outstandingBalance: Number(c.outstandingBalance || 0),
          address: addressObj
        };
      });
      res.json({ success: true, data: mapped });
    } catch (err: any) {
      console.error("Customers GET error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const data = req.body;
      const customer = await storage.createCustomer({
        ...data,
        address: data.address ? JSON.stringify(data.address) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.join(",") : data.tags
      });
      res.status(201).json({ 
        success: true, 
        data: { ...customer, _id: customer.id } 
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const data = req.body;
      const updated = await storage.updateCustomer(req.params.id, {
        ...data,
        address: data.address ? JSON.stringify(data.address) : undefined,
        tags: data.tags ? data.tags.join(",") : undefined
      });
      if (!updated) return res.status(404).json({ success: false, message: "Customer not found" });
      res.json({ success: true, data: { ...updated, _id: updated.id } });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    const deleted = await storage.deleteCustomer(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Customer not found" });
    res.json({ success: true });
  });

  // Menu Routes
  app.get("/api/menu", async (req, res) => {
    try {
      const { category } = req.query;
      const items = await storage.getMenuItems(category as string);
      res.json({ success: true, data: items });
    } catch (err: any) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  app.post("/api/menu", async (req, res) => {
    try {
      const data = req.body;
      const item = await storage.createMenuItem(data);
      res.status(201).json({ success: true, data: item });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.put("/api/menu/:id", async (req, res) => {
    try {
      const updated = await storage.updateMenuItem(req.params.id, req.body);
      if (!updated) return res.status(404).json({ success: false, message: "Item not found" });
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.delete("/api/menu/:id", async (req, res) => {
    const deleted = await storage.deleteMenuItem(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true });
  });

  // Dashboard Routes
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  app.get("/api/dashboard/financial", async (req, res) => {
    try {
      const financial = await storage.getDashboardFinancial();
      res.json({ success: true, data: financial });
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  // Order Routes
  app.get("/api/orders", async (req, res) => {
    const orders = await storage.getOrders();
    res.json({ success: true, data: orders });
  });

  // Invoice Routes
  app.get("/api/invoices", async (req, res) => {
    const invoices = await storage.getInvoices();
    res.json({ success: true, data: invoices });
  });

  // Quote Routes
  app.get("/api/quotes", async (req, res) => {
    const quotes = await storage.getQuotes();
    res.json({ success: true, data: quotes });
  });

  // Payment Routes
  app.get("/api/payments", async (req, res) => {
    const payments = await storage.getPayments();
    res.json({ success: true, data: payments });
  });

  // Expense Routes
  app.get("/api/expenses", async (req, res) => {
    const expenses = await storage.getExpenses();
    res.json({ success: true, data: expenses });
  });

  return httpServer;
}
