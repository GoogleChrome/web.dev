import {store} from './store';
import {saveUserUrl} from './fb';
import {runLighthouse, fetchReports} from './lighthouse-service';
import lang from './utils/language';
import {localStorage} from './utils/storage';
import {getCanonicalPath} from './urls';
import cookies from 'js-cookie';

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

export const requestRunLighthouse = store.action((state, url) => {
  const p = (async () => {
    if (state.activeLighthouseUrl) {
      return null; // there's an active run, nothing will happen
    }

    // Only write the user's URL preference to `activeLighthouseUrl` here before running
    // Lighthouse. The `userUrl` field inside state is not "safe" in that it can be replaced by
    // Firestore at any point. This ensures that results are never approportioned to the wrong URL.
    store.setState({
      activeLighthouseUrl: url,
      lighthouseError: null,
    });

    const run = await runLighthouse(url, state.isSignedIn);
    const auditedOn = new Date(run.auditedOn);
    state = store.getState(); // might change during runLighthouse

    // Don't just replace last run for signed in users to avoid double rendering / outdated
    // sparkline data. Instead, call fetchReports() to repopulate the graphs with the latest data.
    // Yes, this means that signed-in users have two network requests.

    const firstSeenUrl = await saveUserUrl(url, auditedOn); // write to Firestore and get first seen

    // nb. use firstSeenUrl as state.userUrlSeen is updated from a Firebase snapshot which
    // usually has not arrived by now (since it's updated right above)
    const runs = await fetchReports(url, firstSeenUrl);

    return {
      userUrl: url,
      activeLighthouseUrl: null,
      lighthouseResult: {
        url,
        runs,
      },
    };
  })();

  return p.catch((err) => {
    console.warn('failed to run Lighthouse', url, err);

    const update = {
      lighthouseError: err.toString(),
      activeLighthouseUrl: null,
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

export const requestFetchReports = store.action((state, url, startDate) => {
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

export const expandSideNav = store.action(() => {
  openModal();
  return {isSideNavExpanded: true};
});

export const collapseSideNav = store.action(() => {
  closeModal();
  return {isSideNavExpanded: false};
});

export const openModal = store.action(() => {
  const main = document.querySelector('main');
  const header = document.querySelector('web-header');
  const footer = document.querySelector('.w-footer');

  document.documentElement.classList.add('web-modal__overflow-hidden');
  main.inert = true;
  header.inert = true;
  footer.inert = true;
  return {isModalOpen: true};
});

export const closeModal = store.action(() => {
  const main = document.querySelector('main');
  const header = document.querySelector('web-header');
  const footer = document.querySelector('.w-footer');

  document.documentElement.classList.remove('web-modal__overflow-hidden');
  main.inert = false;
  header.inert = false;
  footer.inert = false;
  return {isModalOpen: false};
});

export const checkIfUserAcceptsCookies = store.action(
  ({userAcceptsCookies}) => {
    if (userAcceptsCookies) {
      return;
    }

    if (localStorage['web-accepts-cookies']) {
      return {
        userAcceptsCookies: true,
      };
    }

    return {showingSnackbar: true, snackbarType: 'cookies'};
  },
);

export const setUserAcceptsCookies = store.action(() => {
  localStorage['web-accepts-cookies'] = 1;
  return {
    userAcceptsCookies: true,
    showingSnackbar: false,
    // Note we don't set the snackbarType to null because that would cause the
    // snackbar to re-render and break the animation.
    // Instead, snackbarType is allowed to stick around and future updates can
    // overwrite it.
  };
});

export const checkUserPreferredLanguage = store.action(
  ({userPreferredLanguage}) => {
    userPreferredLanguage =
      // Use currently set language.
      userPreferredLanguage ||
      // Or check in the url.
      lang.getLanguageFromPath(location.pathname) ||
      // Or check in a cookie.
      cookies.get('preferred_lang') ||
      // Or check in the browser setting.
      navigator.language.split('-')[0];
    if (!lang.isValidLanguage(userPreferredLanguage)) {
      userPreferredLanguage = '';
    }
    return {userPreferredLanguage};
  },
);

export const setLanguage = store.action((state, preferredLanguage) => {
  const options = {
    expires: 10 * 365, // 10 years
    samesite: 'strict',
  };
  cookies.set('preferred_lang', preferredLanguage, options);
  if (preferredLanguage !== state.userPreferredLanguage) {
    location.pathname = getCanonicalPath(location.pathname);
  }
  return {
    userPreferredLanguage: preferredLanguage,
  };
});

export const closeToC = store.action(() => {
  return {
    tocOpened: false,
  };
});

export const openToC = store.action(() => {
  return {
    tocOpened: true,
  };
});
