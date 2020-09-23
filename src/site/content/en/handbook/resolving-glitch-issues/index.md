---
layout: handbook
title: Resolving Glitch issues
authors:
  - houssein
date: 2020-04-27
description: |
  Guidance on fixing Glitch issues.
---

web.dev uses Glitch to embed web-based sample apps and development environments in its posts and
codelabs. See the [Sample apps](/handbook/markup-sample-app) post for information about how to set
up a Glitch.

This post will show you how to resolve some common Glitch issues.

{% Aside %}
  Subscribing to Glitch and paying for Boosted Apps will automatically increase memory and disk
  space as well as improve your rate limits. That's an always an option if you run into any of the
  disk/memory issues mentioned in this post. [Learn
  more](https://glitch.happyfox.com/kb/article/73-boosted-apps-what-s-that/).
{% endAside %}

## Project is suspended

If you see a "Project has been suspended" message when opening a new project, contact support via
their public forum or by emailing `support@glitch.com`. You should receive a reply soon with steps
you can take to fix your project.

<img class="w-screenshot w-screenshot-filled" src="suspended-project.png" alt="Suspended-project">

## Exceeding disk usage

If you see an App Status warning with exceeded disk limits, you'll need to clear up some space
before you can edit and use the project.

![Disk limit exceeded](./disk-limit.png)

* Remove any unnecessary dependencies from `package.json`
* In the terminal, run `git gc` and `git prune` to remove unneeded files
* Run `du -hd1` to to see which directories are taking up disk space

![Directories disk usage](./directories.png)

If an unneeded directory is bloating up on every build and taking up disk space:

* Remove it (`rm -rf directory_name`)
* Consider adding a `prestart` script in `package.json` to ensure it gets deleted on every build

  ```json
  "scripts": {
    "prestart": "rimraf directory_name",
    "start": "..."
  },
  ```

If the `.git` directory is taking up disk space:

* Run `git log --name-only --format="" | cat | sort | uniq -c | sort -nbr` to see which files are
  being committed to history (note: this will still include files previously committed even if they
  are now in `.gitignore`)

![Committed files](./git-committed-files.png)

* If you see any directories committed many times that shouldn't be, add them to `.gitignore`
* If you don't need `.git` history, remove the `.git` folder (`rm -rf .git`)