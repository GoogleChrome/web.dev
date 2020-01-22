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
const postDescending = require("./post-descending");

/**
 * @param {any} collection
 * @return {Array<any>}
 */
module.exports = (collection) => {
  const mapValue = (map, key) => {
    return map.has(key) ? map.get(key) : [];
  };

  const pageCount = 24;
  const posts = postDescending(collection);
  const tagsMap = new Map();
  const tags = [];

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

  blogTags.forEach((blogTag) => {
    const tag = blogTag.default ? "" : blogTag.tag.toLowerCase();
    if (!blogTag.default && !tagsMap.has(tag)) {
      return;
    }

    const blogTagPosts = blogTag.default ? posts : mapValue(tagsMap, tag);
    const pages = Math.ceil(blogTagPosts.length / pageCount);

    for (let i = 0; i < pages; i++) {
      tags.push({
        ...blogTag,
        posts: blogTagPosts.splice(0, pageCount),
        index: i,
        pages,
      });
    }
  });

  return tags;
};
