---
layout: codelab
title: Use Cloudinary to optimize images and serve next-gen formats
authors:
  - ahmadawais
date: 2019-06-24
description: |
  In this codelab, learn how to use Cloudinary with its URL API to optimize JPEG and
  PNG images for faster download and serve next-gen formats.
glitch: codelab-cloudinary
path: index.html:25:0
related_post: use-imagemin-to-compress-images
---

In this codelab, learn how to use a simple URL API to optimize images for faster downloads and serve media in next-gen formats. All of that happens dynamically in the cloud without any build step.

## Get a Cloudinary account

Click [here](https://cloudinary.com/users/register/free) to sign up for a free Cloudinary account. Remember to set a custom cloud name (at the end of the registration form). Your cloud name is used to build the URL that your images will be publicly available from.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="./cloudname.webm" type="video/webm; codecs=vp8">
    <source src="./cloudname.mp4" type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption">
    Setting a custom Cloud Name.
  </figcaption>
</figure>

## The Cloudinary Fetch URL

This codelab demonstrates how you can use the power of a cloud to optimize your images and serve next-gen formats dynamically. You will learn how to use dynamic cloud Fetch and Image Transformations features. You will replace the image links with Fetch URLs (explained below) that will automagically upload, transform, and optimize your images.

For example:

```html/1/0
<img src="https://codelab-cloudinary.glitch.me/images/flower1.png"/>
<img src="https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/https://codelab-cloudinary.glitch.me/images/flower1.png"/>
```

{% Aside 'key-term' %}
  The [Cloudinary Fetch URL](https://cloudinary.com/documentation/fetch_remote_images) feature is a quick way to deliver images from remote URLs. The image can be manipulated and optimized on-the-fly, before being cached and delivered through fast, localized CDNs and not via local web servers. It requires no build step and no manual upload.
{% endAside %}

## Optimize an image

- Click the **Remix to Edit** button (in the top-right corner) to make the project editable.
- In the next few steps, you will replace the image link on Line #25 of `index.html` file, with a fetch URL.

### Create a Fetch URL

To create a fetch URL, you have to prepend the following prefix to the existing URL of the image.

An example fetch URL looks like this:

```html
https://res.cloudinary.com/<cloud_name>/image/fetch/<transformations>/<remote_image_url>

```

There are three dynamic parts in this fetch URL which are explained below.

1. `<cloud_name>`
2. `<transformations>`
3. `<remote_image_url>`

### #1. Replace `<cloud_name>`

Replace `<cloud_name>` with your Cloudinary [cloud name](https://cloudinary.com/documentation/solution_overview?query=cloud%20name&c_query=Account%20and%20API%20setup%20%E2%80%BA%20Identifiers%20%E2%80%BA%20Cloud%20name#cloud_name). For example, we are going to use the `demo` cloud name here.

`https://res.cloudinary.com/`demo`/image/fetch/<transformations>/<remote_image_url>`

```html/1/0
https://res.cloudinary.com/<cloud_name>/image/fetch/<transformations>/<remote_image_url>
https://res.cloudinary.com/demo/image/fetch/<transformations>/<remote_image_url>
```

### #2. Replace `<transformations>`

Replace `<transformations>` with relevant [Image Transformations](https://cloudinary.com/documentation/image_transformations). Use comma-separated values to optimize the image quality and format delivery by using `q_auto,f_auto`.

```html/1/0
https://res.cloudinary.com/demo/image/fetch/<transformations>/<remote_image_url>
https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/<remote_image_url>
```

While there are many [Image transformations](https://cloudinary.com/documentation/image_transformations) available, for the sake of this Codelab, we are only going to use two of them.

1. [**Quality**](https://cloudinary.com/documentation/image_transformation_reference#quality_parameter): The parameter `q` controls the quality of the image delivered by the cloud. You can set `q_1` to `q_100` 1 is the lowest quality, and 100 is the highest. Use `q_auto` to calculate the optimal quality of an image automatically.
2. [**Format**](https://cloudinary.com/documentation/image_transformation_reference#format_parameter): The parameter `f` can automatically convert delivered images to WebP and JPEG-XR on supported browsers to save bandwidth and optimize delivery time. Again use `f_auto` to auto format the image.

### #3. Replace `<remote_image_url>`

Now replace the `<remote_image_url>` with the original link of the first image. The final URL looks like this:

```html/1/0
https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/<remote_image_url>
https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/https://codelab-cloudinary.glitch.me/images/flower1.png
```

### Final image URL

The final image URL after replacing `<cloud_name>`, `<transformations>`, and `<remote_image_url>` looks like this:

```html
https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/https://codelab-cloudinary.glitch.me/images/flower1.png

```

Which means that you can auto-optimize any image by prepending the following to its URL.

```html
https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/
```

### Results

After updating the `src` attribute of the first image (line #25) with the fetch URL, your HTML should look like this:

```html/2/1
<div class="wrapper">
  <img src="https://codelab-cloudinary.glitch.me/images/flower1.png"/>
  <img src="https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/https://codelab-cloudinary.glitch.me/images/flower1.png"/>
  <div class="price">Violet bouquet- $9</div>
</div>
```

This helps save more than 90% on image size.

<div class="w-table-wrapper">
  <table>
    <tbody>
      <thead>
        <tr>
          <th>
            <p>
              <a
                href="https://codelab-cloudinary.glitch.me/images/flower1.png"
                target="_blank"
                rel="noopener noreferrer"
                ><img src="https://codelab-cloudinary.glitch.me/images/flower1.png" width="100%"
              /></a>
            </p>
            <strong>289 KB</strong> (Original)
          </th>
          <th>
            <p>
              <a
                href="https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/https://codelab-cloudinary.glitch.me/images/flower1.png"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto,a_ignore/https://codelab-cloudinary.glitch.me/images/flower1.png"
                  width="100%"
                />
              </a>
            </p>
            <strong>22 KB</strong> (Cloudinary)
          </th>
        </tr>
      </thead>
    </tbody>
  </table>
</div>

The photo on the right is 92.39% smaller than the one on the left, yet would probably look identical to the average user.

{% Aside 'objective' %}
  Now prepend all image links in the `index.html` with `https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/`. Make sure to change `demo` to your `cloud_name`.
{% endAside %}

## ✔︎ Check-in

Your `index.html` file should now look like this:

```html/(1,1,5,9,13,17,21)
<div class="wrapper">
  <img src="https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/https://codelab-cloudinary.glitch.me/images/flower1.png" alt="Yellow bouquet" />
  <div class="price">Yellow bouquet - $9</div>
</div>
<div class="wrapper">
  <img src="https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/https://codelab-cloudinary.glitch.me/images/flower2.jpg" alt="Cream bouquet" />
  <div class="price">Cream bouquet - $5</div>
</div>
<div class="wrapper">
  <img src="https://res.cloudinary.com/demo/image/fetch/q_auto,f_auto/https://codelab-cloudinary.glitch.me/images/flower3.png" alt="Light pink" />
  <div class="price">Light pink bouquet - $6</div>
</div>
```

## Image Performance Gains

There are impressive web performance gains by using <a href="https://cloudinary.com/documentation/image_optimization">cloud to optimize images</a> without losing quality.

<div class="w-table-wrapper">
  <table>
    <caption>
      Table 1 — The before/after Image sizes comparison.
    </caption>
    <tbody>
      <tr>
        <th>IMAGE</th>
        <th>ORIGINAL</th>
        <th>CLOUDINARY</th>
        <th>SIZE</th>
      </tr>
      <tr>
        <td>flower1.png</td>
        <td>289 KB</td>
        <td>22 KB</td>
        <td>↓ -92.39%</td>
      </tr>
      <tr>
        <td>flower2.jpg</td>
        <td>59 KB</td>
        <td>19 KB</td>
        <td>↓ -67.8%</td>
      </tr>
      <tr>
        <td>flower3.png</td>
        <td>367 KB</td>
        <td>38 KB</td>
        <td>↓ -89.65%</td>
      </tr>
    </tbody>
  </table>
</div>

Hooray! These results are much better.

## Lighthouse Audit

Lastly, it's a good idea to use <a target="_blank" rel="noopener noreferrer" href="https://web.dev/discover-performance-opportunities-with-lighthouse">Lighthouse</a> to verify the changes that you just made.

Lighthouse's "Efficiently encode images" performance audit can let you know if
the JPEG images on your page are optimally compressed.

- To preview the site press the **Share** button (in the right-bottom corner) and copy the **Live App** link.
- Run the Lighthouse performance audit (Lighthouse ❯ Options ❯ Performance) on
  the live version of your Glitch and verify that the "Efficiently encode
  images" as well as "Serve images in next-gen formats" audits were passed.

### Results

Lighthouse audit results for when images are optimized.

<figure class="w-figure">
  <img class="w-screenshot" src="./optimized-images.png" alt="Images Not Optimized">
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    Fig. 2 — Optimized Images.
  </figcaption>
</figure>

If you've optimized your images correctly the Lighthouse audit should have a perfect score. As you can see the page load time is down by 4.05 secs. That is impressive.

_Lighthouse audit results when images are not optimized._

<figure class="w-figure">
  <img class="w-screenshot" src="./images-not-optimized.png" alt="Images Not Optimized">
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    Fig. 3 — Images Not Optimized.
  </figcaption>
</figure>

{% Aside 'success' %}
  You have used Cloudinary to compress the images optimally, and your page is serving next-gen image formats.
{% endAside %}

### Further Reading

- [Image transformations](https://cloudinary.com/documentation/image_transformations)
- [Digital media management guides](https://cloudinary.com/documentation/cloudinary_guides)
- [Quality optimization interactive demo](https://demo.cloudinary.com/?mode=qa)
- [Compress images without losing quality](https://cloudinary.com/blog/the_holy_grail_of_image_optimization_or_balancing_visual_quality_and_file_size)
