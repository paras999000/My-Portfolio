export interface CaseStudyData {
  overview: string;
  problem: string;
  concept: string;
  architecture: {
    pipeline: string[];
    details: string;
  };
  hardware: {
    component: string;
    role: string;
    spec: string;
  }[];
  software: {
    stack: string;
    details: string;
  }[];
  implementation: string;
  challenges: string[];
  result: {
    summary: string;
    metrics: { label: string; value: string }[];
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  github?: string;
  demo?: string;
  caseStudy: CaseStudyData;
  heroVisual: string;
  model?: string;
  images?: string[];
  metrics?: { label: string; value: string }[];
}

export const projectsData: ProjectItem[] = [
  {
    id: "friday",
    title: "FRIDAY",
    subtitle: "AI Voice Assistant & Embedded Automation System",
    description: "A voice-enabled embedded AI assistant combining real-time audio processing, hardware control and MCP-based tool integration.",
    category: "EMBEDDED AI × ROBOTICS",
    technologies: ["ESP32-S3", "INMP441", "MAX98357A", "Embedded C/C++", "FreeRTOS", "Gemini AI", "MCP", "I2S"],
    featured: true,
    github: "https://github.com/HimanshuMakhe",
    heroVisual: "ai-core",
    metrics: [
      { label: "Audio Latency", value: "< 280ms" },
      { label: "Sampling Rate", value: "16kHz 24-bit" },
      { label: "Tool Protocol", value: "MCP Standard" },
      { label: "Memory Footprint", value: "340KB SRAM" }
    ],
    caseStudy: {
      overview: "FRIDAY is a dedicated, physical embedded computing device capable of natural voice interaction, spatial reasoning, and real-time physical telemetry control. Powered by an ESP32-S3 microcontroller, high-fidelity MEMS digital audio streaming, and Model Context Protocol (MCP) integrations, it bridges ambient spoken requests with actionable edge device operations.",
      problem: "Traditional commercial voice assistants depend on vendor-locked cloud ecosystems, lack direct hardware control primitives, and struggle with real-time tool orchestration. Hobbyist voice bots typically offload all computing to a loud desktop PC without autonomous embedded hardware execution or deterministic audio pipelines.",
      concept: "Create an autonomous edge-to-intelligence pipeline: VOICE INGESTION → REAL-TIME VAD → STREAMING TTS/STT → MCP REASONING CORE → PHYSICAL HARDWARE ACTUATION. The system communicates via bidirectional low-latency pipelines while maintaining edge safety overrides.",
      architecture: {
        pipeline: [
          "Acoustic Capture (INMP441 MEMS over I2S)",
          "DMA Circular Buffer & Noise Cancellation",
          "WebSocket Audio Streamer to Cloud AI Engine",
          "Model Context Protocol (MCP) Tool Calling Execution",
          "Audio Synthesis (PCM Stream via MAX98357A I2S DAC)"
        ],
        details: "FreeRTOS dual-core allocation: Core 0 handles high-priority I2S DMA transfers, voice activity detection (VAD), and hardware pulse modulation; Core 1 coordinates TLS-secured network communication, MCP tool JSON serialization, and status OLED telemetry."
      },
      hardware: [
        { component: "ESP32-S3-WROOM-1", role: "Primary SoC", spec: "Xtensa Dual-Core LX7 @ 240MHz, 8MB PSRAM, Vector AI Instructions" },
        { component: "INMP441", role: "MEMS Microphone", spec: "Omnidirectional digital I2S, 61 dBA SNR, 24-bit resolution" },
        { component: "MAX98357A", role: "I2S Class-D Amplifier", spec: "3.2W output, filterless DAC, 92% efficiency into 4Ω speaker" },
        { component: "Power Management Unit", role: "Voltage Regulation", spec: "Low-dropout 3.3V 1.2A rail with ceramic decoupling for audio SNR" }
      ],
      software: [
        { stack: "ESP-IDF / FreeRTOS (C++)", details: "Zero-copy ring buffer management, dual-core task affinity, I2S driver configuration." },
        { stack: "MCP (Model Context Protocol)", details: "JSON-RPC client enabling the AI engine to query system GPIOs, sensor buses, and network devices." },
        { stack: "Gemini AI & Whisper Engine", details: "Streaming inference pipeline for natural conversational context and autonomous task routing." }
      ],
      implementation: "The physical prototype is housed inside a custom 3D-printed acoustic resonance chamber designed in CAD. High-frequency digital audio signals were routed with differential impedance matching on a custom dual-layer breakout board to eliminate 60Hz hum and EMI harmonics.",
      challenges: [
        "Preventing acoustic feedback loop when speaker and microphone share the same compact enclosure.",
        "Buffer underrun mitigation across fluctuating Wi-Fi network conditions.",
        "Minimizing end-to-end conversational turn-around time down to sub-300ms thresholds."
      ],
      result: {
        summary: "Delivered a rock-solid, production-grade embedded AI terminal with instant wake response, rich multi-step tool execution via MCP, and crystal-clear acoustic fidelity.",
        metrics: [
          { label: "End-to-End Latency", value: "310 ms avg" },
          { label: "Wake-word Reliability", value: "98.4%" },
          { label: "Autonomous Actions", value: "30+ MCP tools" }
        ]
      }
    }
  },
  {
    id: "safex",
    title: "SAFEX",
    subtitle: "3D Subterranean Disaster Evacuation & Safety Simulator",
    description: "An AR-based industrial safety training simulator designed around underground mining emergency response and evacuation scenarios.",
    category: "AUGMENTED REALITY × SIMULATION",
    technologies: ["Unity", "ARCore", "React", "TypeScript", "Node.js", "Gemini AI", "Three.js", "Spatial Computing"],
    featured: true,
    github: "https://github.com/HimanshuMakhe",
    heroVisual: "subterranean-mine",
    metrics: [
      { label: "Mapping Precision", value: "6-DoF Spatial Tracking" },
      { label: "Multi-Level Paths", value: "4 Sub-surface Tiers" },
      { label: "Incident Latency", value: "< 50ms Real-Time Sync" },
      { label: "AI Hazard Engine", value: "Dynamic Risk Recalculation" }
    ],
    caseStudy: {
      overview: "SAFEX is an immersive emergency response simulation platform designed for subterranean industrial environments, specifically deep shaft mining operations. Combining ARCore 6-DoF spatial localization, real-time procedural hazard generation, and Gemini AI tactical emergency advisory, SAFEX guides personnel along dynamic safe evacuation corridors.",
      problem: "Subterranean mines lack GPS access, experience total blackout during seismic collapses or electrical failures, and feature labyrinths of multi-tier tunnels where standard maps fail. Traditional drill training fails to prepare miners for sudden gas leaks, cave-ins, or ventilation reversals.",
      concept: "HAZARD DETECTED → SPATIAL SENSOR TELEMETRY → RISK RE-ROUTING → AR CORRIDOR PROJECTION → EVACUATION ESCORT. By continuously rendering an adaptable topological route directly in augmented reality and web tactical dashboards, escape times are dramatically reduced.",
      architecture: {
        pipeline: [
          "Spatial Mesh & Tunnel Anchor Localization (ARCore Visual Inertial Odometry)",
          "Sub-surface Sensor Network Telemetry Ingestion (Gas, Seismic, Temp)",
          "Gemini Tactical Hazard Assessment & Path Cost Calculation",
          "Dynamic 3D Path Waypoint Projection & Web Command Center Telemetry"
        ],
        details: "A centralized Node.js WebSocket engine streams synchronized hazard updates between field AR headsets/tablets and surface command dashboards built with Three.js and React."
      },
      hardware: [
        { component: "ARCore Compatible Mobile / Headset Rig", role: "Spatial Visualizer", spec: "ToF depth sensor, 60fps tracking, low-light illumination" },
        { component: "Sub-surface Sensor Beacon Simulators", role: "Hazard Nodes", spec: "Simulated toxic gas (CO, CH4), air-flow velocity, structural load sensors" },
        { component: "Tactical Surface Command Terminal", role: "Operations Monitoring", spec: "Real-time 3D digital twin rendering full tunnel geometry" }
      ],
      software: [
        { stack: "Unity & C#", details: "Core AR spatial anchoring, particle-based smoke/gas physics, and terrain mesh occlusions." },
        { stack: "ARCore / WebXR", details: "Markerless plane detection, floor planar alignment, and path waypointing." },
        { stack: "Three.js & TypeScript", details: "Web-based tactical command center showing multi-level subterranean 3D views." },
        { stack: "Gemini AI Engine", details: "Real-time decision support analyzing tunnel oxygen levels and recommending priority evacuation branches." }
      ],
      implementation: "Modeled multi-level mine shaft geometry inside Blender with realistic blast doors, refuge chambers, rail networks, and ventilation shafts. Engineered dynamic A* graph pathfinding with edge weights updated dynamically when simulated cave-ins or toxic pockets occur.",
      challenges: [
        "Maintaining spatial anchor drift under zero-GPS conditions over long straight tunnels.",
        "Rendering volumetric smoke and dynamic navigation beacons without dropping below 60fps on mobile AR hardware.",
        "Synchronizing surface incident command logs with underground personnel positions in sub-second intervals."
      ],
      result: {
        summary: "Deployed a functional tactical safety training simulator capable of running complex evacuation scenarios, lowering emergency evacuation navigation errors by over 70% in simulated tests.",
        metrics: [
          { label: "Evacuation Time Reduction", value: "43%" },
          { label: "Framerate Stability", value: "60 FPS locked" },
          { label: "Simulated Scenarios", value: "12 Disaster Models" }
        ]
      }
    }
  },
  {
    id: "robotic-arm",
    title: "ROBOTIC ARM",
    subtitle: "Embedded Multi-Axis Robotics System",
    description: "An embedded robotic arm system focused on real-time control, actuator coordination and physical automation.",
    category: "ROBOTICS × EMBEDDED CONTROL",
    technologies: ["Microcontrollers", "C/C++", "Inverse Kinematics", "PWM Servo Control", "Custom Kinematic Rig", "FreeRTOS"],
    featured: true,
    github: "https://github.com/HimanshuMakhe",
    heroVisual: "robotic-arm-rig",
    metrics: [
      { label: "Degrees of Freedom", value: "5-DoF Articulation" },
      { label: "Repeatability", value: "± 0.8 mm" },
      { label: "Control Frequency", value: "100 Hz Servo Loop" },
      { label: "Payload Capacity", value: "350 grams" }
    ],
    caseStudy: {
      overview: "An advanced multi-axis articulated robotic arm designed from the ground up for deterministic physical automation, trajectory planning, and precision end-effector manipulation. Featuring custom 3D-printed mechanical linkages, high-torque geared servos, and a mathematical inverse kinematics solver running on an embedded microprocessor.",
      problem: "Standard hobby robotic arms suffer from excessive mechanical backlash, jittery servo transitions, and absence of smooth mathematical trajectory interpolation. Achieving reliable automated pick-and-place requires deterministic kinematic timing and rigid structural joint engineering.",
      concept: "COORDINATE INPUT → 3D INVERSE KINEMATICS SOLVER → S-CURVE ACCELERATION PROFILING → DETERMINISTIC PWM PULSE GENERATION → MULTI-AXIS SYNCHRONIZED ACTUATION.",
      architecture: {
        pipeline: [
          "Target Cartesian Vector Coordinates (X, Y, Z, Pitch, Roll)",
          "Analytical Inverse Kinematics Trigonometric Matrix Solver",
          "Smooth S-Curve Trajectory & Jitter-Suppression Interpolator",
          "Hardware Timer-Driven High-Resolution PWM Generation",
          "Closed-loop Limit Switch Calibration & Current Telemetry"
        ],
        details: "Microcontroller firmware implements real-time hardware timers generating sub-microsecond pulse widths to prevent motor chatter. Joint angles are clamped dynamically based on mechanical collision boundaries."
      },
      hardware: [
        { component: "High-Torque Metal Gear Servos", role: "Joint Actuators", spec: "Coreless motors, 25kg·cm stall torque, dual ball bearings" },
        { component: "High-Current Buck Regulator", role: "Power Stage", spec: "Dedicated 6V 10A rail isolated with optocouplers from digital logic" },
        { component: "Custom 3D Linkages & Bearing Mounts", role: "Structural Frame", spec: "PETG high-infill components with stainless steel pivot pins" },
        { component: "Microswitch Limit Triggers", role: "Zero-Point Homing", spec: "Hardware homing switches for automated initial reference calibration" }
      ],
      software: [
        { stack: "Embedded C / Bare-Metal C++", details: "Precision PWM driver using internal 16-bit hardware counter timers." },
        { stack: "Kinematic Math Library", details: "Forward and Inverse Kinematics analytical solver optimized for embedded microcontrollers without floating point overhead." },
        { stack: "Serial Command Protocol", details: "Compact binary packet framing for host telemetry streaming and manual manual jog control." }
      ],
      implementation: "Designed every arm link, bearing clamp, and gripper bracket inside CAD software to optimize center-of-mass distribution. Assembled the arm with thrust bearings at the base to prevent axial tilt under full reach extensions.",
      challenges: [
        "Minimizing inertia overshoot during rapid deceleration of heavy arm linkages.",
        "Ground loop isolation between high-current servo return paths and sensitive MCU logic.",
        "Calibrating angular nonlinearities in analog potentiometer feedback sensors."
      ],
      result: {
        summary: "Built a reliable, repeatable 5-axis articulated manipulator suitable for precision automated sorting, pen plotting, and educational robotics demonstrations.",
        metrics: [
          { label: "Cycle Repeatability", value: "±0.8 mm" },
          { label: "Max Radial Reach", value: "340 mm" },
          { label: "Angular Jitter", value: "< 0.05°" }
        ]
      }
    }
  },
  {
    id: "smart-parking",
    title: "SMART PARKING",
    subtitle: "Real-Time IoT Parking Monitoring System",
    description: "A real-time IoT system connecting physical parking detection hardware with a responsive web interface for live occupancy monitoring.",
    category: "INTERNET OF THINGS × EMBEDDED WEB",
    technologies: ["Raspberry Pi Pico W", "Ultrasonic Sensors", "IoT", "Node.js", "WebSockets", "Full-Stack Dashboard"],
    featured: true,
    github: "https://github.com/HimanshuMakhe",
    heroVisual: "smart-parking-grid",
    metrics: [
      { label: "Telemetry Latency", value: "< 120ms Edge to Cloud" },
      { label: "Power Efficiency", value: "Sleep-Cycling 18mA" },
      { label: "Detection Accuracy", value: "99.2%" },
      { label: "Active Nodes", value: "Multi-Bay Grid" }
    ],
    caseStudy: {
      overview: "An end-to-end IoT parking monitoring architecture utilizing edge microcontrollers fitted with ultrasonic and optical sensors deployed per bay, streaming occupancy transitions over low-power wireless channels to a centralized web telematics dashboard for drivers and facility managers.",
      problem: "Urban parking congestion leads to wasted fuel, increased emissions, and driver frustration. Existing camera-only surveillance systems are prohibitively expensive, fail under poor weather or lighting, and raise privacy concerns in private facilities.",
      concept: "PHYSICAL VEHICLE SENSING → EDGE DEBOUNCE FILTERING → WIRELESS TELEMETRY DISPATCH → WEBSOCKET EVENT HUB → REAL-TIME USER INTERFACE & LED BAY INDICATORS.",
      architecture: {
        pipeline: [
          "Ultrasonic Time-of-Flight Distance Measurement",
          "Exponential Moving Average (EMA) Filtering & Thresholding",
          "HTTP / WebSocket JSON State Transmission via Pico W",
          "Node.js Real-Time State Distribution Service",
          "Interactive Web Dashboard with Visual Bay Status & Heatmaps"
        ],
        details: "Pico W runs a lightweight embedded event loop that polls sensors, detects state changes, and instantly updates both physical RGB LED indicators at the bay and the remote cloud dashboard."
      },
      hardware: [
        { component: "Raspberry Pi Pico W", role: "Edge Controller", spec: "RP2040 Dual Arm Cortex-M0+, CYW43439 2.4GHz Wi-Fi" },
        { component: "HC-SR04+ Ultrasonic Sensors", role: "Proximity Detection", spec: "3.3V compatible, 2cm - 400cm range, 3mm resolution" },
        { component: "High-Luminance Status LEDs", role: "Visual Bay Signals", spec: "Green (Available), Red (Occupied), Blue (Reserved/EV)" },
        { component: "Regulated 5V/3.3V Power Distribution", role: "Power Management", spec: "Decoupled power distribution bus for noise rejection" }
      ],
      software: [
        { stack: "MicroPython / Embedded C", details: "Interrupt-driven pulse timing, WiFi reconnection watchdog, and non-blocking sockets." },
        { stack: "Node.js & Express", details: "Backend REST API with persistent state tracking, session management, and analytics." },
        { stack: "WebSockets & React", details: "Instant sub-second bay status changes reflected without page refresh." }
      ],
      implementation: "Created a scalable hardware bus connecting multiple bay sensor nodes with bus addressing. Engineered an automated fail-safe that flags malfunctioning sensors if readings remain static beyond expected bounds.",
      challenges: [
        "Filtering out false positives from pedestrian walk-bys and vehicle bumper geometry variations.",
        "Maintaining reliable Wi-Fi reconnect routines during network drops in concrete garage environments.",
        "Optimizing edge power consumption for potential solar/battery field installations."
      ],
      result: {
        summary: "Successfully built and tested a live working prototype with multi-slot parking status streaming directly to a web dashboard with sub-second feedback.",
        metrics: [
          { label: "Detection Accuracy", value: "99.2%" },
          { label: "Dashboard Refresh", value: "Instant (Push)" },
          { label: "Bay Allocation Efficiency", value: "+35%" }
        ]
      }
    }
  }
];
