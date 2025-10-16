"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function fetchArtists(searchQuery = "") {
    setLoading(true);
    setError(null);

    try {
      const url = searchQuery
        ? `/api/artists/search-artists?query=${encodeURIComponent(searchQuery)}`
        : `/api/artists/list-actors?page=${page}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch artists");

      const data = await res.json();
      setArtists(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err: any) {
      console.error("Error fetching artists:", err);
      setError("Something went wrong while fetching artists.");
      setArtists([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArtists(search.trim());
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArtists(search.trim());
  };

  const getRole = (artist: any) => {
    if (artist.is_actor) return "Actor";
    if (artist.is_composer) return "Composer";
    if (artist.is_lyricist) return "Lyricist";
    if (artist.is_singer) return "Singer";
    return "Unknown";
  };

  const getDetailsLink = (artist: any) => {
    if (artist.is_actor) return `/artists/actors/${artist.artist_id}`;
    if (artist.is_composer) return `/artists/composers/${artist.artist_id}`;
    if (artist.is_lyricist) return `/artists/lyricists/${artist.artist_id}`;
    if (artist.is_singer) return `/artists/singers/${artist.artist_id}`;
    return `/artists/${artist.artist_id}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page Title Centered */}
      <div className="flex justify-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-[length:200%_200%] animate-[gradient-move_6s_linear_infinite] bg-clip-text text-transparent drop-shadow-lg tracking-tight text-center">
          కళాకారులు
        </h1>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-2 mb-6 justify-center"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artists..."
          className="border p-3 rounded-lg w-full md:flex-1 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500 text-center mt-6">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-6">{error}</p>
      ) : artists.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">No artists found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full border border-gray-200 text-left">
              <thead className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100">
                <tr>
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">పేరు</th>
                  <th className="p-3 border-b">Artist Name</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b">Details</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr
                    key={artist.artist_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 border-b">{artist.artist_id}</td>
                    <td className="p-3 border-b font-medium text-gray-800">
                      {artist.artist_name_telugu}
                    </td>
                    <td className="p-3 border-b text-gray-600">
                      {artist.artist_name}
                    </td>
                    <td className="p-3 border-b text-gray-700">
                      {getRole(artist)}
                    </td>
                    <td className="p-3 border-b text-center">
                      <Link
                        href={getDetailsLink(artist)}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mt-6 gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Previous
            </button>

            <span className="text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
