import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Registration routes
  app.post("/api/registrations", async (req, res) => {
    try {
      const registrationData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(registrationData);
      res.json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create registration" });
      }
    }
  });

  app.get("/api/registrations", async (req, res) => {
    try {
      const { search, experience, committee } = req.query;
      
      let registrations;
      
      if (search) {
        registrations = await storage.searchRegistrations(search as string);
      } else if (experience || committee) {
        registrations = await storage.filterRegistrations({
          experience: experience as string,
          committee: committee as string,
        });
      } else {
        registrations = await storage.getRegistrations();
      }
      
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.get("/api/registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const registration = await storage.getRegistration(id);
      
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      
      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registration" });
    }
  });

  app.patch("/api/registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const registration = await storage.updateRegistration(id, updates);
      
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      
      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update registration" });
    }
  });

  app.delete("/api/registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteRegistration(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Registration not found" });
      }
      
      res.json({ message: "Registration deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete registration" });
    }
  });

  // Statistics endpoint for admin dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const registrations = await storage.getRegistrations();
      
      const stats = {
        total: registrations.length,
        confirmed: registrations.filter(r => r.status === "confirmed").length,
        pending: registrations.filter(r => r.status === "pending").length,
        committees: new Set(registrations.flatMap(r => r.committees)).size,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
