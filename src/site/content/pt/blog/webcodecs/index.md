---
title: Processamento de vídeo com WebCodecs
subhead: Manipulando componentes de stream de vídeo.
description: |2

  Trabalhe com componentes de um fluxo de vídeo, como quadros e pedaços não movidos de vídeo ou áudio codificado.
date: 2020-10-13
updated: 2021-08-26
hero: image/admin/I09h0la9qLPSRLZs1ruB.jpg
alt: Um rolo de filme.
authors:
  - djuffin
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/-7811493553674125311"
tags:
  - blog
  - media
feedback:
  - api
---

As tecnologias modernas da web fornecem maneiras amplas de trabalhar com vídeo. A [API Media Stream](https://developer.mozilla.org/docs/Web/API/MediaStream_Recording_API), [API Media Recording](https://developer.mozilla.org/docs/Web/API/MediaStream_Recording_API), [API Media Source](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API) e [API WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API) somam-se a um rico conjunto de ferramentas para gravar, transferir e reproduzir fluxos de vídeo. Ao resolver certas tarefas de alto nível, essas APIs não permitem que os programadores da web trabalhem com componentes individuais de um fluxo de vídeo, como quadros e pedaços não movidos de vídeo ou áudio codificado. Para obter acesso de baixo nível a esses componentes básicos, os desenvolvedores têm usado o WebAssembly para trazer [codecs de vídeo e áudio](https://en.wikipedia.org/wiki/Video_codec) para o navegador. Mas, dado que os navegadores modernos já vêm com uma variedade de codecs (que geralmente são acelerados por hardware), reembalá-los como WebAssembly parece um desperdício de recursos humanos e de computador.

A [API WebCodecs](https://wicg.github.io/web-codecs/) elimina essa ineficiência dando aos programadores uma maneira de usar componentes de mídia que já estão presentes no navegador. Mais especificamente:

- Decodificadores de vídeo e áudio
- Codificadores de vídeo e áudio
- Quadros de vídeo brutos
- Decodificadores de imagem

A API WebCodecs é útil para aplicativos da web que requerem controle total sobre a forma como o conteúdo de mídia é processado, como editores de vídeo, videoconferência, streaming de vídeo etc.

## Status atual {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Degrau</th>
<th data-md-type="table_cell">Status</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crie um explicador</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/web-codecs/blob/master/explainer.md" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crie o rascunho inicial das especificações</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/web-codecs/" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Reúna feedback e repita o design</td>
<td data-md-type="table_cell">Completo</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Teste de origem</td>
<td data-md-type="table_cell">Completo</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Lançamento</td>
<td data-md-type="table_cell">Chrome 94</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Fluxo de trabalho de processamento de vídeo

Os quadros são a peça central no processamento de vídeo. Portanto, em WebCodecs, a maioria das classes consome ou produz quadros. Os codificadores de vídeo convertem os quadros em blocos codificados. Os decodificadores de vídeo fazem o oposto.

Além disso, `VideoFrame` funciona bem com outras APIs da Web por ser um [`CanvasImageSource`](https://html.spec.whatwg.org/multipage/canvas.html#canvasimagesource) e ter um [construtor](https://www.w3.org/TR/webcodecs/#dom-videoframe-videoframe) que aceita `CanvasImageSource`. Portanto, ele pode ser usado em funções como [`drawImage()`](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/drawImage) e [`texImage2D()`](https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext/texImage2D). Também pode ser construído a partir de telas, bitmaps, elementos de vídeo e outros quadros de vídeo.

A API WebCodecs funciona bem em conjunto com as classes da [API](https://w3c.github.io/mediacapture-transform/) Insertable Streams que conectam WebCodecs a [faixas de fluxo de mídia](https://developer.mozilla.org/docs/Web/API/MediaStreamTrack).

- `MediaStreamTrackProcessor` divide as trilhas de mídia em quadros individuais.
- `MediaStreamTrackGenerator` cria uma trilha de mídia a partir de um fluxo de quadros.

## WebCodecs e web workers

Por design, a API WebCodecs faz todo o trabalho pesado de forma assíncrona e fora do thread principal. Mas, como os callbacks de frame e chunk podem frequentemente ser chamados várias vezes por segundo, eles podem atrapalhar o thread principal e, assim, tornar o site menos responsivo. Portanto, é preferível mover o manuseio de frames individuais e blocos codificados para um web worker.

Para ajudar com isso, o [ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream) fornece uma maneira conveniente de transferir automaticamente todos os quadros provenientes de uma trilha de mídia para o worker. Por exemplo, `MediaStreamTrackProcessor` pode ser usado para obter um `ReadableStream` para uma trilha de fluxo de mídia proveniente da câmera da web. Depois disso, o stream é transferido para um web worker, onde os frames são lidos um por um e enfileirados em um `VideoEncoder`.

Com [`HTMLCanvasElement.transferControlToOffscreen`](https://developers.google.com/web/updates/2018/08/offscreen-canvas#unblock_main_thread) até a renderização pode ser feita fora do thread principal. Mas se todas as ferramentas de alto nível forem inconvenientes, o `VideoFrame` si é [transferível](https://developer.mozilla.org/docs/Web/API/Transferable) e pode ser movido entre os workers.

## WebCodecs em ação

### Codificação

<figure>{% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/lEovMYp8oh1JSClCLCiD.png", alt="The path from a Canvas or an ImageBitmap to the network or to storage", width="800", height="393" %} <figcaption>O caminho de um <code>Canvas</code> ou <code>ImageBitmap</code> para a rede ou para o armazenamento</figcaption></figure>

Tudo começa com um `VideoFrame`. Existem três maneiras de construir quadros de vídeo.

- De uma fonte de imagem como uma tela, um bitmap de imagem ou um elemento de vídeo.

```js
const cnv = document.createElement('canvas');
// draw something on the canvas
…
let frame_from_canvas = new VideoFrame(cnv, { timestamp: 0 });
```

- Use `MediaStreamTrackProcessor` para extrair quadros de um [`MediaStreamTrack`](https://developer.mozilla.org/docs/Web/API/MediaStreamTrack)

```js
  const stream = await navigator.mediaDevices.getUserMedia({ … });
  const track = stream.getTracks()[0];

  const media_processor = new MediaStreamTrackProcessor(track);

  const reader = media_processor.readable.getReader();
  while (true) {
      const result = await reader.read();
      if (result.done)
        break;
      let frame_from_camera = result.value;
  }
```

- Crie um quadro a partir de sua representação de pixel binário em um [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource)

```js
  const pixelSize = 4;
  const init = {timestamp: 0, codedWidth: 320, codedHeight: 200, format: 'RGBA'};
  let data = new Uint8Array(init.codedWidth * init.codedHeight * pixelSize);
  for (let x = 0; x < init.codedWidth; x++) {
    for (let y = 0; y < init.codedHeight; y++) {
      let offset = (y * init.codedWidth + x) * pixelSize;
      data[offset] = 0x7F;      // Red
      data[offset + 1] = 0xFF;  // Green
      data[offset + 2] = 0xD4;  // Blue
      data[offset + 3] = 0x0FF; // Alpha
    }
  }
  let frame = new VideoFrame(data, init);
```

Não importa de onde eles vêm, os quadros podem ser codificados em `EncodedVideoChunk` com um `VideoEncoder`.

Antes da codificação, `VideoEncoder` precisa receber dois objetos JavaScript:

- Dicionário de inicialização com duas funções para lidar com pedaços codificados e erros. Essas funções são definidas pelo desenvolvedor e não podem ser alteradas depois de passadas para o construtor `VideoEncoder`
- Objeto de configuração do codificador, que contém parâmetros para o fluxo de vídeo de saída. Você pode alterar esses parâmetros posteriormente chamando `configure()`.

```js
const init = {
  output: handleChunk,
  error: (e) => {
    console.log(e.message);
  }
};

let config = {
  codec: 'vp8',
  width: 640,
  height: 480,
  bitrate: 2_000_000, // 2 Mbps
  framerate: 30,
};

let encoder = new VideoEncoder(init);
encoder.configure(config);
```

Depois que o codificador foi configurado, ele está pronto para aceitar quadros por meio do método `encode()` Tanto `configure()` quanto `encode()` retornam imediatamente sem esperar que o trabalho real seja concluído. Ele permite que vários quadros sejam enfileirados para codificação ao mesmo tempo, enquanto `encodeQueueSize` mostra quantas solicitações estão esperando na fila para que as codificações anteriores sejam concluídas. Os erros são relatados lançando imediatamente uma exceção, no caso de os argumentos ou a ordem das chamadas de método violarem o contrato de API, ou chamando o `error()` para problemas encontrados na implementação do codec. Se a codificação for concluída com êxito, o `output()` é chamado com um novo trecho codificado como argumento. Outro detalhe importante aqui é que os quadros precisam ser informados quando não são mais necessários chamando `close()`.

```js
let frame_counter = 0;

const track = stream.getVideoTracks()[0];
const media_processor = new MediaStreamTrackProcessor(track);

const reader = media_processor.readable.getReader();
while (true) {
    const result = await reader.read();
    if (result.done)
      break;

    let frame = result.value;
    if (encoder.encodeQueueSize > 2) {
      // Too many frames in flight, encoder is overwhelmed
      // let's drop this frame.
      frame.close();
    } else {
      frame_counter++;
      const insert_keyframe = (frame_counter % 150) == 0;
      encoder.encode(frame, { keyFrame: insert_keyframe });
      frame.close();
    }
}
```

Finalmente, é hora de terminar a codificação do código, escrevendo uma função que lida com pedaços de vídeo codificado conforme eles saem do codificador. Normalmente, essa função seria enviar blocos de dados pela rede ou [mixá-](https://en.wikipedia.org/wiki/Multiplexing#Video_processing) los em um contêiner de mídia para armazenamento.

```js
function handleChunk(chunk, metadata) {

  if (metadata.decoderConfig) {
    // Decoder needs to be configured (or reconfigured) with new parameters
    // when metadata has a new decoderConfig.
    // Usually it happens in the beginning or when the encoder has a new
    // codec specific binary configuration. (VideoDecoderConfig.description).
    fetch('/upload_extra_data',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: metadata.decoderConfig.description
    });
  }

  // actual bytes of encoded data
  let chunkData = new Uint8Array(chunk.byteLength);
  chunk.copyTo(chunkData);

  let timestamp = chunk.timestamp;        // media time in microseconds
  let is_key = chunk.type == 'key';       // can also be 'delta'
  fetch(`/upload_chunk?timestamp=${timestamp}&type=${chunk.type}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: chunkData
  });
}
```

Se em algum momento você precisar se certificar de que todas as solicitações de codificação pendentes foram concluídas, você pode chamar `flush()` e aguardar sua promessa.

```js
await encoder.flush();
```

### Decodificação

<figure>{% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/fzi3E4v2jJJj5QAlhoRG.png", alt="O caminho da rede ou armazenamento para um Canvas ou ImageBitmap.", width="800", height="419" %} <figcaption>O caminho da rede ou armazenamento para um <code>Canvas</code> ou <code>ImageBitmap</code>.</figcaption></figure>

A configuração de um `VideoDecoder` é semelhante ao que foi feito para o `VideoEncoder`: duas funções são passadas quando o decodificador é criado e os parâmetros do codec são fornecidos para `configure()`.

O conjunto de parâmetros do codec varia de codec para codec. Por exemplo, o codec H.264 pode precisar de um[blob binário](https://wicg.github.io/web-codecs/#dom-audiodecoderconfig-description) de avcC, a menos que seja codificado no formato denominado AnnexB (`encoderConfig.avc = { format: "annexb" }`).

```js
const init = {
  output: handleFrame,
  error: (e) => {
    console.log(e.message);
  }
};

const config = {
  codec: 'vp8',
  codedWidth: 640,
  codedHeight: 480
};

let decoder = new VideoDecoder(init);
decoder.configure(config);
```

Assim que o decodificador for inicializado, você pode começar a alimentá-lo com objetos `EncodedVideoChunk` Para criar um pedaço, você precisará de:

- Um [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource) de dados de vídeo codificados
- o carimbo de data / hora de início do pedaço em microssegundos (tempo de mídia do primeiro quadro codificado no pedaço)
- o tipo do pedaço, um dos seguintes:
    - `key` se o pedaço pode ser decodificado independentemente dos pedaços anteriores
    - `delta` se o bloco só puder ser decodificado após um ou mais blocos anteriores terem sido decodificados

Além disso, quaisquer dados emitidos pelo codificador estão prontos para o decodificador no estado em que se encontram. Todas as coisas ditas acima sobre o relatório de erros e a natureza assíncrona dos métodos do codificador também são verdadeiras para os decodificadores.

```js
let responses = await downloadVideoChunksFromServer(timestamp);
for (let i = 0; i < responses.length; i++) {
  let chunk = new EncodedVideoChunk({
    timestamp: responses[i].timestamp,
    type: (responses[i].key ? 'key' : 'delta'),
    data: new Uint8Array ( responses[i].body )
  });
  decoder.decode(chunk);
}
await decoder.flush();
```

Agora é hora de mostrar como um quadro recém-decodificado pode ser mostrado na página. É melhor certificar-se de que o retorno de chamada de saída do decodificador (`handleFrame()`) retorne rapidamente. No exemplo abaixo, ele apenas adiciona um quadro à fila de quadros prontos para renderização. A renderização acontece separadamente e consiste em duas etapas:

1. Esperando o momento certo para mostrar o quadro.
2. Desenhar o quadro na tela.

Quando um quadro não for mais necessário, chame `close()` para liberar a memória subjacente antes que o coletor de lixo o alcance, isso reduzirá a quantidade média de memória usada pelo aplicativo da web.

```js
let cnv = document.getElementById('canvas_to_render');
let ctx = cnv.getContext('2d');
let ready_frames = [];
let underflow = true;
let time_base = 0;

function handleFrame(frame) {
  ready_frames.push(frame);
  if (underflow)
    setTimeout(render_frame, 0);
}

function delay(time_ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, time_ms);
  });
}

function calculateTimeTillNextFrame(timestamp) {
  if (time_base == 0)
    time_base = performance.now();
  let media_time = performance.now() - time_base;
  return Math.max(0, (timestamp / 1000) - media_time);
}

async function render_frame() {
  if (ready_frames.length == 0) {
    underflow = true;
    return;
  }
  let frame = ready_frames.shift();
  underflow = false;

  // Based on the frame's timestamp calculate how much of real time waiting
  // is needed before showing the next frame.
  let time_till_next_frame = calculateTimeTillNextFrame(frame.timestamp);
  await delay(time_till_next_frame);
  ctx.drawImage(frame, 0, 0);
  frame.close();

  // Immediately schedule rendering of the next frame
  setTimeout(render_frame, 0);
}
```

## Demonstração

A demonstração abaixo mostra como os quadros de animação de uma tela são:

- capturado a 25 fps em um `ReadableStream` por `MediaStreamTrackProcessor`
- transferido para um web worker
- codificado em formato de vídeo H.264
- decodificado novamente em uma sequência de quadros de vídeo
- e renderizado na segunda tela usando `transferControlToOffscreen()`

{% Glitch 'new-webcodecs-blogpost-demo' %}

### Outras demos

Verifique também nossas outras demonstrações:

- [Decodificação de gifs com ImageDecoder](https://imagedecoder.glitch.me/)
- [Capturar entrada de câmera para um arquivo](https://w3c.github.io/webcodecs/samples/capture-to-file/capture-to-file.html)
- [Reprodução de MP4](https://w3c.github.io/webcodecs/samples/mp4-decode/)
- [Outras amostras](https://w3c.github.io/webcodecs/samples/)

## Usando a API WebCodecs {: #use}

## Detecção de recursos

Para verificar o suporte de WebCodecs:

```js
if ('VideoEncoder' in window) {
  // WebCodecs API is supported.
}
```

Lembre-se de que a API WebCodecs está disponível apenas em [contextos seguros](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts), portanto, a detecção falhará se [`self.isSecureContext`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/isSecureContext) for falso.

## Feedback {: #feedback }

A equipe do Chrome quer ouvir sobre suas experiências com a API WebCodecs.

### Conte-nos sobre o design da API

Existe algo na API que não funciona como você esperava? Ou faltam métodos ou propriedades de que você precisa para implementar sua ideia? Tem uma pergunta ou comentário sobre o modelo de segurança? Registre um problema de especificação no [repositório GitHub](https://github.com/WICG/web-codecs/issues) correspondente ou adicione suas ideias a um problema existente.

### Comunicar um problema com a implementação

Você encontrou um bug na implementação do Chrome? Ou a implementação é diferente da especificação? [Registre](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EMedia%3EWebCodecs) um bug em new.crbug.com. Certifique-se de incluir o máximo de detalhes que puder, instruções simples para reprodução e insira `Blink>Media>WebCodecs` na caixa **Componentes.** [Glitch](https://glitch.com/) funciona muito bem para compartilhar reproduções rápidas e fáceis.

### Mostrar suporte para a API

Você está planejando usar a API WebCodecs? Seu suporte público ajuda a equipe do Chrome a priorizar os recursos e mostra a outros fornecedores de navegadores como é fundamental apoiá-los.

Enviei e-mails para [media-dev@chromium.org](mailto:media-dev@chromium.org) ou um tuíte para [@ChromiumDev][cr-dev-twitter] usando a hastag [`#WebCodecs`](https://twitter.com/search?q=%23WebCodecs&src=typed_query&f=live) e conte-nos onde e como você está usando o recurso.

[Imagem do herói](https://unsplash.com/photos/8eQOBtgn9Qo) por [Denise Jans](https://unsplash.com/@dmjdenise) no [Unsplash](https://unsplash.com) .
