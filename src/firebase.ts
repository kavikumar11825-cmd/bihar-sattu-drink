import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  onSnapshot, 
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { SattuCustomizerOptions } from "./types";

// Firebase Config
const firebaseConfig = {
  projectId: "woven-smoke-32gpt",
  appId: "1:540341709496:web:a4a3e4893fbcb512c5e24d",
  apiKey: "AIzaSyA6Mr1QLP-EwIsogKnjDBua5EnmJ6yzS0k",
  authDomain: "woven-smoke-32gpt.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-biharsattudrink-693adab6-018c-4be5-8fe2-7b306a0c52ea",
  storageBucket: "woven-smoke-32gpt.firebasestorage.app",
  messagingSenderId: "540341709496",
};

// Initialize App
const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the specific databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

// Authentication and User Interfaces
export interface SattuUser {
  uid: string;
  email: string;
  phone: string;
  name: string;
  address: string; // Strictly mandatory address
  role: "user" | "admin";
  createdAt: any;
}

export interface SattuOrder {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  customization: SattuCustomizerOptions;
  quantity: number;
  orderType: "regular" | "bulk";
  bulkDetails?: {
    eventName?: string;
    deliveryDate?: string;
    specialInstructions?: string;
  };
  deliveryAddress: string;
  customerSignature?: string; // Digital signature image data or text
  status: "Pending" | "Preparing" | "Out for Delivery" | "Delivered";
  createdAt: any;
  totalAmount: number;
}

// ---------------- AUTH OPERATIONS ----------------

// Local persistent current user helpers
const USER_KEY = "sattu_current_user";

export function getLocalUser(): SattuUser | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function setLocalUser(user: SattuUser | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

// Handle login with Email, Mobile Number and Address (Creating or fetching user record)
export async function authenticateSattuUser(email: string, phone: string, name: string, address: string): Promise<SattuUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();
  const userId = `u_${normalizedPhone || Math.random().toString(36).substr(2, 9)}`;

  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  let userRole: "user" | "admin" = "user";
  // If the user email is kavikumar11825@gmail.com, make them admin!
  if (normalizedEmail === "kavikumar11825@gmail.com" || normalizedEmail.includes("admin")) {
    userRole = "admin";
  }

  let userData: SattuUser;

  if (userDoc.exists()) {
    userData = userDoc.data() as SattuUser;
    let needsUpdate = false;
    // ensure role is correct
    if (normalizedEmail === "kavikumar11825@gmail.com" && userData.role !== "admin") {
      userData.role = "admin";
      needsUpdate = true;
    }
    // Update address if missing or changed
    if ((!userData.address || userData.address !== address.trim()) && address.trim()) {
      userData.address = address.trim();
      needsUpdate = true;
    }
    if (needsUpdate) {
      await updateDoc(userDocRef, { role: userData.role, address: userData.address || "" });
    }
  } else {
    userData = {
      uid: userId,
      email: normalizedEmail,
      phone: normalizedPhone,
      name: name.trim() || "Lovely Guest",
      address: address.trim(),
      role: userRole,
      createdAt: new Date().toISOString()
    };
    await setDoc(userDocRef, userData);
  }

  setLocalUser(userData);
  return userData;
}

// ---------------- ORDER OPERATIONS ----------------

// Create regular customizer order
export async function createOrder(
  user: SattuUser,
  customization: SattuCustomizerOptions,
  quantity: number,
  deliveryAddress: string,
  totalAmount: number,
  customerSignature?: string
): Promise<string> {
  const orderData: Omit<SattuOrder, "id"> = {
    userId: user.uid,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    customization,
    quantity,
    orderType: "regular",
    deliveryAddress,
    customerSignature: customerSignature || "",
    status: "Pending",
    createdAt: new Date().toISOString(),
    totalAmount
  };

  const docRef = await addDoc(collection(db, "orders"), orderData);
  return docRef.id;
}

// Create Bulk order inquiry
export async function createBulkOrder(
  user: SattuUser,
  customization: SattuCustomizerOptions,
  quantity: number,
  deliveryAddress: string,
  totalAmount: number,
  eventName: string,
  deliveryDate: string,
  specialInstructions: string,
  customerSignature?: string
): Promise<string> {
  const orderData: Omit<SattuOrder, "id"> = {
    userId: user.uid,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    customization,
    quantity,
    orderType: "bulk",
    bulkDetails: {
      eventName,
      deliveryDate,
      specialInstructions
    },
    deliveryAddress,
    customerSignature: customerSignature || "",
    status: "Pending",
    createdAt: new Date().toISOString(),
    totalAmount
  };

  const docRef = await addDoc(collection(db, "orders"), orderData);
  return docRef.id;
}

// Fetch user orders with real-time updates
export function subscribeToUserOrders(userId: string, callback: (orders: SattuOrder[]) => void) {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snapshot) => {
    const ordersList: SattuOrder[] = [];
    snapshot.forEach((doc) => {
      ordersList.push({ id: doc.id, ...doc.data() } as SattuOrder);
    });
    // Sort locally by date desc
    ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(ordersList);
  });
}

// Fetch all orders for Admin panel with real-time updates
export function subscribeToAllOrders(callback: (orders: SattuOrder[]) => void) {
  const q = query(collection(db, "orders"));

  return onSnapshot(q, (snapshot) => {
    const ordersList: SattuOrder[] = [];
    snapshot.forEach((doc) => {
      ordersList.push({ id: doc.id, ...doc.data() } as SattuOrder);
    });
    ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(ordersList);
  });
}

// Update Order status
export async function updateOrderStatus(orderId: string, status: SattuOrder["status"]) {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status });
}
