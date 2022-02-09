---
title: WebRTC는 이제 W3C 및 IETF 표준입니다.
subhead: |2

  WebRTC의 역사, 아키텍처, 사용 사례 및 미래에 대한 간략한 개요.
description: |2

  WebRTC의 역사, 아키텍처, 사용 사례 및 미래에 대한 간략한 개요.
date: 2021-01-26
updated: 2021-01-26
authors:
  - huib
tags:
  - blog
  - media
---

웹 표준을 정의하는 프로세스는 여러 브라우저에서의 유용성, 일관성 및 호환성을 보장하는 긴 프로세스입니다. 오늘날 [W3C 및 IETF](https://www.w3.org/2021/01/pressrelease-webrtc-rec.html.en)는 팬데믹 기간 동안 아마도 가장 중요한 표준 중 하나인 WebRTC의 완성을 기념합니다.

{% Aside %} WebRTC를 구현하는 실습을 보려면 [WebRTC를 사용하는 실시간 통신](https://codelabs.developers.google.com/codelabs/webrtc-web) Codelab을 확인하세요. {% endAside %}

## 역사 {: #history }

WebRTC는 브라우저, 모바일 앱 및 데스크톱 앱에 실시간 통신 기능을 제공하는 플랫폼이며 일반적으로 영상 통화에 사용됩니다. 이 플랫폼은 포괄적인 기술 및 표준 세트로 구성됩니다. Google은 브라우저에서 실행할 수 없는 Adobe Flash 및 데스크톱 응용 프로그램의 대안으로 2009년에 WebRTC를 만들려는 아이디어를 시작했습니다. 이전 세대의 브라우저 기반 제품은 라이선스가 부여된 독점 기술을 기반으로 구축되었습니다. 행아웃(Hangouts)을 비롯한 다양한 제품이 이 기술로 구축되었습니다. 그런 다음 Google은 기술 라이선스를 받아 오던 회사를 인수하여 이를 오픈 소스 WebRTC 프로젝트로 사용할 수 있도록 했습니다. 이 코드베이스는 Chrome에 통합되어 있으며 WebRTC를 사용하는 대부분의 애플리케이션에서 사용됩니다. Mozilla, Microsoft, Cisco 및 Ericsson과 같은 다른 브라우저 공급업체 및 업계 리더와 함께 WebRTC의 표준화는 W3C 및 IETF 모두에서 시작되었습니다. 2013년에 Mozilla와 Google은 브라우저 간 영상 통화를 [시연했습니다](https://blog.chromium.org/2013/02/hello-firefox-this-is-chrome-calling.html). 표준의 발전을 통해 많은 아키텍처 논의가 브라우저 간 구현 차이와 호환성 및 상호 운용성 문제로 이어졌습니다. 이러한 불일치의 대부분은 지난 몇 년 동안 표준이 확정되면서 궁극적으로 해결되었습니다. 이제 WebRTC 사양에는 [플랫폼 테스트의 전체 세트](https://wpt.fyi/results/webrtc?label=experimental&label=master&aligned) 및 호환성을 해결하는 도구가 함께 제공되며 브라우저는 그에 따라 구현을 크게 조정했습니다. 이로써 웹 개발자가 다양한 브라우저 구현 및 사양 변경에 따라 자신들의 서비스를 지속적으로 채택해야 하는 어려운 시절이 끝났습니다.

## 아키텍처 및 기능 {: #architecture }

[`RTCPeerConnection` API](https://developer.mozilla.org/docs/Web/API/RTCPeerConnection)는 WebRTC 사양의 핵심 부분입니다. `RTCPeerConnection`은 P2P 프로토콜을 사용하여 서로 다른 끝점에 있는 두 애플리케이션이 통신하도록 연결을 처리합니다. `PeerConnection` API는 카메라 및 마이크에 액세스하기 위해 [`getUserMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia)와, 그리고 화면 콘텐츠 캡처를 위해 [`getDisplayMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getDisplayMedia)와 밀접하게 상호작용합니다. WebRTC를 사용하면 `DataChannel`을 통해 오디오 및/또는 동영상 콘텐츠는 물론 임의의 바이너리 데이터가 포함된 스트림을 보내고 받을 수 있습니다. 오디오 및 영상을 처리, 인코딩, 디코딩을 하는 미디어 기능은 모든 WebRTC 구현의 핵심을 제공합니다. WebRTC는 다양한 오디오 코덱을 지원하며 Opus가 가장 많이 사용되고 다재다능합니다. WebRTC 구현은 Google의 무료 VP8 영상 코덱과 영상 처리용 H.264를 모두 지원하는 데 필요합니다. WebRTC 연결은 항상 암호화되며 이는 DTLS 및 SRTP의 두 가지 기존 프로토콜을 통해 이루어집니다. WebRTC는 영상 코덱(VP8, H264), 네트워크 트래버설(ICE), 전송(RTP, SCTP)에서 미디어 설명 프로토콜(SDP)에 이르기까지 기존 표준 및 기술에 크게 의존합니다. 이것은 50개 이상의 RFC와 함께 결부되어 있습니다.

## 사용 사례: 밀리초 단위의 문제인 경우 {: #use-cases }

WebRTC는 원격 수술, 시스템 모니터링, 자율주행차의 원격 제어와 같이 시간이 중요한 애플리케이션과 버퍼링이 불가능한 UDP 기반의 음성 또는 영상 통화에 널리 사용됩니다. Google, Facebook, Cisco, RingCentral 및 Jitsi와 같은 회사의 거의 모든 브라우저 기반 영상 통화 서비스는 WebRTC를 사용합니다. Google Stadia 및 NVIDIA GeForce NOW는 WebRTC를 사용하여 지연을 인지할 수 없을 정도로 빠르게 클라우드에서 웹 브라우저로 게임 플레이 스트림을 가져옵니다.

## 팬데믹은 영상 통화 성능에 초점을 맞춥니다 {: #performance }

지난 1년 동안 브라우저 내에서 영상 통화량의 증가로 Chrome에서의 WebRTC 사용량이 100배 증가했습니다. 영상 통화가 팬데믹 기간 동안 많은 사람들의 삶의 근본적인 부분이 되었음을 인식하고 브라우저 공급업체는 영상 통화가 의존하는 기술을 최적화하기 시작했습니다. 직원들과 학생들이 집에서 일하고 공부하기 시작하면서 영상 회의에서 대규모 회의 및 영상 효과를 요구하는 리소스가 점점 더 보편화됨에 따라 이러한 최적화는 특히 중요했습니다. 작년에 Chrome은 영상 통화에서 최대 30% 이상의 배터리 사용 최적화를 이루었으며, 사용량이 많은 시나리오에서 더 많은 최적화가 제공됩니다. Mozilla, Apple, Microsoft는 모두 팬데믹 기간 동안 WebRTC 구현을 [상당히 개선](https://www.youtube.com/watch?v=YZROn-WsyO4)했으며, 이들은 특히 현재 공식화된 표준을 준수하는지 확인합니다.

## WebRTC의 미래 {: #future }

WebRTC는 이제 W3C 표준으로 완성되었지만 개선은 계속됩니다. [대역폭을 최대 50% 절약](https://blog.google/products/duo/4-new-google-duo-features-help-you-stay-connected/)하는 새로운 영상 코덱 AV1이 WebRTC 및 웹 브라우저에서 제공됩니다. 오픈 소스 코드 기반의 지속적인 개선은 지연을 더욱 줄이고 스트리밍할 수 있는 영상의 품질을 향상시킬 것으로 예상됩니다. [WebRTC NV](https://www.w3.org/TR/webrtc-nv-use-cases/)는 새로운 사용 사례를 만드는 보조 API를 만들기 위한 이니셔티브를 수집합니다. 이는 [확장 가능한 영상 코딩](https://www.w3.org/TR/webrtc-svc/)과 같은 기존 기능과 [하위 수준 구성 요소](https://github.com/w3c/mediacapture-insertable-streams/blob/main/explainer.md)에 대한 액세스 권한을 부여하는 API와 같은 기존 기능에 대한 추가 제어를 제공하는 기존 API에 대한 확장으로 구성됩니다. 후자는 고성능 사용자 지정 WebAssembly 구성 요소를 통합하여 웹 개발자가 혁신할 수 있는 더 많은 유연성을 제공합니다. 5G 네트워크의 부상과 더 많은 대화형 서비스에 대한 수요로 인해 우리는 내년에 WebRTC를 기반으로 구축되는 서비스가 계속해서 증가할 것으로 기대하고 있습니다.
