"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteLead } from "@/lib/api";
import { LeadListResponse } from "@/types/leads";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LeadTableProps {
  initialData: LeadListResponse;
  page: number;
  limit: number;
}

export function LeadTable({ initialData, page, limit }: LeadTableProps) {
  const router = useRouter();
  const [data, setData] = useState<LeadListResponse>(initialData);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`/leads?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      setData((prev) => ({
        ...prev,
        data: prev.data.filter((lead) => lead.id !== id),
        total: prev.pagination.total - 1,
      }));
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{lead.source}</Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(lead.submitted_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={lead.status === "active" ? "default" : "secondary"}
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/leads/${lead.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(lead.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) handlePageChange(page - 1);
                }}
                isActive={page > 1}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4">
                Page {page} of {Math.min(1, data.pagination.pages)}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < data.pagination.pages) handlePageChange(page + 1);
                }}
                isActive={page < data.pagination.pages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
