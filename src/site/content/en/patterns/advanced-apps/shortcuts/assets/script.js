// The install button.
const installButton = document.querySelector('button');

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
  window.addEventListener('appinstalled', () => {
    onInstall();
  });
}
