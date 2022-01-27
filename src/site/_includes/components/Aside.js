/* global __basedir */

/*
 * Copyright 2019 Google LLC
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
const {i18n, getLocaleFromPath} = require('../../_filters/i18n');
const isDesignSystemContext = require('../../../lib/utils/is-design-system-context');
const fs = require('fs');
const path = require('path');

/* NOTE: This component is in a transition period to support both new design system contexts
and the existing system. Once the new design system has been *fully* rolled out, this component
can be cleaned up with the following:

1. The isDesignSystemContext conditional can be removed and code in that block should run as normal
2. Everything from the '/// DELETE THIS WHEN ROLLOUT COMPLETE' comment *downwards* can be removed
*/

/**
 * @this {EleventyPage}
 */
function Aside(content, type = 'note') {
  const locale = getLocaleFromPath(this.page && this.page.filePathStem);

  /// UN-FENCE CODE IN THIS BLOCK WHEN ROLLOUT COMPLETE
  if (isDesignSystemContext(this.page.filePathStem)) {
    // CSS utility classes that vary per aside type
    const utilities = {
      main: '',
      title: '',
      icon: '',
      body: '',
    };

    // These two get populated based on type
    let title = '';
    let icon = '';

    // If an icon is required, it grabs the SVG source with fs
    // because in a shortcode, we have no access to includes etc
    const getIcon = () => {
      if (!icon.length) {
        return '';
      }

      return fs.readFileSync(
        path.join(__basedir, 'src', 'site', '_includes', 'icons', icon),
        'utf8',
      );
    };

    // Generate all the configurations per aside type
    switch (type) {
      case 'note':
      default:
        utilities.title = 'color-state-info-text';
        utilities.main = 'bg-state-info-bg color-state-info-text';
        break;

      case 'caution':
        utilities.title = 'color-state-bad-text';
        utilities.main = 'bg-state-bad-bg color-state-bad-text';
        icon = 'error.svg';
        title = i18n(`i18n.common.${type}`, locale);
        break;

      case 'warning':
        utilities.icon = 'color-state-warn-text';
        utilities.main = 'bg-state-warn-bg color-state-warn-text';
        icon = 'warning.svg';
        title = i18n(`i18n.common.${type}`, locale);
        break;

      case 'success':
        utilities.main = 'bg-state-good-bg color-state-good-text';
        icon = 'done.svg';
        title = i18n(`i18n.common.${type}`, locale);
        break;

      case 'objective':
        utilities.main = 'bg-state-good-bg color-state-good-text';
        icon = 'done.svg';
        title = i18n(`i18n.common.${type}`, locale);
        break;

      case 'gotchas':
        icon = 'lightbulb.svg';
        title = i18n(`i18n.common.gotchas`, locale);
        utilities.main = 'bg-tertiary-box-bg color-tertiary-box-text';
        break;

      case 'important':
        icon = 'lightbulb.svg';
        title = i18n(`i18n.common.important`, locale);
        utilities.main = 'bg-tertiary-box-bg color-tertiary-box-text';
        break;

      case 'key-term':
        icon = 'highlighter.svg';
        title = i18n(`i18n.common.key_term`, locale);
        utilities.main = 'color-secondary-box-text bg-secondary-box-bg';
        break;

      case 'codelab':
        icon = 'code.svg';
        title = i18n(`i18n.common.try_it`, locale);
        utilities.main = 'bg-quaternary-box-bg color-quaternary-box-text';
        break;
    }

    return `<aside class="aside flow ${utilities.main}">
${
  title.length
    ? `<p class="cluster ${utilities.title}">
<span class="aside__icon box-block ${utilities.icon}">${getIcon()}</span>
<strong>${title}</strong></p>`
    : ''
}
<div class="${utilities.body} flow">

${content}
</div></aside>`;
  }

  /// DELETE THIS WHEN ROLLOUT COMPLETE
  let prefix;
  switch (type) {
    case 'note':
      prefix = '';
      break;

    case 'caution':
    case 'warning':
    case 'success':
    case 'objective':
      prefix = `**${i18n(`i18n.common.${type}`, locale)}**:`;
      break;

    case 'codelab':
      prefix = `**${i18n(`i18n.common.try_it`, locale)}**!`;
      break;

    case 'key-term':
      prefix = `**${i18n(`i18n.common.key_term`, locale)}**:`;
      break;

    case 'gotchas':
      prefix = i18n(`i18n.common.gotchas`, locale);
      // IMPORTANT: The weird whitespace control in both of the below returns
      // is intentional. The newline after the opening div instructs the markdown
      // parser to kick back in. But we have to be careful not to introduce any
      // other newlines or it will insert an extra closing </p> and break the page.
      // This is true for all shortcodes that accept markdown and return html.

      // The <strong> tag should appear outside of the <p> tag
      // generated by markdown. This forces an intentional line break.
      // prettier-ignore
      return `<div class="w-aside w-aside--${type}"><strong>${prefix}!</strong>

${content}</div>`;
  }

  // prettier-ignore
  return `<div class="w-aside w-aside--${type}">

${prefix} ${content}</div>`;
}

module.exports = Aside;
