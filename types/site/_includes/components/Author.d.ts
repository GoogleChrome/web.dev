/*
 * Copyright 2022 Google LLC
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

declare global {
  export interface AuthorParam {
    /** Id of the author, used for logging errors */
    id?: string;
    author: {
      /** i18n path to author's name */
      title: string;
      /** i18n path to author's description */
      description?: string;
      /** Author's image from the uploader tool */
      image: string;
      /** Href to author's page */
      href: string;
      /** Author's username for Twitter */
      twitter?: string;
      /** Author's username for GitHub */
      github?: string;
      /** Author's username for glitch */
      glitch?: string;
      /** Author's website */
      homepage?: string;
    } | AuthorsItem;
    /** Locale to display title and description in, defaults to `en` */
    locale?: string;
    /** Flag as to wether social media links should be shown, defaults to `false` */
    showSocialMedia?: boolean;
    /** Flag as to wether description should be shown, defaults to `false` */
    showDescription?: boolean;
  }
}

// empty export to keep file a module
export {};
