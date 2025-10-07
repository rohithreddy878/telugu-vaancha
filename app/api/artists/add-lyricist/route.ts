import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artists } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artist_name, artist_name_telugu } = body;

    if (!artist_name || !artist_name_telugu) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [newLyricist] = await db
      .insert(artists)
      .values({
        artist_name,
        artist_name_telugu,
        is_lyricist: true,
      })
      .returning();

    return NextResponse.json({ success: true, data: newLyricist });
  } catch (err) {
    console.error("❌ Error adding lyricist:", err);
    return NextResponse.json({ error: "Failed to add lyricist" }, { status: 500 });
  }
}
