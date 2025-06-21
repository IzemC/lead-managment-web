import { LeadForm } from "@/components/lead-form";
import { getLead, updateLead } from "@/lib/api";
import { notFound } from "next/navigation";

interface LeadDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await getLead(id).catch(() => notFound());

  async function handleSubmit(prevState: any, formData: FormData) {
    "use server";

    const updates = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      source: formData.get("source") as string,
    };

    try {
      const d = await updateLead(id, updates);
      console.log(d);

      return d;
    } catch (error) {
      console.log("erro", error);

      return {
        success: false,
        message: "Something wrong happened",
      };
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lead Details</h1>
      <LeadForm action={handleSubmit} initialData={lead.data} />
    </div>
  );
}
