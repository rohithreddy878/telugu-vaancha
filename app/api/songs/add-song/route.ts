// app/api/songs/add-song/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { songs, songArtistLinks } from "@/lib/schema";

interface ArtistLinkInput {
  artist_id: number | string;
  role: string;
}

interface SongRequestBody {
  song_name: string;
  song_name_telugu?: string;
  movie_id: number | string;
  artistLinks?: ArtistLinkInput[];
  artist_links?: ArtistLinkInput[]; // for compatibility
}

export async function POST(req: Request) {
  try {
    const body: SongRequestBody = await req.json();

    const {
      song_name,
      song_name_telugu = "",
      movie_id,
      artistLinks = body.artist_links || [],
    } = body;

    if (!song_name || !movie_id) {
      return NextResponse.json(
        { error: "Missing required fields: song_name or movie_id" },
        { status: 400 }
      );
    }

    // 1️⃣ Insert song
    const [newSong] = await db
      .insert(songs)
      .values({
        song_name,
        song_name_telugu,
        movie_id: Number(movie_id),
      })
      .returning();

    // 2️⃣ Insert artist links (into song_artist_links)
    if (Array.isArray(artistLinks) && artistLinks.length > 0) {
      const validLinks = artistLinks
        .map((link) => {
          const artist_id = Number(link.artist_id);
          const role = link.role?.trim();

          if (!artist_id || !role) return null;

          return {
            song_id: newSong.song_id,
            artist_id,
            role,
          };
        })
        .filter(Boolean) as { song_id: number; artist_id: number; role: string }[];

      if (validLinks.length > 0) {
        await db.insert(songArtistLinks).values(validLinks);
      }
    }

    return NextResponse.json({ success: true, song: newSong });
  } catch (err) {
    console.error("❌ Error adding song:", err);
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 });
  }
}
