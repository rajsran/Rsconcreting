import * as postmark from "postmark";
import { QuoteLead, Estimate, calcEstimate, formatSize } from "./pricing";
import type { LineItem, QuoteLeadRecord } from "./leadTypes";

// Created on first send, so a missing token only fails the email, not the whole route
let postmarkClient: postmark.ServerClient | undefined;
function getClient() {
  postmarkClient ??= new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN ?? "");
  return postmarkClient;
}

const FROM_EMAIL   = process.env.POSTMARK_FROM_EMAIL!;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL!;

function buildCustomerHtml(lead: QuoteLead, estimate: Estimate | null): string {
  const firstName = lead.name?.split(" ")[0] ?? "there";
  const estimateHtml = estimate
      ? `<div style="background:#1a1a2e;border-radius:10px;padding:20px;text-align:center;margin:20px 0;">
          <p style="color:#9ca3af;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">Rough Estimate</p>
          <p style="color:#ffffff;font-size:28px;font-weight:bold;margin:0 0 6px;">$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}</p>
          <p style="color:#6b7280;font-size:12px;margin:0;">Supply &amp; install · ${estimate.quantity} ${estimate.unit}</p>
        </div>`
      : `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;text-align:center;margin:20px 0;">
          <p style="font-weight:bold;margin:0 0 6px;">Free On-Site Inspection Required</p>
          <p style="color:#6b7280;font-size:12px;margin:0;">We'll come to you and provide a fixed accurate quote — no obligation.</p>
        </div>`;

  const jobRows = [["Service", lead.type || lead.service], ["Size", formatSize(lead)], ["Timeline", lead.timeline]];

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#BA9662;padding:28px 32px;border-radius:10px 10px 0 0;">
      <img src="https://groundmakers.com.au/logo.png" alt="Groundmakers" style="height:48px;max-width:200px;object-fit:contain;display:block;margin-bottom:8px;" />
      <p style="color:#fdba74;margin:0;font-size:13px;">Concrete &amp; Landscaping · Melbourne's West</p>
    </div>

    <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;">
      <p style="font-size:16px;margin:0 0 16px;">Hi ${firstName},</p>
      <p style="color:#374151;line-height:1.6;margin:0 0 20px;">
        Thanks for reaching out to Groundmakers! Here's your quote summary based on the details you provided. We've also attached a <strong>PDF copy</strong> to this email for your records.
      </p>

      <h2 style="font-size:13px;color:#BA9662;letter-spacing:1px;text-transform:uppercase;margin:0 0 12px;">Job Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${jobRows.filter(([, v]) => v).map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#F9F5EE" : "#ffffff"};">
            <td style="padding:9px 12px;font-size:13px;color:#6b7280;width:40%;">${label}</td>
            <td style="padding:9px 12px;font-size:13px;font-weight:bold;color:#1a1a2e;">${value}</td>
          </tr>
        `).join("")}
      </table>

      ${estimateHtml}

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-bottom:24px;">
        <p style="color:#92400e;font-size:12px;line-height:1.6;margin:0;">
          <strong>Note:</strong> This is a rough estimate only. Final price depends on site conditions, access, soil type, and materials. A free on-site visit gives you a fixed, accurate quote.
        </p>
      </div>

      <p style="color:#374151;line-height:1.6;margin:0 0 20px;">
        We will be in touch within 24 hours. Or feel free to call us directly:
      </p>

      <div style="text-align:center;margin:24px 0;">
        <a href="tel:0476863201" style="display:inline-block;background:#BA9662;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:14px;">
          Call 0476 863 201
        </a>
      </div>
    </div>

    <div style="background:#f9fafb;padding:20px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">Groundmakers Concrete &amp; Landscaping · Melbourne Surrounding Suburbs</p>
      <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">quotes@groundmakers.com.au · 0476 863 201</p>
    </div>
  </div>`;
}

function buildBusinessHtml(lead: QuoteLead, estimate: Estimate | null): string {
  const timestamp = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
  const rows = [
    ["Name",     lead.name],
    ["Email",    lead.email],
    ["Phone",    lead.phone],
    ["Service",  lead.type || lead.service],
    ["Size",     formatSize(lead)],
    ["Timeline", lead.timeline],
    ["Estimate", estimate ? `$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}` : "Needs on-site"],
  ];

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#1a1a2e;padding:20px 28px;border-radius:10px 10px 0 0;">
      <h2 style="color:#ffffff;margin:0;font-size:18px;">New Quote Lead</h2>
      <p style="color:#6b7280;margin:4px 0 0;font-size:12px;">${timestamp}</p>
    </div>
    <div style="background:#ffffff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;">
      <table style="width:100%;border-collapse:collapse;">
        ${rows.filter(([, v]) => v && v !== "Not provided").map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};">
            <td style="padding:9px 12px;font-size:13px;color:#6b7280;width:35%;">${label}</td>
            <td style="padding:9px 12px;font-size:13px;font-weight:bold;">${value}</td>
          </tr>
        `).join("")}
      </table>
      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">PDF quote attached — same one sent to the customer.</p>
    </div>
  </div>`;
}

export async function sendQuoteEmail(lead: QuoteLead, pdfBuffer: Buffer): Promise<void> {
  const estimate = calcEstimate(lead);
  const pdfAttachment = {
    Name: `Groundmakers-Quote-${lead.name?.replace(/\s+/g, "-") ?? "Customer"}.pdf`,
    Content: pdfBuffer.toString("base64"),
    ContentType: "application/pdf",
    ContentID: "",
  };

  const emails: postmark.Models.Message[] = [];

  // Email to the customer (only if they gave their email)
  if (lead.email) {
    emails.push({
      From: FROM_EMAIL,
      To: lead.email,
      Subject: `Your Groundmakers Quote — ${lead.type || lead.service}`,
      HtmlBody: buildCustomerHtml(lead, estimate),
      Attachments: [pdfAttachment],
      MessageStream: "outbound",
    });
  }

  // Email to the business (always)
  emails.push({
    From: FROM_EMAIL,
    To: BUSINESS_EMAIL,
    Subject: `New Lead: ${lead.name ?? "Unknown"} — ${lead.type || lead.service}`,
    HtmlBody: buildBusinessHtml(lead, estimate),
    Attachments: [pdfAttachment],
    MessageStream: "outbound",
  });

  if (emails.length === 1) {
    await getClient().sendEmail(emails[0]);
  } else {
    await getClient().sendEmailBatch(emails);
  }
}

export async function sendFinalQuoteEmail(lead: QuoteLeadRecord, lineItems: LineItem[], pdfBuffer: Buffer): Promise<void> {
  const firstName = lead.name?.split(" ")[0] ?? "there";
  const total = lineItems.reduce((s, i) => s + i.amount, 0);

  const lineItemRows = lineItems.map((item, i) => `
    <tr style="background:${i % 2 === 0 ? "#F9F5EE" : "#ffffff"};">
      <td style="padding:9px 12px;font-size:13px;color:#1a1a2e;width:70%;">${item.description}</td>
      <td style="padding:9px 12px;font-size:13px;font-weight:bold;color:#1a1a2e;text-align:right;">$${item.amount.toLocaleString()}</td>
    </tr>
  `).join("");

  const customerHtml = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#BA9662;padding:28px 32px;border-radius:10px 10px 0 0;">
      <img src="https://rsconcreting.com.au/logo.png" alt="RS Concreting" style="height:48px;max-width:200px;object-fit:contain;display:block;margin-bottom:8px;" />
      <p style="color:#fff8ee;margin:0;font-size:13px;">RS Concrete Creations &amp; Landscaping · Melbourne Suburbs</p>
    </div>
    <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;">
      <p style="font-size:16px;margin:0 0 16px;">Hi ${firstName},</p>
      <p style="color:#374151;line-height:1.6;margin:0 0 24px;">
        Please find your <strong>formal quote</strong> attached as a PDF. Here's a summary of what's included:
      </p>
      <h2 style="font-size:13px;color:#BA9662;letter-spacing:1px;text-transform:uppercase;margin:0 0 12px;">Pricing Breakdown</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
        ${lineItemRows}
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr style="background:#1a1a2e;">
          <td style="padding:10px 12px;font-size:14px;font-weight:bold;color:#ffffff;width:70%;">TOTAL</td>
          <td style="padding:10px 12px;font-size:14px;font-weight:bold;color:#BA9662;text-align:right;">$${total.toLocaleString()}</td>
        </tr>
      </table>
      <p style="color:#374151;line-height:1.6;margin:0 0 20px;">
        This quote is valid for <strong>30 days</strong>. To accept or ask any questions, call or reply to this email.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="tel:0476863201" style="display:inline-block;background:#BA9662;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:14px;">
          Call 0476 863 201
        </a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:20px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">RS Concrete Creations &amp; Landscaping Pty Ltd · ABN 77 668 809 050</p>
      <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">quotes@rsconcreting.com.au · 0476 863 201</p>
    </div>
  </div>`;

  const pdfAttachment = {
    Name: `RS-Concreting-Quote-${lead.name?.replace(/\s+/g, "-") ?? "Customer"}.pdf`,
    Content: pdfBuffer.toString("base64"),
    ContentType: "application/pdf",
    ContentID: "",
  };

  await getClient().sendEmail({
    From: FROM_EMAIL,
    To: lead.email!,
    Subject: `Your Quote from RS Concrete Creations — $${total.toLocaleString()}`,
    HtmlBody: customerHtml,
    Attachments: [pdfAttachment],
    MessageStream: "outbound",
  });
}
