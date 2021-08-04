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

/**
 * Element that allows a user to toggle the current theme.
 * @extends {HTMLElement}
 * @final
 */
class ThemeToggle extends HTMLElement {
  constructor() {
    super();

    this.STORAGE_KEY = 'user-color-scheme';
    this.COLOR_MODE_KEY = '--color-mode';
  }

  connectedCallback() {
    this.toggleSwitch = this.querySelector('[role="switch"]');

    if (this.toggleSwitch) {
      this.applySetting();

      // Allows --flow-space to work and we
      // only want that to happen when it's
      // ready to go
      this.style.display = 'block';
      this.toggleSwitch.style.visibility = 'visible';

      // On change, calculate the new setting, toggle state changes and store in storage
      this.toggleSwitch.addEventListener('change', () => {
        const setting = this.toggleSwitch.checked ? 'dark' : 'light';

        this.applySetting(setting);
        localStorage.setItem(this.STORAGE_KEY, setting);
      });
    }
  }

  getCSSCustomProp(propKey) {
    let response = getComputedStyle(document.documentElement).getPropertyValue(
      propKey,
    );

    // Tidy up the string if there’s something to work with
    if (response.length) {
      response = response.replace(/'|"/g, '').trim();
    }

    // Gorko will probably set this as a `var()` reference,
    // we need to strip that stuff out
    return response.replace('var(--color-').replace(')');
  }

  applySetting(passedSetting) {
    // Attempts to load the setting from local storage
    const currentSetting =
      passedSetting || localStorage.getItem(this.STORAGE_KEY);

    if (currentSetting) {
      this.setToggleSwitchStatus(currentSetting);
      window.applyThemeSetting(currentSetting);
    } else {
      // Loads the value based on the CSS custom property value instead, with a fallback of light
      const customPropValue =
        this.getCSSCustomProp(this.COLOR_MODE_KEY) || 'light';
      this.setToggleSwitchStatus(customPropValue);
      window.applyThemeSetting(customPropValue);
    }
  }

  // Sets the correct aria checked role and checked state
  setToggleSwitchStatus(currentSetting) {
    const isDarkMode = currentSetting === 'dark';
    this.toggleSwitch.setAttribute(
      'aria-checked',
      isDarkMode ? 'true' : 'false',
    );
    this.toggleSwitch.checked = isDarkMode;
  }
}

if ('customElements' in window) {
  customElements.define('theme-toggle', ThemeToggle);
}

export default ThemeToggle;
