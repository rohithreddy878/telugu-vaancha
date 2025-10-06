import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { movies, movieArtistLinks, artists } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: { movieId: string } }
) {
  try {
    const { movieId } = context.params;
    const mId = Number(movieId);
    if (isNaN(mId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    // 🎬 Fetch movie details
    const movieResult = await db
      .select()
      .from(movies)
      .where(eq(movies.movie_id, mId))
      .limit(1);

    const movie = movieResult[0];
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // 👥 Fetch linked artists (actors, composers, etc.)
    const artistLinks = await db
      .select({
        artist_id: artists.artist_id,
        artist_name: artists.artist_name,
        role: movieArtistLinks.role,
      })
      .from(movieArtistLinks)
      .leftJoin(artists, eq(artists.artist_id, movieArtistLinks.artist_id))
      .where(eq(movieArtistLinks.movie_id, mId));

    // Group by role
    const actors = artistLinks.filter((a) => a.role === "actor");
    const composers = artistLinks.filter((a) => a.role === "composer");
    const lyricists = artistLinks.filter((a) => a.role === "lyricist");

    // 🎵 Placeholder: songs list (to add later)
    const songs: any[] = [];

    return NextResponse.json({
      ...movie,
      actors,
      composers,
      lyricists,
      songs,
    });
  } catch (err) {
    console.error("Error fetching movie details:", err);
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
