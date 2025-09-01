import { useState } from "react";
import { List, CheckCircle, Circle, Trash2, Download, Loader2, Play, Pause, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DownloadQueue() {
  const { data: jobs = [] } = useQuery<any[]>({
    queryKey: ['/api/download-jobs'],
    refetchInterval: 2000,
  });

  const activeJobs = jobs.filter((job: any) =>
    job.status === 'pending' || job.status === 'running'
  );

  const completedJobs = jobs.filter((job: any) =>
    job.status === 'completed'
  );

  const handleClearCompleted = () => {
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

  const getJobIcon = (job: any) => {
    const iconMap: { [key: string]: string } = {
      'nifty50': '📊',
      'indices': '📈',
      'stocks': '🏢',
      'marketActivity': '📊',
      'options': '⚡',
    };
    return iconMap[job.dataSources?.[0]] || '📄';
  };

  return (
    <Card className="interactive-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <List className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-lg">Download Queue</span>
          </CardTitle>
          
          {/* Queue Stats */}
          <div className="flex items-center gap-3">
            {activeJobs.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="status-indicator active" />
                <span className="font-mono">
                  {activeJobs.reduce((sum, job) => sum + (job.completedFiles || 0), 0)} / 
                  {activeJobs.reduce((sum, job) => sum + (job.totalFiles || 0), 0)}
                </span>
              </div>
            )}
            <Badge variant="secondary" className="font-mono text-xs">
              {completedJobs.length} / {jobs.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                <Circle className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No downloads yet</h3>
              <p className="text-sm text-muted-foreground">
                Start your first download to see progress here
              </p>
            </div>
          ) : (
            <div className="space-y-3 stagger-children">
              {/* Active Downloads */}
              {activeJobs.map((job: any) => (
                <div
                  key={job.id}
                  className={cn(
                    "group relative rounded-xl border p-4 transition-all duration-300",
                    job.status === 'running'
                      ? "border-primary/30 bg-primary/5 shadow-md"
                      : "border-border/50 bg-card hover:border-border hover:shadow-sm"
                  )}
                >
                  {/* Job Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{getJobIcon(job)}</div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">
                          {formatJobType(job)}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={job.status === 'running' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {job.status === 'running' ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Downloading
                              </>
                            ) : (
                              <>
                                <Circle className="mr-1 h-3 w-3" />
                                Queued
                              </>
                            )}
                          </Badge>
                          {job.dataSources?.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.dataSources.length - 1} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Job Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="dropdown-content">
                        <DropdownMenuItem>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Progress Section */}
                  {job.status === 'running' && (
                    <div className="space-y-2">
                      <div className="progress-enhanced">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${job.progress || 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="font-medium">{job.progress || 0}% complete</span>
                        <span className="font-mono">
                          {job.completedFiles || 0} / {job.totalFiles || 0} files
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Completed Downloads Preview */}
              {completedJobs.slice(0, 2).map((job: any) => (
                <div
                  key={job.id}
                  className="group rounded-xl border border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{getJobIcon(job)}</div>
                      <div>
                        <h4 className="font-medium text-emerald-900 dark:text-emerald-100 text-sm">
                          {formatJobType(job)}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="status-badge completed text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                            {job.completedFiles || 0} files
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity micro-bounce">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Queue Actions */}
        {completedJobs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {completedJobs.length} completed downloads
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCompleted}
                className="text-muted-foreground hover:text-destructive micro-bounce"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Completed
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}