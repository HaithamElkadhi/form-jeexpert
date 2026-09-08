import { NextRequest, NextResponse } from "next/server";
import { createSupportTicket, getTicketCategories } from "@/lib/ticket-airtable";

export async function POST(req: NextRequest) {
  let body: {
    fullName?: string;
    email?: string;
    phone?: string;
    category?: string;
    description?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const category = String(body.category ?? "").trim();
  const description = String(body.description ?? "").trim();

  if (!fullName || !email || !phone || !category || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let allowed: string[];
  try {
    allowed = await getTicketCategories();
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not validate category against Airtable." },
      { status: 502 }
    );
  }

  if (!allowed.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const result = await createSupportTicket({
      fullName,
      email,
      phone,
      category,
      description,
    });

    return NextResponse.json({
      ok: true,
      recordId: result.recordId,
      ticketRef: result.ticketRef,
      linkedProspect: result.linkedProspect,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not submit your ticket. Please try again." },
      { status: 502 }
    );
  }
}
