let toggle = document.getElementById("checkbox-toggle");
let slider = document.getElementById("slider-range");
console.log('popup opened')


toggle.addEventListener("change", function () {
  console.log('toggle change detected', toggle.checked)
  chrome.storage.local.set({'toggleChecked': toggle.checked});
})

slider.addEventListener("change", function () {
  console.log('slider change detected', slider.value);
  document.getElementById("rangevalue").innerHTML = slider.value;
  chrome.storage.local.set({'sliderValue': slider.value});
})


// // Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// // When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: setPageBackgroundColor,
//     });
//   });
  
//   // The body of this function will be executed as a content script inside the
//   // current page
//   function setPageBackgroundColor() {
//     chrome.storage.sync.get("color", ({ color }) => {
//       document.body.style.backgroundColor = color;
//     });
//   }