import DateSelectionPanel from "@/components/date-selection-panel";
import StatusPanel from "@/components/status-panel";
import RecentDownloadsTable from "@/components/recent-downloads-table";
import QuickActions from "@/components/quick-actions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ChartLine, Activity, Bell, Settings, Zap, TrendingUp, Database, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: stats } = useQuery<any>({
    queryKey: ['/api/stats'],
    refetchInterval: 5000,
  });

  const { data: jobs = [] } = useQuery<any[]>({
    queryKey: ['/api/download-jobs'],
    refetchInterval: 2000,
  });

  const activeJobs = jobs.filter(job => job.status === 'running' || job.status === 'pending');
  const completedJobs = jobs.filter(job => job.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Ultra-Compact Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-12 items-center justify-between">
            {/* Compact Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-sm">
                  <ChartLine className="h-4 w-4 text-white" />
                </div>
                {activeJobs.length > 0 && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                )}
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900">NSE Data Downloader</h1>
                <p className="text-xs text-slate-500 leading-none">Professional Data Management</p>
              </div>
            </div>

            {/* Compact Status Bar */}
            <div className="flex items-center gap-2">
              {activeJobs.length > 0 && (
                <Badge variant="default" className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 border-indigo-200">
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  {activeJobs.length} active
                </Badge>
              )}
              
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="hidden sm:inline">Online</span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Bell className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Compact Stats Bar */}
      <div className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-emerald-100 flex items-center justify-center">
                <Users className="h-3 w-3 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Users</p>
                <p className="text-sm font-semibold text-slate-900">
                  {stats?.activeUsers?.toLocaleString() || '0'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center">
                <Database className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Downloads</p>
                <p className="text-sm font-semibold text-slate-900">{jobs.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Success</p>
                <p className="text-sm font-semibold text-slate-900">98.5%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-orange-100 flex items-center justify-center">
                <Zap className="h-3 w-3 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Speed</p>
                <p className="text-sm font-semibold text-slate-900">8.5 MB/s</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Ultra Compact Grid */}
      <main className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Left Column - Configuration (3/5 width) */}
          <div className="xl:col-span-3 space-y-4">
            <DateSelectionPanel />
            <QuickActions />
          </div>

          {/* Right Column - Status and Queue (2/5 width) */}
          <div className="xl:col-span-2 space-y-4">
            <StatusPanel />
          </div>
        </div>

        {/* Recent Downloads - Full Width */}
        <div className="mt-4">
          <RecentDownloadsTable />
        </div>
      </main>

      {/* Floating Quick Action */}
      {activeJobs.length === 0 && (
        <button className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center">
          <ChartLine className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}