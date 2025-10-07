import Link from "next/link";

export default function Home() {
  return (
    <div className="prose mx-auto text-center mt-12">
      {/* Telugu title with modern styling */}
      <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-[length:200%_200%] animate-[gradient-move_6s_linear_infinite] bg-clip-text text-transparent drop-shadow-lg tracking-tight text-center">
        తెలుగు వాంఛ
      </h1>

      <p className="mt-4 text-lg md:text-xl text-gray-600 italic tracking-wide text-center">
        celebrating the music of Telugu cinema
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/artists"
          className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition"
        >
          Artists
        </Link>
        <Link
          href="/movies"
          className="px-6 py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition"
        >
          Movies
        </Link>
      </div>
    </div>
  );
}
