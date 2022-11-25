var backgroundWPA = chrome.extension.getBackgroundPage();

var maxThirdPartyRequests = 300;
var maxLocalStorageSize = 10240; // 10MB
var maxCookies = 30;

async function fetchRequests() {
    await asyncDelay(5000);
    requests = backgroundWPA.getRequests();

    if (requests.length === 0) return;

    var thirdPartyRequests = 0;
    requests.forEach(function(request) {
        thirdPartyRequests += request.thirdParty === true;
    });

    document.getElementById("pThirdParty").innerHTML = thirdPartyRequests + " third party requests";
    document.getElementById("pThirdParty").classList.add(thirdPartyRequests < 0.5 * maxThirdPartyRequests ? "text-sucess" : (thirdPartyRequests < 0.75 * maxThirdPartyRequests ? "text-warning" : "text-danger")); 
    return thirdPartyRequests;
}

async function fetchLocalStorageSize() {
    await asyncDelay(5000);
    localStorageSize = backgroundWPA.getLocalStorageSize();

    document.getElementById("pLocalStorageSize").innerHTML = localStorageSize + " KB from local storage";
    document.getElementById("pLocalStorageSize").classList.add(localStorageSize < 0.5 * maxLocalStorageSize ? "text-sucess" : (localStorageSize < 0.75 * maxLocalStorageSize ? "text-warning" : "text-danger")); 

    return localStorageSize;
}

async function fetchInjectedCookies() {
    await asyncDelay(5000);
    injectedCookies = await backgroundWPA.getInjectedCookies();

    let secureCookies = 0, sessionCookies = 0;
    injectedCookies.forEach(function(cookie) {
        secureCookies += cookie.secure;
        sessionCookies += cookie.session;
    });

    console.log(injectedCookies);

    var partialCookies = injectedCookies.length - secureCookies;

    document.getElementById("pInjectedCookies").innerHTML = injectedCookies.length + " cookies injected | " + secureCookies + " secure cookies | " + sessionCookies + " session cookies";
    document.getElementById("pInjectedCookies").classList.add(partialCookies < 0.5 * maxCookies ? "text-sucess" : (partialCookies < 0.75 * maxCookies ? "text-warning" : "text-danger")); 

    return injectedCookies;
}

async function fetchHttpsActive() {
    await asyncDelay(5000);
    var isHttps = await backgroundWPA.getHttpsActive();
    
    document.getElementById("pIsHttps").innerHTML = isHttps === true ? "Secure SSL connection detected" : "Insecure SSL connection";
    document.getElementById("pIsHttps").classList.add = isHttps === true ? "text-success" : "text-danger";
    
    return isHttps;
}

function calculatePageScore(thirdPartyRequests, localStorageSize, injectedCookies, isHttps) {
    // T(n) = n^2
    var thirdPartyScore = thirdPartyRequests >= maxThirdPartyRequests ? 1.0 : Math.pow((thirdPartyRequests / maxThirdPartyRequests), 2);

    // L(m) = m^4
    var localStorageScore = localStorageSize >= maxLocalStorageSize ? 1.0 : Math.pow((localStorageSize / maxLocalStorageSize), 4);

    // C(k) = k^8
    var cookieScore = injectedCookies.length >= maxCookies ? 1.0 : Math.pow((injectedCookies.length / maxCookies), 8);

    // S(n, m, k) = (0.25 * T(n) + 0.15 * L(m) + 0.2 * C(k) * 0.4 * H) / 4
    var finalScore = 100.0 * (1.0 - ((0.25 * thirdPartyScore) + (0.15 * localStorageScore) + (0.2 * cookieScore) + (0.4 * isHttps)) / 4.0);
    document.getElementById("pPageScore").innerHTML = "Page score: " + finalScore.toFixed(2); 

    if (finalScore >= 0.75)
        document.getElementById("pSpanSuccess").classList.remove("gHidden");
    else if (finalScore >= 0.5 && finalScore < 0.75)
        document.getElementById("pSpanWarning").classList.remove("gHidden");
    else
        document.getElementById("pSpanDanger").classList.remove("gHidden");
}

function asyncDelay(time) {
    return new Promise(res => setTimeout(res, time));
}

var thirdPartyRequests = fetchRequests();
var localStorageSize = fetchLocalStorageSize();
var injectedCookies = fetchInjectedCookies();
var isHttps = fetchHttpsActive();

thirdPartyRequests.then((requestRes) => {
    localStorageSize.then((storageRes) => {
        injectedCookies.then((cookieRes) => {
            isHttps.then((httpsRes) => {
                calculatePageScore(requestRes, storageRes, cookieRes, httpsRes);
            });
        });
    });
});
