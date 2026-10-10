// Single source of truth for all AIMPACT Hackathon details and copy.

export const EVENT = {
  name: "AIMPACT",
  subtitle: "Hackathon",
  college: "A.P. SHAH INSTITUTE OF TECHNOLOGY",
  department: "Computer Science Engineering (AI&ML)",
  tagline: "Take Aim. Build Fast. Make Impact.",
  // Countdown target. Use an ISO string with the IST offset.
  startsAt: "2026-10-17T07:30:00+05:30",
  dateLabel: "October 17, 2026",
  venueLabel: "APSIT Campus, Thane (W)",
  prizeLabel: "₹5,000 Total Prize Pool",
  registrationWindow: "Oct 10 – Oct 14, 2026",
  teamFormat: "Inter-Department (Team Size: 3-4)",
  minTeamSize: 3,
  maxTeamSize: 4,
  collectLogistics: false, // Set to false to hide T-shirt & dietary preferences
  registrationFee: 0, // 0 for free; Razorpay flow enabled if > 0
  registrationDeadline: "2026-10-14T23:59:00+05:30",
  capacity: 150, // Max confirmed teams
  whatsappGroupUrl: "https://chat.whatsapp.com/TODO_AIMPACT_2026",
  codeOfConductUrl: "#conduct",
  pptTemplateUrl: "https://canva.link/5vbijflh7dadlej",
  contact: {
    email: "aimpact@apsit.edu.in",
    altEmail: "aiml.council@apsit.edu.in",
    phone: "+91 7700069526",
    address: "Survey No. 12, Ghodbunder Rd, Opp. Hypercity Mall, Kasarvadavali, Thane West, Maharashtra 400615",
  },
  coordinators: [
    { name: "Kshitij", phone: "7718061050" },
    { name: "Suraj", phone: "7700069526" },
    { name: "Vedant", phone: "8530070228" },
    { name: "Akshat", phone: "7678068168" },
    { name: "Nishant", phone: "7718900904" },
  ],
  socials: [
    {
      name: "Instagram",
      url: "https://www.instagram.com/aimlsa_apsit?dlrf=N2U3YW9wN2Vxd3Zk",
      icon: "TbBrandInstagram",
    },
  ],
};

// Chips that orbit the title. left/top are percentages of the stage square.
export const TRACKS = [
  {
    id: "ai-education",
    label: "AI for Learning & Education",
    shortTitle: "AI for Education",
    left: "50%",
    top: "6%",
    blurb:
      "Innovate with Artificial Intelligence to address challenges across education, learning experiences, teaching methodologies, student engagement, and academic accessibility.Identify any problem within this domain and build your own solution",
    icon: "TbSchool",
    tags: ["Open Innovation", "AI Tutors & Agents", "Campus Utilities", "Accessibility Tools", "Any EdTech Solution"],
  },
  {
    id: "ai-healthcare",
    label: "AI for Business & Commerce",
    shortTitle: "AI for Healthcare",
    left: "50%",
    top: "94%",
    blurb:
      "Explore AI-driven solutions for challenges in retail, restaurants, and food-service businesses, including inventory, demand forecasting, customer experience, waste reduction, and operational efficiency.Choose any relevant problem and develop an innovative solution.",
    icon: "TbHeartRateMonitor",
    tags: ["Open Innovation", "Diagnostics & Care", "Mental Wellness", "Clinical Workflow", "Any Health Solution"],
  },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Tracks", href: "#tracks" },
  { label: "Timeline", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
  { label: "Sponsors", href: "#sponsors" },
];

export const TICKER_ITEMS = [
  "TAKE AIM",
  "HIT THE TARGET",
  "8H SPRINT",
  "₹5,000 PRIZE POOL",
  "INTER-DEPARTMENT",
  "TEAM SIZE 3-4",
  "AI FOR EDUCATION",
  "AI FOR HEALTHCARE",
];

export const ABOUT = {
  heading: "Igniting Engineering Ingenuity",
  paragraphs: [
    "AIMPACT 2026 is an intensive 8-hour inter-departmental hackathon organized exclusively for students of A.P. Shah Institute of Technology by the AIML Student Association (AIML SA) and the AIML Club. Designed to bridge academic theory and real-world technology challenges, it unites ambitious developers, designers, and innovators across all engineering departments under one roof for an intensive build sprint.",
    "Across a high-energy sprint, teams collaborate with veteran industry mentors, test state-of-the-art developer tooling, and present live working prototypes to seasoned technical judges and tech founders.",
  ],
  stats: [
    { value: "8h", label: "Intensive Sprint", detail: "Fast-paced build & pitch" },
    { value: "3-4", label: "Team Size", detail: "Inter-department squads" },
    { value: "₹5,000", label: "Total Prize Pool", detail: "Cash rewards & certificates" },
  ],
};

export const TIMELINE = [
  {
    time: "Oct 10, 2026",
    title: "Registrations Open",
    description: "Inter-department team registrations go live online.",
    status: "completed",
  },
  {
    time: "Oct 14, 2026",
    title: "Registrations Close",
    description: "Portal closes at 23:59 IST. Shortlisted squads finalized.",
    status: "upcoming",
  },
  {
    time: "Oct 15, 2026",
    title: "Round 1 Result",
    description: "Shortlisted teams for the Hackathon will be announced",
    status: "upcoming",
  },
  {
    time: "Oct 17, 07:30 AM",
    title: "Reporting & Check-in",
    description: "Campus entry, team check-in and ID verification",
    status: "upcoming",
  },
  {
    time: "Oct 17, 09:00 AM",
    title: "Inauguration & Briefing",
    description: "Welcome address, hackathon rules briefing, and sprint problem statements kickoff.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 10:00 AM",
    title: "Coding Starts",
    description: "Sprint clock begins! Architecture design, code scaffolding, and rapid build sprint.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 12:00 PM",
    title: "Mentoring Round 1",
    description: "Industry mentors review project direction, technical architecture, and early progress.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 03:00 PM",
    title: "Mentoring Round 2",
    description: "Mid-way progress checkpoint, obstacle clearance, and MVP refinement with mentors.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 05:00 PM",
    title: "Coding Round Ends",
    description: "Code freeze! Repositories locked and prototype development concludes.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 05:30 PM",
    title: "Video Submission (2-Min Duration)",
    description: "Teams submit their 2-minute prototype walkthrough video via Google Drive link.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 05:30 PM",
    title: "Judging Round 1",
    description: "Preliminary evaluation: Judges evaluate working prototypes, decks, and codebase viability.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 06:30 PM",
    title: "Final Presentation & Judging",
    description: "Shortlisted finalist teams demonstrate live working prototypes to the grand jury.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 08:00 PM",
    title: "Winners Announcement",
    description: "Valedictory ceremony, prize pool distribution, and felicitation of winners.",
    status: "upcoming",
  },
];

export const PRIZES = {
  totalPool: "₹5,000",
  title: "Total Prize Pool",
  description: "Exciting cash prizes, certificates of merit, and recognition for winning squads.",
};

export const SPONSORS = [
  {
    id: "3sisters",
    role: "Official Refreshment Partner",
    tag: "REFRESHMENT PARTNER",
    brandName: "3SISTERS",
    productName: "3Sisters Drinks",
    tagline: "Clean Energy · Super Cola · Zero Added Sugar",
    description:
      "House of India's next-generation recreational beverages. From clean caffeinated energy drinks to date-sweetened Super Cola and craft sodas, keeping hackathon innovators energized, refreshed, and in full flow throughout the 8-hour sprint.",
    logo: "/3sisters-logo-transparent.png",
    image: "/3sisters-featured.jpg",
    badgeText: "Clean Energy • Super Cola • Zero Sugar",
    link: "https://3sistersdrinks.com",
    linkLabel: "Explore 3Sisters Drinks",
    accent: "cyan",
    stats: [
      { value: "0g Sugar", label: "Zero Added Sugar" },
      { value: "Clean", label: "Natural Energy" },
      { value: "Super Cola", label: "Real Date Syrup" },
      { value: "B-Vitamins", label: "Focus & Stamina" },
    ],
    features: [
      "No Bullsh*t Caffeinated Drink with 75mg plant caffeine & B-vitamins",
      "Super Cola crafted with real date syrup & no artificial sweeteners",
      "Official beverages fueling 8 hours of non-stop innovation",
    ],
  },
  {
    id: "meridian",
    role: "Official Dessert Partner",
    tag: "DESSERT PARTNER",
    brandName: "Meridian Ice Cream",
    productName: "Meridian Ice Cream (Kalyan)",
    tagline: "Real Dairy Ice Cream · Made for Every Craving",
    description:
      "Discover a delightful variety of ice cream flavours and indulgent desserts, from fruity favourites and rich chocolate creations to decadent sundaes, seasonal specials and refreshing mastani varieties. Made for every craving, every celebration, and every late-night dessert run.",
    logo: "/meridian-logo.png",
    image: "/meridian-banner.jpg",
    badgeText: "Real Dairy Ice Cream • Made for Every Craving",
    link: "https://www.instagram.com/meridian_icecream_kalyan/",
    linkLabel: "Visit @meridian_icecream_kalyan",
    accent: "rose",
    stats: [
      { value: "40+", label: "Ice Cream Flavours" },
      { value: "Dairy-Based", label: "Ice Cream" },
      { value: "Sundaes & Seasonal Specials", label: "Special Treats" },
      { value: "12:30 AM", label: "Open Until Late" },
    ],
    features: [
      "A wide variety of fruit, chocolate and classic flavours",
      "Signature sundaes, seasonal specials and mastani creations",
      "Located at Sai Chowk, Khadakpada, Kalyan (West)",
    ],
  },
];

export const REFRESHMENT_PARTNER = SPONSORS[0];

export const FAQS = [
  {
    q: "Who is eligible to participate in AIMPACT?",
    a: "First Year (FE), Second Year (SE), and Third Year (TE) students of A.P. Shah Institute of Technology (APSIT) across all engineering departments are eligible to participate.",
  },
  {
    q: "What is the team size requirement?",
    a: "Teams must consist of 3 to 4 members. Individual or 2-member participation is not permitted to emphasize collaborative engineering.",
  },
  {
    q: "Is there a registration fee?",
    a: "No! Registration for AIMPACT 2026 is completely free. Meals, Wi-Fi, midnight snacks, and hackathon kits are provided on-campus at zero cost.",
  },
  {
    q: "Can team members be from different departments or years?",
    a: "Yes! Inter-departmental and cross-year teams across 1st Year (FE), 2nd Year (SE), and 3rd Year (TE) within APSIT are highly encouraged. Squads can combine students from any engineering department.",
  },
  {
    q: "What should we bring to the venue?",
    a: "Each team member should bring their valid college ID card, laptops with chargers, any specialized hardware (if competing in IoT), and personal toiletries.",
  },
  {
    q: "What is the event duration and schedule?",
    a: "AIMPACT 2026 takes place on October 17, kicking off with check-in at 07:30 AM and culminating with the winners announcement at 08:00 PM. High-speed Wi-Fi, refreshments, mentorship, and support are provided throughout the day.",
  },
  {
    q: "What is the intellectual property (IP) policy?",
    a: "All code and intellectual property created during the hackathon belongs 100% to the respective team members.",
  },
  {
    q: "How will projects be evaluated?",
    a: "Projects are judged based on innovation, technical complexity, working prototype execution, track alignment, and clarity of the final pitch.",
  },
];

export const POPULAR_COLLEGES = [
  "A.P. Shah Institute of Technology",
  "Veermata Jijabai Technological Institute (VJTI)",
  "Sardar Patel Institute of Technology (SPIT)",
  "D.J. Sanghvi College of Engineering",
  "Thadomal Shahani Engineering College",
  "Fr. Conceicao Rodrigues College of Engineering",
  "K.J. Somaiya College of Engineering",
  "Vidyalankar Institute of Technology",
  "Ramrao Adik Institute of Technology (RAIT)",
  "Datta Meghe College of Engineering",
  "Vivekanand Education Society's Institute of Technology",
  "Terna Engineering College",
  "Pillai College of Engineering",
  "Saraswati College of Engineering",
];

export const DEPARTMENTS = [
  "CSE (AI&ML)",
  "CSE (DS)",
  "Computer Engineering",
  "IT",
];

export const YEARS = [
  { value: "FE", label: "FE (1st Year)" },
  { value: "SE", label: "SE (2nd Year)" },
  { value: "TE", label: "TE (3rd Year)" },
];
