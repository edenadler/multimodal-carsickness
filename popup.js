let toggle = document.getElementById("checkbox-toggle");
let toggleResult = document.getElementById("toggleResult");

let slider = document.getElementById("slider-range");
let sliderValue = document.getElementById("rangevalue");
console.log('popup opened');


toggle.addEventListener("change", function () {
  console.log('toggle change detected', toggle.checked);
  toggleResult.innerHTML = toggle.checked;

  chrome.storage.local.set({'toggleChecked': toggle.checked});
})

slider.addEventListener("change", function () {
  console.log('slider change detected', slider.value);
  sliderValue.innerHTML = slider.value;

  chrome.storage.local.set({'sliderValue': slider.value});
})