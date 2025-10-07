import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artists } from "@/lib/schema";
import { inArray } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const idsParam = url.searchParams.get("ids");
    if (!idsParam) return NextResponse.json([], { status: 200 });

    const ids = idsParam.split(",").map((id) => Number(id)).filter((id) => !isNaN(id));
    if (ids.length === 0) return NextResponse.json([], { status: 200 });

    const data = await db.select().from(artists).where(inArray(artists.artist_id, ids));
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
  }
}
