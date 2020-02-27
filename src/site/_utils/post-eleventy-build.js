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

let configured = false;
let finished = false;
const methodsToCall = [];

function setup() {
  const Eleventy = require("@11ty/eleventy");

  const originalWrite = Eleventy.prototype.write;
  Eleventy.prototype.write = async function (...args) {
    const out = await originalWrite.apply(this, args);

    finished = true;
  
    while (methodsToCall.length) {
      const method = methodsToCall.shift();
      await method();
    }

    return out;
  };
}

/**
 * @param {function(): void} method to call once Eleventy is done
 */
module.exports = function postEleventyBuild(method) {
  if (!configured) {
    configured = true;
    setImmediate(setup);
  }
  if (finished) {
    throw new Error(`Eleventy has already finished`);
  }
  methodsToCall.push(method);
};
