import { useState } from "react";
import { List, CheckCircle, Circle, Trash2, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export default function DownloadQueue() {
  const { data: jobs = [] } = useQuery<any[]>({
    queryKey: ['/api/download-jobs'],
    refetchInterval: 2000, // Refresh every 2 seconds for real-time updates
  });

  const activeJobs = jobs.filter((job: any) =>
    job.status === 'pending' || job.status === 'running'
  );

  const completedJobs = jobs.filter((job: any) =>
    job.status === 'completed'
  );

  const handleClearCompleted = () => {
    // TODO: Implement clear completed jobs
    console.log('Clear completed jobs');
  };

  const formatJobType = (job: any) => {
    const typeMap: { [key: string]: string } = {
      'nifty50': 'Nifty 50 List',
      'indices': 'Indices Data',
      'stocks': 'Stocks Data',
      'marketActivity': 'Market Activity',
      'options': 'Options Data',
    };

    const primarySource = job.dataSources?.[0];
    const sourceName = typeMap[primarySource] || 'Data';

    if (job.jobType === 'single') {
      return `${sourceName} - ${job.startDate}`;
    } else {
      return `${sourceName} - ${job.startDate} to ${job.endDate}`;
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-base font-sans">
            <List className="text-primary h-4 w-4" aria-label="Download Queue" />
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeJobs.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Download className="h-3 w-3 animate-bounce" />
                <span className="download-counter">
                  {activeJobs.reduce((sum, job) => sum + (job.completedFiles || 0), 0)} / {activeJobs.reduce((sum, job) => sum + (job.totalFiles || 0), 0)} files
                </span>
              </div>
            )}
            <span className="text-sm text-muted-foreground download-counter" data-testid="text-queue-progress">
              {completedJobs.length} / {jobs.length} jobs
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activeJobs.length === 0 && completedJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Circle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No downloads in queue</p>
            </div>
          ) : (
            <>
              {/* Active Downloads */}
              {activeJobs.map((job: any) => (
                <div
                  key={job.id}
                  className={cn(
                    "download-item rounded-lg p-3 border-l-4 transition-all duration-200",
                    job.status === 'running'
                      ? "bg-secondary/50 border-l-primary downloading-pulse"
                      : "bg-muted/50 border-l-muted-foreground"
                  )}
                  data-testid={`download-item-${job.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        {job.status === 'running' ? (
                          <Loader2 className="w-3 h-3 text-primary animate-spin" />
                        ) : (
                          <Circle className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium text-secondary-foreground font-sans">
                          {formatJobType(job)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {job.status === 'running' && (
                        <span className="text-xs text-primary font-medium download-counter">
                          {job.completedFiles || 0}/{job.totalFiles || 0}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {job.status === 'running' ? 'Downloading...' : 'Queued'}
                      </span>
                    </div>
                  </div>
                  {job.status === 'running' && (
                    <>
                      <Progress
                        value={job.progress || 0}
                        className="mb-2 h-2 progress-shimmer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="font-medium download-counter">{job.progress || 0}% complete</span>
                        <span className="download-counter">{job.completedFiles || 0} / {job.totalFiles || 0} files</span>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Completed Downloads */}
              {completedJobs.slice(0, 3).map((job: any) => (
                <div
                  key={job.id}
                  className="download-item bg-accent/10 rounded-lg p-3 border-l-4 border-l-accent"
                  data-testid={`completed-item-${job.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-accent h-3 w-3" />
                      <span className="text-sm font-medium text-accent-foreground font-sans">
                        {formatJobType(job)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-accent font-medium download-counter">
                        {job.completedFiles || 0} files
                      </span>
                      <span className="text-xs text-muted-foreground">Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {completedJobs.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCompleted}
              data-testid="button-clear-completed"
              className="text-muted-foreground hover:text-foreground font-sans text-xs"
              title="Clear Completed"
              aria-label="Clear Completed"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
