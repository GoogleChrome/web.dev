---
layout: post
title: Using Lighthouse Bot to set a performance budget
authors:
  - mihajlija
description: |
  You've done hard work to get fast, now make sure you stay fast by automating
  performance testing in Travis CI with Lighthouse Bot.
date: 2019-01-28
tags:
  - performance
---

You've done hard work to get fast, now make sure you stay fast by automating
performance testing with [Lighthouse Bot](https://github.com/ebidel/lighthousebot).

[Lighthouse](https://developers.google.com/web/tools/lighthouse) grades your app
in 5 categories, and one of those is performance. While you could try to remember to
monitor performance changes with [DevTools](https://developers.google.com/web/tools/lighthouse/#devtools)
or [Lighthouse CLI](https://developers.google.com/web/tools/lighthouse/#cli) every
time you edit your code, you don't have to do that. Tools can do the tedious
stuff for you. [Travis CI](https://travis-ci.com/) is a great service that
automatically runs tests for your app in the cloud every time you push new code.

Lighthouse Bot integrates with Travis CI, and its performance budget feature ensures
that you won't accidentally downgrade performance without noticing. You can
[configure your repository](https://help.github.com/articles/about-required-status-checks/)
so that it won't allow merging pull-requests if the Lighthouse scores fall below
the threshold you've set (e.g. < 96/100).

<figure class="w-figure">
  {% Img src="image/admin/LIEdWOuIGubFE0JgBM5Y.png", alt="Failing Lighthouse Bot checks on GitHub", width="800", height="360", class="w-screenshot" %}
  <figcaption class="w-figcaption">Lighthouse Bot checks on GitHub.</figcaption>
</figure>

{% Aside %}
Lighthouse Bot used to be called Lighthouse CI.
{% endAside %}

Although you can test performance on localhost, your site will often perform
differently on live servers. To get a more realistic picture, it's best to
deploy your site to a staging server. You can use any hosting service; this
guide will take [Firebase hosting](https://firebase.google.com/docs/hosting/)
for a spin.

## 1. Setup

This simple app helps you sort three numbers.

[Clone the example from GitHub](https://github.com/GoogleChromeLabs/lighthouse-bot-starter),
and make sure to add it as a repository on your GitHub account.

## 2. Deploy to Firebase

To get started, you'll need a Firebase account. Once you've taken care of that,
[create a new project in the Firebase console](https://console.firebase.google.com/)
by clicking "Add project":

{% Img src="image/admin/SYTTK9CHxnTt1n7vONKU.png", alt="", width="517", height="552" %}

### Deploying to Firebase

You'll need [Firebase CLI](https://firebase.google.com/docs/cli/) to deploy the
app. Even if you already have it installed, it's good practice to frequently
update the CLI to the latest version with this command:

```bash
npm install -g firebase-tools
```

To authorize the Firebase CLI, run:

```bash
firebase login
```

Now initialize the project:

```bash
firebase init
```

The console will ask you a series of questions during setup:

- When prompted to select features, choose "Hosting."
- For the default Firebase project, select the project that you've created in
  the Firebase console.
- Type in "public" as your public directory.
- Type "N" (no) to configuring as a single-page app.

This process creates a `firebase.json` configuration file in the root of your
project directory.

Congrats, you're ready to deploy! Run:

```bash
firebase deploy
```

In a split second, you'll have a live app.

## 3. Setting up Travis

You'll need to [register an account](https://travis-ci.com) on Travis and then
activate GitHub Apps integration under the Settings section of your profile.

{% Img src="image/admin/fNGAjcYM5Rw3e43PExoD.png", alt="GitHub Apps integration on Travis CI", width="800", height="508" %}

### Once you have an account

Go to Settings under your profile, hit the Sync account button, and make sure
your project repo is listed on Travis.

{% Img src="image/admin/dnXFBpBw4WvWbXQL1DQf.png", alt="", width="160", height="54" %}

To kick-off continuous integration, you need two things:

1. To have a `.travis.yml` file in the root directory
2. To trigger a build by doing a regular old git push

The `lighthouse-bot-starter` repo already has a `.travis.yml` YAML file:

```yaml
language: node_js
node_js:
  - "8.1.3"
install:
  - npm install
before_script:
  - npm install -g firebase-tools
script:
  - webpack
```

The YAML file tells Travis to install all the dependencies and build your app.
Now it's your turn to **push the example app to your own GitHub repository**.
If you haven't already, run the following command:

```bash
git push origin main
```

Click on your repo under Settings in Travis to see your project's Travis
dashboard. If everything is cool, you'll see your build go from yellow to green
in a couple of minutes. 🎉

## 4. Automate Firebase deployment with Travis

In Step 2, you logged into your Firebase account and deployed the app from the
command line with `firebase deploy`. In order for Travis to deploy your app to
Firebase, you have to authorize it. How do you do that? With a Firebase token.
🗝️🔥

### Authorize Firebase

To generate the token run this command:

<pre class="devsite-terminal devsite-click-to-copy">firebase login:ci</pre>

It will open a new tab in a browser window so that Firebase can verify you.
After that, look back at the console, and you'll see your freshly minted token.
Copy it and go back to Travis.

In your project's Travis dashboard, go to **More options** > **Settings** > **Environment variables**.

{% Img src="image/admin/uU7MBc5NdBDZch3ZE3Zd.png", alt="", width="789", height="233", class="w-screenshot" %}

Paste the token in the value field, name the variable `FIREBASE_TOKEN`, and add it.

### Add deployment to your Travis setup

You need the following lines to tell Travis to deploy the app after every successful build.
Add them to the end of the `.travis.yml` file. 🔚

```yaml
after_success:
  - firebase deploy --token $FIREBASE_TOKEN --non-interactive
```

Push this change to GitHub and wait for your first automated deployment.
If you take a look at your Travis log, it should soon say ✔️ Deploy complete!

Now whenever you make changes to your app, they will be automatically deployed to Firebase.

## 5. Setting up Lighthouse Bot

Friendly Lighthouse Bot updates you on your app's Lighthouse scores.
It just needs an invitation to your repo.

On GitHub, go to your project's settings and **add "lighthousebot" as a collaborator** (Settings>Collaborators):

{% Img src="image/admin/H2aLCOr36UDwm5Yk1k9r.png", alt="Lighthouse bot collaborator status", width="800", height="298", class="w-screenshot" %}

Approving these requests is a manual process so they don't always happen
instantly. Before you start testing, make sure lighthousebot has approved its
collaborator status. In the meantime, you also need to add another key to your
project's environment variables on Travis. [Leave your email
here](https://docs.google.com/forms/d/e/1FAIpQLSdIc3QNIMn7bBMgl2cfxmmo6wGBlUpdLGxjB_ml464t9eCg_A/viewform),
and you'll get a Lighthouse Bot key in your inbox. 📬

On Travis, add this key as an environment variable and name it `LIGHTHOUSE_API_KEY`:

{% Img src="image/admin/0XCrRSbUg1Sdca8k9xK9.jpg", alt="", width="800", height="127", class="w-screenshot" %}

{% Aside %}
You can reuse this same key for other projects.
{% endAside %}

### Add Lighthouse Bot to your project

Next, add Lighthouse Bot to your project by running:

```bash
npm i --save-dev https://github.com/ebidel/lighthousebot
```

And add this bit to the `package.json`:

```json
"scripts": {
  "lh": "lighthousebot"
}
```

### Add Lighthouse Bot to your Travis configuration

For the final trick, test the performance of the app after every pull
request!

In `.travis.yml` add another step in after_success:

```yaml
after_success:
  - firebase deploy --token $FIREBASE_TOKEN --non-interactive
  - npm run lh -- https://staging.example.com
```

It will run a Lighthouse audit on the given URL, so replace
`https://staging.example.com` with the URL of your app
(that's your-app-123.firebaseapp.com).

Set your standards high and tweak the setup so you don't accept any changes to
the app that bring the performance score below 95:

```yaml
- npm run lh -- --perf=95 https://staging.example.com
```

### Make a pull request to trigger Lighthouse Bot test on Travis

Lighthouse Bot will only test pull requests, so if you push to the main branch
now, you'll just get "This script can only be run on Travis PR requests" in your
Travis log.

To trigger the Lighthouse Bot test:

1. Checkout a new branch
2. Push it to Github
3. Make a pull request

Hang tight on that pull request page and wait for Lighthouse Bot to sing! 🎤

{% Img src="image/admin/SmWHb70YqVfagXI3f03D.png", alt="Passing Lighthouse scores", width="586", height="329", class="w-screenshot" %}

{% Img src="image/admin/ZrPGH5OGEY5Y4e9ntUBK.png", alt="Passing Github checks", width="462", height="189", class="w-screenshot" %}

The performance score is great, the app is under budget, and the check has passed!

### More Lighthouse options

Remember how Lighthouse tests 5 different categories? You can enforce scores for
any of those with Lighthouse Bot flags:

```bash
--perf  # performance
--pwa   # progressive web app score
--a11y  # accessibility score
--bp    # best practices score
--seo   # SEO score
```

Example:

```bash
npm run lh -- --perf=93 --seo=100 https://staging.example.com
```

This will fail the PR if the performance score drops below 93 **or** the SEO
score drops below 100.

You can also choose not to get Lighthouse Bot's comments with the `--no-comment`
option.
