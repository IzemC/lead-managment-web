import { LeadList } from "@/components/lead-list";
import { getLeads } from "@/lib/api";

interface LeadsPageProps {
  searchParams: Promise<{
    page?: string;
    source?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { page, source, startDate, endDate } = await searchParams;

  const filters = {
    source,
    startDate,
    endDate,
  };

  const leadsData = await getLeads(parseInt(page || "1"), filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leads Management</h1>
      <LeadList initialData={leadsData} />
    </div>
  );
}
