/**
 * @fileoverview Provides a helper that removes active Service Workers.
 */

/**
 * Removes any previous Service Workers from this domain. If any were found and
 * removed, reloads this page. This is safe to call even if there's no support.
 *
 * @return {!Promise<void>|void}
 */
export default function removeServiceWorkers() {
  if (!('serviceWorker' in navigator)) {
    return; // can't return Promise in case we're running in ancient browser
  }

  return navigator.serviceWorker
    .getRegistrations()
    .then((all) => {
      return Promise.all(all.map((reg) => reg.unregister()));
    })
    .then((tasks) => {
      if (tasks.length) {
        window.location.reload();
      }
    });
}
