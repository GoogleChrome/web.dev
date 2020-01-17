# Distributing SXG

As a SXG distributor, you can deliver SXG files on behalf of the original publisher.
The web browser will display such SXG files as if they were delivered from the original publisher.
It means that you can implement preload even though cross-site navigation without violating privacy.
Preloading contents will hide latency of load. Especially combination with portals would improve UX drastically.

Let’s look at how to serve SXG properly.

## Get SXG files

First, you have to get SXG files.
SXG has special http header, so just appending element in the request header is enough like below:

```bash
Accept: application/signed-exchange;v=b3,*/*;q=0.8
```

If the server supports SXG, it will returns SXG file to the request.
In below, I assume that you put your SXG files in the /var/www/sxg directory.
You can generate SXG of your own web pages.
The way to publish SXG from your website is written in another article go/non-amp-sxg.

## Server simple SXG file

If you wish to distribute a single SXG file, you need to attach the following headers.

```
Content-Type: application/signed-exchange;v=v3
X-Content-Type-Options: nosniff
```

Both of them are configurable on nginx.

```nginx
http {
    ...
    types {
        application/signed-exchange;v=b3  sxg;
    }
    add_header X-Content-Type-Options nosniff;
    
    location / {
        more_set_headers "Content-Type: application/signed-exchange;v=b3";
        alias /var/www/sxg/;
        try_files $uri.sxg $uri =404;
        autoindex off;
    }
    ...
```

Then, load this configuration into nginx,

```bash
$ sudo systemctl restart nginx.service
```

Your nginx will start serving SXG files.
When your Chrome access your server, the address of original content publisher will appear in the bar!

## Multiple files distribution

Most web pages consist of multiple subresources, such as style sheets, JavaScript, fonts, and images.
The content of SXG cannot be changed without a publisher private key.
This causes problems for users resolving subresources.
 
For example, index.html.sxg from https://website.test/index.html has a link to https://website.test/app.js.
When a user receives the SXG file from https://distributor.test/example.com/index.html.sxg, they will find the link to https://example.com/app.js.
Users can fetch https://example.com/app.js directly when accessed, but it cannot be preloaded.
If the distributor wants to serve app.js.sxg from their own service, then modifying link tag in HTML https://example.com/app.js to be distributor’s one (such as https://distributor.test/example.com/app.js.sxg) must cause signature mismatch and make a invalid SXG.
To solve this problem, SXG subresource prefetching feature has been developed.
This feature is in an experimental state now (Oct. 30 2019), and you can find and enable it in your latest Chrome at chrome://flags/#enable-sxg-subresource-prefetching.

To use subresource prefetching the following conditions must be met:

- The publisher must embed response header entry in SXG, such as: `link: <https://example.com/app.js>;rel="preload";as="script",<https://example.com/app.js>;rel="allowed-alt-sxg";header-integrity="sha256-h6GuCtTXe2nITIHHpJM+xCxcKrYDpOFcIXjihE4asxk="`.
  This specifies the subresource that can be substituted with SXG’s specific integrity
  hash.
- The distributor must attach a response header when serving the SXG, such as: `link: <https://distributor.test/example.com/app.js.sgx>;rel="alternate";type="application/signed-exchange;v=b3";anchor="https://example.com/app.js".
  This specifies the path of app.js and corresponds to the subresource.

If there are no subresources other than https://example.com/app.js, all you must append is

```nginx
add_header link <https://distributor.test/example.com/app.js.sxg>;rel="alter...
```

in your nginx config.
Additionally, the distributor must attach the proper anchor link header when serving an SXG file.
Currently, there is no easy way to resolve this issue, so stay tuned for updates!
