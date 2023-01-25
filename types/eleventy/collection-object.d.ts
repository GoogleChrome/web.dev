/*
 * Copyright 2020 Google LLC
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
  export interface EleventyCollectionObject {
    all: EleventyCollectionItem[];
    [tag: key]: EleventyCollectionItem[];
    /**
     * Unsorted items (in whatever order they were added)
     */
    getAll: () => EleventyCollectionItem[];
    /**
     * Use the default sorting algorithm (ascending by date, filename tiebreaker)
     */
    getAllSorted: () => EleventyCollectionItem[];
    /**
     * Get only content that matches a tag
     */
    getFilteredByTag: (tagName: string) => EleventyCollectionItem[];
    /**
     * Get only content that matches a tag
     */
    getFilteredByTags: (...tagNames: string[]) => EleventyCollectionItem[];
    /**
     * Filter source file names using a glob
     */
    getFilteredByGlob: (glob: string) => EleventyCollectionItem[];
  }
}

// empty export to keep file a module
export {};
