# web.dev

[![Build Status](https://travis-ci.org/GoogleChrome/web.dev.svg?branch=master)](https://travis-ci.org/GoogleChrome/web.dev)

web.dev is the ultimate resource for developers of all backgrounds to learn,
create, and solve on the web. It's meant to not only educate developers, but
help them apply what they've learned to any site they work on, be it personal or
business.

## Found a bug? 👷‍♀️

Thanks for letting us know! Please [file an issue](https://github.com/GoogleChrome/web.dev/issues/new?assignees=&labels=bug&template=bug_report.md&title=) and a team member should reply shortly.

## Authoring content ✍️

Before you start writing take a moment to look over the [web.dev
handbook](https://web.dev/handbook) and familiarize yourself with the process.
When you're ready, follow the steps in the
[Quickstart](https://web.dev/handbook/quick-start/) to create your content
proposal.

## Building the site 🏗

### Clone the repo

```bash
git clone https://github.com/GoogleChrome/web.dev.git
```

### Install dependencies

```bash
npm ci
```

### Start a local server to preview the site

```bash
npm run dev
```

Open `http://localhost:8080/` to see the site locally. Changes to assets will
rebuild the site. Refresh to see your changes.

## Staging 🕺

When you send in a pull request it will be automatically staged for you. Keep an
eye out for the netlify bot to comment on the pull request with your unique URL.

## Debugging 🐛

If you need to debug the site's build process:

1. Add a `debugger` statement to `.eleventy.js`
1. Run `npm run debug`
1. Go to `chrome://inspect` to attach to the running process.

<img
  width="295"
  alt="The Chrome inspect page showing the inspect button"
  src="https://user-images.githubusercontent.com/1066253/61085691-bf125a00-a3e5-11e9-9151-58bd8a50d404.png">