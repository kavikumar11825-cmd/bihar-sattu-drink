import { useState, useEffect } from "react";
import { MessageSquare, Mail, Bell, Sparkles, X, Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface OtpToast {
  id: string;
  type: "sms" | "email";
  target: string;
  code: string;
  timestamp: string;
}

// Global window registration helper
export function triggerSimulatedOtp(type: "sms" | "email", target: string, code: string) {
  const event = new CustomEvent("sattu_otp_triggered", {
    detail: { type, target, code }
  });
  window.dispatchEvent(event);
}

export default function OtpNotificationSimulator() {
  const [toasts, setToasts] = useState<OtpToast[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleOtpTrigger = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;

      const newToast: OtpToast = {
        id: `otp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: detail.type,
        target: detail.target,
        code: detail.code,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      // Add toast to list
      setToasts((prev) => [newToast, ...prev]);

      // Play simulated ding/vibration effect (using short soft audio tone if supported)
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Beep 1
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch (err) {
        // Audio Context might be blocked before user interaction, ignore gracefully
      }
    };

    window.addEventListener("sattu_otp_triggered", handleOtpTrigger);
    return () => window.removeEventListener("sattu_otp_triggered", handleOtpTrigger);
  }, []);

  const handleCopyCode = (toast: OtpToast) => {
    navigator.clipboard.writeText(toast.code);
    setCopiedId(toast.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-[999] max-w-sm w-full pointer-events-none flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 50, transition: { duration: 0.15 } }}
            className="pointer-events-auto w-full bg-stone-900 text-white rounded-2xl shadow-2xl border border-stone-800 p-4 relative overflow-hidden"
          >
            {/* Ambient indicator */}
            <div className={`absolute top-0 left-0 w-1 h-full ${toast.type === "sms" ? "bg-emerald-500" : "bg-red-500"}`} />

            {/* Header metadata */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-stone-800/80">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                {toast.type === "sms" ? (
                  <>
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>💬 Text Message • SMS</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-red-400" />
                    <span>📧 Gmail Inbox • Received</span>
                  </>
                )}
                <span className="text-stone-600 font-mono">• {toast.timestamp}</span>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-stone-500 hover:text-stone-300 transition-colors p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sender and Code */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-300 font-bold block">
                {toast.type === "sms" ? "From: +91SATTU (Bihar Sattu Drink)" : "From: Bihar Sattu Drink Hub <auth@biharsattudrink.com>"}
              </span>
              <p className="text-xs text-stone-400 leading-normal font-medium">
                {toast.type === "sms" ? (
                  <>
                    Your Bihar Sattu Drink OTP is <span className="font-mono font-black text-amber-400 text-sm select-all bg-stone-850 px-1.5 py-0.5 rounded border border-stone-800">{toast.code}</span>. Do not share this code. सत्तू पियो, स्वस्थ जियो!
                  </>
                ) : (
                  <>
                    Subject: <span className="text-stone-300 font-bold">Sattu Auth OTP Code</span>
                    <br />
                    Dear Sattu user, your secure verification code is <span className="font-mono font-black text-amber-400 text-sm select-all bg-stone-850 px-1.5 py-0.5 rounded border border-stone-800">{toast.code}</span>. This code expires in 5 minutes.
                  </>
                )}
              </p>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-stone-800/50">
              <span className="text-[9px] text-amber-500 font-bold tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                SIMULATOR CHANNEL ACTIVE
              </span>
              <button
                onClick={() => handleCopyCode(toast)}
                className="text-[10px] font-bold bg-stone-800 hover:bg-stone-750 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
              >
                {copiedId === toast.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
