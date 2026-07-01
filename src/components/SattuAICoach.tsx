import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Sparkles, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTIONS = [
  { text: "सत्तू पीने के क्या फायदे हैं?", label: "Health Benefits" },
  { text: "Can diabetics drink sweet sattu?", label: "Diabetes Friendly?" },
  { text: "How to make classic Namkeen Sattu?", label: "Classic Recipe" },
  { text: "क्या सत्तू वजन कम करने में मदद करता है?", label: "Weight Loss" },
];

export default function SattuAICoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "प्रणाम! हम सत्तू भैया (Sattu Bhaiya) बानी। बिहार के ई अमृत- पेय (सत्तू) और देसी हेल्थ के बारे में कुछ भी पूछे के मन बा? Sattu recipe कस्टमाइज़ करे के होखे या एकर जादुई फ़ायदे जाने के होखे, हम रउआ पूरी मदद करब! पूछिए, का जानना चाहते हैं?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map message history in a simple format
      const historyToSend = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyToSend,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch response from server.");
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        text: "प्रणाम! फिर से शुरू करते हैं। सत्तू के स्वास्थ्य लाभ या झटपट बनने वाली रेसिपी के बारे में अपना सवाल पूछें।",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setError(null);
  };

  return (
    <div id="sattu-ai-coach-root" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200/80 flex flex-col h-[580px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-600 relative">
            <span className="text-lg">🧔</span>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-bold text-stone-900 leading-tight">Sattu Bhaiya AI Coach</h4>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">Bihari Expert</span>
            </div>
            <p className="text-stone-500 text-xs mt-0.5">सत्तू भैया से सलाह लें (सत्तू अमृत स्वास्थ्य सहायक)</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-xl transition-all"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Message Screen */}
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-4 min-h-0 text-stone-800">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm border text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-emerald-600 border-emerald-600 text-white rounded-tr-none"
                    : "bg-stone-50 border-stone-200 text-stone-850 rounded-tl-none"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="text-[10px] font-mono text-amber-600 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Sattu Bhaiya
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.text}</div>
                <div className={`text-[9px] mt-1.5 text-right ${message.role === "user" ? "text-emerald-100" : "text-stone-400"}`}>
                  {message.timestamp}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-stone-500 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>सत्तू भैया सोच रहे हैं...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs">
            <p className="font-semibold">त्रुटि (Error):</p>
            <p className="mt-0.5">{error}</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions Pills (shown when no input) */}
      {inputValue.length === 0 && (
        <div className="py-2.5 overflow-x-auto flex gap-1.5 no-scrollbar border-t border-stone-100 mt-2">
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug.text)}
              className="flex-shrink-0 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full px-3 py-1.5 text-xs text-stone-700 font-medium active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-amber-500" />
              <span>{sug.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Form Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="flex items-center gap-2 pt-3 border-t border-stone-100 mt-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="सत्तू भैया से हिंदी या English में कुछ भी पूछें..."
          className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-stone-50/50"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
