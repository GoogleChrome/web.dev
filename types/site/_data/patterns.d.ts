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
  export interface CodePatternAssets {
    [key: string]: {
      name: string;
      type: string;
      content: string;
    }
  }
  export interface CodePattern {
    id: string;
    layout: string;
    title: string;
    description: string;
    static?: string[];
    assets: CodePatternAssets;
    demo: string;
    suite: string;
    height: number;
    rawContent: string;
    set: string;
  }
  export interface CodePatterns {
    [key: string]: CodePattern;
  }
  export interface CodePatternSet {
    id: string;
    title: string;
    description: string;
    hero: string;
    draft: boolean;
    rawContent: string;
    suite: string;
  }
  export interface CodePatternSets {
    [key: string]: CodePatternSet;
  }
}

// empty export to keep file a module
export {};
