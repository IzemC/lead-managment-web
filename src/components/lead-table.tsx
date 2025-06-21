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
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface LeadTableProps {
  data: LeadListResponse;
  page: number;
  isLoading: boolean;
}

export function LeadTable({
  page,
  data: initialData,
  isLoading,
}: LeadTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [data, setData] = useState<any>(initialData);

  const handleDelete = async (id: string) => {
    try {
      const t = await deleteLead(id);
      console.log(t);

      setData((prev: any) => ({
        ...prev,
        data: prev.data.filter((lead: any) => lead.id !== id),
        total: prev.pagination.total - 1,
      }));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/leads?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
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
            {data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((lead: any) => (
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
                      variant={
                        lead.status === "active" ? "default" : "secondary"
                      }
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data.data.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1 && !isLoading) handlePageChange(page - 1);
                }}
                isActive={page > 1 && !isLoading}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4">
                Page {page} of {Math.max(1, data.pagination.pages)}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < data.pagination.pages && !isLoading)
                    handlePageChange(page + 1);
                }}
                isActive={page < data.pagination.pages && !isLoading}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
