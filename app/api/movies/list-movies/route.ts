import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { movies } from "@/lib/schema";
import { asc, limit } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(movies)
      .orderBy(asc(movies.movie_name))
      .limit(10);

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ Error fetching movies:", err);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
