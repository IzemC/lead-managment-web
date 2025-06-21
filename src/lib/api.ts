"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";
import { type Lead, type LeadListResponse } from "@/types/leads";

const baseHeaders = {
  "x-api-key": API_KEY,
};

type Error = {
  success: boolean;
  error: any;
};

export const getLeads = async (
  page: number = 1,
  filters?: { source?: string; startDate?: string; endDate?: string }
): Promise<LeadListResponse> => {
  let url = `${API_URL}/leads?page=${page}`;

  if (filters?.source) {
    url += `&source=${filters.source}`;
  }
  if (filters?.startDate) {
    url += `&startDate=${filters.startDate}`;
  }
  if (filters?.endDate) {
    url += `&endDate=${filters.endDate}`;
  }

  const response = await fetch(url, {
    headers: baseHeaders,
  });

  if (!response.ok) {
    throw new Error(await response.json());
  }
  return response.json();
};

export const getLead = async (id: string): Promise<{ data: Lead }> => {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    headers: baseHeaders,
  });
  if (!response.ok) {
    throw new Error(await response.json());
  }
  return response.json();
};

export const createLead = async (
  lead: Omit<Lead, "id" | "submitted_at" | "status">
): Promise<Lead | Error> => {
  const response = await fetch(`${API_URL}/leads`, {
    method: "POST",
    headers: {
      ...baseHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...lead,
      submitted_at: new Date().toISOString(),
    }),
  });

  return response.json();
};

export const updateLead = async (
  id: string,
  lead: Partial<Lead>
): Promise<Lead | Error> => {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: "PUT",
    headers: {
      ...baseHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
  });
  if (!response.ok) {
    throw new Error(await response.json());
  }
  return response.json();
};

export const deleteLead = async (id: string): Promise<void | Error> => {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    headers: baseHeaders,
    method: "DELETE",
  });
  if (!response.ok) {
    throw Error("Couldn't delete lead");
  }
  return await response.json();
};
