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

const cheerio = require('cheerio');
const {html} = require('common-tags');
const md = require('markdown-it')();
const mdBlock = require('../../_filters/md-block');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const site = require('../../_data/site');
const {generateImgixSrc} = require('./Img');

// Renders the set leader at the top of the self-assessment
function headerTemplate(assessment) {
  if (assessment.setLeader && assessment.questions.length > 1) {
    return html`
      <div class="w-callout__blurb web-assessment__set-leader">
        ${assessment.setLeader}
      </div>
    `;
  }
}

// Renders the assessment content on its own (if there's only one question)
// or in a web-tabs component (if there's more than one question).
// Passes data for questions to the question template for rendering.
/* eslint-disable indent */
function contentTemplate(assessment) {
  if (assessment.questions.length > 1) {
    return html`
      <web-tabs
        class="web-assessment__content unresolved"
        label="${assessment.tabLabel}s for knowledge self check"
      >
        ${assessment.questions.map((question) => {
          return questionTemplate(question, assessment);
        })}
      </web-tabs>
    `;
  } else {
    return html`
      <div class="web-assessment__content">
        ${assessment.questions.map((question) => {
          return questionTemplate(question, assessment);
        })}
      </div>
    `;
  }
}
/* eslint-enable indent */

// Renders each question by creating the stimulus (if one exists in the YAML)
// and passing the response components to the response template.
function questionTemplate(question, assessment) {
  const stimulus = question.stimulus
    ? html`<div data-role="stimulus">${mdBlock(question.stimulus)}</div>`
    : '';

  const height = assessment.height
    ? `question-height="${assessment.height}"`
    : '';

  const content = html`
    <web-question ${height} data-label="${assessment.tabLabel}">
      ${stimulus} ${responsesTemplate(question)}
    </web-question>
  `;
  const $ = cheerio.load(content);
  $('img').each(function () {
    // @ts-ignore
    const oldSrc = $(this).attr('src');
    if (/image\/(.*)\/(.*)\.([a-z]{1,4})$/.test(oldSrc)) {
      const src = generateImgixSrc(oldSrc);
      // @ts-ignore
      $(this).attr('src', src);
    }
  });

  return html`${$.html()}`;
}

// If a question has no components,
// get the response component from the question object itself.
// If a question DOES have components,
// get the response components from the question's components object.
function responsesTemplate(question) {
  if (!question.components) {
    return responseTemplate(question);
  }
  return question.components.map(responseTemplate);
}

// Renders each question response by creating the appropriate response web component
// with the question metadata as attributes.
// Question options and rationales are passed to the relevant templates.
// Also handles authoring errors in the correctAnswers and cardinality values.
function responseTemplate(response) {
  if (!response.type) {
    throw new Error(`
      Can't create a self-assessment response component without a type argument.
      Check that all response component objects in your assessment's *.assess.yml file
      include a type key.
    `);
  }

  if (
    response.cardinality &&
    !/^\d+$/.test(response.cardinality) &&
    !/^\d+\+$/.test(response.cardinality) &&
    !/^\d-\d+$/.test(response.cardinality)
  ) {
    throw new Error(`
      The cardinality value for self-assessment response components must be n, n+, or n-m.
      Check your assessment's *.assess.yml file for invalid cardinality values.
    `);
  }

  if (response.correctAnswers && !/^\d(,\d)*$/.test(response.correctAnswers)) {
    throw new Error(`
      The correctAnswers value for self-assessment response components
      must be a comma-separated list of positive integers.
      Check your assessment's *.assess.yml file for invalid correctAnswer values.
    `);
  }

  if (response.columns && typeof response.columns !== 'boolean') {
    throw new Error(`
      The columns value for self-assessment response components must be true or false.
      Check your assessment's *.assess.yml file for invalid columns values.
    `);
  }

  let typeSuffix = '';

  switch (response.type) {
    case 'think-and-check':
      typeSuffix = '-tac';
      break;
    case 'multiple-choice':
      typeSuffix = '-mc';
      break;
    default:
      throw new Error(`
        Unrecognized self-assessment question response type.
        Check your assessment's *.assess.yml file for invalid type values.
      `);
  }

  const cardinalityAttr = response.cardinality
    ? 'cardinality=' + response.cardinality
    : '';
  const correctAnswersAttr = response.correctAnswers
    ? 'correct-answer=' + response.correctAnswers
    : '';
  const columnsAttr = response.columns ? 'columns' : '';

  return html`
    <web-response${typeSuffix} ${cardinalityAttr} ${correctAnswersAttr} ${columnsAttr} data-role="response">
      <p data-role="stem">${md.renderInline(response.stem)}</p>
      ${response.options.map(optionContentTemplate)}
      ${response.options.map(rationaleTemplate)}
    </web-response${typeSuffix}>
  `;
}

// Wraps options in divs with the option data-type so they can be interpretted
// by the response web components.
function optionContentTemplate(option) {
  if (!option.content) {
    return;
  }
  return html`
    <span data-role="option">${md.renderInline(option.content)}</span>
  `;
}

// Wraps rationales in divs with the rationale data-type so they can be interpretted
// by the response web components.
function rationaleTemplate(option) {
  if (!option.rationale) {
    return;
  }
  return html`
    <div data-role="rationale">${md.render(option.rationale)}</div>
  `;
}

/**
 * Gets the assessment object from the YAML file passed in the shortcode
 * and passes it to the template functions above.
 * @this {EleventyPage}
 * @param {TargetAssessment} targetAssessment
 * @returns
 */
module.exports = function (targetAssessment) {
  if (!targetAssessment) {
    throw new Error(`
      Can't create Assessment component without a target assessment.
      Pass the file name, without ".assess.yml", of the desired assessment as a string.
    `);
  }

  const filePath = this.page.filePathStem.replace(/index$/, '');
  const source = path.join(
    site.contentDir,
    filePath,
    targetAssessment + '.assess.yml',
  );
  const data = fs.readFileSync(source, 'utf8');
  const assessment = yaml.safeLoad(data);

  // prettier-ignore
  return html`
    <web-assessment class="w-callout unresolved ${assessment.questions.length === 1 && 'web-assessment--singleton'}" aria-label="Check your understanding">
      ${headerTemplate(assessment)} ${contentTemplate(assessment)}
    </web-assessment>
  `;
};
