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
    MID_TEXT: 'mid-text',
    HIGHLIGHT_TEXT: 'highlight-text',
    ACTION_TEXT: 'action-text',
    ACTION_BG: 'action-bg',
    ACTION_TEXT_2: 'action-text-2',
    ACTION_BG_2: 'action-bg-2',
    STATE_INFO_TEXT: 'state-info-text',
    STATE_WARN_TEXT: 'state-warn-text',
    STATE_GOOD_TEXT: 'state-good-text',
    STATE_BAD_TEXT: 'state-bad-text',
  },
  getDark() {
    return {
      CORE_TEXT: 'shades-light',
      CORE_BG: 'shades-dark',
      MID_TEXT: 'shades-gray-glare',
      HIGHLIGHT_TEXT: 'core-primary-glare',
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
      CORE_BG: 'shades-light-bright',
      MID_TEXT: 'shades-gray',
      HIGHLIGHT_TEXT: 'core-primary',
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
