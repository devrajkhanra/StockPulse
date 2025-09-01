import DateSelectionPanel from "@/components/date-selection-panel";
import DownloadQueue from "@/components/download-queue";
import RecentDownloadsTable from "@/components/recent-downloads-table";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ChartLine } from "lucide-react";


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ultra-compact, accessible Header */}
      <header className="bg-card border-b border-border shadow-sm py-1">
        <div className="max-w-7xl mx-auto px-1 flex items-center justify-between h-10">
          <div className="flex items-center space-x-1">
            <div className="bg-primary text-primary-foreground p-1 rounded" aria-hidden="true">
              <ChartLine className="text-base" />
            </div>
            <h1 className="text-sm font-semibold text-foreground" style={{ lineHeight: 1.2 }}>NSE Data Downloader</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-1 py-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mb-1">
          <div className="lg:col-span-2">
            <DateSelectionPanel />
          </div>
          <div>
            <DownloadQueue />
          </div>
        </div>
        <div className="mt-1">
          <RecentDownloadsTable />
        </div>
      </main>
    </div>
  );
}
