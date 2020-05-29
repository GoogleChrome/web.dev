---
title: Protect your resources from web attacks with Fetch Metadata 
subhead: Prevent CSRF, XSSI, and cross-origin information leaks.
authors:
  - lwe
date: 2020-05-20
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
hero: hero.jpg
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
# thumbnail: thumbnail.png
alt: Resource Isolation Policy.
description: |
  Introducing Fetch Metadata: A new web platform feature designed to allow servers to protect themselves from cross-origin attacks.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - security
  - fetch-metadata
---

## Why should you care about isolating your web resources?

Many web applications are vulnerable to [cross-origin](https://web.dev/same-site-same-origin/#%22same-origin%22-and-%22cross-origin%22) attacks like [cross-site request forgery](https://portswigger.net/web-security/csrf) (CSRF), [cross-site script inclusion](https://portswigger.net/research/json-hijacking-for-the-modern-web) (XSSI), timing attacks, and [cross-origin information leaks](https://arxiv.org/pdf/1908.02204.pdf) or due to speculative execution side-channels ([Spectre](https://developers.google.com/web/updates/2018/02/meltdown-spectre)).

[Fetch Metadata](https://www.w3.org/TR/fetch-metadata/) request headers sent by modern browsers allow you to deploy a strong defense-in-depth mechanism - a Resource Isolation Policy - to protect your application against these common cross-origin attacks.

Fetch Metadata request headers are currently supported in Chrome 76 and other Chromium-based browsers, and are under development in Firefox.
See [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site#Browser_compatibility) for up-to-date browser support information.

{% Aside %}
It is common for resources exposed by a given web application to only be loaded by the application itself, and not by other websites. In such cases, deploying a Resource Isolation Policy based on Fetch Metadata request headers takes little effort, and at the same time protects the application from cross-site attacks.
{% endAside %}



## Background
Many cross-site attacks are possible because the web is open by default and your application server cannot easily protect itself from communication originating from external applications. 
A typical cross-origin attack is cross-site request forgery (CSRF) where an attacker lures a user onto a site they control and then submits a form to the server the user is logged in to. Since the server cannot tell if the request originated from another domain (cross-site) and the browser automatically attaches cookies to cross-site requests, the server will execute the action requested by the attacker on behalf of the user.

Other cross-site attacks like XSSI or cross-origin information leaks are similar in nature to CSRF and rely on loading resources from a victim application in an attacker-controlled document and leaking information about them. Since applications cannot easily distinguish trusted requests from untrusted ones, they cannot discard malicious cross-site traffic.

## Fetch Metadata introduction
Fetch Metadata request headers are a new web platform security feature designed to help servers defend themselves against cross-origin attacks. By providing information about the context of an HTTP request in a set of `Sec-Fetch-*` headers, they allow the responding server to apply security policies before processing the request. This lets developers decide whether to accept or reject a request based on the way it was made and the context in which it will be used, making it possible to respond to only legitimate requests made by their own application.

{% Compare 'better', 'Same-Origin' %}
{% CompareCaption %}
Requests originating from sites served by your own server (same-origin) will continue to work.
{% endCompareCaption %}

![Same Origin Request](same-origin-request.png)

{% endCompare %}


{% Compare 'worse', 'Cross-site' %}
{% CompareCaption %}
Malicious cross-site requests can be rejected by the server because of the additional context in the HTTP request provided by `Sec-Fetch-*` headers.
{% endCompareCaption %}

![Cross Origin Request](cross-origin-request.png)

{% endCompare %}



### Sec-Fetch-Site
The first request header, `Sec-Fetch-Site`, tells the server which [site](https://web.dev/same-site-same-origin) sent the request. This value is set to:
 - `same-origin`, if the request was made by your own application (e.g. site.example), 
 - `same-site`, if the request was made by a subdomain of your site (e.g. bar.site.example),
 - `none`, if the request was explicitly caused by a user's interaction with the user agent (e.g. clicking on a bookmark),
 - `cross-site`, if it was sent by another website (e.g. evil.example). 

### Sec-Fetch-Mode Request Header
The second header, `Sec-Fetch-Mode`, indicates the [mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode) of the request. This roughly corresponds to the type of the request and allows you to distinguish resource loads from navigation requests. For example, a destination of `navigate` indicates a top-level navigation request while `no-cors` will be set for resource requests like loading an image.

### Sec-Fetch-Dest Request Header
The third header, `Sec-Fetch-Dest`, exposes a request's [destination](https://developer.mozilla.org/en-US/docs/Web/API/Request/destination) (e.g. if a `script` or an `img` tag caused a resource to be requested by the browser).


## How to use Fetch Metadata to protect against cross-origin attacks
The extra information these request headers provide is quite simple, but the additional context allows you to build powerful security logic on the server-side, also referred to as a Resource Isolation Policy, with just a few lines of code.

### Implementing a Resource Isolation Policy
A Resource Isolation Policy prevents your resources from being requested by external websites. Blocking such traffic mitigates common cross-site web vulnerabilities such as CSRF, XSSI, timing attacks, and cross-origin information leaks. This policy can be enabled for all endpoints of your application and will allow all resource requests coming from your own application as well as direct navigations (via an HTTP `GET` request). Endpoints that are supposed to be loaded in a cross-site context (e.g. endpoints loaded using CORS) can be opted out of this logic

**To implement a Resource Isolation Policy follow these steps:**

#### Step 1: Allow requests from browsers which don't send Fetch Metadata
Since not all browsers support Fetch Metadata, you need to allow requests that don't set `Sec-Fetch-*` headers by e.g. checking for the presence of `sec-fetch-site`:
```python
  if not req['sec-fetch-site']:
    return True  # Allow this request
 ```
{% Aside 'caution' %}
Since Fetch Metadata is only supported in modern browsers, it should be used as a defense-in-depth protection and not as your primary line of defense.
{% endAside %}


#### Step 2: Allow same-site and browser-initiated requests
Any requests that do not originate from a cross-origin context (like *evil.example*) will be allowed. In particular, these are requests that:
 -  Originate from your own application (e.g. a same-origin request where *site.example* requests *site.example/foo.json* will always be allowed).
 - Originate from your subdomains.
 -  Are explicitly caused by a user's interaction with the user agent (e.g. direct navigation or by clicking a bookmark, etc.).

```python
  if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
    return True  # Allow this request
```
{% Aside 'gotchas' %}
In case your subdomains are not fully trusted, you can make the policy stricter by blocking requests from subdomains by removing the `same-site` value. 
{% endAside %} 


#### Step 3: Allow simple top-level navigation and iframing
To ensure that your site can still be linked from other sites, you have to allow simple (`HTTP GET`) top-level navigation.  

```python
  if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
    # <object> and <embed> send navigation requests, which we disallow.
    and req['sec-fetch-dest'] not in ('object', 'embed'):
      return True  # Allow this request
```
{% Aside 'gotchas' %}
The logic above protects your application's endpoints from being used as resources by other websites, but will permit top-level navigation and embedding (loading in an <iframe>). To further improve security, you can use Fetch Metadata headers to restrict cross-site navigations to only an allowed set of pages.
{% endAside %} 


#### Step 4: (Optional) Opt out endpoints that are meant to serve cross-site traffic
In some cases, your application might provide resources which are meant to be loaded cross-site. These resources need to be exempted on a per-path or per-endpoint basis. Examples of such endpoints are:
 - CORS-enabled endpoints
 - Public resources like stylesheets or images
{% Aside 'caution' %}
Before opting out parts of your application from these security restrictions, make sure they are static and don't contain any sensitive user information.
{% endAside %}


#### Step 5: Reject all other requests that are cross-site and not navigational
Any other **cross-site** request will be rejected by this Resource Isolation Policy and thus protect your application from common cross-site attacks.
{% Aside 'gotchas' %}
By default, requests violating your policy should be rejected with an `HTTP 403` response. But, depending on your use case, you can also consider other actions, such as:
 - **Only logging violations**. This is especially useful when testing the compatibility of the policy and finding endpoints that might need to be opted out.
 - **Modifying the request**. In certain scenarios, consider performing other actions like redirecting to your landing page and dropping authentication credentials (e.g. cookies). However, please be aware that this could weaken the protections of a Fetch Metadata-based policy.
{% endAside %}


**Example:** The following code demonstrates a complete implementation of a robust Resource Isolation Policy on the server or as a middleware to deny potentially malicious cross-site resource requests, while allowing simple navigational requests:

```python
# Reject cross-origin requests to protect from CSRF, XSSI & other bugs
def allow_request(req):
  # Allow requests from browsers which don't send Fetch Metadata
  if not req['sec-fetch-site']:
    return True

  # Allow same-site and browser-initiated requests
  if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
    return True

  # Allow simple top-level navigations except <object> and <embed>
  if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
    and req['sec-fetch-dest'] not in ('object', 'embed'):
      return True

  # [OPTIONAL] Exempt paths/endpoints meant to be served cross-origin.

  # Reject all other requests that are cross-site and not navigational
  return False
```

### Deploying a Resource Isolation Policy
The process of isolating your resources with Fetch Metadata is quite simple:
1. Install a module like the code snippet from above to log and monitor how your site behaves and if the restrictions would affect any legitimate traffic.
1. Fix potential violations by exempting legitimate cross-origin endpoints (e.g. loaded using CORS).
1. Enforce the policy by dropping non-compliant requests.

### Identifying and fixing policy violations
We recommend testing your policy in a side-effect free way by first enabling it in reporting mode in your server-side code. Alternatively, you can implement this logic in middleware, or in a reverse proxy which logs any violations that your policy might produce when applied to production traffic.
 
From our experience of rolling out a Fetch Metadata Resource Isolation Policy at Google, most applications are by default compatible with such a policy and rarely require exempting endpoints to allow cross-site traffic.

However there are a few legitimate cases that are safe to opt out:

- Endpoints meant to be accessed cross-origin - If your application is serving endpoints that are `CORS` enabled, you need to explicitly opt them out from resource isolation to ensure that cross-site requests to these endpoints are still possible.

-  Public resources (e.g. images, styles, etc) - Any public and unauthenticated resources that should be loadable cross-origin from other sites can be exempted as well. 

### Enforcing a Resource Isolation Policy
After you've checked that your policy doesn't impact legitimate production traffic, you're ready to start enforcing the restrictions, guaranteeing that other sites will not be able to request your resources, protecting your users from cross-site attacks.

{% Aside 'caution' %}
Make sure that you reject invalid requests before running authentication checks or any other processing of the request to prevent revealing sensitive timing information. 
{% endAside %}


## Further reading

- [W3C Fetch Metadata Request Headers specification](https://www.w3.org/TR/fetch-metadata/)
- [Google I/O - Securing Web Apps with Modern Platform Features](https://webappsec.dev/assets/pub/Google_IO-Securing_Web_Apps_with_Modern_Platform_Features.pdf)
- [Fetch Metadata Playground](https://secmetadata.appspot.com/)

