import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { movies } from "@/lib/schema";
import { ilike } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  if (!query)
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 }
    );

  try {
    const result = await db
      .select()
      .from(movies)
      .where(ilike(movies.movie_name, `%${query}%`))
      .limit(20);

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ Error searching movies:", err);
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
}
