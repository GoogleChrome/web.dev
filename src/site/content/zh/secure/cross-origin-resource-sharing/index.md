---
layout: post
title: 跨域资源共享 (CORS)
subhead: 安全共享跨域资源
authors:
  - kosamari
date: 2018-11-05
description: 浏览器的同源策略阻止了浏览器读取不同源的资源。这种机制能够阻止恶意网站读取另一个网站的数据，但也会阻碍合法使用。如果您希望获取其他国家的天气数据该怎么办？启用 CORS 可以让服务器告知浏览器自己已获许使用其他源。
tags:
  - security
---

浏览器的同源策略阻止了浏览器读取不同源的资源。这种机制能够阻止恶意网站读取另一个网站的数据，但也会阻碍合法使用。如果您希望获取其他国家的天气数据该怎么办？

在现代网络应用程序中，应用程序通常希望从不同源获取资源。例如，您想要从不同的域读取 JSON 数据或者将另一个网站的图像加载到`<canvas>`元素中。

换句话说，部分**公共资源**应该可以供任何人读取，但同源策略会阻碍这一点。开发者使用过诸如 [JSONP](https://stackoverflow.com/questions/2067472/what-is-jsonp-all-about) 之类的变通方法，但**跨域资源共享 (CORS)** 能够通过标准方式修复此问题。

启用 **CORS** 可以让服务器告知浏览器自己已获许使用其他源。

## 资源请求在网络上是如何运作的？

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8J6A0Bk5YXdvyoj8HVzs.png", alt="请求和响应", width="668", height="327" %}<figcaption>图：客户端请求和服务器响应图示</figcaption></figure>

浏览器和服务器可以使用**超文本传输协议** (HTTP) 来通过网络交换数据。HTTP 定义了请求者和响应者之间的通信规则，其中包括获取资源所需的信息。

HTTP 标头用于协商客户端和服务器之间的消息交换类型，并用于确定访问权限。浏览器的请求和服务器的响应消息都分为两部分：**标头**和**主体**：

### 标头

包含消息的相关信息，例如消息类型或消息编码。标头可以包括[各种信息](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)，这些信息通过键值对表示。请求头和响应头包含不同的信息。

{% Aside %}请务必注意，标头不能包含评论。{% endAside %}

**请求头示例**

```text
Accept: text/html
Cookie: Version=1
```

以上内容相当于表示“我希望收到 HTML 的响应。这是我的一个 cookie。”

**响应头示例**

```text
Content-Encoding: gzip
Cache-Control: no-store
```

以上内容相当于表示“数据是用 gzip 编码的。请不要将其缓存。”

### 主体

消息本身。主体可以是纯文本、二进制图像、JSON、HTML 等。

## CORS 是如何运作的？

请记住，同源策略会让浏览器阻止跨域请求。当您想从不同的源获取公共资源时，提供资源的服务器需要告知浏览器“发出该请求的这个源可以访问我的资源”。浏览器会记住这一点，并允许跨域资源共享。

### 第一步：客户端（浏览器）请求

当浏览器发出跨域请求时，该浏览器会添加一个包含当前源（协议、主机和端口）的`Origin`标头。

### 第二步：服务器响应

在服务器端，当服务器看到该标头并想要允许访问时，就需要在响应中加入一个`Access-Control-Allow-Origin`标头来指定请求源（或加入`*`来允许任何源。）

### 第三步：浏览器接收响应

当浏览器看到带有相应`Access-Control-Allow-Origin`标头的响应时，即允许与客户端网站共享响应数据。

## 查看 CORS 的实际应用

这是一个使用 Express 的小型网络服务器。

{% Glitch { id: 'cors-demo', path: 'server.js', height: 480 } %}

第一个端点（第 8 行）没有设置任何响应头，该端点只会在响应中发送一个文件。

{% Instruction 'devtools' %} {% Instruction 'devtools-console', 'ul' %}

- 请尝试以下命令：

```js
fetch('https://cors-demo.glitch.me/', {mode:'cors'})
```

您应该会看到一条错误消息：

```bash
请求已被 CORS 策略阻止：所请求的资源上无
'Access-Control-Allow-Origin'标头。
```

第二个端点（第 13 行）在响应中发送的是相同的文件，但在标头中加入了`Access-Control-Allow-Origin: *`。请在控制台中尝试：

```js
fetch('https://cors-demo.glitch.me/allow-cors', {mode:'cors'})
```

您的此次请求应该不会被阻止。

## 通过 CORS 共享凭据

出于隐私原因，CORS 通常用于“匿名请求”，即不识别请求方的请求。如果您想在使用 CORS 时发送 cookie（这样会识别发送者），就需要在请求和响应中添加额外的标头。

### 请求

请将`credentials: 'include'`添加到如下所示的获取选项中。该操作将包括请求中的 cookie。

```js
fetch('https://example.com', {
  mode: 'cors',
  credentials: 'include'
})
```

### 响应

必须将`Access-Control-Allow-Origin`设置给一个特定的源（没有使用`*`通配符），并且必须将`Access-Control-Allow-Credentials`设置为`true`。

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

## 复杂 HTTP 调用的预检请求

如果某个网络应用程序需要复杂的 HTTP 请求，那么浏览器会在请求链的前端添加一个**[预检请求](https://developer.mozilla.org/docs/Web/HTTP/CORS#preflighted_requests)**。

CORS 规范将**复杂请求**定义为

- 使用除 GET、POST 或 HEAD 以外方法的请求
- 包含除`Accept`、`Accept-Language`或`Content-Language`以外标头的请求
- 具有除`application/x-www-form-urlencoded`、`multipart/form-data`或`text/plain`以外的`Content-Type`标头的请求

浏览器会根据需要创建预检请求。如下所示，该请求是一个`OPTIONS`请求，会在实际请求消息之前被发送。

```text
OPTIONS /data HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: DELETE
```

在服务器端，应用程序在响应预检请求时需要提供程序从该源接受的方法的相关信息。

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, DELETE, HEAD, OPTIONS
```

服务器响应还可以包含一个`Access-Control-Max-Age`标头，用于指定缓存预检结果的持续时间（以秒为单位），这样客户端就无需在每次发送复杂请求时都发出预检请求了。
