import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { deleteFile } from "@/lib/supabase";

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
    const galleryCollection = db.collection("gallery");

    const itemToDelete = await galleryCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!itemToDelete) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    if (itemToDelete.image) {
      try {
        const path = itemToDelete.image.split("/chatbot/")[1];
        await deleteFile("chatbot", path);
      } catch (storageError) {
        console.error(
          "Supabase delete error, proceeding with DB delete:",
          storageError
        );
      }
    }

    await galleryCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
