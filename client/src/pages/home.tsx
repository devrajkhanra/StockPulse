import DateSelectionPanel from "@/components/date-selection-panel";
import StatusPanel from "@/components/status-panel";
import RecentDownloadsTable from "@/components/recent-downloads-table";
import QuickActions from "@/components/quick-actions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ChartLine, Activity, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import '../styles/main.css'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Modern Header with Apollo-inspired design */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <ChartLine className="h-5 w-5 text-primary-foreground" />
                </div>
                {activeJobs.length > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <div className="status-indicator active" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gradient">
                  NSE Data Downloader
                </h1>
                <p className="text-sm text-muted-foreground">
                  Professional Financial Data Management
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Active Downloads Indicator */}
              {activeJobs.length > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">
                    {activeJobs.length} active
                  </span>
                </div>
              )}

              {/* System Status */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="status-indicator active" />
                <span className="hidden sm:inline">System Operational</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="micro-bounce">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="micro-bounce">
                  <Settings className="h-4 w-4" />
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero Section with Stats */}
        <div className="mb-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.activeUsers?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobs.length.toLocaleString()}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ChartLine className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">98.5%</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Speed</p>
                  <p className="text-2xl font-bold text-foreground">8.5 MB/s</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Configuration */}
          <div className="xl:col-span-3 space-y-6 animate-slide-up">
            <DateSelectionPanel />
            <QuickActions />
          </div>

          {/* Right Column - Status and Queue */}
          <div className="xl:col-span-1 space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <StatusPanel />
          </div>
        </div>

        {/* Recent Downloads Section */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <RecentDownloadsTable />
        </div>
      </main>

      {/* Floating Action Button for Quick Download */}
      {activeJobs.length === 0 && (
        <button className="fab animate-scale-in" style={{ animationDelay: '500ms' }}>
          <ChartLine className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}