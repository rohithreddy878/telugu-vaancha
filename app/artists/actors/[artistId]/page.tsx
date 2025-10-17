"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Movie {
  movie_id: number;
  movie_name: string;
  movie_name_telugu: string;
  year: number;
  roles: string;
}

interface ApiResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  movies: Movie[];
}

interface Artist {
  artist_id: number;
  artist_name: string;
  artist_name_telugu: string;
  is_actor: boolean;
}

export default function ActorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const artistId = Number(params.artistId);

  const PAGE_SIZE = 10; // configurable page size

  const [artist, setArtist] = useState<Artist | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch artist details
  useEffect(() => {
    async function fetchArtist() {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ||
          (typeof window !== "undefined" && window.location.origin) ||
          "http://localhost:3000";

        const res = await fetch(`${baseUrl}/api/artists/${artistId}`);
        if (!res.ok) throw new Error("Failed to fetch artist");
        const data: Artist = await res.json();
        setArtist(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchArtist();
  }, [artistId]);

  // Fetch movies by artist (paginated)
  const fetchMovies = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/movies/by-artist/${artistId}?page=${pageNum}&limit=${PAGE_SIZE}`
      );
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data: ApiResponse = await res.json();
      setMovies(data.movies);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [artistId, page]);

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  if (!artist) {
    return <p className="text-center mt-20 text-gray-500">Loading artist...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Artist Name */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-3 drop-shadow-lg leading-[2] overflow-visible">
        {artist.artist_name_telugu}
      </h1>

      {/* Role Subheader */}
      <p className="text-center text-gray-500 text-lg font-medium mb-8">
        Actor
      </p>

      {/* Movies Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">Movie (Telugu)</th>
              <th className="px-4 py-2 text-left">Roles</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  Loading movies...
                </td>
              </tr>
            ) : movies.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  No movies found.
                </td>
              </tr>
            ) : (
              movies.map((m) => (
                <tr key={m.movie_id} className="border-b last:border-none">
                  <td className="px-4 py-2">{m.year}</td>
                  <td className="px-4 py-2">{m.movie_name_telugu}</td>
                  <td className="px-4 py-2">{m.roles}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/movies/${m.movie_id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
