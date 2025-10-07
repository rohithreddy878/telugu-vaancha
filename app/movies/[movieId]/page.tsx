import React from "react";
import Link from "next/link";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  // Fetch movie details
  const res = await fetch(`${baseUrl}/api/movies/${movieId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const movie = await res.json();
  const songs = movie.songs ? movie.songs : [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{movie.movie_name}</h1>
      <p className="text-gray-600 text-lg mb-2">{movie.movie_name_telugu}</p>
      <p className="text-sm text-gray-500 mb-6">Year: {movie.year}</p>

      {/* 🎭 Actors */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Actors</h2>
        {movie.actors?.length ? (
          <ul className="list-disc list-inside">
            {movie.actors.map((actor: any) => (
              <li key={actor.artist_id}>{actor.artist_name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No actors listed.</p>
        )}
      </section>

      {/* 🎼 Composers */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Composers</h2>
        {movie.composers?.length ? (
          <ul className="list-disc list-inside">
            {movie.composers.map((composer: any) => (
              <li key={composer.artist_id}>{composer.artist_name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No composers listed.</p>
        )}
      </section>

      {/* 🎵 Songs */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Songs</h2>
        {songs?.length ? (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border-b w-10">#</th>
                <th className="p-2 border-b">Song Name (English)</th>
                <th className="p-2 border-b">Song Name (Telugu)</th>
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
                  <td className="p-2 border-b">{song.song_name}</td>
                  <td className="p-2 border-b">{song.song_name_telugu}</td>
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
