# web.dev

![Continuous integration](https://github.com/GoogleChrome/web.dev/workflows/Continuous%20integration/badge.svg)

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

You'll need a recent version of [Node](https://nodejs.org/): v14 (LTS) or higher.
To check your node version run `node -v` in your terminal.

If you don't have node, or if you need to upgrade, we recommend using the [Node
Version Manager (nvm)](https://github.com/nvm-sh/nvm).

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

### Speeding up builds

⚠️ This is an experimental feature 🧪🔬

Any change to the site will cause Eleventy to rebuild. This can take 10-20s. If
you want to speed things up you can isolate your directory using the `isolate`
command.

```bash
npm run isolate
```

This will move all of the markdown files for the site into the `_exile`
directory and it will ignore them for builds.

You may pass an optional glob (or space separated list of globs) to the
`isolate` command to tell it to preserve a directory.

```bash
# Example 1: Preserve the style-focus directory
# note the -- which is needed to pass options to npm scripts
npm run isolate -- src/site/content/en/accessible/style-focus/**

# Example 2: Preserve everything in the accessible directory
npm run isolate -- src/site/content/en/accessible/**/*
```

When you're finished making your edits, run the `integrate` command to restore
all of the project files.

```bash
npm run integrate
```

☝️ A git commit hook will prevent you from being able to run `git commit` until
you have run the `integrate` command.

## Environments 🌳

Set `ELEVENTY_ENV=prod` to force production builds. This is the default when
running "stage" or "deploy". No other options for `ELEVENTY_ENV` are supported,
although our Eleventy site config will default to 'dev' if unspecified.

## Staging 🕺

When you send in a pull request it will be automatically staged for you. Keep an
eye out for the netlify bot to comment on the pull request with your unique URL.

## Deploying the site 🚀

### Automatic deploys

The site will build and deploy the main branch automatically every hour,
Mon-Fri. If you've just merged an article then it should go live at the top
of the next hour.

### Manual deploys

To manually deploy the site you'll need to be a member of one of these GitHub
teams:

- @GoogleChrome/web-dev-admins
- @GoogleChrome/web-dev-content
- @GoogleChrome/web-dev-contributors
- @GoogleChrome/web-dev-eng
- @GoogleChrome/web-devrel

1. Navigate to [the Deploy workflow in the Actions panel](https://github.com/GoogleChrome/web.dev/actions?query=workflow%3ADeploy).
2. Click the **Run workflow** button. Make sure the branch says `master`, then click the green **Run workflow** button.

![An expanded workflow popup with a green run workflow button inside of it.](https://user-images.githubusercontent.com/1066253/89584965-da6eb500-d7f1-11ea-8a43-d8b1abe2cd3b.png)

## Debugging 🐛

If you need to debug the site's build process:

1. Add a `debugger` statement to `.eleventy.js`
1. Run `npm run debug:eleventy`
1. Go to `chrome://inspect` to attach to the running process.

<img
  width="295"
  alt="The Chrome inspect page showing the inspect button"
  src="https://user-images.githubusercontent.com/1066253/61085691-bf125a00-a3e5-11e9-9151-58bd8a50d404.png">
