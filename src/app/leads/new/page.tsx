import { LeadForm } from "@/components/lead-form";
import { createLead } from "@/lib/api";

export default function NewLeadPage() {
  async function handleSubmit(
    prevState: { success?: boolean; message?: string } | null,
    formData: FormData
  ) {
    "use server";

    const lead = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      source: formData.get("source") as string,
    };

    try {
      const response = await createLead(lead);
      return response;
    } catch (error) {
      return {
        success: false,
        message: "Something wrong happened",
      };
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Lead</h1>
      <LeadForm action={handleSubmit} />
    </div>
  );
}
