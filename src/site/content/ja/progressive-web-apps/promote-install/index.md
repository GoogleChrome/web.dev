---
layout: post
title: PWAのインストールを促進するためのパターン
authors:
  - pjmclachlan
  - mustafakurtuldu
date: 2019-06-04
updated: 2020-06-17
description: |2-

  Progressive Web Appのインストールを促進する方法とベストプラクティス。
tags:
  - progressive-web-apps
feedback:
  - api
---

プログレッシブウェブアプリ（PWA）のインストールでは、ユーザーの検索と利用をやすくさせます。PWAのインストールができることに気付いていないユーザーもいるので、PWAのインストールを促進および有効化することを目的とするアプリ内の体験を提供するに役立つ場合があります。

<figure class="w-figure w-figure--inline-right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PtJp54jasjOYyh9Soqzu.png", alt="PWAの簡単なインストールボタンのスクリーンショット.", width="800", height="368" %} <figcaption class="w-figcaption">PWA内にある簡単なインストールボタン. </figcaption></figure>

このリストは完璧ではないが、PWAのインストールを促進するための種々な方法の起点を共有します。 どんなパターン、*または利用中のパターン*に関係なく、これらはすべて、インストールフローをトリガーする同じコードにつながります。これは、[独自のアプリ内インストール体験を提供する方法](/customize-install/)に記載されています。

<div class="w-clearfix"> </div>

## PWAインストールプロモーションのベストプラクティス{: #best-practices}

サイトで使用しているプロモーションパターンを問わず適用されるベストプラクティスがいくつかあります。

- プロモーションは、ユーザージャーニーの流れの外に置いてください。たとえば、PWAログインページで、ログインフォームと送信ボタンの下に召喚状を配置します。促進パターンを破壊的に利用すると、PWAの有用性が低下し、エンゲージメント指標に悪影響を及ぼします。
- プロモーションを却下または拒否する機能を含めます。ユーザーがこれを行ったら、ユーザーの嗜好を覚えておいて、ユーザーがサインインしたか購入を完了したかなど、ユーザーとコンテンツとの関係に変化があった場合にのみ再プロンプトを表示します。
- PWAの別々部分でこれらの複数の手法を組み合わせますが、インストールプロモーションでユーザーを圧倒したり、迷惑をかけたりしないように注意してください。
- [`beforeinstallprompt`インベント](/customize-install/#beforeinstallprompt) }が発生した**後**にのみプロモーションを表示します。

## 自動ブラウザプロモーション{: #browser-promotion}

[特定の基準](/install-criteria/)が満たされると、ほとんどのブラウザーは、プログレッシブWebアプリがインストール可能な状態になることをユーザーに自動的に示します。たとえば、デスクトップChromeではオムニボックスにインストールボタンが表示されます。

<div class="w-columns">
  <figure class="w-figure" id="browser-install-promo">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zIfRss5zOrZ49c4VdJ52.png", alt="インストールインジケーターが表示されたオムニボックスのスクリーンショット.", width="800", height="307" %} <figcaption class="w-figcaption">ブラウザが インストールプロモーション(デスクトップ)を提供しました</figcaption></figure>
  <figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kRjcsxlHDZa9Nqg2Fpei.png", alt="ブラウザが提供したインストールプロモーションのスクリーンショット.", width="800", height="307" %} <figcaption class="w-figcaption"> ブラウザ提供のインストールプロモーション（モバイル） </figcaption></figure>
</div>

<div class="w-clearfix"> </div>

Chrome for Androidはユーザーにミニ情報バーを表示するが、これは`beforeinstallprompt`イベントで`preventDefault()` の呼び出しによって止められます。`preventDefault()`呼び出さない場合、バナーは、ユーザーが最初にサイトにアクセスしたときに表示され、Androidでのインストール条件を満たし、約90日後に再び表示されます。

## アプリケーションUIのプロモーションパターン{: #app-ui-patterns}

アプリケーションUIのプロモーションパターンは、ほぼすべての種類のPWAに使用でき、サイトナビゲーションやバナーなどのアプリケーションUIに表示されます。他のタイプのプロモーションパターンと同様に、ユーザーの移動の中断を最小限に抑えるために、ユーザーのコンテキストを認識することが重要です。

プロモーションUIをトリガーするタイミングを考慮したサイトは、インストール数を増やし、インストールに興味のないユーザーの移動を妨げることを回避します。

<div class="w-clearfix"> </div>

### シンプルインストールボタン{: #simple-button}

最も簡単なUXは、Webコンテンツの適切な場所に「インストール」または「アプリを入手する」ボタンを付けることです。ボタンが他の重要な機能をブロックせず、ユーザーがアプリケーションを移動する際の邪魔にならないようにしてください。

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kv0x9hxZ0TLVaIiP4Bqx.png", alt="カスタムインストールボタン", width="800", height="448" %} <figcaption class="w-figcaption">シンプルなインストールボタン</figcaption></figure>

<div class="w-clearfix"> </div>

### 固定のheader {: #header }

これは、サイトのheaderの一部であるインストールボタンです。他のheaderコンテンツには、ロゴやハンバーガーメニューなどのサイトのブランドがよく入っています。Headerは`position:fixed`になるか、サイトの機能とユーザーのニーズにあわせないかもしれません。

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GPJdkXcpNLR30r2zo7RR.png", alt="Headerのカスタムインストールボタン", width="800", height="448" %} <figcaption class="w-figcaption"> Headerのカスタムインストールボタン </figcaption></figure>

適切に使用すると、サイトのheaderからPWAのインストールを促進することは、最も忠実な顧客があなたの経験に戻しやすくするための優れた方法です。 PWA headerのピクセルは貴重であるため、インストールの召喚状のサイズが適切であり、他のheaderコンテンツよりも重要であり、邪魔にならないようにしてください。

<figure class="w-figure w-figure--inline-right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/L01AoSoy7LNk1ttMMax0.png", alt="Headerのカスタムインストールボタン", width="800", height="430" %} <figcaption class="w-figcaption"> Headerのカスタムインストールボタン </figcaption></figure>

次のことを確認してください。

- `beforeinstallprompt`が起動されていない限り、インストールボタンを表示しないでください。
- ユーザーに対するインストールされているユースケースの価値を評価します。プロモーションからのメリットを得る可能性が高いユーザーにのみプロモーションを表示するように、選択的なターゲティングを検討してください。
- 貴重なheaderスペースを効率的に使用します。Header でユーザーに提供するのに他に何が役立つかを検討し、他のオプションと比較したインストールプロモーションの優先度を比較検討します。

<div class="w-clearfix"> </div>

### ナビゲーションメニュー{: #nav }

<figure class="w-figure w-figure--inline-right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aT7NHi8lbsZW8TOm3Gaw.png", alt="ナビゲーションメニューのカスタムインストールボタン", width="800", height="1117" %} <figcaption class="w-figcaption"> スライドアウトナビゲーションメニューにインストールボタン/プロモーションを追加します. </figcaption></figure>

メニューを開いたユーザーがあなたの体験への関与を示しているため、ナビゲーションメニューはアプリのインストールを促進するのに最適な場所です。

次のことを確認してください。

- 重要なナビゲーションコンテンツを中断しないでください。 PWAインストールプロモーションを他のメニュー項目の下に配置します。
- ユーザーがPWAをインストールすることでメリットが得られる理由について、関連性の高く短い提案を行います。

<div class="w-clearfix"> </div>

### ランディングページ{: #landing }

ランディングページの目的はあなたの製品とサービスを宣伝することです。それで、これはあなたのPWAのインストールによるメリットを宣伝する規模を拡大することに適切である場所です。

<figure class="w-figure w-figure--inline-right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7q09M12HFxgIiWhKPGma.png", alt="ランディングページのカスタムインストールプロンプト", width="800", height="1117" %} <figcaption class="w-figcaption"> ランディングページのカスタムインストールプロンプト </figcaption></figure>

まず、サイトの価値提案を説明してから、訪問者にインストールにより得られるものを知らせます。

次のことを確認してください。

- 訪問者にとって最も重要な機能をアピールし、ランディングページに導くためのキーワードを強調します。
- インストールプロモーションと召喚状が目立つように調整するが、価値提案を明確にした後でのみです。これはあなたのランディングページですため、任意に調整してください。
- ユーザーが時間をよく費やすアプリの部分にインストールプロモーションを追加することを検討してください。

<div class="w-clearfix"> </div>

### バナーをインストールする{: #banner }

<figure class="w-figure w-figure--inline-right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7fLCQQhdk2OzrQD3Xh4E.png", alt="ページ上部のカスタムインストールバナー.", width="800", height="1000" %} <figcaption class="w-figcaption"> ページ上部の非表示のバナー. </figcaption></figure>

ほとんどのユーザーは、モバイル体験でインストールバナーに遭遇し、バナーによって提供されるインタラクションに精通しています。バナーはユーザーを混乱させる可能性があるため、慎重に使用する必要があります。

次のことを確認してください。

- バナーを表示する前に、ユーザーがサイトに関心を示すまで待ちます。ユーザーがバナーを却下した場合、電子商取引での購入やアカウントへの登録など、コンテンツへのエンゲージメントのレベルが高いことを示すコンバージョンイベントをユーザーがトリガーしない限り、バナーを再度表示しないでください。
- バナーにはPWAのインストールによる価値について簡単に説明する短文を記載してください。例えば、PWAのインストールをiOS / Androidアプリと区別するには、ユーザーのデバイスにほとんどストレージを使用しないことや、ストアのリダイレクトなしで直ちにインストールすることを伝えます。

<div class="w-clearfix"> </div>

### 一時的なUI {: #temporary-ui}

[スナックバー](https://material.io/components/snackbars/)のデザインパターンなどの一時的なUIは、ユーザーに通知し、ユーザーにアクションを簡単に完了させます。この場合は、アプリをインストールしてください。これらの種類のUIパターンを適切に使用すると、ユーザーフローが中断されずに、ユーザーが無視すると通常に自動的に閉じられます。

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6DySYRtyegazEfMcWXQL.png", alt="スナックバーとしてのカスタムインストールバナー.", width="800", height="448" %} <figcaption class="w-figcaption"> PWAがインストール可能であることを示す非表示のスナックバー. </figcaption></figure>

いくつかのエンゲージメント、アプリとのやり取りの後にスナックバーを表示します。ページの読み込み時に表示されたり、コンテキストから外れたりすると、簡単に見落とされたり、認知機能の過負荷につながる可能性があります。これが発生すると、ユーザーは表示されたものをすべて見落とす可能性が高いです。また、サイトの新規ユーザーはPWAのインストールをすぐできない可能性があることを忘れないでください。したがって、このパターンを使用する前に、ユーザーからの強い関心のシグナルが届くまで待つことをお勧めします。たとえば、繰り返しの訪問、ユーザーのサインイン、または同様のコンバージョンイベントなどです。

<figure class="w-figure w-figure--inline-right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/d8dwdIe1rYSgd0JdCGtt.png", alt="スナックバー形のカスタムインストールバナー.", width="800", height="424" %} <figcaption class="w-figcaption"> PWAのインストールができることを示す非表示のスナックバー. </figcaption></figure>

次のことを確認してください。

- スナックバーを4〜7秒間で表示して、ユーザーに邪魔をせずにそれを見て反応してもらうのに十分な時間を与えます。
- バナーなどの他の一時的なUIの上に表示しないでください。
- このパターンを使用する前に、ユーザーからの強い関心のシグナルが届くまで待ってください。たとえば、繰り返しの訪問、ユーザーのサインイン、または同様のコンバージョンイベントなどです。

<div class="w-clearfix"> </div>

## 変換後

ユーザーコンバージョンイベントの直後、たとえば電子商取引での購入後は、PWAのインストールを促進する絶好の機会です。ユーザーは明らかにあなたのコンテンツに関与しており、コンバージョンは、ユーザーが再びあなたのサービスに関与することを示します。

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/DrepSPFAm64d5cvTFoXe.png", alt="変換後のインストールプロモーションのスクリーンショット.", width="800", height="448" %} <figcaption class="w-figcaption">ユーザーが購入を完了した後にプロモーションをインストールします. </figcaption></figure>

### 予約またはチェックアウトの旅{: #journey }

<figure class="w-figure w-figure--inline-right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bOYZM2UiWK5itVSpjKWO.png", alt="ユーザージャーニーの後にプロモーションをインストールします.", width="800", height="1419" %} <figcaption class="w-figcaption"> ユーザージャーニーの後にプロモーションをインストールします. </figcaption></figure>

予約またはチェックアウトフローの典型的なものなど、連続した移動中または移動後にインストールプロモーションを表示します。ユーザーがジャーニーを完了した後にプロモーションを表示する場合は、ジャーニーが完了したため、プロモーションをより目立たせることができます。

次のことを確認してください。

- 関連する召喚状を付けます。アプリをインストールすることでメリットが得られるユーザーが誰ですか？とその理由は何ですか？彼らが現在行っているジャーニーとどのように関連していますか？
- ブランドにインストール済みのアプリユーザー向けの独自のオファーがある場合は、ここでそれらについて言及してください。
- プロモーションをジャーニーの次のステップに邪魔をしないようにしてください。そうしないと、ジャーニーの完了率に悪影響を与える可能性があります。上記の電子商取引の例では、チェックアウトの主要な召喚状がアプリのインストールプロモーションの上にあることに注目してください。

<div class="w-clearfix"> </div>

### サインアップ、サインイン、またはサインアウトフロー{: #sign-up}

このプロモーションは、プロモーションカードをより目立たせることができる[、ジャーニーの](#journey)プロモーションパターンの特殊なケースです。

<figure class="w-figure w-figure--inline-right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PQXqSqtwRSwyELdJMjtd.png", alt="サインアップページのカスタムインストールボタン。", width="800", height="1117" %}<figcaption class="w-figcaption">サインアップページのカスタムインストールボタン。</figcaption></figure>

これらのページは通常、PWAのバリュープロポジションがすでに確立されている熱心なユーザーのみに閲覧されます。また、通常にこれらのページには載せる有用なコンテンツがあまりあまりません。結果として、邪魔にならない限り、より大きな召喚状を作成することで混乱が少なくなります。

次のことを確認してください。

- サインアップフォーム内でのユーザーの移動を妨げないようにしてください。複数のステップからなるプロセスの場合は、ユーザーが移動を完了するまで待つことをお勧めします。
- 登録済のユーザーに最も関連する機能を宣伝します。
- アプリの登録済のエリア内にインストールプロモーションを追加することを検討してください。

<div class="w-clearfix"> </div>

## インラインのプロモーションパターン

インラインプロモーション手法は、プロモーションとサイトコンテンツを織り交ぜます。トレードオフのあるアプリケーションUIでのプロモーションよりも微妙になることが多いです。関心のあるユーザーが気付くほどプロモーションを目立たせたいが、ユーザー体験の質を損なわない範囲で調整してください。

### インフィード{: #インフィード}

インフィードインストールプロモーションは、PWAの各ニュース記事または他の情報カードの各リストの間に表示されます。

<figure class="w-figure w-figure--inline-right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/LS5qSE2vicfjRBBkA47a.png", alt="コンテンツフィード内にプロモーションをインストールします.", width="800", height="1000" %} <figcaption class="w-figcaption"> コンテンツフィード内にプロモーションをインストールします. </figcaption></figure>

あなたの目標は、ユーザーに楽しむコンテンツにもっと簡単にアクセスする方法を示すことです。ユーザーに役立つ機能の宣伝に注目してください。

次のことを確認してください。

- ユーザーを迷惑をかけないように、プロモーションの頻度を制限します。
- ユーザーがプロモーションを断れるようにします。
- 断ったユーザーの選択を覚えておいてください。
