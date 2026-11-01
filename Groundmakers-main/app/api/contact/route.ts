import { NextRequest, NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const service = String(body.service ?? "").trim();

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
    }
    if (!phone && !email) {
      return NextResponse.json({ error: "Please give a phone number or email so we can reply." }, { status: 400 });
    }

    await saveContactMessage({ name, message, phone, email, service });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong. Please call us instead." }, { status: 500 });
  }
}
