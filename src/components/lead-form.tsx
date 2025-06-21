"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLeadQuery } from "@/hooks/use-lead";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface LeadFormProps {
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: any;
}

export function LeadForm({ action, initialData }: LeadFormProps) {
  const [state, formAction] = useActionState(action, null);
  const queryClient = useQueryClient();
  const { pending } = useFormStatus();
  const { data: lead } = useLeadQuery({ data: initialData }, initialData?.id);

  useEffect(() => {
    if (state?.success) {
      queryClient.setQueryData(["lead", initialData.id], () => state);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {state && (
        <Alert variant={state.success ? "default" : "destructive"}>
          {state.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{state.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>
            {state.success
              ? "Operation completed successfully."
              : (Array.isArray(state.error)
                  ? state.error.join(", ")
                  : state.error) ?? "Something wrong happened."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={lead?.data?.name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={lead?.data?.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={lead?.data?.phone}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select name="source" defaultValue={lead?.data?.source || "website"}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : lead?.data?.id ? "Update Lead" : "Save Lead"}
        </Button>
      </div>
    </form>
  );
}
