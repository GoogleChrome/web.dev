# Introduction of SXG

## Create signed exchanges for your websites

A new web technology, signed exchanges (SXG), enables creators to sign their
content.
This prevents users from confusing content creators from content distributors.
For users, SXG shows the content creators URL in the browser and developer
tools.
Last year, SXG demonstrated their power with AMP!
Today, this article shows you how to use SXG with any website, irrespective of
the framework used to build it!

## Prerequisites for implementing SXG

To implement SXG on your website, you must:
Have control over your domain, including DNS entries, and get certificates.
SXG requires the issuance of a dedicated certificate.
In particular, you cannot reuse the same key/cert for TLS.
Have an HTTP server that can generate and serve SXG over HTTPS.
Making your website support SXG
Below is a step by step introduction for implementing SXG.
This article assumes that you have OpenSSL 1.1.1 environment (the article is
written with Ubuntu 18.04 LTS on amd64 ISA), have the ability to sudo to
install executables, and use nginx as an HTTP server.
Also, the example commands in this article assume your domain is "website.test",
so replace it with yours.

## Step 1: Get your certificate for SXG

To generate SXG, you need a TLS certificate with the CanSignHttpExchanges
extension, as well as a particular key type. DigiCert provides certificates
with this extension. You need a csr file for issuance of a certificate, so
generate it with the following commands:

```ShellSession
openssl ecparam -genkey -name prime256v1 -out mySxg.key
openssl req -new -key mySxg.key -nodes -out mySxg.csr -subj "/O=Test/C=US/CN=website.test"
```

You will get a csr file that looks like the following:

```ShellSession
-----BEGIN CERTIFICATE REQUEST-----
MIHuMIGVAgEAMDMxDTALBgNVBAoMBFRlc3QxCzAJBgNVBAYTAlVTMRUwEwYDVQQD
DAx3ZWJzaXRlLnRlc3QwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAS7IVaeMvid
S5UO7BspzSe5eqT5Qk6X6dCggUiV/vyqQaFDjA/ALyTofgXpbCaksorPaDhdA+f9
APdHWkTbbdv1oAAwCgYIKoZIzj0EAwIDSAAwRQIhAIb7n7Kcc6Y6pU3vFr8SDNkB
kEadlVKNA24SVZ/hn3fjAiAS2tWXhYdJX6xjf2+DL/smB36MKbXg7VWy0K1tWmFi
Sg==
-----END CERTIFICATE REQUEST-----
```

After creating the csr file, login to DigiCert and request a Standard SSL, then
csr PEM data is required, use the created csr file.
Please be aware that: The validity period must not exceed 90 days.
Check Include the CanSignHttpExchanges extension in the certificate in
Additional Certificate Options.
If your certificate does not match these conditions, browsers and distributors
will reject your SXG for security reasons.
We assume that the filename of the certificate you got from DigiCert is
mySxg.pem.

## Step 2: Install libsxg

The SXG format is complex and hard to generate without using tools.
You can use one of the following options to generate SXG:

- The gen-signedexchange tool written in Go published
  [here](https://github.com/WICG/webpackage/tree/master/go/signedexchange).
- The libsxg library written in C published
  [here](https://github.com/google/libsxg).

In this article, we demonstrate libsxg.

### Option 1: Installing libsxg from a Debian package

You can install the package in the usual Debian way, as long as OpenSSL
(libssl-dev) version is matched.

```ShellSession
sudo apt install -y libssl-dev
wget https://github.com/google/libsxg/releases/download/v0.2/libsxg-dev_0.2_amd64.deb
sudo dpkg -i libsxg-dev_0.2_amd64.deb
```

### Option 2: Building libsxg manually

If you are not using an environment compatible with .deb file, you can build it
yourself.
As a precondition, you need to install git, cmake, openssl and gcc.

```ShellSession
git clone https://github.com/google/libsxg
mkdir libsxg/build
cd libsxg/build
cmake .. -DRUN_TEST=false -DCMAKE_BUILD_TYPE=Release
make
sudo make install
```

## Step 3: Install nginx plugin

The nginx plugin allows you to generate SXG dynamically instead of statically
generating  them prior to serving.

### Option 1: Installing plugin from a Debian package

The SXG module for nginx is distributed on [GitHub](https://github.com/kumagi/nginx-sxg-module).
On Debian-based systems, you can install it as a binary package.

```ShellSession
sudo apt install nginx
wget https://github.com/google/nginx-sxg-module/releases/download/v0.1/libnginx-mod-http-sxg-filter_1.15.9-0ubuntu1.1_amd64.deb
sudo dpkg -i libnginx-mod-http-sxg-filter_1.15.9-0ubuntu1.1_amd64.deb
```

### Option 2: Building plugin manually

Building the nginx module requires the nginx source code.
You can get the tarball and build it along with the SXG dynamic module using the
commands below:

```ShellSession
git clone https://github.com/google/nginx-sxg-module
wget https://nginx.org/download/nginx-1.17.5.tar.gz
tar xvf nginx-1.17.5.tar.gz
cd nginx-1.17.5
./configure --prefix=/opt/nginx --add-dynamic-module=../nginx-sxg-module --without-http_rewrite_module --with-http_ssl_module
make
sudo make install
```

The nginx configuration has great flexibility.
Install nginx anywhere in your system, then specify a respective path of
module/config/log/pidfile.
In this article, we assume you will install it in the /opt/nginx path.
Configure the nginx plugin to use the SXG certificate prepared in step 1.

## Step 4: Configure nginx

You need proper configuration to start nginx with SXG.

### Option 1: Installed nginx module from a Debian package

Delivering SXG content requires HTTPS.
You can get an SSL/TLS certificate from DigiCert, Let's Encrypt and other
services.
Note that you CANNOT use an SXG certificate for SSL or vice versa,
therefore you will need two certificates. The configuration file in 
/etc/nginx/nginx.conf should look similar to the following, assuming that
you put the SSL key/cert pair in /path/to/ssl/ and the SXG key/cert pair
in /path/to/sxg/:

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

Start nginx and you are ready to serve SXG!

```ShellSession
sudo systemctl start nginx.service
curl -H"Accept: application/signed-exchange;v=b3" https://website.test/ > index.html.sxg
$ cat index.html.sxg
sxg1-b3...https://website.test/...(omit)
```

### Option 2: Installed nginx module manually

Configuration for nginx systems installed under /opt/nginx will look similar to
the following example:

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

After verifying the configuration looks correct, start nginx.
Now you can get your SXG!

```ShellSession
cd /opt/nginx/sbin
sudo ./nginx
cd
curl -H "Accept: application/signed-exchange;v=b3" https://website.test/ > index.html.sxg
$ less index.html.sxg
sxg1-b3...https://website.test/...(omit)

Serve your application backend
In the above examples, nginx serves static files in the root directory, but you can use upstream directive for your applications to make SXG for arbitrary web application backends (e.g. Ruby on Rails, Django, express.js) as long as your nginx works as a front HTTP(S) server.
upstream app {
    server 127.0.0.1:8080;
}

server {
    location / {
        proxy_pass http://app;
    }
}
```

### Other topics

#### What is cert-url

`cert-url` is essential for browsers to load SXG properly because it locates
certificate chain.
The certificate chain contains certificate and OCSP stapling information with
cbor format. Note that you do not have to serve cert.cbor file from the same
origin, so you can serve it via any CDNs or other static file serving services
as long as it supports HTTPS (e.g. Amazon S3, Google Cloud Storage).

#### What is validity_url

This endpoint is planned to serve SXG signature header related information.
If webpage is not modified since the last SXG, downloading entire SXG file is
not required technically. So updating signature header alone is expected to
reduce network traffic. But the details are not implemented yet.

#### Conclusion

I explained how to publish SXG files from your nginx.
I am now working in this field to make SXG ecosystems better.
Please let me know your opinions or impressions! Thank you!
