import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-2.5rem)] text-center">
      <h1 className="text-5xl mb-10 mt-10 font-semibold">Admin Dashboard</h1>
      <p className="text-xl mb-5">
        Use these pages to add artists, movies, and songs.
      </p>

      <div className="mt-4 space-x-3">
        <Link
          href="/admin/artists"
          className="px-3 py-2 border rounded hover:bg-blue-500 hover:text-white transition-colors duration-200"
        >
          Artists
        </Link>
        <Link
          href="/admin/movies"
          className="px-3 py-2 border rounded hover:bg-blue-500 hover:text-white transition-colors duration-200"
        >
          Movies
        </Link>
        <Link
          href="/admin/songs"
          className="px-3 py-2 border rounded hover:bg-blue-500 hover:text-white transition-colors duration-200"
        >
          Songs
        </Link>
        <Link
          href="/admin/lyrics"
          className="px-3 py-2 border rounded hover:bg-blue-500 hover:text-white transition-colors duration-200"
        >
          Lyrics
        </Link>
      </div>
    </div>
  );
}
