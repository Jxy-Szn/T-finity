"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be greater than 0"),
  originalPrice: z
    .number()
    .min(0, "Original price must be greater than 0")
    .optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  colors: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ),
  sizes: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ),
  stock: z.number().min(0, "Stock must be greater than or equal to 0"),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  freeShipping: z.boolean().default(false),
  warranty: z
    .enum([
      "none",
      "30-days",
      "60-days",
      "90-days",
      "1-year",
      "2-years",
      "lifetime",
    ])
    .default("none"),
  quality: z.enum(["standard", "premium", "luxury"]).default("standard"),
  tags: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const predefinedColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0000FF" },
    { name: "Green", value: "#00FF00" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Purple", value: "#800080" },
    { name: "Pink", value: "#FFC0CB" },
    { name: "Orange", value: "#FFA500" },
    { name: "Brown", value: "#A52A2A" },
    { name: "Gray", value: "#808080" },
    { name: "Navy", value: "#000080" },
    { name: "Teal", value: "#008080" },
    { name: "Maroon", value: "#800000" },
    { name: "Olive", value: "#808000" },
    { name: "Lime", value: "#00FF00" },
    { name: "Aqua", value: "#00FFFF" },
    { name: "Silver", value: "#C0C0C0" },
    { name: "Gold", value: "#FFD700" },
    { name: "Beige", value: "#F5F5DC" },
    { name: "Burgundy", value: "#800020" },
    { name: "Coral", value: "#FF7F50" },
    { name: "Cyan", value: "#00FFFF" },
    { name: "Indigo", value: "#4B0082" },
    { name: "Khaki", value: "#F0E68C" },
    { name: "Lavender", value: "#E6E6FA" },
    { name: "Magenta", value: "#FF00FF" },
    { name: "Mint", value: "#98FF98" },
    { name: "Mustard", value: "#FFDB58" },
    { name: "Peach", value: "#FFDAB9" },
  ];

  const predefinedSizes = [
    { name: "Small", value: "S" },
    { name: "Medium", value: "M" },
    { name: "Large", value: "L" },
    { name: "X-Large", value: "XL" },
    { name: "XX-Large", value: "XXL" },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      images: [],
      category: "",
      subcategory: "",
      colors: [],
      sizes: [],
      stock: 0,
      featured: false,
      trending: false,
      freeShipping: false,
      warranty: "none",
      quality: "standard",
      tags: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      toast.success("Product created successfully");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to create product");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleColor = (color: { name: string; value: string }) => {
    const currentColors = form.getValues("colors");
    const colorExists = currentColors.some((c) => c.name === color.name);

    if (colorExists) {
      form.setValue(
        "colors",
        currentColors.filter((c) => c.name !== color.name)
      );
    } else {
      form.setValue("colors", [...currentColors, color]);
    }
  };

  const toggleSize = (size: { name: string; value: string }) => {
    const currentSizes = form.getValues("sizes");
    const sizeExists = currentSizes.some((s) => s.name === size.name);

    if (sizeExists) {
      form.setValue(
        "sizes",
        currentSizes.filter((s) => s.name !== size.name)
      );
    } else {
      form.setValue("sizes", [...currentSizes, size]);
    }
  };

  const addTag = () => {
    if (newTag) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
                  <TabsTrigger value="variants">Variants & Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter product description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="children">Children</SelectItem>
                            <SelectItem value="summer">Summer</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter subcategory" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="freeShipping"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Free Shipping</FormLabel>
                          <FormDescription>
                            Offer free shipping for this product
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="warranty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select warranty period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Warranty</SelectItem>
                            <SelectItem value="30-days">30 Days</SelectItem>
                            <SelectItem value="60-days">60 Days</SelectItem>
                            <SelectItem value="90-days">90 Days</SelectItem>
                            <SelectItem value="1-year">1 Year</SelectItem>
                            <SelectItem value="2-years">2 Years</SelectItem>
                            <SelectItem value="lifetime">Lifetime</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quality Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select quality level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Product</FormLabel>
                            <FormDescription>
                              Show this product in featured section
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="trending"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Trending</FormLabel>
                            <FormDescription>
                              Mark this product as trending
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Images</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            onRemove={(url) =>
                              field.onChange(
                                field.value.filter((current) => current !== url)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Colors</FormLabel>
                    <div className="grid grid-cols-8 gap-1">
                      {predefinedColors.map((color) => (
                        <div
                          key={color.name}
                          className="flex flex-col items-center gap-0.5"
                        >
                          <button
                            type="button"
                            className={cn(
                              "h-6 w-6 rounded-full border border-input flex items-center justify-center transition-all",
                              form
                                .watch("colors")
                                .some((c) => c.name === color.name) &&
                                "ring-2 ring-primary scale-105"
                            )}
                            style={{ backgroundColor: color.value }}
                            onClick={() => toggleColor(color)}
                          >
                            {form
                              .watch("colors")
                              .some((c) => c.name === color.name) && (
                              <Check
                                className={cn(
                                  "h-3 w-3",
                                  [
                                    "White",
                                    "Yellow",
                                    "Beige",
                                    "Mint",
                                    "Peach",
                                  ].includes(color.name)
                                    ? "text-black"
                                    : "text-white"
                                )}
                              />
                            )}
                          </button>
                          <span className="text-[10px] leading-tight">
                            {color.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormLabel>Sizes</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {predefinedSizes.map((size) => (
                        <Button
                          key={size.name}
                          type="button"
                          variant={
                            form
                              .watch("sizes")
                              .some((s) => s.name === size.name)
                              ? "default"
                              : "outline"
                          }
                          onClick={() => toggleSize(size)}
                          className="min-w-[60px]"
                        >
                          {size.value}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormLabel>Tags</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                      />
                      <Button type="button" onClick={addTag}>
                        Add Tag
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.watch("tags").map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
