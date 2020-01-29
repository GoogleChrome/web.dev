/*
 * Copyright 2020 Google LLC
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

const blogTags = require("../_data/blogTags");
const pageContent = require("../_filters/page-content");
const postDescending = require("./post-descending");

/**
 * Returns all posts as an array of paginated tags.
 * It's not as if every element in the array is a single page for a tag, rather, its an array that includes every tags page.
 * Each element includes n number of posts as well as some basic information of that tag to pump into `_includes/partials/paged.njk`
 * This is because we can not paginate something already paginated... Pagination is effectively a loop, and we can't have an embedded loop O^2.
 *
 * @param {any} collection
 * @return {Array<any>}
 */
module.exports = (collection) => {
  const mapValue = (map, key) => {
    return map.has(key) ? map.get(key) : [];
  };

  const posts = postDescending(collection);
  const tagsMap = new Map();
  let tags = [];

  // Map the posts to various tags in the post
  posts.forEach((post) => {
    const postTags = post.data.tags || [];
    postTags.forEach((postTag) => {
      postTag = postTag.toLowerCase();
      const tagsPosts = mapValue(tagsMap, postTag);
      tagsPosts.push(post);
      tagsMap.set(postTag, tagsPosts);
    });
  });

  Object.getOwnPropertyNames(blogTags).forEach((blogTagName) => {
    const tag = blogTagName.toLowerCase();
    if (!tagsMap.has(tag)) {
      return;
    }

    const blogTag = blogTags[blogTagName];
    blogTag.tag = tag;
    tags = tags.concat(pageContent(tagsMap.get(tag), blogTag));
  });
  return tags;
};
