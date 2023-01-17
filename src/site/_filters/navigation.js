const {join} = require('path');
const {forceForwardSlash} = require('../../lib/utils/path');

/**
 * Turns the toc into an array of NavigationItems.
 * At this stage most NavigationItems are a simple object which looks like this:
 * [
 *  {url: '/learn/css/foo' }
 * ]
 * We use the url as a key in a Map so we can later loop through the Eleventy
 * collection and backfill our NavigationItem with its page data.
 * Note that some NavigationItems may be section headings, rather than having
 * a url these will have a title and we'll recurse through their children to
 * continue building out the tree:
 * [
 *  {title: 'Hello World', children: [{url: ...}, {url: ...}]}
 * ]
 * @param {NavigationToC[]} toc
 * @param {Map<string, NavigationItem>} map url-based map of entries
 * @return {NavigationItem[]}
 */
function buildTree(toc, map) {
  /** @type {NavigationItem[]} */
  const tree = [];
  for (const entry of toc) {
    /** @type {NavigationItem} */
    const item = {};

    if (entry.url) {
      // EleventyCollection items always end in a trailing slash so we need
      // to ensure our urls have it if we want to use them as keys.
      item.url = forceForwardSlash(join(entry.url, '/'));
      // This has to happen before calling buildTree so the correct order is maintained.
      map.set(item.url, item);
    }

    if (entry.sections?.length) {
      item.children = buildTree(entry.sections, map);
    }

    if (entry.title) {
      item.title = entry.title;
    }

    tree.push(item);
  }

  return tree;
}

/**
 * During this pass we loop through the collection and see if any of the page
 * urls match a url in the tree. If we find a match then we add the page data
 * to the tree.
 * @param {EleventyCollectionItem[]} collection
 * @param {Map<string, NavigationItem>} map
 */
function mapPagesToTree(collection, map) {
  for (const item of collection) {
    const ref = map.get(item.url);
    if (!ref) {
      continue;
    }
    // Copy the page data that we actually need.
    // Don't clone the entire data object or you can easily run into
    // circular reference issues if you try to use this data inside of
    // page content.
    ref.data = {
      title: item.data.title,
      description: item.data.description,
      date: item.data.date,
      // @ts-ignore
      placeholder: item.data.placeholder,
    };
  }
}

/**
 * Consumes a NavigationToC and turns it into a tree of NavigationItems.
 * This array of NavigationItems can be used to render things like breadcrumbs
 * or page navigation.
 * @param {EleventyCollectionItem[]} collection
 * @param {NavigationToC[]} toc
 * @return {{ tree: NavigationItem[], list: NavigationItem[] }}
 */
module.exports = function navigation(collection, toc) {
  /** @type {Map<string, NavigationItem>} */
  const map = new Map();
  const tree = buildTree(toc, map);
  mapPagesToTree(collection, map);

  // The map is ordered correctly, even considering nesting, so use it to set
  // next/previous links and anything else.
  // The list only contains items with actual URLs.
  const list = [...map.values()];
  list.forEach((item, idx) => {
    item.counter = idx.toString().padStart(3, '0');
    item.prev = list[idx - 1] || null;
    item.next = list[idx + 1] || null;
  });

  return {tree, list};
};
