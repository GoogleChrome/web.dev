module.exports = (page) => {
  // debugger;
  return `
<div class="breadcrumbs">
  <ul>
    <li>
      <a
        class="gc-analytics-event"
        href="https://web.dev/fast"
        data-category="web.dev"
        data-label="guide, path breadcrumb"
        data-action="click"
      >
        Fast load times
      </a>
    </li>
  </ul>
</div>
  `;
};
