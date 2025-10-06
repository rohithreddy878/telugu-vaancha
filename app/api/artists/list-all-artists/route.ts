import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artists } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(artists)
      .orderBy(asc(artists.artist_name));

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ Error fetching artists:", err);
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
  }
}
