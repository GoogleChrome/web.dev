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
const CacheAsset = require('@11ty/eleventy-cache-assets');
const path = require('path');
const {defaultLocale} = require('../../../shared/locale');

/** @type ShowsData */
const showsData = require('../_data/showsData.json');

/**
 * Returns all show playlists with their videos.
 *
 * @return {Promise<Shows>}
 */
module.exports = async () => {
  /** @type Shows */
  const shows = {};
  const keys = Object.keys(showsData);

  for (const key of keys) {
    const showData = showsData[key];
    const href = path.join('/', 'shows', key, '/');
    const title = `i18n.shows.${key}.title`;
    const description = `i18n.shows.${key}.description`;
    /**
     * Instead of calling the YouTube API here, the playlist information is handled by GoogleChromeLabs/chrome-gcs-uploader
     * This is so:
     * 1. We don't expose our YouTube Playlist API key
     * 2. We don't make thousands of requests
     * 3. The thumbnails are added to our storage bucket for imgix
     */
    const url = `https://storage.googleapis.com/web-dev-uploads/youtube/${showData.playlistId}.json`;
    const elements = (
      await CacheAsset(url, {
        duration: '6h',
        type: 'json',
      }).catch(() => {
        throw new Error(
          `Error fetching JSON for YouTube Playlist ${showData.playlistId} (${key})`,
        );
      })
    ).map((v) => {
      v.date = new Date(v.date);
      v.data.date = new Date(v.data.date);
      v.url = path.join(href, v.data.videoId, '/');
      v.data.lang = defaultLocale;
      v.data.parent = {
        title,
        url: href,
      };
      return v;
    });
    if (elements.length === 0) {
      continue;
    }

    /** @type ShowsItem */
    const show = {
      ...showData,
      data: {
        date: elements[elements.length - 1].date,
        hero: elements[0].data.thumbnail,
      },
      description,
      elements,
      href,
      key,
      title,
      url: href,
    };

    // Limit posts for percy
    if (process.env.PERCY) {
      show.elements = show.elements.slice(-6);
    }

    // Set created on date and updated date to be used for indexing to detect updates
    if (show.elements.length > 0) {
      show.data.date = show.elements.slice(-1).pop().data.date;
      const updated = show.elements.slice(0, 1).pop().data.date;
      if (show.data.date !== updated) {
        show.data.updated = updated;
      }
    }

    if (show.elements.length > 0) {
      shows[key] = show;
    }
  }

  return shows;
};
