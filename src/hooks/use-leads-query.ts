import { getLeads } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useLeadsQuery = (
  page: number,
  initialData: any,
  filters?: { source?: string; startDate?: string; endDate?: string }
) => {
  return useQuery({
    queryKey: ["leads", page, filters ? JSON.stringify(filters) : null],
    queryFn: () => getLeads(page, filters),
    initialData,
    refetchOnMount: true,
  });
};
