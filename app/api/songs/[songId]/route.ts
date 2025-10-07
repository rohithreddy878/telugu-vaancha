import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  songs,
  songArtistLinks,
  artists,
  movies,
  lyrics,
} from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const songIdParam = url.pathname.split("/").pop(); // get last segment
    const songId = Number(songIdParam);
    if (isNaN(songId)) {
      return NextResponse.json({ error: "Invalid song ID" }, { status: 400 });
    }

    // 🎵 Fetch song details
    const songResult = await db
      .select()
      .from(songs)
      .where(eq(songs.song_id, songId))
      .limit(1);

    const song = songResult[0];
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // 🎬 Fetch linked movie
    const movieResult = await db
      .select()
      .from(movies)
      .where(eq(movies.movie_id, song.movie_id))
      .limit(1);
    const movie = movieResult[0] || null;

    // 🎭 Fetch linked artists
    const artistLinks = await db
      .select({
        artist_id: artists.artist_id,
        artist_name: artists.artist_name,
        artist_name_telugu: artists.artist_name_telugu,
        role: songArtistLinks.role,
      })
      .from(songArtistLinks)
      .leftJoin(artists, eq(artists.artist_id, songArtistLinks.artist_id))
      .where(eq(songArtistLinks.song_id, songId));

    // Group by role
    const actors = artistLinks.filter((a) => a.role === "actor");
    const composers = artistLinks.filter((a) => a.role === "composer");
    const lyricists = artistLinks.filter((a) => a.role === "lyricist");
    const singers = artistLinks.filter((a) => a.role === "singer");

    // 📝 Fetch lyrics
    const lyricsResult = await db
      .select()
      .from(lyrics)
      .where(eq(lyrics.song_id, songId))
      .limit(1);
    const songLyrics = lyricsResult[0] || null;

    // ✅ Return full structured data
    return NextResponse.json({
      ...song,
      movie,
      actors,
      composers,
      lyricists,
      singers,
      lyrics: songLyrics,
    });
  } catch (err) {
    console.error("❌ Error fetching song details:", err);
    return NextResponse.json(
      { error: "Failed to fetch song details" },
      { status: 500 }
    );
  }
}
