"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<
    { query: string; timestamp: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (user) {
        try {
          const response = await fetch("/api/search-history");
          const data = await response.json();
          setSearchHistory(data);
        } catch (error) {
          console.error("Error fetching search history:", error);
        }
      }
    };

    if (isOpen) {
      fetchSearchHistory();
    }
  }, [isOpen, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      if (user) {
        await fetch("/api/search-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        });
      }
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving search history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch("/api/search-history", { method: "DELETE" });
      setSearchHistory([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  return (
    <div className="relative w-full max-w-lg" ref={searchRef}>
      <div className="flex w-full bg-input rounded-full">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          aria-label="Search"
          className="
            flex-1
            bg-transparent
            border-none
            shadow-none
            text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-0
            rounded-l-full
            px-4 py-2
          "
        />
        <Button
          variant="ghost"
          onClick={() => handleSearch(query)}
          aria-label="Submit search"
          className="
            bg-transparent
            rounded-r-full
            border-l border-border
            px-4 py-2
            text-foreground
            hover:bg-accent/10
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-background
          "
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {isOpen && searchHistory.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded-md border bg-background shadow-lg">
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Recent Searches
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
            <div className="space-y-1">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item.query)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-left">{item.query}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
