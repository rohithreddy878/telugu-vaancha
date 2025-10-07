"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 shadow-lg border-b border-pink-300 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/favicon.ico"
            alt="Telugu Vaancha Logo"
            className="w-8 h-8 animate-bounce-slow"
          />
          <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">
            తెలుగు వాంఛ
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-3 py-1 text-white font-semibold rounded-md 
                      hover:bg-white hover:bg-opacity-20 hover:text-black 
                      hover:scale-105 transition-all duration-200"
          >
            Home
          </Link>

          <Link
            href="/artists"
            className="px-3 py-1 text-white font-semibold rounded-md 
                      hover:bg-white hover:bg-opacity-20 hover:text-black 
                      hover:scale-105 transition-all duration-200"
          >
            Artists
          </Link>

          <Link
            href="/movies"
            className="px-3 py-1 text-white font-semibold rounded-md 
                      hover:bg-white hover:bg-opacity-20 hover:text-black 
                      hover:scale-105 transition-all duration-200"
          >
            Movies
          </Link>

          <Link
            href="/admin"
            className="px-3 py-1 text-white font-semibold rounded-md 
                      hover:bg-white hover:bg-opacity-20 hover:text-black 
                      hover:scale-105 transition-all duration-200"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
