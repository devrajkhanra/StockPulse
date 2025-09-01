import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DateSelectionPanel from "@/components/date-selection-panel";
import DownloadQueue from "@/components/download-queue";
import RecentDownloadsTable from "@/components/recent-downloads-table";
import StatusPanel from "@/components/status-panel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ChartLine, LogOutIcon, UserIcon } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl || undefined} />
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium text-foreground">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.email || 'User'}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {user?.email}
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
              >
                <LogOutIcon className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* System Stats */}
        <div className="mb-6">
          <StatusPanel />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <DateSelectionPanel />
          </div>
          <div>
            <DownloadQueue />
          </div>
        </div>

        {/* Downloaded Files */}
        <RecentDownloadsTable />
      </main>
    </div>
  );
}
