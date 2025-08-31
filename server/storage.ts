import { type User, type InsertUser, type DownloadJob, type InsertDownloadJob, type DownloadedFile, type InsertDownloadedFile, type SystemStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Download job operations
  createDownloadJob(job: InsertDownloadJob): Promise<DownloadJob>;
  getDownloadJob(id: string): Promise<DownloadJob | undefined>;
  updateDownloadJob(id: string, updates: Partial<DownloadJob>): Promise<DownloadJob | undefined>;
  getActiveDownloadJobs(): Promise<DownloadJob[]>;
  getUserDownloadJobs(userId?: string): Promise<DownloadJob[]>;

  // Downloaded file operations
  createDownloadedFile(file: InsertDownloadedFile): Promise<DownloadedFile>;
  getDownloadedFilesByJob(jobId: string): Promise<DownloadedFile[]>;
  getRecentDownloadedFiles(limit?: number): Promise<DownloadedFile[]>;

  // System stats
  getSystemStats(): Promise<SystemStats>;
  updateSystemStats(stats: Partial<SystemStats>): Promise<SystemStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private downloadJobs: Map<string, DownloadJob>;
  private downloadedFiles: Map<string, DownloadedFile>;
  private systemStats: SystemStats;

  constructor() {
    this.users = new Map();
    this.downloadJobs = new Map();
    this.downloadedFiles = new Map();
    this.systemStats = {
      id: randomUUID(),
      activeUsers: 0,
      totalDownloads: 0,
      totalFiles: 0,
      totalSize: 0,
      updatedAt: new Date(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDownloadJob(insertJob: InsertDownloadJob): Promise<DownloadJob> {
    const id = randomUUID();
    const job: DownloadJob = {
      id,
      userId: null,
      status: "pending",
      progress: 0,
      totalFiles: 0,
      completedFiles: 0,
      errorMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...insertJob,
    };
    this.downloadJobs.set(id, job);
    return job;
  }

  async getDownloadJob(id: string): Promise<DownloadJob | undefined> {
    return this.downloadJobs.get(id);
  }

  async updateDownloadJob(id: string, updates: Partial<DownloadJob>): Promise<DownloadJob | undefined> {
    const job = this.downloadJobs.get(id);
    if (!job) return undefined;

    const updatedJob = { ...job, ...updates, updatedAt: new Date() };
    this.downloadJobs.set(id, updatedJob);
    return updatedJob;
  }

  async getActiveDownloadJobs(): Promise<DownloadJob[]> {
    return Array.from(this.downloadJobs.values()).filter(
      job => job.status === "pending" || job.status === "running"
    );
  }

  async getUserDownloadJobs(userId?: string): Promise<DownloadJob[]> {
    return Array.from(this.downloadJobs.values())
      .filter(job => !userId || job.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createDownloadedFile(insertFile: InsertDownloadedFile): Promise<DownloadedFile> {
    const id = randomUUID();
    const file: DownloadedFile = {
      id,
      status: "completed",
      createdAt: new Date(),
      ...insertFile,
    };
    this.downloadedFiles.set(id, file);
    return file;
  }

  async getDownloadedFilesByJob(jobId: string): Promise<DownloadedFile[]> {
    return Array.from(this.downloadedFiles.values()).filter(
      file => file.jobId === jobId
    );
  }

  async getRecentDownloadedFiles(limit: number = 10): Promise<DownloadedFile[]> {
    return Array.from(this.downloadedFiles.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getSystemStats(): Promise<SystemStats> {
    // Update active stats
    this.systemStats.activeUsers = Math.floor(Math.random() * 2000) + 500; // Simulate active users
    this.systemStats.totalDownloads = this.downloadJobs.size;
    this.systemStats.totalFiles = this.downloadedFiles.size;
    this.systemStats.totalSize = Array.from(this.downloadedFiles.values())
      .reduce((total, file) => total + (file.fileSize || 0), 0);
    
    return this.systemStats;
  }

  async updateSystemStats(stats: Partial<SystemStats>): Promise<SystemStats> {
    this.systemStats = { ...this.systemStats, ...stats, updatedAt: new Date() };
    return this.systemStats;
  }
}

export const storage = new MemStorage();
