/**
 * @fileoverview Handles SPA loading and importing the correct page entrypoint for web.dev.
 *
 * Exports a single function, swapContent, which ensures that the inner contents of the web.dev
 * template is correct, and that the correct JS entrypoint is ready.
 */

import {store} from './store';
import {normalizeUrl, getCanonicalPath} from './urls';
import './utils/underscore-import-polyfill';

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
 * Gets the partial content of the target normalized URL. Returns null if aborted.
 *
 * If the partial is missing (i.e., 404) this throws an error. This means that
 * requests to missing pages will do an additional network round-trip. This is
 * important as there might be a configured redirect.
 *
 * @param {string} url of the page to fetch.
 * @param {!AbortSignal=} signal
 * @return {Promise<{raw: string, title: string, offline: (boolean|undefined)}>}
 */
export async function getPartial(url, signal) {
  if (!url.endsWith('/')) {
    throw new Error(`partial unsupported for non-folder: ${url}`);
  }
  try {
    const res = await fetch(url + 'index.json', {signal});
    if (!res.ok) {
      throw res.status;
    }
    return await res.json();
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
 * @param {!Object} partial
 */
function updateDom(partial) {
  /** @type HTMLElement */
  const content = document.querySelector('main #content');
  content.innerHTML = partial.raw;

  // Close any open self-assessment modals.
  // TODO(samthor): Replace this logic with a store subscriber that allows
  // all components to clean up after themselves when the page changes.
  const assessmentsOpen = document.querySelectorAll('web-assessment[open]');
  for (const assessment of assessmentsOpen) {
    assessment.remove();
  }

  // Update the page title.
  document.title = partial.title || '';

  /** @type HTMLLinkElement */
  const rss = document.querySelector('link[type="application/atom+xml"]');
  if (rss) {
    rss.href = partial.rss || rss.href;
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

  // If this is the first run, bail out early. We generate an inferred partial for back/forward nav,
  // as we only have the initial prerendered HTML.
  if (firstRun) {
    const content = document.querySelector('main #content');
    const inferredPartial = {
      raw: content.innerHTML,
      title: document.title,
    };
    if (store.getState().isOffline) {
      inferredPartial.offline = true;
    }
    ready(url, {partial: inferredPartial});
    return entrypointPromise;
  }

  // Either use a partial from the previous state (user has hit back/forward) if it's not offline,
  // or fetch it anew from the network.
  let partial;
  if (state && state.partial && !state.partial.offline) {
    partial = state.partial;
  } else {
    store.setState({isPageLoading: true});
    partial = await getPartial(url, signal);
    if (signal.aborted) {
      return;
    }
  }

  // Code in entrypoint.jsuses this to trigger a reload if we see an "online" event. This partial
  // value is only returned via the Service Worker if we failed to fetch a 'real' page.
  const isOffline = Boolean(partial.offline);
  store.setState({currentUrl: url, isOffline});

  // Inform the router that we're ready early (even though the JS isn't done). This updates the URL,
  // which must happen before DOM changes and ga event.
  ready(url, {partial});

  ga('set', 'page', window.location.pathname);
  ga('send', 'pageview');
  updateDom(partial);

  // Finally, just await for the entrypoint JS. It this fails we'll throw an exception and force a
  // complete reload.
  await entrypointPromise;

  if (!signal.aborted) {
    store.setState({isPageLoading: false});
  }
}
