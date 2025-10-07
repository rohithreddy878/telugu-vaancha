export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 border-t border-pink-300">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-white text-sm">
        <span className="font-medium drop-shadow-lg">
          © {new Date().getFullYear()} Telugu Vaancha
        </span>
        {/* <div className="flex gap-4 mt-2 md:mt-0">
          <a
            href="/"
            className="hover:underline hover:scale-105 transition-transform duration-200"
          >
            Home
          </a>
          <a
            href="/artists"
            className="hover:underline hover:scale-105 transition-transform duration-200"
          >
            Artists
          </a>
          <a
            href="/movies"
            className="hover:underline hover:scale-105 transition-transform duration-200"
          >
            Movies
          </a>
          <a
            href="/admin"
            className="hover:underline hover:scale-105 transition-transform duration-200"
          >
            Admin
          </a>
        </div> */}
      </div>
    </footer>
  );
}
