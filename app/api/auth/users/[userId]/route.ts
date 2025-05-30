import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/schema";

interface SessionPayload {
  userId: {
    buffer: {
      [key: string]: number;
    };
  };
  email: string;
  role: string;
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    // Don't allow deleting the last admin
    const adminCount = await User.countDocuments({ role: "admin" });
    const userToDelete = await User.findById(params.userId);

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userToDelete.role === "admin" && adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last admin user" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(params.userId);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
