export interface HardwareStoryStep {
  step: string;
  title: string;
  description: string;
}

export interface CadModelItem {
  id: string;
  name: string;
  cadCode: string;
  category: string;
  designedIn: string;
  manufacturing: string;
  material: string;
  dimensions: string;
  electronics?: string;
  status: string;
  fileUrl: string;
  fileType: "stl" | "gltf" | "procedural";
  description: string;
  volume: string;
  infill: string;
  layerHeight: string;
  estimatedPrintTime: string;
  tolerances: string;
  features: string[];
  hardwareStory: HardwareStoryStep[];
}

export const cadModelsData: CadModelItem[] = [
  {
    id: "lower-shell-body",
    name: "Lower Shell Housing Chassis",
    cadCode: "CAD-PRT-001",
    category: "Structural Enclosure",
    designedIn: "Autodesk Fusion 360",
    manufacturing: "FDM Additive 3D Printing",
    material: "PETG / Carbon-Fiber Blend",
    dimensions: "148.4 × 82.2 × 34.6 mm",
    electronics: "Integrated M3 Standoffs for ESP32-S3 & LiPo Power Management Board",
    status: "FABRICATED & FIELD TESTED",
    fileUrl: "/models/LowerShellBody.stl",
    fileType: "stl",
    description: "Primary bottom structural enclosure designed for high-stress ergonomic load and internal electronics mounting. Features internal PCB standoff towers, snap-fit battery bay rails, and perimeter seal bevels.",
    volume: "42.8 cm³",
    infill: "25% Gyroid",
    layerHeight: "0.20 mm",
    estimatedPrintTime: "3h 45m",
    tolerances: "±0.15 mm snap fits",
    features: [
      "M3 heat-set brass threaded insert cavities",
      "Perimeter tongue-and-groove dust gasket channel",
      "Reinforced mechanical strain relief collar for audio harness",
      "Internal air baffle for thermal dissipation"
    ],
    hardwareStory: [
      {
        step: "01",
        title: "CAD DESIGN",
        description: "Parametric solid modeling in Fusion 360 with 1.8mm wall thicknesses, 2.5° draft angles, and clearance envelopes for battery packs."
      },
      {
        step: "02",
        title: "3D PRINT / FABRICATION",
        description: "Sliced with OrcaSlicer using gyroid infill for isotropic mechanical rigidity, printed in high-temp PETG at 245°C."
      },
      {
        step: "03",
        title: "ELECTRONICS INTEGRATION",
        description: "Installed M3 brass heat-set inserts using temperature-controlled soldering tip. Mounted ESP32-S3 module and wiring loom."
      },
      {
        step: "04",
        title: "REAL HARDWARE",
        description: "Complete physical enclosure assembly validated under shock drop tests and thermal logging under continuous processing."
      }
    ]
  },
  {
    id: "handle-outer-body",
    name: "Handle Outer Ergonomic Shell",
    cadCode: "CAD-PRT-002",
    category: "Ergonomic Grip",
    designedIn: "Autodesk Fusion 360",
    manufacturing: "FDM Additive 3D Printing",
    material: "PETG (Matte Industrial Slate)",
    dimensions: "122.0 × 44.5 × 38.0 mm",
    electronics: "Conduit Channel for Trigger Switch & Battery Bus Wiring",
    status: "FABRICATED & ASSEMBLED",
    fileUrl: "/models/HandleOuterBody.stl",
    fileType: "stl",
    description: "Contoured outer grip handle engineered for prolonged hand comfort and balanced center of gravity during field deployment. Integrates conduit pathways for internal battery harness wiring.",
    volume: "28.3 cm³",
    infill: "35% Cubic",
    layerHeight: "0.16 mm",
    estimatedPrintTime: "2h 30m",
    tolerances: "±0.10 mm slip collar",
    features: [
      "Curved palm-rest geometry with ribbed tactile knurling",
      "Internal wire routing channel with radius fillets to prevent wire chafing",
      "Keyed interlocking alignment notches preventing rotational slip",
      "Structural ribbing to prevent deflection under heavy grip pressure"
    ],
    hardwareStory: [
      {
        step: "01",
        title: "CAD DESIGN",
        description: "Sculpted ergonomic spline surfaces in Fusion 360 with continuous G2 surface curvature for palm grip."
      },
      {
        step: "02",
        title: "3D PRINT / FABRICATION",
        description: "Printed with 4 perimeters for structural sidewall strength; matte texture eliminates need for secondary sanding."
      },
      {
        step: "03",
        title: "ELECTRONICS INTEGRATION",
        description: "Routed 22 AWG power distribution wiring through the internal curved tunnel with silicone strain relief."
      },
      {
        step: "04",
        title: "REAL HARDWARE",
        description: "Interlocked with lower chassis and fastened with stainless M3 machine screws into captive collars."
      }
    ]
  },
  {
    id: "handle-cap-body",
    name: "Handle End-Cap & Retaining Mount",
    cadCode: "CAD-PRT-003",
    category: "Coupling & Retention",
    designedIn: "Autodesk Fusion 360",
    manufacturing: "FDM Additive 3D Printing",
    material: "PLA+ (Engineering Grade)",
    dimensions: "64.2 × 42.0 × 26.5 mm",
    electronics: "Mounting Recess for Status Indicator LED & Lanyard Eyelet",
    status: "FABRICATED & ASSEMBLED",
    fileUrl: "/models/HandleCapBody.stl",
    fileType: "stl",
    description: "Precision locking cap that seals the upper handle chamber and anchors the structural pivot pin. Designed with interference fit tolerances and captive fastener wells.",
    volume: "18.6 cm³",
    infill: "40% Rectilinear",
    layerHeight: "0.16 mm",
    estimatedPrintTime: "1h 50m",
    tolerances: "±0.12 mm captive hex socket",
    features: [
      "Countersunk fastener pockets for flush screw mounting",
      "Mechanical keying preventing 180° inversion during assembly",
      "Beveled chamfer perimeter for snag-free handling",
      "Dual o-ring groove for moisture resistance"
    ],
    hardwareStory: [
      {
        step: "01",
        title: "CAD DESIGN",
        description: "Engineered tight tolerance interference fits with 0.15mm offsets to ensure tool-less locking."
      },
      {
        step: "02",
        title: "3D PRINT / FABRICATION",
        description: "Printed horizontally to align layer lines with clamping stress axes, maximizing sheer tensile rating."
      },
      {
        step: "03",
        title: "ELECTRONICS INTEGRATION",
        description: "Fitted 3mm frosted status LED lens and soldered signal wires directly to main header."
      },
      {
        step: "04",
        title: "REAL HARDWARE",
        description: "Verified retention strength exceeding 12kg axial pull load without joint slippage."
      }
    ]
  },
  {
    id: "rear-access-panel",
    name: "Rear Electronics Access Hatch",
    cadCode: "CAD-PRT-004",
    category: "Service Cover",
    designedIn: "Autodesk Fusion 360",
    manufacturing: "FDM Additive 3D Printing",
    material: "PETG / Tough ABS",
    dimensions: "78.0 × 52.0 × 12.0 mm",
    electronics: "Cutouts for USB-C Programming Port & MicroSD Slot",
    status: "FABRICATED & VERIFIED",
    fileUrl: "/models/RearAccessPanelBody.stl",
    fileType: "stl",
    description: "Removable rear maintenance hatch allowing fast field access to diagnostic ports, SD cards, and JTAG debugging headers without full chassis disassembly.",
    volume: "9.2 cm³",
    infill: "20% Grid",
    layerHeight: "0.20 mm",
    estimatedPrintTime: "52m",
    tolerances: "±0.20 mm quick-release catch",
    features: [
      "Recessed thumb indentation for tool-less levering",
      "Dual captive retaining clips molded directly into perimeter",
      "Laser-engraved schematic pinout silkscreen recess",
      "0.8mm perimeter seal compression ridge"
    ],
    hardwareStory: [
      {
        step: "01",
        title: "CAD DESIGN",
        description: "Modeled flexible cantilever snap-fit tabs calculating permissible strain to prevent plastic fatigue."
      },
      {
        step: "02",
        title: "3D PRINT / FABRICATION",
        description: "Printed with 100% infill on snap tabs for elasticity and high fatigue life."
      },
      {
        step: "03",
        title: "ELECTRONICS INTEGRATION",
        description: "Precision alignment verified with USB-C connector breakout board on internal PCB."
      },
      {
        step: "04",
        title: "REAL HARDWARE",
        description: "Endured 500+ snap insertion cycles without tab deformation or loose fit."
      }
    ]
  },
  {
    id: "rover-body-solid",
    name: "AI Autonomous Rover Chassis Base",
    cadCode: "CAD-PRT-005",
    category: "Robotics Chassis",
    designedIn: "Autodesk Fusion 360",
    manufacturing: "FDM Additive 3D Printing",
    material: "PETG Heavy-Duty",
    dimensions: "165.0 × 110.0 × 42.0 mm",
    electronics: "Dual DC Geared Motor Mounts, H-Bridge Driver Bay & Ultrasonic Sensor Slot",
    status: "PROTOTYPED & ACTUATED",
    fileUrl: "/models/Body_Solid_Ankit.stl",
    fileType: "stl",
    description: "Main structural monocoque chassis for autonomous AI rover robot. Houses dual geared drive motors, motor driver PCB, battery bank, and front-facing obstacle avoidance sensors.",
    volume: "58.4 cm³",
    infill: "30% Gyroid",
    layerHeight: "0.20 mm",
    estimatedPrintTime: "4h 20m",
    tolerances: "±0.15 mm motor axles",
    features: [
      "Rigid motor bracket clamps with vibration dampers",
      "Under-chassis battery cradle for low center of gravity",
      "Front bumper sensor pocket for HC-SR04 sonar module",
      "Internal wiring pass-through tunnels"
    ],
    hardwareStory: [
      {
        step: "01",
        title: "CAD DESIGN",
        description: "Engineered low-center-of-gravity structural bed with integrated motor gearbox retaining brackets."
      },
      {
        step: "02",
        title: "3D PRINT / FABRICATION",
        description: "High-infill PETG print ensures impact resistance against physical wall collisions."
      },
      {
        step: "03",
        title: "ELECTRONICS INTEGRATION",
        description: "Mounted L298N motor driver, TT gear motors, optical wheel encoders, and power distribution rail."
      },
      {
        step: "04",
        title: "REAL HARDWARE",
        description: "Field tested over uneven indoor surfaces; validated zero chassis flex under dynamic steering torques."
      }
    ]
  },
  {
    id: "rover-lid-solid",
    name: "AI Autonomous Rover Top Cover & Sensor Deck",
    cadCode: "CAD-PRT-006",
    category: "Sensor Enclosure Deck",
    designedIn: "Autodesk Fusion 360",
    manufacturing: "FDM Additive 3D Printing",
    material: "Tough PLA / PETG",
    dimensions: "162.0 × 106.0 × 18.0 mm",
    electronics: "Microcontroller Mount, OLED Display Bezel & Antenna Clearance",
    status: "PROTOTYPED & ASSEMBLED",
    fileUrl: "/models/Lid_Solid_Ankit.stl",
    fileType: "stl",
    description: "Protective upper deck lid for autonomous rover. Protects internal computing boards while serving as an elevated mounting platform for vision cameras, displays, and telemetry antennas.",
    volume: "24.1 cm³",
    infill: "25% Grid",
    layerHeight: "0.20 mm",
    estimatedPrintTime: "2h 10m",
    tolerances: "±0.12 mm perimeter fit",
    features: [
      "I2C 0.96-inch OLED telemetry display window",
      "Perimeter fastener bosses aligned with base chassis",
      "Ventilation slots for motor driver cooling",
      "Top-mounted servo turntable pivot ring"
    ],
    hardwareStory: [
      {
        step: "01",
        title: "CAD DESIGN",
        description: "Designed flush interlocking perimeter lip with recessed fastener holes to shield internal circuits."
      },
      {
        step: "02",
        title: "3D PRINT / FABRICATION",
        description: "Fast 0.20mm layer height print with clean bridge overhangs over sensor window cutouts."
      },
      {
        step: "03",
        title: "ELECTRONICS INTEGRATION",
        description: "Fitted OLED status display and top-facing status LEDs wired to microcontroller I2C bus."
      },
      {
        step: "04",
        title: "REAL HARDWARE",
        description: "Completed full autonomous rover assembly; provides rapid single-screw top access for battery swapping."
      }
    ]
  }
];
