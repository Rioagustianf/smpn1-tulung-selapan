import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { uploadImage, getImageUrl } from "@/lib/supabase";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");

    const gallery = await db
      .collection("gallery")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Get gallery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!file || !(typeof file === "object" && "name" in file)) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    const fileObj = file as File;
    const filePath = `gallery/${Date.now()}_${fileObj.name}`;
    await uploadImage(fileObj, "chatbot", filePath);
    const imageUrl = getImageUrl("chatbot", filePath);
    // Simpan ke MongoDB
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    const newGalleryItem = {
      image: imageUrl,
      createdAt: new Date(),
    };
    const result = await db.collection("gallery").insertOne(newGalleryItem);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Create gallery item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
