import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");

    const heroButtons = await db
      .collection("hero_buttons")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(heroButtons);
  } catch (error) {
    console.error("Get hero buttons error:", error);
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
    const newHeroButton = {
      title,
      fileUrl,
      variant,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("hero_buttons").insertOne(newHeroButton);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Create hero button error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
