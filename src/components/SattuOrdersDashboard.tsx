import { useState, useEffect } from "react";
import { SattuUser, SattuOrder, subscribeToUserOrders } from "../firebase";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  Sparkles, 
  Award, 
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  Sliders,
  ChevronDown,
  Activity,
  HeartHandshake
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SattuOrdersDashboardProps {
  user: SattuUser;
  onLogout: () => void;
  onOpenAdminPanel: () => void;
}

export default function SattuOrdersDashboard({ user, onLogout, onOpenAdminPanel }: SattuOrdersDashboardProps) {
  const [orders, setOrders] = useState<SattuOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Real-time listener for user orders
    const unsubscribe = subscribeToUserOrders(user.uid, (data) => {
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const getStatusColor = (status: SattuOrder["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-stone-100 text-stone-700 border-stone-200";
      case "Preparing":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Out for Delivery":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-stone-50 text-stone-600";
    }
  };

  const getStatusStep = (status: SattuOrder["status"]) => {
    switch (status) {
      case "Pending": return 1;
      case "Preparing": return 2;
      case "Out for Delivery": return 3;
      case "Delivered": return 4;
      default: return 1;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200/80">
      
      {/* Upper Grid: Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-200/60 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md font-bold text-xl relative">
            {user.name.charAt(0).toUpperCase()}
            {user.role === "admin" && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-950 text-[8px] font-black uppercase px-1 py-0.5 rounded-full border border-white">
                Admin
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-stone-900 tracking-tight leading-none">
                {user.name}
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            
            {/* Displaying User ID, Email and Mobile as requested */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <span className="font-bold text-stone-700">User ID:</span> {user.uid}
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                {user.email}
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                +91 {user.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {user.role === "admin" && (
            <button
              onClick={onOpenAdminPanel}
              className="flex-1 md:flex-initial bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              Open Admin Portal
            </button>
          )}

          <button
            onClick={onLogout}
            className="flex-1 md:flex-initial bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid: Orders List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            Your Order History / आपकी ऑर्डर्स
          </h4>
          <span className="text-[10px] bg-stone-100 text-stone-600 border border-stone-200/60 font-bold px-2 py-0.5 rounded-full font-mono">
            {orders.length} Order(s)
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-stone-400 font-medium">Loading real-time order states...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold text-stone-700">No orders placed yet</h5>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
              Scroll up to our Interactive Customizer to construct and order your bespoke summer superfood cooler!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const step = getStatusStep(order.status);
              const isExpanded = expandedOrderId === order.id;

              return (
                <div 
                  key={order.id}
                  className="border border-stone-200/80 rounded-2xl p-4 hover:shadow-sm transition-all bg-white"
                >
                  <div 
                    onClick={() => setExpandedOrderId(isExpanded ? null : (order.id || null))}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${order.orderType === "bulk" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-100"} uppercase border`}>
                          {order.orderType}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ID: #{order.id?.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <h5 className="text-xs text-stone-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Placed: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </h5>
                    </div>

                    <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t border-stone-100 pt-2.5 sm:pt-0 sm:border-0">
                      <div className="text-right">
                        <span className="text-[9px] text-stone-400 block font-mono">ORDER COST</span>
                        <span className="text-sm font-black text-stone-900 font-mono">₹{order.totalAmount}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-stone-400 block font-mono">QUANTITY</span>
                        <span className="text-sm font-black text-emerald-800 font-mono">{order.quantity} Glass(es)</span>
                      </div>
                      <div className="text-stone-400 p-1">
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Order details with status meter */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4 pt-4 border-t border-stone-150 space-y-4"
                      >
                        {/* Live Delivery Progress Tracker */}
                        <div className="py-2">
                          <span className="text-[10px] text-stone-400 block mb-3 uppercase font-mono tracking-widest font-semibold">Live status tracking</span>
                          <div className="relative flex justify-between">
                            {/* Connecting line */}
                            <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-100 -z-0" />
                            <div 
                              className="absolute top-4 left-4 h-0.5 bg-emerald-500 -z-0 transition-all duration-500" 
                              style={{ width: `${((step - 1) / 3) * 100}%` }}
                            />

                            {/* Steps */}
                            {[
                              { label: "Ordered", desc: "कन्फर्म" },
                              { label: "Preparing", desc: "तैयार हो रहा है" },
                              { label: "Out for Delivery", desc: "रास्ते में" },
                              { label: "Delivered", desc: "मिल गया" },
                            ].map((s, idx) => {
                              const active = idx + 1 <= step;
                              return (
                                <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                                  <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${active ? "bg-emerald-600 border-emerald-600 text-white shadow-sm" : "bg-white border-stone-200 text-stone-400"}`}>
                                    {idx + 1}
                                  </div>
                                  <span className={`text-[10px] font-bold mt-1.5 block ${active ? "text-stone-900" : "text-stone-400"}`}>
                                    {s.label}
                                  </span>
                                  <span className="text-[8px] text-stone-400 leading-none">
                                    {s.desc}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-200/50 mt-2">
                          <div className="space-y-1.5">
                            <span className="font-bold text-stone-900 block border-b border-stone-200/60 pb-0.5">Order Metadata</span>
                            <div>• <span className="font-medium">Drink profile:</span> <span className="font-semibold capitalize text-amber-900">{order.customization.style} Sattu</span></div>
                            <div>• <span className="font-medium">Water base:</span> <span className="font-semibold capitalize">{order.customization.waterType}</span></div>
                            <div>• <span className="font-medium">Flour spoons:</span> <span className="font-semibold">{order.customization.sattuSpoons} spoons ({order.customization.sattuSpoons * 10}g)</span></div>
                            {order.orderType === "bulk" && order.bulkDetails && (
                              <div className="mt-2 pt-2 border-t border-stone-200/40 text-amber-900 font-medium">
                                <div>⭐ <span className="font-bold">Event Details:</span></div>
                                <div className="pl-3">• Venue Event: {order.bulkDetails.eventName}</div>
                                <div className="pl-3">• Catering Date: {order.bulkDetails.deliveryDate}</div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <span className="font-bold text-stone-900 block border-b border-stone-200/60 pb-0.5">Delivery Specifications</span>
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium">Venue / Destination:</span>
                                <p className="font-semibold text-stone-850 mt-0.5 whitespace-pre-line">{order.deliveryAddress}</p>
                              </div>
                            </div>
                            {order.customerSignature && (
                              <div className="mt-3 pt-2 border-t border-stone-200/50">
                                <span className="text-[10px] text-stone-400 block mb-1 uppercase font-mono tracking-wider">✍️ Authorized Signoff</span>
                                <div className="bg-white p-1 rounded-lg border border-stone-200/60 inline-block">
                                  <img 
                                    src={order.customerSignature} 
                                    alt="Authorized Signoff" 
                                    className="max-h-[45px] object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100/40">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-600" />
          <div className="leading-tight">
            <span className="text-xs font-bold text-emerald-950 block">Pure Desi Cleanliness Guaranteed</span>
            <span className="text-[10px] text-stone-500">Traditional earthen-pot style ground gram.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
