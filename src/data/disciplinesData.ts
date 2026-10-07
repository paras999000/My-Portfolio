export interface DisciplineCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  skills: {
    name: string;
    tag?: string;
  }[];
}

export const disciplinesData: DisciplineCategory[] = [
  {
    id: "embedded",
    name: "EMBEDDED SYSTEMS",
    code: "DISC-01 // EMB",
    description: "Low-level firmware, microcontrollers, real-time operating systems, and deterministic sensor/actuator bus communication.",
    skills: [
      { name: "IoT Architectures" },
      { name: "ESP32 (S2/S3/C3)" },
      { name: "ESP8266" },
      { name: "Raspberry Pi & Pico W" },
      { name: "Real-Time Systems (FreeRTOS)" },
      { name: "I2C / SPI / UART / I2S" }
    ]
  },
  {
    id: "hardware-pcb",
    name: "HARDWARE & PCB",
    code: "DISC-02 // HW",
    description: "Schematic design, component selection, rapid breadboard & ZeroPCB prototyping, power distribution, and signal verification.",
    skills: [
      { name: "PCB Design & Layout" },
      { name: "ZeroPCB Rapid Prototyping" },
      { name: "Circuit Design & Analysis" },
      { name: "Hardware Troubleshooting" },
      { name: "Power Management & Buck Regulators" },
      { name: "Oscilloscope & Logic Analyzer Verification" }
    ]
  },
  {
    id: "software-backend",
    name: "SOFTWARE & BACKEND",
    code: "DISC-03 // SW",
    description: "Modern, high-performance software engineering across systems languages, event-driven web backends, and responsive UIs.",
    skills: [
      { name: "C / C++ (Embedded & Systems)" },
      { name: "Python" },
      { name: "JavaScript & TypeScript" },
      { name: "Node.js & Express" },
      { name: "React & Next.js" },
      { name: "REST APIs & WebSockets" }
    ]
  },
  {
    id: "ai-ar-3d",
    name: "AI / AR / 3D",
    code: "DISC-04 // AI-XR",
    description: "Integrating intelligent agentic workflows, augmented reality spatial tracking, and interactive WebGL experiences.",
    skills: [
      { name: "Gemini AI API & Tool Calling" },
      { name: "Model Context Protocol (MCP)" },
      { name: "Unity 3D Engine" },
      { name: "ARCore Spatial Tracking" },
      { name: "Three.js & React Three Fiber" },
      { name: "3D CAD Modeling & Shaders" }
    ]
  },
  {
    id: "systems",
    name: "SYSTEMS & INFRASTRUCTURE",
    code: "DISC-05 // SYS",
    description: "Robust computing foundations, Unix environment management, containerization, and reliable server deployments.",
    skills: [
      { name: "Linux / Unix Environments" },
      { name: "Docker Containerization" },
      { name: "Computer Networking (TCP/IP, UDP, DNS)" },
      { name: "Server Deployment & CI/CD" },
      { name: "Shell Scripting & Automation" }
    ]
  },
  {
    id: "product-design",
    name: "3D / PRODUCT DESIGN",
    code: "DISC-06 // CAD",
    description: "Parametric mechanical modeling, bespoke functional enclosures, mechanical tolerances, and rapid additive manufacturing.",
    skills: [
      { name: "Autodesk Fusion 360" },
      { name: "Electronic Enclosures & Mounts" },
      { name: "Mechanical Integration" },
      { name: "FDM 3D Printing & Slicing" },
      { name: "Design for Assembly (DFA)" }
    ]
  }
];
