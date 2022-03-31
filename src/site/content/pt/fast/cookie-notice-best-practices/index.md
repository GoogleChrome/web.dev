---
layout: post
title: Melhores práticas para avisos de cookies
subhead: |2

  Otimize os avisos de cookies para desempenho e usabilidade.
authors:
  - katiehempenius
date: 2021-03-30
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/V8rNgYUkkAWET3EkBL6H.png
alt: Imagem de avisos de cookies.
description: |2

  Aprenda como os avisos de cookies afetam o desempenho, a medição do desempenho e a experiência do usuário.
tags:
  - blog
  - performance
  - web-vitals
---

Este artigo discute como os avisos de cookies podem afetar o desempenho, a medição do desempenho e a experiência do usuário.

## Desempenho

Avisos de cookies podem ter um impacto significativo no desempenho da página devido ao fato de que normalmente são carregados no início do seu processo de carregamento, além de serem exibidos para todos os usuários e possivelmente influenciarem o carregamento de anúncios e outro conteúdo da página.

Veja como os avisos de cookies podem impactar as métricas Web Vitals:

- **Largest Contentful Paint (LCP): a** maioria dos avisos de consentimento de cookies são bastante pequenos e, portanto, normalmente não contêm um elemento LCP da página. No entanto, isso pode acontecer - principalmente em dispositivos móveis. Em dispositivos móveis, um aviso de cookie normalmente ocupa uma parte maior da tela. Isso geralmente ocorre quando um aviso de cookie contém um grande bloco de texto (blocos de texto também podem ser elementos LCP).

- **First Input Delay (FID):** De modo geral, sua solução de consentimento de cookie por si só deve ter um impacto mínimo no FID - o consentimento de cookie requer pouca execução de JavaScript. No entanto, as tecnologias que esses cookies permitem - a saber, scripts de publicidade e rastreamento - podem ter um impacto significativo na interatividade da página. Atrasar esses scripts até a aceitação do cookie pode servir como uma técnica para diminuir o First Input Delay (FID).

- **Cumulative Layout Shift (CLS):** Avisos de consentimento de cookies são uma fonte muito comum de mudanças de layout.

De um modo geral, você pode esperar que um aviso de cookie de fornecedores terceirizados tenha um impacto maior no desempenho do que um aviso de cookie criado por você. Este não é um problema exclusivo de avisos de cookies - mas sim a natureza dos scripts de terceiros em geral.

### Melhores Práticas

As melhores práticas nesta seção se concentram em avisos de cookies de terceiros. Algumas dessas práticas recomendadas, embora não todas, também se aplicam a avisos de cookies primários.

#### Carregar scripts de avisos de cookies de forma assíncrona

Os scripts de aviso de cookie devem ser carregados de forma assíncrona. Para fazer isso, adicione o atributo [`async`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-async) à tag de script.

```html
<script src="https://cookie-notice.com/script.js" async>
```

Os scripts que não são assíncronos bloqueiam o analisador do navegador. Isso atrasa o carregamento da página e o LCP. Para obter mais informações, consulte [Carregar JavaScript de terceiros com eficiência](/efficiently-load-third-party-javascript/).

{% Aside %} Se você precisa usar scripts síncronos (por exemplo, alguns avisos de cookies dependem de scripts síncronos para implementar o bloqueio de cookies), garanta de que essa solicitação carregue o mais rápido possível. Uma maneira de fazer isso é [usar dicas de recursos](/preconnect-and-dns-prefetch/). {% endAside %}

#### Carregar scripts de aviso de cookies diretamente

Os scripts de aviso de cookie devem ser carregados "diretamente" colocando a tag do script no HTML do documento principal - em vez de carregados por um gerenciador de tags ou outro script. Usar um gerenciador de tags ou script secundário para injetar o script de aviso de cookie atrasa o carregamento do script de aviso de cookie: ele obscurece o script do analisador de lookahead do navegador e evita que o script carregue antes da execução do JavaScript.

#### Estabeleça uma conexão antecipada com a origem do aviso de cookie

Todos os sites que carregam seus scripts de aviso de cookie a partir de um local de terceiros devem usar os indicadores de recursos `dns-prefetch` ou `preconnect` para ajudar a estabelecer uma conexão antecipada com a origem que hospeda recursos de aviso de cookie. Para obter mais informações, consulte [Estabelecer conexões de rede antecipadamente para melhorar a velocidade percebida da página](/preconnect-and-dns-prefetch/) .

```html
<link rel="preconnect" href="https://cdn.cookie-notice.com/">
```

{% Aside %} É comum que os avisos de cookies carreguem recursos de várias origens - por exemplo, recursos de carregamento de `www.cookie-notice.com` e `cdn.cookie-notice.com` . Origens separadas requerem conexões separadas e, portanto, dicas de recursos separadas. {% endAside %}

#### Avisos de cookies pré-carregados conforme apropriado

Alguns sites se beneficiariam com o uso da indicação de recurso [`preload`](https://developer.mozilla.org/docs/Web/HTML/Preloading_content) para carregar seu script de aviso de cookie. A indicação de recurso `preload` informa ao navegador que inicie uma solicitação antecipada do recurso especificado.

```html
<link rel="preload" href="https://www.cookie-notice.com/cookie-script.js">
```

`preload` é mais eficiente quando seu uso é limitado a buscar alguns recursos chave por página. Portanto, a utilidade de pré-carregar o script de aviso de cookie irá variar dependendo da situação.

#### Esteja ciente das desvantagens de desempenho ao definir o estilo dos avisos de cookies

Personalizar a aparência de um aviso de cookie de terceiros pode incorrer em custos de desempenho adicionais. Por exemplo, avisos de cookies de terceiros nem sempre são capazes de reutilizar os mesmos recursos (por exemplo, fontes da web) que são usados em outras partes da página. Além disso, os avisos de cookies de terceiros tendem a carregar estilo no final de longas cadeias de solicitações. Para evitar surpresas, esteja ciente de como o aviso de cookie carrega e aplica estilo e recursos relacionados.

#### Evite mudanças de layout

Estes são alguns dos problemas de mudança de layout mais comuns associados a avisos de cookies:

- **Avisos de cookies na parte superior da tela:** os avisos de cookies na parte superior da tela são uma fonte muito comum de mudança de layout. Se um aviso de cookie for inserido no DOM após a página ao redor já ter sido renderizada, ele empurrará os elementos da página abaixo dele ainda mais para baixo na página. Esse tipo de mudança de layout pode ser eliminado reservando espaço no DOM para o aviso de consentimento. Se essa não for uma solução viável - por exemplo, se as dimensões de seu aviso de cookie variam de acordo com a localização geográfica, considere usar um rodapé ou modal para exibir o aviso de cookie. Como essas duas abordagens alternativas exibem o aviso de cookie como uma "sobreposição" no topo do restante da página, o aviso de cookie não deve causar alterações no conteúdo ao carregar.
- **Animações**: muitos avisos de cookies usam animações - por exemplo, "deslizar" um aviso de cookies é um padrão de design comum. Dependendo de como esses efeitos são implementados, eles podem causar mudanças de layout. Para obter mais informações, consulte [Depurando mudanças de layout](/debugging-layout-shifts/).
- **Fontes**: fontes de carregamento tardio podem bloquear a renderização e/ou causar mudanças de layout. Este fenômeno é mais aparente em conexões lentas.

#### Otimizações de carregamento avançadas

Essas técnicas exigem mais trabalho para serem implementadas, mas podem otimizar ainda mais o carregamento de scripts de aviso de cookie:

- Armazenar em cache e servir scripts de aviso de cookie de terceiros a partir de seus próprios servidores pode melhorar a velocidade de entrega desses recursos.
- O uso de [service workers](https://developer.mozilla.org/docs/Web/API/Service_Worker_API/Using_Service_Workers) pode permitir mais controle sobre a [busca e o armazenamento em cache de scripts de terceiros](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#cross-origin-considerations) , como scripts de aviso de cookie.

## Medição de desempenho

Avisos de cookies podem afetar as medições de desempenho. Esta seção discute algumas dessas implicações e técnicas para mitigá-las.

### Monitoramento de usuário real (RUM)

Algumas ferramentas analíticas e RUM usam cookies para coletar dados de desempenho. No caso de um usuário recusar o uso de cookies, essas ferramentas não podem capturar dados de desempenho.

Os sites devem estar cientes desse fenômeno; também vale a pena entender os mecanismos que seu ferramental RUM usa para coletar seus dados. No entanto, para o site típico, essa discrepância provavelmente não é causa de alarme, dada a direção e magnitude da distorção dos dados. O uso de cookies não é um requisito técnico para medição de desempenho. A [biblioteca JavaScript web-vitals](https://github.com/GoogleChrome/web-vitals) é um exemplo de biblioteca que não usa cookies.

Dependendo de como seu site usa cookies para coletar dados de desempenho (ou seja, se os cookies contêm informações pessoais), bem como a legislação em questão, o uso de cookies para medição de desempenho pode não estar sujeito aos mesmos requisitos legais que alguns de os cookies usados em seu site para outros fins - por exemplo, cookies de publicidade. Alguns sites optam por separar os cookies de desempenho como uma categoria separada de cookies ao solicitar o consentimento do usuário.

### Monitoramento sintético

Sem configuração personalizada, a maioria das ferramentas sintéticas (como Lighthouse e WebPageTest) medirá apenas a experiência de um usuário iniciante que não respondeu a um aviso de consentimento de cookie. No entanto, não só as variações no estado do cache (por exemplo, uma visita inicial versus uma visita repetida) precisam ser consideradas ao coletar dados de desempenho, mas também as variações no estado de aceitação do cookie - aceito, rejeitado ou não respondido.

As seções a seguir discutem as configurações de WebPageTest e Lighthouse que podem ser úteis para incorporar avisos de cookies em fluxos de trabalho de medição de desempenho. No entanto, cookies e avisos de cookies são apenas um dos muitos fatores que podem ser difíceis de simular perfeitamente em ambientes de laboratório. Por esse motivo, é importante fazer dos [dados RUM](/user-centric-performance-metrics/#how-metrics-are-measured) a base de seu benchmarking de desempenho, em vez de ferramentas sintéticas.

### Testando avisos de cookies com WebPageTest

#### Scripting

Você pode usar o script para que um [WebPageTest](https://webpagetest.org/) "clique" no banner de consentimento do cookie enquanto coleta um rastreamento.

Adicione um script acessando a guia **Script.** O script abaixo navega até o URL a ser testado e clica no elemento DOM com o id `cookieButton` .

{% Aside 'caution' %} Scripts WebPageTest são [delimitados por tabulação](https://github.com/WPO-Foundation/webpagetest-docs/blob/main/src/scripting.md#scripting). {% endAside %}

```shell
combineSteps
navigate    %URL%
clickAndWait    id=cookieButton
```

Ao usar este script, esteja ciente de que:

- `combineSteps` informa ao WebPageTest para "combinar" os resultados das etapas de script que se seguem em um único conjunto de rastreios e medidas. Executar esse script sem `combineSteps` também pode ser útil - rastros separados facilitam visualizar se os recursos foram carregados antes ou depois da aceitação do cookie.
- `%URL%` é uma convenção WebPageTest que se refere ao URL que está sendo testado.
- `clickAndWait` informa ao WebPageTest para clicar no elemento indicado por `attribute=value` e aguardar a conclusão da atividade subsequente do navegador. Ele segue o formato `clickAndWait attribute=Value` .

Se você configurou este script corretamente, a captura de tela tirada pelo WebPageTest não deve mostrar um aviso de cookie (o aviso de cookie foi aceito).

Para obter mais informações sobre scripts WebPageTest, verifique a [documentação do WebPageTest](https://docs.webpagetest.org/scripting/) .

#### Definir cookies

Para executar o WebPageTest com um conjunto de cookies, vá para a guia **Avançado** e adicione o cabeçalho do cookie ao campo **Cabeçalhos personalizados:**

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/qSccrAxF0H4yoSzYRYdh.png", alt="Captura de tela mostrando o campo 'Cabeçalhos personalizados' em WebPageTest", width="800", height="181" %}

#### Mude o local do teste

Para alterar o local de teste usado pelo WebPageTest, clique no menu suspenso **Local de teste** localizado na guia **Teste avançado.**

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/J27NcDQ5LTtXYloaA1DN.png", alt="Captura de tela da lista suspensa 'Localização de teste' em WebPageTest", width="800", height="267" %}

### Testando avisos de cookies com o Lighthouse

Definir cookies em uma execução do Lighthouse pode servir como um mecanismo para colocar uma página em um determinado estado para teste pelo Lighthouse. O comportamento do cookie do Lighthouse varia ligeiramente de acordo com o contexto (DevTools, CLI ou PageSpeed Insights).

#### DevTools

Os cookies não são apagados quando o Lighthouse é executado no DevTools. No entanto, outros tipos de armazenamento são limpos por padrão. Esse comportamento pode ser alterado usando a opção **Limpar armazenamento** no painel de configurações do **Lighthouse**.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/nmNDeSoGEQUVKeTP7q7R.png", alt="Captura de tela destacando a opção 'Limpar armazenamento' do Lighthouse", width="800", height="304" %}

#### CLI

A execução do Lighthouse a partir da CLI usa uma nova instância do Chrome, portanto, nenhum cookie é definido por padrão. Para executar o Lighthouse a partir da CLI com um conjunto de cookies específico, use o seguinte [comando](https://github.com/GoogleChrome/lighthouse#cli-options) :

```shell
lighthouse <url> --extra-headers "{\"Cookie\":\"cookie1=abc; cookie2=def; \_id=foo\"}"
```

Para obter mais informações sobre a configuração de cabeçalhos de solicitação personalizados no Lighthouse CLI, consulte [Executando o Lighthouse em páginas autenticadas](https://github.com/GoogleChrome/lighthouse/blob/master/docs/authenticated-pages.md) .

#### PageSpeed Insights

Executar o Lighthouse a partir do PageSpeed Insights usa uma nova instância do Chrome e não define nenhum cookie. O PageSeed Insights não pode ser configurado para definir cookies específicos.

## Experiência de usuário

A experiência do usuário (UX) de diferentes avisos de consentimento de cookie é principalmente o resultado de duas decisões: a localização do aviso de cookie na página e até que ponto o usuário pode personalizar o uso de cookies de um site. Esta seção discute abordagens potenciais para essas duas decisões.

{% Aside 'caution' %} A UX de notificação de cookies muitas vezes sofre forte influência da legislação, que pode variar muito de acordo com a localização geográfica. Portanto, alguns dos padrões de design discutidos nesta seção podem não ser relevantes para a sua situação específica. Este artigo não deve ser considerado como um substituto para orientações jurídicas. {% endAside %}

Ao considerar possíveis designs para seu aviso de cookie, aqui estão algumas coisas a serem consideradas:

- UX: esta é uma boa experiência do usuário? Como esse design específico afetará os elementos da página e os fluxos do usuário existentes?
- Negócios: qual é a estratégia de cookies do seu site? Quais são seus objetivos para o aviso de cookie?
- Legal: está em conformidade com os requisitos legais?
- Engenharia: quanto trabalho seria necessário para implementar e manter? Seria difícil mudar?

### Posicionamento

Os avisos de cookies podem ser exibidos como um cabeçalho, elemento embutido ou rodapé. Eles também podem ser exibidos no topo do conteúdo da página usando um modal ou veiculados como um [intersticial](https://en.wikipedia.org/wiki/Interstitial_webpage) .

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/LLqHAhp7W6x4E3rZh0Oc.png", alt="Diagrama mostrando exemplos de diferentes opções de posicionamento para avisos de cookies", width="800", height="345"%}

#### Avisos de cookies de cabeçalho, rodapé e embutidos

Avisos de cookies são geralmente posicionados no cabeçalho ou rodapé. Dessas duas opções, o posicionamento do rodapé é geralmente preferível porque é discreto, não concorre por atenção com anúncios em banner ou notificações e normalmente não causa CLS. Além disso, é um local comum para o posicionamento de políticas de privacidade e termos de uso.

Embora os avisos de cookies embutidos sejam uma opção, eles podem ser difíceis de integrar nas interfaces de usuário existentes e, portanto, são incomuns.

#### Modais

Modais são avisos de consentimento de cookies exibidos na parte superior do conteúdo da página. Os modais podem ter uma aparência e um desempenho bastante diferentes, dependendo de seu tamanho.

Modais menores de tela parcial podem ser uma boa alternativa para sites com obstáculos para implementar avisos de cookies de uma maneira que não cause [mudanças de layout](/cls/).

Por outro lado, grandes modais que obscurecem a maior parte do conteúdo da página devem ser usados com cuidado. Em particular, sites menores podem descobrir que os usuários rejeitam em vez de aceitam o aviso de cookie de um site desconhecido com conteúdo obscurecido. Embora não sejam conceitos necessariamente sinônimos, se você está pensando em usar um modal de consentimento de cookies de tela inteira, deve estar ciente da legislação relativa às [paredes de cookies](https://techcrunch.com/2020/05/06/no-cookie-consent-walls-and-no-scrolling-isnt-consent-says-eu-data-protection-body/).

{% Aside %} Modais grandes podem ser considerados um tipo de intersticial. A Pesquisa Google [não penaliza](https://developers.google.com/search/blog/2016/08/helping-users-easily-access-content-on) o uso de intersticiais quando eles são usados para cumprir regulamentos legais, como no caso de banners de cookies. No entanto, o uso de intersticiais em outros contextos, especialmente se eles forem intrusivos ou criarem uma experiência ruim para o usuário, pode ser penalizado. {% endAside %}

### Configurabilidade

As interfaces de notificação de cookies fornecem aos usuários vários níveis de controle sobre quais cookies eles aceitam.

#### Sem configurabilidade

Esses banners de cookies com estilo de aviso não proporcionam aos usuários controles diretos de experiência do usuário para excluir cookies. Em vez disso, eles normalmente incluem um link para a política de cookies do site que pode fornecer aos usuários informações sobre como gerenciar cookies usando o navegador da web. Esses avisos geralmente incluem um botão "Ignorar" e/ou "Aceitar".

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/RlAg8DCjBC0bX7Ki5MuE.png", alt="Diagrama mostrando exemplos de avisos de cookies sem configurabilidade de cookies", width="800", height="518"%}

#### Alguma capacidade de configuração

Esses avisos de cookies fornecem ao usuário a opção de recusar cookies, mas não oferecem suporte a controles mais granulares. Essa abordagem para avisos de cookies é menos comum.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/MOl8u9NcnyjCWogxzjdz.png", alt="Diagrama mostrando exemplos de avisos de cookies com alguma configurabilidade de cookies", width="800", height="508"%}

#### Configurabilidade total

Esses avisos de cookies fornecem aos usuários controles mais refinados para configurar o uso de cookies que eles aceitam.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/QfFoqkkmdKHAYlftIH0n.png", alt="Diagrama mostrando exemplos de avisos cookie com configurabilidade total do cookie", width="800", height="467"%}

- **UX:** os controles para configurar o uso de cookies são geralmente exibidos usando um modal separado que é iniciado quando o usuário responde ao aviso de consentimento de cookie inicial. No entanto, se o espaço permitir, alguns sites exibirão esses controles embutidos no aviso de consentimento de cookie inicial.

- **Granularidade:** a abordagem mais comum para a configuração de cookies é permitir que os usuários optem por cookies por "categoria" de cookie. Exemplos de categorias de cookies comuns incluem cookies funcionais, de segmentação e de mídia social.

    No entanto, alguns sites dão um passo além e permitem que os usuários optem pelos cookies individualmente. Como alternativa, outra maneira de fornecer aos usuários controles mais específicos é dividir as categorias de cookies como "publicidade" em casos de uso específicos - por exemplo, permitindo que os usuários optem separadamente por "anúncios básicos" e "anúncios personalizados".

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/z7zFPtCkFi8GEpkfubek.png", alt="Diagrama mostrando exemplos de avisos de cookies com configurabilidade total de cookies", width="800", height="372"%}
