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
    label: 'Nifty 50',
    file: 'ind_nifty50list.csv',
    icon: '📊',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'indices',
    label: 'Indices',
    file: 'ind_close_all_*.csv',
    icon: '📈',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    id: 'stocks',
    label: 'Stocks',
    file: 'sec_bhavdata_full_*.csv',
    icon: '🏢',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    id: 'marketActivity',
    label: 'Market Activity',
    file: 'MA*.csv',
    icon: '📊',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    id: 'options',
    label: 'Options',
    file: 'op*.csv',
    icon: '⚡',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
];

export default function DateSelectionPanel() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedSources, setSelectedSources] = useState<string[]>(['nifty50', 'indices', 'stocks']);
  const [concurrentDownloads, setConcurrentDownloads] = useState('3');

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

  return (
    <div className="space-y-4">
      {/* Ultra-Compact Date Selection */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Date Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Single Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-slate-600">Single Date</Label>
                <Badge variant="outline" className="text-xs px-1.5 py-0">Quick</Badge>
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
                placeholder="Select date"
                className="h-8 text-xs"
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-slate-600">Date Range</Label>
                <Badge variant="outline" className="text-xs px-1.5 py-0">Bulk</Badge>
              </div>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(date) => {
                  setStartDate(date);
                  if (date) setSelectedDate(undefined);
                }}
                onEndDateChange={(date) => {
                  setEndDate(date);
                  if (date) setSelectedDate(undefined);
                }}
                className="grid grid-cols-2 gap-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ultra-Compact Data Sources */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-emerald-600" />
              Data Sources
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSources(['nifty50', 'indices', 'stocks'])}
                className="h-6 px-2 text-xs"
              >
                Essential
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSources(['nifty50', 'indices', 'stocks', 'marketActivity', 'options'])}
                className="h-6 px-2 text-xs"
              >
                All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {dataSourceOptions.map((source) => (
              <label
                key={source.id}
                className="group relative flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200/60 p-2 transition-all hover:border-indigo-300 hover:bg-indigo-50/50"
              >
                <Checkbox
                  checked={selectedSources.includes(source.id)}
                  onCheckedChange={(checked) => handleSourceToggle(source.id, !!checked)}
                  className="h-3.5 w-3.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{source.icon}</span>
                    <span className="text-xs font-medium text-slate-900 truncate">
                      {source.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono truncate">
                    {source.file}
                  </p>
                </div>
                {selectedSources.includes(source.id) && (
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                )}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ultra-Compact Configuration & Actions */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            {/* Concurrent Downloads */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-600">Concurrency</Label>
              <Select value={concurrentDownloads} onValueChange={setConcurrentDownloads}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (Safe)</SelectItem>
                  <SelectItem value="3">3 (Recommended)</SelectItem>
                  <SelectItem value="5">5 (Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-2 flex gap-2">
              <Button
                onClick={handleStartDownload}
                disabled={createJobMutation.isPending}
                className="flex-1 h-8 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {createJobMutation.isPending ? (
                  <>
                    <div className="h-3 w-3 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Start Download
                  </>
                )}
              </Button>

              <Button variant="outline" className="h-8 px-3 text-xs">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                Schedule
              </Button>
            </div>
          </div>

          {/* Compact Selection Summary */}
          {selectedSources.length > 0 && (
            <div className="mt-3 p-2 rounded-md bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-slate-700">Selected:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSources.map(sourceId => {
                    const source = dataSourceOptions.find(s => s.id === sourceId);
                    return source ? (
                      <span key={sourceId} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border ${source.color}`}>
                        {source.icon} {source.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}