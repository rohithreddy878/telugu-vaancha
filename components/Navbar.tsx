"use client";
import Link from "next/link";

import { FaHome, FaUsers, FaFilm, FaTools } from "react-icons/fa";

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
            className="flex items-center justify-center px-3 py-1 text-white font-semibold rounded-md 
             hover:bg-white hover:bg-opacity-20 hover:text-black 
             hover:scale-105 transition-all duration-200 gap-2"
          >
            <FaHome size={20} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            href="/artists"
            className="flex items-center justify-center px-3 py-1 text-white font-semibold rounded-md 
             hover:bg-white hover:bg-opacity-20 hover:text-black 
             hover:scale-105 transition-all duration-200 gap-2"
          >
            <FaUsers size={20} />
            <span className="hidden sm:inline">Artists</span>
          </Link>

          <Link
            href="/movies"
            className="flex items-center justify-center px-3 py-1 text-white font-semibold rounded-md 
             hover:bg-white hover:bg-opacity-20 hover:text-black 
             hover:scale-105 transition-all duration-200 gap-2"
          >
            <FaFilm size={20} />
            <span className="hidden sm:inline">Movies</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-center px-3 py-1 text-white font-semibold rounded-md 
             hover:bg-white hover:bg-opacity-20 hover:text-black 
             hover:scale-105 transition-all duration-200 gap-2"
          >
            <FaTools size={20} />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
