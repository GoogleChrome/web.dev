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

import {BaseElement} from '../BaseElement';

/**
 * A FAB that observes a target using an IntersectionObserver and fades in
 * when the target is offscreen.
 * Since this is an audio FAB it also monitors the play/pause state of the
 * target and animates a fake equalizer if the target is playing.
 */
export class AudioFab extends BaseElement {
  static get properties() {
    return {
      playing: {type: Boolean, reflect: true},
      showing: {type: Boolean, reflect: true},
      target: {type: String},
    };
  }

  constructor() {
    super();
    this._player = null;
    this._observer = null;
    this.target = null;
    this.inert = true;

    this.onToggle = this.onToggle.bind(this);
    this.onScrollUp = this.onScrollUp.bind(this);
    this.onIntersect = this.onIntersect.bind(this);
  }

  firstUpdated() {
    this._player = document.getElementById(this.target);
    if (!this._player) {
      return;
    }

    this._player.addEventListener('play', this.onToggle);
    this._player.addEventListener('pause', this.onToggle);

    this.addEventListener('click', this.onScrollUp);

    this._observer = new IntersectionObserver(this.onIntersect, {threshold: 1});
    this._observer.observe(this._player);
  }

  onToggle() {
    this.playing = !(/** @type {HTMLMediaElement} */ (this._player).paused);
  }

  onScrollUp() {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onIntersect(entries) {
    entries.forEach((entry) => {
      this.showing = !entry.isIntersecting;
      this.inert = !this.showing;
    });
  }
}

customElements.define('web-audio-fab', AudioFab);
