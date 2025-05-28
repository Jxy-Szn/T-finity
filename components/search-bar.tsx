"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchSearchHistory();
    }
  }, [isOpen, user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch("/api/search-history");
      if (response.ok) {
        const data = await response.json();
        setSearchHistory(data.map((item: any) => item.query));
      }
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

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

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="w-full pl-9 pr-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query);
            }
          }}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-md border bg-popover p-4 shadow-md">
          {user && searchHistory.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Recent Searches</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-8 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
              <div className="space-y-2">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => handleSearch(item)}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && (
            <Button
              className="w-full"
              onClick={() => handleSearch(query)}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
