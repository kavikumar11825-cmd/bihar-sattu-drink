import { sattuBenefits } from "../data";
import { 
  ThermometerSnowflake, 
  Flame, 
  ShieldCheck, 
  HeartPulse, 
  Activity, 
  Zap,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";

// Dynamic Icon Mapper
const iconMap: Record<string, any> = {
  ThermometerSnowflake,
  Flame,
  ShieldCheck,
  HeartPulse,
  Activity,
  Zap,
};

export default function BenefitsBento() {
  return (
    <div id="benefits-bento-root">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-600 bg-amber-50 border border-amber-200/50 px-3 py-1 rounded-full uppercase">
          Nature's Energy drink / देसी सुपरफूड
        </span>
        <h2 className="text-3xl font-extrabold text-stone-950 mt-4 tracking-tight leading-none sm:text-4xl">
          सत्तू पीने के बेमिसाल फायदे
        </h2>
        <p className="text-stone-500 text-sm mt-3 leading-relaxed">
          Sattu is not just a tasty beverage—it is a nutrient-dense powerhouse packed with calcium, iron, manganese, and premium plant proteins. Here is why Bihar's traditional drink is the ultimate modern wellness beverage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sattuBenefits.map((benefit, idx) => {
          const IconComponent = iconMap[benefit.icon] || Zap;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-6 rounded-3xl border-2 hover:shadow-md transition-all group flex flex-col justify-between ${benefit.color}`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4 border border-stone-100 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
                  {benefit.title}
                </h3>
                <span className="text-xs font-medium text-stone-500/90 block mt-0.5 font-sans">
                  {benefit.hindiTitle}
                </span>
                <p className="text-stone-600 text-xs leading-relaxed mt-2.5">
                  {benefit.desc}
                </p>
              </div>

              {/* Little bottom hint */}
              <div className="mt-6 flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
                <span>Verified Desi Power</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
