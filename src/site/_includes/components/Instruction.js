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
const capitalize = require('../../_filters/capitalize');
const {i18n, getLocaleFromPath} = require('../../_filters/i18n');

/**
 * A component to help DRY up common lists of instructions.
 * This helps ensure consistency in our docs and makes it easy
 * to respond when Glitch changes their UI.
 * @this {EleventyPage}
 * @param {string} type The type of instruction to print.
 * @param {string} listStyle The list style to use. Defaults to 'ul'.
 * @return {string} A list of instructions.
 */
function Instruction(type, listStyle = 'ul') {
  const locale = getLocaleFromPath(this.page && this.page.filePathStem);

  let instruction;
  let bullet;

  switch (listStyle) {
    case 'ol':
      bullet = '1. ';
      break;

    case 'ul':
      bullet = '- ';
      break;

    case 'none':
      bullet = '';
      break;

    default:
      throw new Error(
        `Could not create Instruction with listStyle: ${listStyle}`,
      );
  }

  function getInstruction(instruction) {
    return `${bullet}${i18n(`i18n.instructions.${instruction}`, locale)}`;
  }

  switch (type) {
    case 'remix':
      instruction = getInstruction('remix');
      break;

    // prettier-ignore
    case 'console':
      instruction = html`
        ${getInstruction('console.click_tools')}
        ${getInstruction('console.click_logs')}
        ${getInstruction('console.click_console')}
      `;
      break;

    // prettier-ignore
    case 'create':
      instruction = html`
        ${getInstruction('create.click_new_file')}
        ${getInstruction('create.click_add_file')}
      `;
      break;

    case 'preview':
      // Note: This uses an inline style on the image button instead of pulling
      // from one of our CSS files. This is mainly because this style is only
      // used by this component so it's a bit easier to keep everything
      // contained in this one file.
      instruction = html`
        ${getInstruction('preview')}
        <img
          src="/images/glitch/fullscreen.svg"
          alt="fullscreen"
          style="padding: 4px 8px; opacity: .5; border: 1px solid #c3c3c3; border-radius: 5px;"
        />.
      `;
      break;

    case 'source':
      // prettier-ignore
      instruction = html`
        ${getInstruction('source')}
      `;
      break;

    case 'disable-cache':
      instruction = getInstruction('disable_cache');
      break;

    case 'reload-app':
      instruction = getInstruction('reload_app');
      break;

    case 'reload-page':
      instruction = getInstruction('reload_page');
      break;

    case 'start-profiling':
      instruction = html`
        ${getInstruction('start_profiling')}
        <img
          src="/images/icons/reload.svg"
          alt="reload"
          style="width: 1.2em; padding: 0px 0px 2px 2px; opacity: .5"
        />.
      `;
      break;

    case 'devtools-command':
      instruction = getInstruction('devtools.command');
      break;

    case 'devtools':
    case 'devtools-elements':
    case 'devtools-console':
    case 'devtools-sources':
    case 'devtools-network':
    case 'devtools-performance':
    case 'devtools-memory':
    case 'devtools-application':
    case 'devtools-security':
    case 'devtools-lighthouse':
      instruction = getInstruction('devtools.open');
      let tab = type.substring('devtools-'.length);
      if (tab) {
        tab = capitalize(tab);
        instruction = html`
          ${getInstruction('devtools.open')}
          ${getInstruction('devtools.open_tab').replace(/<TAB>/g, tab)}
        `;
      }
      break;

    case 'audit-performance':
    case 'audit-seo':
    case 'audit-accessibility':
    case 'audit-pwa':
    case 'audit-best-practices':
      let audit = type.split('-').slice(1).join(' ');
      if (audit === 'seo') {
        audit = audit.toUpperCase();
      } else if (audit === 'pwa') {
        audit = 'Progressive Web App';
      } else {
        // Note: DevTools uses title case for Progressive Web App but
        // only capitalizes "Best practices"
        audit = capitalize(audit);
      }
      // prettier-ignore
      instruction = html`
        ${getInstruction('devtools.open')}
        ${getInstruction('lighthouse.open_tab')}
        ${getInstruction('lighthouse.select_audit').replace(/<AUDIT>/g, audit)}
        ${getInstruction('lighthouse.generate_report')}
      `;
      break;

    default:
      throw new Error(`Could not find Instruction with type: ${type}`);
  }
  return instruction;
}

module.exports = Instruction;
