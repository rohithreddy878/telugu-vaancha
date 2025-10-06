"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchMovies(searchQuery = "") {
    setLoading(true);
    const url = searchQuery
      ? `/api/movies/search-movies?query=${encodeURIComponent(searchQuery)}`
      : `/api/movies/list-movies?page=1`;

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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Movies</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* Movie Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <Link
              key={movie.movie_id}
              href={`/movies/${movie.movie_id}`}
              className="block border p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white"
            >
              <h2 className="text-lg font-semibold">{movie.movie_name}</h2>
              <p className="text-gray-600">{movie.movie_name_telugu}</p>
              <p className="text-sm text-gray-500 mt-1">Year: {movie.year}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
