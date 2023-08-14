import {
  onCLS,
  onFCP,
  onFID,
  onINP,
  onLCP,
  onTTFB,
} from 'web-vitals/attribution';
import {store} from './store';
import {checkIfUserAcceptsCookies} from './actions.js';
import {version} from 'webdev_analytics';

// A function that should be called once all all analytics code has been
// initialized. Calling this will resolve the `whenAnalyticsInitialize`
// promise.
let markAnalyticsInitialized;

// A promise that settles once all analytics has been initialized.
// Internally this assigned the `resolve()` function to the module-level
// `markAnalyticsInitialized` variable.
const whenAnalyticsInitialized = new Promise((resolve) => {
  markAnalyticsInitialized = resolve;
});

/**
 * @param {string} name
 * @param {Object} params
 */
export async function logEvent(name, params) {
  await whenAnalyticsInitialized;
  gtag('event', name, params);
}

/**
 * Logs an error via Analytics with optional context message and fatal notice.
 *
 * @param {Error} error to log
 * @param {string=} message context to provide around error message
 * @param {boolean=} fatal whether this is fatal (as per Analytics' logging)
 */
export function logError(error, message = '', fatal = false) {
  const description = message ? `${message} (${error.message})` : error.message;
  logEvent('exception', {description, fatal});
}

/**
 * See: https://github.com/GoogleChrome/web-vitals#using-analyticsjs
 * @param {Object} metric
 */
function sendToGoogleAnalytics({
  name,
  value,
  delta,
  id,
  attribution,
  navigationType,
}) {
  const params = {
    event_category: 'Web Vitals',
    // The `id` value will be unique to the current page load. When sending
    // multiple values from the same page (e.g. for CLS), Google Analytics can
    // compute a total by grouping on this ID (note: requires `eventLabel` to
    // be a dimension in your report).
    event_label: id,
    // Google Analytics metrics must be integers, so the value is rounded.
    // For CLS the value is first multiplied by 1000 for greater precision
    // (note: increase the multiplier for greater precision if needed).
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    // Send the raw metric value in addition to the value computed for GA
    // so it's available in BigQuery and the API.
    metric_value: value,
    // This should already by set globally, but to ensure it's consistent
    // with the web-vitals library, set it again.
    // Override for 'navigational-prefetch' for the prefetch origin trial
    // experiment (https://github.com/GoogleChrome/web.dev/pull/9532)
    navigation_type:
      navigationType === 'navigate' &&
      performance.getEntriesByType &&
      performance.getEntriesByType('navigation')[0] &&
      performance.getEntriesByType('navigation')[0].deliveryType ===
        'navigational-prefetch'
        ? 'navigational-prefetch'
        : navigationType,
    // Use a non-interaction event to avoid affecting bounce rate.
    // This only applies to Universal Analytics and can be deleted once
    // we're only using GA4.
    non_interaction: true,
  };

  let overrides;
  let debug_input_delay;
  let debug_processing_time;
  let debug_presentation_delay;

  switch (name) {
    case 'CLS':
      overrides = {
        debug_time: attribution.largestShiftTime,
        debug_load_state: attribution.loadState,
        debug_target: attribution.largestShiftTarget || '(not set)',
      };
      break;
    case 'FCP':
      overrides = {
        debug_ttfb: attribution.timeToFirstByte,
        debug_fb2fcp: attribution.firstByteToFCP,
        debug_load_state: attribution.loadState,
        debug_target: attribution.loadState || '(not set)',
      };
      break;
    case 'FID':
      overrides = {
        debug_event: attribution.eventType,
        debug_time: attribution.eventTime,
        debug_load_state: attribution.loadState,
        debug_target: attribution.eventTarget || '(not set)',
      };
      break;
    case 'INP':
      if (attribution.eventEntry) {
        debug_input_delay = Math.round(
          attribution.eventEntry.processingStart -
            attribution.eventEntry.startTime,
        );
        debug_processing_time = Math.round(
          attribution.eventEntry.processingEnd -
            attribution.eventEntry.processingStart,
        );
        debug_presentation_delay = Math.round(
          // RenderTime is an estimate, because duration is rounded, and may get rounded down.
          // In rare cases it can be less than processingEnd and that breaks performance.measure().
          // Lets make sure its at least 4ms in those cases so you can just barely see it.
          Math.max(
            attribution.eventEntry.processingEnd + 4,
            attribution.eventEntry.startTime + attribution.eventEntry.duration,
          ) - attribution.eventEntry.processingEnd,
        );
      }
      overrides = {
        debug_event: attribution.eventType,
        debug_time: attribution.eventTime,
        debug_load_state: attribution.loadState,
        debug_target: attribution.eventTarget || '(not set)',
        debug_input_delay: debug_input_delay,
        debug_processing_time: debug_processing_time,
        debug_presentation_delay: debug_presentation_delay,
      };
      break;
    case 'LCP':
      overrides = {
        debug_url: attribution.url,
        debug_ttfb: attribution.timeToFirstByte,
        debug_rld: attribution.resourceLoadDelay,
        debug_rlt: attribution.resourceLoadTime,
        debug_erd: attribution.elementRenderDelay,
        debug_target: attribution.element || '(not set)',
      };
      break;
    case 'TTFB':
      overrides = {
        debug_waiting_time: attribution.waitingTime,
        debug_dns_time: attribution.dnsTime,
        debug_connection_time: attribution.connectionTime,
        debug_request_time: attribution.requestTime,
      };
      break;
  }

  logEvent(name, Object.assign(params, overrides));
}

/**
 * Configures logging events for any clicks on a link (`<a href="...">`)
 * or another relevant elements (class="gc-analytics-event"), searching
 * for (requiring at least `data-category`, but also allowing
 * `data-action`, `data-label` and `data-value`.
 */
function addClickEventListener() {
  document.addEventListener(
    'click',
    /**
     * @param {WMouseEvent} e
     */
    (e) => {
      const clickableEl = e.target.closest('a[href], .gc-analytics-event');
      if (!clickableEl) {
        return;
      }
      const event = clickableEl.dataset['action'] || 'click';
      const category = clickableEl.dataset['category'] || undefined;
      const label = clickableEl.dataset['label'] || undefined;
      // must be number, or is ignored
      const value = Number(clickableEl.dataset['value']) || undefined;

      if (event && category) {
        logEvent(event, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
    },
  );
}

/**
 * Adds a listener to detect back/forward cache restores and log them
 * as pageviews with the "back-forward-cache" navigation type set (in
 * case we need to distinguish them from regular pageviews).
 * https://web.dev/bfcache/#how-bfcache-affects-analytics-and-performance-measurement
 */
function addPageShowEventListener() {
  window.addEventListener(
    'pageshow',
    /**
     * @param {PageTransitionEvent} e
     */
    (e) => {
      if (e.persisted) {
        window.dataLayer.push({navigation_type: 'back-forward-cache'});
        logEvent('page_view');
      }
    },
  );
}

// Set up a promise for when the page is activated,
// which is needed for prerendered pages.
const whenPageActivated = new Promise((resolve) => {
  if (document.prerendering) {
    document.addEventListener('prerenderingchange', () => resolve());
  } else {
    resolve();
  }
});

/**
 * Gets the type of navigation for this page. In most cases this is the
 * value returned by the Navigation Timing API (normalized to use kebab case),
 * but in addition to this it also captures pages that were prerendered
 * as well as page that were restored after a discard.
 * @returns {string}
 */
function getNavigationType() {
  if (document.wasDiscarded) {
    return 'restore';
  }

  const navEntry =
    self.performance &&
    performance.getEntriesByType &&
    performance.getEntriesByType('navigation')[0];

  if (navEntry) {
    // Prerendered pages have an activationStart time after activation
    if (navEntry.activationStart > 0) {
      return 'prerender';
    } else if (
      // For the document speculation rules origin trial
      // overrwrite the navigation type
      navEntry.type === 'navigate' &&
      navEntry.deliveryType === 'navigational-prefetch'
    ) {
      return 'navigational-prefetch';
    } else {
      return navEntry.type.replace(/_/, '-');
    }
  }
  return '(not set)';
}

/**
 * Gets the type of navigation for this page. In most cases this is the
 * value returned by the Navigation Timing API (normalized to use kebab case),
 * but in addition to this it also captures pages that were prerendered
 * as well as page that were restored after a discard.
 * @returns {string|undefined}
 */
function getBackForwardNotRestoreReasons() {
  const navEntry =
    self.performance &&
    performance.getEntriesByType &&
    performance.getEntriesByType('navigation')[0];

  if (navEntry) {
    if (navEntry.notRestoredReasons) {
      return navEntry.notRestoredReasons.reasons.toString();
    }
  }
  return;
}

/**
 * Returns a list of any `prerender` speculation rules defined by any
 * `script[type=speculationrules]` elements on the page.
 * @returns {Object}
 */
function getPrerenderRules() {
  return [...document.querySelectorAll('script[type=speculationrules]')]
    .map((s) => {
      try {
        return JSON.parse(s.textContent).prerender;
      } catch {
        // Ignore parse errors.
      }
    })
    .flat() // Remove scripts with errors or no prerender rules.
    .filter((rule) => rule && rule.source === 'list');
}

/**
 * Logs analytics events for `prerender` speculation rules, if that browser
 * support speculation rules and is not in Data Saver mode.
 * @returns {void}
 */
function logPrerenders() {
  // Only log prerender attempts if supported
  // and not in datasaver mode
  if (
    !(
      HTMLScriptElement.supports &&
      HTMLScriptElement.supports('speculationrules')
    ) ||
    navigator.connection?.saveData
  ) {
    return;
  }

  const prerenderURLs = new Set(
    getPrerenderRules()
      .map((r) => r.urls)
      .flat(),
  );

  prerenderURLs.forEach((prerenderURL) => {
    logEvent('prerender_attempt', {
      value: 1,
      event_category: 'Site-Wide Custom Events',
      event_label: prerenderURL,
      // Use a non-interaction event to avoid affecting bounce rate.
      non_interaction: true,
    });
  });
}

/**
 * @param {string} name
 * @returns {string|undefined}
 */
function getMeta(name) {
  const meta = document.querySelector(`meta[name="${name}"]`);
  return meta && meta.content;
}

/**
 * Sets the config for a given analytics measurement ID,
 * configured for the web.dev accounts.
 */
function setConfig() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({measurement_version: version});
  const navigationType = getNavigationType();
  window.dataLayer.push({navigation_type: navigationType});
  if (navigationType === 'back-forward') {
    const reasons = getBackForwardNotRestoreReasons();
    window.dataLayer.push({back_forward_not_restore_reasons: reasons});
  }
  window.dataLayer.push({page_path: location.pathname});
  window.dataLayer.push({page_authors: getMeta('authors')});
  window.dataLayer.push({page_tags: getMeta('tags')});
  window.dataLayer.push({page_learn_paths: getMeta('paths')});
  window.dataLayer.push({
    color_scheme_preference: self.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light',
  });
  if (navigator.deviceMemory) {
    window.dataLayer.push({device_memory: navigator.deviceMemory});
  }
  if (navigator.connection && navigator.connection.effectiveType) {
    window.dataLayer.push({
      effective_connection_type: navigator.connection.effectiveType,
    });
  }
  if (location.hostname === 'localhost') {
    window.dataLayer.push({debug_mode: true});
  }
  checkIfUserAcceptsCookies();
  const {cookiePreference} = store.getState();
  window.dataLayer.push({cookiePreference: cookiePreference});

  logEvent('webdev_analytics_configed');
}

async function initAnalytics() {
  // If prerendering then only init once the page is activated
  await whenPageActivated;

  setConfig();

  addClickEventListener();
  addPageShowEventListener();

  onCLS(sendToGoogleAnalytics);
  onFCP(sendToGoogleAnalytics);
  onFID(sendToGoogleAnalytics);
  onINP(sendToGoogleAnalytics);
  onLCP(sendToGoogleAnalytics);
  onTTFB(sendToGoogleAnalytics);

  logPrerenders();

  markAnalyticsInitialized();
}

// Some pages on web.dev include the full site JS but don't load
// the gtag.js library. We can't initialize analytics in those cases.
if (window.gtag) {
  initAnalytics();
}
