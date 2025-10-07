"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
  const [topActors, setTopActors] = useState<Artist[]>([]);
  const [topSingers, setTopSingers] = useState<Artist[]>([]);
  const [topComposers, setTopComposers] = useState<Artist[]>([]);
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  const topActorIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const topSingerIds = [80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
  const topComposerIds = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69];
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
        const [actorsRes, singersRes, composersRes, songsRes, moviesRes] =
          await Promise.all([
            fetch(
              `${baseUrl}/api/artists/get-by-ids?ids=${topActorIds.join(",")}`
            ),
            fetch(
              `${baseUrl}/api/artists/get-by-ids?ids=${topSingerIds.join(",")}`
            ),
            fetch(
              `${baseUrl}/api/artists/get-by-ids?ids=${topComposerIds.join(
                ","
              )}`
            ),
            fetch(
              `${baseUrl}/api/songs/get-by-ids?ids=${topSongIds.join(",")}`
            ),
            fetch(
              `${baseUrl}/api/movies/get-by-ids?ids=${topMovieIds.join(",")}`
            ),
          ]);

        const [actorsData, singersData, composersData, songsData, moviesData] =
          await Promise.all([
            actorsRes.json(),
            singersRes.json(),
            composersRes.json(),
            songsRes.json(),
            moviesRes.json(),
          ]);

        setTopActors(actorsData);
        setTopSingers(singersData);
        setTopComposers(composersData);
        setTopSongs(songsData);
        setTopMovies(moviesData);
      } catch (err) {
        console.error("Error fetching top lists:", err);
      }
    }

    fetchData();
  }, []);

  const sectionHeader =
    "text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow text-center";

  const carouselContainer =
    "flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 py-4 justify-start scrollbar-hide scroll-smooth";

  const tileStyle =
    "min-w-[200px] max-w-[200px] h-[150px] snap-center bg-gradient-to-br from-purple-100 via-white to-pink-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-center items-center text-center p-4 hover:-translate-y-1";

  const Tile = ({
    titleTelugu,
    title,
    href,
  }: {
    titleTelugu: string;
    title?: string;
    href: string;
  }) => (
    <Link href={href}>
      <motion.div
        className={tileStyle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <p className="font-bold text-lg text-gray-800 truncate w-full">
          {titleTelugu}
        </p>
        {title && (
          <p className="text-sm text-gray-500 mt-1 truncate w-full">{title}</p>
        )}
      </motion.div>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-gray-50 pb-24">
      {/* Header */}
      <div className="prose mx-auto text-center mt-12">
        <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-[length:200%_200%] animate-[gradient-move_6s_linear_infinite] bg-clip-text text-transparent drop-shadow-lg tracking-tight text-center">
          తెలుగు వాంఛ
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 italic tracking-wide text-center">
          celebrating the music of Telugu cinema
        </p>
      </div>

      {/* Carousels */}
      <section className="mt-20 w-full max-w-6xl space-y-20">
        {/* 🎵 Top Songs */}
        <div>
          <h2 className={sectionHeader}>🎵 Top 10 Songs</h2>
          <div className={carouselContainer}>
            {topSongs.map((s) => (
              <Tile
                key={s.song_id}
                titleTelugu={s.song_name_telugu}
                title={s.song_name}
                href={`/songs/${s.song_id}`}
              />
            ))}
          </div>
        </div>

        {/* 🎭 Top Actors */}
        <div>
          <h2 className={sectionHeader}>🎭 Top 10 Actors</h2>
          <div className={carouselContainer}>
            {topActors.map((a) => (
              <Tile
                key={a.artist_id}
                titleTelugu={a.artist_name_telugu}
                title={a.artist_name}
                href="/"
              />
            ))}
          </div>
        </div>

        {/* 🎤 Top Singers */}
        <div>
          <h2 className={sectionHeader}>🎤 Top 10 Singers</h2>
          <div className={carouselContainer}>
            {topSingers.map((s) => (
              <Tile
                key={s.artist_id}
                titleTelugu={s.artist_name_telugu}
                title={s.artist_name}
                href="/"
              />
            ))}
          </div>
        </div>

        {/* 🎼 Top Composers */}
        <div>
          <h2 className={sectionHeader}>🎼 Top 10 Composers</h2>
          <div className={carouselContainer}>
            {topComposers.map((c) => (
              <Tile
                key={c.artist_id}
                titleTelugu={c.artist_name_telugu}
                title={c.artist_name}
                href="/"
              />
            ))}
          </div>
        </div>

        {/* 🎬 Top Movies */}
        <div>
          <h2 className={sectionHeader}>🎬 Top 10 Movies</h2>
          <div className={carouselContainer}>
            {topMovies.map((m) => (
              <Tile
                key={m.movie_id}
                titleTelugu={m.movie_name_telugu}
                title={m.movie_name}
                href={`/movies/${m.movie_id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* Hide scrollbar but keep scrollability */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
