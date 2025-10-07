"use client";

import React, { useState, useEffect } from "react";

interface ArtistLink {
  artist_id: number;
  role: string;
}

interface SongForm {
  song_name: string;
  song_name_telugu: string;
  movie_id: number | null;
  artistLinks: ArtistLink[];
}

interface AddSongDialogProps {
  onClose: () => void;
  onAddSuccess?: () => void;
}

export default function AddSongDialog({
  onClose,
  onAddSuccess,
}: AddSongDialogProps) {
  const [form, setForm] = useState<SongForm>({
    song_name: "",
    song_name_telugu: "",
    movie_id: null,
    artistLinks: [],
  });

  const [movies, setMovies] = useState<
    { movie_id: number; movie_name: string }[]
  >([]);
  const [artists, setArtists] = useState<
    { artist_id: number; artist_name: string }[]
  >([]);
  const [movieQuery, setMovieQuery] = useState("");
  const [artistQueries, setArtistQueries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all movies and artists
  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const [movieRes, artistRes] = await Promise.all([
          fetch("/api/movies/list-all-movies"),
          fetch("/api/artists/list-all-artists"),
        ]);
        const movieData = await movieRes.json();
        const artistData = await artistRes.json();

        setMovies(
          (Array.isArray(movieData) ? movieData : movieData.data || []).map(
            (m: { movie_id: any; movie_name: any }) => ({
              movie_id: m.movie_id,
              movie_name: m.movie_name,
            })
          )
        );

        setArtists(
          (Array.isArray(artistData) ? artistData : artistData.data || []).map(
            (a: { artist_id: any; artist_name: any }) => ({
              artist_id: a.artist_id,
              artist_name: a.artist_name,
            })
          )
        );
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    }
    fetchDropdownData();
  }, []);

  // Auto-fetch artists when a movie is selected
  useEffect(() => {
    async function fetchMovieArtists() {
      if (!form.movie_id) return;
      try {
        const res = await fetch(`/api/movies/${form.movie_id}`);
        if (!res.ok) throw new Error("Failed to fetch movie details");
        const data = await res.json();

        const artistLinks: ArtistLink[] = [];

        if (data.actors?.length) {
          artistLinks.push(
            ...data.actors.map((a: any) => ({
              artist_id: a.artist_id,
              role: "actor",
            }))
          );
        }
        if (data.composers?.length) {
          artistLinks.push(
            ...data.composers.map((c: any) => ({
              artist_id: c.artist_id,
              role: "composer",
            }))
          );
        }

        setForm((prev) => ({ ...prev, artistLinks }));
        setArtistQueries(Array(artistLinks.length).fill(""));
      } catch (err) {
        console.error("Error fetching movie artists:", err);
      }
    }

    fetchMovieArtists();
  }, [form.movie_id]);

  const handleAddArtistLink = () => {
    setForm((prev) => ({
      ...prev,
      artistLinks: [...prev.artistLinks, { artist_id: 0, role: "" }],
    }));
    setArtistQueries((prev) => [...prev, ""]);
  };

  const handleArtistChange = (
    index: number,
    key: keyof ArtistLink,
    value: any
  ) => {
    const newLinks = [...form.artistLinks];
    //newLinks[index][key] = value;
    (newLinks[index] as any)[key] = value;
    setForm((prev) => ({ ...prev, artistLinks: newLinks }));
  };

  const handleRemoveArtist = (index: number) => {
    setForm((prev) => ({
      ...prev,
      artistLinks: prev.artistLinks.filter((_, i) => i !== index),
    }));
    setArtistQueries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.song_name || !form.movie_id) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/songs/add-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add song");
      if (onAddSuccess) onAddSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding song");
    } finally {
      setLoading(false);
    }
  };

  // Filter helpers
  const filteredMovies = movies.filter((m) =>
    m.movie_name.toLowerCase().includes(movieQuery.toLowerCase())
  );
  const filteredArtists = (query: string) =>
    artists.filter((a) =>
      a.artist_name.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] max-w-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Add Song</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Song Name */}
          <div>
            <label className="block font-medium mb-1">Song Name</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={form.song_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, song_name: e.target.value }))
              }
              required
            />
          </div>

          {/* Song Name (Telugu) */}
          <div>
            <label className="block font-medium mb-1">Song Name (Telugu)</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={form.song_name_telugu}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  song_name_telugu: e.target.value,
                }))
              }
            />
          </div>

          {/* Movie Autocomplete */}
          <div>
            <label className="block font-medium mb-1">Movie</label>
            <input
              type="text"
              placeholder="Type to search movies..."
              className="border p-2 rounded w-full"
              value={
                form.movie_id
                  ? movies.find((m) => m.movie_id === form.movie_id)
                      ?.movie_name || ""
                  : movieQuery
              }
              onChange={(e) => {
                setMovieQuery(e.target.value);
                setForm((prev) => ({ ...prev, movie_id: null }));
              }}
            />
            {movieQuery && filteredMovies.length > 0 && !form.movie_id && (
              <div className="border rounded bg-white max-h-40 overflow-y-auto shadow mt-1">
                {filteredMovies.map((m) => (
                  <div
                    key={m.movie_id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, movie_id: m.movie_id }));
                      setMovieQuery("");
                    }}
                  >
                    {m.movie_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Artist Links */}
          <div>
            <h3 className="font-semibold mb-2">Artists</h3>
            {form.artistLinks.map((link, idx) => {
              const query = artistQueries[idx] || "";
              const selectedArtist = artists.find(
                (a) => a.artist_id === link.artist_id
              );

              return (
                <div
                  key={idx}
                  className="relative flex gap-2 mb-2 items-center"
                >
                  <div className="w-1/2">
                    <input
                      type="text"
                      placeholder="Type artist name..."
                      className="border p-2 rounded w-full"
                      value={
                        selectedArtist ? selectedArtist.artist_name : query
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        const newQueries = [...artistQueries];
                        newQueries[idx] = val;
                        setArtistQueries(newQueries);
                        handleArtistChange(idx, "artist_id", 0);
                      }}
                    />
                    {query &&
                      filteredArtists(query).length > 0 &&
                      !selectedArtist && (
                        <div className="absolute left-0 border rounded bg-white max-h-40 overflow-y-auto shadow mt-1 w-[45%] z-10">
                          {filteredArtists(query).map((a) => (
                            <div
                              key={a.artist_id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                handleArtistChange(
                                  idx,
                                  "artist_id",
                                  a.artist_id
                                );
                                const newQueries = [...artistQueries];
                                newQueries[idx] = "";
                                setArtistQueries(newQueries);
                              }}
                            >
                              {a.artist_name}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  <select
                    className="border p-2 rounded w-1/3"
                    value={link.role}
                    onChange={(e) =>
                      handleArtistChange(idx, "role", e.target.value)
                    }
                  >
                    <option value="">Select role</option>
                    <option value="actor">Actor</option>
                    <option value="singer">Singer</option>
                    <option value="lyricist">Lyricist</option>
                    <option value="composer">Composer</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveArtist(idx)}
                    className="text-red-500 hover:underline"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={handleAddArtistLink}
            >
              + Add Artist
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Song"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
