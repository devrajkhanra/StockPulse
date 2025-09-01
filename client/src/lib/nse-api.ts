import { DATA_SOURCE_CONFIG } from "@shared/schema";

export interface DownloadProgress {
  total: number;
  completed: number;
  percentage: number;
  currentFile?: string;
}

export interface DownloadResult {
  success: boolean;
  fileName: string;
  filePath: string;
  fileSize?: number;
  error?: string;
}

export class NSEDataDownloader {
  private baseDir: string;
  private concurrentLimit: number;

  constructor(baseDir: string = '~/Desktop/NSE-Data/data', concurrentLimit: number = 3) {
    this.baseDir = baseDir;
    this.concurrentLimit = concurrentLimit;
  }

  async downloadDataSources(
    dataSources: string[],
    dates: string[],
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<DownloadResult[]> {
    const results: DownloadResult[] = [];
    const tasks: Array<() => Promise<DownloadResult>> = [];

    // Build task list
    for (const dataSource of dataSources) {
      const config = DATA_SOURCE_CONFIG[dataSource as keyof typeof DATA_SOURCE_CONFIG];
      
      if (dataSource === 'nifty50') {
        // Nifty50 is downloaded only once
        tasks.push(() => this.downloadNifty50());
      } else {
        // Other sources are downloaded for each date
        for (const date of dates) {
          tasks.push(() => this.downloadForDate(dataSource, date));
        }
      }
    }

    const total = tasks.length;
    let completed = 0;

    // Process tasks with concurrency limit
    const executeTask = async (task: () => Promise<DownloadResult>): Promise<DownloadResult> => {
      const result = await task();
      completed++;
      
      onProgress?.({
        total,
        completed,
        percentage: Math.round((completed / total) * 100),
        currentFile: result.fileName,
      });
      
      return result;
    };

    // Execute tasks in batches
    for (let i = 0; i < tasks.length; i += this.concurrentLimit) {
      const batch = tasks.slice(i, i + this.concurrentLimit);
      const batchResults = await Promise.all(batch.map(executeTask));
      results.push(...batchResults);
    }

    return results;
  }

  private async downloadNifty50(): Promise<DownloadResult> {
    try {
      const config = DATA_SOURCE_CONFIG.nifty50;
      const fileName = 'ind_nifty50list.csv';
      const filePath = `${this.baseDir}/${config.folder}/${fileName}`;

      // In a real implementation, this would make an actual HTTP request
      // For now, we simulate the download
      await this.simulateDownload(config.url, filePath);

      return {
        success: true,
        fileName,
        filePath,
        fileSize: Math.floor(Math.random() * 1000000) + 100000, // Random size
      };
    } catch (error) {
      return {
        success: false,
        fileName: 'ind_nifty50list.csv',
        filePath: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async downloadForDate(dataSource: string, date: string): Promise<DownloadResult> {
    try {
      const config = DATA_SOURCE_CONFIG[dataSource as keyof typeof DATA_SOURCE_CONFIG];
      
      let url = config.url;
      let fileName: string;
      
      const formattedDate = this.formatDateForUrl(date, dataSource === 'marketActivity' ? 'ddmmyy' : 'ddmmyyyy');
      url = url.replace('{date}', formattedDate) as any;
      
      if (dataSource === 'indices') {
        fileName = `ind_close_all_${formattedDate}.csv`;
      } else if (dataSource === 'stocks') {
        fileName = `sec_bhavdata_full_${formattedDate}.csv`;
      } else if (dataSource === 'marketActivity') {
        fileName = `MA${formattedDate}.csv`;
      } else if (dataSource === 'options') {
        fileName = `op${formattedDate}.csv`;
      } else {
        fileName = `${dataSource}_${formattedDate}.csv`;
      }

      const filePath = `${this.baseDir}/${config.folder}/${fileName}`;

      // Simulate download
      await this.simulateDownload(url, filePath);

      // Handle ZIP extraction for options data
      if (dataSource === 'options') {
        await this.simulateZipExtraction(filePath, date);
      }

      return {
        success: true,
        fileName,
        filePath,
        fileSize: Math.floor(Math.random() * 10000000) + 1000000, // Random size
      };
    } catch (error) {
      return {
        success: false,
        fileName: `${dataSource}_${date}`,
        filePath: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private formatDateForUrl(date: string, format: 'ddmmyyyy' | 'ddmmyy'): string {
    const [day, month, year] = date.split('/');
    if (format === 'ddmmyyyy') {
      return `${day}${month}${year}`;
    }
    return `${day}${month}${year.slice(-2)}`;
  }

  private async simulateDownload(url: string, filePath: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    // Simulate occasional failures
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error('Network error or file not found');
    }
  }

  private async simulateZipExtraction(zipFilePath: string, date: string): Promise<void> {
    // Simulate ZIP extraction delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In real implementation, this would extract the op[ddmmyyyy].csv file
    // and delete the ZIP file
  }
}
