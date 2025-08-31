import { List, FolderTree, Server } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <DownloadQueue />

      {/* File Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderTree className="text-primary" />
            <span>File Organization</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <FolderTree className="text-primary h-4 w-4" />
              <span>NSE-Data/data/</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-foreground">broad/</span>
                <span className="text-xs text-muted-foreground">(Nifty 50 List)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-foreground">indices/</span>
                <span className="text-xs text-muted-foreground">(Index Data)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-foreground">stock/</span>
                <span className="text-xs text-muted-foreground">(Stock Data)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-foreground">ma/</span>
                <span className="text-xs text-muted-foreground">(Market Activity)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-foreground">option/</span>
                <span className="text-xs text-muted-foreground">(Options Data)</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Files:</span>
              <span className="font-medium text-foreground" data-testid="text-total-files">
                {stats?.totalFiles || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Total Size:</span>
              <span className="font-medium text-foreground" data-testid="text-total-size">
                {stats ? formatFileSize(stats.totalSize) : '0 MB'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="text-primary" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-secondary rounded-lg">
              <div className="text-2xl font-bold text-accent" data-testid="text-active-users">
                {stats?.activeUsers?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-3 bg-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary" data-testid="text-download-speed">
                8.5 MB/s
              </div>
              <div className="text-xs text-muted-foreground">Avg Speed</div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Server Load:</span>
              <span className="text-accent font-medium" data-testid="text-server-load">Normal</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">API Status:</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-accent font-medium" data-testid="text-api-status">Operational</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
