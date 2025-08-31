import { useState } from "react";
import { List, CheckCircle, Circle, Trash2 } from "lucide-react";
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <List className="text-primary" />
            <span>Download Queue</span>
          </CardTitle>
          <span className="text-sm text-muted-foreground" data-testid="text-queue-progress">
            {completedJobs.length} / {jobs.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
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
                    "download-item rounded-lg p-4 border-l-4",
                    job.status === 'running' ? "bg-secondary border-l-primary" : "bg-muted border-l-muted-foreground"
                  )}
                  data-testid={`download-item-${job.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        job.status === 'running' ? "bg-primary animate-pulse" : "bg-muted-foreground"
                      )} />
                      <span className="text-sm font-medium text-secondary-foreground">
                        {formatJobType(job)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {job.status === 'running' ? 'Downloading...' : 'Queued'}
                    </span>
                  </div>
                  {job.status === 'running' && (
                    <>
                      <Progress value={job.progress || 0} className="mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{job.progress || 0}% complete</span>
                        <span>{job.completedFiles || 0} / {job.totalFiles || 0} files</span>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Completed Downloads */}
              {completedJobs.slice(0, 3).map((job: any) => (
                <div
                  key={job.id}
                  className="download-item bg-accent/10 rounded-lg p-4 border-l-4 border-l-accent"
                  data-testid={`completed-item-${job.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-accent h-4 w-4" />
                      <span className="text-sm font-medium text-accent-foreground">
                        {formatJobType(job)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Completed</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {completedJobs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCompleted}
              data-testid="button-clear-completed"
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Clear Completed
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
