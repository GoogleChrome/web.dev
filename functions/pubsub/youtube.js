/**
 * @fileOverview Every hour we fetch all the videos in certain YouTube Playlists
 * in order to display them in web.dev
 */

import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import {tmpdir} from 'os';
import * as https from 'https';

import cloudSecrets from '../cloud-secrets.js';
// this was me 
/**
 * @param {string} url
 * @param {string} filename
 * @returns {Promise<string | void>}
 */
const downloadImage = (url, filename) => {
  const dest = path.join(tmpdir(), filename);
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          return resolve();
        }

        res.pipe(fs.createWriteStream(dest)).once('close', () => resolve(dest));
      })
      .on('timeout', () => resolve())
      .on('error', () => resolve());
  });
};

/**
 *
 * @param {string} playlistId
 * @param {string} key
 * @param {string} [pageToken]
 * @returns {string}
 */
const generateUrl = (playlistId, key, pageToken) => {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${key}`;
  return url + (pageToken ? `&pageToken=${pageToken}` : '');
};

export const youtube = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async () => {
    const secrets = await cloudSecrets();
    const bucket = admin.storage().bucket('web-dev-uploads');
    const youtubeplaylistsPath = './youtubeplaylists';
    if (!fs.existsSync(youtubeplaylistsPath)) {
      console.warn('YouTube Playlists file not found, stopping execution.');
      return;
    }
    const youtubeplaylists = fs
      .readFileSync(youtubeplaylistsPath, 'utf-8')
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s);

    for (const playlistId of youtubeplaylists) {
      let videos = [];
      let nextPageToken = '';

      do {
        const url = generateUrl(playlistId, secrets.YOUTUBE_KEY, nextPageToken);
        const fetchResults = await fetch(url);
        const jsonResults = await fetchResults.json();
        nextPageToken = jsonResults.nextPageToken;
        if (!jsonResults.items) {
          continue;
        }
        videos = [...videos, ...jsonResults.items];
      } while (nextPageToken);

      const processedVideos = [];

      videos.sort(
        (a, b) =>
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime(),
      );

      for (const v of videos) {
        const {snippet: s, contentDetails: c} = v;
        const video = {
          date: s.publishedAt,
          data: {
            title: s.title,
            description: s.description,
            subhead:
              s.description.length > 140
                ? s.description.slice(0, 137) + '...'
                : s.description,
            date: s.publishedAt,
            videoId: c.videoId,
          },
        };

        let thumbnailUrl = `https://i.ytimg.com/vi/${c.videoId}/maxresdefault.jpg`;

        const extension = thumbnailUrl.split('.').pop();
        const thumbnailFilename = `${c.videoId}.${extension}`;
        const thumbnail = `image/youtube/${thumbnailFilename}`;
        const thumbnailExists = (await bucket.file(thumbnail).exists())[0];

        if (thumbnailExists) {
          video.data.thumbnail = thumbnail;
          video.data.alt = s.title;
        } else {
          let tempImage = await downloadImage(thumbnailUrl, thumbnailFilename);

          // Try image from YouTube API.
          if (!tempImage) {
            thumbnailUrl = Object.values(s.thumbnails)
              .sort((a, b) => a.width - b.width)
              .pop()?.url;

            tempImage = await downloadImage(thumbnailUrl, thumbnailFilename);
          }

          if (tempImage) {
            try {
              await bucket.upload(tempImage, {
                destination: thumbnail,
                gzip: true,
              });

              video.data.thumbnail = thumbnail;
              video.data.alt = s.title;
            } catch {
              console.warn(`Skipping ${tempImage}`);
            }
          }
        }

        processedVideos.push(video);
      }

      const youtubeJson = `${playlistId}.json`;
      const youtubeJsonFilePath = path.join(tmpdir(), youtubeJson);
      fs.writeFileSync(youtubeJsonFilePath, JSON.stringify(processedVideos));
      await bucket.upload(youtubeJsonFilePath, {
        destination: `youtube/${youtubeJson}`,
        gzip: true,
      });
      console.log(`Updated ${youtubeJson}`);
    }

    return;
  });
