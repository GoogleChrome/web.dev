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

import * as firebase from 'firebase';

interface WebComponentsType {
  root?: string;
  waitFor?: (arg: () => any) => void;
}

declare global {
  interface Window extends Window {
    inert: boolean;
    recaptchaLoadCallback?: () => void;
    loadScript?: (url: string, type?: string) => void;
    dataLayer?: Array;
  }

  interface Navigator {
    connection: NetworkInformation;
    deviceMemory: number;
  }

  interface PerformanceEntry {
    deliveryType: string;
    activationStart: number;
    type: string;
  }

  interface NotRestoredReasons {
    url: string;
    src: string;
    id: string;
    name: string;
    blocked: boolean;
    reasons: [string];
    children: [NotRestoredReasons];
  }

  interface PerformanceNavigationTiming {
    deliveryType: string;
    activationStart: number;
    notRestoredReasons: NotRestoredReasons
  }

  var WebComponents: WebComponentsType;
  var firebase: firebase.app.App;
}
