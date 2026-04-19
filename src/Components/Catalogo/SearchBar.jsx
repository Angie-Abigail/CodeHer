// components/SearchBar.jsx
import React from "react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Buscar por palabras claves.....",
}) => {
  return (
    <div className="relative w-full">
      {/* Icono búsqueda */}
      <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-[#003087]/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-10 sm:pl-11
          pr-9 sm:pr-10
          py-2.5 sm:py-3
          text-xs sm:text-sm
          bg-white
          border border-gray-200
          rounded-xl
          text-gray-700
          placeholder-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-[#003087]/30
          focus:border-[#003087]
          transition-all duration-200
          shadow-sm hover:border-gray-300
        "
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="
            absolute right-2 sm:right-3
            top-1/2 -translate-y-1/2
            w-5 h-5 sm:w-6 sm:h-6
            flex items-center justify-center
            rounded-full
            bg-gray-100 hover:bg-gray-200
            transition-colors
          "
        >
          <svg
            className="w-3 h-3 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;