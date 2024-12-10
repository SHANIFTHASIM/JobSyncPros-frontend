

import React, { ReactNode } from 'react';
import Navbar from './_components/Navbar';
import Footer from './_components/Footer';
import { Toaster } from '@/components/ui/toaster';
import Sidebar from './_components/Sidebar';
import "../globals.css"


type LayoutProps = {
  children: ReactNode;
};

const Mainlayout = ({ children }: LayoutProps) => {
  return (
    
    <div className="flex flex-col min-h-screen">
      {/* Full width sticky Navbar */}
      <Navbar />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className=" flex-grow p-8">
          {children}
        </div>
      </div>

      <Toaster />

      {/* Footer at the bottom, full width */}
      <Footer />
    </div>
    
  );
};

export default Mainlayout;

