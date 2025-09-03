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

  return (
    <div className="space-y-4">
      <DownloadQueue />

      {/* Ultra-Compact File Organization */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FolderTree className="h-4 w-4 text-orange-600" />
            File Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
              <FolderTree className="h-3 w-3" />
              ~/NSE-Data/data/
            </div>
            
            <div className="ml-4 space-y-1">
              {[
                { name: 'broad/', color: 'bg-yellow-500', files: '1' },
                { name: 'indices/', color: 'bg-blue-500', files: '45' },
                { name: 'stock/', color: 'bg-green-500', files: '67' },
                { name: 'ma/', color: 'bg-purple-500', files: '12' },
                { name: 'option/', color: 'bg-red-500', files: '8' },
              ].map((folder) => (
                <div key={folder.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${folder.color}`} />
                    <span className="font-mono text-slate-700">{folder.name}</span>
                  </div>
                  <span className="text-slate-500">{folder.files}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <p className="font-semibold text-slate-900">{stats?.totalFiles || 0}</p>
              <p className="text-slate-500">Files</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900">{formatFileSize(stats?.totalSize || 0)}</p>
              <p className="text-slate-500">Size</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ultra-Compact System Status */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Server className="h-4 w-4 text-emerald-600" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Server Load</span>
              <Badge className="text-xs px-2 py-0 bg-emerald-100 text-emerald-700 border-emerald-200">
                Normal
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">API Status</span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700 font-medium">Online</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Data Sources</span>
              <span className="text-slate-700 font-medium">5 Available</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}