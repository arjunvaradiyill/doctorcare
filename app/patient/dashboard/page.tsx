"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const summaryCards = [
  { label: "Total Reports", value: 12, color: "bg-purple-100", icon: "/icon-park-outline_success.png" },
  { label: "Clinic Consulting", value: 12, color: "bg-blue-100", icon: "/icon-park-outline_success.png" },
  { label: "Total Services", value: 12, color: "bg-yellow-100", icon: "/icon-park-outline_success.png" },
  { label: "Appointments", value: 12, color: "bg-sky-100", icon: "/icon-park-outline_success.png" },
];

const medicationReport = [
  { label: "Emergency Medicines", value: 65 },
  { label: "General Medicines", value: 25 },
  { label: "Internal Medicines", value: 10 },
];

const patientSchedule = [
  { name: "Floyd Miles", type: "Clinic Consulting", status: "Incoming" },
  { name: "Floyd Miles", type: "Clinic Consulting", status: "Completed" },
  { name: "Floyd Miles", type: "Clinic Consulting", status: "Completed" },
  { name: "Floyd Miles", type: "Clinic Consulting", status: "Completed" },
];

const reports = [
  "Blood Test",
  "ECG report",
  "Stent report",
  "X ray",
  "Full Body Report",
];

const recentAppointments = [
  { name: "Floyd Miles", visitId: "OPD-1", date: "12.09.2019", gender: "Male", diseases: "Diabetes", status: "Out-Patient", avatar: "/doctor2.png" },
  { name: "Floyd Miles", visitId: "OPD-32", date: "12.09.2019", gender: "Male", diseases: "Diabetes", status: "Pending", avatar: "/doctor3.png" },
  { name: "Floyd Miles", visitId: "OPD-123", date: "12.09.2019", gender: "Male", diseases: "Diabetes", status: "In- Patient", avatar: "/doctor4.png" },
];

export default function PatientDashboard() {
  return (
    <div className="p-6 md:p-10 bg-[#f7f8fa] min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className={`rounded-2xl p-6 flex flex-col items-start shadow ${card.color}`}>
            <div className="mb-2">
              <Image src={card.icon} alt="icon" width={28} height={28} />
            </div>
            <span className="font-semibold text-gray-700 text-base mb-1">{card.label}</span>
            <span className="text-2xl font-bold text-gray-900">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* AI Doctor Assistance */}
        <div
          className="rounded-2xl p-6 flex flex-col md:flex-row items-stretch shadow relative overflow-hidden min-h-[340px]"
          style={{
            background: "linear-gradient(120deg, #fbeee6 0%, #b3e0ff 100%)"
          }}
        >
          {/* Image on the left, large and centered */}
          <div className="absolute top-0 bottom-0  right-0 flex items-end justify-center md:items-center md:justify-start">
            <Image
              src="/aidoctor.png"
              alt="AI Doctor"
              width={480}
              height={380}
              className="object-contain w-full max-w-[400px] md:max-w-[400px] h-auto"
              priority
            />
          </div>
          {/* Content on the right */}
          <div className="flex-1 flex flex-col justify-center items-center md:items-start z-10">
            <span className="font-semibold text-gray-700 mb-2 block">AI Doctor Assistance</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 leading-tight drop-shadow text-center md:text-left">FUTURE<br />ASSURANCE IS<br />BESIDES YOU</h2>
            <button className="bg-white text-blue-600 font-bold px-6 py-2 rounded-xl shadow hover:bg-blue-50 transition w-fit">BOOK NOW</button>
          </div>
        </div>
        {/* Doctor Schedule */}
        <div className="rounded-2xl bg-white p-4 shadow-lg flex flex-col">
          <div className="flex items-center mb-4">
            <div className="bg-gray-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800 ml-3">Doctor Schedule</span>
          </div>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white group">
            <Image
              src="/doctordetails.jpg"
              alt="Doctor"
              fill
              className="object-cover rounded-2xl"
              style={{ objectPosition: 'center 35%' }}
              priority
            />
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Available</div>
            {/* Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 bg-gray-300/60 rounded-2xl">
              <div>
                <div className="bg-yellow-300 text-black px-3 py-1 rounded-full font-semibold text-xs inline-block mb-1">Dr. Fila Soy</div>
                <div className="font-bold text-lg text-black">Cardiologist</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white bg-white/60 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Visualizations and Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Medication Report */}
        <div className="rounded-2xl bg-purple-100 p-6 shadow flex flex-col items-center">
          <span className="font-semibold text-gray-700 mb-4 block">Medication Report</span>
          <div className="w-full flex flex-col items-center">
            {/* Simple donut chart mockup */}
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="#ede9fe" />
              <path d="M60 10 A50 50 0 0 1 110 60" stroke="#a78bfa" strokeWidth="20" fill="none" />
              <path d="M110 60 A50 50 0 0 1 60 110" stroke="#818cf8" strokeWidth="20" fill="none" />
              <path d="M60 110 A50 50 0 0 1 10 60" stroke="#c4b5fd" strokeWidth="20" fill="none" />
            </svg>
            <div className="flex justify-between w-full mt-6">
              {medicationReport.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="font-bold text-lg text-gray-900">{item.value}%</span>
                  <span className="text-xs text-gray-600 text-center mt-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Patient Schedule */}
        <div className="rounded-2xl bg-violet-50 p-6 shadow flex flex-col">
          <span className="font-semibold text-gray-700 mb-4 block">Patient Schedule</span>
          <div className="flex flex-col gap-4">
            {patientSchedule.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#818cf8] flex items-center justify-center">
                  <Image src="/doctor2.png" alt="avatar" width={32} height={32} />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                  <span className="block text-xs text-gray-500">{item.type}</span>
                </div>
                <span className={`text-xs font-semibold ${item.status === "Incoming" ? "text-blue-600" : "text-gray-400"}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Reports */}
        <div className="rounded-2xl bg-slate-100 p-6 shadow flex flex-col">
          <span className="font-semibold text-gray-700 mb-4 block">Reports</span>
          <ul className="divide-y divide-gray-200">
            {reports.map((report, idx) => (
              <li key={idx} className="py-3 flex items-center justify-between">
                <span className="text-gray-900 font-medium">{report}</span>
                <svg width="20" height="20" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Appointment</h2>
          <button className="bg-[#7b6ffb] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#6a5de8]">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="py-2 px-4 font-semibold">Patient name</th>
                <th className="py-2 px-4 font-semibold">Visit Id</th>
                <th className="py-2 px-4 font-semibold">Date</th>
                <th className="py-2 px-4 font-semibold">Gender</th>
                <th className="py-2 px-4 font-semibold">Diseases</th>
                <th className="py-2 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appt, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Image src={appt.avatar} alt="avatar" width={28} height={28} className="rounded-full" />
                    <span className="font-medium text-gray-900">{appt.name}</span>
                  </td>
                  <td className="py-3 px-4">{appt.visitId}</td>
                  <td className="py-3 px-4">{appt.date}</td>
                  <td className="py-3 px-4">{appt.gender}</td>
                  <td className="py-3 px-4">{appt.diseases}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      appt.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : appt.status === "Out-Patient"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>{appt.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 