import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artists } from "@/lib/schema";
import { sql, asc } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const result = await db
      .select()
      .from(artists)
      .orderBy(asc(artists.artist_id))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(artists);

    const total = Number(totalResult[0]?.count ?? 0);

    return NextResponse.json({
      data: result,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching artists:", err);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}
