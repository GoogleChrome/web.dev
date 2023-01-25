---
layout: post
title: Métricas personalizadas
authors:
  - philipwalton
date: 2019-11-08
description: As métricas personalizadas permitem medir e otimizar aspectos da experiência do seu site que são características exclusivas dele.
tags:
  - performance
  - metrics
---

É muito valioso ter [métricas centradas](/user-centric-performance-metrics/) no usuário que você pode medir, universalmente, em qualquer site. Essas métricas permitem que você:

- Entenda como os usuários de verdade experimentam a web como um todo
- Comparar facilmente o seu site com o de um concorrente
- Rastrear dados úteis e acionáveis em suas ferramentas de análise sem a necessidade de escrever um código personalizado

As métricas universais oferecem uma boa base, mas em muitos casos você precisa medir *mais* do que apenas essas métricas para capturar a experiência completa do seu site específico.

As métricas personalizadas permitem que você avalie aspectos da experiência de seu site que podem se aplicar apenas a ele, como:

- Quanto tempo leva para um aplicativo de página única (SPA) fazer a transição de uma "página" para outra
- Quanto tempo leva para uma página exibir dados buscados em um banco de dados para usuários conectados
- Quanto tempo leva para um aplicativo renderizado do lado do servidor (SSR) [hidratar](https://addyosmani.com/blog/rehydration/) seus componentes
- A taxa de uso de cache para recursos carregados por visitantes recorrentes
- A latência de eventos de clique ou eventos de teclado em um jogo

## APIs para medir métricas personalizadas

Historicamente, os desenvolvedores web não tinham muitas APIs de baixo nível para medir o desempenho e, como resultado, eles tinham que recorrer a hacks para medir se um site estava tendo um bom desempenho.

Por exemplo, é possível determinar se o thread principal está bloqueado devido a tarefas JavaScript de longa execução, executando um `requestAnimationFrame` e calculando o delta entre cada quadro. Se o delta for significativamente maior do que a taxa de quadros da tela, você pode relatá-la como uma tarefa longa. No entanto, esses hacks não são recomendados porque eles afetam o desempenho por si próprios (esgotando a bateria, por exemplo).

A primeira regra da medição de desempenho eficaz é garantir que suas técnicas de medição de desempenho não estejam causando problemas de desempenho por si mesmas. Portanto, para quaisquer métricas personalizadas que você medir em seu site, é melhor usar uma das seguintes APIs, se possível.

### Performance Observer

Entender a API PerformanceObserver é fundamental para a criação de métricas de desempenho customizadas porque é o mecanismo pelo qual você obtém dados de todas as outras APIs de desempenho discutidas neste artigo.

Com o `PerformanceObserver` você pode se inscrever passivamente em eventos relacionados ao desempenho, o que significa que essas APIs geralmente não interferem no desempenho da página, já que seus callbacks geralmente são disparados durante [períodos ociosos](https://w3c.github.io/requestidlecallback/#idle-periods).

Você cria um `PerformanceObserver` passando a ele um callback a ser executado sempre que novas entradas de desempenho forem despachadas. Em seguida, você diz ao observador quais tipos de entradas escutar por meio do método [`observe()`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/observe):

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });

  po.observe({type: 'some-entry-type'});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

As seções abaixo listam todos os vários tipos de entrada disponíveis para observação, mas em navegadores mais recentes você pode inspecionar quais tipos de entrada estão disponíveis por meio da propriedade estática [`PerformanceObserver.supportedEntryTypes`](https://w3c.github.io/performance-timeline/#supportedentrytypes-attribute)

{% Aside %} O objeto passado para o método `observe()` também pode especificar um array `entryTypes` (para observar mais de um tipo de entrada através do mesmo observador). Embora especificar `entryTypes` seja uma alternativa mais antiga com suporte mais amplo por navegadores, atualmente recomenda-se o uso de `type`, já que ele permite especificar configurações de observação adicionais para entradas específicas (como a flag `buffered`, discutido a seguir). {% endAside %}

#### Observando entradas que já aconteceram

Por default, os objetos `PerformanceObserver` só podem observar as entradas conforme elas forem ocorrendo. Isso pode ser problemático se você deseja carregar seu código de análise de desempenho lentamente (para não bloquear recursos de prioridade mais alta).

Para obter entradas históricas (depois de terem ocorrido), defina a flag `buffered` com o valor `true` ao chamar `observe()`. O navegador incluirá entradas históricas de seu [buffer de entradas de desempenho](https://w3c.github.io/performance-timeline/#dfn-performance-entry-buffer) na primeira vez que o callback de `PerformanceObserver` for chamado.

```js
po.observe({
  type: 'some-entry-type',
  buffered: true,
});
```

{% Aside %} Para evitar problemas de memória, o buffer de entrada de desempenho não é ilimitado. Para a maioria dos carregamentos de página típicos, é improvável que o buffer fique cheio e as entradas sejam perdidas. {% endAside %}

#### APIs de desempenho legadas para evitar

Antes da API Performance Observer, os desenvolvedores podiam acessar entradas de desempenho usando os três métodos a seguir, que faziam parte do objeto [`performance`](https://w3c.github.io/performance-timeline/)

- [`getEntries()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntries)
- [`getEntriesByName()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByName)
- [`getEntriesByType()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByType)

Embora essas APIs ainda sejam suportadas, seu uso não é recomendado porque elas não permitem que você monitore quando novas entradas são emitidas. Além disso, muitas novas APIs (como Long Tasks) não são expostas por meio do objeto `performance`; elas são expostas apenas por meio do `PerformanceObserver`.

A menos que você precise especificamente da compatibilidade com o Internet Explorer, é melhor evitar esses métodos em seu código e usar o `PerformanceObserver` daqui em diante.

### API User Timing

A [API User Timing](https://w3c.github.io/user-timing/) é a sua API de medição de propósito geral para métricas baseadas no tempo. Ela permite que você marque pontos no tempo arbitrariamente e depois meça a duração entre essas marcas.

```js
// Record the time immediately before running a task.
performance.mark('myTask:start');
await doMyTask();
// Record the time immediately after running a task.
performance.mark('myTask:end');

// Measure the delta between the start and end of the task
performance.measure('myTask', 'myTask:start', 'myTask:end');
```

Embora APIs como `Date.now()` ou `performance.now()` forneçam habilidades semelhantes, a vantagem de usar a API User Timing é que ela se integra bem às ferramentas de desempenho. Por exemplo, o Chrome DevTools visualiza [medições do User Timing no painel Desempenho](https://developers.google.com/web/updates/2018/04/devtools#tabs), e muitos provedores de análise também irão rastrear automaticamente quaisquer medições que você fizer e enviarão os dados de duração para seu back end de análise.

Para relatar as medidas do User Timing, você pode usar o [PerformanceObserver](#performance-observer) e se registrar para observar as entradas do tipo de `measure`:

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `measure` entries to be dispatched.
  po.observe({type: 'measure', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### API Long Tasks

A [API Long Tasks](https://w3c.github.io/longtasks/) é útil para saber quando o thread principal do navegador está bloqueado por tempo suficiente para afetar a taxa de quadros ou a latência de entrada. Atualmente, a API relatará todas as tarefas executadas por mais de 50 milissegundos (ms).

Sempre que você precisar executar um código caro (ou carregar e executar scripts grandes), é útil rastrear se o código bloqueou ou não o thread principal. Na verdade, muitas métricas de nível superior são construídas sobre a API Long Tasks (como [Time to Interactive - TTI (tempo até a interatividade)](/tti/) e [Total Blocking Time - TBT (tempo total de bloqueio)](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/)).

Para determinar quando as tarefas longas acontecem, você pode usar o [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) e se registrar para observar as entradas do tipo `longtask`:

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `longtask` entries to be dispatched.
  po.observe({type: 'longtask', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### API Element Timing

A métrica [Largest Contentful Paint - LCP (maior renderização de conteúdo)](/lcp/) é útil para saber quando a maior imagem ou bloco de texto foi pintado na tela, mas em alguns casos você deseja medir o tempo de renderização de um elemento diferente.

Para esses casos, você pode usar a [API Element Timing](https://wicg.github.io/element-timing/). Na verdade, a API Largest Contentful Paint é construída sobre a API Element Timing e adiciona relatórios automáticos do maior elemento de conteúdo, mas você pode relatar sobre elementos adicionais acrescentando explicitamente o atributo `elementtiming` a eles e registrando um PerformanceObserver para observar o tipo de entrada do elemento.

```html
<img elementtiming="hero-image" />
<p elementtiming="important-paragraph">This is text I care about.</p>
...
<script>
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `element` entries to be dispatched.
  po.observe({type: 'element', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
</script>
```

{% Aside 'gotchas' %} Os tipos de elementos considerados para a Largest Contentful Paint são os mesmos que podem ser observados por meio da API Element Timing. Se você adicionar o atributo `elementtiming` a um elemento que não seja um desses tipos, o atributo será ignorado. {% endAside %}

### API Event Timing

A métrica [First Input Delay - FID (atraso da primeira entrada)](/fid/) mede o tempo desde o momento em que um usuário interage pela primeira vez com uma página até o momento em que o navegador é finalmente capaz de começar a processar os handlers de eventos em resposta a essa interação. No entanto, em alguns casos, também pode ser útil medir o próprio tempo de processamento do evento, bem como o tempo até que o próximo quadro possa ser renderizado.

Isto é possível com a [API Event Timing](https://wicg.github.io/event-timing/) (que é usada para medir o FID), já que expõe uma série de timestamps no ciclo de vida do evento, incluindo:

- [`startTime`](https://w3c.github.io/performance-timeline/#dom-performanceentry-starttime) : a hora em que o navegador recebe o evento.
- [`processingStart`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart) : o momento em que o navegador pode começar a processar os handlers de eventos, para o evento em questão.
- [`processingEnd`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingend) : hora em que o navegador termina de executar todo o código síncrono iniciado a partir de handlers de eventos, para o evento em questão.
- [`duration`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart) : o tempo (arredondado para 8 ms por motivos de segurança) entre o momento em que o navegador recebe o evento até que seja capaz de pintar o próximo quadro depois de terminar de executar todo o código síncrono iniciado a partir dos handlers de eventos.

O exemplo a seguir mostra como usar esses valores para criar medições personalizadas:

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((entryList) => {
    const firstInput = entryList.getEntries()[0];

    // Measure First Input Delay (FID).
    const firstInputDelay = firstInput.processingStart - firstInput.startTime;

    // Measure the time it takes to run all event handlers
    // Note: this does not include work scheduled asynchronously using
    // methods like `requestAnimationFrame()` or `setTimeout()`.
    const firstInputProcessingTime = firstInput.processingEnd - firstInput.processingStart;

    // Measure the entire duration of the event, from when input is received by
    // the browser until the next frame can be painted after processing all
    // event handlers.
    // Note: similar to above, this value does not include work scheduled
    // asynchronously using `requestAnimationFrame()` or `setTimeout()`.
    // And for security reasons, this value is rounded to the nearest 8ms.
    const firstInputDuration = firstInput.duration;

    // Log these values the console.
    console.log({
      firstInputDelay,
      firstInputProcessingTime,
      firstInputDuration,
    });
  });

  po.observe({type: 'first-input', buffered: true});
} catch (error) {
  // Do nothing if the browser doesn't support this API.
}
```

### API Resource Timing

A [API Resource Timing](https://w3c.github.io/resource-timing/) oferece aos desenvolvedores uma visão detalhada sobre como os recursos de uma página específica foram carregados. Apesar do nome da API, as informações que ela fornece não se limitam apenas aos dados de tempo (embora haja [bastante disso](https://w3c.github.io/resource-timing/#processing-model)). Outros dados que você pode acessar incluem:

- [InittorType](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-initiatortype) : como o recurso foi obtido: por exemplo, através de uma `<script>` ou `<link>` ou de `fetch()`
- [nextHopProtocol](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-nexthopprotocol) : o protocolo usado para buscar o recurso, como `h2` ou `quic`
- [encodedBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-encodedbodysize) / [decodedBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-decodedbodysize) ]: o tamanho do recurso em sua forma codificada ou decodificada (respectivamente)
- [transferSize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-transfersize) : o tamanho do recurso que foi finalmente transferido pela rede. Quando os recursos são resolvidos através do cache, esse valor pode ser muito menor do que `encodedBodySize` e, em alguns casos, pode ser zero (se nenhuma revalidação do cache for necessária).

Observe, você pode usar a propriedade `transferSize` das entradas de tempo de recursos para medir uma métrica de *taxa de acerto de cache* ou talvez até mesmo uma métrica de *tamanho total de recurso em cache*, que pode ser útil para entender como sua estratégia de armazenamento em cache de recursos afeta o desempenho para visitantes repetidos.

O exemplo a seguir registra todos os recursos solicitados pela página e indica se cada recurso foi ou não preenchido por meio do cache.

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // If transferSize is 0, the resource was fulfilled via the cache.
      console.log(entry.name, entry.transferSize === 0);
    }
  });
  // Start listening for `resource` entries to be dispatched.
  po.observe({type: 'resource', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### API Navigation Timing

A [API Navigation Timing](https://w3c.github.io/navigation-timing/) é semelhante à API Resource Timing, mas relata apenas [solicitações de navegação](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests). O tipo de entrada `navigation` também é semelhante ao tipo de entrada `resource`[, mas contém algumas informações adicionais](https://w3c.github.io/navigation-timing/#sec-PerformanceNavigationTiming) específicas para solicitações de navegação (como quando os eventos `DOMContentLoaded` e `load` são acionados).

Uma métrica que muitos desenvolvedores rastreiam para entender o tempo de resposta do servidor ([Time to First Byte](https://en.wikipedia.org/wiki/Time_to_first_byte)) está disponível através da API Navigation Timing - especificamente, é o timestamp `responseStart` da entrada.

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // If transferSize is 0, the resource was fulfilled via the cache.
      console.log('Time to first byte', entry.responseStart);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

Outra métrica que pode interessar aos desenvolvedores que usam o service worker é o tempo de inicialização do service worker para solicitações de navegação. Esta é a quantidade de tempo que leva para o navegador iniciar o thread do service worker antes de começar a interceptar eventos de transferência de dados.

O tempo de inicialização do service worker para uma solicitação de navegação específica pode ser determinado a partir do delta entre `entry.responseStart` e `entry.workerStart` .

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('Service Worker startup time:',
          entry.responseStart - entry.workerStart);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### API Server Timing

A [API Server Timing](https://w3c.github.io/server-timing/) permite que você passe dados de temporização específicos da solicitação de seu servidor para o navegador por meio de cabeçalhos de resposta. Por exemplo, você pode indicar quanto tempo levou para pesquisar dados em um banco de dados para uma solicitação específica - o que pode ser útil na depuração de problemas de desempenho causados por lentidão no servidor.

Para desenvolvedores que usam provedores de análise terceirizados, a API Server Timing é a única maneira de correlacionar os dados de desempenho do servidor com outras métricas de negócios que essas ferramentas analíticas podem estar medindo.

Para especificar os dados de tempo do servidor em suas respostas, você pode usar o cabeçalho de resposta `Server-Timing`. Aqui está um exemplo.

```http
HTTP/1.1 200 OK

Server-Timing: miss, db;dur=53, app;dur=47.2
```

Então, a partir de suas páginas, você pode ler estes dados em ambos as entradas `resource` ou `navigation` das APIs Resource Timing e Navigation Timing.

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Logs all server timing data for this response
      console.log('Server Timing', entry.serverTiming);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```
