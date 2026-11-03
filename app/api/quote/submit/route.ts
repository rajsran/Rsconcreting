import { NextRequest, NextResponse } from "next/server";
import { QuoteLead } from "@/lib/pricing";
import { generateQuotePdf } from "@/lib/generateQuotePdf";
import { sendQuoteEmail } from "@/lib/sendQuoteEmail";
import { saveQuoteLead } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const lead = await req.json() as QuoteLead;

    if (!lead.service) {
      return NextResponse.json({ error: "Missing service" }, { status: 400 });
    }

    const timestamp = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📋 NEW QUOTE LEAD — ${timestamp}`);
    console.log(`   Name:     ${lead.name     ?? "Not provided"}`);
    console.log(`   Email:    ${lead.email    ?? "Not provided"}`);
    console.log(`   Phone:    ${lead.phone    ?? "Not provided"}`);
    console.log(`   Postcode: ${lead.postcode ?? "Not provided"}`);
    console.log(`   Service:  ${lead.service}`);
    console.log(`   Type:     ${lead.type     ?? "Not specified"}`);
    console.log(`   Desc:     ${lead.size ?? "Not specified"}`);
    console.log(`   Timeline: ${lead.timeline ?? "Not specified"}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Save the lead first so it is never lost, even if the email step fails
    try {
      const id = await saveQuoteLead(lead);
      console.log(`\u{1F4BE} Lead saved to database (#${id})`);
    } catch (dbErr) {
      console.error("\u26A0\uFE0F  Could not save lead to database:", dbErr);
    }

    // Generate PDF and send email (don't fail the whole request if this errors)
    try {
      const pdfBuffer = await generateQuotePdf(lead);
      await sendQuoteEmail(lead, pdfBuffer);
      console.log("✅ Quote email sent successfully");
    } catch (emailErr) {
      console.error("⚠️  Email send failed (lead still captured):", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Quote submit error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
