"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Banknote, CreditCard } from "lucide-react";

interface Order {
  _id: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cod" | "card"; // <-- add this line
  createdAt: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("cash");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Filter orders by payment method
  const cashOrders = orders.filter((order) => order.paymentMethod === "cod");
  const onlineOrders = orders.filter((order) => order.paymentMethod === "card");

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      // Update the order in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  // Extracted OrdersTable component for reuse in both tabs
  function OrdersTable({
    orders,
    updateOrderStatus,
    setOrders,
    router,
    toast,
  }: {
    orders: Order[];
    updateOrderStatus: (orderId: string, status: Order["status"]) => void;
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
    router: any;
    toast: any;
  }) {
    return orders.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">
                {order._id.slice(-6).toUpperCase()}
              </TableCell>
              <TableCell>
                {format(new Date(order.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{order.customerInfo.name}</div>
                  <div className="text-muted-foreground">
                    {order.customerInfo.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    updateOrderStatus(order._id, value as Order["status"])
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {order.paymentStatus === "pending" ? (
                  <Select
                    value={order.paymentStatus}
                    onValueChange={async (value) => {
                      try {
                        const response = await fetch(
                          `/api/orders/${order._id}/payment`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ paymentStatus: value }),
                          }
                        );
                        if (!response.ok)
                          throw new Error("Failed to update payment status");
                        setOrders((prevOrders) =>
                          prevOrders.map((o) =>
                            o._id === order._id
                              ? { ...o, paymentStatus: value }
                              : o
                          )
                        );
                        toast.success("Payment status updated successfully");
                      } catch (error) {
                        console.error("Error updating payment status:", error);
                        toast.error("Failed to update payment status");
                      }
                    }}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "failed"
                          ? "bg-red-100 text-red-800"
                          : order.paymentStatus === "refunded"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (authLoading || loading) {
    return <OrdersSkeleton />;
  }

  if (!user || user.role !== "admin") {
    router.push("/signin");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="cash">
                <Banknote className="mr-2" /> Cash Payments
              </TabsTrigger>
              <TabsTrigger value="online">
                <CreditCard className="mr-2" /> Online Payments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="cash">
              <OrdersTable
                orders={cashOrders}
                updateOrderStatus={updateOrderStatus}
                setOrders={setOrders}
                router={router}
                toast={toast}
              />
            </TabsContent>
            <TabsContent value="online">
              <OrdersTable
                orders={onlineOrders}
                updateOrderStatus={updateOrderStatus}
                setOrders={setOrders}
                router={router}
                toast={toast}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
