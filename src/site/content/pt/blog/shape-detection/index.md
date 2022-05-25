---
title: 'API de detecção de formas: uma imagem vale mais que mil palavras, rostos e códigos de barras'
subhead: A API de detecção de formas detecta faces, códigos de barras e texto em imagens.
authors:
  - thomassteiner
description: A API de detecção de formas detecta faces, códigos de barras e texto em imagens.
date: 2019-01-07
updated: 2021-02-23
tags:
  - blog
  - capabilities
  - origin-trials
  - progressive-web-apps
hero: image/admin/pcEIwc0D09iF7BPo3TT1.jpg
alt: Código QR sendo lido por um telefone celular
origin-trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/-2341871806232657919"
feedback:
  - api
---

{% Aside %} Esta API faz parte do [projeto de  novos recursos](https://developer.chrome.com/blog/capabilities/). A detecção de código de barras foi lançada no Chrome 83. A detecção de rosto e texto está disponível atrás de uma bandeira. Esta postagem será atualizada conforme a API de detecção de formas evolui. {% endAside %}

## O que é a API de detecção de formas? {: #what }

Com APIs como [`navigator.mediaDevices.getUserMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) [e o seletor de fotos](https://bugs.chromium.org/p/chromium/issues/detail?id=656015) do Chrome para Android, tornou-se bastante fácil capturar imagens ou dados de vídeo ao vivo de câmeras de dispositivos ou fazer upload de imagens locais. Até agora, esses dados de imagem dinâmica - assim como imagens estáticas em uma página - não eram acessíveis por código, embora as imagens possam conter muitos recursos interessantes, como rostos, códigos de barras e texto.

Por exemplo, no passado, se os desenvolvedores quisessem extrair esses recursos no cliente para construir um [leitor de código QR](https://qrsnapper.appspot.com/) , eles tinham que contar com bibliotecas JavaScript externas. Isso pode ser caro do ponto de vista do desempenho e aumentar o peso geral da página. Por outro lado, sistemas operacionais incluindo Android, iOS e macOS, mas também chips de hardware encontrados em módulos de câmera, normalmente já possuem detectores de recursos de alto desempenho e altamente otimizados, como o Android [`FaceDetector`](https://developer.android.com/reference/android/media/FaceDetector) ou o detector de recursos genéricos do iOS, [`CIDetector`](https://developer.apple.com/documentation/coreimage/cidetector?language=objc).

A [API de detecção de formas](https://wicg.github.io/shape-detection-api) expõe essas implementações por meio de um conjunto de interfaces JavaScript. Atualmente, as funcionalidades suportadas são a detecção de faces através da `FaceDetector` interface, detecção de código de barras através da `BarcodeDetector` interface, e detecção de texto (Reconhecimento Óptico de Caracteres (OCR)) através do `TextDetector` interface.

{% Aside 'caution' %} A detecção de texto, apesar de ser um campo interessante, não é considerada estável o suficiente nas plataformas de computação ou conjuntos de caracteres para ser padronizado no momento, razão pela qual a detecção de texto foi movida para uma [especificação informativa](https://wicg.github.io/shape-detection-api/text.html) separada. {% endAside %}

### Casos de uso sugeridos {: #use-cases }

Conforme descrito acima, a API de detecção de formas atualmente suporta a detecção de faces, códigos de barras e texto. A lista de marcadores a seguir contém exemplos de casos de uso para todos os três recursos.

#### Detecção de rosto

- Os sites de redes sociais online ou de compartilhamento de fotos geralmente permitem que seus usuários façam anotações nas pessoas nas imagens. Ao destacar os limites dos rostos detectados, essa tarefa pode ser facilitada.
- Os sites de conteúdo podem recortar imagens dinamicamente com base em rostos potencialmente detectados, em vez de depender de outras heurísticas, ou destacar rostos detectados com efeitos panorâmicos e de zoom semelhantes a [Ken Burns em formatos semelhantes a histórias.](https://en.wikipedia.org/wiki/Ken_Burns_effect)
- Os sites de mensagens multimídia podem permitir que seus usuários sobreponham objetos engraçados, como [óculos de sol ou bigodes,](https://beaufortfrancois.github.io/sandbox/media-recorder/mustache.html) em pontos de referência de rosto detectados.

#### Detecção de código de barras

- Os aplicativos da web que leem códigos QR podem desbloquear casos de uso interessantes, como pagamentos online ou navegação na web, ou usar códigos de barras para estabelecer conexões sociais em aplicativos de mensagens.
- Os aplicativos de compras podem permitir que seus usuários leiam [códigos de barras EAN](https://en.wikipedia.org/wiki/International_Article_Number) ou [UPC](https://en.wikipedia.org/wiki/Universal_Product_Code) de itens em uma loja física para comparar preços online.
- Os aeroportos podem fornecer quiosques na web onde os passageiros podem ler os [códigos Aztec](https://en.wikipedia.org/wiki/Aztec_Code) de seus cartões de embarque para mostrar informações personalizadas relacionadas a seus voos.

#### Detecção de texto

- Os sites de redes sociais online podem melhorar a acessibilidade do conteúdo da imagem gerada pelo usuário, adicionando textos detectados como atributos `alt` `<img>` quando nenhuma outra descrição é fornecida.
- Os sites de conteúdo podem usar a detecção de texto para evitar colocar cabeçalhos em cima das imagens principais com texto contido.
- Os aplicativos da Web podem usar a detecção de texto para traduzir textos como, por exemplo, cardápios de restaurantes.

## Status atual {: #status}

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Etapa</th>
<th data-md-type="table_cell">Status</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crie um explicador</td>
<td data-md-type="table_cell"><a href="https://docs.google.com/document/d/1QeCDBOoxkElAB0x7ZpM3VN3TQjS1ub1mejevd2Ik1gQ/edit" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crie o rascunho inicial das especificações</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/shape-detection-api" data-md-type="link">Em andamento</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">3. Reúna feedback e repita o design</strong></td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link"><strong data-md-type="double_emphasis">Em andamento</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Teste de origem</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/-2341871806232657919" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Lançamento</strong></td>
<td data-md-type="table_cell">Detecção de código de barras <strong data-md-type="double_emphasis">completa</strong><br data-md-type="raw_html"> Detecção de rosto <a href="https://www.chromestatus.com/feature/5678216012365824" data-md-type="link">em andamento</a><br data-md-type="raw_html"> Detecção de texto <a href="https://www.chromestatus.com/feature/5644087665360896" data-md-type="link">em andamento</a>
</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Como usar a API de detecção de formas {: #use}

{% Aside 'warning' %} Até agora, apenas a detecção de código de barras está disponível por padrão, a partir do Chrome 83, mas a detecção de rosto e texto está disponível atrás de uma bandeira. Você sempre pode usar a API de detecção de formas para experimentos locais ativando a sinalização `#enable-experimental-web-platform-features` {% endAside %}

Se quiser experimentar a API de detecção de formas localmente, ative o sinalizador `#enable-experimental-web-platform-features` `about://flags`.

As interfaces de todos os três detectores, `FaceDetector`, `BarcodeDetector` e `TextDetector`, são semelhantes. Todos eles fornecem um único método assíncrono chamado `detect()` que usa um [`ImageBitmapSource`](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#imagebitmapsource) como entrada (ou seja, [`CanvasImageSource`](https://html.spec.whatwg.org/multipage/canvas.html#canvasimagesource), [`Blob`](https://w3c.github.io/FileAPI/#dfn-Blob) ou [`ImageData`](https://html.spec.whatwg.org/multipage/canvas.html#imagedata)).

Para `FaceDetector` e `BarcodeDetector` , parâmetros opcionais podem ser passados para o construtor do detector, que permitem fornecer dicas para os detectores subjacentes.

Por favor, verifique cuidadosamente a matriz de suporte no [explicador](https://github.com/WICG/shape-detection-api#overview) para uma visão geral das diferentes plataformas.

{% Aside 'gotchas' %} Se seu `ImageBitmapSource` tiver uma [origem de script efetiva](https://html.spec.whatwg.org/multipage/#concept-origin) que não seja a mesma que a origem de script efetiva do documento, as tentativas de chamar `detect()` falharão com uma nova `SecurityError` [`DOMException`](https://heycam.github.io/webidl/#idl-DOMException). Se a origem da sua imagem suportar CORS, você pode usar o [`crossorigin`](https://developer.mozilla.org/docs/Web/HTML/CORS_settings_attributes) para solicitar acesso ao CORS. {% endAside %}

### Trabalhando com o `BarcodeDetector` {: #barcodedetector}

O `BarcodeDetector` retorna os valores brutos do código de barras que encontra no `ImageBitmapSource` e nas caixas delimitadoras, bem como outras informações, como os formatos dos códigos de barras detectados.

```js
const barcodeDetector = new BarcodeDetector({
  // (Optional) A series of barcode formats to search for.
  // Not all formats may be supported on all platforms
  formats: [
    'aztec',
    'code_128',
    'code_39',
    'code_93',
    'codabar',
    'data_matrix',
    'ean_13',
    'ean_8',
    'itf',
    'pdf417',
    'qr_code',
    'upc_a',
    'upc_e'
  ]
});
try {
  const barcodes = await barcodeDetector.detect(image);
  barcodes.forEach(barcode => searchProductDatabase(barcode));
} catch (e) {
  console.error('Barcode detection failed:', e);
}
```

### Trabalhando com o `FaceDetector` {:} #facedetector

O `FaceDetector` sempre retorna as caixas delimitadoras de faces que detecta no `ImageBitmapSource`. Dependendo da plataforma, mais informações sobre os marcos do rosto, como olhos, nariz ou boca, podem estar disponíveis. É importante notar que esta API detecta apenas rostos. Não identifica a quem pertence um rosto.

```js
const faceDetector = new FaceDetector({
  // (Optional) Hint to try and limit the amount of detected faces
  // on the scene to this maximum number.
  maxDetectedFaces: 5,
  // (Optional) Hint to try and prioritize speed over accuracy
  // by, e.g., operating on a reduced scale or looking for large features.
  fastMode: false
});
try {
  const faces = await faceDetector.detect(image);
  faces.forEach(face => drawMustache(face));
} catch (e) {
  console.error('Face detection failed:', e);
}
```

### Trabalhando com o `TextDetector` {: #textdetector}

O `TextDetector` sempre retorna as caixas delimitadoras dos textos detectados e, em algumas plataformas, os caracteres reconhecidos.

{% Aside 'caution' %} O reconhecimento de texto não está disponível universalmente. {% endAside %}

```js
const textDetector = new TextDetector();
try {
  const texts = await textDetector.detect(image);
  texts.forEach(text => textToSpeech(text));
} catch (e) {
  console.error('Text detection failed:', e);
}
```

## Detecção de recurso {: #featuredetection}

Verificar puramente a existência de construtores para detectar o recurso da API de detecção de formas não é suficiente. A presença de uma interface não informa se a plataforma subjacente oferece suporte ao recurso. Isso está funcionando [conforme o planejado](https://crbug.com/920961). É por isso que recomendamos uma *abordagem de programação defensiva*, fazendo a detecção de recursos como este:

```js
const supported = await (async () => 'FaceDetector' in window &&
    await new FaceDetector().detect(document.createElement('canvas'))
    .then(_ => true)
    .catch(e => e.name === 'NotSupportedError' ? false : true))();
```

O `BarcodeDetector` interface foi atualizada para incluir um método `getSupportedFormats()` e interfaces similares têm sido propostas [para `FaceDetector`](https://github.com/WICG/shape-detection-api/issues/53) e [para `TextDetector`](https://github.com/WICG/shape-detection-api/issues/57).

```js
await BarcodeDetector.getSupportedFormats();
/* On a macOS computer logs
  [
    "aztec",
    "code_128",
    "code_39",
    "code_93",
    "data_matrix",
    "ean_13",
    "ean_8",
    "itf",
    "pdf417",
    "qr_code",
    "upc_e"
  ]
*/
```

Isso permite que você detecte o recurso específico de que precisa, por exemplo, leitura de código QR:

```js
if (('BarcodeDetector' in window) &&
    ((await BarcodeDetector.getSupportedFormats()).includes('qr_code'))) {
  console.log('QR code scanning is supported.');
}
```

Isso é melhor do que ocultar as interfaces porque, mesmo entre as plataformas, os recursos podem variar e, portanto, os desenvolvedores devem ser encorajados a verificar precisamente a capacidade (como um formato de código de barras específico ou ponto de referência facial) de que precisam.

## Suporte para sistema operacional {: #os-support}

A detecção de código de barras está disponível no macOS, ChromeOS e Android. [O Google Play Services](https://play.google.com/store/apps/details?id=com.google.android.gms) é necessário no Android.

## Práticas recomendadas {: #bestpractices}

Todos os detectores funcionam de forma assíncrona, ou seja, não bloqueiam a thread principal. Portanto, não confie na detecção em tempo real, mas deixe algum tempo para que o detector faça seu trabalho.

Se você é um fã de [Web Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API), ficará feliz em saber que os detectores também estão expostos lá. Os resultados da detecção são serializáveis e, portanto, podem ser passados do trabalhador para o aplicativo principal via `postMessage()` . A [demonstração](https://shape-detection-demo.glitch.me/) mostra isso em ação.

Nem todas as implementações de plataforma oferecem suporte a todos os recursos, portanto, certifique-se de verificar a situação do suporte com cuidado e usar a API como um aprimoramento progressivo. Por exemplo, algumas plataformas podem suportar a detecção de rosto em si, mas não a detecção de pontos de referência de rosto (olhos, nariz, boca, etc.); ou a existência e a localização do texto podem ser reconhecidas, mas não o conteúdo do texto.

{% Aside 'caution' %} Esta API é uma otimização e não algo garantido que estará disponível na plataforma para todos os usuários. Espera-se que os desenvolvedores combinem isso com seu próprio [código de reconhecimento de imagem](https://github.com/mjyc/opencv) e aproveitem a otimização da plataforma quando disponível. {% endAside %}

## Feedback {: #feedback}

A equipe do Chrome e a comunidade de padrões da web querem ouvir sobre suas experiências com a API de detecção de formas.

### Conte-nos sobre o design da API {: .hide-from-toc}

Existe algo na API que não funciona como você esperava? Ou faltam métodos ou propriedades de que você precisa para implementar sua ideia? Tem uma pergunta ou comentário sobre o modelo de segurança?

- Registre um problema de especificação no [repositório GitHub da API de detecção de formas](https://github.com/WICG/shape-detection-api/issues) ou adicione suas ideias a um problema existente.

### Problemas com a implementação? {: .hide-from-toc}

Você encontrou um bug com a implementação do Chrome? Ou a implementação é diferente da especificação?

- Registre um bug em [https://new.crbug.com](https://new.crbug.com). Certifique-se de incluir o máximo de detalhes que puder, instruções simples para reproduzir e definir *Componentes* como `Blink>ImageCapture`. [Glitch](https://glitch.com) funciona muito bem para compartilhar reproduções rápidas e fáceis.

### Planejando usar a API? {: .hide-from-toc}

Planejando usar a API de detecção de formas em seu site? Seu apoio público nos ajuda a priorizar os recursos e mostra a outros fornecedores de navegadores como é fundamental apoiá-los.

- Compartilhe como você planeja usá-lo no [tópico do discurso](https://discourse.wicg.io/t/rfc-proposal-for-face-detection-api/1642/3) do WICG.
- Envie um tweet para [@ChromiumDev](https://twitter.com/chromiumdev) usando a hashtag[`#ShapeDetection`](https://twitter.com/search?q=%23ShapeDetection&src=typed_query&f=live) e diga-nos onde e como você está usando.

## Links úteis {: #helpful}

- [Explicador público](https://docs.google.com/document/d/1QeCDBOoxkElAB0x7ZpM3VN3TQjS1ub1mejevd2Ik1gQ/edit)
- [API Demo](https://shape-detection-demo.glitch.me/) | [Fonte de demonstração da API](https://glitch.com/edit/#!/shape-detection-demo)
- [Bug de rastreamento](https://bugs.chromium.org/p/chromium/issues/detail?id=728474)
- [Entrada ChromeStatus.com](https://www.chromestatus.com/feature/4757990523535360)
- Componente Blink: `Blink>ImageCapture`
