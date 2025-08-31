import { History, ExternalLink, RotateCcw, Info, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

export default function RecentDownloadsTable() {
  const { data: files = [] } = useQuery<any[]>({
    queryKey: ['/api/downloaded-files'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    const iconMap: { [key: string]: string } = {
      'nifty50': 'fas fa-list',
      'indices': 'fas fa-chart-line',
      'stocks': 'fas fa-building',
      'marketActivity': 'fas fa-chart-bar',
      'options': 'fas fa-file-archive',
    };
    return iconMap[fileType] || 'fas fa-file-csv';
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
    // TODO: Implement file opening logic
  };

  const handleRedownload = (file: any) => {
    console.log('Redownload file:', file);
    // TODO: Implement redownload logic
  };

  const handleRetry = (file: any) => {
    console.log('Retry download:', file);
    // TODO: Implement retry logic
  };

  const handleViewError = (file: any) => {
    console.log('View error for file:', file);
    // TODO: Implement error viewing logic
  };

  const handleClearHistory = () => {
    console.log('Clear history');
    // TODO: Implement clear history logic
  };

  return (
    <div className="mt-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-base font-sans">
              <History className="text-primary h-4 w-4" />
              <span>Recent Downloads</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              data-testid="button-clear-history"
              className="text-muted-foreground hover:text-foreground font-sans text-xs"
            >
              Clear History
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {files.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="font-sans text-sm">No recent downloads</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans text-xs">Date</TableHead>
                    <TableHead className="font-sans text-xs">Data Type</TableHead>
                    <TableHead className="font-sans text-xs">Size</TableHead>
                    <TableHead className="font-sans text-xs">Status</TableHead>
                    <TableHead className="font-sans text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file: any) => (
                    <TableRow 
                      key={file.id} 
                      className="hover:bg-muted/50 transition-colors"
                      data-testid={`table-row-${file.id}`}
                    >
                      <TableCell className="font-medium font-sans text-sm">{file.downloadDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <i className={`${getFileIcon(file.fileType)} text-primary text-xs`} />
                          <span className="font-sans text-sm">{getFileTypeName(file.fileType)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground download-counter text-sm">
                        {file.fileSize ? formatFileSize(file.fileSize) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={file.status === 'completed' ? 'default' : 'destructive'}
                          className={`${file.status === 'completed' ? 'bg-accent/10 text-accent' : ''} font-sans text-xs`}
                          data-testid={`badge-status-${file.id}`}
                        >
                          {file.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {file.status === 'failed' && <Info className="mr-1 h-3 w-3" />}
                          {file.status === 'completed' ? 'Completed' : 'Failed'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {file.status === 'completed' ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenFile(file.filePath)}
                                data-testid={`button-open-${file.id}`}
                                className="text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRedownload(file)}
                                data-testid={`button-redownload-${file.id}`}
                                className="text-muted-foreground hover:text-foreground"
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
                                data-testid={`button-retry-${file.id}`}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewError(file)}
                                data-testid={`button-view-error-${file.id}`}
                                className="text-muted-foreground hover:text-foreground"
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
    </div>
  );
}
