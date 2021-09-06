---
title: Melhorando a privacidade do usuário e a experiência do desenvolvedor com User-Agent Client Hints
subhead: |-
  User-Agent Client Hints são uma nova expansão da API Client Hints, que
  permite que os desenvolvedores acessem informações (dicas) sobre o navegador de um usuário de forma ergonômica e preservando sua privacidade.
authors:
  - rowan_m
  - yoavweiss
date: 2020-06-25
updated: 2021-02-12
hero: image/admin/xlg4t3uiTp0L5TBThFHQ.jpg
thumbnail: image/admin/hgxRNa56Vb9o3QRwIrm9.jpg
alt: Uma variedade de pegadas na neve. Uma dica de quem esteve lá.
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% YouTube 'f0YY0o2OAKA' %}

As Client Hints (dicas do cliente) permitem que os desenvolvedores solicitem informações sobre o dispositivo ou as condições do usuário, em vez de precisar processá-las a partir da string do cabeçalho User-Agent (UA). Fornecer essa rota alternativa é o primeiro passo para reduzir a granularidade da string User-Agent.

Aprenda como atualizar seu código existente que depende do processamento da string User-Agent para usar, em vez disso, as User-Agent Client Hints.

{% Banner 'caution', 'body' %} Se você já estiver usando as User-Agent Client Hints, às mudanças que estão previstas. O formato do cabeçalho está mudando para que os tokens `Accept-CH` correspondam exatamente aos cabeçalhos retornados. Anteriormente, um site poderia ter enviado `Accept-CH: UA-Platform` para receber o cabeçalho `Sec-CH-UA-Platform` mas agora esse site deve enviar `Accept-CH: Sec-CH-UA-Platform`. Se você já implementou User-Agent Client Hints, envie os dois formatos até que a mudança seja totalmente implementada no Chromium estável. Acesse [Intent to Remove: Rename User-Agent Client Hint ACCEPT-CH tokens](https://groups.google.com/a/chromium.org/g/blink-dev/c/t-S9nnos9qU/m/pUFJb00jBAAJ) para saber das atualizações. {% endBanner %}

## Histórico

Quando os navegadores da web fazem solicitações, eles incluem informações sobre o navegador e seu ambiente para que os servidores possam ativar análises e personalizar a resposta. Isto foi definido em 1996, na RFC 1945 para HTTP/1.0, onde você encontrará a [definição original para a string User-Agent](https://tools.ietf.org/html/rfc1945#section-10.15), que inclui o seguinte exemplo:

```text
User-Agent: CERN-LineMode/2.15 libwww/2.17b3
```

Este cabeçalho tinha como objetivo especificar, em ordem de importância, o produto (por exemplo, navegador ou biblioteca) e um comentário (por exemplo, versão).

### O estado da string User-Agent

Ao longo das *décadas seguintes*, essa string acumulou uma variedade de detalhes adicionais sobre o cliente que faz a solicitação (também acumulou complexidade, devido à necessidade de compatibilidade reversa). Isto pode ser comprovado olhando para a string User-Agent no Chrome hoje:

```text
Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4076.0 Mobile Safari/537.36
```

A string acima contém informações sobre o sistema operacional e a versão do usuário, o modelo do dispositivo, a marca do navegador e a versão completa, pistas suficientes para inferir que se trata de um navegador móvel, sem mencionar uma série de referências a outros navegadores por motivos históricos.

A combinação desses parâmetros com a grande diversidade de valores possíveis significa que a string User-Agent pode conter informações suficientes para permitir que usuários individuais sejam identificados de forma única. Se você testar seu próprio navegador em [AmIUnique](https://amiunique.org/), você pode verificar a precisão com que **seu** string User-Agent identifica **seu** navegador. Quanto menor for a "taxa de similaridade" resultante, quanto mais exclusivas forem as suas solicitações, mais fácil será para os servidores rastreá-lo secretamente.

A string User-Agent permite diversos [casos de uso](https://github.com/WICG/ua-client-hints/blob/main/README.md#use-cases) legítimos e serve a um propósito importante para desenvolvedores e proprietários de sites. No entanto, também é fundamental que a privacidade dos usuários seja protegida contra métodos de rastreamento secreto, e o envio de informações de UA por default vai contra esse objetivo.

Também é necessário melhorar a compatibilidade com a web no que diz respeito à string User-Agent. Ela não é estruturada, portanto, é desnecessariamente complexo realizar seu processamento, o que costuma ser causa de bugs e problemas de compatibilidade do site que prejudicam os usuários. Esses problemas também afetam desproporcionalmente os usuários de navegadores menos comuns, pois os sites podem não conseguir testar sua configuração.

## Apresentando o novo User-Agent Client Hints

O [User-Agent Client Hints](https://github.com/WICG/ua-client-hints#explainer-reducing-user-agent-granularity) permite o acesso às mesmas informações, mas de uma maneira que preserva melhor a privacidade, enquanto ainda permite que os navegadores reduzam o comportamento default da string User-Agent, que é transmitir tudo. As [Client Hints](https://tools.ietf.org/html/draft-ietf-httpbis-client-hints) impõem um modelo em que o servidor precisa solicitar ao navegador um conjunto de dados sobre o cliente (as dicas/hints) e o navegador aplica suas próprias políticas ou configuração de usuário para determinar quais dados são retornados. Isto significa que, em vez de expor **todas** as informações do User-Agent por default, o acesso agora é gerenciado de maneira explícita e auditável. Os desenvolvedores também se beneficiam de uma API mais simples: não é preciso mais usar expressões regulares!

O conjunto atual de Client Hints descreve principalmente os recursos de exibição e conexão do navegador. Você pode explorar os detalhes em [Automating Resource Selection with Client Hints](https://developers.google.com/web/updates/2015/09/automating-resource-selection-with-client-hints), mas aqui está um rápido resumo do processo.

O servidor solicita Client Hints específicas por meio de um cabeçalho:

⬇️ *Resposta do servidor*

```text
Accept-CH: Viewport-Width, Width
```

Ou uma metatag:

```html
<meta http-equiv="Accept-CH" content="Viewport-Width, Width" />
```

O navegador pode então optar por enviar os seguintes cabeçalhos de volta nas solicitações subsequentes:

⬆️ *Solicitação subsequente*

```text
Viewport-Width: 460
Width: 230
```

O servidor pode escolher variar suas respostas, por exemplo, servindo imagens numa resolução apropriada.

{% Aside %} Existem discussões em andamento sobre a ativação das Client Hints numa solicitação inicial, mas você deve primeiro considerar o [design responsivo](/responsive-web-design-basics) ou o aprimoramento progressivo antes de seguir por esse caminho. {% endAside %}

As User-Agent Client Hints ampliam a faixa de propriedades com o prefixo `Sec-CH-UA` que pode ser especificado por meio do cabeçalho de resposta do servidor `Accept-CH`. Para conhecer todos os detalhes, comece com [a explicação](https://github.com/WICG/ua-client-hints/blob/main/README.md) e, em seguida, mergulhe na [proposta completa](https://wicg.github.io/ua-client-hints/).

{% Aside %} Client Hints só são **enviadas através de conexões seguras**, portanto, é necessário que você tenha realizado a [migração do seu site para HTTPS](/why-https-matters). {% endAside %}

Esse novo conjunto de dicas está disponível no Chromium 84, então vamos explorar como tudo funciona.

## User-Agent Client Hints do Chromium 84

As User-Agent Client Hints só serão ativadas gradualmente no Chrome estável à medida que as [questões de compatibilidade](https://bugs.chromium.org/p/chromium/issues/detail?id=1091285) forem resolvidas. Para forçar essa funcionalidade para testes:

- Use o Chrome 84 **beta** ou equivalente.
- Ative o `about://flags/#enable-experimental-web-platform-features`.

Por default, o navegador retorna a marca do navegador, a versão maior/principal e um indicador se o cliente for um dispositivo móvel:

⬆️ *Todos os pedidos*

```text
Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

{% Aside 'caution' %} Essas propriedades são mais complexas do que apenas um único valor, portanto, [cabeçalhos estruturados](https://httpwg.org/http-extensions/draft-ietf-httpbis-header-structure.html) são usados para representar listas e booleanos. {% endAside %}

### Cabeçalhos User-Agent de solicitação e resposta

<style>
.w-table-wrapper th:nth-of-type(1), .w-table-wrapper th:nth-of-type(2) {
    width: 28ch;
}

.w-table-wrapper td {
  padding: 4px 8px 4px 0;
}
</style>

⬇️ Resposta `Accept-CH`<br> ⬆️ Cabeçalho de solicitação | ⬆️ Exemplo de<br> valor de solicitação | Descrição
--- | --- | ---
`Sec-CH-UA` | `"Chromium";v="84",`<br>`"Google Chrome";v="84"` | Lista de marcas de navegadores e suas versões significativas.
`Sec-CH-UA-Mobile` | `?1` | Booleano que indica se o navegador está num dispositivo móvel (`?1` é true) ou não (`?0` é false).
`Sec-CH-UA-Full-Version` | `"84.0.4143.2"` | A versão completa do navegador.
`Sec-CH-UA-Platform` | `"Android"` | A plataforma do dispositivo, geralmente o sistema operacional (SO).
`Sec-CH-UA-Platform-Version` | `"10"` | A versão para a plataforma ou sistema operacional.
`Sec-CH-UA-Arch` | `"arm"` | A arquitetura subjacente do dispositivo. Embora isso possa não ser relevante para a exibição da página, o site pode oferecer um download cujo padrão é o formato correto.
`Sec-CH-UA-Model` | `"Pixel 3"` | O modelo do dispositivo.

{% Aside 'gotchas' %} Considerações sobre privacidade e compatibilidade significam que o valor pode estar em branco, não ser retornado ou preenchido com um valor variável. Isto é conhecido como [GREASE](https://wicg.github.io/ua-client-hints/#grease). {% endAside %}

### Exemplo de comunicação

Um exemplo de troca de informações seria o seguinte:

⬆️ *Solicitação inicial do navegador*<br> O navegador está solicitando a página `/downloads` do site e envia seu User-Agent básico default.

```text
GET /downloads HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

⬇️ *Resposta do servidor*<br> O servidor envia a página de volta e, adicionalmente, solicita informações sobre as versões completas do navegador e da plataforma.

```text
HTTP/1.1 200 OK
Accept-CH: Sec-CH-UA-Full-Version, Sec-CH-UA-Platform
```

⬆️ *Solicitações subsequentes*<br> O navegador concede ao servidor acesso às informações adicionais e envia as dicas extras de volta em todas as respostas subsequentes.

```text
GET /downloads/app1 HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
Sec-CH-UA-Full-Version: "84.0.4143.2"
Sec-CH-UA-Platform: "Android"
```

### API JavaScript

Junto com os cabeçalhos, o User-Agent também pode ser acessado em JavaScript via `navigator.userAgentData`. As informações de cabeçalho `Sec-CH-UA` e `Sec-CH-UA-Mobile` podem ser acessadas por meio das propriedades `brands` e `mobile`, respectivamente:

```js
// Registrar os dados do produto
console.log(navigator.userAgentData.brands);

// saída
[
  {
    brand: 'Chromium',
    version: '84',
  },
  {
    brand: 'Google Chrome',
    version: '84',
  },
];

// Registrar o indicador móvel
console.log(navigator.userAgentData.mobile);

// saída
false;
```

Os valores adicionais são acessados por meio da chamada `getHighEntropyValues()` O termo "alta entropia" (high entropy) é uma referência à [entropia da informação](https://en.wikipedia.org/wiki/Entropy_(information_theory)), ou seja, a quantidade de informação que esses valores revelam sobre o navegador do usuário. Tal como acontece com a solicitação de cabeçalhos adicionais, cabe ao navegador decidir quais valores, se houver, serão retornados.

```js
// Carregar todos os dados user-agent
navigator
  .userAgentData.getHighEntropyValues(
    ["architecture", "model", "platform", "platformVersion",
     "uaFullVersion"])
  .then(ua => { console.log(ua) });

// saída
{
  "architecture": "x86",
  "model": "",
  "platform": "Linux",
  "platformVersion": "",
  "uaFullVersion": "84.0.4143.2"
}
```

### Demonstração

Você pode experimentar os cabeçalhos e a API JavaScript no seu próprio dispositivo em [user-agent-client-hints.glitch.me](https://user-agent-client-hints.glitch.me).

{% Aside %} Certifique-se de usar o Chrome 84 Beta ou equivalente com `about://flags/#enable-experimental-web-platform-features` habilitados. {% endAside %}

### Duração e redefinição das dicas

As dicas especificadas por meio do cabeçalho `Accept-CH` serão enviadas durante a sessão do navegador ou até que um conjunto diferente de dicas seja especificado.

Isto significa que se o servidor enviar:

⬇️ *Resposta*

```text
Accept-CH: Sec-CH-UA-Full-Version
```

Em seguida, o navegador enviará o cabeçalho `Sec-CH-UA-Full-Version` em todas as solicitações desse site até que o navegador seja fechado.

⬆️ *Solicitações subsequentes*

```text
Sec-CH-UA-Full-Version: "84.0.4143.2"
```

No entanto, se outro cabeçalho `Accept-CH` for recebido, ele **substituirá completamente** as dicas atuais que o navegador está enviando.

⬇️ *Resposta*

```text
Accept-CH: Sec-CH-UA-Platform
```

⬆️ *Solicitações subsequentes*

```text
Sec-CH-UA-Platform: "Android"
```

O `Sec-CH-UA-Full-Version` solicitado anteriormente **não será enviado**.

É melhor pensar no cabeçalho `Accept-CH` como uma especificação do conjunto completo de dicas desejadas para aquela página, significando que o navegador então envia as dicas especificadas para todos os sub-recursos nessa página. Embora as dicas persistam até a próxima navegação, o site não deve confiar ou presumir que elas serão entregues.

{% Aside 'success' %} Sempre garanta que você ainda possa proporcionar uma experiência significativa sem essas informações. Essas informações servem para aprimorar a experiência do usuário, não para defini-la. É por isso que são chamados de "dicas" e não "respostas" ou "requisitos"! {% endAside %}

Você também pode limpar efetivamente todas as dicas enviadas pelo navegador, enviando um `Accept-CH` em branco na resposta. Considere utilizar isto sempre que o usuário estiver redefinindo as preferências ou saindo do seu site.

Esse padrão também corresponde ao modo como as dicas funcionam por meio da tag `<meta http-equiv="Accept-CH" …>` As dicas solicitadas só serão enviadas em solicitações iniciadas pela página e não em qualquer navegação subsequente.

### Escopo das dicas e solicitações de origem cruzada

Por default, as dicas do cliente serão enviadas apenas em solicitações da mesma origem. Isto significa que se você solicitar dicas específicas em `https://example.com`, mas os recursos que deseja otimizar estiverem em `https://downloads.example.com` eles **não** receberão nenhuma dica.

Para permitir dicas em solicitações de origem cruzada, cada dica e origem deve ser especificada por um cabeçalho `Feature-Policy`. Para aplicar isso a uma User-Agent Client Hint, você precisa colocar a dica em minúsculas e remover o prefixo `sec-` Por exemplo:

⬇️ *Resposta de `example.com`*

```text
Accept-CH: Sec-CH-UA-Platform, DPR
Feature-Policy: ch-ua-platform downloads.example.com;
                ch-dpr cdn.provider img.example.com
```

⬆️ *Solicitação para `downloads.example.com`*

```text
Sec-CH-UA-Platform: "Android"
```

⬆️ *Solicitações para `cdn.provider` ou `img.example.com`*

```text
DPR: 2
```

## Onde usar User-Agent Client Hints?

A resposta rápida é que você deve refatorar quaisquer instâncias em que você estiver processando o cabeçalho User-Agent ou usando alguma chamada JavaScript que acessa as mesmas informações (por exemplo, `navigator.userAgent`, `navigator.appVersion` ou `navigator.platform`) e alterar o código para usar User-Agent Client Hints.

Em seguida, você deve reexaminar o uso das informações do User-Agent e substituí-las por outros métodos sempre que possível. Frequentemente, você pode alcançar o mesmo objetivo através do aprimoramento progressivo, detecção de recursos ou [design responsivo](/responsive-web-design-basics). O problema fundamental de confiar nos dados do User-Agent é que você sempre precisa manter um mapeamento entre a propriedade que está inspecionando e o comportamento que ela habilita. É um overhead de manutenção para garantir que sua detecção seja abrangente e permaneça sempre atualizada.

Com essas advertências em mente, o [repositório User-Agent Client Hints lista alguns casos de uso válidos](https://github.com/WICG/ua-client-hints#use-cases) para sites.

## O que vai acontecer com a string User-Agent?

O plano é minimizar a capacidade de rastreamento secreto na web, reduzindo a quantidade de informações de identificação exposta pela string User-Agent existente, sem introduzir problemas nos sites existentes. A Introdução do User-Agent Client Hints lhe permite entender e experimentar o novo recurso, antes que qualquer alteração seja feita nas strings do User-Agent.

[Eventualmente](https://groups.google.com/a/chromium.org/d/msg/blink-dev/-2JIRNMWJ7s/u-YzXjZ8BAAJ), as informações da string User-Agent serão reduzidas para manter o formato legado, enquanto fornece apenas as mesmas informações de navegador e versão significativas de acordo com as dicas default. No Chromium, essa mudança foi adiada até pelo menos 2021 para dar mais tempo para o ecossistema avaliar as novas possibilidades das User Agent Client Hints.

Você pode testar uma versão desse recurso ativando o `about://flags/#reduce-user-agent` do Chrome 93 (Observação: este sinalizador chama-se `about://flags/#freeze-user-agent` nas versões Chrome 84 - 92). Isto retornará uma string com as entradas históricas por motivos de compatibilidade, mas com especificações higienizadas. Por exemplo, algo como:

```text
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Mobile Safari/537.36
```

*Foto de [Sergey Zolkin](https://unsplash.com/@szolkin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) no [Unsplash](https://unsplash.com/photos/m9qMoh-scfE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
