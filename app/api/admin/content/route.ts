import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");

    const contents = await db
      .collection("contents")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(contents);
  } catch (error) {
    console.error("Get contents error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, type, featured = false } = await request.json();
    if (!title || !content || !type) {
      return NextResponse.json(
        { error: "Title, content, and type are required" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    const newContent = {
      title,
      content,
      type,
      featured,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("contents").insertOne(newContent);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Create content error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
