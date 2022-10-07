const objToQueryString = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

var randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

var genRange = (min, max, step) => {
  const range = [];
  for (let i = min; i < max; i += step) {
    range.push(i);
  }
  return range;
};

var randomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

class Generator {
  baseUrl = true
    ? "http://localhost:3000/"
    : "https://palm-elderly-soursop.glitch.me/";
  priceWidgetRoute = "price-widget";

  settingsForm;
  productUrlInput;
  resetSettingsButton;

  previewFrame;
  codeBlock;
  spinner;

  autoUpdateInput;
  generateButton;
  luckyButton;
  copyButton;

  autoUpdate = true;
  embedSource;
  embedCode;

  constructor() {
    this.settingsForm = document.querySelector("#settings-form");

    this.productUrlInput = document.querySelector("#product-url-input");

    this.fontFamilySelect = document.querySelector("select[name='fontFamily']");
    this.fontSizeInput = document.querySelector("input[name='fontSize']");
    this.strokeWidthInput = document.querySelector("input[name='strokeWidth']");
    this.strokeColorInput = document.querySelector("input[name='strokeColor']");
    this.fontWeightInput = document.querySelector("input[name='fontWeight']");
    this.colorInput = document.querySelector("input[name='color']");

    this.defaultFontSize = this.fontSizeInput.value;
    this.defaultStrokeWidth = this.strokeWidthInput.value;
    this.defaultStrokeColor = this.strokeColorInput.value;
    this.defaultFontWeight = this.fontWeightInput.value;
    this.defaultColor = this.colorInput.value;

    this.resetSettingsButton = document.querySelector("#reset-settings-button");

    this.previewFrame = document.querySelector("#preview-frame");
    this.codeBlock = document.querySelector("#code-block");
    this.spinner = document.querySelector("#spinner");

    this.autoUpdateInput = document.querySelector("#auto-update-input");
    this.generateButton = document.querySelector("#generate-button");
    this.luckyButton = document.querySelector("#lucky-button");
    this.copyButton = document.querySelector("#copy-button");

    this.previewFrame.addEventListener("load", () => {
      this.setSpinnerVisible(false);
    });

    this.productUrlInput.addEventListener("focusout", (e) => {
      this.validateProductUrl(e.target);
    });

    [
      ...this.settingsForm.querySelectorAll("input"),
      ...this.settingsForm.querySelectorAll("select"),
    ].forEach((input) => {
      input.addEventListener("change", () => {
        if (this.autoUpdate) {
          this.generateEmbedCode();
        }
      });
    });

    this.resetSettingsButton.addEventListener("click", () => {
      this.resetSettings();
    });

    this.generateButton.addEventListener("click", (e) => {
      this.generateEmbedCode();
    });

    this.fonts = [
      "Arial",
      "Verdana",
      "Tahoma",
      "Trebuchet MS",
      "Times New Roman",
      "Georgia",
      "Garamond",
      "Courier New",
      "Brush Script MT",
    ];
    this.fontSizes = genRange(0.1, 4, 0.1);
    this.strokeWidths = genRange(0.1, 4, 0.1);
    this.fontWeights = genRange(100, 1000, 100);

    this.luckyButton.addEventListener("click", () => {
      this.randomize();
    });

    this.autoUpdateInput.addEventListener("change", (e) => {
      this.setAutoUpdateEnabled(e.target.checked);
    });

    this.copyButton.addEventListener("click", () => {
      this.copyEmbedCode();
    });

    this.generateEmbedCode();
  }

  setAutoUpdateEnabled(enabled) {
    console.log(enabled);
    this.autoUpdate = enabled;
  }

  setProductUrlInputColor(colorClass) {
    for (let c of ["uk-form-success", "uk-form-danger"]) {
      this.productUrlInput.classList.remove(c);
    }
    if (colorClass) {
      this.productUrlInput.classList.add(colorClass);
    }
  }

  resetSettings() {
    this.settingsForm.reset();
    this.setProductUrlInputColor();
    setTimeout(() => {
      this.generateEmbedCode();
    }, 1);
  }

  validateProductUrl(input) {
    try {
      const urlObj = new URL(input.value);
      const hostname = urlObj.hostname;
      const validHostnames = [
        "www.amazon.com",
        "www.walmart.com",
        "www.newegg.com",
        "www.bestbuy.com",
      ];
      if (validHostnames.includes(hostname)) {
        this.setProductUrlInputColor("uk-form-success");
      } else {
        console.log("invalid hostname");
        this.setProductUrlInputColor("uk-form-danger");
      }
    } catch (error) {
      console.log("failed to validate", error);
      this.setProductUrlInputColor("uk-form-danger");
    }
  }

  setSpinnerVisible(visible) {
    const spinner = this.spinner;
    if (visible) {
      spinner.classList.remove("uk-hidden");
    } else {
      spinner.classList.add("uk-hidden");
    }
  }

  copyEmbedCode() {
    navigator.clipboard.writeText(curEmbedCode);
    UIkit.notification({
      message: "Copied to clipboard!",
      status: "success",
      pos: "top-center",
      timeout: 5000,
    });
  }

  getSettings() {
    const formData = new FormData(this.settingsForm);
    const settings = {};
    for (const [key, value] of formData) {
      settings[key] = value;
    }
    return settings;
  }

  generateEmbedCode() {
    const settings = this.getSettings();
    const queryString = objToQueryString(settings);
    const src = `${this.baseUrl}${
      this.priceWidgetRoute
    }/?${queryString.trim()}`;
    let embedCode = `<iframe src="${src}"/>`;

    this.embedSource = src;
    this.embedCode = embedCode;

    this.codeBlock.innerText = embedCode;
    hljs.highlightAll();
    this.previewFrame.src = src;
    this.setSpinnerVisible(true);
  }

  randomize() {
    this.fontFamilySelect.value = randomElement(this.fonts);
    //fontFamilySelect.trigger("change");

    // we dont want to change font size
    // const fontSizeInput = this.fontSizeInput;
    // const randFontSize = randomElement(this.fontSizes);
    // fontSizeInput.setAttribute("value", randFontSize);
    // fontSizeInput.dispatchEvent(new Event("change"));

    const strokeWidthInput = this.strokeWidthInput;
    const randStrokeWidth = randomElement(this.strokeWidths);
    strokeWidthInput.value = randStrokeWidth;
    strokeWidthInput.dispatchEvent(new Event("change"));

    const fontWeightInput = this.fontWeightInput;
    const randFontWeight = randomElement(this.fontWeights);
    fontWeightInput.value = randFontWeight;
    fontWeightInput.dispatchEvent(new Event("change"));

    const colorInput = this.colorInput;
    const randColor = "#" + randomColor();
    colorInput.value = randColor;
    colorInput.dispatchEvent(new Event("change"));

    const strokeColorInput = this.strokeColorInput;
    const randColor2 = "#" + randomColor();
    strokeColorInput.value = randColor2;
    strokeColorInput.dispatchEvent(new Event("change"));

    this.generateEmbedCode();
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  new Generator();
});
