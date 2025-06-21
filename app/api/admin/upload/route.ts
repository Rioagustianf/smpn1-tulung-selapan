import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Sanitize filename
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const filePath = `hero-buttons/${Date.now()}-${sanitizedFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("chatbot")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: `Error uploading file: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("chatbot")
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      return NextResponse.json(
        { error: "Could not get public URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ fileUrl: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
