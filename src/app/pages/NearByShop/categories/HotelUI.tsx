import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Hotel, Star, MapPin, Wifi, Car, Coffee, Wind, UtensilsCrossed,
  ChevronRight, X, Calendar, Users, CheckCircle2, BadgeCheck,
  ArrowLeft, Sparkles, Moon, Sun, Shield, Phone, Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type RoomType = {
  id: string;
  type: string;
  price: number;
  originalPrice?: number;
  beds: number;
  size: string;
  amenities: string[];
  available: number;
  image: string;
};

type HotelData = {
  id: string;
  name: string;
  category: 'budget' | 'standard' | 'luxury' | 'boutique';
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  verified: boolean;
  featured?: boolean;
  image: string;
  thumbnail: string;
  amenities: string[];
  rooms: RoomType[];
  checkIn: string;
  checkOut: string;
  description: string;
};

const HOTEL_CATEGORY_COLORS = {
  budget: { label: 'Budget', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' },
  standard: { label: 'Standard', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  luxury: { label: 'Luxury', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  boutique: { label: 'Boutique', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

const AMENITY_ICONS: Record<string, React.ElementType> = {
  'WiFi': Wifi, 'Parking': Car, 'Restaurant': UtensilsCrossed,
  'AC': Wind, 'Breakfast': Coffee, 'Pool': Sparkles,
};

const HOTELS: HotelData[] = [
  {
    id: 'h1',
    name: 'Skyline Boutique Hotel',
    category: 'boutique',
    location: 'Gulshan 2, Dhaka',
    distance: '0.8 km',
    rating: 4.9,
    reviews: 287,
    verified: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80',
    amenities: ['WiFi', 'Parking', 'Restaurant', 'AC', 'Breakfast', 'Pool'],
    checkIn: '2:00 PM', checkOut: '12:00 PM',
    description: 'A premium boutique hotel with stunning city views and personalised hospitality.',
    rooms: [
      {
        id: 'r1', type: 'Deluxe King', price: 4800, originalPrice: 6000,
        beds: 1, size: '32 sqm', available: 3,
        amenities: ['King Bed', 'City View', 'Mini Bar', 'Work Desk'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80'
      },
      {
        id: 'r2', type: 'Executive Suite', price: 8500, beds: 1, size: '55 sqm', available: 1,
        amenities: ['King Bed', 'Panorama View', 'Lounge', 'Jacuzzi', 'Kitchenette'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80'
      },
      {
        id: 'r3', type: 'Twin Standard', price: 3500, beds: 2, size: '26 sqm', available: 5,
        amenities: ['Twin Beds', 'Garden View', 'Work Desk'],
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80'
      }
    ]
  },
  {
    id: 'h2',
    name: 'Comfort Inn Mirpur',
    category: 'standard',
    location: 'Mirpur 12, Dhaka',
    distance: '2.1 km',
    rating: 4.4,
    reviews: 156,
    verified: true,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c4a49ce3?w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c4a49ce3?w=200&q=80',
    amenities: ['WiFi', 'AC', 'Restaurant'],
    checkIn: '1:00 PM', checkOut: '11:00 AM',
    description: 'Comfortable rooms with all essential amenities in a convenient location.',
    rooms: [
      {
        id: 'r4', type: 'Standard Double', price: 1800, beds: 1, size: '20 sqm', available: 8,
        amenities: ['Double Bed', 'AC', 'TV'],
        image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&q=80'
      },
      {
        id: 'r5', type: 'Standard Twin', price: 1600, beds: 2, size: '18 sqm', available: 4,
        amenities: ['Twin Beds', 'AC', 'TV'],
        image: 'https://images.unsplash.com/photo-1587985064135-0366536eab42?w=400&q=80'
      }
    ]
  },
  {
    id: 'h3',
    name: 'Budget Stay Uttara',
    category: 'budget',
    location: 'Uttara Sector 7, Dhaka',
    distance: '3.5 km',
    rating: 4.0,
    reviews: 92,
    verified: false,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&q=80',
    amenities: ['WiFi', 'AC'],
    checkIn: '12:00 PM', checkOut: '11:00 AM',
    description: 'Clean and affordable rooms perfect for budget travelers.',
    rooms: [
      {
        id: 'r6', type: 'Single Room', price: 800, beds: 1, size: '14 sqm', available: 12,
        amenities: ['Single Bed', 'Fan', 'Shared Bathroom'],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80'
      }
    ]
  }
];

type BookingModal = {
  hotel: HotelData;
  room: RoomType;
};

export function HotelUI({ searchQuery }: { searchQuery: string }) {
  const [expandedHotel, setExpandedHotel] = useState<string | null>('h1');
  const [booking, setBooking] = useState<BookingModal | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingStep, setBookingStep] = useState<'form' | 'confirm' | 'done'>('form');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredHotels = HOTELS.filter(h => {
    const matchesCat = categoryFilter === 'all' || h.category === categoryFilter;
    const matchesSearch = !searchQuery ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const nights = checkInDate && checkOutDate
    ? Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000))
    : 1;

  return (
    <div className="px-4 md:px-6 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
          <Hotel className="w-4.5 h-4.5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-sm font-black text-white">Nearby Hotels</h2>
          <p className="text-[10px] text-zinc-500">Find your perfect stay nearby</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        {[
          { id: 'all', label: 'All Hotels' },
          { id: 'budget', label: 'Budget' },
          { id: 'standard', label: 'Standard' },
          { id: 'luxury', label: 'Luxury' },
          { id: 'boutique', label: 'Boutique' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={cn(
              "shrink-0 px-3.5 py-1.5 rounded-xl border text-[10px] font-black transition-all",
              categoryFilter === cat.id
                ? "bg-purple-500/15 border-purple-500/30 text-purple-400"
                : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Hotel Cards */}
      <div className="space-y-4">
        {filteredHotels.map(hotel => {
          const catStyle = HOTEL_CATEGORY_COLORS[hotel.category];
          const isExpanded = expandedHotel === hotel.id;
          const minPrice = Math.min(...hotel.rooms.map(r => r.price));

          return (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-3xl border overflow-hidden",
                hotel.featured ? "border-purple-500/25 shadow-[0_0_24px_rgba(168,85,247,0.08)]" : "border-white/[0.06]"
              )}
            >
              {/* Hero Image */}
              <div className="relative h-40 overflow-hidden">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {hotel.featured && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-purple-500 text-[9px] font-black text-white flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black border backdrop-blur-sm", catStyle.bg, catStyle.border, catStyle.color)}>
                    {catStyle.label}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-base font-black text-white leading-tight">{hotel.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[11px] font-black text-white">{hotel.rating}</span>
                          <span className="text-[9px] text-white/50">({hotel.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-white/50" />
                          <span className="text-[10px] text-white/70">{hotel.distance}</span>
                        </div>
                        {hotel.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/50">from</p>
                      <p className="text-lg font-black text-purple-300">৳{minPrice}</p>
                      <p className="text-[9px] text-white/40">/night</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="px-4 pt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
                {hotel.amenities.map(am => {
                  const Icon = AMENITY_ICONS[am] || Sparkles;
                  return (
                    <div key={am} className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      <Icon className="w-2.5 h-2.5 text-zinc-500" />
                      <span className="text-[9px] text-zinc-400 font-bold">{am}</span>
                    </div>
                  );
                })}
              </div>

              {/* Toggle Rooms */}
              <button
                onClick={() => setExpandedHotel(isExpanded ? null : hotel.id)}
                className="w-full flex items-center justify-between px-4 py-3 mt-2 text-[11px] font-black"
              >
                <span className="text-zinc-400 uppercase tracking-widest">{hotel.rooms.length} Room Types Available</span>
                <ChevronRight className={cn("w-4 h-4 text-zinc-500 transition-transform", isExpanded && "rotate-90")} />
              </button>

              {/* Rooms */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/[0.05]"
                  >
                    <div className="p-3 space-y-3">
                      {hotel.rooms.map(room => (
                        <div key={room.id} className="rounded-2xl border border-white/[0.06] overflow-hidden bg-black/20">
                          <div className="h-28 relative overflow-hidden">
                            <img src={room.image} alt={room.type} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                              <div>
                                <p className="text-[12px] font-black text-white">{room.type}</p>
                                <p className="text-[10px] text-white/60">{room.size} • {room.beds} {room.beds > 1 ? 'Beds' : 'Bed'}</p>
                              </div>
                              <div className="text-right">
                                {room.originalPrice && (
                                  <p className="text-[9px] text-white/40 line-through">৳{room.originalPrice}</p>
                                )}
                                <p className="text-base font-black text-purple-300">৳{room.price}</p>
                                <p className="text-[8px] text-white/40">/night</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {room.amenities.map(a => (
                                <span key={a} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[9px] text-zinc-400 font-bold">{a}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={cn(
                                "text-[9px] font-black",
                                room.available <= 2 ? "text-red-400" : "text-emerald-400"
                              )}>
                                {room.available <= 2 ? `Only ${room.available} left!` : `${room.available} available`}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setBooking({ hotel, room }); setBookingStep('form'); }}
                                className="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-[11px] font-black transition-all shadow-[0_4px_12px_rgba(168,85,247,0.3)]"
                              >
                                Book Now
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {booking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={e => e.target === e.currentTarget && setBooking(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28 }}
              className="w-full max-w-[500px] bg-[var(--pm-bg)] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-sm font-black text-white">{booking.room.type}</h3>
                  <p className="text-[10px] text-purple-400">{booking.hotel.name}</p>
                </div>
                <button onClick={() => setBooking(null)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {bookingStep === 'form' && (
                  <div className="space-y-4">
                    <div className="h-32 rounded-2xl overflow-hidden border border-white/10">
                      <img src={booking.room.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                          <Sun className="w-3 h-3" /> Check-In
                        </p>
                        <input
                          type="date"
                          value={checkInDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setCheckInDate(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[11px] text-white outline-none focus:border-purple-500/50 [color-scheme:dark]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                          <Moon className="w-3 h-3" /> Check-Out
                        </p>
                        <input
                          type="date"
                          value={checkOutDate}
                          min={checkInDate || new Date().toISOString().split('T')[0]}
                          onChange={e => setCheckOutDate(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[11px] text-white outline-none focus:border-purple-500/50 [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                        <Users className="w-3 h-3" /> Guests
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white"
                        >-</button>
                        <span className="text-lg font-black text-white w-8 text-center">{guests}</span>
                        <button
                          onClick={() => setGuests(Math.min(4, guests + 1))}
                          className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white"
                        >+</button>
                      </div>
                    </div>
                    {checkInDate && checkOutDate && (
                      <div className="p-4 rounded-2xl bg-purple-500/8 border border-purple-500/20">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-zinc-400">৳{booking.room.price} × {nights} nights</span>
                          <span className="text-lg font-black text-purple-300">৳{booking.room.price * nights}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {bookingStep === 'confirm' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-white mb-4">Confirm Booking</h4>
                    {[
                      { label: 'Hotel', value: booking.hotel.name },
                      { label: 'Room', value: booking.room.type },
                      { label: 'Check-In', value: checkInDate || 'TBD' },
                      { label: 'Check-Out', value: checkOutDate || 'TBD' },
                      { label: 'Guests', value: `${guests} Guest${guests > 1 ? 's' : ''}` },
                      { label: 'Total', value: `৳${booking.room.price * nights}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
                        <span className="text-[11px] font-bold text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {bookingStep === 'done' && (
                  <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-8 h-8 text-purple-400" />
                    </motion.div>
                    <div>
                      <h4 className="text-lg font-black text-white">Booking Confirmed!</h4>
                      <p className="text-xs text-zinc-400 mt-1 max-w-[220px] mx-auto">
                        {booking.hotel.name} will send confirmation within 30 minutes.
                      </p>
                    </div>
                    <button
                      onClick={() => setBooking(null)}
                      className="px-6 py-2.5 rounded-xl bg-purple-500 text-white text-[11px] font-black"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {bookingStep !== 'done' && (
                <div className="p-5 border-t border-white/[0.06] flex gap-3">
                  {bookingStep === 'confirm' && (
                    <button
                      onClick={() => setBookingStep('form')}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (bookingStep === 'form') setBookingStep('confirm');
                      else { setBookingStep('done'); toast.success('Hotel booked!'); }
                    }}
                    className="flex-1 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-black text-[12px] uppercase tracking-wide transition-all shadow-[0_4px_20px_rgba(168,85,247,0.35)]"
                  >
                    {bookingStep === 'form' ? 'Continue' : 'Confirm Booking'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
