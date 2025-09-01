import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadIcon, TrendingUpIcon, DatabaseIcon, ShieldIcon } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            NSE Data Downloader
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Professional financial data management for National Stock Exchange (NSE) data files.
            Download, organize, and manage NSE data with ease.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = "/home"}
          >
            Get Started
          </Button>
        </header>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <DownloadIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Bulk Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Download multiple data sources and date ranges efficiently with our advanced download manager
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUpIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Real-time Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track download progress in real-time with detailed statistics and completion status
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <DatabaseIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Organized Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically organize downloaded files into structured directories for easy access
              </CardDescription>
            </CardContent>
          </Card>

          {/*
          <Card className="text-center">
            <CardHeader>
              <ShieldIcon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Secure Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Secure user authentication and session management for protected data access
              </CardDescription>
            </CardContent>
          </Card>
          */}
        </div>

        {/* Data Sources */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Supported Data Sources</CardTitle>
            <CardDescription>
              Access all major NSE data sources in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400">Nifty 50</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Current list of Nifty 50 stocks</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold text-green-600 dark:text-green-400">Indices</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Historical indices data</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold text-purple-600 dark:text-purple-400">Stocks</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Daily stock bhav data</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold text-orange-600 dark:text-orange-400">Market Activity</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Market activity reports</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold text-red-600 dark:text-red-400">Options</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">F&O market data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2025 NSE Data Downloader. Professional financial data management solution.</p>
        </footer>
      </div>
    </div>
  );
}