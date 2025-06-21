import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");

    const files = await db
      .collection("downloadable_files")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("Get downloadable files error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, fileUrl, variant = "outline" } = await request.json();
    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: "Title and fileUrl are required" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    const newFile = {
      title,
      fileUrl,
      variant,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("downloadable_files").insertOne(newFile);

    revalidatePath("/"); // Revalidate the homepage
    revalidatePath("/api/admin/downloadable-files"); // Revalidate the API route

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Create downloadable file error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
