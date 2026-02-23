import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   MOAB 2026 — Spring Break Road Trip PWA
   Denver → Glenwood Springs → Moab · March 27 – April 1
   ═══════════════════════════════════════════════════════════ */

// ─── Trip Data ─────────────────────────────────────────────
const TRIP = {
  title: "Moab 2026",
  subtitle: "Spring Break Road Trip",
  dates: "March 27 – April 1, 2026",
  route: "Denver → Glenwood Springs → Moab",
  travelers: [
    { name: "Shawn", role: "" },
    { name: "Susan", role: "" },
    { name: "Charlotte", role: "15" },
    { name: "Gabby", role: "13" },
  ],
  lodging: [
    {
      city: "Glenwood Springs", name: "Hotel Colorado", icon: "🏨",
      address: "526 Pine St, Glenwood Springs, CO 81601",
      dates: "Fri 3/27 (1 night)",
      phone: "(970) 945-6511",
      mapUrl: "https://maps.google.com/?cid=9151719621327093896",
    },
    {
      city: "Moab", name: "Airbnb Townhome", icon: "🏠",
      address: "3853 S Red Valley Cir, Moab, UT 84532",
      dates: "Sat 3/28 – Tue 3/31 (4 nights)",
      phone: "(720) 408-6191",
      detail: "Conf: HMBFPHYYDT · Host: Evolve",
      mapUrl: "https://maps.google.com/?q=3853+S+Red+Valley+Cir+Moab+UT+84532",
    },
  ],
};

const DAYS = [
  {
    day: 1, date: "2026-03-27", weekday: "Friday",
    city: "Denver → Glenwood Springs", emoji: "🚗", theme: "drive",
    events: [
      {
        time: "", title: "Carol's Birthday — call from the road!",
        detail: "Don't forget!",
        type: "alert", icon: "🎂",
      },
      {
        time: "~2.5 hrs", title: "Drive Denver → Glenwood Springs",
        detail: "I-70 West through the mountains. Beautiful drive through Glenwood Canyon.",
        type: "drive", icon: "🚗",
      },
      {
        time: "4:00 PM", title: "Check in — Hotel Colorado",
        detail: "526 Pine St, Glenwood Springs, CO 81601. Historic landmark hotel — two presidents stayed here. On-site restaurant (Baron's), bar, coffee shop (Legends). Walking distance to downtown and right across from the hot springs pool.",
        type: "lodging", icon: "🏨",
        phone: "(970) 945-6511",
        mapUrl: "https://maps.google.com/?cid=9151719621327093896",
        link: "https://www.hotelcolorado.com",
      },
      {
        time: "Evening", title: "Dinner downtown or Baron's Restaurant",
        detail: "No fixed plans. Walking distance to shops and restaurants on Grand Ave.",
        type: "food", icon: "🍽️",
      },
    ],
  },
  {
    day: 2, date: "2026-03-28", weekday: "Saturday",
    city: "Glenwood Springs → Moab", emoji: "🏊", theme: "activity",
    events: [
      {
        time: "9:00 AM", title: "Glenwood Hot Springs Pool",
        detail: "World's largest hot springs pool — over two blocks long. Main pool 90°F, therapy pool 104°F. Water slides, splash pad, diving area. Right across from Hotel Colorado. Pool passes already purchased.",
        type: "activity", icon: "🏊",
        hours: "9:00 AM – 9:00 PM daily",
        address: "401 N River St, Glenwood Springs, CO 81601",
        mapUrl: "https://maps.google.com/?cid=17658170281413877991",
        link: "https://hotspringspool.com",
        tag: "PASSES BOUGHT",
      },
      {
        time: "11:00 AM", title: "Check out Hotel Colorado",
        detail: "Checkout by 11:00 AM.",
        type: "lodging", icon: "🏨",
      },
      {
        time: "~4 hrs", title: "Drive Glenwood Springs → Moab",
        detail: "I-70 West to Grand Junction, then US-191 South to Moab. Scenic desert drive.",
        type: "drive", icon: "🚗",
      },
      {
        time: "3:00 PM", title: "Check in — Moab Airbnb Townhome",
        detail: "3853 S Red Valley Cir, Moab, UT 84532. Self check-in with keypad. Entire home with patio, full kitchen, near Arches. Conf: HMBFPHYYDT. $277/night × 4 = $1,284.39 total.",
        type: "lodging", icon: "🏠",
        phone: "(720) 408-6191",
        mapUrl: "https://maps.google.com/?q=3853+S+Red+Valley+Cir+Moab+UT+84532",
        tag: "BOOKED",
      },
      {
        time: "Late PM", title: "Warmup Ride — Bar M / Moab Brands Trails",
        detail: "11 miles north of town on Hwy 191. Recommended: Rusty Spur (easy warmup), Bar M Loop (beginner/intermediate), North 40 (intermediate), Circle O (slickrock with Arches views).",
        type: "ride", icon: "🚵",
        address: "Old Hwy, Moab, UT 84532",
        mapUrl: "https://maps.google.com/?cid=17658800813500243695",
        link: "https://www.blm.gov/visit/bar-m-trail-system",
        trailforks: "https://www.trailforks.com/region/moab-brand-trails/",
      },
    ],
  },
  {
    day: 3, date: "2026-03-29", weekday: "Sunday",
    city: "Full Trail Day — Moab", emoji: "🚵", theme: "ride",
    events: [
      {
        time: "8:30 AM", title: "Morning Ride — Klonzo Trails",
        detail: "Fast, rolling trails with beautiful scenery and slickrock. Under 2 hours for a solid loop. Recommended: Borderline up to Gravitron (flowy, fast, fun). Then Zoltar → Red Hot → Roller Coaster → Topspin for more challenge. Dunestone to step it up further.",
        type: "ride", icon: "🚵",
        address: "Willow Springs Trail, Moab, UT 84532",
        mapUrl: "https://maps.google.com/?cid=17056363012713959349",
        trailforks: "https://www.trailforks.com/region/klonzo/",
      },
      {
        time: "11:30 AM", title: "Lunch — Milt's Stop & Eat",
        detail: "Moab's oldest restaurant since 1954. Burgers, fries, milkshakes. Eat at the picnic tables under the big tree. The BLT and onion rings are favorites. Get the shakes — they're legendary.",
        type: "food", icon: "🍽️",
        hours: "11:00 AM – 8:00 PM daily",
        address: "356 S Mill Creek Dr, Moab, UT 84532",
        mapUrl: "https://maps.google.com/?cid=10633972930809645941",
        link: "http://www.toasttab.com/milts-stop-n-eat-356-s-mill-creek-dr",
      },
      {
        time: "2:00 PM", title: "Afternoon Ride — Slickrock Practice Loop",
        detail: "The 2.3-mile practice loop is the full Slickrock experience in a manageable package. Same grippy sandstone, same wild terrain — without the 10-mile commitment. Sand Flats entry fee $10/vehicle. Bring LOTS of water. No shade. Follow the painted white dashes.",
        type: "ride", icon: "🚵",
        address: "Sand Flats Rd, Moab, UT 84532",
        mapUrl: "https://maps.google.com/?cid=14904194791551059907",
        link: "http://grandcountyutah.net/287/Sand-Flats-Recreation-Area",
        tag: "$10 ENTRY",
      },
      {
        time: "6:30 PM", title: "Dinner — Arches Thai (Takeout)",
        detail: "Highly recommended by locals for takeout after a big ride day. Order online for easy pickup.",
        type: "food", icon: "🍽️",
        address: "60 N 100 W, Moab, UT 84532",
      },
    ],
  },
  {
    day: 4, date: "2026-03-30", weekday: "Monday",
    city: "Arches + Dead Horse Point", emoji: "🏜️", theme: "hike",
    events: [
      {
        time: "8:00 AM", title: "Arches National Park",
        detail: "No timed entry required in 2026 — but arrive early for parking. Drive the scenic road, hit the Windows section, hike to Delicate Arch (3 mi round trip, 480 ft gain — the iconic Utah arch). Balanced Rock is a quick roadside stop. Bring water and snacks. Visitor Center: 9 AM – 4 PM.",
        type: "hike", icon: "🥾",
        address: "Moab, UT 84532",
        mapUrl: "https://maps.google.com/?cid=10985816749763642722",
        link: "https://www.nps.gov/arch/planyourvisit/hours.htm",
        tag: "NO TIMED ENTRY",
      },
      {
        time: "1:30 PM", title: "Afternoon Ride — Dead Horse Point Intrepid Trails",
        detail: "16.6 miles of singletrack through juniper and pinyon above spectacular canyons. Mix of beginner and intermediate trails — perfect for the family. Jaw-dropping canyon overlooks. Susan can run or gravel bike the paved park roads. Entry fee: $20/vehicle.",
        type: "ride", icon: "🚵",
        hours: "6:00 AM – 10:00 PM",
        address: "Dead Horse Point State Park, Moab, UT 84532",
        mapUrl: "https://maps.google.com/?cid=17161838762983602508",
        link: "https://stateparks.utah.gov/parks/dead-horse/intrepid-trail/",
        tag: "$20 ENTRY",
      },
      {
        time: "6:00 PM", title: "Dinner — Antica Forma",
        detail: "Wood-fired Neapolitan pizza. Order at the counter. Great for families. Try the Pistachio pizza (trust the locals). Big outdoor patio with shade and misters.",
        type: "food", icon: "🍽️",
        hours: "11:00 AM – 9:00 PM daily",
        address: "267 N Main St, Moab, UT 84532",
        mapUrl: "https://maps.google.com/?cid=1646347086109418900",
        link: "http://www.anticaforma.com/",
      },
    ],
  },
  {
    day: 5, date: "2026-03-31", weekday: "Tuesday",
    city: "Last Ride Day — Moab", emoji: "🚵", theme: "ride",
    events: [
      {
        time: "7:30 AM", title: "Breakfast — Cactus Jack's",
        detail: "Best breakfast in Moab. The Big Biscuit is legendary — fried chicken, thick-cut bacon, biscuit, and country gravy. Get there by 7:30, it packs out fast. Great coffee.",
        type: "food", icon: "🍽️",
        hours: "7:00 AM – 2:00 PM daily",
        address: "196 S Main St, Moab, UT 84532",
        mapUrl: "https://maps.google.com/?cid=11258432753349433888",
        link: "https://www.cactusjacksmoab.com/",
      },
      {
        time: "9:30 AM", title: "Morning Ride — Navajo Rocks or Intrepid",
        detail: "Option A — Navajo Rocks: 17-mile intermediate loop, 25 min north on Hwy 191 to Hwy 313. Big Mesa, Ramblin, Rocky Tops, Coney Island, Big Lonely. Figure-8 shape so you can cut it short. Option B — Return to Intrepid at Dead Horse Point for different loops.",
        type: "ride", icon: "🚵",
        trailforks: "https://www.trailforks.com/region/navajo-rocks/",
      },
      {
        time: "2:00 PM", title: "Pool / Patio Time at the Townhome",
        detail: "Relax on the patio, cook dinner in the full kitchen. Well-earned rest.",
        type: "activity", icon: "☀️",
      },
      {
        time: "5:30 PM", title: "Dinner — Moab Brewery",
        detail: "Moab's only microbrewery since 1996. Big menu, family-friendly. Dead Horse Ale and Rocket Bike Lager are the classics. Solid burgers and pub fare.",
        type: "food", icon: "🍽️",
        hours: "11:00 AM – 8:00 PM daily",
        address: "686 S Main St, Moab, UT 84532",
        mapUrl: "https://maps.google.com/?cid=1086234787891366924",
        link: "http://www.themoabbrewery.com/",
      },
    ],
  },
  {
    day: 6, date: "2026-04-01", weekday: "Wednesday",
    city: "Moab → Denver", emoji: "🚗", theme: "drive",
    events: [
      {
        time: "7:30 AM", title: "Depart Moab → Denver",
        detail: "~5.5 hours via I-70 East. Airbnb checkout by 10:00 AM. Quick breakfast at the townhome, load up the bikes, and hit the road. Grand Junction (~1.5 hrs) is a good pit stop.",
        type: "drive", icon: "🚗",
      },
      {
        time: "~1:30 PM", title: "Arrive Denver",
        detail: "Leaving by 7:30 gives plenty of buffer for Gabby's tennis.",
        type: "drive", icon: "🏠",
      },
      {
        time: "4:00 PM", title: "Pick up Buddy — Playful Pooch",
        detail: "Pickup by 4:00 PM. (Drop-off was 3/27 at 8:30 AM, pickup originally 4/2 but grab early if possible.)",
        type: "alert", icon: "🐕",
      },
      {
        time: "4:45 PM", title: "Gabby Tennis — Gates Tennis Center",
        detail: "4:45 PM at Gates Tennis Center. DO NOT BE LATE. Factor this into departure time!",
        type: "alert", icon: "🎾",
        tag: "DON'T BE LATE",
      },
    ],
  },
];

const TODO_ITEMS = [
  // BEFORE TRIP — Bookings
  { priority: "BOOK", text: "Book Hotel Colorado (1 night, Fri 3/27)", detail: "hotelcolorado.com · (970) 945-6511", link: "https://www.hotelcolorado.com", status: "todo" },
  { priority: "BOOK", text: "Book Moab Airbnb (4 nights)", detail: "Conf: HMBFPHYYDT · $1,284.39 total", status: "done" },
  { priority: "BOOK", text: "Glenwood Hot Springs Pool passes", detail: "Already purchased", status: "done" },
  { priority: "BOOK", text: "Arches timed entry", detail: "NOT required in 2026", status: "done" },
  { priority: "BOOK", text: "Reserve Antica Forma if needed", detail: "anticaforma.com · 267 N Main St, Moab", link: "http://www.anticaforma.com/", status: "todo" },
  // BEFORE TRIP — Bikes & Gear
  { priority: "GEAR", text: "Tune up 3 mountain bikes", detail: "Shawn, Charlotte, Gabby", status: "todo" },
  { priority: "GEAR", text: "Tune up Susan's gravel bike", detail: "", status: "todo" },
  { priority: "GEAR", text: "Load bike rack / verify fits all 4 bikes", detail: "", status: "todo" },
  { priority: "GEAR", text: "Pack helmets (3 MTB + 1 road/gravel)", detail: "", status: "todo" },
  { priority: "GEAR", text: "Hydration packs / water bottles", detail: "2+ liters per person per ride", status: "todo" },
  { priority: "GEAR", text: "Sunscreen, sunglasses, lip balm with SPF", detail: "", status: "todo" },
  { priority: "GEAR", text: "Layers — arm warmers, light jacket, gloves", detail: "Highs 60-70°F, lows 35-45°F", status: "todo" },
  { priority: "GEAR", text: "Bike tools, spare tubes, tire levers, pump", detail: "", status: "todo" },
  { priority: "GEAR", text: "First aid kit", detail: "", status: "todo" },
  { priority: "GEAR", text: "Trail snacks — bars, gels, trail mix", detail: "", status: "todo" },
  { priority: "GEAR", text: "Swimsuits & towels", detail: "", status: "todo" },
  { priority: "GEAR", text: "Running shoes & gear for Susan", detail: "", status: "todo" },
  { priority: "GEAR", text: "Download Trailforks app with offline Moab maps", detail: "", status: "todo" },
  { priority: "GEAR", text: "Cash for Sand Flats ($10) and Dead Horse Point ($20)", detail: "", status: "todo" },
  // BEFORE TRIP — Logistics
  { priority: "LOGISTICS", text: "Confirm reservations (Hotel Colorado + Airbnb)", detail: "", status: "todo" },
  { priority: "LOGISTICS", text: "Drop off Buddy at Playful Pooch", detail: "3/27 8:30 AM · Pickup 4/2 4:00 PM", status: "done" },
  { priority: "LOGISTICS", text: "Pack car cooler with drinks & snacks", detail: "", status: "todo" },
  { priority: "LOGISTICS", text: "Gas up the car", detail: "", status: "todo" },
  { priority: "LOGISTICS", text: "Cancel/reschedule Gabby tennis 4/1 if needed", detail: "Gates Tennis Center · 4:45 PM", status: "todo" },
];

const RESTAURANTS = [
  { name: "Arches Thai", best: "Takeout Thai — local #1 pick", address: "60 N 100 W" },
  { name: "Fiesta Mexicana", best: "Authentic Mexican, family recipes", address: "2 S 100 W" },
  { name: "The Spoke on Center", best: "Burgers, shakes, bike-themed", address: "11 E Center St" },
  { name: "Quesadilla Mobilla", best: "Food truck, huge quesadillas", address: "Main St (yellow truck)" },
  { name: "Jailhouse Cafe", best: "Classic breakfast, historic building", address: "101 N Main St" },
  { name: "Moab Diner", best: "Retro diner, all-day breakfast", address: "189 S Main St" },
  { name: "Spitfire Smokehouse", best: "BBQ and smoked meats", address: "95 N Main St" },
];

const SUSAN_ROUTES = {
  gravel: [
    { name: "Highway 128 (River Road)", detail: "Stunning canyon road along the Colorado River northeast of Moab. Relatively flat, scenic red rock walls. Ride as far as you want and turn around." },
    { name: "Willow Springs Road", detail: "Gravel route into the backside of Arches National Park from Lions Park trailhead. Great mixed-surface ride." },
  ],
  running: [
    { name: "Moab Canyon Pathway", detail: "Paved multi-use trail along Hwy 191, connecting to several trailheads including Bar M." },
    { name: "Mill Creek Parkway", detail: "Easy running trail from town, follows the creek." },
    { name: "Dead Horse Point park roads", detail: "Paved roads with canyon views, low traffic." },
  ],
};

const KEY_INFO = [
  { label: "Weather", text: "Highs 60-70°F, lows 35-45°F. Layers essential. Sun is intense even when cool." },
  { label: "Hydration", text: "Desert riding is no joke. 2+ liters per person per ride minimum." },
  { label: "Sand Flats Fee", text: "$10/vehicle for Slickrock area." },
  { label: "Dead Horse Fee", text: "$20/vehicle." },
  { label: "Arches NP", text: "No timed entry in 2026. Arrive early for parking." },
  { label: "Trail Ratings", text: "Moab ratings are soft — intermediate here is often advanced elsewhere. Start easier." },
  { label: "Bike Shops", text: "Chile Pepper Bike Shop & Poison Spider Bicycles — both on Main St for mechanicals or gear." },
];

// ─── Design Tokens — Desert / Red Rock Theme ───────────────
const P = {
  bg: "#FAF3E8", card: "#FFFFFF", text: "#2C2C2C", muted: "#7A6F63",
  accent: "#E8713A", accentSoft: "#FDEEE4",
  sandstone: "#D4A574", sandstoneBg: "#FBF2E8",
  canyon: "#8B2500", canyonBg: "#FDEBE5",
  sage: "#6B7F59", sageBg: "#EEF3E8",
  cream: "#FAF3E8",
  border: "#E8DDD0", shadow: "0 2px 16px rgba(44,36,32,0.07)",
};

const themeMap = {
  drive: { fg: "#8B6914", bg: "#FFF8E7" },
  ride: { fg: P.canyon, bg: P.canyonBg },
  hike: { fg: P.sage, bg: P.sageBg },
  activity: { fg: "#2D6B8A", bg: "#E8F1F5" },
};

const typeColorMap = {
  drive: { bg: "#FFF8E7", fg: "#8B6914" },
  ride: { bg: P.canyonBg, fg: P.canyon },
  hike: { bg: P.sageBg, fg: P.sage },
  food: { bg: "#FFF0EC", fg: "#C45D3E" },
  lodging: { bg: "#FFF8E7", fg: "#9A7B2D" },
  activity: { bg: "#E8F1F5", fg: "#2D6B8A" },
  alert: { bg: "#FDECEB", fg: "#C0392B" },
};

const priorityColors = {
  BOOK: { bg: "#FDECEB", fg: "#C0392B", label: "Bookings" },
  GEAR: { bg: "#FDEEE4", fg: "#C46A30", label: "Bikes & Gear" },
  LOGISTICS: { bg: P.sageBg, fg: P.sage, label: "Logistics" },
  DONE: { bg: "#F0F0F0", fg: "#888", label: "Done" },
};

const tagColors = {
  "PASSES BOUGHT": { bg: P.sageBg, fg: P.sage },
  "BOOKED": { bg: P.sageBg, fg: P.sage },
  "$10 ENTRY": { bg: "#FFF6E0", fg: "#B8860B" },
  "$20 ENTRY": { bg: "#FFF6E0", fg: "#B8860B" },
  "NO TIMED ENTRY": { bg: P.sageBg, fg: P.sage },
  "DON'T BE LATE": { bg: "#FDECEB", fg: "#C0392B" },
};

function fmtDate(s) {
  const d = new Date(s + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Countdown ─────────────────────────────────────────────
function useCountdown() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  const depart = new Date("2026-03-27T08:00:00-06:00"); // Denver MDT
  const diff = depart - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  return `${days} day${days !== 1 ? "s" : ""} to go!`;
}

// ─── Navigation ────────────────────────────────────────────
const TABS = [
  { id: "itinerary", label: "Itinerary", icon: "🗺️" },
  { id: "checklist", label: "Checklist", icon: "✅" },
  { id: "journal", label: "Journal", icon: "📸" },
  { id: "info", label: "Info", icon: "ℹ️" },
];

function NavBar({ active, setActive }) {
  return (
    <nav className="nav-bar" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(250,243,232,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderTop: `1px solid ${P.border}`, display: "flex", justifyContent: "space-around",
      padding: "6px 0 8px",
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => setActive(tab.id)} style={{
            background: isActive ? P.accentSoft : "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
            padding: "6px 16px", borderRadius: 14, transition: "all 0.2s ease",
          }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
              color: isActive ? P.accent : P.muted,
            }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Clickable Links Helper ────────────────────────────────
function MapLink({ url, children }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{ fontSize: 10.5, color: P.accent, textDecoration: "none", marginRight: 8 }}>
      {children || "Map →"}
    </a>
  );
}

function PhoneLink({ phone }) {
  if (!phone) return null;
  return (
    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}
      onClick={e => e.stopPropagation()}
      style={{ fontSize: 10.5, color: P.accent, textDecoration: "none", marginRight: 8 }}>
      {phone}
    </a>
  );
}

function TrailforksLink({ url }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{ fontSize: 10.5, color: P.sage, textDecoration: "none", marginRight: 8 }}>
      Trailforks →
    </a>
  );
}

function WebLink({ url, label }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{ fontSize: 10.5, color: P.accent, textDecoration: "none", marginRight: 8 }}>
      {label || "Website →"}
    </a>
  );
}

// ─── Itinerary ─────────────────────────────────────────────
function DayCard({ d, open, toggle }) {
  const th = themeMap[d.theme] || themeMap.drive;
  return (
    <div style={{
      margin: "0 14px 10px", borderRadius: 16, background: P.card,
      boxShadow: P.shadow, overflow: "hidden", border: `1px solid ${P.border}`,
    }}>
      <button onClick={toggle} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 20,
          background: th.bg, flexShrink: 0,
        }}>{d.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: th.fg,
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>Day {d.day} · {fmtDate(d.date)} · {d.weekday}</div>
          <div style={{
            fontSize: 16, fontWeight: 600, color: P.text,
            fontFamily: "'Playfair Display', Georgia, serif", marginTop: 1,
          }}>{d.city}</div>
          {!open && d.events.length > 0 && (
            <div style={{
              fontSize: 11, color: P.muted, marginTop: 2,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{d.events.filter(e => e.type !== "alert").slice(0, 4).map(e => e.title.replace(/^(Morning|Afternoon|Evening)\s*(Ride|—)\s*/g, "")).join(" · ")}</div>
          )}
        </div>
        <div style={{
          fontSize: 14, color: P.muted,
          transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease",
        }}>&#9662;</div>
      </button>

      {open && (
        <div style={{ padding: "0 16px 14px" }}>
          <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 10 }}>
            {d.events.map((e, i) => {
              const tc = typeColorMap[e.type] || typeColorMap.activity;
              const tg = e.tag ? (tagColors[e.tag] || { bg: "#F0F0F0", fg: "#666" }) : null;
              return (
                <div key={i} style={{
                  display: "flex", gap: 10, padding: "9px 0",
                  borderBottom: i < d.events.length - 1 ? `1px solid ${P.border}22` : "none",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, background: tc.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, flexShrink: 0, marginTop: 1,
                  }}>{e.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {e.time && <span style={{
                        fontSize: 10, fontWeight: 700, color: tc.fg,
                        letterSpacing: "0.02em", flexShrink: 0,
                      }}>{e.time}</span>}
                      <span style={{ fontSize: 13, fontWeight: 600, color: P.text }}>{e.title}</span>
                      {tg && <span style={{
                        fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                        background: tg.bg, color: tg.fg, letterSpacing: "0.03em",
                        flexShrink: 0, whiteSpace: "nowrap",
                      }}>{e.tag}</span>}
                    </div>
                    {e.detail && <div style={{
                      fontSize: 11.5, color: P.muted, marginTop: 2, lineHeight: 1.45,
                    }}>{e.detail}</div>}
                    {e.address && <div style={{
                      fontSize: 10.5, color: P.muted, marginTop: 3, fontStyle: "italic",
                    }}>{e.address}</div>}
                    {e.hours && <div style={{
                      fontSize: 10.5, color: P.muted, marginTop: 1,
                    }}>Hours: {e.hours}</div>}
                    {(e.mapUrl || e.phone || e.trailforks || e.link) && (
                      <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <MapLink url={e.mapUrl} />
                        <PhoneLink phone={e.phone} />
                        <TrailforksLink url={e.trailforks} />
                        <WebLink url={e.link} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ItineraryTab() {
  const [expanded, setExpanded] = useState(new Set([1]));
  const countdown = useCountdown();
  const toggle = (day) => setExpanded(prev => {
    const n = new Set(prev); n.has(day) ? n.delete(day) : n.add(day); return n;
  });

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div style={{
        padding: "30px 20px 16px", textAlign: "center",
        background: "linear-gradient(180deg, #FDF6ED 0%, #FAF3E8 100%)",
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase",
          color: P.accent, marginBottom: 2,
        }}>{TRIP.dates}</div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700,
          color: P.text, margin: "2px 0", lineHeight: 1.1, letterSpacing: "-0.02em",
        }}>{TRIP.title}</h1>
        <div style={{
          fontSize: 15, color: P.muted, fontWeight: 400, letterSpacing: "0.1em",
        }}>{TRIP.subtitle}</div>
        <div style={{
          fontSize: 11, color: P.sandstone, fontWeight: 600, marginTop: 2,
          letterSpacing: "0.05em",
        }}>{TRIP.route}</div>
        {countdown && (
          <div style={{
            marginTop: 8, fontSize: 12, fontWeight: 700, color: P.accent,
            background: P.accentSoft, display: "inline-block",
            padding: "4px 14px", borderRadius: 16,
          }}>{countdown}</div>
        )}
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          {TRIP.travelers.map(t => (
            <span key={t.name} style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 16,
              background: P.accentSoft, color: P.accent,
            }}>{t.name}{t.role ? ` (${t.role})` : ""}</span>
          ))}
        </div>
      </div>

      {/* Lodging cards */}
      <div style={{ display: "flex", gap: 8, padding: "8px 14px 14px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {TRIP.lodging.map((l, i) => (
          <a key={i} href={l.mapUrl} target="_blank" rel="noopener noreferrer" style={{
            flexShrink: 0, padding: "10px 14px", borderRadius: 12,
            background: P.card, border: `1px solid ${P.border}`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.03)", minWidth: 200,
            textDecoration: "none", color: "inherit",
          }}>
            <div style={{ fontSize: 15, marginBottom: 4 }}>{l.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: P.text }}>{l.name}</div>
            <div style={{ fontSize: 10, color: P.muted, marginTop: 2 }}>{l.dates} · {l.city}</div>
            <div style={{ fontSize: 9, color: P.muted, marginTop: 1 }}>{l.address}</div>
            {l.detail && <div style={{ fontSize: 9, color: P.accent, marginTop: 2 }}>{l.detail}</div>}
          </a>
        ))}
      </div>

      {DAYS.map(d => (
        <DayCard key={d.day} d={d} open={expanded.has(d.day)} toggle={() => toggle(d.day)} />
      ))}
    </div>
  );
}

// ─── Checklist ─────────────────────────────────────────────
function ChecklistTab() {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("moab2026-checklist") || "{}"); }
    catch { return {}; }
  });

  const toggle = (i) => {
    const next = { ...checked, [i]: !checked[i] };
    setChecked(next);
    localStorage.setItem("moab2026-checklist", JSON.stringify(next));
  };

  const groups = ["BOOK", "GEAR", "LOGISTICS"];
  const allItems = TODO_ITEMS.map((t, i) => ({ ...t, idx: i }));
  const completedCount = Object.values(checked).filter(Boolean).length;
  const doneFromData = TODO_ITEMS.filter(t => t.status === "done").length;
  const totalActionable = TODO_ITEMS.filter(t => t.status !== "done").length;

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{
        padding: "30px 20px 14px", textAlign: "center",
        background: "linear-gradient(180deg, #FDF6ED 0%, #FAF3E8 100%)",
      }}>
        <div style={{ fontSize: 22 }}>✅</div>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20,
          color: P.text, margin: "2px 0",
        }}>Pre-Trip Checklist</h2>
        <p style={{ fontSize: 11, color: P.muted, margin: "2px 0 8px" }}>
          {completedCount + doneFromData} of {totalActionable + doneFromData} items done
        </p>
        <div style={{
          height: 4, background: P.border, borderRadius: 2, overflow: "hidden",
          maxWidth: 200, margin: "0 auto",
        }}>
          <div style={{
            height: "100%", borderRadius: 2, background: P.accent,
            width: `${(totalActionable + doneFromData) ? ((completedCount + doneFromData) / (totalActionable + doneFromData)) * 100 : 0}%`,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      <div style={{ padding: "6px 14px" }}>
        {groups.map(g => {
          const items = allItems.filter(t => t.priority === g);
          if (!items.length) return null;
          const pc = priorityColors[g];
          return (
            <div key={g} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: pc.fg, padding: "6px 0 6px 4px", display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: 2,
                  background: pc.fg, opacity: 0.6,
                }} />
                {pc.label}
              </div>
              {items.map(item => {
                const isDone = item.status === "done" || checked[item.idx];
                return (
                  <div key={item.idx} onClick={() => item.status !== "done" && toggle(item.idx)} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "12px 14px", margin: "0 0 6px", borderRadius: 12,
                    background: P.card, border: `1px solid ${P.border}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
                    cursor: item.status === "done" ? "default" : "pointer",
                    opacity: isDone ? 0.55 : 1, transition: "opacity 0.2s",
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1,
                      border: `2px solid ${isDone ? P.accent : P.border}`,
                      background: isDone ? P.accent : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                      {isDone && <span style={{ color: "#FFF", fontSize: 12, fontWeight: 700 }}>&#10003;</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: P.text,
                        textDecoration: isDone ? "line-through" : "none",
                      }}>{item.text}</div>
                      {item.detail && <div style={{
                        fontSize: 11, color: P.muted, marginTop: 2, lineHeight: 1.4,
                      }}>{item.detail}</div>}
                      {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()} style={{
                          fontSize: 10.5, color: P.accent,
                          marginTop: 3, display: "inline-block", textDecoration: "none",
                        }}>Visit site &rarr;</a>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Journal ───────────────────────────────────────────────
const LOCATIONS = [
  "Glenwood Springs",
  "Moab",
  "Arches National Park",
  "Dead Horse Point",
  "On the Road",
];

function JournalTab() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("moab2026-journal") || "[]"); }
    catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [formDay, setFormDay] = useState("0");
  const [formLocation, setFormLocation] = useState(LOCATIONS[0]);
  const [formNote, setFormNote] = useState("");

  const save = (e) => {
    setEntries(e);
    localStorage.setItem("moab2026-journal", JSON.stringify(e));
  };

  const add = () => {
    if (!formNote.trim()) return;
    const d = DAYS[parseInt(formDay)] || DAYS[0];
    save([{
      id: Date.now().toString(),
      day: d.day,
      city: formLocation,
      date: d.date,
      note: formNote.trim(),
      ts: new Date().toISOString(),
    }, ...entries]);
    setFormNote(""); setShowForm(false);
  };

  const locationTheme = (loc) => {
    if (loc.includes("Arches") || loc.includes("Dead Horse")) return { fg: P.sage, bg: P.sageBg };
    if (loc.includes("Moab")) return { fg: P.canyon, bg: P.canyonBg };
    if (loc.includes("Glenwood")) return { fg: "#2D6B8A", bg: "#E8F1F5" };
    return { fg: "#8B6914", bg: "#FFF8E7" };
  };

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{
        padding: "30px 20px 14px", textAlign: "center",
        background: "linear-gradient(180deg, #FDF6ED 0%, #FAF3E8 100%)",
      }}>
        <div style={{ fontSize: 22 }}>📸</div>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20,
          color: P.text, margin: "2px 0",
        }}>Travel Journal</h2>
        <p style={{ fontSize: 11, color: P.muted, margin: 0 }}>Capture memories from the trip</p>
      </div>

      <div style={{ padding: "8px 14px" }}>
        {!showForm ? (
          <button onClick={() => setShowForm(true)} style={{
            width: "100%", padding: "13px", borderRadius: 12,
            border: `2px dashed ${P.border}`, background: "transparent",
            color: P.accent, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>+ Add Journal Entry</button>
        ) : (
          <div style={{
            padding: 14, borderRadius: 14, background: P.card,
            border: `1px solid ${P.border}`, boxShadow: P.shadow, marginBottom: 10,
          }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: P.muted, letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>DAY</label>
            <select value={formDay} onChange={e => setFormDay(e.target.value)} style={{
              width: "100%", padding: "9px 10px", borderRadius: 8, border: `1.5px solid ${P.border}`,
              fontSize: 12, color: P.text, background: P.bg, marginBottom: 10,
            }}>
              {DAYS.map((d, i) => (
                <option key={i} value={i}>Day {d.day} &middot; {fmtDate(d.date)} &middot; {d.city}</option>
              ))}
            </select>
            <label style={{ fontSize: 10, fontWeight: 700, color: P.muted, letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>LOCATION</label>
            <select value={formLocation} onChange={e => setFormLocation(e.target.value)} style={{
              width: "100%", padding: "9px 10px", borderRadius: 8, border: `1.5px solid ${P.border}`,
              fontSize: 12, color: P.text, background: P.bg, marginBottom: 10,
            }}>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <label style={{ fontSize: 10, fontWeight: 700, color: P.muted, letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>NOTES</label>
            <textarea value={formNote} onChange={e => setFormNote(e.target.value)}
              placeholder="What trails did you ride? Best meal? Funny stories?"
              rows={4} style={{
                width: "100%", padding: "9px 10px", borderRadius: 8, border: `1.5px solid ${P.border}`,
                fontSize: 13, color: P.text, background: P.bg, resize: "vertical",
                boxSizing: "border-box", marginBottom: 10,
              }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={add} style={{
                flex: 1, padding: "9px", borderRadius: 8, border: "none",
                background: P.accent, color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Save</button>
              <button onClick={() => setShowForm(false)} style={{
                padding: "9px 14px", borderRadius: 8, border: `1px solid ${P.border}`,
                background: "transparent", color: P.muted, fontSize: 13, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </div>
        )}

        {entries.length === 0 && !showForm && (
          <div style={{ textAlign: "center", padding: "36px 20px", color: P.muted }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>🏜️</div>
            <p style={{ fontSize: 13, margin: 0 }}>No entries yet — start capturing memories during the trip!</p>
          </div>
        )}

        {entries.map(entry => {
          const th = locationTheme(entry.city || "");
          return (
            <div key={entry.id} style={{
              padding: 14, borderRadius: 12, background: P.card,
              border: `1px solid ${P.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", marginTop: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                    background: th.bg, color: th.fg,
                  }}>DAY {entry.day}</span>
                  <span style={{ fontSize: 11, color: P.muted }}>{entry.city} &middot; {fmtDate(entry.date)}</span>
                </div>
                <button onClick={() => save(entries.filter(e => e.id !== entry.id))} style={{
                  background: "none", border: "none", cursor: "pointer", fontSize: 15, color: P.muted, padding: "2px 4px",
                }}>&times;</button>
              </div>
              <p style={{ fontSize: 13, color: P.text, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>{entry.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Info Tab (Susan's Routes, Quick Ref, Key Info) ────────
function InfoTab() {
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{
        padding: "30px 20px 14px", textAlign: "center",
        background: "linear-gradient(180deg, #FDF6ED 0%, #FAF3E8 100%)",
      }}>
        <div style={{ fontSize: 22 }}>ℹ️</div>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20,
          color: P.text, margin: "2px 0",
        }}>Quick Reference</h2>
      </div>

      <div style={{ padding: "6px 14px" }}>
        {/* Susan's Routes */}
        <div style={{
          marginBottom: 16, padding: 14, borderRadius: 14,
          background: P.card, border: `1px solid ${P.border}`, boxShadow: P.shadow,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: P.sage, marginBottom: 10,
          }}>Susan's Routes</div>

          <div style={{ fontSize: 11, fontWeight: 700, color: P.text, marginBottom: 6 }}>Gravel Biking</div>
          {SUSAN_ROUTES.gravel.map((r, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: P.text }}>{r.name}</div>
              <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.4 }}>{r.detail}</div>
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${P.border}`, marginTop: 10, paddingTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P.text, marginBottom: 6 }}>Running</div>
            {SUSAN_ROUTES.running.map((r, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: P.text }}>{r.name}</div>
                <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.4 }}>{r.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Quick Ref */}
        <div style={{
          marginBottom: 16, padding: 14, borderRadius: 14,
          background: P.card, border: `1px solid ${P.border}`, boxShadow: P.shadow,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: P.accent, marginBottom: 10,
          }}>Backup Restaurants</div>
          {RESTAURANTS.map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "8px 0",
              borderBottom: i < RESTAURANTS.length - 1 ? `1px solid ${P.border}22` : "none",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: P.text }}>{r.name}</div>
                <div style={{ fontSize: 10.5, color: P.muted }}>{r.best}</div>
              </div>
              <div style={{ fontSize: 10, color: P.muted, textAlign: "right", flexShrink: 0, marginLeft: 8 }}>{r.address}</div>
            </div>
          ))}
        </div>

        {/* Key Info */}
        <div style={{
          marginBottom: 16, padding: 14, borderRadius: 14,
          background: P.card, border: `1px solid ${P.border}`, boxShadow: P.shadow,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: P.canyon, marginBottom: 10,
          }}>Key Info & Tips</div>
          {KEY_INFO.map((info, i) => (
            <div key={i} style={{
              padding: "8px 0",
              borderBottom: i < KEY_INFO.length - 1 ? `1px solid ${P.border}22` : "none",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: P.text }}>{info.label}</div>
              <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.4, marginTop: 1 }}>{info.text}</div>
            </div>
          ))}
        </div>

        {/* Key Contacts */}
        <div style={{
          marginBottom: 16, padding: 14, borderRadius: 14,
          background: P.card, border: `1px solid ${P.border}`, boxShadow: P.shadow,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: P.sandstone, marginBottom: 10,
          }}>Key Contacts</div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: P.text }}>Hotel Colorado</div>
            <div style={{ fontSize: 11, color: P.muted }}>526 Pine St, Glenwood Springs, CO 81601</div>
            <a href="tel:9709456511" style={{ fontSize: 11, color: P.accent, textDecoration: "none" }}>(970) 945-6511</a>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: P.text }}>Moab Airbnb (Evolve)</div>
            <div style={{ fontSize: 11, color: P.muted }}>3853 S Red Valley Cir, Moab, UT 84532</div>
            <div style={{ fontSize: 11, color: P.muted }}>Conf: HMBFPHYYDT</div>
            <a href="tel:7204086191" style={{ fontSize: 11, color: P.accent, textDecoration: "none" }}>(720) 408-6191</a>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: P.text }}>Playful Pooch (Buddy)</div>
            <div style={{ fontSize: 11, color: P.muted }}>Drop-off: 3/27 8:30 AM</div>
            <div style={{ fontSize: 11, color: P.muted }}>Pickup: 4/2 4:00 PM</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: P.text }}>Gabby's Tennis</div>
            <div style={{ fontSize: 11, color: P.muted }}>Gates Tennis Center</div>
            <div style={{ fontSize: 11, color: "#C0392B", fontWeight: 600 }}>4/1 at 4:45 PM</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("itinerary");
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: P.bg, position: "relative" }}>
      {tab === "itinerary" && <ItineraryTab />}
      {tab === "checklist" && <ChecklistTab />}
      {tab === "journal" && <JournalTab />}
      {tab === "info" && <InfoTab />}
      <NavBar active={tab} setActive={setTab} />
    </div>
  );
}
