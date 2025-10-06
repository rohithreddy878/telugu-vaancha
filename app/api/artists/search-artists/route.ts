import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artists } from "@/lib/schema";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  let results;

  if (query) {
    // Case-insensitive search using LOWER()
    results = await db
      .select()
      .from(artists)
      .where(sql`LOWER(${artists.artist_name}) LIKE LOWER(${`%${query}%`})`);
  } else {
    results = await db.select().from(artists);
  }

  return NextResponse.json({ data: results });
}
