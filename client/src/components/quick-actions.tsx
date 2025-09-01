import { CalendarDays, Calendar, Settings, Zap, TrendingUp, Clock } from "lucide-react";
// No more Card, Button, Badge imports; use plain HTML and CSS classes
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5em' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em', marginBottom: '1em' }}>
        <div style={{ display: 'flex', height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: 'linear-gradient(135deg, #5b21b6, #7c3aed 80%)' }}>
          <Zap style={{ height: 16, width: 16, color: '#fff' }} />
        </div>
        <h2 style={{ fontSize: '1.25em', fontWeight: 600, color: '#222' }}>Quick Actions</h2>
        <span className="badge text-xs" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Clock style={{ marginRight: 4, height: 12, width: 12 }} />
          One-click
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1em' }}>
        {quickActions.map((action, index) => (
          <button
            key={action.id}
            onClick={action.action}
            disabled={createJobMutation.isPending}
            className="btn-primary"
            style={{ padding: 0, minHeight: 0, animationDelay: `${index * 100}ms` }}
          >
            <div className="card" style={{ width: '100%', border: '1px solid #e5e7eb', background: '#fff', transition: 'box-shadow 0.2s, border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1em' }}>
                <div style={{ display: 'flex', height: 48, width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, #5b21b6, #818cf8 80%)' }}>
                  <action.icon style={{ height: 24, width: 24, color: '#fff' }} />
                </div>
                <span className="badge text-xs">{action.badge}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontWeight: 600, color: '#222', marginBottom: 8, fontSize: '1em' }}>{action.title}</h3>
                <p style={{ fontSize: '0.9em', color: '#6b7280', lineHeight: 1.5 }}>{action.description}</p>
              </div>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', fontSize: '0.75em', color: '#6b7280', opacity: 0.7 }}>
                <span>Click to execute</span>
                {/* Inline SVG for external link */}
                <svg style={{ marginLeft: 4, height: 12, width: 12 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Pro Tips Section */}
      <div className="card" style={{ border: '1px dashed #a5b4fc', background: '#f5f3ff', animation: 'fade-in 0.5s', animationDelay: '300ms', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: '#ede9fe' }}>
            <Zap style={{ height: 16, width: 16, color: '#5b21b6' }} />
          </div>
          <div>
            <h4 style={{ fontWeight: 500, color: '#222', marginBottom: 4 }}>Pro Tip</h4>
            <p style={{ fontSize: '0.9em', color: '#6b7280', lineHeight: 1.5 }}>
              Use "Today's Data" for quick daily updates, or "This Week" for comprehensive historical analysis. <br />
              Configure concurrent downloads based on your network capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}