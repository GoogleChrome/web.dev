---
title: Creating WebP Images with the Command Line
author: khempenius
page_type: glitch
glitch: webp-cli
---

# Creating WebP Images with the Command Line

The webp <a href="https://developers.google.com/speed/webp/docs/precompiled" target="_blank">command line tool</a> has already been installed for you, so you're all set to get started. This tool converts JPG, PNG, and TIFF images to WebP.

## 1. Convert images to WebP

---
1.  Click the "Logs" button.
<img src="./assets/logs_button.png" alt="The 'Logs' button in Glitch">

1.  Then click the "Console" button.
<img src="./assets/console_button.png" alt="The 'Console' button in Glitch">

1. Type the following command:

```shell
cwebp -q 50 images/flower1.jpg -o images/flower1.webp
```

This command converts, at a quality of '50' ('0' is the worst; '100' is the best), the `images/flower1.jpg` file and saves it as `images/flower1.webp`.

(Are you wondering why you type "`cwebp`" instead of "`webp`"? WebP has two separate commands for encoding and decoding WebP images. "`cwebp`" encodes images to WebP, while "`dwebp`" decodes images from WebP.)

After doing this, you should see something like this in the console:

```shell
Saving file 'images/flower1.webp'
File:      images/flower1.jpg
Dimension: 504 x 378
Output:    29538 bytes Y-U-V-All-PSNR 34.57 36.57 36.12   35.09 dB
           (1.24 bpp)
block count:  intra4:        750  (97.66%)
              intra16:        18  (2.34%)
              skipped:         0  (0.00%)
bytes used:  header:            116  (0.4%)
             mode-partition:   4014  (13.6%)
 Residuals bytes  |segment 1|segment 2|segment 3|segment 4|  total
    macroblocks:  |      22%|      26%|      36%|      17%|     768
      quantizer:  |      52 |      42 |      33 |      24 |
   filter level:  |      16 |       9 |       6 |      26 |
```

You've just successfully converted the image to WebP :)

However, running the `cwebp` command one image at a time like this would take a long time if you needed to convert many images. If you need to do this, you can use a script instead.

1.  Run this script in the console (don't forget the backticks):

```shell
`for file in images/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`
```

This script converts, at a quality of '50', all the files in the `images/` directory, and saves them as a new file (same filename, but with a '.webp' file extension) in the same directory.

## ✔︎ Check-in

You should now have 6 files in your `images/` directory:

```shell
flower1.jpg
flower1.webp
flower2.jpg
flower2.webp
flower3.png
flower3.webp
```

Next, update this site to serve WebP images to browsers that support it.

## Add WebP images using the `<picture>` tag

The `<picture>` tag allows you to serve WebP to newer browsers while maintaining support for older browsers.

## 2. Replace `<img>` tags with `<picture>` tags

---
1.  In `index.html` replace `<img src="images/flower1.jpg"/>` with the following HTML:

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
```

Here's a breakdown of all of what is going on here:

The `<picture>` tag provides a wrapper for multiple image sources. The browser uses the first listed source that is in a format that it supports. This is why you should list the image that is in the "preferred" image format (in this case that is WebP) first. If the browser does not support any of the formats listed in the `<source>` tags, it fallbacks to loading the image specified by the `<img>` tag.

In the code above, a browser loads the WebP version of the image unless it does not support WebP. If the browser does not support WebP, it loads the JPEG version instead.

But what about browsers that do not support the `<picture>` tag?

If a browser does not support the `<picture>` tag, it ignores the tags it does not support. Thus, it only "sees" the `<img src="images/flower1.jpg">` tag and it loads that image.  

Note: The `<img>` tag should always be included and it should always come after all `<source>` tags.

(You may be wondering why the `type` of `flower.jpg` is `image/jpeg` and not `image/jpg`. `image/jpeg` is the MIME type corresponding to the `.jpg` file extension. An image's MIME type and its file extension are often similar, but they aren't necessarily the same thing. View a list of MIME types <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types" target="_blank">here</a>.)

1. You already replaced the `<img>` tag for `flower1.jpg`. Next, replace the `<img>` tags for `flower2.jpg` and `flower3.png` with `<picture>` tags:

## ✔︎ Check-in

Once completed, the `<picture>` tags in `index.html` should look like this:

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower2.webp">
  <source type="image/jpeg" srcset="images/flower2.jpg">
  <img src="images/flower2.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower3.webp">
  <source type="image/png" srcset="images/flower3.png">
  <img src="images/flower3.png">
</picture>
```

Next, use Lighthouse to verify you've correctly implemented WebP images on the site.

# Verify WebP usage with Lighthouse

Lighthouse's "Serve images in next-gen formats" performance audit can let you know if all the images on your site are using next-gen formats like WebP.

Click on the "Show Live" button to view the live version of the your Glitch.

<img src="./assets/show-live.png" width="140" alt="The show live button">

Run the Lighthouse performance audit (Lighthouse > Options > Performance) on the live version of your Glitch and verify that the "Serve images in next-gen formats" audit was passed.

<img src="./assets/lighthouse_passing.png" width="100%" alt="Passing 'Serve images in next-gen formats' audit in Lighthouse">

Success! You are now serving WebP images on your site.
