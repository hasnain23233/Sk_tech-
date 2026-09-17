import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_INSTRUCTION = `You are the virtual assistant for SK Tech Agency, a technology agency.
Be helpful, concise, and friendly. Answer questions about the agency's services when asked,
and otherwise just help the visitor with whatever they need. If you don't know something
specific about the company, say so honestly instead of making it up.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing GOOGLE_API_KEY. Add your Google AI Studio key to .env.local as GOOGLE_API_KEY=your_key_here and restart the dev server.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "No messages provided." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Everything except the final message becomes prior history;
    // the final message is sent as the new user turn.
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const latest = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(latest.content);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Gemini API error:", err);
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}