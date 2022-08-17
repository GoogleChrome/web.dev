---
title: Use web workers para executar JavaScript a partir do thread principal do navegador
subhead: |2-

  Uma arquitetura fora do thread principal

  pode melhorar expressivamente a solidez do seu aplicativo e a experiência do usuário.
description: |2-

  O thread principal do navegador está incrivelmente sobrecarregado. Ao usar web workers

  para deslocar o código do thread principal, você pode melhorar significativamente

  a confiabilidade e a experiência do usuário do seu aplicativo.
authors:
  - surma
date: 2019-12-05
tags:
  - blog
  - performance
  - test-post
---

Nos últimos 20 anos, a Internet evoluiu drasticamente de documentos estáticos com alguns estilos e imagens para aplicativos complexos e dinâmicos. No entanto, uma coisa permaneceu praticamente intocada: temos apenas um thread por guia do navegador (com algumas exceções) para fazer o trabalho de renderizar nossos sites e executar nosso JavaScript.

Como resultado, o thread principal ficou incrivelmente sobrecarregado. E à medida que os aplicativos da Web crescem em complexidade, o segmento principal se torna um gargalo significativo para o desempenho. Para piorar a situação, a quantidade de tempo que leva para executar o código no thread principal para um determinado usuário é **quase completamente imprevisível** porque os recursos do dispositivo têm um efeito enorme no desempenho. Essa imprevisibilidade só vai crescer à medida que os usuários acessam a web a partir de um conjunto cada vez mais diversificado de dispositivos, de telefones com recursos hiper-restritos a máquinas carro-chefe de alta potência e alta taxa de atualização.

Se quisermos aplicativos da web sofisticados que atendam de forma confiável as diretrizes de desempenho como o [modelo RAIL](/rail/) - que é baseado em dados empíricos sobre a percepção humana e psicologia - precisamos de maneiras de executar nosso código **fora do thread principal (OMT)**.

{% Aside %} Se você quiser saber mais sobre o caso de uma arquitetura OMT, assista minha palestra CDS 2019 abaixo. {% endAside %}

{% YouTube '7Rrv9qFMWNM' %}

## Threading com web workers

Outras plataformas normalmente oferecem suporte para trabalho paralelo, permitindo que você atribua uma função a um thread, que é executado em paralelo com o resto do seu programa. Você pode acessar as mesmas variáveis de ambos os threads, e o acesso a esses recursos compartilhados pode ser sincronizado com exclusões mútuas e semáforos para evitar condições de corrida.

Em JavaScript, podemos obter funcionalidade praticamente semelhante de web workers, que existem desde 2007 e são compatíveis com todos os principais navegadores desde 2012. Web workers são executados em paralelo com o thread principal, mas, ao contrário do threading do SO, eles não podem compartilhar variáveis.

{% Aside %} Não confunda web workers com [service workers](/service-workers-cache-storage) ou [worklets](https://developer.mozilla.org/docs/Web/API/Worklet). Embora os nomes sejam semelhantes, a funcionalidade e os usos são diferentes. {% endAside %}

Para criar um web worker, passe um arquivo para o construtor do worker, que começa a executar esse arquivo em uma thread separada:

```js
const worker = new Worker("./worker.js");
```

Comunique-se com o web worker enviando mensagens por meio da [API `postMessage`](https://developer.mozilla.org/docs/Web/API/Window/postMessage). Passe o valor da mensagem como um parâmetro na `postMessage` e, em seguida, adicione um ouvinte de evento de mensagem ao worker:

<!--lint disable no-duplicate-headings-in-section-->

### `main.js`

```js/1
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
```

### `worker.js`

```js
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
});
```

Para enviar uma mensagem de volta ao thread principal, use a mesma `postMessage` no web worker e configure um ouvinte de evento no thread principal:

### `main.js`

```js/2-4
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
worker.addEventListener("message", event => {
  console.log(event.data);
});
```

### `worker.js`

```js/3
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
  postMessage(a+b);
});
```

É certo que essa abordagem é um tanto limitada. Historicamente, os web workers têm sido usados principalmente para tirar uma única peça de trabalho pesado do thread principal. Tentar lidar com várias operações com um único web worker torna-se difícil rapidamente: você precisa codificar não apenas os parâmetros, mas também a operação na mensagem, e precisa fazer a contabilidade para corresponder as respostas às solicitações. Essa complexidade é provavelmente o motivo pelo qual os web workers não foram adotados de forma mais ampla.

Mas se pudéssemos remover algumas das dificuldades de comunicação entre o thread principal e os web workers, esse modelo poderia ser uma ótima opção para muitos casos de uso. E, felizmente, existe uma biblioteca que faz exatamente isso!

## Comlink: tornando os web workers menos trabalhos

[Comlink](http://npm.im/comlink) é uma biblioteca cujo objetivo é permitir que você use web workers sem ter que se preocupar com os detalhes do `postMessage`. Comlink permite que você compartilhe variáveis entre web workers e o thread principal quase como outras linguagens de programação compatíveis com threading.

Você configura o Comlink importando-o em um web worker e definindo um conjunto de funções para expor ao thread principal. Em seguida, você importa o Comlink no thread principal, envolve o worker e obtém acesso às funções expostas:

### `worker.js`

```js
import {expose} from "comlink";

const api = {
  someMethod() { /* … */ }
}
expose(api);
```

### `main.js`

```js
import {wrap} from "comlink";

const worker = new Worker("./worker.js");
const api = wrap(worker);
```

A `api` no thread principal se comporta da mesma forma que a do web worker, exceto que cada função retorna uma promessa de um valor em vez do valor em si.

## Que código você deve mover para um web worker?

Os web workers não têm acesso ao DOM e a muitas APIs como [WebUSB](https://developer.mozilla.org/docs/Web/API/USB), [WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API) ou [Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API), portanto, você não pode colocar partes do seu aplicativo que dependem desse acesso em um worker. Ainda assim, cada pequena linha de código movida para um worker gera mais espaço no thread principal para coisas que *precisam* estar lá - como atualizar a interface do usuário.

{% Aside %} Restringir o acesso da IU ao thread principal é, na verdade, típico em outras linguagens. Na verdade, tanto o iOS quanto o Android chamam o thread principal de *thread IU*. {% endAside %}

Um problema para os desenvolvedores web é que a maioria dos aplicativos da Web depende de uma estrutura de IU, como Vue ou React, para orquestrar tudo no aplicativo; tudo é um componente da estrutura e, portanto, está inerentemente vinculado ao DOM. Isso parece dificultar a migração para uma arquitetura OMT.

No entanto, se mudarmos para um modelo no qual as questões da IU são separadas de outras questões, como gerenciamento de estado, os web workers podem ser bastante úteis, mesmo com aplicativos baseados em framework. Essa é exatamente a abordagem adotada com PROXX.

## PROXX: um estudo de caso OMT

A equipe do Google Chrome desenvolveu o [PROXX](/load-faster-like-proxx/) como um clone do Campo Minado que atende aos [requisitos do Progressive Web App](https://developers.google.com/web/progressive-web-apps), incluindo trabalhar off-line e ter uma experiência de usuário envolvente. Infelizmente, as primeiras versões do jogo tiveram um desempenho ruim em dispositivos restritos, como feature phones, o que levou a equipe a perceber que o thread principal era um gargalo.

A equipe decidiu usar web workers para separar o estado visual do jogo de sua lógica:

- O thread principal lida com a renderização de animações e transições.
- Um web worker lida com a lógica do jogo, que é puramente computacional.

{% Aside %} Essa abordagem é semelhante ao [padrão](https://facebook.github.io/flux/) Redux Flux, portanto, muitos aplicativos Flux podem ser capazes de migrar facilmente para uma arquitetura OMT. Dê uma olhada [nesta postagem do blog](http://dassur.ma/things/react-redux-comlink/) para ler mais sobre como aplicar OMT a um aplicativo Redux. {% endAside %}

OMT teve efeitos interessantes no desempenho do telefone de recursos da PROXX. Na versão não OMT, a IU é congelada por seis segundos após o usuário interagir com ela. Não há feedback e o usuário tem que esperar seis segundos inteiros antes de poder fazer outra coisa.

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>Tempo de resposta da IU na <strong>versão não OMT</strong> do PROXX.</figcaption></figure>

Na versão OMT, no entanto, o jogo leva *doze* segundos para completar uma atualização da IU. Embora pareça uma perda de desempenho, na verdade leva a um maior feedback para o usuário. A desaceleração ocorre porque o aplicativo está enviando mais frames do que a versão não OMT, que não envia frames. O usuário, portanto, sabe que algo está acontecendo e pode continuar jogando conforme a IU é atualizada, tornando o jogo consideravelmente melhor.

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>Tempo de resposta da IU na <strong>versão OMT</strong> do PROXX.</figcaption></figure>

Esta é uma troca consciente: oferecemos aos usuários de dispositivos restritos uma experiência que se *sente* melhor, sem penalizar os usuários de dispositivos de última geração.

## Implicações de uma arquitetura OMT

Como mostra o exemplo PROXX, OMT torna seu aplicativo executado de forma confiável em uma ampla gama de dispositivos, mas não torna seu aplicativo mais rápido:

- Você está apenas movendo o trabalho do thread principal, não reduzindo o trabalho.
- A sobrecarga de comunicação extra entre o web worker e o thread principal pode às vezes tornar as coisas um pouco mais lentas.

### Considerando as compensações

Como o thread principal está livre para processar as interações do usuário, como rolar enquanto o JavaScript está em execução, há menos frames perdidos, embora o tempo total de espera possa ser um pouco mais longo. Fazer o usuário esperar um pouco é preferível a eliminar um quadro porque a margem de erro é menor para quadros eliminados: a eliminação de um quadro ocorre em milissegundos, enquanto você tem *centenas* de milissegundos antes que o usuário perceba o tempo de espera.

Por causa da imprevisibilidade do desempenho entre os dispositivos, o objetivo da arquitetura OMT é realmente **reduzir o risco -** tornar seu aplicativo mais robusto em face de condições de tempo de execução altamente variáveis - não sobre os benefícios de desempenho da paralelização. O aumento na resiliência e as melhorias na experiência do usuário valem mais do que qualquer pequena compensação em velocidade.

{% Aside %} Os desenvolvedores às vezes se preocupam com o custo de copiar objetos complexos no thread principal e nos web workers. Há mais detalhes na conversa, mas, em geral, você não deve quebrar seu orçamento de desempenho se a representação JSON stringificada do seu objeto for inferior a 10 KB. Se você precisar copiar objetos maiores, considere o uso de [ArrayBuffer](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ou [WebAssembly](https://webassembly.org/). Você pode ler mais sobre esse problema [nesta postagem do blog sobre o desempenho do `postMessage`](https://dassur.ma/things/is-postmessage-slow). {% endAside %}

### Uma nota sobre ferramentas

Os web workers ainda não são tão populares, por isso a maioria das ferramentas de módulo - como [WebPack](https://webpack.js.org/) e [Rollup](https://github.com/rollup/rollup) - não oferece suporte padrão para eles. (Mas o [Parcel](https://parceljs.org/) tem!) Felizmente, há plug-ins para fazer os web workers, bem, *trabalharem* com WebPack e Rollup:

- [plug-in de worker](https://github.com/GoogleChromeLabs/worker-plugin) para WebPack
- [rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread) para Rollup

## Resumo

Para garantir que nossos aplicativos sejam tão confiáveis e acessíveis quanto possível, especialmente em um mercado cada vez mais globalizado, precisamos oferecer suporte a dispositivos restritos - eles são a forma como a maioria dos usuários acessa a web globalmente. OMT oferece uma maneira promissora de aumentar o desempenho em tais dispositivos sem afetar adversamente os usuários de dispositivos de última geração.

Além disso, OMT tem benefícios secundários:

- Ele move os custos de execução do JavaScript para um thread separado.
- Ele move os *custos de análise*, o que significa que a IU pode inicializar mais rápido. Isso pode reduzir o [First Contentful Paint](/fcp/) ou mesmo o [Time to Interactive](/tti/), o que pode, por sua vez, aumentar sua pontuação no [Lighthouse.](https://developer.chrome.com/docs/lighthouse/overview/)

Os web workers não precisam ser assustadores. Ferramentas como o Comlink estão tirando o trabalho dos workers e tornando-os uma escolha viável para uma ampla gama de aplicativos da Web.
