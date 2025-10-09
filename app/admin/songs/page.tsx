"use client";

import React, { useState } from "react";
import AddSongDialog from "./AddSongDialog"; // create this component like AddMovieDialog
import AddAllSongsOfMovieDialog from "./AddAllSongsOfMovieDialog";

export default function SongsAdminPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [showAddAllSongsDialog, setShowAddAllSongsDialog] = useState(false);

  return (
    <div className="p-6 max-w-5xl mx-auto text-center">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-10">Manage Songs</h1>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <button
          onClick={() => setShowDialog(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Add Song
        </button>
        <button
          onClick={() => setShowAddAllSongsDialog(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Add Songs - Movie
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
          onAddSuccess={() => setShowDialog(false)}
        />
      )}

      {/* Add All Songs of Movie Dialog */}
      {showAddAllSongsDialog && (
        <AddAllSongsOfMovieDialog
          onClose={() => setShowAddAllSongsDialog(false)}
          onSaveAllSuccess={() => setShowAddAllSongsDialog(false)}
        />
      )}
    </div>
  );
}
