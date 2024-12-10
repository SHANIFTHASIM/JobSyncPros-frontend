"use client";

import Image from "next/image";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdWork,
  MdAnalytics,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
import MenuLink from "./Menulink";

import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const LOGOUT_URL = "api/logout/";

const menuItems = [
  {
    list: [
      {
        title: "Home",
        path: "/",
        icon: <MdDashboard />,
      },
      {
        title: "Job",
        path: "/search",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Resume",
        path: "/Resume",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Entreprenaur",
        path: "/entreprenaur",
        icon: <MdShoppingBag />,
      },
      {
        title: "Courses",
        path: "/courses",
        icon: <MdAnalytics />,
      },
    ],
  },
  {
    title: "Community",
    list: [
      {
        title: "Social",
        path: "/socialcommunity",
        icon: <MdWork />,
      },
      {
        title: "Profile",
        path: "/profile",
        icon: <MdWork />,
      },
    ],
  },
  {
    title: "Seller",
    list: [
      {
        title: "AIAgents",
        path: "/AIAgents",
        icon: <MdOutlineSettings />,
      },

      {
        title: "Practice",
        path: "/courses/practice",
        icon: <MdAnalytics />,
      },
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
      },
      {
        title: "Help",
        path: "/dashboard/help",
        icon: <MdHelpCenter />,
      },
    ],
  },
];

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(LOGOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    });

    if (res.ok) {
      router.replace("/Login");
      toast({
        title: "Logged out ",
        description: "You have been logged out successfully.",
      });
    } else {
      toast({
        title: "Logged Out failed",
        description: "There is no token..",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="sticky top-0 w-[200px] bg-gray-100 h-screen p-4 flex flex-col justify-between">
      <div className="overflow-y-auto flex-grow scrollbar-hide smooth-scroll">
        <ul className="list-none text-black ml-8">
          {menuItems.map((cat, catIndex) => (
            <li key={catIndex} className="mt-8">
              <span className="text-gray-500 font-bold text-xs ml-2">
                {cat.title}
              </span>
              <ul>
                {cat.list.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <MenuLink item={item} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout button at the bottom */}
      <div className="mt-4">
        <button
          className="p-4 my-3 flex items-center gap-2 cursor-pointer rounded-lg bg-none border-none text-black w-full hover:bg-gray-300"
          onClick={handleLogout}
        >
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;




