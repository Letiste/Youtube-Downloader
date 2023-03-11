// ==UserScript==
// @name         Youtube Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send the url to a local server, to download the video's audio
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/18069be1/img/favicon_32x32.png
// @grant        none
// ==/UserScript==

/* <div>
    <input type="checkbox" id="coding" name="interest" value="coding" checked>
    <label for="coding">Coding</label>
  </div>
  <div>
    <input type="checkbox" id="music" name="interest" value="music">
    <label for="music">Music</label>
  </div>
  */

  (function() {
    'use strict';
    let isLastKeyControl = false
    document.addEventListener("keydown", event => {
        if (event.key === 'Control') {
            isLastKeyControl = true
            return
        } else if (isLastKeyControl && (event.key === 'y' || event.key === 'Y')) {
            isLastKeyControl = false
            createForm()
        } else {
            isLastKeyControl = false
        }
    })
})();

function sendVideoLink(values) {
    const playlists = values.map(value => `playlist=${value}&`).join('').slice(0, -1)
    fetch(`http://127.0.0.1:4897?url=${document.URL}&${playlists}`)
    const element = document.createElement('div')
    const newContent = document.createTextNode("URL sent!");
    element.style.position = "fixed"
    element.style.zIndex = 1000
    element.style.bottom = "50px"
    element.style.left = "20px"
    element.style.fontSize = "15px"
    element.style.color = "white"
    element.style.padding = "5px"
    element.style.backgroundColor = "green"
    element.style.borderWidth = "2px"
    element.style.borderRadius = "5px"
    element.id = "yt-downloader"
    element.appendChild(newContent);
    document.body.appendChild(element)
    setTimeout(() => element.remove(), 1000)
}

function createForm() {
    const form = document.createElement('div');
    form.appendChild(document.createTextNode('Download the music to which playlists: '))
    form.style.position = 'fixed';
    form.style.zIndex = 1000;
    form.style.bottom = '50px';
    form.style.left = '20px';
    form.style.fontSize = '15px';
    form.style.backgroundColor = "white"
    form.appendChild(createCheckbox('general', true));
    form.appendChild(createCheckbox('sport'));
    const submit = document.createElement('button');
    submit.appendChild(document.createTextNode('submit'));
    const handler = () => {
        const values = retrieveValues();
        submit.removeEventListener('click', handler);
        form.remove();
        sendVideoLink(values)
    }
    submit.addEventListener('click', handler);
    form.appendChild(submit);
    document.body.appendChild(form);
    submit.focus()
}

function createCheckbox(value, isChecked=false) {
    const element = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = value;
    checkbox.name = 'playlist';
    checkbox.value = value;
    checkbox.classList.add('yt-downloader')
    checkbox.checked = isChecked
    const label = document.createElement('label');
    label.htmlFor = value;
    const text = document.createTextNode(value);
    label.appendChild(text);
    element.appendChild(checkbox);
    element.appendChild(label);
    return element;
}

function retrieveValues() {
    const inputs = Array.from(document.querySelectorAll('.yt-downloader'));
    return inputs.filter((input) => input.checked).map((input) => input.value);
}
