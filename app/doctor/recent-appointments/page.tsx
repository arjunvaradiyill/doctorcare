"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DoctorLayout from "@/app/components/DoctorLayout";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const recentAppointmentsData = [
  { id: 1, name: "Alice Johnson", visitId: "OPD-001", date: "2024-01-25", gender: "Female", age: 32, disease: "Hypertension", status: "Out-Patient", doctor: "Dr. Sarah Wilson", department: "Cardiology", diagnosis: "Elevated blood pressure", prescription: "Lisinopril 10mg", notes: "Regular checkup required", followUp: "2024-02-01" },
  { id: 2, name: "John Doe", visitId: "OPD-002", date: "2024-01-24", gender: "Male", age: 39, disease: "Diabetes", status: "Pending", doctor: "Dr. Sarah Wilson", department: "Cardiology", diagnosis: "Type 2 Diabetes", prescription: "Metformin 500mg", notes: "Regular checkup required", followUp: "2024-01-31" },
  { id: 3, name: "Jane Smith", visitId: "OPD-003", date: "2024-01-23", gender: "Female", age: 34, disease: "Asthma", status: "In-Patient", doctor: "Dr. Emily Davis", department: "Pediatrics", diagnosis: "Asthma exacerbation", prescription: "Albuterol inhaler", notes: "Regular checkup required", followUp: "2024-01-30" },
  { id: 4, name: "Mike Johnson", visitId: "OPD-004", date: "2024-01-22", gender: "Male", age: 46, disease: "Neurological symptoms", status: "Out-Patient", doctor: "Dr. Michael Chen", department: "Neurology", diagnosis: "Migraine", prescription: "Sumatriptan 50mg", notes: "Follow-up in 2 weeks", followUp: "2024-02-05" },
];

export default function RecentAppointmentsPage() {
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setRecentAppointments(recentAppointmentsData);
      setLoading(false);
    }, 1500);
  }, []);

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredAppointments = recentAppointments.filter(appointment => {
    const matchesStatus = statusFilter === "All" || appointment.status === statusFilter;
    const matchesDepartment = departmentFilter === "All" || appointment.department === departmentFilter;
    const matchesDate = dateFilter === "All" || appointment.date === dateFilter;
    const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.disease.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDepartment && matchesDate && matchesSearch;
  });

  return (
    <DoctorLayout 
      title="Recent Patient Appointments"
      subtitle="View and manage recent patient appointments"
      onSearch={handleSearch}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[300px]">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-blue-300 focus:border-blue-300"
              >
                <option value="All">All Status</option>
                <option value="Out-Patient">Out-Patient</option>
                <option value="In-Patient">In-Patient</option>
                <option value="Pending">Pending</option>
              </select>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-blue-300 focus:border-blue-300"
              >
                <option value="All">All Departments</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-blue-300 focus:border-blue-300"
              >
                <option value="All">All Dates</option>
                <option value="2024-01-25">January 25, 2024</option>
                <option value="2024-01-24">January 24, 2024</option>
                <option value="2024-01-23">January 23, 2024</option>
                <option value="2024-01-22">January 22, 2024</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Visit ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Disease</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img src={`https://randomuser.me/api/portraits/men/${appointment.id + 30}.jpg`} alt={appointment.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="font-medium text-black">{appointment.name}</div>
                            <div className="text-xs text-gray-400">{appointment.age} years</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{appointment.visitId}</td>
                      <td className="py-3 px-4 text-gray-600">{appointment.date}</td>
                      <td className="py-3 px-4 text-gray-600">{appointment.gender}</td>
                      <td className="py-3 px-4 text-gray-600">{appointment.disease}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "Out-Patient" ? "bg-blue-100 text-blue-600" :
                          appointment.status === "In-Patient" ? "bg-green-100 text-green-600" :
                          "bg-yellow-100 text-yellow-600"
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="text-[#7b6ffb] hover:text-[#6a5de8] font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={`https://randomuser.me/api/portraits/men/${selectedAppointment.id + 30}.jpg`}
                  alt={selectedAppointment.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedAppointment.name}</h3>
                  <p className="text-sm text-gray-500">{selectedAppointment.visitId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Diagnosis</p>
                <p className="text-gray-900">{selectedAppointment.diagnosis}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Prescription</p>
                <p className="text-gray-900">{selectedAppointment.prescription}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-900">{selectedAppointment.notes}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Follow-up Date</p>
                <p className="text-gray-900">{selectedAppointment.followUp}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
} 