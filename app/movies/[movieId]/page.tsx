import React from "react";
import Link from "next/link";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  // Await params for correct Next.js App Router typing
  const { movieId } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  // Server-side fetch; no useEffect needed
  const res = await fetch(`${baseUrl}/api/movies/${movieId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const movie = await res.json();
  const songs = movie.songs || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Telugu title only, styled */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-600 mb-8 text-center drop-shadow-lg">
        {movie.movie_name_telugu}
      </h1>

      <p className="text-gray-500 text-sm text-center mb-4">{movie.year}</p>

      {/* Actors */}
      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Actors:</h2>
        <p className="ml-2 text-gray-700">
          {movie.actors?.length
            ? movie.actors.map((a: any) => a.artist_name).join(", ")
            : "No actors listed"}
        </p>
      </section>

      {/* Composers */}
      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Composer(s):</h2>
        <p className="ml-2 text-gray-700">
          {movie.composers?.length
            ? movie.composers.map((c: any) => c.artist_name).join(", ")
            : "No composers listed"}
        </p>
      </section>

      {/* Lyricists */}
      {movie.lyricists?.length ? (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-1">Lyricist(s):</h2>
          <p className="ml-2 text-gray-700">
            {movie.lyricists.map((l: any) => l.artist_name).join(", ")}
          </p>
        </section>
      ) : null}

      {/* Songs */}
      <section className="mb-6">
        <h2 className="font-bold text-lg mb-3">Songs</h2>
        {songs.length ? (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border-b w-10">#</th>
                <th className="p-2 border-b">Song Name (Telugu)</th>
                <th className="p-2 border-b">Song Name (English)</th>
                <th className="p-2 border-b text-center w-24">Details</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song: any, idx: number) => (
                <tr
                  key={song.song_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-2 border-b">{idx + 1}</td>
                  <td className="p-2 border-b">{song.song_name_telugu}</td>
                  <td className="p-2 border-b">{song.song_name}</td>
                  <td className="p-2 border-b text-center">
                    <Link
                      href={`/songs/${song.song_id}`}
                      className="inline-flex items-center justify-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No songs yet — coming soon!</p>
        )}
      </section>
    </div>
  );
}
