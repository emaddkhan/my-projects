import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer";
import { useInView } from "framer-motion";

function modulo(value, length) {
  return (value % length + length) % length;
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function CurvedGalleryArc(props) {
  const {
    images = [
      { src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg", alt: "Gradient 5 - Green" },
      { src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg", alt: "Gradient 4 - Yellow" },
      { src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg", alt: "Gradient 3 - Orange" }
    ],
    backgroundColor, cardSize, gap, curve, perspective, autoScrollSpeed, dragSpeed, inertia, borderRadius, style
  } = props;

  const rootRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const sizeRef = React.useRef({ width: 800, height: 450 });
  const [tick, setTick] = React.useState(0);
  const isStaticRenderer = useIsStaticRenderer();
  const inView = useInView(rootRef, { amount: .05 });
  const motionRef = React.useRef({ offset: 0, velocity: autoScrollSpeed, dragging: false, pointerId: -1, lastX: 0, samples: [], lastTime: 0 });

  const cleanImages = React.useMemo(() => {
    return (images || []).filter(img => img && img.src);
  }, [images]);

  const cardHeight = React.useMemo(() => cardSize * 1.28, [cardSize]);
  const span = React.useMemo(() => Math.max(1, cardSize + gap), [cardSize, gap]);
  const hasImages = cleanImages.length > 0;

  const geometry = React.useMemo(() => {
    const curveStrength = Math.min(1, Math.abs(curve) / 300);
    const sign = curve < 0 ? -1 : 1;
    const count = Math.max(10, Math.min(40, Math.ceil(sizeRef.current.width / span) + 10));
    const half = Math.floor(count / 2);
    const baseAngleStep = curveStrength === 0 ? 0 : .04 + curveStrength * .2;
    const baseMaxTheta = half * baseAngleStep;
    let angleStep = baseAngleStep;

    if (sign === 1 && curveStrength > 0 && half > 0) {
      const wrapBlend = Math.pow(curveStrength, 2.2);
      const targetMaxTheta = Math.PI * 2 * .98;
      const blendedMaxTheta = baseMaxTheta * (1 - wrapBlend) + targetMaxTheta * wrapBlend;
      angleStep = blendedMaxTheta / half;
    }

    const radius = angleStep === 0 ? 999999 : span / angleStep;
    const maxTheta = half * angleStep;
    const edgeCos = Math.cos(maxTheta);
    return { curveStrength, sign, angleStep, radius, count, half, maxTheta, edgeCos };
  }, [curve, span, tick]);

  const releaseVelocity = React.useCallback(() => {
    const samples = motionRef.current.samples;
    if (samples.length < 2) return motionRef.current.velocity;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = (last.t - first.t) / 1e3;
    if (dt <= 0) return motionRef.current.velocity;
    const pxPerSecond = (last.x - first.x) / dt;
    return -(pxPerSecond * dragSpeed) / span * .95;
  }, [dragSpeed, span]);

  React.useEffect(() => {
    motionRef.current.velocity = autoScrollSpeed;
  }, [autoScrollSpeed]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const node = rootRef.current;
    if (!node) return;
    const observer = new ResizeObserver(entries => {
      const next = entries[0]?.contentRect;
      if (!next) return;
      sizeRef.current = { width: next.width, height: next.height };
      React.startTransition(() => setTick(v => v + 1));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStaticRenderer || !inView || !hasImages) return;
    let disposed = false;
    const frame = time => {
      if (disposed) return;
      const motion = motionRef.current;
      if (motion.lastTime === 0) motion.lastTime = time;
      const dt = Math.max(.001, Math.min(.05, (time - motion.lastTime) / 1e3));
      motion.lastTime = time;

      if (!motion.dragging) {
        const retentionPerFrame = .82 + Math.max(0, Math.min(1, inertia)) * .17;
        const damping = Math.pow(retentionPerFrame, dt * 60);
        motion.velocity *= damping;
        const pull = 1 - Math.exp(-1.2 * dt);
        motion.velocity += (autoScrollSpeed - motion.velocity) * pull;
        motion.offset += motion.velocity * dt;
      }
      React.startTransition(() => setTick(v => v + 1));
      rafRef.current = window.requestAnimationFrame(frame);
    };
    rafRef.current = window.requestAnimationFrame(frame);
    return () => {
      disposed = true;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      motionRef.current.lastTime = 0;
    };
  }, [autoScrollSpeed, hasImages, inertia, inView, isStaticRenderer]);

  const handlePointerDown = React.useCallback(event => {
    const node = rootRef.current;
    if (!node) return;
    motionRef.current.dragging = true;
    motionRef.current.pointerId = event.pointerId;
    motionRef.current.lastX = event.clientX;
    motionRef.current.samples = [{ x: event.clientX, t: performance.now() }];
    node.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = React.useCallback(event => {
    const motion = motionRef.current;
    if (!motion.dragging || motion.pointerId !== event.pointerId) return;
    const dx = event.clientX - motion.lastX;
    motion.lastX = event.clientX;
    motion.offset += -dx / span * dragSpeed;
    const now = performance.now();
    motion.samples.push({ x: event.clientX, t: now });
    while (motion.samples.length > 8) motion.samples.shift();
    while (motion.samples.length > 2 && now - motion.samples[0].t > 120) {
      motion.samples.shift();
    }
    motion.velocity = releaseVelocity();
    React.startTransition(() => setTick(v => v + 1));
  }, [dragSpeed, releaseVelocity, span]);

  const handlePointerUp = React.useCallback(event => {
    const node = rootRef.current;
    const motion = motionRef.current;
    if (!motion.dragging || motion.pointerId !== event.pointerId) return;
    motion.dragging = false;
    motion.velocity = releaseVelocity();
    motion.samples = [];
    if (node && node.hasPointerCapture(event.pointerId)) {
      node.releasePointerCapture(event.pointerId);
    }
  }, [releaseVelocity]);

  const cards = React.useMemo(() => {
    if (!hasImages) return [];
    const { angleStep, radius, curveStrength, sign, count, half, edgeCos } = geometry;
    const offset = motionRef.current.offset;
    const startIndex = Math.floor(offset) - half;
    return Array.from({ length: count }, (_, slot) => {
      const virtualIndex = startIndex + slot;
      const relative = virtualIndex - offset;
      const imageIndex = modulo(virtualIndex, cleanImages.length);
      const image = cleanImages[imageIndex];

      if (angleStep === 0 || curveStrength === 0) {
        return { key: `${slot}-${imageIndex}`, image, x: relative * span, z: 0, rotateY: 0, opacity: 1, zIndex: 1e3 - Math.abs(Math.round(relative)) };
      }
      const theta = relative * angleStep;
      const x = Math.sin(theta) * radius;
      const centeredCos = Math.cos(theta) - (1 + edgeCos) / 2;
      const z = centeredCos * radius * sign;
      const rotateY = theta * 180 / Math.PI * sign;
      const fade = Math.min(1, Math.abs(relative) / Math.max(1, half));
      return { key: `${slot}-${imageIndex}`, image, x, z, rotateY, opacity: 1 - fade * .15, zIndex: 1e3 - Math.abs(Math.round(theta * 100)) };
    });
  }, [cleanImages, geometry, hasImages, span, tick]);

  return /*#__PURE__*/_jsx("div", {
    ref: rootRef,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    style: { position: "relative", width: "100%", height: "100%", overflow: "hidden", touchAction: "none", backgroundColor, ...style },
    role: "region",
    "aria-label": "Curved gallery",
    children: /*#__PURE__*/_jsx("div", {
      style: { position: "absolute", inset: 0, perspective: `${perspective}px`, perspectiveOrigin: "50% 50%", transformStyle: "preserve-3d", overflow: "hidden" },
      children: !hasImages ? /*#__PURE__*/_jsx("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", lineHeight: "1.3em", letterSpacing: "-0.01em", fontWeight: 500, fontStyle: "normal", textAlign: "center", color: "#CCCCCC", padding: 16, minWidth: "max-content" }, children: "Add images in the Images property control." }) : cards.map(card => /*#__PURE__*/_jsx("div", { style: { position: "absolute", left: "50%", top: "50%", width: cardSize, height: cardHeight, borderRadius, overflow: "hidden", transformStyle: "preserve-3d", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", opacity: card.opacity, zIndex: card.zIndex, transform: `translate3d(-50%, -50%, 0) translateX(${card.x}px) translateZ(${card.z}px) rotateY(${card.rotateY}deg)`, willChange: "transform, opacity" }, children: /*#__PURE__*/_jsx("img", { ...card.image, alt: card.image.alt || "", draggable: false, style: { width: "100%", height: "100%", display: "block", objectFit: "cover", pointerEvents: "none", userSelect: "none" } }) }, card.key))
    })
  });
}

addPropertyControls(CurvedGalleryArc, {
  images: { type: ControlType.Array, title: "Images", maxCount: 10, control: { type: ControlType.ResponsiveImage, title: "Image" } },
  backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#0b0b0c" },
  cardSize: { type: ControlType.Number, title: "Card Size", min: 120, max: 500, step: 1, unit: "px", defaultValue: 220 },
  gap: { type: ControlType.Number, title: "Gap", min: 0, max: 180, step: 1, unit: "px", defaultValue: 24 },
  curve: { type: ControlType.Number, title: "Curve", min: -300, max: 300, step: 1, defaultValue: 40 },
  perspective: { type: ControlType.Number, title: "Perspective", min: 600, max: 3e3, step: 10, unit: "px", defaultValue: 1200 },
  autoScrollSpeed: { type: ControlType.Number, title: "Auto", min: 0, max: 2, step: .01, defaultValue: .22 },
  dragSpeed: { type: ControlType.Number, title: "Drag", min: .1, max: 4, step: .01, defaultValue: 1 },
  inertia: { type: ControlType.Number, title: "Inertia", min: 0, max: 1, step: .01, defaultValue: .75 },
  borderRadius: { type: ControlType.Number, title: "Radius", min: 0, max: 60, step: 1, unit: "px", defaultValue: 16 }
});

export const __FramerMetadata__ = {
  exports: {
    default: { type: "reactComponent", name: "CurvedGalleryArc", slots: [], annotations: { framerContractVersion: "1", framerSupportedLayoutHeight: "any-prefer-fixed", framerSupportedLayoutWidth: "any-prefer-fixed" } },
    __FramerMetadata__: { type: "variable" }
  }
};
