"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const topMovieIds = [12, 77, 49, 42, 14, 3, 130, 70, 115, 124];

  async function fetchMovies(searchQuery = "") {
    setLoading(true);
    const url = searchQuery
      ? `/api/movies/search-movies?query=${encodeURIComponent(searchQuery)}`
      : `${baseUrl}/api/movies/get-by-ids?ids=${topMovieIds.join(",")}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data = await res.json();
      setMovies(data.data || data);
    } catch (err) {
      console.error(err);
      alert("Error loading movies.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMovies(search.trim());
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-[length:200%_200%] animate-[gradient-move_6s_linear_infinite] bg-clip-text text-transparent drop-shadow-lg tracking-tight text-center">
        సినిమాలు
      </h1>

      {/* Search Bar */}
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-2 mb-8"
      >
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 focus:outline-none transition pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition"
        >
          Search
        </button>
      </form>

      {/* Movie Grid */}
      {loading ? (
        <p className="text-gray-500 text-center mt-6">Loading...</p>
      ) : movies.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.movie_id}
              href={`/movies/${movie.movie_id}`}
              className="block border p-4 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 hover:scale-105 bg-white"
            >
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {movie.movie_name_telugu}
              </h2>
              <p className="text-gray-600 mt-1">{movie.movie_name}</p>
              <p className="text-sm text-gray-500 mt-2">{movie.year}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
