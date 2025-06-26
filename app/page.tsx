'use client';
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { authAPI } from './services/api';

// Add proper type definitions at the top
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
}

interface WindowWithSpeechRecognition extends Window {
  webkitSpeechRecognition: new () => SpeechRecognition;
}

// Doctor image with gradient frame
const DoctorImage = () => {
  return (
    <div
      className="hidden md:flex items-end w-1/2 overflow-hidden z-10"
      style={{ borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }}
    >
      <div
        className="relative flex items-end justify-center"
        style={{
          background: 'linear-gradient(135deg, #6ec1e4 0%, #3578e5 100%)',
          width: '480px',
          height: '570px',
          borderRadius: '50px',
          overflow: 'visible',
        }}
      >
        <Image
          src="/doctor.png"
          alt="Doctor"
          width={340}
          height={480}
          className="object-contain drop-shadow-xl"
          priority
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: 0,
            width: '100%',
            height: 'auto',
            maxHeight: '680px',
            zIndex: 2,
            borderBottomLeftRadius: '50px',
            borderBottomRightRadius: '50px',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />
      </div>
    </div>
  );
};

// Decorative waves at the top left
const Waves = () => {
  return (
    <div className="absolute top-0 left-0 w-[698.8px] h-[250px]">
      <img src="/waves.png" alt="" width={698.8} height={250} />
    </div>
  );
};

// Starbursts decorations
const Starbursts = () => {
  return (
    <>
      <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '48px', left: '621px', opacity: 1 }} draggable={false} />
      <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '410px', left: '535px', opacity: 1 }} draggable={false} />
      <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '634px', left: '562px', opacity: 0.8 }} draggable={false} />
      <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '658px', left: '1091px', opacity: 0.4 }} draggable={false} />
    </>
  );
};

// Login form
type LoginFormProps = { onForgotPassword: () => void };
const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  // Voice-to-text state
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [roleDisplay, setRoleDisplay] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = () => {
    setError("");
    setTranscript("");
    setIsRecording(true);
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        setTranscript(event.results[0][0].transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setError("Could not recognize speech. Try again.");
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      setError("Speech recognition not supported in this browser.");
      setIsRecording(false);
    }
  };
  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both username and password');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await authAPI.login({ username, password });
      setIsSuccess(true);
      const user = response.user;
      
      // Enhanced role-based redirect logic
      let redirectPath = '/dashboard/doctors'; // Default for patient
      let roleDisplay = 'Patient';
      
      if (user.role === 'doctor') {
        redirectPath = '/doctor/dashboard';
        roleDisplay = 'Doctor';
      } else if (user.role === 'admin') {
        redirectPath = '/dashboard';
        roleDisplay = 'Administrator';
      } else if (user.role === 'patient') {
        redirectPath = '/patient/dashboard';
        roleDisplay = 'Patient';
      }
      
      setRoleDisplay(roleDisplay);
      
      // Show role-specific success message
      setTimeout(() => {
        router.push(redirectPath);
      }, 2000);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 leading-tight text-center">
        Join us to protect your health<br />and wellness journey
      </h2>
      <form className="space-y-4 w-full max-w-md" onSubmit={handleSubmit}>
        <div>
          <label className="block text-base font-semibold mb-1 text-black">Username</label>
          <input
            type="text"
            placeholder="Enter your Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-[#f8fbff] placeholder-[#1E1E1E] text-[#1E1E1E] shadow"
            disabled={isLoading || isSuccess}
          />
        </div>
        <div>
          <label className="block text-base font-semibold mb-1 text-black">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-[#f8fbff] placeholder-[#1E1E1E] text-[#1E1E1E] shadow pr-10"
              disabled={isLoading || isSuccess}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Eye-off icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .523-.134 1.016-.366 1.44m-1.157 1.157A3 3 0 019 12c0-.523.134-1.016.366-1.44" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.418-4.03-8-9-8S3 7.582 3 12c0 1.657.672 3.156 1.757 4.243M9.88 9.88l4.24 4.24" />
                </svg>
              ) : (
                // Eye icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center text-sm text-gray-700">
            <input type="checkbox" className="mr-2 accent-blue-500 w-4 h-4" /> Remember me
          </label>
            <button
              type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Forget Password?
            </button>
          </div>
        {isSuccess && (
          <div className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Login successful! Welcome, {roleDisplay || 'User'}! Redirecting...
          </div>
        )}
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}
        {/* Test Credentials (Development Only) */}
        <details className="text-xs text-gray-500 border border-gray-200 rounded-lg p-2 bg-gray-50">
          <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600">
            🧪 Test Credentials (Click to expand)
          </summary>
          <div className="mt-2 space-y-1 text-xs">
            <div><strong>Admin:</strong> admin@carebot.com / admin123</div>
            <div><strong>Doctor:</strong> doctor@carebot.com / doctor123</div>
            <div><strong>Patient:</strong> patient / patient123</div>
            <div><strong>Dr. Sarah:</strong> dr.sarah / sarah123</div>
            <div><strong>Dr. Michael:</strong> dr.michael / michael123</div>
            <div><strong>Alice:</strong> alice / alice123</div>
          </div>
        </details>
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full bg-[#1886ff] text-white py-2 rounded-md font-bold shadow transition text-base mt-2 min-h-[36px]"
          aria-label="Create Account"
        >
          {isLoading ? 'Creating account...' : isSuccess ? 'Success!' : 'Submit'}
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border-2 border-blue-400 py-2 rounded-md font-bold text-blue-700 bg-white hover:bg-blue-50 transition text-base shadow min-h-[36px]"
          disabled={isLoading || isSuccess}
          aria-label="Sign up with Google"
        >
          {/* Official Google G SVG */}
          <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.04 1.53 7.43 2.81l5.52-5.52C33.64 3.13 29.2 1 24 1 14.82 1 6.91 6.98 3.32 15.09l6.44 5.01C11.6 14.13 17.32 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.41c-.54 2.91-2.18 5.38-4.66 7.04l7.19 5.59C43.99 37.13 46.1 31.36 46.1 24.55z"/>
              <path fill="#FBBC05" d="M9.76 28.09A14.5 14.5 0 019.5 24c0-1.41.23-2.78.63-4.09l-6.44-5.01A23.01 23.01 0 001 24c0 3.7.9 7.19 2.49 10.27l6.44-5.01z"/>
              <path fill="#EA4335" d="M24 46.5c6.2 0 11.39-2.05 15.19-5.59l-7.19-5.59c-2.01 1.35-4.59 2.16-8 2.16-6.68 0-12.4-4.63-14.24-10.81l-6.44 5.01C6.91 41.02 14.82 46.5 24 46.5z"/>
              <path fill="none" d="M1 1h46v46H1z"/>
            </g>
          </svg>
          Sign up with Google
        </button>
      </form>
    </div>
  );
};

// OTP Verification Page
const OtpVerification = ({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus next input on change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    setError("");
    // Move to next input
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (paste.length === 6) {
      setOtp(paste.split(""));
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(d => d === "")) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    setResent(true);
    setTimeout(() => setResent(false), 2000);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-0 sm:p-4 relative overflow-hidden">
      <div
        className="relative flex flex-col md:flex-row bg-white shadow-2xl z-10 overflow-hidden"
        style={{ width: '1160px', height: '709px', borderRadius: '50px' }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-[698.8px] h-[250px]">
          <img src="/waves.png" alt="" width={698.8} height={250} />
        </div>
        {/* Starbursts */}
        <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '48px', left: '621px', opacity: 1 }} draggable={false} />
        <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '410px', left: '535px', opacity: 1 }} draggable={false} />
        <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '634px', left: '562px', opacity: 0.8 }} draggable={false} />
        <img src="/starburst.png" alt="" style={{ width: '27px', height: '29px', position: 'absolute', top: '658px', left: '1091px', opacity: 0.4 }} draggable={false} />
        {/* Left: Doctor Image with gradient frame */}
        <div
          className="flex flex-col justify-end w-[48%] h-full relative z-10"
        >
          <div
            className="relative flex items-end justify-center"
            style={{
              width: '520px',
              height: '520px',
              background: 'linear-gradient(135deg, #6ec1e4 0%, #3578e5 100%)',
              borderBottomLeftRadius: '40px',
              borderBottomRightRadius: '40px',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              overflow: 'visible',
            }}
          >
            <img
              src="/doctor3.png"
              alt="Doctor"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 0,
                width: '100%',
                height: 'auto',
                maxHeight: '1020px',
                zIndex: 2,
                borderBottomLeftRadius: '40px',
                borderBottomRightRadius: '40px',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
        {/* Right: OTP Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 py-4 h-full relative">
          {/* Starbursts for right side */}
          <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '32px', right: '32px', zIndex: 1, opacity: 1 }} draggable={false} aria-hidden="true" />
          <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '45%', right: '16px', zIndex: 1, opacity: 0.8 }} draggable={false} aria-hidden="true" />
          <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', bottom: '32px', right: '48px', zIndex: 1, opacity: 0.7 }} draggable={false} aria-hidden="true" />
          <div className="w-full max-w-md flex flex-col justify-center items-center h-full">
          <h1 className="text-4xl font-extrabold text-black mb-2 leading-tight text-center">Enter Your OTP</h1>
          <p className="mb-2 text-lg text-black leading-snug text-center">
            Enter the one-time password we have sent to your email address.
          </p>
          <p className="mb-6 text-gray-500 text-base text-center">we have send the code to xxxx@gmail.com</p>
          <form className="flex flex-col items-center" onSubmit={handleSubmit} autoComplete="off">
            <div className="flex gap-4 mb-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e, idx)}
                  onPaste={handlePaste}
                  className="w-16 h-16 text-3xl text-center border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white text-black"
                  style={{ boxShadow: '0 2px 8px #3578e511' }}
                />
              ))}
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className="text-gray-500">Didn&apos;t receive OTP code?</span>
              <button type="button" className="text-[#1886ff] font-semibold hover:underline" onClick={handleResend} disabled={resent}>{resent ? 'Sent!' : 'Resend code'}</button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1886ff] text-white py-3 rounded-lg font-bold shadow hover:bg-[#0f6cd6] transition text-base mb-3"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button
              type="button"
              className="w-full border border-blue-400 py-3 rounded-lg font-bold text-blue-700 bg-white hover:bg-blue-50 transition text-base"
              onClick={onBack}
            >
              Back
            </button>
          </form>
          </div>
        </div>
        {/* Curly lines bottom right */}
        <img src="/curly.png" alt="" className="absolute right-0 bottom-0 w-[180px] h-[140px] pointer-events-none select-none" style={{zIndex: 1}} aria-hidden="true" />
      </div>
    </div>
  );
};

// Forgot Password Modal
type ForgotPasswordModalProps = { onClose: () => void, onOtp: () => void };
const ForgotPasswordModal = ({ onClose, onOtp }: ForgotPasswordModalProps) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!username) {
      setError('Please enter your username');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onOtp(); // Show OTP page
    } catch {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#eaf4ff] bg-opacity-80">
      <section
        className="relative flex flex-row bg-white shadow-2xl shadow-[0_8px_40px_0_#3578e533,0_1.5px_8px_0_#3578e511] overflow-hidden"
        style={{ width: '950px', height: '540px', borderRadius: '50px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl text-blue-400 hover:text-blue-600 focus:outline-none z-20"
          aria-label="Close"
          style={{lineHeight: 1}}
        >
          ×
        </button>
        {/* Waves background - anchored top left, not stretched */}
        <div className="absolute top-0 left-0 w-[500px] h-[180px] z-0" aria-hidden="true">
          <img src="/waves.png" alt="" width={500} height={180} className="object-contain" />
        </div>
        {/* Starbursts */}
        <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '38px', left: '60%', opacity: 1, zIndex: 2 }} draggable={false} aria-hidden="true" />
        <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '410px', left: '55%', opacity: 1, zIndex: 2 }} draggable={false} aria-hidden="true" />
        <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '440px', left: '90%', opacity: 0.7, zIndex: 2 }} draggable={false} aria-hidden="true" />
        {/* Left: Doctor image with gradient frame (modal-specific, head overlaps) */}
        <div className="flex flex-col justify-end w-[48%] h-full relative z-10">
          <div
            className="relative flex items-end justify-center"
            style={{
              width: '370px',
              height: '470px',
              background: 'linear-gradient(135deg, #6ec1e4 0%, #3578e5 100%)',
              borderBottomLeftRadius: '40px',
              borderBottomRightRadius: '40px',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              overflow: 'visible',
            }}
          >
            <img
              src="/doctor2.png"
              alt="Doctor"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 0,
                width: '100%',
                height: 'auto',
                maxHeight: '520px',
                zIndex: 2,
                borderBottomLeftRadius: '40px',
                borderBottomRightRadius: '40px',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              className="object-contain"
            />
          </div>
        </div>
        {/* Right: Form */}
        <div className="flex items-center justify-center w-[52%] h-full px-12 z-10">
          <div className="w-full max-w-md">
            <h1 id="forgot-password-title" className="text-4xl font-extrabold text-black mb-2 leading-tight text-center whitespace-nowrap">
              Forget Your Password?
            </h1>
            <p className="mb-8 text-lg text-black text-center">
              Enter the email id associated with your account.
            </p>
            <form onSubmit={handleSubmit} className="w-full space-y-6" autoComplete="off" noValidate>
              <div>
                <label htmlFor="username" className="block text-base font-bold mb-1 text-black">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your Username"
                  className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-white placeholder-[#1E1E1E] text-[#1E1E1E]"
                  required
                  aria-required="true"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'username-error' : undefined}
                  autoComplete="username"
                />
                {error && (
                  <p id="username-error" className="mt-1 text-sm text-red-500" role="alert">
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1886ff] text-white py-3 rounded-lg font-bold shadow hover:bg-[#0f6cd6] transition text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'submit'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full border border-blue-400 py-3 rounded-lg font-bold text-blue-700 bg-white hover:bg-blue-50 transition text-base"
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
        {/* Curly lines bottom right */}
        <img src="/curly.png" alt="" className="absolute right-0 bottom-0 w-[180px] h-[140px] pointer-events-none select-none" style={{zIndex: 1}} aria-hidden="true" />
      </section>
    </div>
  );
};

// Reusable status modal
const StatusModal = ({ message, icon, onClose }: { message: React.ReactNode, icon: React.ReactNode, onClose: () => void }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center">
    <div
      className="relative flex flex-col items-center justify-center bg-white shadow-2xl"
      style={{ width: 420, height: 260, borderRadius: 32, boxShadow: '0 0 24px 4px #1886ff33' }}
    >
      {/* Subtle background pattern */}
      <img src="/waves.png" alt="" className="absolute left-0 top-0 w-2/3 h-2/3 opacity-20 pointer-events-none select-none" style={{borderTopLeftRadius: 32}} />
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-2xl text-blue-400 hover:text-blue-600 focus:outline-none"
        aria-label="Close"
        style={{lineHeight: 1}}
      >
        ×
      </button>
      {/* Icon */}
      <div className="mt-10 mb-4">{icon}</div>
      <div className="text-center text-[1.35rem] font-bold text-[#1886ff] leading-tight">{message}</div>
    </div>
  </div>
);

const NewPasswordPage = ({ onBack }: { onBack: () => void }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Simulate success
    setSuccess(true);
    setTimeout(() => {
      onBack(); // Show login form after password reset
    }, 1000); // 1 second delay
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-0 sm:p-4 relative overflow-hidden" style={{ background: 'rgba(222, 237, 255, 1)' }}>
      {/* YouTube video background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/1bX_OHSJMwk?autoplay=1&mute=1&loop=1&playlist=1bX_OHSJMwk&controls=0&showinfo=0&modestbranding=1&rel=0"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full object-cover"
          style={{ pointerEvents: 'none', filter: 'brightness(0.7)' }}
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white bg-opacity-40 z-10" />
      </div>
      <div
        className="relative flex flex-col md:flex-row bg-white shadow-2xl z-10 overflow-hidden"
        style={{ width: '1160px', height: '709px', borderRadius: '50px' }}
      >
        {/* Decorative elements */}
        <Waves />
        <Starbursts />
        {/* Left: Doctor Image with gradient frame */}
        <DoctorImage />
        {/* Right: New Password Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 py-4 h-full relative">
          {/* Starbursts for right side */}
          <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '32px', right: '32px', zIndex: 1, opacity: 1 }} draggable={false} aria-hidden="true" />
          <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', top: '45%', right: '16px', zIndex: 1, opacity: 0.8 }} draggable={false} aria-hidden="true" />
          <img src="/starburst.png" alt="" className="absolute" style={{ width: '27px', height: '29px', bottom: '32px', right: '48px', zIndex: 1, opacity: 0.7 }} draggable={false} aria-hidden="true" />
          <div className="w-full max-w-md flex flex-col justify-center items-center h-full">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-8 leading-tight text-center">
              Set a New Password
            </h2>
            <form className="space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
            <div>
                <label className="block text-xl font-bold mb-2 text-black">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                    className="w-full px-6 py-4 border-2 border-blue-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-xl bg-[#f8fbff] placeholder-[#1E1E1E] text-[#1E1E1E] shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .523-.134 1.016-.366 1.44m-1.157 1.157A3 3 0 019 12c0-.523.134-1.016.366-1.44" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.418-4.03-8-9-8S3 7.582 3 12c0 1.657.672 3.156 1.757 4.243M9.88 9.88l4.24 4.24" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
                <label className="block text-xl font-bold mb-2 text-black">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md text-sm ${
                    showPasswordWarning ? 'border-red-400 focus:ring-red-500' : passwordsMatch ? 'border-green-400 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                    required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    // Eye-off icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .523-.134 1.016-.366 1.44m-1.157 1.157A3 3 0 019 12c0-.523.134-1.016.366-1.44" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.418-4.03-8-9-8S3 7.582 3 12c0 1.657.672 3.156 1.757 4.243M9.88 9.88l4.24 4.24" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {passwordsMatch && confirmPassword && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-green-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
              {success && (
                <div className="text-green-600 text-lg text-center bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Password reset successful!
                </div>
              )}
              {error && (
                <div className="text-red-500 text-lg text-center bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}
            <button
              type="submit"
                className="w-full bg-[#1886ff] text-white py-4 rounded-2xl font-bold shadow transition text-xl mt-2 hover:bg-[#0f6cd6]"
            >
                {success ? 'Success!' : 'Reset Password'}
            </button>
            <button
              type="button"
                className="w-full flex items-center justify-center gap-2 border-2 border-blue-400 py-4 rounded-2xl font-bold text-blue-700 bg-white hover:bg-blue-50 transition text-base"
              onClick={onBack}
            >
              Back
            </button>
          </form>
        </div>
        </div>
      </div>
      <Head>
        <meta name="description" content="Your page description here." />
      </Head>
    </div>
  );
};

// Restore RegisterForm above Home
const RegisterForm = ({ onBack }: { onBack: () => void }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("patient");

  const passwordValid = password.length >= 6;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const showPasswordWarning = password && confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !password || !confirmPassword || !email) {
      setError('Please fill in all required fields');
      return;
    }
    if (!agree) {
      setError('You must agree to the Terms and Conditions');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      setIsSuccess(true);
      setTimeout(() => {
        onBack(); // Show login form after registration
      }, 1000); // 1 second delay
    } catch (err: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col justify-center items-center h-full px-4 py-6">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Create Account
          </h2>
          <p className="text-gray-600 text-xs">
            Join us to start your healthcare journey
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md text-sm"
                required
              />
            </div>
          </div>

          {/* Email and Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Role *
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 shadow-sm hover:shadow-md text-sm"
                required
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md text-sm ${
                    passwordValid ? 'border-green-400 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .523-.134 1.016-.366 1.44m-1.157 1.157A3 3 0 019 12c0-.523.134-1.016.366-1.44" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.418-4.03-8-9-8S3 7.582 3 12c0 1.657.672 3.156 1.757 4.243M9.88 9.88l4.24 4.24" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md text-sm ${
                    showPasswordWarning ? 'border-red-400 focus:ring-red-500' : passwordsMatch ? 'border-green-400 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    // Eye-off icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .523-.134 1.016-.366 1.44m-1.157 1.157A3 3 0 019 12c0-.523.134-1.016.366-1.44" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.418-4.03-8-9-8S3 7.582 3 12c0 1.657.672 3.156 1.757 4.243M9.88 9.88l4.24 4.24" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {passwordsMatch && confirmPassword && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-green-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {showPasswordWarning && (
                <p className="text-xs text-red-500">Passwords don't match</p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              id="agree-checkbox"
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className="accent-blue-600 w-5 h-5 rounded border-2 border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
              required
            />
            <label
              htmlFor="agree-checkbox"
              className="text-xs text-gray-700 cursor-pointer leading-relaxed select-none"
            >
              I agree to the{' '}
              <a href="#" className="text-blue-600 font-medium underline hover:text-blue-800 transition-colors">Terms and Conditions</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 font-medium underline hover:text-blue-800 transition-colors">Privacy Policy</a>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-xs flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Registration successful! Redirecting to login...</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : isSuccess ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Success!</span>
                </div>
              ) : (
                'Create Account'
              )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
            disabled={isLoading || isSuccess}
          >
            {/* Official Google G SVG */}
            <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.04 1.53 7.43 2.81l5.52-5.52C33.64 3.13 29.2 1 24 1 14.82 1 6.91 6.98 3.32 15.09l6.44 5.01C11.6 14.13 17.32 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.41c-.54 2.91-2.18 5.38-4.66 7.04l7.19 5.59C43.99 37.13 46.1 31.36 46.1 24.55z"/>
                <path fill="#FBBC05" d="M9.76 28.09A14.5 14.5 0 019.5 24c0-1.41.23-2.78.63-4.09l-6.44-5.01A23.01 23.01 0 001 24c0 3.7.9 7.19 2.49 10.27l6.44-5.01z"/>
                <path fill="#EA4335" d="M24 46.5c6.2 0 11.39-2.05 15.19-5.59l-7.19-5.59c-2.01 1.35-4.59 2.16-8 2.16-6.68 0-12.4-4.63-14.24-10.81l-6.44 5.01C6.91 41.02 14.82 46.5 24 46.5z"/>
                <path fill="none" d="M1 1h46v46H1z"/>
              </g>
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Back to Login */}
          <button
            type="button"
            className="w-full text-center py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
            onClick={onBack}
            disabled={isLoading || isSuccess}
          >
            Already have an account?{' '}
            <span className="font-semibold text-blue-600 hover:text-blue-800">Sign in</span>
          </button>
        </form>
      </div>
    </div>
  );
};

const Home = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-0 sm:p-4 relative overflow-hidden" style={{ background: 'rgba(222, 237, 255, 1)' }}>
      {/* YouTube video background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/1bX_OHSJMwk?autoplay=1&mute=1&loop=1&playlist=1bX_OHSJMwk&controls=0&showinfo=0&modestbranding=1&rel=0"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full object-cover"
          style={{ pointerEvents: 'none', filter: 'brightness(0.7)' }}
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white bg-opacity-40 z-10" />
      </div>
      {/* Card container or modal/otp/new password */}
      {!showForgotPassword && !showOtp && !showNewPassword && (
        <div
          className="relative flex flex-col md:flex-row bg-white shadow-2xl z-10 overflow-hidden"
          style={{ width: '1160px', height: '709px', borderRadius: '50px' }}
        >
          {/* Decorative elements */}
          <Waves />
          <Starbursts />
          {/* Left: Doctor Image with gradient frame */}
          <DoctorImage />
          {/* Toggle at the top center of the card */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white rounded-full shadow-lg p-0.5 flex border border-gray-200 gap-0.5">
              <button
                onClick={() => setShowRegister(false)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  !showRegister
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  showRegister
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                Register
              </button>
            </div>
          </div>
          {/* Right: Login or Register Form */}
          <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 py-4 h-full">
            {showRegister ? (
              <RegisterForm onBack={() => setShowRegister(false)} />
            ) : (
          <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
            )}
          </div>
        </div>
      )}
      {showForgotPassword && !showOtp && !showNewPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} onOtp={() => { setShowForgotPassword(false); setShowOtp(true); }} />
      )}
      {showOtp && !showNewPassword && (
        <OtpVerification onBack={() => { setShowOtp(false); setShowForgotPassword(true); }} onSuccess={() => { setShowOtp(false); setShowNewPassword(true); }} />
      )}
      {showNewPassword && (
        <NewPasswordPage onBack={() => { setShowNewPassword(false); setShowOtp(true); }} />
      )}
      <Head>
        <meta name="description" content="Your page description here." />
      </Head>
    </div>
  );
};

export default Home;