import React from 'react';

interface DiagramNode {
  id: string;
  label: string;
  sublabel: string;
  category: 'HARDWARE' | 'FIRMWARE' | 'AI / PROTOCOL' | 'BACKEND' | 'PHYSICAL ACTION';
  portIn?: string;
  portOut?: string;
  spec?: string;
}

interface TechnicalDiagramProps {
  projectId: string;
}

export const TechnicalDiagram: React.FC<TechnicalDiagramProps> = ({ projectId }) => {
  const getDiagramData = (): { title: string; protocol: string; nodes: DiagramNode[] } => {
    switch (projectId) {
      case 'friday':
        return {
          title: 'AUDIO INGESTION → DSP → EMBEDDED MCP PIPELINE',
          protocol: 'I2S DMA + JSON-RPC + FASTAPI',
          nodes: [
            {
              id: '01',
              label: 'INMP441 MEMS MIC',
              sublabel: 'Acoustic Sound Pressure Ingestion',
              category: 'HARDWARE',
              portOut: 'I2S BUS [24-bit / 44.1kHz]',
              spec: 'SNR: 61 dBA'
            },
            {
              id: '02',
              label: 'AUDIO PROCESSING',
              sublabel: 'DMA Buffer · Noise Gating · ESP-DSP',
              category: 'FIRMWARE',
              portIn: 'DMA RX IRQ',
              portOut: 'PCM STREAM',
              spec: 'Latency < 12ms'
            },
            {
              id: '03',
              label: 'AI ENGINE',
              sublabel: 'Gemini Live Multimodal API / Vosk Local',
              category: 'AI / PROTOCOL',
              portIn: 'WebSocket / TLS',
              portOut: 'INTENT JSON',
              spec: 'Token Streaming'
            },
            {
              id: '04',
              label: 'MCP SERVER',
              sublabel: 'Model Context Protocol Dispatcher',
              category: 'BACKEND',
              portIn: 'Stdio / RPC',
              portOut: 'DISPATCH BUS',
              spec: 'Strict Typing'
            },
            {
              id: '05',
              label: 'EXTERNAL TOOL',
              sublabel: 'Smart Home Node / Home Assistant / OS CLI',
              category: 'AI / PROTOCOL',
              portIn: 'REST / Serial',
              portOut: 'TRIGGER',
              spec: 'Zero Leakage'
            },
            {
              id: '06',
              label: 'PHYSICAL ACTION',
              sublabel: 'Hardware Relay / Audio Synthesis Output',
              category: 'PHYSICAL ACTION',
              portIn: 'GPIO / I2S DAC',
              spec: 'MAX98357A'
            }
          ]
        };

      case 'safex':
        return {
          title: '6-DoF SPATIAL SIMULATION & EVACUATION PIPELINE',
          protocol: 'ARCORE + UNITY C# + GIS MINE TELEMETRY',
          nodes: [
            {
              id: '01',
              label: 'OPERATOR / MINER',
              sublabel: 'Spatial Movement in Subterranean Corridor',
              category: 'HARDWARE',
              portOut: 'OPTICAL CAM [60 FPS]',
              spec: 'IMU Telemetry'
            },
            {
              id: '02',
              label: 'ARCORE TRACKING',
              sublabel: '6-DoF Visual Inertial Odometry (VIO)',
              category: 'FIRMWARE',
              portIn: 'Raw Camera + Gyro',
              portOut: 'POSE MATRIX',
              spec: 'Sub-cm Drift'
            },
            {
              id: '03',
              label: 'UNITY ENGINE',
              sublabel: 'Spatial Mine GIS Digital Twin Cutaway',
              category: 'BACKEND',
              portIn: 'Matrix4x4',
              portOut: 'SPATIAL MESH',
              spec: 'PBR Shaders'
            },
            {
              id: '04',
              label: 'TRAINING LOGIC',
              sublabel: 'Hazard Ingestion: Methane / Unstable Roof',
              category: 'AI / PROTOCOL',
              portIn: 'Trigger Volumes',
              portOut: 'RISK SCORE',
              spec: 'DGMS Compliant'
            },
            {
              id: '05',
              label: 'EMERGENCY RESPONSE',
              sublabel: 'Dynamic A* Pathfinding to Escape Refuge',
              category: 'FIRMWARE',
              portIn: 'Hazard Boundaries',
              portOut: 'WAYPOINT SPLINE',
              spec: 'Real-Time Calc'
            },
            {
              id: '06',
              label: 'CERTIFICATION',
              sublabel: 'Evacuation Readiness & Time-to-Safety Metric',
              category: 'PHYSICAL ACTION',
              portIn: 'Session Telemetry',
              spec: 'Zero Failure'
            }
          ]
        };

      case 'robotic-arm':
        return {
          title: 'KINEMATICS → S-CURVE TRAJECTORY → CLOSED-LOOP CONTROL',
          protocol: 'FABRIK IK + FREERTOS PWM + OPTICAL FEEDBACK',
          nodes: [
            {
              id: '01',
              label: 'TARGET POSE / COMMAND',
              sublabel: 'Cartesian Coordinate Waypoints [X, Y, Z, Pitch]',
              category: 'AI / PROTOCOL',
              portOut: 'CARTESIAN VECTOR',
              spec: '±0.05mm Goal'
            },
            {
              id: '02',
              label: 'INVERSE KINEMATICS',
              sublabel: 'Geometric Trigonometry / Numerical IK Solver',
              category: 'BACKEND',
              portIn: 'Target Vec3',
              portOut: 'JOINT ANGLES [θ1..θ5]',
              spec: 'No Singularity'
            },
            {
              id: '03',
              label: 'TRAJECTORY PLANNER',
              sublabel: 'S-Curve Acceleration / Deceleration Damping',
              category: 'FIRMWARE',
              portIn: 'Delta Theta',
              portOut: 'TIME SLICE VELOCITY',
              spec: 'Zero Jerk'
            },
            {
              id: '04',
              label: 'MOTOR CONTROLLER',
              sublabel: 'High-Torque Coreless Servos / Stepper PWM',
              category: 'HARDWARE',
              portIn: 'PWM Frequency Bus',
              portOut: 'ACTUATION TORQUE',
              spec: 'Current Limiter'
            },
            {
              id: '05',
              label: 'OPTICAL ENCODERS',
              sublabel: 'Absolute Joint Angle Feedback Loop',
              category: 'HARDWARE',
              portIn: 'Rotary Disk Pulse',
              portOut: 'CORRECTION VECTOR',
              spec: 'Closed-Loop'
            },
            {
              id: '06',
              label: 'PARALLEL GRIPPER',
              sublabel: 'Precision Workpiece Clamping & Release',
              category: 'PHYSICAL ACTION',
              portIn: 'Lead Screw / Limit',
              spec: '1.2kg Payload'
            }
          ]
        };

      case 'security-audit-vault':
        return {
          title: 'INCIDENT SEIZURE → WEB CRYPTO SHA-256 → WORM LEDGER PIPELINE',
          protocol: 'FIPS 180-4 SHA-256 + ISO/IEC 27037:2012 + PYTHON CLI',
          nodes: [
            {
              id: '01',
              label: 'CANON 1200D SENSOR',
              sublabel: '18MP Bit-Stream Acquisition Exhibit',
              category: 'HARDWARE',
              portOut: 'RAW / JPEG BITSTREAM',
              spec: 'ISO/IEC 27037'
            },
            {
              id: '02',
              label: 'WEB CRYPTO ENGINE',
              sublabel: 'Hardware-Accelerated In-Browser Digesting',
              category: 'FIRMWARE',
              portIn: 'FileReader ArrayBuffer',
              portOut: 'SHA-256 HEX DIGEST',
              spec: 'Zero-Upload'
            },
            {
              id: '03',
              label: 'WORM AUDIT LEDGER',
              sublabel: 'Forensic_Audit_Log.csv Immutable Append',
              category: 'BACKEND',
              portIn: 'Digest + Timestamp',
              portOut: 'IMMUTABLE LOG',
              spec: 'FRE 901(b)(9)'
            },
            {
              id: '04',
              label: 'MAGIC BYTE DISSECTOR',
              sublabel: 'Header Signature 0xFFD8FFE1 Validation',
              category: 'AI / PROTOCOL',
              portIn: 'Binary Offset 0x00',
              portOut: 'SPOOF CHECK',
              spec: 'Anti-Spoofing'
            },
            {
              id: '05',
              label: 'PYTHON CLI VERIFIER',
              sublabel: 'Automated Batch Integrity Audit Engine',
              category: 'SYSTEMS' as any,
              portIn: 'CLI --verify',
              portOut: 'AUDIT REPORT',
              spec: 'Sub-second'
            },
            {
              id: '06',
              label: 'COURT CERTIFICATE',
              sublabel: 'Official Legal Certificate of Authenticity',
              category: 'PHYSICAL ACTION',
              portIn: 'Attestation Block',
              spec: 'Signed PDF'
            }
          ]
        };

      case 'meditrace':
        return {
          title: 'CRYOGENIC IoT SENSING → MERKLE BLOCKCHAIN → SMART QUARANTINE',
          protocol: 'RTD TELEMETRICS + SHA-256 MERKLE + LEAFLET GEOSPATIAL',
          nodes: [
            {
              id: '01',
              label: 'CRYOGENIC LOGGERS',
              sublabel: 'Multi-Zone Thermal Sensors (-70°C to +8°C)',
              category: 'HARDWARE',
              portOut: 'BLE / LORAWAN TELEMETRY',
              spec: '±0.1°C Calibrated'
            },
            {
              id: '02',
              label: 'INGESTION GATEWAY',
              sublabel: 'Telemetry Normalization & Dropout Check',
              category: 'FIRMWARE',
              portIn: 'Sensor Payload',
              portOut: 'TIME-SERIES STREAM',
              spec: '10s Interval'
            },
            {
              id: '03',
              label: 'DIGITAL TWIN ENGINE',
              sublabel: 'Arrhenius Thermal Degradation & FEFO Model',
              category: 'BACKEND',
              portIn: 'Thermal Log',
              portOut: 'SHELF-LIFE SCORE',
              spec: 'Monte Carlo'
            },
            {
              id: '04',
              label: 'MERKLE PROVENANCE',
              sublabel: 'SHA-256 Distributed Block Verification',
              category: 'AI / PROTOCOL',
              portIn: 'Custody Handoff',
              portOut: 'MERKLE ROOT',
              spec: '21 CFR Part 11'
            },
            {
              id: '05',
              label: 'SMART CONTRACT',
              sublabel: 'Automated Excursion Quarantine Rules',
              category: 'AI / PROTOCOL',
              portIn: 'Threshold Breach',
              portOut: 'QUARANTINE LOCK',
              spec: '< 1s Trigger'
            },
            {
              id: '06',
              label: 'CONTROL TOWER',
              sublabel: 'Leaflet Global Transport Map & Rapid Recall',
              category: 'PHYSICAL ACTION',
              portIn: 'Fleet Coordinates',
              spec: '< 45s Isolation'
            }
          ]
        };

      case 'deployhub':
        return {
          title: 'ZIP INGESTION → DOCKER SOCKET DAEMON → PORT ROUTING PIPELINE',
          protocol: '/var/run/docker.sock + better-sqlite3 WAL + MONACO EDITOR',
          nodes: [
            {
              id: '01',
              label: 'ZIP INGESTION GATE',
              sublabel: 'Archive Upload with Zip-Slip Protection',
              category: 'HARDWARE',
              portOut: 'CLEAN ARCHIVE',
              spec: 'Sandboxed Root'
            },
            {
              id: '02',
              label: 'FRAMEWORK DETECTOR',
              sublabel: 'Auto-Inspect Next/Vite & Synthesize Dockerfile',
              category: 'FIRMWARE',
              portIn: 'Package JSON',
              portOut: 'COMPILED DOCKERFILE',
              spec: 'Multi-Stage'
            },
            {
              id: '03',
              label: 'PORT ALLOCATOR',
              sublabel: 'Scanning Free TCP Sockets (:3001 - :3999)',
              category: 'BACKEND',
              portIn: 'Socket Probe',
              portOut: 'UNOCCUPIED PORT',
              spec: 'Zero Conflict'
            },
            {
              id: '04',
              label: 'DOCKER ENGINE API',
              sublabel: 'Unix Domain Socket /var/run/docker.sock',
              category: 'AI / PROTOCOL',
              portIn: 'dockerode RPC',
              portOut: 'CONTAINER RUNTIME',
              spec: 'Native Daemon'
            },
            {
              id: '05',
              label: 'SQLITE WAL STATE',
              sublabel: 'better-sqlite3 Synchronous Metadata Store',
              category: 'BACKEND',
              portIn: 'Transaction Batch',
              portOut: 'STATE RECORD',
              spec: '< 0.8ms Query'
            },
            {
              id: '06',
              label: 'MONACO EDITOR',
              sublabel: 'In-Browser Direct Configuration & Live Logs',
              category: 'PHYSICAL ACTION',
              portIn: 'Caddyfile / Logs',
              spec: 'Zero-Downtime'
            }
          ]
        };

      case 'verisight-nx':
        return {
          title: 'BIOMETRIC GATEWAY → ENTITY LINK GRAPH → TACTICAL RADAR HUD',
          protocol: 'NEXT.JS 16 + THREE.JS WEBGL + RECHARTS TELEMETRY',
          nodes: [
            {
              id: '01',
              label: 'BIOMETRIC SCANNER',
              sublabel: '3D WebGL Particle Matrix & Token Gate',
              category: 'HARDWARE',
              portOut: 'AUTH TOKEN',
              spec: 'Level 5 Access'
            },
            {
              id: '02',
              label: 'ENTITY LINK GRAPH',
              sublabel: 'HTML5 Canvas Dynamic Physics Graphing',
              category: 'FIRMWARE',
              portIn: 'Transaction Payload',
              portOut: 'CONNECTED EDGES',
              spec: '40+ Nodes'
            },
            {
              id: '03',
              label: 'STREAM DECRYPTOR',
              sublabel: 'Live Threat Velocity Analytics & Anomaly Tag',
              category: 'BACKEND',
              portIn: 'Intrusion Stream',
              portOut: 'THREAT SCORE',
              spec: 'Real-Time'
            },
            {
              id: '04',
              label: 'EVIDENCE VAULT',
              sublabel: 'SHA-256 Checksums & Cold-Storage Ledger',
              category: 'AI / PROTOCOL',
              portIn: 'Forensic File',
              portOut: 'SEALED HASH',
              spec: 'FIPS 180-4'
            },
            {
              id: '05',
              label: 'TACTICAL RADAR',
              sublabel: 'Geofenced Boundary & Operative Vitals Feed',
              category: 'AI / PROTOCOL',
              portIn: 'GPS Telematics',
              portOut: 'RADAR SWEEP',
              spec: '360° Azimuth'
            },
            {
              id: '06',
              label: 'AI COPILOT DOCK',
              sublabel: 'Autonomous Threat Triage & Incident Report',
              category: 'PHYSICAL ACTION',
              portIn: 'Context Matrix',
              spec: 'Instant Action'
            }
          ]
        };

      case 'crop-recommendation':
        return {
          title: 'SOIL PROBE SENSING → ESP8266 Wi-Fi → THINGSPEAK CLOUD MATRIX',
          protocol: 'ANALOG ADC + HTTP GET UPDATE + AGRONOMIC DECISION ENGINE',
          nodes: [
            {
              id: '01',
              label: 'CAPACITIVE PROBES',
              sublabel: 'Soil Moisture, DHT11/22, Rain Detection',
              category: 'HARDWARE',
              portOut: 'ANALOG / DIGITAL VOLTS',
              spec: '0-100% Moisture'
            },
            {
              id: '02',
              label: 'ESP8266 NODEMCU',
              sublabel: 'Tensilica L106 ADC Conversion & Wi-Fi Client',
              category: 'FIRMWARE',
              portIn: 'ADC0 / GPIO Interrupt',
              portOut: 'NORMALIZED VALUES',
              spec: '802.11 b/g/n'
            },
            {
              id: '03',
              label: 'THINGSPEAK CLOUD',
              sublabel: 'HTTP GET Time-Series Logging (Fields 1-5)',
              category: 'BACKEND',
              portIn: 'REST Payload',
              portOut: 'TIME-SERIES LOG',
              spec: '15s Polling'
            },
            {
              id: '04',
              label: 'AGRONOMIC MATRIX',
              sublabel: 'Rule-Based Decision Trees for 9 Crop Classes',
              category: 'AI / PROTOCOL',
              portIn: 'Temp/Moist/Rain Data',
              portOut: 'CROP PREDICTION',
              spec: 'Agronomic Rules'
            },
            {
              id: '05',
              label: 'STATE RECOVERY',
              sublabel: 'Fault-Tolerant Wi-Fi Watchdog & Cache',
              category: 'AI / PROTOCOL',
              portIn: 'Network Ping',
              portOut: 'AUTO-RECONNECT',
              spec: 'Field Tested'
            },
            {
              id: '06',
              label: 'FARMER DASHBOARD',
              sublabel: 'Glassmorphic Gauge Dials & Planting Guidance',
              category: 'PHYSICAL ACTION',
              portIn: 'Cloud Response',
              spec: 'Rice / Wheat'
            }
          ]
        };

      case 'voice-ai-route-finder':
        return {
          title: 'ACOUSTIC VOICE INGESTION → HEURISTIC SEARCH → CANVAS ANIMATION',
          protocol: 'WEB AUDIO 16kHz PCM WAV + GOOGLE SPEECH NLP + A* ALGORITHM',
          nodes: [
            {
              id: '01',
              label: 'MICROPHONE AUDIO',
              sublabel: 'In-Browser Spoken Navigation Command Capture',
              category: 'HARDWARE',
              portOut: 'RAW PCM FLOAT32',
              spec: 'Web Audio API'
            },
            {
              id: '02',
              label: 'CLIENT TRANSCODER',
              sublabel: 'Zero-FFmpeg 16kHz 16-Bit Mono WAV Encoding',
              category: 'FIRMWARE',
              portIn: 'AudioBuffer Array',
              portOut: 'WAV BINARY BLOB',
              spec: '< 15ms Transcode'
            },
            {
              id: '03',
              label: 'SPEECH RECOGNITION',
              sublabel: 'Flask Backend Google Speech NLP Intent Parser',
              category: 'BACKEND',
              portIn: 'Audio Blob POST',
              portOut: 'INTENT JSON',
              spec: 'Node Selection'
            },
            {
              id: '04',
              label: 'A* HEURISTIC SOLVER',
              sublabel: 'Euclidean Distance Optimization f(n) = g(n) + h(n)',
              category: 'AI / PROTOCOL',
              portIn: 'Graph Adjacency',
              portOut: 'OPTIMAL PATH',
              spec: 'Guaranteed Min'
            },
            {
              id: '05',
              label: 'TRAFFIC IMPEDANCE',
              sublabel: 'Dynamic Road Impedance Multipliers (1.0x - 2.5x)',
              category: 'AI / PROTOCOL',
              portIn: 'Congestion Weights',
              portOut: 'ADJUSTED EDGES',
              spec: 'Expressways'
            },
            {
              id: '06',
              label: 'CANVAS ANIMATOR',
              sublabel: 'Interactive Step-by-Step Node Traversal Render',
              category: 'PHYSICAL ACTION',
              portIn: 'Path Vector Array',
              spec: '< 18ms Execution'
            }
          ]
        };

      case 'ar-mine':
        return {
          title: 'ARCORE SLAM SCANNING → PROCEDURAL TUNNEL → 1:1 SCALE ANCHOR',
          protocol: 'UNITY 6 URP + AR FOUNDATION 6.X + 6-DoF VIO TRACKING',
          nodes: [
            {
              id: '01',
              label: 'SLAM OPTICAL CAM',
              sublabel: 'Visual Inertial Odometry & Feature Detection',
              category: 'HARDWARE',
              portOut: 'FEATURE POINTS',
              spec: '6-DoF SLAM'
            },
            {
              id: '02',
              label: 'AR PLANE MANAGER',
              sublabel: 'Surface Normal Raycasting & Floor Boundary Lock',
              category: 'FIRMWARE',
              portIn: 'PointCloud Frame',
              portOut: 'HORIZONTAL PLANE',
              spec: 'ARCore 6.x'
            },
            {
              id: '03',
              label: 'TUNNEL GENERATOR',
              sublabel: 'MineGenerator.cs Procedural Rock & Steel Ribs',
              category: 'BACKEND',
              portIn: 'Anchor Vector',
              portOut: 'PROCEDURAL MESH',
              spec: '1:1 True Scale'
            },
            {
              id: '04',
              label: 'SPATIAL ANCHOR',
              sublabel: 'ARPlacementManager.cs World-Space Root Lock',
              category: 'AI / PROTOCOL',
              portIn: 'User Touch Ray',
              portOut: 'COORDINATE GIZMO',
              spec: 'Sub-cm Drift'
            },
            {
              id: '05',
              label: 'LIGHT ESTIMATOR',
              sublabel: 'Environmental HDR Lighting Reflection Match',
              category: 'AI / PROTOCOL',
              portIn: 'Ambient Lumens',
              portOut: 'URP SHADER PROPS',
              spec: 'Industrial PBR'
            },
            {
              id: '06',
              label: 'XR VISUALIZATION',
              sublabel: '1:1 Scale Underground Mine Spatial Navigation',
              category: 'PHYSICAL ACTION',
              portIn: 'Headset Viewport',
              spec: '60 FPS Mobile'
            }
          ]
        };

      case 'endangered-species':
        return {
          title: 'SPECIES CENSUS → SUPABASE DATABASE → PREDICTIVE CONSERVATION',
          protocol: 'SUPABASE POSTGRESQL + REACT 19 + RECHARTS DEMOGRAPHICS',
          nodes: [
            {
              id: '01',
              label: 'IUCN CENSUS DATA',
              sublabel: 'Species Population Count & Regional Enclaves',
              category: 'HARDWARE',
              portOut: 'SURVEY RECORDS',
              spec: 'Red List Tiers'
            },
            {
              id: '02',
              label: 'SUPABASE SQL',
              sublabel: 'Relational PostgreSQL Database (species_data)',
              category: 'FIRMWARE',
              portIn: 'SQL Migration',
              portOut: 'STRUCTURED RECORDS',
              spec: 'Cloud Relational'
            },
            {
              id: '03',
              label: 'PRESSURE CORRELATION',
              sublabel: 'Poaching Index & Habitat Fragmentation Factor',
              category: 'BACKEND',
              portIn: 'Threat Variables',
              portOut: 'EXTINCTION VELOCITY',
              spec: 'Multi-Factor'
            },
            {
              id: '04',
              label: 'TRAJECTORY MODEL',
              sublabel: '5-Year and 10-Year Population Forecasts',
              category: 'AI / PROTOCOL',
              portIn: 'Historical Census',
              portOut: 'REGRESSION SPLINES',
              spec: 'Recharts Curves'
            },
            {
              id: '05',
              label: 'URGENCY CLASSIFIER',
              sublabel: 'Categorization: Critical, Endangered, Vulnerable',
              category: 'AI / PROTOCOL',
              portIn: 'Predicted Trend',
              portOut: 'RISK THRESHOLD',
              spec: 'IUCN Standard'
            },
            {
              id: '06',
              label: 'CONSERVATION POLICY',
              sublabel: 'Actionable Sanctuary Corridors & Patrol Vectors',
              category: 'PHYSICAL ACTION',
              portIn: 'Recommendation Engine',
              spec: 'Targeted Actions'
            }
          ]
        };

      case 'smart-parking':
      default:
        return {
          title: 'ULTRASONIC SENSING → EDGE GATEWAY → MQTT DASHBOARD',
          protocol: 'HC-SR04 PULSE + PICO W MQTT + FASTAPI WEBSOCKET',
          nodes: [
            {
              id: '01',
              label: 'HC-SR04 TRANSDUCERS',
              sublabel: '40kHz Ultrasonic Ping / Echo Time-of-Flight',
              category: 'HARDWARE',
              portOut: 'TRIGGER / ECHO PULSE',
              spec: 'Range: 2cm-400cm'
            },
            {
              id: '02',
              label: 'RP2040 PICO W GATEWAY',
              sublabel: 'Dual ARM Cortex-M0+ · FreeRTOS Edge Filter',
              category: 'FIRMWARE',
              portIn: 'GPIO Interrupt IRQ',
              portOut: 'SLOT STATUS BYTE',
              spec: 'De-bounce 150ms'
            },
            {
              id: '03',
              label: 'LOCAL NETWORK',
              sublabel: '802.11 b/g/n Wi-Fi · MQTT Broker · TLS 1.3',
              category: 'AI / PROTOCOL',
              portIn: 'TCP Socket',
              portOut: 'MQTT PAYLOAD',
              spec: 'QoS 1 Deliver'
            },
            {
              id: '04',
              label: 'BACKEND SERVER',
              sublabel: 'FastAPI Telemetry Ingestion · SQLite DB',
              category: 'BACKEND',
              portIn: 'MQTT Subscriber',
              portOut: 'JSON BROADCAST',
              spec: 'Latency < 42ms'
            },
            {
              id: '05',
              label: 'EVENT DISPATCHER',
              sublabel: 'WebSocket / Server-Sent Events (SSE) Bus',
              category: 'AI / PROTOCOL',
              portIn: 'In-Memory Queue',
              portOut: 'CLIENT PUSH',
              spec: 'Zero Poll'
            },
            {
              id: '06',
              label: 'WEB DASHBOARD',
              sublabel: 'Real-Time Bay Availability & Parking Telemetry',
              category: 'PHYSICAL ACTION',
              portIn: 'DOM Render',
              spec: 'Live 60 FPS'
            }
          ]
        };
    }
  };

  const { title, protocol, nodes } = getDiagramData();

  return (
    <div 
      className="tech-bracket"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: '4px',
        padding: 'var(--space-xl)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Diagram Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: 'var(--space-xl)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 'var(--space-md)'
        }}
      >
        <div>
          <div className="tech-coord" style={{ color: 'var(--text-accent)', marginBottom: '4px' }}>
            TECHNICAL SCHEMATIC // HARDWARE-TO-SOFTWARE BUS
          </div>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            {title}
          </h4>
        </div>

        <div className="tech-badge" style={{ fontSize: '0.7rem' }}>
          <span>BUS: {protocol}</span>
        </div>
      </div>

      {/* Sequential Technical Flow with Directional Interconnects */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          position: 'relative'
        }}
      >
        {nodes.map((node, index) => {
          const isLast = index === nodes.length - 1;

          return (
            <div key={node.id} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Component Node Card */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: '14px',
                  alignItems: 'center',
                  padding: '14px 18px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  transition: 'border-color var(--transition-fast)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                {/* Index / Category */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-accent)', fontWeight: 700 }}>
                    STAGE {node.id}
                  </div>
                  <div className="tech-coord" style={{ fontSize: '0.62rem' }}>
                    {node.category}
                  </div>
                </div>

                {/* Core Component Specification */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {node.label}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {node.sublabel}
                  </div>
                </div>

                {/* Signal Specs & Ports */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {node.spec && (
                    <span className="tech-badge" style={{ fontSize: '0.68rem', alignSelf: 'flex-end' }}>
                      {node.spec}
                    </span>
                  )}
                  {node.portOut && (
                    <span className="tech-coord" style={{ color: 'var(--status-active)' }}>
                      OUT: {node.portOut}
                    </span>
                  )}
                </div>
              </div>

              {/* Interconnecting Signal Path Cable Line with Directional Arrow */}
              {!isLast && (
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '28px',
                    position: 'relative'
                  }}
                >
                  {/* Vertical signal line */}
                  <div 
                    style={{
                      width: '1.5px',
                      height: '100%',
                      backgroundColor: 'var(--border-accent-strong)',
                      position: 'relative'
                    }}
                  />
                  {/* Directional down arrow */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-accent)',
                      background: 'var(--bg-card)',
                      padding: '0 4px',
                      lineHeight: 1
                    }}
                  >
                    ↓
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schematic Footer */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'var(--space-xl)',
          paddingTop: 'var(--space-md)',
          borderTop: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-dim)'
        }}
      >
        <span>SIGNAL INTEGRITY: 100% // DETERMINISTIC EXECUTION</span>
        <span style={{ color: 'var(--text-accent)' }}>SCHEMATIC REV 02.4</span>
      </div>
    </div>
  );
};
