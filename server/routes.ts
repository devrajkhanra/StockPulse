import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertDownloadJobSchema,
  DATA_SOURCE_CONFIG,
  type DataSourceKey,
} from "@shared/schema";
import { z } from "zod";
import axios from "axios";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import AdmZip from "adm-zip";

function formatDateForUrl(date: string, format: "ddmmyyyy" | "ddmmyy"): string {
  const [day, month, year] = date.split("/");
  if (format === "ddmmyyyy") {
    return `${day}${month}${year}`;
  }
  return `${day}${month}${year.slice(-2)}`;
}

async function downloadFile(url: string, filePath: string): Promise<number> {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    timeout: 30000,
  });

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const writer = createWriteStream(filePath);
  await pipeline(response.data, writer);

  const stats = await fs.stat(filePath);
  return stats.size;
}

async function extractOptionsFile(
  zipFilePath: string,
  targetDir: string,
  date: string
): Promise<string> {
  const zip = new AdmZip(zipFilePath);
  const entries = zip.getEntries();

  const formattedDate = formatDateForUrl(date, "ddmmyyyy");
  const targetFileName = `op${formattedDate}.csv`;

  const entry = entries.find(
    (e: any) =>
      e.entryName.toLowerCase().includes("op") && e.entryName.endsWith(".csv")
  );
  if (!entry) {
    throw new Error(`Options file ${targetFileName} not found in ZIP archive`);
  }

  const extractPath = path.join(targetDir, targetFileName);
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(extractPath, entry.getData());

  // Delete the ZIP file
  await fs.unlink(zipFilePath);

  return extractPath;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get system stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get system stats" });
    }
  });

  // Get download jobs (public, returns all jobs)
  app.get("/api/download-jobs", async (_req, res) => {
    try {
      const jobs = await storage.getUserDownloadJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get download jobs" });
    }
  });

  // Get recent downloaded files
  app.get("/api/downloaded-files", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const files = await storage.getRecentDownloadedFiles(limit);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to get downloaded files" });
    }
  });

  // Create download job (public)
  app.post("/api/download-jobs", async (req, res) => {
    try {
      const validatedData = insertDownloadJobSchema.parse(req.body);
      // Calculate total files to download
      let totalFiles = 0;
      const dates: string[] = [];
      if (validatedData.jobType === "single") {
        dates.push(validatedData.startDate);
      } else {
        // Generate date range
        const start = new Date(
          validatedData.startDate.split("/").reverse().join("-")
        );
        const end = new Date(
          validatedData.endDate!.split("/").reverse().join("-")
        );
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          const formatted = d.toLocaleDateString("en-GB");
          dates.push(formatted);
        }
      }
      totalFiles = dates.length * validatedData.dataSources.length;
      if (validatedData.dataSources.includes("nifty50")) {
        totalFiles -= dates.length - 1; // Nifty50 is downloaded only once
      }
      const job = await storage.createDownloadJob({
        ...validatedData,
        totalFiles,
        userId: undefined,
      });
      // Start download process asynchronously
      processDownloadJob(job.id).catch(console.error);
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create download job" });
      }
    }
  });

  // Get specific download job (public)
  app.get("/api/download-jobs/:id", async (req, res) => {
    try {
      const job = await storage.getDownloadJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Download job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to get download job" });
    }
  });

  // Process download job
  async function processDownloadJob(jobId: string) {
    try {
      const job = await storage.getDownloadJob(jobId);
      if (!job) return;

      await storage.updateDownloadJob(jobId, { status: "running" });

      const baseDir = path.join(os.homedir(), "Desktop", "NSE-Data", "data");
      let completedFiles = 0;

      // Generate dates array
      const dates: string[] = [];
      if (job.jobType === "single") {
        dates.push(job.startDate);
      } else {
        const start = new Date(job.startDate.split("/").reverse().join("-"));
        const end = new Date(job.endDate!.split("/").reverse().join("-"));

        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          const formatted = d.toLocaleDateString("en-GB");
          dates.push(formatted);
        }
      }

      // Process each data source
      for (const dataSource of job.dataSources) {
        const config = DATA_SOURCE_CONFIG[dataSource as DataSourceKey];
        const targetDir = path.join(baseDir, config.folder);

        if (dataSource === "nifty50") {
          // Download Nifty50 list once
          try {
            const fileName = "ind_nifty50list.csv";
            const filePath = path.join(targetDir, fileName);
            const fileSize = await downloadFile(config.url, filePath);

            await storage.createDownloadedFile({
              jobId,
              fileName,
              fileType: dataSource,
              filePath,
              fileSize,
              downloadDate: dates[0],
              status: "completed",
            });

            completedFiles++;
            const progress = Math.round(
              (completedFiles / (job.totalFiles || 1)) * 100
            );
            await storage.updateDownloadJob(jobId, {
              completedFiles,
              progress,
            });
          } catch (error) {
            console.error(`Failed to download ${dataSource}:`, error);
          }
        } else {
          // Download for each date
          for (const date of dates) {
            try {
              let url = config.url;
              let fileName: string;

              if (dataSource === "marketActivity") {
                const formattedDate = formatDateForUrl(date, "ddmmyy");
                url = url.replace("{date}", formattedDate) as any;
                fileName = `MA${formattedDate}.csv`;
              } else if (dataSource === "options") {
                const formattedDate = formatDateForUrl(date, "ddmmyyyy");
                url = url.replace("{date}", formattedDate) as any;
                fileName = `fo${formattedDate}.zip`;
              } else {
                const formattedDate = formatDateForUrl(date, "ddmmyyyy");
                url = url.replace("{date}", formattedDate) as any;
                fileName =
                  dataSource === "indices"
                    ? `ind_close_all_${formattedDate}.csv`
                    : `sec_bhavdata_full_${formattedDate}.csv`;
              }

              const filePath = path.join(targetDir, fileName);
              const fileSize = await downloadFile(url, filePath);

              let finalPath = filePath;
              let finalFileName = fileName;

              // Handle ZIP extraction for options
              if (dataSource === "options") {
                finalPath = await extractOptionsFile(filePath, targetDir, date);
                finalFileName = path.basename(finalPath);
              }

              await storage.createDownloadedFile({
                jobId,
                fileName: finalFileName,
                fileType: dataSource,
                filePath: finalPath,
                fileSize,
                downloadDate: date,
                status: "completed",
              });

              completedFiles++;
              const progress = Math.round(
                (completedFiles / (job.totalFiles || 1)) * 100
              );
              await storage.updateDownloadJob(jobId, {
                completedFiles,
                progress,
              });
            } catch (error) {
              console.error(
                `Failed to download ${dataSource} for ${date}:`,
                error
              );

              await storage.createDownloadedFile({
                jobId,
                fileName: `${dataSource}_${date}_failed`,
                fileType: dataSource,
                filePath: "",
                fileSize: 0,
                downloadDate: date,
                status: "failed",
              });
            }
          }
        }
      }

      await storage.updateDownloadJob(jobId, {
        status: "completed",
        progress: 100,
      });
    } catch (error) {
      console.error(`Job ${jobId} failed:`, error);
      await storage.updateDownloadJob(jobId, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
