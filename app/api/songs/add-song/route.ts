import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { songs, movieArtistLinks } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface SongRequestBody {
  song_name: string;
  song_name_telugu?: string;
  movie_id: number;
  artist_links?: { artist_id: number; role: string }[];
}

export async function POST(req: Request) {
  try {
    const body: SongRequestBody = await req.json();

    const { song_name, song_name_telugu, movie_id, artist_links } = body;

    if (!song_name || !movie_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert the song
    const [newSong] = await db
      .insert(songs)
      .values({
        song_name,
        song_name_telugu: song_name_telugu || "",
        movie_id,
      })
      .returning();

    // Insert artist links if provided
    if (artist_links && artist_links.length > 0) {
      const linksToInsert = artist_links.map((link) => ({
        movie_id,
        artist_id: link.artist_id,
        role: link.role,
        song_id: newSong.song_id,
      }));

      await db.insert(movieArtistLinks).values(linksToInsert);
    }

    return NextResponse.json({ success: true, song: newSong });
  } catch (err) {
    console.error("Error adding song:", err);
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 });
  }
}
