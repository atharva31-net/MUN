import { z } from "zod";

// This schema is used for validating registration form input
export const insertRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  school: z.string(),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  committees: z.array(z.string()).min(1, "Select at least one committee"),
  status: z.enum(["pending", "confirmed"])
});

// Optional: export the inferred TypeScript type
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;