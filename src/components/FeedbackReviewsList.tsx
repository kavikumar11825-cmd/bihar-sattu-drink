import { useState, useEffect, FormEvent } from "react";
import { FeedbackReview } from "../types";
import { initialReviews } from "../data";
import { Star, MessageSquare, Plus, Check, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FeedbackReviewsList() {
  const [reviews, setReviews] = useState<FeedbackReview[]>([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [style, setStyle] = useState("Namkeen Style");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Load reviews from localStorage or fall back to static list
  useEffect(() => {
    const saved = localStorage.getItem("sattu_reviews");
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(initialReviews);
      }
    } else {
      setReviews(initialReviews);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !city.trim()) return;

    const newReview: FeedbackReview = {
      id: Math.random().toString(),
      name,
      city,
      rating,
      comment,
      style,
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem("sattu_reviews", JSON.stringify(updated));

    // Reset Form
    setName("");
    setCity("");
    setRating(5);
    setComment("");
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  return (
    <div id="reviews-section-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT Side: Form to add a feedback */}
      <div className="lg:col-span-5 bg-stone-50 border border-stone-200/80 rounded-3xl p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Share the Love / सत्तू प्रेम
            </span>
          </div>
          <h4 className="text-xl font-bold text-stone-900 tracking-tight">
            अपनी सत्तू समीक्षा जोड़ें (Write a Review)
          </h4>
          <p className="text-stone-500 text-xs mt-1">
            How much do you love Bihar Sattu? Write your review to support authentic desi drinks!
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center text-emerald-800"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600 text-xl font-bold">
              ✓
            </div>
            <h5 className="font-bold text-base">समीक्षा के लिए धन्यवाद!</h5>
            <p className="text-xs text-emerald-600/90 mt-1">Your review has been successfully posted locally.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Name / आपका नाम</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amit Singh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">City / शहर</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Patna / Muzaffarpur"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Rating / रेटिंग</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 focus:outline-none text-xl hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Fav Style / पसंदीदा प्रकार</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 bg-white font-medium text-stone-700"
                >
                  <option value="Namkeen Style">Namkeen Style (नमकीन)</option>
                  <option value="Gur Sweet Style">Gur Sweet Style (मीठा गुड़)</option>
                  <option value="Mattha Sattu">Mattha Sattu (छाछ सत्तू)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Your Love for Sattu / टिप्पणी</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Sattu drink के बारे में अपने विचार साझा करें..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-sm hover:shadow active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              समीक्षा पोस्ट करें (Submit Review)
            </button>
          </form>
        )}
      </div>

      {/* RIGHT Side: Scrollable Reviews List */}
      <div className="lg:col-span-7 bg-white border border-stone-200/85 rounded-3xl p-6 md:p-8 flex flex-col self-stretch max-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-bold text-stone-900 tracking-tight">Sattu Lovers Hub</h4>
          <span className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-1 rounded-full font-mono">
            {reviews.length} Feedbacks
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <AnimatePresence initial={false}>
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-stone-50/50 border border-stone-150 relative"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-sm font-bold">
                      <User className="w-4 h-4 text-stone-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-stone-900 leading-tight">{rev.name}</span>
                        <span className="text-[10px] text-stone-400 font-sans">• {rev.city}</span>
                      </div>
                      <span className="text-[9px] font-bold text-amber-600 tracking-wider uppercase mt-0.5 block leading-none">
                        {rev.style}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-stone-400 font-mono block mt-1">{rev.date}</span>
                  </div>
                </div>

                <p className="text-stone-600 text-xs leading-relaxed mt-3 whitespace-pre-wrap font-sans">
                  "{rev.comment}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
