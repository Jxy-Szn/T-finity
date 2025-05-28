import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  let client: MongoClient | null = null;
  try {
    const fileId = params.fileId;
    console.log("Fetching image with ID:", fileId);

    if (!fileId || !ObjectId.isValid(fileId)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const bucket = new GridFSBucket(db, {
      bucketName: "uploads",
    });

    // Find the file in GridFS
    const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray();
    if (files.length === 0) {
      console.log("No file found with ID:", fileId);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    const chunks: Buffer[] = [];

    // Read the file data
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    if (buffer.length === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 500 });
    }

    // Return the file with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.contentType || "image/jpeg",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (error) {
        console.error("Error closing MongoDB connection:", error);
      }
    }
  }
}
