export interface LeadershipItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  code: string;
  status: "ACTIVE" | "COMPLETED";
  description: string;
  highlights: string[];
}

export const leadershipData: LeadershipItem[] = [
  {
    id: "ieee-head",
    role: "Networking Head",
    organization: "IEEE Computer Society",
    period: "2025–2026",
    code: "LEAD-01 // IEEE-NET-HEAD",
    status: "ACTIVE",
    description: "Leading networking operations, hardware-software workshop orchestration, technical hackathon infrastructure, and university chapter outreach.",
    highlights: [
      "Architected hands-on microcontroller and IoT training tracks for 150+ student engineers.",
      "Spearheaded technical networking protocols symposium and live embedded systems demonstrations.",
      "Coordinating cross-disciplinary team deliverables across hardware prototyping and software deployment."
    ]
  },
  {
    id: "algozenith-ccp",
    role: "CCP Lead",
    organization: "AlgoZenith",
    period: "2025–2026",
    code: "LEAD-02 // AZ-CCP-LEAD",
    status: "ACTIVE",
    description: "Driving Campus Community Program operations, algorithmic problem-solving mentorship, and engineering curriculum delivery.",
    highlights: [
      "Mentored student cohorts in algorithmic thinking, data structures, and optimized computation.",
      "Organized technical coding contest infrastructure and peer review code inspection sessions.",
      "Built structured learning tracks for transitioning from algorithmic logic to systems-level code."
    ]
  },
  {
    id: "ieee-cohead",
    role: "Networking Co-Head",
    organization: "IEEE Computer Society",
    period: "2024–2025",
    code: "LEAD-03 // IEEE-NET-CO",
    status: "COMPLETED",
    description: "Co-managed networking chapter initiatives, technical talk logistics, and student engineering project mentorship.",
    highlights: [
      "Managed local technical infrastructure and network configurations for inter-collegiate tech symposiums.",
      "Organized introductory sessions covering microcontrollers, Linux tooling, and open-source hardware.",
      "Collaborated on establishing permanent laboratory hardware inventory tracking."
    ]
  }
];

export const personalBio = {
  name: "Himanshu Makhe",
  handle: "HIMANSHU / MK",
  tagline: "I BUILD SYSTEMS THAT CONNECT HARDWARE WITH SOFTWARE.",
  shortBio: "A Computer Science engineering student focused on building real hardware-software systems.",
  disciplinesSummary: "Embedded Systems · IoT · Robotics · AI · PCB · 3D Design · Linux",
  experienceYears: "2+ YEARS",
  experienceSubtext: "HANDS-ON ENGINEERING",
  status: "LAB STATUS: ACTIVE / DEPLOYING SYSTEMS",
  coordinates: "28.6139° N, 77.2090° E // WORKSTATION NODE 01",
  longBio: [
    "I operate at the convergence point between physical electron pathways and high-level algorithmic intelligence. Rather than treating software as an abstract layer isolated in the cloud, I engineer systems that physically actuate in the real world: microcontrollers streaming low-latency digital audio, inverse kinematics solvers moving multi-axis robot joints, IoT nodes reporting millisecond environmental telemetry, and AR simulation twins guiding sub-surface evacuations.",
    "My workflow is rooted in end-to-end realization—from schematic layout on ZeroPCB and parametric enclosure modeling in Autodesk Fusion 360, to bare-metal C++ firmware on ESP32/Pico W, up to high-performance TypeScript backends and Model Context Protocol (MCP) integrations."
  ]
};
