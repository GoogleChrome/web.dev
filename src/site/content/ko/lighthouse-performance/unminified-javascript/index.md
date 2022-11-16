---
layout: post
title: 자바스크립트 축소
description: |2

  unminified-javascript 감사에 대해 알아보세요.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - 축소되지 않은 자바 스크립트
---

JavaScript 파일을 축소하면 페이로드 크기와 스크립트 구문 분석 시간을 줄일 수 있습니다. Lighthouse 보고서의 기회 섹션에는 축소되지 않은 모든 JavaScript 파일이 나열되며 이러한 파일을 축소할 때 잠재적으로 절약할 수 있는 [키비바이트(KiB)](https://en.wikipedia.org/wiki/Kibibyte)가 표시됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aHumzRfDrBcuplUDCnvf.png", alt="Lighthouse Minify JavaScript 감사의 스크린샷", width="800", height="212" %}</figure>

## JavaScript 파일을 축소하는 방법

축소는 더 작지만 완벽하게 유효한 코드 파일을 만드는 데 필요하지 않은 공백과 모든 코드를 제거하는 프로세스입니다. [Terser](https://github.com/terser-js/terser)는 널리 사용되는 JavaScript 압축 도구입니다. webpack v4에는 기본적으로 이 라이브러리에 대한 플러그인이 포함되어 있어 축소된 빌드 파일을 생성합니다.

## 스택별 지침

### Drupal

**관리**에서 **JavaScript 파일 집계**를 활성화했는지 확인하십시오.

> **구성** &gt; **개발** 페이지. [추가 모듈](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=javascript+aggregation&solrsort=iss_project_release_usage+desc&op=Search)을 통해 고급 집계 옵션을 구성하여 JavaScript 자산을 연결, 축소 및 압축하여 사이트 속도를 높일 수도 있습니다.

### Joomla

많은 [Joomla 확장 프로그램](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance)은 스크립트를 연결, 축소 및 압축하여 사이트 속도를 높일 수 있습니다. 이 기능을 제공하는 템플릿도 있습니다.

### Magento

[Terser](https://www.npmjs.com/package/terser)를 사용하여 정적 콘텐츠 배포에서 모든 JavaScript 자산을 축소하고 기본 제공 축소 기능을 비활성화합니다.

### React

빌드 시스템이 JS 파일을 자동으로 축소하는 경우 애플리케이션의 [프로덕션 빌드](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)를 배포하고 있는지 확인하십시오. React 개발자 도구 확장으로 이를 확인할 수 있습니다.

### WordPress

여러 [WordPress 플러그인](https://wordpress.org/plugins/search/minify+javascript/)은 스크립트를 연결, 축소 및 압축하여 사이트 속도를 높일 수 있습니다. 가능하면 빌드 프로세스를 사용하여 이 축소를 미리 수행할 수도 있습니다.

## 리소스

- [**Minify JavaScript** 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/unminified-javascript.js)
