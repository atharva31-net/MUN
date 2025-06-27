import {
  users,
  registrations,
  type User,
  type InsertUser,
  type Registration,
  type InsertRegistration
} from "../shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Registration methods
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  getRegistration(id: number): Promise<Registration | undefined>;
  updateRegistration(id: number, updates: Partial<Registration>): Promise<Registration | undefined>;
  deleteRegistration(id: number): Promise<boolean>;
  searchRegistrations(query: string): Promise<Registration[]>;
  filterRegistrations(filters: { experience?: string; committee?: string }): Promise<Registration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private registrations: Map<number, Registration>;
  private currentUserId: number;
  private currentRegistrationId: number;

  constructor() {
    this.users = new Map();
    this.registrations = new Map();
    this.currentUserId = 1;
    this.currentRegistrationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const id = this.currentRegistrationId++;
    const registration: Registration = {
      ...insertRegistration,
      email: insertRegistration.email || "",
      phone: null,
      school: "Prodigy Public School",
      experience: "beginner",
      dietary: null,
      accommodation: null,
      suggestions: insertRegistration.suggestions || null,
      terms: true,
      newsletter: insertRegistration.newsletter || false,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.registrations.set(id, registration);
    return registration;
  }

  async getRegistrations(): Promise<Registration[]> {
    return Array.from(this.registrations.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }

  async updateRegistration(id: number, updates: Partial<Registration>): Promise<Registration | undefined> {
    const existing = this.registrations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.registrations.set(id, updated);
    return updated;
  }

  async deleteRegistration(id: number): Promise<boolean> {
    return this.registrations.delete(id);
  }

  async searchRegistrations(query: string): Promise<Registration[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.registrations.values()).filter(reg =>
      reg.firstName.toLowerCase().includes(lowercaseQuery) ||
      reg.lastName.toLowerCase().includes(lowercaseQuery) ||
      reg.email.toLowerCase().includes(lowercaseQuery) ||
      reg.school.toLowerCase().includes(lowercaseQuery)
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async filterRegistrations(filters: { experience?: string; committee?: string }): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(reg => {
      if (filters.experience && reg.experience !== filters.experience) {
        return false;
      }
      if (filters.committee && !reg.committees.includes(filters.committee)) {
        return false;
      }
      return true;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
