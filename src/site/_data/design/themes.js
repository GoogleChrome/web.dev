/*
  THEME CONFIG

  In here, we have some enum-style keys that refer to colors in context. These
  keys are then used to inform a relationship between context and design tokens.

  The structure for a color design token reference is ${group}-${item} and should
  be lowercase, so if you wanted to use the core primary color, you would use
  'core-primary' because “Core” is the group and “Primary” is the item
*/
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
      MID_TEXT: 'shades-gray-glare',
      HIGHLIGHT_TEXT: 'core-primary-glare',
      CORE_BG: 'shades-dark',
      ACTION_TEXT: 'core-primary',
      ACTION_BG: 'shades-light-bright',
      ACTION_TEXT_2: 'shades-light-bright',
      ACTION_BG_2: 'core-primary',
      STATE_INFO_TEXT: 'core-primary',
      STATE_WARN_TEXT: 'state-warn',
      STATE_GOOD_TEXT: 'state-good',
      STATE_BAD_TEXT: 'state-bad',
    };
  },
  getLight() {
    return {
      CORE_TEXT: 'shades-dark',
      MID_TEXT: 'shades-gray',
      HIGHLIGHT_TEXT: 'core-primary',
      CORE_BG: 'shades-light-bright',
      ACTION_TEXT: 'core-primary',
      ACTION_BG: 'shades-light-bright',
      ACTION_TEXT_2: 'shades-light-bright',
      ACTION_BG_2: 'core-primary',
      STATE_INFO_TEXT: 'core-primary',
      STATE_WARN_TEXT: 'state-warn',
      STATE_GOOD_TEXT: 'state-good',
      STATE_BAD_TEXT: 'state-bad',
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
