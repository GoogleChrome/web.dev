---
layout: post
title: 새로운 기능 상태
subhead: 웹 앱은 iOS/Android/데스크톱 앱이 할 수 있는 모든 작업을 수행할 수 있어야 합니다. 회사 간 기능 프로젝트의 구성원은 이전에는 불가능했던 개방형 웹에서 앱을 빌드하고 제공할 수 있도록 하고자 합니다.
date: 2018-11-12
updated: 2021-11-04
tags:
  - blog
  - capabilities
---

<figure data-float="right">{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/uIIvM9xocYkjmBfHSrJE.svg", alt="복어, Fugu 프로젝트 로고.", width="150", height="150" %}</figure>

[기능 프로젝트](https://developers.google.com/web/updates/capabilities)는 사용자 보안, 개인정보 보호, 신뢰 및 웹의 다른 핵심 교리를 유지하면서 이러한 플랫폼의 기능을 웹 플랫폼에 노출함으로써 웹 앱이 iOS/Android/데스크톱 앱이 할 수 있는 모든 작업을 수행할 수 있도록 하는 것을 목표로 하는 회사 간 노력입니다.

다른 여러 예제 중에서 이 작업을 통해 [Adobe는 Photoshop을 웹에 제공하고](/ps-on-the-web/), [Excalidraw은 자체 Electron 앱 사용을 중단하며](/deprecating-excalidraw-electron/) [Betty Crocker는 구매력 지표를 300%까지 늘릴 수 있었습니다](/betty-crocker/).

[Fugu API Tracker](https://goo.gle/fugu-api-tracker)에서 새롭고 잠재적인 기능 및 각 제안이 있는 단계에 대한 전체 목록을 볼 수 있습니다. 많은 아이디어가 설명자 또는 원본 시도 단계를 통과하지 못한다는 점은 주목할 가치가 있습니다. 프로세스의 목표는 올바른 기능을 제공하는 것입니다. 즉, 빠르게 배우고 반복해야 합니다. 개발자의 요구 사항을 해결하지 못하기 때문에 기능을 제공하지 않아도 괜찮습니다.

## 안정적으로 사용 가능한 기능 {: #in-stable }

다음 API의 평가 기간이 종료되었으며 최신 버전의 Chrome 및 많은 경우 다른 Chromium 기반 브라우저에서 사용할 수 있습니다.

<a style="text-decoration: none;" class="button" data-type="primary" href="https://fugu-tracker.web.app/#shipped">이미 전달된 모든 API</a>

## 본래의 평가판으로 사용 가능한 기능 {: #origin-trial }

이러한 API는 Chrome에서 [본래의 평가판](https://developers.chrome.com/origintrials/#/trials/active)으로 사용할 수 있습니다. 본래의 평가판은 Chrome이 실험 기능 및 API를 검증할 수 있는 기회를 제공하고 사용자가 더 광범위한 배포 과정에서 사용성과 효율성에 대한 피드백을 제공할 수 있도록 합니다.

본래의 평가판을 선택하면 베타 테스트 사용자가 브라우저에서 플래그를 뒤집을 필요 없이 평가판 기간 동안 시도할 수 있는 데모 및 프로토타입을 빌드할 수 있습니다. 일반적으로 플래그 뒤에서 사용할 수 있는 기능보다 더 안정적이지만(아래 참조) 피드백에 따라 API 표면이 변경될 수 있습니다. [웹 개발자를 위한 본래의 평가판 가이드](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)에는 본래의 평가판에 대한 자세한 정보가 나와 있습니다.

<a style="text-decoration: none;" class="button" data-type="primary" href="https://fugu-tracker.web.app/#origin-trial">현재 본래의 평가판에 있는 모든 API</a>

## 플래그 뒤에서 사용 가능한 기능 {: #flag }

이러한 API는 플래그 뒤에서만 사용할 수 있습니다. 실험적이며 아직 개발 중입니다. 프로덕션에서 사용할 준비가 되지 않았습니다. 버그가 있거나 이러한 API가 중단되거나 API 표면이 변경될 수 있습니다.

<a style="text-decoration: none;" class="button" data-type="primary" href="https://fugu-tracker.web.app/#developer-trial">현재 플래그 뒤에 있는 모든 API</a>

## 시작된 기능 {: #started }

이 API에 대한 작업이 막 시작되었습니다. 아직 볼 것이 많지 않지만 관심 있는 개발자는 관련 Chromium 버그에 별표를 표시하여 진행 중인 진행 상황을 최신 상태로 유지할 수 있습니다.

<a style="text-decoration: none;" class="button" data-type="primary" href="https://fugu-tracker.web.app/#started">작업이 시작된 모든 API</a>

## 고려 중인 기능 {: #under-consideration }

이러한 기능은 아직 구현하지 못한 API와 아이디어에 대한 백로그입니다. 관련 Chromium 버그에 별표를 표시하여 기능에 투표하고 작업이 시작되면 알림을 받는 것이 좋습니다.

<a style="text-decoration: none;" class="button" data-type="primary" href="https://fugu-tracker.web.app/#under-consideration">고려 중인 모든 API</a>

## 새로운 기능 제안 {: #suggest-new }

Chromium이 고려해야 한다고 생각하는 기능에 대한 제안 사항이 있나요? [새로운 기능 요청](https://goo.gl/qWhHXU)을 제출하여 이에 대해 알려주세요. 해결하려는 문제, 제안된 사용 사례 및 기타 유용할 수 있는 모든 것 등 가능한 한 많은 세부 정보를 포함해야 합니다.

{% Aside %} 이러한 새로운 기능을 사용해 보고 싶나요? [웹 기능 Codelab](https://developers.google.com/codelabs/project-fugu#0)을 확인해 보세요. {% endAside %}
