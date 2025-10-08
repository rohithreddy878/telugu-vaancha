import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { songs } from "@/lib/schema";

export async function GET() {
  try {
    // Fetch only song_id and song_name
    const data = await db.select({
      song_id: songs.song_id,
      song_name: songs.song_name,
    }).from(songs);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch song names:", err);
    return NextResponse.json({ error: "Failed to fetch song names" }, { status: 500 });
  }
}
