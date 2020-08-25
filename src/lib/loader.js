/**
 * @fileoverview Handles SPA loading and importing the correct page entrypoint for web.dev.
 *
 * Exports a single function, swapContent, which ensures that the inner contents of the web.dev
 * template is correct, and that the correct JS entrypoint is ready.
 */

import {store} from './store';
import {normalizeUrl, getCanonicalPath} from './urls';
import './utils/underscore-import-polyfill';

const resourceVersion = document.body.getAttribute('data-version');

/**
 * Dynamically loads code required for the passed URL entrypoint.
 *
 * @param {string} url normalize pathname of the page to load modules for.
 * @return {!Promise<?>}
 */
async function loadEntrypoint(url) {
  url = getCanonicalPath(url);
  const prefixTo = url.indexOf('/', 1);
  const prefix = url.substring(1, prefixTo === -1 ? url.length : prefixTo);

  // This is a switch as it's easy to see all entrypoints (vs. lots of if/else).
  // We can't dynamically generate the argument to import as Rollup rewrites
  // import() statements as a whole for us.
  switch (prefix) {
    case 'measure':
      return import('./pages/measure.js');

    case 'live':
      return import('./pages/live.js');

    case 'newsletter':
      return import('./pages/newsletter.js');
  }

  return import('./pages/default.js');
}

/**
 * Gets the HTML content of the target normalized URL. Returns null if aborted.
 *
 * If the HTML is missing (i.e., 404) this throws an error. This means that
 * requests to missing pages will do an additional network round-trip. This is
 * important as there might be a configured redirect.
 *
 * @param {string} url of the page to fetch.
 * @param {!AbortSignal=} signal
 * @return {!Promise<{offline: boolean, html: string}>}
 */
export async function getHTML(url, signal) {
  if (!(url.endsWith('/') || url.endsWith('.html'))) {
    throw new Error(`can't fetch HTML for unsupported URL: ${url}`);
  }

  try {
    const res = await fetch(url, {signal});
    if (!res.ok) {
      throw res.status;
    }
    console.info('got response', res);
    const offline = res.headers.has('X-Offline'); // set by SW
    const html = await res.text();
    return {
      offline,
      html,
    };
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return null;
    }
    throw e;
  }
}

/**
 * Force the user's cursor to the target element, making it focusable if needed.
 * After the user blurs from the target, it will restore to its initial state.
 *
 * @param {HTMLElement?} el
 */
function forceFocus(el) {
  if (!el) {
    // do nothing
  } else if (el.hasAttribute('tabindex')) {
    el.focus();
  } else {
    // nb. This will also operate on elements that implicitly allow focus, but
    // it should be harmless there (aside hiding the focus ring with
    // w-force-focus).
    el.tabIndex = -1;
    el.focus();
    el.classList.add('w-force-focus');

    el.addEventListener(
      'blur',
      () => {
        el.removeAttribute('tabindex');
        el.classList.remove('w-force-focus');
      },
      {once: true},
    );
  }
}

/**
 * Replaces the current #content element with new partial content.
 *
 * @param {{offline: boolean, html: string}} partial
 */
function updateDom(partial) {
  const incomingDocument = new DOMParser().parseFromString(
    partial.html,
    'text/html',
  );

  const incomingResourceVersion = incomingDocument.getAttribute('data-version');
  if (incomingResourceVersion !== resourceVersion) {
    throw new Error(
      `version was=${resourceVersion} now=${incomingResourceVersion}`,
    );
  }

  const incomingContent = incomingDocument.querySelector('main #content');

  const content = document.querySelector('main #content');
  content.innerHTML = incomingContent.innerHTML;

  // Close any open self-assessment modals. These exist as children of <body>.
  // TODO(samthor): Replace this logic with a store subscriber that allows
  // all components to clean up after themselves when the page changes.
  const assessmentsOpen = document.querySelectorAll('web-assessment[open]');
  for (const assessment of assessmentsOpen) {
    assessment.remove();
  }

  // Update the page title.
  document.title = incomingDocument.title;

  /** @type HTMLLinkElement */
  const rss = document.querySelector('link[type="application/atom+xml"]');
  if (rss) {
    const incomingRSS = incomingDocument.querySelector(
      'link[type="application/atom+xml"]',
    );
    rss.href = incomingRSS.rss || rss.href;
  }

  // Focus on the first title (or fallback to content itself).
  /** @type HTMLHeadingElement */
  const toFocus = content.querySelector('h1, h2, h3, h4, h5, h6');
  forceFocus(toFocus || content);
}

/**
 * Swap the current page for a new one. Accepts an incoming URL.
 *
 * @param {{
 *   firstRun: boolean,
 *   url: string,
 *   signal: !AbortSignal,
 *   ready: function(string, ?Object): void,
 *   state: ?Object,
 * }} object
 */
export async function swapContent({firstRun, url, signal, ready, state}) {
  url = normalizeUrl(url);

  // Kick off loading the correct JS entrypoint.
  const entrypointPromise = loadEntrypoint(url);

  // If this is the first run, bail out early. We generate an inferred payload for back/forward nav,
  // as we only have the initial prerendered HTML.
  if (firstRun) {
    const inferredPayload = {
      offline: store.getState().isOffline,
      html: document.documentElement.outerHTML,
    };
    ready(url, {payload: inferredPayload});
    return entrypointPromise;
  }

  // Either use a partial from the previous state (user has hit back/forward) if it's not offline,
  // or fetch it anew from the network.
  let payload;
  if (state && state.payload && !state.payload.offline) {
    payload = state.payload;
  } else {
    store.setState({isPageLoading: true});
    payload = await getHTML(url, signal);
    if (signal.aborted) {
      return;
    }
  }

  // Code in entrypoint.jsuses this to trigger a reload if we see an "online" event. This partial
  // value is only returned via the Service Worker if we failed to fetch a 'real' page.
  const isOffline = Boolean(payload.offline);
  store.setState({currentUrl: url, isOffline});

  // Inform the router that we're ready early (even though the JS isn't done). This updates the URL,
  // which must happen before DOM changes and ga event.
  ready(url, {payload});

  ga('set', 'page', window.location.pathname);
  ga('send', 'pageview');
  updateDom(payload);

  // Finally, just await for the entrypoint JS. It this fails we'll throw an exception and force a
  // complete reload.
  await entrypointPromise;

  if (!signal.aborted) {
    store.setState({isPageLoading: false});
  }
}
