"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUserSchema = exports.users = exports.insertRegistrationSchema = exports.registrations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
exports.registrations = (0, pg_core_1.pgTable)("registrations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    firstName: (0, pg_core_1.text)("first_name").notNull(),
    lastName: (0, pg_core_1.text)("last_name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    phone: (0, pg_core_1.text)("phone"),
    school: (0, pg_core_1.text)("school").notNull(),
    grade: (0, pg_core_1.text)("grade").notNull(),
    experience: (0, pg_core_1.text)("experience").notNull(),
    position: (0, pg_core_1.text)("position").notNull(),
    committees: (0, pg_core_1.text)("committees").array().notNull(),
    dietary: (0, pg_core_1.text)("dietary"),
    accommodation: (0, pg_core_1.text)("accommodation"),
    suggestions: (0, pg_core_1.text)("suggestions"),
    terms: (0, pg_core_1.boolean)("terms").notNull(),
    newsletter: (0, pg_core_1.boolean)("newsletter").default(false),
    status: (0, pg_core_1.text)("status").notNull().default("pending"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertRegistrationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.registrations).omit({
    id: true,
    status: true,
    createdAt: true,
    dietary: true,
    accommodation: true,
    phone: true,
    school: true,
    terms: true,
    experience: true,
}).extend({
    firstName: zod_1.z.string().min(1, "First name is required"),
    lastName: zod_1.z.string().min(1, "Last name is required"),
    email: zod_1.z.string().email("Please enter a valid email address").optional().or(zod_1.z.literal("")),
    grade: zod_1.z.string().min(1, "Grade/Year is required"),
    position: zod_1.z.string().min(1, "Preferred position is required"),
    committees: zod_1.z.array(zod_1.z.string()).min(1, "Please select at least one committee"),
    suggestions: zod_1.z.string().optional(),
    newsletter: zod_1.z.boolean().optional(),
});
// Keep existing user schema for compatibility
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
});
