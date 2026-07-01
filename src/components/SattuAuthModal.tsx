import { useState, FormEvent } from "react";
import { authenticateSattuUser, SattuUser } from "../firebase";
import { X, Mail, Phone, User, Check, Key, Sparkles, LogIn, AlertCircle, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  const [generatedOtp] = useState("458129"); // Static secure mock OTP for simple interactive validation
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
    // Simulate short network delay
    setTimeout(() => {
      setLoading(false);
      setOtpMode(true);
    }, 800);
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpCode !== generatedOtp) {
      setError("गलत ओटीपी! कृपया '458129' दर्ज करें। / Incorrect OTP. Please enter '458129' for simulation.");
      return;
    }

    setLoading(true);
    try {
      const user = await authenticateSattuUser(email, phone, name, address);
      onLoginSuccess(user);
      onClose();
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setOtpMode(false);
      setOtpCode("");
    } catch (err: any) {
      setError("सत्यापन विफल रहा। कृपया पुनः प्रयास करें। / Verification failed. Please retry.");
    } finally {
      setLoading(false);
    }
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
            {!otpMode ? "Sattu Drink - Sign In" : "Verify Mobile Number"}
          </h3>
          <p className="text-stone-500 text-xs mt-1">
            {!otpMode 
              ? "Join us to order, track, and customized your healthy drink!" 
              : "ओटीपी सत्यापन (OTP Verification) / Desi Security Check"}
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
                  Proceed with Verification
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* OTP Simulator Alert */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Simulated Secure OTP Send!</span>
              </div>
              <p className="leading-relaxed font-medium">
                To simulate real SMS authentication inside the AI Studio preview sandbox, we have sent a 6-digit code to <span className="font-semibold text-stone-950">+91 {phone}</span>.
              </p>
              <p className="mt-2 text-emerald-800 font-bold">
                Please enter code: <span className="underline select-all text-sm tracking-wider font-mono">{generatedOtp}</span>
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOtpMode(false)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl transition-all text-xs"
              >
                Go Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
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
      </motion.div>
    </div>
  );
}
