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
    MID_BG: 'mid-bg',
    HIGHLIGHT_TEXT: 'highlight-text',
    HIGHLIGHT_TEXT_ALT: 'highlight-text-alt',
    HIGHLIGHT_INTERACT_BG: 'highlight-interact-bg',
    ACCENT_TEXT: 'accent-text',
    ACCENT_BG: 'accent-bg',
    ACTION_TEXT: 'action-text',
    ACTION_BG: 'action-bg',
    ACTION_TEXT_2: 'action-text-2',
    ACTION_BG_2: 'action-bg-2',
    FOCUS_RING: 'focus-ring',
    STATE_INFO_TEXT: 'state-info-text',
    STATE_WARN_TEXT: 'state-warn-text',
    STATE_GOOD_TEXT: 'state-good-text',
    STATE_BAD_TEXT: 'state-bad-text',
    STROKE: 'stroke',
  },
  getDark() {
    return {
      CORE_TEXT: 'shades-light',
      CORE_BG: 'shades-dim',
      MID_TEXT: 'shades-gray-glare',
      MID_BG: 'shades-charcoal',
      HIGHLIGHT_TEXT: 'core-primary-glare',
      HIGHLIGHT_TEXT_ALT: 'core-tertiary-glare',
      HIGHLIGHT_INTERACT_BG: 'shades-charcoal',
      ACCENT_TEXT: 'shades-gray-glare',
      ACCENT_BG: 'shades-charcoal',
      ACTION_TEXT: 'core-primary',
      ACTION_BG: 'shades-light-bright',
      ACTION_TEXT_2: 'shades-light-bright',
      ACTION_BG_2: 'core-primary',
      FOCUS_RING: 'core-primary-glare',
      STATE_INFO_TEXT: 'core-primary',
      STATE_WARN_TEXT: 'state-warn',
      STATE_GOOD_TEXT: 'state-good',
      STATE_BAD_TEXT: 'state-bad',
      STROKE: 'shades-gray',
    };
  },
  getLight() {
    return {
      CORE_TEXT: 'shades-dark',
      CORE_BG: 'shades-light-bright',
      MID_TEXT: 'shades-gray',
      MID_BG: 'shades-light',
      HIGHLIGHT_TEXT: 'core-primary',
      HIGHLIGHT_TEXT_ALT: 'core-tertiary',
      HIGHLIGHT_INTERACT_BG: 'core-primary-bright',
      ACCENT_TEXT: 'shades-dark',
      ACCENT_BG: 'shades-light',
      ACTION_TEXT: 'core-primary',
      ACTION_BG: 'shades-light-bright',
      ACTION_TEXT_2: 'shades-light-bright',
      ACTION_BG_2: 'core-primary',
      FOCUS_RING: 'core-primary',
      STATE_INFO_TEXT: 'core-primary',
      STATE_WARN_TEXT: 'state-warn',
      STATE_GOOD_TEXT: 'state-good',
      STATE_BAD_TEXT: 'state-bad',
      STROKE: 'shades-gray-glare',
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
