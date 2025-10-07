import React from "react";
import Link from "next/link";

export default async function SongDetailsPage({
  params,
}: {
  params: Promise<{ songId: string }>;
}) {
  const { songId } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/songs/${songId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch song details");
  }

  const song = await res.json();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 🎵 Song Name in Telugu */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-600 mb-8 text-center drop-shadow-lg">
        {song.song_name_telugu}
      </h1>

      {/* Movie Info */}
      <p className="text-gray-1000 text-lg md:text-xl text-center mb-4">
        {song.movie?.movie_name_telugu}
      </p>

      {/* 🎭 Actors */}
      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-500 inline-block mr-2">
          Actors:
        </h2>
        <span className="text-gray-800 font-semibold">
          {song.actors?.map((a: any) => a.artist_name_telugu).join(", ") || "—"}
        </span>
      </section>

      {/* 🎼 Composers */}
      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-500 inline-block mr-2">
          Composer(s):
        </h2>
        <span className="text-gray-800 font-semibold">
          {song.composers?.map((c: any) => c.artist_name_telugu).join(", ") ||
            "—"}
        </span>
      </section>

      {/* ✍️ Lyricists */}
      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-500 inline-block mr-2">
          Lyricist(s):
        </h2>
        <span className="text-gray-800 font-semibold">
          {song.lyricists?.map((l: any) => l.artist_name_telugu).join(", ") ||
            "—"}
        </span>
      </section>

      {/* 🎤 Singers */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-gray-500 inline-block mr-2">
          Singer(s):
        </h2>
        <span className="text-gray-800 font-semibold">
          {song.singers?.map((s: any) => s.artist_name_telugu).join(", ") ||
            "—"}
        </span>
      </section>

      {/* 📝 Lyrics */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Lyrics</h2>

        {song.lyrics ? (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Telugu Lyrics
              </h3>
              <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed border-l-4 border-gray-300 pl-4">
                {song.lyrics.telugu_lyrics}
              </pre>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                English Lyrics
              </h3>
              <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed border-l-4 border-gray-300 pl-4">
                {song.lyrics.english_lyrics}
              </pre>
            </div>

            {song.lyrics.english_translated_subs && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  English Translated Subtitles
                </h3>
                <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed border-l-4 border-gray-300 pl-4">
                  {song.lyrics.english_translated_subs}
                </pre>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">Lyrics not added yet.</p>
        )}
      </section>
    </div>
  );
}
