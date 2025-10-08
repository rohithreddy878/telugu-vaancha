// app/api/lyrics/add-new/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lyrics } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      song_id,
      telugu_lyrics,
      english_transliteration_lyrics,
      english_translation_lyrics,
      song_info,
    } = body;

    if (!song_id || !telugu_lyrics) {
      return NextResponse.json(
        { error: "song_id and telugu_lyrics are required" },
        { status: 400 }
      );
    }

    // Insert new lyrics entry
    await db.insert(lyrics).values({
      song_id,
      telugu_lyrics,
      english_transliteration_lyrics,
      english_translation_lyrics,
      song_info, // ✅ newly added field
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding lyrics:", err);
    return NextResponse.json(
      { error: "Failed to add lyrics" },
      { status: 500 }
    );
  }
}
