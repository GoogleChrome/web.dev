---
layout: post
title: Migrar para Dicas de cliente do agente do usuário
subhead: Estratégias para migrar seu site a partir da dependência da string do agente do usuário para as novas Dicas de cliente do agente do usuário.
authors:
  - rowan_m
date: 2021-05-19
description: Estratégias para migrar seu site a partir da dependência da string do agente do usuário para as novas Dicas de cliente do agente do usuário.
hero: image/VWw0b3pM7jdugTkwI6Y81n6f5Yc2/uHTVU6MzCWYVPzLposSy.jpg
alt: Uma rota iluminada através de uma paisagem sombria e escura. Siga esse caminho!
tags:
  - blog
  - privacy
---

A [string do agente do usuário](https://developer.mozilla.org/docs/Web/HTTP/Headers/User-Agent) é uma [superfície passiva](https://w3c.github.io/fingerprinting-guidance/#passive) significativa de impressão digital em navegadores, além de ser difícil de processar. No entanto, existem todos os tipos de motivos válidos para coletar e processar dados do agente do usuário, então o que é necessário é um caminho para uma solução melhor. As dicas de cliente do agente do usuário fornecem uma maneira explícita de declarar sua necessidade de dados do agente do usuário e métodos para retornar os dados em um formato fácil de usar.

{% Aside %} Para obter mais informações sobre Dicas de cliente e expandi-las com dados de agente do usuário, leia o [artigo introdutório sobre Dicas de cliente do agente do usuário](/user-agent-client-hints). {% endAside %}

Este artigo irá guiá-lo através da auditoria de seu acesso aos dados do agente do usuário e da migração do uso da string do agente do usuário para Dicas de cliente do agente do usuário.

## Coleta de auditoria e uso de dados do agente do usuário

Como acontece com qualquer forma de coleta de dados, você deve sempre entender **por que** está coletando. A primeira etapa, independentemente de você realizar ou não alguma ação, é entender onde e por que você está usando os dados do agente do usuário.

Se você não sabe se ou onde os dados do agente do usuário estão sendo usados, considere pesquisar seu código de front-end para usar `navigator.userAgent` e seu código de back-end para usar o cabeçalho HTTP do `User-Agent`. Você também deve verificar seu código de front-end para o uso de recursos já obsoletos, como `navigator.platform` e `navigator.appVersion`.

De um ponto de vista funcional, pense em qualquer lugar em seu código onde você esteja gravando ou processando:

- Nome ou versão do navegador
- Nome ou versão do sistema operacional
- Marca ou modelo do dispositivo
- Tipo de CPU, arquitetura ou bitness (por exemplo, 64 bits)

Também é provável que você esteja usando uma biblioteca ou serviço de terceiros para processar o agente do usuário. Nesse caso, verifique se eles estão atualizando para oferecer suporte às Dicas de cliente do agente do usuário.

### Você está usando apenas os dados básicos do agente do usuário?

O conjunto padrão de Dicas de cliente do agente do usuário inclui:

- `Sec-CH-UA`: nome do navegador e versão principal/significativa
- `Sec-CH-UA-Mobile`: valor booleano que indica um dispositivo móvel
- `Sec-CH-UA-Platform`: nome do sistema operacional
    - *Observe que isso foi atualizado nas especificações e será [refletido no Chrome](https://groups.google.com/a/chromium.org/g/blink-dev/c/dafizBGwWMw/m/72l-1zm6AAAJ) e em outros navegadores baseados em Chromium em breve.*

A versão reduzida da string do agente do usuário proposta também reterá essas informações básicas de maneira compatível com versões anteriores. Por exemplo, em vez de `Chrome/90.0.4430.85` a string incluiria `Chrome/90.0.0.0`.

Se você estiver apenas verificando a string do agente do usuário para o nome do navegador, versão principal ou sistema operacional, seu código continuará a funcionar, embora seja provável que você veja avisos de depreciação.

Embora você possa e deva migrar para Dicas de cliente do agente do usuário, pode haver código legado ou restrições de recursos que impedem isso. A redução de informações na string do agente do usuário dessa forma compatível com versões anteriores tem o objetivo de garantir que, embora o código existente receba informações menos detalhadas, ele ainda deve reter a funcionalidade básica.

## Estratégia: a API do JavaScript sob demanda do lado do cliente

Se você estiver usando `navigator.userAgent` deve fazer a transição de preferência `navigator.userAgentData` antes de voltar a analisar a string do agente do usuário.

```javascript
if (navigator.userAgentData) {
  // use new hints
} else {
  // fall back to user-agent string parsing
}
```

Se você estiver verificando para celular ou desktop, use o valor `mobile`:

```javascript
const isMobile = navigator.userAgentData.mobile;
```

O `userAgentData.brands` é uma matriz de objetos com `brand` e `version` onde o navegador é capaz de listar sua compatibilidade com essas marcas. Você pode acessá-lo diretamente como uma matriz ou pode usar uma `some()` para verificar se uma entrada específica está presente:

```javascript
function isCompatible(item) {
  // In real life you most likely have more complex rules here
  return ['Chromium', 'Google Chrome', 'NewBrowser'].includes(item.brand);
}
if (navigator.userAgentData.brands.some(isCompatible)) {
  // browser reports as compatible
}
```

{% Aside 'gotchas' %} O `userAgentData.brands` conterá valores variados em uma ordem variada, portanto, não confie em algo que apareça em um determinado índice. {% endAside %}

Se você precisar de um dos valores do agente do usuário de alta entropia mais detalhados, será necessário especificá-lo e verificar o resultado na `Promise` retornada:

```javascript
navigator.userAgentData.getHighEntropyValues(['model'])
  .then(ua => {
    // requested hints available as attributes
    const model = ua.model
  });
```

Você também pode usar essa estratégia se quiser passar do processamento do lado do servidor para o processamento do lado do cliente. A API do JavaScript não requer acesso aos cabeçalhos de solicitação HTTP, portanto, os valores do agente do usuário podem ser solicitados a qualquer momento.

{% Aside %} Experimente a [demonstração da API do JavaScript das Dicas de cliente do agente do usuário](https://user-agent-client-hints.glitch.me/javascript.html). {% endAside %}

## Estratégia: cabeçalho estático do lado do servidor

Se você estiver usando o cabeçalho de solicitação do `User-Agent` no servidor e suas necessidades para esses dados forem relativamente consistentes em todo o seu site, você pode especificar as dicas de cliente desejadas como um conjunto estático em suas respostas. Esta é uma abordagem relativamente simples, pois geralmente você só precisa configurá-la em um local. Por exemplo, pode ser na configuração do seu servidor web se você já adicionar cabeçalhos lá, sua configuração de hospedagem ou configuração de nível superior da estrutura ou plataforma que você usa para seu site.

Considere esta estratégia se você estiver transformando ou customizando as respostas servidas com base nos dados do agente do usuário.

{% Aside %} Você também pode considerar a migração para a estratégia da [API do JavaScript sob demanda do lado do cliente](#strategy-on-demand-client-side-javascript-api) em vez de enviar cabeçalhos adicionais. {% endAside %}

Navegadores ou outros clientes podem optar por fornecer dicas padrão diferentes, portanto, é uma boa prática especificar tudo o que você precisa, mesmo que geralmente seja fornecido por padrão.

Por exemplo, os padrões atuais do Chrome seriam representados como:

⬇️ Cabeçalhos de resposta

```text
Accept-CH: Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA
```

Se você também quiser receber o modelo do dispositivo nas respostas, envie:

⬇️ Cabeçalhos de resposta

```text
Accept-CH: Sec-CH-UA-Mobile, Sec-CH-UA-Model, Sec-CH-UA-Platform, Sec-CH-UA
```

{% Aside 'gotchas' %} A ordem não é importante, o exemplo é listado em ordem alfabética. {% endAside %}

Ao processar isso no lado do servidor, você deve primeiro verificar se o `Sec-CH-UA` desejado foi enviado e, em seguida, retornar para o `User-Agent` se não estiver disponível.

{% Aside %} Experimente a [demonstração da API do JavaScript das Dicas de cliente do agente do usuário](https://user-agent-client-hints.glitch.me/). {% endAside %}

## Estratégia: delegar dicas para solicitações de origem cruzada

Se você estiver solicitando sub-recursos de origem cruzada ou site cruzado que exigem o envio de Dicas de cliente do agente do usuário em suas solicitações, será necessário especificar explicitamente as dicas desejadas usando uma política de permissões.

{% Aside %} [Política de permissões](https://www.w3.org/TR/permissions-policy-1/) é a nova forma de política de recursos {% endAside %}

Por exemplo, digamos que o `https://blog.site` hospede recursos em `https://cdn.site` que podem retornar recursos otimizados para um dispositivo específico. O `https://blog.site` pode solicitar a dica `Sec-CH-UA-Model`, mas precisa delegá-lo explicitamente o `https://cdn.site` usando o cabeçalho `Permissions-Policy`. A lista de dicas controladas por política está disponível no [Rascunho da infraestrutura de dicas do cliente](https://wicg.github.io/client-hints-infrastructure/#policy-controlled-client-hints-features)

⬇️ Resposta de `blog.site` delegando a dica

```text
Accept-CH: Sec-CH-UA-Model
Permissions-Policy: ch-ua-model=(self "https://cdn.site")
```

⬆️ Solicitação de sub-recursos em `cdn.site` incluem a dica delegada

```text
Sec-CH-UA-Model: "Pixel 5"
```

Você pode especificar várias dicas para várias origens, e não apenas do intervalo `ch-ua`:

⬇️ Resposta de `blog.site` delegando várias dicas para várias origens

```text
Accept-CH: Sec-CH-UA-Model, DPR
Permissions-Policy: ch-ua-model=(self "https://cdn.site"),
                    ch-dpr=(self "https://cdn.site" "https://img.site")
```

{% Aside 'gotchas' %} Você **não** precisa incluir cada dica delegada em `Accept-CH`, mas **você** precisa para incluir `self` para cada dica, mesmo se você não estiver usando-o diretamente para o de nível superior. {% endAside %}

## Estratégia: delegar dicas aos iframes

Os iframes de origem cruzada funcionam de maneira semelhante aos recursos de origem cruzada, mas você especifica as dicas que gostaria de delegar no atributo `allow`.

⬇️ Resposta do `blog.site`

```text
Accept-CH: Sec-CH-UA-Model
```

↪️ HTML para `blog.site`

```html
<iframe src="https://widget.site" allow="ch-ua-model"></iframe>
```

⬆️ Solicitação para `widget.site`

```text
Sec-CH-UA-Model: "Pixel 5"
```

O atributo `allow` no iframe substituirá qualquer cabeçalho `Accept-CH` que `widget.site` possa enviar, então certifique-se de ter especificado tudo o que o site do iframe vai precisar.

## Estratégia: dicas dinâmicas do lado do servidor

Se você tiver partes específicas da jornada do usuário em que precisa de uma seleção maior de dicas do que no restante do site, pode optar por solicitar essas dicas sob demanda, em vez de estaticamente em todo o site. Isso é mais complexo de gerenciar, mas se você já definiu cabeçalhos diferentes por rota, pode ser viável.

O importante a lembrar aqui é que cada instância do cabeçalho `Accept-CH` substituirá efetivamente o conjunto existente. Portanto, se você estiver configurando o cabeçalho dinamicamente, cada página deve solicitar o conjunto completo de dicas necessárias.

Por exemplo, você pode ter uma seção em seu site onde deseja fornecer ícones e controles que correspondem ao sistema operacional do usuário. Para isso, você pode desejar exibir adicionalmente `Sec-CH-UA-Platform-Version` para servir aos sub-recursos apropriados.

⬇️ Cabeçalhos de resposta para `/blog`

```text
Accept-CH: Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA
```

⬇️ Cabeçalhos de resposta para `/app`

```text
Accept-CH: Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA
```

## Estratégia: dicas do lado do servidor necessárias na primeira solicitação

Pode haver casos em que você exija mais do que o conjunto padrão de dicas na primeira solicitação; no entanto, isso provavelmente será raro, portanto, certifique-se de revisar o raciocínio.

A primeira solicitação realmente significa a primeira solicitação de nível superior para aquela origem enviada naquela sessão de navegação. O conjunto padrão de dicas inclui o nome do navegador com a versão principal, a plataforma e o indicador móvel. Portanto, a pergunta a se fazer aqui é: você precisa de dados estendidos no carregamento inicial da página?

{% Aside %} Considere também usar a [estratégia da API do JavaScript sob demanda do lado do cliente](#strategy-on-demand-client-side-javascript-api) para alterar o conteúdo na página, em vez do lado do servidor. {% endAside %}

Para dicas adicionais sobre a primeira solicitação, existem duas opções. Primeiro, você pode usar o cabeçalho `Critical-CH`. Ele assume o mesmo formato que o `Accept-CH`, mas informa ao navegador que ele deve repetir a solicitação imediatamente se a primeira foi enviada sem a dica crítica.

⬆️ Solicitação inicial

```text
[With default headers]
```

⬇️ Cabeçalhos de resposta

```text
Accept-CH: Sec-CH-UA-Model
Critical-CH: Sec-CH-UA-Model
```

🔃 O navegador tenta novamente a solicitação inicial com o cabeçalho adicional

```text
[With default headers + …]
Sec-CH-UA-Model: Pixel 5
```

Isso incorrerá na sobrecarga da nova tentativa na primeira solicitação, mas o custo de implementação é relativamente baixo. Envie o cabeçalho adicional e o navegador fará o resto.

{% Aside 'gotchas' %} Qualquer valor `Critical-CH` deve ser um subconjunto dos valores em `Accept-CH`. Os `Accept-CH` são todos os valores que você gostaria para a página, o `Critical-CH` é o subconjunto desses valores que você **deve** ter ou você não poderá carregar a página corretamente. {% endAside %}

Para situações em que você realmente precisa de dicas adicionais no carregamento da primeira página, a [proposta de confiabilidade das dicas do cliente](https://github.com/WICG/client-hints-infrastructure/blob/main/reliability.md#connection-level-settings) está traçando uma rota para especificar dicas nas configurações de nível de conexão. Isso faz uso da extensão [Application-Layer Protocol Settings (ALPS)](https://tools.ietf.org/html/draft-vvv-tls-alps) para TLS 1.3 para permitir essa passagem antecipada de dicas em conexões HTTP/2 e HTTP/3. Isso ainda está em um estágio muito inicial, mas se você gerencia ativamente seu próprio TLS e configurações de conexão, este é o momento ideal para contribuir.

## Estratégia: suporte legado

Você pode ter um código legado ou de terceiros em seu site que depende do `navigator.userAgent`, incluindo partes da string do agente do usuário que serão reduzidas. A longo prazo, você deve planejar a mudança para as `navigator.userAgentData` equivalentes, mas existe uma solução provisória.

{% Aside 'warning' %} Isso não é recomendado e não tem suporte de forma alguma. Esta solução está incluída para ser completa, mas se você gastar algum tempo tentando consertar bugs nela, esse tempo seria melhor gasto na migração real. {% endAside %}

O [retrofill UA-CH](https://github.com/GoogleChromeLabs/uach-retrofill) é uma pequena biblioteca que permite sobrescrever `navigator.userAgent` com uma nova string construída a partir dos valores `navigator.userAgentData` solicitados.

Por exemplo, este código irá gerar uma string de agente do usuário que inclui adicionalmente a dica "modelo":

```javascript
import { overrideUserAgentUsingClientHints } from './uach-retrofill.js';
overrideUserAgentUsingClientHints(['model'])
  .then(() => { console.log(navigator.userAgent); });
```

A string resultante mostraria o `Pixel 5`, mas ainda mostra `92.0.0.0` reduzido, pois a dica `uaFullVersion` não foi solicitada:

```text
Mozilla/5.0 (Linux; Android 10.0; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.0.0 Mobile Safari/537.36
```

## Suporte adicional

Se essas estratégias não atenderem ao seu caso de uso, inicie uma [Discussão no repositório de privacidade-sandbox-dev-support](https://github.com/GoogleChromeLabs/privacy-sandbox-dev-support/discussions) e assim poderemos explorar seu problema juntos.

*Foto de [Ricardo Rocha](https://unsplash.com/@rcrazy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) no [Unsplash](https://unsplash.com/photos/nj1bqRzClq8).*
