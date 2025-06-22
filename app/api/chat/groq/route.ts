import { Groq } from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const systemMessage = {
      role: "system",
      content:
        "You are a helpful and friendly school assistant for SMPN 1 Tulung Selapan. Your name is 'Asisten Sekolah'. Answer questions concisely in Indonesian. If a question is outside the scope of school information, politely state that you cannot answer.",
    };

    const messages = [
      systemMessage,
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response =
      chatCompletion.choices[0]?.message?.content ||
      "Maaf, terjadi kesalahan saat memproses jawaban.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Groq fallback error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Groq" },
      { status: 500 }
    );
  }
}
