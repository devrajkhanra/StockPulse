import { CalendarDays, Calendar, Settings, Zap, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const quickActions = [
    {
      id: 'today',
      title: "Today's Data",
      icon: CalendarDays,
      action: handleDownloadToday,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 border-emerald-200',
    },
    {
      id: 'week',
      title: "This Week",
      icon: TrendingUp,
      action: handleDownloadWeek,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'settings',
      title: "Settings",
      icon: Settings,
      action: () => toast({ title: "⚙️ Settings", description: "Coming soon!" }),
      color: 'from-slate-500 to-gray-500',
      bgColor: 'bg-slate-50 border-slate-200',
    },
  ];

  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-violet-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              onClick={action.action}
              disabled={createJobMutation.isPending}
              variant="outline"
              className={`h-16 p-2 flex flex-col items-center justify-center gap-1 ${action.bgColor} hover:shadow-sm transition-all`}
            >
              <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                <action.icon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs font-medium">{action.title}</span>
            </Button>
          ))}
        </div>

        {/* Compact Pro Tip */}
        <div className="mt-3 p-2 rounded-md bg-violet-50 border border-violet-200/60">
          <div className="flex items-start gap-2">
            <Zap className="h-3.5 w-3.5 text-violet-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-violet-900">Pro Tip</p>
              <p className="text-xs text-violet-700 leading-relaxed">
                Use quick actions for daily updates or configure custom downloads above.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}