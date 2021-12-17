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
    createdOn?: Date;
    description?: string;
    image?: string;
    /**
     * Date of index, only available after indexed. Basically can only be used by search.
     */
    indexedOn?: number;
    locale: string;
    locales: string[];
    /**
     * ID of item used to update existing entry.
     */
    objectID: string;
    priority: number;
    tags: string[];
    /**
     * Title of a post.
     */
     title: string;
     updatedOn?: Date;
     url: string;
  }
}

// empty export to keep file a module
export {};
