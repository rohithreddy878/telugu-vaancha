"use client";

import React, { useEffect, useState } from "react";

type Role = "actor" | "composer" | "lyricist" | "singer" | "";

interface Artist {
  artist_id: number;
  artist_name: string;
}

interface ArtistLink {
  artist_id: number | null;
  artist_name?: string;
  role: Role;
}

interface SongForm {
  song_name: string;
  song_name_telugu: string;
  artistLinks: ArtistLink[];
}

interface Movie {
  movie_id: number;
  movie_name: string;
}

interface Props {
  onClose: () => void;
  onSaveAllSuccess?: () => void;
}

export default function AddAllSongsOfMovieDialog({
  onClose,
  onSaveAllSuccess,
}: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieQuery, setMovieQuery] = useState("");

  // songs list
  const [songs, setSongs] = useState<SongForm[]>([]);
  // nested artist text queries per song: artistQueries[songIdx][artistIdx] = string being typed
  const [artistQueries, setArtistQueries] = useState<string[][]>([]);
  // which song is open (only one at a time)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  // Normalize for search: lower, remove punctuation, collapse spaces
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

  // Fetch movies and all artists (for suggestions) once
  useEffect(() => {
    async function load() {
      try {
        const [moviesR, artistsR] = await Promise.all([
          fetch("/api/movies/list-all-movies"),
          fetch("/api/artists/list-all-artists"),
        ]);
        const moviesJson = await moviesR.json();
        const artistsJson = await artistsR.json();
        setMovies(Array.isArray(moviesJson) ? moviesJson : []);
        setAllArtists(Array.isArray(artistsJson) ? artistsJson : []);
      } catch (err) {
        console.error("Failed to load movies/artists", err);
      }
    }
    load();
  }, []);

  // when movie selected, fetch movie-specific artists and initialize the first song
  useEffect(() => {
    if (!selectedMovie) {
      setSongs([]);
      setArtistQueries([]);
      setOpenIndex(null);
      return;
    }

    let cancelled = false;
    async function fetchMovieArtists() {
      try {
        const res = await fetch(`/api/movies/${selectedMovie.movie_id}`);
        if (!res.ok) throw new Error("failed");
        const data = await res.json();

        const defaults: ArtistLink[] = [];

        if (Array.isArray(data.actors)) {
          data.actors.forEach((a: any) =>
            defaults.push({
              artist_id: a.artist_id,
              artist_name: a.artist_name,
              role: "actor",
            })
          );
        }
        if (Array.isArray(data.composers)) {
          data.composers.forEach((a: any) =>
            defaults.push({
              artist_id: a.artist_id,
              artist_name: a.artist_name,
              role: "composer",
            })
          );
        }
        if (Array.isArray(data.singers)) {
          data.singers.forEach((a: any) =>
            defaults.push({
              artist_id: a.artist_id,
              artist_name: a.artist_name,
              role: "singer",
            })
          );
        }
        if (Array.isArray(data.lyricists)) {
          data.lyricists.forEach((a: any) =>
            defaults.push({
              artist_id: a.artist_id,
              artist_name: a.artist_name,
              role: "lyricist",
            })
          );
        }

        if (!cancelled) {
          // initialize songs with a first entry prefilled with defaults (deep copies)
          setSongs([
            {
              song_name: "",
              song_name_telugu: "",
              artistLinks: defaults.map((d) => ({ ...d })),
            },
          ]);
          setArtistQueries([defaults.map(() => "")]);
          setOpenIndex(0);
        }
      } catch (err) {
        console.error("Failed to fetch movie artists", err);
        if (!cancelled) {
          // fallback to empty song
          setSongs([{ song_name: "", song_name_telugu: "", artistLinks: [] }]);
          setArtistQueries([[]]);
          setOpenIndex(0);
        }
      }
    }

    fetchMovieArtists();
    return () => {
      cancelled = true;
    };
  }, [selectedMovie]);

  // Filter helpers
  const filteredMovieOptions = movieQuery
    ? movies.filter((m) =>
        normalize(m.movie_name).includes(normalize(movieQuery))
      )
    : movies;

  const filteredArtistOptions = (query: string) => {
    if (!query) return [];
    const n = normalize(query);
    return allArtists.filter((a) => normalize(a.artist_name).includes(n));
  };

  // Add a new song (use movie defaults from first song if present)
  const handleAddSong = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedMovie) return;

    setSongs((prev) => {
      const defaults = prev[0]?.artistLinks?.map((al) => ({ ...al })) ?? [];
      const newSong: SongForm = {
        song_name: "",
        song_name_telugu: "",
        artistLinks: defaults.length ? defaults : [],
      };
      const next = [...prev, newSong];
      // ensure artistQueries for the new song
      setArtistQueries((aqPrev) => [...aqPrev, defaults.map(() => "")]);
      setOpenIndex(next.length - 1); // open new song
      return next;
    });
  };

  // Toggle collapsible (only one open at a time)
  const toggleOpen = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  // Song field updates
  const updateSongField = (
    songIdx: number,
    key: keyof SongForm,
    val: string
  ) => {
    setSongs((prev) => {
      const copy = prev.map((s) => ({
        ...s,
        artistLinks: s.artistLinks.map((al) => ({ ...al })),
      }));
      (copy[songIdx] as any)[key] = val;
      return copy;
    });
  };

  // Add an artist row for a song
  const handleAddArtist = (songIdx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSongs((prev) =>
      prev.map((s, i) =>
        i === songIdx
          ? {
              ...s,
              artistLinks: [
                ...s.artistLinks,
                { artist_id: null, artist_name: undefined, role: "" },
              ],
            }
          : s
      )
    );
    setArtistQueries((prev) => {
      const copy = prev.map((arr) => [...arr]);
      copy[songIdx] = copy[songIdx] ?? [];
      copy[songIdx].push("");
      return copy;
    });
  };

  // Remove artist row
  const handleRemoveArtist = (
    songIdx: number,
    artistIdx: number,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    setSongs((prev) =>
      prev.map((s, i) =>
        i === songIdx
          ? {
              ...s,
              artistLinks: s.artistLinks.filter((_, j) => j !== artistIdx),
            }
          : s
      )
    );
    setArtistQueries((prev) =>
      prev.map((arr, i) =>
        i === songIdx ? arr.filter((_, j) => j !== artistIdx) : arr
      )
    );
  };

  // When typing in an artist input: update artistQueries and clear artist_id for that row
  const handleArtistTyping = (
    songIdx: number,
    artistIdx: number,
    value: string
  ) => {
    setArtistQueries((prev) => {
      const copy = prev.map((arr) => [...arr]);
      copy[songIdx] =
        copy[songIdx] ?? songs[songIdx]?.artistLinks?.map(() => "") ?? [];
      copy[songIdx][artistIdx] = value;
      return copy;
    });
    setSongs((prev) =>
      prev.map((s, i) =>
        i === songIdx
          ? {
              ...s,
              artistLinks: s.artistLinks.map((al, j) =>
                j === artistIdx
                  ? { ...al, artist_id: null, artist_name: undefined }
                  : al
              ),
            }
          : s
      )
    );
  };

  // When selecting a suggestion
  const handleArtistSelect = (
    songIdx: number,
    artistIdx: number,
    artist: Artist
  ) => {
    setSongs((prev) =>
      prev.map((s, i) =>
        i === songIdx
          ? {
              ...s,
              artistLinks: s.artistLinks.map((al, j) =>
                j === artistIdx
                  ? {
                      ...al,
                      artist_id: artist.artist_id,
                      artist_name: artist.artist_name,
                    }
                  : al
              ),
            }
          : s
      )
    );
    setArtistQueries((prev) => {
      const copy = prev.map((arr) => [...arr]);
      copy[songIdx] = copy[songIdx] ?? [];
      copy[songIdx][artistIdx] = "";
      return copy;
    });
  };

  // Role change
  const handleRoleChange = (songIdx: number, artistIdx: number, role: Role) => {
    setSongs((prev) =>
      prev.map((s, i) =>
        i === songIdx
          ? {
              ...s,
              artistLinks: s.artistLinks.map((al, j) =>
                j === artistIdx ? { ...al, role } : al
              ),
            }
          : s
      )
    );
  };

  // Submit: call API once per song (matches your add-song API)
  const handleSaveAll = async () => {
    if (!selectedMovie) {
      alert("Please select a movie first");
      return;
    }

    setLoading(true);
    try {
      for (const s of songs) {
        // prepare artistLinks with numeric ids & roles; filter invalid
        const payloadLinks = (s.artistLinks || [])
          .map((al) => ({ artist_id: al.artist_id, role: al.role }))
          .filter((l) => l.artist_id && l.role);

        const payload = {
          song_name: s.song_name,
          song_name_telugu: s.song_name_telugu,
          movie_id: selectedMovie.movie_id,
          artistLinks: payloadLinks,
        };

        const res = await fetch("/api/songs/add-song", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed adding song: ${text}`);
        }
      }

      if (onSaveAllSuccess) onSaveAllSuccess();
      alert("All songs saved");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving songs — see console");
    } finally {
      setLoading(false);
    }
  };

  // Movie autocomplete selection handler
  const handleSelectMovieOption = (m: Movie) => {
    setSelectedMovie(m);
    setMovieQuery("");
  };

  // UI helpers
  const roleOptions: Role[] = ["actor", "composer", "lyricist", "singer"];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 overflow-auto p-6">
      <div className="bg-white rounded-lg shadow-lg w-[950px] max-w-full max-h-[90vh] overflow-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Add All Songs of a Movie
        </h2>

        {/* Movie selector */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-2">Movie</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Type to search movies..."
            value={selectedMovie ? selectedMovie.movie_name : movieQuery}
            onChange={(e) => {
              setMovieQuery(e.target.value);
              setSelectedMovie(null);
            }}
          />
          {!selectedMovie && movieQuery && filteredMovieOptions.length > 0 && (
            <div className="absolute z-20 w-full bg-white border rounded shadow max-h-52 overflow-auto mt-1">
              {filteredMovieOptions.map((m) => (
                <div
                  key={m.movie_id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectMovieOption(m)}
                >
                  {m.movie_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Songs list */}
        <div className="space-y-4">
          {songs.map((song, sIdx) => (
            <div key={sIdx} className="border rounded-lg">
              {/* header */}
              <div
                className="flex justify-between items-center px-3 py-2 bg-gray-100 cursor-pointer"
                onClick={() => toggleOpen(sIdx)}
              >
                <div className="font-medium">
                  {song.song_name || `New Song ${sIdx + 1}`}
                </div>
                <div className="text-sm text-gray-600">
                  {openIndex === sIdx ? "▲" : "▼"}
                </div>
              </div>

              {/* content */}
              {openIndex === sIdx && (
                <div className="p-4 space-y-4">
                  {/* song name fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Song Name (English)"
                      className="border p-2 rounded w-full"
                      value={song.song_name}
                      onChange={(e) =>
                        updateSongField(sIdx, "song_name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Song Name (Telugu)"
                      className="border p-2 rounded w-full"
                      value={song.song_name_telugu}
                      onChange={(e) =>
                        updateSongField(
                          sIdx,
                          "song_name_telugu",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* artists list */}
                  <div className="space-y-2">
                    {song.artistLinks.map((al, aIdx) => {
                      const query =
                        (artistQueries[sIdx] && artistQueries[sIdx][aIdx]) ||
                        "";
                      const suggestions = filteredArtistOptions(query).slice(
                        0,
                        8
                      );
                      const selectedArtist = al.artist_id
                        ? allArtists.find((a) => a.artist_id === al.artist_id)
                        : null;

                      return (
                        <div key={aIdx} className="flex items-center gap-4">
                          {/* artist input */}
                          <div className="relative w-1/2">
                            <input
                              type="text"
                              className="border p-2 rounded w-full"
                              placeholder="Type artist name..."
                              value={
                                selectedArtist
                                  ? selectedArtist.artist_name
                                  : query
                              }
                              onChange={(e) =>
                                handleArtistTyping(sIdx, aIdx, e.target.value)
                              }
                              onClick={(ev) => ev.stopPropagation()}
                            />

                            {/* suggestions */}
                            {query &&
                              suggestions.length > 0 &&
                              !selectedArtist && (
                                <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-auto z-30">
                                  {suggestions.map((a) => (
                                    <div
                                      key={a.artist_id}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        handleArtistSelect(sIdx, aIdx, a);
                                      }}
                                    >
                                      {a.artist_name}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>

                          {/* role radios */}
                          <div className="flex gap-3 items-center">
                            {roleOptions.map((role) => (
                              <label
                                key={role}
                                className="flex items-center gap-1 text-sm"
                              >
                                <input
                                  type="radio"
                                  name={`role-${sIdx}-${aIdx}`}
                                  value={role}
                                  checked={al.role === role}
                                  onChange={(ev) => {
                                    ev.stopPropagation();
                                    handleRoleChange(sIdx, aIdx, role);
                                  }}
                                />
                                <span className="capitalize">{role}</span>
                              </label>
                            ))}
                          </div>

                          {/* remove */}
                          <button
                            type="button"
                            className="text-red-600 px-2 py-1 rounded hover:bg-red-50"
                            onClick={(ev) => handleRemoveArtist(sIdx, aIdx, ev)}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}

                    <div>
                      <button
                        type="button"
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={(ev) => handleAddArtist(sIdx, ev)}
                      >
                        + Add Artist
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Song button (below songs) */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!selectedMovie}
            onClick={handleAddSong}
          >
            + Add Song
          </button>
        </div>

        {/* Footer: Cancel + Save All Songs (right aligned) */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            onClick={handleSaveAll}
            disabled={loading || songs.length === 0 || !selectedMovie}
          >
            {loading ? "Saving..." : "Save All Songs"}
          </button>
        </div>
      </div>
    </div>
  );
}
