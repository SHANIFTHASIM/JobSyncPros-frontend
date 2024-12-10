"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuLinkProps {
  item: {
    title: string;
    path: string;
    icon: JSX.Element;
  };
}

const MenuLink: React.FC<MenuLinkProps> = ({ item }) => {
  const pathname = usePathname();

  return (
    <Link href={item.path} className={`p-2 flex items-center gap-2 my-1 rounded-lg ${pathname === item.path ? 'bg-gray-300' : 'hover:bg-gray-300'}`}>
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuLink;


