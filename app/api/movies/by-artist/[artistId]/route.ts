import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { movies, movieArtistLinks } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // 🔹 Extract artist ID from URL
    const url = new URL(request.url);
    const artistIdParam = url.pathname.split("/").pop();
    const artistId = Number(artistIdParam);

    if (isNaN(artistId)) {
      return NextResponse.json({ error: "Invalid artist ID" }, { status: 400 });
    }

    // 🔹 Pagination (defaults)
    const searchParams = url.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const PAGE_SIZE = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * PAGE_SIZE;

    // 🔹 Total movie count for this artist
    const totalQuery = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${movies.movie_id})` })
      .from(movieArtistLinks)
      .innerJoin(movies, eq(movies.movie_id, movieArtistLinks.movie_id))
      .where(eq(movieArtistLinks.artist_id, artistId));

    const total = totalQuery[0]?.count ?? 0;

    // 🔹 Fetch movies list with aggregated roles
    const movieList = await db
      .select({
        movie_id: movies.movie_id,
        movie_name: movies.movie_name,
        movie_name_telugu: movies.movie_name_telugu,
        year: movies.year,
        roles: sql<string>`STRING_AGG(DISTINCT ${movieArtistLinks.role}, ', ')`,
      })
      .from(movieArtistLinks)
      .innerJoin(movies, eq(movies.movie_id, movieArtistLinks.movie_id))
      .where(eq(movieArtistLinks.artist_id, artistId))
      .groupBy(
        movies.movie_id,
        movies.movie_name,
        movies.movie_name_telugu,
        movies.year
      )
      .orderBy(desc(movies.year), desc(movies.movie_id))
      .limit(PAGE_SIZE)
      .offset(offset);

    // 🔹 Final response
    return NextResponse.json({
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
      movies: movieList,
    });
  } catch (err) {
    console.error("❌ Error fetching artist movies:", err);
    return NextResponse.json(
      { error: "Failed to fetch artist movies" },
      { status: 500 }
    );
  }
}
