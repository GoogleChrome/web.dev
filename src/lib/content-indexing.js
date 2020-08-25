/**
 * @fileoverview Interaction with the Content Indexing API.
 *
 * See https://web.dev/content-indexing-api/
 */

import {normalizeUrl} from './urls';

const CACHE_NAME = 'webdev-html-cache-v1';
const PREFERRED_ICON_SIZE = 192;

const DEFAULT_ICON = {
  sizes: '128x128',
  src: '/images/icon-128x128.png',
  type: 'image/png',
};

/**
 * Returns an instance of the ContentIndex associated with the active
 * registration, if supported in the current browser.
 *
 * @return {Promise<ContentIndex|void>} The ContentIndex interface, or undefined
 * if that functionality isn't supported.
 */
async function getContentIndexInterface() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    return registration.index;
  }

  // Just to be explicit about the return value.
  return undefined;
}

/**
 * Normalizes an image URL to the dimensions and format expected by the
 * Content Indexing API.
 *
 * @param {string} imgSrc The URL for an image asset, usually on imgix.
 * @return {Object} The image metadata fields that the content index expects.
 */
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

  url.searchParams.set('w', '' + PREFERRED_ICON_SIZE);
  url.searchParams.set('h', '' + PREFERRED_ICON_SIZE);
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('fm', 'webp');

  return {
    sizes: `${PREFERRED_ICON_SIZE}x${PREFERRED_ICON_SIZE}`,
    src: url.href,
    type: 'image/webp',
  };
}

/**
 * Adds a given pageURL to the content index. The ID used is the normalized URL.
 *
 * Metadata for the indexed page is read from the Cache Storage API, by
 * translating the page's URL into a cache key for the JSON metadata.
 *
 * @param {string} pageURL The URL of the page being indexed, or the cache key
 * corresponding to that page's metadata.
 * @param {Cache} [cache] If set, an open Cache object that the metadata can
 * be read from.
 */
export async function addPageToContentIndex(pageURL, cache) {
  const index = await getContentIndexInterface();
  //  Bail early if the Content Indexing API isn't supported.
  if (!index) {
    return;
  }

  const normalizedURL = normalizeUrl(pageURL);
  if (!normalizedURL.endsWith('/')) {
    // If this is a URL that doesn't appear to be supported, bail.
    return;
  }

  if (!cache) {
    cache = await caches.open(CACHE_NAME);
  }

  const response = await cache.match(normalizedURL);
  // If for some reason there's no HTML in the cache for our cache key, bail.
  if (!response) {
    return;
  }

  // Parse the HTML and extract the description, image etc.
  const raw = await response.text();
  const candidateDocument = new DOMParser().parseFromString(raw, 'text/html');
  const meta = (attr) => {
    const el = candidateDocument.head.querySelector(`meta[${attr}]`);
    return (el && el.getAttribute('content')) || '';
  };
  const description = meta('name="description"');
  const imageSrc = meta('itemprop="image"');
  const {title} = candidateDocument;

  // We can use a default image, but the other fields need to be set.
  if (!(title && description)) {
    return;
  }

  const icon = getIconFromImageSrc(imageSrc);

  await index.add({
    description,
    title,
    category: 'article',
    id: normalizedURL,
    icons: [icon],
    url: normalizedURL,
    launchUrl: normalizedURL,
  });
}

/**
 * Syncs the currently cached media with the Content Indexing API
 * (on browsers that support it). The Cache Storage is the source of truth.
 */
export async function syncContentIndex() {
  const index = await getContentIndexInterface();
  //  Bail early if the Content Indexing API isn't supported.
  if (!index) {
    return;
  }

  // Get a list of everything currently in the content index.
  const alreadyIndexed = await index.getAll();
  const idsInIndex = new Set(alreadyIndexed.map(({id}) => id));

  // Get all the cached JSON partials.
  const cache = await caches.open(CACHE_NAME);
  const cachedRequests = await cache.keys();

  for (const request of cachedRequests) {
    // Find the unique ID. We get the cache key here, which ends with
    // "/index.json": remove this and normalize the URL to get the correct ID.
    const id = normalizeUrl(request.url.replace(/\.json$/, '.html'));

    // If our id is already in the index, remove it from the set of ids that
    // need to be deleted.
    if (idsInIndex.has(id)) {
      idsInIndex.delete(id);
      continue;
    }
    await addPageToContentIndex(id, cache);
  }

  // Finally, for all of the ids that are currently in the index but aren't
  // cached, remove them from the index.
  for (const id of idsInIndex) {
    await index.delete(id);
  }
}
