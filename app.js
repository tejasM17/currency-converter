const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#converter-section button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const swapIcon = document.querySelector(".swap-icon");

let currentRate = null;

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

// Debounce for input
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Update exchange rate
const updateExchangeRate = async () => {
  let amtVal = parseFloat(amountInput.value);
  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const fromVal = fromCurr.value.toLowerCase();
  const toVal = toCurr.value.toLowerCase();

  msg.style.opacity = 0;

  try {
    if (
      !currentRate ||
      fromCurr._lastFrom !== fromVal ||
      fromCurr._lastTo !== toVal
    ) {
      const URL = `${BASE_URL}/${fromVal}.json`;
      const response = await fetch(URL);
      if (!response.ok)
        throw new Error(`Request failed: ${await response.text()}`);
      const data = await response.json();
      currentRate = data[fromVal][toVal];
      if (!currentRate)
        throw new Error(
          `Rate not available for ${fromCurr.value} to ${toCurr.value}`
        );
      fromCurr._lastFrom = fromVal;
      fromCurr._lastTo = toVal;
    }

    const finalAmount = (amtVal * currentRate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    msg.innerText = `Error: ${err.message}`;
    console.error(err);
  } finally {
    setTimeout(() => {
      msg.style.opacity = 1;
    }, 10);
  }
};

// Swap
swapIcon.addEventListener("click", () => {
  const temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateFlag(fromCurr);
  updateFlag(toCurr);
  currentRate = null;
  updateExchangeRate();
});

// Events
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

amountInput.addEventListener("input", debounce(updateExchangeRate, 500));

window.addEventListener("load", () => {
  updateExchangeRate();
});

// Navbar Toggle
const converterLink = document.getElementById("converter-link");
const calculatorLink = document.getElementById("calculator-link");
const converterSection = document.getElementById("converter-section");
const calculatorSection = document.getElementById("calculator-section");

converterLink.addEventListener("click", (e) => {
  e.preventDefault();
  converterSection.classList.add("active");
  calculatorSection.classList.remove("active");
  converterLink.classList.add("active");
  calculatorLink.classList.remove("active");
});

calculatorLink.addEventListener("click", (e) => {
  e.preventDefault();
  calculatorSection.classList.add("active");
  converterSection.classList.remove("active");
  calculatorLink.classList.add("active");
  converterLink.classList.remove("active");
});

// Scientific Calculator Functions
let calcDisplay = document.getElementById("calc-res");
let calcDegrees = true; // Default to degrees; can add toggle if needed

function calcSolve(val) {
  calcDisplay.value += val;
}

function calcResult() {
  let expression = calcDisplay.value;
  // Convert trig functions to radians if needed
  if (calcDegrees) {
    expression = expression.replace(/Math.sin\(/g, "Math.sin(Math.PI/180*");
    expression = expression.replace(/Math.cos\(/g, "Math.cos(Math.PI/180*");
    expression = expression.replace(/Math.tan\(/g, "Math.tan(Math.PI/180*");
    expression = expression.replace(/Math.asin\(/g, "180/Math.PI*Math.asin(");
    expression = expression.replace(/Math.acos\(/g, "180/Math.PI*Math.acos(");
    expression = expression.replace(/Math.atan\(/g, "180/Math.PI*Math.atan(");
  }
  try {
    calcDisplay.value = eval(expression);
  } catch {
    calcDisplay.value = "Error";
  }
}

function calcClear() {
  calcDisplay.value = "";
}

function calcBack() {
  calcDisplay.value = calcDisplay.value.slice(0, -1);
}
