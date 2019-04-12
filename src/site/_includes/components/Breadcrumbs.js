const {html} = require('common-tags');

module.exports = () => {
  return html`
    <ul class="w-breadcrumbs">
      <li class="w-breadcrumbs__crumb">
        <a
          class="w-breadcrumbs__link w-breadcrumbs__link--left-justify"
          href="https://web.dev"
          >Home</a
        >
      </li>
      <li class="w-breadcrumbs__crumb">
        <a class="w-breadcrumbs__link" href="https://web.dev/fast"
          >Fast load times</a
        >
      </li>
    </ul>
  `;
};
