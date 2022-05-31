"use strict";
const el = document.getElementById("wrapper");
const toggleButton = document.getElementById("menu-toggle");
const showData = document.querySelector("#showData");
let jsonData;

toggleButton.onclick = function () {
  el.classList.toggle("toggled");
};

fetch("https://corona-api.com/timeline")
  .then(function (response) {
    // checks if received okay:
    console.log(`response: ${response.status}`);
    return response.json();
  })
  .then(function (data) {
    // assigns the data to a variable

    showData.innerHTML = data.data[0].confirmed;
    console.log(data);
  });
