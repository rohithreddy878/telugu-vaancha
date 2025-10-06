"use client";

import React, { useState, useEffect } from "react";

const ROLE_OPTIONS = ["actor", "composer", "lyricist", "singer"];

interface ArtistLink {
  artist_id: number;
  artist_name_input?: string;
  role: string;
  showSuggestions?: boolean;
}

interface SongForm {
  song_name: string;
  song_name_telugu: string;
  movie_id: number | null;
  movie_name_input?: string;
  showMovieSuggestions?: boolean;
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
    movie_name_input: "",
    showMovieSuggestions: false,
    artistLinks: [],
  });

  const [movies, setMovies] = useState<
    { movie_id: number; movie_name: string }[]
  >([]);
  const [artists, setArtists] = useState<
    { artist_id: number; artist_name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Fetch movies and artists for autocomplete
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("/api/movies/list-all-movies");
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        const movieArray = Array.isArray(data) ? data : data.data || [];
        setMovies(
          movieArray.map((m) => ({
            movie_id: m.movie_id,
            movie_name: m.movie_name,
          }))
        );
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    }

    async function fetchArtists() {
      try {
        const res = await fetch("/api/artists/list-all-artists");
        if (!res.ok) throw new Error("Failed to fetch artists");
        const data = await res.json();
        const artistArray = Array.isArray(data) ? data : data.data || [];
        setArtists(
          artistArray.map((a) => ({
            artist_id: a.artist_id,
            artist_name: a.artist_name,
          }))
        );
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    }

    fetchMovies();
    fetchArtists();
  }, []);

  const handleAddArtistLink = () => {
    setForm((prev) => ({
      ...prev,
      artistLinks: [
        ...prev.artistLinks,
        {
          artist_id: 0,
          role: "",
          showSuggestions: false,
          artist_name_input: "",
        },
      ],
    }));
  };

  const handleArtistChange = (
    index: number,
    key: keyof ArtistLink,
    value: any
  ) => {
    const newLinks = [...form.artistLinks];
    newLinks[index][key] = value;
    setForm((prev) => ({ ...prev, artistLinks: newLinks }));
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[750px] max-w-full max-h-[90vh] overflow-auto">
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
          <div className="relative">
            <label className="block font-medium mb-1">Movie</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              placeholder="Type movie name..."
              value={form.movie_name_input}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  movie_name_input: e.target.value,
                  showMovieSuggestions: true,
                  movie_id: null,
                }))
              }
              required
            />
            {form.showMovieSuggestions && form.movie_name_input && (
              <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto mt-1 rounded shadow">
                {movies
                  .filter((m) =>
                    m.movie_name
                      .toLowerCase()
                      .includes(form.movie_name_input!.toLowerCase())
                  )
                  .map((m) => (
                    <li
                      key={m.movie_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          movie_id: m.movie_id,
                          movie_name_input: m.movie_name,
                          showMovieSuggestions: false,
                        }))
                      }
                    >
                      {m.movie_name}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Artist Links */}
          <div>
            <h3 className="font-semibold mb-2">Artists</h3>
            {form.artistLinks.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2 relative">
                {/* Artist Autocomplete */}
                <div className="w-1/2 relative">
                  <input
                    type="text"
                    className="border p-2 rounded w-full"
                    placeholder="Type artist name..."
                    value={link.artist_name_input || ""}
                    onChange={(e) => {
                      handleArtistChange(
                        idx,
                        "artist_name_input",
                        e.target.value
                      );
                      handleArtistChange(idx, "showSuggestions", true);
                    }}
                    required
                  />
                  {link.showSuggestions && link.artist_name_input && (
                    <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto mt-1 rounded shadow">
                      {artists
                        .filter((a) =>
                          a.artist_name
                            .toLowerCase()
                            .includes(link.artist_name_input!.toLowerCase())
                        )
                        .map((a) => (
                          <li
                            key={a.artist_id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleArtistChange(idx, "artist_id", a.artist_id);
                              handleArtistChange(
                                idx,
                                "artist_name_input",
                                a.artist_name
                              );
                              handleArtistChange(idx, "showSuggestions", false);
                            }}
                          >
                            {a.artist_name}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                {/* Role Dropdown */}
                <select
                  className="border p-2 rounded w-1/2"
                  value={link.role}
                  onChange={(e) =>
                    handleArtistChange(idx, "role", e.target.value)
                  }
                  required
                >
                  <option value="">Select role</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            ))}
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
