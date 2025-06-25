"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TopBar from "@/components/TopBar";
import DoctorSidebar from "@/app/doctor/components/DoctorSidebar";

interface DoctorLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showWelcomeCard?: boolean;
  onSearch?: (value: string) => void;
}

export default function DoctorLayout({ children, title, subtitle, showWelcomeCard = true, onSearch }: DoctorLayoutProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main Content */}
      <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
        {/* Top bar */}
        <div className="mb-6">
          <TopBar onSearch={handleSearch} />
        </div>

        {/* Welcome and stats cards */}
        {showWelcomeCard && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{title}</h1>
              <p className="text-base text-gray-600">{subtitle || "Manage your practice efficiently."}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-[#f3f4f6] text-[#7b6ffb] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e5e7eb]">Export data</button>
              <button className="bg-[#7b6ffb] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#5a8dee]">Create report</button>
            </div>
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
} 