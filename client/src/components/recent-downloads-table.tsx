import { History, ExternalLink, RotateCcw, Info, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function RecentDownloadsTable() {
  const { data: files = [] } = useQuery<any[]>({
    queryKey: ['/api/downloaded-files'],
    refetchInterval: 10000,
  });

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    const iconMap: { [key: string]: string } = {
      'nifty50': '📊',
      'indices': '📈',
      'stocks': '🏢',
      'marketActivity': '📊',
      'options': '⚡',
    };
    return iconMap[fileType] || '📄';
  };

  const getFileTypeName = (fileType: string) => {
    const nameMap: { [key: string]: string } = {
      'nifty50': 'Nifty 50',
      'indices': 'Indices',
      'stocks': 'Stocks',
      'marketActivity': 'Market Activity',
      'options': 'Options',
    };
    return nameMap[fileType] || fileType;
  };

  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <History className="h-4 w-4 text-indigo-600" />
            Recent Downloads
          </CardTitle>
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            {files.length} files
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {files.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No downloads yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {files.slice(0, 8).map((file: any) => (
              <div
                key={file.id}
                className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm">{getFileIcon(file.fileType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-900 truncate">
                        {getFileTypeName(file.fileType)}
                      </p>
                      <Badge
                        className={`text-xs px-1.5 py-0 ${
                          file.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}
                      >
                        {file.status === 'completed' ? (
                          <CheckCircle className="h-2.5 w-2.5 mr-1" />
                        ) : (
                          <AlertCircle className="h-2.5 w-2.5 mr-1" />
                        )}
                        {file.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 font-mono">{file.downloadDate}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{formatFileSize(file.fileSize)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {file.status === 'completed' ? (
                    <>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600">
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {files.length > 8 && (
              <div className="text-center pt-2 border-t border-slate-200/60">
                <p className="text-xs text-slate-500">+{files.length - 8} more files</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}