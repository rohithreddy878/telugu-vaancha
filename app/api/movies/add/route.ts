import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { movies, movieArtistLinks } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { movie_name, movie_name_telugu, year, artists } = body;

    // 1. Insert into movies
    const insertedMovie = await db
      .insert(movies)
      .values({
        movie_name,
        movie_name_telugu,
        year,
      })
      .returning({ movie_id: movies.movie_id });

    const movie_id = insertedMovie[0].movie_id;

    // 2. Insert linked artists
    if (artists && artists.length > 0) {
      const links = artists.map((a: any) => ({
        movie_id,
        artist_id: a.artist_id,
        role: a.role,
      }));

      await db.insert(movieArtistLinks).values(links);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error adding movie:", err);
    return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
  }
}
