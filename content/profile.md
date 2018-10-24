---
title: Lighthouse
---

Review your Lighthouse audit below and see detailed guidance on how to improve it.

Demo instructions:

1. Be sure to **Sign In** above.

1. If you don't see scores below, use 'Inspect Element' to find the `web-profile` element.
   Type `$0.addInterestUrl('https://nu.nl')`.
   After a few seconds, the scores should display for the site you've added.
   Right now, you can only add scores for sites [from here](https://webdev-dot-lighthouse-ci.appspot.com/).

<div>
<web-profile>
  <!-- TODO: This is just fake data for now -->
  <div class="profile__site">
    <div class="profile__site-details">
      <h3>robdodson.me</h3>
      <div>Last audit: Today, 6pm</div>
    </div>
    <div class="profile__site-actions">
      <button>Switch URL</button>
      <button>Run Audit</button>
    </div>
  </div>
  <web-lighthouse-scores></web-lighthouse-scores>
</web-profile>
</div>

<div><web-todo-list>
<script type="application/json">{% include "./allguides.json" %}</script>
</web-todo-list></div>
