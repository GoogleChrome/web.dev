---
layout: post
title: 네트워크 페이로드 축소 및 압축
authors:
  - houssein
date: 2018-11-05
description: 웹 페이지의 성능을 향상시키는 데 사용할 수 있는 두 가지 유용한 기술인 축소 및 데이터 압축이 있습니다. 이 두 가지 기술을 통합하면 페이로드 크기가 줄어들고 결과적으로 페이지 로드 시간이 단축됩니다.
codelabs:
  - codelab-text-compression
  - codelab-text-compression-brotli
tags:
  - performance
---

웹 페이지의 성능을 향상시키는 데 사용할 수 있는 두 가지 유용한 기술이 있습니다.

- 축소
- 데이터 압축

이 두 기술을 모두 통합하면 페이로드 크기가 줄어들고 페이지 로드 시간이 향상됩니다.

## 측정

Lighthouse는 페이지에서 축소할 수 있는 CSS 또는 JS 리소스를 감지하면 실패한 감사를 표시합니다.

{% Img src="image/admin/ZT9ESeCStegt0SklYbni.png", alt="Lighthouse CSS 감사 축소", width="800", height="90" %}

{% Img src="image/admin/vDaAnUSvQxmGcoasQj1k.png", alt="Lighthouse Minify JS 감사", width="800", height="112" %}

또한 압축되지 않은 자산에 대해 감사합니다.

{% Img src="image/admin/xfqzdLuu3w3lanxo5Ggc.png", alt="Lighthouse: 텍스트 압축 사용", width="800", height="123" %}

## 축소

축소는 더 작지만 완벽하게 유효한 코드 파일을 만드는 데 필요하지 않은 공백과 모든 코드를 제거하는 프로세스입니다. <a>Terser</a>는 널리 사용되는 JavaScript 압축 도구입니다. [webpack](https://webpack.js.org/) v4에는 기본적으로 이 라이브러리에 대한 플러그인이 포함되어 있어 축소된 빌드 파일을 생성합니다.

- webpack v4 이상을 사용 중이라면 추가 작업 없이 진행하는 것이 좋습니다. 👍
- 이전 버전의 웹팩을 사용하는 경우 웹팩 구성 설정에 `TerserWebpackPlugin`을 설치하고 포함합니다. [설명서](https://webpack.js.org/plugins/terser-webpack-plugin/)를 따라 방법을 알아보세요.
- `Terser`를 사용하지 않는 경우 Terser를 CLI 도구로 사용하거나 애플리케이션에 대한 종속성으로 직접 포함하십시오. 프로젝트 [문서](https://github.com/terser-js/terser)에 지침이 나와 있습니다.

## 데이터 압축

**압축**은 압축 알고리즘을 사용하여 데이터를 수정하는 프로세스입니다. [Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s)은 서버 및 클라이언트 상호 작용에 가장 널리 사용되는 압축 형식입니다. [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html)는 Gzip보다 훨씬 더 나은 압축 결과를 제공할 수 있는 최신 압축 알고리즘입니다.

{% Aside %} 파일을 압축하면 웹페이지의 성능이 크게 향상될 수 있지만 직접 압축할 필요는 거의 없습니다. 많은 호스팅 플랫폼, CDN 및 역방향 프록시 서버는 기본적으로 압축을 사용하여 자산을 인코딩하거나 쉽게 구성할 수 있습니다. 자체 솔루션을 출시하기 전에 압축이 이미 지원되는지 확인하려면 사용 중인 도구에 대한 설명서를 읽으십시오. {% endAside %}

브라우저로 보낸 파일을 압축하는 방법에는 두 가지가 있습니다.

- 동적으로
- 정적으로

두 접근 방식 모두 다음 섹션에서 다룰 고유한 장점과 단점이 있습니다. 애플리케이션에 가장 적합한 것을 사용하십시오.

## 동적 압축

이 프로세스에는 브라우저에서 요청할 때 자산을 즉석에서 압축하는 작업이 포함됩니다. 이것은 수동으로 또는 빌드 프로세스를 사용하여 파일을 압축하는 것보다 간단할 수 있지만 높은 압축 수준을 사용하는 경우 지연이 발생할 수 있습니다.

[Express](https://expressjs.com/)는 Node용으로 널리 사용되는 웹 프레임워크이며 [압축](https://github.com/expressjs/compression) 미들웨어 라이브러리를 제공합니다. 요청 시 자산을 압축하는 데 사용합니다. 다음은 올바르게 사용하는 전체 서버 파일의 예입니다.

```js/5
const express = require('express');
const compression = require('compression');

const app = express();

app.use(compression());

app.use(express.static('public'));

const listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});
```

`gzip`를 사용하여 자산을 압축합니다. 웹 서버가 지원하는 경우 더 나은 압축 비율을 달성하기 위해 Brotli를 통해 압축하기 위해 [Shrink-ray](https://github.com/aickin/shrink-ray#readme)와 같은 별도의 모듈을 사용하는 것이 좋습니다.

{% Aside 'codelab' %} express.js를 사용하여 [gzip](/codelab-text-compression) 및 [Brotli](/codelab-text-compression-brotli)로 자산을 압축합니다. {% endAside %}

## 정적 압축

정적 압축에는 미리 자산을 압축하고 저장하는 작업이 포함됩니다. 이렇게 하면 특히 높은 압축 수준을 사용하는 경우 빌드 프로세스가 더 오래 걸릴 수 있지만 브라우저가 압축된 리소스를 가져올 때 지연이 발생하지 않습니다.

웹 서버가 Brotli를 지원하는 경우 [웹팩](https://github.com/mynameiswhm/brotli-webpack-plugin)과 함께 BrotliWebpackPlugin과 같은 플러그인을 사용하여 빌드 단계의 일부로 자산을 압축합니다. 그렇지 않으면 [CompressionPlugin](https://github.com/webpack-contrib/compression-webpack-plugin)을 사용하여 gzip으로 자산을 압축합니다. webpack 구성 파일에 다른 플러그인과 마찬가지로 포함될 수 있습니다.

```js/4
module.exports = {
	//...
	plugins: [
		//...
		new CompressionPlugin()
	]
}
```

압축 파일이 빌드 폴더의 일부가 되면 서버에서 모든 JS 끝점을 처리하여 압축 파일을 제공하는 경로를 만듭니다. 다음은 gzip으로 압축된 자산에 대해 Node 및 Express로 이를 수행하는 방법의 예입니다.

<pre>const express = require('express');
const app = express();

&lt;strong&gt;app.get('*.js', (req, res, next) =&gt; {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});&lt;/strong&gt;

app.use(express.static('public'));
</pre>
