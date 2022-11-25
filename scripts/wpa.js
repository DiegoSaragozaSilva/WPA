var requests = [];

function addRequest(requestDetails) {
    requests.push(requestDetails);
}

function getRequests() {
    return requests;
}

function getLocalStorageSize() {
    // Code from https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage
    var allStrings = '';
    for(var key in window.localStorage){
        if(window.localStorage.hasOwnProperty(key))
            allStrings += window.localStorage[key];
    }
    return allStrings ? 3 + ((allStrings.length * 16) / (8 * 1024)): 0;
}

async function getInjectedCookies() {
    var cookies = browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        return browser.cookies.getAll({"url": tabs[0].url});
    });
    return cookies;
}

async function getHttpsActive() {
    var isHttps = browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        return tabs[0].url.includes("https:");
    });
    return isHttps;
}

function debugCall() {
    return "All working from the background!";
}

// Requests callback
browser.webRequest.onBeforeRequest.addListener(
    addRequest,
    {"urls": ["<all_urls>"]}
);
