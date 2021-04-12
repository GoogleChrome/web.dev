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
    /**
     * A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data.
     */
    autoplay?: boolean;
    /**
     * A Boolean attribute which if true indicates that the element should automatically toggle picture-in-picture mode when the user switches back and forth between this document and another document or application.
     */
    autoPictureInPicture?: boolean;
    /**
     * A space-separated list of the classes of the element.
     */
    class?: string;
    /**
     * If this attribute is present, the browser will offer controls to allow the user to control video playback, including volume, seeking, and pause/resume playback.
     */
    controls?: boolean;
    /**
     * Prevents the browser from suggesting a Picture-in-Picture context menu or to request Picture-in-Picture automatically in some cases.
     */
    disablePictureInPicture?: boolean;
    /**
     * The height of the video's display area, in CSS pixels (absolute values only; no percentages.)
     */
    height?: number;
    /**
     * Often used with CSS to style a specific element. The value of this attribute must be unique.
     */
    id?: string;
    /**
     * A Boolean attribute; if specified, the browser will automatically seek back to the start upon reaching the end of the video.
     */
    loop?: boolean;
    /**
     * Flag to wrap video in `a` tag pointing to the video. `false` by default.
     */
    linkTo?: boolean;
    /**
     * A Boolean attribute that indicates the default setting of the audio contained in the video.
     */
    muted?: boolean;
    /**
     * Pathname of image hosted by imgix to be shown while the video is downloading.
     */
    poster?: string;
    /**
     * This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience with regards to what content is loaded before the video is played.
     */
    preload?: 'none' | 'metadata' | 'auto';
    /**
     * Pathname(s) of video hosted by CDN.
     */
    src: string | string[];
    /**
     * The width of the video's display area, in CSS pixels (absolute values only; no percentages).
     */
    width?: number;
  }
}

// empty export to keep file a module
export {};
