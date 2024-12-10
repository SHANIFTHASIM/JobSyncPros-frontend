"use client";

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Listings from '../_components/Listings';
import Navbar from '../_components/Navbar';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const query = searchParams.get('query');
    const loc = searchParams.get('location');
    if (query) {
      setSearchTerm(query);
    }
    if (loc) {
      setLocation(loc);
    }
  }, [searchParams]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <Listings filters={filters} searchTerm={searchTerm} location={location} />
    </div>
  );
};

export default SearchPage;







