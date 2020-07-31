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
  export interface AuthorsItem {
    /**
     * @TODO eventually remove, can't extend currently so I'm just copying
     */
    // Extends isn't working so I'm just copying over the data for now
    country?: string;
    github?: string;
    glitch?: string;
    homepage?: string;
    name: {
      given: string;
      family: string;
    };
    org?: {
      name?: string;
      unit?: string;
    };
    twitter?: string;
    // End extends
    data: {
      alt?: string;
      hero?: string;
      canonicalUrl: string;
      subhead: string;
      title: string;
    };
    description: string;
    elements: TODO[];
    href: string;
    key: string;
    title: string;
  }
  export interface Authors {
    [key: string]: AuthorsItem;
  }
}

// empty export to keep file a module
export {};
