import { useState } from "react";
import { Calendar, Database, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDateForInput, formatDateForDisplay, validateDateRange } from "@/lib/date-utils";
import { DATA_SOURCE_CONFIG, type InsertDownloadJob } from "@shared/schema";

const dataSourceOptions = [
  { id: 'nifty50', label: 'Nifty 50 List', file: 'ind_nifty50list.csv' },
  { id: 'indices', label: 'Indices Data', file: 'ind_close_all_*.csv' },
  { id: 'stocks', label: 'Stocks Data', file: 'sec_bhavdata_full_*.csv' },
  { id: 'marketActivity', label: 'Market Activity', file: 'MA*.csv' },
  { id: 'options', label: 'Options Data', file: 'op*.csv (from ZIP)' },
];

export default function DateSelectionPanel() {
  const [selectedDate, setSelectedDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['nifty50', 'indices', 'stocks']);
  const [concurrentDownloads, setConcurrentDownloads] = useState('3');
  const [downloadPath] = useState('~/Desktop/NSE-Data/data');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: async (data: InsertDownloadJob) => {
      const response = await apiRequest('POST', '/api/download-jobs', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Your download job has been started successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/download-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      
      // Reset form
      setSelectedDate('');
      setStartDate('');
      setEndDate('');
    },
    onError: (error: any) => {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to start download job.",
        variant: "destructive",
      });
    },
  });

  const handleStartDownload = () => {
    if (selectedSources.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one data source.",
        variant: "destructive",
      });
      return;
    }

    let jobData: InsertDownloadJob;

    if (selectedDate) {
      // Single date download
      const formattedDate = formatDateForDisplay(selectedDate);
      jobData = {
        jobType: 'single',
        startDate: formattedDate,
        dataSources: selectedSources as any[],
      };
    } else if (startDate && endDate) {
      // Date range download
      const formattedStart = formatDateForDisplay(startDate);
      const formattedEnd = formatDateForDisplay(endDate);
      
      const validation = validateDateRange(formattedStart, formattedEnd);
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
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
        title: "Validation Error",
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
    <div className="lg:col-span-2 space-y-6">
      {/* Date Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="text-primary" />
            <span>Date Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Date Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Single Date</h3>
              <div className="relative">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (e.target.value) {
                      setStartDate('');
                      setEndDate('');
                    }
                  }}
                  data-testid="input-single-date"
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Date Range Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Date Range</h3>
              <div className="space-y-3">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value) {
                      setSelectedDate('');
                    }
                  }}
                  data-testid="input-start-date"
                  placeholder="Start date"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (e.target.value) {
                      setSelectedDate('');
                    }
                  }}
                  data-testid="input-end-date"
                  placeholder="End date"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="text-primary" />
            <span>Data Sources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSourceOptions.map((source) => (
              <label
                key={source.id}
                className="relative flex items-center p-4 bg-secondary rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors"
              >
                <Checkbox
                  checked={selectedSources.includes(source.id)}
                  onCheckedChange={(checked) => handleSourceToggle(source.id, !!checked)}
                  data-testid={`checkbox-${source.id}`}
                  className="mr-3"
                />
                <div>
                  <div className="text-sm font-medium text-secondary-foreground">{source.label}</div>
                  <div className="text-xs text-muted-foreground">{source.file}</div>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="text-primary" />
            <span>Download Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="download-path" className="text-sm font-medium text-muted-foreground">
                Download Path
              </Label>
              <Input
                id="download-path"
                value={downloadPath}
                readOnly
                className="bg-muted"
                data-testid="input-download-path"
              />
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="concurrent-downloads" className="text-sm font-medium text-muted-foreground">
                Concurrent Downloads
              </Label>
              <Select value={concurrentDownloads} onValueChange={setConcurrentDownloads}>
                <SelectTrigger data-testid="select-concurrent-downloads">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (Conservative)</SelectItem>
                  <SelectItem value="3">3 (Recommended)</SelectItem>
                  <SelectItem value="5">5 (Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleStartDownload}
              disabled={createJobMutation.isPending}
              data-testid="button-start-download"
              className="flex-1"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {createJobMutation.isPending ? 'Starting...' : 'Start Download'}
            </Button>
            <Button
              variant="secondary"
              data-testid="button-schedule-download"
              className="flex-1"
            >
              <Settings className="mr-2 h-4 w-4" />
              Schedule Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
