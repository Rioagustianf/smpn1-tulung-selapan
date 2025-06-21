import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { deleteFile } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, fileUrl, variant } = await request.json();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (fileUrl) updateData.fileUrl = fileUrl;
    if (variant) updateData.variant = variant;

    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");
    const buttonCollection = db.collection("hero_buttons");

    // Find the document first to get the fileUrl
    const buttonToDelete = await buttonCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!buttonToDelete) {
      return NextResponse.json({ error: "Button not found" }, { status: 404 });
    }

    // Delete file from Supabase
    if (buttonToDelete.fileUrl) {
      try {
        const path = buttonToDelete.fileUrl.split("/chatbot/")[1];
        await deleteFile("chatbot", path);
      } catch (storageError) {
        console.error(
          "Supabase delete error, proceeding with DB delete:",
          storageError
        );
        // Optional: Decide if you want to stop or continue if file deletion fails
      }
    }

    // Delete from MongoDB
    await buttonCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete hero button error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");

    await db.collection("hero_buttons").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete hero button error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
