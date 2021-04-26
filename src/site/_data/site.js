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

const path = require('path');
const locale = require('../../../shared/locale');

module.exports = {
  env: process.env.ELEVENTY_ENV || 'dev',
  percy: process.env.PERCY || false,
  contentDir: path.join('src/site/content/', process.env.ELEVENTY_LANG || ''),
  title: 'web.dev',
  titleVariation: 'Home',
  defaultLocale: locale.defaultLocale,
  url: 'https://web.dev',
  buildDate: new Date(),
  repo: 'https://github.com/GoogleChrome/web.dev',
  subscribe: 'https://web.dev/newsletter',
  subscribeForm:
    'https://services.google.com/fb/submissions/591768a1-61a6-4f16-8e3c-adf1661539da/',
  thumbnail: '/images/social.png',
  isBannerEnabled: false,
  areCoursesEnabled: false,
  banner: '',
  // Note that the imageCdn value is only used when we do a production build
  // of the site. Otherwise all image paths are local. This means you can
  // develop locally without having to mess with the CDN at all.
  imageCdn: 'https://webdev.imgix.net',
  imgixDomain: 'web-dev.imgix.net',
  bucket: 'web-dev-uploads',
  gitlocalize: 'https://gitlocalize.com/repo/5395/',
  analytics: {
    ids: {
      prod: 'UA-126406676-2',
      // TODO (robdodson): These properties exist in GA but we don't use them.
      // Adding a note to inject these into pages when we create a fancier
      // staging environment.
      staging: 'UA-126406676-3',
      notFound: 'UA-126406676-4',
    },
    dimensions: {
      SIGNED_IN: 'dimension1',
      TRACKING_VERSION: 'dimension5',
    },
    version: 3,
  },
  firebase: {
    prod: {
      apiKey: 'AIzaSyCyThSjI_ZUT1NwV9aQLtqklVcNj72gvo8',
      authDomain: 'auth.web.dev',
      databaseURL: 'https://web-dev-production-1.firebaseio.com',
      projectId: 'web-dev-production-1',
      storageBucket: 'web-dev-production-1.appspot.com',
      messagingSenderId: '1051961234704',
      appId: '1:1051961234704:web:d706ff04eb3dc39d128195',
      measurementId: 'G-RY6ENK9E06',
    },
    staging: {
      apiKey: 'AIzaSyCc27LkiT_ZvmEszthj__edZEzB7B7976s',
      authDomain: 'web-dev-staging.firebaseapp.com',
      databaseURL: 'https://web-dev-staging.firebaseio.com',
      projectId: 'web-dev-staging',
      storageBucket: 'web-dev-staging.appspot.com',
      messagingSenderId: '950800540990',
      appId: '1:950800540990:web:5bfeb5de58f8ce7ceef86f',
    },
  },
  maps: {
    apiKey: 'AIzaSyCc27LkiT_ZvmEszthj__edZEzB7B7976s',
  },
};
