"use client";

import AddActorDialog from "./AddActorDialog";
import AddComposerDialog from "./AddComposerDialog";
import { useState } from "react";

export default function ArtistsPage() {
  const [refresh, setRefresh] = useState(0);

  const handleAdd = () => {
    // Trigger a re-render or refresh list if you later add a list
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Artists</h1>

      <div className="flex gap-4">
        <AddActorDialog onAdd={handleAdd} />
        <AddComposerDialog onAdd={handleAdd} />
      </div>

      {/* Placeholder for list display later */}
      <div className="mt-8">
        <p className="text-gray-600">
          You can add actors and composers here. We’ll display a paginated list
          below later.
        </p>
      </div>
    </div>
  );
}
