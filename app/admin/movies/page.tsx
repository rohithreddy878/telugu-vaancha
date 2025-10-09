"use client";

import AddMovieDialog from "./AddMovieDialog";
import { useState } from "react";

export default function ArtistsPage() {
  const [refresh, setRefresh] = useState(0);

  const handleAdd = () => {
    // Trigger a re-render or refresh list if you later add a list
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-center">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-10">Manage Movies</h1>

      {/* Buttons */}
      <div className="flex gap-4 justify-center mb-6">
        <AddMovieDialog onAdd={handleAdd} />
      </div>

      {/* Placeholder for list display later */}
      <div className="mt-8">
        <p className="text-gray-600">
          You can add movies here. We’ll display a paginated list below later.
        </p>
      </div>
    </div>
  );
}
