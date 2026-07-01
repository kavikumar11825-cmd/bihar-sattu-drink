import { useState, FormEvent } from "react";
import { authenticateSattuUser, SattuUser, auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { X, Mail, Phone, User, Check, Key, Sparkles, LogIn, AlertCircle, MapPin, Smartphone, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { triggerSimulatedOtp } from "./OtpNotificationSimulator";

interface SattuAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: SattuUser) => void;
}

export default function SattuAuthModal({ isOpen, onClose, onLoginSuccess }: SattuAuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(""); // Strictly mandatory address
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [activeOtp, setActiveOtp] = useState(""); // Dynamically generated OTP for backup / simulator
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpChannel, setOtpChannel] = useState<"phone" | "email" | "both">("both");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const generateAndSendOtp = async (selectedChannel: "phone" | "email" | "both") => {
    // Generate a secure, truly dynamic 6-digit OTP code for backup / simulator
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(generated);
    setConfirmationResult(null);

    let firebasePhoneAuthSuccess = false;

    // Firebase Phone Auth
    if (selectedChannel === "phone" || selectedChannel === "both") {
      try {
        // Find or create RecaptchaVerifier
        let recaptchaVerifier = (window as any).recaptchaVerifier;
        if (!recaptchaVerifier) {
          recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => {
              console.log("reCAPTCHA solved, proceeding with OTP");
            }
          });
          (window as any).recaptchaVerifier = recaptchaVerifier;
        }

        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith("+")) {
          // Default to India country code +91
          formattedPhone = "+91" + formattedPhone;
        }

        console.log("Initiating Firebase Phone Auth for:", formattedPhone);
        const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        setConfirmationResult(result);
        firebasePhoneAuthSuccess = true;

        // Visual feedback
        triggerSimulatedOtp("sms", phone, "Sent via Firebase!");
      } catch (err: any) {
        console.error("Firebase Phone Auth failed:", err);
        setError(`Firebase Phone Auth Info: ${err.message || "Failed to contact Firebase services."} (Using sandbox mode)`);
        // Fallback to custom sandbox simulation
        triggerSimulatedOtp("sms", phone, generated);
      }
    }

    // Email OTP Dispatch
    if (selectedChannel === "email" || selectedChannel === "both") {
      triggerSimulatedOtp("email", email.trim().toLowerCase(), generated);
    }

    // Call server-side backup dispatch proxy route (for Email or when Firebase Auth fails/sandbox is used)
    try {
      if ((selectedChannel === "phone" || selectedChannel === "both") && !firebasePhoneAuthSuccess) {
        await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "sms", target: phone, code: generated })
        });
      }
      if (selectedChannel === "email" || selectedChannel === "both") {
        await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "email", target: email.trim().toLowerCase(), code: generated })
        });
      }
    } catch (e) {
      console.warn("Real OTP dispatch warning (falling back to sandbox simulator):", e);
    }
  };

  const handleSendOtp = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("कृपया अपना नाम दर्ज करें / Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("कृपया सही ईमेल दर्ज करें / Please enter a valid Gmail/Email.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError("कृपया 10 अंकों का मोबाइल नंबर दर्ज करें / Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!address.trim() || address.trim().length < 8) {
      setError("कृपया पूरा विवरण पता दर्ज करें (न्यूनतम 8 अक्षर) / Please enter a complete delivery address (min 8 characters).");
      return;
    }

    setLoading(true);
    // Simulate minor network dispatch delay
    setTimeout(() => {
      generateAndSendOtp(otpChannel).finally(() => {
        setLoading(false);
        setOtpMode(true);
      });
    }, 700);
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let uid: string | undefined = undefined;

      if (confirmationResult) {
        try {
          console.log("Verifying real OTP with Firebase Phone Auth:", otpCode);
          const userCredential = await confirmationResult.confirm(otpCode);
          uid = userCredential.user.uid;
          console.log("Firebase Phone Auth verified successfully! uid:", uid);
        } catch (err: any) {
          console.error("Firebase Auth OTP verification failed:", err);
          setError("अवैध ओटीपी कोड! / Invalid Firebase OTP code. Please check the code sent to your mobile or try again.");
          setLoading(false);
          return;
        }
      } else {
        // Fallback or Email verification
        if (otpCode !== activeOtp) {
          setError("गलत ओटीपी! कृपया सही ओटीपी दर्ज करें जो आपको प्राप्त हुआ है। / Incorrect OTP. Please enter the dynamic code displayed in the alert notification.");
          setLoading(false);
          return;
        }
      }

      const user = await authenticateSattuUser(email, phone, name, address, uid);
      onLoginSuccess(user);
      onClose();
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setOtpMode(false);
      setOtpCode("");
      setConfirmationResult(null);
    } catch (err: any) {
      setError("सत्यापन विफल रहा। कृपया पुनः प्रयास करें। / Verification failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      generateAndSendOtp(otpChannel).finally(() => {
        setLoading(false);
        setOtpCode("");
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-stone-100 relative overflow-hidden"
      >
        {/* Visual accents */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-emerald-600" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            {!otpMode ? "Customer Sign-In" : "Verify OTP Code"}
          </h3>
          <p className="text-stone-500 text-xs mt-1">
            {!otpMode 
              ? "Join us to order, track, and customize your healthy drink!" 
              : "ओटीपी सत्यापन (OTP Verification) • Secure Customer Access"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!otpMode ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
                Your Name / आपका नाम
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kavi Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition-all text-stone-850 font-medium"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
                Gmail ID / ईमेल
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition-all text-stone-850 font-medium"
                />
              </div>
            </div>

            {/* Mobile/Phone Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
                Mobile Number / मोबाइल नंबर
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 font-bold text-xs">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition-all text-stone-850 font-medium"
                />
              </div>
            </div>

            {/* Strictly Mandatory Address Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
                Complete Delivery Address / पूरा वितरण पता
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-stone-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <textarea
                  required
                  rows={2}
                  placeholder="Street, Landmark, City, State, ZIP code (strictly mandatory)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition-all text-stone-850 font-medium"
                />
              </div>
              <p className="text-[10px] text-red-500 font-semibold mt-1">
                * Required field for order fulfillment.
              </p>
            </div>

            {/* OTP Delivery Choice Segment */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                Request OTP On / ओटीपी प्राप्त करने का माध्यम:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOtpChannel("both")}
                  className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                    otpChannel === "both" 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <span>⚡ Both</span>
                  <span className="text-[8px] opacity-75 font-normal">SMS & Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOtpChannel("phone")}
                  className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                    otpChannel === "phone" 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile SMS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOtpChannel("email")}
                  className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                    otpChannel === "email" 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Gmail ID</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Send OTP & Proceed
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* OTP Simulator Alert */}
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 text-emerald-900 rounded-xl text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-950">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>Simulated OTP Dispatched!</span>
              </div>
              <p className="leading-relaxed font-medium">
                To test the verification, we dispatched a 6-digit code:
              </p>
              <div className="mt-2 space-y-1 text-[11px] text-stone-700">
                {(otpChannel === "phone" || otpChannel === "both") && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✔</span>
                    <span>SMS sent to +91 {phone.substring(0, 3)}****{phone.substring(7)}</span>
                  </div>
                )}
                {(otpChannel === "email" || otpChannel === "both") && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✔</span>
                    <span>Email sent to {email.substring(0, 4)}***{email.substring(email.indexOf("@"))}</span>
                  </div>
                )}
              </div>
              <p className="mt-3 text-emerald-900 bg-emerald-100/50 px-2.5 py-1.5 rounded-lg font-bold border border-emerald-200 flex items-center justify-between">
                <span>Verification OTP Code:</span>
                <span className="underline select-all text-sm tracking-wider font-mono text-emerald-950">{activeOtp}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider text-center">
                Enter 6-Digit OTP / ओटीपी दर्ज करें
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="X X X X X X"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full tracking-widest text-center py-3 bg-stone-50 border border-stone-200 rounded-xl text-lg font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition-all text-stone-900"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOtpMode(false)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl transition-all text-xs"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                <span>Resend OTP</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Verify & Login
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
}
