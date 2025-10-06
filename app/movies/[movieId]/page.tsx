import React from "react";

interface MovieDetailsPageProps {
  params: { movieId: string };
}

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

  const res = await fetch(`${baseUrl}/api/movies/${movieId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const movie = await res.json();

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
        {movie.songs?.length ? (
          <ul className="list-disc list-inside">
            {movie.songs.map((song: any, idx: number) => (
              <li key={idx}>{song.song_name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No songs yet — coming soon!</p>
        )}
      </section>
    </div>
  );
}
