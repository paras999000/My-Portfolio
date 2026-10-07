export interface CaseStudyData {
  overview: string;
  problem: string;
  concept: string;
  conceptFlow: {
    step: string;
    label: string;
    detail: string;
  }[];
  architecture: {
    pipeline: string[];
    details: string;
    subsystems: {
      layer: string;
      technologies: string;
      role: string;
    }[];
  };
  hardware: {
    component: string;
    role: string;
    spec: string;
  }[];
  software: {
    stack: string;
    category: "Firmware" | "Backend" | "AI / Protocol" | "Frontend" | "Systems";
    details: string;
  }[];
  implementation: string;
  implementationWorkflow: {
    phase: string;
    name: string;
    action: string;
  }[];
  challenges: {
    title: string;
    context: string;
    mitigation: string;
  }[];
  result: {
    summary: string;
    metrics: { label: string; value: string }[];
  };
}

export interface ProjectMediaItem {
  id: string;
  type: 'image' | 'video' | 'schematic' | 'cad' | 'prototype';
  url: string;
  title: string;
  caption: string;
  specDoc?: string;
}

export interface ProjectModelPart {
  id: string;
  name: string;
  file: string;
  cadCode?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  priority: number;
  visualType?: string;
  scene?: string;
  github?: string;
  demo?: string;
  caseStudy: CaseStudyData;
  heroVisual?: string;
  model?: string;
  modelParts?: ProjectModelPart[];
  images?: string[];
  videos?: string[];
  gallery?: ProjectMediaItem[];
  metrics?: { label: string; value: string }[];
}

export const projectsData: ProjectItem[] = [
  // =========================================================================
  // 01. FRIDAY (FEATURED SYSTEM #1)
  // =========================================================================
  {
    id: "friday",
    title: "FRIDAY",
    subtitle: "AI Voice Assistant & Embedded Automation System",
    description: "A voice-enabled embedded AI assistant combining real-time audio processing, hardware control and MCP-based tool integration.",
    category: "EMBEDDED AI × ROBOTICS",
    technologies: ["ESP32-S3", "INMP441", "MAX98357A", "Embedded C/C++", "FreeRTOS", "Gemini AI", "MCP", "I2S DMA"],
    featured: true,
    priority: 1,
    visualType: "3d",
    scene: "FridayScene",
    github: "https://github.com/paras999000/Friday",
    heroVisual: "ai-core",
    model: "/models/02_FridayShell_esp32.stl",
    modelParts: [
      {
        id: "friday-shell",
        name: "FRIDAY Shell",
        file: "/models/02_FridayShell_esp32.stl",
        cadCode: "02_SHELL_ESP32"
      },
      {
        id: "friday-rear-cover",
        name: "FRIDAY Rear Cover",
        file: "/models/03_FridayRearCover_esp32.stl",
        cadCode: "03_REAR_COVER_ESP32"
      },
      {
        id: "friday-carrier",
        name: "FRIDAY Carrier",
        file: "/models/04_FridayCarrier_esp32.stl",
        cadCode: "04_CARRIER_ESP32"
      },
      {
        id: "friday-stand-base",
        name: "FRIDAY Stand Base",
        file: "/models/06_FridayStandBase_esp32.stl",
        cadCode: "06_STAND_BASE_ESP32"
      }
    ],
    images: [],
    videos: [],
    gallery: [
      {
        id: "doc-01",
        type: "schematic",
        url: "",
        title: "I2S DMA AUDIO BUS & POWER DISTRIBUTION SCHEMATIC",
        caption: "High-speed differential trace wiring between ESP32-S3 GPIO pins, INMP441 MEMS microphone, and MAX98357A I2S Class-D amplifier with low-noise 3.3V LDO filtering.",
        specDoc: "REF: SCH-FRIDAY-REV02"
      },
      {
        id: "doc-02",
        type: "cad",
        url: "",
        title: "ACOUSTIC CHAMBER & VENTILATION HEATSINK ENCLOSURE",
        caption: "Parametric Fusion 360 solid model isolating acoustic microphone port from transducer backwave to eliminate mechanical echo coupling.",
        specDoc: "REF: CAD-FRIDAY-CHAMBER"
      },
      {
        id: "doc-03",
        type: "prototype",
        url: "",
        title: "CIRCULAR RING BUFFER & DMA TIMING TEST LOG",
        caption: "Benchtop oscilloscope verification of continuous 24-bit 44.1kHz PCM stream stability under concurrent Wi-Fi FreeRTOS interrupt load.",
        specDoc: "REF: LOG-DMA-BENCH-04"
      }
    ],
    metrics: [
      { label: "Baud Rate", value: "460,800 Baud" },
      { label: "Sampling Rate", value: "16kHz 24-bit" },
      { label: "Tool Protocol", value: "MCP / Web Serial" },
      { label: "Memory Footprint", value: "340KB SRAM" }
    ],
    caseStudy: {
      overview: "FRIDAY is a dedicated physical embedded computing assistant and web-connected firmware deployment platform combining natural voice interaction, real-time spatial reasoning, and direct hardware actuation. Powered by an ESP32-S3 microcontroller, high-fidelity MEMS digital audio streaming over I2S DMA, and the Model Context Protocol (MCP), it bridges ambient spoken requests with deterministic physical edge operations.",
      problem: "Traditional commercial voice assistants depend on vendor-locked cloud ecosystems, lack direct hardware control primitives, and require complex desktop terminal toolchains to flash and calibrate firmware.",
      concept: "Create an autonomous edge-to-intelligence pipeline: INMP441 → I2S AUDIO INPUT → ESP32-S3 → AI PROCESSING → MCP → EXTERNAL TOOL / SERVICE → PHYSICAL ACTION.",
      conceptFlow: [
        { step: "01", label: "MIC INPUT", detail: "INMP441 digital MEMS acoustic capture over high-speed I2S bus" },
        { step: "02", label: "I2S AUDIO INPUT", detail: "DMA circular ring buffer, continuous voice activity detection (VAD), and hardware filtering" },
        { step: "03", label: "ESP32-S3 CORE", detail: "FreeRTOS dual-core edge task scheduler managing audio frame serialization" },
        { step: "04", label: "AI PROCESSING", detail: "Gemini AI multimodal reasoning core parsing spoken intent and context" },
        { step: "05", label: "MCP PROTOCOL", detail: "Model Context Protocol JSON-RPC schema router mapping intent to tools" },
        { step: "06", label: "EXTERNAL TOOL / SERVICE", detail: "Webhooks, API endpoints, telemetry queries, and database services" },
        { step: "07", label: "PHYSICAL ACTION", detail: "Deterministic hardware GPIO pulses, relay switching, and robotic actuation" }
      ],
      architecture: {
        pipeline: [
          "INMP441 MEMS Microphone (Acoustic Capture)",
          "I2S DMA Circular Ring Buffer & Noise Filter",
          "ESP32-S3 Dual-Core FreeRTOS Orchestration",
          "Gemini AI Real-Time Processing Core",
          "Model Context Protocol (MCP) Tool Calling Router",
          "External Tools, API Services & Webhooks",
          "Hardware GPIO, Relays & Physical Actuation"
        ],
        details: "FreeRTOS dual-core allocation: Core 0 handles high-priority I2S DMA transfers, voice activity detection (VAD), and hardware pulse modulation; Core 1 coordinates TLS-secured network communication, MCP tool JSON serialization, and status OLED telemetry.",
        subsystems: [
          { layer: "HARDWARE LAYER", technologies: "ESP32-S3, INMP441, MAX98357A, LiPo PMU", role: "Acoustic transduction, analog power isolation, I2S serialization" },
          { layer: "FIRMWARE LAYER", technologies: "FreeRTOS, ESP-IDF, C/C++", role: "Dual-core task orchestration, zero-copy DMA buffers, hardware timers" },
          { layer: "COMMUNICATION", technologies: "WebSockets, Web Serial API, esptool-js", role: "In-browser direct USB flashing and low-latency audio transport" },
          { layer: "INTELLIGENCE LAYER", technologies: "Gemini API, MCP Tools Server", role: "Contextual intent parsing, structured tool calling, dynamic response generation" },
          { layer: "ACTUATION LAYER", technologies: "GPIO, PWM, I2C Bus", role: "Direct physical control over lab devices, lights, and robotic linkages" }
        ]
      },
      hardware: [
        { component: "ESP32-S3-WROOM-1 / ESP32 Dev Module", role: "Primary SoC", spec: "Xtensa Dual-Core @ 240MHz, 8MB PSRAM/4MB Flash, Vector AI Instructions" },
        { component: "INMP441", role: "MEMS Microphone", spec: "Omnidirectional digital I2S, 61 dBA SNR, 24-bit resolution" },
        { component: "MAX98357A", role: "I2S DAC Amplifier", spec: "Mono Class-D, 3.2W output into 4Ω, jitter-free I2S input" },
        { component: "SSD1306 OLED (0.96\")", role: "Local Telemetry Display", spec: "128x64 monochrome graphic display, I2C bus @ 400kHz" }
      ],
      software: [
        { stack: "ESP-IDF / FreeRTOS / C++", category: "Firmware", details: "Real-time operating system managing I2S DMA circular buffers and state machines." },
        { stack: "Web Serial & esptool-js", category: "Systems", details: "Browser-native firmware flashing without requiring Python or ESP-IDF toolchains." },
        { stack: "React & TypeScript", category: "Frontend", details: "Modern flashing cockpit with live UART console and three-stage workflow." },
        { stack: "Model Context Protocol (MCP)", category: "AI / Protocol", details: "JSON-RPC client enabling the language model to execute physical tool schemas." }
      ],
      implementation: "Designed the physical acoustic enclosure in CAD, engineered the custom power regulation circuitry, and compiled the production XiaoZhi firmware image served through an esptool-js web flasher.",
      implementationWorkflow: [
        { phase: "STAGE 01", name: "ACOUSTIC ISOLATION", action: "3D-printed acoustic baffles isolating MEMS microphone port from speaker vibrations" },
        { phase: "STAGE 02", name: "DMA DRIVER", action: "Configured zero-copy I2S DMA circular ring buffer to prevent audio stutter during Wi-Fi bursts" },
        { phase: "STAGE 03", name: "WEB SERIAL FLASHER", action: "Integrated esptool-js 0.6.1 for one-click in-browser firmware installation at 460,800 baud" },
        { phase: "STAGE 04", name: "MCP ENGINE", action: "Connected model reasoning loop to robotic hardware actuation primitives" }
      ],
      challenges: [
        {
          title: "Acoustic Feedback & Echo Cancellation",
          context: "Speaker output mechanically coupled into the microphone enclosure causing false wake triggers.",
          mitigation: "Designed a separate silicone acoustic isolator and implemented software energy-threshold gating in firmware."
        },
        {
          title: "UART Baud Rate Auto-Elevation on Web Serial",
          context: "Flashing 3.4MB firmware images at 115,200 baud took several minutes and often timed out in Chromium.",
          mitigation: "Engineered automated RTS/DTR sync with instant baud elevation to 460,800 baud, reducing flash duration to under 45 seconds."
        }
      ],
      result: {
        summary: "Delivered a fully operational voice assistant prototype and web flashing platform capable of flashing ESP32 modules in seconds with sub-300ms voice reasoning response.",
        metrics: [
          { label: "Flash Speed", value: "< 45s (460.8k baud)" },
          { label: "Latency", value: "< 280ms Edge-to-AI" },
          { label: "Audio Fidelity", value: "24-bit 16kHz PCM" }
        ]
      }
    }
  },

  // =========================================================================
  // 02. SAFEX (FEATURED SYSTEM #2)
  // =========================================================================
  {
    id: "safex",
    title: "SAFEX",
    subtitle: "AR Mine Safety & Emergency Response Training Simulator",
    description: "An augmented reality industrial safety training command center and Unity ARCore simulation for underground mining hazard evacuation and emergency response.",
    category: "AR SIMULATION × SAFETY",
    technologies: ["Unity 6", "AR Foundation", "ARCore", "C#", "Node.js", "Express", "Prisma", "PostgreSQL", "Docker"],
    featured: true,
    priority: 2,
    visualType: "3d",
    scene: "SafexScene",
    github: "https://github.com/paras999000/SAFEX-ARNX",
    heroVisual: "subterranean-mine",
    model: "/models/base.stl",
    images: [],
    videos: [],
    metrics: [
      { label: "Engine", value: "Unity 6 (6000.6.0f1)" },
      { label: "AR Tracking", value: "ARCore 6-DoF" },
      { label: "Languages", value: "English / Hindi / Santali" },
      { label: "Sync Engine", value: "Offline-First Queue" }
    ],
    caseStudy: {
      overview: "SAFEX is an Augmented Reality training simulator and industrial safety command center built in Unity 6, designed for underground mining operations. Trainees navigate photorealistic hazard scenarios—including methane gas leaks, structural cave-ins, and ventilation fires—with real-time biometric and telemetry sync to an industrial command center.",
      problem: "Traditional mining safety drills rely on classroom lectures or disruptive site shutdowns. Workers cannot safely rehearse life-threatening hazards like toxic gas leaks or blackout egress in real mine shafts.",
      concept: "Create an interactive AR simulation where trainees experience 1:1 scale hazard situations safely: REAL-TIME AR MESHING → HAZARD INJECTION → REAL-TIME GAS SENSING → EVACUATION PATHFINDING → COMMAND CENTER TELEMETRY.",
      conceptFlow: [
        { step: "01", label: "SURFACE SCAN", detail: "Unity AR Foundation detects horizontal floor planes and anchors 1:1 scale mine tunnels" },
        { step: "02", label: "HAZARD TRIGGER", detail: "Dynamic propagation of toxic CH4/CO gas clouds or structural fire events with flickering lighting" },
        { step: "03", label: "TRAINEE RESPONSE", detail: "Worker operates virtual gas detectors, dons self-contained breathing apparatus, and follows egress SOPs" },
        { step: "04", label: "LOCAL QUEUE", detail: "Telemetry, quiz decisions, and evacuation times queued in persistent storage if offline" },
        { step: "05", label: "CLOUD SYNC", detail: "Prisma & PostgreSQL backend ingests completed session logs and issues verifiable certification" }
      ],
      architecture: {
        pipeline: [
          "AR Surface Detection & 1:1 Tunnel Anchoring (Unity AR Foundation)",
          "Volumetric Smoke & Toxic Gas Atmospheric Simulation (URP)",
          "Interactive SOP Knowledge Checks & Assessment Flow",
          "Offline-First SQLite/JSON Sync Engine (SAFEXSyncQueue.json)",
          "Node.js + Prisma PostgreSQL Industrial Command Center"
        ],
        details: "Decoupled system architecture: Unity Android client runs independent simulation state machines with offline queueing, syncing via UnityWebRequest to an Express/TypeScript REST backend backed by PostgreSQL and Prisma ORM.",
        subsystems: [
          { layer: "SIMULATION ENGINE", technologies: "Unity 6, Universal Render Pipeline (URP), C#", role: "Physically based mine tunnel generation, atmospheric fog, and particle fire effects" },
          { layer: "XR TRACKING", technologies: "AR Foundation, ARCore XR Plugin", role: "6-DoF world-space tracking, floor plane estimation, and touch placement" },
          { layer: "SYNC ENGINE", technologies: "UnityWebRequest, PersistentDataPath", role: "Offline-first resilient JSON request queue with automated flush on reconnect" },
          { layer: "BACKEND API", technologies: "Node.js, Express, TypeScript, Prisma ORM", role: "Trainee tracking, session logs, hazard event auditing, and certificate issuance" },
          { layer: "COMMAND CENTER", technologies: "HTML5, CSS3, JavaScript, Vercel/Render", role: "Multilingual dashboard with 6s telemetry polling across English, Hindi, and Santali" }
        ]
      },
      hardware: [
        { component: "ARCore Android Device", role: "Trainee XR Terminal", spec: "Android 10.0+ (API 29+), IMU gyroscope, camera SLAM tracking" },
        { component: "Simulated Multi-Gas Detector", role: "Virtual Tool", spec: "In-game virtual sensor monitoring CH4, CO, and O2 levels against PEL limits" }
      ],
      software: [
        { stack: "Unity 6 (6000.6.0f1) & C#", category: "Systems", details: "Procedural tunnel generation, MineAtmosphere fog, FireScenario, and GasLeakScenario logic." },
        { stack: "Node.js / Express / TypeScript", category: "Backend", details: "REST API endpoints managing sessions, trainees, and safety certifications." },
        { stack: "Prisma ORM & PostgreSQL", category: "Backend", details: "Relational database schema storing granular chronological event telemetry." },
        { stack: "Industrial Dark Command Center", category: "Frontend", details: "Multilingual dashboard deployed with real-time incident polling and stats." }
      ],
      implementation: "Developed procedural tunnel generators, volumetric hazard shaders, offline-first sync pipelines, and a full-stack Dockerized PostgreSQL command center.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "AR TUNNEL GENERATOR", action: "Authored procedural mesh generator creating rock strata, timber crossbeams, and rail tracks" },
        { phase: "PHASE 02", name: "DISASTER STATE MACHINES", action: "Implemented gas diffusion physics, emergency light flickers, and quiz evaluation engines" },
        { phase: "PHASE 03", name: "OFFLINE SYNC ARCHITECTURE", action: "Wrote SAFEXCloudSyncManager queuing telemetry packets in JSON when underground" },
        { phase: "PHASE 04", name: "COMMAND CENTER DEPLOYMENT", action: "Constructed Prisma database and multilingual monitoring dashboard for trainers" }
      ],
      challenges: [
        {
          title: "Underground Network Isolation",
          context: "Active underground mine tunnels completely lack cellular and Wi-Fi connectivity.",
          mitigation: "Designed an offline-first sync engine that buffers all training events locally and automatically flushes to PostgreSQL upon surface re-connection."
        },
        {
          title: "Multi-Dialect Mining Workforce Training",
          context: "Mine laborers in Eastern India predominantly speak Santali and Hindi, preventing English-only training.",
          mitigation: "Engineered complete internationalization across audio voiceovers, UI text, and command center telemetry for English, Hindi, and Santali."
        }
      ],
      result: {
        summary: "Delivered a full-stack AR mining safety ecosystem tested across realistic hazard simulations with zero data loss in offline trials.",
        metrics: [
          { label: "Sync Fidelity", value: "100% Offline-Safe" },
          { label: "Localization", value: "3 Languages (EN/HI/SAT)" },
          { label: "AR Stability", value: "< 1.5cm Anchor Drift" }
        ]
      }
    }
  },

  // =========================================================================
  // 03. ROBOTIC ARM (FEATURED SYSTEM #3)
  // =========================================================================
  {
    id: "robotic-arm",
    title: "ROBOTIC ARM",
    subtitle: "4-DOF Robotic Manipulator & Kinematic Actuation Platform",
    description: "A precision 4-degree-of-freedom robotic manipulator featuring custom CAD geometry, forward and inverse kinematic solvers, and real-time microcontroller servo control.",
    category: "ROBOTICS × MECHANICAL CAD",
    technologies: ["Arduino C++", "PCA9685 I2C", "MG996R Servos", "Fusion 360", "Forward Kinematics", "Inverse Kinematics", "3D Printing"],
    featured: true,
    priority: 3,
    visualType: "3d",
    scene: "RoboticArmScene",
    github: "https://github.com/paras999000",
    heroVisual: "robotic-arm-core",
    model: "/models/base.stl",
    images: [],
    videos: [],
    metrics: [
      { label: "Degrees of Freedom", value: "4-DOF Articulated" },
      { label: "Payload Capacity", value: "350g at Full Reach" },
      { label: "Kinematic Solver", value: "Analytic IK Closed-Form" },
      { label: "PWM Precision", value: "12-bit (PCA9685 I2C)" }
    ],
    caseStudy: {
      overview: "A custom engineered 4-degree-of-freedom articulated robotic arm manipulator designed from first principles in Autodesk Fusion 360, fabricated via additive manufacturing, and controlled through an analytic inverse kinematics mathematical solver running on embedded microcontrollers.",
      problem: "Commercial educational robotic arms are either toy-grade plastic kits with excessive backlash and no kinematics, or prohibitively expensive industrial arms that cannot be customized for research.",
      concept: "Closed-loop physical robotics: USER 3D CARTESIAN GOAL (X, Y, Z) → INVERSE KINEMATICS ENGINE → SERVO ANGLE MAPPING → 12-BIT PWM PULSE GENERATOR → MECHANICAL JOINT ACTUATION.",
      conceptFlow: [
        { step: "01", label: "CARTESIAN INPUT", detail: "Target spatial coordinate (X, Y, Z) and end-effector orientation received over serial interface" },
        { step: "02", label: "KINEMATIC SOLVER", detail: "Trigonometric closed-form inverse kinematics calculates joint angles θ1 (base), θ2 (shoulder), θ3 (elbow)" },
        { step: "03", label: "TRAJECTORY PLANNER", detail: "S-curve velocity profile interpolates intermediate waypoints to minimize jerk and mechanical vibration" },
        { step: "04", label: "PWM SERIALIZATION", detail: "PCA9685 16-channel 12-bit PWM generator modulates pulse widths (500µs - 2500µs) over I2C bus" },
        { step: "05", label: "GRIPPER EXECUTION", detail: "High-torque metal-gear MG996R servomotors execute coordinated motion to actuate parallel jaw gripper" }
      ],
      architecture: {
        pipeline: [
          "Spatial Coordinate Input (Serial JSON Stream)",
          "Analytic Geometric Inverse Kinematics Decomposition",
          "Minimum-Jerk Trapezoidal Velocity Profiler",
          "I2C 12-bit PWM Duty Cycle Generation (PCA9685)",
          "High-Torque Metal Gear Servo Actuation & Gripper Clamping"
        ],
        details: "Geometric kinematic approach decomposing spatial target into planar 2-link polar projection for rapid sub-millisecond calculation on standard microcontrollers without requiring floating-point matrix inversion libraries.",
        subsystems: [
          { layer: "MECHANICAL STRUCTURE", technologies: "Fusion 360, PETG 3D Printing, Thrust Bearings", role: "Rigid lightweight linkages, dual-bearing base mount, and parallel gripper" },
          { layer: "ACTUATION HARDWARE", technologies: "MG996R High-Torque Servos, PCA9685 Driver", role: "Rotational joint torque generation with 12-bit angular resolution" },
          { layer: "POWER DISTRIBUTION", technologies: "5V 10A Buck Regulator, Filter Capacitors", role: "Isolated high-current power rail preventing microcontroller brownouts" },
          { layer: "EMBEDDED FIRMWARE", technologies: "Arduino C++, Wire.h I2C, Math.h", role: "Real-time kinematic calculations and smooth pulse modulation" }
        ]
      },
      hardware: [
        { component: "TowerPro MG996R (x4)", role: "Joint Actuators", spec: "Metal gears, 11 kg·cm stall torque @ 6V, 0.15s/60° rotation speed" },
        { component: "PCA9685 PWM Driver", role: "Servo Controller", spec: "16-channel 12-bit PWM I2C interface, programmable frequency (40Hz - 1000Hz)" },
        { component: "Microcontroller Board", role: "Kinematics Computer", spec: "Embedded microcontroller computing joint trigonometry" },
        { component: "Dual Thrust Ball Bearings", role: "Base Pivot", spec: "Takes axial loading off base servo to prevent shaft deflection" }
      ],
      software: [
        { stack: "Embedded C++ (Arduino)", category: "Firmware", details: "Closed-form inverse kinematics, non-blocking serial parsing, and PCA9685 I2C control." },
        { stack: "Autodesk Fusion 360", category: "Systems", details: "Parametric solid CAD modeling, center-of-gravity optimization, and clearance tolerances." },
        { stack: "Kinematic Mathematical Solver", category: "AI / Protocol", details: "Analytic trigonometric IK equations deriving θ1, θ2, θ3 from (X, Y, Z) coordinates." }
      ],
      implementation: "Modelled all structural linkages in Fusion 360 with stress-optimized infill, printed parts in PETG, wired isolated servo power rails, and calibrated joint angles against real measuring jigs.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "CAD DESIGN", action: "Designed modular joint brackets, bearing seats, and parallel linkage end-effector in CAD" },
        { phase: "PHASE 02", name: "FABRICATION", action: "3D-printed structural components in carbon-fiber reinforced PETG with 4 perimeter walls" },
        { phase: "PHASE 03", name: "CIRCUIT FABRICATION", action: "Assembled dedicated 5V 10A power rail with bulk smoothing capacitors to suppress stall current spikes" },
        { phase: "PHASE 04", name: "KINEMATICS CODE", action: "Derived and implemented closed-form analytic inverse kinematics formulas with joint angle boundary clamps" }
      ],
      challenges: [
        {
          title: "Servo Stall Brownout Inrush Currents",
          context: "Simultaneous acceleration of 4 high-torque servos drew peak currents exceeding 6A, resetting the microcontroller.",
          mitigation: "Isolated logic 5V rail from servo 5V rail with Schottky diode isolation and added 2200µF low-ESR electrolytic capacitors at the PCA9685 power terminal."
        },
        {
          title: "Joint Backlash & Cantilever Deflection",
          context: "Full horizontal extension of 250mm arm multiplied torque on shoulder joint, causing ~8mm end-effector droop.",
          mitigation: "Redesigned shoulder horn bracket with dual-bearing counter-support and added mechanical counter-balance geometry."
        }
      ],
      result: {
        summary: "Constructed a repeatable 4-DOF robotic manipulator capable of pick-and-place operations with sub-3mm positioning accuracy across a 280mm hemisphere.",
        metrics: [
          { label: "Repeatability", value: "± 2.5 mm" },
          { label: "Reach Radius", value: "280 mm Hemisphere" },
          { label: "IK Calc Time", value: "< 0.4 ms / Coordinate" }
        ]
      }
    }
  },

  // =========================================================================
  // 04. SMART PARKING (FEATURED SYSTEM #4)
  // =========================================================================
  {
    id: "smart-parking",
    title: "SMART PARKING",
    subtitle: "Dual-Microcontroller IoT Parking Management & Cloud System",
    description: "An end-to-end intelligent parking management platform pairing a Raspberry Pi Pico edge counter with an ESP8266 Wi-Fi cloud gateway, Supabase database, and reactive dashboards.",
    category: "IoT × SMART INFRASTRUCTURE",
    technologies: ["Raspberry Pi Pico", "MicroPython", "ESP8266 NodeMCU", "Supabase", "Node.js", "Express", "React", "UART Serial"],
    featured: true,
    priority: 4,
    visualType: "3d",
    scene: "SmartParkingScene",
    github: "https://github.com/paras999000/Smart-parking-system-iot",
    heroVisual: "smart-parking-lot",
    model: "/models/base.stl",
    images: [],
    videos: [],
    metrics: [
      { label: "Microcontrollers", value: "Raspberry Pi Pico + ESP8266" },
      { label: "Inter-Chip Bus", value: "UART Serial @ 9600 Baud" },
      { label: "Cloud Database", value: "Supabase Real-Time" },
      { label: "Detection Logic", value: "Edge Debounced Falling-Edge" }
    ],
    caseStudy: {
      overview: "The IoT Smart Parking System is an intelligent parking platform combining physical vehicle beam sensing, dual-microcontroller inter-chip communication, cloud database synchronization, and modern glassmorphic web dashboards to eliminate congestion and display live bay availability.",
      problem: "Drivers spend excessive time hunting for parking in multi-level lots, burning fuel and causing congestion. Traditional commercial automated parking sensors are costly and prone to false triggers.",
      concept: "Dual-tier embedded intelligence: OPTICAL IR SENSOR → RASPBERRY PI PICO (EDGE COUNTER) → UART SERIAL → ESP8266 (WI-FI GATEWAY) → SUPABASE CLOUD → REACT WEB DASHBOARD.",
      conceptFlow: [
        { step: "01", label: "VEHICLE DETECTION", detail: "Vehicle breaks optical infrared beam at bay entrance, triggering falling-edge GPIO pulse (1 -> 0)" },
        { step: "02", label: "EDGE COUNTING", detail: "Raspberry Pi Pico executes software debouncing, increments internal bay counter, and manages local LEDs/buzzer" },
        { step: "03", label: "SERIAL BRIDGE", detail: "Pico transmits atomic counter updates over UART Serial (GP0 TX / 9600 baud) to ESP8266" },
        { step: "04", label: "CLOUD BROADCAST", detail: "ESP8266 captures serial payload and sends HTTP PATCH updates to Supabase Cloud and local Express server" },
        { step: "05", label: "DASHBOARD VISUAL", detail: "React and Express web clients update slot dials and bay occupancy heatmaps in real time" }
      ],
      architecture: {
        pipeline: [
          "Optical IR Interruption Detection (GPIO 15 Falling-Edge)",
          "Raspberry Pi Pico MicroPython Debounce & Counter Logic",
          "UART Serial Packet Bridge (9600 Baud Inter-Chip)",
          "ESP8266 NodeMCU Wi-Fi Cloud Gateway",
          "Supabase Real-Time PostgreSQL Database & Web Dashboards"
        ],
        details: "Separation of concerns: Pico handles high-speed deterministic hardware I/O and audible alerts with zero network blocking; ESP8266 handles Wi-Fi stack and cloud API synchronization.",
        subsystems: [
          { layer: "EDGE HARDWARE", technologies: "Raspberry Pi Pico, IR Sensors, MicroPython", role: "Interrupt-driven edge sensing, LED signaling, and counter tracking" },
          { layer: "COMMUNICATION BUS", technologies: "UART Serial (GP0/GP1), 9600 Baud", role: "Reliable inter-chip serial transmission between 3.3V microcontrollers" },
          { layer: "IOT CLOUD GATEWAY", technologies: "ESP8266 NodeMCU, Wi-Fi 802.11 b/g/n", role: "REST HTTP client dispatching telemetry to cloud and local servers" },
          { layer: "CLOUD DATABASE", technologies: "Supabase Cloud, PostgreSQL", role: "Persistent cloud storage of slot state and historical occupancy trends" },
          { layer: "WEB DASHBOARDS", technologies: "React, Tailwind CSS, Express.js", role: "Live slot visualizer (Zone Alpha P01-P10) and occupancy gauges" }
        ]
      },
      hardware: [
        { component: "Raspberry Pi Pico", role: "Edge Controller", spec: "RP2040 Dual ARM Cortex-M0+ @ 133MHz, 264KB SRAM, MicroPython runtime" },
        { component: "ESP8266 NodeMCU", role: "Wi-Fi Gateway", spec: "Tensilica L106 32-bit @ 80MHz, integrated Wi-Fi stack, 3.3V logic" },
        { component: "Optical IR Sensor Modules", role: "Vehicle Ingress Sensor", spec: "Active infrared transmitter-receiver pair with LM393 comparator" },
        { component: "Status LEDs & Active Buzzer", role: "Physical Bay Indicator", spec: "Green LED (Vacant), Red LED (Full Capacity), 5V Active Buzzer alarm" }
      ],
      software: [
        { stack: "MicroPython (Thonny IDE)", category: "Firmware", details: "Pico edge firmware managing pin interrupts, anti-bounce filters, and UART serial output." },
        { stack: "Arduino C++ / NodeMCU", category: "Firmware", details: "ESP8266 gateway parsing serial strings and executing HTTP PATCH requests." },
        { stack: "Node.js & Express", category: "Backend", details: "Local HTTP server maintaining real-time slot state and JSON APIs." },
        { stack: "React & Supabase Cloud", category: "Frontend", details: "Cloud-connected responsive dashboard with neon-glow slot map visualization." }
      ],
      implementation: "Tested across real breadboard circuits with physical Pico and ESP8266 microcontrollers, logging edge falling-edge pulses in Thonny shell and rendering on Express & React dashboards.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "HARDWARE BREADBOARDING", action: "Wired Pico GPIO pins (GP15 sensor, GP16 green LED, GP17 red LED, GP18 buzzer) and UART bridge" },
        { phase: "PHASE 02", name: "EDGE MICROPYTHON CODE", action: "Authored edge counter firmware with debouncing and UART serial output on GP0" },
        { phase: "PHASE 03", name: "GATEWAY FIRMWARE", action: "Programmed ESP8266 to listen on RX pin and transmit Wi-Fi PATCH requests to Supabase" },
        { phase: "PHASE 04", name: "DUAL DASHBOARD SUITE", action: "Built both local Express web dashboard and cloud-connected React application" }
      ],
      challenges: [
        {
          title: "Switch Bounce & Multi-Triggering on Sensor Beam",
          context: "Vehicles passing slowly through IR beams caused multiple rapid falling-edge interrupts, overcounting cars.",
          mitigation: "Engineered software state debouncing requiring the beam to stay unblocked for 800ms before accepting subsequent arrivals."
        },
        {
          title: "UART Level Compatibility & Buffer Overflows",
          context: "Inter-chip serial packets occasionally got corrupted when both chips operated at different clock frequencies.",
          mitigation: "Standardized baud rate to 9600 with newline terminators ('\\n') and non-blocking readline() calls in MicroPython."
        }
      ],
      result: {
        summary: "Delivered an operational dual-microcontroller smart parking system with verified edge counting, cloud database synchronization, and commercial web dashboards.",
        metrics: [
          { label: "Detection Accuracy", value: "99.4% in Lab Testing" },
          { label: "Cloud Sync Delay", value: "< 1.2s to Supabase" },
          { label: "Bay Capacity", value: "10 Slots (Expandable)" }
        ]
      }
    }
  },

  // =========================================================================
  // 05. SECURITY AUDIT TRAIL LOGGER (MORE SYSTEMS #1)
  // =========================================================================
  {
    id: "security-audit-vault",
    title: "CYBERFORENSICS EVIDENCE VAULT",
    subtitle: "Military-Grade DFIR Cryptographic Audit Ledger & Chain of Custody System",
    description: "An advanced Digital Forensics and Incident Response (DFIR) platform and WORM audit ledger ensuring legal admissibility and cryptographic preservation of evidence under ISO/IEC 27037:2012.",
    category: "CYBERSECURITY × DFIR",
    technologies: ["FIPS 180-4 SHA-256", "WORM Immutable Ledger", "Python CLI", "Web Crypto API", "ISO/IEC 27037:2012", "Canon EOS 1200D Telemetry"],
    featured: false,
    priority: 5,
    visualType: "3d",
    scene: "SecurityAuditScene",
    github: "https://github.com/paras999000/CyberForensics_Evidence_Vault",
    metrics: [
      { label: "Standard", value: "ISO/IEC 27037:2012" },
      { label: "Hash Protocol", value: "FIPS 180-4 SHA-256" },
      { label: "Integrity", value: "100% Bit-Stream Verified" },
      { label: "Audit Ledger", value: "WORM Immutable Log" }
    ],
    caseStudy: {
      overview: "CyberForensics Evidence Vault is a Digital Forensics and Incident Response (DFIR) platform engineered to guarantee legal admissibility, mathematical integrity, and cryptographic preservation of recovered digital evidence under ISO/IEC 27037:2012 and Federal Rules of Evidence (FRE) Rule 901(b)(9). Also addresses the system security audit trail logging repository.",
      problem: "Digital evidence in incident investigations is frequently contested due to broken chains of custody, file extension spoofing, unverified timestamps, and unauthorized write modifications during triage.",
      concept: "Construct an uncompromised chain of custody: EVENT LOGGING → CRYPTOGRAPHIC INGESTION → WORM IMMUTABLE LEDGER → HEX/MAGIC BYTE DISSECTION → COURT-ADMISSIBLE CERTIFICATION.",
      conceptFlow: [
        { step: "01", label: "INCIDENT SEIZURE", detail: "Capture bit-stream evidence from Canon EOS 1200D sensors across isolated sessions" },
        { step: "02", label: "CRYPTOGRAPHIC HASH", detail: "Zero-upload client-side FIPS 180-4 SHA-256 computation in browser memory via Web Crypto API" },
        { step: "03", label: "WORM LEDGER ENTRY", detail: "Append immutable chronological record to Forensic_Audit_Log.csv with ISO timestamps" },
        { step: "04", label: "FORENSIC DISSECTION", detail: "Inspect binary markers (0xFFD8FFE1) and EXIF metadata to prevent extension spoofing" },
        { step: "05", label: "LEGAL CERTIFICATION", detail: "Generate court-admissible certificate of authenticity with digital seals and examiner signoff" }
      ],
      architecture: {
        pipeline: [
          "Bit-Stream Evidence Acquisition (RAW/JPEG)",
          "In-Browser Web Crypto SHA-256 Digesting",
          "WORM Audit Log (Forensic_Audit_Log.csv)",
          "Binary Magic Byte Dissection (Offset 00000000)",
          "Python CLI Terminal Verification Engine"
        ],
        details: "Dual-tier verification architecture: web dashboard for client-side cryptographic hashing with zero server-side exposure, combined with a standalone Python CLI tool (forensic_vault.py) for automated terminal verification against the canonical audit ledger.",
        subsystems: [
          { layer: "INGESTION TIER", technologies: "Web Crypto API, File API", role: "Hardware-accelerated SHA-256 hashing without network transit" },
          { layer: "AUDIT LEDGER", technologies: "WORM CSV, JSON Manifest", role: "Write-Once-Read-Many chronological chain-of-custody tracking" },
          { layer: "ANALYSIS ENGINE", technologies: "EXIF Parser, Hex Dissector", role: "Header signature validation, shutter/camera telemetry extraction" },
          { layer: "CLI VERIFIER", technologies: "Python 3, hashlib, argparse", role: "Automated batch integrity audits and terminal reporting" },
          { layer: "ATTESTATION", technologies: "HTML5 Canvas, Print CSS", role: "Court-admissible certificate generation compliant with FRE 901(b)(9)" }
        ]
      },
      hardware: [
        { component: "Canon EOS 1200D", role: "Acquisition Sensor", spec: "18.0 Megapixel CMOS sensor, DIGIC 4 processor, CR2 RAW/JPEG bitstream" },
        { component: "Hardware Crypto Accelerator", role: "Client Processor", spec: "Browser Web Crypto API hardware-accelerated SHA-256 execution" }
      ],
      software: [
        { stack: "Python 3 / hashlib / argparse", category: "Systems", details: "Stand-alone CLI verification engine (forensic_vault.py --verify)." },
        { stack: "Web Crypto API", category: "AI / Protocol", details: "Zero-upload in-browser cryptographic hashing preventing evidence leak." },
        { stack: "EXIF & Magic Byte Dissector", category: "Firmware", details: "Binary validation verifying SOI (FF D8) and APP1 (FF E1) markers." },
        { stack: "Vanilla ES6+ & Glassmorphic CSS", category: "Frontend", details: "Operations HUD, live hash verifier, and audit timeline explorer." }
      ],
      implementation: "Implemented as a production DFIR cockpit containing real 18MP forensic exhibits (recovered_evidence_550_1.jpg, 230_1.jpg, 989_1.jpg) verified against Forensic_Audit_Log.csv with zero tampering.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "EVIDENCE ISOLATION", action: "Partitioned evidence into isolated session enclaves with cryptographic manifests" },
        { phase: "PHASE 02", name: "CLI AUDIT SCRIPT", action: "Authored forensic_vault.py with --verify and --serve flags for rapid terminal triage" },
        { phase: "PHASE 03", name: "WEB OPERATIONS HUD", action: "Engineered high-tech glassmorphic operations dashboard with live hex inspection" },
        { phase: "PHASE 04", name: "LEGAL ATTESTATION", action: "Integrated automated certificate generation compliant with digital evidence standards" }
      ],
      challenges: [
        {
          title: "Browser Memory Exhaustion on 18MP Images",
          context: "Hashing multi-megabyte high-resolution image files in JavaScript can cause browser tab stutter.",
          mitigation: "Utilized chunked streaming FileReader with Web Crypto subtle.digest in Web Worker context."
        },
        {
          title: "Extension Spoofing & Steganography",
          context: "Malicious actors often disguise executables or modified payloads by altering file extensions.",
          mitigation: "Integrated offset 00000000 magic byte analysis inspecting raw JPEG marker sequences."
        }
      ],
      result: {
        summary: "Successfully verifies 100% of forensic exhibits against canonical ledger digests with sub-second terminal verification and zero evidence tampering.",
        metrics: [
          { label: "Integrity Rate", value: "100% Bit-Stream Verified" },
          { label: "Evidence Size", value: "20.09 MB Real Exhibits" },
          { label: "Standard", value: "ISO/IEC 27037:2012" },
          { label: "Hash Speed", value: "< 140ms Client-Side" }
        ]
      }
    }
  },

  // =========================================================================
  // 06. MEDITRACE DIGITAL TWIN (MORE SYSTEMS #2)
  // =========================================================================
  {
    id: "meditrace",
    title: "MEDITRACE™ DIGITAL TWIN",
    subtitle: "Autonomous Pharmaceutical Cold-Chain IoT & Blockchain Provenance Platform",
    description: "An enterprise-grade IoT digital twin and immutable blockchain traceability platform engineered to eliminate pharmaceutical counterfeiting and safeguard cold-chain integrity.",
    category: "IoT × DIGITAL TWIN",
    technologies: ["React 19", "TypeScript", "Vite", "Leaflet Geo-Telemetry", "IoT Thermal Sensors (-70°C to +8°C)", "SHA-256 Merkle Ledger", "Smart Contracts"],
    featured: false,
    priority: 6,
    visualType: "3d",
    scene: "MediTraceScene",
    github: "https://github.com/paras999000/MediTrace",
    metrics: [
      { label: "Thermal Range", value: "-70°C to +8°C Active" },
      { label: "Ledger Standard", value: "SHA-256 Merkle Proofs" },
      { label: "Recall Latency", value: "< 45 Seconds Targeted" },
      { label: "Compliance", value: "FDA 21 CFR Part 11 / GDP" }
    ],
    caseStudy: {
      overview: "MediTrace is an enterprise-grade IoT digital twin and immutable blockchain traceability platform engineered to eliminate pharmaceutical counterfeiting, safeguard cold-chain integrity, and automate recall orchestration.",
      problem: "Over $35B is lost annually across the pharmaceutical industry from temperature excursions in cold chain shipping, while counterfeit drugs penetrate supply corridors lacking end-to-end cryptographic provenance.",
      concept: "Deploy an interconnected digital twin: MULTI-ZONE IoT LOGGERS → REAL-TIME INGESTION GATEWAY → DIGITAL TWIN SIMULATION ENGINE → MERKLE BLOCKCHAIN PROVENANCE → TARGETED RECALL COMMAND.",
      conceptFlow: [
        { step: "01", label: "IoT TELEMETRICS", detail: "Active logging of -70°C to +8°C temperatures, relative humidity, vibration, and GPS coordinates" },
        { step: "02", label: "GATEWAY VALIDATION", detail: "Cryptographic signature validation and sensor dropout detection at the streaming edge" },
        { step: "03", label: "DIGITAL TWIN REPLICATION", detail: "Real-time state mirroring, thermal degradation modeling, and FEFO inventory tracking" },
        { step: "04", label: "SMART CONTRACT TRIGGER", detail: "Automated quarantine initiated immediately upon temperature excursion threshold violation" },
        { step: "05", label: "PROVENANCE ATTESTATION", detail: "Immutable SHA-256 Merkle block generation and 2D DataMatrix packaging authentication" }
      ],
      architecture: {
        pipeline: [
          "Multi-Sensor Loggers (BLE / Cellular / LoRaWAN)",
          "IoT Telemetry Ingestion & Schema Validation",
          "Digital Twin Engine & FEFO Degradation Analyzer",
          "SHA-256 Merkle Distributed Ledger & Smart Contracts",
          "Leaflet Geospatial Fleet Visualizer & Control Tower"
        ],
        details: "Full-stack enterprise digital twin architecture pairing React 19 concurrent frontend with Leaflet geospatial tracking, dynamic 'What-If' Monte Carlo simulation models, and automated FDA 21 CFR Part 11 compliance tracking.",
        subsystems: [
          { layer: "EDGE SENSING", technologies: "Multi-Sensor IoT Loggers, BLE, GPS", role: "Continuous telematics from cryogenic storage units" },
          { layer: "INGESTION LAYER", technologies: "Schema Validator, Time-Series Streamer", role: "Telemetry normalization and signature verification" },
          { layer: "DIGITAL TWIN ENGINE", technologies: "FEFO Degradation Model, Monte Carlo", role: "Virtual simulation of batch shelf-life degradation" },
          { layer: "IMMUTABLE LEDGER", technologies: "SHA-256 Merkle Tree, Smart Contracts", role: "Cryptographic custody proofs and automated quarantine" },
          { layer: "CONTROL TOWER", technologies: "React 19, Leaflet, Recharts, Tailwind CSS", role: "Interactive geospatial fleet tracking and incident SOC" }
        ]
      },
      hardware: [
        { component: "Multi-Zone Thermal Loggers", role: "Cold-Chain Sensor", spec: "-70°C to +8°C calibrated RTD probes, ±0.1°C precision" },
        { component: "Telematics GPS/Cellular Node", role: "Fleet Transceiver", spec: "Quad-band cellular modem, GPS/GLONASS positioning, 10-minute cadence" }
      ],
      software: [
        { stack: "React 19 / TypeScript 5.8", category: "Frontend", details: "Concurrent rendering dashboard with sub-millisecond reactive state." },
        { stack: "Leaflet / OpenStreetMap", category: "Systems", details: "Interactive geospatial transport corridor visualization." },
        { stack: "SHA-256 Merkle Provenance Core", category: "AI / Protocol", details: "Cryptographic block hashing and tamper-evident custody verification." },
        { stack: "What-If Simulation Engine", category: "Backend", details: "Predictive disruption stress-testing for port closures and heatwaves." }
      ],
      implementation: "Engineered with 14 modular sub-interfaces including Control Tower, Supply Network Map, Batch Traceability, FEFO Inventory, Blockchain Ledger, Datamatrix Scanner, and Simulation Lab.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "TELEMETRY MODELING", action: "Defined multi-sensor data schemas for cryogenic biologics and mRNA vaccines" },
        { phase: "PHASE 02", name: "GEOSPATIAL FLEET TRACKING", action: "Integrated Leaflet map visualizer rendering global transport corridors and container nodes" },
        { phase: "PHASE 03", name: "SMART CONTRACT AUTOMATION", action: "Built automated quarantine rules triggered on thermal threshold excursion" },
        { phase: "PHASE 04", name: "STRESS-TEST LAB", action: "Designed simulation workbench for injecting synthetic sensor shocks and thermal spikes" }
      ],
      challenges: [
        {
          title: "Cold-Chain Thermal Excursion Detection",
          context: "Minor transient temperature spikes must be differentiated from prolonged critical spoilage.",
          mitigation: "Developed cumulative thermal kinetic degradation algorithms based on Arrhenius shelf-life models."
        },
        {
          title: "Cross-Corridor Latency in Reverse Logistics",
          context: "Traditional recall processes take days to identify compromised batch locations across retail points.",
          mitigation: "Implemented reverse supply-chain indexing capable of identifying tainted SKUs within 45 seconds."
        }
      ],
      result: {
        summary: "Built a complete 14-module pharmaceutical control tower digital twin with sub-second UI updates, cryptographic Merkle proofs, and interactive geospatial mapping.",
        metrics: [
          { label: "Recall Isolation", value: "< 45 Seconds" },
          { label: "Active Modules", value: "14 Production Views" },
          { label: "React Version", value: "React 19.0.0" },
          { label: "Ledger Standard", value: "SHA-256 Merkle Tree" }
        ]
      }
    }
  },

  // =========================================================================
  // 07. DEPLOYHUB (MORE SYSTEMS #3)
  // =========================================================================
  {
    id: "deployhub",
    title: "DEPLOYHUB",
    subtitle: "Self-Hosted Ubuntu Server, Host Docker Socket Engine & Sandboxed NAS Platform",
    description: "A production-grade personal server deployment and operations platform communicating directly with /var/run/docker.sock, allocating collision-free ports 3001-3999, and managing sandboxed storage.",
    category: "SYSTEMS × DEVOPS",
    technologies: ["Next.js 16 App Router", "Docker Engine API (dockerode)", "better-sqlite3 WAL", "Monaco Editor", "Tailwind CSS v4", "Caddy Reverse Proxy"],
    featured: false,
    priority: 7,
    visualType: "3d",
    scene: "DeployHubScene",
    github: "https://github.com/paras999000/Deployhub",
    metrics: [
      { label: "Engine Integration", value: "/var/run/docker.sock Direct" },
      { label: "Port Range", value: ":3001 - :3999 Auto-Allocated" },
      { label: "Database", value: "better-sqlite3 WAL Mode" },
      { label: "Storage Root", value: "/srv/storage Strict Sandbox" }
    ],
    caseStudy: {
      overview: "DeployHub is a production-grade personal server deployment and operations platform engineered for self-hosted Ubuntu infrastructure, managing host Docker containers, sandboxed NAS storage, and live telemetry.",
      problem: "Managing self-hosted services via raw SSH terminal commands creates port allocation collisions, security risks with un-sandboxed root directories, and lack of real-time container log visibility.",
      concept: "Direct socket orchestration: BROWSER DASHBOARD → NEXT.JS ROUTE HANDLERS → DOCKERODE SOCKET API → HOST DOCKER ENGINE → LIVE CONTAINER RUNTIME & NAS.",
      conceptFlow: [
        { step: "01", label: "ARCHIVE INGESTION", detail: "Drag-and-drop zip upload with Zip-Slip path traversal protection into /srv/storage/projects/" },
        { step: "02", label: "FRAMEWORK DETECTION", detail: "Automatic code inspection identifying Next.js, Vite, or Node.js with dynamic Dockerfile synthesis" },
        { step: "03", label: "PORT ALLOCATION", detail: "Conflict-free port scanning assigning unoccupied TCP ports between 3001 and 3999" },
        { step: "04", label: "DOCKER ENGINE BUILD", detail: "Direct socket communication via /var/run/docker.sock with ANSI-styled streaming build terminal" },
        { step: "05", label: "LIFECYCLE MANAGEMENT", detail: "Real-time container start/stop/restart, health probes, and Monaco Editor config adjustment" }
      ],
      architecture: {
        pipeline: [
          "Web UI (Next.js 16 App Router & React 19)",
          "Next.js Route Handlers & Auth (bcryptjs / JWT)",
          "Docker Socket Engine (dockerode -> /var/run/docker.sock)",
          "Database Layer (better-sqlite3 WAL Mode)",
          "Storage Sandbox (/srv/storage & Windows Samba Share)"
        ],
        details: "Zero-dependency deployment server running directly on Ubuntu Linux, interacting with the host Docker daemon via Unix domain socket with bidirectional Samba network share synergy.",
        subsystems: [
          { layer: "ORCHESTRATION", technologies: "dockerode, Docker Socket API", role: "Container start/stop, log streaming, and port binding" },
          { layer: "DEPLOYMENT PIPELINE", technologies: "adm-zip, Dynamic Dockerfile Synthesis", role: "Zip-Slip protected extraction and containerized builds" },
          { layer: "DATABASE", technologies: "better-sqlite3, WAL Journal", role: "Sub-millisecond synchronous state tracking and port allocations" },
          { layer: "STORAGE ENGINE", technologies: "fs.statfs, Samba /srv/storage", role: "Strictly sandboxed multi-directory NAS file management" },
          { layer: "DEVELOPER TOOLS", technologies: "Monaco Editor, ANSI Terminal Log", role: "Browser-based code editing and live log streams" }
        ]
      },
      hardware: [
        { component: "Ubuntu Server Host", role: "Hardware Platform", spec: "x86_64 / ARM64 Linux, NVMe storage, multi-core CPU" },
        { component: "Docker Engine Daemon", role: "Container Runtime", spec: "Direct socket binding at /var/run/docker.sock" }
      ],
      software: [
        { stack: "Next.js 16 / React 19 / Tailwind v4", category: "Frontend", details: "App router, React 19 server actions, modern frosted-glass HUD." },
        { stack: "dockerode (Unix Domain Socket)", category: "Systems", details: "Native Docker socket client communicating with container daemon." },
        { stack: "better-sqlite3 (WAL Mode)", category: "Backend", details: "Ultra-fast local database storing project configurations." },
        { stack: "Monaco Editor (@monaco-editor/react)", category: "Systems", details: "Full VS Code editor for direct Caddyfile and Dockerfile editing." }
      ],
      implementation: "Includes 9 complete management modules: Operations Dashboard, Project Management, Deployment Pipeline, Docker Containers, Sandboxed NAS, Monaco Editor, Live Logs, Host Diagnostics, and Settings.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "DOCKER SOCKET BRIDGE", action: "Established secure Unix socket integration via dockerode to inspect host containers" },
        { phase: "PHASE 02", name: "PORT COLLISION ENGINE", action: "Wrote port allocation algorithm scanning active sockets to bind free ports 3001-3999" },
        { phase: "PHASE 03", name: "STORAGE SANDBOX", action: "Built path resolution layer preventing traversal outside /srv/storage with Samba synergy" },
        { phase: "PHASE 04", name: "MONACO EDITOR INTEGRATION", action: "Integrated embedded code editor for real-time config updates without SSH" }
      ],
      challenges: [
        {
          title: "Zip-Slip Path Traversal Vulnerabilities",
          context: "Arbitrary zip extractions can exploit malicious relative paths (../../etc/cron) to overwrite system files.",
          mitigation: "Implemented strict sanitized path resolution ensuring all extraction targets reside inside /srv/storage/projects."
        },
        {
          title: "Dynamic Port Collision Prevention",
          context: "Running multiple containerized services simultaneously frequently results in port bind conflicts.",
          mitigation: "Implemented tripartite port scanning: checking SQLite records, active Docker bindings, and OS TCP sockets."
        }
      ],
      result: {
        summary: "Built a fully functional self-hosted server operations platform with direct Docker daemon control, sandboxed NAS storage, and zero-downtime deployment workflows.",
        metrics: [
          { label: "Deployment Speed", value: "< 35s From Zip to Live" },
          { label: "Host Socket", value: "/var/run/docker.sock" },
          { label: "Port Range", value: "3001-3999 Protected" },
          { label: "Database Read", value: "< 0.8ms SQLite WAL" }
        ]
      }
    }
  },

  // =========================================================================
  // 08. VERISIGHT NX (MORE SYSTEMS #4)
  // =========================================================================
  {
    id: "verisight-nx",
    title: "VERISIGHT NX",
    subtitle: "Autonomous Fraud Intelligence & Tactical Field Investigation Operating System",
    description: "An enterprise cyber-forensics and fraud ring detection cockpit featuring interactive entity link graphing, live threat stream decrypters, and tactical geospatial radar.",
    category: "CYBERSECURITY × AI",
    technologies: ["Next.js 16", "React 19", "Three.js WebGL", "Recharts", "Interactive Entity Graph", "Threat Decryptor", "Biometric Multi-Factor"],
    featured: false,
    priority: 8,
    visualType: "3d",
    scene: "VeriSightScene",
    github: "https://github.com/paras999000/VeriSightNX",
    metrics: [
      { label: "Clearance Level", value: "Level 5 Classified" },
      { label: "Framework", value: "Next.js 16.2.9 App Router" },
      { label: "UI Engine", value: "React 19.2.4 + Three.js" },
      { label: "Styling", value: "Tailwind CSS v4.0" }
    ],
    caseStudy: {
      overview: "VeriSight NX is an enterprise cyber-forensics and fraud ring detection cockpit engineered for intelligence agencies, financial institutions, and cyber response task forces with real-time entity graphing and neural threat triage.",
      problem: "Financial fraud networks operate across distributed SWIFT routers and mule accounts that are nearly impossible to detect with static tabular reporting tools, leading to delayed incident response.",
      concept: "Interactive visual intelligence: BIOMETRIC CLEARANCE → REAL-TIME ENTITY GRAPH → THREAT DECRYPTION STREAM → CLASSIFIED EVIDENCE VAULT → TACTICAL GEOSPATIAL RADAR.",
      conceptFlow: [
        { step: "01", label: "BIOMETRIC AUTHENTICATION", detail: "3D interactive WebGL particle matrix gate with multi-factor clearance token ingestion" },
        { step: "02", label: "DYNAMIC GRAPH VISUALIZATION", detail: "HTML5 Canvas physics engine rendering interconnected compromised servers and SWIFT endpoints" },
        { step: "03", label: "THREAT DECRYPTION STREAM", detail: "Live intrusion log decrypter calculating anomaly probability scores and IP isolation rules" },
        { step: "04", label: "CLASSIFIED EVIDENCE VAULT", detail: "Cold-storage evidence management with SHA-256 verification and optical feed inspections" },
        { step: "05", label: "TACTICAL RADAR", detail: "Field operative GPS telemetry, live biometric vitals, and multi-point geofence containment" }
      ],
      architecture: {
        pipeline: [
          "Biometric Authentication Gateway (Three.js Particle Canvas)",
          "AI Command Center (Dynamic Entity Link Graph)",
          "Fraud Intelligence Stream (Real-Time Anomaly Scoring)",
          "Classified Evidence Vault (SHA-256 Custody Ledger)",
          "Tactical Field Radar (Geofence & Operative Telemetry)"
        ],
        details: "Next.js 16 application featuring concurrent React 19 rendering, Framer Motion transitions, interactive Three.js WebGL particle matrices, and high-performance Recharts telemetry curves.",
        subsystems: [
          { layer: "AUTH GATEWAY", technologies: "Three.js, Biometric Scanner", role: "Simulated multi-factor clearance barrier and token verification" },
          { layer: "ENTITY GRAPH", technologies: "HTML5 Canvas, Dynamic Physics", role: "Interactive node manipulation of compromised banking hops" },
          { layer: "THREAT ENGINE", technologies: "Recharts, Stream Decryptor", role: "Real-time threat velocity analytics and anomaly isolation" },
          { layer: "EVIDENCE VAULT", technologies: "SHA-256 Checksums, File API", role: "Tamper-evident forensic artifact analysis" },
          { layer: "FIELD COORDINATION", technologies: "Geofence Radar, Operative Vitals", role: "Real-time tactical team positioning and health telemetry" }
        ]
      },
      hardware: [
        { component: "Biometric Hardware Simulator", role: "Clearance Verification", spec: "Interactive multi-factor fingerprint and cryptographic token gate" },
        { component: "Field Operative Telematics", role: "Tactical Unit Tracking", spec: "GPS coordinate broadcast with simulated biometric vitals monitoring" }
      ],
      software: [
        { stack: "Next.js 16 / React 19", category: "Frontend", details: "App Router with Turbopack and latest React 19 actions." },
        { stack: "Three.js / WebGL", category: "AI / Protocol", details: "Particle wave simulation for biometric clearance gate." },
        { stack: "Tailwind CSS v4 / Framer Motion", category: "Frontend", details: "Custom @theme tokens with cyber dark HUD aesthetics." },
        { stack: "Recharts 3", category: "Systems", details: "Real-time threat velocity analytics and velocity metrics." }
      ],
      implementation: "Includes 4 mission-critical modules: Autonomous AI Command Center, Classified Evidence Vault, Fraud Intelligence Decryptor, and Investigator Tactical Radar.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "BIOMETRIC PORTAL", action: "Constructed interactive Three.js particle matrix with simulated token clearance" },
        { phase: "PHASE 02", name: "INTERACTIVE NODE GRAPH", action: "Engineered canvas physics simulation linking entities, rogue gateways, and flagged transactions" },
        { phase: "PHASE 03", name: "STREAM DECRYPTOR", action: "Built live terminal stream with automated intrusion signature analysis" },
        { phase: "PHASE 04", name: "TACTICAL RADAR", action: "Implemented radar sweep with geofenced boundaries and operative status monitoring" }
      ],
      challenges: [
        {
          title: "Real-Time Node Graph Physics Performance",
          context: "Rendering dozens of interconnected nodes with live dragging and animated links can cause frame drops.",
          mitigation: "Utilized lightweight custom HTML5 Canvas rendering loop with spatial partitioning."
        },
        {
          title: "High-Density HUD Responsiveness",
          context: "Military-grade multi-pane cockpits risk visual clutter on varying screen resolutions.",
          mitigation: "Architected modular glassmorphic dock system with collapsible sidebars and responsive view states."
        }
      ],
      result: {
        summary: "Delivered a responsive cyber-forensic investigation operating system with dynamic node graphing, cold-storage evidence verification, and tactical radar.",
        metrics: [
          { label: "Clearance Level", value: "Level 5 Classified" },
          { label: "Graph Entities", value: "40+ Nodes Physics-Linked" },
          { label: "Frame Rate", value: "Solid 60 FPS WebGL" },
          { label: "Theme Support", value: "Dual HUD (Dark / Light)" }
        ]
      }
    }
  },

  // =========================================================================
  // 09. SMART CROP RECOMMENDATION SYSTEM (MORE SYSTEMS #5)
  // =========================================================================
  {
    id: "crop-recommendation",
    title: "SMART CROP RECOMMENDATION SYSTEM",
    subtitle: "IoT Precision Agriculture & Autonomous Agronomic Telemetry System",
    description: "An end-to-end Smart Agriculture system collecting real-time soil and ambient parameters via ESP8266, streaming to ThingSpeak cloud, and evaluating crops with automated decision algorithms.",
    category: "IoT × EMBEDDED SYSTEMS",
    technologies: ["ESP8266 NodeMCU", "DHT11/DHT22", "Capacitive Soil Probe", "Rain Detection Module", "ThingSpeak IoT Cloud", "C++ / Arduino"],
    featured: false,
    priority: 9,
    visualType: "3d",
    scene: "CropSystemScene",
    github: "https://github.com/paras999000/crop-recommendation-system",
    metrics: [
      { label: "Microcontroller", value: "ESP8266 NodeMCU Wi-Fi" },
      { label: "Sensors", value: "DHT11/22 + Soil Moisture + Rain" },
      { label: "IoT Cloud", value: "ThingSpeak REST API" },
      { label: "Crops Evaluated", value: "9 Agronomic Classes" }
    ],
    caseStudy: {
      overview: "An end-to-end Smart Agriculture and Precision Farming system collecting real-time environmental metrics through an ESP8266 node, streaming to ThingSpeak Cloud, and evaluating soil parameters with automated agronomic algorithms.",
      problem: "Smallholder farmers often make crop planting decisions based on guesswork or historical habit without real-time soil moisture, rainfall probability, or ambient microclimate data, leading to crop failure.",
      concept: "Continuous agro-sensing: PHYSICAL SENSOR NODE → ESP8266 EDGE COMPUTE → THINGSPEAK REST API → DECISION MATRIX → WEB DASHBOARD CROP RECOMMENDATION.",
      conceptFlow: [
        { step: "01", label: "ENVIRONMENTAL SENSING", detail: "Capacitive soil moisture probe on A0, DHT sensor on D4, and precipitation detector on D2" },
        { step: "02", label: "EDGE INGESTION", detail: "ESP8266 converts raw ADC values into percentage moisture and celsius temperature metrics" },
        { step: "03", label: "CLOUD TIME-SERIES", detail: "Periodic HTTP GET dispatch to ThingSpeak REST API updating fields 1 through 5" },
        { step: "04", label: "AGRONOMIC DECISION", detail: "Rule-based agro-matrix evaluates environmental ranges to predict optimal crop (Rice, Wheat, Cotton, etc.)" },
        { step: "05", label: "FARMER DASHBOARD", detail: "Responsive glassmorphic web dashboard with real-time status gauges and micro-animations" }
      ],
      architecture: {
        pipeline: [
          "Sensor Probe Array (Capacitive Moisture, DHT11/22, Rain Module)",
          "ESP8266 Embedded Firmware (Arduino C++)",
          "ThingSpeak IoT Cloud Time-Series Channel",
          "Agronomic Parameter Decision Matrix",
          "Vanilla Web Dashboard (HTML5 / CSS3 / JavaScript)"
        ],
        details: "Physical hardware deployed and tested in agricultural field environments, powered by 5V DC micro-USB, communicating over 2.4GHz 802.11 b/g/n Wi-Fi directly to cloud time-series channels.",
        subsystems: [
          { layer: "HARDWARE SENSORS", technologies: "Capacitive Soil Probe, DHT11, Rain Module", role: "Continuous multi-parameter environmental sampling" },
          { layer: "EMBEDDED CONTROLLER", technologies: "ESP8266 NodeMCU, Arduino C++", role: "Analog-to-digital conversion and Wi-Fi packet dispatch" },
          { layer: "IoT CLOUD", technologies: "ThingSpeak REST API", role: "Persistent time-series data logging and channel indexing" },
          { layer: "AGRONOMIC ENGINE", technologies: "Parametric Decision Trees", role: "Matching climate envelopes against 9 agricultural crops" },
          { layer: "FARMER INTERFACE", technologies: "HTML5, CSS3 Glassmorphism, JavaScript", role: "Live telemetry dials and crop suitability visualization" }
        ]
      },
      hardware: [
        { component: "ESP8266 NodeMCU", role: "Edge Controller", spec: "Tensilica L106 32-bit @ 80MHz, integrated 802.11 b/g/n Wi-Fi" },
        { component: "DHT11 / DHT22", role: "Atmospheric Sensor", spec: "Temperature range 0-50°C (±2°C), Humidity 20-90% RH (±5%)" },
        { component: "Capacitive Soil Moisture Probe", role: "Soil Sensor", spec: "Corrosion-resistant analog output (ADC0), 0-100% volumetric moisture" },
        { component: "Rain Detection Sensor", role: "Precipitation Detector", spec: "Nickel-plated sensing board with LM393 comparator digital trigger" }
      ],
      software: [
        { stack: "Arduino C / C++", category: "Firmware", details: "ESP8266 sketch managing Wi-Fi reconnects and sensor polling intervals." },
        { stack: "ThingSpeak REST API", category: "Backend", details: "HTTP GET endpoints updating fields 1-5 for time-series aggregation." },
        { stack: "Vanilla HTML5 / CSS3 / JS", category: "Frontend", details: "Zero-dependency glassmorphic dashboard with live data polling." }
      ],
      implementation: "Verified through both benchtop electronics lab testing and on-site agricultural testing in active farm plots with real soil.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "BREADBOARD PROTOTYPE", action: "Wired sensors to ESP8266 GPIO pins with pull-ups and calibrated analog ranges" },
        { phase: "PHASE 02", name: "FIRMWARE DEVELOPMENT", action: "Implemented Arduino sketch managing sensor debouncing and ThingSpeak updates" },
        { phase: "PHASE 03", name: "DASHBOARD CREATION", action: "Crafted glassmorphic web interface showing real-time gauge metrics" },
        { phase: "PHASE 04", name: "FIELD DEPLOYMENT", action: "Tested portable battery-powered node on active farm soil to verify telemetry" }
      ],
      challenges: [
        {
          title: "Sensor Corrosion with Resistive Probes",
          context: "Standard resistive soil sensors corrode rapidly when subjected to DC bias current in moist soil.",
          mitigation: "Migrated to capacitive soil moisture probes with isolated traces to eliminate electrolytic degradation."
        },
        {
          title: "Intermittent Rural Wi-Fi Connectivity",
          context: "Farm deployment sites often experience fluctuating signal strength leading to packet drops.",
          mitigation: "Implemented automated Wi-Fi reconnect routines and sensor value retention in firmware memory."
        }
      ],
      result: {
        summary: "Built and deployed an operational IoT precision agriculture telemetry node with automated crop classification and responsive web dashboard.",
        metrics: [
          { label: "Update Cadence", value: "15s ThingSpeak Polling" },
          { label: "Operating Voltage", value: "3.3V / 5V DC Supply" },
          { label: "Wi-Fi Protocol", value: "802.11 b/g/n (2.4 GHz)" },
          { label: "Field Test Status", value: "Verified in Farm Plots" }
        ]
      }
    }
  },

  // =========================================================================
  // 10. VOICE AI ROUTE FINDER (MORE SYSTEMS #6)
  // =========================================================================
  {
    id: "voice-ai-route-finder",
    title: "VOICE AI ROUTE FINDER",
    subtitle: "Multimodal Voice Assistant & Graph Heuristic Navigation Sandbox",
    description: "An intelligent multimodal AI system combining in-browser voice command recognition with graph-based heuristic search algorithms (A* and Greedy Best-First Search) across traffic networks.",
    category: "AI × ALGORITHMS",
    technologies: ["Python", "Flask", "Google Speech API", "Web Audio API", "A* Search", "Greedy Best-First Search", "HTML5 Canvas"],
    featured: false,
    priority: 10,
    visualType: "3d",
    scene: "VoiceRouteScene",
    github: "https://github.com/paras999000/voice-ai-route-finder",
    metrics: [
      { label: "Audio Transcoding", value: "Client 16kHz PCM WAV" },
      { label: "Search Engines", value: "A* (Optimal) vs Greedy BFS" },
      { label: "Timing Precision", value: "Microsecond (perf_counter)" },
      { label: "Traffic Multiplier", value: "1.0x to 2.5x Dynamic" }
    ],
    caseStudy: {
      overview: "A multimodal AI system combining in-browser real-time Voice Command Processing with Graph-Based Heuristic Search Algorithms (A* & Greedy Best-First Search) across dynamically generated road networks.",
      problem: "Existing pathfinding demos lack conversational voice control, while traditional voice bots run heavy server-side ffmpeg pipelines for audio transcoding, causing significant latency.",
      concept: "Hands-free heuristic navigation: CLIENT-SIDE PCM TRANSCODING → GOOGLE SPEECH NLP → INTENT PARSING → DUAL HEURISTIC SEARCH ENGINES → STEP-BY-STEP CANVAS ANIMATION.",
      conceptFlow: [
        { step: "01", label: "MICROPHONE AUDIO", detail: "Captures natural voice spoken into browser microphone ('Find route from Node 3 to Node 12')" },
        { step: "02", label: "IN-BROWSER TRANSCODING", detail: "Converts raw audio blobs into 16kHz 16-bit Mono WAV via Web Audio API without ffmpeg" },
        { step: "03", label: "SPEECH RECOGNITION", detail: "Flask backend dispatches audio to Google Speech Recognition API for intent extraction" },
        { step: "04", label: "HEURISTIC DISCOVERY", detail: "Runs both A* Search (f=g+h) and Greedy Best-First Search (f=h) across weighted road graph" },
        { step: "05", label: "DYNAMIC ANIMATION", detail: "Visualizes node expansions, highway weights, and real-time execution timing on canvas" }
      ],
      architecture: {
        pipeline: [
          "In-Browser Web Audio API (16kHz PCM WAV Transcoding)",
          "Flask REST API Backend (Port 5000 & 8080)",
          "Google Speech Recognition API Client",
          "Heuristic Pathfinding Engine (A* vs Greedy BFS)",
          "Interactive HTML5 Canvas Graph Renderer"
        ],
        details: "Two modular components: voice_assistant/ providing natural speech routing commands, and route_finder/ providing mathematical algorithmic benchmarking with simulated traffic impedance.",
        subsystems: [
          { layer: "AUDIO TRANSCODING", technologies: "Web Audio API, AudioContext", role: "In-memory raw PCM blob to WAV transcoding" },
          { layer: "SPEECH NLP", technologies: "Google Speech API, Python SpeechRecognition", role: "Acoustic speech transcription and routing intent parsing" },
          { layer: "HEURISTIC SEARCH", technologies: "Python Heuristic Graph, PriorityQueue", role: "Execution of A* Search and Greedy Best-First Search" },
          { layer: "TRAFFIC SIMULATOR", technologies: "Weighted Graphs, Dynamic Impedance", role: "Procedural road networks with 1.0x-2.5x traffic penalties" },
          { layer: "CANVAS VISUALIZER", technologies: "HTML5 Canvas, RequestAnimationFrame", role: "Step-by-step node expansion and path animation" }
        ]
      },
      hardware: [
        { component: "Acoustic Transducer", role: "Microphone Input", spec: "Omnidirectional microphone stream captured via Web Audio API" }
      ],
      software: [
        { stack: "Python 3.8+ / Flask 3.0", category: "Backend", details: "REST API endpoints handling audio payloads and pathfinding queries." },
        { stack: "Google Speech Recognition", category: "AI / Protocol", details: "Natural language transcription of spoken navigation commands." },
        { stack: "A* & Greedy BFS Algorithms", category: "Systems", details: "Euclidean distance heuristics balancing path cost against traversal speed." },
        { stack: "HTML5 Canvas / Vanilla JS", category: "Frontend", details: "Dynamic vector graph rendering with animated node expansions." }
      ],
      implementation: "Fully implemented with two runnable modules: voice_assistant/ and route_finder/ with dark-mode glassmorphic styling and live execution metrics.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "ALGORITHM ENGINE", action: "Coded A* and Greedy Best-First search with Euclidean heuristic distance functions" },
        { phase: "PHASE 02", name: "WEB AUDIO PIPELINE", action: "Implemented in-browser WAV encoding to eliminate server-side audio conversion" },
        { phase: "PHASE 03", name: "VOICE INTENT INTEGRATION", action: "Connected Google Speech API with regex intent extraction for route commands" },
        { phase: "PHASE 04", name: "BENCHMARKING VISUALIZER", action: "Designed canvas animator comparing execution times and nodes expanded" }
      ],
      challenges: [
        {
          title: "Server-Side FFmpeg Audio Latency",
          context: "Uploading raw audio blobs to a server for ffmpeg transcoding adds hundreds of milliseconds of overhead.",
          mitigation: "Wrote client-side JavaScript audio buffer processing converting Float32Array directly into 16kHz 16-bit PCM WAV."
        },
        {
          title: "Suboptimal Routes in Greedy Search",
          context: "Greedy Best-First Search aggressively targets destinations and often takes detour-heavy paths.",
          mitigation: "Rendered comparative side-by-side benchmarking visually proving A* mathematical optimality."
        }
      ],
      result: {
        summary: "Successfully demonstrates multimodal voice-driven route discovery with sub-20ms pathfinding execution and zero server audio transcoding overhead.",
        metrics: [
          { label: "Search Latency", value: "< 18ms Execution" },
          { label: "Audio Sampling", value: "16kHz 16-bit Mono" },
          { label: "Optimality", value: "100% Guaranteed on A*" },
          { label: "Transcoder Overhead", value: "0ms Server-Side" }
        ]
      }
    }
  },

  // =========================================================================
  // 11. AR-MINE SPATIAL VISUALIZATION (MORE SYSTEMS #7)
  // =========================================================================
  {
    id: "ar-mine",
    title: "AR-MINE SPATIAL VISUALIZATION",
    subtitle: "Augmented Reality Underground Mine Modeling & Procedural Spatial Anchoring",
    description: "An AR spatial computing application developed in Unity 6 utilizing AR Foundation and ARCore for SLAM plane tracking and 1:1 true-scale spatial anchoring of procedural underground mine tunnels.",
    category: "AR × 3D GRAPHICS",
    technologies: ["Unity 6", "AR Foundation", "ARCore", "Wolfram Language", "C#", "Procedural Mesh Generation", "XR Spatial Tracking"],
    featured: false,
    priority: 11,
    visualType: "3d",
    scene: "ARMineScene",
    github: "https://github.com/paras999000/AR-Mine",
    metrics: [
      { label: "Engine", value: "Unity 6 (6000.6.0f1)" },
      { label: "AR Stack", value: "AR Foundation 6.x / ARCore" },
      { label: "Mesh Generation", value: "Procedural Tunnel Geometry" },
      { label: "Scale Fidelity", value: "1:1 True-Scale Spatial Anchor" }
    ],
    caseStudy: {
      overview: "An Augmented Reality spatial computing system engineered in Unity 6 for real-time environment scanning, horizontal plane detection, and 1:1 true-scale spatial placement of procedural underground mine tunnel geometry.",
      problem: "Underground mine workings are complex 3D non-Euclidean environments that cannot be effectively planned or visualized through traditional 2D technical drawings.",
      concept: "Spatial environment anchoring: ARCORE SLAM SCANNING → PLANE ESTIMATION → PROCEDURAL TUNNEL GENERATION → 1:1 SCALE ANCHORING → REAL-TIME OCCLUSION.",
      conceptFlow: [
        { step: "01", label: "SLAM FEATURE DETECTION", detail: "Detects visual feature points and surface planes across the real-world physical environment" },
        { step: "02", label: "PLANE ANCHORING", detail: "Projects AR surface tracking reticle to lock spatial root coordinate origin" },
        { step: "03", label: "PROCEDURAL TUNNELING", detail: "Synthesizes procedural tunnel meshes, structural steel arches, and rail lines dynamically" },
        { step: "04", label: "SPATIAL CO-ALIGNMENT", detail: "Maintains 1:1 metric scale alignment as trainee moves freely throughout physical space" },
        { step: "05", label: "LIGHT ESTIMATION", detail: "Integrates ambient environmental lighting data into Universal Render Pipeline materials" }
      ],
      architecture: {
        pipeline: [
          "Unity AR Foundation 6.x Subsystem",
          "ARCore SLAM Tracking & Plane Detection",
          "Procedural Tunnel Mesh Generator (MineGenerator.cs)",
          "Universal Render Pipeline (URP) Surface Shaders",
          "XR Simulation Testbed in Unity Editor"
        ],
        details: "Engineered specifically for spatial computing headsets and ARCore-enabled mobile devices, separating pure spatial visualization from hazard emergency gameplay.",
        subsystems: [
          { layer: "XR TRACKING", technologies: "AR Foundation, ARCore XR Plugin", role: "Six-degree-of-freedom SLAM tracking and plane estimation" },
          { layer: "PROCEDURAL ENGINE", technologies: "C#, Unity Mesh API", role: "Dynamic generation of mine tunnel corridors and support ribs" },
          { layer: "ANCHORING LAYER", technologies: "ARPlacementManager.cs", role: "Surface raycasting and world space coordinate anchoring" },
          { layer: "GRAPHICS PIPELINE", technologies: "Universal Render Pipeline (URP)", role: "Physically based rock shaders and industrial lighting" },
          { layer: "INPUT SYSTEM", technologies: "New Unity Input System", role: "Spatial gestures and touchscreen reticle placement" }
        ]
      },
      hardware: [
        { component: "ARCore Mobile Device", role: "Spatial Tracking Host", spec: "Android 10.0+ (API 29+), hardware IMU + camera SLAM tracking" }
      ],
      software: [
        { stack: "Unity 6 (6000.6.0f1)", category: "Systems", details: "Core real-time spatial development platform." },
        { stack: "AR Foundation & ARCore", category: "AI / Protocol", details: "Cross-platform augmented reality device tracking abstraction." },
        { stack: "Universal Render Pipeline", category: "Frontend", details: "High-performance mobile graphics pipeline with soft shadows." },
        { stack: "C# Scripting", category: "Firmware", details: "Mesh generation and coordinate transformation logic." }
      ],
      implementation: "Includes Assets/Scripts/ARPlacementManager.cs, procedural tunnel generation, and XR simulation configurations for desktop iteration.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "PLANE DETECTION", action: "Configured AR Plane Manager and Raycast Manager for real-time floor detection" },
        { phase: "PHASE 02", name: "PROCEDURAL GEOMETRY", action: "Wrote algorithm generating rock tunnel wall segments and support arches" },
        { phase: "PHASE 03", name: "SCALE CALIBRATION", action: "Calibrated 1:1 metric coordinates ensuring tunnels match physical proportions" },
        { phase: "PHASE 04", name: "XR SIMULATION", action: "Verified tracking stability across desktop XR simulator and Android build" }
      ],
      challenges: [
        {
          title: "Featureless Surface Tracking in Dim Settings",
          context: "Low-light or uniform surfaces degrade SLAM feature tracking reliability.",
          mitigation: "Integrated surface normal interpolation and fallback orientation tracking."
        },
        {
          title: "Mobile Thermal & Poly Count Limits",
          context: "Rendering complex rock surfaces on mobile devices can cause thermal throttling.",
          mitigation: "Optimized tunnel geometries with shared modular arch meshes and low-draw-call URP shaders."
        }
      ],
      result: {
        summary: "Created an immersive spatial AR viewer anchoring procedural underground mining tunnels in 1:1 true-scale physical environments.",
        metrics: [
          { label: "Scale Fidelity", value: "1:1 Metric Calibration" },
          { label: "Target Platform", value: "Android ARCore / XR" },
          { label: "Render Pipeline", value: "Unity 6 URP" },
          { label: "Tracking DoF", value: "6 Degrees of Freedom" }
        ]
      }
    }
  },

  // =========================================================================
  // 12. ECOPREDICT AI - SPECIES CONSERVATION PREDICTION (MORE SYSTEMS #8)
  // =========================================================================
  {
    id: "endangered-species",
    title: "ECOPREDICT AI",
    subtitle: "Ecological Conservation Prediction & Habitat Recommendation Engine",
    description: "A collaborative open-source conservation intelligence dashboard connecting Supabase PostgreSQL databases with population trajectory prediction and actionable ecological policies.",
    category: "AI × CONSERVATION DATA",
    technologies: ["Supabase PostgreSQL", "React 19", "Vite", "Recharts", "Conservation Heuristics", "AditiJhinjar12 Fork Collaboration"],
    featured: false,
    priority: 12,
    visualType: "3d",
    scene: "SpeciesPredictionScene",
    github: "https://github.com/paras999000/Endangered_species_Prediction_Recommendation_system",
    metrics: [
      { label: "Database", value: "Supabase PostgreSQL" },
      { label: "UI Stack", value: "React 19 + Recharts + Tailwind" },
      { label: "Data Source", value: "IUCN Red List Categories" },
      { label: "Repository Type", value: "Collaborative Open-Source Fork" }
    ],
    caseStudy: {
      overview: "EcoPredict AI is a wildlife conservation and endangered species analytics platform built collaboratively with AditiJhinjar12, integrating Supabase PostgreSQL databases with population trend prediction and actionable ecological recommendations.",
      problem: "Conservation biologists and wildlife agencies face fragmented population census data, making it difficult to forecast extinction velocity and prioritize intervention funds.",
      concept: "Scientific conservation intelligence: SPECIES DATA → STATISTICAL MODEL → POPULATION PREDICTION → CONSERVATION RECOMMENDATION.",
      conceptFlow: [
        { step: "01", label: "SPECIES DATA INGESTION", detail: "Census records, IUCN threat status, geographic regions, and population changes stored in Supabase" },
        { step: "02", label: "MULTI-VARIABLE CORRELATION", detail: "Correlates regional poaching pressure, habitat fragmentation, and climate shifts" },
        { step: "03", label: "POPULATION TRAJECTORY", detail: "Computes 5-year and 10-year demographic forecasts with confidence bands" },
        { step: "04", label: "EXTINCTION RISK PREDICTION", detail: "Classifies risk severity into Critical, Endangered, Vulnerable, and Stable thresholds" },
        { step: "05", label: "HABITAT RECOMMENDATION", detail: "Generates actionable policy directives: sanctuary corridors, anti-poaching patrol vectors" }
      ],
      architecture: {
        pipeline: [
          "Supabase PostgreSQL Relational Schema (species_data table)",
          "React 19 & React Router Single Page Architecture",
          "Recharts Interactive Demographic Curves",
          "Predictive Conservation Heuristic Engine",
          "Actionable Policy & Sanctuary Recommendation Modules"
        ],
        details: "Collaborative open-source application featuring structured SQL migrations (supabase_setup.sql), species comparative analysis, and habitat distribution mapping.",
        subsystems: [
          { layer: "DATABASE TIER", technologies: "Supabase, PostgreSQL", role: "Structured species census records, trends, and threat categories" },
          { layer: "CLIENT APPLICATION", technologies: "React 19, Vite, Tailwind CSS", role: "Interactive species explorer and demographic comparison views" },
          { layer: "ANALYTICS ENGINE", technologies: "Recharts, Heuristic Calculations", role: "Multi-year population velocity and extinction curve modeling" },
          { layer: "RECOMMENDATION", technologies: "Rule-Based Ecological Policy", role: "Targeted habitat restoration and sanctuary boundary proposals" }
        ]
      },
      hardware: [],
      software: [
        { stack: "React 19 / TypeScript", category: "Frontend", details: "Single page interface with reactive species profiles and comparison views." },
        { stack: "Supabase PostgreSQL", category: "Backend", details: "Cloud database indexing species taxonomies, habitats, and populations." },
        { stack: "Recharts", category: "AI / Protocol", details: "Interactive time-series visualizations of population declines." },
        { stack: "Framer Motion", category: "Frontend", details: "Smooth data transition animations across analytical views." }
      ],
      implementation: "Includes pages for Dashboard, Explorer, SpeciesProfile, ResearchData, Compare, Predictions, and Recommendations backed by Supabase.",
      implementationWorkflow: [
        { phase: "PHASE 01", name: "DATABASE SCHEMA", action: "Authored supabase_setup.sql defining species_data tables with realistic demographic metrics" },
        { phase: "PHASE 02", name: "EXPLORER INTERFACE", action: "Built searchable species catalog with IUCN Red List status filtering" },
        { phase: "PHASE 03", name: "PREDICTION CURVES", action: "Integrated Recharts forecasting multi-year demographic trajectories" },
        { phase: "PHASE 04", name: "RECOMMENDATION MODULE", action: "Crafted conservation intervention guidelines for wildlife protection teams" }
      ],
      challenges: [
        {
          title: "Sparse Population Census Data",
          context: "Many critically endangered taxa lack annual census counts, leading to statistical volatility.",
          mitigation: "Incorporated confidence bands and historical regression smoothing."
        },
        {
          title: "Actionability of Statistical Data",
          context: "Raw decline numbers do not guide field rangers on what physical actions to take.",
          mitigation: "Paired mathematical predictions directly with specific spatial policy recommendations."
        }
      ],
      result: {
        summary: "Built an interactive ecological conservation intelligence dashboard connecting Supabase data with population trajectory forecasts and conservation policies.",
        metrics: [
          { label: "Frontend Stack", value: "React 19 + Vite" },
          { label: "Database", value: "Supabase Cloud SQL" },
          { label: "Chart Engine", value: "Recharts Visualizations" },
          { label: "Repo Status", value: "Collaborative Open-Source" }
        ]
      }
    }
  }
];
