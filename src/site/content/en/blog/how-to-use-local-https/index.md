---
title: How to use HTTPS for local development
subhead: Sometimes, you need to run your local development site with HTTPS. Tools and tips to do this safely and quickly.
authors:
  - maudn
date: 2021-01-25
hero: image/admin/ZvW6VM0GEScldWHBvXJ4.jpg
thumbnail: image/admin/OG8YksgOnzGfnurzncWO.jpg
tags:
  - blog
  - security
---

{% Banner 'caution', 'body' %}
Most of the time, `http://localhost` does what you need: in browsers, it mostly behaves like HTTPS 🔒. That's why some APIs that won't work on a deployed HTTP site, will work on `http://localhost`.

What this means is that you need to use HTTPS locally **only in special cases** (see [When to use HTTPS for local development](/when-to-use-local-https)), like custom hostnames or Secure cookies across browsers. Keep reading if that's you!
{% endBanner %}

_In this post, statements about `localhost` are valid for `127.0.0.1` and `[::1]` as well, since they both describe the local computer address, also called "loopback address". Also, to keep things simple, the port number isn't specified._
_So when you see `http://localhost`, read it as `http://localhost:{PORT}` or `http://127.0.0.1:{PORT}`._

If your production website uses HTTPS, you want your local development site to behave **like an
HTTPS site** (if your production website doesn't use HTTPS, [make it a priority to switch to HTTPS](/why-https-matters/)).
Most of the time, you can trust `http://localhost` to behave **like an HTTPS site**. But [in some
cases](/when-to-use-local-https), you need to run your site locally with HTTPS. Let's take a look
at how to do this.

**⏩ Are you looking for quick instructions, or have you been here before?
Skip to the [Cheatsheet](#using-mkcert:-cheatsheet).**

## Running your site locally with HTTPS using mkcert (recommended)

To use HTTPS with your local development site and access `https://localhost` or
`https://mysite.example` (custom hostname), you need a [TLS
certificate](https://en.wikipedia.org/wiki/Public_key_certificate#TLS/SSL_server_certificate). But
browsers won't consider just any certificate valid: your certificate needs to be **signed** by an entity that
is trusted by your browser, called a trusted **[certificate authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority)**.

What you need to do is to create a certificate and sign it with a CA that is **trusted locally** by your device
and browser. [mkcert](https://github.com/FiloSottile/mkcert) is a tool that helps you do this in a few commands. Here's how it works:

- If you open your locally running site in your browser using HTTPS, your browser will
  check the certificate of your local development server.
- Upon seeing that the certificate has been signed by the mkcert-generated certificate
  authority, the browser checks whether it's registered as a trusted certificate authority.
- mkcert is listed as a trusted authority, so your browser trusts the
  certificate and creates an HTTPS connection.

<figure class="w-figure">
  {% Img src="image/admin/3kdjci7NORnOw54fMia9.jpg", alt="A diagram of how mkcert works.", width="800", height="787" %}
  <figcaption class="w-figcaption">A diagram of how mkcert works.</figcaption>
</figure>

mkcert (and similar tools) provide several benefits:

- mkcert is specialized in creating certificates that are **compliant with what browsers consider
  valid certificates**. It stays updated to match requirements and best practices. This is why you
  won't have to run mkcert commands with complex configurations or arguments to generate the right
  certificates!
- mkcert is a cross-platform tool. Anyone on your team can use it.

mkcert is the tool we recommend for creating a TLS certificate for local development. You can check out [other options](#running-your-site-locally-with-https:-other-options) too.

Many operating systems may include libraries to produce certificates, such as [openssl](https://www.openssl.org/). Unlike mkcert
and similar tools, such libraries may not consistently produce correct certificates, may require
complex commands to be run, and are not necessarily cross-platform.

{% Aside 'gotchas' %}
The mkcert we're interested in in this post is [this one](https://github.com/FiloSottile/mkcert), not [this one](https://www.npmjs.com/package/mkcert).
{% endAside %}

### Caution

{% Banner 'caution', 'body' %}

- Never export or share the file `rootCA-key.pem` mkcert creates automatically when you run `mkcert -install`. **An attacker getting hold of this file can create on-path attacks for any site you may be visiting**. They could intercept secure requests from your machine to any site—your bank, healthcare provider, or social networks. If you need to know where `rootCA-key.pem` is located to make sure it's safe, run `mkcert -CAROOT`.
- Only use mkcert for **development purposes**—and by extension, never ask end-users to run mkcert commands.
- Development teams: all members of your team should install and run mkcert **separately** (not store and share the CA and certificate).

{% endBanner %}

### Setup

1.  Install mkcert (only once).

    Follow the [instructions](https://github.com/FiloSottile/mkcert#installation) for installing mkcert on your operating system.
    For example, on macOS:

    ```bash
    brew install mkcert
    brew install nss # if you use Firefox
    ```

1.  Add mkcert to your local root CAs.

    In your terminal, run the following command:

    ```bash
    mkcert -install
    ```

    This generates a local certificate authority (CA).
    Your mkcert-generated local CA is only trusted **locally**, on your device.

1.  Generate a certificate for your site, signed by mkcert.

    In your terminal, navigate to your site's root directory or whichever directory you'd like the certificates to be located at.

    Then, run:

    ```bash
    mkcert localhost
    ```

    If you're using a custom hostname like `mysite.example`, run:

    ```bash
    mkcert mysite.example
    ```

    The command above does two things:

    - Generates a certificate for the hostname you've specified
    - Lets mkcert (that you've added as a local CA in Step 2) sign this certificate.

    Now, your certificate is ready and signed by a certificate authority your browser trusts locally. You're almost done, but your server doesn't know about your certificate yet!

1.  Configure your server.

    You now need to tell your server to use HTTPS (since development servers tend to use HTTP by default) and to use the TLS certificate you've just created.

    How to do this exactly depends on your server. A few examples:

    **👩🏻‍💻 With node:**

    `server.js` (replace `{PATH/TO/CERTIFICATE...}` and `{PORT}`):

    ```javascript
    const https = require('https');
    const fs = require('fs');
    const options = {
      key: fs.readFileSync('{PATH/TO/CERTIFICATE-KEY-FILENAME}.pem'),
      cert: fs.readFileSync('{PATH/TO/CERTIFICATE-FILENAME}.pem'),
    };
    https
      .createServer(options, function (req, res) {
        // server code
      })
      .listen({PORT});
    ```

    **👩🏻‍💻 With [http-server](https://www.npmjs.com/package/http-server):**

    Start your server as follows (replace `{PATH/TO/CERTIFICATE...}`):

    ```bash
    http-server -S -C {PATH/TO/CERTIFICATE-FILENAME}.pem -K {PATH/TO/CERTIFICATE-KEY-FILENAME}.pem
    ```

    `-S` runs your server with HTTPS, while `-C` sets the certificate and `-K` sets the key.

    **👩🏻‍💻 With a React development server:**

    Edit your `package.json` as follows, and replace `{PATH/TO/CERTIFICATE...}`:

    ```json
    "scripts": {
    "start": "HTTPS=true SSL_CRT_FILE={PATH/TO/CERTIFICATE-FILENAME}.pem SSL_KEY_FILE={PATH/TO/CERTIFICATE-KEY-FILENAME}.pem react-scripts start"
    ```

    For example, if you've created a certificate for `localhost` that is located in your site's root directory as follows:

    ```text
    |-- my-react-app
        |-- package.json
        |-- localhost.pem
        |-- localhost-key.pem
        |--...
    ```

    Then your `start` script should look like this:

    ```json
    "scripts": {
        "start": "HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem react-scripts start"
    ```

    **👩🏻‍💻 Other examples:**

    - [Angular development server](https://angular.io/cli/serve)
    - [Python](https://blog.anvileight.com/posts/simple-python-http-server/)

1.  ✨ You're done!
    Open `https://localhost` or `https://mysite.example` in your browser: you're running your site locally with HTTPS.
    You won't see any browser warnings, because your browser trusts mkcert as a local certificate authority.

{% Aside %}
Your server may use a different port for HTTPS.
{% endAside %}

### Using mkcert: cheatsheet

{% Details %}
{% DetailsSummary %}
mkcert in short
{% endDetailsSummary %}

To run your local development site with HTTPS:

1.  Set up mkcert.

    If you haven't yet, install mkcert, for example on macOS:

    ```bash
    brew install mkcert

    ```

    Check [install mkcert](https://github.com/FiloSottile/mkcert#installation) for Windows and Linux instructions.

    Then, create a local certificate authority:

    ```bash
    mkcert -install
    ```

2.  Create a trusted certificate.

    ```bash
    mkcert {YOUR HOSTNAME e.g. localhost or mysite.example}
    ```

    This create a valid certificate (that will be signed by `mkcert` automatically).

3.  Configure your development server to use HTTPS and the certificate you've created in Step 2.
4.  ✨ You're done! You can now access `https://{YOUR HOSTNAME}` in your browser, without warnings

{% Banner 'caution', 'body' %}

Do this only for **development purposes** and **never export or share** the file `rootCA-key.pem` (if you need to know where this file is located to make sure it's safe, run `mkcert -CAROOT`).

{% endBanner %}

{% endDetails %}

## Running your site locally with HTTPS: other options

### Self-signed certificate

You may also decide to not use a local certificate authority like mkcert, and instead **sign your certificate yourself**.

Beware of a few pitfalls with this approach:

- Browsers don't trust you as a certificate authority and they'll show warnings you'll need to bypass manually. In Chrome, you may use the flag `#allow-insecure-localhost` to bypass this warning automatically on `localhost`. It feels a bit hacky, because it is.
- This is unsafe if you're working in an insecure network.
- Self-signed certificates won't behave in exactly the same way as trusted certificates.
- It's not necessarily easier or faster than using a local CA like mkcert.
- If you're not using this technique in a browser context, you may need to disable certificate verification for your server. Omitting to re-enable it in production would be dangerous.

<figure class="w-figure">
  {% Img src="image/admin/KxLz7mcUudiFwWBIdhH8.jpg", alt="Screenshots of the warnings browsers show when a self-signed certificate is used.", width="800", height="598" %}
  <figcaption class="w-figcaption">The warnings browsers show when a self-signed certificate is used.</figcaption>
</figure>

{% Aside %}
If you don't specify any certificate, [React's](https://create-react-app.dev/docs/using-https-in-development/) and [Vue's](https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-serve) development server HTTPS options create a self-signed certificate under the hood. This is quick, but you'll get browser warnings and encounter other pitfalls related to self-signed certificates that are listed above. Luckily you can use frontend frameworks' built-in HTTPS option **and** specify a locally trusted certificate created via mkcert or similar. See how to do this in the [mkcert with React example](/#setup:~:text=a%20React%20development%20server).
{% endAside %}

{% Details %}
{% DetailsSummary %}
Why don't browsers trust self-signed certificates?
{% endDetailsSummary %}

If you open your locally running site in your browser using HTTPS, your browser will check the certificate of your local development server. When it sees that the certificate has been signed by yourself, it checks whether you're registered as a trusted certificate authority. Because you're not, your browser can't trust the certificate; it displays a warning telling you that your connection is not secure. You may proceed at your own risk—if you do, an HTTPS connection will be created.

<figure class="w-figure">
  {% Img src="image/admin/V2SAcIzuofqzUuestOOX.jpg", alt="Why browsers don't trust self-signed certificates: a diagram.", width="800", height="833" %}
  <figcaption class="w-figcaption">Why browsers don't trust self-signed certificates.</figcaption>
</figure>

{% endDetails %}

### Certificate signed by a regular certificate authority

You may also find techniques based on having an actual certificate authority—not a local one—sign your certificate.

A few things to keep in mind if you're considering using these techniques:

- You'll have more setup work to do than when using a local CA technique like mkcert.
- You need to use a domain name that you control and that is valid. This means that you **can't** use actual certificate authorities for:
  - `localhost` and other domain names that are [reserved](https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml), such as `example` or `test`.
  - Any domain name that you don't control.
  - Top-level domains that are not valid. See the [list of valid top-level domains](https://www.iana.org/domains/root/db).

### Reverse proxy

Another option to access a locally running site with HTTPS is to use a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) such as [ngrok](https://ngrok.com/).

A few points to consider:

- Anyone can access your local development site once you share with them a URL created with a reverse proxy. This can be very handy when demoing your project to clients! Or this can be a downside, if your project is sensitive.
- You may need to consider pricing.
- New [security measures](/cors-rfc1918-feedback/) in browsers may affect the way these tools work.

### Flag (not recommended)

If you're using a custom hostname like `mysite.example`, you can use a flag in Chrome to forcefully consider `mysite.example` secure. **Avoid doing this**, because:

- You would need to be 100% sure that `mysite.example` always resolves to a local address, otherwise you could leak production credentials.
- You won't be able to debug across browsers with this trick 🙀.

_With many thanks for contributions and feedback to all reviewers and contributors—especially Ryan Sleevi,
Filippo Valsorda, Milica Mihajlija and Rowan Merewood. 🙌_

_Hero image background by [@anandu](https://unsplash.com/@anandu) on [Unsplash](https://unsplash.com/photos/pbxwxwfI0B4), edited._
