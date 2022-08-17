---
layout: post
title: Referência rápida de cabeçalhos de segurança
subhead: Saiba mais sobre cabeçalhos que podem manter seu site seguro e procure rapidamente os detalhes mais importantes.
authors:
  - agektmr
  - maudn
  - arturjanc
date: 2021-05-18
hero: image/YLflGBAPWecgtKJLqCJHSzHqe2J2/E3BVnrBFNV6w2Uqxn3bQ.jpg
alt: Um bloqueio na frente do código compactado
description: |2

  Este artigo lista os cabeçalhos de segurança mais importantes que você pode usar para proteger

  seu site. Use-o para entender os recursos de segurança baseados na web, aprender como

  implemente-os em seu site e como referência para quando precisar de um lembrete.
tags:
  - blog
  - security
---

Este artigo lista os cabeçalhos de segurança mais importantes que você pode usar para proteger seu site. Use-o para entender os recursos de segurança baseados na web, aprender como implementá-los em seu site e como referência para quando precisar de um lembrete.

Cabeçalhos de segurança recomendados para sites que lidam com dados confidenciais do usuário:: [Política de segurança de conteúdo (CSP)](#csp) : [Tipos confiáveis](#tt)

Cabeçalhos de segurança recomendados para todos os sites: : [X-Content-Type-Options](#xcto) : [X-Frame-Options](#xfo) : [Cross-Origin Resource Policy (CORP)](#corp) : [Cross-Origin Opener Policy (COOP)](#coop) : [HTTP Strict Transport Security (HSTS)](#hsts)

Cabeçalhos de segurança para sites com recursos avançados: : [Compartilhamento de recursos de origem cruzada (CORS)](#cors): [Política de incorporação de origem cruzada (COEP)](#coep)

{% Details %} {% DetailsSummary %}

Ameaças conhecidas na Web

Antes de mergulhar nos cabeçalhos de segurança, aprenda sobre ameaças conhecidas na web e por que você deseja usar esses cabeçalhos de segurança.

{% endDetailsSummary %}

Antes de mergulhar nos cabeçalhos de segurança, aprenda sobre ameaças conhecidas na web e por que você deseja usar esses cabeçalhos de segurança.

### Proteja seu site contra vulnerabilidades de injeção

As vulnerabilidades de injeção surgem quando dados não confiáveis processados por seu aplicativo podem afetar seu comportamento e, comumente, levar à execução de scripts controlados pelo invasor. A vulnerabilidade mais comum causada por bugs de injeção é [cross-site scripting](https://portswigger.net/web-security/cross-site-scripting) (XSS) em suas várias formas, incluindo [XSS refletido](https://portswigger.net/web-security/cross-site-scripting/reflected), [XSS armazenado](https://portswigger.net/web-security/cross-site-scripting/stored), [XSS baseado em DOM](https://portswigger.net/web-security/cross-site-scripting/dom-based) e outras variantes.

Uma vulnerabilidade de XSS geralmente pode dar a um invasor acesso completo aos dados do usuário processados pelo aplicativo e a qualquer outra informação hospedada na mesma [origem da Web](/same-site-same-origin/#origin).

As defesas tradicionais contra injeções incluem o uso consistente de sistemas de modelo HTML com escape automático, evitando o uso de [APIs JavaScript perigosas](https://domgo.at/cxss/sinks) e processando adequadamente os dados do usuário hospedando uploads de arquivos em um domínio separado e higienizando o HTML controlado pelo usuário.

- Use [a Política de Segurança de Conteúdo (CSP)](#csp) para controlar quais scripts podem ser executados por seu aplicativo para reduzir o risco de injeções.
- Use [Tipos confiáveis](#tt) para impor a higienização dos dados passados para APIs JavaScript perigosas.
- Use [X-Content-Type-Options](#xcto) para evitar que o navegador interprete mal os tipos MIME dos recursos do seu site, o que pode levar à execução do script.

### Isole seu site de outros sites

A abertura da web permite que os sites interajam entre si de maneiras que podem violar as expectativas de segurança de um aplicativo. Isso inclui fazer solicitações autenticadas inesperadamente ou incorporar dados de outro aplicativo ao documento do invasor, permitindo que o invasor modifique ou leia os dados do aplicativo.

As vulnerabilidades comuns que prejudicam o isolamento da web incluem [clickjacking](https://portswigger.net/web-security/clickjacking), [falsificação de solicitação entre sites](https://portswigger.net/web-security/csrf) (CSRF), [inclusão de script intersites](https://www.scip.ch/en/?labs.20160414) (XSSI) e vários [vazamentos entre sites](https://xsleaks.dev).

- Use [X-Frame-Options](#xfo) para evitar que seus documentos sejam incorporados por um site malicioso.
- Use a [Política de Recursos de Origem Cruzada (CORP)](#corp) para evitar que os recursos do seu site sejam incluídos por um site de origem cruzada.
- Use a [Política de abertura de origem cruzada (COOP)](#coop) para proteger as janelas do seu site de interações de sites maliciosos.
- Use o [Compartilhamento de recursos de origem cruzada (CORS)](#cors) para controlar o acesso aos recursos do seu site a partir de documentos de origem cruzada.

[Post-Specter Web Development](https://www.w3.org/TR/post-spectre-webdev/) é uma ótima leitura se você estiver interessado nesses cabeçalhos.

### Crie um site poderoso com segurança

[Spectre](https://ieeexplore.ieee.org/document/8835233) coloca todos os dados carregados no mesmo [grupo de contexto de navegação](/why-coop-coep/) potencialmente legíveis, apesar [da política de mesma origem](/same-origin-policy/). Os navegadores restringem recursos que podem explorar a vulnerabilidade por trás de um ambiente especial denominado "[isolamento de origem cruzada](/coop-coep/)". Com o isolamento de origem cruzada, você pode usar recursos poderosos, como `SharedArrayBuffer`.

- Use a [Política de Embedder de Origem Cruzada (COEP)](#coep) junto com [COOP](#coop) para permitir o isolamento de origem cruzada.

### Criptografar o tráfego para seu site

Os problemas de criptografia aparecem quando um aplicativo não criptografa totalmente os dados em trânsito, permitindo que invasores interceptadores aprendam sobre as interações do usuário com o aplicativo.

A criptografia insuficiente pode surgir nos seguintes casos: não usar HTTPS, [conteúdo misto](/what-is-mixed-content/), configuração de cookies sem o [atributo `Secure`](https://developer.mozilla.org/docs/Web/HTTP/Cookies#restrict_access_to_cookies) (ou [prefixo `__Secure`](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Cookie_prefixes)) ou [lógica de validação CORS pouco segura](https://blog.detectify.com/2018/04/26/cors-misconfigurations-explained/).

- Use [HTTP Strict Transport Security (HSTS)](#hsts) para servir seu conteúdo de maneira consistente por meio de HTTPS.

{% endDetails %}

## Política de segurança de conteúdo (CSP) {: #csp}

[Cross-Site Scripting (XSS)](https://www.google.com/about/appsecurity/learning/xss/) é um ataque em que uma vulnerabilidade em um site permite que um script malicioso seja injetado e executado.

`Content-Security-Policy` fornece uma camada adicional para mitigar ataques XSS, restringindo quais scripts podem ser executados pela página.

É recomendável que você habilite o CSP estrito usando uma das seguintes abordagens:

- Se você renderizar suas páginas HTML no servidor, use **um CSP estrito baseado em nonce** .
- Se o seu HTML tiver que ser servido estaticamente ou em cache, por exemplo, se for um aplicativo de página única, use **um CSP estrito baseado em hash** .

{% Label %} Exemplo de uso: um CSP baseado em nonce {% endLabel%}

```http
Content-Security-Policy:
  script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

{% Details %} {% DetailsSummary %}

Como usar CSP

{% endDetailsSummary %}

### Usos recomendados

{% Aside %}

Um CSP pode ser uma *proteção extra* contra ataques XSS; você ainda deve se certificar de escapar (e higienizar) a entrada do usuário.

{% endAside %}

#### 1. Use um CSP estrito baseado em nonce {: #nonce-based-csp}

Se você renderizar suas páginas HTML no servidor, use **um CSP estrito baseado em nonce**.

{% Aside 'caution' %}

Um nonce é um número aleatório usado apenas uma vez. Um CSP baseado em nonce só é seguro se você puder gerar um nonce diferente para cada resposta. Se você não puder fazer isso, use [um CSP baseado](#hash-based-csp) em hash.

{% endAside %}

Gere um novo valor nonce de script para cada solicitação no lado do servidor e defina o seguinte cabeçalho:

{% Label %} arquivo de configuração do servidor {% endLabel %}

```http
Content-Security-Policy:
  script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

Em HTML, para carregar os scripts, defina o `nonce` de todas as `<script>` para a mesma string `{RANDOM1}`

{% Label %} index.html {% endLabel %}

```html
<script nonce="{RANDOM1}" src="https://example.com/script1.js"></script>
<script nonce="{RANDOM1}">
  // Inline scripts can be used with the `nonce` attribute.
</script>
```

[O Google Fotos](https://photos.google.com/) é um bom exemplo de CSP estrito baseado em nonce. Use DevTools para ver como ele é usado.

#### 2. Use um CSP estrito baseado em hash {: #hash-based-csp }

Se o seu HTML tiver que ser servido estaticamente ou em cache, por exemplo, se você estiver construindo um aplicativo de página única, use **um CSP estrito baseado em hash**.

{% Label %} arquivo de configuração do servidor {% endLabel %}

```http
Content-Security-Policy:
  script-src 'sha256-{HASH1}' 'sha256-{HASH2}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

Em HTML, você precisará embutir seus scripts para aplicar uma política baseada em hash, porque a [maioria dos navegadores não oferece suporte para scripts externos de hash](https://wpt.fyi/results/content-security-policy/script-src/script-src-sri_hash.sub.html?label=master&label=experimental&aligned).

{% Label %} index.html {% endLabel %}

```html
<script>
...// your script1, inlined
</script>
<script>
...// your script2, inlined
</script>
```

Para carregar scripts externos, leia "Carregar scripts de origem dinamicamente" na opção B: seção [Cabeçalho de resposta de CSP baseado em hash.](/strict-csp/#hash-based-csp)

[O CSP Evaluator](https://csp-evaluator.withgoogle.com/) é uma boa ferramenta para avaliar seu CSP, mas ao mesmo tempo um bom exemplo de CSP estrito baseado em nonce. Use DevTools para ver como ele é usado.

### Navegadores com suporte

Chrome, Firefox, Edge, Safari

{% Aside 'gotchas' %}

- `https:` é um substituto para o Safari e `unsafe-inline` é um substituto para versões de navegador muito antigas. `https:` e `unsafe-inline` não tornam sua política menos segura porque serão ignorados por navegadores que oferecem suporte a `strict-dynamic`. Leia mais em [Adicionar substitutos para oferecer suporte ao Safari e navegadores mais antigos](/strict-csp/#step-4:-add-fallbacks-to-support-safari-and-older-browsers).
- O Safari ainda *não* suporta `strict-dynamic`. Mas um CSP estrito como nos exemplos acima é mais seguro do que um CSP de lista de permissões (e muito mais seguro do que nenhum CSP) para todos os seus usuários. Mesmo no Safari, um CSP estrito protege seu site de alguns tipos de ataques XSS, porque a presença do CSP não permite certos padrões inseguros.

{% endAside %}

Veja[mais compatibilidades](https://developer.mozilla.org/docs/Web/HTTP/CSP#browser_compatibility).

### Outras coisas a serem observadas sobre CSP

- [`frame-ancestors`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) protege seu site contra clickjacking - um risco que surge se você permitir que sites não confiáveis incorporem o seu. Se você preferir uma solução mais simples, pode usar [`X-Frame-Options`](#xfo) para bloquear o carregamento, mas `frame-ancestors` oferecem uma configuração avançada para permitir apenas origens específicas como incorporadores.
- Você pode ter usado [um CSP para garantir que todos os recursos do seu site sejam carregados por HTTPS](/fixing-mixed-content/#content-security-policy). Isso se tornou menos relevante: hoje em dia, a maioria dos navegadores bloqueia [conteúdo misto](/what-is-mixed-content/).
- Você também pode definir um CSP no [modo somente relatório](/strict-csp/#step-2:-set-a-strict-csp-and-prepare-your-scripts).
- Se você não pode definir um CSP como um cabeçalho do lado do servidor, você também pode defini-lo como uma metatag. Observe que você não pode usar o **modo somente relatório** para metatags (embora [isso possa mudar](https://github.com/w3c/webappsec-csp/issues/277)).

### Saber mais

- [Mitigar XSS com uma Política de Segurança de Conteúdo Estrita (CSP)](/strict-csp)
- [Folha de referências da política de segurança de conteúdo](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

{% endDetails %}

## Tipos confiáveis {: #tt}

[O XSS baseado em DOM](https://portswigger.net/web-security/cross-site-scripting/dom-based) é um ataque em que dados maliciosos são passados para um coletor que oferece suporte à execução de código dinâmico, como `eval()` ou `.innerHTML`.

Tipos confiáveis fornecem as ferramentas para escrever, revisar a segurança e manter aplicativos livres de DOM XSS. Eles podem ser ativados via [CSP](#csp) e tornar o código JavaScript seguro por padrão, limitando APIs da web perigosas para aceitar apenas um objeto especial - um tipo confiável.

Para criar esses objetos, você pode definir políticas de segurança nas quais pode garantir que as regras de segurança (como escape ou sanitização) sejam aplicadas de forma consistente antes que os dados sejam gravados no DOM. Essas políticas são, então, os únicos lugares no código que podem potencialmente introduzir o DOM XSS.

{% Label %} Exemplos de uso {% endLabel %}

```http
Content-Security-Policy: require-trusted-types-for 'script'
```

```javascript
// Feature detection
if (window.trustedTypes && trustedTypes.createPolicy) {
  // Name and create a policy
  const policy = trustedTypes.createPolicy('escapePolicy', {
    createHTML: str => {
      return str.replace(/\</g, '<').replace(/>/g, '>');
    }
  });
}
```

```javascript
// Assignment of raw strings is blocked by Trusted Types.
el.innerHTML = 'some string'; // This throws an exception.

// Assignment of Trusted Types is accepted safely.
const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
el.innerHTML = escaped;  // '<img src=x onerror=alert(1)>'
```

{% Details %} {% DetailsSummary %}

Como usar tipos confiáveis

{% endDetailsSummary %}

### Usos recomendados

1. Aplicar tipos confiáveis para coletores DOM perigosos {% Label %} CSP e cabeçalho de tipos confiáveis: {% endLabel %}

    ```http
    Content-Security-Policy: require-trusted-types-for 'script'
    ```

    Atualmente, `'script'` é o único valor aceitável para a diretiva `require-trusted-types-for`

    Claro, você pode combinar Tipos confiáveis com outras diretivas CSP:

    {% Label %} Mesclando um CSP baseado em nonce de cima com tipos confiáveis: {% endLabel %}

    ```http
    Content-Security-Policy:
      script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
      object-src 'none';
      base-uri 'none';
      require-trusted-types-for 'script';
    ```

    {% Aside %}

    Você pode limitar os nomes de política de Tipos confiáveis permitidos definindo uma `trusted-types` (por exemplo, `trusted-types myPolicy`). No entanto, isso não é um requisito.

    {% endAside %}

2. Defina uma política

    Política do {% Label %}: {% endLabel %}

    ```javascript
    // Feature detection
    if (window.trustedTypes && trustedTypes.createPolicy) {
      // Name and create a policy
      const policy = trustedTypes.createPolicy('escapePolicy', {
        createHTML: str => {
          return str.replace(/\</g, '&lt;').replace(/>/g, '&gt;');
        }
      });
    }
    ```

    {% Aside %}

    Você pode definir políticas com nomes arbitrários, a menos que limite os nomes das políticas de Tipos confiáveis permitidos definindo a diretiva de `trusted-types`

    {% endAside %}

3. Aplicar a política

    {% Label %} Use a política ao gravar dados no DOM: {% endLabel %}

    ```javascript
    // Assignment of raw strings are blocked by Trusted Types.
    el.innerHTML = 'some string'; // This throws an exception.

    // Assignment of Trusted Types is accepted safely.
    const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
    el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)&gt;'
    ```

    Com `require-trusted-types-for 'script'`, usar um tipo confiável é um requisito. Usar qualquer API DOM perigosa com uma string resultará em um erro.

### Navegadores com suporte

Chrome, Edge

Veja [mais compatibilidades](https://caniuse.com/?search=trusted%20types).

### Saber mais

- [Evite vulnerabilidades de cross-site scripting baseadas em DOM com Tipos confiáveis](/trusted-types/)
- [CSP: requerem tipos confiáveis para - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for)
- [CSP: tipos confiáveis - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types)
- [Demonstração de Tipos confiáveis -](https://www.compass-demo.com/trusted-types/) abra o DevTools Inspector e veja o que está acontecendo

{% endDetails %}

## X-Content-Type-Options {: #xcto}

Quando um documento HTML malicioso é veiculado em seu domínio (por exemplo, se uma imagem carregada em um serviço de fotos contém marcação HTML válida), alguns navegadores o tratam como um documento ativo e permitem que ele execute scripts no contexto do aplicativo, levando a um [bug de script entre sites](https://www.google.com/about/appsecurity/learning/xss/).

`X-Content-Type-Options: nosniff` evita isso instruindo o navegador de que o [tipo MIME](https://mimesniff.spec.whatwg.org/#introduction) definido no `Content-Type` para uma determinada resposta está correto. Este cabeçalho é recomendado para **todos os seus recursos**.

{% Label %} Exemplo de uso {% endLabel%}

```http
X-Content-Type-Options: nosniff
```

{% Details %} {% DetailsSummary %}

Como usar X-Content-Type-Options

{% endDetailsSummary %}

### Usos recomendados

`X-Content-Type-Options: nosniff` é recomendado para todos os recursos servidos pelo seu servidor junto com o cabeçalho `Content-Type`

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/IWqRWe9R1mOJImmMbLoM.png", alt="X-Content-Type-Options: nosniff", width="800", height="237" %}

{% Label %} Cabeçalhos de exemplo enviados com um documento HTML {% endLabel %}

```http
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
```

### Navegadores com suporte

Chrome, Firefox, Safari, Edge

Veja [mais compatibilidades](https://caniuse.com/mdn-http_headers_x-content-type-options).

### Saber mais

- [X-Content-Type-Options - HTTP MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options)

{% endDetails %}

## Opções de X-Frame {: #xfo}

Se um site malicioso puder incorporar seu site como um iframe, isso pode permitir que os invasores invoquem ações não intencionais do usuário com [clickjacking](https://portswigger.net/web-security/clickjacking). Além disso, em alguns casos, os [ataques do tipo Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)) dão a sites mal-intencionados a chance de aprender sobre o conteúdo de um documento incorporado.

`X-Frame-Options` indica se um navegador deve ter ou não permissão para renderizar uma página em um `<frame>`, `<iframe>`, `<embed>` ou `<object>`. **Todos os documentos** são recomendados para enviar este cabeçalho para indicar se eles permitem ser incorporados por outros documentos.

{% Aside %}

Se você precisar de um controle mais granular, como permitir que apenas uma origem específica incorpore o documento, use a diretiva de [`frame-ancestors`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) [CSP.](#csp)

{% endAside %}

{% Label %} Exemplo de uso {% endLabel%}

```http
X-Frame-Options: DENY
```

{% Details %} {% DetailsSummary %}

Como usar as opções do X-Frame

{% endDetailsSummary %}

### Usos recomendados

Todos os documentos que não foram projetados para serem incorporados devem usar o cabeçalho `X-Frame-Options`

Você pode experimentar como as configurações a seguir afetam o carregamento de um iframe [nesta demonstração](https://cross-origin-isolation.glitch.me/). Altere o `X-Frame-Options` e clique no botão **Recarregar o iframe**.

#### Protege o seu site de ser incorporado por qualquer outro site

Negar ser incorporado por qualquer outro documento.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/2ZM5obgGK38CMcZ75PkH.png", alt="X-Frame-Options: DENY", width="800", height="237" %}

```http
X-Frame-Options: DENY
```

#### Protege seu site de ser incorporado por qualquer site de origem cruzada

Permitir a incorporação apenas por documentos da mesma origem.

```http
X-Frame-Options: SAMEORIGIN
```

{% Aside 'gotchas' %}

Documentos sendo incorporados por padrão significa que os desenvolvedores da web precisam enviar explicitamente `DENY` ou `SAMEORIGIN` para parar de serem incorporados e se protegerem de ataques de canal lateral. A equipe do Chrome está considerando a possibilidade de bloquear a incorporação de documentos por padrão, para que os sites sejam seguros, mesmo que não definam explicitamente o cabeçalho. Nesse novo mundo, os documentos precisariam optar explicitamente por serem incorporados.

{% endAside %}

### Navegadores com suporte

Chrome, Firefox, Safari, Edge

Veja [mais compatibilidades](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options#browser_compatibility).

### Saber mais

- [Opções de X-Frame - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options)

{% endDetails %}

## Política de recursos de origem cruzada (CORP) {: #corp}

Um invasor pode incorporar recursos de outra origem, por exemplo, do seu site, para obter informações sobre eles, explorando [vazamentos entre sites](https://xsleaks.dev/) baseados na web.

`Cross-Origin-Resource-Policy` mitiga esse risco, indicando o conjunto de sites pelos quais ele pode ser carregado. O cabeçalho assume um de três valores: `same-origin`, `same-site` e `cross-origin`. **Todos os recursos** são recomendados para enviar este cabeçalho para indicar se eles permitem ser carregados por outros sites.

{% Label %} Exemplo de uso {% endLabel%}

```http
Cross-Origin-Resource-Policy: same-origin
```

{% Details %} {% DetailsSummary %}

Como usar o CORP

{% endDetailsSummary %}

### Usos recomendados

É recomendável que **todos os** recursos sejam servidos com um dos três cabeçalhos a seguir.

Você pode experimentar como as configurações a seguir afetam o carregamento de recursos em um ambiente [`Cross-Origin-Embedder-Policy: require-corp`](#coep) [nesta demonstração](https://cross-origin-isolation.glitch.me/?coep=require-corp&). Altere o **menu suspenso Cross-Origin-Resource-Policy** e clique no botão **Recarregar o iframe** ou **Recarregar a imagem** para ver o efeito.

#### Permitir que recursos sejam carregados `cross-origin`

Recomenda-se que os serviços do tipo CDN apliquem `cross-origin` aos recursos (uma vez que geralmente são carregados por páginas de origem cruzada), a menos que já sejam servidos por meio do [CORS,](#cors) que tem um efeito semelhante.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/qP2mspVMC6RazxDjWUrL.png", alt="Cross-Origin-Resource-Policy: cross-origin", width="800", height="234" %}

```http
Cross-Origin-Resource-Policy: cross-origin
```

#### Limite os recursos a serem carregados da `same-origin`

`same-origin` deve ser aplicada a recursos que devem ser carregados apenas por páginas da mesma origem. Você deve aplicar isso a recursos que incluem informações confidenciais sobre o usuário ou respostas de uma API que se destina a ser chamada apenas da mesma origem.

Lembre-se de que os recursos com este cabeçalho ainda podem ser carregados diretamente, por exemplo, navegando para o URL em uma nova janela do navegador. A Política de Recursos de Origem Cruzada protege apenas o recurso de ser incorporado por outros sites.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/7UzYMWsbKkh89m5ZImvj.png", alt="Cross-Origin-Resource-Policy: same-origin", width="800", height="238" %}

```http
Cross-Origin-Resource-Policy: same-origin
```

#### Limite os recursos a serem carregados do `same-site`

`same-site` é recomendado para ser aplicado a recursos semelhantes aos anteriores, mas que devem ser carregados por outros subdomínios de seu site.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/R9yNRGSJ4xABc560WRJI.png", alt="Cross-Origin-Resource-Policy: same-site", width="800", height="233" %}

```http
Cross-Origin-Resource-Policy: same-site
```

{% Aside %}

Para saber mais sobre a diferença entre mesma origem e mesmo site, consulte [Noções básicas sobre "mesmo site" e "mesma origem"](/same-site-same-origin/).

{% endAside %}

### Navegadores compatíveis

Chrome, Firefox, Safari, Edge

Veja [mais compatibilidades](https://caniuse.com/mdn-http_headers_cross-origin-resource-policy).

### Saber mais

- [Considere a implantação de política de recursos de origem cruzada](https://resourcepolicy.fyi/)
- [Tornar seu site "de origem cruzada isolado" usando COOP e COEP](/coop-coep/)
- [Por que você precisa de "origem cruzada isolada" para recursos poderosos](/why-coop-coep/)

{% endDetails %}

## Política de abertura de origem cruzada (COOP) {: #coop}

O site de um invasor pode abrir outro site em uma janela pop-up para obter informações sobre ele, explorando [vazamentos entre sites](https://xsleaks.dev/) baseados na web. Em alguns casos, isso também pode permitir a exploração de ataques de canal lateral baseados em [Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)).

O `Cross-Origin-Opener-Policy` fornece uma maneira para um documento se isolar de janelas de origem cruzada abertas por `window.open()` ou um link com `target="_blank"` sem `rel="noopener"`. Como resultado, qualquer recursos de abertura de origem cruzada do documento não terá nenhuma referência a ele e não será capaz de interagir com ele.

{% Label %} Exemplo de uso {% endLabel%}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

{% Details %} {% DetailsSummary %}

Como usar o COOP

{% endDetailsSummary %}

### Usos recomendados

Você pode tentar como as configurações a seguir afetam a comunicação com uma janela pop-up de origem cruzada [nesta demonstração](https://cross-origin-isolation.glitch.me/). Altere o **menu suspenso Cross-Origin-Opener-Policy** para o documento e a janela pop-up, clique no botão **Abrir um pop-up** e, em seguida, clique em **Enviar uma postMessage** para confirmar se a mensagem foi realmente entregue.

#### Isole um documento de janelas de origem cruzada

Definir a `same-origin` isola o documento das janelas de documentos de origem cruzada.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/mSDG9auD7r5asxGJvJjg.png", alt="Cross-Origin-Opener-Policy: same-origin", width="800", height="235" %}

```http
Cross-Origin-Opener-Policy: same-origin
```

#### Isola um documento de janelas de origem cruzada, mas permite pop-ups

Definir `same-origin-allow-popups` permite que um documento retenha uma referência a suas janelas pop-up, a menos que eles definam COOP como `same-origin` ou `same-origin-allow-popups`. Isso significa que `same-origin-allow-popups` ainda pode proteger o documento de ser referenciado quando aberto como uma janela pop-up, mas permite que ele se comunique com seus próprios pop-ups.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/2uJZ0s2VnjxJUcBI2Ol9.png", alt="Cross-Origin-Opener-Policy: same-origin-allow-popups", width="800", height="233" %}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

#### Permitir que um documento seja referenciado por janelas de origem cruzada

`unsafe-none` é o valor padrão, mas você pode indicar explicitamente que este documento pode ser aberto por uma janela de origem cruzada e manter o acesso mútuo.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/oSco89ZT3RP7gZzNKDjY.png", alt="Cross-Origin-Opener-Policy: unsafe-none", width="800", height="233" %}

{% Aside 'gotchas' %}

`unsafe-none` sendo o padrão significa que os desenvolvedores da web precisam enviar `same-origin-allow-popups` `same-origin` ou mesma origem explicitamente para proteger seu site de ataques de canal lateral.

{% endAside %}

```http
Cross-Origin-Opener-Policy: unsafe-none
```

{% Aside %}

Recursos como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()` ou [JS Self Profiling API](https://wicg.github.io/js-self-profiling/) são desabilitados por padrão. Alguns navegadores permitem que você os use em contextos de "origem cruzada isolada", que exigem que você defina os cabeçalhos [COOP](#coop) e [COEP.](#coep)

Para saber mais, leia [Como deixar seu site "isolado de origem cruzada" usando COOP e COEP](/coop-coep/).

{% endAside %}

#### Padrões de relatório incompatíveis com COOP

Você pode receber relatórios quando o COOP impede interações entre janelas com a API de relatórios.

```http
Cross-Origin-Opener-Policy: same-origin; report-to="coop"
```

O COOP também oferece suporte a um modo somente relatório para que você possa receber relatórios sem realmente bloquear a comunicação entre documentos de origem cruzada.

```http
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="coop"
```

### Navegadores compatíveis

Chrome, Firefox, Edge

Veja [mais compatibilidades](https://caniuse.com/mdn-http_headers_cross-origin-opener-policy).

### Saber mais

- [Por que você precisa de "origem cruzada isolada" para recursos poderosos](/why-coop-coep/)

{% endDetails %}

## Compartilhamento de recursos de origem cruzada (CORS) {: #cors}

Ao contrário de outros itens neste artigo, Cross-Origin Resource Sharing (CORS) não é um cabeçalho, mas um mecanismo de navegador que solicita e permite o acesso a recursos de origem cruzada.

Por padrão, os navegadores impõem [a política de mesma origem](/same-origin-policy/) para evitar que uma página da web acesse recursos de origem cruzada. Por exemplo, quando uma imagem de origem cruzada é carregada, mesmo que seja exibida na página da web visualmente, o JavaScript na página não tem acesso aos dados da imagem. O provedor de recursos pode relaxar as restrições e permitir que outros sites leiam o recurso optando pelo CORS.

{% Label %} Exemplo de uso {% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

{% Details %} {% DetailsSummary %}

Como usar o CORS

{% endDetailsSummary %}

Antes de examinar como configurar o CORS, é útil entender a distinção entre os tipos de solicitação. Dependendo dos detalhes do pedido, um pedido será classificado como um **pedido simples** ou um **pedido preflight**.

Critérios para um pedido simples:

- O método é `GET`, `HEAD` ou `POST`.
- Os cabeçalhos personalizados incluem apenas `Accept`, `Accept-Language`, `Content-Language` e `Content-Type`.
- O `Content-Type` é `application/x-www-form-urlencoded`, `multipart/form-data` ou `text/plain`.

Todo o resto é classificado como uma solicitação preflight. Para obter mais detalhes, consulte [Compartilhamento de recursos entre origens (CORS) - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS#simple_requests).

### Usos recomendados

#### Solicitação simples

Quando uma solicitação atende aos critérios de solicitação simples, o navegador envia uma solicitação de origem cruzada com um `Origin` que indica a origem da solicitação.

{% Label %} Exemplo de cabeçalho de solicitação {% endLabel %}

```http
Get / HTTP/1.1
Origin: https://example.com
```

{% Label %} Exemplo de cabeçalho de resposta {% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

- `Access-Control-Allow-Origin: https://example.com` indica que `https://example.com` pode acessar o conteúdo da resposta. Os recursos que devem ser lidos por qualquer site podem definir esse cabeçalho como `*`, caso em que o navegador exigirá apenas que a solicitação seja feita [sem credenciais](https://developer.mozilla.org/docs/Web/API/Request/credentials#value).
- `Access-Control-Allow-Credentials: true` indica que as solicitações que carregam credenciais (cookies) têm permissão para carregar o recurso. Caso contrário, as solicitações autenticadas serão rejeitadas mesmo se a origem da solicitação estiver presente no cabeçalho `Access-Control-Allow-Origin`

Você pode experimentar como a solicitação simples afeta o carregamento de recursos em um ambiente [`Cross-Origin-Embedder-Policy: require-corp`](#coep) [nesta demonstração](https://cross-origin-isolation.glitch.me/?coep=require-corp&). Clique na **caixa de seleção Compartilhamento de recursos de origem cruzada** e clique no botão **Recarregar a imagem** para ver o efeito.

#### Solicitações comprovadas

Uma solicitação preflight é precedida de uma `OPTIONS` para verificar se a solicitação subsequente pode ser enviada.

{% Label %} Exemplo de cabeçalho de solicitação {% endLabel %}

```http
OPTIONS / HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

- `Access-Control-Request-Method: POST` permite que a seguinte solicitação seja feita com o método `POST`
- `Access-Control-Request-Headers: X-PINGOTHER, Content-Type` permite que o solicitante defina os `X-PINGOTHER` e `Content-Type` na solicitação subsequente.

{% Label %} Cabeçalhos de resposta de exemplo {% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

- `Access-Control-Allow-Methods: POST, GET, OPTIONS` indica que as solicitações subsequentes podem ser feitas com os métodos `POST`, `GET` e `OPTIONS`
- `Access-Control-Allow-Headers: X-PINGOTHER, Content-Type` indica que as solicitações subsequentes podem incluir os cabeçalhos `X-PINGOTHER` e `Content-Type`
- `Access-Control-Max-Age: 86400` indica que o resultado da solicitação preflight pode ser armazenado em cache por 86400 segundos.

### Navegadores compatíveis

Chrome, Firefox, Safari, Edge

Veja [mais compatibilidades](https://caniuse.com/mdn-http_headers_content-length_cors_response_safelist).

### Saber mais

- [Compartilhamento de recursos de origem cruzada (CORS)](/cross-origin-resource-sharing/)
- [Compartilhamento de recursos de origem cruzada (CORS) - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS)

{% endDetails %}

## Política de incorporação de origem cruzada (COEP) {: #coep}

Para reduzir a capacidade dos [ataques baseados em Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)) para roubar recursos de origem cruzada, recursos como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()` ou [API JS Self Profiling](https://wicg.github.io/js-self-profiling/) são desabilitados por padrão.

`Cross-Origin-Embedder-Policy: require-corp` impede que documentos e workers carreguem recursos de origem cruzada, como imagens, scripts, folhas de estilo, iframes e outros, a menos que esses recursos optem explicitamente por serem carregados por meio de cabeçalhos [CORS](#cors) ou [CORP.](#corp) O COEP pode ser combinado com `Cross-Origin-Opener-Policy` para permitir que um documento seja [isolado de origem cruzada](/cross-origin-isolation-guide/).

Use `Cross-Origin-Embedder-Policy: require-corp` quando quiser habilitar [o isolamento de origem cruzada](/coop-coep/) para o seu documento.

{% Label %} Exemplo de uso {% endLabel %}

```http
Cross-Origin-Embedder-Policy: require-corp
```

{% Details %} {% DetailsSummary %}

Como usar o COEP

{% endDetailsSummary %}

### Exemplos de uso

COEP assume um único valor de `require-corp`. Ao enviar esse cabeçalho, você pode instruir o navegador a bloquear o carregamento de recursos que não optem por meio de [CORS](#cors) ou [CORP](#corp).

{% Img src="image/admin/MAhaVZdShm8tRntWieU4.png", alt="Como a COEP funciona", width="800", height="410" %}

Você pode experimentar como as configurações a seguir afetam o carregamento de recursos [nesta demonstração](https://cross-origin-isolation.glitch.me/). Altere o menu suspenso **Cross-Origin-Embedder-Policy**, o menu suspenso **Cross-Origin-Resource-Policy**, a caixa de seleção **Apenas relatório** e afins para ver como eles afetam o carregamento de recursos. Além disso, abra [a demonstração do endpoint de relatório](https://reporting-endpoint.glitch.me/) para ver se os recursos bloqueados são relatados.

#### Ativar isolamento de origem cruzada

Habilite [o isolamento de origem](/coop-coep) cruzada enviando `Cross-Origin-Embedder-Policy: require-corp` junto com `Cross-Origin-Opener-Policy: same-origin`.

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

#### Reportar recursos incompatíveis com o COEP

Você pode receber relatórios de recursos bloqueados causados pelo COEP com a API de relatórios.

```http
Cross-Origin-Embedder-Policy: require-corp; report-to="coep"
```

O COEP também oferece suporte ao modo somente relatório para que você possa receber relatórios sem realmente bloquear os recursos de carregamento.

```http
Cross-Origin-Embedder-Policy-Report-Only: require-corp; report-to="coep"
```

### Navegadores compatíveis

Chrome, Firefox, Edge

Veja [mais compatibilidades](https://caniuse.com/mdn-http_headers_cross-origin-embedder-policy).

### Saber mais

- [Como deixar seu site "de origem cruzada isolado" usando COOP e COEP](/coop-coep/)
- [Por que você precisa de "origem cruzada isolada" para recursos poderosos](/why-coop-coep/)
- [Um guia para permitir o isolamento de origem cruzada](/cross-origin-isolation-guide/)

{% endDetails %}

## Segurança de transporte estrita HTTP (HSTS) {: #hsts}

A comunicação em uma conexão HTTP simples não é criptografada, tornando os dados transferidos acessíveis para bisbilhoteiros no nível da rede.

`Strict-Transport-Security` informa ao navegador que ele nunca deve carregar o site usando HTTP e, em vez disso, usar HTTPS. Depois de definido, o navegador usará HTTPS em vez de HTTP para acessar o domínio sem um redirecionamento por um período definido no cabeçalho.

{% Label %} Exemplo de uso {% endLabel%}

```http
Strict-Transport-Security: max-age=31536000
```

{% Details %} {% DetailsSummary %}

Como usar HSTS

{% endDetailsSummary %}

### Usos recomendados

Todos os sites que fazem a transição de HTTP para HTTPS devem responder com um `Strict-Transport-Security` quando uma solicitação com HTTP é recebida.

```http
Strict-Transport-Security: max-age=31536000
```

### Navegadores compatíveis

Chrome, Firefox, Safari, Edge

Veja [mais compatibilidades](https://caniuse.com/stricttransportsecurity).

### Saber mais

- [Strict-Transport-Security - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)

{% endDetails %}

## Leitura adicional

- [Desenvolvimento Web Pós-Spectre](https://www.w3.org/TR/post-spectre-webdev/)
