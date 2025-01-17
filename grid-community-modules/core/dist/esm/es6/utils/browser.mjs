/**
 * These variables are lazy loaded, as otherwise they try and get initialised when we are loading
 * unit tests and we don't have references to window or document in the unit tests
 */
let isSafari;
let safariVersion;
let isChrome;
let isFirefox;
let isMacOs;
let isIOS;
let invisibleScrollbar;
let browserScrollbarWidth;
export function isBrowserSafari() {
    if (isSafari === undefined) {
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    return isSafari;
}
export function getSafariVersion() {
    if (safariVersion === undefined) {
        if (isBrowserSafari()) {
            const versionMatch = navigator.userAgent.match(/version\/(\d+)/i);
            if (versionMatch) {
                safariVersion = versionMatch[1] != null ? parseFloat(versionMatch[1]) : 0;
            }
        }
        else {
            safariVersion = 0;
        }
    }
    return safariVersion;
}
/**
 * Returns true for Chrome and also for Edge (Chromium)
 */
export function isBrowserChrome() {
    if (isChrome === undefined) {
        const win = window;
        isChrome = (!!win.chrome && (!!win.chrome.webstore || !!win.chrome.runtime)) ||
            (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor));
    }
    return isChrome;
}
export function isBrowserFirefox() {
    if (isFirefox === undefined) {
        isFirefox = /(firefox)/i.test(navigator.userAgent);
    }
    return isFirefox;
}
export function isMacOsUserAgent() {
    if (isMacOs === undefined) {
        isMacOs = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    }
    return isMacOs;
}
export function isIOSUserAgent() {
    if (isIOS === undefined) {
        isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) ||
            // eslint-disable-next-line
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    }
    return isIOS;
}
export function browserSupportsPreventScroll() {
    // all browsers except safari support focus({ preventScroll: true }).
    // this feature was added on Safari 15+
    return !isBrowserSafari() || getSafariVersion() >= 15;
}
export function getTabIndex(el) {
    if (!el) {
        return null;
    }
    const numberTabIndex = el.tabIndex;
    const tabIndex = el.getAttribute('tabIndex');
    if (numberTabIndex === -1 && (tabIndex === null || (tabIndex === '' && !isBrowserFirefox()))) {
        return null;
    }
    return numberTabIndex.toString();
}
export function getMaxDivHeight() {
    if (!document.body) {
        return -1;
    }
    let res = 1000000;
    // FF reports the height back but still renders blank after ~6M px
    const testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? 6000000 : 1000000000;
    const div = document.createElement('div');
    document.body.appendChild(div);
    while (true) {
        const test = res * 2;
        div.style.height = test + 'px';
        if (test > testUpTo || div.clientHeight !== test) {
            break;
        }
        else {
            res = test;
        }
    }
    document.body.removeChild(div);
    return res;
}
export function getBodyWidth() {
    var _a, _b, _c;
    return (_b = (_a = document.body) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : (window.innerHeight || ((_c = document.documentElement) === null || _c === void 0 ? void 0 : _c.clientWidth) || -1);
}
export function getBodyHeight() {
    var _a, _b, _c;
    return (_b = (_a = document.body) === null || _a === void 0 ? void 0 : _a.clientHeight) !== null && _b !== void 0 ? _b : (window.innerHeight || ((_c = document.documentElement) === null || _c === void 0 ? void 0 : _c.clientHeight) || -1);
}
export function getScrollbarWidth() {
    if (browserScrollbarWidth == null) {
        initScrollbarWidthAndVisibility();
    }
    return browserScrollbarWidth;
}
function initScrollbarWidthAndVisibility() {
    const body = document.body;
    const div = document.createElement('div');
    div.style.width = div.style.height = '100px';
    div.style.opacity = '0';
    div.style.overflow = 'scroll';
    div.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    div.style.position = 'absolute';
    body.appendChild(div);
    let width = div.offsetWidth - div.clientWidth;
    // if width is 0 and client width is 0, means the DOM isn't ready
    if (width === 0 && div.clientWidth === 0) {
        width = null;
    }
    // remove div
    if (div.parentNode) {
        div.parentNode.removeChild(div);
    }
    if (width != null) {
        browserScrollbarWidth = width;
        invisibleScrollbar = width === 0;
    }
}
export function isInvisibleScrollbar() {
    if (invisibleScrollbar == null) {
        initScrollbarWidthAndVisibility();
    }
    return invisibleScrollbar;
}
