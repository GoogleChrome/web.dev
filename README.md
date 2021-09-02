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

### Set up build flags

Building the entire site can take a while because it's around one thousand pages.
If you want to _massively_ speed up your build times, we suggest setting some
build flags to ignore certain sections.

- Create a `.env` file at the root of your project
- Add the following:

```text
# Ignore ALL site content
ELEVENTY_IGNORE=true

# Only build the directories you're working on.
# Note, this is a JSON string so you must use double quotes.
ELEVENTY_INCLUDE=["blog", "vitals"]
```

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

To manually deploy the site you'll need to be a member of one of these Google teams:

- web.dev-eng
- web.dev-owners

1. Navigate to [the Cloud Build Triggers page](https://console.cloud.google.com/cloud-build/triggers?project=web-dev-production-1).
2. Click the **RUN** button for the trigger named **Deploy**.
3. In the side drawer that opens up, click the **RUN TRIGGER** button for the trigger for the **main** branch.

*NOTE: web.dev auto deploys every hour if there is a new commit in the `main` branch. Manual deploys should only occur when a build fails or if auto deploys are disabled.*

## Debugging 🐛

If you need to debug the site's build process:

1. Add a `debugger` statement to `.eleventy.js`
1. Run `npm run debug:eleventy`
1. Go to `about://inspect` to attach to the running process.

<img
  width="295"
  alt="The Chrome inspect page showing the inspect button"
  src="https://user-images.githubusercontent.com/1066253/61085691-bf125a00-a3e5-11e9-9151-58bd8a50d404.png">
