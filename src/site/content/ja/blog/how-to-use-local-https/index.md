---
title: ローカル開発にHTTPSを使用する方法
subhead: 場合によっては、HTTPSを使用してローカル開発サイトを実行する必要があります。これを安全かつ迅速に行うためのツールとヒント。
authors:
  - maudn
date: 2021-01-25
hero: image/admin/ZvW6VM0GEScldWHBvXJ4.jpg
thumbnail: image/admin/OG8YksgOnzGfnurzncWO.jpg
tags:
  - blog
  - security
---

{% Aside 'caution' %}ほとんどの場合、 `http://localhost`が必要な処理を実行します。通常、ブラウザでは、HTTPSのように動作します🔒。そのため、デプロイされたHTTPサイトで動作しない一部のAPIが`http://localhost`で動作します。

つまり、カスタムホスト名やブラウザ間でのセキュアCookieなど、**特別な場合にのみ**HTTPSをローカルで使用する必要があるということです ([ローカル開発にHTTPSを使用する場合](/when-to-use-local-https)を参照)。該当する場合はお読みください。{% endAside %}

*この投稿では、`localhost`に関する説明は、`127.0.0.1`と`[::1]`にも有効です。これらはいずれも、「ループバックアドレス」とも呼ばれるローカルコンピュータアドレスを記述しているためです。また、簡単にするために、ポート番号は指定されていません。**したがって、`http://localhost`は、 `http://localhost:{PORT}`または`http://127.0.0.1:{PORT}`と読んでください。*

本番WebサイトがHTTPSを使用している場合は、ローカル開発サイトを**HTTPSサイトのよう**に動作させる必要があります (本番WebサイトがHTTPSを使用していない場合は、[HTTPSへの切り替えを優先します](/why-https-matters/))。ほとんどの場合、 `http://localhost`を信頼し、**HTTPSサイトのように**動作させることができます。ただし、[場合によっては](/when-to-use-local-https)、HTTPSを使用してサイトをローカルで実行する必要があります。次に、この方法について説明します。

**⏩簡単な手順をお探しの場合、またはすでにこのトピックを読んだ場合は、[チートシート](#using-mkcert-cheatsheet)を開いてください。**

## mkcertを使用してHTTPSでサイトをローカルで実行する (推奨)

ローカル開発サイトでHTTPSを使用し、`https://localhost`または`https://mysite.example` (カスタムホスト名) にアクセスするには、[TLS証明書](https://en.wikipedia.org/wiki/Public_key_certificate#TLS/SSL_server_certificate)が必要です。ただし、証明書だけではブラウザによって有効だと見なされません。証明書は、**[信頼できる認証局 (CA)](https://en.wikipedia.org/wiki/Certificate_authority)**と呼ばれる、ブラウザによって信頼されている機関によって**署名**されている必要があります。

必要な手順は、証明書を作成し、デバイスとブラウザによって**ローカルで信頼**されているCAで署名することです。[mkcert](https://github.com/FiloSottile/mkcert)はこの手順を支援するためのツールであり、数個のコマンドで手順を実行できます。次に、このツールの仕組みについて説明します。

- HTTPSを使用してブラウザでローカルに実行されているサイトを開くと、ブラウザがローカル開発サーバーの証明書を確認します。
- ブラウザは、証明書がmkcertによって生成された認証局によって署名されていることを確認すると、証明書が信頼できる認証局として登録されているかどうかを確認します。
- mkcertは信頼できる機関として登録されているため、ブラウザは証明書を信頼し、HTTPS接続を作成します。

<figure>{% Img src="image/admin/3kdjci7NORnOw54fMia9.jpg", alt="mkcertの動作の仕組みの図。", width="800", height="787" %} <figcaption>mkcertの動作の仕組みの図。</figcaption></figure>

mkcert (および類似したツール) には、次のようなさまざまな利点があります。

- mkcertは、**ブラウザによって有効な証明書と見なされる証明書に準拠した**証明書の作成に特化しています。mkecertによって作成された証明書は、常に更新され、要件とベストプラクティスに適合しています。このため、mkcertコマンドを実行して、適切な証明書を生成ときには、複雑な構成や引数が必要ありません。
- mkcertはクロスプラットフォームツールです。全員が使用できます。

mkcertは、ローカル開発用のTLS証明書を作成するために推奨されるツールです。[他のオプション](#running-your-site-locally-with-https-other-options)もご覧ください。

多くのオペレーティングシステムには、[openssl](https://www.openssl.org/)などの証明書を生成するためのライブラリが含まれている場合があります。 このようなライブラリは、mkcertや類似したツールとは異なり、一貫して正しい証明書を生成しない可能性があります。また、複雑なコマンドの実行が必要になる場合があったり、必ずしもクロスプラットフォームではなかったりします。

{% Aside 'gotchas' %} この投稿で注目しているmkcerは[こちら](https://github.com/FiloSottile/mkcert)です。[こちら](https://www.npmjs.com/package/mkcert)ではありません。{% endAside %}

### 注意

{% Aside 'caution' %}

- `mkcert -install`を実行するときにmkcertによって自動的に作成されるファイル`rootCA-key.pem`は絶対にエクスポートしたり共有したりしないでください。**攻撃者がこのファイルを入手すると、ユーザーがアクセスしている可能性のあるすべてのサイトに対して中間者攻撃が発生する可能性があります**。攻撃者はユーザーのコンピュータから銀行、医療機関、またはソーシャルネットワークなどの任意のサイトへの安全な要求を傍受する可能性があります。ファイルが安全であることを確認するために、`rootCA-key.pem`が格納されている場所を知る必要がある場合は、`mkcert -CAROOT`を実行してください。
- mkcertは**開発目的**でのみ使用してください。特に、絶対にエンドユーザーにmkcertコマンドの実行を依頼しないでください。
- 開発チーム: チームのすべてのメンバーは、mkcertを**個別**にインストールして実行する必要があります (CAと証明書は保存、共有しないこと)。

{% endAside %}

### セットアップ

1. mkcertをインストールします (1回のみ)。

    オペレーティングシステムにmkcertをインストールするための[手順](https://github.com/FiloSottile/mkcert#installation)に従います。たとえば、macOSの場合は次のように実行します。

    ```bash
    brew install mkcert
    brew install nss # if you use Firefox
    ```

2. ローカルルートCAにmkcertを追加します。

    ターミナルで、次のコマンドを実行します。

    ```bash
    mkcert -install
    ```

    これにより、ローカル認証局 (CA) が生成されます。 mkcertで生成されたローカルCAは、デバイス上で**ローカル**でのみ信頼されます。

3. mkcertによって署名されたサイトの証明書を生成します。

    ターミナルで、サイトのルートディレクトリ、または証明書を保存するディレクトリに移動します。

    次のコマンドを実行します。

    ```bash
    mkcert localhost
    ```

    `mysite.example`ようなカスタムホスト名を使用している場合は、次のコマンドを実行します。

    ```bash
    mkcert mysite.example
    ```

    上記のコマンドは2つの処理を実行します。

    - 指定したホスト名の証明書を生成する
    - mkcert (手順2でローカルCAとして追加した認証局) にこの証明書に署名させます。

    これで、証明書の準備が整い、ブラウザによってローカルで信頼される認証局が署名しました。これで手順はほぼ完了ですが、サーバーはまだ証明書を認識していません。

4. サーバーを構成します。

    (開発サーバーはデフォルトでHTTPを使用する傾向があるため) ここで、HTTPSを使用し、作成したTLS証明書を使用するようにサーバーに命令します。

    この正確な方法はサーバーによって異なります。次に例をいくつか示します。

    **👩🏻‍💻ノードあり:**

    `server.js` (`{PATH/TO/CERTIFICATE...}`および`{PORT}`を置換):

    ```javascript
    const https = require('https');
    const fs = require('fs');
    const options = {
      key: fs.readFileSync('{PATH/TO/CERTIFICATE-KEY-FILENAME}.pem'),
      cert: fs.readFileSync('{PATH/TO/CERTIFICATE-FILENAME}.pem'),
    };
    https
      .createServer(options, function (req, res) {
        // server code
      })
      .listen({PORT});
    ```

    **👩🏻‍💻http[サーバーを使用](https://www.npmjs.com/package/http-server):**

    次のようにサーバーを起動します (`{PATH/TO/CERTIFICATE...}`を置換)。

    ```bash
    http-server -S -C {PATH/TO/CERTIFICATE-FILENAME}.pem -K {PATH/TO/CERTIFICATE-KEY-FILENAME}.pem
    ```

    `-S`はHTTPSでサーバーを実行し、 `-C`は証明書を設定し、`-K`はキーを設定します。

    **👩🏻‍💻React開発サーバーを使用する場合：**

    `package.json`を次のように編集し、 `{PATH/TO/CERTIFICATE...}`を置換します。

    ```json
    "scripts": {
    "start": "HTTPS=true SSL_CRT_FILE={PATH/TO/CERTIFICATE-FILENAME}.pem SSL_KEY_FILE={PATH/TO/CERTIFICATE-KEY-FILENAME}.pem react-scripts start"
    ```

    たとえば、次のようにサイトのルートディレクトリに`localhost`証明書を作成した場合:

    ```text
    |-- my-react-app
        |-- package.json
        |-- localhost.pem
        |-- localhost-key.pem
        |--...
    ```

    `start`スクリプトは次のようになります。

    ```json
    "scripts": {
        "start": "HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem react-scripts start"
    ```

    **👩🏻‍💻その他の例:**

    - [Angular開発サーバー](https://angular.io/cli/serve)
    - [Python](https://blog.anvileight.com/posts/simple-python-http-server/)

5. ✨これで完了です。 `https://localhost`または`https://mysite.example`をブラウザ開きます。HTTPSを使用してローカルでサイトを実行しています。ブラウザはローカル認証局としてmkcertを信頼しているため、ブラウザの警告は表示されません。

{% Aside %}サーバーがHTTPSに別のポートを使用している可能性があります。 {% endAside %}

### mkcertの使用: チートシート

{% Details %} {% DetailsSummary %} mkcertの概要{% endDetailsSummary %}

HTTPSを使用してローカル開発サイトを実行するには、次の手順に従います。

1. mkcertを設定します。

    まだインストールしていない場合は、mkcertをインストールします。次に、macOSの例を示します。

    ```bash
    brew install mkcert

    ```

    WindowsおよびLinuxの手順については、 [mkcertのインストールを](https://github.com/FiloSottile/mkcert#installation)確認してください。

    次に、ローカル認証局を作成します。

    ```bash
    mkcert -install
    ```

2. 信頼できる証明書を作成します。

    ```bash
    mkcert {YOUR HOSTNAME e.g. localhost or mysite.example}
    ```

    これにより、有効な証明書が作成されます (`mkcert`によって自動的に署名されます)。

3. HTTPSと手順2で作成した証明書を使用するように開発サーバーを構成します。

4. ✨これで完了です。これで、ブラウザで警告が表示されずに`https://{YOUR HOSTNAME}`にアクセスできます。

{% Aside 'caution' %}

**これは開発目的**でのみ実行し、`rootCA-key.pem`ファイルは**絶対にエクスポートまたは共有しない** でください (ファイルが安全であることを確認するためにこのファイルの場所を知る必要がある場合は、`mkcert -CAROOT`を実行してください)。

{% endAside %}

{% endDetails %}

## HTTPSを使用してサイトをローカルで実行する: その他のオプション

### 自己署名証明書

また、mkcertのようなローカル認証局を使用せずに**自分で証明書に署名**することもできます。

この方法には問題点がいくつかあるので注意が必要です。

- ブラウザによって認証局として信頼されていないため、手動でバイパスする必要があるという警告が表示されます。 Chromeでは、`#allow-insecure-localhost`フラグを使用して、`localhost`で表示されるこの警告を回避できます。
- 保護されていないネットワークで作業している場合は、安全ではありません。
- 自己署名証明書は、信頼できる証明書とまったく同じようには動作しません。
- mkcertのようなローカルCAを使用する場合と比べ、必ずしも簡単または高速であるとは限りません。
- ブラウザのコンテキストでこの手法を使用していない場合、サーバーの証明書の検証を無効にしなければならないことがあります。本番環境で再有効化しないと危険です。

<figure>{% Img src="image/admin/KxLz7mcUudiFwWBIdhH8.jpg", alt="自己署名証明書が使用されたときにブラウザに表示される警告のスクリーンショット。", width="800", height="598" %} <figcaption>自己署名証明書が使用されると、警告ブラウザが表示されます。</figcaption></figure>

{% Aside %}証明書を指定しない場合、 [React](https://create-react-app.dev/docs/using-https-in-development/)および[Vueの](https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-serve)開発サーバーのHTTPSオプションは、内部で自己署名証明書を作成します。これは簡単ですが、ブラウザの警告が表示され、上記の自己署名証明書に関連するその他の落とし穴が発生します。幸い、フロントエンドフレームワークの組み込みHTTPSオプション**を**使用して、mkcertなどを介して作成されたローカルで信頼できる証明書を指定できます。 [Reactの例を使用](/#setup:~:text=a%20React%20development%20server)したmkcertでこれを行う方法を参照してください。 {% endAside %}

{% Details %} {% DetailsSummary %}ブラウザが自己署名証明書を信頼しないのはなぜですか。{% endDetailsSummary %}

HTTPSを使用してブラウザでローカルに実行されているサイトを開くと、ブラウザはローカル開発サーバーの証明書を確認します。ブラウザで証明書がユーザーによって署名されていることが確認されると、信頼できる認証局として登録されているかどうかがチェックされます。信頼できる認証局として登録されていないため、ブラウザは証明書を信頼できません。接続が安全でないことを通知する警告が表示されます。自己責任で続行できます。続行すると、HTTPS接続が作成されます。

<figure>{% Img src="image/admin/V2SAcIzuofqzUuestOOX.jpg", alt="ブラウザが自己署名証明書を信頼しない理由: 図。", width="800", height="833" %} <figcaption>ブラウザが自己署名証明書を信頼しない理由。</figcaption></figure>

{% endDetails %}

### 通常の認証局によって署名された証明書

また、ローカルではなく実際の認証局に証明書に署名させるという手法もあります。

これらの手法の使用を検討している場合は、次の点に注意してください。

- mkcertなどのローカルCA手法を使用するときよりも、セットアップ作業が多くなります。
- 管理している有効なドメイン名を使用する必要があります。つまり、次の場合には、実際の認証局を**使用できません**。
    - `localhost`および[予約](https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml)されているその他のドメイン名 (例: `example`や`test`)。
    - 管理していないドメイン名。
    - 無効な最上位のドメイン。[有効な最上位のドメインの一覧](https://www.iana.org/domains/root/db)を参照してください。

### リバースプロキシ

別の方法として、HTTPSを使用してローカルで実行されているサイトにアクセスするときに、[ngrok](https://en.wikipedia.org/wiki/Reverse_proxy)などの[リバースプロキシ](https://ngrok.com/)を使用できます。

次の点を考慮してください。

- リバースプロキシで作成されたURLを共有すると、全員がローカル開発サイトにアクセスできます。これは、顧客に対してプロジェクトのデモを行うときには非常に便利です。しかし、プロジェクトの機密性が高い場合は、これがマイナス面になる可能性があります。
- 価格設定を検討する必要があるかもしれません。
- ブラウザの新しい[セキュリティ対策](/cors-rfc1918-feedback/)は、このようなツールの動作に影響を与える可能性があります。

### フラグ (非推奨)

`mysite.example`などのカスタムホスト名を使用している場合は、Chromeでフラグを使用して、`mysite.example`が安全であると強制的に見なすことができます。**これを行うことは避けてください。**理由は次のとおりです。

- `mysite.example`が常にローカルアドレスに対して解決されることが100%確実である必要があります。そうしないと、本番環境の資格情報が漏洩する可能性があります。
- この方法では、ブラウザ間でデバッグできません🙀。

*寄稿とフィードバックに協力してくださったすべての校閲者と寄稿者、特にRyan Sleevi、Filippo Valsorda、Milica Mihajlija、Rowan Merewoodに感謝申し上げます。 🙌*

*[Unsplash](https://unsplash.com/photos/pbxwxwfI0B4)の[@anandu](https://unsplash.com/@anandu)によるヒーロー画像背景、編集済み。*
