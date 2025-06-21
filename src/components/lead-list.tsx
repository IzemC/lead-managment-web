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
import { Skeleton } from "@/components/ui/skeleton";
import { useLeadsQuery } from "@/hooks/use-leads-query";
import { cn } from "@/lib/utils";
import { type LeadListResponse } from "@/types/leads";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LeadList({ initialData }: { initialData?: LeadListResponse }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const source = searchParams.get("source") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const [localFilters, setLocalFilters] = useState({
    source,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  });

  const { data, isLoading } = useLeadsQuery(page, initialData, {
    source,
    startDate,
    endDate,
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (localFilters.source) params.set("source", localFilters.source);
    if (localFilters.startDate)
      params.set("startDate", localFilters.startDate.toISOString());
    if (localFilters.endDate)
      params.set("endDate", localFilters.endDate.toISOString());
    params.set("page", "1");
    router.push(`/leads?${params.toString()}`);
  };

  const resetFilters = () => {
    setLocalFilters({ source: "", startDate: undefined, endDate: undefined });
    router.push(`/leads?page=1`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Source</label>
            <Select
              value={localFilters.source}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, source: value }))
              }
            >
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
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localFilters.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localFilters.startDate ? (
                    format(localFilters.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={localFilters.startDate}
                  onSelect={(date) =>
                    setLocalFilters((prev) => ({ ...prev, startDate: date }))
                  }
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
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localFilters.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localFilters.endDate ? (
                    format(localFilters.endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={localFilters.endDate}
                  onSelect={(date) =>
                    setLocalFilters((prev) => ({ ...prev, endDate: date }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 md:row-start-2 col-span-full justify-self-end">
            <Button onClick={applyFilters} disabled={isLoading}>
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <LeadTable data={data} page={page} isLoading={isLoading} />
      )}
    </div>
  );
}
