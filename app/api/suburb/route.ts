import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const postcode = new URL(req.url).searchParams.get("postcode");
  if (!postcode || !/^\d{4}$/.test(postcode)) {
    return NextResponse.json({ error: "Invalid postcode" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://data.handyapi.com/au-postcodes/${postcode}`, {
      headers: { "x-api-key": process.env.HANDY_API_KEY! },
    });

    if (!res.ok) return NextResponse.json({ suburbs: [] });

    const data = await res.json() as { Status: string; Locations?: { Name: string; State: string }[] };

    if (data.Status !== "SUCCESS" || !data.Locations?.length) {
      return NextResponse.json({ suburbs: [] });
    }

    const suburbs = data.Locations.map(l =>
      l.Name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    );

    return NextResponse.json({ suburbs });
  } catch {
    return NextResponse.json({ suburbs: [] });
  }
}
