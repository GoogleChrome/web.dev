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

declare global {
  export interface AlgoliaItem {
    content?: string;
    /**
     * Title of default locale version if in different language.
     */
    default_title?: string;
    /**
     * Description of default locale version if in different language.
     */
    default_description?: string;
    /**
     * Content of default locale version if in different language.
     */
    default_content?: string;
    description?: string;
    image?: string;
    /**
     * Date of index, only available after indexed. Basically can only be used by search.
     */
    indexedOn?: number;
    locales: string[];
    objectID: string;
    tags: string[];
    /**
     * Title of a post.
     */
     title: string;
     url: string;
  }
}

// empty export to keep file a module
export {};
