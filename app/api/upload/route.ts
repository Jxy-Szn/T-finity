import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI!;

interface SessionPayload {
  userId: {
    buffer: {
      [key: string]: number;
    };
  };
  email: string;
  role: string;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let client: MongoClient | null = null;
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image files are allowed" },
          { status: 400 }
        );
      }
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size must be less than 2MB" },
          { status: 400 }
        );
      }
    }

    console.log("Files received:", files.length);
    console.log("Connecting to MongoDB...");

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const bucket = new GridFSBucket(db, {
      bucketName: "uploads",
    });

    const uploadedFiles = [];

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const filename = `${Date.now()}-${file.name}`;

      console.log("Preparing file for upload:", {
        filename,
        bufferSize: buffer.byteLength,
      });

      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          contentType: file.type,
          userId: session.userId,
          uploadType: formData.get("type") || "product",
        },
      });

      await new Promise((resolve, reject) => {
        uploadStream.write(Buffer.from(buffer), (error) => {
          if (error) {
            console.error("Error writing to upload stream:", error);
            reject(error);
          } else {
            console.log("File written to upload stream");
            uploadStream.end((error) => {
              if (error) {
                console.error("Error ending upload stream:", error);
                reject(error);
              } else {
                console.log("Upload stream ended");
                resolve(null);
              }
            });
          }
        });
      });

      console.log("Upload completed successfully");
      uploadedFiles.push({
        id: uploadStream.id.toString(),
        filename,
        url: `/api/images/${uploadStream.id}`,
      });
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.close();
        console.log("MongoDB connection closed");
      } catch (error) {
        console.error("Error closing MongoDB connection:", error);
      }
    }
  }
}
