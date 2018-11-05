---
title: Using Imagemin with the Command Line
author: khempenius
page_type: glitch
glitch: imagemin-cli
---

The Imagemin <a href="https://github.com/imagemin/imagemin-cli" target="_blank">CLI</a> allows you to use Imagemin from the command line to compress your images.

(Don't like the command line? There's also a desktop <a href="https://github.com/imagemin/imagemin-app" target="_blank">app</a> for OS X, Linux, and Mac.)

## Install Imagemin

- Edit the project to remix it.

- Click the **Status** button.

<web-screenshot type="status"></web-screenshot>

- Click the **Console** button. This will open a new window.

<web-screenshot type="console"></web-screenshot>

- Lastly, type this commands into the console:

<pre class="devsite-terminal devsite-click-to-copy">
npm install --save-dev imagemin-cli
</pre>

You've now installed the Imagemin CLI!

## Compress images

- Type the following command into the console:

<pre class="devsite-terminal devsite-click-to-copy">
imagemin images/* --out-dir=images
</pre>

This command compresses the images in the `/images` directory and saves them to
same directory (i.e. it overwrites the original files).

## Verify results with Lighthouse

Lighthouse's "Efficiently encode images" performance audit can let you know if the JPG images on your page are optimally compressed.

- Click on the "Show Live" button to view the live version of the your Glitch.

<web-screenshot type="show-live"></web-screenshot>

Run the Lighthouse performance audit (Lighthouse > Options > Performance) on the
live version of your Glitch and verify that the "Efficiently encode images"
audit was passed.

<img src="./lighthouse_passing.png" width="100%" alt="Passing 'Efficiently encode images' audit in Lighthouse">

Success! You have used the Imagemin CLI to compress the images on the page.

---

## Extra Credit

Want to learn more about using the Imagemin CLI? You can run

<pre class="devsite-terminal devsite-click-to-copy">
imagemin --help
</pre>

to see other ways of using the CLI.
