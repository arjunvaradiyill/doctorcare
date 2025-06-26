"use client";
import React, { useState, useEffect } from "react";
import { authAPI } from '@/app/services/api';

export default function PatientAppointments() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Wilson",
      specialization: "Cardiology",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "General Checkup",
      status: "confirmed",
      notes: "Regular health checkup"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialization: "Neurology",
      date: "2024-01-20",
      time: "2:30 PM",
      type: "Follow-up",
      status: "pending",
      notes: "Follow-up consultation"
    },
    {
      id: 3,
      doctor: "Dr. Sarah Wilson",
      specialization: "Cardiology",
      date: "2024-01-08",
      time: "9:00 AM",
      type: "Consultation",
      status: "completed",
      notes: "Initial consultation completed"
    }
  ]);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedStatus === "all") return true;
    return appointment.status === selectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left: Booking Form */}
        <div className="md:col-span-2 w-full bg-white rounded-2xl p-12 flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="text-3xl font-bold text-black mb-10">Booking Appointment</h2>
            <form className="space-y-8 flex flex-col h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-medium text-black mb-2">Patient's id</label>
                  <div className="relative">
                    <input type="text" className="w-full px-5 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black placeholder:text-black bg-white pr-12" placeholder="121212" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" strokeWidth="2"/></svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-black mb-2">Patient's Name</label>
                  <div className="relative">
                    <input type="text" className="w-full px-5 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black placeholder:text-black bg-white pr-12" placeholder="Emmanuel Jose" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="2"/><path d="M6 18v-1c0-2.21 3.58-4 6-4s6 1.79 6 4v1" strokeWidth="2"/></svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-black mb-2">Doctor's Name</label>
                  <div className="relative">
                    <select className="w-full px-5 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black bg-white pr-12 appearance-none">
                      <option>Dr. George Paul</option>
                      <option>Dr. Sarah Wilson</option>
                      <option>Dr. Michael Chen</option>
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"/></svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-black mb-2">Department Name</label>
                  <div className="relative">
                    <select className="w-full px-5 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black bg-white pr-12 appearance-none">
                      <option>Cardiology</option>
                      <option>Neurology</option>
                      <option>Pediatrics</option>
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"/></svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-black mb-2">Booking time</label>
                  <div className="relative">
                    <input type="text" className="w-full px-5 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black placeholder:text-black bg-white pr-12" placeholder="12:00 PM" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M12 6v6l4 2" strokeWidth="2"/></svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-black mb-2">Date of Consultation</label>
                  <div className="relative">
                    <input type="text" className="w-full px-5 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black placeholder:text-black bg-white pr-12" placeholder="16-06-2025" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2"/></svg>
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-black mb-2">Notes</label>
                <textarea className="w-full px-5 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black placeholder:text-black bg-white min-h-[80px]" placeholder="Patient complains of mild abdominal discomfort, mostly after meals. No signs of nausea or vomiting. Vitals are within normal range. Suggested dietary changes and prescribed a mild antacid. Will follow up in one week if symptoms persist."></textarea>
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <button type="submit" className="w-full mt-10 bg-[#7b6ffb] hover:bg-[#6a5de8] text-white text-lg font-bold py-5 rounded-xl shadow-lg transition-all">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
        {/* Right: Doctor Card */}
        <div className="md:col-span-1 w-full flex flex-col justify-center items-center bg-transparent relative">
          <div className="w-full rounded-2xl border border-purple-400 overflow-visible relative flex flex-col items-center bg-white p-4 shadow-lg" style={{minHeight: 500}}>
            <div className="w-full flex flex-col items-center relative">
              <img src="/doctor.png" alt="Doctor" className="w-[340px] h-[340px] object-cover object-top rounded-t-2xl mt-2 drop-shadow-[0_0_16px_white]" style={{boxShadow: '0 0 0 6px #fff, 0 0 16px 4px #fff'}} />
              <div className="absolute left-0 right-0 mx-auto -bottom-10 z-10 px-4">
                <div className="rounded-2xl bg-gradient-to-b from-[#a18aff] to-[#5a8dee] p-6 flex flex-col items-start w-[320px]">
                  <h3 className="text-white text-lg font-bold mb-2">Dr. Stephen Strange</h3>
                  <ul className="text-white text-sm space-y-1 mb-4">
                    <li><span className="font-semibold">Specialization:</span> Cardiologist</li>
                    <li><span className="font-semibold">Department:</span> Cardiology</li>
                    <li><span className="font-semibold">Experience:</span> 12+ years</li>
                    <li><span className="font-semibold">Availability:</span> Mon–Fri</li>
                    <li><span className="font-semibold">10:00 AM – 4:00 PM</span></li>
                  </ul>
                  <div className="flex items-center gap-1 mt-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.75V17.75M12 6.75V6.75M6.75 12H6.75M17.25 12H17.25" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 