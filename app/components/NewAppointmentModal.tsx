"use client";
import React, { useState, useEffect } from "react";
import api, { Doctor, Patient } from "@/app/services/api";
import LoadingSpinner from "./LoadingSpinner";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated: () => void;
}

export default function NewAppointmentModal({ isOpen, onClose, onAppointmentCreated }: NewAppointmentModalProps) {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsData, doctorsData] = await Promise.all([
          api.getPatients(),
          api.getDoctors(),
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (err) {
        setError("Failed to fetch patients or doctors.");
      }
    }
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.createAppointment({
        patient: patientId,
        doctor: doctorId,
        date,
        time,
        reason,
        status,
      });
      onAppointmentCreated();
      onClose();
    } catch (err) {
      setError("Failed to create appointment.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">New Appointment</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Patient</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Doctor</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="h-5 w-5" /> : "Create Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 