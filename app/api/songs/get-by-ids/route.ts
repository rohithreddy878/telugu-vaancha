import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { songs, movies } from "@/lib/schema";
import { inArray, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const idsParam = url.searchParams.get("ids");
    if (!idsParam) return NextResponse.json([], { status: 200 });

    const ids = idsParam.split(",").map((id) => Number(id)).filter((id) => !isNaN(id));
    if (ids.length === 0) return NextResponse.json([], { status: 200 });

    const data = await db.select({
                    song_id: songs.song_id,
                    song_name_telugu: songs.song_name_telugu,
                    movie_id: songs.movie_id,
                    movie_name_telugu: movies.movie_name_telugu,
                  })
                .from(songs)
                .leftJoin(movies, eq(songs.movie_id, movies.movie_id))
                .where(inArray(songs.song_id, ids));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}
