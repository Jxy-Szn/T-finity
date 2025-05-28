import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, DollarSign, ShoppingCart, Package, Star } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import DashboardCharts from "./dashboard-charts";

// Define the Product model if it doesn't exist
const Product =
  mongoose.models.Product ||
  mongoose.model(
    "Product",
    new mongoose.Schema({
      name: String,
      price: Number,
      category: String,
      rating: Number,
      reviews: Number,
      createdAt: { type: Date, default: Date.now },
    })
  );

// Define the User model if it doesn't exist
const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      email: String,
      createdAt: { type: Date, default: Date.now },
    })
  );

async function getDashboardData() {
  try {
    await connectToDatabase();

    const [totalCustomers, totalProducts, products, users] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Product.find().sort({ createdAt: -1 }).limit(7),
      User.find().sort({ createdAt: -1 }).limit(7),
    ]);

    // Calculate total revenue from products
    const totalRevenue = products.reduce(
      (sum, product) => sum + (product.price || 0),
      0
    );

    // Calculate average rating
    const totalRating = products.reduce(
      (sum, product) => sum + (product.rating || 0),
      0
    );
    const averageRating = totalProducts > 0 ? totalRating / totalProducts : 0;

    // Calculate total reviews
    const totalReviews = products.reduce(
      (sum, product) => sum + (product.reviews || 0),
      0
    );

    // Prepare revenue data for the last 7 days
    const revenueData = products.map((product) => ({
      date: new Date(product.createdAt).toLocaleDateString(),
      revenue: product.price || 0,
    }));

    // Prepare category distribution data
    const categoryData = products.reduce((acc, product) => {
      const category = product.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoryChartData = Object.entries(categoryData).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Prepare rating distribution data
    const ratingData = products.reduce((acc, product) => {
      const rating = Math.floor(product.rating || 0);
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    const ratingChartData = Object.entries(ratingData).map(
      ([rating, count]) => ({
        rating: `Rating ${rating}`,
        count,
      })
    );

    return {
      totalCustomers,
      totalRevenue,
      totalOrders: totalProducts, // Using products as a proxy for orders
      totalProducts,
      averageRating,
      totalReviews,
      revenueData,
      categoryChartData,
      ratingChartData,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export default async function DashboardPage() {
  try {
    const {
      totalCustomers,
      totalRevenue,
      totalOrders,
      totalProducts,
      averageRating,
      totalReviews,
      revenueData,
      categoryChartData,
      ratingChartData,
    } = await getDashboardData();

    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
        </div>
        <DashboardCharts
          revenueData={revenueData}
          categoryChartData={categoryChartData}
          ratingChartData={ratingChartData}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. Please check your database
            connection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
