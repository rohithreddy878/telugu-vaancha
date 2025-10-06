"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchArtists() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/artists/list-actors?page=${page}`);
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
    fetchArtists();
  }, [page]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Artists</h1>
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : artists.length === 0 ? (
        <p className="text-gray-600">No artists found.</p>
      ) : (
        <>
          <table className="min-w-full border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-left">ID</th>
                <th className="p-2 border text-left">Artist Name</th>
                <th className="p-2 border text-left">Telugu Name</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr
                  key={artist.artist_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-2 border">{artist.artist_id}</td>
                  <td className="p-2 border">{artist.artist_name}</td>
                  <td className="p-2 border">{artist.artist_name_telugu}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
