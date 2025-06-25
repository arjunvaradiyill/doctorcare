"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import api, { Patient } from "@/app/services/api";

export default function SimplePatientProfilePage() {
  const params = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatient() {
      if (typeof params.id === "string") {
        try {
          setLoading(true);
          const data = await api.getPatientById(params.id);
          setPatient(data);
        } catch (err) {
          setError("Failed to load patient data");
          console.error("Error fetching patient:", err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchPatient();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="text-lg font-semibold text-gray-700">
          Loading patient data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="text-lg font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="text-lg font-semibold text-gray-700">
          Patient not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">
          Patient Profile: {patient.name}
        </h1>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">
                Personal Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-black">{patient.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-black">{patient.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="ml-2 text-black">{patient.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Gender:</span>
                  <span className="ml-2 text-black">{patient.gender}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date of Birth:</span>
                  <span className="ml-2 text-black">{patient.dateOfBirth}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">
                Medical Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Medical History:</span>
                  <p className="mt-1 text-black">{patient.medicalHistory}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Address:</span>
                  <p className="mt-1 text-black">{patient.address}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Appointments:</span>
                  <span className="ml-2 text-black">{patient.appointment_count}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Appointment:</span>
                  <span className="ml-2 text-black">{patient.last_appointment}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 