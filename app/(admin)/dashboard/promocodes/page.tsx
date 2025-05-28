"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { PromocodesTableSkeleton } from "@/components/skeletons/promocodes-table-skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Promocode {
  _id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  status: "active" | "expired" | "used";
  usageCount: number;
  maxUsage: number;
  expiresAt: string;
  createdAt: string;
}

export default function PromocodesPage() {
  const router = useRouter();
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPromocodes();
  }, []);

  const fetchPromocodes = async () => {
    try {
      const response = await fetch("/api/promocodes");
      if (!response.ok) throw new Error("Failed to fetch promocodes");
      const data = await response.json();
      setPromocodes(data);
    } catch (error) {
      toast.error("Failed to load promocodes");
      console.error("Error fetching promocodes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPromocodes = promocodes.filter((promo) =>
    promo.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Promocode copied to clipboard");
  };

  const getStatusColor = (status: Promocode["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "expired":
        return "bg-red-100 text-red-700";
      case "used":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Promocodes</h1>
        <Button onClick={() => router.push("/dashboard/promocodes/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Promocode
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promocode List</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search promocodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PromocodesTableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromocodes.map((promo) => (
                  <TableRow key={promo._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{promo.code}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyCode(promo.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {promo.type === "percentage"
                        ? `${promo.discount}%`
                        : `$${promo.discount}`}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(promo.status)}
                      >
                        {promo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {promo.usageCount} / {promo.maxUsage}
                    </TableCell>
                    <TableCell>
                      {format(new Date(promo.expiresAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPromocodes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No promocodes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
