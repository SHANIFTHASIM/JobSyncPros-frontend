"use client";

import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  location: string; // Ensure location is passed correctly
  setLocation: (value: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ searchTerm, setSearchTerm, location, setLocation }) => {
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm || location) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`);
    }
  };

  return (
    <form className="flex justify-between gap-4 bg-gray-300 p-2 rounded-lg w-2/3" onSubmit={handleSearch}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for jobs..."
        className="w-full bg-transparent outline-none"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location..."
        className="w-full bg-transparent outline-none"
      />
      <button type="submit" className="cursor-pointer">
        <img src="/search.png" alt="search" width={16} height={16} />
      </button>
    </form>
  );
};

export default Searchbar;
