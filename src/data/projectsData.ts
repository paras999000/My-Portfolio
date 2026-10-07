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
    technologies: ["ESP32-S3", "INMP441", "MAX98357A", "Embedded C/C++", "FreeRTOS", "Gemini AI", "MCP", "I2S DMA"],
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
      conceptFlow: [
        { step: "01", label: "VOICE INPUT", detail: "Acoustic audio capture via INMP441 MEMS microphone over high-speed I2S bus" },
        { step: "02", label: "PROCESSING", detail: "DMA circular ring buffer, continuous voice activity detection (VAD), and noise cancellation" },
        { step: "03", label: "DECISION", detail: "Gemini AI reasoning core paired with Model Context Protocol (MCP) tool schema routing" },
        { step: "04", label: "ACTION", detail: "Deterministic hardware GPIO pulses, relay switching, and robotic arm kinematics triggering" },
        { step: "05", label: "OUTPUT", detail: "Low-latency synthesized audio PCM streamed directly to MAX98357A I2S Class-D amplifier" }
      ],
      architecture: {
        pipeline: [
          "Acoustic Capture (INMP441 MEMS over I2S)",
          "DMA Circular Buffer & Noise Cancellation",
          "WebSocket Audio Streamer to Cloud AI Engine",
          "Model Context Protocol (MCP) Tool Calling Execution",
          "Audio Synthesis (PCM Stream via MAX98357A I2S DAC)"
        ],
        details: "FreeRTOS dual-core allocation: Core 0 handles high-priority I2S DMA transfers, voice activity detection (VAD), and hardware pulse modulation; Core 1 coordinates TLS-secured network communication, MCP tool JSON serialization, and status OLED telemetry.",
        subsystems: [
          { layer: "HARDWARE LAYER", technologies: "ESP32-S3, INMP441, MAX98357A, LiPo PMU", role: "Acoustic transduction, analog power isolation, I2S serialization" },
          { layer: "FIRMWARE LAYER", technologies: "FreeRTOS, ESP-IDF, C/C++", role: "Dual-core task orchestration, zero-copy DMA buffers, hardware timers" },
          { layer: "COMMUNICATION", technologies: "WebSockets, TLS 1.3, JSON-RPC", role: "Sub-100ms bidirectional packet transport between edge and AI host" },
          { layer: "INTELLIGENCE LAYER", technologies: "Gemini API, MCP Tools Server", role: "Contextual intent parsing, structured tool calling, dynamic response generation" },
          { layer: "ACTUATION LAYER", technologies: "GPIO, PWM, I2C Bus", role: "Direct physical control over lab devices, lights, and robotic linkages" }
        ]
      },
      hardware: [
        { component: "ESP32-S3-WROOM-1", role: "Primary SoC", spec: "Xtensa Dual-Core LX7 @ 240MHz, 8MB PSRAM, Vector AI Instructions" },
        { component: "INMP441", role: "MEMS Microphone", spec: "Omnidirectional digital I2S, 61 dBA SNR, 24-bit resolution" },
        { component: "MAX98357A", role: "I2S Class-D Amplifier", spec: "3.2W output, filterless DAC, 92% efficiency into 4Ω speaker" },
        { component: "Custom Power Rail", role: "Voltage Regulation", spec: "Low-dropout 3.3V 1.2A rail with ceramic decoupling for audio SNR" }
      ],
      software: [
        { stack: "ESP-IDF / FreeRTOS (C++)", category: "Firmware", details: "Zero-copy ring buffer management, dual-core task affinity, I2S driver configuration." },
        { stack: "MCP (Model Context Protocol)", category: "AI / Protocol", details: "JSON-RPC client enabling the AI engine to query system GPIOs, sensor buses, and network devices." },
        { stack: "Gemini AI & Whisper Engine", category: "Backend", details: "Streaming inference pipeline for natural conversational context and autonomous task routing." },
        { stack: "Node.js WebSocket Hub", category: "Backend", details: "High-throughput telemetry relay bridging edge devices with local server tools." }
      ],
      implementation: "The physical prototype is housed inside a custom 3D-printed acoustic resonance chamber designed in CAD. High-frequency digital audio signals were routed with differential impedance matching on a custom dual-layer breakout board to eliminate 60Hz hum and EMI harmonics.",
      implementationWorkflow: [
        { phase: "STAGE 01", name: "DESIGN", action: "CAD acoustic chamber modeled in Fusion 360 with isolated speaker baffles and microphone isolation port" },
        { phase: "STAGE 02", name: "BUILD", action: "ZeroPCB point-to-point wiring prototype with filtered analog ground planes for audio SNR" },
        { phase: "STAGE 03", name: "INTEGRATE", action: "Configured ESP-IDF I2S DMA drivers and tuned FreeRTOS queue depths for continuous ring buffers" },
        { phase: "STAGE 04", name: "TEST", action: "Calibrated microphone sensitivity, ambient noise suppression, and tool invocation response latencies" },
        { phase: "STAGE 05", name: "DEPLOY", action: "Enclosed in final 3D-printed chassis, deployed continuously on workbench node for voice automation" }
      ],
      challenges: [
        {
          title: "Acoustic Feedback Loop Suppression",
          context: "Speaker output from the MAX98357A bled directly into the high-gain INMP441 microphone when sharing the compact 3D enclosure.",
          mitigation: "Designed internal CAD isolation baffles lined with dense TPU gaskets, combined with algorithmic software ducking during audio synthesis playback."
        },
        {
          title: "Network Buffer Underrun Mitigation",
          context: "Fluctuations in Wi-Fi packet latency caused intermittent stuttering in streaming 16kHz PCM audio playback.",
          mitigation: "Engineered dual-buffered ping-pong DMA queues in ESP32-S3 external PSRAM to absorb up to 650ms of network jitter without glitching."
        },
        {
          title: "Sub-300ms Conversational Turn-Around",
          context: "Sequential audio upload, remote cloud transcription, LLM generation, and audio download introduced unacceptable 2-second pauses.",
          mitigation: "Migrated to streaming token synthesis where text-to-speech audio begins generating while the AI response is still being streamed over WebSockets."
        }
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
      conceptFlow: [
        { step: "01", label: "HAZARD INGESTION", detail: "Subterranean sensor nodes trigger alert: toxic gas plume (CH4/CO) or structural seismic displacement" },
        { step: "02", label: "SURFACE TELEMETRY", detail: "Telemetry streaming into centralized Node.js WebSocket engine with timestamped sensor coordinates" },
        { step: "03", label: "AI RISK EVALUATION", detail: "Gemini tactical engine recalculates topological branch safety weights and ventilation airflow vectors" },
        { step: "04", label: "SAFE PATH COMPUTATION", detail: "Dynamic A* pathfinder determines optimal escape route avoiding contaminated zones and blocked shafts" },
        { step: "05", label: "AR CORRIDOR PROJECTION", detail: "Field personnel receive real-time 6-DoF AR waypoint arrows and surface commanders view live 3D digital twin" }
      ],
      architecture: {
        pipeline: [
          "Spatial Mesh & Tunnel Anchor Localization (ARCore Visual Inertial Odometry)",
          "Sub-surface Sensor Network Telemetry Ingestion (Gas, Seismic, Temp)",
          "Gemini Tactical Hazard Assessment & Path Cost Calculation",
          "Dynamic 3D Path Waypoint Projection & Web Command Center Telemetry"
        ],
        details: "A centralized Node.js WebSocket engine streams synchronized hazard updates between field AR headsets/tablets and surface command dashboards built with Three.js and React.",
        subsystems: [
          { layer: "SPATIAL AR CLIENT", technologies: "Unity, ARCore, C#", role: "Visual inertial odometry, 6-DoF ground anchor tracking, volumetric warning shaders" },
          { layer: "DIGITAL TWIN WEB", technologies: "Three.js, React, TypeScript", role: "Real-time 3D tactical command center rendering multi-level tunnel geometry" },
          { layer: "INCIDENT ENGINE", technologies: "Node.js, WebSockets, Redis", role: "Sub-50ms synchronized state broadcast across all field tablets and monitors" },
          { layer: "AI TACTICAL ADVISORY", technologies: "Gemini AI API, Graph A*", role: "Dynamic recalculation of evacuation vectors based on spread rate of simulated toxic pockets" }
        ]
      },
      hardware: [
        { component: "ARCore Mobile / Headset Rig", role: "Spatial Visualizer", spec: "ToF depth sensor, 60fps tracking, low-light illumination" },
        { component: "Sub-surface Sensor Beacons", role: "Hazard Nodes", spec: "Simulated toxic gas (CO, CH4), air-flow velocity, structural load sensors" },
        { component: "Tactical Command Terminal", role: "Operations Monitoring", spec: "Surface workstation rendering full 3D subterranean digital twin" }
      ],
      software: [
        { stack: "Unity & C#", category: "Frontend", details: "Core AR spatial anchoring, particle-based smoke/gas physics, and terrain mesh occlusions." },
        { stack: "ARCore / WebXR", category: "Frontend", details: "Markerless plane detection, floor planar alignment, and path waypointing." },
        { stack: "Three.js & TypeScript", category: "Frontend", details: "Web-based tactical command center showing multi-level subterranean 3D views." },
        { stack: "Gemini AI Engine", category: "AI / Protocol", details: "Real-time decision support analyzing tunnel oxygen levels and recommending priority evacuation branches." },
        { stack: "Node.js WebSocket Hub", category: "Backend", details: "Event-driven disaster simulation bus connecting sensor alerts to field AR headsets." }
      ],
      implementation: "Modeled multi-level mine shaft geometry inside Blender with realistic blast doors, refuge chambers, rail networks, and ventilation shafts. Engineered dynamic A* graph pathfinding with edge weights updated dynamically when simulated cave-ins or toxic pockets occur.",
      implementationWorkflow: [
        { phase: "STAGE 01", name: "DESIGN", action: "Blender 3D modeled subterranean shaft networks based on real industrial deep-mining topological schematics" },
        { phase: "STAGE 02", name: "BUILD", action: "Developed Unity simulation environment with particle dynamics for smoke dispersion and gas accumulation" },
        { phase: "STAGE 03", name: "INTEGRATE", action: "Integrated Google ARCore tracking for field anchor stabilization; built Three.js web command twin" },
        { phase: "STAGE 04", name: "TEST", action: "Ran multiple emergency drill scenarios measuring navigation error reduction and escape timeline deltas" },
        { phase: "STAGE 05", name: "DEPLOY", action: "Packaged APK deployment for Android field devices and responsive web dashboard for operations control" }
      ],
      challenges: [
        {
          title: "Visual Inertial Odometry Drift in Featureless Tunnels",
          context: "Long, dimly lit mine corridors with uniform rock textures caused ARCore tracking cameras to drift by up to 1.8 meters over 50 meters.",
          mitigation: "Introduced periodic high-contrast visual landmark anchors (reflective survey markers) that reset Kalman filter drift in real time."
        },
        {
          title: "Mobile Frame Rate Drops under Volumetric Smoke",
          context: "Complex particle physics simulation for toxic gas clouds degraded mobile AR rendering to sub-25 FPS.",
          mitigation: "Authored custom lightweight vertex shader displacement volumes that give the appearance of dense fog at a constant 60 FPS."
        },
        {
          title: "Surface-to-Underground Telemetry Synchronization",
          context: "Simulating network blackouts while maintaining incident state consistency between underground and surface teams.",
          mitigation: "Engineered offline-first local state caching that buffers waypoints and synchronizes via differential delta packets when signal resumes."
        }
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
      conceptFlow: [
        { step: "01", label: "CARTESIAN TARGET", detail: "Host PC or automated script dispatches goal position vector: X, Y, Z, and end-effector pitch angle" },
        { step: "02", label: "INVERSE KINEMATICS", detail: "Analytical trigonometric matrix solver computes necessary joint angles (θ1 through θ5)" },
        { step: "03", label: "TRAJECTORY PLANNING", detail: "S-curve quintic polynomial interpolation calculates intermediate positions to prevent mechanical jerk" },
        { step: "04", label: "HARDWARE PWM TIMERS", detail: "16-bit hardware microcontroller timers generate precise sub-microsecond pulse widths (500µs - 2500µs)" },
        { step: "05", label: "COORDINATED ACTUATION", detail: "Dual-bearing high-torque metal gear servos move synchronously into target end-effector orientation" }
      ],
      architecture: {
        pipeline: [
          "Target Cartesian Vector Coordinates (X, Y, Z, Pitch, Roll)",
          "Analytical Inverse Kinematics Trigonometric Matrix Solver",
          "Smooth S-Curve Trajectory & Jitter-Suppression Interpolator",
          "Hardware Timer-Driven High-Resolution PWM Generation",
          "Closed-loop Limit Switch Calibration & Current Telemetry"
        ],
        details: "Microcontroller firmware implements real-time hardware timers generating sub-microsecond pulse widths to prevent motor chatter. Joint angles are clamped dynamically based on mechanical collision boundaries.",
        subsystems: [
          { layer: "MECHANICAL STRUCTURE", technologies: "Fusion 360, PETG, Thrust Bearings", role: "Rigid linkage arms with low deflection and integrated cable conduits" },
          { layer: "POWER DRIVER STAGE", technologies: "Isolated 6V 10A Buck, Optocouplers", role: "Provides transient motor currents without browning out digital controller logic" },
          { layer: "EMBEDDED CONTROLLER", technologies: "C/C++, Hardware PWM Timers, FreeRTOS", role: "100Hz deterministic control loop executing kinematic calculations and pulse generation" },
          { layer: "COMMUNICATIONS & GUI", technologies: "Serial USB, Python / Web Telemetry", role: "Real-time jog control, joint telemetry readout, and waypoint recording" }
        ]
      },
      hardware: [
        { component: "High-Torque Metal Gear Servos", role: "Joint Actuators", spec: "Coreless motors, 25kg·cm stall torque, dual ball bearings" },
        { component: "High-Current Buck Regulator", role: "Power Stage", spec: "Dedicated 6V 10A rail isolated with optocouplers from digital logic" },
        { component: "Custom 3D Linkages & Bearing Mounts", role: "Structural Frame", spec: "PETG high-infill components with stainless steel pivot pins" },
        { component: "Microswitch Limit Triggers", role: "Zero-Point Homing", spec: "Hardware homing switches for automated initial reference calibration" }
      ],
      software: [
        { stack: "Embedded C / Bare-Metal C++", category: "Firmware", details: "Precision PWM driver using internal 16-bit hardware counter timers." },
        { stack: "Kinematic Math Library", category: "Firmware", details: "Forward and Inverse Kinematics analytical solver optimized for embedded microcontrollers without floating point overhead." },
        { stack: "Serial Command Protocol", category: "Systems", details: "Compact binary packet framing for host telemetry streaming and manual jog control." },
        { stack: "Python Control Script & GUI", category: "Backend", details: "Desktop test harness for calibrating angular offsets and recording movement scripts." }
      ],
      implementation: "Designed every arm link, bearing clamp, and gripper bracket inside CAD software to optimize center-of-mass distribution. Assembled the arm with thrust bearings at the base to prevent axial tilt under full reach extensions.",
      implementationWorkflow: [
        { phase: "STAGE 01", name: "DESIGN", action: "Parametric CAD design of articulated links, servo clamping horns, and parallel gripper mechanism" },
        { phase: "STAGE 02", name: "BUILD", action: "Additive manufacturing in heavy-duty PETG with 40% infill; pressed stainless steel ball bearings into joints" },
        { phase: "STAGE 03", name: "INTEGRATE", action: "Wired high-power distribution rail with flyback diodes; wrote bare-metal PWM timer ISRs" },
        { phase: "STAGE 04", name: "TEST", action: "Derived analytical IK solver; validated kinematic reach envelope and repeatability across 500 pick cycles" },
        { phase: "STAGE 05", name: "DEPLOY", action: "Integrated automated sorting routine on workbench with optical sensor triggering" }
      ],
      challenges: [
        {
          title: "Mechanical Joint Backlash & Sag at Full Extension",
          context: "At maximum 340mm extension, gear train backlash and plastic deflection caused 6mm of droop at the gripper tip.",
          mitigation: "Re-engineered base shoulder linkage to include dual opposed ball bearings and added a software gravity-feedforward angular compensation factor."
        },
        {
          title: "Inductive Servo Noise Causing MCU Resets",
          context: "Simultaneous deceleration of all 5 servos produced reverse inductive EMF spikes exceeding 9V, crashing the digital controller.",
          mitigation: "Installed high-capacity low-ESR electrolytic filter banks (3300µF) and optocoupled PWM lines to completely isolate MCU supply from motor power."
        },
        {
          title: "Kinematic Singularities at Boundary Reaches",
          context: "Mathematical inverse kinematics produced indeterminate divide-by-zero solutions when reaching directly vertical or boundary horizons.",
          mitigation: "Implemented continuous workspace boundary bounding boxes that smoothly project target coordinates back into solvable reachable space."
        }
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
      conceptFlow: [
        { step: "01", label: "VEHICLE ARRIVAL", detail: "Vehicle maneuvers into designated parking bay beneath overhead ultrasonic transceiver" },
        { step: "02", label: "SENSOR DETECTION", detail: "HC-SR04 sonar pulses echo off vehicle surface; distance delta drops below calibrated 1.2m threshold" },
        { step: "03", label: "EDGE DEBOUNCING", detail: "Pico W applies exponential moving average (EMA) filter across 5 consecutive samples to reject pedestrian walk-bys" },
        { step: "04", label: "WIRELESS TELEMETRY", detail: "Edge node fires compact JSON state transition packet over Wi-Fi WebSocket socket" },
        { step: "05", label: "DASHBOARD UPDATE", detail: "Node.js hub broadcasts update to web dashboard; local dual-color LED instantly shifts from Green to Red" }
      ],
      architecture: {
        pipeline: [
          "Ultrasonic Time-of-Flight Distance Measurement",
          "Exponential Moving Average (EMA) Filtering & Thresholding",
          "HTTP / WebSocket JSON State Transmission via Pico W",
          "Node.js Real-Time State Distribution Service",
          "Interactive Web Dashboard with Visual Bay Status & Heatmaps"
        ],
        details: "Pico W runs a lightweight embedded event loop that polls sensors, detects state changes, and instantly updates both physical RGB LED indicators at the bay and the remote cloud dashboard.",
        subsystems: [
          { layer: "EDGE SENSING NODES", technologies: "Raspberry Pi Pico W, HC-SR04, MicroPython", role: "Precision timing capture, multi-sample noise rejection, hardware bay signaling" },
          { layer: "NETWORK TRANSPORT", technologies: "802.11 b/g/n Wi-Fi, WebSockets, REST", role: "Low-overhead persistent socket channel streaming instant occupancy state transitions" },
          { layer: "EVENT HUB BACKEND", technologies: "Node.js, Express, Socket.io", role: "Session state management, occupancy metrics logging, event pub/sub dispatch" },
          { layer: "OPERATOR UI", technologies: "React, Tailwind/Vanilla CSS, Canvas", role: "Visual floorplan map showing live occupied/vacant bays, average dwell times, and alerts" }
        ]
      },
      hardware: [
        { component: "Raspberry Pi Pico W", role: "Edge Controller", spec: "RP2040 Dual Arm Cortex-M0+, CYW43439 2.4GHz Wi-Fi" },
        { component: "HC-SR04+ Ultrasonic Sensors", role: "Proximity Detection", spec: "3.3V compatible, 2cm - 400cm range, 3mm resolution" },
        { component: "High-Luminance Status LEDs", role: "Visual Bay Signals", spec: "Green (Available), Red (Occupied), Blue (Reserved/EV)" },
        { component: "Regulated 5V/3.3V Power Distribution", role: "Power Management", spec: "Decoupled power distribution bus for noise rejection" }
      ],
      software: [
        { stack: "MicroPython / Embedded C", category: "Firmware", details: "Interrupt-driven pulse timing, WiFi reconnection watchdog, and non-blocking sockets." },
        { stack: "Node.js & Express", category: "Backend", details: "Backend REST API with persistent state tracking, session management, and analytics." },
        { stack: "WebSockets & React", category: "Frontend", details: "Instant sub-second bay status changes reflected without page refresh." }
      ],
      implementation: "Created a scalable hardware bus connecting multiple bay sensor nodes with bus addressing. Engineered an automated fail-safe that flags malfunctioning sensors if readings remain static beyond expected bounds.",
      implementationWorkflow: [
        { phase: "STAGE 01", name: "DESIGN", action: "Schematic design of multi-sensor bus with 3.3V logic level shifters and LED signaling arrays" },
        { phase: "STAGE 02", name: "BUILD", action: "Soldered breadboard prototype connecting Pico W with dual HC-SR04 sensors and status LEDs" },
        { phase: "STAGE 03", name: "INTEGRATE", action: "Developed embedded firmware event loop with non-blocking Wi-Fi socket reconnect routines" },
        { phase: "STAGE 04", name: "TEST", action: "Conducted simulated vehicle ingress/egress tests measuring latency from vehicle entry to dashboard UI" },
        { phase: "STAGE 05", name: "DEPLOY", action: "Deployed multi-bay test rig running continuously with live WebSocket telemetry push" }
      ],
      challenges: [
        {
          title: "False Trigger Rejection from Pedestrian Movement",
          context: "Walking humans momentarily blocking the ultrasonic beam generated brief false 'Occupied' states.",
          mitigation: "Engineered an edge state machine requiring continuous detection stability for a minimum 1.5-second time window before committing a state transition."
        },
        {
          title: "Wi-Fi Reconnection Recovery in Concrete Garage Basements",
          context: "Intermittent RF packet loss caused standard socket connections to hang indefinitely without throwing fatal errors.",
          mitigation: "Built a hardware watchdog timer in firmware that polls network ping heartbeat and triggers silent non-blocking socket reinitialization upon timeout."
        },
        {
          title: "Sensor Cross-Talk in Adjacent Parking Bays",
          context: "Ultrasonic sound waves from Sensor A reflecting into the receiver of adjacent Sensor B generated corrupt distance calculations.",
          mitigation: "Interleaved sensor trigger pulses with a 45ms hardware delay phase shift, preventing concurrent acoustic ping overlap."
        }
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
