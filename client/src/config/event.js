// Single source of truth for all AIMPACT Hackathon details and copy.

export const EVENT = {
  name: "AIMPACT",
  subtitle: "Hackathon",
  college: "A.P. SHAH INSTITUTE OF TECHNOLOGY",
  department: "Department of Artificial Intelligence & Machine Learning",
  tagline: "Take Aim. Build Fast. Make Impact.",
  // Countdown target. Use an ISO string with the IST offset.
  startsAt: "2026-10-17T09:00:00+05:30",
  dateLabel: "October 17, 2026",
  venueLabel: "APSIT Campus, Thane (W)",
  prizeLabel: "₹10,000 Total Prize Pool",
  registrationWindow: "Oct 08 – Oct 13, 2026",
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
    id: "ai-ml",
    label: "AI / ML",
    shortTitle: "AI / ML",
    left: "50%",
    top: "0%",
    blurb:
      "Push frontiers in LLMs, multimodal vision, agents, and predictive modeling solving high-impact enterprise or societal challenges.",
    icon: "TbBrain",
    tags: ["LLMs", "Computer Vision", "Agentic Systems", "Predictive Analytics"],
  },
  {
    id: "healthtech",
    label: "HealthTech",
    shortTitle: "HealthTech",
    left: "12%",
    top: "80%",
    blurb:
      "Architect breakthrough diagnostic pipelines, patient monitoring systems, assistive hardware, and secure electronic health records.",
    icon: "TbHeartRateMonitor",
    tags: ["Diagnostics", "Bioinformatics", "Remote Care", "Medical Imaging"],
  },
  {
    id: "web-iot",
    label: "Web and IoT",
    shortTitle: "Web and IoT",
    left: "88%",
    top: "80%",
    blurb:
      "Fuse responsive decentralized web architectures with intelligent edge devices, smart sensors, and automated physical computing.",
    icon: "TbCpu",
    tags: ["Smart Hardware", "Edge AI", "Full Stack Web", "Automation"],
  },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Tracks", href: "#tracks" },
  { label: "Timeline", href: "#timeline" },
  { label: "Prizes", href: "#prizes" },
  { label: "Masterclasses", href: "#masterclass" },
];

export const TICKER_ITEMS = [
  "TAKE AIM",
  "HIT THE TARGET",
  "8H SPRINT",
  "₹10,000 PRIZE POOL",
  "INTER-DEPARTMENT",
  "TEAM SIZE 4",
  "AI AND ML",
  "HEALTHTECH",
  "WEB & IOT",
];

export const ABOUT = {
  heading: "Igniting Engineering Ingenuity",
  paragraphs: [
    "AIMPACT 2026 is Maharashtra's premier 8-hour inter-collegiate hackathon organized by A.P. Shah Institute of Technology. Designed to bridge academic theory and real-world technology challenges, it unites ambitious developers, designers, and innovators under one roof for an intensive build sprint.",
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
    time: "Oct 08, 2026",
    title: "Registrations Open",
    description: "Inter-department team registrations go live online.",
    status: "completed",
  },
  {
    time: "Oct 12, 2026",
    title: "Pre-Hackathon Masterclasses",
    description: "Two deep-dive sessions on judging blueprints and pitch deck mastery.",
    status: "upcoming",
  },
  {
    time: "Oct 13, 2026",
    title: "Registrations Close",
    description: "Portal closes at 23:59 IST. Shortlisted teams receive confirmation emails.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 08:30 AM",
    title: "Reporting & Check-in",
    description: "Campus entry, badge distribution, breakfast, and workstation setup.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 09:30 AM",
    title: "Opening Ceremony & Rules Briefing",
    description: "Welcome address, hackathon rules briefing, and sprint kickoff.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 10:00 AM",
    title: "Hacking Begins (8-Hour Timer)",
    description: "Sprint clock starts. Design architecture, scaffold code, and build prototypes.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 02:00 PM",
    title: "Mentorship Review & Lunch",
    description: "Mid-way progress checkpoint with industry mentors and lunch break.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 06:00 PM",
    title: "Code Freeze & Submissions",
    description: "8-hour sprint concludes. Git repositories locked and demos finalized.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 06:30 PM",
    title: "Pitching & Live Judging",
    description: "Teams demonstrate working solutions before the evaluation panel.",
    status: "upcoming",
  },
  {
    time: "Oct 17, 08:00 PM",
    title: "Valedictory & Awards Ceremony",
    description: "Winner announcements, certificate distribution, and felicitation.",
    status: "upcoming",
  },
];

export const PRIZES = {
  totalPool: "₹10,000",
  title: "Total Prize Pool",
  description: "Exciting cash prizes, certificates of merit, and recognition for winning squads.",
};

export const MASTERCLASSES = [
  {
    id: "eval-blueprint",
    title: "The Evaluation Blueprint: From the Judge's Side",
    speaker: "Distinguished Engineering Leader (TODO: Name)",
    role: "Principal Architect & Hackathon Jury Veteran",
    time: "Oct 12 • 5:00 PM – 6:30 PM IST (Online)",
    summary:
      "A peek inside the scoring matrix: how judges weigh technical depth, architectural sanity, feasibility, and presentation poise under 3 minutes.",
    topics: ["Scoring Rubrics Decoded", "Demoing Imperfect Prototypes", "What Disqualifies a Pitch"],
  },
  {
    id: "ground-strategy",
    title: "Ground Level Strategy: Real-time Performance Tips",
    speaker: "Tech Co-Founder & Serial Hackathon Winner (TODO: Name)",
    role: "Ex-Hackathon Champion & Founder",
    time: "Oct 13 • 5:00 PM – 6:30 PM IST (Online)",
    summary:
      "Concrete time-management tactics for rapid 8-hour sprints: modular task allocation, rapid MVP staging, and maintaining team momentum to code freeze.",
    topics: ["Git Workflow for Rapid Sprints", "Mocking APIs on the Fly", "Energy & Focus Hygiene"],
  },
];

export const FAQS = [
  {
    q: "Who is eligible to participate in AIMPACT?",
    a: "Undergraduate and postgraduate students from any recognized university or engineering college are eligible. Cross-college teams are welcome!",
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
    q: "Can team members be from different colleges or years?",
    a: "Yes, cross-college and cross-year teams are fully encouraged! You can enter individual college names during member details entry.",
  },
  {
    q: "What should we bring to the venue?",
    a: "Each team member should bring their valid college ID card, laptops with chargers, any specialized hardware (if competing in IoT), and personal toiletries.",
  },
  {
    q: "What is the event duration and schedule?",
    a: "AIMPACT 2026 is an intensive 8-hour sprint held on October 17, from 08:30 AM to 08:30 PM. High-speed Wi-Fi, lunch, snacks, and mentor support are provided throughout the day.",
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
  "Artificial Intelligence & Machine Learning",
  "Computer Engineering",
  "Information Technology",
  "Data Science",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other",
];

export const YEARS = [
  { value: "FE", label: "First Year (FE)" },
  { value: "SE", label: "Second Year (SE)" },
  { value: "TE", label: "Third Year (TE)" },
  { value: "BE", label: "Final Year (BE)" },
];
