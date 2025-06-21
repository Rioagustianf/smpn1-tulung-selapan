import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");

    const contacts = await db
      .collection("contacts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Get contacts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id)
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    await db.collection("contacts").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, read } = await request.json();
    if (!id || typeof read !== "boolean")
      return NextResponse.json(
        { error: "ID dan status read wajib diisi" },
        { status: 400 }
      );
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    await db
      .collection("contacts")
      .updateOne({ _id: new ObjectId(id) }, { $set: { read } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
