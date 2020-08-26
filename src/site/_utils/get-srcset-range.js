/*
 * Copyright 2019 Google LLC
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

// The range of widths that we use when we srcset images.
// srcset sizes generated using https://www.responsivebreakpoints.com/
const srcsetRange = [240, 480, 768, 1045, 1434, 1730, 1959, 2195, 2880, 3200];

/**
 * Take min and max values for an image and return all srcset sizes that fall
 * within that range.
 * @param {number} min A minimum width.
 * @param {number} max A maximum width.
 * @return {Array<number>} An array of srcset widths.
 */
module.exports = function getSrcsetRange(
  min = srcsetRange[0],
  max = srcsetRange[srcsetRange.length - 1],
) {
  if (min > max) {
    throw new Error(
      `Can't get srcset range. min: ${min} is greater than max: ${max}`,
    );
  }

  const range = [];
  for (let i = 0; i < srcsetRange.length; i++) {
    if (srcsetRange[i] < min) {
      continue;
    }
    if (srcsetRange[i] > max) {
      break;
    }
    range.push(srcsetRange[i]);
  }
  return range;
};
