"use client";

import { useState, useMemo, useEffect } from "react";

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

// Helper: normalize text
function normalizeText(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
}: ComboboxProps) {
  const [inputValue, setInputValue] = useState("");

  // Sync inputValue when value changes externally
  useEffect(() => {
    if (value) setInputValue(value.song_name);
    else setInputValue("");
  }, [value]);

  // Filter options based on normalized input
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

      {/* Dropdown: show only if input does not exactly match selected value */}
      {filteredOptions.length > 0 &&
        inputValue &&
        inputValue !== value?.song_name && (
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
