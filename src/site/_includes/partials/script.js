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
 * @fileoverview This is inline script run on every page.
 *
 * Note that this is included by 11ty, so { { } } (without spaces)'s are expanded.
 */

(function () {
  function hideAnnouncementBanner() {
    const bannerCtaUrl = '{{ banner.actions[0].href | safe}}';
    const savedBannerCtaUrl = localStorage.getItem('user-banner');
    if (savedBannerCtaUrl === bannerCtaUrl) {
      document.documentElement.setAttribute('data-banner-dismissed', '');
    }
  }

  hideAnnouncementBanner();
})();
