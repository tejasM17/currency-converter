const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
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
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    const response = await fetch(URL);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed: ${text}`);
    }

    const data = await response.json();
    const rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

    if (!rate) {
      throw new Error(`Rate not available for ${fromCurr.value} to ${toCurr.value}`);
    }

    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    msg.innerText = `Error: ${err.message}`;
    console.error(err);
  }
};


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});









const majorCurrencies = {
  "usd": { name: "United States", flag: "https://flagsapi.com/US/flat/32.png" },
  "inr": { name: "India", flag: "https://flagsapi.com/IN/flat/32.png" },
  "eur": { name: "European Union", flag: "https://flagsapi.com/FR/flat/32.png" },
  "gbp": { name: "United Kingdom", flag: "https://flagsapi.com/GB/flat/32.png" },
  "jpy": { name: "Japan", flag: "https://flagsapi.com/JP/flat/32.png" },
};
 const commonCurrencies = {
    "aud": { name: "Australia", flag: "https://flagsapi.com/AU/flat/32.png" },
    "cad": { name: "Canada", flag: "https://flagsapi.com/CA/flat/32.png" },
    "cny": { name: "China", flag: "https://flagsapi.com/CN/flat/32.png" },
    "chf": { name: "Switzerland", flag: "https://flagsapi.com/CH/flat/32.png" },
    "aed": { name: "United Arab Emirates", flag: "https://flagsapi.com/AE/flat/32.png" },
  };




 function fillReference(listId, obj) {
    const el = document.getElementById(listId);
    for (let code in obj) {
      let li = document.createElement("li");
      li.innerHTML = `
        <img src="${obj[code].flag}" width="30">
        <span>${obj[code].name} (${code.toUpperCase()})</span>
      `;
      el.appendChild(li);
    }
  }

  fillReference("left-list", majorCurrencies);
  fillReference("right-list", commonCurrencies);