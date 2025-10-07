"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Artist {
  artist_id: number;
  artist_name: string;
  artist_name_telugu: string;
}
interface Song {
  song_id: number;
  song_name: string;
  song_name_telugu: string;
}
interface Movie {
  movie_id: number;
  movie_name: string;
  movie_name_telugu: string;
}

export default function Home() {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  const topArtistIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const topSongIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const topMovieIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Artists
        const resArtists = await fetch(
          `${baseUrl}/api/artists/get-by-ids?ids=${topArtistIds.join(",")}`
        );
        const artistsData = await resArtists.json();
        setTopArtists(artistsData);

        // Fetch Songs
        const resSongs = await fetch(
          `${baseUrl}/api/songs/get-by-ids?ids=${topSongIds.join(",")}`
        );
        const songsData = await resSongs.json();
        setTopSongs(songsData);

        // Fetch Movies
        const resMovies = await fetch(
          `${baseUrl}/api/movies/get-by-ids?ids=${topMovieIds.join(",")}`
        );
        const moviesData = await resMovies.json();
        setTopMovies(moviesData);
      } catch (err) {
        console.error("Error fetching top lists:", err);
      }
    }

    fetchData();
  }, []);

  const tileClass =
    "border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer text-center bg-white";

  const headerClass =
    "text-3xl md:text-4xl font-extrabold text-purple-600 mb-4";

  return (
    <div className="prose mx-auto text-center mt-12">
      {/* Telugu Title */}
      <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-[length:200%_200%] animate-[gradient-move_6s_linear_infinite] bg-clip-text text-transparent drop-shadow-lg tracking-tight text-center">
        తెలుగు వాంఛ
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-600 italic tracking-wide text-center">
        celebrating the music of Telugu cinema
      </p>

      {/* Carousels */}
      <section className="mt-16">
        {/* Top Artists */}
        <h2 className={headerClass}>Top 10 Artists</h2>
        <div className="flex gap-4 overflow-x-auto py-2 px-1">
          {topArtists.map((artist) => (
            <Link key={artist.artist_id} href={`/`} className={tileClass}>
              <p className="font-semibold text-lg">
                {artist.artist_name_telugu}
              </p>
              <p className="text-sm text-gray-500">{artist.artist_name}</p>
            </Link>
          ))}
        </div>

        {/* Top Songs */}
        <h2 className={headerClass}>Top 10 Songs</h2>
        <div className="flex gap-4 overflow-x-auto py-2 px-1">
          {topSongs.map((song) => (
            <Link
              key={song.song_id}
              href={`/songs/${song.song_id}`}
              className={tileClass}
            >
              <p className="font-semibold text-lg">{song.song_name_telugu}</p>
              <p className="text-sm text-gray-500">{song.song_name}</p>
            </Link>
          ))}
        </div>

        {/* Top Movies */}
        <h2 className={headerClass}>Top 10 Movies</h2>
        <div className="flex gap-4 overflow-x-auto py-2 px-1">
          {topMovies.map((movie) => (
            <Link
              key={movie.movie_id}
              href={`/movies/${movie.movie_id}`}
              className={tileClass}
            >
              <p className="font-semibold text-lg">{movie.movie_name_telugu}</p>
              <p className="text-sm text-gray-500">{movie.movie_name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
