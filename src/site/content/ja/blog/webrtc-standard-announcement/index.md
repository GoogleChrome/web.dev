---
title: WebRTCは今W3CおよびIETF標準になりました
subhead: |2

  WebRTCの歴史、アーキテクチャ、ユースケース、および将来の概要。
description: |2

  WebRTCの歴史、アーキテクチャ、ユースケース、および将来の概要。
date: 2021-01-26
updated: 2021-01-26
authors:
  - huib
tags:
  - blog
  - media
---

Web標準を定義するプロセスは、ブラウザ間の有用性、一貫性、および互換性を保証する長いプロセスです。本日、[W3CとIETF](https://www.w3.org/2021/01/pressrelease-webrtc-rec.html.en)は、パンデミックの間中におそらく最も重要な標準の1つであるWebRTCの完成を示しています。

{% Aside %}WebRTCの実装に関する実践的なチュートリアルについては、[WebRTCとのリアルタイム通信](https://codelabs.developers.google.com/codelabs/webrtc-web)コードラボをご覧ください。 {% endAside %}

## 履歴 {: #history }

WebRTCは、ブラウザ、モバイルアプリ、デスクトップアプリにリアルタイムの通信機能を提供するプラットフォームであり、通常はビデオ通話に使用されます。プラットフォームは、テクノロジーと標準の包括的なセットで構成されています。Googleは、ブラウザで実行できなかったAdobe Flashおよびデスクトップアプリケーションの代わりとして、2009年にWebRTCを作成するというアイデアを開始しました。前世代のブラウザベースの製品は、ライセンスされた独自テクノロジーの上に構築されました。ハングアウトなどの様々な製品がこのテクノロジーによって構築されました。その後、Googleはテクノロジーのライセンスを取得していた企業を獲得し、オープンソースのWebRTCプロジェクトとして利用できるようにしました。このコードベースはChromeに統合されており、WebRTCを使用するほとんどのアプリケーションによって使用されています。他のブラウザベンダーやMozilla、Microsoft、Cisco、Ericssonなどの業界リーダーとともに、WebRTCの標準化はW3CとIETFの両方で開始されました。2013年に、MozillaとGoogleは、ブラウザ間のビデオ通話の[デモを行いました](https://blog.chromium.org/2013/02/hello-firefox-this-is-chrome-calling.html)。標準の進化を通じて、多くのアーキテクチャ上の議論がブラウザ間の実装の相違点につながり、互換性と相互運用性に挑戦しました。ほとんどの意見の相違は、過去数年間に基準が最終決定されたときに最終的に解決されました。WebRTC仕様には、互換性に対処するための[プラットフォームテストのフルセット](https://wpt.fyi/results/webrtc?label=experimental&label=master&aligned)とツールが付属しており、ブラウザはそれに応じて実装を大幅に調整しています。これにより、Web開発者が種々のブラウザの実装や仕様の変更にサービスを継続的に採用しなければならなかった困難の時期に終止符が打たれます。

## アーキテクチャと機能{: #architecture }

[`RTCPeerConnection` API](https://developer.mozilla.org/docs/Web/API/RTCPeerConnection)は、WebRTC仕様の中心的な部分です。 `RTCPeerConnection`は、ピアツーピアプロトコルを使用して通信するために、異なるエンドポイント上で2つのアプリケーションを接続することを扱います。`PeerConnection` APIは、カメラとマイクにアクセスするための[`getUserMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) 、および画面コンテンツをキャプチャするための[`getDisplayMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getDisplayMedia)と緊密に連携します。WebRTCを使用すると、オーディオやビデオのコンテンツ、および`DataChannel`介した任意のバイナリデータを含むストリームを送受信できます。オーディオとビデオを処理、エンコード、およびデコードするためのメディア機能は、WebRTC実装のコアを提供します。WebRTCはさまざまなオーディオコーデックをサポートしており、特に最も使用されて、用途が広いOpusがあります。WebRTCの実装は、Googleの無料で使用できるVP8ビデオコーデックとビデオ処理用のH.264の両方をサポートするために必要です。WebRTC接続は常に暗号化されます。これは、DTLSとSRTPの2つの既存のプロトコルを介して実現されます。 WebRTCは、ビデオコーデック（VP8、H264）、ネットワークトラバーサル（ICE）、トランスポート（RTP、SCTP）からメディア記述プロトコル（SDP）まで、既存の標準とテクノロジーに大きく依存しています。これは、50を超えるRFCで結び付けられています。

## ユースケース：ミリ秒が問題になる場合{: #use-cases }

WebRTCは、遠隔手術、システムモニタリング、自動運転車のリモートコントロール、バッファリングが不可能なUDP上に構築された音声通話やビデオ通話などのタイムクリティカルなアプリケーションで広く使用されています。 Google、Facebook、Cisco、RingCentral、Jitsiなどの企業のブラウザベースのビデオ通話サービスはほぼすべてWebRTCを使用しています。Google StadiaとNVIDIA GeForceは現在、WebRTCを使用して、知覚可能な遅延なしにクラウドからWebブラウザーにゲームプレイのストリームを取得しています。

## パンデミックでビデオ通話のパフォーマンスに注目されています{: #performance }

過去1年間で、WebRTCは、ブラウザー内からのビデオ通話の増加により、Chromeでの使用量が100倍に増加しました。パンデミックの間、ビデオ通話が人々の生活の基本的な部分になっていることを認識して、ブラウザベンダーは、ビデオ通話が依存するテクノロジーを最適化し始めました。これは、従業員と学生が自宅で仕事と勉強を始めた現状において、リソースを必要とする大規模な会議とビデオ会議でのビデオ効果がより一般的になるため、特に重要でした。過去1年間で、Chromeはビデオ通話でより30％までバッテリーに優しいものになり、頻繁に使用するシナリオに合わせてさらに最適化されています。 Mozilla、Apple、およびMicrosoftはすべてパンデミックをきっかけにWebRTCの実装を[大幅に改善](https://www.youtube.com/watch?v=YZROn-WsyO4)しました。特に、現在正式化されている標準に準拠していることを確認しています。

## WebRTCの未来{: #未来}

WebRTCは現在W3C標準として完成していますが、改善がまだ続いています。 [帯域幅を最大50％節約する](https://blog.google/products/duo/4-new-google-duo-features-help-you-stay-connected/)新しいビデオコーデックAV1が、WebRTCおよびWebブラウザーで利用できるようになりました。オープンソースコードベースの継続的な改善により、遅延がさらに減少し、ストリーミングされるビデオの品質が向上することが期待されます。[WebRTC NV](https://www.w3.org/TR/webrtc-nv-use-cases/)は、新しいユースケースを有効にする補足APIを作成するイニシアチブを収集します。これらは、[スケーラブル映像符号化](https://www.w3.org/TR/webrtc-svc/)などの[既存の機能や、低レベルのコンポーネント](https://github.com/w3c/mediacapture-insertable-streams/blob/main/explainer.md)へのアクセスを提供するAPIをより詳細に制御できるようにする、既存のAPIの拡張機能で構成されています。後者は、高性能のカスタムWebAssemblyコンポーネントを統合することにより、Web開発者が革新するための柔軟性を高めます。新たな5Gネットワークとよりインタラクティブなサービスの需要により、今後1年間でWebRTCに加えてサービスが継続的に増加すると予想されます。
