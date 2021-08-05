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
      // On change, calculate the new setting, toggle state changes and store in storage
      this.toggleSwitch.addEventListener('change', () => {
        const setting = this.toggleSwitch.checked ? 'dark' : 'light';
        this.applySetting(setting);
        localStorage.setItem(this.STORAGE_KEY, setting);
      });

      this.applySetting();
    }
  }

  applySetting(passedSetting) {
    // Attempts to load the setting from local storage
    const currentSetting =
      passedSetting || localStorage.getItem(this.STORAGE_KEY);

    if (currentSetting) {
      this.setToggleSwitchStatus(currentSetting);
      window.applyThemeSetting(currentSetting);
    }
    // If no storage setting, we set up media query-based state change
    else {
      // Set the checkbox to on if we're already in dark preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setToggleSwitchStatus('dark');
      }

      // Listen for changes to the preference and set checkbox state accordingly
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (evt) => {
          this.setToggleSwitchStatus(evt.matches ? 'dark' : 'light');
        });
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
