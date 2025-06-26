import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  school: text("school").notNull(),
  grade: text("grade").notNull(),
  experience: text("experience").notNull(),
  position: text("position").notNull(),
  committees: text("committees").array().notNull(),
  dietary: text("dietary"),
  accommodation: text("accommodation"),
  terms: boolean("terms").notNull(),
  newsletter: boolean("newsletter").default(false),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  status: true,
  createdAt: true,
  dietary: true,
  accommodation: true,
}).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  school: z.string().min(1, "School/Institution is required"),
  grade: z.string().min(1, "Grade/Year is required"),
  experience: z.string().min(1, "Experience level is required"),
  position: z.string().min(1, "Preferred position is required"),
  committees: z.array(z.string()).min(1, "Please select at least one committee"),
  terms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  newsletter: z.boolean().optional(),
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

// Keep existing user schema for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
