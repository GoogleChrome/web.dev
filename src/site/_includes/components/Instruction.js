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

/**
 * A component to help DRY up common lists of instructions.
 * This helps ensure consistency in our docs and makes it easy
 * to respond when Glitch changes their UI.
 * @param {string} type The type of instruction to print.
 * @param {string} listStyle The list style to use. Defaults to 'ul'.
 * @return {string} A list of instructions.
 */
module.exports = (type, listStyle = 'ul') => {
  let instruction;
  let substitution;
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

  // Common phrases shared across multiple instructions.
  const shared = {
    devtools: `${bullet}Press \`Control+Shift+J\` (or \`Command+Option+J\` on Mac) to open DevTools.`,
  };

  switch (type) {
    case 'remix':
      instruction = `${bullet}Click **Remix to Edit** to make the project editable.`;
      break;

    // prettier-ignore
    case 'console':
      instruction = html`
        ${bullet}Click **Tools**.
        ${bullet}Click **Logs**.
        ${bullet}Click **Console**.
      `;
      break;

    // prettier-ignore
    case 'create':
      instruction = html`
        ${bullet}Click **New File** and give it a name.
        ${bullet}Click **Add This File**.
      `;
      break;

    case 'preview':
      // Note: This uses an inline style on the image button instead of pulling
      // from one of our CSS files. This is mainly because this style is only
      // used by this component so it's a bit easier to keep everything
      // contained in this one file.
      instruction = html`
        ${bullet}To preview the site, press **View&nbsp;App**. Then press
        **Fullscreen**
        <img
          src="/images/glitch/fullscreen.svg"
          alt="fullscreen"
          style="padding: 4px 8px; opacity: .5; border: 1px solid #c3c3c3; border-radius: 5px;"
        />.
      `;
      break;

    case 'source':
      instruction = html`
        ${bullet}To view the source, press **View&nbsp;Source**.
      `;
      break;

    case 'disable-cache':
      instruction = html`${bullet}Select the **Disable cache** checkbox.`;
      break;

    case 'reload-app':
      instruction = html`${bullet}Reload the app.`;
      break;

    case 'reload-page':
      instruction = html`${bullet}Reload the page.`;
      break;

    case 'start-profiling':
      instruction = html`
        ${bullet}Click **Start profiling and reload page**
        <img
          src="/images/icons/reload.svg"
          alt="reload"
          style="width: 1.2em; padding: 0px 0px 2px 2px; opacity: .5"
        />.
      `;
      break;

    case 'devtools-command':
      instruction = html`
        ${bullet}Press \`Control+Shift+P\` (or \`Command+Shift+P\` on Mac) to
        open the **Command** menu.
      `;
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
      instruction = html`${shared.devtools}`;
      substitution = type.substring('devtools-'.length);
      if (substitution) {
        // prettier-ignore
        instruction = html`
          ${instruction}
          ${bullet}Click the **${capitalize(substitution)}** tab.
        `;
      }
      break;

    case 'audit-performance':
    case 'audit-seo':
    case 'audit-accessibility':
    case 'audit-pwa':
    case 'audit-best-practices':
      substitution = type.split('-').slice(1).join(' ');
      if (substitution === 'seo') {
        substitution = substitution.toUpperCase();
      } else if (substitution === 'pwa') {
        substitution = 'Progressive Web App';
      } else {
        // Note: DevTools uses title case for Progressive Web App but
        // only capitalizes "Best practices"
        substitution = capitalize(substitution);
      }
      // prettier-ignore
      instruction = html`
        ${shared.devtools}
        ${bullet}Click the **Lighthouse** tab.
        ${bullet}Make sure the **${substitution}** checkbox is selected in the *Categories* list.
        ${bullet}Click the **Generate report** button.
      `;
      break;

    default:
      throw new Error(`Could not find Instruction with type: ${type}`);
  }
  return instruction;
};
