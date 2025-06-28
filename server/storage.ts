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

  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  getRegistration(id: number): Promise<Registration | undefined>;
  updateRegistration(id: number, updates: Partial<Registration>): Promise<Registration | undefined>;
  deleteRegistration(id: number): Promise<boolean>;
  searchRegistrations(query: string): Promise<Registration[]>;
  filterRegistrations(filters: { experience?: string; committee?: string }): Promise<Registration[]>;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private registrations = new Map<number, Registration>();
  private currentUserId = 1;
  private currentRegistrationId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const id = this.currentRegistrationId++;
    // You can add defaults here if you want
    const newRegistration: Registration = {
      ...registration,
      id,
      status: "pending",
      createdAt: new Date(),
    } as Registration;
    this.registrations.set(id, newRegistration);
    return newRegistration;
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
    const q = query.toLowerCase();
    return Array.from(this.registrations.values()).filter(reg =>
      reg.firstName.toLowerCase().includes(q) ||
      reg.lastName.toLowerCase().includes(q) ||
      reg.email.toLowerCase().includes(q) ||
      reg.school.toLowerCase().includes(q)
    );
  }

  async filterRegistrations(filters: { experience?: string; committee?: string }): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(reg => {
      if (filters.experience && reg.experience !== filters.experience) return false;
      if (filters.committee && !reg.committees.includes(filters.committee)) return false;
      return true;
    });
  }
}

export const storage = new MemStorage();
