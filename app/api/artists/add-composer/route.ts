import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artists } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artist_name, artist_name_telugu } = body;

    if (!artist_name || !artist_name_telugu) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [newComposer] = await db
      .insert(artists)
      .values({
        artist_name,
        artist_name_telugu,
        is_composer: true,
      })
      .returning();

    return NextResponse.json({ success: true, data: newComposer });
  } catch (err) {
    console.error("❌ Error adding composer:", err);
    return NextResponse.json({ error: "Failed to add composer" }, { status: 500 });
  }
}
