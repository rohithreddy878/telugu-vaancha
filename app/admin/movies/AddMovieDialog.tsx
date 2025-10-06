"use client";

import { useState, useEffect } from "react";

export default function AddMovieDialog({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [movie, setMovie] = useState({
    movie_name: "",
    movie_name_telugu: "",
    year: "",
  });
  const [artists, setArtists] = useState<any[]>([]);
  const [artistLinks, setArtistLinks] = useState([{ artist_id: "", role: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetch("/api/artists/list-all-artists")
        .then((res) => res.json())
        .then(setArtists)
        .catch(() => alert("Failed to load artists"));
    }
  }, [open]);

  const handleAddArtistRow = () => {
    setArtistLinks([...artistLinks, { artist_id: "", role: "" }]);
  };

  const handleRemoveArtistRow = (index: number) => {
    setArtistLinks(artistLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/movies/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...movie, artists: artistLinks }),
    });

    setLoading(false);

    if (res.ok) {
      alert("✅ Movie added successfully!");
      setMovie({ movie_name: "", movie_name_telugu: "", year: "" });
      setArtistLinks([{ artist_id: "", role: "" }]);
      setOpen(false);
      onAdd();
    } else {
      alert("❌ Failed to add movie.");
    }
  };

  return (
    <>
      {/* Open Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Add Movie
      </button>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              🎬 Add New Movie
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Movie Info */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Movie Name (English)"
                  value={movie.movie_name}
                  onChange={(e) =>
                    setMovie({ ...movie, movie_name: e.target.value })
                  }
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  placeholder="Movie Name (Telugu)"
                  value={movie.movie_name_telugu}
                  onChange={(e) =>
                    setMovie({ ...movie, movie_name_telugu: e.target.value })
                  }
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              <input
                placeholder="Year"
                type="number"
                value={movie.year}
                onChange={(e) => setMovie({ ...movie, year: e.target.value })}
                className="border p-2 w-full rounded"
                required
              />

              {/* Artists & Roles Section */}
              <div>
                <h3 className="font-semibold mb-3">🎭 Artists & Roles</h3>
                {artistLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 mb-2 items-center border p-2 rounded-lg"
                  >
                    <select
                      className="border p-2 flex-1 rounded"
                      value={link.artist_id}
                      onChange={(e) => {
                        const updated = [...artistLinks];
                        updated[idx].artist_id = e.target.value;
                        setArtistLinks(updated);
                      }}
                    >
                      <option value="">Select Artist</option>
                      {artists.map((a) => (
                        <option key={a.artist_id} value={a.artist_id}>
                          {a.artist_name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="border p-2 flex-1 rounded"
                      value={link.role}
                      onChange={(e) => {
                        const updated = [...artistLinks];
                        updated[idx].role = e.target.value;
                        setArtistLinks(updated);
                      }}
                    >
                      <option value="">Select Role</option>
                      <option value="actor">Actor</option>
                      <option value="composer">Composer</option>
                      <option value="lyricist">Lyricist</option>
                    </select>

                    {artistLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveArtistRow(idx)}
                        className="text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-50"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddArtistRow}
                  className="border px-3 py-1 rounded text-sm mt-2"
                >
                  + Add Another Artist
                </button>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {loading ? "Saving..." : "Save Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
