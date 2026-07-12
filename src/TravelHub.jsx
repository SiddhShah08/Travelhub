import React, { useState, useEffect, useRef } from "react";
import {
  Menu, X, Sun, Moon, MapPin, Star, ChevronRight, ChevronLeft, ChevronDown,
  ChevronUp, Search, Phone, Mail, MessageSquare, Check, Calendar, Send,
  Building2, Compass, Sparkles, ShieldCheck, Globe, Lock, Upload, Camera,
  TrendingUp, Package, LayoutDashboard, Trash2, Pencil, EyeOff, Eye, List,
  SlidersHorizontal, LogOut, Users, ArrowRight, ArrowUpRight, Plus,
  CircleCheck, CircleX, CircleAlert, Wifi, Waves, UtensilsCrossed, Car,
  Wind, Dumbbell, PawPrint, Plane, Bed, BedDouble, Mountain, Maximize2,
  Coffee, Hotel, Quote, Clock as ClockIcon, Image as ImageIcon
} from "lucide-react";

/* ============================================================
   GLOBAL STYLES — fonts, glass, motion, focus, scrollbars
   ============================================================ */
const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.th-root { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
.th-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }

.th-root *:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 3px;
  border-radius: 6px;
}

.th-glass {
  background: rgba(255,255,255,0.10);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.22);
}
.th-glass-nav {
  background: rgba(8,30,28,0.55);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
}
.th-glass-nav-light {
  background: rgba(255,252,246,0.70);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
}

.th-noscroll::-webkit-scrollbar { display: none; }
.th-noscroll { -ms-overflow-style: none; scrollbar-width: none; }

.th-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.th-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

@keyframes th-dash { to { stroke-dashoffset: -240; } }
.th-route-anim { stroke-dasharray: 5 9; animation: th-dash 16s linear infinite; }

@keyframes th-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.th-fade-up { animation: th-fade-up 0.7s cubic-bezier(.21,.79,.32,1) both; }

@keyframes th-pulse-soft { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
.th-pulse-soft { animation: th-pulse-soft 2.4s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .th-root *, .th-root *::before, .th-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

.th-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.th-scrollbar::-webkit-scrollbar-track { background: transparent; }
.th-scrollbar::-webkit-scrollbar-thumb { background: rgba(120,113,108,0.35); border-radius: 99px; }
`;

/* ============================================================
   THEME TOKENS — single source of truth for light/dark surfaces
   ============================================================ */
function useThemeTokens(dark) {
  return {
    page: dark ? "bg-stone-950 text-stone-100" : "bg-stone-50 text-stone-900",
    surface: dark ? "bg-stone-900" : "bg-white",
    surfaceAlt: dark ? "bg-stone-900/60" : "bg-stone-100",
    border: dark ? "border-stone-800" : "border-stone-200",
    text: dark ? "text-stone-100" : "text-stone-900",
    textMuted: dark ? "text-stone-400" : "text-stone-500",
    textFaint: dark ? "text-stone-500" : "text-stone-400",
    cardHover: dark ? "hover:bg-stone-800" : "hover:bg-stone-50",
    ring: dark ? "ring-stone-800" : "ring-stone-200",
    inputBg: dark ? "bg-stone-800" : "bg-white",
    dark,
  };
}

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* ============================================================
   MOCK DATA
   ============================================================ */
const DESTINATIONS = [
  { id: "bali", name: "Bali", country: "Indonesia", blurb: "Emerald rice terraces, cliffside temples, and a slower kind of morning.", img: "1537953773345-d172ccf13cf1", tag: "Tropical" },
  { id: "santorini", name: "Santorini", country: "Greece", blurb: "Whitewashed cliffs over a sunken caldera, built for watching the sky change color.", img: "1570077188670-e3a8d69ac5ff", tag: "Coastal" },
  { id: "swiss-alps", name: "Swiss Alps", country: "Switzerland", blurb: "Glacier air, wood-fired chalets, and a silence you can actually hear.", img: "1530122037265-a5f1f91d3b99", tag: "Mountain" },
  { id: "maldives", name: "Maldives", country: "Indian Ocean", blurb: "A thousand coral islands, and water so clear it erases the horizon line.", img: "1573843981267-be1999ff37cd", tag: "Tropical" },
  { id: "kyoto", name: "Kyoto", country: "Japan", blurb: "Temple bells, maple-lined paths, and a city that still keeps its old rhythms.", img: "1493976040374-85c8e12f0c0e", tag: "Cultural" },
  { id: "tuscany", name: "Tuscany", country: "Italy", blurb: "Vineyard rows, hilltop towns, and long lunches that run into evening.", img: "1523906834658-6e24ef2386f9", tag: "Countryside" },
  { id: "marrakech", name: "Marrakech", country: "Morocco", blurb: "Spice-scented souks, riad courtyards, and the Atlas Mountains on the horizon.", img: "1597212720158-4ca0c1d75bd6", tag: "Desert" },
  { id: "dubai", name: "Dubai", country: "UAE", blurb: "Desert meets skyline — rooftop pools, record towers, golden-hour drives.", img: "1512453979798-5ea266f8880c", tag: "City" },
];

const AMENITY_META = {
  wifi: { label: "Free Wi-Fi", icon: Wifi },
  pool: { label: "Private Pool", icon: Waves },
  breakfast: { label: "Breakfast Included", icon: UtensilsCrossed },
  parking: { label: "Valet Parking", icon: Car },
  aircon: { label: "Air Conditioning", icon: Wind },
  gym: { label: "Fitness Center", icon: Dumbbell },
  pets: { label: "Pet Friendly", icon: PawPrint },
  coffee: { label: "In-Room Coffee Bar", icon: Coffee },
  view: { label: "Panoramic Views", icon: Mountain },
};

const PROPERTIES = [
  {
    id: "ubud-canopy-villa", destinationId: "bali", type: "Villa",
    name: "The Ubud Canopy Villa", location: "Tjampuhan Ridge, Ubud, Bali",
    shortDesc: "A treetop infinity pool over the Tjampuhan ridge, ten minutes from central Ubud.",
    longDesc: "Set among the palms above the Tjampuhan ridge, this single-villa retreat pairs an open-air living pavilion with a black-tiled infinity pool that seems to spill straight into the jungle canopy. Mornings start with traditional Balinese coffee on the deck; evenings end with cicadas and string lights.",
    images: ["1602002418082-a4443e081dd1", "1582719478250-c89cae4dc85b", "1505881502353-a1986add3762", "1571896349842-33c89424de2d"],
    amenities: ["wifi", "pool", "breakfast", "aircon", "view", "coffee"],
    rating: 4.9, reviews: 214, priceFrom: 420,
    rooms: [
      { name: "Canopy Suite", size: "45 m²", occupancy: 2, bed: "1 King Bed", desc: "Floor-to-ceiling jungle views with an outdoor soaking tub." },
      { name: "Garden Pavilion", size: "60 m²", occupancy: 3, bed: "1 King + 1 Single", desc: "Ground-floor pavilion opening directly onto the pool deck." },
    ],
    highlights: ["Private infinity pool over the ridge", "Daily housekeeping & breakfast", "10-minute walk to central Ubud", "In-villa massage on request"],
  },
  {
    id: "seminyak-sands-resort", destinationId: "bali", type: "Hotel",
    name: "Seminyak Sands Resort", location: "Petitenget Beach, Seminyak, Bali",
    shortDesc: "Beachfront rooms, a sunset bar, and a pool that runs the length of the property.",
    longDesc: "Seminyak Sands sits directly on Petitenget Beach, with a 45-metre pool tracing the shoreline and a rooftop bar built for the evening sky. Rooms lean minimal and warm — raw timber, linen, louvred shutters thrown open to the sea air.",
    images: ["1571003123894-1f0594d2b5d9", "1455587734955-081b22074882", "1561501900-3701fa6a0864", "1576675466969-38eeae4b41f6"],
    amenities: ["wifi", "pool", "breakfast", "gym", "parking", "view"],
    rating: 4.7, reviews: 388, priceFrom: 310,
    rooms: [
      { name: "Beachfront Room", size: "38 m²", occupancy: 2, bed: "1 King Bed", desc: "Ground-floor room with direct beach access." },
      { name: "Sunset Suite", size: "52 m²", occupancy: 2, bed: "1 King Bed", desc: "Top-floor suite with a private west-facing balcony." },
    ],
    highlights: ["Direct beach access", "45-metre infinity-edge pool", "Rooftop sunset bar", "5-minute walk to Petitenget"],
  },
  {
    id: "caldera-horizon-suites", destinationId: "santorini", type: "Hotel",
    name: "Caldera Horizon Suites", location: "Imerovigli, Santorini",
    shortDesc: "Carved into the cliff at Imerovigli, with private plunge pools facing the volcano.",
    longDesc: "Cut directly into the caldera cliff at Santorini's highest point, each suite at Caldera Horizon comes with its own plunge pool angled toward the volcanic islets. Vaulted, whitewashed interiors keep things cool through the afternoon; the terrace does the rest of the work at sunset.",
    images: ["1570077188670-e3a8d69ac5ff", "1533105079780-92b9be482077", "1601581875309-fafbf2d3ed3a", "1518684079-3c830dcef090"],
    amenities: ["wifi", "pool", "breakfast", "view", "parking"],
    rating: 4.95, reviews: 502, priceFrom: 540,
    rooms: [
      { name: "Caldera Cave Suite", size: "40 m²", occupancy: 2, bed: "1 King Bed", desc: "Traditional cave-carved suite with a private plunge pool." },
      { name: "Horizon Villa", size: "70 m²", occupancy: 4, bed: "2 King Beds", desc: "Two-bedroom villa with a wraparound caldera terrace." },
    ],
    highlights: ["Private plunge pool, volcano-facing", "Caldera-carved architecture", "5-minute walk to Skafidia trail", "Sunset terrace dining"],
  },
  {
    id: "oia-cliffside-pool-villas", destinationId: "santorini", type: "Villa",
    name: "Oia Cliffside Pool Villas", location: "Oia, Santorini",
    shortDesc: "Three private villas stepped down the Oia cliffside, each with its own pool terrace.",
    longDesc: "A short walk from Oia's blue-domed lanes, these three stepped villas share the same caldera view that draws crowds to the village castle — minus the crowds. Each comes with a private pool terrace, an outdoor kitchen, and a front-row seat to the sunset.",
    images: ["1533105079780-92b9be482077", "1601581875309-fafbf2d3ed3a", "1469796466635-455ede028aca", "1570213489059-0aac6626cade"],
    amenities: ["wifi", "pool", "aircon", "view", "coffee"],
    rating: 4.92, reviews: 167, priceFrom: 610,
    rooms: [
      { name: "Cliffside Villa", size: "85 m²", occupancy: 4, bed: "2 King Beds", desc: "Two-storey villa with a private pool terrace." },
    ],
    highlights: ["Unobstructed caldera sunset views", "Private pool & outdoor kitchen", "8-minute walk to Oia Castle", "Concierge dinner reservations"],
  },
  {
    id: "alpenglow-chalet-zermatt", destinationId: "swiss-alps", type: "Villa",
    name: "Alpenglow Chalet Zermatt", location: "Zermatt, Switzerland",
    shortDesc: "Ski-in, ski-out, with the Matterhorn framed in nearly every window.",
    longDesc: "A timber-and-stone chalet built into the slope above Zermatt, with the Matterhorn dominating the view from the great room, the hot tub, and most of the bedrooms. Skis click straight onto the Sunnegga piste from the boot room.",
    images: ["1518709268805-4e9042af2176", "1502784444187-359ac186c5bb", "1551524559-8af4e6624178", "1548777123-e216912df7d8"],
    amenities: ["wifi", "breakfast", "aircon", "view", "parking"],
    rating: 4.88, reviews: 142, priceFrom: 780,
    rooms: [
      { name: "Matterhorn Suite", size: "48 m²", occupancy: 2, bed: "1 King Bed", desc: "Top-floor suite with a private balcony facing the peak." },
      { name: "Alpine Family Room", size: "65 m²", occupancy: 4, bed: "1 King + 2 Singles", desc: "Family room with a wood-burning stove." },
    ],
    highlights: ["Ski-in / ski-out access", "Matterhorn views from every floor", "Private outdoor hot tub", "5-minute walk to village center"],
  },
  {
    id: "azure-reef-overwater-villas", destinationId: "maldives", type: "Villa",
    name: "Azure Reef Overwater Villas", location: "North Malé Atoll, Maldives",
    shortDesc: "Glass floor panels, private lagoon steps, and a house reef at your doorstep.",
    longDesc: "Built on stilts above a quiet lagoon in North Malé Atoll, each villa has a glass floor panel over the reef, a private deck with steps straight into the water, and an outdoor rain shower open to the sky. Snorkel gear is left at your door each morning.",
    images: ["1573843981267-be1999ff37cd", "1540202404-1b927e27fa86", "1573052905904-34ad8c27f0cc", "1559128010-7c1ad6e1b6a5"],
    amenities: ["wifi", "breakfast", "aircon", "view", "coffee"],
    rating: 4.97, reviews: 331, priceFrom: 920,
    rooms: [
      { name: "Lagoon Villa", size: "95 m²", occupancy: 2, bed: "1 King Bed", desc: "Overwater villa with glass floor panel and private deck steps." },
      { name: "Reef Pool Villa", size: "120 m²", occupancy: 3, bed: "1 King + 1 Single", desc: "Adds a private infinity-edge plunge pool." },
    ],
    highlights: ["Direct lagoon access from your deck", "House reef snorkeling at the doorstep", "Glass floor panel over the coral", "Seaplane transfer arranged on request"],
  },
  {
    id: "sakura-ryokan-retreat", destinationId: "kyoto", type: "Hotel",
    name: "Sakura Ryokan Retreat", location: "Higashiyama, Kyoto",
    shortDesc: "Traditional onsen baths, kaiseki dinners, and a moss garden outside every room.",
    longDesc: "A twelve-room ryokan tucked into the Higashiyama hills, where tatami rooms look onto a private moss garden and the evening kaiseki menu changes with the season. The onsen bath house is open until midnight, lit only by paper lanterns.",
    images: ["1493976040374-85c8e12f0c0e", "1545569341-9eb8b30979d9", "1528360983277-13d401cdc186", "1545158535-c3f7168c28b6"],
    amenities: ["wifi", "breakfast", "view", "parking"],
    rating: 4.9, reviews: 256, priceFrom: 480,
    rooms: [
      { name: "Garden Tatami Room", size: "32 m²", occupancy: 2, bed: "Futon (Tatami)", desc: "Traditional tatami room facing the private moss garden." },
      { name: "Onsen Suite", size: "50 m²", occupancy: 2, bed: "Futon (Tatami)", desc: "Adds a private open-air onsen bath." },
    ],
    highlights: ["Private moss garden views", "Seasonal kaiseki dinner included", "Open-air onsen until midnight", "10-minute walk to Kiyomizu-dera"],
  },
  {
    id: "villa-toscana-vineyard-estate", destinationId: "tuscany", type: "Villa",
    name: "Villa Toscana Vineyard Estate", location: "Chianti Hills, Tuscany",
    shortDesc: "A working vineyard estate with a pool overlooking the Chianti hills.",
    longDesc: "Surrounded by its own Sangiovese vines, this restored stone farmhouse keeps the original beams and terracotta floors while adding a pool terrace that looks out over the Chianti hills. The estate's own wine is poured at dinner.",
    images: ["1523906834658-6e24ef2386f9", "1499678329028-101435549a4e", "1543882443-22e7cf9e3da9", "1530541930197-ff16ac917b0e"],
    amenities: ["wifi", "pool", "breakfast", "parking", "view"],
    rating: 4.86, reviews: 178, priceFrom: 560,
    rooms: [
      { name: "Vineyard Room", size: "40 m²", occupancy: 2, bed: "1 Queen Bed", desc: "Stone-walled room overlooking the vine rows." },
      { name: "Estate Suite", size: "58 m²", occupancy: 3, bed: "1 King + 1 Single", desc: "Corner suite with a private reading loft." },
    ],
    highlights: ["Private vineyard & wine tastings", "Pool terrace over the Chianti hills", "15-minute drive to Siena", "Estate-grown breakfast produce"],
  },
  {
    id: "burj-marina-royal-hotel", destinationId: "dubai", type: "Hotel",
    name: "Burj Marina Royal Hotel", location: "Dubai Marina, Dubai",
    shortDesc: "A 71st-floor infinity pool looking straight down the Marina skyline.",
    longDesc: "Royal Hotel's signature infinity pool sits on the 71st floor, cantilevered over the Marina with the skyline doubling in the glass. Rooms run floor-to-ceiling glass throughout, with a private check-in lounge and chauffeur transfers included.",
    images: ["1512453979798-5ea266f8880c", "1582719478250-c89cae4dc85b", "1551882547-ff40c63fe5fa", "1561501900-3701fa6a0864"],
    amenities: ["wifi", "pool", "breakfast", "gym", "parking", "view"],
    rating: 4.85, reviews: 612, priceFrom: 690,
    rooms: [
      { name: "Marina Skyline Room", size: "50 m²", occupancy: 2, bed: "1 King Bed", desc: "Floor-to-ceiling glass facing the Marina." },
      { name: "Royal Suite", size: "95 m²", occupancy: 3, bed: "1 King + 1 Single", desc: "Adds a private lounge and butler service." },
    ],
    highlights: ["71st-floor infinity pool", "Private airport chauffeur transfer", "5-minute walk to Marina Walk", "Butler service on Suite bookings"],
  },
  {
    id: "desert-mirage-resort-spa", destinationId: "dubai", type: "Hotel",
    name: "Desert Mirage Resort & Spa", location: "Al Marmoom Desert Edge, Dubai",
    shortDesc: "Low-rise desert luxury at the edge of the dunes, with a Bedouin-inspired spa.",
    longDesc: "Set where the city ends and the dunes begin, Desert Mirage keeps a deliberately low profile — courtyard pools, shaded majlis seating, and a spa built around traditional Bedouin treatments. Dawn balloon and dune-drive transfers leave from the front gate.",
    images: ["1505881502353-a1986add3762", "1571896349842-33c89424de2d", "1512453979798-5ea266f8880c", "1532274402911-5a369e4c4bb5"],
    amenities: ["wifi", "pool", "breakfast", "parking", "view"],
    rating: 4.8, reviews: 203, priceFrom: 450,
    rooms: [
      { name: "Dune View Room", size: "42 m²", occupancy: 2, bed: "1 King Bed", desc: "Ground-floor room with a private dune-facing terrace." },
      { name: "Majlis Suite", size: "68 m²", occupancy: 4, bed: "1 King + 2 Singles", desc: "Traditional-style suite with a private courtyard." },
    ],
    highlights: ["Edge-of-the-dunes location", "Bedouin-inspired spa treatments", "Sunrise balloon transfers arranged", "Courtyard pool & shaded majlis"],
  },
];

const TOURS = [
  {
    id: "bali-soul-escape", name: "Bali Soul Escape", duration: "6 Days / 5 Nights",
    destinations: ["Ubud", "Seminyak", "Nusa Penida"],
    img: "1537953773345-d172ccf13cf1",
    gallery: ["1537953773345-d172ccf13cf1", "1518548419970-58e3b4079ab2", "1582719478250-c89cae4dc85b"],
    shortDesc: "Rice terraces, a sea temple at low tide, and a sunset boat out to Nusa Penida.",
    longDesc: "Six days moving from Ubud's terraced hills to the beach clubs of Seminyak, with a full-day crossing to Nusa Penida for its cliff-top viewpoints. A local guide travels with the group throughout, with free time built into every afternoon.",
    highlights: ["Tegalalang rice terrace sunrise walk", "Uluwatu Temple at sunset", "Full-day Nusa Penida boat excursion", "Traditional Balinese cooking class"],
    rating: 4.8, reviews: 312, priceFrom: 990,
    itinerary: [
      { day: 1, title: "Arrival in Ubud", description: "Private transfer from Denpasar airport, welcome dinner overlooking the Campuhan ridge." },
      { day: 2, title: "Rice Terraces & Temples", description: "Sunrise walk through Tegalalang, afternoon visit to Tirta Empul water temple." },
      { day: 3, title: "Ubud Free Day", description: "Optional cooking class or spa morning; free time to explore Ubud's art markets." },
      { day: 4, title: "Transfer to Seminyak", description: "Scenic drive south, sunset at Uluwatu Temple, evening at a beach club." },
      { day: 5, title: "Nusa Penida Excursion", description: "Full-day boat trip to Kelingking Beach and Angel's Billabong." },
      { day: 6, title: "Departure", description: "Free morning, private transfer to the airport." },
    ],
    included: ["5 nights accommodation", "Daily breakfast", "Airport transfers", "Local English-speaking guide", "Nusa Penida boat excursion", "Entry fees to listed sites"],
    excluded: ["International flights", "Travel insurance", "Lunches & dinners (except Day 1)", "Personal expenses", "Gratuities"],
  },
  {
    id: "greek-island-hopper", name: "Greek Island Hopper", duration: "8 Days / 7 Nights",
    destinations: ["Santorini", "Mykonos", "Athens"],
    img: "1570077188670-e3a8d69ac5ff",
    gallery: ["1570077188670-e3a8d69ac5ff", "1533105079780-92b9be482077", "1469474968028-56623f02e42e"],
    shortDesc: "Caldera sunsets, whitewashed lanes, and a ferry rhythm between three iconic islands.",
    longDesc: "An eight-day route through the Cyclades, anchored by a private caldera-view dinner in Santorini and free beach days in Mykonos, bookended by a guided half-day through Athens' Acropolis and old town.",
    highlights: ["Private sunset dinner over the caldera", "Akrotiri archaeological site", "Mykonos beach day, Little Venice at dusk", "Guided Acropolis tour in Athens"],
    rating: 4.9, reviews: 441, priceFrom: 1690,
    itinerary: [
      { day: 1, title: "Arrival in Athens", description: "Welcome dinner in the Plaka district." },
      { day: 2, title: "Athens Highlights", description: "Guided tour of the Acropolis and Acropolis Museum." },
      { day: 3, title: "Ferry to Santorini", description: "High-speed ferry transfer, afternoon at leisure in Fira." },
      { day: 4, title: "Santorini Exploration", description: "Akrotiri ruins and Red Beach, sunset dinner in Oia." },
      { day: 5, title: "Santorini Free Day", description: "Optional catamaran cruise around the caldera." },
      { day: 6, title: "Ferry to Mykonos", description: "Transfer to Mykonos, evening in Little Venice." },
      { day: 7, title: "Mykonos Beach Day", description: "Free day at Paradise Beach or Mykonos Town." },
      { day: 8, title: "Departure", description: "Private transfer to Mykonos airport." },
    ],
    included: ["7 nights accommodation", "Daily breakfast", "All inter-island ferries", "Guided Acropolis tour", "Welcome & farewell dinners", "Airport transfers"],
    excluded: ["International flights", "Travel insurance", "Most lunches & dinners", "Optional catamaran cruise", "Gratuities"],
  },
  {
    id: "alpine-adventure-trail", name: "Alpine Adventure Trail", duration: "7 Days / 6 Nights",
    destinations: ["Zermatt", "Interlaken", "Lucerne"],
    img: "1469854523086-cc02fe5d8800",
    gallery: ["1469854523086-cc02fe5d8800", "1530122037265-a5f1f91d3b99", "1452960962994-acf4fd70b632"],
    shortDesc: "Matterhorn cable cars, a paragliding morning over Interlaken, and a lake steamer into Lucerne.",
    longDesc: "Seven days through three classic Swiss bases, mixing cable-car ridge walks above Zermatt with an optional paraglide over Interlaken's twin lakes, finishing on a steamer ride into old-town Lucerne.",
    highlights: ["Gornergrat cable car at sunrise", "Optional paragliding over Interlaken", "Lake Lucerne steamer crossing", "Guided glacier ridge walk"],
    rating: 4.85, reviews: 198, priceFrom: 2190,
    itinerary: [
      { day: 1, title: "Arrival in Zermatt", description: "Car-free village transfer, welcome dinner with Matterhorn views." },
      { day: 2, title: "Gornergrat & Glacier Walk", description: "Sunrise cable car to Gornergrat, guided ridge walk." },
      { day: 3, title: "Zermatt Free Day", description: "Optional via ferrata or spa morning." },
      { day: 4, title: "Transfer to Interlaken", description: "Scenic train through the Bernese Oberland." },
      { day: 5, title: "Interlaken Adventure Day", description: "Optional paragliding over the twin lakes." },
      { day: 6, title: "Transfer to Lucerne", description: "Lake steamer crossing into old-town Lucerne." },
      { day: 7, title: "Departure", description: "Free morning along the Reuss River, transfer to Zurich airport." },
    ],
    included: ["6 nights accommodation", "Daily breakfast", "All scenic train & boat transfers", "Gornergrat cable car & guided walk", "Airport transfers"],
    excluded: ["International flights", "Travel insurance", "Optional paragliding fee", "Most lunches & dinners", "Gratuities"],
  },
  {
    id: "kyoto-tokyo-cultural-journey", name: "Kyoto & Tokyo Cultural Journey", duration: "9 Days / 8 Nights",
    destinations: ["Kyoto", "Nara", "Tokyo"],
    img: "1493976040374-85c8e12f0c0e",
    gallery: ["1493976040374-85c8e12f0c0e", "1545569341-9eb8b30979d9", "1540959733332-eab4deabeeaf"],
    shortDesc: "Temple paths and deer parks in Kyoto and Nara, then the bullet train into Tokyo's neon grid.",
    longDesc: "Nine days split between old and new Japan — temple-hopping and a tea ceremony in Kyoto, a day among the deer of Nara, then a Shinkansen run into Tokyo for a guided Tsukiji food crawl and a free day in Shibuya.",
    highlights: ["Fushimi Inari torii gate walk", "Traditional tea ceremony in Gion", "Nara deer park day trip", "Tsukiji Outer Market food tour"],
    rating: 4.95, reviews: 276, priceFrom: 2450,
    itinerary: [
      { day: 1, title: "Arrival in Kyoto", description: "Evening walk through Gion's lantern-lit lanes." },
      { day: 2, title: "Eastern Kyoto Temples", description: "Kiyomizu-dera and Higashiyama district, traditional tea ceremony." },
      { day: 3, title: "Fushimi Inari & Arashiyama", description: "Torii gate hike, bamboo grove at sunset." },
      { day: 4, title: "Day Trip to Nara", description: "Todai-ji temple and the Nara deer park." },
      { day: 5, title: "Kyoto Free Day", description: "Optional kaiseki cooking class." },
      { day: 6, title: "Bullet Train to Tokyo", description: "Shinkansen transfer, evening in Shinjuku." },
      { day: 7, title: "Tokyo Food & Culture", description: "Guided Tsukiji Outer Market food tour, Senso-ji Temple." },
      { day: 8, title: "Tokyo Free Day", description: "Free day to explore Shibuya and Harajuku." },
      { day: 9, title: "Departure", description: "Private transfer to Narita or Haneda airport." },
    ],
    included: ["8 nights accommodation", "Daily breakfast", "Bullet train transfer Kyoto–Tokyo", "Guided tea ceremony & food tour", "Airport transfers"],
    excluded: ["International flights", "Travel insurance", "Most lunches & dinners", "Optional cooking class", "Gratuities"],
  },
  {
    id: "sahara-sands-marrakech-medina", name: "Sahara Sands & Marrakech Medina", duration: "6 Days / 5 Nights",
    destinations: ["Marrakech", "Atlas Mountains", "Merzouga Desert"],
    img: "1597212720158-4ca0c1d75bd6",
    gallery: ["1597212720158-4ca0c1d75bd6", "1539020140153-e479b8c22e70", "1489493887464-892be6d1daae"],
    shortDesc: "Souk alleys, a High Atlas pass, and a night under canvas in the Sahara dunes.",
    longDesc: "Six days from Marrakech's medina out across the High Atlas to the Merzouga dunes, including a camel trek at sunset and a night in a traditional desert camp before the long, scenic return drive.",
    highlights: ["Guided Marrakech medina & souk walk", "High Atlas mountain pass crossing", "Sunset camel trek into the dunes", "Overnight in a traditional desert camp"],
    rating: 4.75, reviews: 229, priceFrom: 1050,
    itinerary: [
      { day: 1, title: "Arrival in Marrakech", description: "Guided walk through the medina and Jemaa el-Fnaa at dusk." },
      { day: 2, title: "Marrakech to Atlas Mountains", description: "Drive over the Tizi n'Tichka pass, overnight in a Berber village." },
      { day: 3, title: "Atlas to Merzouga", description: "Scenic drive through the Dades Valley to the edge of the Sahara." },
      { day: 4, title: "Sahara Desert Camp", description: "Sunset camel trek into the dunes, overnight in a desert camp." },
      { day: 5, title: "Return to Marrakech", description: "Sunrise over the dunes, long scenic drive back." },
      { day: 6, title: "Departure", description: "Free morning for last souk shopping, airport transfer." },
    ],
    included: ["5 nights accommodation", "Daily breakfast", "All ground transfers", "Camel trek & desert camp", "Local English-speaking guide"],
    excluded: ["International flights", "Travel insurance", "Most lunches & dinners", "Personal shopping", "Gratuities"],
  },
  {
    id: "tuscany-vineyard-trail", name: "Tuscany Vineyard Trail", duration: "5 Days / 4 Nights",
    destinations: ["Florence", "Siena", "Chianti"],
    img: "1523906834658-6e24ef2386f9",
    gallery: ["1523906834658-6e24ef2386f9", "1499678329028-101435549a4e", "1543882443-22e7cf9e3da9"],
    shortDesc: "Renaissance Florence, medieval Siena, and two estate tastings through the Chianti hills.",
    longDesc: "Five days from Florence's galleries to Siena's shell-shaped piazza, with two vineyard estate visits and tastings through the Chianti countryside in between.",
    highlights: ["Uffizi Gallery guided morning", "Piazza del Campo in Siena", "Two Chianti estate wine tastings", "Tuscan cooking class with a local chef"],
    rating: 4.82, reviews: 184, priceFrom: 1190,
    itinerary: [
      { day: 1, title: "Arrival in Florence", description: "Welcome dinner near the Duomo." },
      { day: 2, title: "Florence Highlights", description: "Guided Uffizi Gallery morning, free afternoon." },
      { day: 3, title: "Chianti Wine Day", description: "Two estate visits and tastings through the Chianti hills." },
      { day: 4, title: "Siena & Cooking Class", description: "Morning in Siena's Piazza del Campo, evening cooking class." },
      { day: 5, title: "Departure", description: "Free morning, transfer to Florence airport." },
    ],
    included: ["4 nights accommodation", "Daily breakfast", "Uffizi Gallery entry & guide", "Two vineyard tastings", "Tuscan cooking class"],
    excluded: ["International flights", "Travel insurance", "Most lunches & dinners", "Personal expenses", "Gratuities"],
  },
  {
    id: "maldives-island-bliss", name: "Maldives Island Bliss", duration: "5 Days / 4 Nights",
    destinations: ["Malé", "Private Atoll Retreat"],
    img: "1573843981267-be1999ff37cd",
    gallery: ["1573843981267-be1999ff37cd", "1540202404-1b927e27fa86", "1559128010-7c1ad6e1b6a5"],
    shortDesc: "A speedboat transfer to a private atoll, with snorkeling, sandbanks, and very little else on the agenda.",
    longDesc: "A deliberately unstructured five days — a speedboat transfer out to a private atoll retreat, with snorkeling over the house reef, a sandbank picnic, and a sunset cruise the only fixed plans.",
    highlights: ["Private speedboat atoll transfer", "Guided house-reef snorkeling", "Sandbank picnic lunch", "Sunset dolphin cruise"],
    rating: 4.93, reviews: 257, priceFrom: 1890,
    itinerary: [
      { day: 1, title: "Arrival & Atoll Transfer", description: "Speedboat transfer from Malé to the private atoll retreat." },
      { day: 2, title: "Reef & Sandbank Day", description: "Guided snorkeling over the house reef, sandbank picnic lunch." },
      { day: 3, title: "Free Island Day", description: "Free day to relax, optional spa treatments." },
      { day: 4, title: "Sunset Cruise", description: "Evening dolphin-watching cruise along the atoll." },
      { day: 5, title: "Departure", description: "Speedboat transfer back to Malé for onward flights." },
    ],
    included: ["4 nights accommodation", "Daily breakfast", "Speedboat transfers", "Guided snorkeling excursion", "Sunset dolphin cruise"],
    excluded: ["International flights", "Travel insurance", "Most lunches & dinners", "Spa treatments", "Gratuities"],
  },
];

// NOTE: data getters are re-bound inside App() using stateful arrays.
// These placeholders exist only to avoid reference errors during initial render.
const getDestination = (id) => DESTINATIONS.find((d) => d.id === id);
const getPropertiesByDestination = (destId) => PROPERTIES.filter((p) => p.destinationId === destId);
const getProperty = (id) => PROPERTIES.find((p) => p.id === id);
const getTour = (id) => TOURS.find((t) => t.id === id);


/* ============================================================
   IMAGE HELPER — Unsplash primary, keyword fallback, then a
   themed gradient placeholder. Never shows a broken image.
   ============================================================ */
function unsplashUrl(id, w, h) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&fit=crop&auto=format`;
}

function compressImage(file, maxW = 1200, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function saveLs(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`localStorage save failed for key "${key}" — data may not persist after refresh.`);
  }
}

function SmartImage({ photoId, fallbackQuery, w = 800, h = 600, alt = "", className = "", imgClassName = "", eager = false, src: directSrc }) {
  const [stage, setStage] = useState(0);

  if (directSrc) {
    return (
      <img
        src={directSrc}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className={cx(className, imgClassName)}
      />
    );
  }

  const sources = [
    unsplashUrl(photoId, w, h),
    `https://loremflickr.com/${w}/${h}/${encodeURIComponent(fallbackQuery || "travel,luxury")}`,
  ];

  if (stage >= sources.length) {
    return (
      <div className={cx("flex items-center justify-center bg-gradient-to-br from-teal-800 via-teal-900 to-stone-900", className)}>
        <Compass className="w-8 h-8 text-amber-400/70" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={sources[stage]}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onError={() => setStage((s) => s + 1)}
      className={cx(className, imgClassName)}
    />
  );
}

/* ============================================================
   SMALL REUSABLE ATOMS
   ============================================================ */
function RatingStars({ rating, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <Star className="text-amber-400 fill-amber-400" style={{ width: size, height: size }} />
      <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
    </span>
  );
}

function Eyebrow({ children, dark }) {
  return (
    <span className={cx(
      "inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase",
      dark ? "text-amber-400" : "text-amber-600"
    )}>
      <span className={cx("h-px w-6", dark ? "bg-amber-400" : "bg-amber-600")} />
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick, className = "", type = "button", icon: Icon = ArrowRight }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(
        "group inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 transition-all duration-300 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.97]",
        className
      )}
    >
      {children}
      {Icon && <Icon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
    </button>
  );
}

function SecondaryButton({ children, onClick, className = "", dark, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97]",
        dark
          ? "border-stone-700 text-stone-100 hover:bg-stone-800"
          : "border-stone-300 text-stone-800 hover:bg-stone-100",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

function IconCircle({ icon: Icon, tone = "amber", size = "md" }) {
  const tones = {
    amber: "bg-amber-400/15 text-amber-500",
    teal: "bg-teal-400/15 text-teal-600",
    orange: "bg-orange-400/15 text-orange-600",
  };
  const sizes = { sm: "w-9 h-9", md: "w-11 h-11", lg: "w-14 h-14" };
  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  return (
    <span className={cx("inline-flex items-center justify-center rounded-full shrink-0", tones[tone], sizes[size])}>
      <Icon className={iconSizes[size]} strokeWidth={2} />
    </span>
  );
}

function RouteLine({ className = "" }) {
  return (
    <svg viewBox="0 0 200 40" className={className} preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,20 C50,0 150,40 200,20" fill="none" stroke="currentColor" strokeWidth="2" className="th-route-anim" strokeLinecap="round" />
    </svg>
  );
}

function EmptyState({ icon: Icon = Compass, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <IconCircle icon={Icon} tone="amber" size="lg" />
      <h3 className="th-display text-2xl mt-5 mb-2">{title}</h3>
      <p className="text-sm max-w-sm opacity-70">{description}</p>
      {action}
    </div>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar({ theme, dark, setDark, nav, mobileOpen, setMobileOpen }) {
  const links = [
    { label: "Home", action: nav.goHome, active: nav.view === "home" },
    { label: "Stays", action: nav.goToDestinations, active: nav.view.startsWith("book") },
    { label: "Tours", action: nav.goToTours, active: nav.view.startsWith("tour") },
    { label: "Admin", action: nav.goToAdmin, active: nav.view === "admin" },
  ];
  return (
    <header className="sticky top-0 z-40">
      <nav className={cx("border-b", dark ? "th-glass-nav border-stone-800/60" : "th-glass-nav-light border-stone-200/70")}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <button onClick={nav.goHome} className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-500">
              <Compass className="w-5 h-5 text-stone-900" strokeWidth={2.2} />
            </span>
            <span className={cx("th-display text-xl font-semibold tracking-tight", dark ? "text-white" : "text-stone-900")}>
              Travel Hub
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={l.action}
                className={cx(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                  l.active
                    ? "bg-amber-500 text-stone-900"
                    : dark ? "text-stone-200 hover:bg-stone-800" : "text-stone-700 hover:bg-stone-900/5"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark mode"
              className={cx("w-10 h-10 rounded-full inline-flex items-center justify-center transition-colors", dark ? "bg-stone-800 text-amber-300 hover:bg-stone-700" : "bg-stone-900/5 text-stone-700 hover:bg-stone-900/10")}
            >
              {dark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <SecondaryButton dark={dark} className="hidden sm:inline-flex !py-2.5 !px-5" onClick={nav.goToDestinations}>
              Explore Stays
            </SecondaryButton>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className={cx("md:hidden w-10 h-10 rounded-full inline-flex items-center justify-center", dark ? "bg-stone-800 text-stone-100" : "bg-stone-900/5 text-stone-800")}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={cx("md:hidden border-t px-5 py-4 flex flex-col gap-1", dark ? "border-stone-800/60" : "border-stone-200/70")}>
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => { l.action(); setMobileOpen(false); }}
                className={cx(
                  "text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                  l.active ? "bg-amber-500 text-stone-900" : dark ? "text-stone-200 hover:bg-stone-800" : "text-stone-700 hover:bg-stone-900/5"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ theme, dark, nav }) {
  return (
    <footer className={cx("border-t", dark ? "bg-stone-950 border-stone-800" : "bg-teal-950 border-teal-900")}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2 max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-500">
              <Compass className="w-5 h-5 text-stone-900" strokeWidth={2.2} />
            </span>
            <span className="th-display text-xl font-semibold text-white">Travel Hub</span>
          </div>
          <p className="text-sm text-teal-200/70 leading-relaxed">
            A showcase of hand-picked stays and guided journeys across the world's most extraordinary places. Browse freely — every enquiry reaches a real concierge.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-amber-400 mb-4">Book For You</h4>
          <ul className="space-y-2.5 text-sm text-teal-200/70">
            <li><button onClick={nav.goToDestinations} className="hover:text-white transition-colors">Browse destinations</button></li>
            <li><button onClick={nav.goToDestinations} className="hover:text-white transition-colors">Hotels & villas</button></li>
            <li><button onClick={nav.goHome} className="hover:text-white transition-colors">Why Travel Hub</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-amber-400 mb-4">Tour For You</h4>
          <ul className="space-y-2.5 text-sm text-teal-200/70">
            <li><button onClick={nav.goToTours} className="hover:text-white transition-colors">All tour packages</button></li>
            <li><button onClick={nav.goToTours} className="hover:text-white transition-colors">Guided journeys</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-teal-900/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-300/60">
          <p>© 2026 Travel Hub. A concept showcase — no live bookings or payments are processed.</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> hello@travelhub.example</span>
            <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +1 (555) 019-2200</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   HOME VIEW
   ============================================================ */
function HomeView({ theme, dark, nav }) {
  const featured = nav.destinations.slice(0, 6);
  const testimonials = [
    { quote: "We told them we wanted villas with a view and total privacy — every option they showed us delivered exactly that.", name: "Elena R.", place: "Madrid" },
    { quote: "The Kyoto itinerary balanced guided days with enough free time that it never felt rushed.", name: "Marcus T.", place: "Toronto" },
    { quote: "Browsing by destination first made the whole decision so much easier than scrolling endless hotel lists.", name: "Priya N.", place: "Singapore" },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] max-h-[820px] flex items-end overflow-hidden">
        <SmartImage
          photoId="1469474968028-56623f02e42e"
          fallbackQuery="luxury,travel,coastline"
          w={1600} h={1200} eager
          className="absolute inset-0"
          imgClassName="w-full h-full object-cover"
          alt="Sweeping coastal travel destination"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/55 to-teal-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/40 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-16 sm:pb-20 w-full">
          <div className="max-w-2xl th-fade-up">
            <Eyebrow dark>Travel Hub</Eyebrow>
            <h1 className="th-display text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.04] mt-5 mb-6">
              Discover Your<br /><span className="italic text-amber-300">Perfect</span> Getaway
            </h1>
            <p className="text-teal-100/85 text-base sm:text-lg leading-relaxed max-w-xl mb-9">
              Hand-picked hotels, villas, and fully-guided journeys across the world's most extraordinary places. Browse freely, compare in detail, and enquire only when you're ready.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <PrimaryButton onClick={nav.goToDestinations}>Explore Stays</PrimaryButton>
              <SecondaryButton dark onClick={nav.goToTours} icon={Compass}>Explore Tours</SecondaryButton>
            </div>
            <div className="flex items-center gap-6 mt-10 text-teal-100/80 text-sm">
              <span className="inline-flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 average rating</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-teal-100/40" />
              <span className="hidden sm:inline">120+ properties &amp; tours</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-teal-100/40" />
              <span className="hidden sm:inline">8 destinations</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <ChevronDown className="w-5 h-5 text-white/60 th-pulse-soft" />
        </div>
      </section>

      {/* MAIN SELECTION AREA */}
      <section className={cx("relative py-20 sm:py-28", theme.page)}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow dark={dark}>Two ways to travel with us</Eyebrow>
            <h2 className="th-display text-4xl sm:text-5xl mt-5">Where do you want to begin?</h2>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-7">
            <RouteLine className="hidden lg:block absolute top-1/2 left-[calc(50%-90px)] w-[180px] h-10 -translate-y-1/2 text-amber-500 z-10 pointer-events-none" />

            {/* Book For You */}
            <button
              onClick={nav.goToDestinations}
              className="group relative text-left rounded-[28px] overflow-hidden h-[440px] sm:h-[500px] focus-visible:outline-amber-500"
            >
              <SmartImage
                photoId="1602002418082-a4443e081dd1"
                fallbackQuery="luxury,villa,pool"
                w={900} h={1100}
                className="absolute inset-0"
                imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Premium hotels and villas"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/60 to-teal-900/10" />
              <div className="absolute inset-0 bg-teal-700/10 mix-blend-multiply" />

              <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-teal-500/90 text-white text-xs font-bold tracking-wide uppercase px-3.5 py-1.5">
                <Building2 className="w-3.5 h-3.5" /> Book For You
              </div>

              <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6 th-glass rounded-3xl p-6 sm:p-7">
                <IconCircle icon={Hotel} tone="teal" size="lg" />
                <h3 className="th-display text-2xl sm:text-3xl text-white mt-4 mb-2">Hotels &amp; Villas</h3>
                <p className="text-teal-50/85 text-sm leading-relaxed mb-5">
                  Find and explore premium hotels and villas at your destination.
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 transition-all group-hover:bg-amber-400 group-hover:shadow-lg group-hover:shadow-amber-500/25">
                  Explore Stays <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>

            {/* Tour For You */}
            <button
              onClick={nav.goToTours}
              className="group relative text-left rounded-[28px] overflow-hidden h-[440px] sm:h-[500px] focus-visible:outline-amber-500"
            >
              <SmartImage
                photoId="1469854523086-cc02fe5d8800"
                fallbackQuery="mountain,adventure,travel"
                w={900} h={1100}
                className="absolute inset-0"
                imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Curated tour packages and travel experiences"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/55 to-orange-900/10" />
              <div className="absolute inset-0 bg-orange-700/10 mix-blend-multiply" />

              <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-orange-500/90 text-white text-xs font-bold tracking-wide uppercase px-3.5 py-1.5">
                <Compass className="w-3.5 h-3.5" /> Tour For You
              </div>

              <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6 th-glass rounded-3xl p-6 sm:p-7">
                <IconCircle icon={Compass} tone="orange" size="lg" />
                <h3 className="th-display text-2xl sm:text-3xl text-white mt-4 mb-2">Tour Packages</h3>
                <p className="text-orange-50/85 text-sm leading-relaxed mb-5">
                  Discover curated tour packages and travel experiences.
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 transition-all group-hover:bg-amber-400 group-hover:shadow-lg group-hover:shadow-amber-500/25">
                  Explore Tours <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={cx("py-20 sm:py-24 border-t", theme.border, theme.surfaceAlt)}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-14">
            <Eyebrow dark={dark}>How it works</Eyebrow>
            <h2 className="th-display text-4xl sm:text-5xl mt-5">From idea to itinerary in three steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { n: "01", icon: Compass, title: "Choose your path", desc: "Decide between a standalone stay or a fully-guided tour package." },
              { n: "02", icon: Search, title: "Compare in detail", desc: "Browse galleries, amenities, itineraries, and honest highlight lists." },
              { n: "03", icon: MessageSquare, title: "Send an enquiry", desc: "Reach a concierge directly — no payment, no account required." },
            ].map((s) => (
              <div key={s.n} className="relative pl-1">
                <span className={cx("th-display text-6xl block mb-4 opacity-15")}>{s.n}</span>
                <IconCircle icon={s.icon} tone="amber" />
                <h3 className="text-lg font-bold mt-4 mb-2">{s.title}</h3>
                <p className={cx("text-sm leading-relaxed", theme.textMuted)}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className={cx("py-20 sm:py-24", theme.page)}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
            <div>
              <Eyebrow dark={dark}>Popular destinations</Eyebrow>
              <h2 className="th-display text-4xl sm:text-5xl mt-5">Start with a place, not a list</h2>
            </div>
            <SecondaryButton dark={dark} onClick={nav.goToDestinations} icon={ArrowUpRight}>All destinations</SecondaryButton>
          </div>

          <div className="flex gap-5 overflow-x-auto th-noscroll pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <button
                key={d.id}
                onClick={() => nav.selectDestination(d.id)}
                className="group relative shrink-0 w-[260px] sm:w-auto h-[330px] rounded-3xl overflow-hidden text-left focus-visible:outline-amber-500"
              >
                <SmartImage
                  photoId={d.img} fallbackQuery={`${d.name},travel`} w={520} h={660}
                  src={d.uploadedImg}
                  className="absolute inset-0" imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={d.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/15 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1">{d.tag}</span>
                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="th-display text-2xl text-white mb-1">{d.name}</h3>
                  <p className="text-white/70 text-xs mb-2">{d.country}</p>
                  <p className="text-white/80 text-sm th-clamp-2 leading-snug">{d.blurb}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / TESTIMONIALS */}
      <section className={cx("py-20 sm:py-24 border-t", theme.border, dark ? "bg-stone-900" : "bg-teal-950")}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow dark>What travelers say</Eyebrow>
            <h2 className="th-display text-4xl sm:text-5xl mt-5 text-white">Trusted for the details that matter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-3xl th-glass p-7">
                <Quote className="w-6 h-6 text-amber-400 mb-4" />
                <p className="text-teal-50/90 text-sm leading-relaxed mb-6">{t.quote}</p>
                <p className="text-white text-sm font-semibold">{t.name}</p>
                <p className="text-teal-200/60 text-xs">{t.place}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className={cx("py-20 sm:py-24", theme.page)}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="th-display text-4xl sm:text-5xl mb-5">Ready to start planning?</h2>
          <p className={cx("max-w-xl mx-auto mb-9", theme.textMuted)}>
            Whichever way you'd rather travel, the next step takes thirty seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PrimaryButton onClick={nav.goToDestinations} icon={Building2}>Explore Stays</PrimaryButton>
            <SecondaryButton dark={dark} onClick={nav.goToTours} icon={Compass}>Explore Tours</SecondaryButton>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   SHARED: BackBar, AmenityChip, PropertyCard
   ============================================================ */
function BackBar({ label, onBack, dark }) {
  return (
    <div className={cx("border-b", dark ? "border-stone-800 bg-stone-950" : "border-stone-200 bg-stone-50")}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center">
        <button onClick={onBack} className={cx("inline-flex items-center gap-2 text-sm font-semibold transition-colors", dark ? "text-stone-300 hover:text-white" : "text-stone-600 hover:text-stone-900")}>
          <ChevronLeft className="w-4 h-4" /> {label}
        </button>
      </div>
    </div>
  );
}

function AmenityChip({ amenityKey, theme }) {
  const meta = AMENITY_META[amenityKey];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium", theme.border, theme.textMuted)}>
      <Icon className="w-3.5 h-3.5" /> {meta.label}
    </span>
  );
}

function PropertyCard({ property, theme, dark, onClick }) {
  const coverSrc = Array.isArray(property.images) && property.images.length && property.images[0].startsWith("data:") ? property.images[0] : null;
  return (
    <button onClick={onClick} className="group text-left rounded-3xl overflow-hidden flex flex-col focus-visible:outline-amber-500" style={{ boxShadow: dark ? "0 1px 0 rgba(255,255,255,0.06)" : "0 1px 2px rgba(0,0,0,0.04)" }}>
      <div className="relative h-56 overflow-hidden">
        <SmartImage
          photoId={property.images[0]} fallbackQuery={`${property.type},luxury,hotel`} w={640} h={480}
          src={coverSrc}
          className="absolute inset-0" imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={property.name}
        />
        <span className={cx("absolute top-3 left-3 rounded-full text-[11px] font-bold uppercase tracking-wide px-3 py-1 text-white", property.type === "Villa" ? "bg-teal-600/90" : "bg-teal-800/90")}>
          {property.type}
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1">
          <Camera className="w-3 h-3" /> {property.images.length}
        </span>
      </div>
      <div className={cx("rounded-b-3xl border border-t-0 p-5 flex-1 flex flex-col", theme.border, theme.surface)}>
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-bold text-lg leading-snug">{property.name}</h3>
          <RatingStars rating={property.rating} />
        </div>
        <p className={cx("text-xs inline-flex items-center gap-1 mb-3", theme.textMuted)}><MapPin className="w-3.5 h-3.5" />{property.location}</p>
        <p className={cx("text-sm th-clamp-2 leading-relaxed mb-4", theme.textMuted)}>{property.shortDesc}</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {property.amenities.slice(0, 3).map((a) => <AmenityChip key={a} amenityKey={a} theme={theme} />)}
          {property.amenities.length > 3 && (
            <span className={cx("inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium", theme.border, theme.textMuted)}>+{property.amenities.length - 3} more</span>
          )}
        </div>
        <div className={cx("mt-auto pt-4 border-t flex items-center justify-between", theme.border)}>
          <div>
            <span className={cx("text-xs", theme.textFaint)}>From</span>
            <p className="font-bold text-lg leading-none mt-0.5">₹{property.priceFrom}<span className={cx("text-xs font-normal", theme.textMuted)}> / night</span></p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 group-hover:gap-2 transition-all">
            View details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </button>
  );
}

/* ============================================================
   BOOK FOR YOU — Destination selection
   ============================================================ */
function BookDestinationsView({ theme, dark, nav }) {
  const [query, setQuery] = useState("");
  const filtered = nav.destinations.filter((d) =>
    (d.name + " " + d.country).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main>
      <BackBar label="Back to Home" onBack={nav.goHome} dark={dark} />
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="max-w-2xl mb-10">
          <Eyebrow dark={dark}>Book For You</Eyebrow>
          <h1 className="th-display text-4xl sm:text-5xl mt-5 mb-4">Choose your destination</h1>
          <p className={cx("text-base leading-relaxed", theme.textMuted)}>Pick a place, and we'll show you the hotels and villas we've hand-picked there.</p>
        </div>

        <div className="relative max-w-md mb-12">
          <Search className={cx("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4", theme.textFaint)} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a destination or country..."
            className={cx("w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors", theme.border, theme.inputBg)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((d) => {
            const count = nav.getPropertiesByDestinationId(d.id).length;
            return (
              <button
                key={d.id}
                onClick={() => nav.selectDestination(d.id)}
                className="group relative h-72 rounded-3xl overflow-hidden text-left focus-visible:outline-amber-500"
              >
                <SmartImage photoId={d.img} fallbackQuery={`${d.name},travel`} w={480} h={620} src={d.uploadedImg} className="absolute inset-0" imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={d.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/92 via-stone-950/25 to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="th-display text-xl text-white mb-0.5">{d.name}</h3>
                  <p className="text-white/70 text-xs mb-2">{d.country}</p>
                  <span className={cx("inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full", count > 0 ? "bg-amber-500 text-stone-900" : "bg-white/15 text-white backdrop-blur-sm")}>
                    {count > 0 ? `${count} stay${count > 1 ? "s" : ""}` : "Tours only"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <EmptyState icon={Search} title="No destinations match" description="Try a different search term, or browse the full list." />
        )}
      </section>
    </main>
  );
}

/* ============================================================
   BOOK FOR YOU — Properties listing
   ============================================================ */
function BookPropertiesView({ theme, dark, nav }) {
  const destination = nav.getDestinationById(nav.selectedDestinationId) || nav.destinations[0];
  const properties = nav.getPropertiesByDestinationId(destination.id);

  return (
    <main>
      <BackBar label="Back to Destinations" onBack={nav.back} dark={dark} />

      <section className="relative h-64 sm:h-80 overflow-hidden">
        <SmartImage photoId={destination.img} fallbackQuery={`${destination.name},travel`} w={1600} h={900} eager src={destination.uploadedImg} className="absolute inset-0" imgClassName="w-full h-full object-cover" alt={destination.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 h-full flex flex-col justify-end pb-8">
          <Eyebrow dark>Book For You</Eyebrow>
          <h1 className="th-display text-3xl sm:text-5xl text-white mt-3">{destination.name}, {destination.country}</h1>
          <p className="text-white/75 text-sm sm:text-base mt-2 max-w-xl">{destination.blurb}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <p className={cx("text-sm font-semibold", theme.textMuted)}>{properties.length} {properties.length === 1 ? "property" : "properties"} found</p>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} theme={theme} dark={dark} onClick={() => nav.selectProperty(p.id)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No stays here yet"
            description={`We're still curating hotels and villas in ${destination.name}. In the meantime, our guided tour through the region covers the highlights in full.`}
            action={
              nav.tours.some((t) => t.destinations.some((td) => td.toLowerCase().includes(destination.name.toLowerCase()))) ? (
                <PrimaryButton
                  className="mt-6"
                  onClick={() => {
                    const match = nav.tours.find((t) => t.destinations.some((td) => td.toLowerCase().includes(destination.name.toLowerCase())));
                    if (match) nav.selectTour(match.id); else nav.goToTours();
                  }}
                  icon={Compass}
                >
                  See the {destination.name} tour
                </PrimaryButton>
              ) : (
                <SecondaryButton className="mt-6" dark={dark} onClick={nav.goToTours} icon={Compass}>Browse all tours</SecondaryButton>
              )
            }
          />
        )}
      </section>
    </main>
  );
}

/* ============================================================
   BOOK FOR YOU — Property details
   ============================================================ */
function PropertyDetailView({ theme, dark, nav, openInquiry }) {
  const property = nav.getPropertyById(nav.selectedPropertyId) || nav.properties[0];
  const destination = nav.getDestinationById(property.destinationId);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { setActiveImg(0); }, [property.id]);

  return (
    <main>
      <BackBar label="Back to Properties" onBack={nav.back} dark={dark} />

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12">
        {/* Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3 mb-10">
          <div className="relative h-72 sm:h-[440px] rounded-3xl overflow-hidden">
            <SmartImage photoId={property.images[activeImg]} fallbackQuery={`${property.type},interior`} w={1100} h={750} eager src={property.images[activeImg]?.startsWith?.("data:") ? property.images[activeImg] : undefined} className="absolute inset-0" imgClassName="w-full h-full object-cover" alt={`${property.name} photo ${activeImg + 1}`} />
          </div>
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible th-noscroll">
            {property.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={cx("relative shrink-0 w-24 h-20 sm:w-full sm:h-[100px] rounded-xl overflow-hidden border-2 transition-colors", i === activeImg ? "border-amber-500" : "border-transparent opacity-80 hover:opacity-100")}>
                <SmartImage photoId={img} fallbackQuery={property.type} w={220} h={170} src={img?.startsWith?.("data:") ? img : undefined} className="absolute inset-0" imgClassName="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main column */}
          <div className="lg:col-span-2">
            <span className={cx("inline-flex items-center gap-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide px-3 py-1 mb-3", property.type === "Villa" ? "bg-teal-600/15 text-teal-700" : "bg-teal-800/15 text-teal-800", dark && "bg-teal-400/15 text-teal-300")}>
              {property.type === "Villa" ? <Hotel className="w-3 h-3" /> : <Building2 className="w-3 h-3" />} {property.type}
            </span>
            <h1 className="th-display text-3xl sm:text-4xl mb-3">{property.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className={cx("inline-flex items-center gap-1.5 text-sm", theme.textMuted)}><MapPin className="w-4 h-4" />{property.location}</span>
              <RatingStars rating={property.rating} />
              <span className={cx("text-sm", theme.textFaint)}>({property.reviews} reviews)</span>
            </div>

            <h2 className="font-bold text-lg mb-3">Overview</h2>
            <p className={cx("leading-relaxed mb-10", theme.textMuted)}>{property.longDesc}</p>

            <h2 className="font-bold text-lg mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              {property.amenities.map((a) => {
                const meta = AMENITY_META[a];
                if (!meta) return null;
                const Icon = meta.icon;
                return (
                  <div key={a} className={cx("flex items-center gap-2.5 rounded-2xl border px-4 py-3", theme.border)}>
                    <IconCircle icon={Icon} tone="teal" size="sm" />
                    <span className="text-sm font-medium">{meta.label}</span>
                  </div>
                );
              })}
            </div>

            <h2 className="font-bold text-lg mb-4">Rooms</h2>
            <div className="space-y-4 mb-10">
              {property.rooms.map((r, i) => (
                <div key={i} className={cx("rounded-2xl border p-5", theme.border)}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold">{r.name}</h3>
                    <IconCircle icon={BedDouble} tone="amber" size="sm" />
                  </div>
                  <div className={cx("flex flex-wrap gap-x-5 gap-y-2 text-xs mb-3", theme.textMuted)}>
                    <span className="inline-flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5" />{r.size}</span>
                    <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Sleeps {r.occupancy}</span>
                    <span className="inline-flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" />{r.bed}</span>
                  </div>
                  <p className={cx("text-sm leading-relaxed", theme.textMuted)}>{r.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="font-bold text-lg mb-4">Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {property.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <IconCircle icon={Sparkles} tone="amber" size="sm" />
                  <span className="text-sm pt-2">{h}</span>
                </div>
              ))}
            </div>

            <h2 className="font-bold text-lg mb-4">Location</h2>
            <div className={cx("rounded-2xl overflow-hidden border", theme.border)}>
              <iframe
                title="Property location map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                width="100%" height="320" loading="lazy"
                style={{ border: 0 }}
              />
              <div className={cx("flex items-center justify-between px-5 py-4", theme.surfaceAlt)}>
                <span className={cx("text-sm inline-flex items-center gap-2", theme.textMuted)}><MapPin className="w-4 h-4" />{property.location}</span>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-amber-600 inline-flex items-center gap-1">
                  Get directions <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={cx("sticky top-24 rounded-3xl border p-6", theme.border, theme.surface)}>
              <div className="flex items-baseline justify-between mb-1">
                <span className={cx("text-xs", theme.textFaint)}>From</span>
                <RatingStars rating={property.rating} />
              </div>
              <p className="font-bold text-3xl th-display mb-1">₹{property.priceFrom}<span className={cx("text-sm font-normal", theme.textMuted)}> / night</span></p>
              <p className={cx("text-xs mb-6", theme.textFaint)}>Showcase pricing — no payment is collected.</p>
              <PrimaryButton className="w-full mb-3" icon={Send} onClick={() => openInquiry("property", property)}>Enquire Now</PrimaryButton>
              <p className={cx("text-xs text-center", theme.textFaint)}>A concierge replies within one business day.</p>

              <div className={cx("mt-6 pt-6 border-t space-y-3", theme.border)}>
                <div className="flex items-center justify-between text-sm">
                  <span className={theme.textMuted}>Destination</span>
                  <button onClick={() => nav.selectDestination(destination.id)} className="font-semibold text-amber-600">{destination.name}</button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={theme.textMuted}>Type</span>
                  <span className="font-semibold">{property.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={theme.textMuted}>Reviews</span>
                  <span className="font-semibold">{property.reviews}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-16" />
    </main>
  );
}

/* ============================================================
   INQUIRY MODAL — shared between properties & tours
   ============================================================ */
function InquiryModal({ state, onClose, dark, theme, onSubmitEnquiry }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!state.open) return null;

  const itemName = state.item ? state.item.name : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);

    // store enquiry in localStorage (via parent handler)
    onSubmitEnquiry?.({
      type: state.type,
      itemName: state.item?.name || "",
      itemId: state.item?.id || null,
      createdAt: Date.now(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    setSubmitting(false);
    setSubmitted(true);
  };


  const handleClose = () => {
    onClose();
    setTimeout(() => { setName(""); setEmail(""); setMessage(""); setSubmitted(false); }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm" onClick={handleClose} />
      <div className={cx("relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border p-7 max-h-[88vh] overflow-y-auto th-scrollbar", theme.border, theme.surface)}>
        <button onClick={handleClose} aria-label="Close" className={cx("absolute top-5 right-5 w-9 h-9 rounded-full inline-flex items-center justify-center", dark ? "hover:bg-stone-800" : "hover:bg-stone-100")}>
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <>
            <IconCircle icon={state.type === "tour" ? Compass : Building2} tone={state.type === "tour" ? "orange" : "teal"} size="lg" />
            <h2 className="th-display text-2xl mt-4 mb-1">Send an enquiry</h2>
            <p className={cx("text-sm mb-6", theme.textMuted)}>About <span className="font-semibold">{itemName}</span> — a concierge will follow up by email.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Full name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className={cx("w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-amber-500", theme.border, theme.inputBg)} placeholder="Jordan Lee" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5">Email address</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={cx("w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-amber-500", theme.border, theme.inputBg)} placeholder="jordan@email.com" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5">Message <span className={theme.textFaint}>(optional)</span></label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={cx("w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-amber-500 resize-none", theme.border, theme.inputBg)} placeholder="Travel dates, group size, anything else we should know..." />
              </div>
              <PrimaryButton type="submit" className="w-full" icon={submitting ? undefined : Send}>
                {submitting ? "Sending..." : "Send Enquiry"}
              </PrimaryButton>
              <p className={cx("text-[11px] text-center leading-relaxed", theme.textFaint)}>This is a showcase form — no real message is sent, and no payment is ever requested.</p>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 mb-5">
              <CircleCheck className="w-8 h-8" />
            </span>
            <h2 className="th-display text-2xl mb-2">Enquiry sent</h2>
            <p className={cx("text-sm mb-7 max-w-xs mx-auto", theme.textMuted)}>Thanks, {name.split(" ")[0]}. A concierge will reach out to {email} about <span className="font-semibold">{itemName}</span> shortly.</p>
            <SecondaryButton dark={dark} onClick={handleClose}>Close</SecondaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TOUR CARD — used in the listing grid
   ============================================================ */
function TourCard({ tour, theme, dark, onClick }) {
  const coverSrc = tour.uploadedImg || (tour.img?.startsWith?.("data:") ? tour.img : null);
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-3xl overflow-hidden flex flex-col focus-visible:outline-amber-500"
      style={{ boxShadow: dark ? "0 1px 0 rgba(255,255,255,0.06)" : "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      <div className="relative h-56 overflow-hidden">
        <SmartImage
          photoId={tour.img} fallbackQuery={`travel,tour,adventure`} w={640} h={440}
          src={coverSrc}
          className="absolute inset-0"
          imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={tour.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-orange-500/90 text-white text-[11px] font-bold uppercase tracking-wide px-3.5 py-1.5">
          <Compass className="w-3 h-3" /> Tour
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5">
          <ClockIcon className="w-3.5 h-3.5" /> {tour.duration}
        </span>
      </div>

      <div className={cx("rounded-b-3xl border border-t-0 p-5 flex-1 flex flex-col", theme.border, theme.surface)}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-lg leading-snug">{tour.name}</h3>
          <RatingStars rating={tour.rating} />
        </div>

        <div className={cx("flex flex-wrap gap-x-1 gap-y-0.5 items-center text-xs mb-3", theme.textMuted)}>
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {tour.destinations.map((d, i) => (
            <span key={d}>{d}{i < tour.destinations.length - 1 ? " · " : ""}</span>
          ))}
        </div>

        <p className={cx("text-sm th-clamp-2 leading-relaxed mb-4", theme.textMuted)}>{tour.shortDesc}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {tour.highlights.slice(0, 2).map((h) => (
            <span key={h} className={cx("inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium th-clamp-2", theme.border, theme.textMuted)}>
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[180px]">{h}</span>
            </span>
          ))}
        </div>

        <div className={cx("mt-auto pt-4 border-t flex items-center justify-between", theme.border)}>
          <div>
            <span className={cx("text-xs", theme.textFaint)}>From</span>
            <p className="font-bold text-lg leading-none mt-0.5">
              ₹{tour.priceFrom.toLocaleString()}
              <span className={cx("text-xs font-normal", theme.textMuted)}> / person</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 group-hover:gap-2 transition-all">
            View tour <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </button>
  );
}

/* ============================================================
   TOUR FOR YOU — listing view
   ============================================================ */
function TourListView({ theme, dark, nav }) {
  const [query, setQuery] = useState("");
  const filtered = nav.tours.filter((t) => {
    const q = query.toLowerCase();
    return (t.name + " " + t.destinations.join(" ")).toLowerCase().includes(q);
  });

  return (
    <main>
      <BackBar label="Back to Home" onBack={nav.goHome} dark={dark} />

      {/* Hero banner */}
      <section className="relative h-60 sm:h-80 overflow-hidden">
        <SmartImage
          photoId="1469474968028-56623f02e42e"
          fallbackQuery="travel,adventure,nature"
          w={1600} h={700} eager
          className="absolute inset-0"
          imgClassName="w-full h-full object-cover"
          alt="Guided tour experiences"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-stone-950/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 h-full flex flex-col justify-end pb-8">
          <Eyebrow dark>Tour For You</Eyebrow>
          <h1 className="th-display text-3xl sm:text-5xl text-white mt-3">Guided tour packages</h1>
          <p className="text-white/75 text-sm sm:text-base mt-2">Curated journeys with day-by-day itineraries and all the details up front.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="relative w-full sm:max-w-sm">
            <Search className={cx("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4", theme.textFaint)} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tours or destinations..."
              className={cx("w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors", theme.border, theme.inputBg)}
            />
          </div>
          <p className={cx("text-sm font-medium shrink-0", theme.textMuted)}>{filtered.length} tour{filtered.length !== 1 ? "s" : ""} found</p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((t) => (
              <TourCard key={t.id} tour={t} theme={theme} dark={dark} onClick={() => nav.selectTour(t.id)} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Compass} title="No tours match" description="Try a different search term, or browse all packages." />
        )}
      </section>
    </main>
  );
}

/* ============================================================
   TOUR FOR YOU — detail view
   ============================================================ */
function TourDetailView({ theme, dark, nav, openInquiry }) {
  const tour = nav.getTourById(nav.selectedTourId) || nav.tours[0];
  const [activeImg, setActiveImg] = useState(0);
  const [openDay, setOpenDay] = useState(null);

  useEffect(() => { setActiveImg(0); setOpenDay(null); }, [tour.id]);

  return (
    <main>
      <BackBar label="Back to Tours" onBack={nav.back} dark={dark} />

      {/* Hero gallery */}
      <section className="relative h-72 sm:h-[460px] overflow-hidden">
        <SmartImage
          photoId={tour.gallery[activeImg] || tour.img}
          fallbackQuery={`${tour.name},travel`}
          w={1600} h={900} eager
          src={(() => { const img = tour.gallery[activeImg] || tour.img; return img?.startsWith?.("data:") ? img : tour.uploadedImg || undefined; })()}
          className="absolute inset-0"
          imgClassName="w-full h-full object-cover"
          alt={tour.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

        {/* Thumbnail strip */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {tour.gallery.map((img, i) => (
            <button key={i} onClick={() => setActiveImg(i)}
              className={cx("w-14 h-10 rounded-lg overflow-hidden border-2 transition-colors", i === activeImg ? "border-amber-500" : "border-white/30 opacity-70 hover:opacity-100")}>
              <SmartImage photoId={img} fallbackQuery="travel" w={120} h={90} src={img?.startsWith?.("data:") ? img : undefined} className="block" imgClassName="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>

        <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/90 text-white text-xs font-bold uppercase tracking-wide px-3.5 py-1.5 mb-4">
            <Compass className="w-3 h-3" /> Tour For You
          </span>
          <h1 className="th-display text-3xl sm:text-5xl text-white mb-3">{tour.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="inline-flex items-center gap-1.5"><ClockIcon className="w-4 h-4 text-amber-400" />{tour.duration}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-400" />{tour.destinations.join(" · ")}</span>
            <RatingStars rating={tour.rating} />
            <span className="opacity-70">({tour.reviews} reviews)</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="font-bold text-xl mb-4">Tour overview</h2>
              <p className={cx("leading-relaxed", theme.textMuted)}>{tour.longDesc}</p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="font-bold text-xl mb-4">Tour highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/20 shrink-0">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                    </span>
                    <span className="text-sm leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary accordion */}
            <div>
              <h2 className="font-bold text-xl mb-5">Day-by-day itinerary</h2>
              <div className="space-y-3">
                {tour.itinerary.map((item) => {
                  const isOpen = openDay === item.day;
                  return (
                    <div key={item.day} className={cx("rounded-2xl border overflow-hidden transition-all", theme.border)}>
                      <button
                        onClick={() => setOpenDay(isOpen ? null : item.day)}
                        className={cx("w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors", isOpen ? (dark ? "bg-stone-800" : "bg-amber-50") : theme.cardHover)}
                      >
                        <div className="flex items-center gap-4">
                          <span className={cx("inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0", isOpen ? "bg-amber-500 text-stone-900" : dark ? "bg-stone-700 text-stone-300" : "bg-stone-100 text-stone-600")}>
                            {item.day}
                          </span>
                          <span className="font-semibold text-sm">{item.title}</span>
                        </div>
                        {isOpen
                          ? <ChevronUp className={cx("w-4 h-4 shrink-0", theme.textFaint)} />
                          : <ChevronDown className={cx("w-4 h-4 shrink-0", theme.textFaint)} />
                        }
                      </button>
                      {isOpen && (
                        <div className={cx("px-5 pb-5 pt-3 border-t", theme.border)}>
                          <p className={cx("text-sm leading-relaxed", theme.textMuted)}>{item.description}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Included / Excluded */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CircleCheck className="w-5 h-5 text-emerald-500" /> Included
                </h2>
                <ul className="space-y-2.5">
                  {tour.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className={theme.textMuted}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CircleX className="w-5 h-5 text-rose-400" /> Not included
                </h2>
                <ul className="space-y-2.5">
                  {tour.excluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <X className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      <span className={theme.textMuted}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={cx("sticky top-24 rounded-3xl border p-6", theme.border, theme.surface)}>
              <div className="flex items-baseline justify-between mb-1">
                <span className={cx("text-xs", theme.textFaint)}>From</span>
                <RatingStars rating={tour.rating} />
              </div>
              <p className="font-bold text-3xl th-display mb-1">
                ₹{tour.priceFrom.toLocaleString()}
                <span className={cx("text-sm font-normal", theme.textMuted)}> / person</span>
              </p>
              <p className={cx("text-xs mb-6", theme.textFaint)}>Showcase pricing — no payment is collected.</p>

              <PrimaryButton className="w-full mb-3" icon={Send} onClick={() => openInquiry("tour", tour)}>
                Enquire About This Tour
              </PrimaryButton>
              <p className={cx("text-xs text-center", theme.textFaint)}>A concierge replies within one business day.</p>

              <div className={cx("mt-6 pt-6 border-t space-y-3", theme.border)}>
                {[
                  { label: "Duration", value: tour.duration, icon: ClockIcon },
                  { label: "Destinations", value: tour.destinations.join(", "), icon: MapPin },
                  { label: "Reviews", value: `${tour.reviews} reviews`, icon: Star },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start justify-between gap-3 text-sm">
                    <span className={cx("flex items-center gap-1.5", theme.textMuted)}>
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </span>
                    <span className="font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related tours */}
            <div className="mt-8">
              <h3 className="font-bold text-base mb-4">Other tours you might like</h3>
              <div className="space-y-3">
                {nav.tours.filter((t) => t.id !== tour.id).slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => nav.selectTour(t.id)}
                    className={cx("w-full flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors", theme.border, theme.cardHover)}
                  >
                    <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0">
                      <SmartImage photoId={t.img} fallbackQuery="travel" w={120} h={100} src={t.uploadedImg || (t.img?.startsWith?.("data:") ? t.img : undefined)} className="absolute inset-0" imgClassName="w-full h-full object-cover" alt={t.name} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{t.name}</p>
                      <p className={cx("text-xs truncate", theme.textMuted)}>{t.duration}</p>
                    </div>
                    <ChevronRight className={cx("w-4 h-4 shrink-0 ml-auto", theme.textFaint)} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-8" />
    </main>
  );
}

/* ============================================================
   ADMIN PANEL — full dashboard with sidebar, stats, CRUD stubs
   ============================================================ */
const ADMIN_PASS = "admin123";

function AdminLogin({ onLogin, dark, theme }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASS) { onLogin(); }
    else { setError(true); setTimeout(() => setError(false), 1800); }
  };

  return (
    <div className={cx("min-h-screen flex items-center justify-center px-4", dark ? "bg-stone-950" : "bg-teal-950")}>
      <style>{GLOBAL_STYLES}</style>
      <div className={cx("w-full max-w-sm rounded-3xl border p-8", theme.border, theme.surface)}>
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 mb-4">
            <Compass className="w-7 h-7 text-stone-900" strokeWidth={2.2} />
          </span>
          <h1 className="th-display text-2xl font-semibold">Travel Hub</h1>
          <p className={cx("text-sm mt-1", theme.textMuted)}>Admin dashboard</p>
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className={cx("w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-amber-500 pr-10", theme.border, theme.inputBg, error && "border-rose-500")}
              />
              <button type="button" onClick={() => setShow(!show)} className={cx("absolute right-3 top-1/2 -translate-y-1/2", theme.textFaint)}>
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-rose-500 text-xs mt-1.5">Incorrect password"</p>}
          </div>
          <PrimaryButton type="submit" className="w-full" icon={Lock}>Sign In</PrimaryButton>
        </form>
        <p className={cx("text-xs text-center mt-4", theme.textFaint)}> <code className="font-mono"></code></p>
      </div>
    </div>
  );
}

function AdminSidebar({ activeSection, setSection, dark, theme, onLogout, collapsed, setCollapsed }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "destinations", label: "Destinations", icon: Globe },
    { id: "properties", label: "Hotels & Villas", icon: Hotel },
    { id: "tours", label: "Tour Packages", icon: Compass },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
    { id: "media", label: "Media", icon: ImageIcon },
  ];

  return (
    <aside className={cx("flex flex-col border-r transition-all duration-300", theme.border, dark ? "bg-stone-900" : "bg-teal-950", collapsed ? "w-[72px]" : "w-64")}>
      <div className={cx("h-16 flex items-center border-b shrink-0", theme.border, collapsed ? "justify-center px-0" : "px-6 gap-3")}>
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-500 shrink-0">
          <Compass className="w-5 h-5 text-stone-900" strokeWidth={2.2} />
        </span>
        {!collapsed && <span className="th-display text-lg font-semibold text-white truncate">Travel Hub</span>}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-hidden">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            title={collapsed ? label : undefined}
            className={cx(
              "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              activeSection === id
                ? "bg-amber-500 text-stone-900"
                : "text-teal-100/70 hover:bg-white/10 hover:text-white",
              collapsed && "justify-center"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <div className={cx("p-3 border-t space-y-1 shrink-0", dark ? "border-stone-700" : "border-teal-900")}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-teal-100/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-300/80 hover:bg-rose-500/15 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

function AdminHeader({ section, dark, theme, nav }) {
  const titles = {
    dashboard: "Dashboard",
    destinations: "Destinations",
    properties: "Hotels & Villas",
    tours: "Tour Packages",
    media: "Media Library",
  };
  return (
    <header className={cx("h-16 border-b flex items-center justify-between px-6 shrink-0", theme.border, theme.surface)}>
      <h2 className="text-lg font-bold">{titles[section] || "Admin"}</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={nav.goHome}
          className={cx("inline-flex items-center gap-1.5 text-sm font-semibold rounded-full border px-4 py-2 transition-colors", theme.border, dark ? "text-stone-200 hover:bg-stone-800" : "text-stone-700 hover:bg-stone-100")}
        >
          <Globe className="w-3.5 h-3.5" /> View site
        </button>
        <span className={cx("inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold")}>
          AD
        </span>
      </div>
    </header>
  );
}

function StatCard({ label, value, icon: Icon, change, tone = "amber", theme }) {
  const tones = { amber: "text-amber-500", teal: "text-teal-600", orange: "text-orange-500", rose: "text-rose-500" };
  const bgTones = { amber: "bg-amber-500/10", teal: "bg-teal-600/10", orange: "bg-orange-500/10", rose: "bg-rose-500/10" };
  return (
    <div className={cx("rounded-2xl border p-5", theme.border, theme.surface)}>
      <div className="flex items-center justify-between mb-4">
        <span className={cx("text-xs font-semibold uppercase tracking-wide", theme.textMuted)}>{label}</span>
        <span className={cx("inline-flex items-center justify-center w-9 h-9 rounded-xl", bgTones[tone])}>
          <Icon className={cx("w-4 h-4", tones[tone])} />
        </span>
      </div>
      <p className="th-display text-3xl font-semibold mb-1">{value}</p>
      {change && <p className="text-xs text-emerald-500 font-medium">{change}</p>}
    </div>
  );
}

function AdminTable({ columns, rows, onEdit, onDelete, theme, dark }) {
  return (
    <div className={cx("rounded-2xl border overflow-hidden", theme.border)}>
      <div className="overflow-x-auto th-scrollbar">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className={cx("border-b text-xs font-bold uppercase tracking-wide", theme.border, dark ? "bg-stone-900" : "bg-stone-50")}>
              {columns.map((col) => (
                <th key={col} className={cx("px-5 py-3 text-left", theme.textMuted)}>{col}</th>
              ))}
              <th className={cx("px-5 py-3 text-right", theme.textMuted)}>Actions</th>
            </tr>
          </thead>
          <tbody className={cx("divide-y", theme.border)}>
            {rows.map((row, i) => (
              <tr key={i} className={cx("transition-colors", theme.cardHover)}>
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-4 text-sm">{cell}</td>
                ))}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit && onEdit(i)}
                      className={cx("w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors", dark ? "hover:bg-stone-700" : "hover:bg-stone-100")}
                    >
                      <Pencil className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(i)}
                      className={cx("w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors", dark ? "hover:bg-rose-900/30" : "hover:bg-rose-50")}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminFormModal({ open, onClose, title, fields, dark, theme, mode, onSave, initialValues }) {
  const [vals, setVals] = useState(initialValues || {});

  useEffect(() => {
    if (open) setVals(initialValues || {});
  }, [open, initialValues]);

  const handleFileUpload = (name, files, multiple) => {
    if (!files?.length) return;
    const readers = Array.from(files).map((file) => compressImage(file));
    Promise.all(readers).then((dataUrls) => {
      setVals((v) => {
        if (multiple) {
          const existing = Array.isArray(v[name]) ? v[name] : [];
          return { ...v, [name]: [...dataUrls, ...existing] };
        }
        return { ...v, [name]: dataUrls[0] };
      });
    });
  };

  const removeImage = (name, index) => {
    setVals((v) => {
      const current = v[name];
      if (Array.isArray(current)) {
        return { ...v, [name]: current.filter((_, i) => i !== index) };
      }
      return { ...v, [name]: null };
    });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cx("relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border p-7 max-h-[88vh] overflow-y-auto th-scrollbar", theme.border, theme.surface)}>
        <button
          onClick={onClose}
          className={cx("absolute top-5 right-5 w-9 h-9 rounded-full inline-flex items-center justify-center", dark ? "hover:bg-stone-800" : "hover:bg-stone-100")}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="th-display text-2xl mb-6">{title}</h2>
        <div className="space-y-4">
          {fields.map(({ name, label, type = "text", placeholder, multiple }) => (
            <div key={name}>
              <label className="text-xs font-semibold block mb-1.5">{label}</label>
              {type === "textarea" ? (
                <textarea
                  rows={3}
                  placeholder={placeholder}
                  value={vals[name] || ""}
                  onChange={(e) => setVals((v) => ({ ...v, [name]: e.target.value }))}
                  className={cx("w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-amber-500 resize-none", theme.border, theme.inputBg)}
                />
              ) : type === "imageUpload" ? (
                <div className="space-y-3">
                  <label className={cx("flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-sm cursor-pointer transition-colors hover:border-amber-500", theme.border, theme.textMuted)}>
                    <Upload className="w-6 h-6 opacity-50" />
                    <span>{multiple ? "Click to upload images" : "Click to upload an image"}</span>
                    <input
                      type="file"
                      multiple={multiple}
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        handleFileUpload(name, e.target.files, multiple);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {vals[name] && (
                    <div className={cx("flex gap-2 flex-wrap", multiple ? "" : "")}>
                      {multiple && Array.isArray(vals[name]) ? (
                        vals[name].map((src, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(name, i)}
                              style={{ position: "absolute", top: 2, right: 2, zIndex: 10, width: 20, height: 20, borderRadius: "50%", background: "rgba(225,29,72,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <X className="text-white" style={{ width: 10, height: 10 }} />
                            </button>
                          </div>
                        ))
                      ) : typeof vals[name] === "string" ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                          <img src={vals[name]} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(name)}
                            style={{ position: "absolute", top: 2, right: 2, zIndex: 10, width: 20, height: 20, borderRadius: "50%", background: "rgba(225,29,72,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <X className="text-white" style={{ width: 10, height: 10 }} />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type={type}
                  placeholder={placeholder}
                  value={vals[name] || ""}
                  onChange={(e) => setVals((v) => ({ ...v, [name]: e.target.value }))}
                  className={cx("w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-amber-500", theme.border, theme.inputBg)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <PrimaryButton
            className="flex-1"
            icon={Check}
            onClick={() => onSave?.(vals)}
          >
            Save
          </PrimaryButton>
          <SecondaryButton dark={dark} className="flex-1" onClick={onClose} icon={X}>
            Cancel
          </SecondaryButton>
        </div>
        <p className={cx("text-[11px] text-center mt-3", theme.textFaint)}>
          This is a UI demo — data is stored in localStorage.
        </p>
      </div>
    </div>
  );
}


function AdminDashboard({ theme, dark, nav }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-base mb-5">Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Destinations" value={nav.destinations.length} icon={Globe} change="+1 this month" tone="teal" theme={theme} />
          <StatCard label="Hotels" value={nav.properties.filter((p) => p.type === "Hotel").length} icon={Building2} change="+2 this month" tone="amber" theme={theme} />
          <StatCard label="Villas" value={nav.properties.filter((p) => p.type === "Villa").length} icon={Hotel} change="Unchanged" tone="orange" theme={theme} />
          <StatCard label="Tour Packages" value={nav.tours.length} icon={Compass} change="+1 this month" tone="teal" theme={theme} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-base mb-4">Recent properties</h3>
          <div className="space-y-3">
            {nav.properties.slice(0, 5).map((p) => (
              <div key={p.id} className={cx("flex items-center gap-3 rounded-xl border px-4 py-3", theme.border)}>
                <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0">
                  <SmartImage photoId={p.images[0]} fallbackQuery={p.type} w={100} h={80} className="absolute inset-0" imgClassName="w-full h-full object-cover" alt={p.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <p className={cx("text-xs truncate", theme.textMuted)}>{p.location}</p>
                </div>
                <span className={cx("text-xs font-bold px-2.5 py-1 rounded-full shrink-0", p.type === "Villa" ? "bg-teal-500/15 text-teal-600" : "bg-amber-500/15 text-amber-600")}>{p.type}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-base mb-4">Recent tours</h3>
          <div className="space-y-3">
            {nav.tours.slice(0, 5).map((t) => (
              <div key={t.id} className={cx("flex items-center gap-3 rounded-xl border px-4 py-3", theme.border)}>
                <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0">
                  <SmartImage photoId={t.img} fallbackQuery="travel" w={100} h={80} className="absolute inset-0" imgClassName="w-full h-full object-cover" alt={t.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{t.name}</p>
                  <p className={cx("text-xs truncate", theme.textMuted)}>{t.duration}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-600 shrink-0">₹{t.priceFrom.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDestinations({ theme, dark, nav }) {
  const am = nav.adminModal;
  const isDestModal = am?.open && am?.entity === "destinations";
  const isEdit = am?.mode === "edit";
  const editingDest = isEdit ? nav.destinations.find((d) => d.id === am.entityId) : null;

  const getInitialValues = () => {
    if (!editingDest) return null;
    return {
      name: editingDest.name,
      country: editingDest.country,
      blurb: editingDest.blurb,
      tag: editingDest.tag,
      img: editingDest.img,
      uploadedImg: editingDest.uploadedImg || null,
    };
  };

  const handleSave = (values) => {
    if (isEdit) {
      nav.saveAdminModal("destinations", "edit", am.entityId, values);
    } else {
      nav.saveAdminModal("destinations", "create", null, values);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className={cx("text-sm", theme.textMuted)}>{nav.destinations.length} destinations total</p>
        <PrimaryButton icon={Plus} onClick={() => nav.openAdminCreate("destinations")}>Add Destination</PrimaryButton>
      </div>
      <AdminTable
        columns={["Name", "Country", "Tag"]}
        rows={nav.destinations.map((d) => [
          <span className="font-semibold">{d.name}</span>,
          d.country,
          <span className="rounded-full bg-teal-500/15 text-teal-600 text-xs font-bold px-2.5 py-1">{d.tag}</span>,
        ])}
        onEdit={(rowIndex) => nav.openAdminEdit("destinations", nav.destinations[rowIndex]?.id)}
        onDelete={(rowIndex) => nav.saveAdminModal("destinations", "delete", nav.destinations[rowIndex]?.id)}
        theme={theme} dark={dark}
      />
      <AdminFormModal
        open={isDestModal}
        onClose={() => nav.closeAdminModal()}
        title={isEdit ? "Edit Destination" : "Add Destination"}
        dark={dark}
        theme={theme}
        mode={isEdit ? "edit" : "create"}
        initialValues={getInitialValues()}
        fields={[
          { name: "name", label: "Destination name", placeholder: "e.g. Bali" },
          { name: "country", label: "Country", placeholder: "e.g. Indonesia" },
          { name: "blurb", label: "Short description", type: "textarea", placeholder: "One sentence..." },
          { name: "tag", label: "Tag", placeholder: "e.g. Tropical" },
          { name: "uploadedImg", label: "Image", type: "imageUpload" },
          { name: "img", label: "Or paste Unsplash photo ID", placeholder: "e.g. 1537953773345-d172ccf13cf1" },
        ]}
        onSave={handleSave}
      />
    </div>
  );
}



function AdminProperties({ theme, dark, nav }) {
  const am = nav.adminModal;
  const isPropModal = am?.open && am?.entity === "properties";
  const isEdit = am?.mode === "edit";
  const editingProp = isEdit ? nav.properties.find((p) => p.id === am.entityId) : null;

  const getInitialValues = () => {
    if (!editingProp) return null;
    return {
      name: editingProp.name,
      type: editingProp.type,
      destinationName: nav.destinations.find((d) => d.id === editingProp.destinationId)?.name || "",
      location: editingProp.location,
      desc: editingProp.shortDesc,
      longdesc: editingProp.longDesc,
      amenities: editingProp.amenities.join(", "),
      price: editingProp.priceFrom,
      rating: editingProp.rating,
      reviews: editingProp.reviews,
      uploadedImages: editingProp.uploadedImages || [],
    };
  };

  const handleSave = (values) => {
    const destName = values.destinationName || values.destination;
    if (isEdit) {
      nav.saveAdminModal("properties", "edit", am.entityId, { ...values, destinationName: destName, priceFrom: values.price, price: undefined });
    } else {
      nav.saveAdminModal("properties", "create", null, { ...values, destinationName: destName, priceFrom: values.price, price: undefined });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className={cx("text-sm", theme.textMuted)}>
          {nav.properties.length} properties — {nav.properties.filter((p) => p.type === "Hotel").length} hotels, {nav.properties.filter((p) => p.type === "Villa").length} villas
        </p>
        <PrimaryButton icon={Plus} onClick={() => { nav.openAdminCreate("properties"); }}>
          Add Property
        </PrimaryButton>
      </div>

      <AdminTable
        columns={["Property", "Destination", "Type", "Rating"]}
        rows={nav.properties.map((p) => [
          <span className="font-semibold">{p.name}</span>,
          nav.destinations.find((d) => d.id === p.destinationId)?.name || "—",
          <span
            className={cx(
              "rounded-full text-xs font-bold px-2.5 py-1",
              p.type === "Villa" ? "bg-teal-500/15 text-teal-600" : "bg-amber-500/15 text-amber-600"
            )}
          >
            {p.type}
          </span>,
          <RatingStars rating={p.rating} />,
        ])}
        onEdit={(rowIndex) => nav.openAdminEdit("properties", nav.properties[rowIndex]?.id)}
        onDelete={(rowIndex) => nav.saveAdminModal("properties", "delete", nav.properties[rowIndex]?.id)}
        theme={theme}
        dark={dark}
      />

      <AdminFormModal
        open={isPropModal}
        onClose={() => nav.closeAdminModal()}
        title={isEdit ? "Edit Hotel / Villa" : "Add Hotel / Villa"}
        dark={dark}
        theme={theme}
        mode={isEdit ? "edit" : "create"}
        initialValues={getInitialValues()}
        fields={[
          { name: "name", label: "Property name", placeholder: "e.g. Cliffside Garden Villa" },
          { name: "type", label: "Type (Hotel / Villa)", placeholder: "Hotel" },
          { name: "destinationName", label: "Destination (type name)", placeholder: "e.g. Bali" },
          { name: "location", label: "Location detail", placeholder: "e.g. Seminyak, Bali" },
          { name: "desc", label: "Short description", type: "textarea", placeholder: "One sentence overview..." },
          { name: "longdesc", label: "Full description", type: "textarea", placeholder: "Detailed description..." },
          { name: "uploadedImages", label: "Property Images", type: "imageUpload", multiple: true },
          { name: "amenities", label: "Amenities (comma-separated)", placeholder: "wifi, pool, breakfast..." },
          { name: "price", label: "Nightly price from (₹ INR)", type: "number", placeholder: "420" },
          { name: "rating", label: "Rating", type: "number", placeholder: "4.8" },
          { name: "reviews", label: "Reviews", type: "number", placeholder: "200" },
        ]}
        onSave={handleSave}
      />
    </div>
  );
}


function AdminTours({ theme, dark, nav }) {
  const am = nav.adminModal;
  const isTourModal = am?.open && am?.entity === "tours";
  const isEdit = am?.mode === "edit";
  const editingTour = isEdit ? nav.tours.find((t) => t.id === am.entityId) : null;

  const getInitialValues = () => {
    if (!editingTour) return null;
    return {
      name: editingTour.name,
      duration: editingTour.duration,
      destinations: editingTour.destinations.join(", "),
      shortdesc: editingTour.shortDesc,
      longdesc: editingTour.longDesc,
      highlights: editingTour.highlights.join("\n"),
      included: editingTour.included.join("\n"),
      excluded: editingTour.excluded.join("\n"),
      price: editingTour.priceFrom,
      uploadedImg: editingTour.uploadedImg || null,
      uploadedGallery: editingTour.uploadedGallery || [],
    };
  };

  const handleSave = (values) => {
    if (isEdit) {
      nav.saveAdminModal("tours", "edit", am.entityId, values);
    } else {
      nav.saveAdminModal("tours", "create", null, values);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className={cx("text-sm", theme.textMuted)}>{nav.tours.length} tour packages</p>
        <PrimaryButton
          icon={Plus}
          onClick={() => {
            nav.openAdminCreate("tours");
          }}
        >
          Add Tour Package
        </PrimaryButton>
      </div>

      <AdminTable
        columns={["Tour name", "Duration", "Destinations", "Price from"]}
        rows={nav.tours.map((t) => [
          <span className="font-semibold">{t.name}</span>,
          t.duration,
          t.destinations.join(", "),
          `$${t.priceFrom.toLocaleString()}`,
        ])}
        onEdit={(rowIndex) => nav.openAdminEdit("tours", nav.tours[rowIndex]?.id)}
        onDelete={(rowIndex) => nav.saveAdminModal("tours", "delete", nav.tours[rowIndex]?.id)}
        theme={theme} dark={dark}
      />

      <AdminFormModal
        open={isTourModal} onClose={() => nav.closeAdminModal()}
        title={isEdit ? "Edit Tour Package" : "Add Tour Package"}
        dark={dark} theme={theme}
        mode={isEdit ? "edit" : "create"}
        initialValues={getInitialValues()}
        fields={[
          { name: "name", label: "Tour name", placeholder: "e.g. Aegean Island Hopper" },
          { name: "duration", label: "Duration", placeholder: "e.g. 7 Days / 6 Nights" },
          { name: "destinations", label: "Destinations (comma-separated)", placeholder: "Athens, Santorini, Mykonos" },
          { name: "uploadedImg", label: "Cover Image", type: "imageUpload" },
          { name: "uploadedGallery", label: "Gallery Images", type: "imageUpload", multiple: true },
          { name: "shortdesc", label: "Short description", type: "textarea", placeholder: "One-liner teaser..." },
          { name: "longdesc", label: "Full description", type: "textarea", placeholder: "Full overview..." },
          { name: "highlights", label: "Highlights (one per line)", type: "textarea", placeholder: "Caldera sunset dinner\nAcropolis guided tour..." },
          { name: "included", label: "Included (one per line)", type: "textarea", placeholder: "Daily breakfast\nAirport transfers..." },
          { name: "excluded", label: "Not included (one per line)", type: "textarea", placeholder: "International flights\nTravel insurance..." },
          { name: "price", label: "Price per person from (₹ INR)", type: "number", placeholder: "1490" },
        ]}
        onSave={handleSave}
      />
    </div>
  );
}

function AdminEnquiries({ theme, dark, enquiries }) {
  const rows = enquiries
    .slice()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className={cx("text-sm", theme.textMuted)}>{rows.length} enquiries</p>
        <button
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
            dark ? "border-stone-700 text-stone-200 hover:bg-stone-800" : "border-stone-300 text-stone-700 hover:bg-stone-100"
          )}
          onClick={() => {
            try {
              localStorage.removeItem("travel-hub:enquiries");
              window.location.reload();
            } catch {
              // ignore
            }
          }}
        >
          Clear all
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto th-scrollbar">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className={cx("border-b text-xs font-bold uppercase tracking-wide", theme.border, dark ? "bg-stone-900" : "bg-stone-50")}>
                <th className={cx("px-5 py-3 text-left", theme.textMuted)}>Time</th>
                <th className={cx("px-5 py-3 text-left", theme.textMuted)}>Name</th>
                <th className={cx("px-5 py-3 text-left", theme.textMuted)}>Email</th>
                <th className={cx("px-5 py-3 text-left", theme.textMuted)}>Type</th>
                <th className={cx("px-5 py-3 text-left", theme.textMuted)}>Item</th>
                <th className={cx("px-5 py-3 text-left", theme.textMuted)}>Message</th>
              </tr>
            </thead>
            <tbody className={cx("divide-y", theme.border)}>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-sm text-center" style={{ color: dark ? "#cbd5e1" : "#4b5563" }}>
                    No enquiries yet.
                  </td>
                </tr>
              ) : (
                rows.map((q) => (
                  <tr key={q.id} className={cx("transition-colors", theme.cardHover)}>
                    <td className="px-5 py-4 text-sm">{q.createdAt ? new Date(q.createdAt).toLocaleString() : "—"}</td>
                    <td className="px-5 py-4 text-sm">{q.name || "—"}</td>
                    <td className="px-5 py-4 text-sm">{q.email || "—"}</td>
                    <td className="px-5 py-4 text-sm">{q.type || "—"}</td>
                    <td className="px-5 py-4 text-sm">{q.itemName || "—"}</td>
                    <td className="px-5 py-4 text-sm max-w-[320px]">
                      <div className="truncate" title={q.message || ""}>{q.message || "(no message)"}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminMedia({ theme, dark, nav }) {

  const unsplashImages = [
    ...nav.properties.flatMap((p) => p.images.slice(0, 2)),
    ...nav.tours.map((t) => t.img),
  ].slice(0, 18);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className={cx("text-sm", theme.textMuted)}>{unsplashImages.length + nav.mediaImages.length} assets in library</p>
        <label className={cx("inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 cursor-pointer hover:bg-amber-400 transition-colors")}>
          <Upload className="w-4 h-4" /> Upload images
          <input
            type="file"
            multiple
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) nav.addMediaImages(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {unsplashImages.length > 0 && (
        <div>
          <p className={cx("text-xs font-semibold uppercase tracking-wide mb-3", theme.textMuted)}>From properties & tours</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {unsplashImages.map((img, i) => (
              <div key={`unsplash-${i}`} className="rounded-xl overflow-hidden" style={{ position: "relative" }}>
                <div style={{ position: "relative", width: "100%", paddingTop: "100%" }}>
                  <SmartImage photoId={img} fallbackQuery="travel" w={200} h={200} className="absolute inset-0" imgClassName="w-full h-full object-cover" alt="" />
                </div>
                <button
                  onClick={() => nav.openLightbox(`https://images.unsplash.com/photo-${img}?w=1200&h=900&q=80&fit=crop&auto=format`)}
                  style={{ position: "absolute", top: 6, right: 6, zIndex: 20, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Eye className="text-white" style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {nav.mediaImages.length > 0 && (
        <div>
          <p className={cx("text-xs font-semibold uppercase tracking-wide mb-3", theme.textMuted)}>Uploaded images</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {nav.mediaImages.map((src, i) => (
              <div key={`upload-${i}`} className="rounded-xl overflow-hidden" style={{ position: "relative" }}>
                <div style={{ position: "relative", width: "100%", paddingTop: "100%" }}>
                  <img src={src} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <button
                  onClick={() => nav.openLightbox(src)}
                  style={{ position: "absolute", top: 6, right: 40, zIndex: 20, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Eye className="text-white" style={{ width: 14, height: 14 }} />
                </button>
                <button
                  onClick={() => nav.removeMediaImage(i)}
                  style={{ position: "absolute", top: 6, right: 6, zIndex: 20, width: 28, height: 28, borderRadius: "50%", background: "rgba(225,29,72,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Trash2 className="text-white" style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {unsplashImages.length === 0 && nav.mediaImages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <ImageIcon className="w-10 h-10 opacity-30 mb-3" />
          <p className={cx("text-sm", theme.textMuted)}>No images yet. Upload some to get started.</p>
        </div>
      )}
    </div>
  );
}

function AdminPanel({ nav, dark, setDark, theme, enquiries }) {

  const [loggedIn, setLoggedIn] = useState(false);
  const [section, setSection] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} dark={dark} theme={theme} />;

  return (
    <div className={cx("th-root min-h-screen flex", theme.page)}>
      <style>{GLOBAL_STYLES}</style>
      <AdminSidebar
        activeSection={section} setSection={setSection}
        dark={dark} theme={theme}
        onLogout={() => setLoggedIn(false)}
        collapsed={collapsed} setCollapsed={setCollapsed}
      />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <AdminHeader section={section} dark={dark} theme={theme} nav={nav} />
        <main className={cx("flex-1 p-6 sm:p-8 overflow-y-auto th-scrollbar", dark ? "bg-stone-950" : "bg-stone-50")}>
          {section === "dashboard" && <AdminDashboard theme={theme} dark={dark} nav={nav} />}
          {section === "destinations" && <AdminDestinations theme={theme} dark={dark} nav={nav} />}
          {section === "properties" && <AdminProperties theme={theme} dark={dark} nav={nav} />}
          {section === "tours" && <AdminTours theme={theme} dark={dark} nav={nav} />}
          {section === "enquiries" && <AdminEnquiries theme={theme} dark={dark} enquiries={enquiries} />}



          {section === "media" && <AdminMedia theme={theme} dark={dark} nav={nav} />}


        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);

  // ==========================
  // Admin state + persistence
  // ==========================
  const loadLs = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  };

  const [destinations, setDestinations] = useState(() => loadLs("travel-hub:destinations", DESTINATIONS));
  const [properties, setProperties] = useState(() => loadLs("travel-hub:properties", PROPERTIES));
  const [tours, setTours] = useState(() => loadLs("travel-hub:tours", TOURS));

  useEffect(() => { saveLs("travel-hub:destinations", destinations); }, [destinations]);
  useEffect(() => { saveLs("travel-hub:properties", properties); }, [properties]);
  useEffect(() => { saveLs("travel-hub:tours", tours); }, [tours]);

  // Data getters re-bound to state
  const getDestinationByState = (id) => destinations.find((d) => d.id === id);
  const getPropertiesByDestinationByState = (destId) => properties.filter((p) => p.destinationId === destId);
  const getPropertyByState = (id) => properties.find((p) => p.id === id);
  const getTourByState = (id) => tours.find((t) => t.id === id);

  const [view, setView] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedTourId, setSelectedTourId] = useState(null);

  // CRUD modal state
  const [adminModal, setAdminModal] = useState({
    open: false,
    mode: "create", // create | edit
    entity: null, // destinations | properties | tours
    entityId: null,
  });

  const [adminFormKey, setAdminFormKey] = useState(0);

  const [inquiry, setInquiry] = useState({ open: false, type: null, item: null });

  const [enquiries, setEnquiries] = useState(() => {
    try {
      const raw = localStorage.getItem("travel-hub:enquiries");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    saveLs("travel-hub:enquiries", enquiries);
  }, [enquiries]);

  const [mediaImages, setMediaImages] = useState(() => loadLs("travel-hub:media", []));

  useEffect(() => {
    saveLs("travel-hub:media", mediaImages);
  }, [mediaImages]);

  const [lightboxImage, setLightboxImage] = useState(null);

  const theme = useThemeTokens(dark);





  // Scroll to top and close mobile menu on every view change
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" });
    setMobileOpen(false);
  }, [view]);

  const openInquiry = (type, item) => setInquiry({ open: true, type, item });
  const closeInquiry = () => setInquiry((s) => ({ ...s, open: false }));

  const addEnquiry = (payload) => {
    setEnquiries((prev) => [{
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      ...payload,
    }, ...prev]);
  };


  const nav = {
    view,
    goHome: () => setView("home"),
    goToDestinations: () => setView("book-destinations"),
    goToTours: () => setView("tour-list"),
    goToAdmin: () => setView("admin"),
    selectDestination: (id) => { setSelectedDestinationId(id); setView("book-properties"); },
    selectProperty: (id) => { setSelectedPropertyId(id); setView("book-property-detail"); },
    selectTour: (id) => { setSelectedTourId(id); setView("tour-detail"); },
    back: () => {
      if (view === "book-properties") setView("book-destinations");
      else if (view === "book-property-detail") setView("book-properties");
      else if (view === "tour-detail") setView("tour-list");
      else setView("home");
    },
    selectedDestinationId, selectedPropertyId, selectedTourId,
    destinations,
    properties,
    tours,
    getDestinationById: getDestinationByState,
    getPropertiesByDestinationId: getPropertiesByDestinationByState,
    getPropertyById: getPropertyByState,
    getTourById: getTourByState,
    getToursByDestination: (destName) => tours.filter((t) => t.destinations.some((td) => td.toLowerCase().includes(destName.toLowerCase()))),
    openAdminCreate: (entity) => setAdminModal({ open: true, mode: "create", entity, entityId: null }),
    openAdminEdit: (entity, entityId) => setAdminModal({ open: true, mode: "edit", entity, entityId }),
    closeAdminModal: () => setAdminModal((s) => ({ ...s, open: false })),
    adminModal,
    saveAdminModal: (entity, mode, entityId, values) => {
      const normalize = (s) => (typeof s === "string" ? s.trim() : s);

      if (entity === "destinations") {
        if (mode === "delete") {
          setDestinations((prev) => prev.filter((d) => d.id !== entityId));
        } else if (mode === "create") {
          const newItem = {
            id: values?.id || `${Date.now()}`,
            name: normalize(values?.name) || "Untitled Destination",
            country: normalize(values?.country) || "",
            blurb: normalize(values?.blurb) || "",
            img: normalize(values?.img) || "",
            tag: normalize(values?.tag) || "",
            uploadedImg: values?.uploadedImg || null,
          };
          setDestinations((prev) => [newItem, ...prev]);
        } else {
          setDestinations((prev) =>
            prev.map((d) =>
              d.id === entityId
                ? {
                    ...d,
                    ...values,
                    name: normalize(values?.name) || d.name,
                    country: normalize(values?.country) || d.country,
                    blurb: normalize(values?.blurb) || d.blurb,
                    tag: normalize(values?.tag) || d.tag,
                    img: normalize(values?.img) || d.img,
                    uploadedImg: values?.uploadedImg !== undefined ? values.uploadedImg : d.uploadedImg,
                  }
                : d
            )
          );
        }
      }


      if (entity === "properties") {
        if (mode === "delete") {
          setProperties((prev) => prev.filter((p) => p.id !== entityId));
        } else if (mode === "create") {
          const destName = normalize(values.destinationName);
          const dest = destinations.find((d) => d.name === destName);
          const uploadedImgs = Array.isArray(values.uploadedImages) && values.uploadedImages.length ? values.uploadedImages : [];
          const newItem = {
            id: values.id || `${Date.now()}`,
            destinationId: dest?.id || destinations[0]?.id || "",
            type: values.type || "Hotel",
            name: normalize(values.name) || "Untitled Property",
            location: normalize(values.location) || "",
            shortDesc: normalize(values.desc) || "",
            longDesc: normalize(values.longdesc) || "",
            images: uploadedImgs.length > 0
              ? uploadedImgs
              : Array.isArray(values.images) && values.images.length ? values.images : values.image ? [values.image] : (values.imgs ? values.imgs : []),
            amenities: typeof values.amenities === "string" && values.amenities.trim() ? values.amenities.split(",").map((x) => x.trim()).filter(Boolean) : [],
            rating: Number(values.rating ?? 4.5) || 4.5,
            reviews: Number(values.reviews ?? 0) || 0,
            priceFrom: Number(values.priceFrom ?? values.price) || 0,
            rooms: Array.isArray(values.rooms) && values.rooms.length ? values.rooms : [],
            highlights: Array.isArray(values.highlights) && values.highlights.length ? values.highlights : [],
          };
          setProperties((prev) => [newItem, ...prev]);
        } else if (mode === "edit") {
          const destName = normalize(values.destinationName || values.destination);
          const dest = destinations.find((d) => d.name === destName);
          const uploadedImgs = Array.isArray(values.uploadedImages) ? values.uploadedImages : undefined;
          setProperties((prev) =>
            prev.map((p) =>
              p.id === entityId
                ? {
                    ...p,
                    name: normalize(values.name) || p.name,
                    type: values.type || p.type,
                    location: normalize(values.location) || p.location,
                    shortDesc: normalize(values.desc) || p.shortDesc,
                    longDesc: normalize(values.longdesc) || p.longDesc,
                    images: uploadedImgs !== undefined
                      ? (uploadedImgs.length > 0 ? uploadedImgs : p.images)
                      : p.images,
                    amenities: typeof values.amenities === "string" && values.amenities.trim()
                      ? values.amenities.split(",").map((x) => x.trim()).filter(Boolean)
                      : p.amenities,
                    rating: Number(values.rating ?? p.rating) || p.rating,
                    reviews: Number(values.reviews ?? p.reviews) || p.reviews,
                    priceFrom: Number(values.priceFrom ?? values.price ?? p.priceFrom) || p.priceFrom,
                    destinationId: dest?.id || p.destinationId,
                  }
                : p
            )
          );
        }
      }

      if (entity === "tours") {
        if (mode === "delete") {
          setTours((prev) => prev.filter((t) => t.id !== entityId));
        } else if (mode === "create") {
          const uploadedGallery = Array.isArray(values.uploadedGallery) ? values.uploadedGallery : [];
          const newItem = {
            id: values.id || `${Date.now()}`,
            name: normalize(values.name) || "Untitled Tour",
            duration: normalize(values.duration) || "",
            img: values.uploadedImg || normalize(values.img) || values.image || "",
            gallery: uploadedGallery.length > 0
              ? uploadedGallery
              : Array.isArray(values.gallery) && values.gallery.length ? values.gallery : values.img ? [values.img] : [],
            destinations: typeof values.destinations === "string" ? values.destinations.split(",").map((x) => x.trim()).filter(Boolean) : (values.destinationList || []),
            shortDesc: normalize(values.shortdesc) || normalize(values.shortDesc) || "",
            longDesc: normalize(values.longdesc) || normalize(values.longdescFull) || "",
            highlights: typeof values.highlights === "string" ? values.highlights.split("\n").map((x) => x.trim()).filter(Boolean) : [],
            rating: Number(values.rating ?? 4.8) || 4.8,
            reviews: Number(values.reviews ?? 0) || 0,
            priceFrom: Number(values.priceFrom ?? values.price) || 0,
            itinerary: Array.isArray(values.itinerary) ? values.itinerary : [],
            included: typeof values.included === "string" ? values.included.split("\n").map((x) => x.trim()).filter(Boolean) : [],
            excluded: typeof values.excluded === "string" ? values.excluded.split("\n").map((x) => x.trim()).filter(Boolean) : [],
            uploadedImg: values.uploadedImg || null,
            uploadedGallery: uploadedGallery,
          };
          setTours((prev) => [newItem, ...prev]);
        } else if (mode === "edit") {
          const uploadedGallery = Array.isArray(values.uploadedGallery) ? values.uploadedGallery : undefined;
          setTours((prev) =>
            prev.map((t) =>
              t.id === entityId
                ? {
                    ...t,
                    name: normalize(values.name) || t.name,
                    duration: normalize(values.duration) || t.duration,
                    destinations: typeof values.destinations === "string"
                      ? values.destinations.split(",").map((x) => x.trim()).filter(Boolean)
                      : t.destinations,
                    shortDesc: normalize(values.shortdesc) || normalize(values.shortDesc) || t.shortDesc,
                    longDesc: normalize(values.longdesc) || normalize(values.longdescFull) || t.longDesc,
                    highlights: typeof values.highlights === "string"
                      ? values.highlights.split("\n").map((x) => x.trim()).filter(Boolean)
                      : t.highlights,
                    rating: Number(values.rating ?? t.rating) || t.rating,
                    reviews: Number(values.reviews ?? t.reviews) || t.reviews,
                    priceFrom: Number(values.priceFrom ?? values.price ?? t.priceFrom) || t.priceFrom,
                    included: typeof values.included === "string"
                      ? values.included.split("\n").map((x) => x.trim()).filter(Boolean)
                      : t.included,
                    excluded: typeof values.excluded === "string"
                      ? values.excluded.split("\n").map((x) => x.trim()).filter(Boolean)
                      : t.excluded,
                    img: values.uploadedImg || normalize(values.img) || t.img,
                    gallery: uploadedGallery !== undefined
                      ? (uploadedGallery.length > 0 ? uploadedGallery : t.gallery)
                      : t.gallery,
                    uploadedImg: values.uploadedImg !== undefined ? values.uploadedImg : t.uploadedImg,
                    uploadedGallery: uploadedGallery !== undefined ? uploadedGallery : t.uploadedGallery,
                  }
                : t
            )
          );
        }
      }

      setAdminModal((s) => ({ ...s, open: false }));
      setAdminFormKey((k) => k + 1);
    },
    mediaImages,
    addMediaImages: (files) => {
      const readers = Array.from(files).map((file) => compressImage(file));
      Promise.all(readers).then((dataUrls) => {
        setMediaImages((prev) => [...dataUrls, ...prev]);
      });
    },
    removeMediaImage: (index) => {
      setMediaImages((prev) => prev.filter((_, i) => i !== index));
    },
    lightboxImage,
    openLightbox: (src) => setLightboxImage(src),
    closeLightbox: () => setLightboxImage(null),
  };


  if (view === "admin") return (
    <>
      <AdminPanel nav={nav} dark={dark} setDark={setDark} theme={theme} enquiries={enquiries} />
      {lightboxImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={nav.closeLightbox}>
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" />
          <img src={lightboxImage} alt="Preview" className="relative max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
          <button onClick={nav.closeLightbox} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm inline-flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );


  return (
    <div className={cx("th-root min-h-screen", theme.page)}>
      <style>{GLOBAL_STYLES}</style>
      <Navbar theme={theme} dark={dark} setDark={setDark} nav={nav} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {view === "home" && <HomeView theme={theme} dark={dark} nav={nav} />}
      {view === "book-destinations" && <BookDestinationsView theme={theme} dark={dark} nav={nav} />}
      {view === "book-properties" && <BookPropertiesView theme={theme} dark={dark} nav={nav} />}
      {view === "book-property-detail" && <PropertyDetailView theme={theme} dark={dark} nav={nav} openInquiry={openInquiry} />}
      {view === "tour-list" && <TourListView theme={theme} dark={dark} nav={nav} />}
      {view === "tour-detail" && <TourDetailView theme={theme} dark={dark} nav={nav} openInquiry={openInquiry} />}
      <Footer theme={theme} dark={dark} nav={nav} />
      <InquiryModal
        state={inquiry}
        onClose={closeInquiry}
        dark={dark}
        theme={theme}
        onSubmitEnquiry={addEnquiry}
      />

    </div>
  );
}
