"use client";

import { LeadTable } from "@/components/lead-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LeadListResponse } from "@/types/leads";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LeadListProps {
  initialData: LeadListResponse;
  initialFilters: {
    source?: string;
    startDate?: string;
    endDate?: string;
  };
}

export function LeadList({ initialData, initialFilters }: LeadListProps) {
  const router = useRouter();
  const [source, setSource] = useState(initialFilters.source || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialFilters.startDate ? new Date(initialFilters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialFilters.endDate ? new Date(initialFilters.endDate) : undefined
  );

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (source) params.set("source", source);
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());
    params.set("page", "1");
    router.push(`/leads?${params.toString()}`);
  };

  const resetFilters = () => {
    setSource("");
    setStartDate(undefined);
    setEndDate(undefined);
    router.push("/leads");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Source</label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 md:row-start-2 col-span-full justify-self-end">
            <Button onClick={applyFilters}>Apply</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      <LeadTable
        initialData={initialData}
        page={initialData.pagination?.page || 1}
        limit={initialData.pagination?.limit || 10}
      />
    </div>
  );
}
