---
title: 로컬 개발에 HTTPS를 사용하는 방법
subhead: 때때로 HTTPS를 사용하여 로컬 개발 사이트를 실행해야 합니다. 이를 안전하고 신속하게 수행하기 위한 도구 및 팁.
authors:
  - maudn
date: 2021-01-25
hero: image/admin/ZvW6VM0GEScldWHBvXJ4.jpg
thumbnail: image/admin/OG8YksgOnzGfnurzncWO.jpg
tags:
  - blog
  - security
---

{% Aside 'caution' %} 대부분의 경우 `http://localhost`는 필요한 작업을 수행합니다. 브라우저에서는 대부분 HTTPS 🔒처럼 작동합니다. 배포된 HTTP 사이트에서 작동하지 않는 일부 API가 `http://localhost`에서 작동하기 때문입니다.

이것이 의미하는 바는 사용자 지정 호스트 이름 또는 브라우저 간 보안 쿠키와 같은 **특별한 경우에만** 로컬에서 HTTPS를 사용해야 한다는 것입니다([로컬 개발을 위해 HTTPS를 사용하는 경우](/when-to-use-local-https) 참조). 해당하는 경우 계속 읽으십시오! {% endAside %}

*이 게시물에서 `localhost`에 대한 진술은 `127.0.0.1` 및 `[::1]`에도 유효합니다. 둘 다 "루프백 주소"라 하는 로컬 컴퓨터 주소를 설명하기 때문입니다. 또한 이를 간소화하기 위해 포트 번호를 지정하지 않습니다.**따라서 `http://localhost`가 표시될 경우, `http://localhost:{PORT}` 또는 `http://127.0.0.1:{PORT}`로 읽습니다.*

프로덕션 웹 사이트에서 HTTPS를 사용하는 경우 로컬 개발 사이트가 **HTTPS 사이트처럼** 작동하기를 원합니다(프로덕션 웹 사이트에서 HTTPS를 사용하지 않는 경우 [HTTPS로 전환하는 것을 우선 순위로 지정](/why-https-matters/)). 대부분의 경우 `http://localhost`가 **HTTPS 사이트처럼** 작동할 것으로 여길 수 있습니다. 그러나 [일부 경우에서](/when-to-use-local-https) HTTPS를 사용하여 로컬에서 사이트를 실행해야 합니다. 이 작업을 수행하는 방법을 살펴보겠습니다.

**⏩ 빠른 지침을 찾고 있습니까, 아니면 전에 여기에 와본 적이 있습니까? [Cheatsheet](#using-mkcert-cheatsheet)로 건너뛰십시오.**

## mkcert를 사용하여 HTTPS로 로컬에서 사이트 실행(권장)

로컬 개발 사이트에서 HTTPS를 사용하고 `https://localhost` 또는 `https://mysite.example`(사용자 지정 호스트 이름)에 액세스하려면 [TLS 인증서](https://en.wikipedia.org/wiki/Public_key_certificate#TLS/SSL_server_certificate)가 필요합니다. 그러나 브라우저는 어떤 인증서도 유효한 것으로 간주하지 않습니다. 인증서는 신뢰할 수 있는 **[인증 기관(CA)](https://en.wikipedia.org/wiki/Certificate_authority)**이라 부르는 브라우저가 신뢰하는 실체에 의해 **서명**되어야 합니다.

사용자가 할 일은 인증서를 생성하고 장치와 브라우저가 **로컬로 신뢰**하는 CA를 사용하여 서명하는 것입니다. [mkcert](https://github.com/FiloSottile/mkcert)는 몇 가지 명령으로 이를 수행하는 데 도움이 되는 도구입니다. 작동 방법은 다음과 같습니다.

- HTTPS를 사용하여 브라우저에서 로컬로 실행되는 사이트를 열면 브라우저가 로컬 개발 서버의 인증서를 확인합니다.
- 인증서가 mkcert 생성 인증 기관에 의해 서명되었음을 확인하면 브라우저는 해당 인증서가 신뢰할 수 있는 인증 기관으로 등록되었는지 확인합니다.
- mkcert는 신뢰할 수 있는 기관으로 등재되어 있으므로 브라우저가 인증서를 신뢰하고 HTTPS 연결을 만듭니다.

<figure>{% Img src="image/admin/3kdjci7NORnOw54fMia9.jpg", alt="mkcert 작동 방식 다이어그램.", width="800", height="787" %} <figcaption>mkcert 작동 방식 다이어그램.</figcaption></figure>

mkcert(및 유사 도구)는 다음과 같은 몇 가지 이점을 제공합니다.

- mkcert는 **브라우저가 유효한 인증서로 간주하는 것과 호환되는** 인증서를 생성하는 데 특화되어 있습니다. 요구 사항 및 모범 사례에 맞게 계속 업데이트됩니다. 이러한 이유로 올바른 인증서를 생성하기 위해 복잡한 구성이나 인수로 mkcert 명령을 실행할 필요가 없습니다!
- mkcert는 교차 플랫폼 도구입니다. 팀원 누구나 사용할 수 있습니다.

mkcert는 로컬 개발을 위한 TLS 인증서 생성에 권장하는 도구입니다. [다른 옵션](#running-your-site-locally-with-https-other-options)도 확인할 수 있습니다.

많은 운영 체제에는 [openssl](https://www.openssl.org/)과 같은 인증서를 생성하는 라이브러리가 포함되어 있을 수 있습니다. mkcert 및 이와 유사한 도구와 달리 이러한 라이브러리는 올바른 인증서를 일관되게 생성하지 않을 수 있고 복잡한 명령을 실행해야 할 수 있으며 반드시 교차 플랫폼일 필요는 없습니다.

{% Aside 'gotchas' %} 우리가 이 게시물에서 관심을 갖고 있는 mkcert는 [이것](https://www.npmjs.com/package/mkcert)이 아니라 [이것](https://github.com/FiloSottile/mkcert)입니다. {% endAside %}

### 주의

{% Aside 'caution' %}

- `mkcert -install` 실행 시 `rootCA-key.pem` mkcert가 자동으로 생성하는 파일을 내보내거나 공유하지 마십시오. **이 파일을 장악한 공격자는 사용자가 방문할 수 있는 모든 사이트에 대해 경로 내 공격을 생성할 수 있습니다** . 공격자는 사용자 컴퓨터에서 은행, 의료 서비스 제공자 또는 소셜 네트워크와 같은 모든 사이트에 대한 보안 요청을 가로챌 수 있습니다. `rootCA-key.pem`이 안전한 위치에 있는지 확인해야 하는 경우 `mkcert -CAROOT`을 실행하십시오.
- **개발 목적**으로만 mkcert를 사용하고, 확장하여 최종 사용자에게 mkcert 명령을 실행하도록 요청하지 마십시오.
- 개발 팀: 팀의 모든 구성원은 mkcert를 **별도로** 설치하고 실행해야 합니다(CA 및 인증서를 저장 및 공유하지 않음).

{% endAside %}

### 설정

1. mkcert를 설치합니다(한 번만).

    운영 체제에 mkcert를 설치하는 [지침](https://github.com/FiloSottile/mkcert#installation)을 따르십시오. 예를 들어 macOS에서는 다음 지침을 따르십시오.

    ```bash
    brew install mkcert
    brew install nss # if you use Firefox
    ```

2. 로컬 루트 CA에 mkcert를 추가합니다.

    터미널에서 다음 명령을 실행합니다.

    ```bash
    mkcert -install
    ```

    그러면 로컬 인증 기관(CA)이 생성됩니다. mkcert 생성 로컬 CA는 기기에서 **로컬**로만 신뢰할 수 있습니다.

3. mkcert에서 서명한 사이트에 대한 인증서를 생성합니다.

    터미널에서 사이트의 루트 디렉터리 또는 인증서를 배치할 디렉터리로 이동합니다.

    그런 다음, 다음을 실행합니다.

    ```bash
    mkcert localhost
    ```

    `mysite.example`과 같은 사용자 지정 호스트 이름을 사용하는 경우 다음을 실행합니다.

    ```bash
    mkcert mysite.example
    ```

    위의 명령은 다음과 같은 두 가지 작업을 수행합니다.

    - 지정한 호스트 이름에 대한 인증서를 생성합니다.
    - mkcert(2단계에서 로컬 CA로 추가)가 이 인증서에 서명하도록 합니다.

    이제 인증서가 준비되었으며 브라우저가 로컬로 신뢰하는 인증 기관에 의해 서명되었습니다. 거의 완료되었지만 서버가 아직 인증서에 대해 알지 못합니다!

4. 서버를 구성합니다.

    이제 서버에 HTTPS를 사용하고(개발 서버는 기본적으로 HTTP를 사용하는 경향이 있으므로) 방금 전에 생성한 TLS 인증서를 사용하도록 지시해야 합니다.

    이 작업을 수행하는 방법은 서버에 따라 다릅니다. 몇 가지 예:

    **👩🏻‍💻 노드 사용:**

    `server.js` (`{PATH/TO/CERTIFICATE...}` 및 `{PORT}` 대체):

    ```javascript
    const https = require('https');
    const fs = require('fs');
    const options = {
      key: fs.readFileSync('{PATH/TO/CERTIFICATE-KEY-FILENAME}.pem'),
      cert: fs.readFileSync('{PATH/TO/CERTIFICATE-FILENAME}.pem'),
    };
    https
      .createServer(options, function (req, res) {
        // server code
      })
      .listen({PORT});
    ```

    **👩🏻‍💻 [http 서버](https://www.npmjs.com/package/http-server) 사용:**

    다음과 같이 서버를 시작합니다(`{PATH/TO/CERTIFICATE...}` 대체).

    ```bash
    http-server -S -C {PATH/TO/CERTIFICATE-FILENAME}.pem -K {PATH/TO/CERTIFICATE-KEY-FILENAME}.pem
    ```

    `-S`는 HTTPS로 서버를 실행하고 `-C`는 인증서를 설정하고 `-K`는 키를 설정합니다.

    **👩🏻‍💻 React 개발 서버 사용:**

    `package.json`을 다음과 같이 편집하고 `{PATH/TO/CERTIFICATE...}`를 대체합니다.

    ```json
    "scripts": {
    "start": "HTTPS=true SSL_CRT_FILE={PATH/TO/CERTIFICATE-FILENAME}.pem SSL_KEY_FILE={PATH/TO/CERTIFICATE-KEY-FILENAME}.pem react-scripts start"
    ```

    예를 들어, 다음과 같이 사이트의 루트 디렉터리에 있는 `localhost`에 대한 인증서를 생성한 경우:

    ```text
    |-- my-react-app
        |-- package.json
        |-- localhost.pem
        |-- localhost-key.pem
        |--...
    ```

    `start` 스크립트는 다음과 같이 표시되어야 합니다.

    ```json
    "scripts": {
        "start": "HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem react-scripts start"
    ```

    **👩🏻‍💻 다른 예:**

    - [앵귤러 개발 서버](https://angular.io/cli/serve)
    - [파이썬](https://blog.anvileight.com/posts/simple-python-http-server/)

5. ✨ 작업을 완료했습니다! 브라우저에서 `https://localhost` 또는 `https://mysite.example`을 엽니다. HTTPS를 사용하여 로컬에서 사이트를 실행하고 있습니다. 브라우저가 mkcert를 로컬 인증 기관으로 신뢰하기 때문에 브라우저 경고가 표시되지 않습니다.

{% Aside %} 서버가 HTTPS에 대해 다른 포트를 사용할 수 있습니다. {% endAside %}

### mkcert 사용: cheatsheet

{% Details %} {% DetailsSummary %} mkcert 요약{% endDetailsSummary %}

HTTPS로 로컬 개발 사이트를 실행하려면:

1. mkcert를 설정합니다.

    아직 설정하지 않은 경우 예를 들어 macOS에 mkcert를 설치합니다.

    ```bash
    brew install mkcert

    ```

    Windows 및 Linux 지침은 [mkcert 설치](https://github.com/FiloSottile/mkcert#installation)를 확인하십시오.

    그런 다음 로컬 인증 기관을 만듭니다.

    ```bash
    mkcert -install
    ```

2. 신뢰할 수 있는 인증서를 만듭니다.

    ```bash
    mkcert {YOUR HOSTNAME e.g. localhost or mysite.example}
    ```

    이렇게 하면 유효한 인증서(`mkcert`가 자동으로 서명)가 생성됩니다.

3. HTTPS와 2단계에서 생성한 인증서를 사용하도록 개발 서버를 구성합니다.

4. ✨ 작업을 완료했습니다! 이제 경고 없이 브라우저에서 `https://{YOUR HOSTNAME}`에 액세스할 수 있습니다.

{% Aside 'caution' %}

**개발 목적**으로만 이 작업을 수행하고 `rootCA-key.pem` 파일을 **내보내거나 공유**하지 마십시오(이 파일이 안전한지 확인하기 위해 이 파일의 위치를 알아야 하는 경우 {`mkcert -CAROOT` 실행).

{% endAside %}

{% endDetails %}

## HTTPS를 사용하여 로컬에서 사이트 실행: 기타 옵션

### 자체 서명 인증서

mkcert와 같은 로컬 인증 기관을 사용하지 않고 대신 **인증서에 직접 서명**할 수도 있습니다.

이 접근 방식의 몇 가지 함정에 주의하십시오.

- 브라우저는 사용자를 인증 기관으로 신뢰하지 않으며 수동으로 우회해야 하는 경고를 표시합니다. Chrome에서는 `#allow-insecure-localhost` 플래그를 사용하여 `localhost`에서 이 경고를 자동으로 우회할 수 있습니다. 이렇기 때문에 약간 진부한 느낌이 듭니다.
- 안정적이지 않은 네트워크에서 작업하는 경우 안전하지 않습니다.
- 자체 서명된 인증서는 신뢰할 수 있는 인증서와 정확히 같은 방식으로 작동하지 않습니다.
- mkcert와 같은 로컬 CA를 사용하는 것보다 반드시 더 쉽거나 빠른 것은 아닙니다.
- 브라우저 컨텍스트에서 이 기술을 사용하지 않는 경우 서버에 대한 인증서 확인을 비활성화해야 할 수 있습니다. 프로덕션 과정에서 다시 활성화하지 않으면 위험할 수 있습니다.

<figure>{% Img src="image/admin/KxLz7mcUudiFwWBIdhH8.jpg", alt="자체 서명된 인증서가 사용될 때 브라우저에 표시되는 경고 스크린샷.", width="800", height="598" %}<figcaption>자체 서명된 인증서가 사용될 때 브라우저에 경고가 표시됩니다.</figcaption></figure>

{% Aside %} 인증서를 지정하지 않으면 [React](https://create-react-app.dev/docs/using-https-in-development/) 및 [Vue](https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-serve)의 개발 서버 HTTPS 옵션이 내부적으로 자체 서명된 인증서를 생성합니다. 이 방법은 빠르지만 브라우저 경고가 표시되고 위에 나열된 자체 서명 인증서와 관련된 다른 함정이 발생합니다. 다행히 프론트엔드 프레임워크의 내장 HTTPS 옵션을 **사용하고** mkcert 또는 이와 유사한 도구를 통해 생성된 로컬로 신뢰할 수 있는 인증서를 지정할 수 있습니다. 이 작업은 [mkcert에서 React 예제](/#setup:~:text=a%20React%20development%20server)를 사용하여 참조하십시오. {% endAside %}

{% Details %} {% DetailsSummary %} 브라우저가 자체 서명한 인증서를 신뢰하지 않는 이유는 무엇입니까? {% endDetailsSummary %}

HTTPS를 사용하여 브라우저에서 로컬로 실행되는 사이트를 열면 브라우저가 로컬 개발 서버의 인증서를 확인합니다. 사용자가 직접 서명한 인증서가 확인되면 신뢰할 수 있는 인증 기관으로 등록되어 있는지 여부를 확인합니다. 사용자가 직접 서명하지 않았기 때문에 브라우저는 인증서를 신뢰할 수 없으며, 연결이 안전하지 않음을 알리는 경고를 표시합니다. 계속하면 HTTPS 연결이 생성되므로 위험을 감수하고 진행할 수 있습니다.

<figure>{% Img src="image/admin/V2SAcIzuofqzUuestOOX.jpg", alt="브라우저가 자체 서명 인증서를 신뢰하지 않는 이유: 다이어그램.", width="800", height="833" %}<figcaption> 브라우저가 자체 서명된 인증서를 신뢰하지 않는 이유.</figcaption></figure>

{% endDetails %}

### 일반 인증 기관에 의해 서명된 인증서

로컬 인증 기관이 아닌 실제 인증 기관이 인증서에 서명하는 방법을 찾을 수도 있습니다.

이러한 기술을 사용하려는 경우 염두에 두어야 할 몇 가지 사항은 다음과 같습니다.

- mkcert와 같은 로컬 CA 기술을 사용할 때보다 더 많은 설정 작업을 수행해야 합니다.
- 사용자가 제어하고 유효한 도메인 이름을 사용해야 합니다. 즉, 다음에 대해 실제 인증 기관을 **사용할 수 없습니다**.
    - `localhost` 및 [예약](https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml)된 기타 도메인 이름(예: `example` 또는 `test`).
    - 사용자가 제어하지 않는 모든 도메인 이름.
    - 유효하지 않은 최상위 도메인. [유효한 최상위 도메인 목록](https://www.iana.org/domains/root/db)을 참조하십시오.

### 역방향 프록시

HTTPS를 사용하여 로컬에서 실행되는 사이트에 액세스하는 또 다른 옵션은 [ngrok](https://en.wikipedia.org/wiki/Reverse_proxy)와 같은 [역방향 프록시](https://ngrok.com/)를 사용하는 것입니다.

고려해야 할 몇 가지 사항:

- 역방향 프록시로 생성한 URL을 공유하면 누구나 해당 지역 개발 사이트에 액세스할 수 있습니다. 이는 프로젝트를 고객에게 시연할 때 매우 유용할 수 있습니다! 또는 프로젝트가 민감할 경우 단점이 될 수 있습니다.
- 가격을 고려해야 할 수도 있습니다.
- 브라우저의 새로운 [보안 조치](/cors-rfc1918-feedback/)는 이러한 도구의 작동 방식에 영향을 미칠 수 있습니다.

### 플래그(권장하지 않음)

`mysite.example`과 같은 사용자 지정 호스트 이름을 사용하는 경우 Chrome에서 플래그를 사용하여 `mysite.example`를 강제로 안전한 것으로 간주할 수 있습니다. 다음과 같은 이유로 **이러한 작업을 수행하는 것을 피하십시오**.

- `mysite.example`이 항상 로컬 주소로 확인된다는 것을 100% 확신해야 합니다. 그렇지 않으면 프로덕션 자격 증명이 누출될 수 있습니다.
- 이 트릭🙀을 사용하면 여러 브라우저에서 디버그할 수 없습니다.

*모든 검토자와 기고자, 특히 Ryan Sleevi, Filippo Valsorda, Milica Mihajlija 및 Rowan Merewood의 기고와 피드백에 깊은 감사를 드립니다. 🙌*

*영웅 이미지 배경은 [Unsplash](https://unsplash.com/photos/pbxwxwfI0B4)에서 [@anandu](https://unsplash.com/@anandu)가 편집했습니다.*
