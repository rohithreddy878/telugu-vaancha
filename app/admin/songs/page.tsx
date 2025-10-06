"use client";

import React, { useState } from "react";
import AddSongDialog from "./AddSongDialog"; // create this component like AddMovieDialog

export default function SongsAdminPage() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Songs Admin</h1>
        <button
          onClick={() => setShowDialog(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Song
        </button>
      </div>

      {/* Placeholder / future list */}
      <p className="text-gray-600">
        Use the "Add Song" button to add new songs.
      </p>

      {/* Add Song Dialog */}
      {showDialog && (
        <AddSongDialog
          onClose={() => setShowDialog(false)}
          onAddSuccess={() => {
            setShowDialog(false);
            // optionally refresh list here if you implement it later
          }}
        />
      )}
    </div>
  );
}
