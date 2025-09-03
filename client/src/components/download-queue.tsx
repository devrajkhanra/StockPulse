import { useState } from "react";
import { List, CheckCircle, Circle, Trash2, Download, Loader2, Play, Pause, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

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

  const formatJobType = (job: any) => {
    const typeMap: { [key: string]: string } = {
      'nifty50': 'Nifty 50',
      'indices': 'Indices',
      'stocks': 'Stocks',
      'marketActivity': 'Market Activity',
      'options': 'Options',
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
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <List className="h-4 w-4 text-purple-600" />
            Download Queue
          </CardTitle>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {jobs.length} total
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          {jobs.length === 0 ? (
            <div className="text-center py-6">
              <Circle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No downloads yet</p>
            </div>
          ) : (
            <>
              {/* Active Downloads */}
              {activeJobs.map((job: any) => (
                <div
                  key={job.id}
                  className="rounded-lg border border-slate-200/60 bg-white p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm">{getJobIcon(job)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {formatJobType(job)}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Badge
                            variant={job.status === 'running' ? 'default' : 'secondary'}
                            className="text-xs px-1.5 py-0"
                          >
                            {job.status === 'running' ? (
                              <>
                                <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" />
                                Running
                              </>
                            ) : (
                              <>
                                <Circle className="mr-1 h-2.5 w-2.5" />
                                Queued
                              </>
                            )}
                          </Badge>
                          {job.dataSources?.length > 1 && (
                            <span className="text-xs text-slate-500">
                              +{job.dataSources.length - 1} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {job.status === 'running' && (
                    <div className="space-y-1">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                          style={{ width: `${job.progress || 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{job.progress || 0}%</span>
                        <span>{job.completedFiles || 0}/{job.totalFiles || 0}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Completed Downloads (Compact Preview) */}
              {completedJobs.slice(0, 2).map((job: any) => (
                <div
                  key={job.id}
                  className="rounded-lg border border-emerald-200/60 bg-emerald-50/30 p-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm">{getJobIcon(job)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-emerald-900 truncate">
                          {formatJobType(job)}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <CheckCircle className="h-2.5 w-2.5 text-emerald-600" />
                          <span className="text-xs text-emerald-700">
                            {job.completedFiles || 0} files
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {completedJobs.length > 2 && (
          <div className="mt-2 pt-2 border-t border-slate-200/60">
            <p className="text-xs text-slate-500 text-center">
              +{completedJobs.length - 2} more completed downloads
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}