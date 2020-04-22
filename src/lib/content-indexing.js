/**
 * @fileoverview Interaction with the Content Indexing API.
 *
 * See https://web.dev/content-indexing-api/
 */

const CACHE_NAME = 'webdev-html-cache-v1';
const PREFERRED_ICON_SIZE = 192;

const DEFAULT_ICON = {
  sizes: '128x128',
  src: '/images/icon-128x128.png',
  type: 'image/png',
};

function getIconFromImageSrc(imgSrc) {
  if (!imgSrc) {
    return DEFAULT_ICON;
  }

  const url = new URL(imgSrc, location.href);

  // The image manipulation will only work if this icon is served by Imgix.
  // If it's not, just use the default icon.
  if (url.origin !== 'https://webdev.imgix.net') {
    return DEFAULT_ICON;
  }

  url.searchParams.set('w', PREFERRED_ICON_SIZE);
  url.searchParams.set('h', PREFERRED_ICON_SIZE);
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('fm', 'webp');

  return {
    sizes: `${PREFERRED_ICON_SIZE}x${PREFERRED_ICON_SIZE}`,
    src: url.href,
    type: 'image/webp',
  };
}

// This method syncs the currently cached media with the Content Indexing API
// (on browsers that support it). The Cache Storage is the source of truth.
export async function syncContentIndex() {
  const registration = await navigator.serviceWorker.ready;
  //  Bail early if the Content Indexing API isn't supported.
  if (!('index' in registration)) {
    return;
  }

  // Get a list of everything currently in the content index.
  const idsInIndex = new Set();
  for (const contentDescription of await registration.index.getAll()) {
    // Add each currently indexed id to the set.
    idsInIndex.add(contentDescription.id);
  }

  // Get all the cached JSON partials.
  const cache = await caches.open(CACHE_NAME);
  const cachedRequests = await cache.keys();

  for (const request of cachedRequests) {
    // Use the cache key URL as the unique id value.
    const id = request.url;

    // If our id is already in the index, remove it from the set of ids that
    // need to be deleted.
    if (idsInIndex.has(id)) {
      idsInIndex.delete(id);
      continue;
    }

    const response = await cache.match(request);
    const {description, imageSrc, title, url} = await response.json();

    // We can use a default image, but the other fields need to be set.
    if (!(title && description && url)) {
      continue;
    }

    const icon = getIconFromImageSrc(imageSrc);

    await registration.index.add({
      description,
      id,
      title,
      url,
      category: 'article',
      icons: [icon],
      launchUrl: url,
    });
  }

  // Finally, for all of the ids that are currently in the index but aren't
  // cached, remove them from the index.
  for (const id of idsInIndex) {
    await registration.index.delete(id);
  }
}
