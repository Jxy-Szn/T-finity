import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Remove the unexpected fields from all users
    const result = await User.updateMany(
      {},
      {
        $unset: {
          currentPassword: "",
          newPassword: "",
        },
      }
    );

    return NextResponse.json({
      message: "Cleanup completed successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Failed to cleanup user documents" },
      { status: 500 }
    );
  }
}
