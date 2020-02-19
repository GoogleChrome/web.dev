---
title: A post with a sample self-assessment
description: |
  A description of the article that will appear in search results.
authors:
  - mfriesenhahn
date: 2020-02-16
tags:
  - post
---

Include a self-assessment in your post using this include:

<!--lint disable no-unescaped-template-tags-->
{% from "content/self-assessment.njk" import selfAssessment %}
{{ selfAssessment(assessments[0]) }}
<!--lint enable no-unescaped-template-tags-->

Then populate the `your-post-directory-name.11tydata.js` file in your post's
folder following the patterns in `_template-self-assessment.11tydata.js`.
