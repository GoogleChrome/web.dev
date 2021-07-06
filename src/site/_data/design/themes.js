module.exports = {
  colorKeys: {
    CORE_TEXT: 'core-text',
    CORE_BG: 'core-bg',
    ACTION_TEXT: 'action-text',
    ACTION_BG: 'action-bg',
    ACTION_TEXT_2: 'action-text-2',
    ACTION_BG_2: 'action-bg-2',
  },
  getDark() {
    return {
      CORE_TEXT: 'shades-light',
      CORE_BG: 'shades-dark',
      ACTION_TEXT: 'core-primary',
      ACTION_BG: 'shades-light-bright',
      ACTION_TEXT_2: 'shades-light-bright',
      ACTION_BG_2: 'core-primary',
    };
  },
  getLight() {
    return {
      CORE_TEXT: 'shades-dark',
      CORE_BG: 'shades-light-bright',
      ACTION_TEXT: 'core-primary',
      ACTION_BG: 'shades-light-bright',
      ACTION_TEXT_2: 'shades-light-bright',
      ACTION_BG_2: 'core-primary',
    };
  },
  generate() {
    return [
      {
        name: 'default',
        tokens: this.getLight(),
      },
      {
        name: 'dark',
        key: 'prefers-color-scheme',
        value: 'dark',
        tokens: this.getDark(),
      },
      {
        name: 'dark-toggle',
        key: 'prefix',
        value: '[data-theme="dark"]',
        tokens: this.getDark(),
      },
    ];
  },
};
