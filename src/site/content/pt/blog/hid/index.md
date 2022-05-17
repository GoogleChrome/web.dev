---
layout: post
title: Conexão de dispositivos HID incomuns
subhead: A API WebHID permite que sites acessem teclados auxiliares alternativos e gamepads exóticos.
authors:
  - beaufortfrancois
date: 2020-09-15
updated: 2021-02-27
hero: image/admin/05NRg2Lw0w5Rv6TToabY.jpg
thumbnail: image/admin/AfLwyZZbL7bh4S4RikYi.jpg
alt: Foto do Stream Deck Elgato.
description: |2-

  A API WebHID permite que sites acessem teclados auxiliares alternativos e gamepads exóticos.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webhid
---

{% Aside 'success' %} A API WebHID, que faz parte do [projeto de recursos](https://developer.chrome.com/blog/fugu-status/), foi lançada no Chrome 89. {% endAside %}

Há vários dispositivos de interface humana (HIDs), como teclados alternativos ou gamepads exóticos, que são muito novos, antigos ou incomuns para serem acessados pelos drivers de dispositivo dos sistemas. A API WebHID resolve isso fornecendo uma maneira de implementar a lógica específica do dispositivo em JavaScript.

## Casos de uso sugeridos {: #use-cases }

Um dispositivo HID recebe ou fornece dados a humanos. Alguns exemplos de dispositivos são os teclados, dispositivos apontadores (mouses, telas sensíveis ao toque, entre outros) e gamepads. O [protocolo HID](https://www.usb.org/hid) torna possível acessar esses dispositivos em computadores usando drivers do sistema operacional. A compatibilidade da plataforma da Web com os dispositivos HID depende desses drivers.

A incapacidade de acessar dispositivos HID incomuns é especialmente complicada quando se trata da compatibilidade com teclados auxiliares alternativos (por exemplo, o [Stream Deck Elgato](https://www.elgato.com/en/gaming/stream-deck), os [headsets da Jabra](https://www.jabra.com/business/office-headsets) e o [X-keys](https://xkeys.com/xkeys.html)) e gamepads exóticos. Os gamepads projetados para desktop geralmente usam HIDs para dados de entrada (botões, joysticks e gatilhos) e saída (LEDs e vibração). Infelizmente, os dados de entrada e saída de gamepads não são bem padronizados e os navegadores da Web geralmente exigem lógica personalizada para dispositivos específicos. Isso é insustentável e resulta em um suporte ruim para dispositivos mais antigos e incomuns, além de fazer com que o navegador dependa de quirks (peculiaridades) para o comportamento de dispositivos específicos.

## Status atual {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Etapa</th>
<th data-md-type="table_cell">Status</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Criar explicação</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/webhid/blob/master/EXPLAINER.md" data-md-type="link">Concluído</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Criar a versão preliminar das especificações</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/webhid/" data-md-type="link">Concluído</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Coletar feedback e iterar o design</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Concluído</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Testar a origem</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/register_trial/1074108511127863297" data-md-type="link">Concluído</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Lançar</strong></td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">Concluído</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Terminologia {: #terminology }

O HID consiste em dois conceitos fundamentais: relatórios e descritores de relatório. Os relatórios são os dados trocados entre um dispositivo e um software cliente. O descritor de relatório descreve o formato e o significado dos dados compatíveis com o dispositivo.

Um HID (dispositivo de interface humana) é um tipo de dispositivo que recebe ou fornece dados para humanos. Além disso, refere-se ao protocolo HID, um padrão para comunicação bidirecional entre um host e um dispositivo projetado para simplificar o processo de instalação. O protocolo HID foi originalmente desenvolvido para dispositivos USB, mas, desde então, foi implementado em diversos protocolos, incluindo Bluetooth.

Os aplicativos e dispositivos HID trocam dados binários por meio de três tipos de relatório:

<div>
  <table>
    <thead>
      <tr>
        <th>Tipo de relatório</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Relatório de entrada</td>
        <td>Dados que são enviados do dispositivo para o aplicativo (por exemplo, um botão é pressionado).</td>
      </tr>
      <tr>
        <td>Relatório de saída</td>
        <td>Dados que são enviados do aplicativo para o dispositivo (por exemplo, uma solicitação para ligar a luz de fundo do teclado).</td>
      </tr>
      <tr>
        <td>Relatório de recurso</td>
        <td>Dados que podem ser enviados em qualquer direção. O formato é específico do dispositivo.</td>
      </tr>
    </tbody>
  </table>
</div>

Um descritor de relatório descreve o formato binário dos relatórios compatíveis com o dispositivo. Sua estrutura é hierárquica e ele pode agrupar relatórios como coleções distintas dentro da coleção de nível superior. O [formato](https://gist.github.com/beaufortfrancois/583424dfef66be1ade86231fd1a260c7) do descritor é definido pela especificação do HID.

O uso do dispositivo HID é um valor numérico que se refere a uma entrada ou saída padronizada. Esse tipo de valor permite descrever o uso pretendido do dispositivo e a finalidade de cada campo nos relatórios. Por exemplo, o número um é definido como o botão esquerdo do mouse. Os usos também são organizados em páginas, que fornecem uma indicação da categoria de alto nível do dispositivo ou relatório.

## Usando a API WebHID {: #use }

### Detecção de recurso {: #feature-detection }

Para verificar se a API WebHID é compatível, use:

```js
if ("hid" in navigator) {
  // The WebHID API is supported.
}
```

### Abra uma conexão HID {: #open }

A API WebHID é assíncrona por padrão, a fim de evitar o bloqueio da IU do site ao aguardar uma entrada. Isso é importante porque os dados HID podem ser recebidos a qualquer momento, necessitando uma maneira de escutá-los.

Para abrir uma conexão HID, primeiro acesse um objeto `HIDDevice`. Para isso, solicite que o usuário selecione um dispositivo ao chamar `navigator.hid.requestDevice()` ou escolha um em `navigator.hid.getDevices()`, que retorna uma lista de dispositivos aos quais o site já teve acesso.

A função `navigator.hid.requestDevice()` obtém um objeto obrigatório que define os filtros. Eles são usados para a associação do dispositivo conectado a um identificador de fornecedor USB (`vendorId`), um identificador de produto USB (`productId`), um valor da página de uso (`usagePage`) e um valor de uso (`usage`). Confira o [Repositório de IDs de dispositivos USB](http://www.linux-usb.org/usb-ids.html) e o [documento de tabelas de uso de dispositivos HIDs](https://usb.org/document-library/hid-usage-tables-12).

Os múltiplos objetos `HIDDevice` retornados por essa função representam várias interfaces HID no mesmo dispositivo físico.

```js
// Filtro de dispositivos com IDs de fornecedor USB/produto do Joy-Con do Nintendo Switch.
const filters = [
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2006 // Joy-Con Left
  },
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2007 // Joy-Con Right
  }
];

// Solicite ao usuário selecionar um dispositivo Joy-Con.
const [device] = await navigator.hid.requestDevice({ filters });
```

```js
// Veja todos os dispositivos aos quais o site já teve acesso concedido pelo usuário.
const devices = await navigator.hid.getDevices();
```

<figure>{% Img src="image/admin/gaZo8LxG3Y8eU2VirlZ4.jpg", alt="Captura de tela da solicitação de um dispositivo HID em um site.", width="800", height="513" %} <figcaption>Solicitação ao usuário para selecionar um Joy-Con do Nintendo Switch.</figcaption></figure>

Um objeto `HIDDevice` contém identificadores de fornecedor USB e de produto para a identificação do dispositivo. Seu atributo `collections` é inicializado com uma descrição hierárquica dos formatos de relatório do dispositivo.

```js
for (let collection of device.collections) {
  // Uma coleção HID inclui o uso, a página de uso, os relatórios e as subcoleções.
  console.log(`Usage: ${collection.usage}`);
  console.log(`Usage page: ${collection.usagePage}`);

  for (let inputReport of collection.inputReports) {
    console.log(`Input report: ${inputReport.reportId}`);
    // Faça um loop através de inputReport.items
  }

  for (let outputReport of collection.outputReports) {
    console.log(`Output report: ${outputReport.reportId}`);
    // Faça um loop através de outputReport.items
  }

  for (let featureReport of collection.featureReports) {
    console.log(`Feature report: ${featureReport.reportId}`);
    // Faça um loop através de featureReport.items
  }

  // Faça um loop através das subcoleções com collection.children
}
```

Os dispositivos `HIDDevice` são, por padrão, retornados em um estado "fechado" e precisam ser abertos com a chamada de `open()` antes que os dados possam ser enviados ou recebidos.

```js
// Aguarde até que a conexão HID seja aberta antes de enviar ou receber dados.
await device.open();
```

### Receba relatórios de entrada {: #receive-input-reports }

Depois que a conexão HID for estabelecida, será possível lidar com os relatórios de entrada ao escutar os eventos `"inputreport"` do dispositivo. Esses eventos contêm os dados HID como um objeto [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) (`data`), o dispositivo HID ao qual ele pertence (`device`) e o ID do relatório de 8 bits associado ao relatório de entrada (`reportId`).

<figure>{% Img src="image/admin/Hr4EXZcunl7r2TJwVvQ8.jpg", alt="Foto de um Nintendo Switch azul e vermelho.", width="800", height="575" %} <figcaption>Dispositivos Joy-Con do Nintendo Switch.</figcaption></figure>

Continuando com o exemplo anterior, o código abaixo mostra como detectar qual botão o usuário pressionou em um dispositivo Joy-Con Right para que você possa tentar em casa.

```js
device.addEventListener("inputreport", event => {
  const { data, device, reportId } = event;

  // Lide apenas com o dispositivo Joy-Con Right e o ID de relatório específico.
  if (device.productId !== 0x2007 && reportId !== 0x3f) return;

  const value = data.getUint8(0);
  if (value === 0) return;

  const someButtons = { 1: "A", 2: "X", 4: "B", 8: "Y" };
  console.log(`User pressed button ${someButtons[value]}.`);
});
```

{% Glitch { id: 'webhid-joycon-button', path: 'script.js', height: 480, allow: 'hid' } %}

### Envie relatórios de saída {: #send-output-reports }

Para enviar um relatório de saída para um dispositivo HID, transmita o ID do relatório de 8 bits associado ao relatório de saída (`reportId`) e os bytes como [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource) (`data`) para `device.sendReport()`. A promessa retornada é resolvida assim que o relatório for enviado. Se o dispositivo HID não usar IDs de relatório, defina `reportId` como 0.

O exemplo abaixo se aplica a um dispositivo Joy-Con e mostra como fazê-lo vibrar com os relatórios de saída.

```js
// Primeiro, envie um comando para ativar a vibração.
// Os números mágicos foram retirados de https://github.com/mzyy94/joycon-toolweb
const enableVibrationData = [1, 0, 1, 64, 64, 0, 1, 64, 64, 0x48, 0x01];
await device.sendReport(0x01, new Uint8Array(enableVibrationData));

// Em seguida, envie um comando para fazer o dispositivo Joy-Con vibrar.
// Os bytes reais estão disponíveis na amostra abaixo.
const rumbleData = [ /* ... */ ];
await device.sendReport(0x10, new Uint8Array(rumbleData));
```

{% Glitch { id: 'webhid-joycon-rumble', path: 'script.js', height: 480, allow: 'hid' } %}

### Envie e receba relatórios de recursos {: #feature-reports }

Os relatórios de recursos são o único tipo de relatório de dados HID que conseguem viajar em ambas as direções. Eles permitem que dispositivos HID e aplicativos troquem dados HID não padronizados. Ao contrário dos relatórios de entrada e saída, os relatórios de recursos não são recebidos ou enviados pelo aplicativo regularmente.

<figure>{% Img src="image/admin/QJiKwOCVAtUsAWUnqLxi.jpg", alt="Foto de um laptop preto e prata.", width="800", height="575" %} <figcaption>Teclado de laptop</figcaption></figure>

Para enviar um relatório de recurso a um dispositivo HID, transmita o ID de relatório de 8 bits associado ao relatório de recurso (`reportId`) e os bytes como [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource) (`data`) para `device.sendFeatureReport()`. A promessa retornada é resolvida assim que o relatório for enviado. Se o dispositivo HID não usar IDs de relatório, defina `reportId` como 0.

O exemplo abaixo ilustra o uso dos relatórios de recursos ao mostrar como solicitar, abrir e fazer piscar um dispositivo de luz de fundo do teclado Apple.

```js
const waitFor = duration => new Promise(r => setTimeout(r, duration));

// Solicite que o usuário selecione um dispositivo de luz de fundo do teclado Apple.
const [device] = await navigator.hid.requestDevice({
  filters: [{ vendorId: 0x05ac, usage: 0x0f, usagePage: 0xff00 }]
});

// Aguarde até que a conexão HID seja aberta.
await device.open();

// Blink!
const reportId = 1;
for (let i = 0; i < 10; i++) {
  // Desative
  await device.sendFeatureReport(reportId, Uint32Array.from([0, 0]));
  await waitFor(100);
  // Ative
  await device.sendFeatureReport(reportId, Uint32Array.from([512, 0]));
  await waitFor(100);
}
```

{% Glitch { id: 'webhid-apple-keyboard-backlight', path: 'script.js', height: 480, allow: 'hid' } %}

Para receber um relatório de recurso de um dispositivo HID, transmita o ID de relatório de 8 bits associado ao relatório de recurso (`reportId`) para `device.receiveFeatureReport()`. A promessa retornada é resolvida com um objeto [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) que contém o conteúdo do relatório de recurso. Se o dispositivo HID não usar IDs de relatório, defina `reportId` como 0.

```js
// Solicite o relatório de recurso.
const dataView = await device.receiveFeatureReport(/* reportId= */ 1);

// Leia o conteúdo do relatório de recurso com dataView.getInt8(), getUint8() etc...
```

### Escute a conexão e a desconexão {: #connection-disconnection }

Quando o site recebe a permissão para acessar um dispositivo HID, ele pode receber ativamente eventos de conexão e desconexão, escutando os eventos `"connect"` e `"disconnect"`.

```js
navigator.hid.addEventListener("connect", event => {
  // Abra event.device automaticamente ou avise ao usuário sobre a disponibilidade do dispositivo.
});

navigator.hid.addEventListener("disconnect", event => {
  // Remova |event.device| da IU.
});
```

## Dicas para desenvolvedores {: #dev-tips }

Depurar o HID no Chrome é fácil com a página interna, `about://device-log`, onde você consegue ver todos os eventos relacionados a dispositivos HID e USB em um único lugar.

<figure>{% Img src="image/admin/zwpr1W7oDsRw0DKsFQ9D.jpg", alt="Captura de tela da página interna para depurar o HID.", width="800", height="575" %} <figcaption>Página interna no Chrome para depurar o HID.</figcaption></figure>

## Compatibilidade com o navegador {: #browser-support }

A API WebHID está disponível em todas as plataformas para desktop (ChromeOS, Linux, macOS e Windows) no Chrome 89.

## Demonstrações {: #demos }

Algumas demonstrações da WebHID estão listadas em [web.dev/hid-examples](/hid-examples/). Confira!

## Segurança e privacidade {: #security-privacy }

Os autores das especificações projetaram e implementaram a API WebHID usando os princípios básicos definidos em [Controlando o acesso a recursos poderosos da plataforma da Web](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md), incluindo o controle do usuário, a transparência e a ergonomia. A capacidade de usar essa API é controlada principalmente por um modelo de permissão que concede acesso a um único dispositivo HID por vez. Em resposta a uma solicitação, o usuário precisa tomar medidas ativas para selecionar um determinado dispositivo HID.

Para entender as desvantagens de segurança, confira a seção [Considerações de segurança e privacidade](https://wicg.github.io/webhid/#security-and-privacy) nas especificações da WebHID.

Além disso, o Chrome inspeciona o uso de cada coleção de nível superior e, se ela tiver um uso protegido (por exemplo, teclado genérico ou mouse), o site não será capaz de enviar e receber relatórios definidos nessa coleção. A lista completa de usos protegidos está [disponível para o público](https://source.chromium.org/chromium/chromium/src/+/master:services/device/public/cpp/hid/hid_usage_and_page.cc).

Observe que os dispositivos HID sensíveis à segurança (como os dispositivos FIDO HID usados para uma autenticação mais forte) também são bloqueados no Chrome. Consulte os arquivos das listas de bloqueio de dispositivos [USB](https://source.chromium.org/chromium/chromium/src/+/master:chrome/browser/usb/usb_blocklist.cc) e [HID](https://source.chromium.org/chromium/chromium/src/+/master:services/device/public/cpp/hid/hid_blocklist.cc).

## Feedback {: #feedback }

A equipe do Chrome adoraria saber mais sobre suas ideias e experiências com a API WebHID.

### Conte-nos sobre o design da API

Há algo na API que não funciona como você esperava? Ou faltam métodos ou propriedades de que você precisa para implementar sua ideia?

Registre um problema de especificação no [repositório GitHub da API WebHID](https://github.com/wicg/webhid/issues) ou adicione suas ideias a um problema existente.

### Relate um problema com a implementação

Você encontrou um bug na implementação do Chrome? Ou a implementação é diferente da especificação?

Registre um bug em [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EHID). Inclua o máximo de detalhes possível, forneça instruções simples para reproduzir o bug e defina os *Componentes* como `Blink>HID`. O [Glitch](https://glitch.com) é ótimo para compartilhar reproduções rápidas e fáceis.

### Mostre apoio

Você está planejando usar a API WebHID? Seu apoio público ajuda a equipe do Chrome a priorizar os recursos e mostra a outros fornecedores de navegadores como o apoio é fundamental.

Envie um tweet para [@ChromiumDev](https://twitter.com/chromiumdev) usando a hashtag [`#WebHID`](https://twitter.com/search?q=%23WebHID&src=typed_query&f=live) e diga-nos onde e como você está usando a API.

## Links úteis {: #helpful }

- [Especificação](https://wicg.github.io/webhid/)
- [Rastreamento de bugs](https://crbug.com/890096)
- [Entrada em ChromeStatus.com](https://chromestatus.com/feature/5172464636133376)
- Componente Blink: [`Blink>HID`](https://chromestatus.com/features#component%3ABlink%3EHID)

## Agradecimentos

Agradecemos a [Matt Reynolds](https://github.com/nondebug) e [Joe Medley](https://github.com/jpmedley) pelas revisões deste artigo. Foto do Nintendo Switch azul e vermelho por [Sara Kurfeß](https://unsplash.com/photos/jqpRECmiNEU) e foto do laptop preto e prata por [Athul Cyriac Ajay](https://unsplash.com/photos/ndokCrfQWrI) no Unsplash.
