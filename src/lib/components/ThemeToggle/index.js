class ThemeToggle extends HTMLElement {
  constructor() {
    super();

    this.STORAGE_KEY = 'user-color-scheme';
    this.COLOR_MODE_KEY = '--color-mode';
  }

  connectedCallback() {
    // Allows --flow-space to work and we
    // only want that to happen when it's
    // wired up
    this.style.display = 'block';

    this.render();
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
      this.setStatus(currentSetting);
      window.applyThemeSetting(currentSetting);
    } else {
      // Loads the value based on the CSS custom property value instead, with a fallback of light
      const customPropValue =
        this.getCSSCustomProp(this.COLOR_MODE_KEY) || 'light';
      this.setStatus(customPropValue);
      window.applyThemeSetting(customPropValue);
    }
  }

  setStatus(currentSetting) {
    // Loop the buttons and set aria-pressed (active) state depending on current theme
    this.buttons.forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        currentSetting === button.getAttribute('data-theme') ? 'true' : 'false',
      );
    });
  }

  render() {
    this.innerHTML = `
      <div class="theme-toggle" aria-label="Change display theme">
        <button class="button" data-theme="light">Light</button>
        <button class="button" data-theme="dark">Dark</button>
      </div>
    `;

    this.afterRender();
  }

  afterRender() {
    this.buttons = this.querySelectorAll('[data-theme]');

    // Loop each button to attach the toggle event
    this.buttons.forEach((button) => {
      button.addEventListener('click', (evt) => {
        evt.preventDefault();

        const setting = button.getAttribute('data-theme');
        this.applySetting(setting);
        localStorage.setItem(this.STORAGE_KEY, setting);
      });
    });

    this.applySetting();
  }
}

if ('customElements' in window) {
  customElements.define('theme-toggle', ThemeToggle);
}

export default ThemeToggle;
