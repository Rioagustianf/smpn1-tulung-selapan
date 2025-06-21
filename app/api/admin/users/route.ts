import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

// GET: List all admin users
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    const admins = await db
      .collection("admins")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add new admin user
export async function POST(request: NextRequest) {
  try {
    const { username, password, status = "active" } = await request.json();
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    // Cek duplikat username
    const existing = await db.collection("admins").findOne({ username });
    if (existing) {
      return NextResponse.json(
        { error: "Username sudah terdaftar" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = {
      username,
      password: hashedPassword,
      status,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("admins").insertOne(newAdmin);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    // Cek duplikat username jika diubah
    const existing = await db
      .collection("admins")
      .findOne({ username, _id: { $ne: new ObjectId(id) } });
    if (existing) {
      return NextResponse.json(
        { error: "Username sudah terdaftar" },
        { status: 400 }
      );
    }
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
