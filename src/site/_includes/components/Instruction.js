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

/* eslint-disable max-len */

const {html} = require('common-tags');

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
      throw new Error(`Could not create Instruction with listStyle: ${listStyle}`);
  }

  // These are common phrases shared across multiple instructions.
  const shared = {
    devtools: `${bullet}Press \`Control+Shift+J\` (or \`Command+Option+J\` on Mac) to open DevTools.`,
    audits: `${bullet}Click the **Audits** tab.`,
    runAudit: `${bullet}Click **Run audits**.`,
  };

  switch (type) {
    case 'remix':
      instruction = `${bullet}Click **Remix to Edit** to make the project editable.`;
      break;

    case 'console':
      instruction = html`
        ${bullet}Click **Tools**.
        ${bullet}Click **Logs**.
        ${bullet}Click **Console**.
      `;
      break;

    case 'preview':
      // Note: This uses an inline style on the image button instead of pulling
      // from one of our CSS files. This is mainly because this style is only
      // used by this component so it's a bit easier to keep everything
      // contained in this one file.
      instruction = html`
        ${bullet}To preview the site, press the **View App** button, then press the <img src="/images/glitch/fullscreen.svg"
          alt="fullscreen" style="padding: 4px 8px; opacity: .5; border: 1px solid #c3c3c3; border-radius: 5px;"> button.
      `;
      break;

    case 'devtools':
      instruction = html`${shared.devtools}`;
      break;

    case 'devtools-elements':
      instruction = html`
        ${shared.devtools}
        ${bullet}Click the **Elements** tab.
      `;
      break;

    case 'devtools-console':
      instruction = html`
        ${shared.devtools}
        ${bullet}Click the **Console** tab.
      `;
      break;


    case 'devtools-sources':
      instruction = html`
        ${shared.devtools}
        ${bullet}Click the **Sources** tab.
      `;
      break;

    case 'devtools-network':
      instruction = html`
        ${shared.devtools}
        ${bullet}Click the **Network** tab.
      `;
      break;

    case 'devtools-performance':
      instruction = html`
        ${shared.devtools}
        ${bullet}Click the **Performance** tab.
      `;
      break;

    case 'devtools-memory':
      instruction = html`
        ${shared.devtools}
        ${bullet}Click the **Memory** tab.
      `;
      break;

    case 'devtools-application':
      instruction = html`
        ${shared.devtools}
        ${bullet}Click the **Application** tab.
      `;
      break;

    case 'devtools-security':
      instruction = html`
        ${shared.devtools}
        ${bullet}Click the **Security** tab.
      `;
      break;

    case 'devtools-audits':
      instruction = html`
        ${shared.devtools}
        ${shared.audits}
      `;
      break;

    case 'performance-audit':
      instruction = html`
        ${shared.devtools}
        ${shared.audits}
        ${bullet}Select the **Performance** checkbox.
        ${shared.runAudit}
      `;
      break;

    case 'seo-audit':
      instruction = html`
        ${shared.devtools}
        ${shared.audits}
        ${bullet}Select the **SEO** checkbox.
        ${shared.runAudit}
      `;
      break;

    case 'accessibility-audit':
      instruction = html`
        ${shared.devtools}
        ${shared.audits}
        ${bullet}Select the **Accessibility** checkbox.
        ${shared.runAudit}
      `;
      break;

    case 'pwa-audit':
      instruction = html`
        ${shared.devtools}
        ${shared.audits}
        ${bullet}Select the **Progressive Web App** checkbox.
        ${shared.runAudit}
      `;
      break;

    case 'best-practices-audit':
      instruction = html`
        ${shared.devtools}
        ${shared.audits}
        ${bullet}Select the **Best practices** checkbox.
        ${shared.runAudit}
      `;
      break;

    default:
      throw new Error(`Could not find Instruction with type: ${type}`);
  }
  return instruction;
};
