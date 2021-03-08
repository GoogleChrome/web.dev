/*
 * Copyright 2021 Google LLC
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

const {html} = require('common-tags');

module.exports = (tag) => {
  return html`
    <div class="w-aside w-aside--note">
      Have a question about using this feature? You can get help by
      <a href="https://stackoverflow.com/questions/ask?tags=${tag}"
        >asking a question on Stack Overflow</a
      >, or
      <a href="https://stackoverflow.com/search?q=%5B${tag}%5D+is%3Aquestion"
        >browsing a list of questions</a
      >
      asked by other developers.
    </div>
  `;
};
