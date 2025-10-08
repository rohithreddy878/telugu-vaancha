"use client";

import { useState, useMemo } from "react";

interface ComboboxItem {
  song_id: number;
  song_name: string;
}

interface ComboboxProps {
  options: ComboboxItem[];
  value: ComboboxItem | null;
  onChange: (val: ComboboxItem | null) => void;
  placeholder?: string;
}

// Helper function to normalize text
function normalizeText(str: string) {
  return str
    .toLowerCase() // ignore case
    .replace(/[^\p{L}\p{N}\s]/gu, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim(); // trim leading/trailing spaces
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
}: ComboboxProps) {
  const [inputValue, setInputValue] = useState("");

  // Filter options based on normalized comparison
  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;

    const normalizedInput = normalizeText(inputValue);

    return options.filter((o) =>
      normalizeText(o.song_name).includes(normalizedInput)
    );
  }, [inputValue, options]);

  const handleSelect = (item: ComboboxItem) => {
    onChange(item);
    setInputValue(item.song_name);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (!e.target.value) onChange(null);
        }}
        placeholder={placeholder || "Select..."}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      {filteredOptions.length > 0 && inputValue && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-auto mt-1">
          {filteredOptions.map((item) => (
            <li
              key={item.song_id}
              onClick={() => handleSelect(item)}
              className="cursor-pointer px-2 py-1 hover:bg-gray-100"
            >
              {item.song_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
