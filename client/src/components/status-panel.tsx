import { FolderTree, Server, Activity, TrendingUp, Database, Zap } from "lucide-react";
import DownloadQueue from "./download-queue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function StatusPanel() {
  const { data: stats = {} } = useQuery<any>({
    queryKey: ['/api/stats'],
    refetchInterval: 5000,
  });

  const { data: jobs = [] } = useQuery<any[]>({
    queryKey: ['/api/download-jobs'],
    refetchInterval: 2000,
  });

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const totalFilesInProgress = jobs
    .filter((job: any) => job.status === 'running' || job.status === 'pending')
    .reduce((sum: number, job: any) => sum + (job.totalFiles || 0), 0);

  const totalFilesCompleted = jobs
    .filter((job: any) => job.status === 'running')
    .reduce((sum: number, job: any) => sum + (job.completedFiles || 0), 0);

  return (
    <div className="space-y-6">
      <DownloadQueue />

      {/* File Organization */}
      <Card className="interactive-card animate-slide-up" style={{ animationDelay: '150ms' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <FolderTree className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-lg">File Organization</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Directory Structure */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <FolderTree className="h-4 w-4 text-primary" />
              <span>~/Desktop/NSE-Data/data/</span>
            </div>
            
            <div className="ml-6 space-y-2">
              {[
                { name: 'broad/', desc: 'Nifty 50', color: 'bg-yellow-500', count: '1 file' },
                { name: 'indices/', desc: 'Index Data', color: 'bg-blue-500', count: '45 files' },
                { name: 'stock/', desc: 'Stock Data', color: 'bg-green-500', count: '67 files' },
                { name: 'ma/', desc: 'Market Activity', color: 'bg-purple-500', count: '12 files' },
                { name: 'option/', desc: 'Options Data', color: 'bg-red-500', count: '8 files' },
              ].map((folder, index) => (
                <div 
                  key={folder.name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${folder.color}`} />
                    <span className="text-sm font-medium text-foreground">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">({folder.desc})</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {folder.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          {/* Storage Stats */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            {totalFilesInProgress > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">In Progress</span>
                </div>
                <span className="font-mono text-sm text-primary font-medium">
                  {totalFilesCompleted}/{totalFilesInProgress}
                </span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-foreground font-mono">
                  {stats?.totalFiles || 0}
                </div>
                <div className="text-xs text-muted-foreground">Total Files</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-foreground font-mono">
                  {formatFileSize(stats?.totalSize || 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total Size</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="interactive-card animate-slide-up" style={{ animationDelay: '200ms' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Server className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-lg">System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                {stats?.activeUsers?.toLocaleString() || '0'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">Avg Speed</span>
              </div>
              <span className="text-lg font-bold font-mono text-blue-700 dark:text-blue-300">
                8.5 MB/s
              </span>
            </div>
          </div>
          
          {/* System Health */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Server Load</span>
              </div>
              <Badge className="status-badge completed">
                Normal
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">API Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-indicator active" />
                <Badge className="status-badge completed">
                  Operational
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Data Sources</span>
              </div>
              <Badge variant="outline" className="text-xs">
                5 Available
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}