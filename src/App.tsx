import { useState, useEffect } from "react";
import { SattuCustomizerOptions } from "./types";
import SattuCustomizer from "./components/SattuCustomizer";
import SattuAICoach from "./components/SattuAICoach";
import BenefitsBento from "./components/BenefitsBento";
import TraditionalRecipesList from "./components/TraditionalRecipesList";
import BiharCuisineHub from "./components/BiharCuisineHub";
import SattuStallFinder from "./components/SattuStallFinder";
import FeedbackReviewsList from "./components/FeedbackReviewsList";

// Firebase and checkout overlays
import SattuAuthModal from "./components/SattuAuthModal";
import SattuCheckoutModal from "./components/SattuCheckoutModal";
import SattuOrdersDashboard from "./components/SattuOrdersDashboard";
import SattuAdminPanel from "./components/SattuAdminPanel";
import OtpNotificationSimulator from "./components/OtpNotificationSimulator";
import { getLocalUser, setLocalUser, SattuUser } from "./firebase";

import { 
  Sparkles, 
  Flame, 
  Droplet, 
  Award, 
  ChefHat, 
  Heart, 
  HelpCircle,
  MessageSquare,
  MapPin,
  Compass,
  Utensils,
  BookOpen,
  UserCheck,
  Lock,
  LineChart
} from "lucide-react";
import { motion } from "motion/react";

const INITIAL_OPTIONS: SattuCustomizerOptions = {
  sattuSpoons: 3,
  waterType: "chilled",
  style: "namkeen",
  lemonJuice: true,
  blackSalt: true,
  roastedCumin: true,
  onion: true,
  greenChili: "mild",
  mintLeaves: true,
  ginger: false,
  sweetener: "none",
  sweetenerAmount: 0,
};

export default function App() {
  const [options, setOptions] = useState<SattuCustomizerOptions>(INITIAL_OPTIONS);
  
  // Firebase Auth and Checkout States
  const [user, setUser] = useState<SattuUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<"regular" | "bulk">("regular");
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    // Sync session on mount
    const savedUser = getLocalUser();
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    setLocalUser(null);
    setUser(null);
  };

  const handleOrderTrigger = (mode: "regular" | "bulk") => {
    setCheckoutMode(mode);
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setCheckoutModalOpen(true);
    }
  };

  const handleLoginSuccess = (loggedInUser: SattuUser) => {
    setUser(loggedInUser);
    // Smooth scroll to customizer orders view
    setTimeout(() => {
      setCheckoutModalOpen(true);
    }, 400);
  };

  const handleSelectRecipe = (presetOptions: SattuCustomizerOptions) => {
    setOptions(presetOptions);
    // Smooth scroll to customizer
    const customizerEl = document.getElementById("interactive-customizer");
    if (customizerEl) {
      customizerEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setOptions(INITIAL_OPTIONS);
  };

  // Determine liquid color for glass visualizer
  const getLiquidColor = () => {
    if (options.waterType === "buttermilk") {
      return "bg-stone-100/90"; // creamy mattha
    }
    if (options.style === "meetha") {
      return options.sweetener === "jaggery" 
        ? "bg-amber-100/90" // deep amber gur sattu
        : "bg-amber-50/90"; // light sweet sattu
    }
    return "bg-amber-100/80"; // standard earthy namkeen sattu
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. TOP BRAND NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/60 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm font-serif">
              <span className="text-xl font-bold">स</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-stone-900 leading-tight">Bihar Sattu Drink</h1>
              <span className="text-[10px] text-emerald-800 font-mono font-bold tracking-wide uppercase block">सत्तू अमृत • 100% Desi</span>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-600">
            <a href="#recipes" className="hover:text-amber-600 transition-colors">Recipes</a>
            <a href="#cuisine-hub" className="text-emerald-700 hover:text-emerald-800 transition-colors font-bold">Bihar Cuisine</a>
            <a href="#interactive-customizer" className="hover:text-amber-600 transition-colors">Customizer</a>
            {user && <a href="#orders" className="text-emerald-700 hover:text-emerald-800 transition-colors font-bold">My Orders</a>}
            <a href="#benefits" className="hover:text-amber-600 transition-colors">Health Benefits</a>
            <a href="#ai-coach" className="hover:text-amber-600 transition-colors">AI Coach</a>
            <a href="#stalls" className="hover:text-amber-600 transition-colors">Stall Finder</a>
            <a href="#reviews" className="hover:text-amber-600 transition-colors">Reviews</a>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold font-mono">
              ● Live Kitchen
            </span>

            {/* Separated Administrative Access Gate */}
            <button
              onClick={() => setAdminOpen(true)}
              className="bg-stone-900 hover:bg-stone-850 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-sm shadow-inner"
              title="प्रशासनिक नियंत्रण • Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </button>

            {/* Profile Avatar / Login trigger */}
            {user ? (
              <div className="flex items-center gap-2">
                <a 
                  href="#orders"
                  className="bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-850 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hi, {user.name.split(" ")[0]}</span>
                </a>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO LANDING SECTION */}
      <header className="relative py-12 md:py-20 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-amber-50/40 via-stone-50 to-stone-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/60 rounded-full text-xs font-bold text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Bihar's Legendary Summer Superfood Cooler</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-none">
              बिहार का असली अमृत <br />
              <span className="text-emerald-700 font-serif">ताजा चने का सत्तू</span>
            </h2>

            <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-xl">
              Forget sugar-loaded sports drinks and chemical-filled protein powders. Embrace **Sattu**, Bihar's ancient roasted gram flour beverage. Deeply cooling, extremely high in natural plant protein, rich in fiber, and absolute magic for your gut health. Savor it salty (Namkeen) or sweet (Meetha)!
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a 
                href="#interactive-customizer" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow transition-all text-center text-sm cursor-pointer"
              >
                Customize Your Drink
              </a>
              <a 
                href="#recipes" 
                className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 font-bold px-6 py-3 rounded-2xl transition-all text-center text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <ChefHat className="w-4 h-4 text-amber-500" />
                Famous Recipes
              </a>
            </div>

            {/* Micro Tags */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/60 max-w-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-stone-900">~20g Protein</span>
                  <span className="text-[10px] text-stone-500 block leading-none">Per 100g Sattu</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-stone-900">Zero Added Oil</span>
                  <span className="text-[10px] text-stone-500 block leading-none">Roasted & Ground</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-stone-900">100% Vegan</span>
                  <span className="text-[10px] text-stone-500 block leading-none">Earthy & Wholesome</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right: Live Interactive Sattu Glass representation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="bg-white/80 border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-xl relative w-full max-w-[360px] flex flex-col items-center overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-1 bg-amber-100 text-amber-900 rounded text-[9px] font-bold font-mono">
                LIVE VISUALIZER
              </div>

              {/* Styled Glass Cup Container */}
              <div className="w-44 h-72 border-4 border-stone-200/90 rounded-b-3xl border-t-0 relative overflow-hidden bg-stone-50 shadow-inner flex flex-col justify-end mt-4">
                
                {/* Liquid Level */}
                <motion.div 
                  initial={{ height: "40%" }}
                  animate={{ height: `${40 + (options.sattuSpoons * 8)}%` }}
                  transition={{ duration: 0.4 }}
                  className={`w-full relative transition-colors ${getLiquidColor()}`}
                >
                  
                  {/* Floating Bubbles / Ingredients inside liquid */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    
                    {/* Floating Ice Cubes */}
                    {options.waterType === "chilled" && (
                      <div className="absolute top-2 left-6 w-5 h-5 bg-white/70 rounded-md border border-white/40 shadow-inner rotate-12 animate-bounce" />
                    )}

                    {/* Floating Mint Leaves */}
                    {options.mintLeaves && (
                      <>
                        <span className="absolute top-4 right-6 text-xs animate-pulse opacity-90 select-none">🍃</span>
                        <span className="absolute bottom-12 left-4 text-[10px] animate-pulse opacity-80 select-none">-🍃</span>
                      </>
                    )}

                    {/* Floating Onion Bits */}
                    {options.onion && options.style === "namkeen" && (
                      <>
                        <div className="absolute top-8 left-12 w-2 h-2 bg-purple-400 rounded-sm rotate-45 opacity-80" />
                        <div className="absolute bottom-8 right-12 w-1.5 h-1.5 bg-purple-400 rounded-sm rotate-12 opacity-90" />
                        <div className="absolute top-16 right-4 w-2 h-1.5 bg-purple-400 rounded-sm opacity-70" />
                      </>
                    )}

                    {/* Green Chilli bits */}
                    {options.greenChili !== "none" && (
                      <>
                        <div className="absolute top-14 left-4 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        {options.greenChili === "spicy" && (
                          <div className="absolute bottom-14 right-6 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        )}
                      </>
                    )}

                    {/* Cumin Dust */}
                    {options.roastedCumin && options.style === "namkeen" && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] text-amber-800/80 font-bold font-mono tracking-widest pointer-events-none select-none">
                        •••
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Lemon Wheel on Glass Rim */}
                {options.lemonJuice && (
                  <div className="absolute -top-4 -right-2 w-12 h-12 rounded-full border-4 border-yellow-300 bg-yellow-400/90 shadow rotate-45 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border border-dashed border-yellow-500" />
                  </div>
                )}
              </div>

              {/* Glass Description label */}
              <div className="text-center mt-6">
                <span className="text-xs font-semibold uppercase text-stone-500 tracking-widest block font-mono">
                  Your Custom Glass / आपका प्याला
                </span>
                <span className="text-sm font-bold text-stone-900 mt-1 block">
                  {options.style === "namkeen" 
                    ? `${options.sattuSpoons} Spoons Namkeen Sattu` 
                    : `${options.sattuSpoons} Spoons Sweet Sattu (${options.sweetener === "jaggery" ? "Gur" : "Sugar"})`
                  }
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5 block leading-none font-sans">
                  Liquid base: {options.waterType === "buttermilk" ? "Creamy Buttermilk" : options.waterType === "chilled" ? "Chilled Water" : "Normal Water"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 3. PRESETS/TRADITIONAL RECIPES */}
      <section id="recipes" className="py-16 px-4 md:px-8 border-t border-stone-200/50 bg-stone-50/50">
        <div className="max-w-7xl mx-auto">
          <TraditionalRecipesList onSelectRecipe={handleSelectRecipe} activeOptions={options} />
        </div>
      </section>

      {/* 3.5 BIHAR TRADITIONAL SWEETS & CUISINE ENCYCLOPEDIA */}
      <section id="cuisine-hub" className="py-16 px-4 md:px-8 border-t border-stone-200/50 bg-stone-100/10">
        <div className="max-w-7xl mx-auto">
          <BiharCuisineHub />
        </div>
      </section>

      {/* 4. MAIN INTERACTIVE CUSTOMIZER SECTION */}
      <section id="interactive-customizer" className="py-16 px-4 md:px-8 bg-stone-100/30 border-t border-stone-200/50">
        <div className="max-w-7xl mx-auto">
          <SattuCustomizer 
            options={options} 
            onChange={setOptions} 
            onReset={handleReset} 
            onOrder={handleOrderTrigger}
          />
        </div>
      </section>

      {/* 4.5 REAL-TIME TRACKING & ORDERS PANEL */}
      <section id="orders" className="py-16 px-4 md:px-8 bg-amber-50/10 border-t border-stone-200/40">
        <div className="max-w-7xl mx-auto">
          {user ? (
            <SattuOrdersDashboard 
              user={user} 
              onLogout={handleLogout} 
              onOpenAdminPanel={() => setAdminOpen(true)}
            />
          ) : (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200/80 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mx-auto">
                <LineChart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-extrabold text-stone-900 tracking-tight">📊 Track Live Sattu Orders / लाइव ऑर्डर ट्रैकिंग</h4>
              <p className="text-stone-500 text-xs max-w-lg mx-auto leading-relaxed">
                Our fresh Sattu beverages are hand-blended and delivered in traditional earthen Kullhads. Log in with your mobile number to customize recipes, place bulk event orders, and track your drink's live preparation status!
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                Sign In to Start Ordering
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. BENEFITS GRID */}
      <section id="benefits" className="py-16 px-4 md:px-8 border-t border-stone-200/50 bg-white">
        <div className="max-w-7xl mx-auto">
          <BenefitsBento />
        </div>
      </section>

      {/* 6. AI COACH CHAT */}
      <section id="ai-coach" className="py-16 px-4 md:px-8 border-t border-stone-200/50 bg-stone-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* AI Info left */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full uppercase">
              Smart Desi Wellness / सत्तू भैया सलाहकार
            </span>
            <h3 className="text-3xl font-extrabold text-stone-950 tracking-tight leading-none">
              सत्तू भैया एआई कोच से पूछें
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Have specific wellness goals? Wondering how Sattu fits into a keto diet, diabetes management, or bodybuilding routines? Our server-side **Sattu Bhaiya AI Coach** knows it all. 
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              Type your questions in Hindi, English, or Bhojpuri. Ask for specialized recipes, calorie counts, or the rich cultural history of Sattu.
            </p>

            <div className="space-y-3.5 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold">
                  1
                </div>
                <p className="text-stone-700 text-xs font-semibold leading-snug">
                  Fully customized diet tips based on your physical lifestyle.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-bold">
                  2
                </div>
                <p className="text-stone-700 text-xs font-semibold leading-snug">
                  Fluent in Bhojpuri, Hindi, and English (the sweet deshi dialect).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-800 text-xs font-bold">
                  3
                </div>
                <p className="text-stone-700 text-xs font-semibold leading-snug">
                  Powered by Google Gemini server-side, securing direct and smart answers.
                </p>
              </div>
            </div>
          </div>

          {/* Chat Window right */}
          <div className="lg:col-span-7">
            <SattuAICoach />
          </div>

        </div>
      </section>

      {/* 7. FAMOUS LOCAL STALLS FINDER */}
      <section id="stalls" className="py-16 px-4 md:px-8 border-t border-stone-200/50 bg-white">
        <div className="max-w-7xl mx-auto">
          <SattuStallFinder />
        </div>
      </section>

      {/* 8. REVIEWS SECTION */}
      <section id="reviews" className="py-16 px-4 md:px-8 border-t border-stone-200/50 bg-stone-50/40">
        <div className="max-w-7xl mx-auto">
          <FeedbackReviewsList />
        </div>
      </section>

      {/* 9. FOOTER SECTION */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4 md:px-8 border-t border-stone-850">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-800">
          
          <div>
            <div className="flex items-center gap-3 text-white mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold text-sm">
                स
              </div>
              <span className="text-base font-bold tracking-tight">Bihar Sattu Drink Hub</span>
            </div>
            <p className="text-stone-500 text-xs leading-relaxed max-w-sm">
              Celebrating the earthy, pristine, rich nutrition of Bihar's traditional roasted gram superfood. Promising pure health, natural coolers, and high plant proteins.
            </p>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Quick Navigation</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#recipes" className="hover:text-amber-400 transition-colors">Traditional Recipes</a>
              <a href="#cuisine-hub" className="hover:text-amber-400 transition-colors font-bold">Bihari Cuisine Hub</a>
              <a href="#interactive-customizer" className="hover:text-amber-400 transition-colors">Sattu Customizer</a>
              <a href="#benefits" className="hover:text-amber-400 transition-colors">Health Benefits</a>
              <a href="#ai-coach" className="hover:text-amber-400 transition-colors">Sattu AI Coach</a>
              <a href="#stalls" className="hover:text-amber-400 transition-colors">Stall Locator</a>
              <a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews Hub</a>
              <button
                onClick={() => setAdminOpen(true)}
                className="hover:text-amber-400 transition-colors text-left font-bold flex items-center gap-1 text-stone-300 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-amber-500" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Pure Desi Heritage</h5>
            <p className="text-stone-500 text-xs leading-relaxed">
              Sattu represents the humble, robust energy of Indian soil. Sattu flour is rich in calcium, iron, and fiber. Celebrate Bihar's golden drink!
            </p>
            <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/15 rounded px-2.5 py-1 text-[10px] font-mono uppercase font-bold mt-4">
              ❤️ Made with Love in Bihar
            </span>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <span>&copy; {new Date().getFullYear()} Bihar Sattu Drink Hub. All Rights Reserved.</span>
          <div className="flex gap-4">
            <span>सत्तू पियो, स्वस्थ जियो!</span>
            <span>•</span>
            <span>Natural summer protector</span>
          </div>
        </div>
      </footer>

      {/* Interactive Overlays & Modals */}
      <SattuAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {user && (
        <SattuCheckoutModal 
          isOpen={checkoutModalOpen} 
          onClose={() => setCheckoutModalOpen(false)} 
          user={user} 
          customization={options} 
          mode={checkoutMode} 
          onOrderCompleted={() => {
            // Smooth scroll to the live tracker
            const trackerEl = document.getElementById("orders");
            if (trackerEl) {
              trackerEl.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
      )}

      <SattuAdminPanel 
        isOpen={adminOpen} 
        onClose={() => setAdminOpen(false)} 
      />

      {/* Global OTP SMS/Email Push Notification Banner Simulator */}
      <OtpNotificationSimulator />

    </div>
  );
}
