/**
 * @license
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from '../../test/assert';
import './index';

suite('element: web-lighthouse-gauge', async () => {
  await customElements.whenDefined('web-lighthouse-gauge');

  test('basic', async () => {
    const gauge = document.createElement('web-lighthouse-gauge');
    document.body.append(gauge);
    try {
      gauge.score = 0.5;
      await gauge.updateComplete;
      assert(
        gauge.getAttribute('aria-valuenow') === '50',
        'attr should reflect property',
      );
    } finally {
      gauge.remove();
    }
  });
});
