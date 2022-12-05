---
layout: post
title: サインインフォームのベストプラクティス
subhead: クロスプラットフォーム対応のブラウザ機能を使用して、安全で、アクセスしやすく、使いやすいサインインフォームを作成します。
authors:
  - samdutton
scheduled: NS
date: 2020-06-29
updated: 2021-09-27
description: クロスプラットフォーム対応のブラウザ機能を使用して、安全で、アクセスしやすく、使いやすいサインインフォームを作成します。
hero: image/admin/pErOjllBUXhnj68qOhfr.jpg
alt: 電話を手に持っている人。
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
codelabs:
  - codelab-sign-in-form-best-practices
---

{% YouTube 'alGcULGtiv8' %}

ユーザーがサイトにログインする必要がある場合は、サインインフォームの適切なデザインが欠かせません。ユーザーが不安定な接続を使っている、モバイルデバイスを使っている、急いでいる、ストレスを感じているといった場合は、特に重要です。サインインフォームのデザインが不適切だと、バウンス率が高くなります。サイトからの離脱があるたびに、サインインの機会を逃しただけでなく、1 人のユーザーを失い、不愉快な思いをさせているのです。

{% Aside 'codelab' %} こうしたベストプラクティスは実践的なチュートリアルで学びたいという方は、[Sign-in form best practices codelab (サインインフォームのベストプラクティスコードラボ)](/codelab-sign-in-form-best-practices/) をご活用ください。{% endAside %}

こちらは、すべてのベストプラクティスを取り入れたシンプルなサインインフォームの 1 例です。

{% Glitch { id: 'sign-in-form', path: 'index.html', height: 480 } %}

## チェックリスト

- [用途がはっきりした HTML 要素を使用する](#meaningful-html) (`<form>` 、`<input>` 、`<label>` 、`<button>`)。
- [各入力に `<label>` タグを付ける](#label) 。
- 要素の属性を使って、[組み込みのブラウザ機能にアクセスする](#element-attributes) (`type` 、`name` 、`autocomplete` 、`required`)。
- 入力の `name` と `id` 属性に、ページの読み込みやウェブサイトのデプロイ中に変更されない安定した値を指定する。
- サインインを[独自の &lt;form&gt; 要素に配置する](#single-form)。
- [フォームが正常に送信されることを確認する](#submission)。
- サインアップフォームのパスワード入力と reset-password フォームの新しいパスワードに、[`autocomplete="new-password"`](#new-password) と [`id="new-password"`](#new-password) を使用する。
- サインインパスワードの入力に、[`autocomplete="current-password"`](#current-password) と [`id="current-password"`](#current-password) を使用する。
- [パスワードを表示](#show-password)する機能を提供する。
- パスワード入力に [`aria-label` と `aria-describedby`](#accessible-password-inputs) を使用する。
- [入力は 1 回だけ要求する](#no-double-inputs)。
- [モバイルキーボードが入力やボタンを覆い隠さないようにフォームをデザインする](#keyboard-obstruction)。
- フォームがモバイルで使用できることを確認する ([読みやすいテキスト](#size-text-correctly)を使用し、入力とボタンが[タッチターゲットとして機能するのに十分な大きさである](#tap-targets)ことを確認する)。
- サインアップページとサインインページで[ブランディングとスタイルを維持する](#general-guidelines)。
- [実地テストおよびとラボでのテストを行う](#analytics)。ページ分析、インタラクション分析、およびユーザー中心のパフォーマンス評価をサインアップフローとサインインフローに組み込む。
- [さまざまなブラウザとデバイスでテストを行う](#devices) (フォームの動作はプラットフォームによって大きく異なる)。

{% Aside %}この記事は、フロントエンドのベストプラクティスに関するものです。ユーザーの認証や認証情報の保存、アカウントの管理といった、バックエンドサービスを構築する方法については説明いたしません。独自のバックエンドを実行するためのコア原則については、[12 best practices for user account, authorization and password management (ユーザーアカウント、アクセス権限、およびパスワード管理のベストプラクティス 12 選)](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account) にまとめてあります。世界各地にユーザーがいる場合は、サイトで使用するサードパーティによる ID サービスとそのコンテンツをローカライズすることを検討する必要があります。

また、この記事では取り上げませんが、サインインの体験を向上させるのに役立つ比較的新しい API が 2 つあります。

- [**WebOTP**](/web-otp/): SMS を使って携帯電話にワンタイムパスコードまたは PIN 番号を送信します。これにより、ユーザーは電話番号を識別子として選択できる (メールアドレスを入力する必要はありません！) ほか、サインインの際に使う 2 要素認証と支払いの確認に使うワンタイムコードも利用できるようになります。
- [**認証情報管理**](https://developer.chrome.com/blog/credential-management-api/): 開発者がプログラムを使ってパスワードの認証情報と統合された認証情報を保存および取得できるようにします。{% endAside %}

## 用途がはっきりした HTML を使用する {: #meaningful-html }

特定のジョブ用に構築された要素 (`<form>` 、`<label>` 、`<button>`) を使用します。こうした要素は、ブラウザの組み込み機能を有効にし、アクセシビリティを向上させ、マークアップに意味を与えます。

### `<form>` を使用する {: #form }

入力を `<div>` 要素でラップして、送信されてくる入力データを純粋に JavaScript だけで処理しようと考えることがあるかもしれません。多くの場合は、昔ながらの [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form) 要素を使用する方がベターでしょう。これにより、スクリーンリーダーや他の支援デバイスがサイトにアクセスできるようになり、ブラウザのさまざまな組み込み機能が有効になり、古いブラウザーに対してベーシックで実用的なサインインを簡単に構築できるようになり、JavaScript が失敗した場合でも機能させることができます。

{: #single-form } {% Aside 'gotchas' %} ウェブページ全体を 1 つのフォームでラップするというミスがよく見られます。これはブラウザーのパスワードマネージャーと自動入力機能にとって問題となる恐れがあります。フォームを必要とする UI コンポーネントごとに別の &lt;form&gt; を使用します。たとえば、同じページにサインイン機能と検索機能がある場合は、2 つのフォーム要素を使用する必要があります。{% endAside %}

### `<label>` を使用する {: #label }

入力にラベルを付けるには、[`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label) を使用します。

```html
<label for="email">Email</label>
<input id="email" …>
```

その理由は 2つあります。

- ラベルをタップまたはクリックすると、フォーカスが入力に移動します。ラベルの `for` 属性と入力の `name` または `id` を使用して、ラベルを入力に関連付けます。
- スクリーンリーダーは、ラベルまたはラベルの入力にフォーカスが移動すると、ラベルテキストをアナウンスします。

プレースホルダーを入力ラベルとして使用してはいけません。私たちは、テキストを入力し始めると、何を入力するつもりだったのかを忘れてしまいがちです。メールアドレスだったっけ？それとも電話番号？アカウント ID ？ プレースホルダーについては、他にも問題視すべき事柄がいくつもあります。本当かなと気になる方は、2 つの記事 [Don't Use The Placeholder Attribute (プレースホルダーの属性は使わない)](https://www.smashingmagazine.com/2018/06/placeholder-attribute/) および [Placeholders in Form Fields Are Harmful (フォームフィールドのプレースホルダーは要注意)](https://www.nngroup.com/articles/form-design-placeholders/) を参照してください。

ラベルは、おそらく入力の上に配置するのがベストでしょう。そうすれば。モバイルとデスクトップで同じデザインを一貫させることができるほか、[Google による AI の調査](https://ai.googleblog.com/2014/07/simple-is-better-making-your-web-forms.html)によると、ユーザーは画面上のラベルに目を通しやすくなります。ラベルと入力は画面幅いっぱいに表示されるため、どちらもラベルのテキストに合わせて調節する必要がありません。

<figure>{% Img src="image/admin/k0ioJa9CqnMI8vyAvQPS.png", alt="モバイルでのフォーム入力ラベルの位置 (入力の横と上) を示すスクリーンショット。", width="500", height="253" %}<figcaption>ラベルと入力が同じ行にある場合はそれぞれの幅が制限される。</figcaption></figure>

モバイルデバイスで [label-position](https://label-position.glitch.me) Glitch を開いて、ご自分の目でお確かめてください。

### `<button>` を使用する {: #button }

ボタンには [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button) を使用してください！ボタン要素は、利用しやすい動作およびフォームを送信するための組み込み機能を提供するほか、スタイルも簡単に指定できます。`<div>` や他の要素をまるでボタンであるかのうように使っても意味がありません。

ボタンは、何をするボタンなのかが書かれていないといけません。たとえば、**送信**や**開始**とするのではなく、**アカウントを作成**や**サインイン**のようにします。

### フォームが正常に送信されることを確認する {: #submission}

フォームが送信されたことをパスワードマネージャーが理解できるようにします。これを行う方法は 2 種類あります。

- 別のページに移動する。
- `History.pushState()` または `History.replaceState()` を使ってナビゲーションをエミュレートし、パスワードフォームを削除します。

`XMLHttpRequest` や `fetch` リクエストをする場合は、サインインに成功したことがレスポンスで報告されること、またフォームを DOM から取り出し、サインインの成功をユーザーに伝えることによってきちんと処理されていることを確認します。

ユーザーがボタンをタップまたはクリックするタイミングで[**サインイン**]ボタンを無効にすることを検討してください。多くのユーザーは、高速で応答性の高いサイトでも[ボタンを複数回クリックします](https://baymard.com/blog/users-double-click-online)。それは、サイトとのやり取りを遅らせ、サーバーの負荷を上昇させます。

逆に、ユーザー入力を待っているフォームの送信を無効にしてはいけません。たとえば、ユーザーが顧客 PIN を入力していない場合は、[**サインイン**]ボタンを無効にしてはいけません。ユーザーは入力忘れに気付いて、(無効になっている) **サインイン**ボタンを繰り返しタップした場合に、ボタンが機能していないと勘違いするかもしれません。フォームの送信を無効にする必要があるなら、少なくとも、ユーザーが無効になっているボタンをクリックするときは、ユーザーに入力忘れの箇所を知らせるようにしましょう。

{% Aside 'caution' %} フォームのボタンのデフォルトのタイプは `submit` です。フォームに別のボタンを追加する場合は (**パスワードを表示**など)、`type="button"` を追加します。それ以外の場合は、ボタンをクリックまたはタップすればフォームは送信されます。

フォームフィールドのいずれかにフォーカスがある間に `Enter` キーを押すと、フォームの `submit` ボタンに対する最初のクリックがシミュレートされます。フォームの **Submit** ボタンの前に何らかのボタンを含める場合に、そのタイプを指定していなければ、そのボタンは、フォームボタンのデフォルトのタイプ (`submit`) が与えられ、フォームが送信される前にクリックイベントを受け取ることになります。この例については、[デモ](https://enter-button.glitch.me/)をご覧ください (フォームに入力して `Enter` を押してください)。{% endAside %}

### 入力は 1 回だけ要求する {: #no-double-inputs }

一部のサイトでは、ユーザーはメールアドレスまたはパスワードを 2 回入力することを強制されます。一部のユーザーのミスを減らせても、*すべてのユーザー*にとっては面倒なことであるため、[離脱率](https://uxmovement.com/forms/why-the-confirm-password-field-must-die/)を高めてしまう可能性があります。また、ブラウザによってメールアドレスが自動入力されたり、強力なパスワードが提案されたりするサイトで入力を 2 回求めても意味がありません。それよりも、ユーザーが自分でメールアドレスを確認し (どうせしなくてはいけません)、必要に応じてパスワードを簡単にリセットできるようにした方がベターです。

## 要素の属性を最大限に活用する {: #element-attributes }

ここでマジックが起こります！ブラウザには、入力要素の属性を使用する便利なビルトイン機能が複数あります。

## パスワードは非公開にするが、必要に応じてユーザーが見れるようにする {: #show-password }

パスワードのテキストを非表示にし、パスワードのための入力であることをブラウザが理解できるようにするには、パスワード入力に `type="password"` を使用します。(ブラウザは[さまざまな手法](#autofill)を使って入力ロールを理解し、パスワードの保存を提供するかどうかを決定します)

ユーザーが自分で入力したテキストを確認できるように、[**パスワードを表示**]のアイコンまたはボタンを追加するとよいでしょう。また[**パスワードを忘れた場合**]のリンクを追加することも忘れないようにしましょう。[Enable password display (パスワードの表示を有効にする)](#password-display) を参照してください。

<figure>{% Img src="image/admin/58suVe0HnSLaJvNjKY53.png", alt="「パスワードを表示」のアイコンを示す Google のログインフォーム。", width="300", height="107" %}<figcaption> [<strong>パスワードを表示</strong>]のアイコンと[<strong>パスワードを忘れた場合</strong>]のリンクがある Google のサインインフォームを使ったパスワード入力。</figcaption></figure>

## モバイルユーザーに適切なキーボードを提供する {: #mobile-keyboards }

`<input type="email">`を使用して、モバイルユーザーに適切なキーボードを提供し、ブラウザによるメールアドレスの基本的なビルトイン検証機能を有効にします。JavaScript は必要ありません。

メールアドレスの代わりに電話番号を使用する必要がある場合は、`<input type="tel">` を使うとモバイルデバイスで電話のキーパッドが有効化されます。必要な場合は、`inputmode` 属性も使用できます (PIN 番号の場合は `inputmode="numeric"` を使うのが最適です)。詳しくは、[Everything You Ever Wanted to Know About inputmode (inputmode について知っておきたいこと)](https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/) を参照してください。

{% Aside 'caution' %} `type="number"` を使うと、数値を増加させるための上/下矢印が追加されるため、ID やアカウント番号など、増加させるべきでない番号には使用しないでください。{% endAside %}

### モバイルキーボードが**サインイン**ボタンを妨害しないようにする {: #keyboard-obstruction}

残念ながら、注意が足りないと、モバイルキーボードがフォームを覆い隠したり、もっと酷い場合は、**[サインイン**]ボタンを部分的に妨害したりしてしまう場合があります。ユーザーは、状況が分からないまま諦めてしまう可能性があります。

<figure>{% Img src="image/admin/rLo5sW9LBpTcJU7KNnb7.png", alt="Android 携帯電話のサインインフォームを示した 2 つのスクリーンショット (そのうち 1 つは携帯電話のキーボードによって[送信]ボタンが覆い隠されている様子を示している)。", width="400", height="360" %}<figcaption> [<b>サインイン</b>]ボタン (見える場合と見えない場合)。</figcaption></figure>

可能であれば、サインインページの上部には電子メールアドレス/電話番号およびパスワードの入力と**サインイン**ボタンのみを表示して、これを回避します。他のコンテンツはその下に配置します。

<figure>{% Img src="image/admin/0OebKiAP4sTgaXbcbvYx.png", alt="Android 携帯電話のサインインフォームを示したスクリーンショット (サインインボタンは電話のキーボードによって覆い隠されていない)。", width="200", height="342" %}<figcaption>キーボードは<b>サインイン</b>ボタンを妨害していない。</figcaption></figure>

#### さまざまなデバイスでテストする {: #devices }

ターゲットオーディエンスを考慮して、さまざまなデバイスでテストを実施し、結果に応じて調整を行う必要があります。BrowserStack を使用すれば、実在するさまざまなデバイスやブラウザで[オープンソースプロジェクトのテストを無料で行えます](https://www.browserstack.com/open-source)。

<figure>{% Img src="image/admin/jToMlWgjS3J2WKmjs1hx.png", alt="iPhone 7、8、11 のサインインフォームを示したスクリーンショット。iPhone 7 と 8 では、サインインボタンが電話のキーボードによって覆われているが、iPhone 11 は覆われていない", width="800", height="522" %}<figcaption><b>サインイン</b>ボタン (iPhone 7 と 8では覆われているが、iPhone 11では覆われていない)。</figcaption></figure>

#### ページを 2 つ使用することを検討する {: #two-pages}

Amazon や eBay を含む一部のサイトでは、電子メールアドレス/電話番号とパスワードを 2 つのページで要求することによりこの問題を回避しています。このアプローチでは、ユーザーは 1 度に 1 つのことだけをすればいいので、使用体験がシンプルになります。

<figure>{% Img src="image/admin/CxpObjYZMs0MMFo66f4P.png", alt="Amazon ウェブサイトのサインインフォームを示したスクリーンショット (電子メールアドレス/電話番号とパスワードが 2 つの別のページで求められている)。", width="400", height="385" %}<figcaption> 2 段階のサインイン (電子メールアドレスまたは電話の後にパスワードを入力)。</figcaption></figure>

これは &lt;form&gt;を 1 つ使って実装するのが理想です。JavaScript を使用して、最初に電子メールアドレスの入力のみを表示し、次にそれを非表示にしてからパスワード入力を表示します。電子メールアドレスとパスワードを入力する間に新しいページに移動することをユーザーに強制する必要がある場合は、パスワードマネージャーが正しい値を保存できるように、2 つ目のページのフォームには電子メールアドレスを値として持つ非表示の入力要素を設ける必要があります。コードの例は、[Password Form Styles that Chromium Understands (Chromium が理解できるパスワードフォームスタイル)](https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands) でご覧いただけます。

### ユーザーがデータを再入力しなくて済むようにする {: #autofill}

ブラウザがデータを正しく保存し、自動入力できるようにすれば、ユーザーは電子メールアドレスとパスワードを入力することをわざわざ覚えておく必要がなくなります。これはモバイルでは特に重要である上に、[離脱率](https://www.formisimo.com/blog/conversion-rate-increases-57-with-form-analytics-case-study/)の高い電子メールアドレスの入力については絶対に欠かせません。

このアプローチは 2 つの部分があります。

1. `autocomplete` 、`name` 、`id` 、および `type` 属性は、後から自動入力に使用できるデータを保存するためにブラウザが各入力の役割を理解するのを助けます。最新のブラウザで自動入力を行えるようにデータを保存するには、各入力に `name` または `id` の安定した値 (各ページの読み込み時またはサイトのデプロイ時にランダムに生成される値ではない) があり、かつ`送信`ボタン付きの &lt;form&gt; に取り込まれることも必要とされます。

2. `autocomplete` 属性は、ブラウザが保存されたデータを使用して入力を正しく自動入力するのを助けます。

メールアドレスの入力には、`type="email"` を使用するべきですし、また `id="email"` と `name="email"` を使いたいところかもしれませんが、最近のブラウザは `username` を認識できるため、`autocomplete="username"` を使用します。

パスワードの入力には、ブラウザが新しいパスワードと現在のパスワードを区別できるように、`autocomplete` と `id` の適切な値を使用します。

### 新しいパスワードには `autocomplete="new-password"` と `id="new-password"` を使用する {: #new-password }

- サインアップフォームのパスワード入力やパスワード変更フォームの新しいパスワードには、`autocomplete="new-password"` と `id="new-password"` を使用します。

### 既存のパスワードには、`autocomplete="current-password"` と `id="current-password"` を使用する {: #current-password }

- サインインフォームでのパスワード入力、またはパスワード変更フォームでのユーザーの古いパスワード入力には、`autocomplete="current-password"` と `id="current-password"` を使用します。これは、そのサイト用に保存されている現在のパスワードを使用することをブラウザに指示します。

サインアップフォームの場合:

```html
<input type="password" autocomplete="new-password" id="new-password" …>
```

サインインの場合:

```html
<input type="password" autocomplete="current-password" id="current-password" …>
```

{% Aside %} Chrome などのブラウザは、リピーターがサインインする際にブラウザに搭載されているパスワードマネージャーを使ってフィールドを自動入力できます。こうした機能をうまく働かせるには、ブラウザはユーザーがパスワードを変更するタイミングを識別できる必要があります。

具体的には、新しいパスワードが設定された後は、ユーザーのパスワードを変更するためのフォームをクリアするか、非表示にする必要があります。パスワードが変更された後もユーザーのパスワードを変更するフォームが記入されたまま残っていると、ブラウザは更新内容を記録できない場合があります。{% endAside %}

### パスワードマネージャーをサポートする {: #password-managers}

ブラウザが異なれば、電子メールアドレスの自動入力とパスワードの提案も処理の仕方が多少異なりますが、得られる効果はも多少異なりますが、効果はほぼ変わりありません。たとえば、デスクトップ版の Safari 11 以降では、パスワードマネージャーが表示された後、利用可能であれば、場合は生体認証 (指紋または顔認識) が使用されます。

<figure>{% Img src="image/admin/UjBRRYaLbX9bh3LDFcAM.png", alt="デスクトップ版 Safari での 3 段階のサインインプロセス (パスワードマネージャー、生体認証、自動入力) を示したスクリーンショット。", width="800", height="234" %}<figcaption>オートコンプリートによるサインイン。テキスト入力は必要ありません！</figcaption></figure>

デスクトップ版の Chrome は、メールアドレスの提案とパスワードマネージャーを表示し、パスワードを自動入力します。

<figure>{% Img src="image/admin/mDm1cstWZB9jJDzMmzgE.png", alt="デスクトップ版 Chrome での 4 段階のサインインプロセス (メールアドレスの補完、メールアドレスの提案、パスワードマネージャー、選択時の自動入力) を示したスクリーンショット。", width="800", height="232" %}<figcaption> Chrome 84 におけるオートコンプリートを使ったサインインフロー。</figcaption></figure>

ブラウザのパスワードシステムと自動入力システムの仕組みは、単純なものではありません。値を推測、保存、表示するためのアルゴリズムは標準化されておらず、プラットフォームごとに異なります。たとえば、[Hidde de Vries 氏](https://hiddedevries.nl/en/blog/2018-01-13-making-password-managers-play-ball-with-your-login-form)が指摘するように、「Firefox のパスワードマネージャーは、[レシピシステム](https://bugzilla.mozilla.org/show_bug.cgi?id=1119454)を使ってそのヒューリスティックを補完します。」

[自動入力: ウェブ開発者が知っておくべきこと](https://cloudfour.com/thinks/autofill-what-web-devs-should-know-but-dont)ですが、`name` と `autocomplete` の使い方については限られた情報しかありません。[HTML の仕様](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#inappropriate-for-the-control)に 59 個すべての値が記載されています。

{% Aside %} `form` 要素そのものに加え、`input` 要素、`select` 要素、`textarea` 要素についても、サインアップフォームおよびサインインフォームで `name` と `id` に異なる値を使用すれば、パスワードマネージャーの働きを助けることができます。{% endAside %}

### ブラウザが強力なパスワードを提案できるようにする {: #password-suggestions}

最近のブラウザは、ヒューリスティックを使用して、パスワードマネージャの UI を表示するタイミングを決定し、強力なパスワードを提案します。

こちらはデスクトップ版 Safari の場合です。

<figure>{% Img src="image/admin/B1DlZK0CllVjrOUbb5xB.png", alt="デスクトップ版 Firefox のパスワードマネージャーを示したスクリーンショット。", width="800", height="229" %}<figcaption> Safari でのパスワード提案フロー。</figcaption></figure>

(Safari では、バージョン 12.0 以降、強力な一意のパスワード提案が利用可能になっています。)

ブラウザのビルトインパスワードジェネレータがあるということは、ユーザーと開発者は、いわゆる「強力なパスワード」を作り出す必要がないということです。ブラウザは安全にパスワードを保存し、必要に応じて自動入力もできるため、ユーザーはパスワードを覚える必要も、入力する必要もありません。ユーザーにブラウザのビルトインパスワードジェネレータを利用するよう促せば、ユーザーがサイトで一意の強力なパスワードを使用する可能性が高まる一方、他のサイトで侵害され得るパスワードを再利用する可能性が低くなります。

{% Aside %} このアプローチの欠点は、パスワードを複数のプラットフォームで共有する術がないという点です。たとえば、ユーザーは iPhone では Safari を使用しても、Windows ノートPC では Chrome を使用するかもしれません。{% endAside %}

### ユーザーがうっかり入力し忘れるのを防ぐ {: #required-fields}

メールアドレスとパスワードの両方のフィールドに `required` 属性を追加します。最新のブラウザでは、入力されていないデータがあれば、それにフォーカスが自動的に移動するようになっています。JavaScript は必要ありません！

<figure>{% Img src="image/admin/n5Nr290upVmQGvlc263U.png", alt="デスクトップ版 Firefox と Android 版 Chrome で未入力のデータに対して「このフィールドは必須です」というプロンプトが表示される場合のスクリーンショット。", width="600", height="392" %}<figcaption> デスクトップ版 Firefox (バージョン76) および Android 版 Chrome (バージョン83) で不足しているデータに対して表示されるプロンプトとフォーカス。</figcaption></figure>

## 指と親指のデザイン {: #mobile-design}

入力要素とボタンに関連するほぼすべてのものについて、ブラウザのデフォルトサイズは小さ過ぎると思います。モバイルの場合は、特にそうです。言うまでもないかもしれませんが、多くのサイトのサインインフォームで問題になっています。

### 入力とボタンが十分なサイズであることを確認する {: #tap-targets}

デスクトップ上の入力とボタンのデフォルトサイズとパディングは、とにかく小さいですが、モバイルはもっと小さくなります。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lJNO6w2dOyp4cYKl5b3y.png", alt="デスクトップ版 Chrome および Android 版 Chrome のスタイル指定されていないフォームを示したスクリーンショット。", width="800", height="434" %}</figure>

[Android のアクセシビリティガイダンスに](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB)よると、タッチスクリーンオブジェクトの推奨ターゲットサイズは 7〜10mm です。Apple インターフェイスガイドラインは、48x48 ピクセルを提案し、W3C は[少なくとも 44x44 CSS ピクセル](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)を提案しています。その上で、モバイルの入力要素とボタンに (少なくとも) 約15ピクセルのパディングを追加し、デスクトップの場合は約10ピクセルを追加します。実際のモバイルデバイスと実際の指または親指でこれを試してください。各入力とボタンを快適にタップできるはずです。

Lighthouse による [Tap targets are not sized appropriately (タップターゲットのサイズが適切でない)](/tap-targets/) 監査は、小さすぎる入力要素を検出するプロセスを自動化するのに役立ちます。

#### 親指のデザイン {: #design-for-thumbs}

[タッチターゲット](https://www.google.com/search?q=touch+target)を検索すると、人差し指の写真がたくさん表示されます。ただし、実際は、多くの人が親指を使って電話を操作します。しかし、親指は人差し指よりも大きいため、操作をしにくくなります。なおさら、適切なサイズのタッチターゲットが必要だと言えます。

### テキストを十分に大きくする {: #size-text-correctly}

サイズやパディングと同様に、特にモバイルでは、入力要素とボタンのデフォルトのブラウザフォントサイズが小さすぎます。

<figure>{% Img src="image/admin/EeIsqWhLbot15p4SYpo2.png", alt="デスクトップ版 Android と Chrome でのスタイル未指定のフォームを示したスクリーンショット。", width="800", height="494" %}<figcaption>デスクトップとモバイルのデフォルトスタイル (入力テキストが小さすぎて、多くのユーザーが判読できない。</figcaption></figure>

同じブラウザでも、プラットフォームが異なるとフォントのサイズも異なります。したがい、プラットフォームを問わずにうまく機能する特定のフォントサイズを指定するのは容易ではありません。人気のウェブサイトをさっと調査したところ、デスクトップの場合は 13～16 ピクセルのサイズが使用されているようです。モバイルのテキストは、物理的に少なくとも同じサイズにするとよいでしょう。

つまり、モバイルではもっと大きなピクセルサイズを使用する必要があります (デスクトップ版の Chrome だと、`16px` ピクセルはとても読みやすいですが、Android 版の Chrome だと、`16px` のテキストは視力が高い人でも読みにくいでしょう。[メディアクエリ](https://developers.google.com/web/fundamentals/design-and-ux/responsive#apply_media_queries_based_on_viewport_size)を使用すれば、ビューポートの各サイズに異なるフォントピクセルサイズを設定できます。モバイルでは `20px` がちょうどいいと思いますが、視力の弱い友人や同僚に見せてみるべきだと思います。

Lighthouse による [Document doesn't use legible font sizes (ドキュメントは読みやすいフォントサイズを使用していない)](/font-size/) e監査は、小さすぎるテキストを検出するプロセスを自動化するのに役立ちます。

### 各入力の間に十分なスペースを設ける {: #size-margins-correctly}

入力がタッチターゲットとしてうまく機能するように十分なマージンを追加します。つまり、指幅程度のマージンを目安とします。

### 入力がはっきりと見えることを確認する {: #visible-inputs}

入力のデフォルトのボーダースタイルを使うと、入力が見にくくなります。Android 版の Chrome など、一部のプラットフォームではほとんど見えなくなってしまいます。

パディングに加え、ボーダーも追加します。背景が白の場合は、`#ccc` かもっと暗い色を使用することが原則とされています。

<figure>{% Img src="image/admin/OgDJ5V2N7imHXSBkN4pr.png", alt="Android 版の Chrome でスタイル指定されたフォームを示したスクリーンショット。", width="250", height="525" %}<figcaption>読みやすいテキスト、目に見える入力ボーダー、十分なパディングとマージン。</figcaption></figure>

### ブラウザの組み込み機能を使って無効な入力値について警告する  {: #built-in-validation}

ブラウザーには、`type` 属性を持つ入力に対し、基本的なフォーム検証を行うためのビルトイン機能があります。無効な値が含まれたフォームを送信すると、ブラウザはそれに対して警告を出し、問題のある入力にフォーカスを移動させます。

<figure>{% Img src="image/admin/Phf9m5J66lIX9x5brzOL.png", alt="メールアドレスの無効な値に対するプロンプトとフォーカスを表示したデスクトップ版の Chrome におけるサインインフォームを示したスクリーンショット。", width="300", height="290"%}<figcaption>ブラウザに組み込まれたベーシックな検証機能。</figcaption></figure>

`:invalid` CSSセレクターを使用すれば、無効なデータを強調表示できます。`:not(:placeholder-shown)`を使用して、コンテンツのない入力を選択しないようにします。

```css
input[type=email]:not(:placeholder-shown):invalid {
  color: red;
  outline-color: red;
}
```

値が無効な入力を強調表示する方法をいろいろお試しください。

## 必要に応じて JavaScript を使用する {: #javascript}

### パスワード表示を切り替える {: #password-display}

ユーザーが入力したテキストを確認できるようにするには、**[パスワードを表示]**のアイコンまたはボタンを追加する必要があります。ユーザーが自分の入力したテキストを確認できないと、[ユーザビリティが損なわれます](https://www.nngroup.com/articles/stop-password-masking/)。現在、ビルトイン機能によってこれを行うための方法はありませんが、[実装の計画はあります](https://twitter.com/sw12/status/1251191795377156099)。代わりに JavaScript を使用する必要があります。

<figure><img src="https://github.com/GoogleChrome/web.dev/blob/main/src/site/content/ja/identity/sign-in-form-best-practices/show-password-google.png?raw=true" class="" alt="「パスワードを表示」のアイコンを示した Google のサインインフォーム。"> <figcaption><strong>[パスワードを表示]</strong> のアイコンと <strong>[パスワードを忘れた場合]</strong> のリンクが使用された Google のサインインフォーム。</figcaption></figure>

次のコードは、テキストボタンを使用して**パスワードの表示**機能を追加します。

HTML:

```html/2
<section>
  <label for="password">Password</label>
  <button id="toggle-password" type="button" aria-label="Show password as plain text. Warning: this will display your password on the screen.">Show password</button>
  <input id="password" name="password" type="password" autocomplete="current-password" required>
</section>
```

以下はボタンをプレーンテキストのように見せるための CSS です。

```css
button#toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  /* Media query isn't shown here. */
  font-size: var(--mobile-font-size);
  font-weight: 300;
  padding: 0;
  /* Display at the top right of the container */
  position: absolute;
  top: 0;
  right: 0;
}
```

そして、パスワードを表示するための JavaScript はこちら。

```js
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');

togglePasswordButton.addEventListener('click', togglePassword);

function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordButton.textContent = 'Hide password';
    togglePasswordButton.setAttribute('aria-label',
      'Hide password.');
  } else {
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Show password';
    togglePasswordButton.setAttribute('aria-label',
      'Show password as plain text. ' +
      'Warning: this will display your password on the screen.');
  }
}
```

最終結果はこちら。

<figure>{% Img src="image/admin/x4NP9JMf1KI8PapQ9JFh.png", alt="Mac 版 Safari と iPhone 7 の「パスワードを表示」テキスト 'ボタン'  付きサインインフォームを示したスクリーンショット。", width="800", height="468" %}<figcaption> Mac 版 Safari と iPhone 7 の <strong>[パスワードを表示]テキスト</strong> 'ボタン'  付きサインインフォームを示したスクリーンショット。</figcaption></figure>

### パスワード入力をアクセス可能にする {: #accessible-password-inputs}

`aria-describedby`を使用して、制約を説明する要素の ID を指定することにより、パスワードルールを概略します。スクリーンリーダーは、ラベルテキスト、入力タイプ (パスワード)、説明をを順に提供します。

```html
<input type="password" aria-describedby="password-constraints" …>
<div id="password-constraints">Eight or more characters with a mix of letters, numbers and symbols.</div>
```

**[パスワードの表示]** 機能を追加するときは、必ず`aria-label` を使ってパスワードが表示されることを警告します。そうしないと、ユーザーが誤ってパスワードを公開してしまう場合があります。

```html/1-2
<button id="toggle-password"
        aria-label="Show password as plain text.
                    Warning: this will display your password on the screen.">
  Show password
</button>
```

ARIA の両機能の動作は、以下の Glitch で確認できます。

{% Glitch { id: 'sign-in-form', path: 'index.html', height: 480 } %}

[アクセシブルフォームの作成には、フォームをアクセシブルに](https://webaim.org/techniques/forms/)するためのヒントがさらにあります。

### 送信前にリアルタイムに検証する {: #validation}

HTML フォームの要素と属性には基本的な検証機能が組み込まれていますが、ユーザーがデータを入力しているときやフォームを送信しようとしているときには、JavaScript を使用してより効果的な検証を行う必要があります。

{% Aside 'warning' %}クライアント側の検証は、ユーザーがデータを入力するのに役立ち、サーバーに不要な負荷がかかるのを回避できますが、データは常にバックエンドで検証およびサニタイズする必要があります。{% endAside %}

サインインフォームコードラボの[ステップ 5](https://glitch.com/edit/#!/sign-in-form-codelab-5) では、ブラウザの組み込み UI を使ってカスタム検証を追加し、フォーカスの設定とプロンプトの表示を行う目的で、([広くサポートされている](https://caniuse.com/#feat=constraint-validation)) [Constraint Validation API](https://html.spec.whatwg.org/multipage/forms.html#constraints) が使用されます。

詳しくは、[Use JavaScript for more complex real-time validation (JavaScriptを使用して、より複雑なリアルタイム検証を行う)](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation) を参照してください。

### 分析と RUM {: #analytics}

「評価できないものは、改善できない」という考えは、特にサインアップフォームとサインインフォームについて言えることです。目標を設定し、成功を評価し、サイトを改善し、それを繰り返すという作業が必要です。

[割引ユーザビリティテスト](https://www.nngroup.com/articles/discount-usability-20-years/)は、変更を試すのに役立ちますが、ユーザーによるサインアップフォームとサインインフォームの使用体験を理解するには、実際のデータが必要です。

- **ページ分析**: サインアップページおよびサインインページのビュー、バウンス率、閲覧終了。
- **インタラクション分析**: [ゴールファネル](https://support.google.com/analytics/answer/6180923?hl=en) (ユーザーがサインインまたはサインインフローから離脱する箇所) と [イベント](https://developers.google.com/analytics/devguides/collection/gtagjs/events) (ユーザーがフォームを操作するときに行う操作)
- **ウェブサイトのパフォーマンス**: [ユーザー中心の指標](/user-centric-performance-metrics) (何らかの理由でサインアップフォームとサインインフォームが遅くなっていないか。遅いなら、何が原因となっているか)。

また、サインアップとサインインのさまざまなアプローチを試すことを目的とした A/B テストの実装、すべてのユーザーに変更をリリースする前に、ユーザーのサブセットに対して変更を検証することを目的とした段階的なロールアウトを検討することをおすすめします。

## 一般的なガイドライン {: #general-guidelines}

UI と UX を適切に設計すれば、サインインフォームからの離脱を削減できます。

- サインインする場所は分かりやすい場所に配置しましょう！**サインイン**、**アカウントを作成**、**登録**など、一般的に理解されている表現を使用して、ページの上部にサインインフォームへのリンクを配置します。
- 集中できるようにしましょう！サインアップフォームは、オファーやサイトの機能などを紹介する場所ではありません。
- サインアップは極力シンプルにしましょう。住所やクレジットカードの詳細といった他のユーザーデータは 、ユーザーがそうした情報を提供することに明らかなメリットがあると判断した場合にのみ収集します。
- ユーザーがサインアップフォームを開始する前に、どのような価値提案があるのかを明確にします。サインインすることにどのようなメリットがあるのか？サインアップを完了するための具体的な理由ををユーザーに提供します。
- 一部のユーザーは電子メールを使用していない場合があるため、可能であれば、ユーザーが電子メールアドレスではなく携帯電話番号で本人確認できるようにしましょう。
- パスワードを簡単にリセットできるようにし、**[パスワードを忘れた場合]**のリンクもすぐ見つけられるようにしましょう。
- 利用規約とプライバシーポリシードキュメントへのリンクを挿入する: サイトでユーザーのデータを保護する方法を最初から明確にしておきましょう。
- サインアップページとサインインページに会社または組織のロゴと名前を含め、文言、フォント、およびスタイルをサイト全体で一致させます。フォームによっては、他のコンテンツのように同じサイトに属しているように感じられない場合があります。URL が大幅に異なる場合は、特にそう感じるでしょう。

## 学習を続けしましょう {: #resources}

- [Create Amazing Forms (すばらしいフォームを作成する)](/learn/forms/)
- [Best Practices For Mobile Form Design (モバイルフォームデザインのベストプラクティス)](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [More capable form controls (より細かく機能するフォームコントロール)](/more-capable-form-controls)
- [Creating Accessible Forms (使いやすいフォームの作成)](https://webaim.org/techniques/forms/)
- [Streamlining the Sign-in Flow Using Credential Management API (認証情報管理 API を使用したサインインフローの合理化)](https://developer.chrome.com/blog/credential-management-api/)
- [WebOTPAPIを使用してWeb上の電話番号を確認する](/web-otp/)

写真は、[Unsplash](https://unsplash.com) の [Meghan Schiereck 氏](https://unsplash.com/photos/_XFObcM_7KU) にご提供いただきました。
