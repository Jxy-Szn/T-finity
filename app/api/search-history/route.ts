import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { SearchHistory } from "@/models/search-history";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const history = await SearchHistory.find({ userId: session.userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching search history:", error);
    return NextResponse.json(
      { error: "Failed to fetch search history" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { query } = await request.json();

    const searchHistory = await SearchHistory.create({
      userId: session.userId,
      query,
    });

    return NextResponse.json(searchHistory);
  } catch (error) {
    console.error("Error creating search history:", error);
    return NextResponse.json(
      { error: "Failed to create search history" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await SearchHistory.deleteMany({ userId: session.userId });

    return NextResponse.json({ message: "Search history cleared" });
  } catch (error) {
    console.error("Error clearing search history:", error);
    return NextResponse.json(
      { error: "Failed to clear search history" },
      { status: 500 }
    );
  }
}
