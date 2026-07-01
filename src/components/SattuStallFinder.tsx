import { useState } from "react";
import { famousStalls } from "../data";
import { SattuStore } from "../types";
import { MapPin, Star, Sparkles, Utensils, IndianRupee } from "lucide-react";
import { motion } from "motion/react";

export default function SattuStallFinder() {
  const [selectedStall, setSelectedStall] = useState<SattuStore>(famousStalls[0]);

  return (
    <div id="stall-finder-root" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200/80">
      <div className="mb-6">
        <span className="text-xs font-mono font-bold tracking-wider text-amber-600 bg-amber-50 border border-amber-200/50 px-3 py-1 rounded-full uppercase">
          Authentic Street Stalls / बिहार के सत्तू के अड्डे
        </span>
        <h3 className="text-2xl font-bold text-stone-900 mt-2 tracking-tight">
          सत्तू कॉर्नर खोजक (Sattu Stall Finder)
        </h3>
        <p className="text-stone-500 text-xs mt-1">
          Explore legendary, authentic local stalls across Bihar serving raw culinary excellence for decades.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT: Stall List */}
        <div className="lg:col-span-6 space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
          {famousStalls.map((stall) => {
            const isSelected = selectedStall.name === stall.name;
            return (
              <div
                key={stall.name}
                onClick={() => setSelectedStall(stall)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex justify-between items-start gap-3 ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/20 shadow-sm"
                    : "border-stone-150 bg-stone-50/40 hover:bg-stone-50"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-stone-900">{stall.name}</span>
                    {isSelected && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Selected
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{stall.location}</span>
                  </div>
                  <div className="text-xs text-emerald-800 font-medium flex items-center gap-1 mt-1.5">
                    <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{stall.specialty}</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{stall.rating}</span>
                  </div>
                  <span className="text-stone-800 text-sm font-bold mt-2 flex items-center font-mono">
                    <IndianRupee className="w-3 h-3 text-stone-600" /> {stall.price} <span className="text-[10px] text-stone-400 font-normal ml-0.5">/ glass</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Interactive Bihar Sattu Map */}
        <div className="lg:col-span-6 bg-stone-50 border border-stone-200/80 rounded-3xl p-6 flex flex-col justify-between h-[380px] relative overflow-hidden">
          {/* Abstract Grid background */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-30 pointer-events-none">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-stone-300" />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-emerald-800 mb-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-widest font-mono">
                Interactive Grid Map of Bihar
              </span>
            </div>
            <p className="text-stone-400 text-[10px]">
              Virtual grid highlighting Sattu culinary zones (Patna, Gaya, Mithilanchal)
            </p>
          </div>

          {/* Map Area */}
          <div className="relative flex-1 bg-stone-100 rounded-2xl border border-stone-200/60 my-4 overflow-hidden shadow-inner">
            {/* Outline representing Bihar shape abstractly */}
            <svg className="absolute inset-0 w-full h-full text-stone-200/50 fill-stone-200/10 stroke-stone-300 stroke-2 pointer-events-none">
              <path d="M 20,40 Q 40,20 60,30 T 90,40 T 80,80 T 40,70 Z" />
            </svg>

            {/* Render Stall Markers */}
            {famousStalls.map((stall) => {
              const isSelected = selectedStall.name === stall.name;
              return (
                <div
                  key={stall.name}
                  onClick={() => setSelectedStall(stall)}
                  style={{
                    left: `${stall.coordinates.x}%`,
                    top: `${stall.coordinates.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 group"
                >
                  <div className="relative flex flex-col items-center">
                    {/* Tooltip on hover/active */}
                    <div className={`absolute bottom-full mb-1.5 px-2 py-1 bg-stone-900 text-white rounded text-[9px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow transition-opacity ${
                      isSelected ? "opacity-100 bg-emerald-950" : ""
                    }`}>
                      {stall.name}
                    </div>

                    {/* Marker Pin */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-md transition-all ${
                      isSelected 
                        ? "bg-emerald-600 border-white text-white scale-125 ring-4 ring-emerald-600/15" 
                        : "bg-white border-stone-300 text-amber-500 hover:scale-110"
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Info footer */}
          <div className="bg-stone-900 text-stone-100 p-3.5 rounded-2xl flex items-center justify-between border border-stone-800 z-10">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase block tracking-wider leading-none">
                Active Zone
              </span>
              <span className="text-sm font-bold block mt-1 leading-tight">{selectedStall.name}</span>
              <span className="text-[10px] text-stone-400 mt-0.5 block font-sans">{selectedStall.location}</span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-emerald-400 text-xs font-bold block">{selectedStall.specialty.split(" with ")[0]}</span>
              <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">Rs.{selectedStall.price} Per Serving</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
