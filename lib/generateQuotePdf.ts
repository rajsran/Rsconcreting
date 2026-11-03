import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer, Font } from "@react-pdf/renderer";
import React from "react";
import path from "path";
import { QuoteLead, Estimate, calcEstimate, formatSize } from "./pricing";

Font.register({
  family: "Helvetica",
  fonts: [],
});

// ── Update this with the real ABN ──────────────────────────────────────────────
const COMPANY_ABN = "XX XXX XXX XXX";
const LOGO_PATH = path.join(process.cwd(), "public", "logo.png");

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a2e",
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
    backgroundColor: "#ffffff",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#BA9662",
  },
  logo: {
    width: 160,
    height: 60,
    objectFit: "contain",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  quoteLabel: {
    fontSize: 9,
    color: "#6b7280",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  quoteNumber: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  quoteDate: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },

  // Two-column section
  twoCol: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  col: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#BA9662",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    color: "#6b7280",
    width: 60,
  },
  infoValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    flex: 1,
  },

  // Job details table
  table: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#BA9662",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 1,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableRowAlt: {
    backgroundColor: "#F9F5EE",
  },
  tableCell: {
    fontSize: 9,
    color: "#374151",
    flex: 1,
  },
  tableCellBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    flex: 1,
  },

  // Estimate box
  estimateBox: {
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  estimateLabel: {
    fontSize: 8,
    color: "#9ca3af",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  estimateAmount: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  estimateNote: {
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 1.5,
  },

  // No estimate box
  noEstimateBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  noEstimateTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  noEstimateNote: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
  },

  // Disclaimer
  disclaimer: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 6,
    padding: 12,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 8,
    color: "#92400e",
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    fontSize: 8,
    color: "#9ca3af",
    lineHeight: 1.5,
  },
  footerRight: {
    fontSize: 8,
    color: "#BA9662",
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    lineHeight: 1.5,
  },
});

function QuotePdfDocument({ lead, estimate }: { lead: QuoteLead; estimate: Estimate | null }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" });
  const quoteNum = `GM-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

  const jobDetails = [
    { label: "Service",  value: lead.service  ?? "—" },
    { label: "Type",     value: lead.type     ?? "—" },
    { label: "Size",     value: formatSize(lead) },
    { label: "Timeline", value: lead.timeline ?? "—" },
  ];

  return (
    React.createElement(Document, { title: `Groundmakers Quote — ${lead.name ?? "Customer"}` },
      React.createElement(Page, { size: "A4", style: styles.page },

        // ── Header ──
        React.createElement(View, { style: styles.header },
          React.createElement(Image, { style: styles.logo, src: LOGO_PATH }),
          React.createElement(View, { style: styles.headerRight },
            React.createElement(Text, { style: styles.quoteLabel }, "Quote Reference"),
            React.createElement(Text, { style: styles.quoteNumber }, quoteNum),
            React.createElement(Text, { style: styles.quoteDate }, dateStr),
          ),
        ),

        // ── Prepared for / Contact ──
        React.createElement(View, { style: styles.twoCol },
          React.createElement(View, { style: styles.col },
            React.createElement(Text, { style: styles.sectionTitle }, "Prepared For"),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Name"),
              React.createElement(Text, { style: styles.infoValue }, lead.name ?? "—"),
            ),
            lead.email ? React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Email"),
              React.createElement(Text, { style: styles.infoValue }, lead.email),
            ) : null,
            lead.phone && lead.phone !== "Not provided" ? React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Phone"),
              React.createElement(Text, { style: styles.infoValue }, lead.phone),
            ) : null,
          ),
          React.createElement(View, { style: styles.col },
            React.createElement(Text, { style: styles.sectionTitle }, "From"),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Company"),
              React.createElement(Text, { style: styles.infoValue }, "Groundmakers Concrete & Landscaping"),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "ABN"),
              React.createElement(Text, { style: styles.infoValue }, COMPANY_ABN),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Contact"),
              React.createElement(Text, { style: styles.infoValue }, "Arsdeep & Gurnaib Singh"),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Phone"),
              React.createElement(Text, { style: styles.infoValue }, "0476 863 201"),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Area"),
              React.createElement(Text, { style: styles.infoValue }, "Melbourne's Western Suburbs"),
            ),
          ),
        ),

        // ── Job Details Table ──
        React.createElement(View, { style: styles.table },
          React.createElement(Text, { style: styles.sectionTitle }, "Job Details"),
          React.createElement(View, { style: styles.tableHeader },
            React.createElement(Text, { style: styles.tableHeaderText }, "Item"),
            React.createElement(Text, { style: styles.tableHeaderText }, "Details"),
          ),
          ...jobDetails.map(({ label, value }, i) =>
            React.createElement(View, { key: label, style: [styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}] },
              React.createElement(Text, { style: styles.tableCell }, label),
              React.createElement(Text, { style: styles.tableCellBold }, value),
            )
          ),
        ),

        // ── Estimate ──
        estimate
          ? React.createElement(View, { style: styles.estimateBox },
              React.createElement(Text, { style: styles.estimateLabel }, "Rough Estimate"),
              React.createElement(Text, { style: styles.estimateAmount },
                `$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}`
              ),
              React.createElement(Text, { style: styles.estimateNote },
                `Supply & install · Based on ${estimate.quantity} ${estimate.unit}\nAccurate quote provided after free on-site inspection`
              ),
            )
          : React.createElement(View, { style: styles.noEstimateBox },
              React.createElement(Text, { style: styles.noEstimateTitle }, "Free On-Site Inspection Required"),
              React.createElement(Text, { style: styles.noEstimateNote },
                "We'll visit your property, measure up, and provide a fixed accurate quote — no obligation."
              ),
            ),

        // ── Disclaimer ──
        React.createElement(View, { style: styles.disclaimer },
          React.createElement(Text, { style: styles.disclaimerText },
            "IMPORTANT: This is a rough estimate only, based on the information provided. Final pricing depends on site conditions, access, soil type, excavation requirements, and materials selected. All prices are subject to change. This estimate is valid for 30 days from the date above. A free on-site inspection is required before any formal quote or contract is issued."
          ),
        ),

        // ── Footer ──
        React.createElement(View, { style: styles.footer },
          React.createElement(Text, { style: styles.footerLeft },
            `Groundmakers Concrete & Landscaping · ABN ${COMPANY_ABN}\nMelbourne Surrounding Suburbs`
          ),
          React.createElement(Text, { style: styles.footerRight },
            "0476 863 201\nquotes@groundmakers.com.au"
          ),
        ),
      )
    )
  );
}

export async function generateQuotePdf(lead: QuoteLead): Promise<Buffer> {
  const estimate = calcEstimate(lead);
  const doc = QuotePdfDocument({ lead, estimate });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
