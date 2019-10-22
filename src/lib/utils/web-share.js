/**
 * @return {boolean} whether Web Share is supported on this browser
 */
export function isWebShareSupported() {
  if (!("share" in navigator)) {
    return false;
  }

  // Ensure that the user would be able to share a reference URL.
  // This is part of Web Share Level 2, so feature-detect it:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=903010
  if ("canShare" in navigator) {
    const url = `https://${window.location.hostname}`;
    return navigator.canShare({url});
  }

  return true;
}
