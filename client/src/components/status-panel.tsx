import { List, FolderTree, Server, Activity } from "lucide-react";
import DownloadQueue from "./download-queue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function StatusPanel() {
  const { data: stats } = useQuery<any>({
    queryKey: ['/api/stats'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatSpeed = (bytesPerSecond: number) => {
    const mbps = bytesPerSecond / (1024 * 1024);
    return `${mbps.toFixed(1)} MB/s`;
  };

  const { data: jobs = [] } = useQuery<any[]>({
    queryKey: ['/api/download-jobs'],
    refetchInterval: 2000,
  });

  const totalFilesInProgress = jobs
    .filter((job: any) => job.status === 'running' || job.status === 'pending')
    .reduce((sum: number, job: any) => sum + (job.totalFiles || 0), 0);

  const totalFilesCompleted = jobs
    .filter((job: any) => job.status === 'running')
    .reduce((sum: number, job: any) => sum + (job.completedFiles || 0), 0);

  return (
    <div className="space-y-4">
      <DownloadQueue />

      {/* File Organization */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base font-sans">
            <FolderTree className="text-primary h-4 w-4" />
            <span>File Organization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground font-mono text-xs">
              <FolderTree className="text-primary h-3 w-3" />
              <span>~/Desktop/NSE-Data/data/</span>
            </div>
            <div className="ml-3 space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <span className="text-foreground text-xs font-sans">broad/</span>
                <span className="text-xs text-muted-foreground">(Nifty 50)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-foreground text-xs font-sans">indices/</span>
                <span className="text-xs text-muted-foreground">(Index Data)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-foreground text-xs font-sans">stock/</span>
                <span className="text-xs text-muted-foreground">(Stock Data)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span className="text-foreground text-xs font-sans">ma/</span>
                <span className="text-xs text-muted-foreground">(Market Activity)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <span className="text-foreground text-xs font-sans">option/</span>
                <span className="text-xs text-muted-foreground">(Options Data)</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            {totalFilesInProgress > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">In Progress:</span>
                <span className="font-medium text-primary download-counter" data-testid="text-files-in-progress">
                  {totalFilesCompleted}/{totalFilesInProgress} files
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Files:</span>
              <span className="font-medium text-foreground download-counter" data-testid="text-total-files">
                {stats?.totalFiles || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Size:</span>
              <span className="font-medium text-foreground download-counter" data-testid="text-total-size">
                {stats ? formatFileSize(stats.totalSize) : '0 MB'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base font-sans">
            <Server className="text-primary h-4 w-4" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-xl font-bold text-accent download-counter" data-testid="text-active-users">
                {stats?.activeUsers?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-muted-foreground font-sans">Active Users</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-xl font-bold text-primary download-counter" data-testid="text-download-speed">
                8.5 MB/s
              </div>
              <div className="text-xs text-muted-foreground font-sans">Avg Speed</div>
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-sans">Server Load:</span>
              <span className="text-accent font-medium font-sans" data-testid="text-server-load">Normal</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-sans">API Status:</span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span className="text-accent font-medium font-sans" data-testid="text-api-status">Operational</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
