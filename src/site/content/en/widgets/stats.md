---
title: 'Stats'
---
<style>
  .stats {
    display: flex;
    gap: 0 24px;
    /* Removes DevSite default padding for lists */
    padding: 0;
  }

  .stats__item {
    flex: 1 1;
    max-width: calc(33.3333333333% - 16px);
    background: var(--devsite-success-notice-background);
    border: var(--devsite-success-notice-color);
    border-radius: var(--devsite-card-border-radius);
    box-shadow: var(--devsite-card-box-shadow);
    color: var(--devsite-success-notice-color);
    padding: 18px 20px 20px;
  }

  .stats__figure {
    font-size: 2em;
    font-weight: 500;
  }

  .stats__figure sub {
    font-weight: normal;
    vertical-align: baseline;
  }

  @media screen and (max-width: 1253px) {
    .stats {
      display: block;
    }
  }
</style>

## Stats

Use the Stats component to call out important statistics
about a product or service discussed in a post.
(Stats are primarily used in case studies.)

Include no more than four statistics in a single Stats component
to avoid layout issues.

[Detailed specification](/design-system/component/stats/)

<ul class="stats">
  <div class="stats__item">
    <p class="stats__figure">
      30
      <sub>%</sub>
    </p>
    <p>Lower cost per conversion</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      13
      <sub>%</sub>
    </p>
    <p>Higher CTR</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      4
      <sub>x</sub>
    </p>
    <p>Faster load times</p>
  </div>
</ul>

Stats component with applied utility class `bg-state-good-bg color-state-good-text`:

<ul class="stats bg-state-good-bg color-state-good-text">
  <div class="stats__item">
    <p class="stats__figure">
      30
      <sub>%</sub>
    </p>
    <p>Lower cost per conversion</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      13
      <sub>%</sub>
    </p>
    <p>Higher CTR</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      4
      <sub>x</sub>
    </p>
    <p>Faster load times</p>
  </div>
</ul>
