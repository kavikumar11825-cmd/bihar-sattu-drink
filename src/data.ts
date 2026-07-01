import { SattuCustomizerOptions, NutritionInfo, SattuStore, FeedbackReview } from "./types";

// Dynamic Nutrition Calculator
export function calculateNutrition(options: SattuCustomizerOptions): NutritionInfo {
  const baseSattuWeight = options.sattuSpoons * 10; // 10g per spoon

  // Sattu flour nutrition per 10g:
  // Calories: 38, Protein: 2.1g, Carbs: 6.5g, Fiber: 1.4g, Fat: 0.6g, Iron: 3.5% DV, Sodium: 2mg
  let calories = options.sattuSpoons * 38;
  let protein = options.sattuSpoons * 2.1;
  let carbs = options.sattuSpoons * 6.5;
  let fiber = options.sattuSpoons * 1.4;
  let fat = options.sattuSpoons * 0.6;
  let iron = options.sattuSpoons * 3.5;
  let sodium = options.sattuSpoons * 2;
  const waterContent = 300; // 300 ml glass

  // Adjust for water/buttermilk base
  if (options.waterType === "buttermilk") {
    calories += 40;
    protein += 3.2;
    carbs += 4.5;
    fat += 1.8;
    sodium += 150; // default buttermilk sodium
  }

  // Adjust for sweetener
  if (options.style === "meetha") {
    if (options.sweetener === "jaggery") {
      calories += options.sweetenerAmount * 38;
      carbs += options.sweetenerAmount * 9.5;
      iron += options.sweetenerAmount * 4; // jaggery is rich in iron
    } else if (options.sweetener === "sugar") {
      calories += options.sweetenerAmount * 46;
      carbs += options.sweetenerAmount * 12;
    }
  }

  // Adjust for other ingredients
  if (options.blackSalt && options.style === "namkeen") {
    sodium += 380; // significant black salt sodium boost
  }
  if (options.onion && options.style === "namkeen") {
    calories += 6;
    carbs += 1.4;
    fiber += 0.3;
  }
  if (options.lemonJuice) {
    calories += 2;
    carbs += 0.6;
  }

  return {
    calories: Math.round(calories),
    protein: parseFloat(protein.toFixed(1)),
    carbs: parseFloat(carbs.toFixed(1)),
    fiber: parseFloat(fiber.toFixed(1)),
    fat: parseFloat(fat.toFixed(1)),
    iron: Math.round(iron),
    sodium: Math.round(sodium),
    waterContent,
  };
}

// Famous Traditional Bihar Sattu Recipes
export const traditionalRecipes = [
  {
    id: "namkeen-patna",
    name: "Patna Junction Namkeen Tadka",
    hindiName: "पटना जंक्शन नमकीन तड़का",
    description: "The absolute classic. Spicy, salty, and fully loaded with crunchy onions, refreshing mint, and green chilies. Instantly cools you down on a hot summer afternoon.",
    style: "namkeen" as const,
    options: {
      sattuSpoons: 4,
      waterType: "chilled" as const,
      style: "namkeen" as const,
      lemonJuice: true,
      blackSalt: true,
      roastedCumin: true,
      onion: true,
      greenChili: "mild" as const,
      mintLeaves: true,
      ginger: true,
      sweetener: "none" as const,
      sweetenerAmount: 0,
    },
  },
  {
    id: "meetha-gaya",
    name: "Gaya Dham Gur-Sattu Amrit",
    hindiName: "गया धाम गुड़-सत्तू अमृत",
    description: "A rich, sweet blend sweetened with pure desi jaggery (gur) and a touch of cardamom. Packed with iron, it acts as a phenomenal instant energy booster.",
    style: "meetha" as const,
    options: {
      sattuSpoons: 4,
      waterType: "normal" as const,
      style: "meetha" as const,
      lemonJuice: false,
      blackSalt: true, // a tiny pinch of salt balances sweet!
      roastedCumin: false,
      onion: false,
      greenChili: "none" as const,
      mintLeaves: false,
      ginger: false,
      sweetener: "jaggery" as const,
      sweetenerAmount: 2,
    },
  },
  {
    id: "chaas-darbhanga",
    name: "Mithila Mattha Sattu Shaker",
    hindiName: "मिथिला मट्ठा सत्तू शेकर",
    description: "Sattu dissolved in cool spice-infused buttermilk (mattha) instead of water. Incredibly creamy, deeply satisfying, and perfect for complete gut health.",
    style: "namkeen" as const,
    options: {
      sattuSpoons: 3,
      waterType: "buttermilk" as const,
      style: "namkeen" as const,
      lemonJuice: true,
      blackSalt: true,
      roastedCumin: true,
      onion: false,
      greenChili: "mild" as const,
      mintLeaves: true,
      ginger: false,
      sweetener: "none" as const,
      sweetenerAmount: 0,
    },
  },
];

// Superfood Health Benefits of Sattu
export const sattuBenefits = [
  {
    title: "Natural Body Cooler",
    hindiTitle: "प्राकृतिक शीतलक",
    desc: "Sattu has intense cooling properties. In Bihar, it is the ultimate natural shield against 'Loo' (scorching heatwaves) during dry summer months.",
    icon: "ThermometerSnowflake",
    color: "bg-cyan-50 border-cyan-100 text-cyan-700",
  },
  {
    title: "Powerhouse of Plant Protein",
    hindiTitle: "प्रोटीन का खजाना",
    desc: "Often called the 'Desi Protein Shake'. Roasted Bengal gram flour provides high-quality plant protein (approx 20g per 100g) that fuels muscle and stamina.",
    icon: "Flame",
    color: "bg-amber-50 border-amber-100 text-amber-700",
  },
  {
    title: "Outstanding Digestion & Fiber",
    hindiTitle: "पाचन और फाइबर",
    desc: "Rich in insoluble fiber, it cleanses the colon, cures chronic constipation, regulates bowel movements, and detoxifies the stomach.",
    icon: "ShieldCheck",
    color: "bg-emerald-50 border-emerald-100 text-emerald-700",
  },
  {
    title: "Diabetic & Heart Friendly",
    hindiTitle: "मधुमेह के लिए वरदान",
    desc: "Has a very low Glycemic Index (GI). It releases sugars slowly and steadily into the bloodstream, making it a perfect meal for managing diabetes and cholesterol.",
    icon: "HeartPulse",
    color: "bg-rose-50 border-rose-100 text-rose-700",
  },
  {
    title: "Weight Management Marvel",
    hindiTitle: "वजन नियंत्रण",
    desc: "Being highly filling and fiber-rich, a single glass keeps you satiated for hours, preventing unhealthy snacking and boosting dynamic metabolism.",
    icon: "Activity",
    color: "bg-indigo-50 border-indigo-100 text-indigo-700",
  },
  {
    title: "Instant Desi Energy",
    hindiTitle: "त्वरित ऊर्जा स्रोत",
    desc: "Rich in vital minerals like iron, manganese, and magnesium. It replenishes lost salts and hydrates the body instantly under heavy physical labor or hot sun.",
    icon: "Zap",
    color: "bg-yellow-50 border-yellow-100 text-yellow-700",
  },
];

// Sattu Stalls Mockup ( Bihar Sattu Drive )
export const famousStalls: SattuStore[] = [
  {
    name: "Maurya Lok Sattu Bhandar",
    location: "Maurya Lok Complex, Patna",
    specialty: "Namkeen Sattu with Extra Onion & Green Chillies",
    rating: 4.9,
    coordinates: { x: 30, y: 40 },
    price: 25,
  },
  {
    name: "Gaya Junction Desi Gur Sattu",
    location: "Station Road, Gaya",
    specialty: "Authentic Jaggery & Cardamom Sweet Sattu",
    rating: 4.8,
    coordinates: { x: 45, y: 65 },
    price: 30,
  },
  {
    name: "Mithila Lassi & Sattu Stall",
    location: "Darbhanga Tower, Darbhanga",
    specialty: "Mattha (Buttermilk) Sattu blended in Clay Pots",
    rating: 4.7,
    coordinates: { x: 70, y: 35 },
    price: 35,
  },
  {
    name: "Saurath Sattu Amrit",
    location: "Madhubani",
    specialty: "Traditional Roasted Barley & Gram Sattu Drink",
    rating: 4.9,
    coordinates: { x: 80, y: 25 },
    price: 20,
  },
];

// Reviews from Sattu Enthusiasts
export const initialReviews: FeedbackReview[] = [
  {
    id: "1",
    name: "Amit Kumar",
    city: "Patna",
    rating: 5,
    comment: "गजब स्वाद है भैया! हर रोज सुबह पटना जंक्शन वाला स्वाद याद आ जाता है। गर्मी में ये सत्तू अमृत से कम नहीं है।",
    date: "2026-06-28",
    style: "Namkeen Style",
  },
  {
    id: "2",
    name: "Ranjana Singh",
    city: "Muzaffarpur",
    rating: 5,
    comment: "Healthy, fully filling, and beats any expensive protein powder. The Jaggery (Meetha) Sattu customized here tastes exactly like what my grandmother used to make.",
    date: "2026-06-25",
    style: "Gur Sweet Style",
  },
  {
    id: "3",
    name: "Aditya Mishra",
    city: "Darbhanga",
    rating: 5,
    comment: "Sattu with buttermilk (mattha) is a match made in heaven. I highly recommend trying the customizer with buttermilk base. Unbelievably soothing for the stomach!",
    date: "2026-06-20",
    style: "Mattha Sattu",
  },
];
