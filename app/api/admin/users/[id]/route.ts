import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT: Edit admin user
export async function PUT(request: NextRequest) {
  try {
    const { id, username, password, status } = await request.json();
    if (!id || !username) {
      return NextResponse.json(
        { error: "ID dan username wajib diisi" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    const updateData: any = {
      username,
      status,
      updatedAt: new Date(),
    };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await db
      .collection("admins")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete admin user
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    await db.collection("admins").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
