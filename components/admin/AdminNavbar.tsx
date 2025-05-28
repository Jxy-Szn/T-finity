"use client";
import {
  LogOut,
  Moon,
  Sun,
  User,
  Settings,
  Upload,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/store/auth";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminNavbar = () => {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const { user, logout, checkAuth, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?.image) {
      // Ensure the image URL is properly constructed
      const imageUrl = user.image.startsWith("/api/images/")
        ? user.image
        : `/api/images/${user.image}`;
      setImagePreview(imageUrl);
    }
  }, [user?.image]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSettings = () => {
    router.push("/dashboard/settings");
  };

  const handleImageClick = () => {
    setIsUploadDialogOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the image
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // Update user profile with new image URL
      if (data.fileId) {
        const imageUrl = `/api/images/${data.fileId}`;
        await updateUser({ ...user, image: imageUrl });
        setImagePreview(imageUrl);

        toast({
          title: "Success",
          description: "Profile image updated successfully",
        });
        setIsUploadDialogOpen(false);
      } else {
        throw new Error("No file ID received from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10 border-b">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Link href="/dashboard" className="font-semibold">
          Dashboard
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* THEME MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={imagePreview || user?.image}
                alt={user?.name || "User avatar"}
              />
              <AvatarFallback className="bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleImageClick}>
              <Upload className="h-[1.2rem] w-[1.2rem] mr-2" />
              Change Avatar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Upload Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Profile Picture</DialogTitle>
              <DialogDescription>
                Choose a new profile picture. Maximum file size is 2MB.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={imagePreview || user?.image}
                    alt={user?.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-muted">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. Max size of 2MB.
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

export default AdminNavbar;
