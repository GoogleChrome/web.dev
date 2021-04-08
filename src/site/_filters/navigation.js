const {join} = require('path');

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
 * @param {Map} map
 * @return {NavigationItem[]}
 */
function buildTree(toc, map) {
  const tree = [];
  // The list array is a convenience tool that we use so we can append next/prev
  // references to each item once the tree is built.
  // Using an array here avoids us needing to do a second recursive tree walk
  // just to add those properties.
  const list = [];
  for (const entry of toc) {
    if (entry.url) {
      const clone = {...entry};
      // EleventyCollection items always end in a trailing slash so we need
      // to ensure our urls have it if we want to use them as keys.
      clone.url = join(clone.url, '/');
      tree.push(clone);
      // Only push nodes with urls into the list array.
      // When we're navigating by next/prev we don't want to land on section
      // headings.
      list.push(clone);
      map.set(clone.url, clone);
    } else if (entry.title) {
      const children = buildTree(entry.sections, map);
      tree.push({
        title: entry.title,
        children,
      });
    }
  }

  list.forEach((/** @type {NavigationItem} */ item, idx) => {
    item.prev = list[idx - 1] || null;
    item.next = list[idx + 1] || null;
  });

  return tree;
}

/**
 * During this pass we loop through the collection and see if any of the page
 * urls match a url in the tree. If we find a match then we add the page data
 * to the tree.
 * @param {EleventyCollectionItem[]} collection
 * @param {Map} map
 */
function mapPagesToTree(collection, map) {
  for (const item of collection) {
    const ref = map.get(item.url);
    if (ref) {
      ref.page = {...item};
    }
  }
}

/**
 * Consumes a NavigationToC and turns it into a tree of NavigationItems.
 * This array of NavigationItems can be used to render things like breadcrumbs
 * or page navigation.
 * @param {EleventyCollectionItem[]} collection
 * @param {NavigationToC[]} toc
 * @return {NavigationItem[]}
 */
module.exports = function navigation(collection, toc) {
  const map = new Map();
  const tree = buildTree(toc, map);
  mapPagesToTree(collection, map);
  return tree;
};
