// Realistic demo dataset centered on Lucknow, Uttar Pradesh so the map and
// clusters look convincing out of the box. Includes deliberate geographic
// "hot spots" per category so the clustering engine produces a signature
// recurring-issue cluster (e.g. a streetlight corridor) for the demo.

const CENTER = { lat: 26.8467, lng: 80.9462 }; // Lucknow

function jitter(base, spreadKm = 0.3) {
  // ~0.009 deg latitude per 1km
  const deg = spreadKm * 0.009;
  return base + (Math.random() * 2 - 1) * deg;
}

const CORRIDORS = {
  streetlight: { lat: 26.852, lng: 80.94, label: "Hazratganj Corridor" },
  pothole: { lat: 26.83, lng: 80.955, label: "Kanpur Road Stretch" },
  drainage: { lat: 26.86, lng: 80.925, label: "Aliganj Sector 3" },
  water: { lat: 26.845, lng: 80.965, label: "Indira Nagar Main Rd" },
  garbage: { lat: 26.875, lng: 80.945, label: "Gomti Nagar Extension" },
};

const REPORTERS = [
  "Aditya Sharma",
  "Priya Verma",
  "Rahul Gupta",
  "Sneha Singh",
  "Vikram Mishra",
  "Anjali Yadav",
  "Rohit Kumar",
  "Neha Tiwari",
  "Karan Malhotra",
  "Pooja Agarwal",
  "Anonymous Citizen",
];

const STATUS_FLOW = ["Reported", "Verified", "Assigned", "In Progress", "Resolved"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 12) + 7, Math.floor(Math.random() * 60), 0, 0);
  return d;
}

function buildTimeline(createdAt, finalStatusIndex) {
  const timeline = [];
  let t = new Date(createdAt);
  for (let i = 0; i <= finalStatusIndex; i++) {
    timeline.push({
      status: STATUS_FLOW[i],
      note: TIMELINE_NOTES[STATUS_FLOW[i]],
      at: new Date(t),
    });
    t = new Date(t.getTime() + (Math.random() * 20 + 4) * 60 * 60 * 1000); // +4-24h
  }
  return timeline;
}

const TIMELINE_NOTES = {
  Reported: "Complaint submitted by citizen.",
  Verified: "Field verification completed, issue confirmed.",
  Assigned: "Work order assigned to department crew.",
  "In Progress": "Field team is actively working on resolution.",
  Resolved: "Issue resolved and closed after inspection.",
};

const ISSUE_TEMPLATES = [
  {
    category: "Pothole",
    corridor: "pothole",
    variants: [
      ["Large pothole near market junction", "There is a large, deep pothole right at the market junction causing vehicles to swerve dangerously into oncoming traffic."],
      ["Pothole damaging vehicle tyres", "A cluster of potholes on this stretch has already damaged several two-wheeler tyres this week."],
      ["Deep pothole after recent rain", "Heavy rain has widened an existing pothole into a large crater, becoming a serious hazard at night."],
      ["Multiple potholes near bus stop", "The road near the bus stop has multiple potholes making it hard for buses to stop safely."],
    ],
  },
  {
    category: "Damaged Road",
    corridor: "pothole",
    variants: [
      ["Road surface completely broken", "The entire road surface has crumbled over the last month, exposing gravel and creating an uneven, dangerous drive."],
      ["Cracked road causing traffic slowdown", "Long cracks running across the road are causing traffic to slow drastically during peak hours."],
      ["Road caved in near drain cover", "Part of the road has caved in near a drain cover, a serious risk for two-wheelers."],
    ],
  },
  {
    category: "Streetlight",
    corridor: "streetlight",
    variants: [
      ["Streetlight not working for a week", "This streetlight has been off for over a week, leaving the whole stretch dark and unsafe for pedestrians at night."],
      ["Entire street in darkness at night", "Almost the whole corridor is dark after sunset because multiple streetlights are non-functional."],
      ["Flickering streetlight near park", "The streetlight near the park flickers constantly and switches off completely after 11pm."],
      ["No light near pedestrian crossing", "The pedestrian crossing near the school has no working streetlight, making it risky for children walking home."],
    ],
  },
  {
    category: "Garbage",
    corridor: "garbage",
    variants: [
      ["Garbage not collected for days", "Household waste has piled up on the street corner as the collection truck hasn't come in several days."],
      ["Overflowing garbage bin attracting stray animals", "The community garbage bin is overflowing and now attracts stray dogs and creates a strong odor."],
      ["Illegal dumping near residential area", "People are dumping construction debris and waste on the empty plot next to our homes."],
      ["Garbage burning causing smoke", "Waste is being burned openly in the open lot, causing smoke to spread through the residential block."],
    ],
  },
  {
    category: "Water Leakage",
    corridor: "water",
    variants: [
      ["Pipeline leak flooding the street", "A major water pipeline has burst, flooding the street and wasting a large amount of water daily."],
      ["Water leaking from underground pipe", "Water has been seeping up through the road surface for days, suggesting an underground pipe leak."],
      ["Continuous leakage near water tank", "There is continuous leakage near the community water tank, creating puddles and mosquito breeding spots."],
    ],
  },
  {
    category: "Drainage",
    corridor: "drainage",
    variants: [
      ["Drain blocked causing waterlogging", "The storm drain is completely blocked with debris, causing waterlogging on the road after every rain."],
      ["Open drain overflow near houses", "An open drain has been overflowing for days, spreading dirty water close to nearby homes."],
      ["Sewage backup in drainage line", "There is a sewage backup causing the drainage line to overflow onto the main road."],
      ["Clogged drain breeding mosquitoes", "The clogged drain has become stagnant, becoming a breeding ground for mosquitoes."],
    ],
  },
  {
    category: "Illegal Construction",
    corridor: null,
    variants: [
      ["Unauthorized construction blocking pathway", "A new structure is being built that encroaches onto the public footpath, blocking pedestrian access."],
      ["Illegal extension without approval", "A shop owner has built an illegal extension into the road without any municipal approval."],
    ],
  },
  {
    category: "Public Nuisance",
    corridor: null,
    variants: [
      ["Loud construction noise at night", "Construction work is continuing late into the night, well beyond permitted hours, disturbing residents."],
      ["Stray cattle blocking main road", "Stray cattle are regularly gathering on the main road, creating traffic hazards during rush hour."],
    ],
  },
];

export function generateSeedComplaints(count = 46) {
  const complaints = [];
  let idCounter = 1;

  for (let i = 0; i < count; i++) {
    const template = pick(ISSUE_TEMPLATES);
    const [title, description] = pick(template.variants);
    const corridor = template.corridor ? CORRIDORS[template.corridor] : null;
    const base = corridor || CENTER;

    const lat = jitter(base.lat, corridor ? 0.6 : 2.5);
    const lng = jitter(base.lng, corridor ? 0.6 : 2.5);

    const createdAt = daysAgo(Math.floor(Math.random() * 13));
    // weight status distribution: earlier reports more likely resolved
    const daysSince = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    let finalStatusIndex;
    if (daysSince > 9) finalStatusIndex = pick([2, 3, 4, 4]);
    else if (daysSince > 5) finalStatusIndex = pick([1, 2, 3]);
    else finalStatusIndex = pick([0, 0, 1, 2]);

    const timeline = buildTimeline(createdAt, finalStatusIndex);
    const status = STATUS_FLOW[finalStatusIndex];

    complaints.push({
      idCounter: idCounter++,
      title,
      description,
      category: template.category,
      location: {
        address: `${corridor ? corridor.label : "Lucknow"}, Sector ${Math.ceil(Math.random() * 12)}, Lucknow, UP`,
        lat,
        lng,
      },
      reporterName: pick(REPORTERS),
      reporterContact: "",
      status,
      timeline,
      createdAt,
    });
  }

  return complaints;
}
