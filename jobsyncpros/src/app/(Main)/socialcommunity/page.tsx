"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// Import icons from react-icons
import { FaDiscord, FaSlack, FaTelegram, FaArrowDown, FaPlus } from "react-icons/fa";
import SocialMediaList from "../_components/SocialMediaList";

// Define the interface for platforms
interface Platform {
  name: string;
  icon: JSX.Element; // This accounts for the icon being JSX
  oauthUrl: string;
}

const SocialCommunity = () => {
  const [open, setOpen] = useState(false);

  // List of platforms with their OAuth URLs
  const platforms: Platform[] = [
    { name: "Discord", icon: <FaDiscord />,oauthUrl:"/api/oauth/" },
    { name: "Slack", icon: <FaSlack />, oauthUrl: "/api/auth/slack" },
    { name: "Telegram", icon: <FaTelegram />, oauthUrl: "/api/auth/telegram" },
    { 
      name: "JobSyncPros", 
      icon: <Image src='/JobSyncProsLogo.jpg' alt="JSP" height={20} width={20} className="rounded-2xl"/>, 
      oauthUrl: "/api/auth/jsp" 
    }, // Placeholder for JobSyncPros
  ];

  // Handle clicking on OAuth buttons
  const handleOAuthClick = (platform: Platform) => {
    // Redirect the user to the OAuth URL
    window.location.href = platform.oauthUrl;
  };

  return (
    <div >
      <h1 className=" font-bold ">Social Community Page</h1>

      {/* Button to open/close the dropdown */}
      <button
        className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center cursor-pointer mt-6"
        onClick={() => setOpen(!open)}
      >
        <FaPlus />
      </button>

      {/* Dropdown for Social Platforms */}
      {open && (
        <div className="flex flex-col gap-4 p-4 bg-gray-200 rounded-md shadow-md mt-4">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              className="flex items-center gap-2 p-2 bg-white hover:bg-gray-200 rounded-md"
              onClick={() => handleOAuthClick(platform)}
            >
              {platform.icon}
              <span>{platform.name}</span>
            </button>
          ))}
        </div>
      )}

      <SocialMediaList/>



      </div>
    
  );
};

export default SocialCommunity;



