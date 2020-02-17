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

module.exports = {
  env: process.env.ELEVENTY_ENV || "dev",
  title: "web.dev",
  titleVariation: "Home",
  url: "https://web.dev",
  repo: "https://github.com/GoogleChrome/web.dev",
  subscribe: "https://web.dev/subscribe",
  thumbnail: "/images/social.png",
  isBannerEnabled: true,
  banner: `Can’t make \`#ChromeDevSummit\` this year? Catch all the content
  (and more!) on the livestream or join your peers for a CDS Extended event at
  a hosted location nearby. To learn more, check out the [Chrome Dev Summit
  2019 website](https://developer.chrome.com/devsummit/remote)`,
  // Note that the imageCdn value is only used when we do a production build
  // of the site. Otherwise all image paths are local. This means you can
  // develop locally without having to mess with the CDN at all.
  imageCdn: "https://webdev.imgix.net",
  analytics: {
    ids: {
      prod: "UA-126406676-2",
      // TODO (robdodson): These properties exist in GA but we don't use them.
      // Adding a note to inject these into pages when we create a fancier
      // staging environment.
      staging: "UA-126406676-3",
      notFound: "UA-126406676-4",
    },
    dimensions: {
      SIGNED_IN: "dimension1",
      TRACKING_VERSION: "dimension5",
    },
    version: 3,
  },
  firebase: {
    prod: {
      apiKey: "AIzaSyCyThSjI_ZUT1NwV9aQLtqklVcNj72gvo8",
      authDomain: "auth.web.dev",
      databaseURL: "https://web-dev-production-1.firebaseio.com",
      projectId: "web-dev-production-1",
      storageBucket: "web-dev-production-1.appspot.com",
      messagingSenderId: "1051961234704",
      appId: "1:1051961234704:web:d706ff04eb3dc39d128195",
      measurementId: "G-RY6ENK9E06",
    },
    staging: {
      apiKey: "AIzaSyCc27LkiT_ZvmEszthj__edZEzB7B7976s",
      authDomain: "web-dev-staging.firebaseapp.com",
      databaseURL: "https://web-dev-staging.firebaseio.com",
      projectId: "web-dev-staging",
      storageBucket: "web-dev-staging.appspot.com",
      messagingSenderId: "950800540990",
      appId: "1:950800540990:web:5bfeb5de58f8ce7ceef86f",
    },
  },
};
