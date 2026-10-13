import React, { useRef, useEffect, useState, useCallback } from 'react';
import { formatDistance, MILESTONES, INITIAL_DISTANCE, MIN_DISTANCE, MAX_DISTANCE, ScaleMilestone, SupportedLanguage } from '../types';
import { Volume2, VolumeX, Maximize2, Info, ChevronRight, Sparkles } from 'lucide-react';

interface CanvasSimulatorProps {
  currentDistance: number;
  onDistanceChange: (newDistance: number) => void;
  isPlaying: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: SupportedLanguage;
  onOpenDetails: (milestone: ScaleMilestone) => void;
}

export const CanvasSimulator: React.FC<CanvasSimulatorProps> = ({
  currentDistance,
  onDistanceChange,
  isPlaying,
  soundEnabled,
  onToggleSound,
  language,
  onOpenDetails,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartDist, setDragStartDist] = useState(currentDistance);
  const [animTime, setAnimTime] = useState(0);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; vx: number; vy: number; type: 'n2' | 'o2' | 'bacteria'; size: number }>>([]);

  // Compute normalized zoom (0 = 2cm, 1 = 0.1nm)
  const logMax = Math.log10(MAX_DISTANCE);
  const logMin = Math.log10(MIN_DISTANCE);
  const currentLog = Math.log10(Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, currentDistance)));
  const normalizedZoom = Math.max(0, Math.min(1, (logMax - currentLog) / (logMax - logMin)));

  // Identify current milestone
  const currentMilestone = (() => {
    let best = MILESTONES[0];
    for (const m of MILESTONES) {
      if (currentDistance <= m.distanceMeters * 1.6) {
        best = m;
      }
    }
    return best;
  })();

  // Initialize background gas / bacteria particles
  useEffect(() => {
    const pts: Array<{ x: number; y: number; vx: number; vy: number; type: 'n2' | 'o2' | 'bacteria'; size: number }> = [];
    for (let i = 0; i < 40; i++) {
      pts.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        type: i < 28 ? 'n2' : i < 36 ? 'o2' : 'bacteria',
        size: i < 36 ? 3 + Math.random() * 2 : 12 + Math.random() * 6,
      });
    }
    setParticles(pts);
  }, []);

  // Animation frame loop for continuous particles and wave shimmer
  useEffect(() => {
    let animId: number;
    const loop = (t: number) => {
      setAnimTime(t * 0.001);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Main canvas render
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const t = animTime;

    // Clear background: deep dark space / lab darkroom
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Subtle background engineering grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Geometry of the two approaching surfaces:
    // Gap height on screen:
    // At zoom = 0 (1.5cm), gap is ~140px.
    // As we halve distance, visually we zoom in, so the visual gap remains scaled between ~60px and ~180px,
    // reflecting how in the video, the camera always zooms in as the fingers halve their distance!
    const baseVisualGap = 110 + Math.sin(t * 0.5) * 2;
    // When distance shrinks closer to quantum repulsion, gap closes slightly tighter:
    const visualGap = Math.max(50, baseVisualGap * (0.8 + 0.4 * (1 - normalizedZoom)));
    const centerY = height * 0.48;
    const topEdgeY = centerY - visualGap / 2;
    const bottomEdgeY = centerY + visualGap / 2;

    // -------------------------------------------------------------
    // TIER RENDERING BASED ON normalizedZoom [0, 1]
    // -------------------------------------------------------------

    // TIER 0: Macro Hand & Finger Contours (zoom: 0.0 -> 0.22)
    if (normalizedZoom < 0.25) {
      const alpha = Math.max(0, 1 - (normalizedZoom - 0.12) / 0.12);
      ctx.save();
      ctx.globalAlpha = Math.min(1, alpha);

      // Top finger (Index finger pointing down)
      const topGrad = ctx.createLinearGradient(0, 0, 0, topEdgeY);
      topGrad.addColorStop(0, '#f2a68d');
      topGrad.addColorStop(0.7, '#e2957a');
      topGrad.addColorStop(1, '#d07f66');

      ctx.fillStyle = topGrad;
      ctx.beginPath();
      // Anatomical finger shape
      const fingerWidth = Math.min(width * 0.55, 260);
      const centerX = width * 0.44;
      ctx.moveTo(centerX - fingerWidth * 0.6, 0);
      ctx.bezierCurveTo(
        centerX - fingerWidth * 0.55, topEdgeY * 0.5,
        centerX - fingerWidth * 0.4, topEdgeY - 10,
        centerX, topEdgeY
      );
      ctx.bezierCurveTo(
        centerX + fingerWidth * 0.4, topEdgeY - 10,
        centerX + fingerWidth * 0.55, topEdgeY * 0.5,
        centerX + fingerWidth * 0.6, 0
      );
      ctx.closePath();
      ctx.fill();

      // Fingernail highlight on top finger
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath();
      ctx.ellipse(centerX + fingerWidth * 0.15, topEdgeY * 0.4, 25, 45, Math.PI / 10, 0, Math.PI * 2);
      ctx.fill();

      // Bottom finger (Thumb pointing up)
      const botGrad = ctx.createLinearGradient(0, bottomEdgeY, 0, height);
      botGrad.addColorStop(0, '#d07f66');
      botGrad.addColorStop(0.3, '#e2957a');
      botGrad.addColorStop(1, '#f2a68d');

      ctx.fillStyle = botGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - fingerWidth * 0.6, height);
      ctx.bezierCurveTo(
        centerX - fingerWidth * 0.55, height - (height - bottomEdgeY) * 0.5,
        centerX - fingerWidth * 0.4, bottomEdgeY + 10,
        centerX, bottomEdgeY
      );
      ctx.bezierCurveTo(
        centerX + fingerWidth * 0.4, bottomEdgeY + 10,
        centerX + fingerWidth * 0.55, height - (height - bottomEdgeY) * 0.5,
        centerX + fingerWidth * 0.6, height
      );
      ctx.closePath();
      ctx.fill();

      // Subtle skin crease lines
      ctx.strokeStyle = 'rgba(160, 70, 50, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, topEdgeY - i * 18, 50 + i * 20, 0.1, Math.PI - 0.1);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, bottomEdgeY + i * 18, 50 + i * 20, Math.PI + 0.1, Math.PI * 2 - 0.1);
        ctx.stroke();
      }

      ctx.restore();
    }

    // TIER 1 & 2: Papillary Ridges (Fingerprint & Sweat Ducts) (zoom: 0.15 -> 0.48)
    if (normalizedZoom >= 0.15 && normalizedZoom <= 0.52) {
      const fadeIn = Math.min(1, (normalizedZoom - 0.15) / 0.08);
      const fadeOut = Math.max(0, 1 - (normalizedZoom - 0.42) / 0.1);
      const alpha = fadeIn * fadeOut;

      ctx.save();
      ctx.globalAlpha = alpha;

      const waveCount = 14;
      const waveWidth = width / waveCount;
      const ridgeHeight = 16;

      // Draw Top Fingerprint Ridges
      ctx.fillStyle = '#dc8870';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, topEdgeY - 20);
      for (let i = 0; i <= waveCount; i++) {
        const x = i * waveWidth;
        const crestY = topEdgeY + (i % 2 === 0 ? 0 : -ridgeHeight);
        ctx.quadraticCurveTo(x - waveWidth * 0.5, crestY + (i % 2 === 0 ? 4 : -4), x, crestY);
      }
      ctx.lineTo(width, 0);
      ctx.closePath();
      ctx.fill();

      // Top ridge internal layered strata lines
      ctx.strokeStyle = 'rgba(180, 80, 60, 0.45)';
      ctx.lineWidth = 1.8;
      for (let layer = 1; layer <= 6; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, topEdgeY - layer * 16);
        for (let i = 0; i <= waveCount; i++) {
          const x = i * waveWidth;
          const y = topEdgeY - layer * 16 + (i % 2 === 0 ? 0 : -ridgeHeight * 0.7);
          ctx.quadraticCurveTo(x - waveWidth * 0.5, y + 4, x, y);
        }
        ctx.stroke();
      }

      // Draw Bottom Fingerprint Ridges
      ctx.fillStyle = '#dc8870';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, bottomEdgeY + 20);
      for (let i = 0; i <= waveCount; i++) {
        const x = i * waveWidth;
        const crestY = bottomEdgeY + (i % 2 === 0 ? 0 : ridgeHeight);
        ctx.quadraticCurveTo(x - waveWidth * 0.5, crestY + (i % 2 === 0 ? -4 : 4), x, crestY);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Bottom strata lines
      for (let layer = 1; layer <= 6; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, bottomEdgeY + layer * 16);
        for (let i = 0; i <= waveCount; i++) {
          const x = i * waveWidth;
          const y = bottomEdgeY + layer * 16 + (i % 2 === 0 ? 0 : ridgeHeight * 0.7);
          ctx.quadraticCurveTo(x - waveWidth * 0.5, y - 4, x, y);
        }
        ctx.stroke();
      }

      // Sweat gland spiral ducts (汗孔 & 汗腺管) - authentic to video!
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2;
      for (let i = 1; i < waveCount; i += 2) {
        const poreX = i * waveWidth;
        // Top spiraling duct
        ctx.beginPath();
        ctx.moveTo(poreX, topEdgeY - ridgeHeight);
        for (let k = 0; k < 6; k++) {
          const dy = topEdgeY - ridgeHeight - k * 14;
          const dx = poreX + Math.sin(k * 1.6 + t) * 7;
          ctx.lineTo(dx, dy);
        }
        ctx.stroke();

        // Sweat pore droplet shimmer on crest
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(poreX, topEdgeY - ridgeHeight + 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Bottom spiraling duct
        ctx.beginPath();
        ctx.moveTo(poreX, bottomEdgeY + ridgeHeight);
        for (let k = 0; k < 6; k++) {
          const dy = bottomEdgeY + ridgeHeight + k * 14;
          const dx = poreX + Math.sin(k * 1.6 - t) * 7;
          ctx.lineTo(dx, dy);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(poreX, bottomEdgeY + ridgeHeight - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // TIER 3: Corneocyte Cells & Bacteria (zoom: 0.40 -> 0.65)
    if (normalizedZoom >= 0.38 && normalizedZoom <= 0.68) {
      const fadeIn = Math.min(1, (normalizedZoom - 0.38) / 0.08);
      const fadeOut = Math.max(0, 1 - (normalizedZoom - 0.60) / 0.08);
      const alpha = fadeIn * fadeOut;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Corneocyte layered brick wall pattern (top surface)
      const brickH = 18;
      const brickW = 75;
      const rows = 10;

      for (let r = 0; r < rows; r++) {
        const y = topEdgeY - (r + 1) * brickH;
        const xOffset = (r % 2) * (brickW * 0.5);
        for (let x = -brickW; x < width + brickW; x += brickW) {
          ctx.fillStyle = r === 0 ? '#d97768' : '#c9685a';
          ctx.strokeStyle = '#a64d40';
          ctx.lineWidth = 1.5;
          ctx.fillRect(x + xOffset + 1, y + 1, brickW - 2, brickH - 2);
          ctx.strokeRect(x + xOffset + 1, y + 1, brickW - 2, brickH - 2);

          // Subtle keratin filament texture within cell
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.fillRect(x + xOffset + 6, y + 5, brickW - 12, 2);
          ctx.fillRect(x + xOffset + 10, y + 11, brickW - 18, 2);
        }
      }

      // Corneocyte layered brick wall pattern (bottom surface)
      for (let r = 0; r < rows; r++) {
        const y = bottomEdgeY + r * brickH;
        const xOffset = (r % 2) * (brickW * 0.5);
        for (let x = -brickW; x < width + brickW; x += brickW) {
          ctx.fillStyle = r === 0 ? '#d97768' : '#c9685a';
          ctx.strokeStyle = '#a64d40';
          ctx.lineWidth = 1.5;
          ctx.fillRect(x + xOffset + 1, y + 1, brickW - 2, brickH - 2);
          ctx.strokeRect(x + xOffset + 1, y + 1, brickW - 2, brickH - 2);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.fillRect(x + xOffset + 6, y + 5, brickW - 12, 2);
          ctx.fillRect(x + xOffset + 10, y + 11, brickW - 18, 2);
        }
      }

      // Floating / colonizing bacteria (Staphylococcus epidermidis - purple spheres as in video)
      particles.forEach((p, idx) => {
        if (p.type === 'bacteria' || idx % 3 === 0) {
          const bx = (p.x + Math.sin(t + idx) * 15) % (width - 40) + 20;
          // Confine to gap area or near cell surface
          const by = topEdgeY + 8 + ((idx * 23) % (visualGap - 16));

          // Draw round purple bacterium
          const rad = 7 + (idx % 4);
          const bGrad = ctx.createRadialGradient(bx - rad * 0.3, by - rad * 0.3, 1, bx, by, rad);
          bGrad.addColorStop(0, '#c084fc');
          bGrad.addColorStop(0.6, '#9333ea');
          bGrad.addColorStop(1, '#581c87');

          ctx.fillStyle = bGrad;
          ctx.beginPath();
          ctx.arc(bx, by, rad, 0, Math.PI * 2);
          ctx.fill();

          // Bacterial cell membrane glow
          ctx.strokeStyle = '#e9d5ff';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      ctx.restore();
    }

    // TIER 4: Keratin Nanofilament Bundles (zoom: 0.58 -> 0.78)
    if (normalizedZoom >= 0.56 && normalizedZoom <= 0.80) {
      const fadeIn = Math.min(1, (normalizedZoom - 0.56) / 0.08);
      const fadeOut = Math.max(0, 1 - (normalizedZoom - 0.72) / 0.08);
      const alpha = fadeIn * fadeOut;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Background matrix inside keratinized cell
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(0, 0, width, topEdgeY);
      ctx.fillRect(0, bottomEdgeY, width, height - bottomEdgeY);

      // Microfibril circular cross-sections (exactly matching the authentic video at 0:26!)
      const fiberSpacing = 24;
      const fiberRadius = 7;

      for (let y = topEdgeY - 14; y > 0; y -= fiberSpacing) {
        for (let x = 14; x < width; x += fiberSpacing) {
          // Circular filament cross-section
          ctx.fillStyle = '#fda4af';
          ctx.beginPath();
          ctx.arc(x, y, fiberRadius, 0, Math.PI * 2);
          ctx.fill();

          // Inner sub-core dots of alpha-helix keratin
          ctx.fillStyle = '#9f1239';
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let y = bottomEdgeY + 14; y < height; y += fiberSpacing) {
        for (let x = 14; x < width; x += fiberSpacing) {
          ctx.fillStyle = '#fda4af';
          ctx.beginPath();
          ctx.arc(x, y, fiberRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#9f1239';
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Longitudinal keratin fibrils in the border zone
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, topEdgeY - 4 - i * 6);
        ctx.lineTo(width, topEdgeY - 4 - i * 6);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, bottomEdgeY + 4 + i * 6);
        ctx.lineTo(width, bottomEdgeY + 4 + i * 6);
        ctx.stroke();
      }

      ctx.restore();
    }

    // TIER 5: Lipid Bilayers & Flying Gas Molecules (zoom: 0.70 -> 0.88)
    if (normalizedZoom >= 0.68 && normalizedZoom <= 0.90) {
      const fadeIn = Math.min(1, (normalizedZoom - 0.68) / 0.08);
      const fadeOut = Math.max(0, 1 - (normalizedZoom - 0.84) / 0.06);
      const alpha = fadeIn * fadeOut;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Lipid bilayer: Polar heads (golden spheres) and zigzag hydrocarbon tails (C-H)
      const headRadius = 6;
      const headSpacing = 16;

      // Top lipid layer
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#f59e0b';
      for (let x = 8; x < width; x += headSpacing) {
        // Polar head
        ctx.beginPath();
        ctx.arc(x, topEdgeY - 4, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Zigzag fatty acid tails going upward
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 2, topEdgeY - 10);
        ctx.lineTo(x - 5, topEdgeY - 18);
        ctx.lineTo(x, topEdgeY - 26);
        ctx.lineTo(x - 4, topEdgeY - 34);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 2, topEdgeY - 10);
        ctx.lineTo(x + 6, topEdgeY - 18);
        ctx.lineTo(x + 2, topEdgeY - 26);
        ctx.lineTo(x + 5, topEdgeY - 34);
        ctx.stroke();
      }

      // Bottom lipid layer
      ctx.fillStyle = '#fbbf24';
      for (let x = 8; x < width; x += headSpacing) {
        ctx.beginPath();
        ctx.arc(x, bottomEdgeY + 4, headRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 2, bottomEdgeY + 10);
        ctx.lineTo(x - 5, bottomEdgeY + 18);
        ctx.lineTo(x, bottomEdgeY + 26);
        ctx.lineTo(x - 4, bottomEdgeY + 34);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 2, bottomEdgeY + 10);
        ctx.lineTo(x + 6, bottomEdgeY + 18);
        ctx.lineTo(x + 2, bottomEdgeY + 26);
        ctx.lineTo(x + 5, bottomEdgeY + 34);
        ctx.stroke();
      }

      // High-speed air gas molecules (N2 cyan and O2 crimson dumbbells) in the gap
      particles.forEach((p, idx) => {
        if (p.type !== 'bacteria') {
          // Rapid thermal bounce in the gap
          const speed = 4;
          const px = (p.x + t * 90 * p.vx * speed) % width;
          const py = topEdgeY + 14 + (Math.abs(Math.sin(t * 3 + idx)) * (visualGap - 28));

          const isN2 = p.type === 'n2';
          ctx.fillStyle = isN2 ? '#38bdf8' : '#f43f5e';

          // Diatomic dumbbell pair
          const theta = t * 6 + idx;
          const bondDist = 5;
          const x1 = px + Math.cos(theta) * bondDist;
          const y1 = py + Math.sin(theta) * bondDist;
          const x2 = px - Math.cos(theta) * bondDist;
          const y2 = py - Math.sin(theta) * bondDist;

          ctx.beginPath();
          ctx.arc(x1, y1, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x2, y2, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255,255,255,0.6)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      });

      ctx.restore();
    }

    // TIER 6: Single Atom (Au 0.332 nm) & Electron Orbitals (zoom: 0.82 -> 1.0)
    if (normalizedZoom >= 0.80) {
      const fadeIn = Math.min(1, (normalizedZoom - 0.80) / 0.08);
      ctx.save();
      ctx.globalAlpha = fadeIn;

      const centerX = width * 0.44;
      const atomRadius = 45;

      // Glowing atom in the gap (Au Gold / Biomolecular atom)
      const atomGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, atomRadius);
      atomGrad.addColorStop(0, '#ffffff');
      atomGrad.addColorStop(0.2, '#fde047');
      atomGrad.addColorStop(0.6, '#eab308');
      atomGrad.addColorStop(0.9, 'rgba(234, 179, 8, 0.4)');
      atomGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = atomGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, atomRadius, 0, Math.PI * 2);
      ctx.fill();

      // Electron probability density wave ripples around atom
      for (let wave = 1; wave <= 4; wave++) {
        const r = atomRadius + wave * 16 + Math.sin(t * 4 + wave) * 3;
        ctx.strokeStyle = `rgba(253, 224, 71, ${0.4 - wave * 0.08})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Atom label matching video: "Au・金の原子 0.332 nm"
      ctx.fillStyle = '#fde047';
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        language === 'pl' ? 'Au · Złoto / Atom skóry' : language === 'uk' ? 'Au · Золото / Атом шкіри' : 'Au · Gold / Skin atom',
        centerX,
        centerY - atomRadius - 16
      );
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillText('Ø 0.332 nm (3.32 Å)', centerX, centerY - atomRadius - 2);

      // Approaching atomic lattice boundaries on top and bottom
      const latticeSpacing = 36;
      for (let lx = 20; lx < width; lx += latticeSpacing) {
        // Top boundary atoms
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.arc(lx, topEdgeY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Bottom boundary atoms
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.arc(lx, bottomEdgeY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }

    // TIER 7: Quantum Repulsion & Pauli Exclusion Field (zoom: 0.92 -> 1.0)
    if (normalizedZoom >= 0.90) {
      const fieldIntensity = (normalizedZoom - 0.90) / 0.10;
      ctx.save();
      ctx.globalAlpha = fieldIntensity;

      // Coulomb repulsion electric field arcs (hyperbolic equipotential field lines)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15;

      const numArcs = 7;
      for (let a = -numArcs; a <= numArcs; a++) {
        const ax = width * 0.44 + a * 35;
        ctx.beginPath();
        ctx.moveTo(ax - 20, topEdgeY + 6);
        ctx.bezierCurveTo(
          ax - 10, centerY - 6 + Math.sin(t * 8 + a) * 4,
          ax + 10, centerY + 6 + Math.cos(t * 8 + a) * 4,
          ax + 20, bottomEdgeY - 6
        );
        ctx.stroke();
      }

      // Energy barrier aura
      const barrierGrad = ctx.createLinearGradient(0, topEdgeY, 0, bottomEdgeY);
      barrierGrad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
      barrierGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.45)');
      barrierGrad.addColorStop(1, 'rgba(239, 68, 68, 0.25)');

      ctx.fillStyle = barrierGrad;
      ctx.fillRect(0, topEdgeY, width, visualGap);

      // Warning text in quantum barrier
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fee2e2';
      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        language === 'pl'
          ? '⚡ BARIERA KWANTOWA: ZAKAZ PAULIEGO I ODPYCHANIE KULOMBOWSKIE'
          : language === 'uk'
          ? '⚡ КВАНТОВИЙ БАР\'ЄР: ПРИНЦИП ПАУЛІ ТА КУЛОНІВСЬКЕ ВІДШТОВХУВАННЯ'
          : '⚡ QUANTUM BARRIER: PAULI EXCLUSION & COULOMB REPULSION',
        width * 0.44,
        centerY + 34
      );

      ctx.restore();
    }

    // -------------------------------------------------------------
    // SCIENTIFIC MEASUREMENT HUD (Authentic to the video)
    // -------------------------------------------------------------

    // Left indicator labels:
    // Upper finger indicator: ▲ Wskazujący / Вказівний палець / Index Finger
    // Lower finger indicator: ▼ Kciuk / Великий палець / Thumb
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('▲ ' + (language === 'pl' ? 'Palec wskazujący' : language === 'uk' ? 'Вказівний палець' : 'Index Finger'), 24, topEdgeY - 14);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('▼ ' + (language === 'pl' ? 'Kciuk' : language === 'uk' ? 'Великий палець' : 'Thumb'), 24, bottomEdgeY + 24);

    // Vertical measurement line with center diamond `◇` cursor
    // Positioned at X = width * 0.76 (just like in the video)
    const measureX = Math.min(width - 90, width * 0.74);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(measureX, topEdgeY);
    ctx.lineTo(measureX, bottomEdgeY);
    ctx.stroke();

    // Top horizontal tick and arrow
    ctx.beginPath();
    ctx.moveTo(measureX - 8, topEdgeY);
    ctx.lineTo(measureX + 8, topEdgeY);
    ctx.moveTo(measureX - 4, topEdgeY + 6);
    ctx.lineTo(measureX, topEdgeY);
    ctx.lineTo(measureX + 4, topEdgeY + 6);
    ctx.stroke();

    // Bottom horizontal tick and arrow
    ctx.beginPath();
    ctx.moveTo(measureX - 8, bottomEdgeY);
    ctx.lineTo(measureX + 8, bottomEdgeY);
    ctx.moveTo(measureX - 4, bottomEdgeY - 6);
    ctx.lineTo(measureX, bottomEdgeY);
    ctx.lineTo(measureX + 4, bottomEdgeY - 6);
    ctx.stroke();

    // Center diamond `◇`
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const dSize = 5;
    ctx.moveTo(measureX, centerY - dSize);
    ctx.lineTo(measureX + dSize, centerY);
    ctx.lineTo(measureX, centerY + dSize);
    ctx.lineTo(measureX - dSize, centerY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Formatted distance display right next to the measurement line
    const formatted = formatDistance(currentDistance);

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
    ctx.shadowBlur = 8;
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(formatted.full, measureX + 16, centerY + 6);

    ctx.shadowBlur = 0;

    // Scale reference bar in bottom right corner (e.g. 2.00 cm, 500 µm, 10 nm)
    const scaleBarWidth = 70;
    const scaleBarX = width - scaleBarWidth - 28;
    const scaleBarY = height - 28;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scaleBarX, scaleBarY);
    ctx.lineTo(scaleBarX + scaleBarWidth, scaleBarY);
    // End ticks
    ctx.moveTo(scaleBarX, scaleBarY - 6);
    ctx.lineTo(scaleBarX, scaleBarY + 6);
    ctx.moveTo(scaleBarX + scaleBarWidth, scaleBarY - 6);
    ctx.lineTo(scaleBarX + scaleBarWidth, scaleBarY + 6);
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(currentMilestone.scaleBarLabel, scaleBarX + scaleBarWidth / 2, scaleBarY - 10);

    ctx.restore();
  }, [currentDistance, normalizedZoom, currentMilestone, animTime, particles, language]);

  // Redraw when size changes or state updates
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      renderCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Touch and mouse drag interaction: physically pull or push the fingers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartDist(currentDistance);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY;
    // Moving up decreases distance, moving down increases distance
    // Scale exponentially:
    const factor = Math.pow(1.015, -deltaY);
    const newDist = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, dragStartDist * factor));
    onDistanceChange(newDist);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.85;
    const newDist = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, currentDistance * factor));
    onDistanceChange(newDist);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none cursor-ns-resize"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* Interactive HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />

      {/* Top overlay toolbar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-mono text-slate-300 flex items-center gap-2 shadow-sm">
            <span className="text-amber-400 font-semibold">2,400-year Paradox</span>
            <span className="text-slate-500">|</span>
            <span>
              n = {Math.max(0, Math.round(Math.log2(INITIAL_DISTANCE / Math.max(MIN_DISTANCE, currentDistance))))}{' '}
              {language === 'pl' ? 'podziałów' : language === 'uk' ? 'поділів' : 'divisions'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md transition-colors"
            title={soundEnabled ? (language === 'pl' ? 'Wycisz dźwięk' : language === 'uk' ? 'Вимкнути звук' : 'Mute sound') : (language === 'pl' ? 'Włącz dźwięk' : language === 'uk' ? 'Увімкнути звук' : 'Unmute sound')}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Authentically Styled Japanese Science Card (just like in the video at 0:09, 0:15, 0:22, 0:36) */}
      <div className="absolute bottom-5 left-5 max-w-sm pointer-events-auto transition-all duration-300">
        <div className="p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/70 shadow-2xl text-left">
          {/* Card header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                {currentMilestone.japaneseTag}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-medium text-slate-200">
                {language === 'pl' ? currentMilestone.namePl : language === 'uk' ? currentMilestone.nameUk : currentMilestone.nameEn}
              </span>
            </div>
            <button
              onClick={() => onOpenDetails(currentMilestone)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors cursor-pointer"
            >
              <span>{language === 'pl' ? 'Szczegóły' : language === 'uk' ? 'Деталі' : 'Details'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card description */}
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'pl' ? currentMilestone.descriptionPl : language === 'uk' ? currentMilestone.descriptionUk : currentMilestone.descriptionEn}
          </p>

          {/* Micro indicators */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>{language === 'pl' ? 'Skala' : language === 'uk' ? 'Масштаб' : 'Scale'}: {currentMilestone.scaleBarLabel}</span>
            </div>
            <span className="text-slate-500">
              {(normalizedZoom * 100).toFixed(0)}% zoom
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Drag hint when stationary */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none opacity-40 hover:opacity-100 transition-opacity hidden md:flex flex-col items-center gap-1 text-[10px] font-mono text-slate-400">
        <span>▲</span>
        <span>{language === 'pl' ? 'Przeciągnij' : language === 'uk' ? 'Тягніть' : 'Drag'}</span>
        <span>▼</span>
      </div>
    </div>
  );
};
