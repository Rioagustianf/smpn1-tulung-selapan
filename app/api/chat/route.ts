import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/groq';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Pastikan history adalah array, jika tidak ada set sebagai array kosong
    const chatHistory = Array.isArray(history) ? history : [];

    const response = await getChatResponse(message, chatHistory);

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}