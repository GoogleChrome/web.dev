const {html} = require('common-tags');

module.exports = (content, type) => {
  let label;
  switch (type) {
    case 'worse':
      label = 'Not recommended';
      break;

    case 'better':
      label = 'Recommended';
      break;

    default:
      break;
  }

  if (!label) {
    /* eslint-disable max-len */
    throw new Error(
      `Can't create compare component without a type. Did you forget to pass the type as a string?`
    );
    /* eslint-enable max-len */
  }

  // Add an em dash to separate the content from the label.
  content = ' — ' + content;

  return html`
    <div class="w-compare">
      <span class="w-compare__label w-compare__label--${type}">
        ${label}
      </span>
      ${content}
    </div>
  `;
};
