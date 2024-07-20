function rgbToCssRgb({ r = 0, g = 0, b = 0 }) {
  return `rgb(${r},${g},${b})`;
}

function hslToCssHsl({ h = 0, s = 0, l = 0 }) {
  return `hsl(${h}deg, ${s}%, ${l}%)`;
}

function hexToCssHex(hexCode) {
  return `#${hexCode}`;
}
export { rgbToCssRgb, hslToCssHsl, hexToCssHex };
