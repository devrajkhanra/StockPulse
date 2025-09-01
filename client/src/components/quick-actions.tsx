import { CalendarDays, Calendar, Settings, Zap, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDateForDisplay } from "@/lib/date-utils";

export default function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/download-jobs', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "🚀 Quick Download Started",
        description: "Your download job has been queued successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/download-jobs'] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Download Failed",
        description: error.message || "Failed to start quick download.",
        variant: "destructive",
      });
    },
  });

  const handleDownloadToday = () => {
    const today = new Date();
    const formattedDate = formatDateForDisplay(today.toISOString().split('T')[0]);
    
    createJobMutation.mutate({
      jobType: 'single',
      startDate: formattedDate,
      dataSources: ['nifty50', 'indices', 'stocks'],
    });
  };

  const handleDownloadWeek = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    const startDate = formatDateForDisplay(weekAgo.toISOString().split('T')[0]);
    const endDate = formatDateForDisplay(today.toISOString().split('T')[0]);
    
    createJobMutation.mutate({
      jobType: 'range',
      startDate,
      endDate,
      dataSources: ['nifty50', 'indices', 'stocks'],
    });
  };

  const handleOpenSettings = () => {
    toast({
      title: "⚙️ Settings",
      description: "Advanced settings panel coming soon!",
    });
  };

  const quickActions = [
    {
      id: 'today',
      title: "Today's Data",
      description: "Download all essential data for today",
      icon: CalendarDays,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      action: handleDownloadToday,
      badge: "Quick",
      badgeVariant: "default" as const,
    },
    {
      id: 'week',
      title: "This Week",
      description: "Bulk download for the past 7 days",
      icon: TrendingUp,
      gradient: "from-blue-500 to-purple-500",
      bgGradient: "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      action: handleDownloadWeek,
      badge: "Bulk",
      badgeVariant: "secondary" as const,
    },
    {
      id: 'settings',
      title: "Advanced Settings",
      description: "Configure download preferences",
      icon: Settings,
      gradient: "from-gray-500 to-slate-500",
      bgGradient: "from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20",
      borderColor: "border-gray-200/50 dark:border-gray-800/30",
      action: handleOpenSettings,
      badge: "Config",
      badgeVariant: "outline" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <Badge variant="outline" className="text-xs">
          <Clock className="mr-1 h-3 w-3" />
          One-click
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        {quickActions.map((action, index) => (
          <Button
            key={action.id}
            variant="ghost"
            onClick={action.action}
            disabled={createJobMutation.isPending}
            className="h-auto p-0 micro-lift"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card className={cn(
              "w-full border transition-all duration-300 hover:shadow-lg",
              action.borderColor,
              `bg-gradient-to-br ${action.bgGradient}`
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl shadow-lg",
                    `bg-gradient-to-br ${action.gradient}`
                  )}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant={action.badgeVariant} className="text-xs">
                    {action.badge}
                  </Badge>
                </div>
                
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-2 text-base">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="mt-4 flex items-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Click to execute</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Button>
        ))}
      </div>

      {/* Pro Tips Section */}
      <Card className="border-dashed border-primary/30 bg-primary/5 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Pro Tip</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use "Today's Data" for quick daily updates, or "This Week" for comprehensive historical analysis. 
                Configure concurrent downloads based on your network capacity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}