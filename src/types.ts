export type WaterType = 'chilled' | 'normal' | 'buttermilk';
export type SattuStyle = 'namkeen' | 'meetha';
export type SweetenerType = 'jaggery' | 'sugar' | 'none';

export interface SattuCustomizerOptions {
  sattuSpoons: number; // 1 to 6 spoons (each spoon approx 10g sattu)
  waterType: WaterType;
  style: SattuStyle;
  lemonJuice: boolean;
  blackSalt: boolean;
  roastedCumin: boolean;
  onion: boolean;
  greenChili: 'none' | 'mild' | 'spicy';
  mintLeaves: boolean;
  ginger: boolean;
  sweetener: SweetenerType;
  sweetenerAmount: number; // in spoons (1 to 3)
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  fat: number;
  iron: number; // in % of Daily Value
  sodium: number; // in mg
  waterContent: number; // in ml
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface SattuStore {
  name: string;
  location: string;
  specialty: string;
  rating: number;
  coordinates: { x: number; y: number }; // abstract grid coordinates for local store finder mockup
  price: number;
}

export interface FeedbackReview {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
  style: string;
}
