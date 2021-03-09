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
  export interface ImgArgs {
    /**
     * Pathname of image hosted by Imigix.
     */
    src: string;
    /**
     * Defines an alternative text description of the image.
     */
    alt: string;
    /**
     * The intrinsic width of the image in pixels. Must be an integer without a unit.
     */
    width: string;
    /**
     * The intrinsic height of the image, in pixels. Must be an integer without a unit.
     */
    height: string;
    /**
     * One or more strings separated by commas, indicating a set of source sizes. If value is not provided one is generated dynamically.
     */
    sizes?: string;
    /**
     * Flag to dictate if loading of image is deffered until it reaches a calulated distance from the viewport. `true` by default.
     */
    lazy?: boolean;
    /**
     * A space-separated list of the classes of the element.
     */
    class?: string;
    params?: object;
    options?: ImgixOptions;
    /**
     * Flag to wrap image in `a` tag pointing to the image. `false` by default.
     */
    linkTo?: boolean;
  }

  export interface ImgixOptions {
    widths?: number[];
    widthTolerance?: number;
    minWidth?: number;
    maxWidth?: number;
    disableVariableQuality?: boolean;
  }
}

// empty export to keep file a module
export {};
