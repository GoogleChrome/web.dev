---
layout: post
title: Confound malicious middlemen with HTTPS and HTTP Strict transport security
authors:
  - mikewest
date: 2013-02-14
tags:
  - blog
---

Given the amount of personal data that flows through the great series of
tubes that is the internet, encryption isn't something that we can or should
lightly ignore. Modern browsers offer several mechanisms you can use to ensure
that your users' data is secure while in transit: [secure cookies](#lock-the-cookie-jar)
and [Strict Transport Security](#closing-the-open-window) are two of the
most important. They allow you to seamlessly protect your users, upgrading
their connections to HTTPS, and providing a guarantee that user data is never
sent in the clear.

Why should you care? Consider this:

Delivering a web page over an unencrypted HTTP connection is more or less the
same as handing an unsealed envelope to the first person you see on the street
who looks like she's walking in the direction of the post office. If you're
lucky, she might take it all the way there herself, or she might hand it off to
the next person she sees who's headed the right way. That person might do the
same, and so on.

Most strangers in this impromptu chain are trustworthy, and would never peek at
your open letter or alter it. The more times the letter changes hands, however,
the greater the number of people with complete access to the letter you're
sending. In the end, it's quite likely that your letter's intended recipient
will get _something_ in the mail, but whether that something is the _same_
something that you handed off in the first place is an open question. Maybe you
should have sealed that envelope…

## Middlemen

For better or worse, huge swaths of the internet rely on the trustworthiness of
strangers. Servers aren't directly connected to each other, but pass requests
and responses along from router to router in an enormous game of Telephone.

You can see these hops in action with traceroute. The route from my computer to
HTML5Rocks looks something like this:

```shell
$ traceroute html5rocks.com
traceroute to html5rocks.com (173.194.71.102), 30 hops max, 60 byte packets
 1  router1-lon.linode.com (212.111.33.229)  0.453 ms
 2  212.111.33.233 (212.111.33.233)  1.067 ms
 3  217.20.44.194 (217.20.44.194)  0.704 ms
 4  google1.lonap.net (193.203.5.136)  0.804 ms
 5  209.85.255.76 (209.85.255.76)  0.925 ms
 6  209.85.253.94 (209.85.253.94)  1.226 ms
 7  209.85.240.28 (209.85.240.28)  48.714 ms
 8  216.239.47.12 (216.239.47.12)  22.575 ms
 9  209.85.241.193 (209.85.241.193)  36.033 ms
10  72.14.233.180 (72.14.233.180)  43.222 ms
11  72.14.233.170 (72.14.233.170)  43.242 ms
12  *
13  lb-in-f102.1e100.net (173.194.71.102)  44.523 ms
```

13 hops isn't bad, really. However, if I'm sending requests via HTTP, then each
of those intermediate routers has complete access to my requests and to the
servers' responses. All the data is being transferred as unencrypted plaintext,
and any of those intermediaries could act as a [Man in the
Middle](http://en.wikipedia.org/wiki/Man-in-the-middle_attack), reading through
my data, or even manipulating it in transit.

Worse, this sort of interception is virtually undetectable. A maliciously
modified HTTP response looks exactly like a valid response, as no mechanism
exists that would enable you to ensure that the data received is _exactly _the
data sent. If someone decides to [turn my Internet upside-down for
laughs](http://www.ex-parrot.com/pete/upside-down-ternet.html), then I'm more or
less out of luck.

## Is this a secure line?

Switching from plaintext HTTP to a secured HTTPS connection offers your best
defense against middlemen. HTTPS connections encrypt the entire channel
end-to-end before any data is sent, making it impossible for machines between
you and your destination to read or modify data in transit.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/c3uAMNblwOgLbCmue6Bl.png", alt="Chrome's Omnibox gives quite a bit of detail about a connection's status.", width="578", height="390" %}
  <figcaption>
  Chrome's Omnibox gives quite a bit of detail about a connection's status.
  </figcaption>
</figure>

The security HTTPS provides is rooted in the concept of public and private
cryptographic keys. A deep discussion of the details is (happily) well beyond
the scope of this article, but the core premise is fairly straightforward: data
encrypted with a given public key can _only_ be decrypted with the corresponding
private key. When a browser kicks off an HTTPS handshake to create a secure
channel, the server provides a certificate which gives the browser all the
information necessary in order to verify its identity by checking that the
server is in possession of the proper private key. All communication from that
point forward is encrypted in such a way that proves that requests are delivered
to and responses received from the authenticated server.

HTTPS, therefore, gives you some assurance that you're talking to the server you
think you're talking to, and that no one else is listening in or twiddling bits
on the wire. This kind of encryption is an absolute prerequisite for security on
the web; if your application isn't currently delivered over HTTPS, it's
vulnerable to attack. Fix it. Ars Technica has a great [guide to obtaining and
installing a certificate (for free)](http://arstechnica.com/security/2009/12/how-to-get-set-with-a-secure-sertificate-for-free/)
that I'd recommend you take a look at for technical details. Configuration will
differ from provider to provider and server to server, but the certificate
request process is the same everywhere.

## Secure by default

Once you've requested and installed a certificate, make sure your users benefit
from your hard work: migrate your existing users to HTTPS connections
transparently via the magic of HTTP redirection, and ensure that cookies are
_only_ delivered over secure connections.

### This way, please

When a user visits `http://example.com/`, redirect them to
`https://example.com/` by sending a `301 Moved
Permanently` response with an appropriate `Location` header:

```shell
$ curl -I http://mkw.st/
HTTP/1.1 301 Moved Permanently
Server: nginx/1.3.7
...
Keep-Alive: timeout=20
Location: https://mkw.st/
```

You can set up this sort of redirection easily in servers like Apache or Nginx.
For example, an Nginx configuration that redirects from `http://example.com/`
to `https://example.com/` looks like this:

```apacheconf
server {
    listen [YOUR IP ADDRESS HERE]:80;
    server_name example.com www.example.com;
    location "/" {
        rewrite ^(.*) https://www.example.com$1 permanent;
    }
}
```

### Lock the cookie jar

Cookies give us the ability to provide users with seamless logged-in experiences
over the stateless HTTP protocol. Data stored in cookies, including sensitive
information like session IDs, is sent along with every request, allowing the
server to make sense of which user it's responding to at the moment. Once we've
ensured that users are hitting our site over HTTPS, we should also ensure that
the sensitive data stored in cookies is only ever transferred over a secure
connection, and never sent in the clear.

Setting a cookie generally involves an HTTP header that looks something like
this:

```http
set-Cookie: KEY=VALUE; path=/; expires=Sat, 01-Jan-2022 00:00:00 GMT
```

You can instruct the browser to restrict the cookie's use to secure sessions by
tacking on a single keyword:

```http
Set-Cookie: KEY=VALUE; path=/; expires=Sat, 01-Jan-2022 00:00:00 GMT; secure
```
Cookies set with the **secure** keyword won't be sent over HTTP, ever.

## Closing the open window

Transparent redirection to HTTPS means that the vast majority of the time your
users are on your site, they'll be using a secure connection. It does, however,
leave a small window of opportunity for attack: the initial HTTP connection is
wide open, vulnerable to [SSL
stripping](http://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security#Applicability)
and related attacks. Given that a man in the middle has complete access to the
initial HTTP request, it can act as a proxy between you and the server, keeping
you on an insecure HTTP connection regardless of the server's intentions.

You can mitigate the risk of this class of attack by asking the browser to
enforce [HTTP Strict Transport Security
(HSTS)](http://tools.ietf.org/html/rfc6797). Sending the
`Strict-Transport-Security` HTTP header instructs the browser to do the HTTP to
HTTPS redirection _client-side_, without ever touching the network (this also
happens to be great for performance; the best request is the one you don't have
to make):

```shell
$ curl -I https://mkw.st/
HTTP/1.1 200 OK
Server: nginx/1.3.7
...
Strict-Transport-Security: max-age=2592000
```

Browsers that support this header (currently [Firefox, Chrome, and Opera: caniuse has details](http://caniuse.com/#feat=stricttransportsecurity))
will make a note that this particular site has requested HTTPS-only access,
meaning that regardless of how a user comes to the site, she'll be visiting over
HTTPS. Even if she types [http://example.com/](http://example.com/) into the browser, she'll end up
on HTTPS without ever making an HTTP connection. Better yet, if the browser
detects an invalid certificate (potentially trying to spoof your server's
identity), users won't be allowed to continue on via HTTP; it's all or nothing,
which is excellent.

The browser will expire the server's HSTS status after `max-age` seconds
(about a month in this example); set this to something reasonably high.

You can also ensure that all of an origin's subdomains are protected by adding
the `includeSubDomains` directive to the header:

```http
$ curl -I https://mkw.st/
HTTP/1.1 200 OK
Server: nginx/1.3.7
...
Strict-Transport-Security: max-age=2592000
```

## Go forth, securely

HTTPS the only way to be even remotely sure that data you send reaches the
intended recipient intact. You should set up secure connections for your sites
and applications, today. It's a fairly straightforward process, and will help
keep your customers' data safe. Once you've gotten an encrypted channel in
place, you should transparently redirect users to this secure connection
regardless of how they come to your site by sending a 301 HTTP response. Then
make sure that that all your users' sensitive session information uses _only_
that secure connection by adding the **secure** keyword when setting cookies.
Once you've done all that, ensure that your users never accidentally fall off
the bus: protect them by ensuring that their browser does the right thing by
sending a `Strict-Transport-Security` header.

Setting up HTTPS isn't much work, and has huge benefits for your site and its
users. It's well worth the effort.

## Resources

- [StartSSL](https://www.startssl.com/) offers free domain-verified
  certificates. You can't beat free. Stepping up to higher grades of
  verification is, of course, both possible and reasonably priced.
- [SSL Server Test](https://www.ssllabs.com/ssltest/): Once you've set up HTTPS
  for your servers, verify that you've done it right by running it through SSL
  Labs' server test. You'll get a [nicely detailed
  report](https://www.ssllabs.com/ssltest/analyze.html?d=mkw.st) that shows you
  whether you're really up and running.
- Ars Technica's recent article ["Securing your Web Server with
  SSL/TLS"](http://arstechnica.com/information-technology/2012/11/securing-your-web-server-with-ssltls/2/)
  is worth reading for a little more background detail about the nuts and bolts
  of setting up a server.
- The [HTTP Strict Transport Security specification
  (RFC6797)](http://tools.ietf.org/html/rfc6797) is worth skimming for all the
  technical information about the `Strict-Transport-Security` header you could
  possibly want.
- Once you really know what you're doing, one possible next step would be to
  advertise that your site should only be reachable via a specific set of
  certificates. There's some work underway at the IETF which would allow you to
  do just that via [the `Public-Key-Pins` header](http://tools.ietf.org/html/draft-ietf-websec-key-pinning);
  still early days, but interesting, and worth following.
