"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Search, Edit, Trash2, Filter } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  featured: boolean;
  onSale: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      // Update to handle the new API response structure
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        return 0; // You might want to add a createdAt field and sort by that
    }
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Manage your product catalog</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] text-sm">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="newest" value="newest" className="text-sm">
              Newest
            </SelectItem>
            <SelectItem key="price-low" value="price-low" className="text-sm">
              Price: Low to High
            </SelectItem>
            <SelectItem key="price-high" value="price-high" className="text-sm">
              Price: High to Low
            </SelectItem>
            <SelectItem key="name" value="name" className="text-sm">
              Name
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              className="overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.featured && (
                    <Badge className="absolute top-2 left-2">Featured</Badge>
                  )}
                  {product.onSale && (
                    <Badge
                      variant="destructive"
                      className="absolute top-2 right-2"
                    >
                      Sale
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <CardDescription>Stock: {product.stock} units</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    router.push(`/dashboard/products/${product.id}/edit`)
                  }
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
