---
layout: post
title: 중요한 CSS 추출
subhead: 중요한 CSS 기술로 렌더링 시간을 개선하는 방법을 알아보세요.
authors:
  - mihajlija
date: 2019-05-29
hero: image/admin/ZC6iWHhgnrSZtPJMfwMh.jpg
alt: 렌치와 드라이버를 진열한 사진.
description: |2

  중요한 CSS 기술로 렌더링 시간을 개선하는 방법과 프로젝트에 가장 적합한 도구를 선택하는 방법에 대해 알아보세요.
codelabs: codelab-extract-and-inline-critical-css
tags:
  - blog
  - performance
  - css
---

브라우저는 페이지를 표시하기 전에 CSS 파일을 다운로드하고 구문 분석해야 CSS를 렌더링 차단 리소스로 만듭니다. CSS 파일이 크거나 네트워크 상태가 좋지 않은 경우 CSS 파일을 요청하면 웹 페이지가 렌더링되는 데 걸리는 시간이 크게 늘어날 수 있습니다.

{% Aside 'key-term' %} Critical CSS는 사용자에게 가능한 한 빨리 콘텐츠를 렌더링하기 위해 스크롤 없이 볼 수 있는 콘텐츠에 대한 CSS를 추출하는 기술입니다. {% endAside %}

<figure>{% Img src="image/admin/t3Kkvh265zi6naTBga41.png", alt="웹페이지가 화면 가장자리를 넘고 있는 노트북 및 모바일 장치의 그림", width="800", height="469", class ="" %}</figure>

{% Aside 'note' %} 스크롤 없이 볼 수 있는 부분은 스크롤하기 전 페이지 로드 시 뷰어가 보는 모든 콘텐츠입니다. 무수히 많은 장치와 화면 크기가 있기 때문에 스크롤 없이 볼 수 있는 콘텐츠 이상으로 간주되는 보편적으로 정의된 픽셀 높이는 없습니다. {% endAside %}

`<head>`에서 추출된 스타일을 인라인하면 이러한 스타일을 가져오기 위해 추가로 요청할 필요가 없습니다. CSS의 나머지 부분은 비동기식으로 로드할 수 있습니다.

<figure>{% Img src="image/admin/RVU3OphqtjlkrlAtKLEn.png", alt="머리에 인라인된 중요한 CSS가 있는 HTML 파일", width="800", height="325" %}<figcaption> 인라인 중요 CSS</figcaption></figure>

렌더링 시간을 개선하면 특히 열악한 네트워크 조건에서 [인지된 성능](/rail/#focus-on-the-user)에 큰 차이를 만들 수 있습니다. 모바일 네트워크에서는 대역폭에 관계없이 높은 대기 시간이 문제입니다.

<figure>{% Img src="image/admin/NdQz49RVgdHoh3Fff0yr.png", alt="3G 연결에서 렌더링 차단 CSS가 있는 페이지(상단)와 인라인 중요 CSS가 있는 동일한 페이지(하단)를 로드하는 필름 스트립 보기 비교. 맨 위로 필름 스트립은 최종적으로 콘텐츠를 표시하기 전에 6개의 빈 프레임을 표시합니다. 하단 필름 스트립은 첫 번째 프레임에 의미 있는 콘텐츠를 표시합니다.", width="800", height="363" %}<figcaption> 3G 연결에서 렌더링 차단 CSS가 있는 페이지(상단)와 인라인 중요 CSS가 있는 동일한 페이지(하단) 로드 비교</figcaption></figure>

[FCP(First Contentful Paint)](/fcp/)가 불량하고 Lighthouse 감사에서 "렌더링 차단 리소스 제거" 기회가 표시되는 경우 중요 CSS를 사용하는 것이 좋습니다.

{% Img src="image/admin/0xea7menL90lWHwbjZoP.png", alt="'렌더 차단 리소스 제거' 또는 '사용하지 않는 CSS 연기' 기회를 사용한 Lighthouse 감사", width="743", height="449" %}

{% Aside 'gotchas' %} 많은 양의 CSS를 인라인하면 HTML 문서의 나머지 부분의 전송이 지연된다는 점에 유의하세요. 모든 것이 우선시되면 아무것도 아닙니다. 인라인은 또한 브라우저가 후속 페이지 로드에서 재사용하기 위해 CSS를 캐싱하는 것을 방지한다는 점에서 몇 가지 단점이 있으므로 드물게 사용하는 것이 가장 좋습니다. {% endAside %}

<p id="14KB">첫 번째 렌더링 왕복 횟수를 최소화하려면 스크롤 없이 볼 수 있는 콘텐츠를 <strong>14KB</strong> (압축) 미만으로 유지하는 것을 목표로 합니다.</p>

{% Aside 'note' %} 새로운 [TCP](https://hpbn.co/building-blocks-of-tcp/) 연결은 클라이언트와 서버 사이에서 사용 가능한 전체 대역폭을 즉시 사용할 수 없으며, 모두 연결할 수 있는 것보다 많은 데이터로 연결에 과부하가 걸리는 것을 피하기 위해 [느린 시작](https://hpbn.co/building-blocks-of-tcp/#slow-start)을 거칩니다. 이 과정에서 서버는 적은 양의 데이터로 전송을 시작하고, 완벽한 상태로 클라이언트에 도달하면 다음 왕복에서 양의 2배가 된다. 대부분의 서버에서 첫 번째 왕복에서 전송할 수 있는 최대 크기는 패킷 10개 또는 약 14KB입니다. {% endAside %}

이 기술로 달성할 수 있는 성능 영향은 웹사이트 유형에 따라 다릅니다. 일반적으로 사이트에 CSS가 많을수록 인라인 CSS의 영향도 커집니다.

## 도구 개요

페이지의 중요한 CSS를 자동으로 결정할 수 있는 훌륭한 도구가 많이 있습니다. 이 작업을 수동으로 수행하는 것은 지루한 프로세스이기 때문에 이것은 좋은 소식입니다. 뷰포트의 각 요소에 적용되는 스타일을 결정하려면 전체 DOM을 분석해야 합니다.

### Critical

[Critical](https://github.com/addyosmani/critical)은 스크롤 없이 볼 수 있는 CSS를 추출, 축소 및 인라인하며 [npm 모듈](https://www.npmjs.com/package/critical)로 사용할 수 있습니다. Gulp(직접) 또는 Grunt([플러그인](https://github.com/bezoerb/grunt-critical))와 함께 사용할 수 있으며 [webpack 플러그인](https://github.com/anthonygore/html-critical-webpack-plugin)도 있습니다.

프로세스에서 많은 생각을 필요로 하는 간단한 도구입니다. 스타일시트를 지정할 필요도 없습니다. Critical은 자동으로 스타일시트를 감지합니다. 또한 여러 화면 해상도에 대해 중요한 CSS 추출을 지원합니다.

### criticalCSS

[CriticalCSS](https://github.com/filamentgroup/criticalCSS) 는 스크롤 없이 볼 수 있는 CSS를 추출하는 또 다른 [npm 모듈입니다.](https://www.npmjs.com/package/criticalcss) CLI로도 사용 가능합니다.

중요한 CSS를 인라인하고 축소하는 옵션은 없지만 실제로 중요한 CSS에 속하지 않는 규칙을 강제로 포함할 수 있고 `@font-face` 선언을 포함하는 것에 대해 더 세부적으로 제어할 수 있습니다.

### Penthouse

[Penthouse](https://github.com/pocketjoso/penthouse)는 사이트나 앱에 DOM에 동적으로 주입되는 많은 수의 스타일이나 스타일이 있는 경우에 좋은 선택입니다(Angular 앱에서 일반적). 내부적으로 [Puppeteer](https://github.com/GoogleChrome/puppeteer)를 사용 하며 [온라인 호스팅 버전](https://jonassebastianohlsson.com/criticalpathcssgenerator/)도 제공합니다.

Penthouse는 스타일시트를 자동으로 감지하지 않으므로 중요한 CSS를 생성할 HTML 및 CSS 파일을 지정해야 합니다. 장점은 많은 작업을 병렬로 실행하는 데 좋습니다.
