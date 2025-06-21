import { getLead } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useLeadQuery = (initialData: any, id?: string) => {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => getLead(id as string),
    enabled: !!id,
    initialData,
  });
};
