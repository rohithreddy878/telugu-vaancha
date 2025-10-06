import Link from "next/link";

export default function Home() {
  return (
    <div className="prose mx-auto">
      <h1>Telugu Vaancha</h1>
      <p>Starter home page</p>

      <div className="mt-6 space-x-4">
        <Link
          href="/admin"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Admin
        </Link>
        <Link href="/artists" className="px-4 py-2 border rounded">
          Artists
        </Link>
        <Link href="/movies" className="px-4 py-2 border rounded">
          Movies
        </Link>
      </div>
    </div>
  );
}
