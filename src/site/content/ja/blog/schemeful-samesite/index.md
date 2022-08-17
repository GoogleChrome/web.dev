---
layout: post
title: スキームフル Same-Site
subhead: "「Same-Site」の定義は、URL スキームを含めるように進化しているため、サイトの HTTP バージョンと HTTPS バージョン間のリンクはクロスサイトリクエストとして考慮されるようになっています。できる限り問題を回避できるようにデフォルトで HTTPS にアップグレードするか、どのような SameSite 属性が必要であるかに関する詳細をお読みください。"
description: "「Same-Site」の定義は、URL スキームを含めるように進化しているため、サイトの HTTP バージョンと HTTPS バージョン間のリンクはクロスサイトリクエストとして考慮されるようになっています。できる限り問題を回避できるようにデフォルトで HTTPS にアップグレードするか、どのような SameSite 属性が必要であるかに関する詳細をお読みください。"
authors:
  - bingler
  - rowan_m
date: 2020-11-20
hero: image/admin/UMxBPy0AKAfbzxwgTroV.jpg
thumbnail: image/admin/3J33n1o98vnkO6fdDFwP.jpg
alt: クッキーを載せた 2 枚の皿。皿は HTTP と HTTPS の異なるスキームを、クッキーは Cookie を表している。
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside %} この記事は、`SameSite` Cookie 属性の変更に関する連載の一部です。

- [SameSite Cookie の説明](/samesite-cookies-explained/)
- [SameSite Cookie のレシピ](/samesite-cookie-recipes/)
- [スキームフル Same-Site](/schemeful-samesite){% endAside %}

[スキームフル Same-Site](https://mikewest.github.io/cookie-incrementalism/draft-west-cookie-incrementalism.html#rfc.section.3.3) は、単なる登録可能なドメインからスキームと登録可能なドメインへと（Web）サイトの定義を変更しています。詳細と例については、「[「same-site」と「same-origin」を理解する](/same-site-same-origin/#%22schemeful-same-site%22)」をご覧ください。

{% Aside 'key-term' %} つまり、**http**://website.example のようにセキュリティで保護されていない HTTP バージョンのサイトと **https**://website.example のようにセキュリティで保護された HTTPS バージョンのサイトは、互いに**クロスサイト**とみなされるということです。{% endAside %}

嬉しいのは、Web サイトがすでに完全に HTTPS にアップグレードされているのであれば、何も心配する必要はないということです。そのままで構いません。

Web サイトをまだ完全にアップグレードしていない場合は、これを優先事項する必要があります。ただし、サイト訪問者が HTTP と HTTPS の間を行き来する場合がある場合は、それらの一般的なシナリオと、関連する `SameSite` Cookie の動作の概要を以下に示しています。

{% Aside 'warning' %} 長期的には、[サードパーティ Cookie のサポート完全に失くして](https://blog.chromium.org/2020/10/progress-on-privacy-sandbox-and.html)、プライバシーを保護するほかの技術に置き換えることが計画されています。完全な HTTPS に移行するまでの一時的なソリューションとしては、Cookie に `SameSite=None; Secure` を設定してスキーム間で Cookie を送信できるようにすることに限ることをお勧めします。 {% endAside %}

これらの変更を有効にして、Chrome と Firefox の両方でテストできます。

- Chrome 86 で `about://flags/#schemeful-same-site` を有効にします。進捗状況は [Chrome ステータスページ](https://chromestatus.com/feature/5096179480133632)で追跡してください。
- Firefox 79 の `about:config` で `network.cookie.sameSite.schemeful` を `true` に設定します。進捗状況は [Bugzilla の問題](https://bugzilla.mozilla.org/show_bug.cgi?id=1651119)で追跡してください。

Cookie のデフォルトを `SameSite=Lax` に変更した主な理由の 1 つは、[クロスサイトリクエストフォージェリ（CSRF）](https://developer.mozilla.org/docs/Glossary/CSRF)から保護することでした。ただし、セキュリティで保護されていない HTTP トラフィックは、ネットワーク攻撃者が 同じサイトのセキュリティで保護された HTTPS バージョンで Cookie を使用できるように、その Cookie を改ざんする機会を与えています。スキーム間にクロスサイトの境界をさらに作成することで、これらの攻撃に対する防御をさらに高めることができます。

## 一般的なクロススキームのシナリオ

{% Aside 'key-term' %} すべての URL に site.example のように同一の登録可能なドメインがあっても、**http**://site.example と **https**://site.example のようにスキームが異なるような以下の例では、これらのドメインは互いに**クロススキーム**と呼ばれます。{% endAside %}

### ナビゲーション

クロススキームバージョンの Web サイト間を移動する際（たとえば、**http**://site.example から **https**://site.example にリンクしている場合）、以前は `SameSite=Strict` Cookie を送信することができました。現在では、これはクロスサイトナビゲーションとして扱われるようになっており、つまり `SameSite=Strict` Cookie はブロックされるようになっています。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yDViqKg9eeEeAEiCNqe4.png", alt="セキュリティで保護されていない HTTP バー所jんのサイトからセキュリティで保護された HTTPS バージョンのサイトへのリンクをたどることでトリガーされるクロススキームナビゲーション。SameSite=Strict Cookie はブロックされ、安全な Cookie である  SameSite=Lax と SameSite=None が許可されている。", width="800", height="342" %} <figcaption> HTTP から HTTPS へのクロススキームナビゲーション。 </figcaption></figure>

<table>
  <tr>
   <td>
   </td>
   <td>
<strong>HTTP→HTTPS</strong>
   </td>
   <td>
<strong>HTTPS→HTTP</strong>
   </td>
  </tr>
  <tr>
   <td>
<code>SameSite=Strict</code>
   </td>
   <td>⛔ブロック</td>
   <td>⛔ブロック</td>
  </tr>
  <tr>
   <td>
<code>SameSite=Lax</code>
   </td>
   <td>✓許可</td>
   <td>✓許可</td>
  </tr>
  <tr>
   <td>
<code>SameSite=None;Secure</code>
   </td>
   <td>✓許可</td>
   <td>⛔ブロック</td>
  </tr>
</table>

### サブリソースの読み込み

{% Aside 'warning' %} すべての主要なブラウザは、スクリプトや iframe などの[アクティブな混合コンテンツ](https://developer.mozilla.org/docs/Web/Security/Mixed_content)をブロックします。また、[Chrome](https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html) や [Firefox](https://groups.google.com/g/mozilla.dev.platform/c/F163Jz32oYY) などのブラウザは、パッシブ混合コンテンツのアップグレードまたはブロックに取り組んでいます。 {% endAside %}

ここで行った変更は、完全な HTTPS へのアップグレード作業中の一時的な修正と見なす必要があります。

サブリソースの例には、XHR または Fetch で作成された画像、iframe、ネットワークリクエストが含まれます。

クロススキームサブリソースをページに読み込むすると、以前は `SameSite=Strict` または`SameSite=Lax` Cookie を送信するか否かを設定できました。現在、これは他のサードパーティまたはクロスサイトのサブリソースと同じように処理されるようになっているため、`SameSite=Strict` または `SameSite=Lax` Cookie はブロックされます。

さらに、ブラウザがセキュリティで保護されていないスキームからのリソースをセキュリティで保護されたページに読み込むことを許可している場合でも、サードパーティまたはクロスサイトの Cookie には `Secure` が必要なため、これらのリクエストではすべての Cookie がブロックされます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GgR6Yln1f9JGkt04exRC.png", alt="セキュリティで保護されていない HTTP バージョンのサイトに含まれているセキュリティで保護された HTTPS バージョンのサイトのリソースによって生じるクロススキームサブリソース。SameSite= Strict および SameSite = Lax Cookie がブロックされ、SameSite = None; Secure Cookie が許可される。", width="800", height="285" %} <figcaption> HTTPS を通じてクロススキームサブリソースを含む HTTP ページ。 </figcaption></figure>

<table>
  <tr>
   <td>
   </td>
   <td>
<strong>HTTP→HTTPS</strong>
   </td>
   <td>
<strong>HTTPS→HTTP</strong>
   </td>
  </tr>
  <tr>
   <td>
<code>SameSite=Strict</code>
   </td>
   <td>⛔ブロック</td>
   <td>⛔ブロック</td>
  </tr>
  <tr>
   <td>
<code>SameSite=Lax</code>
   </td>
   <td>⛔ブロック</td>
   <td>⛔ブロック</td>
  </tr>
  <tr>
   <td>
<code>SameSite=None;Secure</code>
   </td>
   <td>✓許可</td>
   <td>⛔ブロック</td>
  </tr>
</table>

### フォームの POST 送信

クロススキームバージョンの Web サイト間で POST 送信を行うと、以前は `SameSite=Lax` または `SameSite=Strict` に設定された Cookie を送信できました。現在では、これはクロスサイト POST 送信として扱われており、`SameSite=None` の Cookie のみを送信できるようになっています。このシナリオは、デフォルトでセキュリティで保護されていないバージョンを提供しているサイトで発生する可能性がありますが、サインインまたはチェックアウトフォームの送信時にユーザーをセキュリティで保護されたバージョンにアップグレードするサイトで使用されている可能性があります。

サブリソースと同様に、リクエストがセキュリティで保護された HTTPS から セキュリティで保護されていない HTTP に移行する場合、サードパーティまたはクロスサイトの Cookie には `Secure` が必要であるため、これらのリクエストではすべての Cookie がブロックされます。

{% Aside 'warning' %} ここでの最善の解決策は、フォームページと宛先の両方が HTTPS などの安全な接続上にあることを確認することです。これは、ユーザーがフォームに機密情報を入力する場合に特に重要となります。 {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ud9LkDeGJUWHObifD718.png", alt="セキュリティで保護されていない HTTP バージョンのサイトにあるフォームがセキュリティで保護された HTTPS バージョンに送信されることで生じるクロススキームフォーム送信。SameSite=Strict と SameSite=Lax Cookie がブロックされ、SameSite=None; Secure Cookie が許可される。", width="800", height="376" %} <figcaption> HTTP から HTTPS へのクロススキームフォーム送信。 </figcaption></figure>

<table>
  <tr>
   <td>
   </td>
   <td>
<strong>HTTP→HTTPS</strong>
   </td>
   <td>
<strong>HTTPS→HTTP</strong>
   </td>
  </tr>
  <tr>
   <td>
<code>SameSite=Strict</code>
   </td>
   <td>⛔ブロック</td>
   <td>⛔ブロック</td>
  </tr>
  <tr>
   <td>
<code>SameSite=Lax</code>
   </td>
   <td>⛔ブロック</td>
   <td>⛔ブロック</td>
  </tr>
  <tr>
   <td>
<code>SameSite=None;Secure</code>
   </td>
   <td>✓許可</td>
   <td>⛔ブロック</td>
  </tr>
</table>

## 自分のサイトをテストするには？

Chrome と Firefox で開発者向けツールとメッセージングを使用できます。

Chrome 86 では、スキームフル Same-Site 問題は、[DevTools の［Issue］タブ](https://developer.chrome.com/docs/devtools/issues/)に含まれます。サイトでは以下の問題がハイライトされる場合があります。

ナビゲーションの問題:

- 「Migrate entirely to HTTPS to continue having cookies sent on same-site requests」- Chrome の将来のバージョンで Cookie が**ブロックされる**という警告です。
- 「Migrate entirely to HTTPS to have cookies sent on same-site requests」- Cookie が**ブロックされている**という警告です。

サブリソースの読み込みの問題:

- 「Migrate entirely to HTTPS to continue having cookies sent to same-site subresources」または「Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources」- Chrome の将来のバージョンで Cookie が**ブロックされる**という警告です。
- 「Migrate entirely to HTTPS to have cookies sent to same-site subresources」または「Migrate entirely to HTTPS to allow cookies to be set by same-site subresources」- Cookie が**ブロックされている**という警告です。後者の警告は、フォームを POST 送信するときにも表示される可能性があります。

詳細については、「[スキームフル Same-Site のテストとデバッグのヒント](https://www.chromium.org/updates/schemeful-same-site/testing-and-debugging-tips-for-schemeful-same-site)」をご覧ください。

Firefox 79 の `about:config` で、`network.cookie.sameSite.schemeful` を `true` に設定すると、コンソールにスキームフル Same-Site の問題に関するメッセージが表示されます。サイトで以下のようなメッセージが表示される場合があります。

- 「 Cookie `cookie_name` **will be soon** treated as cross-site cookie against `http://site.example/` because the scheme does not match.」
- 「Cookie `cookie_name` **has been** treated as cross-site against `http://site.example/` because the scheme does not match.」

## よくある質問

### 私のサイトはすでに完全に HTTPSで提供されていますが、ブラウザの DevTools で問題が表示されているのはなぜですか？

一部のリンクとサブリソースが依然としてセキュリティで保護されていない URL を指している可能性があります。

この問題を修正する 1 つの方法は、[HTTP Strict-Transport-Security](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)（HSTS）と `includeSubDomain` ディレクティブを使用することです。HSTS + `includeSubDomain` を使用すると、ページの 1 つに誤ってセキュリティで保護されていないリンクが含まれている場合でも、ブラウザは代わりにセキュリティで保護されたバージョンを自動的に使用します。

### HTTPS にアップグレードできない場合は？

ユーザーを保護するためにサイトを完全に HTTPS にアップグレードすることを強くお勧めしますが、自分でアップグレードできない場合は、ホスティングプロバイダーに相談して、そのオプションを提供できるかどうかを確認することをお勧めします。セルフホストの場合は、[Let's Encrypt](https://letsencrypt.org/) に証明書をインストールして構成するためのツールが多数用意されています。また、HTTPS 接続を提供できる CDN またはその他のプロキシの背後にサイトを移動することを調べることもできます。

それでも不可能な場合は、影響を受ける Cookie の `SameSite` 保護を緩和させてみてください。

- `SameSite=Strict` Cookie のみがブロックされている場合は、保護を `Lax` に下げることができます。
- `Strict` と `Lax` の両方がブロックされており、Cookie が安全な URL に送信されている（またはそこから設定されている）場合は、保護を `None` に下げることができます。
    - Cookie を送信する（または Cookie を設定する）URL が安全でない場合、この回避策は**失敗します**。これは、`SameSite=None` に `Secure` 属性が必要であるためです。つまり、これらの Cookie は、安全でない接続を介して送信または設定されない可能性があります。この場合、サイトが HTTPS にアップグレードされるまで、その Cookie にアクセスすることはできません。
    - 最終的にサードパーティの Cookie は徐々に完全に廃止されるため、これは一時的な措置であることを忘れないでください。

### `SameSite` 属性を指定していない場合、Cookie にどのように影響しますか？

`SameSite` 属性のない Cookie は、 `SameSite=Lax` を指定しているかのように扱われ、同じクロススキームの動作がこれらの Cookie にも適用されます。安全でないメソッドに対する一時的な例外が引き続き適用されることに注意してください。詳細については、<a href="https://www.chromium.org/updates/same-site/faq" data-md-type="link">Cromium `SameSite` FAQ の「Lax + POST の緩和」</a>をご覧ください。

### WebSocket はどのような影響を受けますか？

WebSocket 接続は、ページと同じセキュリティ設定である場合に、Same-Site と見なされます。

Same-Site（同一サイト）:

- `https://` からの `wss://` 接続
- `http://` からの `ws://` 接続

クロスサイト:

- `http://` からの `wss://` 接続
- `https://` からの `ws://` 接続

*写真提供: [Julissa Capdevilla](https://unsplash.com/photos/wNjgWrEXAL0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)（[Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)）*
