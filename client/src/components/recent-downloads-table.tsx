import { History, ExternalLink, RotateCcw, Info, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

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
      'nifty50': 'Nifty 50 List',
      'indices': 'Indices Data',
      'stocks': 'Stocks Data',
      'marketActivity': 'Market Activity',
      'options': 'Options Data',
    };
    return nameMap[fileType] || fileType;
  };

  const handleOpenFile = (filePath: string) => {
    console.log('Open file:', filePath);
  };

  const handleRedownload = (file: any) => {
    console.log('Redownload file:', file);
  };

  const handleRetry = (file: any) => {
    console.log('Retry download:', file);
  };

  const handleViewError = (file: any) => {
    console.log('View error for file:', file);
  };

  const handleClearHistory = () => {
    console.log('Clear history');
  };

  return (
    <Card className="interactive-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-lg">Recent Downloads</span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {files.length} files
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-muted-foreground hover:text-destructive micro-bounce"
            >
              Clear History
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No downloads yet</h3>
            <p className="text-sm text-muted-foreground">
              Your download history will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border/50">
            <Table className="data-table">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold text-foreground">Date</TableHead>
                  <TableHead className="font-semibold text-foreground">Data Type</TableHead>
                  <TableHead className="font-semibold text-foreground">Size</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file: any, index) => (
                  <TableRow 
                    key={file.id} 
                    className={cn(
                      "group transition-all duration-200 hover:bg-muted/30",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{file.downloadDate}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getFileIcon(file.fileType)}</span>
                        <div>
                          <div className="font-medium text-foreground text-sm">
                            {getFileTypeName(file.fileType)}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {file.fileName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-mono text-sm text-muted-foreground">
                        {formatFileSize(file.fileSize)}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        className={cn(
                          "status-badge",
                          file.status === 'completed' ? 'completed' : 'failed'
                        )}
                      >
                        {file.status === 'completed' ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            Failed
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.status === 'completed' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenFile(file.filePath)}
                              className="micro-bounce h-8 w-8 p-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRedownload(file)}
                              className="micro-bounce h-8 w-8 p-0"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRetry(file)}
                              className="micro-bounce h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewError(file)}
                              className="micro-bounce h-8 w-8 p-0"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}