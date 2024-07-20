function repeat(value) {
  return value
    .split("")
    .map((x) => x + x)
    .join("");
}

function parseHex(x = "") {
  const hex = x.replace(/^#/, "");
  const length = hex.length;
  return length === 3 || length === 4 ? repeat(hex) : hex;
}

function parseRgb(value = "") {
  const RGBA_REGEX = /[0-9.]+/gi;
  const [r = "0", b = "0", g = "0"] = value.match(RGBA_REGEX) || [];

  return {
    r: parseInt(r, 10),
    g: parseInt(g, 10),
    b: parseInt(b, 10),
  };
}

function hexToRgb(value) {
  const hex = parseHex(value),
    head = hex.slice(0, 6),
    n = parseInt(head, 16);

  return {
    r: (n >> 16) & 0xff,
    g: (n >> 8) & 0xff,
    b: (n >> 0) & 0xff,
  };
}

function rgbToHex({ r = 0, g = 0, b = 0 } = {}) {
  const hex = [r, g, b]
    .map((value) =>
      Math.min(255, Math.max(0, Math.round(value)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("");

  return `#${hex}`;
}

function hslToRgb({ h = 0, s = 0, l = 0 } = {}) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

function rgbToHsl({ r = 0, g = 0, b = 0 } = {}) {
  r /= 255;
  g /= 255;
  b /= 255;

  let chromaMin = Math.min(r, g, b),
    chromaMax = Math.max(r, g, b),
    delta = chromaMax - chromaMin,
    h = 0,
    s = 0,
    l = 0;

  if (delta === 0) h = 0;
  else if (chromaMax === r) h = ((g - b) / delta) % 6;
  else if (chromaMax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (chromaMax + chromaMin) / 2;

  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {
    h,
    s,
    l,
  };
}

export { hexToRgb, hslToRgb, rgbToHex, rgbToHsl, parseHex };
