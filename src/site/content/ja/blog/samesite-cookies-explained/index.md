---
title: SameSite Cookie の説明
subhead: クロスサイト Cookie を明示的に設定する方法を学習し、サイトを安全に保ちます。
authors:
  - rowan_m
date: 2019-05-07
updated: 2020-05-28
hero: image/admin/UTOC41rgCccAqVNbJlyK.jpg
description: SameSite 属性を使用して、ファーストパーティおよびサードパーティでの使用に合わせて Cookie を設定する方法について説明します。SameSite 属性の Lax 値と Strict 値を使用して CSRF 攻撃に対する保護を強化することにより、サイトのセキュリティを高めることができます。また、新しい None 値を指定することにより、クロスサイトでの使用に合わせて Cookie を明示的に設定することができます。
tags:
  - blog
  - security
  - cookies
  # - chrome80
feedback:
  - api
---

{% Aside %}この記事は、Cookie の `SameSite` 属性の変更を扱うシリーズ記事の一部です。

- [SameSite Cookie の説明](/samesite-cookies-explained/)
- [SameSite Cookie のレシピ](/samesite-cookie-recipes/)
- [スキームフル Same-Site](/schemeful-samesite){% endAside %}

Cookie は Web サイトに永続的な状態を付与するために利用可能な方法の 1 つです。長い年月をかけてその機能は成長し、進化を続けてきましたが、プラットフォームに問題を引き起こす可能性がある旧来からの問題を残していました。この問題に対処するために、デフォルトの設定がプライバシーをより良く保護するためのものとなるようにブラウザー (Chrome、Firefox、Edge を含む) の動作が変更されています。

それぞれの Cookie は、`key=value` のペアと、その Cookie がいつ、どこで使用されるのかを制御するためのいくつかの属性によって構成されています。これらの属性を使用して有効期限を設定したり、Cookie が HTTPS を介してのみ送信されるように設定を行なったりしたことがすでにおありかもしれません。サーバーは、適切に名付けられた `Set-Cookie` ヘッダーをレスポンスで送信することによって Cookie を設定します。詳細については「[RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1)」でご確認いただくことが可能ですが、ここでも簡単にご説明させていただきます。

たとえばあなたがブログを運営していて、ユーザーに対して "新着情報" のプロモーションを表示させたい場合を想像してみてください。ユーザーはそのプロモーション表示を消すことができ、そのプロモーションはしばらくの間表示されなくなります。こういった設定を Cookie に保存し、1 か月 (260 万秒) で期限切れになるように設定し、HTTPS でのみ送信を行う場合、そのヘッダーは次のようになります。

```text
Set-Cookie: promo_shown=1; Max-Age=2600000; Secure
```

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jJ1fqcsAk9Ig3hManFBO.png", alt="サーバーからブラウザーへとレスポンスで送信される 3 つの Cookie", width="800", height="276", style="max-width: 60vw" %} <figcaption class="w-figcaption">サーバーは <code>Set-Cookie</code> ヘッダーを使用して Cookie を設定します。</figcaption></figure>

ページの読者がこれらの条件を満たしているページを閲覧した場合、つまり、安全な接続が確立され、Cookie が 1 か月以内に作成されたものである場合、読者のブラウザーはリクエストで次のヘッダーを送信します。

```text
Cookie: promo_shown=1
```

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rq21WQpOZFvfgS9bbjmc.png", alt="1 回のリクエストでブラウザーからサーバーへと送信される 3 つの Cookie", width="800", height="165", style="max-width: 60vw" %} <figcaption class="w-figcaption">ブラウザーは、<code>Cookie</code> ヘッダーで Cookie を送り返します。</figcaption></figure>

また、`document.cookie` を使用してそのサイトで利用可能な Cookie を JavaScript で追加したり、読み取ったりすることができます。`document.cookie` に代入を行うと、そのキーで Cookie を作成したり、上書きしたりすることができます。たとえば、ブラウザーの JavaScript コンソールで以下のものを試してみてください。

```text
> document.cookie = "promo_shown=1; Max-Age=2600000; Secure"
< "promo_shown=1; Max-Age=2600000; Secure"
```

`document.cookie` を読み取ると、現在のコンテキストでアクセス可能なすべての Cookie が、それぞれの Cookie がセミコロンで区切られた形式で出力されます。

```text
> document.cookie;
< "promo_shown=1; color_theme=peachpuff; sidebar_loc=left"
```

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mbV00Gy5VAPTUls0i7cM.png", alt="ブラウザー内の Cookie にアクセスする JavaScript", width="600", height="382", style="max-width: 35vw" %} <figcaption class="w-figcaption">JavaScript は <code>document.cookie</code> を使用して Cookie にアクセスすることができます。</figcaption></figure>

人気のあるサイトで確認してみると、ほとんどのサイトで 3 つ以上の Cookie が設定されていることにお気付きになるはずです。ほとんどの場合、これらの Cookie はそのドメインへのすべてのリクエスト一つ一つで送信されますが、これは多くの意味を持っています。ユーザーにとってアップロードの帯域はダウンロードの帯域よりも制限されている場合が多いため、すべての送信リクエストにかかるオーバーヘッドは Time to First Byte (サーバーの初期応答時間、TTFB) に悪影響を及ぼすことになります。設定するクッキーの数やサイズについては、控えめに設定するようにしましょう。`Max-Age` 属性を利用して、Cookie が必要以上に長く留まらないようにしてください。

## ファーストパーティ Cookie およびサードパーティ Cookie とは、何ですか？

以前閲覧していたサイトに戻ってみると、現在アクセスしているサイトだけでなくさまざまなドメインを対象とした Cookie があることにお気付きになるかもしれません。現在訪問中のサイト (ブラウザーのアドレス バーに表示されているサイト) のドメインに一致する Cookie は、**ファーストパーティ** Cookie と呼ばれ、同様に現在訪問中のサイト以外のドメインからの Cookie は **サードパーティ** Cookie と呼ばれます。これは絶対的な分類ではなく、ユーザーのコンテキストに応じた相対的なものです。同じ Cookie でも、ユーザーがその時点でどのサイトにいるかによってファーストパーティ Cookie であったり、サードパーティ Cookie であったりします。

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zjXpDz2jAdXMT83Nm3IT.png", alt="同じページ内の異なるリクエストからブラウザに送信される 3 つの Cookie", width="800", height="346", style="max-width: 60vw" %} <figcaption class="w-figcaption">Cookie は 1 つのページ内にある様々なドメインから送信されてくる可能性があります。</figcaption></figure>

前述した例において、あなたが運営するブログ記事の中に特に素晴らしい猫の写真があり、それが `/blog/img/amazing-cat.png` でホストされているとします。そして、その画像があまりにも素晴らしい画像であるために、他の人物がその人が運営するサイトで直接その画像を使用しているとします。もしもサイトの訪問者があなたのブログを過去に訪問したことがあり、`promo_shown` の Cookie を保持している場合、他者が運営するサイトで `amazing-cat.png` を閲覧すると、その画像へのリクエストで Cookie が**送信されます**。この場合、`promo_shown` が他者が運営するサイトで何かに使用されるわけではないために特に有益性はなく、リクエストにオーバーヘッドを加えるだけのものになってしまっています。

この動作が意図しないものであるとすれば、なぜこのような動作をするのでしょうか？実はこのメカニズムにより、サイトがサードパーティのコンテキストで使用されている場合でもサイトの状態を維持することができるようになるのです。たとえば、YouTube の動画がサイトに埋め込まれている場合、訪問者のプレーヤーには "後で見る" というオプションが表示されます。訪問者がすでに YouTube にサインインしている場合には、そのセッションはサードパーティ Cookie によって埋め込みプレーヤー内で利用できるようになっています。つまり、サインインを促されたり、閲覧しているページから YouTube へと移動させられたりすることもなく "後で見る" ボタンを使用して動画をすぐに保存できるようになっているのです。

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/u9chHBLm3i27yFRwHx5W.png", alt="3 つの異なるコンテキストで送信されている同じ Cookie", width="800", height="433", style="max-width: 60vw" %} <figcaption class="w-figcaption">サードパーティ コンテキストの Cookie は、様々なページ訪問において送信されます。</figcaption></figure>

Web の文化的特性の 1 つに、元来オープンであるという傾向が挙げられます。これにより、多くの人々が独自のコンテンツやアプリケーションを作成することが可能となりました。しかしながらその一方で、セキュリティやプライバシーの面での懸念も数多く生じています。クロスサイト リクエスト フォージェリ (CSRF) 攻撃は、誰がリクエストを開始したかに関わらず特定のオリジンに対するリクエストに Cookie が添付されてしまうという動作を悪用しています。たとえば、あなたが `evil.example` にアクセスすると、`your-blog.example` (あなたのブログのドメイン) へのリクエストが誘発され、あなたのブラウザーが関連する Cookie を喜んで添付してしまったりする可能性があります。あなたのブログにおいてこういったリクエストの検証に注意が払われていなかった場合には、`evil.example` が記事の削除や独自コンテンツの追加などのアクションを起こしてしまう可能性があります。

複数のサイトを横断するユーザー アクティビティの追跡に Cookie がどのように使用されているかについては、ユーザーの意識も高まってきています。しかしながら、これまでは Cookie にその意図を明示する方法がありませんでした。`promo_shown` の Cookie はファーストパーティのコンテキストでのみ送信されるべきものですが、別のサイトに埋め込まれることが意図されているウィジェット用のセッション Cookie は、サードパーティのコンテキストにおいてサインイン状態を提供するために意図的に存在しています。

## `SameSite` 属性を使用して Cookie の使用条件を明示する

[RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00) で定義されている `SameSite` 属性の導入により、Cookie の付与をファーストパーティまたは同一サイトのコンテキストに限定するかどうかを宣言できるようになりました。ここでは、"サイト" の意味の正確な理解が役に立ちます。サイトとは、ドメイン サフィックスとその直前にあるドメイン部分の組み合わせです。たとえば、`www.web.dev` ドメインは `web.dev` サイトの一部です。

{% Aside 'key-term' %}

ユーザーが `www.web.dev` を閲覧していて `static.web.dev` に画像をリクエストする場合、これは**同一サイト** リクエストです。

{% endAside %}

[Public Suffix List](https://publicsuffix.org/) がこれを定義し、その中には `.com` のようなトップレベル ドメインだけでなく `github.io` のようなサービスも含まれています。そのため、`your-project.github.io` と `my-project.github.io` を別々のサイトとして見なすことができるようになってます。

{% Aside 'key-term' %}

ユーザーが `your-project.github.io` を閲覧していて `my-project.github.io` に画像をリクエストする場合、これは**クロスサイト** リクエストです。

{% endAside %}

Cookie に `SameSite` 属性を導入すると、この動作を制御するために 3 つの異なる方法を利用できるようになります。属性を指定しないことも可能ですし、`Strict` や `Lax` の値を使用して Cookie の付与を同一サイト リクエストのみに制限することもできます。

`SameSite` 属性を `Strict` に設定すると、Cookie はファーストパーティのコンテキストでのみ送信されるようになります。ユーザー目線の用語を用いて説明すると、Cookie のサイトがブラウザーの URL バーに現在表示されているサイトに一致する場合にのみ、Cookie が送信されます。これは、`promo_shown` の Cookie が次のように設定されている場合に適用されます。

```text
Set-Cookie: promo_shown=1; SameSite=Strict
```

ユーザーがあなたのサイトを訪問しているとき、Cookie は意図した通りにリクエストとともに送信されます。しかしながら、別のサイトや友人から届いたメールなどからあなたのサイトへのリンクをたどる場合には、最初のリクエストでは Cookie は送信されません。これは、パスワードの変更や商品の購入など、初回のナビゲーションですぐに利用可能な機能に関連する Cookie を保持している場合には適しているのですが、`promo_shown` に対しては制限が強すぎます。リンクをたどってサイトに流入してきた場合でも、読者はそれぞれの設定が反映されるように Cookie を送信してほしいと考えるかもしれません。

こういった場合には、このようなトップレベル ナビゲーションでの Cookie の送信を許可することができる `SameSite=Lax` が最適です。前述した猫の記事の例に戻り、別のサイトがあなたのコンテンツを参照している場合について考えてみましょう。他のユーザーは、あなたの猫の写真を直接利用していて、あなたのオリジナル記事へのリンクを提供しています。

```html
<p>この素晴らしい猫を見て！</p>
<img src="https://blog.example/blog/img/amazing-cat.png" />
<p>この<a href="https://blog.example/blog/cat.html">記事</a>を読んでみてください。</p>
```

そして、Cookie は次のように設定されています。

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

読者が他のユーザーのブログを閲覧している場合、ブラウザーが `amazing-cat.png` をリクエストしても Cookie は**送信されません**。しかしながら、読者がリンクをたどってあなたのブログの `cat.html` にアクセスする場合、そのリクエストには Cookie が**含まれています**。これらのことから、サイトの表示に影響を与える Cookie には `Lax` が、ユーザーのアクションに関連する Cookie には `Strict` が適していると言えます。

{% Aside 'caution' %}

また、`Strict` と `Lax` のどちらもサイトのセキュリティに関しては完全なソリューションであるとは言えません。Cookie はユーザーのリクエストの一部として送信されるため、他のユーザー入力と同じように扱う必要があります。つまり、入力をサニタイズして検証する必要があるということです。サーバーサイドの秘密情報と思わしきデータの保存に Cookie を使用しないでください。

{% endAside %}

最後に、値を指定しないというオプションについてですが、このオプションはこれまで、すべてのコンテキストでの Cookie の送信を暗黙的に表明する方法でした。そして [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03) の最新版のドラフトでは `SameSite=None` という新しい値が導入され、これが明示されるようになりました。つまり、`None` という値を使用することでサードパーティのコンテキストでの Cookie の意図的な送信を明示的に伝えることができるようになったのです。

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1MhNdg9exp0rKnHpwCWT.png", alt="コンテキストに応じて None、Lax、Strict と表示されている 3 つのクッキー", width="800", height="456", style="max-width: 60vw" %} <figcaption class="w-figcaption">Cookie のコンテキストを <code>None</code>、<code>Lax</code>、<code>Strict</code> として明示的にマークします。</figcaption></figure>

{% Aside %}

ウィジェット、埋め込みコンテンツ、アフィリエイト プログラム、広告、複数のサイトを横断するサインインなど、他のサイトで利用されるサービスを提供する場合には、意図が明確になるように `None` を使用する必要があります。

{% endAside %}

## SameSite を使用しない場合のデフォルトの動作の変更

`SameSite` 属性は、広くサポートされてはいるものの、残念ながら開発者には広く受け入れられていません。あらゆる場所に Cookie を送信するというオープンなデフォルト動作はすべてのユースケースが動作することを意味していますが、ユーザーを CSRF や意図しない情報漏洩の危険にさらしてしまいます。開発者に意図を伝え、ユーザーにより安全な環境を提供するために、IETF の提案である「[Cookie の漸次的な改善](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00)」では以下 2 つの重要な変更点が提示されています。

- `SameSite` 属性を持たない Cookie は、`SameSite=Lax` として扱われる。
- `SameSite=None` の Cookie では、安全なコンテキストが必要であることを意味する `Secure` も一緒に指定する必要がある。

Chrome ではバージョン 84 よりこの動作がデフォルトとして実装されています。[Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ) では Firefox 69 でテストが可能となっており、将来的にはデフォルトの動作となる予定です。Firefox でこれらの動作をテストするには、[`about:config`](http://kb.mozillazine.org/About:config) を開き、`network.cookie.sameSite.laxByDefault` を設定します。[Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) でもデフォルトの動作が変更される予定です。

{% Aside %}

この記事は、追加のブラウザーがサポートを発表した場合に更新されます。

{% endAside %}

### デフォルト値としての `SameSite=Lax`

{% Compare 'worse', 'No attribute set' %}

```text
Set-Cookie: promo_shown=1
```

{% CompareCaption %}

`SameSite` 属性が指定されていない Cookie を送信すると…

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Default behavior applied' %}

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

{% CompareCaption %}

ブラウザーは `SameSite=Lax` が指定されているものとしてその Cookie を扱います。

{% endCompareCaption %}

{% endCompare %}

この変更は、より安全なデフォルトの動作の適用を意図して実施されたものですが、ブラウザーによる適用に頼るのではなく、明示的に `SameSite` 属性を設定するのが理想的な方法です。これにより Cookie の意図が明確になり、様々なブラウザーにおいて一貫性のあるユーザー体験を提供できる可能性が高くなります。

{% Aside 'caution' %}

Chrome で適用されるデフォルトの動作は、トップレベル ナビゲーションでの POST リクエストで特定の Cookie の送信が許可されるため、明示的な `SameSite=Lax` よりも若干寛容です。詳細については、「[blink-dev のアナウンス](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/YKBxPCScCwAJ)」を参照してください。これは一時的な緩和を目的としたものであり、クロスサイトの Cookie については `SameSite=None; Secure` を使用するように修正する必要があります。

{% endAside %}

### `SameSite=None` には必ず Secure を指定する

{% Compare 'worse', 'Rejected' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None
```

{% CompareCaption %}

`Secure` が指定されていない Cookie の設定は、**拒否されます**。

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Accepted' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

{% CompareCaption %}

`SameSite=None`を`Secure`属性とペアにする必要があります。

{% endCompareCaption %}

{% endCompare %}

Chrome のバージョン 76 以降では `about://flags/#cookies-without-same-site-must-be-secure` を、Firefox のバージョン 69 以降では [`about:config`](http://kb.mozillazine.org/About:config) で `network.cookie.sameSite.noneRequiresSecure` を設定することにより、この動作のテストを行うことができます。

新しい Cookie を設定する場合にはこれを適用し、有効期限が近づいていない場合でも既存の Cookie を積極的に更新することをお勧めします。

{% Aside 'note' %}

運営するサイトがサードパーティ製コンテンツを提供するサービスに依存している場合には、そのサービスが更新されているかどうかをプロバイダーに確認する必要もあります。また、サイトに新しい動作を反映させるために依存関係やスニペットを更新しなければならない場合もあります。

{% endAside %}

これらの変更は、いずれも旧バージョンの `SameSite` 属性を正しく実装しているか、あるいは全くサポートしていないブラウザーに対する後方互換性を持っています。これらの変更を Cookie に適用することにより、ブラウザーのデフォルト動作に頼ることなく意図的に使用方法を明示することができます。そして、クライアントが `SameSite=None` をまだ認識していない場合にはこれは無視され、この属性が設定されていないものとして処理されます。

{% Aside 'warning' %}

Chrome、Safari、UC ブラウザーを含む数多くのブラウザーの旧バージョンは新しい `None` 値との互換性を持っておらず、Cookie を無視したり、制限したりしてしまう可能性があります。この動作は現在のバージョンでは修正されていますが、この動作の影響を受けるユーザーの割合がどの程度になるのか、トラフィックを確認して把握する必要があります。詳細については、Chromium サイトの「[既知の非互換クライアント](https://www.chromium.org/updates/same-site/incompatible-clients)」のリストをご覧ください。

{% endAside %}

## `SameSite` Cookie のレシピ

前述した `SameSite=None` についての変更やブラウザーの動作の違いを上手に処理するための Cookie の更新方法の詳細については、次の記事「[SameSite Cookie のレシピ](/samesite-cookie-recipes)」を参照してください。

*Lily Chen、Malte Ubl、Mike West、Rob Dodson、Tom Steiner、Vivek Sekhar のご意見およびご協力に、心より感謝申し上げます。*

*クッキーのヒーロー画像の提供: [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) の [Pille-Riin Priske](https://unsplash.com/photos/UiP3uF5JRWM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
