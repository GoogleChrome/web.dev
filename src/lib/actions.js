import {store} from './store';
import {fetchReports} from './lighthouse-service';
import {runPsi} from './psi-service';
import lang from './utils/language';
import {localStorage} from './utils/storage';
import cookies from 'js-cookie';
import {ids} from 'webdev_analytics';
import {isProd} from 'webdev_config';

export const clearSignedInState = store.action(() => {
  const {isSignedIn} = store.getState();
  if (isSignedIn) {
    return {
      userUrlSeen: null,
      userUrl: null,
      checkingSignedInState: false,
      isSignedIn: false,
      user: null,
      lighthouseResult: null,
      lighthouseError: null,
    };
  }
});

export const requestRunPSI = store.action((state, url) => {
  const p = (async () => {
    // Only write the user's URL preference to `activeLighthouseUrl` here before running
    // Lighthouse. The `userUrl` field inside state is not "safe" in that it can be replaced by
    // Firestore at any point. This ensures that results are never approportioned to the wrong URL.
    store.setState({
      activeLighthouseUrl: url,
      lighthouseError: null,
    });
    const run = await runPsi(url);
    state = store.getState(); // might change during runLighthouse
    return {
      userUrl: url,
      activeLighthouseUrl: null,
      lighthouseResult: {
        url,
        run,
      },
    };
  })();

  return p.catch((err) => {
    const errMsg = err.name === 'FetchError' ? err.name : err.toString();
    console.warn('failed to run PSI', url, errMsg);
    return setLighthouseError(errMsg);
  });
});

export const setLighthouseError = store.action((_, errMsg) => {
  const update = {
    lighthouseError: errMsg,
    activeLighthouseUrl: null,
  };
  const {activeLighthouseUrl, lighthouseResult} = store.getState();
  if (lighthouseResult && lighthouseResult.url !== activeLighthouseUrl) {
    update.lighthouseResult = null;
  }
  store.setState(update);
  return update;
});

export const requestFetchReports = store.action((_, url, startDate) => {
  const p = (async () => {
    const runs = await fetchReports(url, startDate);

    // Don't update results during another active Lighthouse fetch.
    const {activeLighthouseUrl} = store.getState();
    if (activeLighthouseUrl) {
      return null;
    }

    return {
      userUrl: url,
      userUrlSeen: startDate,
      activeLighthouseUrl: null,
      lighthouseResult: {
        url,
        runs,
      },
    };
  })();

  return p.catch((err) => {
    console.warn('failed to fetch reports for', url, err);

    // Don't show an error for another active Lighthouse fetch.
    const {activeLighthouseUrl} = store.getState();
    if (activeLighthouseUrl) {
      return null;
    }

    const update = {
      userUrl: url,
      lighthouseError: err.toString(),
    };

    // If the previous result was for a different URL, clear it so there's not confusion about
    // what the error is being shown for.
    const {lighthouseResult} = store.getState();
    if (lighthouseResult && lighthouseResult.url !== url) {
      update.lighthouseResult = null;
    }

    return update;
  });
});

/**
 * Inert the page so scrolling and pointer events are disabled.
 * This is used when we open the navigation drawer or show a modal dialog.
 */
const disablePage = () => {
  // Setting the majority of the page as inert can have a significant perf hit when
  // trying to animate e.g. the navigation drawer, so do it in the frame after this
  // to avoid blocking on interaction and incurring an INP delay.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      if (main) main.inert = true;
      if (footer) footer.inert = true;
    });
  });
};

/**
 * Uninert the page so scrolling and pointer events work again.
 */
const enablePage = () => {
  // Similar to disablePage(), go inert in the next frame to avoid the perf hit.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      if (main) main.inert = false;
      if (footer) footer.inert = false;
    });
  });
};

export const openNavigationDrawer = store.action(() => {
  disablePage();
  return {isNavigationDrawerOpen: true};
});

export const closeNavigationDrawer = store.action(() => {
  enablePage();
  return {isNavigationDrawerOpen: false};
});

export const openModal = store.action(() => {
  disablePage();
  return {isModalOpen: true};
});

export const closeModal = store.action(() => {
  enablePage();
  return {isModalOpen: false};
});

export const checkIfUserAcceptsCookies = store.action(({cookiePreference}) => {
  if (cookiePreference) {
    return;
  }

  // If set, this will be either the string '1' or '0' based on whether
  // the user has accepted or rejected the use of cookies.
  // If not set it means the user has not made a choice (or cleared storage).
  const storedWebAcceptsCookiesValue = localStorage['web-accepts-cookies'];

  if (typeof storedWebAcceptsCookiesValue === 'string') {
    cookiePreference =
      storedWebAcceptsCookiesValue === '1' ? 'accepts' : 'rejects';
  } else {
    cookiePreference = null;
  }

  // Only show the cookie snack-bar if the user hasn't set a preference.
  const showingSnackbar = cookiePreference === null;

  return {cookiePreference, showingSnackbar, snackbarType: 'cookies'};
});

export const setUserAcceptsCookies = store.action(() => {
  localStorage['web-accepts-cookies'] = '1';
  return {
    cookiePreference: 'accepts',
    showingSnackbar: false,
    // Note we don't set the snackbarType to null because that would cause the
    // snackbar to re-render and break the animation.
    // Instead, snackbarType is allowed to stick around and future updates can
    // overwrite it.
  };
});

export const setUserRejectsCookies = store.action(() => {
  localStorage['web-accepts-cookies'] = '0';
  return {
    cookiePreference: 'rejects',
    showingSnackbar: false,
    // Note we don't set the snackbarType to null because that would cause the
    // snackbar to re-render and break the animation.
    // Instead, snackbarType is allowed to stick around and future updates can
    // overwrite it.
  };
});

export const setLanguage = store.action((state, language) => {
  if (!lang.isValidLanguage(language)) {
    return state;
  }
  const options = {
    expires: 10 * 365, // 10 years
    samesite: 'strict',
  };
  cookies.set('firebase-language-override', language, options);
  if (language !== state.currentLanguage) {
    location.reload();
  }
  return {
    currentLanguage: language,
  };
});

export const loadAnalyticsScript = store.action(() => {
  const {gtmScriptLoaded} = store.getState();
  if (!gtmScriptLoaded && isProd) {
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${ids.GTM}`, null);
    return {
      gtmScriptLoaded: true,
    };
  }
});
