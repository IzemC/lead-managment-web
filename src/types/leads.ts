export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  submitted_at: string;
  status: string;
}

export interface LeadListResponse {
  data: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
