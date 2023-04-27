/*
 * Copyright 2023 Google LLC
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

/**
 * @fileoverview Fetch the RSS feeds.
 */
const fs = require('fs');
const {rssFeeds} = require('webdev-infra/utils/rss-feeds');

async function run() {
  const raw = fs.readFileSync('./src/site/_data/authorsData.json', 'utf8');
  const authorsData = JSON.parse(raw);
  const feeds = {};

  for (const author in authorsData) {
    if (authorsData[author].external) {
      feeds[author] = authorsData[author].external;
    }
  }

  const authorsFeeds = await rssFeeds(feeds);

  if (!fs.existsSync('./external/_data')) {
    fs.mkdirSync('./external/_data');
  }

  fs.writeFileSync(
    './external/_data/external-posts.json',
    JSON.stringify(authorsFeeds),
  );
}

run();
