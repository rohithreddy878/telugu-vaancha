import { notFound } from "next/navigation";

interface Artist {
  artist_id: number;
  artist_name: string;
  artist_name_telugu: string;
  is_actor: boolean;
  is_singer: boolean;
  is_composer: boolean;
  is_lyricist: boolean;
}

export default async function LyricistDetailsPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/artists/${artistId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Composer details");
  }

  const artist: Artist = await res.json();

  if (!artist.is_lyricist) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-3 drop-shadow-lg leading-[2] overflow-visible">
        {artist.artist_name_telugu}
      </h1>

      <p className="text-center text-gray-500 text-lg font-medium mb-8">
        Lyricist
      </p>

      <div className="text-center text-gray-700">
        {/* 🔜 Placeholder for Lyricist-related content (movies, songs, etc.) */}
        <p className="italic text-gray-400">Lyricist details coming soon...</p>
      </div>
    </div>
  );
}
