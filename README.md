# web.dev [Archived]

**Note:** This site got migrated to a new platform and this repository is available in a read-only mode. **We will not be merging new pull requests**. Please raise content issues in the new [issue tracker](https://issuetracker.google.com/issues/new?component=1400680&pli=1&template=1857359).

web.dev is the ultimate resource for developers of all backgrounds to learn,
create, and solve on the web. It's meant to not only educate developers, but
help them apply what they've learned to any site they work on, be it personal or
business.

-----
# [Archived README]

## Building the site 🏗

You'll need a recent version of [Node](https://nodejs.org/): v14 (LTS) or higher.
To check your node version run `node -v` in your terminal.

If you don't have node, or if you need to upgrade, we recommend using the [Node
Version Manager (nvm)](https://github.com/nvm-sh/nvm).

### Clone the repo

```bash
git clone https://github.com/GoogleChrome/web.dev.git
```

### Change directory into the folder created

```bash
cd web.dev
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

The production build currently requires a _lot_ of memory, to the point where
`node` might exit with errors along the line of

```sh
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory

v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [node]
```

The exact amount of heap space required varies from computer to computer and version
of `node`. If you need a local production build, but run out of memory, you can
increase the heap size by adding `--node-options '--max_old_space_size=8192'` (to
[assign 8gb of heap space](https://stackoverflow.com/questions/48387040/how-do-i-determine-the-correct-max-old-space-size-for-node-js/48392705#48392705))
to the [`npm` command](https://docs.npmjs.com/cli/v8/using-npm/config#node-options),
prior to `run`. For instance:

```sh
ELEVENTY_ENV=prod npm --node-options '--max_old_space_size=8192' run build
```

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
