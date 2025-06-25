# Patient Admin Dashboard Documentation

## Overview
The Patient Admin Dashboard is a comprehensive management system for healthcare administrators to view, manage, and interact with patient information. It provides detailed patient profiles, medical history tracking, appointment management, and document handling capabilities.

## Features

### 1. Patient Profile Management
- **Personal Information**: Name, email, phone, date of birth, gender
- **Medical History**: Chronic conditions, allergies, previous treatments
- **Contact Details**: Address, emergency contacts
- **Appointment Statistics**: Total appointments, last visit date

### 2. Dashboard Tabs
The patient profile page includes several tabs for comprehensive patient management:

#### Dashboard Tab
- **Body Visualization**: Interactive front/side view body diagrams
- **Statistics Cards**: 
  - Total appointments count
  - Phone number display
  - Gender information
- **Medical History Summary**: Overview of patient's medical background

#### Profile Tab
- **Editable Form**: Complete patient information form
- **Personal Details**: Full name, gender, DOB, Aadhar, National ID, Blood Group
- **Family Information**: Father, mother, spouse names
- **Address Information**: Country, state, district, pin code, full address
- **Contact Details**: Primary and secondary phone numbers

#### Doctors Tab
- **Doctor List**: All doctors who have treated this patient
- **Filtering Options**: Search by doctor name, filter by department
- **Doctor Cards**: Display doctor information with contact options
- **Send Message**: Direct communication with treating doctors

#### Booking History Tab
- **Appointment Timeline**: Complete history of all appointments
- **Filtering**: By doctor, department, and date
- **Status Tracking**: Completed, Processing, Rejected, On Hold, In Transit
- **Detailed Information**: Time slots, doctor details, department

#### Document Tab
- **Medical Reports**: PDF document management
- **Upload Functionality**: Add new medical reports
- **Document Actions**: View, print, delete documents
- **Filtering**: By report name, doctor, upload date

### 3. Medical Findings Management
Three sub-tabs for comprehensive medical record keeping:

#### Doctor Findings
- **Medical Observations**: Detailed clinical findings
- **Date/Time Tracking**: When findings were recorded
- **Expandable Content**: Click to view full findings
- **Add New Findings**: Modal form for new observations

#### Doctor Suggestions
- **Treatment Recommendations**: Medical advice and suggestions
- **Follow-up Instructions**: Next steps and monitoring
- **Additional Notes**: Supplementary information
- **Add New Suggestions**: Modal form for new recommendations

#### Medicine
- **Prescribed Medications**: Current and past prescriptions
- **Dosage Information**: Detailed medication instructions
- **Medicine Cards**: Visual representation of medications
- **Add New Medicine**: Modal form for new prescriptions

## Technical Implementation

### File Structure
```
app/dashboard/patients/[id]/page.tsx  # Main patient profile page
app/services/api.ts                   # API functions for patient data
app/services/mockData.ts              # Mock data for development
```

### Key Components

#### PatientProfilePage
- **State Management**: Uses React hooks for tab management and data
- **API Integration**: Fetches patient data using `api.getPatientById()`
- **Responsive Design**: Mobile-friendly layout with proper spacing
- **Error Handling**: Graceful fallbacks for missing data

#### Tab Components
- **DoctorsTab**: Displays treating doctors with filtering
- **DocumentTab**: PDF document management system
- **BookingHistoryTab**: Appointment history with status tracking
- **ProfileForm**: Editable patient information form

### Data Flow
1. **URL Parameter**: Patient ID extracted from route (`/patients/[id]`)
2. **API Call**: `api.getPatientById(id)` fetches patient data
3. **State Update**: Patient data stored in component state
4. **UI Rendering**: Data displayed in appropriate tabs and sections

### Mock Data Structure
```typescript
interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  medicalHistory: string;
  appointment_count: number;
  last_appointment: string;
  findings?: Array<{
    id: number;
    title: string;
    uploaded: string;
    content: string;
  }>;
  suggestions?: Array<{
    id: number;
    title: string;
    uploaded: string;
    content: string;
  }>;
}
```

## Usage Guide

### Accessing Patient Profiles
1. Navigate to `/dashboard/patients` to see all patients
2. Click on any patient row to view their detailed profile
3. URL format: `/dashboard/patients/{patient_id}`

### Available Patient IDs
- `00001` - Alice Johnson (Female, Hypertension, Allergies)
- `1` - John Doe (Male, Hypertension, Diabetes)
- `2` - Jane Smith (Female, Asthma, Allergies)
- `3` - Mike Johnson (Male, Heart condition, High cholesterol)

### Adding New Data
- **Findings**: Click "Add Findings" button in Doctor Findings tab
- **Suggestions**: Click "Add Suggestions" button in Doctor Suggestions tab
- **Medicine**: Click "Add Medicines" button in Medicine tab
- **Documents**: Click "Upload PDF Document" button in Document tab

### Filtering and Search
- **Doctors Tab**: Search by doctor name, filter by department
- **Booking History**: Filter by doctor, department, date
- **Documents**: Filter by report name, doctor, upload date

## Styling and UI

### Design System
- **Color Scheme**: Blue primary (#5B7CFA), gray backgrounds (#f7f8fa)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins throughout
- **Cards**: Rounded corners with subtle shadows

### Responsive Design
- **Mobile**: Single column layout with stacked elements
- **Tablet**: Two-column grid for better space utilization
- **Desktop**: Multi-column layout with sidebar navigation

### Interactive Elements
- **Hover Effects**: Subtle transitions on buttons and cards
- **Loading States**: Spinner indicators during data fetching
- **Error States**: Clear error messages with retry options
- **Success Feedback**: Confirmation messages for actions

## API Endpoints

### Patient Management
- `GET /patients/{id}` - Get patient by ID
- `PUT /patients/{id}` - Update patient information
- `DELETE /patients/{id}` - Delete patient record

### Medical Records
- `GET /patients/{id}/findings` - Get patient findings
- `POST /patients/{id}/findings` - Add new finding
- `GET /patients/{id}/suggestions` - Get patient suggestions
- `POST /patients/{id}/suggestions` - Add new suggestion
- `GET /patients/{id}/documents` - Get patient documents
- `POST /patients/{id}/documents` - Upload new document

### Appointments
- `GET /appointments?patient_id={id}` - Get patient appointments
- `POST /appointments` - Create new appointment
- `PUT /appointments/{id}` - Update appointment

## Error Handling

### Common Issues
1. **Patient Not Found**: Check if patient ID exists in mock data
2. **Network Errors**: Graceful fallback to mock data
3. **Invalid Data**: Form validation with clear error messages
4. **File Upload Errors**: Size and format validation for documents

### Fallback Mechanisms
- **Mock Data**: Development mode uses local mock data
- **Default Values**: Empty arrays for missing data
- **Loading States**: User feedback during data fetching
- **Error Boundaries**: Catch and display errors gracefully

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Filtering**: Date ranges, status combinations
- **Export Functionality**: PDF/Excel export of patient data
- **Audit Trail**: Track all changes to patient records
- **Integration**: Connect with external medical systems

### Performance Optimizations
- **Lazy Loading**: Load tab content on demand
- **Caching**: Implement data caching for faster access
- **Pagination**: Handle large datasets efficiently
- **Image Optimization**: Compress and optimize medical images

## Security Considerations

### Data Protection
- **Access Control**: Role-based permissions for patient data
- **Data Encryption**: Secure transmission of sensitive information
- **Audit Logging**: Track all access to patient records
- **Compliance**: HIPAA and other healthcare regulations

### Best Practices
- **Input Validation**: Sanitize all user inputs
- **Error Messages**: Avoid exposing sensitive information
- **Session Management**: Secure user authentication
- **Data Backup**: Regular backup of patient information

## Support and Maintenance

### Troubleshooting
1. **Check Console**: Browser developer tools for errors
2. **Verify Data**: Ensure mock data contains expected patient IDs
3. **Network Tab**: Monitor API calls for failures
4. **Clear Cache**: Refresh browser cache if needed

### Development Setup
1. **Install Dependencies**: `npm install`
2. **Start Development**: `npm run dev`
3. **Access Application**: `http://localhost:3000`
4. **Test Patient Profile**: Navigate to `/dashboard/patients/00001`

This documentation provides a comprehensive overview of the Patient Admin Dashboard functionality, implementation details, and usage guidelines for healthcare administrators. 