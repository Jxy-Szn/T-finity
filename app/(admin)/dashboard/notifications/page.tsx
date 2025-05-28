"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Mail,
  Send,
  Star,
  Trash2,
  MoreVertical,
  Plus,
  Inbox,
  Send as SentIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/lib/store/auth";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Email {
  _id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  category: "order" | "support" | "marketing" | "system";
  status?: "delivered" | "failed" | "pending";
  isArchived: boolean;
}

const categories = {
  order: { label: "Orders", color: "bg-blue-100 text-blue-700" },
  support: { label: "Support", color: "bg-green-100 text-green-700" },
  marketing: { label: "Marketing", color: "bg-purple-100 text-purple-700" },
  system: { label: "System", color: "bg-gray-100 text-gray-700" },
};

const statuses = {
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
};

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchEmails = async () => {
    try {
      const params = new URLSearchParams({
        type: activeTab,
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(selectedStatus !== "all" && { status: selectedStatus }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/emails?${params}`);
      if (!response.ok) throw new Error("Failed to fetch emails");

      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error("Error fetching emails:", error);
      toast({
        title: "Error",
        description: "Failed to fetch emails",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [activeTab, selectedCategory, selectedStatus, searchQuery]);

  const handleComposeEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.get("to"),
          subject: formData.get("subject"),
          content: formData.get("content"),
          category: formData.get("category"),
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      toast({
        title: "Success",
        description: "Email sent successfully",
        variant: "success",
        className: "bg-green-500 text-white",
      });
      setIsComposeOpen(false);
      fetchEmails();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (emailId: string, isRead: boolean) => {
    try {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead }),
      });

      if (!response.ok) throw new Error("Failed to update email");

      fetchEmails();
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    }
  };

  const handleToggleStar = async (emailId: string, isStarred: boolean) => {
    try {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isStarred }),
      });

      if (!response.ok) throw new Error("Failed to update email");

      fetchEmails();
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete email");

      toast({
        title: "Success",
        description: "Email deleted successfully",
      });
      fetchEmails();
    } catch (error) {
      console.error("Error deleting email:", error);
      toast({
        title: "Error",
        description: "Failed to delete email",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>

        {/* Card Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header Skeleton */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-[50px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>

              {/* Table Rows Skeleton */}
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 py-4">
                  <Skeleton className="h-4 w-[50px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[200px]" />
                  </div>
                  <Skeleton className="h-6 w-[100px] rounded-full" />
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Emails</h1>
          <p className="text-muted-foreground">
            Manage your email communications
          </p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose Email</DialogTitle>
              <DialogDescription>
                Write and send a new email message
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleComposeEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  name="to"
                  placeholder="recipient@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Email subject"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your message here..."
                  className="min-h-[200px]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsComposeOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <SentIcon className="h-4 w-4" />
            Sent
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inbox..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No emails found
                      </TableCell>
                    </TableRow>
                  ) : (
                    emails
                      .filter((email) => email.to === user?.email)
                      .map((email) => (
                        <TableRow
                          key={email._id}
                          className={`${
                            !email.isRead
                              ? "font-bold bg-muted/50 hover:bg-muted"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleToggleStar(email._id, !email.isStarred)
                              }
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  email.isStarred
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                          </TableCell>
                          <TableCell>{email.from}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{email.subject}</span>
                              <span className="text-sm text-muted-foreground">
                                {email.content.substring(0, 50)}...
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={categories[email.category].color}
                            >
                              {categories[email.category].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {email.date
                              ? format(new Date(email.date), "MMM d, h:mm a")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleMarkAsRead(email._id, !email.isRead)
                                  }
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Mark as {email.isRead ? "unread" : "read"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleStar(
                                      email._id,
                                      !email.isStarred
                                    )
                                  }
                                >
                                  <Star className="h-4 w-4 mr-2" />
                                  {email.isStarred ? "Remove star" : "Star"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEmail(email);
                                    setIsDetailsOpen(true);
                                  }}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteEmail(email._id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sent messages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>To</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No emails found
                      </TableCell>
                    </TableRow>
                  ) : (
                    emails
                      .filter((email) => email.from === user?.email)
                      .map((email) => (
                        <TableRow key={email._id}>
                          <TableCell>{email.to}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{email.subject}</span>
                              <span className="text-sm text-muted-foreground">
                                {email.content.substring(0, 50)}...
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={categories[email.category].color}
                            >
                              {categories[email.category].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={statuses[email.status!].color}
                            >
                              {statuses[email.status!].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {email.date
                              ? format(new Date(email.date), "MMM d, h:mm a")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEmail(email);
                                    setIsDetailsOpen(true);
                                  }}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteEmail(email._id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent side="bottom" className="h-[80vh] p-0">
          <ScrollArea className="h-full">
            {selectedEmail && (
              <div className="p-6">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl">
                    {selectedEmail.subject}
                  </SheetTitle>
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">From</span>
                        <span className="text-sm text-muted-foreground block">
                          {selectedEmail.from}
                        </span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-sm font-medium">To</span>
                        <span className="text-sm text-muted-foreground block">
                          {selectedEmail.to}
                        </span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="secondary"
                        className={categories[selectedEmail.category].color}
                      >
                        {categories[selectedEmail.category].label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedEmail.date
                          ? format(
                              new Date(selectedEmail.date),
                              "MMM d, h:mm a"
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </SheetHeader>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">
                    {selectedEmail.content}
                  </div>
                </div>
                <SheetFooter className="mt-6 flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteEmail(selectedEmail._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                  <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
                </SheetFooter>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
