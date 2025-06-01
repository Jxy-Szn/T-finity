// app/(customers)/layout.tsx
import React from "react";
import "../globals.css";
import UserSidebar from "@/components/customers/Usersidebar";
import { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const metadata: Metadata = {
  title: "My Account - T-finity",
  description: "Manage your T-finity account settings and preferences",
};

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <UserSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="sticky top-0 z-10 bg-background border-b p-4">
              <Button variant="ghost" size="icon" asChild>
                <SidebarTrigger>
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
              </Button>
            </div>
            <div className="h-full w-full p-6">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
