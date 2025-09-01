import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

// import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={
            [
              "date-picker-trigger",
              !date ? "date-picker-trigger-placeholder" : "",
              className || ""
            ].filter(Boolean).join(" ")
          }
          disabled={disabled}
          data-testid="date-picker-trigger"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onStartDateChange?: (date: Date | undefined) => void
  onEndDateChange?: (date: Date | undefined) => void
  className?: string
  disabled?: boolean
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
  disabled = false,
}: DateRangePickerProps) {
  return (
    <div className={className ? `date-range-picker ${className}` : "date-range-picker"}>
      <DatePicker
        date={startDate}
        onDateChange={onStartDateChange}
        placeholder="Start date"
        disabled={disabled}
      />
      <DatePicker
        date={endDate}
        onDateChange={onEndDateChange}
        placeholder="End date"
        disabled={disabled}
      />
    </div>
  )
}