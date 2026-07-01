import { useState, useEffect } from "react";
import { SattuOrder, subscribeToAllOrders, updateOrderStatus } from "../firebase";
import { 
  X, 
  ShoppingBag, 
  TrendingUp, 
  Activity, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  SlidersHorizontal,
  ChevronDown,
  CheckCircle,
  Truck,
  Flame,
  Award,
  DollarSign,
  Briefcase,
  Search,
  Grid
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SattuAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SattuAdminPanel({ isOpen, onClose }: SattuAdminPanelProps) {
  const [orders, setOrders] = useState<SattuOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    // Real-time listener for ALL orders
    const unsubscribe = subscribeToAllOrders((data) => {
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle status updates
  const handleUpdateStatus = async (orderId: string, currentStatus: SattuOrder["status"], direction: "next" | "prev") => {
    const statuses: SattuOrder["status"][] = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
    const currentIndex = statuses.indexOf(currentStatus);
    let nextIndex = currentIndex;

    if (direction === "next" && currentIndex < statuses.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === "prev" && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex !== currentIndex) {
      try {
        await updateOrderStatus(orderId, statuses[nextIndex]);
      } catch (e) {
        console.error("Failed to update status", e);
      }
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.status === "Delivered" ? order.totalAmount : 0), 0);
  const totalGlassesSold = orders.reduce((sum, order) => sum + (order.status === "Delivered" ? order.quantity : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status !== "Delivered").length;
  const bulkOrdersCount = orders.filter(o => o.orderType === "bulk").length;

  // Filter & Search logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userPhone.includes(searchQuery) ||
      (order.id && order.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesType = filterType === "All" || order.orderType === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="fixed inset-0 z-[120] bg-stone-900/60 backdrop-blur-md flex justify-end p-0 md:p-4">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="bg-stone-50 w-full max-w-5xl h-full md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-l border-stone-200"
      >
        {/* Admin Panel Header */}
        <div className="bg-stone-900 text-stone-100 p-6 flex items-center justify-between border-b border-stone-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-stone-950 font-black text-lg">
              प्र
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Bihar Sattu Hub Admin Panel</h3>
              <p className="text-[10px] text-stone-400 uppercase font-mono tracking-wider">सत्तू प्रशासनिक नियंत्रण केंद्र • LIVE FIRESTORE SYNC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 p-2 rounded-full hover:bg-stone-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* Real-time Analytics Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Revenue */}
            <div className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-inner-sm">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Delivered Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-black text-stone-900 font-mono">₹{totalRevenue}</span>
              <span className="text-[10px] text-emerald-700 block mt-1 font-semibold">● Real-time Earnings</span>
            </div>

            {/* Glasses Sold */}
            <div className="bg-white border border-stone-200/80 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Glasses Served</span>
                <ShoppingBag className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-stone-900 font-mono">{totalGlassesSold} Cups</span>
              <span className="text-[10px] text-amber-600 block mt-1 font-semibold">● High nutrition delivered</span>
            </div>

            {/* Active Orders */}
            <div className="bg-white border border-stone-200/80 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Orders</span>
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-black text-stone-900 font-mono">{pendingOrdersCount} Waitlist</span>
              <span className="text-[10px] text-blue-600 block mt-1 font-semibold">● Requires fast packing</span>
            </div>

            {/* Bulk Events */}
            <div className="bg-white border border-stone-200/80 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Bulk Events</span>
                <Briefcase className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-2xl font-black text-stone-900 font-mono">{bulkOrdersCount} Inquiries</span>
              <span className="text-[10px] text-purple-600 block mt-1 font-semibold">● Catering inquiries</span>
            </div>

          </div>

          {/* Filtering and Search Controls */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search phone, email, client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-bold uppercase shrink-0">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-bold uppercase shrink-0">Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="regular">Regular Cup</option>
                <option value="bulk">Bulk Event Inquiry</option>
              </select>
            </div>

          </div>

          {/* Main Table/Card grid listing */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                Showing {filteredOrders.length} of {orders.length} orders
              </h4>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-stone-500 font-bold">Synchronizing database orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h5 className="text-sm font-bold text-stone-600">No matching orders found</h5>
                <p className="text-xs text-stone-400 mt-1">Adjust your filter options or search queries.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="bg-white border border-stone-200/90 rounded-2xl p-5 hover:shadow-sm transition-all"
                  >
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3 mb-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-stone-950 text-sm">
                            {order.userName}
                          </span>
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${order.orderType === "bulk" ? "bg-amber-100 text-amber-950 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-100"} uppercase border`}>
                            {order.orderType}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            ID: #{order.id?.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        {/* Display User Email and Phone */}
                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          <span className="flex items-center gap-1 font-medium text-stone-700">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            UID: {order.userId}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            {order.userEmail}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            +91 {order.userPhone}
                          </span>
                        </div>
                      </div>

                      {/* Status controllers */}
                      <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-xl border border-stone-200/50">
                        <button
                          onClick={() => handleUpdateStatus(order.id!, order.status, "prev")}
                          disabled={order.status === "Pending"}
                          className="px-2 py-1 text-xs font-bold text-stone-500 hover:text-stone-900 disabled:opacity-40 cursor-pointer"
                          title="Demote status"
                        >
                          ◀
                        </button>
                        <span className="text-xs font-bold text-stone-900 px-2 uppercase font-sans tracking-wide">
                          {order.status}
                        </span>
                        <button
                          onClick={() => handleUpdateStatus(order.id!, order.status, "next")}
                          disabled={order.status === "Delivered"}
                          className="px-2 py-1 text-xs font-bold text-stone-500 hover:text-stone-900 disabled:opacity-40 cursor-pointer"
                          title="Promote status"
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    {/* Middle Info panels */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      
                      {/* Recipe customization specifications */}
                      <div className="space-y-1">
                        <span className="font-extrabold text-stone-900 block">Sattu Customization</span>
                        <div className="text-stone-600 space-y-0.5">
                          <div>• Style: <span className="font-bold text-amber-900 capitalize">{order.customization.style}</span></div>
                          <div>• Ground flour: <span className="font-bold">{order.customization.sattuSpoons} spoons ({order.customization.sattuSpoons * 10}g)</span></div>
                          <div>• Liquid: <span className="font-bold capitalize">{order.customization.waterType}</span></div>
                          {order.customization.style === "namkeen" ? (
                            <div>• Onion: <span className="font-bold">{order.customization.onion ? "Yes" : "No"}</span>, Chili: <span className="font-bold capitalize">{order.customization.greenChili}</span></div>
                          ) : (
                            <div>• Sweetener: <span className="font-bold capitalize">{order.customization.sweetener}</span> ({order.customization.sweetenerAmount} spoons)</div>
                          )}
                        </div>
                      </div>

                      {/* Location & Delivery Specifications */}
                      <div className="space-y-1">
                        <span className="font-extrabold text-stone-900 block flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" /> Destination Address
                        </span>
                        <p className="text-stone-600 font-medium leading-relaxed bg-stone-50 p-2 rounded-lg border border-stone-100 whitespace-pre-line">
                          {order.deliveryAddress}
                        </p>
                      </div>

                      {/* Customer Signature Verification */}
                      <div className="space-y-1">
                        <span className="font-extrabold text-stone-900 block">✍️ Verified Customer Sign</span>
                        {order.customerSignature ? (
                          <div className="bg-white p-1 rounded-lg border border-stone-200 flex items-center justify-center h-[55px] overflow-hidden">
                            <img 
                              src={order.customerSignature} 
                              alt="Customer Signature" 
                              className="max-h-[50px] max-w-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-lg border border-red-100 leading-tight">
                            ⚠️ UNSIGNED ORDER
                          </div>
                        )}
                        <span className="text-[9px] text-stone-400 block mt-0.5 font-mono uppercase">PROOF OF RECEIPT</span>
                      </div>

                      {/* Financial billing summary */}
                      <div className="bg-stone-50 border border-stone-200/50 p-3 rounded-xl flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-stone-400 block uppercase font-mono">Invoice</span>
                            <span className="font-bold text-stone-800">{order.quantity} Cups × ₹{order.orderType === "bulk" ? "25" : "30"}</span>
                          </div>
                          <span className="text-lg font-black text-stone-950 font-mono">
                            ₹{order.totalAmount}
                          </span>
                        </div>
                        
                        {order.orderType === "bulk" && order.bulkDetails && (
                          <div className="mt-2 pt-2 border-t border-stone-200/50 text-[10px] text-amber-900 leading-tight">
                            <div className="font-bold">⭐ Catering Inquire Details:</div>
                            <div>• Event: {order.bulkDetails.eventName}</div>
                            <div>• Date: {order.bulkDetails.deliveryDate}</div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
