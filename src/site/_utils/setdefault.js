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

/**
 * If key is in the Map, return its value.
 * If not, insert key with a value of def and return def.
 * def defaults to null.
 *
 * @param {Map<string, any>} map Map to get value from.
 * @param {string} key Key to get value from map.
 * @param {any} def Default value to return.
 * @return {any} Value found, or def if not in map.
 */
module.exports = (map, key, def = null) => {
  if (!map.has(key)) {
    map.set(key, def);
  }

  return map.get(key);
};
