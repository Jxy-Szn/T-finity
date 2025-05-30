import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { Promocode } from "@/lib/db/schema";

interface SessionPayload {
  userId: {
    buffer: {
      [key: string]: number;
    };
  };
  email: string;
  role: string;
}

// GET /api/promocodes
export async function GET() {
  try {
    const session = (await getSession()) as SessionPayload | null;

    // Check if user is authenticated and is an admin
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();
    const promocodes = await Promocode.find().sort({ createdAt: -1 });
    return NextResponse.json(promocodes);
  } catch (error) {
    console.error("Error fetching promocodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch promocodes" },
      { status: 500 }
    );
  }
}

// POST /api/promocodes
export async function POST(req: Request) {
  try {
    const session = (await getSession()) as SessionPayload | null;

    // Check if user is authenticated and is an admin
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { code, discount, type, maxUsage, expiresAt } = data;

    // Validate required fields
    if (!code || !discount || !type || !maxUsage || !expiresAt) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate code format (uppercase letters and numbers only)
    if (!/^[A-Z0-9]+$/.test(code)) {
      return NextResponse.json(
        { error: "Promocode must contain only uppercase letters and numbers" },
        { status: 400 }
      );
    }

    // Validate discount value
    if (type === "percentage" && (discount < 1 || discount > 100)) {
      return NextResponse.json(
        { error: "Percentage discount must be between 1 and 100" },
        { status: 400 }
      );
    }

    if (type === "fixed" && discount < 1) {
      return NextResponse.json(
        { error: "Fixed discount must be greater than 0" },
        { status: 400 }
      );
    }

    // Check if code already exists
    await connectDB();
    const existingCode = await Promocode.findOne({ code });
    if (existingCode) {
      return NextResponse.json(
        { error: "Promocode already exists" },
        { status: 400 }
      );
    }

    // Create new promocode
    const promocode = new Promocode({
      code,
      discount,
      type,
      maxUsage,
      expiresAt,
      status: "active",
      usageCount: 0,
    });

    await promocode.save();

    return NextResponse.json({
      message: "Promocode created successfully",
      promocode,
    });
  } catch (error) {
    console.error("Error creating promocode:", error);
    return NextResponse.json(
      { error: "Failed to create promocode" },
      { status: 500 }
    );
  }
}
