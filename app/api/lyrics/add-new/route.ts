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

    if (!song_id || !telugu_lyrics || !english_transliteration_lyrics || !english_translation_lyrics) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into lyrics table
    const result = await db.insert(lyrics).values({
      song_id,
      telugu_lyrics,
      english_transliteration_lyrics,
      english_translation_lyrics,
      song_info: song_info || null,
    }).returning({ lyric_id: lyrics.lyric_id });

    return NextResponse.json({ message: "Lyrics added successfully", id: result[0].lyric_id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to add lyrics" },
      { status: 500 }
    );
  }
}
