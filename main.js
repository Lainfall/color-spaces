import {
  hexToRgb,
  hslToRgb,
  parseHex,
  rgbToHex,
  rgbToHsl,
} from "./colorSpaceConversion.js";
import {
  hslToCssHsl,
  rgbToCssRgb,
  hexToCssHex,
} from "./colorToCssConversion.js";

const mainElement = document.querySelector("main");
const hexInput = document.querySelector("input[name=hex]");
const hslInputs = {
  hInput: document.querySelector("input[name=h_input]"),
  sInput: document.querySelector("input[name=s_input]"),
  lInput: document.querySelector("input[name=l_input]"),
};
const rgbInputs = {
  rInput: document.querySelector("input[name=r_input]"),
  gInput: document.querySelector("input[name=g_input]"),
  bInput: document.querySelector("input[name=b_input]"),
};
const convertButton = document.getElementById("button_convert");

let lastSelect;

function hexInputSetup() {
  hexInput.addEventListener("focus", () => {
    hexInput.select();
    lastSelect = "hex";
  });

  hexInput.addEventListener("input", (event) => {
    if (!hexInput.value) hexInput.value = "#";
    if (hexInput.value[0] !== "#" && event.data)
      hexInput.value = `#${event.data}`;

    if (hexInput.value.length > 7) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  hexInput.addEventListener("paste", (event) => {
    let clipboardData, pastedData;

    clipboardData = event.clipboardData || window.Clipboard();
    pastedData = clipboardData.getData("text/plain");

    if (pastedData[0] === "#" && hexInput.value[0] === "#") {
      hexInput.value = pastedData.slice(1, hexInput.value.length);
    }
  });
}

function rgbInputSetup() {
  for (const [_, inputElement] of Object.entries(rgbInputs)) {
    inputElement.addEventListener("input", () => {
      if (inputElement.value > 255) inputElement.value = 255;
      else if (inputElement.value < 0) inputElement.value = 0;
    });

    inputElement.addEventListener("focus", () => {
      inputElement.select();
      lastSelect = "rgb";
    });

    inputElement.addEventListener("keydown", (event) => {
      function selectPreviousInput() {
        if (inputElement === rgbInputs.gInput) {
          return rgbInputs.rInput.select();
        } else if (inputElement === rgbInputs.bInput) {
          return rgbInputs.gInput.select();
        }
      }

      function selectNextInput() {
        if (inputElement === rgbInputs.rInput) {
          return rgbInputs.gInput.select();
        } else if (inputElement === rgbInputs.gInput) {
          return rgbInputs.bInput.select();
        }
      }

      if (!inputElement.value && event.key === "Backspace") {
        event.preventDefault();
        return selectPreviousInput();
      }

      if (inputElement.value.length > 2 && event.key !== "Backspace") {
        event.preventDefault();
        return selectNextInput();
      }

      if (isNaN(event.key)) {
        event.stopPropagation();
      }
    });
  }
}

function hslInputSetup() {
  for (const [_, inputElement] of Object.entries(hslInputs)) {
    inputElement.addEventListener("input", () => {
      if (inputElement === hslInputs.hInput) {
        if (inputElement.value > 360) inputElement.value = 360;
        else if (inputElement.value < 0) inputElement.value = 0;
      } else {
        if (inputElement.value > 100) inputElement.value = 100;
        else if (inputElement.value < 0) inputElement.value = 0;
      }
    });

    inputElement.addEventListener("focus", () => {
      inputElement.select();
      lastSelect = "hsl";
    });

    inputElement.addEventListener("keydown", (event) => {
      function selectPreviousInput() {
        if (inputElement === hslInputs.sInput) {
          return hslInputs.hInput.select();
        } else if (inputElement === hslInputs.lInput) {
          return hslInputs.sInput.select();
        }
      }

      function selectNextInput() {
        if (inputElement === hslInputs.hInput) {
          return hslInputs.sInput.select();
        } else if (inputElement === hslInputs.sInput) {
          return hslInputs.lInput.select();
        }
      }

      if (!inputElement.value && event.key === "Backspace") {
        event.preventDefault();
        return selectPreviousInput();
      }

      if (inputElement.value.length > 2 && event.key !== "Backspace") {
        event.preventDefault();
        return selectNextInput();
      }

      if (isNaN(event.key)) {
        event.stopPropagation();
      }
    });
  }
}

function hexValueToInput(hexValue) {
  hexInput.value = hexValue;
}

function rgbValueToInput(rgbValues) {
  rgbInputs.rInput.value = rgbValues.r;
  rgbInputs.gInput.value = rgbValues.g;
  rgbInputs.bInput.value = rgbValues.b;
}

function hslValuesToInput(hslValues) {
  hslInputs.hInput.value = hslValues.h;
  hslInputs.sInput.value = hslValues.s;
  hslInputs.lInput.value = hslValues.l;
}

function setMainBackgroundColor(color) {
  mainElement.style.backgroundColor = color;
}

function convertFromHex() {
  const hexValue = parseHex(hexInput.value),
    rgbValues = hexToRgb(hexValue),
    hslValues = rgbToHsl(rgbValues);

  rgbValueToInput(rgbValues);
  hslValuesToInput(hslValues);
  setMainBackgroundColor(hexToCssHex(hexValue));
}

function convertFromRgb() {
  const rgbValues = {
      r: rgbInputs.rInput.value,
      g: rgbInputs.gInput.value,
      b: rgbInputs.bInput.value,
    },
    hslValues = rgbToHsl(rgbValues),
    hexValue = rgbToHex(rgbValues);

  hslValuesToInput(hslValues);
  hexValueToInput(hexValue);
  setMainBackgroundColor(rgbToCssRgb(rgbValues));
}

function convertFromHsl() {
  const hslValues = {
      h: hslInputs.hInput.value,
      s: hslInputs.sInput.value,
      l: hslInputs.lInput.value,
    },
    rgbValues = hslToRgb(hslValues),
    hexValue = rgbToHex(rgbValues);

  rgbValueToInput(rgbValues);
  hexValueToInput(hexValue);
  setMainBackgroundColor(hslToCssHsl(hslValues));
}

function convertButtonSetup() {
  convertButton.addEventListener("click", () => {
    switch (lastSelect) {
      case "hex":
        convertFromHex();
        break;
      case "rgb":
        convertFromRgb();
        break;
      case "hsl":
        convertFromHsl();
        break;
      default:
        break;
    }
  });
}

hexInputSetup();
rgbInputSetup();
hslInputSetup();
convertButtonSetup();
