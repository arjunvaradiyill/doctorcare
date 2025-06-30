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
                // Eye icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                // Eye-off icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
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
          {isLoading ? 'Signing in...' : isSuccess ? 'Success!' : 'Submit'}
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-blue-400 py-3 rounded-lg font-semibold text-blue-700 bg-white hover:bg-blue-50 transition text-base shadow"
          disabled={isLoading || isSuccess}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const showPasswordWarning = password && confirmPassword && password !== confirmPassword;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsLoading(true);
    setError('');
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setIsSuccess(true);
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
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
                    className={`w-full px-6 py-4 border-2 border-blue-400 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md text-sm ${
                      showPasswordWarning ? 'border-red-400 focus:ring-red-500' : passwordsMatch ? 'border-green-400 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {isSuccess && (
                <div className="text-green-600 text-lg text-center bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Password reset successful!
                </div>
              )}
              {error && !showPasswordWarning && !passwordsMatch && (
                <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}
              {passwordsMatch && (
                <div className="text-green-600 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Passwords match.
                </div>
              )}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full bg-[#1886ff] text-white py-4 rounded-2xl font-bold shadow transition text-xl mt-2 hover:bg-[#0f6cd6]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Resetting Password...</span>
                    </div>
                  ) : isSuccess ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Success!</span>
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
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
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                {passwordValid && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-green-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
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
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
          <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div 
              className="flex-shrink-0 w-4 h-4 cursor-pointer border-2 border-blue-500 rounded flex items-center justify-center transition-all duration-200 hover:bg-blue-50"
              onClick={() => setAgree(!agree)}
            >
              {agree && (
                <svg className="w-2.5 h-2.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <label 
              className="text-xs text-gray-700 cursor-pointer leading-relaxed flex-1"
              onClick={() => setAgree(!agree)}
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
            disabled={isLoading || isSuccess}
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
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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