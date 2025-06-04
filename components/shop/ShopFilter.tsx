"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useState } from "react";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Modified base slider component to show end circle
interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showEndCircle?: boolean;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showEndCircle = false, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    {showEndCircle && (
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    )}
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;
// End Modified base slider component to show end circle

interface HorizontalFiltersProps {
  className?: string;
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  sortBy: string;
}

export default function ShopFilters({
  className,
  onFilterChange,
}: HorizontalFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 500],
    colors: [],
    sizes: [],
    sortBy: "price-desc",
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Count active filters
    let count = 0;
    if (updated.colors.length) count += updated.colors.length;
    if (updated.sizes.length) count += updated.sizes.length;
    if (updated.priceRange[0] > 0 || updated.priceRange[1] < 500) count += 1;

    setActiveFiltersCount(count);
    onFilterChange?.(updated);
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    if (type === "sortBy") {
      updateFilters({ [type]: value } as Partial<FilterState>);
      return;
    }

    const currentValues = filters[type] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    updateFilters({ [type]: newValues } as Partial<FilterState>);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 500],
      colors: [],
      sizes: [],
      sortBy: "price-desc",
    });
    setActiveFiltersCount(0);
    onFilterChange?.({
      priceRange: [0, 500],
      colors: [],
      sizes: [],
      sortBy: "price-desc",
    });
  };

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0000FF" },
    { name: "Green", value: "#00FF00" },
    { name: "Yellow", value: "#FFFF00" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const sortOptions = [
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Price: Low to High", value: "price-asc" },
  ];

  const ActiveFilterBadges = () => {
    const activeFilters = [
      ...filters.colors.map((color) => ({ type: "colors", value: color })),
      ...filters.sizes.map((size) => ({ type: "sizes", value: size })),
      ...(filters.priceRange[0] > 0 || filters.priceRange[1] < 500
        ? [
            {
              type: "price",
              value: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`,
            },
          ]
        : []),
    ];

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {activeFilters.map((filter, index) => (
          <Badge
            key={`${filter.type}-${filter.value}-${index}`}
            variant="outline"
            className="flex items-center gap-1 px-2 py-1"
          >
            {filter.value}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() =>
                toggleFilter(filter.type as keyof FilterState, filter.value)
              }
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={cn("w-full p-6", className)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Price Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Price
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Price Range</h4>
                  <Slider
                    value={filters.priceRange}
                    min={0}
                    max={500}
                    step={10}
                    onValueChange={(value) =>
                      updateFilters({ priceRange: value as [number, number] })
                    }
                    showEndCircle
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      ${filters.priceRange[0]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ${filters.priceRange[1]}
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Size Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Size
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3">
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={
                        filters.sizes.includes(size) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => toggleFilter("sizes", size)}
                      className="h-8"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Color Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Color
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3">
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <div
                      key={color.name}
                      className="flex flex-col items-center gap-1"
                    >
                      <button
                        className={cn(
                          "h-8 w-8 rounded-full border border-input flex items-center justify-center",
                          filters.colors.includes(color.name) &&
                            "ring-2 ring-primary"
                        )}
                        style={{ backgroundColor: color.value }}
                        onClick={() => toggleFilter("colors", color.name)}
                      >
                        {filters.colors.includes(color.name) && (
                          <Check
                            className={cn(
                              "h-4 w-4",
                              ["White", "Yellow"].includes(color.name)
                                ? "text-black"
                                : "text-white"
                            )}
                          />
                        )}
                      </button>
                      <span className="text-xs">{color.name}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Mobile All Filters Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 sm:hidden"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="h-3 w-3 mr-1" />
              All Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Sort by:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  {sortOptions.find((opt) => opt.value === filters.sortBy)
                    ?.label || "Price: High to Low"}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className={cn(
                      filters.sortBy === option.value && "font-medium"
                    )}
                    onClick={() => toggleFilter("sortBy", option.value)}
                  >
                    {option.label}
                    {filters.sortBy === option.value && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filter Badges */}
        <ActiveFilterBadges />

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-6 pr-4">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Price Range</h3>
                    <div className="space-y-4">
                      <Slider
                        value={filters.priceRange}
                        min={0}
                        max={500}
                        step={10}
                        onValueChange={(value) =>
                          updateFilters({
                            priceRange: value as [number, number],
                          })
                        }
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          ${filters.priceRange[0]}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ${filters.priceRange[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Sizes */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Sizes</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {sizes.map((size) => (
                        <Button
                          key={size}
                          variant={
                            filters.sizes.includes(size) ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => toggleFilter("sizes", size)}
                          className="h-8"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Colors */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Colors</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {colors.map((color) => (
                        <div
                          key={color.name}
                          className="flex flex-col items-center gap-1"
                        >
                          <button
                            className={cn(
                              "h-8 w-8 rounded-full border border-input flex items-center justify-center",
                              filters.colors.includes(color.name) &&
                                "ring-2 ring-primary"
                            )}
                            style={{ backgroundColor: color.value }}
                            onClick={() => toggleFilter("colors", color.name)}
                          >
                            {filters.colors.includes(color.name) && (
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  ["White", "Yellow"].includes(color.name)
                                    ? "text-black"
                                    : "text-white"
                                )}
                              />
                            )}
                          </button>
                          <span className="text-xs">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={clearFilters}>
                  Clear all
                </Button>
                <Button onClick={() => setShowMobileFilters(false)}>
                  Apply filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
