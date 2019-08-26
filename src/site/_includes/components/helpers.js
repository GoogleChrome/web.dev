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

/**
 * If a value is present, then this will return an attribute in the format
 * attr="val". Otherwise, returns the empty string.
 * @param {!string} attr An attribute name.
 * @param {?string|?Array<string>} val An attribute value. Can be an array of
 * values. Arrays will be converted to a space separated string.
 * @return {string}
 */
const ifDefined = (attr, val) => {
  if (val) {
    if (typeof val === 'string') {
      val = [val];
    }
    return `${attr}="${val.join(' ')}"`;
  }
  return '';
};

module.exports = {ifDefined};
