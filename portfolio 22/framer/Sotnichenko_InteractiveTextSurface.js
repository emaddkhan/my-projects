import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer";

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
    vUv = vec2(aPosition.x * 0.5 + 0.5, 0.5 - aPosition.y * 0.5);
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec3 uBackground;
uniform vec3 uTextColor;
uniform float uRadius;
uniform float uDepth;
uniform float uSoftness;
uniform float uShadow;
uniform float uHighlight;
uniform float uStrength;

float bumpProfile(float normalizedDistance) {
    float x = clamp(1.0 - normalizedDistance, 0.0, 1.0);
    float smoothBump = x * x * (3.0 - 2.0 * x);
    return pow(smoothBump, mix(0.7, 2.4, uSoftness));
}

float textAlpha(vec2 uv) {
    vec2 insideLow = step(vec2(0.0), uv);
    vec2 insideHigh = step(uv, vec2(1.0));
    float inside = insideLow.x * insideLow.y * insideHigh.x * insideHigh.y;
    return texture2D(uTexture, clamp(uv, 0.0, 1.0)).a * inside;
}

void main() {
    vec2 safeResolution = max(uResolution, vec2(1.0));
    vec2 pointerUv = uPointer / safeResolution;
    vec2 deltaPx = (vUv - pointerUv) * safeResolution;
    float distancePx = length(deltaPx);
    float normalizedDistance = distancePx / max(uRadius, 1.0);
    float height = bumpProfile(normalizedDistance) * uStrength;
    vec2 direction = deltaPx / max(distancePx, 0.0001);

    vec2 warpScale = vec2(uRadius) / safeResolution;
    vec2 warpedUv = vUv - direction * warpScale * height * uDepth * 0.105;
    float glyph = textAlpha(warpedUv);

    vec2 texel = 1.0 / safeResolution;
    vec2 shadowUv = vUv + vec2(2.5, 5.0) * texel;
    vec2 blurX = vec2(6.0, 0.0) * texel;
    vec2 blurY = vec2(0.0, 6.0) * texel;
    float shadowMask = textAlpha(shadowUv) * 0.20;
    shadowMask += textAlpha(shadowUv + blurX) * 0.12;
    shadowMask += textAlpha(shadowUv - blurX) * 0.12;
    shadowMask += textAlpha(shadowUv + blurY) * 0.12;
    shadowMask += textAlpha(shadowUv - blurY) * 0.12;
    shadowMask += textAlpha(shadowUv + blurX + blurY) * 0.08;
    shadowMask += textAlpha(shadowUv + blurX - blurY) * 0.08;
    shadowMask += textAlpha(shadowUv - blurX + blurY) * 0.08;
    shadowMask += textAlpha(shadowUv - blurX - blurY) * 0.08;
    shadowMask *= uShadow * (1.0 - height * 0.92);

    vec3 color = uBackground * (1.0 - shadowMask * 0.38);

    float x = clamp(1.0 - normalizedDistance, 0.0, 1.0);
    float slope = 6.0 * x * (1.0 - x) * uDepth * uStrength;
    vec3 normal = normalize(vec3(-direction.x * slope, direction.y * slope, 1.7));
    vec3 lightDirection = normalize(vec3(-0.55, -0.78, 1.25));
    float diffuse = dot(normal, lightDirection);
    float lighting = (diffuse - 0.57) * uHighlight * height;

    float rimDirection = max(dot(direction, normalize(vec2(-0.55, -0.84))), 0.0);
    float rim = smoothstep(0.15, 0.62, normalizedDistance)
        * (1.0 - smoothstep(0.66, 1.18, normalizedDistance))
        * rimDirection * uHighlight * uStrength;

    vec3 litText = uTextColor;
    litText += uTextColor * lighting * 0.52;
    litText += vec3(rim * 0.11);
    color = mix(color, clamp(litText, 0.0, 1.0), glyph);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Interactive Text Surface shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Interactive Text Surface program error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function parseColor(color) {
  const value = color.trim();
  if (value.startsWith("#")) {
    let hex = value.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.slice(0, 3).split("").map(character => character + character).join("");
    }
    if (hex.length >= 6) {
      return [parseInt(hex.slice(0, 2), 16) / 255, parseInt(hex.slice(2, 4), 16) / 255, parseInt(hex.slice(4, 6), 16) / 255];
    }
  }
  const match = value.match(/[\d.]+/g);
  if (match && match.length >= 3) {
    return [Math.min(Number(match[0]), 255) / 255, Math.min(Number(match[1]), 255) / 255, Math.min(Number(match[2]), 255) / 255];
  }
  return [0, 0, 0];
}

function numericValue(value, fallback, reference = fallback) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return fallback;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  if (value.endsWith("em") || value.endsWith("rem")) return parsed * reference;
  if (value.endsWith("%")) return parsed / 100 * reference;
  return parsed;
}

function lineHeightValue(value, fontSize) {
  if (typeof value === "number") {
    return value <= 4 ? value * fontSize : value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) return fontSize * .95;
    if (value.endsWith("em")) return parsed * fontSize;
    if (value.endsWith("%")) return parsed / 100 * fontSize;
    if (!/[a-z%]/i.test(value) && parsed <= 4) return parsed * fontSize;
    return parsed;
  }
  return fontSize * .95;
}

function pixelRatioFor(quality) {
  if (typeof window === "undefined") return 1;
  const deviceRatio = window.devicePixelRatio || 1;
  if (quality === "eco") return 1;
  if (quality === "high") return Math.min(deviceRatio, 2);
  return Math.min(deviceRatio, 1.65);
}

function splitLongWord(context, word, maximumWidth) {
  const pieces = [];
  let current = "";
  for (const character of Array.from(word)) {
    const candidate = current + character;
    if (current && context.measureText(candidate).width > maximumWidth) {
      pieces.push(current);
      current = character;
    } else {
      current = candidate;
    }
  }
  if (current) pieces.push(current);
  return pieces.length ? pieces : [word];
}

function wrapText(context, text, maximumWidth, wrap) {
  const paragraphs = text.replace(/\r/g, "").split("\n");
  if (!wrap) return paragraphs.length ? paragraphs : [""];
  const lines = [];
  for (const paragraph of paragraphs) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    const words = paragraph.split(/\s+/);
    let current = "";
    for (const word of words) {
      const pieces = context.measureText(word).width > maximumWidth ? splitLongWord(context, word, maximumWidth) : [word];
      for (const piece of pieces) {
        const candidate = current ? `${current} ${piece}` : piece;
        if (current && context.measureText(candidate).width > maximumWidth) {
          lines.push(current);
          current = piece;
        } else {
          current = candidate;
        }
      }
    }
    lines.push(current);
  }
  return lines.length ? lines : [""];
}

function fontString(font, size) {
  const style = font.fontStyle || "normal";
  const weight = font.fontWeight || 700;
  const family = font.fontFamily || "Arial, sans-serif";
  return `${style} ${weight} ${size}px ${family}`;
}

export default function InteractiveTextSurface(props) {
  const { text, font, color, background, align, verticalAlign, padding, wrap, autoFit, minFontSize, depth, radius, softness, shadow, highlight, interaction, touch, follow, quality, respectMotion, style } = props;
  const canvasRef = React.useRef(null);
  const isStaticRenderer = useIsStaticRenderer();
  const requestedFontSize = numericValue(font?.fontSize, 180);
  const explicitLines = (text || "").replace(/\r/g, "").split("\n");
  const longestLine = Math.max(1, ...explicitLines.map(line => Array.from(line).length));
  const fallbackLineHeightRatio = Math.max(lineHeightValue(font?.lineHeight, 100) / 100, .2);
  const fallbackFontSize = autoFit ? `min(${requestedFontSize}px, ${100 / (longestLine * .58)}cqw, ${100 / (explicitLines.length * fallbackLineHeightRatio)}cqh)` : font?.fontSize;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isStaticRenderer) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: quality === "eco" ? "low-power" : "high-performance" });
    if (!gl) return;
    const program = createProgram(gl);
    if (!program) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const locations = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      background: gl.getUniformLocation(program, "uBackground"),
      textColor: gl.getUniformLocation(program, "uTextColor"),
      radius: gl.getUniformLocation(program, "uRadius"),
      depth: gl.getUniformLocation(program, "uDepth"),
      softness: gl.getUniformLocation(program, "uSoftness"),
      shadow: gl.getUniformLocation(program, "uShadow"),
      highlight: gl.getUniformLocation(program, "uHighlight"),
      strength: gl.getUniformLocation(program, "uStrength"),
      texture: gl.getUniformLocation(program, "uTexture")
    };

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 0]));
    gl.uniform1i(locations.texture, 0);

    const textCanvas = document.createElement("canvas");
    const textContext = textCanvas.getContext("2d");
    if (!textContext) {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      return;
    }

    let disposed = false;
    let frame = 0;
    let width = 1;
    let height = 1;
    let ratio = 1;
    let lastTime = performance.now();
    let inViewport = typeof IntersectionObserver === "undefined";
    let pageVisible = document.visibilityState !== "hidden";
    let animationRunning = false;
    const pointer = { x: .5, y: .5, targetX: .5, targetY: .5, strength: interaction ? 0 : .58, targetStrength: interaction ? 0 : .58 };
    const reducedMotion = respectMotion && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const backgroundRgb = parseColor(background);
    const textRgb = parseColor(color);

    const layoutAtSize = (size, maximumWidth) => {
      textContext.font = fontString(font, size);
      textContext.textBaseline = "alphabetic";
      const spacing = numericValue(font.letterSpacing, 0, size);
      if ("letterSpacing" in textContext) {
        textContext.letterSpacing = `${spacing}px`;
      }
      const lines = wrapText(textContext, text, maximumWidth, wrap);
      const lineHeight = lineHeightValue(font.lineHeight, size);
      const widest = lines.reduce((current, line) => Math.max(current, textContext.measureText(line).width), 0);
      return { lines, lineHeight, width: widest, height: lines.length * lineHeight };
    };

    const uploadTextTexture = () => {
      const safePadding = Math.min(Math.max(padding, 0), width * .2, height * .2);
      const maximumWidth = Math.max(width - safePadding * 2, 1);
      const maximumHeight = Math.max(height - safePadding * 2, 1);
      const requestedSize = Math.max(numericValue(font.fontSize, 180), minFontSize);
      let finalSize = requestedSize;
      let layout = layoutAtSize(finalSize, maximumWidth);

      if (autoFit && (layout.width > maximumWidth || layout.height > maximumHeight)) {
        let low = Math.max(minFontSize, 4);
        let high = requestedSize;
        for (let index = 0; index < 12; index++) {
          const candidate = (low + high) * .5;
          const candidateLayout = layoutAtSize(candidate, maximumWidth);
          if (candidateLayout.width <= maximumWidth && candidateLayout.height <= maximumHeight) {
            low = candidate;
          } else {
            high = candidate;
          }
        }
        finalSize = low;
        layout = layoutAtSize(finalSize, maximumWidth);
      }

      textCanvas.width = Math.max(1, Math.round(width * ratio));
      textCanvas.height = Math.max(1, Math.round(height * ratio));
      textContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      textContext.clearRect(0, 0, width, height);
      textContext.font = fontString(font, finalSize);
      textContext.textBaseline = "alphabetic";
      textContext.fillStyle = "#FFFFFF";

      const spacing = numericValue(font.letterSpacing, 0, finalSize);
      if ("letterSpacing" in textContext) {
        textContext.letterSpacing = `${spacing}px`;
      }

      let top = safePadding;
      if (verticalAlign === "center") {
        top = (height - layout.height) * .5;
      } else if (verticalAlign === "bottom") {
        top = height - safePadding - layout.height;
      }
      const baselineOffset = (layout.lineHeight - finalSize) * .5 + finalSize * .82;

      layout.lines.forEach((line, index) => {
        const lineWidth = textContext.measureText(line).width;
        let x = safePadding;
        if (align === "center") x = (width - lineWidth) * .5;
        if (align === "right") x = width - safePadding - lineWidth;
        const y = top + index * layout.lineHeight + baselineOffset;
        textContext.fillText(line, x, y);
      });

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(rect.width, 1);
      const nextHeight = Math.max(rect.height, 1);
      const nextRatio = pixelRatioFor(quality);
      const drawingWidth = Math.max(1, Math.round(nextWidth * nextRatio));
      const drawingHeight = Math.max(1, Math.round(nextHeight * nextRatio));
      const changed = nextWidth !== width || nextHeight !== height || nextRatio !== ratio || canvas.width !== drawingWidth || canvas.height !== drawingHeight;
      width = nextWidth;
      height = nextHeight;
      ratio = nextRatio;
      if (changed) {
        canvas.width = drawingWidth;
        canvas.height = drawingHeight;
        gl.viewport(0, 0, drawingWidth, drawingHeight);
        uploadTextTexture();
      }
    };

    const draw = () => {
      gl.useProgram(program);
      gl.uniform2f(locations.resolution, width, height);
      gl.uniform2f(locations.pointer, pointer.x * width, pointer.y * height);
      gl.uniform3f(locations.background, backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]);
      gl.uniform3f(locations.textColor, textRgb[0], textRgb[1], textRgb[2]);
      gl.uniform1f(locations.radius, Math.min(radius, Math.max(width, height)));
      gl.uniform1f(locations.depth, depth);
      gl.uniform1f(locations.softness, softness);
      gl.uniform1f(locations.shadow, shadow);
      gl.uniform1f(locations.highlight, highlight);
      gl.uniform1f(locations.strength, reducedMotion ? 0 : pointer.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const shouldAnimate = () => !disposed && !reducedMotion && interaction && inViewport && pageVisible;

    const stopAnimation = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      animationRunning = false;
    };

    const animate = time => {
      if (!shouldAnimate()) {
        frame = 0;
        animationRunning = false;
        return;
      }
      const delta = Math.min((time - lastTime) / 16.667, 4);
      lastTime = time;
      const retention = Math.min(Math.max(follow, 0), .98);
      const amount = 1 - Math.pow(retention, delta);
      pointer.x += (pointer.targetX - pointer.x) * amount;
      pointer.y += (pointer.targetY - pointer.y) * amount;
      pointer.strength += (pointer.targetStrength - pointer.strength) * amount;
      resize();
      draw();
      frame = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!shouldAnimate() || animationRunning) return;
      lastTime = performance.now();
      animationRunning = true;
      frame = requestAnimationFrame(animate);
    };

    const setPointer = (clientX, clientY) => {
      if (!interaction || reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.targetX = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      pointer.targetY = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
      pointer.targetStrength = 1;
    };

    const onPointerMove = event => {
      if (event.pointerType === "touch" && !touch) return;
      setPointer(event.clientX, event.clientY);
    };

    const onPointerDown = event => {
      if (event.pointerType === "touch" && !touch) return;
      if (event.pointerType === "touch") {
        canvas.setPointerCapture?.(event.pointerId);
      }
      setPointer(event.clientX, event.clientY);
    };

    const releasePointer = event => {
      if (event.pointerType === "touch" && canvas.hasPointerCapture?.(event.pointerId)) {
        canvas.releasePointerCapture?.(event.pointerId);
      }
      pointer.targetStrength = interaction ? 0 : .58;
    };

    const onPointerEnd = event => {
      if (event.pointerType === "touch") releasePointer(event);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });

    let intersectionObserver = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        const nextInViewport = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0);
        if (nextInViewport === inViewport) return;
        inViewport = nextInViewport;
        if (inViewport) {
          resize();
          draw();
          startAnimation();
        } else {
          stopAnimation();
        }
      }, { threshold: .01 });
      intersectionObserver.observe(canvas);
    }

    const onVisibilityChange = () => {
      pageVisible = document.visibilityState !== "hidden";
      if (pageVisible && inViewport) {
        resize();
        draw();
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", onVisibilityChange);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerleave", releasePointer);
    canvas.addEventListener("pointerup", onPointerEnd);
    canvas.addEventListener("pointercancel", onPointerEnd);
    resize();
    uploadTextTexture();
    draw();

    const fontSet = document.fonts;
    if (fontSet) {
      const requestedSize = numericValue(font.fontSize, 180);
      const face = fontString(font, requestedSize);
      fontSet.load(face, text).then(() => {
        if (disposed) return;
        uploadTextTexture();
        draw();
      }).catch(() => { });
    }

    startAnimation();

    return () => {
      disposed = true;
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerleave", releasePointer);
      canvas.removeEventListener("pointerup", onPointerEnd);
      canvas.removeEventListener("pointercancel", onPointerEnd);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [text, font, color, background, align, verticalAlign, padding, wrap, autoFit, minFontSize, depth, radius, softness, shadow, highlight, interaction, touch, follow, quality, respectMotion, isStaticRenderer]);

  return /*#__PURE__*/_jsxs("div", {
    role: "img",
    "aria-label": text || "Interactive text",
    style: { ...style, position: "relative", overflow: "hidden", background, containerType: "size" },
    children: [
      /*#__PURE__*/_jsx("div", {
        "aria-hidden": "true",
        style: { position: "absolute", inset: 0, boxSizing: "border-box", display: "flex", alignItems: verticalAlign === "top" ? "flex-start" : verticalAlign === "bottom" ? "flex-end" : "center", justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center", padding: `min(${padding}px, 20cqw, 20cqh)`, color, whiteSpace: wrap ? "pre-wrap" : "pre", overflowWrap: wrap ? "anywhere" : "normal", textAlign: align, ...font, fontSize: fallbackFontSize },
        children: text
      }),
      /*#__PURE__*/_jsx("canvas", {
        ref: canvasRef,
        "aria-hidden": "true",
        style: { position: "absolute", inset: 0, zIndex: 1, display: "block", width: "100%", height: "100%", touchAction: touch && interaction ? "none" : "auto" }
      })
    ]
  });
}

addPropertyControls(InteractiveTextSurface, {
  text: { type: ControlType.String, title: "Text", defaultValue: "HAPPY\nDAYS", displayTextArea: true },
  font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: 260, fontWeight: 700, lineHeight: "0.88em", letterSpacing: "-0.045em" } },
  color: { type: ControlType.Color, title: "Text Color", defaultValue: "#111113" },
  background: { type: ControlType.Color, title: "Background", defaultValue: "#F6F3EE" },
  align: { type: ControlType.Enum, title: "Align", options: ["left", "center", "right"], optionTitles: ["Left", "Center", "Right"], displaySegmentedControl: true, defaultValue: "center" },
  verticalAlign: { type: ControlType.Enum, title: "Vertical", options: ["top", "center", "bottom"], optionTitles: ["Top", "Center", "Bottom"], displaySegmentedControl: true, defaultValue: "center" },
  padding: { type: ControlType.Number, title: "Padding", min: 0, max: 240, step: 4, unit: "px", defaultValue: 64 },
  wrap: { type: ControlType.Boolean, title: "Wrap", enabledTitle: "On", disabledTitle: "Off", defaultValue: false },
  autoFit: { type: ControlType.Boolean, title: "Auto Fit", enabledTitle: "On", disabledTitle: "Off", defaultValue: true },
  minFontSize: { type: ControlType.Number, title: "Min Size", min: 4, max: 120, step: 1, unit: "px", defaultValue: 18, hidden: props => !props.autoFit },
  depth: { type: ControlType.Number, title: "Depth", min: 0, max: 1.8, step: .05, defaultValue: .9 },
  radius: { type: ControlType.Number, title: "Radius", min: 40, max: 600, step: 5, unit: "px", defaultValue: 220 },
  softness: { type: ControlType.Number, title: "Softness", min: 0, max: 1, step: .05, defaultValue: .42 },
  shadow: { type: ControlType.Number, title: "Shadow", min: 0, max: 1.5, step: .05, defaultValue: .78 },
  highlight: { type: ControlType.Number, title: "Highlight", min: 0, max: 1.5, step: .05, defaultValue: .68 },
  interaction: { type: ControlType.Boolean, title: "Interactive", enabledTitle: "On", disabledTitle: "Off", defaultValue: true },
  touch: { type: ControlType.Boolean, title: "Touch", enabledTitle: "On", disabledTitle: "Off", defaultValue: true, hidden: props => !props.interaction },
  follow: { type: ControlType.Number, title: "Follow", min: 0, max: .96, step: .02, defaultValue: .82, hidden: props => !props.interaction },
  quality: { type: ControlType.Enum, title: "Quality", options: ["auto", "high", "eco"], optionTitles: ["Auto", "High", "Eco"], defaultValue: "auto" },
  respectMotion: { type: ControlType.Boolean, title: "Reduced Motion", enabledTitle: "Respect", disabledTitle: "Ignore", defaultValue: true }
});

export const __FramerMetadata__ = {
  exports: {
    default: { type: "reactComponent", name: "InteractiveTextSurface", slots: [], annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" }
  }
};
