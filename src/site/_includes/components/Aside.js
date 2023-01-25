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

const {html} = require('common-tags');
const fs = require('fs');
// We need html: true since folks embed HTML inside of {% Aside %}.
// See https://markdown-it.github.io/markdown-it/#MarkdownIt.new
const md = require('markdown-it')({html: true});
const path = require('path');

const {i18n, getLocaleFromPath} = require('../../_filters/i18n');

/**
 * @this {EleventyPage}
 */
function Aside(content, type = 'note') {
  const locale = getLocaleFromPath(this.page && this.page.filePathStem);

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

    case 'celebration':
      utilities.main = 'bg-state-good-bg color-state-good-text';
      icon = 'celebration.svg';
      title = i18n(`i18n.common.${type}`, locale);
      break;

    case 'update':
      icon = 'update.svg';
      title = i18n(`i18n.common.${type}`, locale);
      utilities.main = 'bg-state-update-bg color-state-update-text';
      break;
  }

  // Make sure that we don't insert multiple newlines when this component is
  // used, as it can break the parent Markdown rendering.
  // See https://github.com/GoogleChrome/web.dev/issues/7640
  const renderedContent = md.renderInline(content);
  const titleHTML = title.length
    ? `<p class="cluster ${utilities.title}">` +
      `<span class="aside__icon box-block ${
        utilities.icon
      }">${getIcon()}</span>` +
      `<strong>${title}</strong></p>`
    : '';
  const asideHTML =
    `<aside class="aside flow ${utilities.main}">` +
    titleHTML +
    `<div class="${utilities.body} flow">${renderedContent}</div></aside>`;

  return html`${asideHTML}`;
}

module.exports = Aside;
