import 'https://unpkg.com/favicon-badge@2.0.0/dist/FavIconBadge.js';

// The `<favicon-badge>` custom element.
const favicon = document.querySelector('favicon-badge');
// The install button.
const installButton = document.querySelector('button');

// Feature detection.
const supportsAppBadge = 'setAppBadge' in navigator;

// This function will either set the favicon or the native
// app badge. The implementation is dynamically changed at runtime.
let setAppBadge;

// Variable for the counter.
let i = 0;

// Returns a value between 0 and 9.
const getAppBadgeValue = () => {
  if (i > 9) {
    i = 0;
  }
  return i++;
};

// Function to set a favicon badge.
const setAppBadgeFavicon = (value) => {
  favicon.badge = value;
};

// Function to set a native app badge.
const setAppBadgeNative = (value) => {
  navigator.setAppBadge(value);
}

// If the app is installed and native app badges are supported,
// use the native app badge.
if (
  matchMedia('(display-mode: standalone)').matches &&
  supportsAppBadge
) {
  setAppBadge = setAppBadgeNative;
// In all other cases (i.e., if the app is not installed or native
//  app badges are not supported), use the favicon badge.
} else {
  setAppBadge = setAppBadgeFavicon;
}

// Update the badge every second.
setInterval(() => {
  setAppBadge(getAppBadgeValue());
}, 1000);

// Only relevant for browsers that support installation.
if ('BeforeInstallPromptEvent' in window) {
  // Variable to stash the `BeforeInstallPromptEvent`.
  let installEvent = null;

  // Function that will be run when the app is installed.
  const onInstall = () => {
    // Disable the install button.
    installButton.disabled = true;
    // No longer needed.
    installEvent = null;

    if (supportsAppBadge) {
      // Remove the favicon badge.
      favicon.badge = false;
      // Switch the implementation so it uses the native
      // app badge.
      setAppBadge = setAppBadgeNative;
    }
  };

  window.addEventListener('beforeinstallprompt', (event) => {
    // Do not show the install prompt quite yet.
    event.preventDefault();
    // Stash the `BeforeInstallPromptEvent` for later.
    installEvent = event;
    // Enable the install button.
    installButton.disabled = false;
  });

  installButton.addEventListener('click', async () => {
    // If there is no stashed `BeforeInstallPromptEvent`, return.
    if (!installEvent) {
      return;
    }
    // Use the stashed `BeforeInstallPromptEvent` to prompt the user.
    installEvent.prompt();
    const result = await installEvent.userChoice;
    // If the user installs the app, run `onInstall()`.
    if (result.outcome === 'accepted') {
      onInstall();
    }
  });

  // The user can decide to ignore the install button
  // and just use the browser prompt directly. In this case
  // likewise run `onInstall()`.
  window.addEventListener('appinstalled', (event) => {
    onInstall();
  });
}
