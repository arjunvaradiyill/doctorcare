// Mock data for development when no backend is available

export const mockPatients = [
  {
    _id: '00001',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-555-0001',
    dateOfBirth: '1992-05-18',
    gender: 'Female',
    address: '100 Healthcare Ave, Medical City, MC 12345',
    medicalHistory: 'Hypertension, Seasonal allergies',
    appointment_count: 7,
    last_appointment: '2024-01-25',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
    findings: [
      {
        id: 1,
        title: 'Blood Pressure Check',
        uploaded: 'Jan 25, 2024',
        content: 'Patient shows elevated blood pressure readings. Recommended lifestyle changes including reduced sodium intake and regular exercise. Monitoring required.'
      },
      {
        id: 2,
        title: 'Allergy Assessment',
        uploaded: 'Jan 20, 2024',
        content: 'Seasonal allergy symptoms confirmed. Prescribed antihistamines and recommended avoiding triggers during peak pollen seasons.'
      }
    ],
    suggestions: [
      {
        id: 1,
        title: 'Lifestyle Modification Plan',
        uploaded: 'Jan 25, 2024',
        content: 'Based on current health assessment, recommend implementing a heart-healthy diet with emphasis on low-sodium foods. Regular cardiovascular exercise 3-4 times per week. Monitor blood pressure weekly and report any readings above 140/90.'
      },
      {
        id: 2,
        title: 'Allergy Management Strategy',
        uploaded: 'Jan 20, 2024',
        content: 'For seasonal allergies, start medication 2 weeks before allergy season. Use air purifiers at home and keep windows closed during high pollen days. Consider immunotherapy for long-term relief.'
      }
    ]
  },
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    address: '123 Main St, City, State 12345',
    medicalHistory: 'Hypertension, Diabetes Type 2',
    appointment_count: 5,
    last_appointment: '2024-01-15',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0124',
    dateOfBirth: '1990-07-22',
    gender: 'Female',
    address: '456 Oak Ave, City, State 12345',
    medicalHistory: 'Asthma, Allergies',
    appointment_count: 3,
    last_appointment: '2024-01-10',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1-555-0125',
    dateOfBirth: '1978-11-08',
    gender: 'Male',
    address: '789 Pine Rd, City, State 12345',
    medicalHistory: 'Heart condition, High cholesterol',
    appointment_count: 8,
    last_appointment: '2024-01-20',
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    _id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    phone: '+1-555-0126',
    dateOfBirth: '1988-04-12',
    gender: 'Female',
    address: '321 Elm St, City, State 12345',
    medicalHistory: 'Migraine, Anxiety',
    appointment_count: 4,
    last_appointment: '2024-01-18',
    created_at: '2023-04-01T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  },
  {
    _id: '5',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+1-555-0127',
    dateOfBirth: '1975-09-30',
    gender: 'Male',
    address: '654 Maple Dr, City, State 12345',
    medicalHistory: 'Diabetes Type 1, Kidney disease',
    appointment_count: 12,
    last_appointment: '2024-01-22',
    created_at: '2023-05-01T00:00:00Z',
    updated_at: '2024-01-22T00:00:00Z'
  },
  {
    _id: '6',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@email.com',
    phone: '+1-555-0128',
    dateOfBirth: '1995-12-03',
    gender: 'Female',
    address: '987 Cedar Ln, City, State 12345',
    medicalHistory: 'Depression, Insomnia',
    appointment_count: 6,
    last_appointment: '2024-01-19',
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2024-01-19T00:00:00Z'
  },
  {
    _id: '7',
    name: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    phone: '+1-555-0129',
    dateOfBirth: '1982-06-25',
    gender: 'Male',
    address: '147 Birch Ave, City, State 12345',
    medicalHistory: 'Hypertension, Sleep apnea',
    appointment_count: 9,
    last_appointment: '2024-01-21',
    created_at: '2023-07-01T00:00:00Z',
    updated_at: '2024-01-21T00:00:00Z'
  }
];

export const mockDoctors = [
  {
    _id: '1',
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiology',
    experience: 15,
    rating: 4.8,
    image: 'https://i.pinimg.com/736x/32/c3/dd/32c3dda07789b98ea5363820a629f9f3.jpg',
    email: 'sarah.wilson@hospital.com',
    phone: '+1-555-0101',
    patient_count: 150,
    avg_rating: 4.8,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    experience: 12,
    rating: 4.6,
    image: 'https://i.pinimg.com/736x/32/c3/dd/32c3dda07789b98ea5363820a629f9f3.jpg',
    email: 'michael.chen@hospital.com',
    phone: '+1-555-0102',
    patient_count: 120,
    avg_rating: 4.6,
    created_at: '2020-02-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    _id: '3',
    name: 'Dr. Emily Davis',
    specialization: 'Pediatrics',
    experience: 8,
    rating: 4.9,
    image: 'https://i.pinimg.com/736x/32/c3/dd/32c3dda07789b98ea5363820a629f9f3.jpg',
    email: 'emily.davis@hospital.com',
    phone: '+1-555-0103',
    patient_count: 200,
    avg_rating: 4.9,
    created_at: '2020-03-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    _id: '4',
    name: 'Dr. Olivia Bennett',
    specialization: 'Dermatology',
    experience: 7,
    rating: 4.7,
    image: 'https://i.pinimg.com/736x/32/c3/dd/32c3dda07789b98ea5363820a629f9f3.jpg',
    email: 'olivia.bennett@hospital.com',
    phone: '+1-555-0104',
    patient_count: 180,
    avg_rating: 4.7,
    created_at: '2021-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    _id: '5',
    name: 'Dr. James Rodriguez',
    specialization: 'Orthopedics',
    experience: 18,
    rating: 4.5,
    image: 'https://i.pinimg.com/736x/32/c3/dd/32c3dda07789b98ea5363820a629f9f3.jpg',
    email: 'james.rodriguez@hospital.com',
    phone: '+1-555-0105',
    patient_count: 220,
    avg_rating: 4.5,
    created_at: '2019-06-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    _id: '6',
    name: 'Dr. Maria Thompson',
    specialization: 'Psychiatry',
    experience: 10,
    rating: 4.8,
    image: 'https://i.pinimg.com/736x/32/c3/dd/32c3dda07789b98ea5363820a629f9f3.jpg',
    email: 'maria.thompson@hospital.com',
    phone: '+1-555-0106',
    patient_count: 160,
    avg_rating: 4.8,
    created_at: '2020-08-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    _id: '7',
    name: 'Dr. Robert Kim',
    specialization: 'Oncology',
    experience: 20,
    rating: 4.9,
    image: 'https://i.pinimg.com/736x/32/c3/dd/32c3dda07789b98ea5363820a629f9f3.jpg',
    email: 'robert.kim@hospital.com',
    phone: '+1-555-0107',
    patient_count: 140,
    avg_rating: 4.9,
    created_at: '2018-03-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    _id: '8',
    name: 'Dr. Jennifer Lee',
    specialization: 'Endocrinology',
    experience: 11,
    rating: 4.7,
    image: 'https://i.pinimg.com/736x/32/c3/dd/32c3dda07789b98ea5363820a629f9f3.jpg',
    email: 'jennifer.lee@hospital.com',
    phone: '+1-555-0108',
    patient_count: 130,
    avg_rating: 4.7,
    created_at: '2020-11-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockAppointments = [
  {
    _id: '1',
    patient: {
      _id: '00001',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1-555-0001',
      gender: 'Female'
    },
    doctor: {
      _id: '1',
      name: 'Dr. Sarah Wilson',
      specialization: 'Cardiology'
    },
    date: '2024-02-20',
    time: '11:00 AM',
    status: 'Scheduled',
    type: 'Follow-up',
    notes: 'Blood pressure monitoring and lifestyle consultation',
    paymentStatus: 'Paid',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z'
  },
  {
    _id: '2',
    patient: {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      gender: 'Male'
    },
    doctor: {
      _id: '1',
      name: 'Dr. Sarah Wilson',
      specialization: 'Cardiology'
    },
    date: '2024-02-15',
    time: '10:00 AM',
    status: 'Scheduled',
    type: 'Consultation',
    notes: 'Follow-up appointment for heart condition',
    paymentStatus: 'Paid',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    _id: '3',
    patient: {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1-555-0124',
      gender: 'Female'
    },
    doctor: {
      _id: '3',
      name: 'Dr. Emily Davis',
      specialization: 'Pediatrics'
    },
    date: '2024-02-16',
    time: '2:30 PM',
    status: 'Completed',
    type: 'Check-up',
    notes: 'Annual physical examination',
    paymentStatus: 'Paid',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z'
  },
  {
    _id: '4',
    patient: {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1-555-0125',
      gender: 'Male'
    },
    doctor: {
      _id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Neurology'
    },
    date: '2024-02-17',
    time: '9:00 AM',
    status: 'Pending',
    type: 'Consultation',
    notes: 'Initial consultation for neurological symptoms',
    paymentStatus: 'Pending',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    _id: '5',
    patient: {
      _id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      phone: '+1-555-0126',
      gender: 'Female'
    },
    doctor: {
      _id: '6',
      name: 'Dr. Maria Thompson',
      specialization: 'Psychiatry'
    },
    date: '2024-02-18',
    time: '3:00 PM',
    status: 'Completed',
    type: 'Therapy',
    notes: 'Anxiety management session',
    paymentStatus: 'Paid',
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  },
  {
    _id: '6',
    patient: {
      _id: '5',
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1-555-0127',
      gender: 'Male'
    },
    doctor: {
      _id: '8',
      name: 'Dr. Jennifer Lee',
      specialization: 'Endocrinology'
    },
    date: '2024-02-19',
    time: '1:30 PM',
    status: 'Scheduled',
    type: 'Follow-up',
    notes: 'Diabetes management review',
    paymentStatus: 'Paid',
    created_at: '2024-01-22T00:00:00Z',
    updated_at: '2024-01-22T00:00:00Z'
  },
  {
    _id: '7',
    patient: {
      _id: '6',
      name: 'Lisa Garcia',
      email: 'lisa.garcia@email.com',
      phone: '+1-555-0128',
      gender: 'Female'
    },
    doctor: {
      _id: '6',
      name: 'Dr. Maria Thompson',
      specialization: 'Psychiatry'
    },
    date: '2024-02-21',
    time: '10:30 AM',
    status: 'Pending',
    type: 'Consultation',
    notes: 'Depression evaluation',
    paymentStatus: 'Pending',
    created_at: '2024-01-19T00:00:00Z',
    updated_at: '2024-01-19T00:00:00Z'
  },
  {
    _id: '8',
    patient: {
      _id: '7',
      name: 'Robert Taylor',
      email: 'robert.taylor@email.com',
      phone: '+1-555-0129',
      gender: 'Male'
    },
    doctor: {
      _id: '5',
      name: 'Dr. James Rodriguez',
      specialization: 'Orthopedics'
    },
    date: '2024-02-22',
    time: '2:00 PM',
    status: 'Completed',
    type: 'Surgery',
    notes: 'Knee replacement surgery follow-up',
    paymentStatus: 'Paid',
    created_at: '2024-01-21T00:00:00Z',
    updated_at: '2024-01-21T00:00:00Z'
  },
  {
    _id: '9',
    patient: {
      _id: '00001',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1-555-0001',
      gender: 'Female'
    },
    doctor: {
      _id: '4',
      name: 'Dr. Olivia Bennett',
      specialization: 'Dermatology'
    },
    date: '2024-02-23',
    time: '11:30 AM',
    status: 'Scheduled',
    type: 'Consultation',
    notes: 'Skin condition evaluation',
    paymentStatus: 'Paid',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z'
  },
  {
    _id: '10',
    patient: {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1-555-0125',
      gender: 'Male'
    },
    doctor: {
      _id: '7',
      name: 'Dr. Robert Kim',
      specialization: 'Oncology'
    },
    date: '2024-02-24',
    time: '9:30 AM',
    status: 'Completed',
    type: 'Screening',
    notes: 'Cancer screening results review',
    paymentStatus: 'Paid',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    _id: '11',
    patient: {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1-555-0124',
      gender: 'Female'
    },
    doctor: {
      _id: '3',
      name: 'Dr. Emily Davis',
      specialization: 'Pediatrics'
    },
    date: '2024-02-25',
    time: '3:30 PM',
    status: 'Pending',
    type: 'Vaccination',
    notes: 'Annual vaccination appointment',
    paymentStatus: 'Pending',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    _id: '12',
    patient: {
      _id: '5',
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1-555-0127',
      gender: 'Male'
    },
    doctor: {
      _id: '1',
      name: 'Dr. Sarah Wilson',
      specialization: 'Cardiology'
    },
    date: '2024-02-26',
    time: '1:00 PM',
    status: 'Completed',
    type: 'Follow-up',
    notes: 'Heart condition monitoring',
    paymentStatus: 'Paid',
    created_at: '2024-01-22T00:00:00Z',
    updated_at: '2024-01-22T00:00:00Z'
  }
];

export const mockDocuments = [
  {
    id: 1,
    name: 'Blood Test Report',
    description: 'Complete blood count and comprehensive metabolic panel results',
    doctorName: 'Dr. Sarah Wilson',
    uploadDate: '2024-01-15',
    type: 'Laboratory Report',
    fileUrl: '/basic-text.pdf'
  },
  {
    id: 2,
    name: 'X-Ray Report',
    description: 'Chest X-ray examination for respiratory assessment',
    doctorName: 'Dr. Michael Chen',
    uploadDate: '2024-01-10',
    type: 'Imaging Report',
    fileUrl: '/image-doc.pdf'
  },
  {
    id: 3,
    name: 'Medical History Form',
    description: 'Patient medical history and current medications',
    doctorName: 'Dr. Emily Davis',
    uploadDate: '2024-01-05',
    type: 'Medical Form',
    fileUrl: '/fillable-form.pdf'
  },
  {
    id: 4,
    name: 'Prescription Report',
    description: 'Current medication prescription and dosage instructions',
    doctorName: 'Dr. Sarah Wilson',
    uploadDate: '2024-01-12',
    type: 'Prescription',
    fileUrl: '/sample-report (1).pdf'
  }
];

export const mockDashboardStats = {
  total_patients: mockPatients.length,
  total_doctors: mockDoctors.length,
  total_appointments: mockAppointments.length,
  completed_appointments: mockAppointments.filter(appt => appt.status === 'Completed').length,
  pending_appointments: mockAppointments.filter(appt => appt.status === 'Pending').length,
  scheduled_appointments: mockAppointments.filter(appt => appt.status === 'Scheduled').length,
  today_appointments: mockAppointments.filter(appt => {
    const today = new Date().toISOString().split('T')[0];
    return appt.date === today;
  }).length,
  week_appointments: mockAppointments.filter(appt => {
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekFromNowStr = weekFromNow.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    return appt.date >= todayStr && appt.date <= weekFromNowStr;
  }).length
};

export const mockUser = {
  _id: '1',
  username: 'admin',
  role: 'admin',
  email: 'admin@hospital.com'
};

// Mock test users for login testing
export const mockTestUsers = [
  {
    _id: '1',
    username: 'admin@carebot.com',
    password: 'admin123',
    role: 'admin',
    email: 'admin@carebot.com',
    name: 'Administrator'
  },
  {
    _id: '2',
    username: 'doctor@carebot.com',
    password: 'doctor123',
    role: 'doctor',
    email: 'doctor@carebot.com',
    name: 'Dr. Test Doctor'
  },
  {
    _id: '3',
    username: 'patient',
    password: 'patient123',
    role: 'patient',
    email: 'patient@email.com',
    name: 'Test Patient'
  },
  {
    _id: '4',
    username: 'dr.sarah',
    password: 'sarah123',
    role: 'doctor',
    email: 'sarah.wilson@hospital.com',
    name: 'Dr. Sarah Wilson'
  },
  {
    _id: '5',
    username: 'dr.michael',
    password: 'michael123',
    role: 'doctor',
    email: 'michael.chen@hospital.com',
    name: 'Dr. Michael Chen'
  },
  {
    _id: '6',
    username: 'dr.emily',
    password: 'emily123',
    role: 'doctor',
    email: 'emily.davis@hospital.com',
    name: 'Dr. Emily Davis'
  },
  {
    _id: '7',
    username: 'alice',
    password: 'alice123',
    role: 'patient',
    email: 'alice.johnson@email.com',
    name: 'Alice Johnson'
  },
  {
    _id: '8',
    username: 'john',
    password: 'john123',
    role: 'patient',
    email: 'john.doe@email.com',
    name: 'John Doe'
  },
  {
    _id: '9',
    username: 'jane',
    password: 'jane123',
    role: 'patient',
    email: 'jane.smith@email.com',
    name: 'Jane Smith'
  }
];

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to simulate API error (disabled for development)
export const simulateApiError = () => {
  // Temporarily disabled to prevent dashboard loading issues
  // Uncomment the lines below to re-enable error simulation
  /*
  // Skip error simulation if DISABLE_MOCK_ERRORS is set
  if (process.env.NEXT_PUBLIC_DISABLE_MOCK_ERRORS === 'true') {
    return;
  }
  
  // Only simulate errors in development mode
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.01) {
    throw new Error('Simulated API error');
  }
  */
}; 