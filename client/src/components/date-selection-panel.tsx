import { useState } from "react";
import { Calendar, Database, Settings, FolderOpen, Sparkles, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDateForInput, formatDateForDisplay, validateDateRange } from "@/lib/date-utils";
import { DATA_SOURCE_CONFIG, type InsertDownloadJob } from "@shared/schema";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";

const dataSourceOptions = [
  {
    id: 'nifty50',
    label: 'Nifty 50 List',
    file: 'ind_nifty50list.csv',
    icon: '📊',
    description: 'Current list of Nifty 50 stocks'
  },
  {
    id: 'indices',
    label: 'Indices Data',
    file: 'ind_close_all_*.csv',
    icon: '📈',
    description: 'Historical indices closing data'
  },
  {
    id: 'stocks',
    label: 'Stocks Data',
    file: 'sec_bhavdata_full_*.csv',
    icon: '🏢',
    description: 'Daily stock market data'
  },
  {
    id: 'marketActivity',
    label: 'Market Activity',
    file: 'MA*.csv',
    icon: '📊',
    description: 'Market activity reports'
  },
  {
    id: 'options',
    label: 'Options Data',
    file: 'op*.csv (from ZIP)',
    icon: '⚡',
    description: 'F&O market data'
  },
];

export default function DateSelectionPanel() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedSources, setSelectedSources] = useState<string[]>(['nifty50', 'indices', 'stocks']);
  const [concurrentDownloads, setConcurrentDownloads] = useState('3');
  const [downloadPath, setDownloadPath] = useState('~/Desktop/NSE-Data/data');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: async (data: InsertDownloadJob) => {
      const response = await apiRequest('POST', '/api/download-jobs', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "🚀 Download Started",
        description: "Your download job has been queued successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/download-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });

      // Reset form with animation
      setSelectedDate(undefined);
      setStartDate(undefined);
      setEndDate(undefined);
    },
    onError: (error: any) => {
      toast({
        title: "❌ Download Failed",
        description: error.message || "Failed to start download job.",
        variant: "destructive",
      });
    },
  });

  const handleStartDownload = () => {
    if (selectedSources.length === 0) {
      toast({
        title: "⚠️ Validation Error",
        description: "Please select at least one data source.",
        variant: "destructive",
      });
      return;
    }

    let jobData: InsertDownloadJob;

    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-GB');
      jobData = {
        jobType: 'single',
        startDate: formattedDate,
        dataSources: selectedSources as any[],
      };
    } else if (startDate && endDate) {
      const formattedStart = startDate.toLocaleDateString('en-GB');
      const formattedEnd = endDate.toLocaleDateString('en-GB');

      const validation = validateDateRange(formattedStart, formattedEnd);
      if (!validation.isValid) {
        toast({
          title: "⚠️ Validation Error",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      jobData = {
        jobType: 'range',
        startDate: formattedStart,
        endDate: formattedEnd,
        dataSources: selectedSources as any[],
      };
    } else {
      toast({
        title: "⚠️ Validation Error",
        description: "Please select either a single date or a date range.",
        variant: "destructive",
      });
      return;
    }

    createJobMutation.mutate(jobData);
  };

  const handleSourceToggle = (sourceId: string, checked: boolean) => {
    if (checked) {
      setSelectedSources(prev => [...prev, sourceId]);
    } else {
      setSelectedSources(prev => prev.filter(id => id !== sourceId));
    }
  };

  const handleQuickSelect = (preset: string) => {
    switch (preset) {
      case 'all':
        setSelectedSources(['nifty50', 'indices', 'stocks', 'marketActivity', 'options']);
        break;
      case 'essential':
        setSelectedSources(['nifty50', 'indices', 'stocks']);
        break;
      case 'none':
        setSelectedSources([]);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Selection Card */}
      <Card className="interactive-card animate-fade-in">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg">Date Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Single Date Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Single Date</h3>
                <Badge variant="outline" className="text-xs">Quick</Badge>
              </div>
              <DatePicker
                date={selectedDate}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }
                }}
                placeholder="Select a specific date"
                className="w-full form-control"
              />
            </div>

            {/* Date Range Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Date Range</h3>
                <Badge variant="outline" className="text-xs">Bulk</Badge>
              </div>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(date) => {
                  setStartDate(date);
                  if (date) {
                    setSelectedDate(undefined);
                  }
                }}
                onEndDateChange={(date) => {
                  setEndDate(date);
                  if (date) {
                    setSelectedDate(undefined);
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Selection Card */}
      <Card className="interactive-card animate-slide-up" style={{ animationDelay: '100ms' }}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-lg">Data Sources</span>
            </CardTitle>

            {/* Quick Select Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickSelect('essential')}
                className="text-xs micro-bounce"
              >
                Essential
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickSelect('all')}
                className="text-xs micro-bounce"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickSelect('none')}
                className="text-xs micro-bounce"
              >
                None
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
            {dataSourceOptions.map((source, index) => (
              <label
                key={source.id}
                className="group relative flex cursor-pointer rounded-xl border border-border/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3 w-full">
                  <Checkbox
                    checked={selectedSources.includes(source.id)}
                    onCheckedChange={(checked) => handleSourceToggle(source.id, !!checked)}
                    className="mt-0.5 checkbox-enhanced"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{source.icon}</span>
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {source.label}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                      {source.description}
                    </p>
                    <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      {source.file}
                    </code>
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedSources.includes(source.id) && (
                  <div className="absolute top-2 right-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce-subtle" />
                  </div>
                )}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Configuration */}
      <Card className="interactive-card animate-slide-up" style={{ animationDelay: '200ms' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-lg">Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Download Path */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Download Directory
              </Label>
              <div className="flex gap-2">
                <Input
                  value={downloadPath}
                  onChange={(e) => setDownloadPath(e.target.value)}
                  className="form-control font-mono text-sm flex-1"
                  placeholder="Enter download path"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "📁 File Browser",
                      description: "File browser integration coming soon!",
                    });
                  }}
                  className="micro-bounce px-3"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Concurrent Downloads */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Concurrent Downloads
              </Label>
              <Select value={concurrentDownloads} onValueChange={setConcurrentDownloads}>
                <SelectTrigger className="form-control">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dropdown-content">
                  <SelectItem value="1">1 (Conservative)</SelectItem>
                  <SelectItem value="3">3 (Recommended)</SelectItem>
                  <SelectItem value="5">5 (Fast)</SelectItem>
                  <SelectItem value="8">8 (Maximum)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleStartDownload}
              disabled={createJobMutation.isPending}
              className="btn-primary flex-1 h-12"
            >
              {createJobMutation.isPending ? (
                <div className="loading-dots mr-2">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {createJobMutation.isPending ? 'Starting Download...' : 'Start Download'}
            </Button>

            <Button
              variant="outline"
              className="flex-1 h-12 micro-lift"
            >
              <Clock className="mr-2 h-4 w-4" />
              Schedule Download
            </Button>
          </div>

          {/* Selection Summary */}
          {selectedSources.length > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Selected Sources</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSources.map(sourceId => {
                  const source = dataSourceOptions.find(s => s.id === sourceId);
                  return source ? (
                    <Badge key={sourceId} variant="secondary" className="text-xs">
                      {source.icon} {source.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}