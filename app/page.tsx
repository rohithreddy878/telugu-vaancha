"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Great_Vibes, Pacifico } from "next/font/google";

interface Artist {
  artist_id: number;
  artist_name: string;
  artist_name_telugu: string;
}
interface Song {
  song_id: number;
  song_name_telugu: string;
  movie_id: number;
  movie_name_telugu: string;
}
interface Movie {
  movie_id: number;
  movie_name: string;
  movie_name_telugu: string;
}

const captionFont = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

const carouseHeaderFont = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  const [topActors, setTopActors] = useState<Artist[]>([]);
  const [topSingers, setTopSingers] = useState<Artist[]>([]);
  const [topLyricists, setTopLyricists] = useState<Artist[]>([]);
  const [topComposers, setTopComposers] = useState<Artist[]>([]);
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  const topActorIds = [11, 13, 1, 16, 12, 14, 2, 3, 4, 7];
  const topSingerIds = [306, 454, 142, 119, 106, 469, 129, 101, 137, 128];
  const topLyricistIds = [87, 88, 89, 110, 152, 266, 153, 109, 259, 132];
  const topComposerIds = [60, 56, 57, 78, 59, 63, 68, 211, 154, 273];
  const topSongIds = [6, 12, 18, 19, 20, 25, 31, 36, 38, 7];
  const topMovieIds = [12, 77, 49, 42, 14, 3, 130, 70, 115, 124];

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          actorsRes,
          singersRes,
          lyricistsRes,
          composersRes,
          songsRes,
          moviesRes,
        ] = await Promise.all([
          fetch(
            `${baseUrl}/api/artists/get-by-ids?ids=${topActorIds.join(",")}`
          ),
          fetch(
            `${baseUrl}/api/artists/get-by-ids?ids=${topSingerIds.join(",")}`
          ),
          fetch(
            `${baseUrl}/api/artists/get-by-ids?ids=${topLyricistIds.join(",")}`
          ),
          fetch(
            `${baseUrl}/api/artists/get-by-ids?ids=${topComposerIds.join(",")}`
          ),
          fetch(`${baseUrl}/api/songs/get-by-ids?ids=${topSongIds.join(",")}`),
          fetch(
            `${baseUrl}/api/movies/get-by-ids?ids=${topMovieIds.join(",")}`
          ),
        ]);

        const [
          actorsData,
          singersData,
          lyricistsData,
          composersData,
          songsData,
          moviesData,
        ] = await Promise.all([
          actorsRes.json(),
          singersRes.json(),
          lyricistsRes.json(),
          composersRes.json(),
          songsRes.json(),
          moviesRes.json(),
        ]);

        setTopActors(actorsData);
        setTopSingers(singersData);
        setTopLyricists(lyricistsData);
        setTopComposers(composersData);
        setTopSongs(songsData);
        setTopMovies(moviesData);
      } catch (err) {
        console.error("Error fetching top lists:", err);
      }
    }

    fetchData();
  }, []);

  const sectionHeader = `text-2xl md:text-3xl ${carouseHeaderFont.className} 
      mb-1 inline-flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow leading-[2.5] md:leading-[2.5]`;

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

  const CarouselPanel = ({
    emoji,
    title,
    children,
  }: {
    emoji: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="mb-4">
        <h2 className={sectionHeader}>
          <span>{emoji}</span>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-gray-50 pb-24">
      {/* Header */}
      <div className="relative w-fit mx-auto mt-12 text-center">
        <h1 className=" text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-[length:200%_200%] animate-[gradient-move_6s_linear_infinite] bg-clip-text text-transparent drop-shadow-lg tracking-tight text-center">
          తెలుగు వాంఛ
        </h1>
        <p
          className={`${captionFont.className} absolute right-0 bottom-0 translate-y-full mt-4 text-2xl md:text-4xl text-gray-600 tracking-wide text-center`}
        >
          celebrating the music of Telugu cinema...
        </p>
      </div>
      <div className="h-6"></div>

      {/* Carousels */}
      <section className="mt-20 w-full max-w-6xl space-y-6">
        <CarouselPanel emoji="🎵" title="Top 10 Songs">
          <div className={carouselContainer}>
            {topSongs.map((s) => (
              <Tile
                key={s.song_id}
                titleTelugu={s.song_name_telugu}
                title={s.movie_name_telugu}
                href={`/songs/${s.song_id}`}
              />
            ))}
          </div>
        </CarouselPanel>

        <CarouselPanel emoji="🎭" title="Top 10 Actors">
          <div className={carouselContainer}>
            {topActors.map((a) => (
              <Tile
                key={a.artist_id}
                titleTelugu={a.artist_name_telugu}
                title={a.artist_name}
                href={`/artists/actors/${a.artist_id}`}
              />
            ))}
          </div>
        </CarouselPanel>

        <CarouselPanel emoji="🎤" title="Top 10 Singers">
          <div className={carouselContainer}>
            {topSingers.map((s) => (
              <Tile
                key={s.artist_id}
                titleTelugu={s.artist_name_telugu}
                title={s.artist_name}
                href={`/artists/singers/${s.artist_id}`}
              />
            ))}
          </div>
        </CarouselPanel>

        <CarouselPanel emoji="✍️" title="Top 10 Lyricists">
          <div className={carouselContainer}>
            {topLyricists.map((l) => (
              <Tile
                key={l.artist_id}
                titleTelugu={l.artist_name_telugu}
                title={l.artist_name}
                href={`/artists/lyricists/${l.artist_id}`}
              />
            ))}
          </div>
        </CarouselPanel>

        <CarouselPanel emoji="🎼" title="Top 10 Composers">
          <div className={carouselContainer}>
            {topComposers.map((c) => (
              <Tile
                key={c.artist_id}
                titleTelugu={c.artist_name_telugu}
                title={c.artist_name}
                href={`/artists/composers/${c.artist_id}`}
              />
            ))}
          </div>
        </CarouselPanel>

        <CarouselPanel emoji="🎬" title="Top 10 Movies">
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
        </CarouselPanel>
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
