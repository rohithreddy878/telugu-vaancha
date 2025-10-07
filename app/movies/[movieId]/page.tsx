"use client";

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
      {/* Telugu Movie Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-purple-700 text-center drop-shadow-md">
        {movie.movie_name_telugu}
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Year: {movie.year}
      </p>

      {/* 🎭 Actors */}
      <section className="mb-6">
        <h2 className="text-md font-medium inline mr-2">Actors:</h2>
        <span className="text-lg md:text-xl font-bold text-gray-800">
          {movie.actors && movie.actors.length > 0
            ? movie.actors.map((a: any) => a.artist_name).join(", ")
            : "No actors listed"}
        </span>
      </section>

      {/* 🎼 Composers */}
      <section className="mb-6">
        <h2 className="text-md font-medium inline mr-2">Composer(s):</h2>
        <span className="text-lg md:text-xl font-bold text-gray-800">
          {movie.composers && movie.composers.length > 0
            ? movie.composers.map((c: any) => c.artist_name).join(", ")
            : "No composers listed"}
        </span>
      </section>

      {/* 🎵 Songs */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Songs</h2>
        {songs?.length ? (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full border border-gray-200 text-left">
              <thead className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100">
                <tr>
                  <th className="p-3 border-b w-10">#</th>
                  <th className="p-3 border-b">Song Name (English)</th>
                  <th className="p-3 border-b">Song Name (Telugu)</th>
                  <th className="p-3 border-b text-center w-24">Details</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song: any, idx: number) => (
                  <tr
                    key={song.song_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 border-b">{idx + 1}</td>
                    <td className="p-3 border-b font-medium text-gray-800">
                      {song.song_name}
                    </td>
                    <td className="p-3 border-b text-gray-600">
                      {song.song_name_telugu}
                    </td>
                    <td className="p-3 border-b text-center">
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
          </div>
        ) : (
          <p className="text-gray-500">No songs yet — coming soon!</p>
        )}
      </section>
    </div>
  );
}
