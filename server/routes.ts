import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "../shared/schema";  // <-- fixed relative import
import { z } from "zod";


export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/registrations - create new registration with validation
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

  // GET /api/registrations - list registrations, with optional search/filter
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

  // GET /api/registrations/:id - fetch single registration by id
  app.get("/api/registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      const registration = await storage.getRegistration(id);

      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registration" });
    }
  });

  // PATCH /api/registrations/:id - update a registration partially
  app.patch("/api/registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

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

  // DELETE /api/registrations/:id - delete a registration
  app.delete("/api/registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      const deleted = await storage.deleteRegistration(id);

      if (!deleted) {
        return res.status(404).json({ message: "Registration not found" });
      }

      res.json({ message: "Registration deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete registration" });
    }
  });

  // GET /api/stats - returns some statistics on registrations
  app.get("/api/stats", async (_req, res) => {
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

  // Create and return the HTTP server
 const httpServer = createServer(app);
  return httpServer;
}
