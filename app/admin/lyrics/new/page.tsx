"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Combobox } from "@/components/Combobox";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Song {
  song_id: number;
  song_name: string;
}

interface SongDetails {
  song_id: number;
  song_name_telugu: string;
  movie_name_telugu: string;
}

export default function AddLyricPage() {
  const router = useRouter();

  // Song selection
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [songDetails, setSongDetails] = useState<SongDetails | null>(null);

  // Lyrics editors
  const [teluguLyrics, setTeluguLyrics] = useState("");
  const [transliterationLyrics, setTransliterationLyrics] = useState("");
  const [translationLyrics, setTranslationLyrics] = useState("");

  // Song info / notes
  const [songInfo, setSongInfo] = useState("");

  // Fetch songs list on mount
  useEffect(() => {
    fetch("/api/songs/names")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Failed to fetch songs:", err));
  }, []);

  // Fetch selected song details
  useEffect(() => {
    if (selectedSong) {
      fetch(`/api/song/get-by-ids?ids=${selectedSong.song_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) setSongDetails(data[0]);
        })
        .catch((err) => console.error("Failed to fetch song details:", err));
    } else {
      setSongDetails(null);
    }
  }, [selectedSong]);

  const handleSubmit = async () => {
    if (!selectedSong) {
      alert("Please select a song first.");
      return;
    }

    const payload = {
      song_id: selectedSong.song_id,
      telugu_lyrics: teluguLyrics,
      english_transliteration_lyrics: transliterationLyrics,
      english_translation_lyrics: translationLyrics,
      song_info: songInfo,
    };

    try {
      const res = await fetch("/api/lyrics/add-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Lyrics added successfully!");
        router.push("/admin/lyrics");
      } else {
        const err = await res.json();
        alert("Failed to add lyrics: " + err.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding lyrics");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Lyric</h1>

      {/* Song selection dropdown */}
      <div className="mb-6">
        <Combobox
          options={songs}
          value={selectedSong}
          onChange={setSelectedSong}
          placeholder="Select a song..."
        />
      </div>

      {/* Read-only song info */}
      {songDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p>
            <span className="font-semibold">Song Name (Telugu): </span>
            {songDetails.song_name_telugu}
          </p>
          <p>
            <span className="font-semibold">Movie Name (Telugu): </span>
            {songDetails.movie_name_telugu}
          </p>
        </div>
      )}

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Telugu Lyrics</label>
          <ReactQuill
            theme="snow"
            value={teluguLyrics}
            onChange={setTeluguLyrics}
            className="h-96 flex-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Romanized Lyrics</label>
          <ReactQuill
            theme="snow"
            value={transliterationLyrics}
            onChange={setTransliterationLyrics}
            className="h-96 flex-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-medium">English Translation</label>
          <ReactQuill
            theme="snow"
            value={translationLyrics}
            onChange={setTranslationLyrics}
            className="h-96 flex-1"
          />
        </div>
      </div>

      {/* Song info / notes */}
      <div className="mb-6">
        <label className="mb-2 block font-medium">Song Info / Notes</label>
        <textarea
          value={songInfo}
          onChange={(e) => setSongInfo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg h-32 resize-y"
          placeholder="Optional trivia, facts, or notes about the song"
        />
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Save Lyrics
      </button>
    </div>
  );
}
