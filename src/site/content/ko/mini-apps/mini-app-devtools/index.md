---
layout: post
title: 미니앱의 개발자 도구
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  여러 미니앱 플랫폼들의 개발자 도구 경험에 대해서 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
  이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
  만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 개발자 경험

이제 미니앱 자체에 대해서 이해했으니, 여러 슈퍼앱 플랫폼들의 개발자 경험에 대해서 집중해봐요.
미니앱 개발은 슈퍼앱 플랫폼에 의해서 무료로 제공되는 IDE 위에서 개발돼요.
여러 플랫폼이 존재하지만, 여기에서는 가장 유명한 4사의 개발 경험과, 비교를 위해 QuickApp의 개발 경험에 대해서 이야기해볼게요.

## 미니앱 IDEs

슈퍼앱들이 그런 것처럼 대부분의 IDE 또한 중국어로만 제공돼요.
영문 버전은 최신 버전이 아닐 수도 있으니 중국어 버전을 설치하는 것을 권장해요.
macOS 개발자라면 어떤 앱들은 디지털 서명이 되어있지 않아 운영 체제에서 실행을 거부할 수도 있어요.
**본인의 책임 아래**, [Apple의 도움말](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac)을 따라 이를 묵인하고 실행할 수 있어요.

- [WeChat DevTools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [Alipay DevTools](https://render.alipay.com/p/f/fd-jwq8nu2a/pages/home/index.html)
- [Baidu DevTools](https://smartprogram.baidu.com/docs/develop/devtools/history/)
- [ByteDance DevTools](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/developer-instrument/developer-instrument-update-and-download)
- [Quick App DevTools](https://www.quickapp.cn/docCenter/IDEPublicity)

## 미니앱 시작 프로젝트

모든 슈퍼앱 제공자들은 다운로드하고 테스트해볼 수 있는 데모 앱들을 제공해요.
어떤 데모 앱들은 IDE의 New Project 생성 기능과 연동되어 있기도 해요.

- [WeChat demo](https://github.com/wechat-miniprogram/miniprogram-demo)
- [Alipay demo](https://opendocs.alipay.com/mini/introduce/demo)
- [Baidu demo](https://smartprogram.baidu.com/docs/develop/tutorial/demo/)
- [ByteDance demo](https://microapp.bytedance.com/docs/zh-CN/mini-app/introduction/plug-in/example)
- [Quick App demo](https://github.com/quickappcn/sample)

## 개발 과정

IDE와 (데모) 미니앱을 불러오거나 생성한 이후에는 대부분 로그인하는 것으로 시작해요.
이를 위해서는 로그인된 슈퍼 앱으로 IDE에서 생성해주는 QR 코드를 스캔하면 돼요.
아주 드물게 비밀번호를 입력해야할 수도 있어요.
로그인이 되고 나면 IDE에서 개인 정보를 인식해서 프로그래밍, 디버깅, 테스팅을 하거나 앱을 제출하고 리뷰를 받을 수 있어요.
다음 스크린샷으로 5개의 IDE에서 이를 하는 과정을 알아볼 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YvjvlB82SfPqHBl56Rz4.png", alt="WeChat DevTools application window showing simulator, code editor, and debugger.", width="800", height="463" %}
  <figcaption>
    WeChat 개발자 도구의 시뮬레이터, 에디터, 그리고 디버거.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iLbYZFZ9ec245segsIKk.png", alt="Alipay DevTools application window showing code editor, simulator, and debugger.", width="800", height="454" %}
  <figcaption>
    Alipay 개발자 도구의 에디터, 시뮬레이터, 그리고 디버거.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/svoq0p6GO1PCT0k0bdba.png", alt="Baidu DevTools application window showing simulator, code editor, and debugger.", width="800", height="540" %}
  <figcaption>
    Baidu 개발자 도구의 시뮬레이터, 에디터, 그리고 디버거.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/myapOcgYOwsEumeFbL3A.png", alt="ByteDance DevTools application window showing simulator, code editor, and debugger.", width="800", height="561" %}
  <figcaption>
    ByteDance 개발자 도구의 시뮬레이터, 에디터, 디버거.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dUsfozY82E2YhtlxNJz9.png", alt="Quick App DevTools application window showing code editor, simulator, and debugger.", width="800", height="485" %}
  <figcaption>
    QuickApp 개발자 도구의 에디터, 시뮬레이터, 그리고 디버거.
  </figcaption>
</figure>

위에서 확인할 수 있듯 모든 IDE들의 기본 요소들은 비슷해요.
거의 항상 [VS Code](https://github.com/Microsoft/vscode)에서도 사용하는 [Monaco Editor](https://microsoft.github.io/monaco-editor/) 기반의 코드 에디터가 있고,
[Chrome DevTools frontend](https://github.com/ChromeDevTools/devtools-frontend)에 기반한 디버거가 있어요.
IDE 자체는 [NW.js](https://nwjs.io/)나 [Electron](https://www.electronjs.org/) 앱으로 만들어져 있어요.
시뮬레이터는 [Chromium `<webview>` tag](https://www.electronjs.org/docs/api/webview-tag)에 기반한 [NW.js `<webview>` tag](https://docs.nwjs.io/en/latest/References/webview%20Tag/)나 [Electron `<webview>` tag](https://www.electronjs.org/docs/api/webview-tag)으로 만들어져 있어요.
IDE의 내부 구조에 대해서 궁금하다면, Chrome 개발자 도구를 여는 단축키인 <kbd>Control</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd> (Mac의 경우 <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>I</kbd>)로 간단하게 확인해볼 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yXcGmOhbi3xrcMIDhw1t.png", alt="Chrome DevTools used to inspect Baidu's DevTools showing the simulator's webview tag in the Chrome DevTools' Elements panel.", width="800", height="504" %}
  <figcaption>
    Baidu 개발자 도구를 Chrome 개발자 도구로 분석해보면 Electron <code>&lt;webview&gt;</code> 태그라는 것을 알 수 있어요.
  </figcaption>
</figure>

## 시뮬레이터, 실제 기기 테스팅, 그리고 디버깅

시뮬레이터는 우리가 알고 있는 Chrome 개발자 도구의 [Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)와 비슷해요.
서로 다른 안드로이드나 iOS 기기에서 테스트하고, 크기나 기기 방향을 바꿔보고, 다양한 네트워크 환경과 메모리 압축, 바코드 인식 이벤트, 예상치 못한 강제 종료, 그리고 다크 모드 등을 테스트할 수 있어요.

내장된 시뮬레이터만으로 앱이 어떤 느낌으로 동작할지 확인할 수 있지만, 실제 웹앱처럼 실 기기 테스팅 또한 필요해요.
개발 중인 미니앱은 QR 코드를 인식하는 것만으로 간단하게 테스트할 수 있어요.
예를 들어, ByteDance의 개발자 도구는 실시간으로 생성된 미니앱의 QR 코드를 스캔하는 것만으로 클라우드에서 미니앱을 다운 받아 테스트할 수 있게 해줘요.
ByteDance가 이를 구현한 방식은, QR 코드 자체의 URL([예시](https://t.zijieimg.com/JMvE5kM/?a=b))이 앱 호스팅 페이지로 리다이렉트되며 ([예시](https://s.pstatp.com/toutiao/resource/tma_c_reveal_fe/static/redirect.html?version=v2&app_id=ttb3d2c56f2ce8e78c&scene=0&version_type=preview&token=3605997583095982&start_page=pages%2Fcomponent%2Findex&url=%7B%22id%22%3A%22ttb3d2c56f2ce8e78c%22%2C%22name%22%3A%22%E5%90%8D%E7%A7%B0%E9%87%8D%E7%BD%AEttb3d2c56f2ce8e78c%22%2C%22icon%22%3A%22%22%2C%22url%22%3A%22https%3A%2F%2Fsf1-ttcdn-tos.pstatp.com%2Fobj%2Fdeveloper%2Fapp%2Fttb3d2c56f2ce8e78c%2Fpreview%2F%22%2C%22orientation%22%3A0%2C%22ttid%22%3A%226857810517176942605%22%2C%22state%22%3A1%2C%22type%22%3A1%2C%22tech_type%22%3A1%2C%22version%22%3A%22undefined%22%7D&tech_type=1&bdpsum=281c864)),
리다이렉트된 페이지에서 특정한 URI Scheme을 가지고 있는 방식이에요 (위의 예시의 경우 `snssdk1128://`).
이 URI Scheme으로 ByteDance의 슈퍼앱인 Douyin이나 Toutiao 같은 앱에서 즉시 미니앱을 실행할 수 있어요 ([예시](snssdk1128://microapp?version=v2&app_id=ttb3d2c56f2ce8e78c&scene=0&version_type=preview&token=3605997583095982&start_page=pages%2Fcomponent%2Findex&url=%7B%22id%22%3A%22ttb3d2c56f2ce8e78c%22%2C%22name%22%3A%22%E5%90%8D%E7%A7%B0%E9%87%8D%E7%BD%AEttb3d2c56f2ce8e78c%22%2C%22icon%22%3A%22%22%2C%22url%22%3A%22https%3A%2F%2Fsf1-ttcdn-tos.pstatp.com%2Fobj%2Fdeveloper%2Fapp%2Fttb3d2c56f2ce8e78c%2Fpreview%2F%22%2C%22orientation%22%3A0%2C%22ttid%22%3A%226857810517176942605%22%2C%22state%22%3A1%2C%22type%22%3A1%2C%22tech_type%22%3A1%2C%22version%22%3A%22undefined%22%7D&tech_type=1&bdpsum=281c864)).
다른 슈퍼앱 제공자는 미니앱 페이지로 가는 것이 아니라, 미리보기 화면을 바로 열어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/p0CrYvh00oAV9AUzeoU6.png", alt="ByteDance DevTools showing a QR code that the user can scan with the Douyin app to see the current mini app on their device.", width="800", height="551" %}
  <figcaption>
    ByteDance 개발자 도구에서 실 기기 테스팅을 위해 Douyin 앱으로 열 수 있는 QR 코드를 보여주는 모습
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/LNOqaa8z2Oo4CZPa48Bw.png", alt="Intermediate landing page for previewing a ByteDance mini app in various of the company's super apps, opened on a regular desktop browser for reverse-engineering the process.", width="800", height="433" %}
  <figcaption>
     미니앱을 미리보기로 보여주는 ByteDance 랜딩 페이지 (플로우를 보여주기 위해 데스크톱 브라우저로 확인함).
  </figcaption>
</figure>

더 강력한 기능은 클라우드 기반의 미리보기 원격 디버깅이에요.
IDE에서 생성된 QR 코드를 스캔하고 나면 미니앱이 실 기기에서 구동되고, 컴퓨터에서는 Chrome 개발자도구가 열려 원격으로 디버깅을 할 수 있어요.


<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/N5Crv3ryZ3bCNFMv7Lir.png", alt="A mobile phone running a mini app with parts of the UI highlighted by the ByteDance DevTools debugger running on a laptop inspecting it.", width="800", height="600" %}
  <figcaption>
    ByteDance 개발자 도구를 이용해 무선으로 미니앱을 디버이하는 모습
  </figcaption>
</figure>

## 디버거

### 요소 디버깅

미니앱의 디버깅 경험은 Chrome 개발자 도구로 디버깅을 해본 사람이라면 익숙한 경험이에요.
하지만 미니앱 개발의 워크플로우를 위해 변경된 아주 중요한 몇 가지 차이점들이 있어요.
Chrome 개발자 도구의 [Elements panel](https://developer.chrome.com/docs/devtools/#elements) 대신,
미니앱들은 자신들의 고유 HTML 방언을 사용하는 커스텀 패널이 존재해요.
예를 들어, WeChat의 경우 그 방언을 [Wxml](https://developers.weixin.qq.com/miniprogram/en/dev/framework/view/wxml/)(WeiXin Markup Language)이라고 불러요.
Baidu의 경우 [Swan Element](https://smartprogram.baidu.com/docs/develop/framework/dev/)라고 하며, ByteDance의 경우
[Bxml](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/mini-app-framework/view/ttml)이라고 해요.
Alipay는 [AXML](https://opendocs.alipay.com/mini/framework/axml)라고 하고, QuickApp의 경우는 그 패널을 단순히 [UX](https://doc.quickapp.cn/tutorial/framework/for.html)라고 해줘요
이 마크업 언어들에 대해서는 [추후에](/mini-app-markup-styling-and-scripting/#markup-languages) 다룰게요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/k1FO68wZhzpRNvQl2bN3.png", alt="Inspecting an image with WeChat DevTools' 'Wxml' panel. It shows that the tag in use is an `image` tag.", width="800", height="572" %}
  <figcaption>
    <code>&lt;image&gt;</code>를 WeChat 개발자 도구로 분석하는 모습
  </figcaption>
</figure>

### 커스텀 요소들의 기반

WebView를 [about://inspect/#devices](about://inspect/#devices) 페이지를 통해 실 기기로 분석해보면 WeChat 개발자 도구의 숨겨진 비밀을 알 수 있어요.
WeChat 개발자 도구에서 `<image>`라고 나온 엘리먼트가 사실은 `<wx-image>`라는 커스텀 요소이고 그 요소는 `<div>`를 유일한 자식 요소로 가지고 있어요.
신기하게도, 이 요소들은 [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)을 사용하지 않아요. 이 컴포넌트들에 대해서는 [추후에](/mini-app-components/) 더 다룰게요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/on9Ty46RyteTI6QTc2vk.png", alt="Inspecting a WeChat mini app running on a real device with Chrome DevTools. Where WeChat DevTools reported I am looking at an `image` tag, Chrome DevTools reveals I am actually dealing with a `wx-image` custom element.", width="800", height="385" %}
  <figcaption>
    <code>&lt;image&gt;</code> 요소를 WeChat 개발자 도구로 분석해보면 사실은 <code>&lt;wx-image&gt;</code> 요소라는 것을 알 수 있어요.
  </figcaption>
</figure>

### CSS 디버깅

또 다른 차이점은, CSS의 여러 방언에 새로운 길이 단위인 `rpx`(반응형 픽셀; Responsive Pixel)가 존재한다는 점이에요. 
WeChat 개발자 도구는 기기에 영향을 받지 않는 CSS 길이 단위를 이용해 서로 다른 기기에서 개발을 해도 직관적인 개발 경험을 줘요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bf4YBcscBzbmQtJig7Ij.png", alt="Inspecting a view with a specified top and bottom padding of `200rpx` in WeChat DevTools.", width="800", height="486" %}
  <figcaption>
    반응형 픽셀 (<code>200rpx 0</code>)의 패딩을 WeChat DevTools로 분석하는 모습.
  </figcaption>
</figure>

## 퍼포먼스 분석

퍼포먼스는 미니앱의 최전방이자 중심이에요. 때문에 WeChat 개발자 도구를 비롯한 여러 개발자 도구들은 Lighthouse와 유사한 성능 측정 도구를 제공해요.
주 관심 분야는 Total, Performance, Experience, 그리고 Best Practice예요.
IDE 내 모습은 조금씩 다를 수 있어요.
아래 스크린샷에서는 코드 에디터를 잠시 가려서 분석 도구가 크게 보일 수 있도록 했어요.


<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/q8Rze6pR9mpDXw9VCaEs.png", alt="Running a performance audit with the built-in audit tool. The scores show Total, Performance, Experience, and Best Practice, each 100 out of 100 points.", width="800", height="485" %}
  <figcaption>
    WeChat 개발자 도구에 내장되어 Total, Performance, Experience, 그리고 Best Practice를 보여주는 분석 도구
  </figcaption>
</figure>

## 가상 API

별도의 서비스를 설정하지 않고 WeChat 개발자 도구 안에서 API 응답을 가상으로 구성할 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/olJmRvdl0zkoWZiiOkiP.png", alt="Setting up a mock response for an API endpoint in WeChat DevTools.", width="800", height="485" %}
  <figcaption>
    WeChat 개발자 도구의 가상 API 도구
  </figcaption>
</figure>

{% Aside 'success' %}
  [다음 글](/mini-app-markup-styling-and-scripting/)에서 미니앱의 마크업, 스타일링, 그리고 스크립팅에 대해서 알아봐요.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
