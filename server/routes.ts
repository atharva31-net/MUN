import express, { Request, Response } from "express";
import db from "./db";
import { registrations } from "../shared/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

router.get("/api/registrations/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await db.select().from(registrations).where(eq(registrations.id, id));

  if (result.length === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(result[0]);
});

router.patch("/api/registrations/:id", async (_req: Request, res: Response) => {
  res.json({ message: "Patch endpoint not implemented." });
});

router.delete("/api/registrations/:id", async (_req: Request, res: Response) => {
  res.json({ message: "Delete endpoint not implemented." });
});

export default router;


