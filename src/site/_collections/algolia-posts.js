/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const livePosts = require("../_filters/live-posts");
const removeMarkdown = require("remove-markdown");
const stripLanguage = require("../_filters/strip-language");

/**
 * Shrink the size of the given fulltext to fit within a certain limit, at the
 * nearest found newline character.
 *
 * @param {string} fulltext
 * @param {number=} limit
 * @return {string}
 */
function limitText(fulltext, limit = 7500) {
  if (fulltext.length <= limit) {
    return fulltext;
  }

  // Find the nearest prior newline to the 10k limit.
  let newlineIndex = fulltext.lastIndexOf("\n", limit);
  if (newlineIndex === -1) {
    newlineIndex = limit;
  }
  return fulltext.slice(0, newlineIndex);
}

module.exports = (collection) => {
  const validTags = ["post", "pathItem"];
  const eleventyPosts = collection
    .getAll()
    .filter((item) => {
      // nb. There's no easy 'getFilteredByMultipleTag' method in Eleventy.
      if (!Array.isArray(item.data.tags)) {
        return false;
      }
      return item.data.tags.some((tag) => validTags.includes(tag));
    })
    .filter((item) => {
      return item.data.title && item.data.page.url;
    })
    .filter(livePosts);

  // For now, hard-code language to English.
  const lang = "en";

  // Convert 11ty-posts to a flat, indexable format.
  return eleventyPosts.map(({data, template}) => {
    const fulltext = removeMarkdown(template.frontMatter.content);

    // Algolia has a limit of ~10k JSON on its records. For now, just trim fulltext to the nearest
    // line break below ~7500 characters (allowing buffer).
    // As of September 2019, this effects about 20 articles.
    // https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data/in-depth/index-and-records-size-and-usage-limitations/#record-size
    const limited = limitText(fulltext);

    return {
      objectID: data.page.url + "#" + lang,
      lang,
      title: data.title,
      url: stripLanguage(data.page.url),
      description: data.description,
      fulltext: limited,
      _tags: data.tags,
    };
  });
};
