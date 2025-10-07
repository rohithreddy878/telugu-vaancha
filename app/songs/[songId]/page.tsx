import React from "react";

interface SongDetailsPageProps {
  params: { songId: string };
}

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
      {/* 🎵 Song Name */}
      <h1 className="text-3xl font-bold mb-1">{song.song_name_telugu}</h1>
      <p className="text-lg text-gray-700 mb-4 italic">{song.song_name}</p>

      {/* 🎬 Movie Info */}
      <p className="text-sm text-gray-500 mb-6">
        Movie:{" "}
        <span className="font-medium text-gray-800">
          {song.movie?.movie_name} ({song.movie?.movie_name_telugu})
        </span>
      </p>

      {/* 🎭 Actors */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        {song.actors?.length ? (
          <ul className="list-disc list-inside">
            {song.actors.map((actor: any) => (
              <li key={actor.artist_id}>
                {actor.artist_name_telugu}{" "}
                {actor.artist_name ? `(${actor.artist_name})` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No actors listed.</p>
        )}
      </section>

      {/* 🎼 Composers */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Composers</h2>
        {song.composers?.length ? (
          <ul className="list-disc list-inside">
            {song.composers.map((composer: any) => (
              <li key={composer.artist_id}>
                {composer.artist_name_telugu}{" "}
                {composer.artist_name ? `(${composer.artist_name})` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No composers listed.</p>
        )}
      </section>

      {/* ✍️ Lyricists */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Lyricists</h2>
        {song.lyricists?.length ? (
          <ul className="list-disc list-inside">
            {song.lyricists.map((lyricist: any) => (
              <li key={lyricist.artist_id}>
                {lyricist.artist_name_telugu}{" "}
                {lyricist.artist_name ? `(${lyricist.artist_name})` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No lyricists listed.</p>
        )}
      </section>

      {/* 🎤 Singers */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Singers</h2>
        {song.singers?.length ? (
          <ul className="list-disc list-inside">
            {song.singers.map((singer: any) => (
              <li key={singer.artist_id}>
                {singer.artist_name_telugu}{" "}
                {singer.artist_name ? `(${singer.artist_name})` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No singers listed.</p>
        )}
      </section>

      {/* 📝 Lyrics */}
      <section className="mt-10">
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
