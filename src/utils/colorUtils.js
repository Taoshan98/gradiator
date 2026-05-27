// Color conversion and interpolation utilities for Gradietor

// -------------------------------------------------------------
// HELPER STRUCTURES & CONVERTORS
// -------------------------------------------------------------

// Hex to RGB [0-255, 0-255, 0-255]
export function hexToRgb(hex) {
  const cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return [r, g, b];
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  }
  return [0, 0, 0];
}

// RGB [0-255, 0-255, 0-255] to Hex
export function rgbToHex([r, g, b]) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  const pr = clamp(r).toString(16).padStart(2, '0');
  const pg = clamp(g).toString(16).padStart(2, '0');
  const pb = clamp(b).toString(16).padStart(2, '0');
  return `#${pr}${pg}${pb}`;
}

// -------------------------------------------------------------
// sRGB <-> sRGB Linear (Gamma compand)
// -------------------------------------------------------------
function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c) {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function rgbToLinearRgb([r, g, b]) {
  return [srgbToLinear(r / 255), srgbToLinear(g / 255), srgbToLinear(b / 255)];
}

export function linearRgbToRgb([r, g, b]) {
  return [
    Math.max(0, Math.min(255, linearToSrgb(r) * 255)),
    Math.max(0, Math.min(255, linearToSrgb(g) * 255)),
    Math.max(0, Math.min(255, linearToSrgb(b) * 255)),
  ];
}

// -------------------------------------------------------------
// sRGB <-> HSL
// -------------------------------------------------------------
export function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return [h, s, l];
}

export function hslToRgb([h, s, l]) {
  h = (h % 360 + 360) % 360;
  if (s === 0) {
    const v = l * 255;
    return [v, v, v];
  }

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h / 360 + 1 / 3) * 255;
  const g = hue2rgb(p, q, h / 360) * 255;
  const b = hue2rgb(p, q, h / 360 - 1 / 3) * 255;

  return [r, g, b];
}

// -------------------------------------------------------------
// sRGB <-> HSV
// -------------------------------------------------------------
export function rgbToHsv([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return [h, s, v];
}

export function hsvToRgb([h, s, v]) {
  h = (h % 360 + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;

  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

// -------------------------------------------------------------
// sRGB <-> HWB
// -------------------------------------------------------------
export function rgbToHwb(rgb) {
  const [h, s, v] = rgbToHsv(rgb);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const w = Math.min(r, g, b);
  const bl = 1 - Math.max(r, g, b);
  return [h, w, bl];
}

export function hwbToRgb([h, w, bl]) {
  // Normalize if w + bl > 1
  if (w + bl > 1) {
    const sum = w + bl;
    w /= sum;
    bl /= sum;
  }

  // Convert H, S=1, V=1 to RGB
  const rgbFull = hsvToRgb([h, 1, 1]);
  const r = (rgbFull[0] / 255) * (1 - w - bl) + w;
  const g = (rgbFull[1] / 255) * (1 - w - bl) + w;
  const b = (rgbFull[2] / 255) * (1 - w - bl) + w;

  return [r * 255, g * 255, b * 255];
}

// -------------------------------------------------------------
// sRGB Linear <-> XYZ (D65)
// -------------------------------------------------------------
export function linearRgbToXyz([r, g, b]) {
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
  const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
  return [x, y, z];
}

export function xyzToLinearRgb([x, y, z]) {
  const r =  3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
  const g = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
  const b =  0.0556434 * x - 0.2040259 * y + 1.0572252 * z;
  return [r, g, b];
}

// -------------------------------------------------------------
// XYZ (D65) <-> LAB
// -------------------------------------------------------------
// D65 Standard White Point values
const XN = 0.95047;
const YN = 1.00000;
const ZN = 1.08883;

function fLab(t) {
  return t > 0.00885645 ? Math.cbrt(t) : 7.787037 * t + 16 / 116;
}

function fLabInverse(t) {
  const t3 = t * t * t;
  return t3 > 0.00885645 ? t3 : (t - 16 / 116) / 7.787037;
}

export function xyzToLab([x, y, z]) {
  const fx = fLab(x / XN);
  const fy = fLab(y / YN);
  const fz = fLab(z / ZN);

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return [l, a, b];
}

export function labToXyz([l, a, b]) {
  const fy = (l + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;

  const x = fLabInverse(fx) * XN;
  const y = fLabInverse(fy) * YN;
  const z = fLabInverse(fz) * ZN;

  return [x, y, z];
}

// -------------------------------------------------------------
// LAB <-> LCH
// -------------------------------------------------------------
export function labToLch([l, a, b]) {
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * (180 / Math.PI);
  h = (h % 360 + 360) % 360;
  return [l, c, h];
}

export function lchToLab([l, c, h]) {
  const rad = h * (Math.PI / 180);
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  return [l, a, b];
}

// -------------------------------------------------------------
// XYZ (D65) <-> Oklab
// -------------------------------------------------------------
export function xyzToOklab([x, y, z]) {
  // XYZ to LMS
  const l_ = 0.8189330101 * x + 0.3618667424 * y - 0.1288597157 * z;
  const m_ = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s_ = 0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z;

  // Non-linear cube root compression
  const l = Math.cbrt(Math.max(0, l_));
  const m = Math.cbrt(Math.max(0, m_));
  const s = Math.cbrt(Math.max(0, s_));

  // LMS to OKlab L, a, b
  const okl = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const oka = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const okb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;

  return [okl, oka, okb];
}

export function oklabToXyz([okl, oka, okb]) {
  // OKlab to LMS non-linear
  const l = okl + 0.3963377774 * oka + 0.2158037573 * okb;
  const m = okl - 0.1055613458 * oka - 0.0638541728 * okb;
  const s = okl - 0.0894841775 * oka - 1.2914855480 * okb;

  // Cube
  const l_ = l * l * l;
  const m_ = m * m * m;
  const s_ = s * s * s;

  // LMS to XYZ
  const x = 1.2270138511 * l_ - 0.5577999807 * m_ + 0.2812561489 * s_;
  const y = -0.0405801784 * l_ + 1.1122568696 * m_ - 0.0716766787 * s_;
  const z = -0.0763812845 * l_ - 0.4214819784 * m_ + 1.5861632204 * s_;

  return [x, y, z];
}

// -------------------------------------------------------------
// Oklab <-> Oklch
// -------------------------------------------------------------
export function oklabToOklch([l, a, b]) {
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * (180 / Math.PI);
  h = (h % 360 + 360) % 360;
  return [l, c, h];
}

export function oklchToOklab([l, c, h]) {
  const rad = h * (Math.PI / 180);
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  return [l, a, b];
}

// -------------------------------------------------------------
// MASTER ROUTER
// -------------------------------------------------------------
export function rgbToSpace(rgb, space) {
  switch (space) {
    case 'srgb': return rgb;
    case 'hsl': return rgbToHsl(rgb);
    case 'hsv': return rgbToHsv(rgb);
    case 'hwb': return rgbToHwb(rgb);
    case 'xyz': return linearRgbToXyz(rgbToLinearRgb(rgb));
    case 'lab': return xyzToLab(linearRgbToXyz(rgbToLinearRgb(rgb)));
    case 'lch': return labToLch(xyzToLab(linearRgbToXyz(rgbToLinearRgb(rgb))));
    case 'oklab': return xyzToOklab(linearRgbToXyz(rgbToLinearRgb(rgb)));
    case 'oklch': return oklabToOklch(xyzToOklab(linearRgbToXyz(rgbToLinearRgb(rgb))));
    default: return rgb;
  }
}

export function spaceToRgb(coords, space) {
  let rgb;
  switch (space) {
    case 'srgb':
      rgb = coords;
      break;
    case 'hsl':
      rgb = hslToRgb(coords);
      break;
    case 'hsv':
      rgb = hsvToRgb(coords);
      break;
    case 'hwb':
      rgb = hwbToRgb(coords);
      break;
    case 'xyz':
      rgb = linearRgbToRgb(xyzToLinearRgb(coords));
      break;
    case 'lab':
      rgb = linearRgbToRgb(xyzToLinearRgb(labToXyz(coords)));
      break;
    case 'lch':
      rgb = linearRgbToRgb(xyzToLinearRgb(labToXyz(lchToLab(coords))));
      break;
    case 'oklab':
      rgb = linearRgbToRgb(xyzToLinearRgb(oklabToXyz(coords)));
      break;
    case 'oklch':
      rgb = linearRgbToRgb(xyzToLinearRgb(oklabToXyz(oklchToOklab(coords))));
      break;
    default:
      rgb = coords;
  }
  // Clamp final RGB channels
  return rgb.map(val => Math.max(0, Math.min(255, Math.round(val))));
}

// -------------------------------------------------------------
// INTERPOLATION LOGIC
// -------------------------------------------------------------

// Checks if color space is cylindrical (has hue channel)
export function isCylindrical(space) {
  return ['hsl', 'hsv', 'hwb', 'lch', 'oklch'].includes(space);
}

// Checks if color is achromatic (no chroma/saturation)
function isAchromatic(coords, space) {
  const threshold = 1e-4;
  if (space === 'hsl' || space === 'hsv') {
    return coords[1] < threshold; // saturation
  }
  if (space === 'hwb') {
    return coords[1] + coords[2] >= 1.0 - threshold; // whiteness + blackness
  }
  if (space === 'lch' || space === 'oklch') {
    return coords[1] < threshold; // chroma
  }
  return false;
}

// Interpolates 2 colors in a specific space at a ratio [0, 1]
export function interpolatePair(coords1, coords2, ratio, space, huePath = 'shorter') {
  const out = [];

  if (isCylindrical(space)) {
    // For cylindrical spaces, resolve the correct index mapping:
    // HSL, HSV, HWB are represented as [H, S, L/V/B] -> Hue index is 0
    // LCH, OKLCH are represented as [L, C, H] -> Hue index is 2
    let hueIdx = 0;
    let ch1Idx = 1;
    let ch2Idx = 2;

    if (space === 'lch' || space === 'oklch') {
      hueIdx = 2;
      ch1Idx = 0;
      ch2Idx = 1;
    }

    let h1 = coords1[hueIdx];
    let h2 = coords2[hueIdx];

    const ach1 = isAchromatic(coords1, space);
    const ach2 = isAchromatic(coords2, space);

    // Carry over hue if one color is achromatic
    if (ach1 && !ach2) {
      h1 = h2;
    } else if (ach2 && !ach1) {
      h2 = h1;
    }

    let h;
    const diff = h2 - h1;

    if (huePath === 'shorter') {
      let sDiff = diff % 360;
      sDiff = (sDiff + 540) % 360 - 180; // range [-180, 180]
      h = (h1 + ratio * sDiff + 360) % 360;
    } else if (huePath === 'longer') {
      let sDiff = diff % 360;
      sDiff = (sDiff + 540) % 360 - 180; // range [-180, 180]
      let lDiff = sDiff >= 0 ? sDiff - 360 : sDiff + 360;
      if (sDiff === 0) lDiff = 360; // full rotation
      h = (h1 + ratio * lDiff + 360) % 360;
    } else {
      // Linear fallback
      h = (h1 + ratio * diff + 360) % 360;
    }

    out[hueIdx] = h;
    out[ch1Idx] = coords1[ch1Idx] + ratio * (coords2[ch1Idx] - coords1[ch1Idx]);
    out[ch2Idx] = coords1[ch2Idx] + ratio * (coords2[ch2Idx] - coords1[ch2Idx]);
  } else {
    // Standard Euclidean interpolation
    out[0] = coords1[0] + ratio * (coords2[0] - coords1[0]);
    out[1] = coords1[1] + ratio * (coords2[1] - coords1[1]);
    out[2] = coords1[2] + ratio * (coords2[2] - coords1[2]);
  }

  return out;
}

// -------------------------------------------------------------
// MULTI-STOP INTERPOLATOR
// -------------------------------------------------------------
// stops: Array of { color: hex, position: 0..100 }
// steps: Total number of steps to output (integer >= 2)
// space: color space string
// huePath: shorter/longer
export function generateGradientSteps(stops, steps, space, huePath = 'shorter') {
  // Sort stops by position
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  // If we have no stops, return empty
  if (sortedStops.length === 0) return [];
  // If we have only 1 stop, return it repeated
  if (sortedStops.length === 1) {
    const rgb = hexToRgb(sortedStops[0].color);
    return Array(steps).fill({ hex: sortedStops[0].color, rgb });
  }

  // Convert all stop colors to target space coordinates
  const stopsInSpace = sortedStops.map(stop => ({
    coords: rgbToSpace(hexToRgb(stop.color), space),
    position: stop.position / 100 // normalize to 0..1
  }));

  const result = [];

  for (let i = 0; i < steps; i++) {
    // Current progress point from 0.0 to 1.0
    const t = steps > 1 ? i / (steps - 1) : 0;

    // Find the two stops that bound this t
    let leftStop = stopsInSpace[0];
    let rightStop = stopsInSpace[stopsInSpace.length - 1];

    if (t <= leftStop.position) {
      const rgb = spaceToRgb(leftStop.coords, space);
      result.push({ hex: rgbToHex(rgb), rgb });
      continue;
    }
    if (t >= rightStop.position) {
      const rgb = spaceToRgb(rightStop.coords, space);
      result.push({ hex: rgbToHex(rgb), rgb });
      continue;
    }

    // Find segment
    for (let s = 0; s < stopsInSpace.length - 1; s++) {
      if (t >= stopsInSpace[s].position && t <= stopsInSpace[s + 1].position) {
        leftStop = stopsInSpace[s];
        rightStop = stopsInSpace[s + 1];
        break;
      }
    }

    // Normalize t inside the segment: localRatio in [0, 1]
    const segmentWidth = rightStop.position - leftStop.position;
    const localRatio = segmentWidth > 0 ? (t - leftStop.position) / segmentWidth : 0;

    // Interpolate in target space
    const interpCoords = interpolatePair(leftStop.coords, rightStop.coords, localRatio, space, huePath);

    // Convert back to RGB & Hex
    const rgb = spaceToRgb(interpCoords, space);
    result.push({ hex: rgbToHex(rgb), rgb });
  }

  return result;
}

// -------------------------------------------------------------
// RANDOM COLOR / GRADIENT GENERATOR
// -------------------------------------------------------------
export function generateRandomHex() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
