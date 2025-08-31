import { CalendarDays, Calendar, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        title: "Download Started",
        description: "Quick download job has been started successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/download-jobs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Download Failed",
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
    console.log('Open settings');
    // TODO: Implement settings modal or page
    toast({
      title: "Settings",
      description: "Settings panel coming soon!",
    });
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button
        variant="ghost"
        onClick={handleDownloadToday}
        disabled={createJobMutation.isPending}
        data-testid="button-download-today"
        className="h-auto p-0"
      >
        <Card className="w-full border border-border hover:bg-muted/50 transition-colors group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 text-primary p-3 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-card-foreground">Download Today's Data</h3>
                <p className="text-sm text-muted-foreground mt-1">Get all available data for today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Button>
      
      <Button
        variant="ghost"
        onClick={handleDownloadWeek}
        disabled={createJobMutation.isPending}
        data-testid="button-download-week"
        className="h-auto p-0"
      >
        <Card className="w-full border border-border hover:bg-muted/50 transition-colors group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-accent/10 text-accent p-3 rounded-lg group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-card-foreground">Download This Week</h3>
                <p className="text-sm text-muted-foreground mt-1">Get all data for current week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Button>
      
      <Button
        variant="ghost"
        onClick={handleOpenSettings}
        data-testid="button-open-settings"
        className="h-auto p-0"
      >
        <Card className="w-full border border-border hover:bg-muted/50 transition-colors group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary text-secondary-foreground p-3 rounded-lg group-hover:bg-muted-foreground group-hover:text-background transition-colors">
                <Settings className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-card-foreground">Settings</h3>
                <p className="text-sm text-muted-foreground mt-1">Configure download preferences</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Button>
    </div>
  );
}
