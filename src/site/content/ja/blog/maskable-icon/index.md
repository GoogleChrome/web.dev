---
title: マスカブルアイコンを使用したPWAでのアダプティブアイコンのサポート
subhead: 対応プラットフォームでアダプティブアイコンを使用するための新しいアイコン形式。
description: マスカブルアイコンは、より詳細な制御を可能にし、プログレッシブWebアプリでアダプティブアイコンの使用を可能にする新しいアイコン形式です。マスカブルアイコンを提供することで、すべてのAndroidでアイコンの見栄えが良くなります。
authors:
  - tigeroakes
  - thomassteiner
date: 2019-12-19
updated: 2021-05-19
hero: image/admin/lzLo9JCh6bcehH2nSH0n.png
alt: 白い円の内側に表示されるアイコンと円全体を埋めるアイコンとの比較
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

## マスカブルアイコンとは何か。{: #what }

最近のAndroid携帯にプログレッシブWebアプリをインストールした場合、アイコンに白い背景が表示されることに気付くかもしれません。 Android Oreoは、さまざまなデバイスモデルでさまざまな形でアプリアイコンを表示するアダプティブアイコンを導入しました。この新しい形式に従わないアイコンには、白い背景が表示されます。

<figure>{% Img src="image/admin/jzjx6dGkXN9EdqnUzAeg.png", alt="Androidの白い円の中にあるPWAアイコン", width="400", height="100" %} <figcaption>透明なPWAアイコンがAndroidの白い円の中に表示されます</figcaption></figure>

マスカブルアイコンは、より詳細な制御を可能にし、プログレッシブWebアプリでアダプティブアイコンを使用できるようにする新しいアイコン形式です。マスカブルアイコンを提供すると、アイコンが図形全体を埋めて、すべてのAndroidデバイスで見栄えが良くなります。 最近、FirefoxとChromeはこの新しい形式のサポートを追加しました。これをアプリに採用できます。

<figure>{% Img src="image/admin/J7gkg9ylP2ANlFawblze.png", alt="Androidの円全体を埋めるPWAアイコン", width="400", height="100" %} <figcaption>代わりに、マスカブルアイコンが円全体を埋めます</figcaption></figure>

## 現在のアイコンは対応しているか。

マスカブルアイコンはさまざまな形状をサポートする必要があるため、ブラウザが後で目的の形状とサイズにトリミングできるように、不透明な画像にパディングを付けます。最終的に選択される形状はブラウザやプラットフォームごとに異なる可能性があるため、特定の形状に依存しないことをお勧めします。

<figure data-float="right">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/mx1PEstODUy6b5TXjo4S.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tw7QbXq9SBjGL3UYW0Fq.mp4"], autoplay=true, loop=true, muted=true, playsinline=true %} <figcaption>さまざまなプラットフォーム固有の形状</figcaption></figure>

幸いなことに、すべてのプラットフォームで適用される、明確に定義され、[標準化された](https://w3c.github.io/manifest/#icon-masks)「最小セーフゾーン」があります。ロゴなどのアイコンの重要な部分は、アイコンの幅の40％の半径で、アイコンの中心にある円形の領域内に表示されることが望ましいとされます。外側の10％の端がトリミングされる場合があります。

Chrome DevToolsを使用して、アイコンのどの部分がセーフゾーン内に収まるかを確認できます。プログレッシブWebアプリを開いた状態で、DevToolsを起動し、[**アプリケーション**]パネルに移動します。 [**アイコン]****セクションで、マスカブルアイコンの最小のセーフゾーンのみ**を表示するように選択できます。セーフゾーンのみが表示されるようにアイコンがトリミングされます。この安全な領域内にロゴが表示されている場合は、問題ありません。

<figure>{% Img src="image/admin/UeKTJM2SE0SQhgnnyaQG.png", alt="端がトリミングされたPWAアイコンを表示するDevToolsのアプリケーションパネル", width="762", height="423" %} <figcaption>アプリケーションパネル</figcaption></figure>

さまざまなAndroidの図形でマスカブルアイコンをテストするには、私が作成した[Maskable.app](https://maskable.app/)ツールを使用します。アイコンを開くと、Maskable.appでさまざまな形やサイズを試すことができ、チームの他のメンバーとプレビューを共有することもできます。

## マスカブルアイコンを採用する方法

既存のアイコンに基づいてマスカブルアイコンを作成する場合は、 [Maskable.appエディタ](https://maskable.app/editor)を使用できます。アイコンをアップロードし、色とサイズを調整してから、画像をエクスポートします。

<figure>{% Img src="image/admin/MDXDwH3RWyj4po6daeXw.png", alt="Maskable.appエディタのスクリーンショット", width="670", height="569" %} <figcaption> Maskable.appエディタでアイコンを作成する</figcaption></figure>

マスカブルアイコン画像を作成して、DevToolsでテストしたら、新しいアセットを参照するように[Webアプリマニフェスト](/add-manifest/)を更新する必要があります。 Webアプリマニフェストは、Webアプリに関する情報をJSONファイルで提供し、[`icons`配列](/add-manifest/#icons)を含みます。

マスカブルアイコンが追加され、Webアプリマニフェストにリストされている画像リソースに新しいプロパティ値が追加されました。 `purpose`フィールドは、アイコンの使用方法をブラウザに指示します。デフォルトでは、アイコンの目的は`"any"`です。これらのアイコンは、Androidの白い背景の上でサイズ変更されます。

マスカブルアイコンは、`"maskable"`という別の目的を使用する必要があります。これは、画像がアイコンマスクとともに使用されることを示し、結果をより細かく制御できます。このようにすると、アイコンの背景が白になりません。他のデバイスでマスクせずにマスカブルアイコンを使用する場合、スペースで区切った複数の目的 (たとえば、 `"any maskable"`) を指定することもできます。

{% Aside %} `"any maskable"`ように、スペースで区切られた複数の目的を*指定できます*が、実際には*指定しないでください*。 `"maskable"`アイコンを`"any"`アイコンとして使用することは、アイコンがそのまま使用されるため最適ではなく、余分なパディングが発生し、主要なアイコンのコンテンツが小さくなります。理想的には、 `"any"`目的のアイコンには透明な領域があり、サイトのファビコンのように余分なパディングがないようにする必要があります。これは、ブラウザによってアイコンに追加されないためです。 {% endAside %}

```json
{
  …
  "icons": [
    …
    {
      "src": "path/to/regular_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "path/to/maskable_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "maskable" // <-- 新しいプロパティ値 `"maskable"`
    },
    …
  ],
  …
}
```

これで、独自のマスカブルアイコンを作成し、端から端までアプリの見栄えが良くなることを確認できます (あくまでも私の意見ですが、円から円、楕円から楕円にも対応しています😄)。

## 謝辞

この記事は[Joe Medley](https://github.com/jpmedley)によってレビューされました。
