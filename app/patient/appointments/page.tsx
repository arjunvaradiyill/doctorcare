"use client";
import React, { useState, useEffect } from "react";
import { authAPI } from '@/app/services/api';

const DOCTORS = [
  {
    name: "Dr. George Paul",
    specialization: "Cardiology",
    department: "Cardiology",
    experience: 15,
    availability: "Mon–Fri",
    time: "10:00 AM – 4:00 PM",
    image: "/doctor.png",
    rating: 4,
  },
  {
    name: "Dr. Sarah Wilson",
    specialization: "Cardiology",
    department: "Cardiology",
    experience: 12,
    availability: "Mon–Fri",
    time: "10:00 AM – 4:00 PM",
    image: "/doctor2.png",
    rating: 5,
  },
  {
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    department: "Neurology",
    experience: 10,
    availability: "Mon–Fri",
    time: "9:00 AM – 3:00 PM",
    image: "/doctor3.png",
    rating: 4,
  },
];

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
  const [selectedDoctorName, setSelectedDoctorName] = useState(DOCTORS[0].name);
  const selectedDoctor = DOCTORS.find(d => d.name === selectedDoctorName) || DOCTORS[0];

  // Auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedDoctorName(prevName => {
        const currentIndex = DOCTORS.findIndex(d => d.name === prevName);
        const nextIndex = (currentIndex + 1) % DOCTORS.length;
        return DOCTORS[nextIndex].name;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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
                    <select
                      className="w-full px-5 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black bg-white pr-12 appearance-none"
                      value={selectedDoctorName}
                      onChange={e => setSelectedDoctorName(e.target.value)}
                    >
                      {DOCTORS.map(doc => (
                        <option key={doc.name} value={doc.name}>{doc.name}</option>
                      ))}
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
        <div className="md:col-span-1 w-full flex flex-col justify-center items-center bg-transparent">
          <div className="w-full max-w-[400px] rounded-3xl border border-purple-200 flex flex-col items-center bg-white p-6 shadow-xl min-h-[520px] relative" style={{minHeight: 520}}>
            {/* Doctor Image Large and Centered */}
            <div className="flex flex-col items-center w-full">
              <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-[220px] h-[260px] object-contain rounded-2xl shadow-lg border-4 border-white bg-white" style={{boxShadow: '0 4px 32px 0 #a18aff22'}} />
            </div>
            {/* Info Card Overlapping Bottom of Image */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-[92%] max-w-[340px] rounded-2xl bg-gradient-to-b from-[#a18aff] to-[#5a8dee] p-7 flex flex-col items-center shadow-2xl border border-white z-10" style={{minHeight: 220}}>
              <h3 className="text-white text-2xl font-extrabold mb-3 tracking-tight text-center w-full">{selectedDoctor.name}</h3>
              <ul className="text-white text-base space-y-2 mb-5 w-full">
                <li><span className="font-semibold">Specialization:</span> {selectedDoctor.specialization}</li>
                <li><span className="font-semibold">Department:</span> {selectedDoctor.department}</li>
                <li><span className="font-semibold">Experience:</span> {selectedDoctor.experience}+ years</li>
                <li><span className="font-semibold">Availability:</span> {selectedDoctor.availability}</li>
                <li><span className="font-semibold">{selectedDoctor.time}</span></li>
              </ul>
              <div className="flex items-center gap-3 mt-2 w-full justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-7 h-7 ${i < selectedDoctor.rating ? 'text-white' : 'text-white opacity-50'}`} fill={i < selectedDoctor.rating ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                ))}
              </div>
              <button 
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Book Appointment with {selectedDoctor.name}</h2>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-black mb-2">Patient's Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black bg-white" 
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-black mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black bg-white" 
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-black mb-2">Date of Appointment</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-black mb-2">Preferred Time</label>
                  <select className="w-full px-4 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black bg-white">
                    <option>Select time</option>
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-base font-medium text-black mb-2">Reason for Visit</label>
                <textarea 
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-black bg-white min-h-[100px]" 
                  placeholder="Please describe your symptoms or reason for the appointment"
                ></textarea>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border border-purple-400 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 