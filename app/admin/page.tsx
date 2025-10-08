import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Admin Dashboard (placeholder)</h2>
      <p className="mt-2">Use these pages to add heroes, movies, and songs.</p>

      <div className="mt-4 space-x-3">
        <Link href="/admin/artists" className="px-3 py-1 border rounded">
          Artists
        </Link>
        <Link href="/admin/movies" className="px-3 py-1 border rounded">
          Movies
        </Link>
        <Link href="/admin/songs" className="px-3 py-1 border rounded">
          Songs
        </Link>
        <Link href="/admin/lyrics" className="px-3 py-1 border rounded">
          Lyrics
        </Link>
      </div>
    </div>
  );
}
