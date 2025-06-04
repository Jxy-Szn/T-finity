"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Trash2, Filter, Settings2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  featured: boolean;
  onSale: boolean;
  category: string;
}

interface CategorySettings {
  headerText: string;
  headerColor: string;
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [settings, setSettings] = useState<CategorySettings>({
    headerText: "Limited Stock Deals",
    headerColor: "bg-purple-500",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products/${productToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      setProducts(
        products.filter((product) => product._id !== productToDelete._id)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    } finally {
      setProductToDelete(null);
    }
  };

  // Get unique categories from products
  const categories = [
    "all",
    ...Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    ),
  ];

  // Filter products based on search query and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
      default:
        return 0;
    }
  });

  const handleSettingsChange = async (
    newSettings: Partial<CategorySettings>
  ) => {
    try {
      const response = await fetch("/api/category-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      setSettings((prev) => ({ ...prev, ...newSettings }));
      toast.success("Category settings updated");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  return (
    <section className="w-full">
      <div className={`${settings.headerColor} p-4 rounded-t-xl`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">
              {settings.headerText}
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Settings2 className="h-4 w-4" />
                  <span className="sr-only">Category settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Category Settings</DialogTitle>
                  <DialogDescription>
                    Customize the appearance of your category header.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="headerText">Header Text</Label>
                    <Input
                      id="headerText"
                      value={settings.headerText}
                      onChange={(e) =>
                        handleSettingsChange({ headerText: e.target.value })
                      }
                      placeholder="Enter header text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headerColor">Header Color</Label>
                    <Select
                      value={settings.headerColor}
                      onValueChange={(value) =>
                        handleSettingsChange({ headerColor: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bg-purple-500">Purple</SelectItem>
                        <SelectItem value="bg-blue-500">Blue</SelectItem>
                        <SelectItem value="bg-green-500">Green</SelectItem>
                        <SelectItem value="bg-red-500">Red</SelectItem>
                        <SelectItem value="bg-orange-500">Orange</SelectItem>
                        <SelectItem value="bg-pink-500">Pink</SelectItem>
                        <SelectItem value="bg-indigo-500">Indigo</SelectItem>
                        <SelectItem value="bg-teal-500">Teal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-white" />
              <Input
                placeholder="Search products..."
                className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] text-sm bg-white/10 border-white/20 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-sm"
                  >
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] text-sm bg-white/10 border-white/20 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="newest" value="newest" className="text-sm">
                  Newest
                </SelectItem>
                <SelectItem
                  key="price-low"
                  value="price-low"
                  className="text-sm"
                >
                  Price: Low to High
                </SelectItem>
                <SelectItem
                  key="price-high"
                  value="price-high"
                  className="text-sm"
                >
                  Price: High to Low
                </SelectItem>
                <SelectItem key="name" value="name" className="text-sm">
                  Name
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 bg-background p-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              className="relative animate-pulse overflow-hidden"
            >
              <div className="aspect-square bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : sortedProducts.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          sortedProducts.map((product) => (
            <Card
              key={product._id}
              className="relative overflow-hidden group p-0 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square w-full cursor-pointer">
                <Image
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-purple-400 text-white">
                    Featured
                  </Badge>
                )}
                {product.onSale && product.originalPrice && (
                  <Badge
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    Sale
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium truncate mb-1 text-foreground">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-foreground">
                      {formatCurrency(product.price)}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete product</span>
                  </Button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={() => setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product
              {productToDelete && ` "${productToDelete.name}"`} and remove it
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
