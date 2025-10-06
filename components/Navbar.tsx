"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          Telugu Vaancha
        </Link>
        <div className="space-x-3">
          <Link href="/" className="text-sm">
            Home
          </Link>
          <Link href="/artists" className="text-sm">
            Artists
          </Link>
          <Link href="/movies" className="text-sm">
            Movies
          </Link>
          <Link href="/admin" className="text-sm">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
