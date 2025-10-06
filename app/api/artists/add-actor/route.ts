import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artists } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artist_name, artist_name_telugu } = body;

    if (!artist_name || !artist_name_telugu) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if artist already exists
    const existing = await db
      .select()
      .from(artists)
      .where(eq(artists.artist_name, artist_name));

    if (existing.length > 0) {
      return NextResponse.json({ error: "Artist already exists" }, { status: 400 });
    }

    // Insert new artist
    await db.insert(artists).values({
      artist_name,
      artist_name_telugu,
      is_actor: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding artist:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
