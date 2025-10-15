"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Combobox } from "@/components/Combobox";
import AutoResizeQuill from "@/components/AutoResizeQuill";

// ✅ Use react-quill-new and import its CSS
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AddLyricsPage() {
  const [songs, setSongs] = useState<{ song_id: number; song_name: string }[]>(
    []
  );
  const [selectedSong, setSelectedSong] = useState<{
    song_id: number;
    song_name: string;
  } | null>(null);

  const [songDetails, setSongDetails] = useState<{
    song_name_telugu?: string;
    movie_name_telugu?: string;
  } | null>(null);

  const [teluguLyrics, setTeluguLyrics] = useState("");
  const [transliteratedLyrics, setTransliteratedLyrics] = useState("");
  const [translatedLyrics, setTranslatedLyrics] = useState("");
  const [songInfo, setSongInfo] = useState("");

  // Fetch song list (id + name only)
  useEffect(() => {
    async function fetchSongs() {
      try {
        const res = await fetch("/api/songs/names");
        if (!res.ok) throw new Error("Failed to fetch songs");
        const data = await res.json();
        setSongs(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSongs();
  }, []);

  // Fetch details for selected song
  useEffect(() => {
    if (!selectedSong) {
      setSongDetails(null);
      return;
    }
    async function fetchSongDetails() {
      try {
        if (!selectedSong) return;
        const res = await fetch(
          `/api/songs/get-by-ids?ids=${selectedSong.song_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch song details");
        const data = await res.json();
        setSongDetails(data[0]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSongDetails();
  }, [selectedSong]);

  const handleSubmit = async () => {
    if (!selectedSong) {
      alert("Please select a song before submitting.");
      return;
    }

    const payload = {
      song_id: selectedSong.song_id,
      telugu_lyrics: teluguLyrics,
      english_transliteration_lyrics: transliteratedLyrics,
      english_translation_lyrics: translatedLyrics,
      song_info: songInfo,
    };

    try {
      const res = await fetch("/api/lyrics/add-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save lyrics");
      alert("Lyrics saved successfully!");
      setSelectedSong(null);
      setTeluguLyrics("");
      setTransliteratedLyrics("");
      setTranslatedLyrics("");
      setSongInfo("");
    } catch (err) {
      console.error(err);
      alert("Error saving lyrics.");
    }
  };

  return (
    <div className="p-6 min-h-screen overflow-y-auto">
      <h1 className="text-3xl font-semibold mb-6">Add New Lyrics</h1>

      {/* Song Selection + Read-Only Details */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Combobox */}
        <div className="md:w-full">
          <label className="block font-medium mb-2">Select Song</label>
          <Combobox
            options={songs}
            value={selectedSong}
            onChange={setSelectedSong}
            placeholder="Type or select song name..."
          />
        </div>

        {/* Right: Read-only Song Details */}
        {songDetails && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="mb-2">
              <span className="font-semibold">🎵 Song: </span>
              {songDetails.song_name_telugu}
            </p>
            <p>
              <span className="font-semibold">🎬 Movie: </span>
              {songDetails.movie_name_telugu}
            </p>
          </div>
        )}
      </div>

      {/* Lyrics Editors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          {
            title: "Telugu Lyrics",
            value: teluguLyrics,
            setter: setTeluguLyrics,
          },
          {
            title: "English Transliteration",
            value: transliteratedLyrics,
            setter: setTransliteratedLyrics,
          },
          {
            title: "English Translation",
            value: translatedLyrics,
            setter: setTranslatedLyrics,
          },
        ].map((editor) => (
          // <div key={editor.title} className="flex flex-col h-[550px]">
          //   <h2 className="font-medium mb-2">{editor.title}</h2>
          //   <div className="flex-1">
          //     <ReactQuill
          //       theme="snow"
          //       value={editor.value}
          //       onChange={editor.setter}
          //       className="h-full"
          //     />
          //   </div>
          // </div>
          <div key={editor.title} className="flex flex-col">
            <h2 className="font-medium mb-2">{editor.title}</h2>
            <AutoResizeQuill value={editor.value} onChange={editor.setter} />
          </div>
        ))}
      </div>

      {/* Song Info / Notes */}
      <div className="mt-10 mb-20">
        <div key="Song Info / Notes" className="flex flex-col">
          <h2 className="font-medium mb-2">Song Info / Notes</h2>
          <AutoResizeQuill value={songInfo} onChange={setSongInfo} />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Save Lyrics
        </button>
      </div>
    </div>
  );
}
