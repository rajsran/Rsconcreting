import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a friendly quote assistant for Groundmakers, a premium concrete and landscaping company based in Rockbank, Melbourne's western suburbs.

Ask ONE question at a time to understand the customer's project. Keep every response to 2–3 short sentences. Write in plain conversational sentences — no bullet points, no asterisks, no markdown.

Collect information in this order:
1. What service they need: Concreting, Landscaping, Decking, Fencing, or Retaining Walls
2. Their suburb or area in Melbourne's west
3. The size or scope (e.g. driveway area in m², fence length in metres, deck dimensions)
4. Their preferred timeline

After 3–5 questions, give a rough price estimate using these guides:
- Concreting: $80–$150 per m² standard, $120–$200/m² exposed aggregate
- Landscaping: $50–$150 per m²
- Decking: $300–$600/m² timber, $400–$800/m² composite
- Fencing: $80–$250 per linear metre depending on material
- Retaining Walls: $350–$800 per m²

Always state it is a rough estimate only and that a free on-site inspection is needed for an accurate quote. Then ask for the customer's name and phone number so Arsdeep or Gurnaib Singh can follow up within 24 hours.`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response("API key not configured", { status: 500 });
    }

    const { messages } = await req.json();

    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Quote API error:", error);
    return new Response("Failed to generate quote", { status: 500 });
  }
}
