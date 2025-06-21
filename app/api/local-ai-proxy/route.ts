import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch("http://202.10.41.72/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Forward the error from the local AI server
      return NextResponse.json(
        { error: `Local AI server error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy to local AI failed:", error);
    return NextResponse.json(
      { error: "Failed to connect to the local AI server." },
      { status: 500 }
    );
  }
}
