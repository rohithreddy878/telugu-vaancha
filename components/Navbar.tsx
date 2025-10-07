"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image
            src="/favicon.ico" // or /icon.png — whichever you placed in /public
            alt="Telugu Vaancha Logo"
            width={24}
            height={24}
            className="rounded"
          />
          Telugu Vaancha
        </Link>

        <div className="space-x-4">
          <Link href="/" className="text-sm hover:text-blue-600">
            Home
          </Link>
          <Link href="/artists" className="text-sm hover:text-blue-600">
            Artists
          </Link>
          <Link href="/movies" className="text-sm hover:text-blue-600">
            Movies
          </Link>
          <Link href="/admin" className="text-sm hover:text-blue-600">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
