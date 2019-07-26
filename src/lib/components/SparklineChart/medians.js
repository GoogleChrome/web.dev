/**
 * @fileoverview Provides a lazy getter for medians data from the Lighthouse CI server.
 */

let mediansPromise;

async function internalGetMedians() {
  const response = await window.fetch(`${CI_HOST}/lh/medians?url=all`);
  const json = await response.json();
  return json;
}

export default function getMedians() {
  if (!mediansPromise) {
    mediansPromise = internalGetMedians().catch((err) => {
      console.warn("Error fetching medians", err);
      return {};
    });
  }

  return mediansPromise;
}
