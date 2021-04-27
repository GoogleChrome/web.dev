---
layout: post
title: How to set up Signed HTTP Exchanges (SXG) using nginx
subhead: How to generate a TLS certificate with SXG extensions, install tools for generating SXG files, and configure nginx to serve SXG files.
authors:
  - kumagi
description: How to generate a TLS certificate with SXG extensions, install tools for generating SXG files, and configure nginx to serve SXG files.
date: 2020-03-11
tags:
  - blog
  - SXG
  - nginx
feedback:
  - api
---

[Signed HTTP Exchanges (SXG)](https://developers.google.com/web/updates/2018/11/signed-exchanges) is a new web technology that makes it easier for users to tell content creators apart from content distributors. This guide shows you how to set up SXG.

## Cross-browser support

Several Chromium-based browsers support SXG, including Google Chrome, Samsung
Internet, and Microsoft Edge. See the Consensus and Standardization section of
[Origin-Signed HTTP Exchanges](https://www.chromestatus.com/feature/5745285984681984)
for more up-to-date information.

## Prerequisites

To implement SXG on your website, you must:

- Have control over your domain, including DNS entries.
- Get certificates. SXG requires the issuance of a dedicated certificate. In particular, you cannot reuse your TLS key or certificate.
- Have an HTTP server that can generate and serve SXG over HTTPS.

## Assumptions

This guide assumes that you:

- Have an OpenSSL 1.1.1 environment. This guide was written with Ubuntu 18.04 LTS on amd64 ISA.
- Have the ability to run `sudo` to install executables.
- Use `nginx` as an HTTP server.
- Are using DigiCert to generate certificates that include SXG-related extensions, because it currently appears to be the only provider that supports these extensions.

Also, the example commands in this article assume your domain is `website.test`, so you'll need to replace `website.test` with your actual domain.

## Step 1: Get your certificate for SXG {: #step-1 }

To generate SXG, you need a TLS certificate with the `CanSignHttpExchanges` extension, as well as a particular key type.
DigiCert provides certificates with this extension.
You need a CSR file for issuance of a certificate, so generate it with the following commands:

```bash
openssl ecparam -genkey -name prime256v1 -out mySxg.key
openssl req -new -key mySxg.key -nodes -out mySxg.csr -subj "/O=Test/C=US/CN=website.test"
```

You will get a CSR file that looks like the following:

```bash
-----BEGIN CERTIFICATE REQUEST-----
MIHuMIGVAgEAMDMxDTALBgNVBAoMBFRlc3QxCzAJBgNVBAYTAlVTMRUwEwYDVQQD
DAx3ZWJzaXRlLnRlc3QwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAS7IVaeMvid
S5UO7BspzSe5eqT5Qk6X6dCggUiV/vyqQaFDjA/ALyTofgXpbCaksorPaDhdA+f9
APdHWkTbbdv1oAAwCgYIKoZIzj0EAwIDSAAwRQIhAIb7n7Kcc6Y6pU3vFr8SDNkB
kEadlVKNA24SVZ/hn3fjAiAS2tWXhYdJX6xjf2+DL/smB36MKbXg7VWy0K1tWmFi
Sg==
-----END CERTIFICATE REQUEST-----
```

Make sure that:

- The validity period does not exceed 90 days.
- The **Include the CanSignHttpExchanges extension in the certificate** checkbox is enabled,
  which is found under Additional Certificate Options.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kFWTZFXNvwkHnwRu7y8Q.png", alt="", width="718", height="133", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The <b>Include the CanSignHttpExchanges extension in the certificate</b> checkbox.
  </figcaption>
</figure>

If your certificate does not match these conditions, browsers and distributors will reject your SXG for security reasons.
This guide assumes that the filename of the certificate you got from DigiCert is `mySxg.pem`.

## Step 2: Install `libsxg`

The SXG format is complex and hard to generate without using tools.
You can use one of the following options to generate SXG:

- The [gen-signedexchange](https://github.com/WICG/webpackage/tree/master/go/signedexchange) tool written in Go.
- The [`libsxg` library](https://github.com/google/libsxg) written in C.

This guide uses `libsxg`.

### Option 1: Install `libsxg` from a Debian package

You can install the package in the usual Debian way, as long as the OpenSSL (`libssl-dev`) version matches.

```bash
sudo apt install -y libssl-dev
wget https://github.com/google/libsxg/releases/download/v0.2/libsxg0_0.2-1_amd64.deb
wget https://github.com/google/libsxg/releases/download/v0.2/libsxg-dev_0.2-1_amd64.deb
sudo dpkg -i libsxg0_0.2-1_amd64.deb
sudo dpkg -i libsxg-dev_0.2-1_amd64.deb
```

### Option 2: Build `libsxg` manually

If you are not using an environment compatible with `.deb` files, you can build `libsxg` yourself.
As a precondition, you need to install `git`, `cmake`, `openssl`, and `gcc`.

```bash
git clone https://github.com/google/libsxg
mkdir libsxg/build
cd libsxg/build
cmake .. -DRUN_TEST=false -DCMAKE_BUILD_TYPE=Release
make
sudo make install
```

## Step 3: Install `nginx` plugin
The `nginx` plugin allows you to generate SXG dynamically instead of statically generating them prior to serving.

### Option 1: Install the plugin from a Debian package {: #step-3-option-1 }

The [SXG module for `nginx`](https://github.com/kumagi/nginx-sxg-module) is distributed on GitHub.
On Debian-based systems, you can install it as a binary package:

```bash
sudo apt install -y nginx
wget https://github.com/google/nginx-sxg-module/releases/download/v0.1/libnginx-mod-http-sxg-filter_1.15.9-0ubuntu1.1_amd64.deb
sudo dpkg -i libnginx-mod-http-sxg-filter_1.15.9-0ubuntu1.1_amd64.deb
```

### Option 2: Build plugin manually {: #step-3-option-2 }

Building the `nginx` module requires the `nginx` source code.
You can get the tarball and build it along with the SXG dynamic module using the commands below:

```bash
git clone https://github.com/google/nginx-sxg-module
wget https://nginx.org/download/nginx-1.17.5.tar.gz
tar xvf nginx-1.17.5.tar.gz
cd nginx-1.17.5
./configure --prefix=/opt/nginx --add-dynamic-module=../nginx-sxg-module --without-http_rewrite_module --with-http_ssl_module
make
sudo make install
```

The `nginx` configuration has great flexibility.
Install `nginx` anywhere in your system, then specify a respective path of `module/config/log/pidfile`.
This guide assumes that you install it to `/opt/nginx`.

## Step 4: Configure the `nginx` plugin to work with SXG

### Option 1: Configure an installed-from-Debian `nginx` module
Follow these instructions if you used [Step 3, Option 1](#step-3-option-1) earlier.

Delivering SXG content requires HTTPS. You can get an SSL/TLS certificate from DigiCert, Let's Encrypt, and other services. Note that you CANNOT use an SXG certificate for SSL or vice versa, therefore you will need two certificates. The configuration file in `/etc/nginx/nginx.conf` should look similar to the following, assuming that you put the SSL key/certificate pair in `/path/to/ssl/` and the SXG key/certificate pair in `/path/to/sxg/`:

```nginx
user www-data;
include /etc/nginx/modules-enabled/*.conf;

events {
     worker_connections 768;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    add_header  X-Content-Type-Options nosniff;

    server {
        listen 443 ssl;
        ssl_certificate     /path/to/ssl/fullchain.pem;
        ssl_certificate_key /path/to/ssl/privkey.pem;
        server_name  website.test;

        sxg on;
        sxg_certificate     /path/to/sxg/mySxg.pem;
        sxg_certificate_key /path/to/sxg/mySxg.key;
        sxg_cert_url        https://website.test/certs/cert.cbor;
        sxg_validity_url    https://website.test/validity/resource.msg;
        sxg_cert_path       /certs/cert.cbor;

        root /var/www/html;
    }
}
```

* `sxg_cert_url` is essential for browsers to load SXG properly because it locates the certificate chain. The certificate chain contains certificate and OCSP stapling information with cbor format. Note that you do not have to serve the `cert.cbor` file from the same origin. You can serve it via any CDNs or other static file serving services as long as it supports HTTPS.
* `sxg_validitiy_url` is planned to serve SXG-signature-header-related information. If a page has not been modified since the last SXG, downloading the entire SXG file is not required technically. So updating signature header information alone is expected to reduce network traffic. But the details are not implemented yet.

Start `nginx` and you are ready to serve SXG!

```bash
sudo systemctl start nginx.service
curl -H"Accept: application/signed-exchange;v=b3" https://website.test/ > index.html.sxg
cat index.html.sxg
sxg1-b3...https://website.test/...(omit)
```

### Option 2: Configure a built-from-source `nginx` module

Follow these instructions if you used [Step 3, Option 2](#step-3-option-2) earlier.

Configure your `nginx` system installed under `/opt/nginx` to look similar to the following example:

```nginx
load_module "/opt/nginx/modules/ngx_http_sxg_filter_module.so";

events {
    worker_connections 768;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    add_header X-Content-Type-Options nosniff;

    server {
        listen 443 ssl;
        ssl_certificate     /path/to/ssl/fullchain.pem;
        ssl_certificate_key /path/to/ssl/privkey.pem;
        server_name  example.com;

        sxg on;
        sxg_certificate     /path/to/sxg/mySxg.pem;
        sxg_certificate_key /path/to/sxg/mySxg.key;
        sxg_cert_url        https://website.test/certs/cert.cbor;
        sxg_validity_url    https://website.test/validity/resource.msg;
        sxg_cert_path       /certs/cert.cbor;

        root /opt/nginx/html;
    }
}
```

Then start `nginx`. Now you can get your SXG!

```bash
cd /opt/nginx/sbin
sudo ./nginx
curl -H "Accept: application/signed-exchange;v=b3" https://website.test/ > index.html.sxg
less index.html.sxg
sxg1-b3...https://website.test/...(omit)
```

## Step 5: Serve your application backend

In the above examples, `nginx` serves static files in the root directory, but you can use upstream directives for your applications to make SXG for arbitrary web application backends (such as Ruby on Rails, Django, or Express) as long as your `nginx` works as a front HTTP(S) server.

```nginx
upstream app {
    server 127.0.0.1:8080;
}

server {
    location / {
        proxy_pass http://app;
    }
}
```

## Step 6: Test

Use the [dump-signedexchange tool](https://github.com/WICG/webpackage/tree/master/go/signedexchange)
to test that the SXGs being served are correct, ensure that no errors are reported, and verify that the headers
and body are as expected.

```bash
go get -u github.com/WICG/webpackage/go/signedexchange/cmd/dump-signedexchange
export PATH=$PATH:~/go/bin
dump-signedexchange -verify -uri https://website.test/ | less
```

## Send feedback

The Chromium engineers working on SXG are keen to hear your feedback at [webpackage-dev@chromium.org](mailto:webpackage-dev@chromium.org).
You can also join the [spec discussion](https://github.com/WICG/webpackage/issues), or [report a bug](https://bugs.chromium.org/p/chromium/issues/entry?status=untriaged&components=Blink%3ELoader&labels=Type-Bug,Hotlist-SignedExchange) to the team.
Your feedback will greatly help the standardization process and also help address implementation issues.
Thank you!
