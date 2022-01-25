---
layout: post
title: Web 用のContact picker
subhead: Contact Picker APIを利用すると、ユーザーが連絡先リストから連絡先を簡単に共有できます。
authors:
  - petelepage
description: ユーザーの連絡先へのアクセスは従来から（ほぼ）iOS / Android アプリの機能となっています。 Contact Picker APIは、ユーザーが連絡先リストから1つまたは複数のエントリを選択し、選択した連絡先の限定された詳細をWebサイトと共有できるようにするオンデマンドAPIです。これにより、ユーザーは必要なときに必要なものだけを共有でき、友人や家族と連絡を取りやすくなります。
date: 2019-08-07
updated: 2021-02-23
tags:
  - blog
  - capabilities
hero: image/admin/K1IN7zWIjFLjZzJ4Us3J.jpg
alt: 黄色の背景に電話があります。
feedback:
  - api
---

## Contact Picker APIとは何ですか？ {: #what }

<style> #video-demo { max-height: 600px; } </style>

<figure data-float="right">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZYR1SBlPglRDE69Xt2xl.mp4", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RbG1WcYhSLn0MQoQjZe.webm"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rif9Fh8w8SR78PcVXCO1.jpg", loop=true, autoplay=true, muted=true, linkTo=true, id="video-demo", playsinline=true %}</figure>

モバイルデバイス上のユーザーの連絡先へのアクセスは、従来から（ほぼ）iOS / Android アプリの機能となっています。これは、 Web 開発者から寄せられる最も一般的な機能リクエストの 1 つであり、多くの場合、 iOS/Android アプリを構築する主な理由です。

Android版のChrome 80で利用可能な[Contact Picker API](https://wicg.github.io/contact-api/spec/)はユーザーの連絡先リストからエントリを選択し、選択したエントリの限定された詳細をWebサイトと共有できるようにするオンデマンドAPIです。これにより、ユーザーは必要なときに必要なものだけを共有でき、友人や家族と取りやすくなります。

例えば、Webベースの電子メールクライアントは、Contact Picker APIを使用して電子メールの受信者を選択できます。Voice-over-IPアプリは、どの電話番号に電話をかけるかを検索できます。また、ソーシャルネットワークを使用すると、ユーザーがどの友達がすでに参加しているか検出できます。

{% Aside 'caution' %}Chrome チームは、 ブラウザーがユーザーが選択したものだけを共有できるようになるためContact Picker API の設計と実装に力を入れました。以下の[セキュリティとプライバシー](#security-considerations)セクションを参照してください。{% endAside %}

## 現在のステータス{: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">ステップ</th>
<th data-md-type="table_cell">状態</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1.説明者を作成します</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/contact-api/" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2.仕様の初期ドラフトを作成します</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3.フィードバックを収集し、設計を繰り返します</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4.Origin trial</td>
<td data-md-type="table_cell">完了</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5.起動</strong></td>
<td data-md-type="table_cell">
<strong data-md-type="double_emphasis">Chrome 80</strong><br data-md-type="raw_html"> Androidでのみ利用できます。</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Contact Picker APIの使用 {: #how-to-use }

Contact Picker APIには、必要な連絡先情報のタイプを指定するoptionsパラメーターを指定したメソッド呼び出しが必要です。 2番目の方法は、基盤となるシステムが提供する情報を示します。

{% Aside %} [Contact Picker APIデモ](https://contact-picker.glitch.me)[を確認し、](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0)[ソース](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0)を表示します。{% endAside %}

### 特徴の検出

Contact Picker API がサポートされているかどうかを確認するには、次のコマンドを使用します。

```js
const supported = ('contacts' in navigator && 'ContactsManager' in window);
```

さらに、Androidでは、ContactPickerにはAndroid M またはそれ以降が必要です。

### Contact Pickerを開きます

Contact Picker APIのエントリポイントは`navigator.contacts.select()`です。呼び出されると、プロミスが返され、連絡先ピッカーが表示されます。これにより、ユーザーはサイトで共有する連絡先を選択できます。共有するものを選択して**完了**をクリックすると、ユーザーが選択した一連の連絡先でプロミスが解決されます。

`select()`呼び出すときは、最初のパラメータとして返されるプロパティの配列を指定する必要があります。指定できる値は、 `'name'` 、 `'email'` 、 `'tel'` 、 `'address'` または`'icon'`のいずれかです。また、複数の連絡先を 2 番目のパラメータとして選択できるかどうかを指定する必要があります。

```js
const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = {multiple: true};

try {
  const contacts = await navigator.contacts.select(props, opts);
  handleResults(contacts);
} catch (ex) {
  // Handle any errors here.
}
```

{% Aside 'caution' %}`'address'`と`'icon'`をサポートするにはChrome 84またはそれ以降が必要です。 {% endAside %}

Contacts picker APIは、[セキュリティ](https://w3c.github.io/webappsec-secure-contexts/)でトップレベル閲覧文脈からのみ呼び出すことができ、他の強力なAPIと同様に、ユーザーのジェスチャーが必要です。

### 利用可能なプロパティの検出

使用可能なプロパティを検出するには、`navigator.contacts.getProperties()`を呼び出します。この関数は、使用可能なプロパティを示す文字列の配列で解決するプロミスを返します。例： `['name', 'email', 'tel', 'address']` 。これらの値を`select()`渡すことができます。

プロパティが常に使用可能であるとは限らず、新しいプロパティが追加されることに注意してください。将来的には、他のプラットフォームや連絡先ソースによって、共有されるプロパティが制限される可能性があります。

### 結果の処理

Contact Picker API は連絡先の配列を返し、各連絡先には要求されたプロパティの配列が含まれます。連絡先に要求されたプロパティのデータがない場合、またはユーザーが特定のプロパティの共有をオプトアウトすることを選択した場合、APIは空の配列を返します。 （ユーザーがプロパティを選択する方法については、[ユーザーコントロール](#security-control)セクションで説明します。）

たとえば、サイトが`name` 、 `email` 、および`tel`をリクエストし、ユーザーがデータがある名前フィールドに単一の連絡先を選択し、2つの電話番号を提供しているが、電子メールアドレスがない場合、返される応答は次のようになります。

```json
[{
  "email": [],
  "name": ["Queen O'Hearts"],
  "tel": ["+1-206-555-1000", "+1-206-555-1111"]
}]
```

{% Aside 'caution' %}連絡先フィールドのラベルおよびその他のセマンティック情報はドロップされます。{% endAside %}

## セキュリティと権限{: #security-considerations }

Chromeチームは、ユーザーコントロール、透明性、人間工学など、 [強力なWebプラットフォーム機能へのアクセスの制御で](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)定義された基本原則を使用して、 Contact Picker APIを設計し実装しました。それぞれ説明します。

### ユーザーコントロール {: #security-control }

ピッカー経由でユーザーの連絡先へアクセスします。または、[セキュア](https://w3c.github.io/webappsec-secure-contexts/)上位レベル閲覧文脈でのみ、ユーザージェスチャを使用して呼び出すことができます。これにより、サイトがページ読み込み時にピッカーを表示できないようにしたり、文脈がないとピッカーをランダムに表示したりすることができなくなります。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EiHIOYdno52DZ6TNHcfI.jpg", alt="スクリーンショットでは、ユーザーは共有するプロパティを選択できます。", width="800", height="639" %}<br><figcaption>ユーザーは、一部のプロパティを共有しないことを選択できます。このスクリーンショットでは、ユーザーは「電話番号」ボタンをオフにします。 サイトが電話番号を要求しても、サイトと共有されることはありません。</figcaption></figure>

すべての連絡先を一括選択するオプションがないため、特定の Web サイトで共有する必要がある連絡先のみを選択することをお勧めします。ユーザーはピッカー上部のプロパティボタンを切り替えることで、サイトで共有するプロパティをコントロールすることもできます。

### 透明性 {: #security-transparency }

共有されている連絡先の詳細を明確にするために、ピッカーには常に連絡先の名前とアイコン、およびサイトが要求したプロパティが表示されます。例えば、 `name` 、 `email` 、および`tel`をリクエストした場合、3つのプロパティすべてがピッカーに表示されます。または、`tel`のみを要求する場合、ピッカーは名前と電話番号のみを表示します。

<div class="switcher">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ig9SBKtJPlSE3mCjR2Go.jpg", alt="すべてのプロパティを要求するサイトのピッカーのスクリーンショット。", width="800", height="639" %}<br><figcaption> ピッカー、<code>name</code> 、 <code>email</code> 、 <code>tel</code>をリクエストするサイト、 1 つの連絡先が選択されました。</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vOB2nPSrfi1GnmtitElf.jpg", alt="電話番号のみを要求するサイトのピッカーのスクリーンショット。", width="800", height="639" %}<figcaption> ピッカー、<code>tel</code>のみを要求するサイト、 1 つの連絡先が選択されました。</figcaption></figure>
</div>

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qLxdnKZwW0e4teyw2OOU.jpg", alt="連絡先が長く押されたときのピッカーのスクリーンショット。", width="800", height="389" %}<figcaption>連絡先を長押しした結果</figcaption></figure>

連絡先を長押しすると、その連絡先が選択されている場合に共有されるすべての情報が表示されます。（Cheshire Cat連絡先イメージを参照してください）。

### 権限の永続性なし{: #security-persistence }

連絡先へのアクセスはオンデマンドであり、永続的ではありません。サイトがアクセスを要求するたびに`navigator.contacts.select()`を呼び出す必要があります。また、ユーザーはサイトと共有する連絡先を個別に選択する必要があります。

## フィードバック{: #feedback }

Chrome チームは、 Contact Picker API の使用体験について知りたいと考えています。

### 実装に問題がありますか？

Chromeの実装にバグを見つけましたか？それとも、実装は仕様とは異なりますか？

- [https://new.crbug.comで](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EContacts)バグを報告してください。できるだけ詳しくバグを再現するための簡単な手順を説明し、`Blink>Contacts`に*コンポーネント*を設定してください。[グリッチは](https://glitch.com)、問題の再現をすばやく簡単に共有するのに最適です。

### APIの使用を計画していますか？

Contact Picker APIを使用する予定がありますか？パブリックサポートは、Chrome チームが機能に優先順位を決めること、他のブラウザーベンダーがそのサポートの重要性を分かるように役に立ちます。

- [WICG Discourseスレッドで](https://discourse.wicg.io/t/proposal-contact-picker-api/3507)での使用計画をを共有してください。
- ハッシュタグ[`#ContactPicker`](https://twitter.com/search?q=%23ContactPicker&src=typed_query&f=live) を使用してツイートを[@ChromiumDev](https://twitter.com/chromiumdev)に送信し、どこでどのように使用しているかを知らせてください。

## 参考リンク{: #helpful }

- [公開説明者](https://github.com/WICG/contact-api/)
- [Contact Pickerの仕様](https://wicg.github.io/contact-api/spec/)
- [Contact PickerAPIデモ](https://contact-picker.glitch.me)と[ContactPickerAPIデモソース](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0)
- [バグの追跡](https://bugs.chromium.org/p/chromium/issues/detail?id=860467)
- [ChromeStatus.comエントリ](https://www.chromestatus.com/feature/6511327140904960)
- 点滅コンポーネント： `Blink>Contacts`

### お礼

この機能を実装している Finnur Thorarinsson氏 と Rayan Kanso氏、また、恥ずかしいですが、私がデモのために<strike>盗んで</strike>リファクタリングした[コード](https://tests.peter.sh/contact-api/)を持つPeter Beverloo氏に感謝します。

追伸：Contact pickerの名前は、不思議の国のアリスのキャラクターです。
