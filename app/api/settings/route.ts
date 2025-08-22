import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("smp-tulung-selapan");

    const settings = await db.collection("settings").findOne({});

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        schoolName: "SMP Negeri 1 Tulung Selapan",
        address:
          "Jl. Merdeka Tulung Selapan, Kec., Tulung Selapan, Kab. Ogan Komering Ilir, Prov., Sumatera Selatan",
        phone: "083175234544",
        email: "smpn1tulungselapan@yahoo.com",
        vision:
          "Membentuk pembelajar yang akhlakul kariman, berilmu, beretika, berwawasan lingkungan untuk menuju pentas dunia.",
        mission:
          "Mewujudkan pendidikan dengan keteladanan\nMengembangkan budaya belajar dengan didasari pada kecintaan terhadap ilmu pengetahuan\nMeningkatkan fasilitas sekolah menuju sekolah bersih, sehat dan berwawasan lingkungan",
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
