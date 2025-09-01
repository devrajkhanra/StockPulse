import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DownloadIcon, 
  TrendingUpIcon, 
  DatabaseIcon, 
  ChartLine, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Clock
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative container mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl">
                  <ChartLine className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-foreground mb-6 tracking-tight">
              NSE Data
              <span className="text-gradient block">Downloader</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional financial data management for National Stock Exchange data files.
              Download, organize, and manage NSE data with enterprise-grade reliability and modern design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                className="btn-primary text-lg px-8 py-4 h-auto shadow-xl"
                onClick={() => window.location.href = "/home"}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>No registration required</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="status-indicator active" />
                <span>System Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Secure Downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>High Performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything you need for NSE data management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern web technologies and designed for professional traders and analysts
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 stagger-children">
          <Card className="interactive-card text-center border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <DownloadIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Bulk Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Download multiple data sources and date ranges efficiently with our advanced download manager and progress tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="interactive-card text-center border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                <TrendingUpIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Real-time Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Track download progress in real-time with detailed statistics, completion status, and performance metrics
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="interactive-card text-center border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                <DatabaseIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Smart Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Automatically organize downloaded files into structured directories with intelligent naming and categorization
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="interactive-card text-center border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">High Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Optimized for speed with concurrent downloads, smart caching, and efficient resource management
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Data Sources Showcase */}
        <Card className="mb-16 border-0 shadow-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl mb-4">Comprehensive Data Coverage</CardTitle>
            <CardDescription className="text-lg">
              Access all major NSE data sources through a unified interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { name: "Nifty 50", icon: "📊", desc: "Current stock listings", color: "from-yellow-400 to-orange-500" },
                { name: "Indices", icon: "📈", desc: "Historical index data", color: "from-green-400 to-emerald-500" },
                { name: "Stocks", icon: "🏢", desc: "Daily bhav data", color: "from-blue-400 to-indigo-500" },
                { name: "Market Activity", icon: "📊", desc: "Activity reports", color: "from-purple-400 to-pink-500" },
                { name: "Options", icon: "⚡", desc: "F&O market data", color: "from-red-400 to-rose-500" },
              ].map((source, index) => (
                <div 
                  key={source.name}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:shadow-lg transition-all duration-300 micro-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn(
                    "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg text-2xl",
                    `bg-gradient-to-br ${source.color}`
                  )}>
                    {source.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{source.name}</h3>
                  <p className="text-sm text-muted-foreground">{source.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center animate-scale-in" style={{ animationDelay: '400ms' }}>
          <Card className="inline-block border-0 shadow-2xl bg-gradient-to-br from-primary/10 to-accent/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to streamline your data workflow?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Join thousands of professionals who trust our platform for their NSE data needs
              </p>
              <Button
                size="lg"
                className="btn-primary text-lg px-8 py-4 h-auto"
                onClick={() => window.location.href = "/home"}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Downloading Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            &copy; 2025 NSE Data Downloader. Professional financial data management solution.
          </p>
        </div>
      </footer>
    </div>
  );
}