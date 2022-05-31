---
layout: post
title: Yahoo! JAPAN はパスワードレス認証で問い合わせを 25% 削減、ログイン時間も 2.6 倍速に
subhead: >
    Yahoo! JAPAN のパスワードレス認証について学ぶ
description: |
    Yahoo! JAPAN はパスワードレス認証を実現しました。そのアプローチと結果について学びましょう。
authors:
  - yuyaito
  - agektmr
  - alexandrawhite
date: 2022-05-10
hero: image/VbsHyyQopiec0718rMq2kTE1hke2/tqK2Tb4rUrxheagyYbDj.png
alt: Many identical keys.
tags:
  - blog
  - case-study
---

Yahoo! JAPAN は日本にて検索やニュースといったメディアサービス、e コマース、メールサービスなど、100を超えるサービスを提供している企業です。これらのサービスで利用するためのユーザーアカウントも長年提供し続け、月間のログインユーザーは 5,000 万を超える規模となっています。しかし、このユーザーアカウントを提供する中で、ユーザーアカウントに対しての攻撃を継続的に受けており、また、アカウントを継続利用する上での課題についてユーザーから問い合わせも多く頂いていました。これらの課題の多くはパスワードという認証手段に依存するものでした。また、当時、技術的にもパスワード以外の認証手段を提供するための機能やデバイスの普及が始まりつつありました。こういった背景のもと、Yahoo! JAPAN はパスワードによる認証からパスワードレスな認証へ移行すると判断しました。

## なぜパスワードレスか

Yahoo! JAPAN では以前、一般的なWebサービスのようにログイン ID とパスワードによる認証を基本としていました。しかし、パスワードは不正アクセスの被害を受ける可能性が高く、また、パスワードにまつわる問い合わせも非常に多い状況でした。

パスワードに関連して様々な攻撃を観測しておりますが、パスワードリスト型攻撃やフィッシング詐欺などが中心となっています。上述したとおり、Yahoo! JAPAN が提供するサービスには e コマースなど金銭に関わるものがあるため不正アクセスの被害やアカウントを失った際のユーザーの被害が大きくなりがちです。

パスワードリスト型攻撃が多い背景としては、複数のアプリや Web サイトでのパスワード使いまわしが多い現状があります。以下の数字は Yahoo! JAPAN が行ったアンケートの結果です。おおよそ 60% 以上のユーザーが複数のサービスでパスワードを使いまわしていると回答しており、パスワードリスト型攻撃が有効な攻撃方法となっていると考えられます。


<ul class="stats">
<div class="stats__item">
<p class="stats__figure">
50
<sub>%</sub>
</p>
<p>50% 以上が ID / パスワードを 6 個以上使用</p>
</div>
<div class="stats__item">
<p class="stats__figure">
60
<sub>%</sub>
</p>
<p>60% 以上が「複数のサービスでパスワードを使いまわしている」</p>
</div>
<div class="stats__item">
<p class="stats__figure">
70
<sub>%</sub>
</p>
<p>最も利用されているログイン方法は「パスワード」で約 76%</p>
</div>
</ul>

パスワードに関する問い合わせとしては、パスワードを忘れてしまったという問い合わせが大半でした。パスワードに関連して、ログイン ID も忘れてしまったという問い合わせもあり、これらの問い合わせだけで、最も多い時期ではアカウントにまつわる問い合わせの 1/3 以上を占めている状況でした。

これらの状況を改善するべく、Yahoo! JAPAN はパスワードレスに移行すると判断しました。パスワードレスを進めることでセキュリティだけでなくユーザビリティについても改善できると考えています。

セキュリティ観点ではユーザーの認証手段からパスワードを無くすことで、特にリスト型攻撃への被害を減らすことが出来、ユーザビリティ観点ではパスワードという記憶による認証に頼らない認証手段を提供することで、パスワードを忘れてログインできない、という事態を無くすことが出来ます。

従来からいろいろなセキュリティ向上の取り組みを行っていましたが、単純にセキュリティが高いだけでは利用者に負担をかけるだけになってしまい、結果としてセキュリティの高い状態を実現できません。ユーザビリティを共に向上させられることや、セキュリティを高める必然性が伝わるようなコミュニケーションを心がける必要があると考えています。それが結果としてユーザビリティだけではなく、セキュリティを向上させることに
繋がります。


## Yahoo! JAPAN のパスワードレスの取り組み

Yahoo! JAPAN ではパスワードレスを進めるため、いろいろな取り組みをしています。大別すると、

1. パスワードに代わる認証手段の提供
2. パスワードの無効化
3. パスワードレスなアカウント登録

の3つがあります。

1、2 は既存の利用者に対して、3 は新規の利用者に対しての取り組みです。

### 1. パスワードに代わる認証手段の提供

パスワードを無効にするのであれば、パスワードに変わる認証手段を提供しなければいけません。

Yahoo! JAPAN では、パスワードの代替として主に下記のような手段を提供しています。

1.  [SMS 認証](/sms-otp-form/)
2.  [FIDO 認証](https://developers.google.com/identity/fido)

加えて、メール認証やパスワード + SMS OTP、パスワード + メール OTP などの認証手段も提供しています。

#### SMS 認証

SMS 認証は、ログインしようとしているユーザーが登録・確認済みの電話番号に SMS で 6 桁程度の認証用コードを送り、そのコードの入力によって認証する仕組みです。ユーザーは SMS が届くと、アプリを開いて認証用コードを記憶、もしくはコピーして入力する必要がありました。

<figure class="screenshot">
{% Img
   alt="",
   src="image/VbsHyyQopiec0718rMq2kTE1hke2/h08m9uzVJg9uNzM3LE5k.jpg", width="668", height="437"
%}
</figure>

iOS では以前から SMS を OS が読み取り本文中の認証用コードをサジェストする機能がありましたが、最近では、`input` 要素の `autocomplete` 属性に `"one-time-code"`と指定することで、サジェストが利用できるようになりました。Android や Windows、Mac の Chrome でも、[WebOTP API](https://developer.mozilla.org/docs/Web/API/WebOTP_API) という仕組みを利用することによって同様の体験を提供可能になっています。

HTML

```html
<form>
  <input type="text" id="code" autocomplete="one-time-code"/>
  <button type="submit">sign in</button>
</form>
```

JavaScript

```javascript
if ('OTPCredential' in window) {
  const input = document.getElementById('code');
  if (!input) return;
  const ac = new AbortController();
  const form = input.closest('form');
  if (form) {
    form.addEventListener('submit', e => {
      ac.abort();
    });
  }
  navigator.credentials.get({
    otp: { transport:['sms'] },
    signal: ac.signal
  }).then(otp => {
    input.value = otp.code;
  }).catch(err => {
    console.log(err);
  });
}
```

いずれのアプローチも、SMS 文中にドメインを記載することで、指定されたドメインでのみサジェストすることにより、フィッシングされにくい仕組みになっています。 WebOTP API および `autocomplete="one-time-code"` についての詳細は[こちらの記事](/sms-otp-form/)をご覧ください。

<figure class="screenshot">
{% Img
   alt="",
   src="image/VbsHyyQopiec0718rMq2kTE1hke2/Szaf3C0hfjLNkTWAVf9B.png", width="387", height="523"
%}
</figure>

#### FIDO / WebAuthn

FIDO / WebAuthn はハードウェア認証器で公開鍵暗号ペアを生成し、所持証明する認証方式です。特にスマートフォンが認証器の場合は、指紋センサーや顔識別といった生体認証と組み合わせて、一段階二要素認証を行うことができます。この際、サーバーには署名と生体認証が成功したという情報のみが送られるため、生体情報が盗まれる危険性はありません。

下記の図は FIDO / WebAuthn を行うサーバ/クライアントの構成図です。Client にある Authenticator は生体認証などを用いてユーザーの認証を行い、その結果に対して公開鍵暗号方式による署名を行います。また、署名作成に用いる秘密鍵を [TEE (Trusted Execution Environment)](https://en.wikipedia.org/wiki/Trusted_execution_environment) などに安全に保管します。FIDO では FIDO を利用するサービス提供者などのことを RP と呼びますが、RP のアプリケーションは OS、Browser を通して Authenticator から取得した検証結果を Server に送信し、Server は検証結果の妥当性を検証することで認証を完了します。

<figure>
   {% Img
      src="image/VbsHyyQopiec0718rMq2kTE1hke2/PkFYWnOZABjPu7Zc7rXN.png", alt="", width="800", height="400"
   %}
</figure>

詳しくは[こちらの記事](https://fidoalliance.org/fido-authentication/)をご覧ください。

FIDO についてはデバイスの対応も進み、現在では下記のような対応状況となっています。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
       <tr>
   <td>
    <strong>OS</strong>
   </td>
   <td>
    <strong>FIDO サポート</strong>
   </td>
  </tr>
  </thead>
  <tbody>
  <tr>
   <td>
    Android
   </td>
   <td>
    アプリ、ブラウザ (Chrome)
   </td>
  </tr>
  <tr>
   <td>
    iOS
   </td>
   <td>
    アプリ (iOS14 以降)、ブラウザ (Safari 14 以降)
   </td>
  </tr>
  <tr>
   <td>
    Windows
   </td>
   <td>
    ブラウザ (Edge, Chrome, Firefox)
   </td>
  </tr>
  <tr>
   <td>
    Mac (Big Sur 以降)
   </td>
   <td>
    ブラウザ (Safari, Chrome)
   </td>
  </tr>
</tbody>
  </table>
</div>

また、Yahoo! JAPAN ではこのうち、Android アプリ  / Web、iOS アプリ / Web、Windows (Edge、Chrome、Firefox)、Mac (Safari、Chrome)で FIDO に対応しています。コンシューマー向けのサービスとしてはおおよそのデバイスで FIDO は使える状況と言えますので、パスワードレスを進める上で FIDO はとても良い選択肢だと考えています。

Yahoo! JAPAN ではユーザーが他の手段で認証後、FIDO / WebAuthn を登録していなければ、登録を推奨します。こうすることで、ユーザーが同じデバイスでログインする必要がある場合、例えば SMS 認証を繰り返すことなく、指紋認証だけですぐに認証することができ、ユーザー体験が向上します。

<figure class="alignright">
  {% Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/iq0dODcbp3WcPUGTwHkl.png", width="520", height="497", class="screenshot", alt="" %}
  <figcaption>Yahoo! JAPAN で利用される FIDO</figcaption>
</figure>

ただし、登録した生体認証は同じデバイスでしか利用できないため、ユーザーは新しいデバイスに移る度に別の手段で認証し、新しく生体認証を登録する必要があります。

パスワードレスの普及を段階的に進めるためには、その過程でパスワードから移行中のユーザーを含め、複数の認証手段をユーザーに提供する必要があります。複数の認証手段を提供すると、ユーザーによって認証手段の設定状態も違いますし、ブラウザによって使える認証手段も違います。さらには、前回の認証手段と同じ認証手段でのログインができるとユーザーにとっては良い体験となると思います。これらの要件を満たすため、前回認証に用いた認証手段が何であるか、Cookie などに情報を保持してクライアントに紐づけて管理したり、認証時に利用しているブラウザ / アプリを分析する必要があります。認証時はユーザーの設定状態、クライアントで前回行われた認証手段、最低限必要な認証のレベルなどから判断して適切な認証手段をユーザーに求めます。

### 2. パスワードの無効化

Yahoo! JAPAN ではパスワードの代替となる認証手段をユーザーに設定してもらった上でパスワードを無効化し、パスワードを使えないようにしています。パスワードの代替となる認証手段を設定するだけではなく、パスワードを使えなくすること（もしくはパスワードだけでサインイン出来なくすること）によって初めてリスト型攻撃への防御となります。

ここで問題となるのが、如何にユーザーにパスワードを無効化してもらうかということです。ユーザーにパスワードを無効化してもらえるよう、下記のような取り組みを行っています。

* ユーザーがパスワードを再設定する場面でパスワードの代替となる認証手段を訴求
* 頻度高く認証を求める場面で使いやすい認証手段（FIDO など）の設定とともにパスワードの無効化を訴求
* e コマースの決済のようなリスクの高いサービスを利用する前にパスワードの無効化を訴求

特にパスワードを忘れた場合、いわゆるアカウントリカバリをユーザーは行いますが、この際に以前であればパスワードを再設定していましたが、パスワード以外の認証手段も登録できるようにしており、これを推奨しています。

### 3. パスワードレスなアカウント登録

これが最もシンプルかつ効率的な対策です。アカウント作成時からパスワード不要のアカウントとして登録するのです。

Yahoo! JAPAN では SMS認 証をした上でまずSMSによるサインインが出来るアカウントとして登録をするようになっています。その後、任意で FIDOの 登録を出来るよう FIDO設定の訴求を行っています。FIDO はデバイスごとの設定であるためデバイスが利用できなくなってしまうとアカウントリカバリーが難しいため、まずは電話番号を登録し、その後に FIDO など他の認証手段の登録を求めています。

### パスワードレスについての主な課題

パスワードという認証手段は人間の記憶に頼ったもので、デバイスに依存しない認証手段です。一方、パスワードレスへの取り組みとしてここまでに紹介した認証手段はデバイスに依存します。そのため、複数デバイスの間で同じアカウントを使うケースや、デバイスを失ったケースにおいて課題を抱えています。

複数デバイスに関する課題の具体例を紹介します。複数デバイスに関する課題は主にユーザビリティに関わるもので、下記のようなものがあります。

* SMS 認証を利用する際、PCを利用しているときにスマートフォンに届く SMS を閲覧する必要があり、面倒である
* FIDO で、特に Platform Authenticator と呼ばれる OS などに紐付いた Authenticator を使う場合、ユーザーが複数のデバイスを利用すると登録していないデバイスでは FIDO による認証が行えず、デバイスごとに登録する必要がある

デバイスを失ったケースの課題の具体例としては下記のようなものがあります。

* 電話番号の回線を契約解除すると登録された電話番号への SMS の送信ができなくなる
* FIDO は秘密鍵をデバイスに保管する方式であり、当然デバイスを失うと発行した秘密鍵は利用できなくなる

パスワードレスの推進においてこれらの課題は重要なトピックで、Yahoo! JAPAN でもいろいろな取組をしています。

シンプルかつ最も重要な解決手段として、複数の認証手段を登録してもらうというやり方があります。これはデバイスを紛失するなどといった事態に備えた取り組みであり、デバイスごとでの最適な認証手段の設定でもあります。FIDO の鍵はデバイスに依存するので、複数のデバイスで FIDO の秘密鍵を登録することも良いやり方です。

他にも、WebOTP API を使うことで SMS の届く Android から PC の Chrome に SMS 内にある確認コードを受け渡すこともできます。詳しくは[こちらの記事](https://developer.chrome.com/blog/cross-device-webotp/)をご覧ください。また、最近では Apple が [PassKeys](https://developer.apple.com/documentation/authenticationservices/public-private_key_authentication/supporting_passkeys) という機能を発表しています。この機能は iCloud KeyChain を用いることで、デバイスに保存された秘密鍵を同じApple ID で Sign In しているデバイス間で共有し、デバイスごとの登録を不要にするものです（その後 Google、Microsoft と[同名のプロジェクトを共同で推進することを発表](https://fidoalliance.org/apple-google-and-microsoft-commit-to-expanded-support-for-fido-standard-to-accelerate-availability-of-passwordless-sign-ins-jp/?lang=ja)）。なお、FIDO アライアンスもアカウントリカバリに関する課題を重要視しており[ホワイトペーパー](https://fidoalliance.org/white-paper-multiple-authenticators-for-reducing-account-recovery-needs-for-fido-enabled-consumer-accounts/)を発行しています。

これらの課題に対する取り組みはパスワードレスの拡大に伴って、更に重要なトピックとなっていくと考えています。

### パスワードレスの推進

これらのパスワードレスへの取り組みを Yahoo! JAPAN は 2015 年頃より進めてきました。2015 年 5 月の FIDO サーバーの認定取得を始めとして、そこから SMS 認証の導入や、パスワード無効化機能の提供、各デバイスでの FIDO 対応などを順次進めて来ました。いまでは月間アクティブユーザーのうち、3,000 万を超えるユーザーがパスワードを無効化済みで、パスワード以外の認証手段を用いています。Yahoo! JAPAN での FIDO への対応は Android ブラウザ（Chrome）から始まり、いまでは FIDO の設定したユーザーは 1,000 万を超えています。

この取組の成果として、ログイン ID / パスワードを忘れたという問い合わせについて、最も多かった時期から比べて、全体に占める割合が25%も減少しましたし、不正アクセスについても、パスワードレスのアカウントが増えることにより減少することが確認できています。

特に FIDO は設定も簡単なため、その設定 CVR も高くなっています。実際に、Yahoo! JAPANでは前述の SMS 認証などより CVR が高いことがわかっています。また、FIDO については SMS認証に比べ認証時の成功率が高いこと、また認証にかかる時間についても平均速度が速く中央値も最も速いことがわかっています。なお、パスワードについては認証時間が短いグループもいることがわかっており、これはブラウザの [`autocomplete="current-password"`](/sign-in-form-best-practices/#current-password) によるものではないかと考えています。

<ul class="stats">
<div class="stats__item">
<p class="stats__figure">
25
<sub>%</sub>
</p>
<p>ログイン ID / パスワード忘れの問い合わせの削減</p>
</div>
<div class="stats__item">
<p class="stats__figure">
74
<sub>%</sub>
</p>
<p>FIDO での認証成功率</p>
</div>
<div class="stats__item">
<p class="stats__figure">
65
<sub>%</sub>
</p>
<p>SMS 認証での認証成功率</p>
</div>
</ul>

<figure class="screenshot">
{% Img
   src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/FHX1juV7V9GUpQnhs1sL.png",
   alt="パスワード、SMS、FIDO それぞれによる認証時間を比較したグラフ",
   width="800", height="484"
%}
<figcaption>平均すると、パスワードでは 21 秒、SMS では 27 秒かかるが、FIDO では 8 秒で認証できる。</figcaption>
</figure>

パスワードレスを進める上で一番難しいことは、認証手段の追加ではなく、その利用を如何に普及させるかというところです。パスワードレスによるサービス利用の体験が良く、またユーザーにとって合理的でなければなかなか移行は進みませんので、ユーザビリティを高めることで結果としてユーザーのセキュリティ向上を実現させる必要があり、これらはサービスによって独自の工夫が必要になると考えています。

## まとめ

今回は Yahoo! JAPAN のパスワードレスへの取り組みを紹介させていただきました。パスワードによる認証はセキュリティ面のリスクもあり、またユーザビリティの点でも課題を抱えています。その上、現在は、Web OTP API や FIDO など、パスワード以外での認証を支える技術も普及してきていますので、パスワードレスの取り組みを始めるべき時期と言えます。Yahoo! JAPAN では、このパスワードレスの取り組みにより、ユーザビリティ、セキュリティ双方の効果が確実に出ています。ただ、まだ多くのユーザーがパスワードを使用されておりますので、引き続きパスワードレスな認証手段の利用を拡大させていきます。また、パスワードレスな認証手段にプロダクトのユーザー体験を最適化するよう、プロダクトの改善も続けていきたいと考えています。

_Photo by olieman.eth on [Unsplash](https://unsplash.com)_
