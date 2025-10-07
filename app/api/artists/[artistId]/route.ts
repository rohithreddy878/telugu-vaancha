import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artists } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const artistIdParam = url.pathname.split("/").pop();
    const artistId = Number(artistIdParam);

    if (isNaN(artistId)) {
      return NextResponse.json({ error: "Invalid artist ID" }, { status: 400 });
    }

    const artistResult = await db
      .select()
      .from(artists)
      .where(eq(artists.artist_id, artistId))
      .limit(1);

    const artist = artistResult[0];
    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // determine artist role from booleans
    const roles = [];
    if (artist.is_actor) roles.push("Actor");
    if (artist.is_singer) roles.push("Singer");
    if (artist.is_composer) roles.push("Composer");
    if (artist.is_lyricist) roles.push("Lyricist");

    return NextResponse.json({
      artist_id: artist.artist_id,
      artist_name: artist.artist_name,
      artist_name_telugu: artist.artist_name_telugu,
      is_actor: artist.is_actor,
      is_singer: artist.is_singer,
      is_composer: artist.is_composer,
      is_lyricist: artist.is_lyricist,
      roles,
    });
  } catch (err) {
    console.error("❌ Error fetching artist details:", err);
    return NextResponse.json(
      { error: "Failed to fetch artist details" },
      { status: 500 }
    );
  }
}
