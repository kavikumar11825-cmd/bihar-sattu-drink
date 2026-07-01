import { traditionalRecipes } from "../data";
import { SattuCustomizerOptions } from "../types";
import { ChefHat, Flame, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";

interface TraditionalRecipesListProps {
  onSelectRecipe: (options: SattuCustomizerOptions) => void;
  activeOptions: SattuCustomizerOptions;
}

export default function TraditionalRecipesList({ onSelectRecipe, activeOptions }: TraditionalRecipesListProps) {
  
  // Helper to check if options are identical to preset
  const isSelected = (presetOptions: SattuCustomizerOptions) => {
    return (
      activeOptions.style === presetOptions.style &&
      activeOptions.sattuSpoons === presetOptions.sattuSpoons &&
      activeOptions.waterType === presetOptions.waterType &&
      activeOptions.sweetener === presetOptions.sweetener
    );
  };

  return (
    <div id="traditional-recipes-root">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-mono font-bold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/55 px-3 py-1 rounded-full uppercase">
            Curated Presets / पारंपरिक रेसिपी
          </span>
          <h3 className="text-2xl font-bold text-stone-900 mt-2 tracking-tight">
            बिहार की प्रसिद्ध सत्तू रेसिपीज
          </h3>
          <p className="text-stone-500 text-xs mt-1">
            Pick an iconic local recipe from Bihar. Click to instantly load it into the Customizer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {traditionalRecipes.map((recipe, idx) => {
          const selected = isSelected(recipe.options);
          return (
            <motion.div
              key={recipe.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectRecipe(recipe.options)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between h-full relative overflow-hidden group ${
                selected
                  ? "border-amber-500 bg-stone-50 shadow-md ring-1 ring-amber-500/20"
                  : "border-stone-200/80 hover:border-stone-300 bg-white"
              }`}
            >
              {/* Badge for Sweet vs Salty */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                  recipe.style === "namkeen"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}>
                  {recipe.style === "namkeen" ? "Namkeen (नमकीन)" : "Meetha (मीठा)"}
                </span>

                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-stone-800">4.9</span>
                </div>
              </div>

              {/* Body */}
              <div className="relative z-10 flex-1">
                <h4 className="text-base font-bold text-stone-900 leading-snug group-hover:text-amber-600 transition-colors">
                  {recipe.name}
                </h4>
                <span className="text-[10px] text-stone-400 font-sans block mt-0.5">
                  {recipe.hindiName}
                </span>
                <p className="text-stone-500 text-xs mt-3 leading-relaxed line-clamp-3">
                  {recipe.description}
                </p>
              </div>

              {/* Loaded status/Footer button */}
              <div className="mt-5 border-t border-stone-100 pt-3 flex items-center justify-between relative z-10">
                <div className="text-[10px] font-mono text-stone-400">
                  {recipe.options.sattuSpoons} Spoons • {recipe.options.waterType === "buttermilk" ? "Chaas" : "Water"}
                </div>
                
                {selected ? (
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Active Recipe
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-stone-600 group-hover:text-amber-500 transition-colors flex items-center gap-1">
                    <ChefHat className="w-3.5 h-3.5" />
                    Load Recipe
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
