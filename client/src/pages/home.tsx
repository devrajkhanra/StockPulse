import { ChartLine, Circle } from "lucide-react";
import DateSelectionPanel from "@/components/date-selection-panel";
import StatusPanel from "@/components/status-panel";
import RecentDownloadsTable from "@/components/recent-downloads-table";
import QuickActions from "@/components/quick-actions";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <ChartLine className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">NSE Data Downloader</h1>
                <p className="text-sm text-muted-foreground">Professional Financial Data Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  Ready
                </div>
                <Circle className="w-2 h-2 fill-accent text-accent" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DateSelectionPanel />
          <StatusPanel />
        </div>

        <RecentDownloadsTable />
        <QuickActions />
      </main>
    </div>
  );
}
