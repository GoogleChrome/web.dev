# web.dev

[![Build Status](https://travis-ci.org/GoogleChrome/web.dev.svg?branch=master)](https://travis-ci.org/GoogleChrome/web.dev)

web.dev is the ultimate resource for developers of all backgrounds to learn,
create, and solve on the web. It's meant to not only educate developers, but
help them apply what they've learned to any site they work on, be it personal or
business.

Note: this repo contains the written content for web.dev. The client-side JS and
server are not yet open source but we hope to share them soon! 🙇‍♂️

## Authoring content

[Our wiki](https://github.com/GoogleChrome/web.dev/wiki) provides docs on
authoring guides and codelabs.

## Get started

### Clone the repo.

```
git clone https://github.com/GoogleChrome/web.dev.git
```

### Install dependencies.

```
npm ci
```

### Start a local server to preview the site.

Changes to assets will rebuild the site. Refresh to see changes.

```
npm run dev
```

Next,  open `http://localhost:8080/` to see the site locally. The preview server
allows you to see how the content will look on the production site, but it's
not a true staging server. For example, features like search and JS components
may not work or be entirely broken on the local preview.

### Fetch latest styles (optional)

You won't need to do this if this is your first time installing the repo
because styles will be fetched in the `postinstall` phase. But if you'd ever
like to grab the latest styles you can run this command:

```
npm run styles
```

## Staging

Stage the site to App Engine. This requires you have the
[`gcloud`](https://cloud.google.com/sdk/docs/#install_the_latest_cloud_tools_version_cloudsdk_current_version)
command installed on your system.

```
npm run stage
```

☝️ You'll need to be a member of the App Engine project to run this command.

Preview the site at
[https://web-dev-staging.appspot.com](https://web-dev-staging.appspot.com)

**Tip:** 👩‍🚀

If you'd like to stage the site but don't want to replace what's already on
the current staging site, you can manually run:

```
npm run build
gcloud app deploy --no-promote
```

This will generate a unique URL for your staged content.

## Debugging

The easiest way to debug the site is to add a `debugger` statement to
`.eleventy.js`, then run `npm run debug`, and go to `chrome://inspect` to
attach to the running process.

## Found a bug?

You can file an issue [in our issue
tracker](https://github.com/GoogleChrome/web.dev/issues) and a team member
should reply shortly.

## Want to help?

Take a look [in the issue
tracker](https://github.com/GoogleChrome/web.dev/issues) for any bugs with a
**content** label.
