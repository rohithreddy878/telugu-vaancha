"use client";

import { useRouter } from "next/navigation";

export default function LyricsPage() {
  const router = useRouter();

  const handleAddNew = () => {
    router.push("/admin/lyrics/new");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Lyrics</h1>

      <div className="flex gap-4">
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add New Lyrics
        </button>
      </div>

      {/* Placeholder for list display later */}
      <div className="mt-8">
        <p className="text-gray-600">
          You can add lyrics here. We’ll display a paginated list of songs and
          their lyrics below later.
        </p>
      </div>
    </div>
  );
}
