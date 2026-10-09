// Single source of truth for all AIMPACT Hackathon details and copy.

export const EVENT = {
  name: "AIMPACT",
  subtitle: "Hackathon",
  college: "A.P. SHAH INSTITUTE OF TECHNOLOGY",
  department: "Department of Artificial Intelligence & Machine Learning",
  tagline: "Take Aim. Build Fast. Make Impact.",
  // Countdown target. Use an ISO string with the IST offset.
  startsAt: "2026-10-17T07:30:00+05:30",
  dateLabel: "October 17, 2026",
  venueLabel: "APSIT Campus, Thane (W)",
  prizeLabel: "₹10,000 Total Prize Pool",
  registrationWindow: "Oct 09 – Oct 13, 2026",
  teamFormat: "Inter-Department (Team Size: 4)",
  minTeamSize: 2,
  maxTeamSize: 4,
  collectLogistics: false, // Set to false to hide T-shirt & dietary preferences
  registrationFee: 0, // 0 for free; Razorpay flow enabled if > 0
  registrationDeadline: "2026-10-13T23:59:00+05:30",
  capacity: 150, // Max confirmed teams
  whatsappGroupUrl: "https://chat.whatsapp.com/TODO_AIMPACT_2026",
  codeOfConductUrl: "#conduct",
  contact: {
    email: "aimpact@apsit.edu.in",
    altEmail: "aiml.council@apsit.edu.in",
    phone: "+91 98765 43210 (TODO: Coordinator)",
    address: "Survey No. 12, Ghodbunder Rd, Opp. Hypercity Mall, Kasarvadavali, Thane West, Maharashtra 400615",
  },
  socials: [
    { name: "Instagram", url: "https://instagram.com/apsit_aiml (TODO)", icon: "TbBrandInstagram" },
    { name: "LinkedIn", url: "https://linkedin.com/school/apsit-thane (TODO)", icon: "TbBrandLinkedin" },
    { name: "GitHub", url: "https://github.com/aimpact-hackathon (TODO)", icon: "TbBrandGithub" },
    { name: "Twitter / X", url: "https://twitter.com/apsit_thane (TODO)", icon: "TbBrandTwitter" },
  ],
};

// Chips that orbit the title. left/top are percentages of the stage square.
export const TRACKS = [
  {
    id: "ai-education",
    label: "AI for Education",
    shortTitle: "AI for Education",
    left: "50%",
    top: "6%",
    blurb:
      "Open to any innovative idea in learning and academia! You have full creative freedom to solve any challenge — from personalized study companions, gamified learning, and automated feedback to campus productivity utilities, accessibility tools, and smart classroom assistants. If it benefits education, build it!",
    icon: "TbSchool",
    tags: ["Open Innovation", "AI Tutors & Agents", "Campus Utilities", "Accessibility Tools", "Any EdTech Solution"],
  },
  {
    id: "ai-healthcare",
    label: "AI for Healthcare",
    shortTitle: "AI for Healthcare",
    left: "50%",
    top: "94%",
    blurb:
      "Open to any creative solution for human health and wellbeing! There are no rigid boundaries — explore early diagnostics, mental wellness bots, fitness & nutrition helpers, clinic queue managers, medical imaging, or assistive patient care tools. Any impactful idea that advances healthcare is welcome!",
    icon: "TbHeartRateMonitor",
    tags: ["Open Innovation", "Diagnostics & Care", "Mental Wellness", "Clinical Workflow", "Any Health Solution"],
  },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Tracks", href: "#tracks" },
  { label: "Timeline", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
  { label: "Refreshments", href: "#partner" },
];

export const TICKER_ITEMS = [
  "TAKE AIM",
  "HIT THE TARGET",
  "8H SPRINT",
  "₹10,000 PRIZE POOL",
  "INTER-DEPARTMENT",
  "TEAM SIZE 4",
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
    { value: "4", label: "Team Size", detail: "Inter-department squads" },
    { value: "₹10,000", label: "Total Prize Pool", detail: "Cash rewards & certificates" },
  ],
};

export const TIMELINE = [
  {
    time: "Oct 09, 2026",
    title: "Registrations Open",
    description: "Inter-department team registrations go live online.",
    status: "completed",
  },
  {
    time: "Oct 13, 2026",
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
    description: "Campus entry, team check-in, ID verification, and hackathon kit distribution.",
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
  totalPool: "₹10,000",
  title: "Total Prize Pool",
  description: "Exciting cash prizes, certificates of merit, and recognition for winning squads.",
};

export const REFRESHMENT_PARTNER = {
  tag: "OFFICIAL REFRESHMENT PARTNER",
  brandName: "3SISTERS",
  productName: "No Bullsh*t Caffeinated Drink",
  tagline: "Fueling 8 Hours of Non-Stop Engineering Ingenuity",
  description:
    "No exaggerated claims and no unnecessary noise. 3SISTERS delivers clean, uncomplicated fuel with 75 mg plant-based caffeine, zero sugar, and zero calories—crafted to keep coders and creators laser-focused from kickoff to code freeze.",
  logo: "/3sisters-logo-transparent.png",
  image: "/3sisters-can-hero.jpg",
  websiteUrl: "https://3sistersdrinks.com",
  productUrl: "https://3sistersdrinks.com/products/no-bullshit-caffeinated-drink",
  stats: [
    { value: "75 mg", label: "Plant Caffeine", detail: "Clean, jitter-free focus" },
    { value: "0 g", label: "Zero Sugar", detail: "No crash or spike" },
    { value: "0 kcal", label: "Zero Calories", detail: "Pure functional energy" },
    { value: "B-Complex", label: "Vitamins B2, B3, B6, B12", detail: "Sustained endurance" },
  ],
  features: [
    "Plant-based clean caffeine engineered for deep coding sprints",
    "Zero sugar & zero calories for crash-free mental clarity",
    "Enriched with vital B-complex vitamins for sustained cognitive stamina",
    "Official refreshment partner powering all participating squads",
  ],
};

export const FAQS = [
  {
    q: "Who is eligible to participate in AIMPACT?",
    a: "Second Year (SE) and Third Year (TE) students of A.P. Shah Institute of Technology (APSIT) across all engineering departments are eligible to participate.",
  },
  {
    q: "What is the team size requirement?",
    a: "Teams must consist of 2 to 4 members. Individual participation is not permitted to emphasize collaborative engineering.",
  },
  {
    q: "Is there a registration fee?",
    a: "No! Registration for AIMPACT 2026 is completely free. Meals, Wi-Fi, midnight snacks, and hackathon kits are provided on-campus at zero cost.",
  },
  {
    q: "Can team members be from different departments or years?",
    a: "Yes! Inter-departmental and cross-year teams between 2nd Year (SE) and 3rd Year (TE) within APSIT are highly encouraged. Squads can combine students from any engineering department.",
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
  { value: "SE", label: "SE (2nd Year)" },
  { value: "TE", label: "TE (3rd Year)" },
];
