'use client';
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { authAPI } from '../services/api';

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
      let redirectPath = '/patient/dashboard'; // Default for patient
      if (user.role === 'doctor') {
        redirectPath = '/doctor/dashboard';
      } else if (user.role === 'admin') {
        redirectPath = '/dashboard';
      }
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
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-[#f8fbff] placeholder-[#1E1E1E] text-[#1E1E1E] shadow"
            disabled={isLoading || isSuccess}
          />
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
            Login successful! Redirecting...
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className={`w-full bg-[#1886ff] text-white py-3 rounded-lg font-semibold shadow transition text-base mt-1 ${
            isLoading || isSuccess
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[#0f6cd6]'
          }`}
        >
          {isLoading ? 'Signing in...' : isSuccess ? 'Success!' : 'submit'}
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-blue-400 py-3 rounded-lg font-semibold text-blue-700 bg-white hover:bg-blue-50 transition text-base shadow"
          disabled={isLoading || isSuccess}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6768H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
              <path d="M24.48 48.0016C30.9527 48.0016 36.4116 45.8764 40.3889 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
              <path d="M11.0051 28.6006C10.9999 28.3626 10.9999 28.1146 10.9999 27.8666C10.9999 27.6186 10.9999 27.3706 11.0051 27.1326V20.3501H3.03298C2.37068 21.6631 2.00002 23.1154 2.00002 24.6666C2.00002 26.2178 2.37068 27.6701 3.03298 28.9831L11.0051 28.6006Z" fill="#FBBC04"/>
              <path d="M24.48 10.8833C27.9019 10.8833 30.7923 12.0863 32.7994 14.2665L40.2697 6.80767C36.1361 2.90521 30.5527 0.00146484 24.48 0.00146484C15.4056 0.00146484 7.10718 5.1162 3.03296 13.2206L11.005 19.4026C12.901 13.7233 18.2187 9.49926 24.48 9.49926V10.8833Z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          Sign in with Google
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
      router.push("/"); // Redirect to login form after password reset
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
                    tabIndex={-1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500 hover:text-blue-500 focus:outline-none"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 15.885 7.244 19.5 12 19.5c1.658 0 3.237-.314 4.646-.885M21.065 11.977A10.45 10.45 0 0021.998 12c-1.292 3.885-5.31 7.5-10.066 7.5a10.45 10.45 0 01-4.646-.885M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                    className="w-full px-6 py-4 border-2 border-blue-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-xl bg-[#f8fbff] placeholder-[#1E1E1E] text-[#1E1E1E] shadow-lg"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500 hover:text-blue-500 focus:outline-none"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 15.885 7.244 19.5 12 19.5c1.658 0 3.237-.314 4.646-.885M21.065 11.977A10.45 10.45 0 0021.998 12c-1.292 3.885-5.31 7.5-10.066 7.5a10.45 10.45 0 01-4.646-.885M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
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
        router.push('/'); // Always redirect to login form after registration
      }, 1000); // 1 second delay
    } catch (err: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col justify-center items-center h-full px-4 sm:px-8 md:px-10 py-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#3498db] mb-4 leading-tight text-left w-full uppercase tracking-wide" id="register-heading">
        REGISTER FORM
      </h2>
      <form className="space-y-4 w-full" onSubmit={handleSubmit} style={{minWidth: 0}} aria-labelledby="register-heading" role="form">
        {/* First row: First Name and Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="register-firstname">First Name</label>
            <input
              id="register-firstname"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm bg-white placeholder-gray-500 text-gray-900 shadow"
              aria-required="true"
              aria-label="First Name"
              autoComplete="given-name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="register-lastname">Last Name</label>
            <input
              id="register-lastname"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm bg-white placeholder-gray-500 text-gray-900 shadow"
              aria-required="true"
              aria-label="Last Name"
              autoComplete="family-name"
            />
          </div>
        </div>
        {/* Second row: Email and Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="register-email">Your Email</label>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm bg-white placeholder-gray-500 text-gray-900 shadow"
              aria-required="true"
              aria-label="Email"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="register-role">Role</label>
            <select
              id="register-role"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm bg-white text-gray-900 shadow"
              aria-required="true"
              aria-label="Role"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        {/* Password and Confirm Password row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="register-password">Password</label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition text-sm bg-white placeholder-gray-500 text-gray-900 shadow ${passwordValid ? 'border-green-400 focus:ring-green-400' : 'border-gray-300 focus:ring-blue-400'}`}
                aria-required="true"
                aria-label="Password"
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-base text-gray-500 hover:text-blue-500 focus:outline-none"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 15.885 7.244 19.5 12 19.5c1.658 0 3.237-.314 4.646-.885M21.065 11.977A10.45 10.45 0 0021.998 12c-1.292 3.885-5.31 7.5-10.066 7.5a10.45 10.45 0 01-4.646-.885M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              {passwordValid && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-green-500">
                  <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 10.5l3.5 3.5 6-6"/></svg>
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="register-confirm-password">Confirm Password</label>
            <div className="relative">
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition text-sm bg-white placeholder-gray-500 text-gray-900 shadow ${showPasswordWarning ? 'border-yellow-400 focus:ring-yellow-400' : 'border-gray-300 focus:ring-blue-400'}`}
                aria-required="true"
                aria-label="Confirm Password"
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-base text-gray-500 hover:text-blue-500 focus:outline-none"
                onClick={() => setShowConfirmPassword(v => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 15.885 7.244 19.5 12 19.5c1.658 0 3.237-.314 4.646-.885M21.065 11.977A10.45 10.45 0 0021.998 12c-1.292 3.885-5.31 7.5-10.066 7.5a10.45 10.45 0 01-4.646-.885M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              {showPasswordWarning && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-500">
                  <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 3v7m0 4h.01M10 17a7 7 0 100-14 7 7 0 000 14z"/></svg>
                </span>
              )}
            </div>
            {showPasswordWarning && (
              <div className="text-yellow-500 text-xs font-medium mt-1">Wrong Password</div>
            )}
          </div>
        </div>
        {/* Terms and Conditions */}
        <div className="flex items-center mt-1">
          <input
            id="register-terms"
            type="checkbox"
            checked={agree}
            onChange={e => setAgree(e.target.checked)}
            className="mr-2 accent-blue-500 w-3 h-3"
            aria-required="true"
          />
          <label htmlFor="register-terms" className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 font-semibold underline hover:text-blue-800">Terms and Conditions</a>
          </label>
        </div>
        {error && <div className="text-red-600 text-xs font-medium mt-1">{error}</div>}
        {isSuccess && (
          <div className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Registration successful! Redirecting to login form...
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full bg-[#1886ff] text-white py-2 rounded-md font-bold shadow transition text-base mt-2 min-h-[36px]"
          aria-label="Create Account"
        >
          {isLoading ? 'Creating account...' : isSuccess ? 'Success!' : 'Create Account'}
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border-2 border-blue-400 py-2 rounded-md font-bold text-blue-700 bg-white hover:bg-blue-50 transition text-base shadow min-h-[36px]"
          disabled={isLoading || isSuccess}
          aria-label="Sign up with Google"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6768H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
              <path d="M24.48 48.0016C30.9527 48.0016 36.4116 45.8764 40.3889 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
              <path d="M11.0051 28.6006C10.9999 28.3626 10.9999 28.1146 10.9999 27.8666C10.9999 27.6186 10.9999 27.3706 11.0051 27.1326V20.3501H3.03298C2.37068 21.6631 2.00002 23.1154 2.00002 24.6666C2.00002 26.2178 2.37068 27.6701 3.03298 28.9831L11.0051 28.6006Z" fill="#FBBC04"/>
              <path d="M24.48 10.8833C27.9019 10.8833 30.7923 12.0863 32.7994 14.2665L40.2697 6.80767C36.1361 2.90521 30.5527 0.00146484 24.48 0.00146484C15.4056 0.00146484 7.10718 5.1162 3.03296 13.2206L11.005 19.4026C12.901 13.7233 18.2187 9.49926 24.48 9.49926V10.8833Z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          Sign up with Google
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border-2 border-blue-400 py-2 rounded-md font-bold text-blue-700 bg-white hover:bg-blue-50 transition text-base shadow min-h-[36px]"
          disabled={isLoading || isSuccess}
          onClick={onBack}
          aria-label="Back to Login"
        >
          Back to Login
        </button>
      </form>
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