import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const downloadJobs = pgTable("download_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  jobType: text("job_type").notNull(), // 'single' | 'range'
  startDate: text("start_date").notNull(),
  endDate: text("end_date"), // null for single date
  dataSources: json("data_sources").$type<string[]>().notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'running' | 'completed' | 'failed'
  progress: integer("progress").default(0),
  totalFiles: integer("total_files").default(0),
  completedFiles: integer("completed_files").default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const downloadedFiles = pgTable("downloaded_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => downloadJobs.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(), // 'nifty50' | 'indices' | 'stocks' | 'marketActivity' | 'options'
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  downloadDate: text("download_date").notNull(),
  status: text("status").notNull().default("completed"), // 'completed' | 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemStats = pgTable("system_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activeUsers: integer("active_users").default(0),
  totalDownloads: integer("total_downloads").default(0),
  totalFiles: integer("total_files").default(0),
  totalSize: integer("total_size").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertDownloadJobSchema = createInsertSchema(downloadJobs).pick({
  jobType: true,
  startDate: true,
  endDate: true,
  dataSources: true,
  totalFiles: true,
  userId: true,
}).extend({
  jobType: z.enum(['single', 'range']),
  startDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
  endDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format").optional(),
  dataSources: z.array(z.enum(['nifty50', 'indices', 'stocks', 'marketActivity', 'options'])).min(1, "At least one data source must be selected"),
  totalFiles: z.number().optional(),
  userId: z.string().optional(),
});

export const insertDownloadedFileSchema = createInsertSchema(downloadedFiles).pick({
  jobId: true,
  fileName: true,
  fileType: true,
  filePath: true,
  fileSize: true,
  downloadDate: true,
  status: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertDownloadJob = z.infer<typeof insertDownloadJobSchema>;
export type DownloadJob = typeof downloadJobs.$inferSelect;

export type InsertDownloadedFile = z.infer<typeof insertDownloadedFileSchema>;
export type DownloadedFile = typeof downloadedFiles.$inferSelect;

export type SystemStats = typeof systemStats.$inferSelect;

// Data source configuration
export const DATA_SOURCE_CONFIG = {
  nifty50: {
    name: 'Nifty 50 List',
    folder: 'broad',
    url: 'https://archives.nseindia.com/content/indices/ind_nifty50list.csv',
    requiresDate: false,
  },
  indices: {
    name: 'Indices Data',
    folder: 'indices',
    url: 'https://archives.nseindia.com/content/indices/ind_close_all_{date}.csv',
    requiresDate: true,
  },
  stocks: {
    name: 'Stocks Data',
    folder: 'stock',
    url: 'https://archives.nseindia.com/products/content/sec_bhavdata_full_{date}.csv',
    requiresDate: true,
  },
  marketActivity: {
    name: 'Market Activity',
    folder: 'ma',
    url: 'https://archives.nseindia.com/archives/equities/mkt/MA{date}.csv',
    requiresDate: true,
  },
  options: {
    name: 'Options Data',
    folder: 'option',
    url: 'https://archives.nseindia.com/archives/fo/mkt/fo{date}.zip',
    requiresDate: true,
    isZip: true,
  },
} as const;

export type DataSourceKey = keyof typeof DATA_SOURCE_CONFIG;
export type DataSourceConfig = typeof DATA_SOURCE_CONFIG[DataSourceKey];
