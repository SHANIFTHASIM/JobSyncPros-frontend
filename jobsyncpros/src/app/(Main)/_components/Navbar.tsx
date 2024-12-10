"use client";

import Image from "next/image";
import Link from "next/link";
import Searchbar from "./searchbar";
import { useState } from "react";


const Navbar: React.FC<{ setLocation: (value: string) => void }> = ({ setLocation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocationLocal] = useState(''); // Declare local location state

  return (
    <div className="sticky top-0 w-full bg-slate-100 py-3 px-5 flex items-center justify-between z-10 shadow-md">
      <div className="flex items-center gap-4">
        <Image
          className="rounded-lg object-cover"
          src="/JobSyncProsLogo.jpg"
          alt="Logo"
          width={50}
          height={50}
        />
        <span className="font-serif text-xl text-black">JobSyncPros</span>
      </div>
      <Searchbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        location={location} // Pass the local location state
        setLocation={setLocationLocal} // Pass the setter for local location state
      />
      <div className="flex items-center gap-3 mb-5">
        <Image
          className="rounded-full object-cover"
          src="/profile.webp"
          alt=""
          width={30}
          height={30}
        />
        <div className="flex flex-col">
          <span className="font-medium text-black">Username </span>
          <div><Link href="/Login">Login</Link></div>
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;


