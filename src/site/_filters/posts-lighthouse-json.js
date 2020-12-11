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
const reUnescapedHtml = /[<>]/g;
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
const htmlEscapes = {
  '<': '&lt;',
  '>': '&gt;',
};

/**
 * Match a character with its escape counterpart.
 * @param {string} chr A character
 * @return {string}
 */
function escapeHtmlChar(chr) {
  return htmlEscapes[chr];
}

/**
 * Escape any HTML angle brackets in a string.
 * @param {string} str A string to escape.
 * @return {string}
 */
function escapeHtml(str) {
  return str && reHasUnescapedHtml.test(str)
    ? str.replace(reUnescapedHtml, escapeHtmlChar)
    : str;
}

// Generate a JSON object which links posts to their Ligthhouse audits.
module.exports = (posts) => {
  const toArray = (raw) => (raw instanceof Array ? raw : [raw]);

  if (!posts) {
    throw new Error('No posts were passed to the filter!');
  }

  const guides = posts.map((post) => {
    const out = {
      path: '',
      topic: '',
      id: post.fileSlug, // e.g. "test-post"
      lighthouse: toArray(post.data.web_lighthouse),
      title: escapeHtml(post.data.title),
      url: post.url,
    };

    const host = post.data.postHost[out.id];
    if (!host) {
      // TODO(samthor): This guide isn't included anywhere inside
      // `_data/paths/*.js`, so it can't be given a path or topic.
      return out;
    }

    out.path = host.path;
    out.topic = host.topic;
    return out;
  });

  return {guides};
};
