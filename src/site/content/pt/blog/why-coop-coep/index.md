---
title: Por que você precisa de "origem cruzada isolada" para recursos eficientes
subhead: |2-

  Aprenda por que o isolamento de origem cruzada é necessário para usar recursos eficientes, como
  `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory ()` e alto
  timer de resolução com melhor precisão.
description: |2-

  Algumas APIs da Web aumentam o risco de ataques de canal lateral, como o Spectre. Para
  diminuir esse risco, os navegadores oferecem um ambiente isolado baseado em opt-in chamado
  origem cruzada isolada. Aprenda por que o isolamento de origem cruzada é necessário para usar
  recursos eficientes como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory ()`
  e timer de alta resolução com melhor precisão.
authors:
  - agektmr
  - domenic
hero: image/admin/h8g1TQjkfkJSpWJrPakB.jpg
date: 2020-05-04
updated: 2021-08-05
tags:
  - blog
  - security
feedback:
  - api
---

## Introdução

Em [Como deixar seu site "isolado de origem cruzada" usando COOP e COEP](/coop-coep/), explicamos como adotar o estado de "origem cruzada isolada" usando COOP e COEP. Este é um artigo complementar que explica por que o isolamento de origem cruzada é necessário para habilitar recursos eficientes no navegador.

{% Aside 'key-term' %} Este artigo usa muitas terminologias que parecem semelhantes. Para tornar as coisas mais claras, vamos defini-las:

- [COEP: Política de integrador de origem cruzada](https://wicg.github.io/cross-origin-embedder-policy/)
- [COOP: Política de abertura de origem cruzada](https://github.com/whatwg/html/pull/5334/files)
- [CORP: Política de recursos de origem cruzada](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
- [CORS: Compartilhamento de recursos de origem cruzada](https://developer.mozilla.org/docs/Web/HTTP/CORS)
- [CORB: Bloqueio de leitura de origem cruzada](https://www.chromium.org/Home/chromium-security/corb-for-developers) {% endAside %}

## Histórico

A Internet é construída com base na [política de mesma origem](/same-origin-policy/): um recurso de segurança que restringe como documentos e scripts podem interagir com recursos de outra origem. Este princípio restringe as maneiras como os sites podem acessar recursos de origem cruzada. Por exemplo: um documento de `https://a.example` é impedido de acessar dados hospedados em `https://b.example`.

No entanto, a política de mesma origem teve algumas exceções históricas. Qualquer site pode:

- Incorporar iframes de origem cruzada
- Inclui recursos de origem cruzada, como imagens ou scripts
- Abra janelas pop-up de origem cruzada com uma referência DOM

Se a Internet pudesse ser projetada do zero, essas exceções não existiriam. Infelizmente, quando a comunidade da Web percebeu os principais benefícios de uma política estrita de mesma origem, ela já estava contando com essas exceções.

Os efeitos colaterais de segurança de uma política de mesma origem tão insegura foram corrigidos de duas maneiras. Uma das formas foi a introdução de um novo protocolo denominado [Cross Origin Resource Sharing (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS), ou compartilhamento de recursos de origem cruzada, cuja finalidade é garantir que o servidor permita compartilhar um recurso com uma determinada origem. A outra maneira é removendo implicitamente o acesso direto do script a recursos de origem cruzada, preservando a compatibilidade com versões anteriores. Esses recursos de origem cruzada são chamados de recursos "opacos". Por exemplo, é por isso que a manipulação dos pixels de uma imagem de origem cruzada por meio do `CanvasRenderingContext2D` falha, a menos que o CORS seja aplicado à imagem.

Todas essas decisões de política estão acontecendo dentro de um grupo de contexto de navegação.

{% Img src="image/admin/z1Gr4mmJMo383dR9FQUk.png", alt="Grupo de contexto de navegação", width="800", height="469" %}

Por muito tempo, a combinação de CORS e recursos opacos foi suficiente para tornar os navegadores seguros. Às vezes, casos extremos (como [vulnerabilidades de JSON](https://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/)) eram descobertos e precisavam ser corrigidos, mas no geral o princípio de não permitir acesso de leitura direto aos bytes brutos de recursos de origem cruzada foi bem-sucedido.

Tudo isso mudou com o [Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)), que torna potencialmente legíveis quaisquer dados carregados no mesmo grupo de contexto de navegação que seu código. Ao medir o tempo que certas operações levam, os invasores podem adivinhar o conteúdo dos caches da CPU e, por meio disso, o conteúdo da memória do processo. Esses ataques de tempo são possíveis com timers de baixa granularidade que existem na plataforma, mas podem ser acelerados com timers de alta granularidade, tanto explícitos (como `performance.now()`) e implícitos (como `SharedArrayBuffer`s). Se o `evil.com` incorpora uma imagem de origem cruzada, eles podem usar um ataque Spectre para ler seus dados de pixel, o que torna as proteções baseadas em "opacidade" ineficazes.

{% Img src="image/admin/wN636enwMtBrrOfhzEoq.png", alt="Spectr", width="800", height="500" %}

O ideal é que todas as solicitações de origem cruzada sejam examinadas explicitamente pelo servidor que possui o recurso. Se a verificação não for fornecida pelo servidor proprietário do recurso, os dados nunca chegarão ao grupo de contexto de navegação de um agente maligno e, portanto, ficarão fora do alcance de qualquer ataque de Espectro que uma página da web possa realizar. Nós o chamamos de estado isolado de origem cruzada. É exatamente disso que trata o COOP + COEP.

Em um estado isolado de origem cruzada, o site solicitante é considerado menos perigoso e isso desbloqueia recursos poderosos, como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()` e [timers de alta resolução](https://www.w3.org/TR/hr-time/) com melhor precisão que poderiam ser usados para ataques do tipo Espectro. Também evita a modificação de `document.domain`.

### Política de incorporação de origens cruzadas {: #coep}

A [Política de integração de origem cruzada (COEP)](https://wicg.github.io/cross-origin-embedder-policy/) evita que um documento carregue quaisquer recursos de origem cruzada que não concedam explicitamente a permissão do documento (usando CORP ou CORS). Com este recurso, você pode declarar que um documento não pode carregar tais recursos.

{% Img src="image/admin/MAhaVZdShm8tRntWieU4.png", alt="Como a COEP funciona", width="800", height="410" %}

Para ativar esta política, anexe o seguinte cabeçalho HTTP ao documento:

```http
Cross-Origin-Embedder-Policy: require-corp
```

A `require-corp` é o único valor aceito para COEP. Isso impõe a política de que o documento só pode carregar recursos da mesma origem ou recursos marcados explicitamente como carregáveis de outra origem.

Para que os recursos possam ser carregados de outra origem, eles precisam suportar o Compartilhamento de recursos de origem cruzada (CORS) ou a Política de recursos de origem cruzada (CORP).

### Compartilhamento de recursos de origem cruzada {: #cors}

Se um recurso de origem cruzada suportar [Compartilhamento de recursos de origem cruzada (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS), você pode usar o [atributo `crossorigin`](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin) para carregá-lo em sua página da web sem ser bloqueado pelo COEP.

```html
<img src="https://third-party.example.com/image.jpg" crossorigin>
```

Por exemplo, se este recurso de imagem for servido com cabeçalhos CORS, use o `crossorigin` para que a solicitação para buscar o recurso use o [modo CORS](https://developer.mozilla.org/docs/Web/API/Request/mode). Isso também evita que a imagem seja carregada, a menos que defina os cabeçalhos CORS.

Da mesma forma, você pode buscar dados de origem cruzada por meio de `fetch()`, que não requer tratamento especial, desde que o servidor responda com [os cabeçalhos HTTP corretos](https://developer.mozilla.org/docs/Web/HTTP/CORS#The_HTTP_response_headers).

### Política de recursos de origem cruzada {: #corp}

A [Política de Recursos de Origem Cruzada (CORP)](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP)) foi originalmente introduzida como uma opção para proteger seus recursos de serem carregados por outra origem. No contexto do COEP, o CORP pode especificar a política do proprietário do recurso para quem pode carregar um recurso.

O cabeçalho `Cross-Origin-Resource-Policy` recebe três valores possíveis:

```http
Cross-Origin-Resource-Policy: same-site
```

Os recursos marcados como `same-site` só podem ser carregados do mesmo site.

```http
Cross-Origin-Resource-Policy: same-origin
```

Os recursos marcados com a `same-origin` só podem ser carregados da mesma origem.

```http
Cross-Origin-Resource-Policy: cross-origin
```

Os recursos marcados `cross-origin` podem ser carregados por qualquer site. ([Este valor](https://mikewest.github.io/corpp/#integration-fetch) foi adicionado à especificação CORP junto com COEP.)

{% Aside %} Depois de adicionar o cabeçalho COEP, não será possível contornar a restrição usando service workers. Se o documento for protegido por um cabeçalho COEP, a política será respeitada antes que a resposta entre no processo do documento ou antes de entrar no service worker que está controlando o documento. {% endAside %}

### Política de abertura de origem cruzada {: #coop}

A [Política de abertura de origem cruzada (COOP)](https://github.com/whatwg/html/pull/5334/files) permite que você garanta que uma janela de nível superior seja isolada de outros documentos, colocando-os em um grupo de contexto de navegação diferente, de forma que não possam interagir diretamente com a janela de nível superior. Por exemplo, se um documento com COOP abrir um pop-up, sua propriedade `window.opener` `null`. Além disso, a `.closed` da referência do abridor a ela retornará `true`.

{% Img src="image/admin/eUu74n3GIlK1fj9ACxF8.png", alt="COOP", width="800", height="452" %}

O cabeçalho `Cross-Origin-Opener-Policy` recebe três valores possíveis:

```http
Cross-Origin-Opener-Policy: same-origin
```

Os documentos marcados com a `same-origin` podem compartilhar o mesmo grupo de contexto de navegação com documentos com a mesma origem que também são marcados explicitamente com a `same-origin`.

{% Img src="image/admin/he8FaRE2ef67lamrFG60.png", alt="COOP", width="800", height="507" %}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

Um documento de nível superior com `same-origin-allow-popups` retém referências a qualquer um de seus pop-ups que não definem COOP ou que optam pelo isolamento definindo um COOP de `unsafe-none`.

{% Img src="image/admin/AJdm6vFq4fQXUWOTFeFa.png", alt="COOP", width="800", height="537" %}

```http
Cross-Origin-Opener-Policy: unsafe-none
```

`unsafe-none` é o padrão e permite que o documento seja adicionado ao grupo de contexto de navegação de seu abridor, a menos que o próprio abridor tenha um COOP da `same-origin`.

{% Aside %} O [`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#Window_features) tem um efeito semelhante ao que você esperaria do COOP, exceto que funciona apenas no lado do abridor. (Você não pode desassociar sua janela quando ela é aberta por terceiros.) Quando você anexa `noopener` fazendo algo como `window.open(url, '_blank', 'noopener')` ou `<a target="_blank" rel="noopener">`, você pode desassociar deliberadamente sua janela da janela aberta.

Embora `noopener` possa ser substituído por COOP, ele ainda é útil quando você deseja proteger seu site em navegadores que não oferecem suporte a COOP. {% endAside %}

## Resumo {: #summary}

Se você quiser garantia de acesso a recursos poderosos como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()` ou [timers de alta resolução](https://www.w3.org/TR/hr-time/) com melhor precisão, basta lembrar que seu documento precisa usar COEP com o valor de `require-corp` e COOP com o valor de `same-origin`. Na ausência de qualquer um deles, o navegador não garantirá isolamento suficiente para ativar com segurança esses recursos poderosos. Você pode determinar a situação da sua página verificando se [`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated) retorna `true`.

Aprenda as etapas para implementar isso em [Como deixar seu site "isolado de origem cruzada" usando COOP e COEP](/coop-coep/).

## Recursos

- [COOP e COEP explicados](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit)
- [Mudanças planejadas na memória compartilhada - JavaScript | MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes)
