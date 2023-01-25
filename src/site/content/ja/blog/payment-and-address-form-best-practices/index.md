---
title: 支払いフォームと住所フォームのベストプラクティス
subhead: ユーザーが住所フォームと支払いフォームにできるだけ早く簡単に記入できるようにすることで、コンバージョンを最大化します。
authors:
  - samdutton
scheduled: 'true'
date: 2020-12-09
updated: 2021-11-30
description: ユーザーが住所フォームと支払いフォームにできるだけ早く簡単に記入できるようにすることで、コンバージョンを最大化します。
hero: image/admin/dbYeeV2PCRZNY6RRvQd2.jpg
thumbnail: image/admin/jy8z8lRuLmmnyytD5xwl.jpg
alt: ノートパソコンで支払いしようと支払いカードを使用しているビジネスマン。
tags:
  - blog
  - forms
  - identity
  - layout
  - mobile
  - payments
  - security
  - ux
codelabs:
  - codelab-payment-form-best-practices
  - codelab-address-form-best-practices
---

{% YouTube 'xfGKmvvyhdM' %}

フォームを適切に設計することは、ユーザーを助け、利便性とコンバージョン率を向上させます。簡単な修正を 1 つ施すだけで、大きな違いが生まれます！

{% Aside 'codelab' %}こうしたベストプラクティスは、実践的なチュートリアルで学ぶことを好まれる方は、この記事でご紹介する 2 つのコードラボをご覧ください。

- [Payment form best practices codelab (支払いフォームのベストプラクティスコードラボ)](/codelab-payment-form-best-practices)
- [Address form best practices codelab (アドレスフォームのベストプラクティスコードラブ)](/codelab-address-form-best-practices) {% endAside %}

こちらは、すべてのベストプラクティスを取り入れた簡単な支払いフォームの 1 例です。

{% Glitch { id: 'payment-form', path: 'index.html', height: 720 } %}

こちらは、すべてのベストプラクティスを取り入れた簡単な住所フォームの 1 例です。

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

## チェックリスト

- [用途がはっきりした HTML 要素を使用する](#meaningful-html): `<form>` 、`<input>` 、`<label>` 、`<button>` 。
- `<label>` を使って[各フォームフィールドに ラベルを付ける。](#html-label)
- HTML 要素の属性を使用して、[組み込みのブラウザー機能にアクセスする](#html-attributes)。特に適切な値を持つ [`type`](#type-attribute) と [`autocomplete`](#autocomplete-attribute)。
- 支払いカード番号など、増加させることを意図していない番号には `type="number"` を使用しない。代わりに、`type="text"`と [`inputmode="numeric"`](#inputmode-attribute) を使用する。
- [適切なオートコンプリート値](#autocomplete-attribute)を `input` 、`select` 、または`textarea` に使用できる場合は、それを使用する。
- ブラウザがフォームを自動入力できるように、入力の `name` と `id` 属性に、ページの読み込み中またはウェブサイトの展開中に変化しない[安定した値](#stable-name-id)を指定する。
- 一旦タップされたり、クリックされたりした[送信ボタンを無効にする](#disable-submit)。
- データは、フォームの送信中だけでなく、入力中にも[検証](#validate)する。
- [ゲストのチェックアウト](#guest-checkout)をデフォルトにし、チェックアウトが完了した後にアカウントを簡単に作成できるようにする。
- 分かりやすい行動喚起による明確なステップで[チェックアウトプロセスの進捗](#checkout-progress)を示す。
- 混乱や気を散らすものを取り除くことにより、[チェックアウトの潜在的な離脱ポイントを制限する](#reduce-checkout-exits)。
- チェックアウト時に[注文の完全な詳細](#checkout-details)を表示し、注文内容を簡単に調整できるようにする。
- [不要なデータの提供は求めない](#unneeded-data)。
- 正当な理由がない限り、[名前は単一の入力で求める](#single-name-input)。
- 名前とユーザー名には、[ラテン文字以外の文字も入力できるようにする](#unicode-matching)。
- [さまざまなアドレス形式を許可する](#address-variety)。
- [アドレスに 1 つの `textarea`](#address-textarea) だけを使用することを検討する。
- [請求先住所の入力にオートコンプリート](#billing-address)を使用する。
- 必要に応じて[国際化およびローカライズする](#internationalization-localization)。
- [郵便番号による住所検索](#postal-code-address-lookup)を使わないことを検討する。
- [支払いカードのオートコンプリートの適切な値](#payment-form-autocomplete)を使用します。
- [支払いカード番号](#single-number-input)には単一の入力を使用する。
- オートフィルの使用体験を損なわせるような[カスタム要素の使用は避ける](#avoid-custom-elements)。
- [現場とラボの両方でテストるす](#analytics-rum): ページ分析、インタラクション分析、および実際のユーザーのパフォーマンス測定。
- [さまざまなブラウザ、デバイス、プラットフォームでテストする](#test-platforms)。

{% Aside %}この記事は、住所フォームと支払いフォームのフロントエンドにおけるベストプラクティスに関するものです。サイトにトランザクションを実装する方法について説明いたしません。ウェブサイトに支払い機能を追加する方法について詳しくは、[Web Payments (ウェブペイメント)](/payments) を参照してください。 {% endAside %}

## 用途がはっきりした HTML を使用する{: #meaningful-html }

ジョブ用に構築された要素と属性を使用します。

- `<form>` 、`<input>` 、`<label>` 、`<button>`
- `type` 、 `autocomplete` 、 `inputmode`

これらは、組み込みのブラウザ機能を有効にし、アクセシビリティを向上させ、マークアップに意味を持たせます。

### HTML 要素を意図したとおりに使用する {: #html-elements }

#### フォームを `<form>` の中に入れます {: #html-form }

`<input>` 要素を `<form>` でラップせずに、単純に JavaScript でデータ送信を処理しようと考えることがあるかもしれません。

それはやってはいけません！

HTML の `<form>` を使用すると、すべての最新ブラウザーで一連のビルトイン機能を使用できるほか、スクリーンリーダーやその他の支援デバイスからサイトにアクセスできるようになります。`<form>` を使用すると、JavaScript のサポートに制限がある古いブラウザーでも基本的な機能を簡単に構築できるほか、コードに不具合があったとしても、JavaScript を無効にしている少数のユーザーに対してフォームの送信を有効にできます。

ユーザー入力用のページコンポーネントが複数ある場合は、それぞれを独自の `<form>` 要素に配置してください。たとえば、同じページで検索と登録を行う場合は、それぞれを独自の `<form>` に配置します。

#### `<label>` を使用して要素にラベルを付ける {: #html-label }

`<input>` 、`<select>` 、または`<textarea>` にラベルを付けるには、[`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label) を使用します。

ラベルの `for` 属性に入力の `id` と同じ値を指定して、ラベルを入力に関連付けます。

```html
<label for="address-line1">Address line 1</label>
<input id="address-line1" …>
```

単一の入力に単一のラベルを使用します。1 つのラベルだけで複数の入力にラベルを付けようとしてはいけません。これは、ブラウザにも、スクリーンリーダーにも最適なことです。ラベルをタップまたはクリックすると、フォーカスが関連付けられている入力に移動し、スクリーンリーダーは、*label* またはラベルの *input* にフォーカスが移動したときにラベルテキストをアナウンスします。

{% Aside 'caution' %} ラベルの代わりに[プレースホルダー](https://www.smashingmagazine.com/2018/06/placeholder-attribute/)を単独で使用しないでください。入力ボックスにテキストを入力し始めると、プレースホルダーが非表示になるため、何のための入力なのかを忘れやすくなります。プレースホルダーを使用して日付などの値の正しい形式を表示する場合も同様です。これは、特に、電話中で気が散っていたり、ストレスを感じたりしているユーザーにとっては問題となり得ます。{% endAside %}

#### ボタンを便利なものにする {: #html-button }

ボタンには [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button) を使用してください！`<input type="submit">` を使用することもできますが、`div`やその他の不適切な要素は使用しないようにしましょう。ボタン要素は、アクセス可能な動作や組み込みのフォーム送信機能を提供します。スタイルも簡単に指定できます。

各フォーム送信ボタンには、その機能が分かる値を指定します。チェックアウトに向かう各ステップで、進捗状況を示し、次のステップを明確にする説明的な行動喚起を使用します。たとえば、配送先住所フォームの送信ボタンには、[**続行**] や [**保存**] の代わりに、[**支払いに進む**] といったラベルを付けます。

{: #disable-submit }

ユーザーが送信ボタンをタップまたはクリックしたとき (特に支払いや注文をするとき) には送信ボタンを無効にするということを検討してください。正常に機能しているボタンを何度も繰り返しクリックするユーザーはたくさんいます。それが原因で、チェックアウトが正常に行われず、サーバーに負荷を与えてしまう場合があります。

一方で、完全かつ有効なユーザー入力を待っている送信ボタンを無効にしてはいけません。たとえば、何かが不足している、または無効であるからといって、[**アドレスを保存**] ボタンを無効のままにしてはいけません。ユーザーにとって不便な上に、ユーザーはボタンを何度もタップしたり、クリックしたりして、ボタンが壊れていると勘違いする可能性があります。代わりに、無効なデータが含まれたフォームをユーザーが送信しようとした場合は、何がおかしいのか、どうすれば修正できるのかを説明しましょう。モバイルでは特に重要なことです。モバイルでは、データを入力しにくいほか、フォームデータに未記入の箇所や無効な箇所があっても、ユーザーがフォームを送信しようとするまでは画面の枠から外れて見えない場合があります。

{% Aside 'caution' %} フォームのボタンのデフォルトのタイプは `submit` です。フォームに別のボタンを追加する場合 (たとえば、**パスワードを表示**など)、`type="button"` を追加します。それ以外の場合は、ボタンをクリックまたはタップすれば、フォームが送信されます。
{% endAside %}

`Enter` キーを押すと、`submit` ボタンのクリックがシミュレートされます。フォームの[**送信**]ボタンの前に別のボタンを含め、かつそのタイプを指定しない場合、そのボタンはフォームのボタンのデフォルトのタイプ、つまり `submit` となり、フォームが送信される前にクリックイベントを受け取ります。この例については、[デモ](https://enter-button.glitch.me/): fill in the form, then press `Enter` (フォームに記入して [Enter] を押す) を参照してください。

### HTML 属性を最大限に活用する {: #html-attributes }

#### データを入力しやすくする

{: #type-attribute }

[`type` 属性](https://developer.mozilla.org/docs/Web/HTML/Element/input/email)を使用して、モバイルで適切なキーボードを提供し、ブラウザーによる基本的な組み込み検証を有効にします。

たとえば、メールアドレスには `type="email"`、電話番号には `type="tel"` を使用します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bi7J9Z1TLP4IsQLyhbQm.jpg", alt="それぞれ type=email と type=tel を使ったメールアドレスと電話番号の入力に適切なキーボードを表示した Android 携帯電話のスクリーンショット (2 個)。", width="800", height="683" %}<figcaption> 電子メールや携帯電話に適したキーボード。</figcaption></figure>

{: #inputmode-attribute }

{% Aside 'warning' %}「type = "number"」を使用すると、番号をインクリメントする上/下矢印が追加されます。これを、電話番号や支払いカード番号、アカウント番号などのデータに使用するのはナンセンスです。

このような数値には、`type="text"` を設定します (デフォルトが `text` なため、属性は省略しても OK)。電話番号については、`type="tel"` を使用して、モバイルに適切なキーボードを用意します。その他の数値については、`inputmode="numeric"` を使用して、モバイルにテンキーを用意します。

一部のサイトでは、モバイルユーザーが適切なキーボードを使用できるように、今でも支払いカード番号に `type="tel"` が使用されています。ただし、`inputmode` は [現在一般的にサポートされている](https://caniuse.com/input-inputmode)ため、これを行う必要はありません。ですが、ユーザーのブラウザを確認することをおすすめします。{% endAside %}

{: #avoid-custom-elements }

日付に `select` 要素を使用するのは避けましょう。適切に実装されていないと、オートフィルの使用体験が損なわれるほか、古いブラウザは機能すらしません。誕生年などの数値の場合は、`select` の代わりに、`input` 要素を使うことを検討してください。これは、特に、モバイルでは、長いドロップダウンリストから選択するよりも、手動で数字を入力する方が簡単でエラーが発生しにくいためです。 `inputmode="numeric"` を使用して、モバイルで正しいキーボードを確保し、検証とフォーマットのヒントをテキストまたはプレースホルダーで追加して、ユーザーが適切なフォーマットでデータを入力できるようにします。

{% Aside %} [`datalist`](https://developer.mozilla.org/docs/Web/HTML/Element/datalist) 要素を使用すると、ユーザーは使用可能なオプションの一覧から選択でき、ユーザーがテキストを入力するときには、提案が表示されます。[simpl.info/datalist](https://simpl.info/datalist) で `text`、`range`、および `color` 入力に対して `datalist` を試してみてください。誕生年の入力につては、[datalist-select.glitch.me](https://datalist-select.glitch.me) で `select` を `input` および  `datalist` と比較できます。
{% endAside %}

#### オートコンプリートを使用してアクセシビリティを改善し、ユーザーがデータを再入力しなくていいようにする {: #autocomplete-attribute }

適切な `autocomplete` 値を使用すると、ブラウザはデータを安全に保存し、`input`、`select`、および `textarea` の値を自動入力してユーザーをサポートします。これはモバイルでは特に重要であり、[高いフォーム離脱率](https://www.zuko.io/blog/8-surprising-insights-from-zukos-benchmarking-data)を避ける上で欠かせません。オートコンプリートには、 [アクセシビリティのメリットもたくさんあります](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html)。

フォームフィールドに適切なオートコンプリート値を使用できるのであれば、それを使用するべきです。すべての値の一覧とそれぞれの正しい使用法については、[MDN のウェブドキュメント](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete)に記載されています。

{: #stable-name-id }

{% Aside %}適切なオートコンプリート値を使用するだけでなく、フォームフィールドの `name` と `id` 属性に、ページの読み込みやウェブサイトの展開中に変化しない[安定した値](#stable-name-id)を与えることで、ブラウザがフォームを自動入力できるようにします。{% endAside %}

{: #billing-address }

既定として、請求先住所は配送先住所と同じに設定します。フォームをすっきり見せるように、請求先住所は表示せずに、請求先住所を編集ためのリンクを提供します (もしくは、[`summary` 要素と `details` 要素を使用します](https://simpl.info/details/))。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TIan7TU8goyoOXwLPYyd.png", alt="請求先住所を変更するためのリンクを示すチェックアウトページの例。", width="800", height="250" %}<figcaption>請求内容を確認するためのリンクを追加する。</figcaption></figure>

配送先住所の場合と同様に、請求先住所に適切なオートコンプリート値を使用して、ユーザーがデータを何度も入力しなくて済みようにします。同じ名前の入力の値がセクションによって異なるという場合は、オートコンプリート属性にプレフィックスワードを追加します。

```html
<input autocomplete="shipping address-line-1" ...>
...
<input autocomplete="billing address-line-1" ...>
```

#### ユーザーが適切なデータを入力できるようにする {: #validation }

ユーザーが「おかしたミス」を「強く指摘する」のは避けましょう。代わりに、問題が発生したときは、その場で解決できるようユーザーをサポートして、ユーザーがより迅速かつ簡単にフォーム入力を完了できるようにします。お客様は、チェックアウトプロセスを通じて、あなたの会社の製品やサービスに対してお金を支払おうとしているのです。あなたの仕事はそのお客様を助けることであって、罰することではありません！

フォーム要素に[制約属性](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation#Intrinsic_and_basic_constraints)を追加すると、`min` や `max` 、`pattern` といった許容値を指定できます。要素の[有効性状態](https://developer.mozilla.org/docs/Web/API/ValidityState)は、要素の値が有効かどうかに応じて自動的に設定されます。値が有効であるか無効であるかを問わずに要素のスタイル指定をすることに使用できる CSS の疑似クラス `:valid` および `:invalid` も同様に設定されます。

たとえば、次の HTML は、1900年から2020年の間の誕生年の入力を指定します。`type="number"` の制約を使用すると、入力値は `min` と `max` で指定された範囲内の数値のみに制限されます。この範囲外の数値を入力しようとすると、入力は無効な状態に設定されます。

{% Glitch { id: 'constraints', path: 'index.html', height: 170 } %}

次の例では、 `pattern="[\d ]{10,30}"` を使用して、スペースを許可しながら、有効な支払いカード番号を確認します。

{% Glitch { id: 'payment-card-input', path: 'index.html', height: 170 } %}

最近のブラウザは、タイプが `email</cod> または <code data-md-type="codespan">url` の入力に対して基本的な検証も行います。

{% Glitch { id: 'type-validation', path: 'index.html', height: 250 } %}

{% Aside %} `type="email"` と指定されている入力に `multiple` 属性を追加して、単一の入力にコンマ区切りで入力される複数の電子メールアドレスに対する組み込みの検証機能を有効にします。{% endAside %}

フォームの送信時に、ブラウザは、自動的に問題のあるフィールドや未記入の必須フィールドにフォーカスをあてます。 JavaScript は必要ありません！

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mPyN7THWJNRQIiBezq6l.png", alt="無効なメールアドレス値に対するプロンプトとフォーカスを示すデスクトップ版 Chromeのサインインフォームのスクリーンショット。", width="500", height="483" %}<figcaption>ブラウザに組み込まれた基本的な検証機能。</figcaption></figure>

ユーザーが送信ボタンをクリックしたときにエラーの一覧を表示するのではなく、インラインで検証し、ユーザーがデータを入力するときにフィードバックを提供します。フォームの送信後にサーバー上のデータを検証する必要がある場合は、見つかったすべての問題を一覧表示し、無効な値を持つすべてのフォームフィールドを明確に強調表示し、問題のある各フィールドの横に修正が必要なことを説明するメッセージをインラインで表示します。サーバーログと分析データで一般的なエラーを確認してください。フォームの再設計が必要になる場合があります。

また、ユーザーがデータを入力しているときやフォームを送信しているときは、JavaScript を使ってより堅牢な検証を行う必要があります。([幅広くサポートされている](https://caniuse.com/#feat=constraint-validation)) [Constraint Validation API](https://html.spec.whatwg.org/multipage/forms.html#constraints) を使用すれば、ブラウザの組み込み UI を使ってカスタム検証を追加して、フォーカスを設定し、プロンプトを表示できます。

詳しくは、[Use JavaScript for more complex real-time validation (一層複雑なリアルタイム検証には JavaScript を使う)](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation) をご覧ください。

{% Aside 'warning' %} クライアント側の検証とデータ入力の制約がある場合でも、ユーザーからのデータ入力と出力はバックエンドによって安全に処理される必要があります。ユーザー入力は、悪質な可能性があるため、決して信用してはいけません。詳細については、[OWASP Input Validation Cheat Sheet (OWASP入力検証に関するチートシート)](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) をご覧ください。{% endAside %}

#### 必須データの記入忘れがないようにユーザーをサポートする {: #required }

必須の値については、入力に [`required` 属性](https://developer.mozilla.org/docs/Web/HTML/Attributes/required) を使用します。

フォームが送信されると、[最新のブラウザ](https://caniuse.com/mdn-api_htmlinputelement_required)は、自動的にプロンプトを表示し、データが入力されていない `required` フィールドにフォーカスを移動させます。[`:required` 疑似クラス](https://caniuse.com/?search=required)を使用すると、必須フィールドを強調表示できます。JavaScript は必要ありません！

必須フィールドのラベルにアスタリスクを追加し、フォームの先頭にアスタリスクの意味を説明するメモを追加します。

## チェックアウトを簡素化する {: #checkout-forms }

### モバイルコマースのギャップに注意する！ {: #m-commerce-gap }

*関心を維持するための予算*などというものがあるとすれば、それを使い果たしてしまうと、ユーザーはサイトから去って行くでしょう。

特にモバイルでは、摩擦を減らし、集中力を維持する必要があります。多くのサイトでは、*トラフィック*はモバイルの方が多くなりますが、*コンバージョン*はデスクトップの方が多くなります。これは、[モバイルコマースギャップ](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs)として知られる現象です。顧客はデスクトップで購入手続きを済ませることを好むかもしれませんが、モバイルのコンバージョン率が低いのは、ユーザーエクスペリエンスが乏しいことにも起因します。あなたの仕事は、モバイルで失われるコンバージョンを*最小限に抑え*、デスクトップでのコンバージョンを*最大限に高める*ことです。[ある調査](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs)によると、モバイルにおけるフォームの使用体験をもっと快適にできる大きなチャンスがあると分かっています。

ユーザーは、何よりも、長くて、複雑で、目的のはっきりしないフォームを放棄する傾向が強いです。これは、ユーザーが小さな画面を使っている、集中していない、または急いでいるときなどは、なおさら言えることです。ユーザーに求めるデータは、極力少なく抑えましょう。

### ゲストチェックアウトをデフォルトにする {: #guest-checkout }

オンラインストアの場合、フォームの摩擦を減らす最も簡単な方法は、ゲストのチェックアウトをデフォルトにすることです。購入する前にユーザーにアカウントの作成を強制しないでください。ショッピングカートを放棄する主な理由として、ゲストとしてチェックアウトすることが許可されていないことが挙げられます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a7OQLnCRb0FZglj07N7z.png", alt="チェックアウト中にショッピングカートが放棄される理由。", width="800", height="503" %}<figcaption> <a href="https://baymard.com/checkout-usability">baymard.com/checkout-usability</a> 参照。</figcaption></figure>

アカウントのサインアップは、チェックアウトの後に提供するとよいでしょう。その時点で、アカウントを設定するために必要なデータはほぼすべて揃っているため、ユーザーはアカウントをすばやく、簡単に作成できます。

{% Aside 'gotchas' %} チェックアウト後にサインアップを提供する場合は、ユーザーのした購入が新しく作成されたアカウントにリンクされていることを確認してください。{% endAside %}

### チェックアウトの進捗状況を表示する {: #checkout-progress }

進捗状況を表示し、次に何をする必要があるかを明確にすることで、チェックアウトプロセスの複雑さを軽減できます。以下の動画は、英国の小売業者 [johnlewis.com](https://www.johnlewis.com) がこれ成し遂げている方法を紹介しています。

<figure>
  {% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/6gIb1yWrIMZFiv775B2y.mp4", controls=true, autoplay=true, muted=true, poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ViftAUUUHr4TDXNec0Ch.png", playsinline=true %}
  <figcaption>Show checkout progress.</figcaption>
</figure>

ペースを最後まで維持する必要があります！支払いに向けた各ステップでは、ページの見出しと説明的なボタンの値を使用して、今何をする必要があるか、チェックアウトの次のステップは何かを明確にします。

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/address-form-save.mp4" type="video/mp4">
   </source></video>
  <figcaption>フォームボタンに、次のステップが分かる名前を付けます。</figcaption></figure>

`enterkeyhint` 属性を使用して、モバイル用キーボードの Enter キーのラベルを設定します。例えば、`enterkeyhint="previous"` と`enterkeyhint="next"` は複数ページのフォーム内に、`enterkeyhint="done"` はフォームの最終入力に、そして `enterkeyhint="search"` は検索入力に使用します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QoY8Oynpw0CqjPACtCdG.png", alt="Enter キーのボタンアイコンが enterkeyhint 入力属性によってどのように変更されるかを表した、Android のアドレスフォームを示す 2 つのスクリーンショット。", width="800", height="684" %}<figcaption> Android の Enter キーボタン(「次へ」と「完了」)。</figcaption></figure>

`enterkeyhint` 属性は、[Android と iOSでサポートされています](https://caniuse.com/mdn-html_global_attributes_enterkeyhint)。詳細については、[enterkeyhint の説明](https://github.com/dtapuska/enterkeyhint)をご覧ください。

{: #checkout-details }

ユーザーがチェックアウトプロセスの中を簡単に戻ったり、進んだりできるようにし、支払の最終段階でも注文を簡単に調整できるようにします。注文内容は、簡単な内訳ではなく、詳細をすべて表示します。ユーザーが支払いページからアイテムの数量を簡単に調整できるようにします。チェックアウト時の優先事項は、コンバージョンに向けた進捗を妨げないことです。

### 気が散る原因を取り除く {: #reduce-checkout-exits }

製品のプロモーションなど、視野に入ってくるものや、気が散る原因となるものを取り除き、離脱ポイントが生まれる可能性を制限します。実績ある小売業者の多くは、チェックアウトからナビゲーションや検索機能まで削除しています。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UR97R2LqJ5MRkL5H4V0U.png", alt="johnlewis.com におけるチェックアウトの進捗状況を表示したモバイルデバイスを示す 2 つのスクリーンショット。検索やナビゲーション、気が散る原因となるその他の要素は削除されている。", width="800", height="683" %}<figcaption> 検索やナビゲーション、気が散る原因となるその他の要素はチェックアウトから削除。</figcaption></figure>

チェックアウトだけに集中できるようにしましょう。ここは、ユーザーを誘惑する場面ではありません！

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lKJwd5e2smBfDjNxV22N.jpg", alt="目障りな「無料ステッカー」の宣伝が表示されたモバイルのチェックアウトページを示したスクリーンショット。", width="350", height="735" %}<figcaption> お客様が購入手続きを完了させるのを邪魔してはいけません。</figcaption></figure>

リピーターの場合、表示する必要のないデータを非表示にすることで、チェックアウトフローをさらに簡素化できます。例: 配送先住所を (フォームではなく) プレーンテキストで表示し、ユーザーがリンクを使って住所を変更できるようにします。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xEAYOeEFYhOZLaB2aeCY.png", alt="プレーンテキストで表示されたテキスト、配送先住所を変更するためのリンク、(画面には写っていないが支払い方法と請求先住所) が含まれたチェックアウトページの「注文内容を確認」セクションを示したスクリーンショット。", width="450", height="219" %}<figcaption> お客様に見せる必要のないデータは非表示にする。</figcaption></figure>

## 名前と住所を簡単に入力できるようにする {: #address-forms }

### 必要なデータのみを要求する {: #unneeded-data }

名前フォームと住所フォームのコーディングを開始する前に、必要なデータを把握をしておく必要があります。要らないデータは求めないようにしましょう！フォームの複雑さを軽減する最も簡単な方法は、不要なフィールドを削除することです。これはお客様のプライバシー保護にも役立ち、バックエンドデータのコストと責任を減らすことができます。

### 単一の名前入力を使用する {: #single-name-input }

名や姓、敬語、名前の他の部分を個別に保存する妥当な理由がない限り、名前は単一入力を使って入力できるようにします。名前に単一入力を使用すると、フォームの複雑さが軽減され、カットアンドペーストが可能になり、自動入力も簡単になります。

特に、そうしないことが妥当だと思われる理由がない限り、敬称や肩書 (Mrs、Dr、Lord など) に個別の入力を追加する必要はありません。必要だと思えば、名前を一緒に記入できます。また、 `honorific-prefix` オートコンプリートは現在ほとんどのブラウザで機能しないため、名前の敬称や肩書のフィールドを追加すると、ほとんどのユーザーに対しアドレスフォームのオートフィル機能の使用体験が損なわれてしまいます。

### 名前の自動入力を有効にする

フルネームに `name` を使用します。

```html
<input autocomplete="name" ...>
```

名前を細かく分割する妥当な理由がある場合は、適切なオートコンプリート値を使用してください。

- `honorific-prefix`
- `given-name`
- `nickname`
- `additional-name-initial`
- `additional-name`
- `family-name`
- `honorific-suffix`

### 国際名を許可する {: #unicode-matching }

名前の入力を検証するか、名前データに使用できる文字を制限することをお勧めします。ただし、アルファベットについては、できるだけ制限を緩くする必要があります。自分の名前が「無効」と言われては、良い気分がしないでしょう。

検証をする場合、ラテン文字のみに一致する正規表現は使わないようにしましょう。ラテン文字のみにしてしまうと、ラテン文字に含まれない文字を含む名前またはアドレスを持つユーザーが排除されてしまいます。代わりに Unicode の一致を許可し、バックエンドが入力と出力の両方として Unicode を安全にサポートするようにします。正規表現の Unicode は、最新のブラウザでしっかりとサポートされています。

{% Compare 'worse' %}

```html
<!-- Names with non-Latin characters (such as Françoise or Jörg) are 'invalid'. -->
<input pattern="[\w \-]+" ...>
```

{% endCompare %}

{% Compare 'better' %}

```html
<!-- Accepts Unicode letters. -->
<input pattern="[\p{L} \-]+" ...>
```

{% endCompare %}

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/unicode-letter-matching.mp4" type="video/mp4">
   </source></video>
  <figcaption>Unicode のマッチングとラテン文字のみのマッチングの比較。</figcaption></figure>

{% Aside %} [国際化とローカライゼーション](#internationalization-localization)の詳細は、以下よりご確認いただけます。フォームは、ユーザーがいるすべての地域で使用される名前に対応していることを確認しておきましょう。たとえば、日本語の名前の場合は、ふりがなのフィールドを用意することを検討する必要があります。これは、カスタマーサポートスタッフが電話でお客様の名前を言う際に便利です。{% endAside %}

### アドレスのさまざまな形式を許可する {: #address-variety }

住所フォームを設計するときは、1 つの国にもビックリするぼど多彩な住所形式があることを覚えておきましょう。「普通」の住所形式は存在しませんので注意してください。信じられないという方は、[UK Address Oddities (一風変わったイギリスの住所)](http://www.paulplowman.com/stuff/uk-address-oddities/) をご覧ください。

#### 住所形式に柔軟性を持たせる {: flexible-address }

形式の異なるフォームフィールドへの住所入力を必須にしてはいけません。

たとえば、多くの住所には異なる形式が使用されており、不完全なデータはブラウザのオートフィル機能に支障をきたす可能性があるため、番地や通りの名前の入力を分けることにこだわってはいけません。

`required` の住所フィールドには特に注意してください。たとえば、イギリスの大都市の住所に郡は使用されないにもかかわらず、多くのサイトではユーザーに郡の入力を強制しています。

2つの柔軟な住所行を使用すると、さまざまな住所形式に十分対応できます。

```html
<input autocomplete="address-line-1" id="address-line1" ...>
<input autocomplete="address-line-2" id="address-line2" ...>
```

一致させるラベルを追加します。

```html/0-2,5-7
<label for="address-line-1">
Address line 1 (or company name)
</label>
<input autocomplete="address-line-1" id="address-line1" ...>

<label for="address-line-2">
Address line 2 (optional)
</label>
<input autocomplete="address-line-2" id="address-line2" ...>
```

これを試すには、以下に埋め込まれているデモをリミックスして編集します。

{% Aside 'caution' %} 調査によると、[**住所の 2 行目**がユーザーにとって不便である](https://baymard.com/blog/address-line-2)という結果も出ています。住所フォームを設計するときは、このことを念頭に置き、`textarea` (以下参照) やその他のオプションを使用するなど、代替案を検討する必要があります。{% endAside %}

#### 住所に 1 つの textarea を使用することを検討する {: #address-textarea }

アドレスの最も柔軟なオプションは、1 つの `textarea` を提供することです。

`textarea` を使うアプローチは、どの住所形式にも適合するほか、切り取りと貼り付けにも最適です。ただし、データ要件に合わない場合もあり、それまでに `address-line1` と `address-line2` だけが使われたフォームしか使用したことがないユーザーは自動入力を使いこなせない可能性があることを心に留めておきましょう。

テキストエリアの場合は、`street-address` をオートコンプリート値として使用します。

こちらは、住所に 1 つの `textarea` が使用されたフォームの例です。

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

#### 住所フォームを国際化、ローカライズする {: #internationalization-localization }

住所フォームでは、ユーザーの所在地に応じて、[国際化とローカリゼーション](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites/)を検討することがとりわけ重要になります。

同じ言語内であっても、アドレス部分の名前はアドレス形式と同様に異なりますので注意が必要です。

```text
    ZIP code: US
 Postal code: Canada
    Postcode: UK
     Eircode: Ireland
         PIN: India
```

自分の住所形式に合わないフォームや想定外の用語が使用されたフォームが表示されると、イライラしたり、困惑したりしかねません。

サイトではアドレスフォームを[複数のロケール](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites#determining-user-s-language-and-region)に対応できるようにカスタマイズする必要があるかもしれませんが、上述したテクニックでフォームの柔軟性を最大化するだけで十分な場合もあります。住所フォームをローカライズしない場合は、さまざまな住所形式に対処するために優先すべき事柄を把握しておきましょう。

- 通りの名前や番地を必須にするなど、住所の各部分について細かくこだわり過ぎるのは避けましょう。
- 可能であれば、フィールドを `required` にするのは避けましょう。たとえば、多くの国の住所には郵便番号がなく、地方の住所には通りや道路の名前がない場合があります。
- 「国」ではなく「国/地域」、「ZIP」ではなく「ZIP /郵便番号」といった具合に、インクルーシブな名前を使用します。

柔軟性を保ちましょう！[先ほど紹介したシンプルな住所の例](#address-textarea)は、多くのロケールに「十分」適応させることができます。

#### 郵便番号による住所検索を使わないことを検討する {: #postal-code-address-lookup }

一部のウェブサイトでは、郵便番号に基づいて住所を検索するサービスが使用されます。一部のユースケースでは実用的で良いかもしれませんが、デメリットがあることも認識しておく必要があります。

郵便番号による住所の提案は、すべての国で機能するわけではありません。一部の地域では、郵便番号に膨大な数の住所が含まれる場合があります。

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/long-list-of-addresses.mp4" type="video/mp4">
   </source></video>
  <figcaption>郵便番号 (ZIP) には多くの住所が含まれている場合があります。</figcaption></figure>

アドレスの長いリストから選択することはユーザーにとって困難でしょう。特に、急いでいる場合やストレスを感じている場合に、モバイルで選択するのは大変です。ユーザーが自動入力を利用して、シングルタップまたはクリックで完全な住所を自動的に入力できるようにすれば、楽な上に、エラーも出にくくなります。

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/full-name-autofill.mp4" type="video/mp4">
   </source></video>
  <figcaption>名前に単一の入力を使えば、ワンタップ (ワンクリック) でアドレスを入力できます。</figcaption></figure>

## 支払いフォームを簡素化する {: #general-guidelines }

支払いフォームは、チェックアウトプロセスの最も重要な部分です。設計の悪い支払いフォームは、[ショッピングカート放棄の一般的な原因](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs)となっています。[悪魔は細部に宿る](https://en.wikipedia.org/wiki/The_devil_is_in_the_detail#cite_note-Titelman-1)とはよく言ったものです。特にモバイルの場合は、小さな不具合があるだけで、ユーザーに購入を放棄させてしまいかねません。あなたの仕事は、ユーザーができるだけ簡単にデータを入力できるフォームを設計することです。

### ユーザーが支払いデータを再入力しなくて済むようにする {: #payment-form-autocomplete }

支払いカードフォームには、支払いカード番号、カードの名義人の名前、有効期限の年と月といった適切な `autocomplete` 値を必ず追加してください。

- `cc-number`
- `cc-name`
- `cc-exp-month`
- `cc-exp-year`

これにより、ブラウザは支払いカードの詳細を安全に保存し、フォームデータを正しく入力することでユーザーを支援できます。オートコンプリートがないと、ユーザーは支払いカードの詳細に関する物理的な記録を保管したり、支払いカードのデータを安全でないかたちでデバイスに保存したりする傾向が強くなります。

{% Aside 'caution' %} 支払いカードタイプのセレクターは追加してはいけません。支払いカードの番号からいつでも推測できてしまいます。{% endAside %}

### 支払いカードの日付にカスタム要素を使用しない

[カスタム要素](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements)は、適切に設計されていないと、自動入力に支障をきたし、支払いフローを中断させてしまう可能性があります。また、古いブラウザでは機能しません。支払いカードの他のすべての詳細はオートコンプリートで利用できても、カスタム要素の自動入力が機能しなかったために、ユーザーが物理的な支払いカードを探してまでカードの有効期限を調べることになれば、売り上げを失う可能性が高くなります。代わりに標準の HTML 要素を使用することを検討し、それに応じてスタイルを設定することを検討しましょう。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1LIQm2Jt5PHxN0I7tni3.jpg", alt="自動入力を中断するカードの有効期限のカスタム要素を示す支払いフォームのスクリーンショット。", width="800", height="916" %}<figcaption>オートコンプリートによって、有効期限を除くすべてのフィールドが入力されているのが分かります！。</figcaption></figure>

### 支払いカードと電話番号に単一の入力を使用する {: #single-number-input }

支払いカードと電話番号には、単一の入力を使用します。番号を分割してはいけません。単一の入力を使用することで、ユーザーはデータを入力しやすくなり、検証が簡単になり、ブラウザで自動入力も使用できます。PIN や銀行コードといった他の数値データについても同じことを検討してください。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7cUwamPstwSQTlbmQ4CT.jpg", alt="クレジットカードフィールドが 4 つの入力要素に分割されていることを示す支払いフォームのスクリーンショット。", width="800", height="833" %}<figcaption>クレジットカード番号に複数の入力要素を使用してはいけません。</figcaption></figure>

### 検証は慎重に {: #validate }

データ入力は、リアルタイムに、そしてフォーム送信前にも検証する必要があります。これを行う方法の 1 つに、支払いカード入力に `pattern` 属性を追加するという手があります。ユーザーが無効な値を入力して支払いフォームを送信しようとすると、ブラウザーは警告メッセージを表示し、入力要素にフォーカスを移動させます。JavaScript は必要ありません！

{% Glitch { id: 'payment-card-input', path: 'index.html', height: 170 } %}

ただし、正規表現 `pattern` は、[支払いカード番号の桁数](https://github.com/jaemok/credit-card-input/blob/master/creditcard.js#L35) (14 以上 ～ 20 桁以下) を処理できるほど柔軟でなくてはいけません。支払いカード番号の構成について詳しくは、[LDAPwiki](https://ldapwiki.com/wiki/Bank%20Card%20Number) でご確認いただけます。

物理的なカードの番号はスペースを挟んで表示されるため、ユーザーが新しい支払いカード番号を入力するときにはスペースを含められるようにします。その方が、ユーザーにとっては扱いやすいし (何かミスをしたと指摘しなくてすみます)、コンバージョンのフローを中断させる可能性も低いし、処理する前に簡単に数字の間のスペースを削除できます。

{% Aside %} ID や支払いの確認にワンタイムパスコードを使用することをおすすめします。ただし、コードを手動で入力することを求めたり、電子メールまたは SMS テキストからコードをコピーするようことを求めたりすると、ミスをしやすくなり、摩擦の原因にもなります。ワンタイムパスコードを有効にするための効率的な方法に関する詳細は、[SMS OTP form best practices (SMS を使った OTP フォームに関するベストプラクティス)](/sms-otp-form) で解説しています。{% endAside %}

## さまざまなデバイス、プラットフォーム、ブラウザ、バージョンでテストする {: #test-platforms }

フォーム要素の機能と外観は異なる場合があり、ビューポートのサイズの違いにより配置に問題が出る可能性もあるため、住所フォームと支払いフォームはユーザーが一番使い慣れたプラットフォームでテストすることが特に重要になります。BrowserStack を使用すると、さまざまなデバイスやブラウザで[オープンソースプロジェクトを無料でテストする](https://www.browserstack.com/open-source)ことができます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Uk7WhpDMuHtvjmWlFnJE.jpg", alt="iPhone 7 と11 で表示した支払いフォーム (payment-form.glitch.me) のスクリーンショット。「支払いを完了」ボタンは iPhone 11には表示されますが、7 には表示されません。", width="800", height="707" %}<figcaption> 同じページを iPhone 7 と iPhone 11 で表示した画像。[<strong>支払いを完了</strong>] ボタンが隠れてしまわないように、<br>モバイルの小さいビューポートのパディングを減らす。 </figcaption></figure>

## 分析と RUM を実装する {: #analytics-rum }

ユーザビリティとパフォーマンスをローカルでテストすることが役立つ場合もありますが、ユーザーによる支払いフォームと住所フォームの使用体験を正しく理解するには、実際のデータが必要です。

それには、分析と Real User Monitoring (リアルユーザーモニタリング) が必要です。チェックアウトページの読み込みにかかる時間や支払いが完了するまでにかかる時間など、実際のユーザーによる使用体験に関するデータです。

- **ページ分析**: フォームが含まれたすべてのページの閲覧回数、バウンス率、離脱。
- **インタラクション分析**: [goal funnels](https://support.google.com/analytics/answer/6180923?hl=en) と [events](https://developers.google.com/analytics/devguides/collection/gtagjs/events) は、ユーザーがチェックアウトフローを放棄する場所およびユーザーがフォームに入力する際に実行するアクションを示します。
- **ウェブサイトのパフォーマンス**: [ユーザー中心の指標](/user-centric-performance-metrics)は、チェックアウトページの読み込みが遅いかどうか、および遅い場合の原因を示唆します。

ページ分析、インタラクション分析、および実際のユーザーパフォーマンスの評価は、サーバーログ、コンバージョンデータ、A / B テストと組み合わせると特に価値が高くなり、割引コードによって収益が増えるかどうか、フォームレイアウトを変更すればコンバージョンが改善されるかどうかなどの疑問に答えられます。

結果、注力の優先度を決定する、変更を加える、得られた成果に対して報酬を与えることについて、しっかりとした根拠が見つかります。

## 学習を続けましょう {: #resources }

- [Sign-up form best practices (サインアップフォームのベストプラクティス)](/sign-in-form-best-practices)
- [Sign-in form best practices (サインアップフォームのベストプラクティス)](/sign-up-form-best-practices)
- [WebOTP APIを使用してウェブ上の電話番号を確認する](/web-otp)
- [Create Amazing Forms (すばらしいフォームを作成する)](/learn/forms/)
- [Best Practices For Mobile Form Design (モバイルフォームデザインのベストプラクティス)](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [More capable form controls (より細かく機能するフォームコントロール)](/more-capable-form-controls)
- [Creating Accessible Forms (使いやすいフォームの作成)](https://webaim.org/techniques/forms/)
- [Streamlining the Sign-up Flow Using Credential Management API (認証情報管理 API を使用したサインアップフローの合理化)](https://developer.chrome.com/blog/credential-management-api/)
- [『Frank's Compulsive Guide to Postal Addresses』](http://www.columbia.edu/~fdc/postal/)は、200 か国以上で使用される住所形式に関する便利なリンクと広範なガイダンスを提供します。
- [国リスト](http://www.countries-list.info/Download-List)には、国コードと名前を複数の言語かつ複数の形式でダウンロードするためのツールが用意されています。

写真の提供者: Unsplash の [@rupixen](https://unsplash.com/@rupixen)。
