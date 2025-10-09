"use client";

import { useState } from "react";

export default function AddActorDialog({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [artistNameTelugu, setArtistNameTelugu] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!artistName || !artistNameTelugu) {
      return alert("All fields are required");
    }

    setLoading(true);

    const res = await fetch("/api/artists/add-actor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artist_name: artistName,
        artist_name_telugu: artistNameTelugu,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setArtistName("");
      setArtistNameTelugu("");
      setOpen(false);
      onAdd();
    } else {
      alert("Failed to add actor");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-blue-600 text-white rounded-md  hover:bg-blue-700 transition-colors duration-200"
      >
        Add Actor
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Add Actor</h2>
            <input
              type="text"
              placeholder="Actor Name (English)"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Actor Name (Telugu)"
              value={artistNameTelugu}
              onChange={(e) => setArtistNameTelugu(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
