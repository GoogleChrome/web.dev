---
title: 'Encryption'
authors:
  - sil
description: To do.
date: 2023-01-26
tags:
  - privacy
---

Encryption is often a topic for security, but it's important for privacy too. The goal of encryption is to prevent others
from reading the encrypted information… but preventing others from reading your information is one way to keep it private.
A user is often limited in how much they can do that themselves, but with your assistance as provider of a service they're using,
encryption can help to keep their data theirs.

There are three relevant ways to apply encryption to aid user privacy: encryption in transit, encryption at rest,
and encryption end-to-end:

* **Encryption in transit** is keeping data encrypted between the user and your site: that is, HTTPS. You probably have HTTPS
set up for your sites already, but are you sure _all_ the data in transit to your sites is encrypted? This is what redirection
and HSTS are for, and they are described below and should be part of your HTTPS setup.
* **Encryption at rest** is the encryption of data stored on your servers. This protects against data breaches and is an
important part of your security stance.
* **End-to-end encryption** is the encryption of data on the client before it ever reaches your server. This protects
user data even from you: you can store your users' data, but you can't read it. This is difficult to implement, and isn't
suitable for all types of application, but it's a strong aid to user privacy, because nobody can see their data other than themselves.

## HTTPS

The first move is serving your web service over HTTPS. It is very likely that you will have already done this, but if not it
is an important step. HTTPS is HTTP, the protocol that a browser uses to request web pages from a server, but encrypted using SSL.
This means that an outside attacker can't read or interfere with an HTTPS request in between the sender (your user) and the
recipient (you), because it's encrypted and so they can't read it or change it. This is encryption in transit: while data is
moving from user to you, or from you to user. HTTPS encryption in transit also prevents the user's ISP, or the provider of
the Wi-Fi they're using, from being able to read the data they're sending to you as part of their relationship with your service.
It may impact your service's features, too: many uses of existing JavaScript APIs require the website to be served over HTTPS.
[https://developer.mozilla.org/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts](Mozilla) has a more comprehensive list,
but APIs gatewayed behind a secure context include service workers, push notifications, web share and web crypto, and some device APIs.

To serve your website over HTTPS you will need an SSL certificate. These can be created for free via [Let's Encrypt](https://letsencrypt.org/),
or can often be provided by your hosting service if you are using one. It is also possible to use a third-party service which "proxies" your
web service and can provide HTTPS, as well as caching and CDN services. There are numerous examples of such services, such as Cloudflare
and Fastly—exactly which to use depends on your current infrastructure. In the past, HTTPS could be burdensome or expensive to implement,
which is why it tended to be used only on payment pages or particularly secure origins; but freely available certificates, standards improvements,
and greater proliferation of browsers have removed all those obstacles.

### Do

* Enable HTTPS on your servers for everything (whichever method you choose).
* Consider using a proxy in front of your servers, such as Cloudflare ([https://httpsiseasy.com/](https://httpsiseasy.com/) explains the process).
* Or use Let's Encrypt: [https://letsencrypt.org/](https://letsencrypt.org/) will walk you through the process of creating your own Let's Encrypt SSL certificate.
* Or use OpenSSL directly to create your own certificate and have it signed by your choice of certificate authority (CA)
([https://web.dev/enable-https/](/enable-https/) explains how to do this in detail).

Which approach you choose depends on business tradeoffs. Having a third-party manage the SSL connection for you is the easiest to set up,
and does come with other benefits such as load balancing, caching, and analytics. But it also comes with an obvious ceding of some control
to that third-party, and an unavoidable dependency on their services (and possible payment, depending on the services you use and your traffic levels).
Generating certificates and having them signed by a CA is how the SSL process used to be conducted, but using Let's Encrypt can be easier if it's
supported by your provider or if your server team is technically adept enough for it, and it's free. It's also common for your provider to offer
SSL as a service if you're using something at a higher level than cloud hosting, so it's worth checking.

### Why

Security is a part of your privacy story: being able to demonstrate that you keep user data secure against interference helps
to build trust. If you don't use HTTPS, your sites are also flagged as being "not secure" by browsers (and have been for some time).
[Existing JavaScript APIs are often only available to HTTPS pages ("secure origins")](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts).
It also protects your users against their [web usage being seen by their ISP](https://spreadprivacy.com/protection-from-isp-spying/).
This is certainly a best practice; there's little to no reason to not use HTTPS for websites now.

## How browsers present an HTTP (not secure) page

### Google Chrome (desktop)

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/rs1XOzYuZ0L44DUGijUp.png", alt="Chrome desktop URL warning 'Not Secure'", width="524", height="235" %}

### Mozilla Firefox (desktop)

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/V4JrNHQB0JRUVQAgljna.png", alt="Firefox HTTP URL warning", width="543", height="307" %}

### Apple Safari (macOS desktop)

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/U1fIa4q2ng68Olf3Zdy7.png", alt="Safari desktop HTTP URL warning", width="800", height="166" %}

### Google Chrome (Android mobile)

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/KlN1Zd15tQxFnfLTNDgI.png", alt="Android mobile HTTP warning", width="800", height="168" %}

### Apple Safari (iOS mobile)

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/VPffgyq9or8mPbxO2Bwp.png", alt="Apple Safari iOS HTTP warning", width="800", height="397" %}

## Redirect to HTTPS

If your site is available on both http: and https: URLs, you should redirect all http URL accesses to https. This is for
the reasons above, and it also ensures that your site won't show up on [whynohttps.com](https://whynohttps.com/) if it becomes popular.
How to do this depends a great deal on your infrastructure. If you're hosted on AWS you can use a [Classic](https://aws.amazon.com/premiumsupport/knowledge-center/redirect-http-https-elb/)
or [Application](https://aws.amazon.com/premiumsupport/knowledge-center/elb-redirect-http-to-https-using-alb/) load balancer.
[Google Cloud](https://cloud.google.com/load-balancing/docs/https/setting-up-http-https-redirect) is similar. In Azure you can
create a [Front Door](https://docs.microsoft.com/en-us/azure/frontdoor/front-door-how-to-redirect-https); in Node with Express
[check for request.secure](https://docs.divio.com/en/latest/how-to/node-express-force-https/); in Nginx
[catch all port 80 and return 301](https://serversforhackers.com/c/redirect-http-to-https-nginx); and in Apache,
[use a RewriteRule](https://www.ssl.com/how-to/redirect-http-to-https-with-apache/). If you're using a hosting service,
it's quite likely that they'll automatically handle redirecting to HTTPS URLs for you: Netlify, Firebase, and GitHub Pages do,
among many others.

## HSTS

HSTS is short for "HTTP Strict-Transport-Security", and is a way of locking a browser into using HTTPS for your service forevermore.
Once you're happy with your migration to HTTPS, or if you've already done that, then you can add a
[Strict-Transport-Security HTTP response header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security) to your
outgoing responses. A browser which has accessed your site before will record having seen this header, and from then on will automatically
access this site as HTTPS even if you request HTTP. This avoids going through your redirect as above: it's as if the browser silently "upgrades"
all requests to your service to use HTTPS.

Similarly, you can serve an [Upgrade-Insecure-Requests](https://developer.mozilla.org/docs/Web/HTTP/Headers/Upgrade-Insecure-Requests)
header along with your pages. This does something different from but related to `Strict-Transport-Security`. If you
add `Upgrade-Insecure-Requests: 1`, then requests from this page to other resources (images, scripts) will be requested
as https even if the link is http. However, the browser will not re-request the page itself as https, and the browser will
not remember for next time. In practice, Upgrade-Insecure-Requests is useful if you're converting an existing site with
lots of links to HTTPS and converting the link URLs in content is hard, but it's better to change the content where possible.

HSTS is primarily a security feature: it "locks" your site to HTTPS for users who have been there before. However,
as above, HTTPS is good for privacy, and HSTS is good for HTTPS. Similarly, Upgrade-Insecure-Requests isn't really needed if
you're updating all your content, but it is a useful “belt-and-braces” approach to add defence in depth in ensuring that
your site will always be HTTPS.

### Do

Add the HSTS header to your outgoing responses:

`Strict-Transport-Security: max-age=300; includeSubDomains`

The max-age parameter dictates how long, in seconds, the browser should remember and enforce the HTTPS upgrade.
(Here we set it to 300 seconds, i.e, five minutes.) Eventually you would want this to be 6,3072,000, which is two years,
and is the figure that [hstspreload.org](https://hstspreload.org/) recommends, but it is quite difficult to recover
if there are issues. So it is recommended that you set this with a low number at first (300), test to confirm nothing
has broken, and then increase the number in stages.

Add the `Upgrade-Insecure-Requests` headers to your outgoing responses:

`Upgrade-Insecure-Requests: 1
Content-Security-Policy: upgrade-insecure-requests`

{% Aside %}
**Should I add HSTS/UIR headers and add redirects?**
Yes. You should redirect http URLs to https, and continue to do so even after HSTS is in place—it's important to do both.
It's a best practice anyway ([https://web.dev/redirects-http/](/redirects-https/) explains) but it's also required in
order to be added to the automatic preload list (see [https://hstspreload.org](https://hstspreload.org) for more details).
{% endAside %}

## End-to-end encryption

A good way of keeping user data private is to not show it to anyone other than the user, including you. This helps a lot with
your trust stance: if you don't have your user's data then it is clear that you can't do anything with it that they would
not want. One way to do this is to not let user data leave their device at all, by storing everything client-side. This
approach works, but there are limitations to a pure client-side application: browser data storage can be limited in size,
and in some browsers may be cleared with little or no warning. It's also difficult or impossible to access your data
across two devices, such as a laptop and a mobile phone. For this reason, it can be useful to send data to the server
as normal, but encrypt it with a key known only to the user, so that the server cannot access it (because it can't decrypt it)
but can store it.

### How does it work?

This approach is frequently used by messaging applications, where it's referred to as "end-to-end encryption", or
"e2e". In this way, two people who know one another's keys can encrypt and decrypt their messages back and forth,
and send those messages via the messaging provider, but the messaging provider (who does not have those keys) can't
read the messages. Most applications are not messaging apps, but it is possible to combine the two approaches—a solely
client-side data store, and data encryption with a key known to the client—to store data locally but also send it encrypted
to the server. It is important to realise that there are limitations to this approach: this isn't possible for all services,
and in particular it can't be used if you, as the service provider, need access to what the user is storing. As described
in [part 2](/learn/privacy/data/) of this series, it is best to obey the principle of data minimisation; avoid collecting data at all if you can.
If the user needs data storage, but you do not need access to that data to provide the service, then end-to-end encryption
is a useful alternative. If you provide services which require being able to see what the user stores to provide the service,
then end-to-end encryption is not suitable. But if you do not, then you can have the client-side JavaScript of your web
service encrypt any data it sends to the server, and decrypt any data it receives.

### An example: Excalidraw

[Excalidraw](https://blog.excalidraw.com/end-to-end-encryption/) does this and explains how in a blog post. It is a vector
drawing app that stores drawings on the server, which are encrypted with a randomly chosen key. Part of the reason that
Excalidraw can implement this end-to-end encryption with relatively little code is that cryptographic libraries are now built
into the browser with [window.crypto](https://developer.mozilla.org/docs/Web/API/SubtleCrypto/encrypt), which is a set
of JavaScript APIs [supported in all modern browsers](https://caniuse.com/cryptography). Cryptography is hard and implementing
the algorithms comes with many edge cases. Having the browser do the heavy lifting here makes encryption more accessible to
web developers and therefore makes it easier to implement privacy via encrypted data. As Excalidraw describes in their writeup,
the encryption key remains on the client-side, because it's part of the URL fragment: when a browser visits a URL
`https://example.com/path?param=1#fraghere`, the path of the URL (`/path`) and the parameters (`param=1`) are passed to the server
(`example.com`), but the fragment (`fraghere`) is not, and so the server never sees it. This means that even if the encrypted
data goes through the server, the encryption key does not and thus privacy is preserved because the data is end-to-end encrypted.

### Limitations

This approach to encrypting user data is not foolproof. It contributes to your trust stance for your users but it cannot fully
replace it. Your users will still have to trust your service, because you could, at any moment, swap out client-side JavaScript
for some subtly similar JavaScript that does not impenetrably encrypt data; and although it is possible as a user to detect
whether a website you're using has done that, it's extremely difficult to do so. In practice, your users will still need to
trust that you will not deliberately read and abuse their data while promising to not do so. However, demonstrating that data
is encrypted and not readable by you as a (not malicious) service provider can contribute a lot to demonstrating why you are trustworthy.

It's also important to remember that one of the goals of end-to-end encryption is to stop you, the site owner, from being able
to read the data. This is good for privacy, but it also means that if there are problems, you can't help. In essence, a service
using end-to-end encryption puts the user in charge of the encryption keys. (This may not be obvious or overt, but someone has
to have the key, and if data is kept private from you, then that's not you.) If those keys are lost, then there will be nothing
you can do to help, and probably any data encrypted with those keys may also be lost. There is a fine balancing act here
between privacy and usability: keep data private from everybody using encryption, but also avoid forcing users into having
to be cryptology experts who manage their own keys in a secure manner.

## Encryption at rest

As well as encrypting your users' data in transit, it's also important to consider encrypting data that you have stored on the server.
This helps to protect against data breaches, because anyone who obtains unauthorised access to your stored data will have encrypted data,
which they will hopefully not have the keys to decrypt. There are two different and complementary approaches to encrypting data at rest:
encryption that you add, and encryption that your cloud storage provider adds (if you're using a cloud storage provider).
The storage provider encryption doesn't provide much protection against data breaches via your software (because storage provider
encryption is usually transparent to you as a user of their service), but it does help against breaches that happen at the provider's
infrastructure. It's often simple to turn on and so is worth considering. This field changes rapidly and your security team (or
security-savvy engineers on your team) are the best to advise on it, but all cloud storage providers offer encryption at rest for
block storage [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html) by setting,
[Azure Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption), and
[Google Cloud Storage](https://cloud.google.com/storage/docs/encryption) by default, and for database data storage
[AWS RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html),
[Azure SQL](https://docs.microsoft.com/en-us/azure/azure-sql/database/transparent-data-encryption-tde-overview?view=azuresql&tabs=azure-portal),
[Google Cloud SQL](https://cloud.google.com/docs/security/encryption/default-encryption) among others. Check this out with
your cloud storage provider, if you're using one. Handling encryption of data at rest yourself to help protect user data
from data breaches is more difficult, because the logistics of securely managing encryption keys and making them available
to code without also making them available to attackers is challenging. This isn't the best place to advise on security issues at
that level; talk with your security-savvy engineers or dedicated team about this, or external security agencies.

