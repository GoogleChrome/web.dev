/**
 * @fileoverview Interaction with the Content Indexing API.
 *
 * See https://web.dev/content-indexing-api/
 */

const CACHE_NAME = 'webdev-html-cache-v1';
const ICON_SIZE = 192;

const DEFAULT_ICON = {
  sizes: '128x128',
  src: '/images/icon-128x128.png',
  type: 'image/png',
};

async function getRegistrationIfSupported() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  if (!('index' in registration)) {
    return;
  }

  return registration;
}

function getIconFromImgSrc(imgSrc) {
  if (!imgSrc) {
    return DEFAULT_ICON;
  }

  const url = new URL(imgSrc, location.href);

  // The image manipulation will only work if this icon is served by Imgix.
  // If it's not, just use the default icon.
  if (url.origin !== 'https://webdev.imgix.net') {
    return DEFAULT_ICON;
  }

  url.searchParams.set('w', ICON_SIZE);
  url.searchParams.set('h', ICON_SIZE);
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('fm', 'webp');

  return {
    sizes: `${ICON_SIZE}x${ICON_SIZE}`,
    src: url.href,
    type: 'image/webp',
  };
}

export async function addToContentIndex({description, imgSrc, title, url}) {
  const registration = await getRegistrationIfSupported();
  if (!registration) {
    return;
  }

  const id = new URL(url, location.href);
  id.hash = '';
  id.search = '';
  // Cache keys of partial content end with index.json.
  if (id.pathname.endsWith('/')) {
    id.pathname += 'index.json';
  }

  const launchUrl = new URL(url, location.href);
  launchUrl.searchParams.set('utm_medium', 'content-indexing');

  const entry = {
    description,
    title,
    category: 'article',
    icons: [getIconFromImgSrc(imgSrc)],
    // id should match the format used for service worker runtime caching keys.
    id: id.href,
    // launchUrl is deprecated; https://github.com/WICG/content-index/issues/16
    launchUrl: launchUrl.href,
    url: launchUrl.href,
  };
  await registration.index.add(entry);

  console.debug('Added to the content index:', entry);
}

export async function cleanupContentIndex() {
  const registration = await getRegistrationIfSupported();
  if (!registration) {
    return;
  }

  // This needs to be updated if the service worker cache names change.
  const cache = await caches.open(CACHE_NAME);
  const cachedRequests = await cache.keys();
  const cachedUrls = new Set([...cachedRequests].map((r) => r.url));

  for (const indexedEntry of await registration.index.getAll()) {
    if (!cachedUrls.has(indexedEntry.id)) {
      await registration.index.delete(indexedEntry.id);
      console.debug('Removed an item from the content index:', indexedEntry.id);
    }
  }
}
