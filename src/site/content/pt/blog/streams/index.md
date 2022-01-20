---
title: Fluxos   - o guia definitivo
subhead: Aprenda a usar fluxos legíveis, graváveis e de transformação com a API Streams.
description: |2

  A API Streams permite que o JavaScript acesse programaticamente fluxos de dados recebidos no

  rede e processá-los conforme desejado.
authors:
  - thomassteiner
date: 2021-02-19
updated: 2021-02-25
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/TuciUuOQOd3u7uMgDZBi.jpg
alt: Um riacho na floresta com folhas coloridas caídas.
tags:
  - blog
  - capabilities
---

A API Streams permite que você acesse programaticamente fluxos de dados recebidos pela rede ou criados por qualquer meio localmente e processe-os com JavaScript. O streaming envolve a divisão de um recurso que você deseja receber, enviar ou transformar em pequenos blocos e, em seguida, seu processamento gradual. Embora streaming seja algo que os navegadores fazem de qualquer maneira ao receber ativos como HTML ou vídeos para serem exibidos em páginas da web, esse recurso nunca esteve disponível para JavaScript antes do `fetch` com fluxos ser introduzido em 2015.

{% Aside %} O streaming era tecnicamente possível com `XMLHttpRequest`, mas [não era bonito](https://gist.github.com/igrigorik/5736866). {% endAside %}

Anteriormente, se quisesse processar um recurso de algum tipo (seja um vídeo ou um arquivo de texto, etc.), você teria que baixar o arquivo inteiro, esperar que ele fosse desserializado em um formato adequado e, em seguida, processá-lo. Com os streams disponíveis para JavaScript, tudo isso muda. Agora você pode processar dados brutos com JavaScript progressivamente assim que estiverem disponíveis no cliente, sem a necessidade de gerar um buffer, string ou blob. Isso possibilita uma série de casos de uso, confira alguns abaixo:

- **Efeitos de vídeo:** canalizar um fluxo de vídeo legível por meio de um fluxo de transformação que aplica efeitos em tempo real.
- **(Des)compactação de dados:** canalizar um fluxo de arquivos por meio de um fluxo de transformação que o (des)compacta seletivamente.
- **Decodificação de imagem:** canalizar um fluxo de resposta HTTP por meio de um fluxo de transformação que decodifica bytes e os transforma em dados de bitmap e, em seguida, por meio de outro fluxo de transformação que traduz bitmaps em PNGs. Se instalado dentro do `fetch` de um trabalho de serviço, isso permite que você faça um polyfill transparente de novos formatos de imagem, como AVIF.

## Conceitos centrais

Antes de entrar em detalhes sobre os vários tipos de fluxo, vou apresentar alguns conceitos básicos.

### Pedaços

Um bloco é um **único dado** que é gravado ou lido de um fluxo. Pode ser de qualquer tipo. Os fluxos podem até conter pedaços de diferentes tipos. Na maioria das vezes, um bloco não será a unidade de dados mais atômica para um determinado fluxo. Por exemplo, um fluxo de bytes pode conter blocos consistindo em `Uint8Array` de 16 KiB em vez de bytes únicos.

### Fluxos legíveis

Um fluxo legível representa uma fonte de dados da qual você pode ler. Em outras palavras, os dados **vêm** de um fluxo legível. Concretamente, um fluxo legível é uma instância da classe `ReadableStream`.

### Streams graváveis

Um fluxo gravável representa um destino para dados nos quais você pode gravar. Em outras palavras, os dados **vão** para um fluxo gravável. Concretamente, um fluxo gravável é uma instância da classe `WritableStream`.

### Transformar fluxos

Um stream de transformação consiste em um **par de streams**: um stream gravável, conhecido como seu lado gravável, e um stream legível, conhecido como seu lado legível. Uma metáfora do mundo real para isso seria um [intérprete simultâneo](https://en.wikipedia.org/wiki/Simultaneous_interpretation), que traduz de um idioma para outro instantaneamente. De uma maneira específica para o fluxo de transformação, a gravação no lado gravável resulta em novos dados sendo disponibilizados para leitura no lado legível. Concretamente, qualquer objeto com uma propriedade `writable` e uma propriedade `readable` pode servir como um fluxo de transformação. No entanto, a classe `TransformStream` padrão torna mais fácil criar esse par que está devidamente envolvido.

### Cadeia de tubos

Os fluxos são usados principalmente para **canalizá-los** uns para os outros. Um fluxo legível pode ser canalizado diretamente para um fluxo gravável, usando o método `pipeTo()` do fluxo legível, ou pode ser canalizado por meio de um ou mais fluxos de transformação primeiro, usando o método `pipeThrough()`. Um **conjunto de fluxos canalizados** dessa forma é conhecido como uma cadeia de tubos.

### Contrapressão

Uma vez que uma cadeia de tubos é construída, ela propagará sinais sobre quão rápido os pedaços devem fluir por ela. Se alguma etapa na cadeia ainda não puder aceitar os pedaços, ela propaga um sinal de volta através da cadeia de tubos, até que a fonte original seja instruída a parar de produzir pedaços tão rápido. Este processo de **normalização do fluxo** é denominado contrapressão.

### Divisão em T

Um fluxo legível pode ser lido (nomeado após a forma de um "T" maiúsculo) usando seu método `tee()`. Isso **bloqueará** o fluxo, ou seja, não o tornará mais diretamente utilizável. No entanto, ele criará **dois novos fluxos**, chamados ramificações, que podem ser consumidos independentemente. Teeing também é importante porque os fluxos não podem ser retrocedidos ou reiniciados. Veremos mais sobre isso mais tarde.

<figure><comment data-md-type="comment"></comment>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/M70SLIvXhMkYfxDm5b98.svg", alt="Diagrama de uma cadeia de tubos, que consiste em um fluxo legível proveniente de uma chamada para a API fetch, sendo canalizado por meio de um fluxo de transformação com saída dividida em T e depois enviado ao navegador, para o primeiro fluxo legível resultante, e ao cache do trabalho de serviço, para o segundo fluxo legível resultante.", width="800", height="430" %}<figcaption>. Uma cadeia de tubos.</figcaption></figure>

## A mecânica de um fluxo legível

Um fluxo legível é uma fonte de dados representada em JavaScript por um objeto [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream) que flui de uma fonte subjacente. O construtor [`ReadableStream()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream) cria e retorna um objeto de fluxo legível dos manipuladores fornecidos. Existem dois tipos de fonte subjacente:

- **As fontes** push enviam constantemente ao acessá-las e dependem de você iniciar, pausar ou cancelar o acesso ao fluxo. Os exemplos incluem fluxos de vídeo ao vivo, eventos enviados pelo servidor ou WebSockets.
- **As fontes pull** exigem que você solicite explicitamente os dados delas ao se conectar. Os exemplos incluem operações HTTP por meio de chamadas `fetch()` ou `XMLHttpRequest`.

Os dados de fluxo são lidos sequencialmente em pequenos pedaços chamados **blocos** . Diz-se que os pedaços colocados em um riacho estão **enfileirados**. Isso significa que eles estão esperando em uma fila para serem lidos. Uma **fila interna** controla os pedaços que ainda não foram lidos.

Uma **estratégia de enfileiramento** é um objeto que determina como um fluxo deve sinalizar contrapressão com base no estado de sua fila interna. A estratégia de enfileiramento atribui um tamanho a cada pedaço e compara o tamanho total de todos os pedaços na fila a um número especificado, conhecido como **limite superior**.

Os pedaços dentro do fluxo são lidos por um **leitor** . Este leitor recupera os dados um pedaço de cada vez, permitindo que você faça qualquer tipo de operação que desejar. O leitor mais o outro código de processamento que o acompanha é chamado de **consumidor**.

O próximo constructo neste contexto é chamado de **controlador**. Cada fluxo legível tem um controlador associado que, como o nome sugere, permite que você controle o fluxo.

Apenas um leitor pode ler um fluxo de cada vez. Quando um leitor é criado e começa a ler um fluxo (ou seja, torna-se um **leitor ativo**), o fluxo é **bloqueado** para ele. Se quiser um outro leitor para continuar a ler o seu fluxo, normalmente você precisa **liberar** o primeiro leitor antes de fazer qualquer outra coisa (embora você possa dividir os fluxos em **T**).

### Criação de um fluxo legível

Você cria um fluxo legível chamando seu construtor [`ReadableStream()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream). O construtor tem um argumento opcional `underlyingSource`, que representa um objeto com métodos e propriedades que definem como a instância de fluxo construída se comportará.

#### O `underlyingSource`

Esse argumento pode usar os seguintes métodos opcionais definidos pelo desenvolvedor:

- `start(controller)`: chamado imediatamente quando o objeto é construído. O método pode acessar a fonte do fluxo e fazer qualquer outra coisa necessária para configurar a funcionalidade do fluxo. Se esse processo for feito de forma assíncrona, o método pode retornar uma promessa de sinalizar sucesso ou falha. O parâmetro `controller` passado para este método é um [`ReadableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController).
- `pull(controller)`: pode ser usado para controlar o fluxo conforme mais pedaços são buscados. Ele é chamado repetidamente, desde que a fila interna de pedaços do fluxo não esteja cheia, até que a fila alcance seu limite superior. Se o resultado de chamar `pull()` for uma promessa, `pull()` não será chamado novamente até que a promessa seja cumprida. Se a promessa for rejeitada, o fluxo se tornará um erro.
- `cancel(reason)`: chamado quando o consumidor do fluxo o cancela.

```js
const readableStream = new ReadableStream({
  start(controller) {
    /* … */
  },

  pull(controller) {
    /* … */
  },

  cancel(reason) {
    /* … */
  },
});
```

O `ReadableStreamDefaultController` oferece suporte aos seguintes métodos:

- [`ReadableStreamDefaultController.close()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/close) fecha o fluxo associado.
- [`ReadableStreamDefaultController.enqueue()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/enqueue) enfileira um determinado pedaço no fluxo associado.
- [`ReadableStreamDefaultController.error()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/error) causa erro em qualquer interação futura com o fluxo associado.

```js
/* … */
start(controller) {
  controller.enqueue('The first chunk!');
},
/* … */
```

#### O `queuingStrategy`

O segundo argumento, também opcional, do construtor `ReadableStream()` `queuingStrategy`. É um objeto que opcionalmente define uma estratégia de enfileiramento para o fluxo, que leva dois parâmetros:

- `highWaterMark`: um número não negativo que indica a marca d'água alta do fluxo usando esta estratégia de enfileiramento.
- `size(chunk)`: uma função que calcula e retorna o tamanho não negativo finito do valor do pedaço fornecido. O resultado é usado para determinar a contrapressão, manifestando-se por meio da propriedade `ReadableStreamDefaultController.desiredSize` Ele também controla quando o método `pull()` da origem subjacente é chamado.

```js
const readableStream = new ReadableStream({
    /* … */
  },
  {
    highWaterMark: 10,
    size(chunk) {
      return chunk.length;
    },
  },
);
```

{% Aside %} Você pode definir seu próprio `queuingStrategy` personalizado ou usar uma instância de [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/ByteLengthQueuingStrategy) ou [`CountQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/CountQueuingStrategy) para o valor deste objeto. Se nenhuma `queuingStrategy` for fornecida, o padrão usado é o mesmo que `CountQueuingStrategy` com `highWaterMark` de `1`. {% endAside %}

#### Os métodos `getReader()` e `read()`

Para ler de um fluxo legível, você precisa de um leitor, que será um [`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader) . O método `getReader()` do `ReadableStream` cria um leitor e bloqueia o fluxo nele. Enquanto o fluxo está bloqueado, nenhum outro leitor pode ser adquirido até que seja liberado.

O método [`read()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read) da interface `ReadableStreamDefaultReader` retorna uma promessa de acesso ao próximo bloco na fila interna do fluxo. Ele atende ou rejeita um resultado dependendo do estado do fluxo. As diferentes possibilidades são as seguintes:

- Se um pedaço estiver disponível, a promessa será cumprida com um objeto do formulário<br> `{ value: chunk, done: false }`.
- Se o fluxo for fechado, a promessa será cumprida com um objeto do formulário<br> `{ value: undefined, done: true }`.
- Se o stream apresentar um erro, a promessa será rejeitada com o erro relevante.

```js
const reader = readableStream.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    console.log('The stream is done.');
    break;
  }
  console.log('Just read a chunk:', value);
}
```

#### A propriedade `locked`

Você pode verificar se um fluxo legível está bloqueado acessando sua propriedade [`ReadableStream.locked`](https://developer.mozilla.org/docs/Web/API/ReadableStream/locked).

```js
const locked = readableStream.locked;
console.log(`The stream is ${locked ? 'indeed' : 'not'} locked.`);
```

### Amostras de código de fluxo legível

O exemplo de código abaixo mostra todas as etapas em ação. Primeiro, você cria um `ReadableStream` que em seu `underlyingSource` (ou seja, a classe `TimestampSource`) define um método `start()`. Este método diz ao `controller` do fluxo para `enqueue()` um timestamp a cada segundo, durante dez segundos. Finalmente, ele diz ao controlador para `close()` o fluxo. Você consome esse fluxo criando um leitor por meio do método `getReader()` e chamando `read()` até que o fluxo seja `done`.

```js
class TimestampSource {
  #interval

  start(controller) {
    this.#interval = setInterval(() => {
      const string = new Date().toLocaleTimeString();
      // Add the string to the stream.
      controller.enqueue(string);
      console.log(`Enqueued ${string}`);
    }, 1_000);

    setTimeout(() => {
      clearInterval(this.#interval);
      // Close the stream after 10s.
      controller.close();
    }, 10_000);
  }

  cancel() {
    // This is called if the reader cancels.
    clearInterval(this.#interval);
  }
}

const stream = new ReadableStream(new TimestampSource());

async function concatStringStream(stream) {
  let result = '';
  const reader = stream.getReader();
  while (true) {
    // The `read()` method returns a promise that
    // resolves when a value has been received.
    const { done, value } = await reader.read();
    // Result objects contain two properties:
    // `done`  - `true` if the stream has already given you all its data.
    // `value` - Some data. Always `undefined` when `done` is `true`.
    if (done) return result;
    result += value;
    console.log(`Read ${result.length} characters so far`);
    console.log(`Most recently read chunk: ${value}`);
  }
}
concatStringStream(stream).then((result) => console.log('Stream complete', result));
```

### Iteração assíncrona

Verificar em cada iteração de loop `read()` se o fluxo está `done` pode não ser a API mais conveniente. Felizmente, em breve haverá uma maneira melhor de fazer isso: iteração assíncrona.

```js
for await (const chunk of stream) {
  console.log(chunk);
}
```

{% Aside 'caution' %} A iteração assíncrona ainda não foi implementada em nenhum navegador. {% endAside %}

Uma solução alternativa para usar a iteração assíncrona hoje é implementar o comportamento com uma função auxiliar. Isso permite que você use o recurso em seu código, conforme mostrado no snippet abaixo.

```js
function streamAsyncIterator(stream) {
  // Get a lock on the stream:
  const reader = stream.getReader();

  return {
    next() {
      // Stream reads already resolve with {done, value}, so
      // we can just call read:
      return reader.read();
    },
    return() {
      // Release the lock if the iterator terminates.
      reader.releaseLock();
      return {};
    },
    // for-await calls this on whatever it's passed, so
    // iterators tend to return themselves.
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

async function example() {
  const response = await fetch(url);
  for await (const chunk of streamAsyncIterator(response.body)) {
    console.log(chunk);
  }
}
```

### Divisão em T de um fluxo legível

O método [`tee()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/tee) da interface  `ReadableStream` mostra o fluxo legível atual, retornando uma matriz de dois elementos contendo as duas ramificações resultantes como novas instâncias `ReadableStream`. Isso permite que dois leitores leiam um fluxo simultaneamente. Você pode fazer isso, por exemplo, em um trabalho de serviço se quiser buscar uma resposta do servidor e transmiti-la para o navegador, mas também transmiti-la para o cache do trabalho de serviço. Como um corpo de resposta não pode ser consumido mais de uma vez, você precisa de duas cópias para fazer isso. Para cancelar o fluxo, você precisa cancelar as duas ramificações resultantes. Dividir um fluxo em T geralmente irá bloqueá-lo por toda a duração, evitando que outros leitores o bloqueiem.

```js
const readableStream = new ReadableStream({
  start(controller) {
    // Called by constructor.
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // Called `read()` when the controller's queue is empty.
    console.log('[pull]');
    controller.enqueue('d');
    controller.close();
  },
  cancel(reason) {
    // Called when the stream is canceled.
    console.log('[cancel]', reason);
  },
});

// Create two `ReadableStream`s.
const [streamA, streamB] = readableStream.tee();

// Read streamA iteratively one by one. Typically, you
// would not do it this way, but you certainly can.
const readerA = streamA.getReader();
console.log('[A]', await readerA.read()); //=> {value: "a", done: false}
console.log('[A]', await readerA.read()); //=> {value: "b", done: false}
console.log('[A]', await readerA.read()); //=> {value: "c", done: false}
console.log('[A]', await readerA.read()); //=> {value: "d", done: false}
console.log('[A]', await readerA.read()); //=> {value: undefined, done: true}

// Read streamB in a loop. This is the more common way
// to read data from the stream.
const readerB = streamB.getReader();
while (true) {
  const result = await readerB.read();
  if (result.done) break;
  console.log('[B]', result);
}
```

## Fluxos de bytes legíveis

Para fluxos que representam bytes, uma versão estendida do fluxo legível é fornecida para manipular bytes com eficiência, em particular, minimizando cópias. Os fluxos de bytes permitem a aquisição de leitores traga seu próprio buffer (BYOB). A implementação padrão pode fornecer uma variedade de saídas diferentes, como strings ou buffers de array no caso de WebSockets, enquanto os fluxos de bytes garantem a saída de bytes. Além disso, os leitores BYOB têm benefícios de estabilidade. Isso ocorre porque, se um buffer for desconectado, ele pode garantir que não se grave no mesmo buffer duas vezes, evitando, portanto, condições de corrida. Os leitores BYOB podem reduzir o número de vezes que o navegador precisa executar a coleta de lixo, porque ele pode reutilizar buffers.

### Criação de um fluxo de bytes legível

Você pode criar um fluxo de bytes legível passando um parâmetro `type` adicional para o construtor `ReadableStream()`.

```js
new ReadableStream({ type: 'bytes' });
```

#### O `underlyingSource`

A fonte subjacente de um fluxo de bytes legível recebe um `ReadableByteStreamController` para manipular. Seu método `ReadableByteStreamController.enqueue()` recebe um argumento `chunk` cujo valor é um `ArrayBufferView`. A propriedade `ReadableByteStreamController.byobRequest` retorna a solicitação de pull BYOB atual ou null se não houver nenhuma. Finalmente, a propriedade  `ReadableByteStreamController.desiredSize` retorna o tamanho desejado para preencher a fila interna do fluxo controlado.

### O `queuingStrategy`

O segundo argumento, também opcional, do construtor `ReadableStream()` é o `queuingStrategy` . É um objeto que define opcionalmente uma estratégia de enfileiramento para o fluxo, que leva um parâmetro:

- `highWaterMark`: um número não negativo de bytes indicando a marca d'água alta do fluxo usando esta estratégia de enfileiramento. Isso é usado para determinar a contrapressão, manifestando-se por meio da propriedade `ReadableByteStreamController.desiredSize`. Também controla quando o método `pull()` da origem subjacente é chamado.

{% Aside %} Ao contrário das estratégias de enfileiramento para outros tipos de fluxo, uma estratégia de enfileiramento para um fluxo de bytes legível não tem uma função `size(chunk)`  O tamanho de cada bloco é sempre determinado por sua propriedade `byteLength`. {% endAside %}

{% Aside %} Se nenhuma `queuingStrategy` for fornecida, o padrão usado é aquele com `highWaterMark` de `0`. {% endAside %}

#### Os métodos `getReader()` e `read()`

Você pode então obter acesso a um `ReadableStreamBYOBReader` definindo o parâmetro `mode` apropriadamente: `ReadableStream.getReader({ mode: "byob" })`. Isso permite um controle mais preciso sobre a alocação do buffer para evitar cópias. Para ler o fluxo de bytes, você precisa chamar `ReadableStreamBYOBReader.read(view)`, em que `view` é um [`ArrayBufferView`](https://developer.mozilla.org/docs/Web/API/ArrayBufferView).

#### Amostra de código de fluxo de bytes legível

```js
const reader = readableStream.getReader({ mode: "byob" });

let startingAB = new ArrayBuffer(1_024);
const buffer = await readInto(startingAB);
console.log("The first 1024 bytes, or less:", buffer);

async function readInto(buffer) {
  let offset = 0;

  while (offset < buffer.byteLength) {
    const { value: view, done } =
        await reader.read(new Uint8Array(buffer, offset, buffer.byteLength - offset));
    buffer = view.buffer;
    if (done) {
      break;
    }
    offset += view.byteLength;
  }

  return buffer;
}
```

A função a seguir retorna fluxos de bytes legíveis que permitem a leitura eficiente de cópia zero de uma matriz gerada aleatoriamente. Em vez de usar um tamanho de bloco predeterminado de 1.024, ele tenta preencher o buffer fornecido pelo desenvolvedor, permitindo o controle total.

```js
const DEFAULT_CHUNK_SIZE = 1_024;

function makeReadableByteStream() {
  return new ReadableStream({
    type: 'bytes',

    pull(controller) {
      // Even when the consumer is using the default reader,
      // the auto-allocation feature allocates a buffer and
      // passes it to us via `byobRequest`.
      const view = controller.byobRequest.view;
      view = crypto.getRandomValues(view);
      controller.byobRequest.respond(view.byteLength);
    },

    autoAllocateChunkSize: DEFAULT_CHUNK_SIZE,
  });
}
```

## A mecânica de um fluxo gravável

Um fluxo gravável é um destino no qual você pode gravar dados, representados em JavaScript por um objeto [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream). Isso funciona como uma abstração sobre o **coletor subjacente** - um coletor de E/S de nível inferior no qual os dados brutos são gravados.

Os dados são gravados no stream por meio de um **gravador**, um pedaço de cada vez. Um pedaço pode assumir várias formas, assim como os pedaços em um leitor. Você pode usar qualquer código que desejar para produzir os pedaços prontos para gravação; o gravador mais o código associado é chamado de **produtor**.

Quando um gravador é criado e começa a gravar em um fluxo (um **gravador ativo**), diz-se que está **bloqueado** para ele. Apenas um gravador pode gravar em um fluxo gravável por vez. Se você quiser que outro redator comece a gravar em seu fluxo, normalmente precisará liberá-lo antes de anexar outro redator a ele.

Uma **fila interna** rastreia os blocos que foram gravados no fluxo, mas ainda não foram processados pelo coletor subjacente.

Uma **estratégia de enfileiramento** é um objeto que determina como um fluxo deve sinalizar contrapressão com base no estado de sua fila interna. A estratégia de enfileiramento atribui um tamanho a cada pedaço e compara o tamanho total de todos os pedaços na fila a um número especificado, conhecido como **limite superior**.

A construção final é chamada de **controlador**. Cada fluxo gravável possui um controlador associado que permite controlar o fluxo (por exemplo, para abortá-lo).

### Criação de um fluxo gravável

A interface [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream) da API Streams fornece uma abstração padrão para gravar dados de streaming em um destino, conhecido como coletor. Este objeto vem com contrapressão e enfileiramento integrados. Você cria um fluxo gravável chamando seu construtor [`WritableStream()`](https://developer.mozilla.org/docs/Web/API/WritableStream/WritableStream). Ele tem um parâmetro `underlyingSink`, que representa um objeto com métodos e propriedades que definem como a instância de fluxo construída se comportará.

#### O `underlyingSink`

O `underlyingSink` pode incluir os seguintes métodos opcionais definidos pelo desenvolvedor. O parâmetro `controller` passado para alguns dos métodos é um [`WritableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController).

- `start(controller)`: este método é chamado imediatamente quando o objeto é construído. O conteúdo desse método deve ter como objetivo obter acesso ao coletor subjacente. Se esse processo for feito de forma assíncrona, ele pode retornar uma promessa de sinalizar sucesso ou falha.
- `write(chunk, controller)`: este método será chamado quando um novo parâmetro chunk de dados (especificado no `chunk`) estiver pronto para ser escrito no coletor subjacente. Ele pode retornar uma promessa de sinalizar o sucesso ou a falha da operação de gravação. Esse método será chamado apenas depois que as gravações anteriores forem bem-sucedidas e nunca depois que o fluxo for fechado ou abortado.
- `close(controller)`: este método será chamado se o aplicativo sinalizar que concluiu a gravação de blocos no fluxo. O conteúdo deve fazer o que for necessário para finalizar as gravações no coletor subjacente e liberar o acesso a ele. Se esse processo for assíncrono, ele pode retornar uma promessa de sinalizar sucesso ou falha. Este método será chamado somente depois que todas as gravações enfileiradas forem bem-sucedidas.
- `abort(reason)`: este método será chamado se o app sinalizar que deseja fechar abruptamente o fluxo e colocá-lo em um estado de erro. Ele pode limpar qualquer recurso retido, bem como `close()`, mas `abort()` será chamado mesmo se as gravações estiverem enfileiradas. Esses pedaços serão jogados fora. Se esse processo for assíncrono, ele pode retornar uma promessa de sinalizar sucesso ou falha. O parâmetro `reason` contém um `DOMString` descrevendo por que o fluxo foi abortado.

```js
const writableStream = new WritableStream({
  start(controller) {
    /* … */
  },

  write(chunk, controller) {
    /* … */
  },

  close(controller) {
    /* … */
  },

  abort(reason) {
    /* … */
  },
});
```

A interface [`WritableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController) da API Streams representa um controlador que permite o controle do estado de `WritableStream` durante a configuração, conforme mais fragmentos são enviados para gravação ou no final da gravação. Ao construir um `WritableStream`, o coletor subjacente recebe uma instância `WritableStreamDefaultController` correspondente para manipular. O `WritableStreamDefaultController` tem apenas um método: [`WritableStreamDefaultController.error()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController/error), que causa erro em qualquer interação futura com o fluxo associado.

```js
/* … */
write(chunk, controller) {
  try {
    // Try to do something dangerous with `chunk`.
  } catch (error) {
    controller.error(error.message);
  }
},
/* … */
```

#### The `queuingStrategy`

O segundo argumento, também opcional, do construtor `WritableStream()` é o `queuingStrategy`. É um objeto que opcionalmente define uma estratégia de enfileiramento para o fluxo, que leva dois parâmetros:

- `highWaterMark`: um número não negativo que indica a marca d'água alta do fluxo usando esta estratégia de enfileiramento.
- `size(chunk)`: uma função que calcula e retorna o tamanho não negativo finito do valor do pedaço fornecido. O resultado é usado para determinar a contrapressão, manifestando-se por meio da propriedade `WritableStreamDefaultWriter.desiredSize`.

{% Aside %} Você pode definir seu próprio `queuingStrategy` personalizado ou usar uma instância de [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/ByteLengthQueuingStrategy) ou [`CountQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/CountQueuingStrategy) para este valor de objeto. Se nenhuma `queuingStrategy` for fornecida, o padrão usado é o mesmo que `CountQueuingStrategy` com `highWaterMark` de `1`. {% endAside %}

#### Os métodos `getWriter()` e `write()`

Para gravar em um fluxo gravável, você precisa de um gravador, que será um `WritableStreamDefaultWriter`. O método `getWriter()` da interface `WritableStream` devolve uma nova instância de `WritableStreamDefaultWriter` e bloqueia o fluxo para essa instância. Enquanto o fluxo está bloqueado, nenhum outro gravador pode ser adquirido até que o atual seja liberado.

O método [`write()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write) da interface [`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter) grava um bloco de dados passado em um `WritableStream` e seu coletor subjacente e, em seguida, retorna uma promessa que resolve indicar o sucesso ou falha da operação de gravação. Observe que o que "sucesso" significa depende do coletor subjacente; pode indicar que o trecho foi aceito e não necessariamente que foi salvo com segurança em seu destino final.

```js
const writer = writableStream.getWriter();
const resultPromise = writer.write('The first chunk!');
```

#### A propriedade `locked`

Você pode verificar se um fluxo gravável está bloqueado acessando sua propriedade [`WritableStream.locked`](https://developer.mozilla.org/docs/Web/API/WritableStream/locked).

```js
const locked = writableStream.locked;
console.log(`The stream is ${locked ? 'indeed' : 'not'} locked.`);
```

### Amostra de código de fluxo gravável

O exemplo de código abaixo mostra todas as etapas em ação.

```js
const writableStream = new WritableStream({
  start(controller) {
    console.log('[start]');
  },
  async write(chunk, controller) {
    console.log('[write]', chunk);
    // Wait for next write.
    await new Promise((resolve) => setTimeout(() => {
      document.body.textContent += chunk;
      resolve();
    }, 1_000));
  },
  close(controller) {
    console.log('[close]');
  },
  abort(reason) {
    console.log('[abort]', reason);
  },
});

const writer = writableStream.getWriter();
const start = Date.now();
for (const char of 'abcdefghijklmnopqrstuvwxyz') {
  // Wait to add to the write queue.
  await writer.ready;
  console.log('[ready]', Date.now() - start, 'ms');
  // The Promise is resolved after the write finishes.
  writer.write(char);
}
await writer.close();
```

### Canalização de um fluxo legível para um fluxo gravável

Um fluxo legível pode ser canalizado para um fluxo gravável por meio do método [`pipeTo()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeTo) do fluxo. `ReadableStream.pipeTo()` canaliza o `ReadableStream` atual para um determinado `WritableStream` e retorna uma promessa que é cumprida quando o processo de canalização é concluído com êxito ou rejeita se algum erro for encontrado.

```js
const readableStream = new ReadableStream({
  start(controller) {
    // Called by constructor.
    console.log('[start readable]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // Called when controller's queue is empty.
    console.log('[pull]');
    controller.enqueue('d');
    controller.close();
  },
  cancel(reason) {
    // Called when the stream is canceled.
    console.log('[cancel]', reason);
  },
});

const writableStream = new WritableStream({
  start(controller) {
    // Called by constructor
    console.log('[start writable]');
  },
  async write(chunk, controller) {
    // Called upon writer.write()
    console.log('[write]', chunk);
    // Wait for next write.
    await new Promise((resolve) => setTimeout(() => {
      document.body.textContent += chunk;
      resolve();
    }, 1_000));
  },
  close(controller) {
    console.log('[close]');
  },
  abort(reason) {
    console.log('[abort]', reason);
  },
});

await readableStream.pipeTo(writableStream);
console.log('[finished]');
```

## Criação de um fluxo de transformação

A interface `TransformStream` da API Streams representa um conjunto de dados transformáveis. Você cria um fluxo de transformação chamando seu construtor `TransformStream()`, que cria e retorna um objeto de fluxo de transformação dos manipuladores fornecidos. O construtor `TransformStream()` aceita como seu primeiro argumento um objeto JavaScript opcional que representa o `transformer`. Esses objetos podem conter qualquer um dos seguintes métodos:

### O `transformer`

- `start(controller)`: este método é chamado imediatamente quando o objeto é construído. Normalmente, isso é usado para enfileirar blocos de prefixo, usando `controller.enqueue()`. Esses pedaços serão lidos do lado legível, mas não dependem de nenhuma gravação no lado gravável. Se esse processo inicial for assíncrono, por exemplo, porque leva algum esforço para adquirir os blocos de prefixo, a função pode retornar uma promessa de sinalizar sucesso ou falha; uma promessa rejeitada causará um erro no fluxo. Quaisquer exceções lançadas serão lançadas novamente pelo construtor `TransformStream()`.
- `transform(chunk, controller)`: este método é chamado quando um novo pedaço gravado originalmente no lado gravável está pronto para ser transformado. A implementação do fluxo garante que essa função será chamada somente depois que as transformações anteriores forem bem-sucedidas e nunca antes de `start()` ter sido concluído ou depois de `flush()` ter sido chamado. Esta função executa o trabalho de transformação real do fluxo de transformação. Pode enfileirar os resultados usando `controller.enqueue()`. Isso permite que um único pedaço gravado no lado gravável resulte em zero ou vários pedaços no lado legível, dependendo de quantas vezes o `controller.enqueue()` é chamado. Se o processo de transformação for assíncrono, essa função pode retornar uma promessa de sinalizar o sucesso ou o fracasso da transformação. Uma promessa rejeitada causará um erro nos lados legível e gravável do fluxo de transformação. Se nenhum método `transform()` for fornecido, a transformação de identidade será usada, que enfileira os pedaços inalterados do lado gravável para o legível.
- `flush(controller)`: este método é chamado depois que todos os pedaços gravados no lado gravável foram transformados passando com sucesso por `transform()` e o lado gravável está prestes a ser fechado. Normalmente, isso é usado para enfileirar pedaços de sufixo no lado legível, antes que ele também seja fechado. Se o processo de liberação for assíncrono, a função pode retornar uma promessa de sinalizar sucesso ou falha. O resultado será comunicado ao chamador de `stream.writable.write()`. Além disso, uma promessa rejeitada causará um erro nos lados legível e gravável do fluxo. Lançar uma exceção é tratado da mesma forma que retornar uma promessa rejeitada.

```js
const transformStream = new TransformStream({
  start(controller) {
    /* … */
  },

  transform(chunk, controller) {
    /* … */
  },

  flush(controller) {
    /* … */
  },
});
```

### As estratégias de enfileiramento `writableStrategy` e `readableStrategy`

O segundo e o terceiro parâmetros opcionais do construtor `TransformStream()` são as estratégias de enfileiramento `writableStrategy` e `readableStrategy`. Eles são definidos conforme descrito nas seções de fluxo [legível](#the-queuingstrategy) e [gravável, respectivamente.](#the-queuingstrategy-3)

### Amostra de código de fluxo de transformação

O exemplo de código a seguir mostra um fluxo de transformação simples em ação.

```js
// Note that `TextEncoderStream` and `TextDecoderStream` exist now.
// This example shows how you would have done it before.
const textEncoderStream = new TransformStream({
  transform(chunk, controller) {
    console.log('[transform]', chunk);
    controller.enqueue(new TextEncoder().encode(chunk));
  },
  flush(controller) {
    console.log('[flush]');
    controller.terminate();
  },
});

(async () => {
  const readStream = textEncoderStream.readable;
  const writeStream = textEncoderStream.writable;

  const writer = writeStream.getWriter();
  for (const char of 'abc') {
    writer.write(char);
  }
  writer.close();

  const reader = readStream.getReader();
  for (let result = await reader.read(); !result.done; result = await reader.read()) {
    console.log('[value]', result.value);
  }
})();
```

### Canalização de um fluxo legível por meio de um fluxo de transformação

O método[`pipeThrough()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeThrough) da interface `ReadableStream` fornece uma maneira encadeada de canalizar o fluxo atual através de um fluxo de transformação ou qualquer outro par gravável/legível. A canalização de um fluxo geralmente o bloqueia durante a duração do tubo, evitando que outros leitores o travem.

```js
const transformStream = new TransformStream({
  transform(chunk, controller) {
    console.log('[transform]', chunk);
    controller.enqueue(new TextEncoder().encode(chunk));
  },
  flush(controller) {
    console.log('[flush]');
    controller.terminate();
  },
});

const readableStream = new ReadableStream({
  start(controller) {
    // called by constructor
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // called read when controller's queue is empty
    console.log('[pull]');
    controller.enqueue('d');
    controller.close(); // or controller.error();
  },
  cancel(reason) {
    // called when rs.cancel(reason)
    console.log('[cancel]', reason);
  },
});

(async () => {
  const reader = readableStream.pipeThrough(transformStream).getReader();
  for (let result = await reader.read(); !result.done; result = await reader.read()) {
    console.log('[value]', result.value);
  }
})();
```

O próximo exemplo de código (um pouco inventado) mostra como você pode implementar uma versão "gritante" de `fetch()` que coloca todo o texto em letras maiúsculas, consumindo a promessa de resposta retornada [como um fluxo](https://developer.mozilla.org/docs/Web/API/Streams_API/Using_readable_streams#consuming_a_fetch_as_a_stream) e colocando em letras maiúsculas, pedaço por pedaço. A vantagem dessa abordagem é que você não precisa esperar o download de todo o documento, o que pode fazer uma grande diferença ao lidar com arquivos grandes.

```js
function upperCaseStream() {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk.toUpperCase());
    },
  });
}

function appendToDOMStream(el) {
  return new WritableStream({
    write(chunk) {
      el.append(chunk);
    }
  });
}

fetch('./lorem-ipsum.txt').then((response) =>
  response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(upperCaseStream())
    .pipeTo(appendToDOMStream(document.body))
);
```

## Suporte para navegador e polyfill

O suporte para a API Streams em navegadores varia. Não se esqueça de conferir [Posso usar](https://caniuse.com/streams) para obter informações detalhadas de compatibilidade. Observe que alguns navegadores têm implementações parciais de determinados recursos, portanto, verifique os dados completamente.

A boa notícia é que existe uma [implementação de referência](https://github.com/whatwg/streams/tree/master/reference-implementation) disponível e um [polyfill](https://github.com/MattiasBuelens/web-streams-polyfill) direcionado para uso em produção.

{% Aside 'gotchas' %} Se possível, carregue o polyfill condicionalmente e somente se o recurso integrado não estiver disponível. {% endAside %}

## Demonstração

A demonstração abaixo mostra fluxos legíveis, graváveis e de transformação em ação. Também inclui os exemplos das cadeias de tubos `pipeThrough()` e `pipeTo()`, além de demonstrar o `tee()`. Opcionalmente, você pode executar a [demonstração](https://streams-demo.glitch.me/) em sua própria janela ou visualizar o [código-fonte](https://glitch.com/edit/#!/streams-demo?path=script.js).

{% Glitch 'streams-demo' %}

## Fluxos úteis disponíveis no navegador

Há uma série de fluxos úteis integrados diretamente no navegador. Você pode criar facilmente um `ReadableStream` a partir de um blob. O [método stream ()](https://developer.mozilla.org/docs/Web/API/Blob/stream) da interface [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) retorna um `ReadableStream` que, após a leitura, retorna os dados contidos no blob. Lembre-se também de que um objeto [`File`](https://developer.mozilla.org/docs/Web/API/File) é um tipo específico de `Blob` e pode ser usado em qualquer contexto de uso de um blob.

```js
const readableStream = new Blob(['hello world'], { type: 'text/plain' }).stream();
```

As variantes de streaming de `TextDecoder.decode()` e `TextEncoder.encode()` são chamadas de [`TextDecoderStream`](https://encoding.spec.whatwg.org/#interface-textdecoderstream) e [`TextEncoderStream`](https://encoding.spec.whatwg.org/#interface-textencoderstream) respectivamente.

```js
const response = await fetch('https://streams.spec.whatwg.org/');
const decodedStream = response.body.pipeThrough(new TextDecoderStream());
```

Compactar ou descompactar um arquivo é fácil com os fluxos de transformação [`CompressionStream`](https://wicg.github.io/compression/#compression-stream) e [`DecompressionStream`](https://wicg.github.io/compression/#decompression-stream). O exemplo de código abaixo mostra como você pode baixar a especificação do Streams, compactá-la (gzip) diretamente no navegador e gravar o arquivo compactado diretamente no disco.

```js
const response = await fetch('https://streams.spec.whatwg.org/');
const readableStream = response.body;
const compressedStream = readableStream.pipeThrough(new CompressionStream('gzip'));

const fileHandle = await showSaveFilePicker();
const writableStream = await fileHandle.createWritable();
compressedStream.pipeTo(writableStream);
```

O [`FileSystemWritableFileStream`](https://wicg.github.io/file-system-access/#filesystemwritablefilestream) da [API File System Access](/file-system-access/) e os [fluxos de solicitação `fetch()`](/fetch-upload-streaming/#writable-streams) são exemplos de fluxos graváveis em liberdade.

A [API Serial](/serial/) faz uso intenso de fluxos legíveis e graváveis.

```js
// Prompt user to select any serial port.
const port = await navigator.serial.requestPort();
// Wait for the serial port to open.
await port.open({ baudRate: 9_600 });
const reader = port.readable.getReader();

// Listen to data coming from the serial device.
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    // Allow the serial port to be closed later.
    reader.releaseLock();
    break;
  }
  // value is a Uint8Array.
  console.log(value);
}

// Write to the serial port.
const writer = port.writable.getWriter();
const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
await writer.write(data);
// Allow the serial port to be closed later.
writer.releaseLock();
```

Finalmente, a [`WebSocketStream`](/websocketstream/) integra fluxos com a API WebSocket.

```js
const wss = new WebSocketStream(WSS_URL);
const { readable, writable } = await wss.connection;
const reader = readable.getReader();
const writer = writable.getWriter();

while (true) {
  const { value, done } = await reader.read();
  if (done) {
    break;
  }
  const result = await process(value);
  await writer.write(result);
}
```

## Recursos úteis

- [Especificação de fluxos](https://streams.spec.whatwg.org/)
- [Demonstrações de acompanhamento](https://streams.spec.whatwg.org/demos/)
- [Polyfill de fluxos](https://github.com/MattiasBuelens/web-streams-polyfill)
- [2016 - o ano dos fluxos na web](https://jakearchibald.com/2016/streams-ftw/)
- [Iteradores e geradores assíncronos](https://jakearchibald.com/2017/async-iterators-and-generators/)
- [Stream Visualizer](https://surma.dev/lab/whatwg-stream-visualizer/lab.html)

## Reconhecimentos

Este artigo foi revisado por [Jake Archibald](https://jakearchibald.com/), [François Beaufort](https://github.com/beaufortfrancois), [Sam Dutton](https://samdutton.com/), [Mattias Buelens](https://github.com/MattiasBuelens), [Surma](https://surma.dev/), [Joe Medley](https://github.com/jpmedley) e [Adam Rice](https://github.com/ricea). [As postagens do blog de Jake Archibald](https://jakearchibald.com/) me ajudaram muito a entender os fluxos. Alguns dos exemplos de código são inspirados [nas explorações do usuário do GitHub @bellbind](https://gist.github.com/bellbind/f6a7ba88e9f1a9d749fec4c9289163ac) e partes da prosa construídas pesadamente no [MDN Web Docs on Streams](https://developer.mozilla.org/docs/Web/API/Streams_API). Os [autores do](https://github.com/whatwg/streams/graphs/contributors) [Streams Standard](https://streams.spec.whatwg.org/) fizeram um excelente trabalho ao escrever esta especificação. Imagem do herói por [Ryan Lara](https://unsplash.com/@ryanlara) no [Unsplash](https://unsplash.com/).
