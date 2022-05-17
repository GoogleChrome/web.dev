---
layout: post
title: PWAをアプリのように動作させる
subhead: プログレッシブWebアプリをWebサイトのように動作させるのではなく、「実際の」アプリのように動作させる
authors:
  - thomassteiner
description: Web技術を使用してプラットフォーム固有のアプリパターンを実装する手順を理解して、プログレッシブWebアプリを「実際の」アプリのように動作させる方法について説明します。
date: 2020-06-15
updated: 2020-07-23
tags:
  - capabilities
---

プログレッシブWebアプリは、「PWAは単なるWebサイト」と言っても良いでしょう。 MicrosoftのPWAドキュメントでは、[そのこと](/progressive-web-apps/#content:~:text=Progressive%20Web%20Apps,Websites)に[同意](https://docs.microsoft.com/microsoft-edge/progressive-web-apps-chromium/#progressive-web-apps-on-windows:~:text=PWAs%20are%20just%20websites)しており、PWAの提唱者であるFrances Berriman氏とAlex Russell氏さえも[そのように述べています](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/#post-2263:~:text=they%E2%80%99re%20just%20websites)。まさにPWAは単なるWebサイトですが、それだけではありません。正しく実行された場合、PWAはWebサイトのように動作するのではなく、「実際の」アプリのように感じられます。では、実際のアプリのような動作とは何を意味するでしょうか。

この質問に答えるために、Apple [Podcasts](https://support.apple.com/HT201859)アプリの例を取り上げます。これはデスクトップのmacOSとモバイルのiOS (およびiPadOS) で利用できます。Podcastsはメディアアプリケーションですが、これから説明する中心的な概念は、他のカテゴリのアプリにも当てはまります。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aNYiT2EkVkjNplAIKbLU.png", alt="iPhoneとMacBookをサイドバイサイドで実行し、両方ともPodcastsアプリケーションを実行しています。", width="800", height="617" %} <figcaption> iPhoneおよびmacOS上のApple Podcasts (<a href="https://support.apple.com/HT201859">出典</a>)。</figcaption></figure>

{% Aside 'caution' %}次の一覧のiOS/Android/デスクトップアプリの各機能には、詳細が表示される**Webコンポーネントでこれを実行する方法**があります。さまざまなオペレーティングシステムのすべてのブラウザが、一覧のすべてのAPIまたは機能をサポートしているわけではないのでご注意ください。リンクされた記事の互換性に関する注意事項をよく確認してください。 {% endAside %}

## オフラインで実行可能

一歩下がって、携帯電話やデスクトップコンピュータにインストールされているプラットフォーム固有のアプリケーションのいくつかを考えると、明らかに際立っていることが1つあります。それは常に何か情報が得られるということです。Podcastsアプリでは、オフラインであっても常に何らかの動作が行われます。ネットワークに接続していない場合でも、当然アプリは起動しきます。[**トップチャート**] セクションにコンテンツは表示されませんが、「**現在接続できません**」メッセージと [**再試行**] ボタンがペアになって表示されます。これは期待していた経験ではないかもしれませんが、少なくとも何らかの情報を得ることはできます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMbGLQkbLROxmUMdxLET.png", alt="ネットワーク接続が利用できない場合の情報メッセージ「現在接続できません」を表示するPodcastsアプリ。", width="800", height="440" %} <figcaption>ネットワーク接続のないPodcastsアプリ。</figcaption></figure>

{% Details %} {% DetailsSummary %}Webでこれを実行する方法{% endDetailsSummary %}Podcastsアプリは、いわゆるアプリシェルモデルに従っています。左側のメニューアイコンやコアプレーヤーのUIアイコンなどの装飾画像を含め、コアアプリを表示するために必要なすべての静的コンテンツはローカルキャッシュに保存されます。<b>トップチャート</b>データなどの動的コンテンツはオンデマンドでのみ読み込まれ、読み込みに失敗した場合はローカルキャッシュに保存されたフォールバックコンテンツが表示されます。このアーキテクチャモデルをWebアプリに適用する方法については、<a href="https://developers.google.com/web/fundamentals/architecture/app-shell">アプリシェルモデル</a>の記事を参照してください。 {% endDetails %}

## オフラインコンテンツが利用可能で、メディアが再生可能

オフラインでも、左側のドロワーから[**ダウンロード済み**] セクションに移動して、ダウンロードしたポッドキャストエピソードを楽しむことができます。これらのエピソードは、すぐに再生でき、アートワークや説明などのすべてのメタデータとともに表示されます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/onUIDiaFNNHOmnwXzRh1.png", alt="ポッドキャスト再生のエピソードをダウンロードしたPodcastsアプリ。", width="800", height="440" %} <figcaption>ダウンロードしたポッドキャストのエピソードは、ネットワークがなくても再生できます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}以前にダウンロードしたメディアコンテンツは、たとえば<a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">Workbox</a>ライブラリの<a href="https://developer.chrome.com/docs/workbox/">キャッシュに保存された音声と動画の再生</a>レシピを使用して、キャッシュから再生できます。その他のコンテンツは、常にキャッシュまたはIndexedDBに保存できます。詳細については、<a href="/storage-for-the-web/">Webのストレージ</a>の記事を読み、どのストレージテクノロジーをいつ使用するかを確認してください。使用可能なメモリ量が少なくなっても、消去されずに永続的に保存する必要があるデータの場合には、<a href="/persistent-storage/">永続ストレージAPI</a>を使用できます。 {% endDetails %}

## プロアクティブなバックグラウンドダウンロード

オンライン接続されたときには、`http 203`などのクエリでコンテンツを検索できます。また、検索結果[HTTP 203ポッドキャスト](/podcasts/)を購読することを決めたときには、シリーズの最新エピソードがすぐにダウンロードされ、問い合わせはありません。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WbCk4nPpBS3zwkPVRGuo.png", alt="購読直後にポッドキャストの最新エピソードをダウンロードするPodcastsアプリ。", width="800", height="658" %} <figcaption>ポッドキャストを購読すると、最新のエピソードがすぐにダウンロードされます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}ポッドキャストエピソードのダウンロードには、時間がかかる場合があります。<a href="https://developers.google.com/web/updates/2018/12/background-fetch">Background Fetch API</a>を使用すると、ダウンロードをブラウザに委任できます。ブラウザは、ダウンロードをバックグラウンドで処理します。 Androidでは、さらにブラウザがこれらのダウンロードをオペレーティングシステムに委任することもできるため、ブラウザを継続的に実行する必要はありません。ダウンロードが完了すると、アプリのサービスワーカーが起動し、応答の処理方法を決定できます。 {% endDetails %}

## 他のアプリケーションとの共有と連携

Podcastsアプリは、他のアプリケーションと自然に統合されます。たとえば、好きなエピソードを右クリックすると、メッセージアプリなど、デバイス上の他のアプリと共有できます。また、システムクリップボードとも自然に統合されます。任意のエピソードを右クリックして、そのエピソードへのリンクをコピーできます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gKeFGOAZ2muuYeDNFbBW.png", alt="[エピソードの共有] > [メッセージ] オプションが選択されたポッドキャストエピソードで呼び出されたPodcastsアプリのコンテキストメニュー。", width="800", height="392" %} <figcaption>ポッドキャストエピソードをメッセージアプリに共有する。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %} <a href="/web-share/">Web Share API</a>と<a href="/web-share-target/">Web Share Target API</a>を使用すると、デバイスの他のアプリケーションとの間でテキスト、ファイル、リンクをアプリで共有および受信できます。Webアプリがオペレーティングシステムに組み込まれた右クリックメニューにメニュー項目を追加することはまだできませんが、デバイスの他のアプリとリンクする方法は他にもたくさんあります。<a href="/image-support-for-async-clipboard/">Async Clipboard API</a>を使用すると、テキストおよび画像データ (PNG画像) をプログラムで読み取り、システムクリップボードに書き込むことができます。Androidでは、<a href="/contact-picker/">Contact Picker API</a>を使用して、デバイスの連絡先管理からエントリを選択できます。プラットフォーム固有のアプリとPWAの両方を提供している場合は、<a href="/get-installed-related-apps/">Get Installed Related Apps API</a>を使用して、プラットフォーム固有のアプリがインストールされているかどうかを確認できます。インストールされている場合は、ユーザーにPWAのインストールや承認、Webプッシュ通知の承諾を促す必要はありません。 {% endDetails %}

## バックグラウンドアプリ更新

Podcastsアプリの設定で、新しいエピソードを自動的にダウンロードするようにアプリを構成できます。そのことを考える必要さえありません。更新されたコンテンツが常に提供されているのです。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iTKgVVjX0EM0RQS3ap4X.png", alt="[Podcastsの更新] オプションが [毎時] に設定されている [一般] セクションのPodcastsアプリの設定メニュー。", width="800", height="465" %} <figcaption>1時間ごとに新しいポッドキャストエピソードをチェックするように構成されたPodcasts。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %} <a href="/periodic-background-sync/">Periodic Background Sync API</a>を使用すると、アプリを実行しなくても、バックグラウンドでコンテンツを定期的に更新できます。つまり、新しいコンテンツがプロアクティブに利用可能であるため、ユーザーはいつでもすぐにコンテンツを掘り下げることができます。 {% endDetails %}

## クラウド上で同期された状態

同時に、サブスクリプションは、所有しているすべてのデバイス間で同期されます。シームレスな世界では、ポッドキャストのサブスクリプションを手動で同期することを気にする必要はありません。同様に、モバイルデバイスのメモリが、デスクトップですでに聴いたエピソードによって消費されることを心配する必要もありません。逆も同様です。再生状態は同期されたままで、聴いたエピソードは自動的に削除されます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uVJJ40Zxi5jx1AP1jd9U.png", alt="[デバイス間でサブスクリプションを同期する] オプションがアクティブになっている [詳細] セクションのPodcastsの設定メニュー。", width="800", height="525" %} <figcaption>状態はクラウド上で同期されます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法 {% endDetailsSummary %}アプリ状態データの同期タスクは、<a href="https://developers.google.com/web/updates/2015/12/background-sync">Background Sync API</a>に委任できます。同期処理自体は、ユーザーがアプリを再度閉じた場合を含め<em>最終的</em>に実行されれば、即時実行する必要はありません。{% endDetails %}

## ハードウェアメディアキーコントロール

Chromeブラウザでニュースページを読んでいるときなど、別のアプリケーションで忙しいときでも、ノートPCのメディアキーを使用してPodcastsアプリを制御できます。前後にスキップするためだけにアプリに切り替える必要はありません。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TqRtzNtfhahjX93hI1P6.png", alt="Apple MacBook Pro Magic Keyboardと注釈付きメディアキー。", width="800", height="406" %} <figcaption>メディアキーを使用すると、Podcastsアプリ (<a href="https://support.apple.com/guide/macbook-pro/magic-keyboard-apdd0116a6a2/mac">出典</a>) を制御できます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}メディアキーは<a href="/media-session/">Media Session API</a>でサポートされています。このように、ユーザーは物理キーボードやヘッドフォンのハードウェアメディアキーを利用したり、スマートウォッチのソフトウェアメディアキーからWebアプリを制御したりすることもできます。さらにシーク操作をスムーズにするには、オープニングクレジットやチャプターの境界を通過するなど、ユーザーがコンテンツの重要な部分をシークするときに<a href="https://developer.mozilla.org/docs/Web/API/Vibration_API">振動パターン</a>を送信することができます。{% endDetails %}

## マルチタスクとアプリショートカット

もちろん、いつでもどこからでもPodcastsアプリにマルチタスクで戻ることができます。アプリには明確に識別できるアイコンがあり、デスクトップやアプリケーションドックに配置することもできるので、好きなときにPodcastsをすぐに起動できます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l5EzElV5BGweYXLAqF4u.png", alt="いくつかのアプリアイコンから選択できるmacOSタスクスイッチャー。そのうちの1つはPodcastsアプリです。", width="800", height="630" %} <figcaption>Podcastsアプリに戻るマルチタスク。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}デスクトップとモバイルの両方のプログレッシブWebアプリを、ホーム画面、スタートメニュー、またはアプリケーションドックにインストールできます。インストールは、プロアクティブなプロンプトに基づいて行うことも、アプリ開発者が完全に制御することもできます。基本的な情報については、<a href="/install-criteria/">What does it take to be installable?</a>記事をお読みください。マルチタスクの場合、PWAはブラウザから独立して表示されます。 {% endDetails %}

## コンテキストメニューのクイックアクション

最も一般的なアプリのアクションである **[新しいコンテンツの検索]** と **[新しいエピソードの確認]** は、Dockのアプリのコンテキストメニューから直接利用できます。ログイン時に **[オプション]** メニューからアプリを開くこともできます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SnA6Thz5xaopuTWRzWgQ.png", alt="[検索] および [新しいエピソードの確認] オプションを表示するPodcastsアプリアイコンのコンテキストメニュー。", width="534", height="736" %} <figcaption>クイックアクションは、アプリアイコンからすぐに利用できます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %} <a href="/app-shortcuts/">PWAのWebアプリマニフェストでアプリアイコンのショートカット</a>を指定することにより、ユーザーがアプリアイコンから直接アクセスできる一般的なタスクへのクイックルートを登録できます。macOSなどのオペレーティングシステムでは、ユーザーが、ログイン時にアプリアイコンを右クリックしてアプリを起動するように設定することもできます。<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/RunOnLogin/Explainer.md">ログイン時</a>に実行するための提案は現在作業中です。 {% endDetails %}

## デフォルトのアプリとして機能する

他のiOSアプリケーション、さらにはWebサイトや電子メールでさえ、 `podcasts://` URLスキームを活用することでPodcastsアプリと統合できます。ブラウザで[`podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903`](podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903)などのリンクをたどると、Podcastsアプリが表示され、ポッドキャストを購読するか聴くかを決めることができます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/x8mjOWiMO4CVigvtV8Kg.png", alt="ポッドキャストアプリを開くかどうかをユーザーに確認するダイアログを表示するChromeブラウザ。", width="800", height="492" %} <figcaption>Podcastsアプリはブラウザから直接開くことができます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}完全にカスタムのURLスキームを処理することはまだ可能ではありませんが、PWAの<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">URLプロトコル処理</a>の提案は現在作業中です。現在では、<a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a>と<code>web+</code>スキームプレフィックスが最善の代替手段です。 {% endDetails %}

## ローカルファイルシステムの統合

すぐには思いつかないかもしれませんが、Podcastsアプリは自然にローカルファイルシステムと統合されます。ポッドキャストエピソードをダウンロードすると、ノートPCでは`~/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/Library/Cache`に保存されます。ただし、`~/Documents`とは異なり、このディレクトリは当然標準のユーザーが直接アクセスすることを意図したものではありません。ファイル以外の保存メカニズムは、[オフラインコンテンツ](#offline-content-available-and-media-playable)セクションを参照してください。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Og60tp5kB9lVZsi3Prdt.png", alt="macOS FinderがPodcastsアプリのシステムディレクトリに移動しました。", width="800", height="337" %} <figcaption>ポッドキャストのエピソードは、特別なシステムアプリフォルダに保存されます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}<a href="/file-system-access/">File System Access API{/a0を使用すると、開発者はデバイスのローカルファイルシステムにアクセスできます。直接使用することも、APIをサポートしていないブラウザのフォールバックを透過的に提供する</a><a href="https://github.com/GoogleChromeLabs/browser-fs-access">browser-fs-access</a>サポートライブラリ経由で使用することもできます。セキュリティ上の理由から、システムディレクトリはWebアクセスできません。 {% endDetails %}

## プラットフォームのルックアンドフィール

PodcastsなどのiOSアプリケーションには自明なより微妙なことがあります。つまり、どのテキストラベルも選択できず、すべてのテキストがコンピュータのシステムフォントと融合されています。また、システムカラーテーマ (ダークモード) の選択も優先されます。

<div class="w-columns">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OApP9uGUje6CkS7cKcZh.png", alt="ダークモードのPodcastsアプリ。", width="800", height="463" %} <figcaption>Podcastsアプリは、ライトモードとダークモードをサポートしています。</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cnVihfFR2anSBlIVfCSW.png", alt="ライトモードのPodcastsアプリ。", width="800", height="463" %} <figcaption>アプリはデフォルトのシステムフォントを使用します。</figcaption></figure>
</div>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}<a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>user-select</code></a> CSSプロパティと値<a href="https://developer.mozilla.org/docs/Web/CSS/user-select"><code>none</code></a>を利用することで、UI要素が誤って選択されるのを防ぐことができます。ただし、<em>アプリのコンテンツ</em>を選択不能にする目的でこのプロパティをむやみに使用しないでください。ボタンのテキストなどのUI要素でのみ使用してください。<a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family</code></a> CSSプロパティの値<a href="https://developer.mozilla.org/docs/Web/CSS/font-family#<generic-name>:~:text=system%2Dui,-Glyphs"><code>system-ui</code></a>では、アプリに使用するシステムのデフォルトUIフォントを指定することができます。<a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a>選択を優先し、オプションの<a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">ダークモードトグル</a>でそれをオーバーライドすることで、アプリはユーザーの配色設定に従うことができます。決定するもう1つの点は、スクロール領域の境界に達したときにブラウザでどのような処理を実行すべきかということかもしれません。たとえば、カスタム<em>プルを実装して更新</em>します。これは、<a href="https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior"><code>overscroll-behavior</code></a>プロパティで可能です。 {% endDetails %}

## カスタマイズされたタイトルバー

Podcastsアプリウィンドウを見ると、Safariブラウザウィンドウなどの従来の統合されたタイトルバーとツールバーがなく、メインプレーヤーウィンドウにドッキングされたサイドバーのようなカスタマイズされたエクスペリエンスになっていることがわかります。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cB7G2e31JXU71EfvhG3i.png", alt="Safariブラウザの統合されたタイルバーとツールバー。", width="800", height="40" %} <figcaption></figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mFvLbyQ90wsDPQ9l86s3.png", alt="Podcastsアプリの分割されたカスタムタイトルバー。", width="800", height="43" %} <figcaption>SafariとPodcastsのカスタマイズされたタイトルバー。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法 {% endDetailsSummary %} 現在は不可能ですが、現在、<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">タイトルバーのカスタマイズ</a>に取り組んでいます。ただし、Webアプリマニフェストの <a href="/add-manifest/#display"><code>display</code></a>および<a href="/add-manifest/#theme-color"><code>theme-color</code></a>プロパティを指定して、アプリケーションウィンドウの外観を決定し、どのデフォルトブラウザコントロールが表示されるのか (または何も表示されないのか) を決定することができ (推奨され) ます。{% endDetails %}

## 軽快なアニメーション

Podcastsでは、アプリ内アニメーションは軽快でスムーズです。たとえば、右側の**エピソードノート**ドロワーを開くと、スマートにスライドします。ダウンロードから1つのエピソードを削除すると、残りのエピソードが浮き上がり、削除されたエピソードによって解放された画面領域を使用します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ucob9t4Ga3jMK20RVvSD.png", alt="[エピソードノート] ドロワーが展開されたPodcastsアプリ。", width="800", height="463" %} <figcaption>ドロワーを開くときのようなアプリ内アニメーションは軽快です。</figcaption></figure>

<a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}</a><a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">アニメーションとパフォーマンス</a>の記事で概説されている多数のベストプラクティスを考慮すると、Webでの高パフォーマンスアニメーションは確かに可能です。ページ制御されたコンテンツやメディアカルーセルで一般的に見られるスクロールアニメーションは、<a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSSスクロールスナップ</a>機能を使用することで大幅に改善できます。完全に制御するには、<a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">Web Animations API</a>を使用できます。 {% endDetails %}

## アプリの外部に表示されたコンテンツ

iOSのPodcastsアプリは、実際のアプリケーション以外の場所、たとえば、システムのウィジェットビューや、Siri提案の形式でコンテンツを表示できます。タップするだけで操作できるプロアクティブな使用状況ベースの注意喚起があると、Podcastsなどのアプリの再エンゲージメント率が大幅に向上する可能性があります。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w8zhRHcKzRfgjXZu7y4h.png", alt="ポッドキャストの新しいエピソードを提案するPodcastsアプリを表示するiOSウィジェットビュー。", width="751", height="1511" %} <figcaption>アプリのコンテンツはメインのPodcastsアプリの外部に表示されます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %} <a href="/content-indexing-api/">Content Index API</a>を使用すると、アプリケーションはPWAのどのコンテンツがオフラインで利用できるかをブラウザに通知できます。これにより、ブラウザはこのコンテンツをメインアプリの外部に表示できます。アプリで関心のあるコンテンツを<a href="https://developers.google.com/search/docs/data-types/speakable">読み上げ可能な</a>音声再生に適したものとしてマークアップし、一般的に<a href="https://developers.google.com/search/docs/guides/search-gallery">構造化マークアップ</a>を使用することで、検索エンジンやGoogleアシスタントなどの仮想アシスタントが製品を最適な形で提示できるようになります。 {% endDetails %}

## ロック画面のメディアコントロールウィジェット

ポッドキャストエピソードの再生中、Podcastsアプリは、エピソードのアートワーク、エピソードのタイトル、ポッドキャスト名などのメタデータを備えた美しいコントロールウィジェットをロック画面に表示します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Lr9R2zpjDEgHtyJ7hjHf.png", alt="豊富なメタデータを含むポッドキャストエピソードを表示するロック画面のiOSメディア再生ウィジェット。", width="751", height="1511" %} <figcaption>アプリで再生するメディアはロック画面から制御できます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %} <a href="/media-session/">Media Session API</a>を使用すると、アートワーク、トラックタイトルなどのメタデータを指定して、ロック画面、スマートウォッチ、またはブラウザの他のメディアウィジェットに表示できます。{% endDetails %}

## プッシュ通知

プッシュ通知は、Web上で少し煩わしいものになっています ([通知プロンプトは今ではかなり静かに](https://blog.chromium.org/2020/01/introducing-quieter-permission-ui-for.html)なっていますが)。しかし、適切に使用すれば、多くの価値を付加できます。たとえば、iOS Podcastsアプリは、オプションで、購読しているポッドキャストの新しいエピソードを通知したり、新しいエピソードを推奨したり、新しいアプリの機能を通知したりできます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IFnNRo6BnHL6BxDmiqF7.png", alt="[通知] 設定画面のiOS Podcastsアプリ。[新しいエピソード] の通知トグルがアクティブになっています。", width="751", height="1511" %} <figcaption>アプリはプッシュ通知を送信して、新しいコンテンツをユーザーに通知できます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}<a href="https://developers.google.com/web/fundamentals/push-notifications">Push API</a>を使用すると、アプリがプッシュ通知を受信できるため、PWAに関する注目すべきイベントについてユーザーに通知できます。将来の確認済みの時間に発生し、ネットワーク接続を必要としない通知の場合は、<a href="/notification-triggers/">Notification Triggers API</a>を使用できます。 {% endDetails %}

## アプリアイコンのバッジ

私が購読しているポッドキャストの1つでは、新しいエピソードが利用可能になるといつでも、Podcastsのホーム画面アイコンにアプリアイコンバッジが表示され、アプリを確認するように邪魔にならない方法で通知します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3smO2sJz5oMwy4RYpQoF.png", alt="[バッジ] トグルがアクティブになっていることを示すiOS設定画面。", width="751", height="1511" %} <figcaption>バッジは、アプリケーションが新しいコンテンツについてユーザーに通知するためのスマートな方法です。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %}<a href="/badging-api/">Badging API</a>を使用してアプリアイコンバッジを設定できます。これは、PWAに「未読」アイテムという概念がある場合、または目立たないようにユーザーの注意をアプリに向ける手段が必要な場合に特に役立ちます。 {% endDetails %}

## メディアの再生は省エネ設定よりも優先される

ポッドキャストメディアの再生中は、画面がオフになることがありますが、システムはスタンバイモードになりません。アプリは、たとえば歌詞やキャプションを表示するために、オプションで画面を起動状態に保つこともできます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CRkipfmdkLJrND83qvQw.png", alt="[Energy Saver] セクションのmacOS設定。", width="800", height="573" %} <figcaption>アプリは画面を起動状態に保つことができます。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %} <a href="/wakelock/">Screen Wake Lock API</a>を使用すると、画面がオフになるのを防ぐことができます。Webでのメディア再生は、システムがスタンバイモードに切り替わるのを自動的に防ぎます。 {% endDetails %}

## アプリストアでのアプリの検索

PodcastsアプリはmacOSデスクトップエクスペリエンスの一部ですが、iOSではAppStoreからインストールする必要があります。`podcast`、`podcasts`、または`apple podcasts`を検索すると、すぐにAppStoreでアプリが表示されます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZLr5quaQWA9VJGAHNrLd.png", alt="iOS App Storeで「podcasts」を検索するとPodcastsアプリが表示されます。", width="751", height="1511" %} <figcaption>ユーザーはアプリストアでアプリを検索することを学びました。</figcaption></figure>

{% Details %} {% DetailsSummary %} Webでこれを実行する方法{% endDetailsSummary %} AppleはAppStoreでのPWAを許可していませんが、Androidでは、<a href="/using-a-pwa-in-your-android-app/">信頼できるWebアクティビティにラップされた</a>PWAを送信できます。 <a href="https://github.com/GoogleChromeLabs/bubblewrap"><code>bubblewrap</code></a>スクリプトにより、これは簡単な操作になります。このスクリプトは、コマンドラインを実行せずに使用できる<a href="https://www.pwabuilder.com/">PWABuilder</a>のAndroidアプリのエクスポート機能を内部的に強化するものでもあります。 {% endDetails %}

## 機能の概要

以下の表は、すべての機能の概要を簡潔に説明し、Webで実現するために役立つリソースの一覧を示します。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>機能</th>
        <th>Webで実行するために役立つリソース</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="#capable-of-running-offline">オフラインで実行可能</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/architecture/app-shell">アプリシェルモデル</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#offline-content-available-and-media-playable">オフラインコンテンツが利用可能、メディア再生可能</a></td>
        <td>
          <ul>
            <li><a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">キャッシュに保存された音声と動画を再生</a></li>
            <li><a href="https://developer.chrome.com/docs/workbox/">ワークボックスライブラリ</a></li>
            <li><a href="/storage-for-the-web/">ストレージAPI</a></li>
            <li><a href="/persistent-storage/">永続ストレージAPI</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#proactive-background-downloading">プロアクティブなバックグラウンドダウンロード</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2018/12/background-fetch">Background Fetch API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#sharing-to-and-interacting-with-other-applications">他のアプリケーションとの共有と連携</a></td>
        <td>
          <ul>
            <li><a href="/web-share/">Web Share API</a></li>
            <li><a href="/web-share-target/">Web Share Target API</a></li>
            <li><a href="/image-support-for-async-clipboard/">Async Clipboard API</a></li>
            <li><a href="/contact-picker/">Contact Picker API</a></li>
            <li><a href="/get-installed-related-apps/">Get Installed Related Apps API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#background-app-refreshing">さわやかな背景アプリ</a></td>
        <td>
          <ul>
            <li><a href="/periodic-background-sync/">Periodic Background Sync API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#state-synchronized-over-the-cloud">クラウド上で同期された状態</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2015/12/background-sync">Background Sync API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#hardware-media-key-controls">ハードウェアメディアキーコントロール</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">Media Session API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#multitasking-and-app-shortcut">マルチタスクとアプリのショートカット</a></td>
        <td>
          <ul>
            <li><a href="/install-criteria/">インストール可能性の基準</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#quick-actions-in-context-menu">コンテキストメニューのクイックアクション</a></td>
        <td>
          <ul>
            <li><a href="/app-shortcuts/">アプリアイコンのショートカット</a></li>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/tree/master/RunOnLogin">ログイン時に実行</a> (初期段階)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#act-as-default-app">デフォルトのアプリとして機能する</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">URLプロトコル処理</a> (初期段階)</li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#local-file-system-integration">ローカルファイルシステムの統合</a></td>
        <td>
          <ul>
            <li><a href="/file-system-access/">File System Access API</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/browser-fs-access">browser-fs-accessライブラリ</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#platform-look-and-feel">プラットフォームのルックアンドフィール</a></td>
        <td>
          <ul>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>user-select: none</code></a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family: system-ui</code></a>
            </li>
            <li>
              <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a>
            </li>
            <li><a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">ダークモードトグル</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#customized-title-bar">カスタマイズされたタイトルバー</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">タイトルバーのカスタマイズ</a> (初期段階)</li>
            <li><a href="/add-manifest/#display">表示モード</a></li>
            <li><a href="/add-manifest/#theme-color">テーマカラー</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#snappy-animations">きびきびとしたアニメーション</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">アニメーションとパフォーマンスのヒント</a></li>
            <li><a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSSスクロールスナップ</a></li>
            <li><a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">Web Animations API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#content-surfaced-outside-of-app">アプリの外部に表示されたコンテンツ</a></td>
        <td>
          <ul>
            <li><a href="/content-indexing-api/">Content Index API</a></li>
            <li><a href="https://developers.google.com/search/docs/data-types/speakable">読み上げ可能コンテンツ</a></li>
            <li><a href="https://developers.google.com/search/docs/guides/search-gallery">構造化されたマークアップ</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#lock-screen-media-control-widget">ロック画面メディアコントロールウィジェット</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">Media Session API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#push-notifications">プッシュ通知</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/push-notifications">Push API</a></li>
            <li><a href="/notification-triggers/">Notification Triggers API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-icon-badging">アプリアイコンのバッジ</a></td>
        <td>
          <ul>
            <li><a href="/badging-api/">Badging API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#media-playback-takes-precedence-over-energy-saver-settings">メディアの再生は省エネ設定よりも優先される</a></td>
        <td>
          <ul>
            <li><a href="/wakelock/">Screen Wake Lock API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-discovery-through-an-app-store">アプリストアでのアプリの検索</a></td>
        <td>
          <ul>
            <li><a href="/using-a-pwa-in-your-android-app/">信頼できるWebアクティビティ</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/bubblewrap"><code>bubblewrap</code>ライブラリ</a></li>
            <li><a href="https://www.pwabuilder.com/">PWABuilderツール</a></li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## まとめ

PWAは、2015年の導入以来、長い道のりを歩んできました。[ProjectFugu🐡](https://developer.chrome.com/blog/fugu-status)のコンテキストでは、会社横断的なChromiumチームが最後に残ったギャップを埋めるために取り組んでいます。この記事のアドバイスの一部だけに従うことで、アプリのような感覚に少しずつ近づき、ユーザーに「単なるWebサイト」を扱っていることを忘れさせることができます。正直なところ、ほとんどの人にとって*実際の*アプリのように感じられる限り、アプリがどのように構築されているか (そしてなぜそれらが必要なのか) は気にしないはずです。

## 謝辞

この記事は、[Kayce Basques](/authors/kaycebasques/)氏、[Joe Medley](/authors/joemedley/)氏、[Joshua Bell](https://github.com/inexorabletash)氏、[Dion Almaer](https://blog.almaer.com/)氏、[Ade Oshineye](https://blog.oshineye.com/)氏、[Pete LePage](/authors/petelepage/)氏、[Sam Thorogood](/authors/samthor/)氏、[Reilly Grant](https://github.com/reillyeon)氏、[Jeffrey Yasskin](https://github.com/jyasskin)氏によってレビューされました。
