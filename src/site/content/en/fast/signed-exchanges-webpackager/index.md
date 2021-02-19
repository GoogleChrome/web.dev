---
layout: post
title: How to set up Signed Exchanges using Web Packager
subhead: |
  Learn how to serve signed exchanges (SXGs) using Web Packager.
authors:
  - katiehempenius
date: 2020-02-19
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/f7TRFlVQv5w58A2Cbpg7.jpg
alt: Abstract photo
description: |
  Learn how to serve signed exchanges (SXGs) using Web Packager.
tags:
  - blog
  - performance
---

A [signed exchange (SXG)](/signed-exchanges) is a delivery mechanism that makes it 
possible to authenticate the origin of a resource independently of how it was delivered. 
The following instructions explain how to set up Signed Exchanges using
[Web Packager](https://github.com/google/webpackager). Instructions are included for 
both self-signed and `CanSignHttpExchanges` certificates.


## Serve SXGs using a self-signed certificate

Using a self-signed certificate to serve SXGs is primarily used for
demonstration and testing purposes. SXGs signed with a self-signed certificate
will generate error messages in the browser when used outside of testing
environments and should not be served to crawlers.

### Prerequisites

To follow these instructions you will need to have
[openssl](https://github.com/openssl/openssl#build-and-install) and
[Go](https://golang.org/doc/install) installed in your development environment.
You will also need an existing HTTPS site.


### Architecture

These instructions use the following architecture to serve SXGs:

{% Img 
  src="image/j2RDdG43oidUy6AL6LovThjeX9c2/cyV0pNmlTB4PTCc5YQe3.png",
  alt="Signed Exchanges are loaded from a Web Packager instance running 
  on localhost:8080",
  width="800",
  height="436"
%}


Following these instructions verbatim will setup a `webpackager` instance that
packages and serves content from `example.com` as a SXG. To generate SXGs for a
different site, replace the mentions of `example.com` in these instructions with
the site of your choice. In production environments you will only be able to
generate SXGs for sites that you own.


### Generate a self-signed certificate

This section explains how to generate a self-signed certificate that can be
used with signed exchanges.

#### Instructions

1. Generate a private key.

    ```shell
    openssl ecparam -out priv.key -name prime256v1 -genkey
    ```

    The private key will be saved as a file named `priv.key`.

2. Create a [certificate signing
   request](https://en.wikipedia.org/wiki/Certificate_signing_request) (CSR).

    ```shell
    openssl req -new -sha256 -key priv.key -out cert.csr -subj '/O=Web Packager Demo /CN=example.com'
    ```

    A certificate signing request is a block of encoded text that conveys the
    information necessary to request a certificate from a [certificate authority(CA)](https://en.wikipedia.org/wiki/Certificate_authority). Although you will not be requesting a certificate from a
    CA, it is still necessary to create a certificate signing request.

    The command above creates a certificate signing request for an organization
    named `Web Packager Demo` that has the [common
    name](https://knowledge.digicert.com/solution/SO7239.html) `example.com`. The
    common name should be the fully qualified domain name of the site that contains
    the content that you want to package as SXG.

    In a production SXG setup, this would be a site that you own. However, in a
    testing environment like the one described in these instructions, it can be any
    site.

3. Create a certificate that has the `CanSignHttpExchanges` extension.

    ```shell
    openssl x509 -req -days 90 -in cert.csr -signkey priv.key -out cert.pem -extfile &lt;(echo -e "1.3.6.1.4.1.11129.2.1.22 = ASN1:NULL\nsubjectAltName=DNS:example.com")
    ```

    This command uses the private key and the CSR created in steps 1 and 2 to create the
    certificate file `cert.pem`. The `-extfile` flag associates the certificate with
    the `CanSignHttpExchanges` certificate extension (`1.3.6.1.4.1.11129.2.1.22` is
    the [object
    identifier](https://access.redhat.com/documentation/en-us/red_hat_certificate_system/9/html/administration_guide/standard_x.509_v3_certificate_extensions)
    for the `CanSignHttpExchanges` extension). In addition, the `-extfile` flag also
    defines `example.com` as a [Subject Alternative
    Name](https://en.wikipedia.org/wiki/Subject_Alternative_Name). 

    If you are curious about the contents of `cert.pem`, you can view them using the
    following command:

    ```shell
    openssl x509 -in cert.pem -noout -text
    ```

    You are done creating private keys and certificates. You will need the
    `priv.key` and `cert.pem` files in the next section.


### Setup the Web Packager server for testing


#### Prerequisites



1. Install [Web Packager](https://github.com/google/webpackager).

    ```shell
    git clone https://github.com/google/webpackager.git
    ```



2. Build `webpkgserver`.

    ```shell
    cd webpackager/cmd/webpkgserver
    go build .
    ```

    `webpkgserver` is a specific binary within the Web Packager project.



3. Verify that `webpkgserver` has been installed correctly.

    ```shell
    webpkgserver --help
    ```

    This command should return information about the usage of `webpkgserver`. If
    this does not work, a good first troubleshooting step is to verify that your
    [GOPATH](https://golang.org/doc/gopath_code.html#GOPATH) is configured
    correctly.


#### Instructions



1. Navigate to the `webpackager` directory (you might already be in this
   directory).

    ```shell
    cd /path/to/cmd/webpkgserver
    ```



2. Create a `webpkgsever.toml` file by copying the example.

    ```shell
    cp ./webpkgserver.example.toml ./webpkgserver.toml
    ```

    This file contains the configuration options for `webpkgserver`.



3. Open `webpkgserver.toml` with an editor of your choice and make the following
   changes:
    *   Change the line `#AllowTestCert = false` to `AllowTestCert = true`.
    *   Change the line `PEMFile = 'path/to/your.pem'` to reflect the path to the
        PEM certificate, `cert.pem`, that you created. Do not change the line
        mentioning `TLS.PEMFile`—this is a different configuration option.
    *   Change the line `KeyFile = 'priv.key'` to reflect the path of the private
        key, `priv.key`, that you created. Do not change the line mentioning
        `TLS.KeyFile`—this is a different configuration option.
    *   Change the line `Domain = 'example.org'` to reflect the domain that you
        created a certificate for. If you have followed the instructions in this
        article verbatim, this should be changed to `example.com`. `webpkgserver`
        will only fetch content from the domain indicated by `webpkgserver.toml`. If
        you try to fetch pages from a different domain without updating
        `webpkgserver.toml`, the `webpkgserver` logs will show the error message
        `URL doesn't match the fetch targets`.
    *   (Optional) To preload subresources, change the line `#PreloadCSS
        = false` to `PreloadCSS = true`. In addition, change the line `#PreloadJS =
        false` to `PreloadJS = true`. For more information about subresource
        substitution, check out
        [the explainer](https://github.com/WICG/webpackage/blob/master/explainers/signed-exchange-subresource-substitution.md).

4. Start `webpkgserver`.

    ```shell
    webpkgserver
    ```

    If the server has started successfully, you should see the message `Listening at
    127.0.0.1:8080`. If you do not see this message, a good first troubleshooting
    step is to double-check `webpkgserver.toml`.

    Next, in order to test SXGs that use a self-signed certificate, you will need to 
    enable the `Allow Signed HTTP Exchange certificates without extension` flag in 
    Chrome.


5. Open Chrome, go to `chrome://flags`, and then set `Allow Signed HTTP Exchange
   certificates without extension` to **Enabled**. Then click the **Relaunch**
   button to have these changes take effect.

6. Open the DevTools **Network** tab, then visit the following URL: 
   `http://localhost:8080/priv/doc/https://example.com`.

   This makes a request to the `webpackager` instance running at
   `http://localhost:8080` for a SXG containing the contents of
   `https://example.com`. `/priv/doc/` is the default API endpoint used by
   `webpackager`.

  {% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/kaDNW11a2fmfzbsPqzPY.png",
    alt="Screenshot of the DevTools Network tab showing a SXG with errors.",
    width="800",
    height="550"
  %}

  A resource with the type `signed-exchange` should be listed in the **Network**
  tab. If you don't see this resource, try clearing the cache, then reloading
  `http://localhost:8080/priv/doc/https://example.com`.

  DevTools highlights the SXG in red because the SXG has errors associated with
  it. To view these errors and other information about the SXG, click on the SXG,
  then click **Preview**.



  {% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/MKsFQIvvWrfBj8C3Ce7K.png",
    alt="Screenshot of the Preview tab showing a SXG with errors",
    width="800",
    height="727"
  %}

  The **Preview** tab displays information about the Signed Exchange and its
  signature. At the top of the **Preview** tab you should see the error `Failed
  to fetch certificate`. The browser displays this error when it is unable to
  load a certificate from the **Certificate URL** indicated in the signature. The
  next section explains how to fix this error by uploading a certificate.

  Without the certificate, the browser is unable to authenticate the SXG and it
  falls back to loading the resource without using SXG. This is why there is an
  additional request to `example.com` listed in the **Network** panel.



  {% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/bU5xNjhvVKr9eSg4RqEZ.png",
    alt="Screenshot of the DevTools Network tab loading 'example.com' 
    without using SXG.",
    width="800",
    height="192"
  %}


### Upload the self-signed certificate

  To establish the authenticity of a SXG, the browser must be able to load the
  certificate that was used to sign the SXG from the **Certificate URL** indicated in
  the signature. If the browser is unable to load this certificate, it will
  request that the content be delivered without using SXG.

  These instructions explain how to serve a certificate from an existing HTTPS   environment. 

  {% Aside %}
  `webpkgserver` can be configured to use a locally-hosted
  certificate. For information on this configuration option,
  refer to the `CertURLBase` option in `webpkgserver.toml`. 
  Learn more about [how to use HTTPS for local development](/how-to-use-local-https).
  {% endAside %}


#### Prerequisites

  The instructions in this section assume that you have the ability to upload a
  certificate to an existing HTTPS site. In addition, you should be comfortable
  adjusting the server configuration of this site.


#### Instructions



1. In DevTools, locate the **Certificate URL** indicated in the **Signature** of
   the SXG. Copy the hash that is located at the end of this string.

   This hash is an identifier that corresponds to the certificate. If you were
   to regenerate the SXG using a different certificate, the **Certificate URL**
   listed in the **Signature** would be different.

    {% Img
        src="image/j2RDdG43oidUy6AL6LovThjeX9c2/K1caujHPlyCURA1pxYXz.png",
        alt="Screenshot showing the hash that corresponds to the certificate.",
        width="800",
        height="229"
    %}

2. Create a copy of `cert.pem`. The filename of the new version should match the
   hash you just copied—for example,
   `dKqTlYij_pSjvADDzlMTv4MBF6lUcGR2vaY1ZbfNKww`.

    ```shell
    cp cert.pem dKqTlYij_pSjvADDzlMTv4MBF6lUcGR2vaY1ZbfNKww
    ```

3. Upload the renamed certificate to your site. The particular directory that
   you upload the certificate to does not matter.

4. Open `webpkgserver.toml` with the editor of your choice and make the
   following changes:
    *   Uncomment and change the line `#CertURLBase = '/webpkg/cert'` to match the
        deployed location of your certificate.  For most people, this location will
        be similar to `https://mysite.com/`. If you get the error `CertURLBase: must
        be set non-empty` after starting `webpkgserver`, try adding a `/` at the end
        of the URL.
    *   Uncomment and change `#CertPath = '/webpkg/cert'` to match the deployed
        location of your certificate. For example, if the certificate will be served
        from your root directory, change this value to `/`.

5. Restart `webpkgserver`.

    ```shell
    webpkgserver
    ```

6. Visit `http://localhost:8080/priv/doc/https://example.com`

  The **Network** panel shows that the SXG and its certificate were loaded with no
  errors.



  {% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/eSGbG9uGU0NXxXuHOtw7.png",
    alt="Screenshot of the DevTools Network panel showing that the SXG 
    and its certificate were loaded with no errors.",
    width="696",
    height="201"
  %}



## Serve signed exchanges using a `CanSignHttpExchanges` certificate

  The instructions in this section explain how to serve SXGs using a
  `CanSignHttpExchanges` certificate. Production use of SXGs requires a
  `CanSignHttpExchanges` certificate.

  These instructions are fairly similar to those for serving SXGs with a
  self-signed certificate. For the sake of brevity, these instructions are
  written with the assumption that you understand the concepts discussed in the
  [Setup Signed Exchanges using a self-signed
  certificate](/signed-exchanges-webpackager/#serve-sxgs-using-a-self-signed-certificate)
  section.


### Prerequisites

  You have a `CanSignHttpExchanges` certificate. This
  [page](https://github.com/google/webpackager/wiki/Certificate-Authorities) lists
  the CAs that offer this type of certificate.


### Generate a `CanSignHttpExchanges` certificate


#### Prerequisites



1. Install the
   [`gen-certurl`](https://github.com/WICG/webpackage/blob/master/go/signedexchange/README.md)
   tool.

    ```shell
    go get -v -u github.com/WICG/webpackage/go/signedexchange/cmd/gen-certurl
    ```

    `gen-certurl` is a tool that converts certificates to the certificate format
    used by signed exchanges.



2. Verify that `gen-certurl` has been installed correctly.

    ```shell
    gen-certurl --help
    ```

    This command should return information about its usage.


#### Instructions



1. Follow the steps 1 through 3 of [Generate a self-signed
   certificate](/signed-exchanges-webpackager/#generate-a-self-signed-certificate).
2. Convert `cert.pem` to the `application/cert-chain+cbor` format. 

    ```shell
    gen-certurl -pem cert.pem -ocsp &lt;(echo ocsp) > cert.cbor
    ```

    Certificates come in many formats. `cert.pem` is in the [PEM
    format](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail). Certificates for
    signed exchanges must be in the `application/cert-chain+cbor` format.

    When using a self-signed certificate, `webpkgserver` automatically converts
    the certificate indicated by the `PEMFile` option in `webpkgserver.toml` to
    the `application/cert-chain+cbor` format. However, if you are using a
    `CanSignHttpExchanges` certificate, you must generate the CBOR-encoded
    certificate yourself.  


### Setup up Web Packager for production use



1. Follow steps 1 and 2 of [Setup the Web Packager Server for
   testing](/signed-exchanges-webpackager/#setup-the-web-packager-server-for-testing).

2. Open `webpkgserver.toml` with the editor of your choice and make the
   following changes:
    *   Change the line `PEMFile = cert.pem` to `PEMFile = cert.cbor`.


### Upload the `CanSignHttpExchanges` certificate



1.  Follow steps 1 through 4 of [Upload the self-signed
    certificate](/signed-exchanges-webpackager/#upload-the-self-signed-certificate) to upload `cert.cbor`. 

3. Adjust your server config to serve `cert.cbor` using the `Content-Type:
   application/cert-chain+cbor` response header.

    If this header is not set, you will see the following error when you inspect the
    SXG in DevTools: `Content type of cert-url must be application/cert-chain+cbor.
    Actual content type: text/html`.

4. Restart `webpkgserver`.

    ```shell
    webpkgserver
    ```
