import { SattuCustomizerOptions } from "../types";
import { calculateNutrition } from "../data";
import { 
  Droplet, 
  Flame, 
  Sparkles, 
  Plus, 
  Minus, 
  Activity, 
  ShieldCheck, 
  Zap, 
  RefreshCw,
  UtensilsCrossed
} from "lucide-react";
import { motion } from "motion/react";

interface SattuCustomizerProps {
  options: SattuCustomizerOptions;
  onChange: (updated: SattuCustomizerOptions) => void;
  onReset: () => void;
}

export default function SattuCustomizer({ options, onChange, onReset }: SattuCustomizerProps) {
  const nutrition = calculateNutrition(options);

  const updateOption = <K extends keyof SattuCustomizerOptions>(
    key: K,
    value: SattuCustomizerOptions[K]
  ) => {
    onChange({
      ...options,
      [key]: value,
    });
  };

  const handleSpoonsChange = (delta: number) => {
    const newCount = Math.min(6, Math.max(1, options.sattuSpoons + delta));
    updateOption("sattuSpoons", newCount);
  };

  const handleSweetenerAmountChange = (delta: number) => {
    const newCount = Math.min(3, Math.max(1, options.sweetenerAmount + delta));
    updateOption("sweetenerAmount", newCount);
  };

  // Nutrition Bars Helpers
  const maxCalories = 400;
  const maxProtein = 20;
  const maxFiber = 12;
  const maxCarbs = 60;

  return (
    <div id="sattu-customizer-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Controls (Customizer Sliders/Toggles) */}
      <div id="customizer-controls" className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-amber-500" />
              अपना सत्तू कस्टमाइज़ करें
            </h3>
            <p className="text-stone-500 text-xs mt-0.5">Customize your Bihari Superfood drink to your exact taste</p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-amber-600 hover:bg-stone-50 rounded-xl transition-all"
            title="Reset to classic salty"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Classic
          </button>
        </div>

        {/* Option 1: Choose Style (Namkeen vs Meetha) */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Flavor profile / स्वाद का प्रकार
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onChange({
                  ...options,
                  style: "namkeen",
                  sweetener: "none",
                  sweetenerAmount: 0,
                  onion: true,
                  greenChili: "mild",
                  lemonJuice: true,
                  blackSalt: true,
                  roastedCumin: true,
                  mintLeaves: true,
                  ginger: true,
                });
              }}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                options.style === "namkeen"
                  ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm"
                  : "border-stone-200 hover:border-stone-300 text-stone-600"
              }`}
            >
              <span className="font-semibold text-sm">Namkeen (नमकीन)</span>
              <span className="text-[10px] opacity-85 mt-0.5">Salty, Savory & Spicy (Classic)</span>
            </button>

            <button
              onClick={() => {
                onChange({
                  ...options,
                  style: "meetha",
                  sweetener: "jaggery",
                  sweetenerAmount: 2,
                  onion: false,
                  greenChili: "none",
                  lemonJuice: false,
                  blackSalt: true, // a tiny pinch balances sweetness beautifully
                  roastedCumin: false,
                  mintLeaves: false,
                  ginger: false,
                });
              }}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                options.style === "meetha"
                  ? "border-amber-500 bg-amber-50/50 text-amber-950 shadow-sm"
                  : "border-stone-200 hover:border-stone-300 text-stone-600"
              }`}
            >
              <span className="font-semibold text-sm">Meetha (मीठा)</span>
              <span className="text-[10px] opacity-85 mt-0.5">Sweet, Iron-Rich Energy Booster</span>
            </button>
          </div>
        </div>

        {/* Option 2: Sattu Quantity */}
        <div className="mb-6 bg-stone-50/75 p-4 rounded-2xl border border-stone-100">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                Sattu Flour Quantity / सत्तू की मात्रा
              </span>
              <span className="text-[10px] text-stone-400">Pure Roasted Gram Flour (चना सत्तू)</span>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
              {options.sattuSpoons} Spoons ({options.sattuSpoons * 10}g)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSpoonsChange(-1)}
              disabled={options.sattuSpoons <= 1}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-stone-200 shadow-sm text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            {/* Visual Spoon Meter */}
            <div className="flex-1 flex gap-1 justify-center items-center h-8 bg-white rounded-xl border border-stone-200/60 px-3">
              {[1, 2, 3, 4, 5, 6].map((spoon) => (
                <div
                  key={spoon}
                  className={`h-4 flex-1 rounded-sm transition-all ${
                    spoon <= options.sattuSpoons
                      ? options.style === "namkeen"
                        ? "bg-emerald-600"
                        : "bg-amber-500"
                      : "bg-stone-200/70"
                  }`}
                  title={`${spoon} Spoons`}
                />
              ))}
            </div>

            <button
              onClick={() => handleSpoonsChange(1)}
              disabled={options.sattuSpoons >= 6}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-stone-200 shadow-sm text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Option 3: Water/Base Choice */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Base Liquid / आधार तरल पदार्थ
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "chilled", label: "Chilled Water", desc: "ठंडा पानी", icon: "❄️" },
              { id: "normal", label: "Normal Water", desc: "सादा पानी", icon: "🚰" },
              { id: "buttermilk", label: "Buttermilk (Chaas)", desc: "छाछ / मट्ठा", icon: "🥛" },
            ].map((base) => (
              <button
                key={base.id}
                onClick={() => updateOption("waterType", base.id as any)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  options.waterType === base.id
                    ? "border-emerald-600 bg-emerald-50/30 text-stone-900 font-medium"
                    : "border-stone-200 hover:border-stone-300 text-stone-600"
                }`}
              >
                <span className="text-lg mb-1">{base.icon}</span>
                <span className="text-xs font-semibold block leading-tight">{base.label}</span>
                <span className="text-[9px] opacity-80 mt-0.5 leading-none">{base.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CONDITIONAL CONTROLS: IF SAVORY / NAMKEEN */}
        {options.style === "namkeen" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800/80 mt-4 border-b border-stone-100 pb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Savory Add-ins & Spices (मसाले)
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Onion */}
              <button
                onClick={() => updateOption("onion", !options.onion)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  options.onion ? "border-emerald-600 bg-emerald-50/20 text-emerald-950 font-medium" : "border-stone-150 bg-stone-50/30 text-stone-500"
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${options.onion ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300"}`}>
                  {options.onion && "✓"}
                </div>
                <div className="leading-tight">
                  <span className="text-xs block">Onions (प्याज)</span>
                  <span className="text-[9px] opacity-75">Fine & Crunchy</span>
                </div>
              </button>

              {/* Lemon Juice */}
              <button
                onClick={() => updateOption("lemonJuice", !options.lemonJuice)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  options.lemonJuice ? "border-emerald-600 bg-emerald-50/20 text-emerald-950 font-medium" : "border-stone-150 bg-stone-50/30 text-stone-500"
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${options.lemonJuice ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300"}`}>
                  {options.lemonJuice && "✓"}
                </div>
                <div className="leading-tight">
                  <span className="text-xs block">Lemon (नींबू)</span>
                  <span className="text-[9px] opacity-75">Tarty Citrus Kick</span>
                </div>
              </button>

              {/* Roasted Cumin */}
              <button
                onClick={() => updateOption("roastedCumin", !options.roastedCumin)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  options.roastedCumin ? "border-emerald-600 bg-emerald-50/20 text-emerald-950 font-medium" : "border-stone-150 bg-stone-50/30 text-stone-500"
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${options.roastedCumin ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300"}`}>
                  {options.roastedCumin && "✓"}
                </div>
                <div className="leading-tight">
                  <span className="text-xs block">Cumin (भुना जीरा)</span>
                  <span className="text-[9px] opacity-75">Earthy Aromatics</span>
                </div>
              </button>

              {/* Black Salt */}
              <button
                onClick={() => updateOption("blackSalt", !options.blackSalt)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  options.blackSalt ? "border-emerald-600 bg-emerald-50/20 text-emerald-950 font-medium" : "border-stone-150 bg-stone-50/30 text-stone-500"
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${options.blackSalt ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300"}`}>
                  {options.blackSalt && "✓"}
                </div>
                <div className="leading-tight">
                  <span className="text-xs block">Kala Namak (काला नमक)</span>
                  <span className="text-[9px] opacity-75">Essential minerals</span>
                </div>
              </button>

              {/* Mint Leaves */}
              <button
                onClick={() => updateOption("mintLeaves", !options.mintLeaves)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  options.mintLeaves ? "border-emerald-600 bg-emerald-50/20 text-emerald-950 font-medium" : "border-stone-150 bg-stone-50/30 text-stone-500"
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${options.mintLeaves ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300"}`}>
                  {options.mintLeaves && "✓"}
                </div>
                <div className="leading-tight">
                  <span className="text-xs block">Mint (पुदीना)</span>
                  <span className="text-[9px] opacity-75">Refreshing Cooler</span>
                </div>
              </button>

              {/* Ginger */}
              <button
                onClick={() => updateOption("ginger", !options.ginger)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  options.ginger ? "border-emerald-600 bg-emerald-50/20 text-emerald-950 font-medium" : "border-stone-150 bg-stone-50/30 text-stone-500"
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${options.ginger ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300"}`}>
                  {options.ginger && "✓"}
                </div>
                <div className="leading-tight">
                  <span className="text-xs block">Ginger (अदरक)</span>
                  <span className="text-[9px] opacity-75">Warm Zesty Digestif</span>
                </div>
              </button>
            </div>

            {/* Chili Slider */}
            <div className="mt-4 p-3 bg-stone-50/50 rounded-xl border border-stone-200/50">
              <span className="block text-xs font-semibold text-stone-500 mb-2">
                Green Chili Level / हरी मिर्च का तीखापन
              </span>
              <div className="flex gap-2">
                {[
                  { id: "none", label: "No Spice (बिना मिर्च)", color: "border-stone-200 text-stone-600" },
                  { id: "mild", label: "Mild (हल्की मिर्च)", color: "border-emerald-200 text-emerald-800 bg-emerald-50/30" },
                  { id: "spicy", label: "Spicy Bihari (चटपटा तीखा)", color: "border-rose-200 text-rose-800 bg-rose-50/30" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateOption("greenChili", item.id as any)}
                    className={`flex-1 text-center py-2 px-1 rounded-lg border text-xs cursor-pointer font-medium transition-all ${
                      options.greenChili === item.id
                        ? "border-emerald-600 bg-emerald-600! text-white"
                        : "hover:bg-stone-50 border-stone-200 text-stone-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONAL CONTROLS: IF SWEET / MEETHA */}
        {options.style === "meetha" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800/80 mt-4 border-b border-stone-100 pb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Desi Sweeteners & Balance (मीठा और फ्लेवर)
            </h4>

            {/* Sweetener Choice */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateOption("sweetener", "jaggery")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                  options.sweetener === "jaggery"
                    ? "border-amber-500 bg-amber-50/25 text-stone-900 font-semibold"
                    : "border-stone-200 hover:border-stone-300 text-stone-600"
                }`}
              >
                <span className="text-lg">🪵</span>
                <span className="text-xs block mt-1">Desi Jaggery (गुड़)</span>
                <span className="text-[9px] opacity-75 font-normal">Traditional & Iron-Rich</span>
              </button>

              <button
                onClick={() => updateOption("sweetener", "sugar")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                  options.sweetener === "sugar"
                    ? "border-amber-500 bg-amber-50/25 text-stone-900 font-semibold"
                    : "border-stone-200 hover:border-stone-300 text-stone-600"
                }`}
              >
                <span className="text-lg">🍚</span>
                <span className="text-xs block mt-1">Sugar (चीनी)</span>
                <span className="text-[9px] opacity-75 font-normal">Clean sweet finish</span>
              </button>
            </div>

            {/* Sweetener Amount Slider */}
            <div className="bg-stone-50/75 p-4 rounded-2xl border border-stone-100 mt-2">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Sweetener Amount / मीठे की मात्रा
                  </span>
                  <span className="text-[10px] text-stone-400">Control the sweetness balance</span>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  {options.sweetenerAmount} Spoon(s)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleSweetenerAmountChange(-1)}
                  disabled={options.sweetenerAmount <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-stone-200 shadow-sm text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1 flex gap-1.5 justify-center items-center h-8 bg-white rounded-xl border border-stone-200/60 px-3">
                  {[1, 2, 3].map((spoon) => (
                    <div
                      key={spoon}
                      className={`h-4 flex-1 rounded-md transition-all ${
                        spoon <= options.sweetenerAmount
                          ? "bg-amber-500"
                          : "bg-stone-200/70"
                      }`}
                      title={`${spoon} Spoons`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleSweetenerAmountChange(1)}
                  disabled={options.sweetenerAmount >= 3}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-stone-200 shadow-sm text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Balancer Pinch of Black Salt */}
            <div className="flex justify-between items-center p-3 bg-stone-50/50 rounded-xl border border-stone-200/40">
              <div className="flex items-center gap-2">
                <div className="bg-stone-100 p-1.5 rounded-lg text-lg">🧂</div>
                <div className="leading-tight">
                  <span className="text-xs font-medium text-stone-700 block">Pinch of Black Salt / काला नमक</span>
                  <span className="text-[10px] text-stone-400">Recommended to balance sweet profiles</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={options.blackSalt}
                onChange={(e) => updateOption("blackSalt", e.target.checked)}
                className="w-4.5 h-4.5 rounded text-amber-500 border-stone-300 focus:ring-amber-400 accent-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Live Nutrition Facts Panel */}
      <div id="nutrition-panel" className="lg:col-span-5 bg-stone-900 text-stone-100 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between self-stretch border border-stone-800">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
            <div>
              <span className="text-[10px] tracking-widest font-mono text-amber-400 uppercase font-semibold">
                Nutritional Engine
              </span>
              <h4 className="text-lg font-semibold tracking-tight">न्यूट्रिशन फ़ैक्ट्स</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-stone-400 block">Serving Size</span>
              <span className="text-xs font-medium text-stone-300">1 Glass ({nutrition.waterContent}ml)</span>
            </div>
          </div>

          {/* Core Energy Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-stone-800/60 border border-stone-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-400 block">Calories</span>
                <span className="text-xl font-bold text-stone-100">{nutrition.calories} kcal</span>
              </div>
            </div>

            <div className="bg-stone-800/60 border border-stone-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-400 block">Plant Protein</span>
                <span className="text-xl font-bold text-stone-100">{nutrition.protein}g</span>
              </div>
            </div>
          </div>

          {/* Detailed Macros Progress bars */}
          <div className="space-y-4 mb-6">
            {/* Protein Bar details */}
            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Protein (प्रोटीन)
                </span>
                <span className="font-mono font-medium text-stone-100">{nutrition.protein}g / {maxProtein}g goal</span>
              </div>
              <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (nutrition.protein / maxProtein) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <span className="text-[9px] text-stone-400 mt-1 block">Provides essential muscle recovery amino acids</span>
            </div>

            {/* Fiber Bar details */}
            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Dietary Fiber (फाइबर)
                </span>
                <span className="font-mono font-medium text-stone-100">{nutrition.fiber}g / {maxFiber}g goal</span>
              </div>
              <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (nutrition.fiber / maxFiber) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
              <span className="text-[9px] text-stone-400 mt-1 block">Insoluble fiber helps cleans stomach & keeps you full</span>
            </div>

            {/* Carbs Bar details */}
            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Carbohydrates (कार्बोहाइड्रेट)
                </span>
                <span className="font-mono font-medium text-stone-100">{nutrition.carbs}g</span>
              </div>
              <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (nutrition.carbs / maxCarbs) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-blue-400 rounded-full"
                />
              </div>
              <span className="text-[9px] text-stone-400 mt-1 block">Low Glycemic Index (GI) slow-burning energy</span>
            </div>
          </div>

          {/* Micro Minerals list */}
          <div className="border-t border-stone-800 pt-4 space-y-2.5">
            <div className="flex justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                Iron (आयरन की मात्रा)
              </span>
              <span className="font-mono font-semibold text-rose-400">~{nutrition.iron}% DV</span>
            </div>
            
            <div className="flex justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Total Fats (वसा)
              </span>
              <span className="font-mono font-semibold text-stone-100">{nutrition.fat}g</span>
            </div>

            <div className="flex justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-sky-400" />
                Sodium (सोडियम)
              </span>
              <span className="font-mono font-semibold text-stone-100">{nutrition.sodium} mg</span>
            </div>
          </div>
        </div>

        {/* Dynamic superfood stamp */}
        <div className="mt-8 pt-4 border-t border-stone-800/60 flex items-center justify-between gap-3 bg-stone-950/40 p-3 rounded-2xl relative z-10">
          <div className="leading-tight">
            <span className="text-amber-400 text-xs font-bold block">100% Desi Superfood</span>
            <span className="text-[9px] text-stone-400">Zero artificial additives, fully vegan</span>
          </div>
          <div className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono uppercase font-bold tracking-wider">
            Natural Cooler
          </div>
        </div>
      </div>
    </div>
  );
}
