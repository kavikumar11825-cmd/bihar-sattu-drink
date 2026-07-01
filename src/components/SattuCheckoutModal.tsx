import { useState, FormEvent, useEffect, useRef } from "react";
import { SattuUser, createOrder, createBulkOrder } from "../firebase";
import { SattuCustomizerOptions } from "../types";
import { X, MapPin, Calendar, ShoppingBag, Truck, Gift, CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SattuCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SattuUser;
  customization: SattuCustomizerOptions;
  mode: "regular" | "bulk"; // regular order vs bulk order
  onOrderCompleted: () => void;
}

export default function SattuCheckoutModal({
  isOpen,
  onClose,
  user,
  customization,
  mode,
  onOrderCompleted
}: SattuCheckoutModalProps) {
  const [quantity, setQuantity] = useState(mode === "bulk" ? 50 : 1);
  const [address, setAddress] = useState("");
  const [eventName, setEventName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Auto-prefill delivery address from user profile on mount / open
  useEffect(() => {
    if (user && user.address && isOpen) {
      setAddress(user.address);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Signature coordinate mapper
  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Scale coordinates to internal canvas resolution
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (e.cancelable) e.preventDefault();

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#047857"; // Emerald deep green signature ink

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  // Pricing calculation
  const pricePerGlass = mode === "bulk" ? 25 : 30; // ₹30 per single cup, ₹25 for bulk
  const totalAmount = quantity * pricePerGlass;

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError("कृपया वितरण पता दर्ज करें / Please enter a valid delivery address.");
      return;
    }

    if (!hasSigned) {
      setError("कृपया ऑर्डर को प्रमाणित करने के लिए नीचे हस्ताक्षर करें / Please hand-sign below to verify and complete the order.");
      return;
    }

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas ? canvas.toDataURL() : "";

    if (mode === "bulk") {
      if (quantity < 20) {
        setError("थोक आर्डर के लिए न्यूनतम मात्रा 20 ग्लास है / Minimum quantity for Bulk orders is 20 glasses.");
        return;
      }
      if (!eventName.trim()) {
        setError("कृपया कार्यक्रम का नाम दर्ज करें / Please enter the Event Name.");
        return;
      }
      if (!deliveryDate) {
        setError("कृपया डिलीवरी तिथि चुनें / Please select a Delivery Date.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "regular") {
        await createOrder(user, customization, quantity, address, totalAmount, signatureDataUrl);
      } else {
        await createBulkOrder(
          user,
          customization,
          quantity,
          address,
          totalAmount,
          eventName,
          deliveryDate,
          specialInstructions,
          signatureDataUrl
        );
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onOrderCompleted();
        onClose();
        // reset forms
        setAddress("");
        setEventName("");
        setDeliveryDate("");
        setSpecialInstructions("");
        setQuantity(mode === "bulk" ? 50 : 1);
        setHasSigned(false);
      }, 2500);
    } catch (err: any) {
      setError("ऑर्डर प्लेस करने में त्रुटि हुई। कृपया पुनः प्रयास करें। / Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-stone-150 relative overflow-hidden my-8"
      >
        {/* Dynamic header colors */}
        <div className={`absolute top-0 left-0 w-full h-1.5 ${mode === "bulk" ? "bg-amber-500" : "bg-emerald-600"}`} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-stone-900">ऑर्डर सफल रहा! 🎉</h3>
              <p className="text-stone-600 text-sm max-w-sm mx-auto">
                {mode === "bulk" 
                  ? "We received your Bulk Order inquiry. Our team is preparing to serve premium, fresh Sattu at your event!" 
                  : "Your refreshing customized Sattu Drink order is being prepared with pure Bihari love and ingredients!"
                }
              </p>
              <p className="text-xs text-stone-400">Please wait while we redirect you to track order status...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              <div>
                <span className={`inline-block text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${mode === "bulk" ? "bg-amber-100 text-amber-950 border border-amber-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"}`}>
                  {mode === "bulk" ? "⭐ HIGH VOLUME BULK INQUIRY" : "🥤 FRESH CUSTOMIZED CUP ORDER"}
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-2">
                  {mode === "bulk" ? "Bulk Event Sattu Catering" : "Confirm Sattu Order"}
                </h3>
                <p className="text-stone-500 text-xs mt-0.5">
                  Confirm the recipe parameters and choose delivery specifications.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
                  {error}
                </div>
              )}

              {/* Order Recipe Summary Box */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-xs text-stone-700 space-y-2">
                <div className="font-bold text-stone-900 border-b border-stone-200 pb-1.5 flex justify-between">
                  <span>Customization Summary</span>
                  <span className="text-emerald-700 font-mono capitalize">{customization.style} Style</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>• Sattu Powder: <span className="font-semibold">{customization.sattuSpoons * 10}g ({customization.sattuSpoons} spoons)</span></div>
                  <div>• Base Liquid: <span className="font-semibold capitalize">{customization.waterType}</span></div>
                  {customization.style === "namkeen" ? (
                    <>
                      <div>• Onion: <span className="font-semibold">{customization.onion ? "Yes" : "No"}</span></div>
                      <div>• Lemon: <span className="font-semibold">{customization.lemonJuice ? "Yes" : "No"}</span></div>
                      <div>• Spiciness: <span className="font-semibold capitalize">{customization.greenChili}</span></div>
                      <div>• Roasted Cumin: <span className="font-semibold">{customization.roastedCumin ? "Yes" : "No"}</span></div>
                    </>
                  ) : (
                    <>
                      <div>• Sweetener: <span className="font-semibold capitalize">{customization.sweetener}</span></div>
                      <div>• Amount: <span className="font-semibold">{customization.sweetenerAmount} spoons</span></div>
                    </>
                  )}
                </div>
              </div>

              {/* Quantity input */}
              <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-200/50">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block text-xs font-semibold text-stone-700">
                      {mode === "bulk" ? "Number of Glasses / मात्रा" : "Glasses Quantity / ग्लास की संख्या"}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {mode === "bulk" ? "Minimum 20 glasses for events" : "Freshly sealed & delivered"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.max(mode === "bulk" ? 20 : 1, prev - (mode === "bulk" ? 10 : 1)))}
                      className="w-8 h-8 rounded-lg bg-white border border-stone-200 shadow-sm flex items-center justify-center font-bold text-stone-600 hover:bg-stone-50 cursor-pointer active:scale-95 transition-all"
                    >
                      -
                    </button>
                    <span className="font-bold text-stone-950 text-sm font-mono min-w-[30px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => prev + (mode === "bulk" ? 10 : 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-stone-200 shadow-sm flex items-center justify-center font-bold text-stone-600 hover:bg-stone-50 cursor-pointer active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Conditional Event details for Bulk */}
              {mode === "bulk" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Event Name / अवसर का नाम</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wedding reception, Office Party"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-850"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Catering Date / डिलीवरी तिथि</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-850"
                    />
                  </div>
                </div>
              )}

              {/* Customer Profile Details Verification */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-xs space-y-2">
                <div className="font-extrabold text-stone-900 border-b border-stone-200 pb-1.5 flex justify-between">
                  <span>📋 Verified Customer Profile / ग्राहक विवरण</span>
                  <span className="text-emerald-700 font-bold uppercase text-[9px] tracking-wide">Strictly Mandatory</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-stone-700">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Client Name:</span>
                    <span className="font-bold text-stone-900">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Mobile Number (ID):</span>
                    <span className="font-bold text-stone-900 font-mono">+91 {user.phone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-400 block text-[10px]">Email Address:</span>
                    <span className="font-bold text-stone-900 font-mono">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Delivery Address / वितरण पता (Mandatory)
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3 text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <textarea
                    required
                    rows={2}
                    placeholder={mode === "bulk" ? "Enter event location, floor, landmark detail..." : "Your home/office full address, landmark, floor..."}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-stone-850"
                  />
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  Address is required. Saved default profile address loaded if available.
                </p>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  {mode === "bulk" ? "Custom Requests & Special Instructions" : "Special Request (Optional)"}
                </label>
                <input
                  type="text"
                  placeholder={mode === "bulk" ? "e.g. serve in earthen clay pots (Kullhad), extra spicy side stall..." : "e.g. make it extra chilled, more mint..."}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-850"
                />
              </div>

              {/* Interactive Signature Pad */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-stone-700">
                    ✍️ Customer Digital Signature / ग्राहक के हस्ताक्षर (Mandatory)
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-[10px] text-stone-500 hover:text-stone-800 underline font-bold"
                  >
                    Clear Signature
                  </button>
                </div>
                
                <div className="relative bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl overflow-hidden h-[110px]">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={110}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair touch-none"
                  />
                  {!hasSigned && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-stone-400 text-xs text-center p-3 select-none">
                      Draw signature here using mouse or touch pad / ऑर्डर प्रमाणित करने के लिए यहाँ साइन करें
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-amber-700 font-semibold leading-tight">
                  * Customer Sign-off: Your digital signature is logged separately to verify the custom order's receipt.
                </p>
              </div>

              {/* Price Calculation details */}
              <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 flex items-center justify-between border border-stone-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-stone-400 block font-mono">BILLING TOTAL</span>
                  <span className="text-xs text-stone-300">
                    {quantity} Glasses × ₹{pricePerGlass} {mode === "bulk" ? "(Bulk Discounted)" : ""}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-400 font-mono">₹{totalAmount}</span>
                  <span className="text-[9px] text-stone-400 block leading-none">Taxes & Delivery included</span>
                </div>
              </div>

              {/* Order Submission actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl transition-all text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer text-white ${mode === "bulk" ? "bg-amber-600 hover:bg-amber-700 disabled:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500"}`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      Place Order (₹{totalAmount})
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
