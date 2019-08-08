
import {
    loadConfiguration,
    connect,
    keepPinging 
  } from "./utils.js"

import {SSB} from "./ssb.js"

window.hermiebox = hermiebox 
console.log("hermiebox", hermiebox)

// Display the userguide or release notes depending if the add-on was
// installed or updated.
function installedOrUpdated(details) {
    let url;
    let version = browser.runtime.getManifest().version;
    switch (details.reason) {
        case "update":
            url = browser.extension.getURL("/docs/index.html#/release_notes/2019.6.2");
            browser.tabs.create({
                url: `${url}`
            });
            break;
        case "install":
            url = browser.extension.getURL("/docs/index.html#/guide");
            browser.tabs.create({
                url: `${url}`
            });
            break;
    }
}

browser.runtime.onInstalled.addListener(installedOrUpdated)

// Build caches

let contactWorker

const backgroundMain = async () => {
    console.log("starting worker")
    contactWorker = new SharedWorker('contactWorker.js')
    console.log("worker", contactWorker)
    contactWorker.port.onmessage = e => {
        console.log("[[ contact worker ]]", e)
    }
    contactWorker.port.postMessage({command: "connect"})
}

console.log("background started")
backgroundMain()