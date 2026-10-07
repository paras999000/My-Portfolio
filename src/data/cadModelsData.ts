export interface CadModelItem {
  id: string;
  name: string;
  cadCode: string;
  category: string;
  fileUrl: string;
  fileType: "stl" | "gltf" | "procedural";
  description: string;
  dimensions: string;
  volume: string;
  material: string;
  infill: string;
  layerHeight: string;
  estimatedPrintTime: string;
  tolerances: string;
  features: string[];
}

export const cadModelsData: CadModelItem[] = [
  {
    id: "lower-shell-body",
    name: "Lower Shell Housing Chassis",
    cadCode: "CAD-PRT-001",
    category: "Structural Enclosure",
    fileUrl: "/models/LowerShellBody.stl",
    fileType: "stl",
    description: "Primary bottom structural enclosure designed for high-stress ergonomic load and internal electronics mounting. Features internal PCB standoff towers, snap-fit battery bay rails, and perimeter seal bevels.",
    dimensions: "148.4 × 82.2 × 34.6 mm",
    volume: "42.8 cm³",
    material: "PETG / Tough PLA",
    infill: "25% Gyroid",
    layerHeight: "0.20 mm",
    estimatedPrintTime: "3h 45m",
    tolerances: "±0.15 mm snap fits",
    features: [
      "M3 heat-set threaded insert cavities",
      "Perimeter tongue-and-groove dust gasket channel",
      "Reinforced mechanical strain relief collar",
      "Ventilation louvers with internal dust baffles"
    ]
  },
  {
    id: "handle-outer-body",
    name: "Handle Outer Ergonomic Shell",
    cadCode: "CAD-PRT-002",
    category: "Ergonomic Grip",
    fileUrl: "/models/HandleOuterBody.stl",
    fileType: "stl",
    description: "Contoured outer grip handle engineered for prolonged hand comfort and balanced center of gravity during field deployment. Integrates conduit pathways for internal battery harness wiring.",
    dimensions: "122.0 × 44.5 × 38.0 mm",
    volume: "28.3 cm³",
    material: "PETG (Matte Carbon)",
    infill: "35% Cubic",
    layerHeight: "0.16 mm",
    estimatedPrintTime: "2h 30m",
    tolerances: "±0.10 mm slip collar",
    features: [
      "Curved palm-rest geometry with ribbed tactile knurling",
      "Internal wire routing channel with radius fillets",
      "Keyed interlocking alignment notches",
      "Structural ribbing to prevent deflection under grip pressure"
    ]
  },
  {
    id: "handle-cap-body",
    name: "Handle End-Cap & Retaining Mount",
    cadCode: "CAD-PRT-003",
    category: "Coupling & Retention",
    fileUrl: "/models/HandleCapBody.stl",
    fileType: "stl",
    description: "Precision locking cap that seals the upper handle chamber and anchors the structural pivot pin. Designed with interference fit tolerances and captive fastener wells.",
    dimensions: "64.2 × 42.0 × 26.5 mm",
    volume: "18.6 cm³",
    material: "PLA+ (Engineering Grade)",
    infill: "40% Rectilinear",
    layerHeight: "0.16 mm",
    estimatedPrintTime: "1h 50m",
    tolerances: "±0.12 mm captive hex socket",
    features: [
      "Countersunk fastener pockets for flush screw mounting",
      "Mechanical keying preventing 180° inversion",
      "Beveled chamfer perimeter for snag-free holstering",
      "Dual o-ring groove for moisture resistance"
    ]
  },
  {
    id: "rear-access-panel",
    name: "Rear Electronics Access Hatch",
    cadCode: "CAD-PRT-004",
    category: "Service Cover",
    fileUrl: "/models/RearAccessPanelBody.stl",
    fileType: "stl",
    description: "Removable rear maintenance hatch allowing fast field access to diagnostic ports, SD cards, and JTAG debugging headers without full chassis disassembly.",
    dimensions: "78.0 × 52.0 × 12.0 mm",
    volume: "9.2 cm³",
    material: "PETG / ABS",
    infill: "20% Grid",
    layerHeight: "0.20 mm",
    estimatedPrintTime: "52m",
    tolerances: "±0.20 mm quick-release catch",
    features: [
      "Recessed thumb indentation for tool-less levering",
      "Dual captive retaining clips",
      "Laser-engraved schematic pinout silkscreen recess",
      "0.8mm perimeter seal compression ridge"
    ]
  }
];
