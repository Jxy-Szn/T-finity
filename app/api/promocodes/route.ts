import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { Promocode } from "@/models/promocode";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const promocodes = await Promocode.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(promocodes);
  } catch (error) {
    console.error("Error fetching promocodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch promocodes" },
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

    const body = await request.json();
    await connectDB();

    const promocode = await Promocode.create({
      ...body,
      createdBy: session.userId,
    });

    return NextResponse.json(promocode);
  } catch (error) {
    console.error("Error creating promocode:", error);
    return NextResponse.json(
      { error: "Failed to create promocode" },
      { status: 500 }
    );
  }
}
