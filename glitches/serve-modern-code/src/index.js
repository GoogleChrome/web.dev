// Copyright 2018 Google LLC.
// SPDX-License-Identifier: Apache-2.0

import "./style.css";
import "@babel/polyfill";

const content = document.getElementById("content")

const clickText = (event) => {
  const val = event.currentTarget.textContent;
  content.innerHTML = `<p>${val}</p>`;
}

const clickEmoji = (event) => {
  const val = event.currentTarget.textContent;
  content.innerHTML = `<p>${val}${val}${val}${val}</p>`;
}

async function fetchKittie() {
  const img = document.createElement("img");
  const imgContainer = document.getElementById("img-container");

  try {
    const response = await fetch('https://aws.random.cat/meow');
    const { file } = await response.json();

    img.src = file;
  }
  catch (rejectedValue) {
    console.log('Something went wrong :(');
  }
  
  imgContainer.appendChild(img);
}

const init = () => {
  for (let btn of document.querySelectorAll('.text-button')) {
    btn.addEventListener('click', clickText);
  }
  
  for (let btn of document.querySelectorAll('.emoji-button')) {
    btn.addEventListener('click', clickEmoji);
  }
  
  fetchKittie();
}

init();