import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { movies, movieArtistLinks, artists, songs } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const movieIdParam = url.pathname.split("/").pop(); // get last segment
    const movieId = Number(movieIdParam);
    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    // 🎬 Fetch movie details
    const movieResult = await db
      .select()
      .from(movies)
      .where(eq(movies.movie_id, movieId))
      .limit(1);

    const movie = movieResult[0];
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // 👥 Fetch linked artists
    const artistLinks = await db
      .select({
        artist_id: artists.artist_id,
        artist_name: artists.artist_name,
        artist_name_telugu: artists.artist_name_telugu,
        role: movieArtistLinks.role,
      })
      .from(movieArtistLinks)
      .leftJoin(artists, eq(artists.artist_id, movieArtistLinks.artist_id))
      .where(eq(movieArtistLinks.movie_id, movieId));

    // 🎭 Group by role
    const actors = artistLinks.filter((a) => a.role === "actor");
    const composers = artistLinks.filter((a) => a.role === "composer");
    const lyricists = artistLinks.filter((a) => a.role === "lyricist");

    // 🎵 Fetch songs for this movie
    const songList = await db
      .select({
        song_id: songs.song_id,
        song_name: songs.song_name,
        song_name_telugu: songs.song_name_telugu,
      })
      .from(songs)
      .where(eq(songs.movie_id, movieId));

    return NextResponse.json({
      ...movie,
      actors,
      composers,
      lyricists,
      songs: songList,
    });
  } catch (err) {
    console.error("❌ Error fetching movie details:", err);
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
