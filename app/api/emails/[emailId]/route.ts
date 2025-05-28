import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Email } from "@/lib/models/email";
import { ObjectId } from "mongodb";

interface SessionPayload {
  userId: {
    buffer: {
      [key: string]: number;
    };
  };
  email: string;
  role: string;
}

export async function GET(
  req: Request,
  { params }: { params: { emailId: string } }
) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();

    const email = await Email.findOne({
      _id: new ObjectId(params.emailId),
      $or: [{ from: session.email }, { to: session.email }],
    });

    if (!email) {
      return new NextResponse("Email not found", { status: 404 });
    }

    return NextResponse.json(email);
  } catch (error) {
    console.error("[EMAIL_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { emailId: string } }
) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { isRead, isStarred } = body;

    await connectToDatabase();

    const email = await Email.findOne({
      _id: new ObjectId(params.emailId),
      $or: [{ from: session.email }, { to: session.email }],
    });

    if (!email) {
      return new NextResponse("Email not found", { status: 404 });
    }

    if (typeof isRead === "boolean") {
      email.isRead = isRead;
    }

    if (typeof isStarred === "boolean") {
      email.isStarred = isStarred;
    }

    await email.save();

    return NextResponse.json(email);
  } catch (error) {
    console.error("[EMAIL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { emailId: string } }
) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();

    const email = await Email.findOne({
      _id: new ObjectId(params.emailId),
      $or: [{ from: session.email }, { to: session.email }],
    });

    if (!email) {
      return new NextResponse("Email not found", { status: 404 });
    }

    await email.deleteOne();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EMAIL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
