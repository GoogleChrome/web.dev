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
  export interface VideoArgs {
    autoplay?: boolean;
    autoPictureInPicture?: boolean;
    className?: string;
    disablePictureInPicture?: boolean;
    height?: number;
    loop?: boolean;
    muted?: boolean;
    poster?: string;
    preload?: 'none' | 'metadata' | 'auto';
    src: string | string[];
    width?: number;
  }
}

// empty export to keep file a module
export {};
