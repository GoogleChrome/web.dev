---
title: Acesse dispositivos USB na web
subhead: A API WebUSB torna o USB mais seguro e fácil de usar, trazendo-o para a web.
authors:
  - beaufortfrancois
date: 2016-03-30
updated: 2021-02-23
hero: image/admin/hhnhxiNuRWMfGqy4NSaH.jpg
thumbnail: image/admin/RyaGPB8fHCuuXUc9Wj9Z.jpg
alt: Foto de uma placa Arduino Micro
description: A API WebUSB torna o USB mais seguro e fácil de usar, trazendo-o para a web.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webusb
---

Se eu falasse clara e simplesmente "USB", há uma boa chance de você pensar imediatamente em teclados, mouses, áudio, vídeo e dispositivos de armazenamento. Você está certo, mas você tambémencontrará outros tipos de dispositivos Universal Serial Bus (USB) por aí.

Esses dispositivos USB não padronizados exigem que os fornecedores de hardware escrevam drivers e SDKs específicos para a plataforma para que você (o desenvolvedor) possa tirar proveito deles. Infelizmente, esse código específico de plataforma evitou historicamente que esses dispositivos fossem usados pela web. E essa é uma das razões pelas quais a API WebUSB foi criada: para fornecer uma maneira de expor serviços de dispositivos USB para a web. Com esta API, os fabricantes de hardware serão capazes de construir SDKs JavaScript de multiplataforma para seus dispositivos. Mas o mais importante é que isto **deixará o USB mais seguro e fácil de usar, trazendo-o para a web**.

Vejamos o comportamento que você poderia esperar com a API WebUSB:

1. Compre um dispositivo USB.
2. Conecte-o ao seu computador. Uma notificação aparece imediatamente, com o site correto a ser acessado para este dispositivo.
3. Clique na notificação. O site está lá e pronto para usar!
4. Clique para conectar e um seletor de dispositivo USB aparecerá no Chrome, onde você poderá escolher seu dispositivo.

Pronto!

Como seria esse procedimento sem a API WebUSB?

1. Instale uma aplicação específica da plataforma.
2. Se ela for suportada no meu sistema operacional, verifique se fiz o download da coisa certa.
3. Instale a coisa. Se você tiver sorte, não receberá nenhum prompt assustador do SO ou popups avisando sobre a instalação de drivers/aplicativos da Internet. Se você não tiver sorte, os drivers ou aplicativos instalados funcionarão incorretamente e poderão danificar seu computador. (Lembre-se de que a web foi construída para [conter sites com mau funcionamento](https://www.youtube.com/watch?v=29e0CtgXZSI)).
4. Se você usar o recurso apenas uma vez, o código permanecerá no seu computador até que você pense em removê-lo. (Na Web, o espaço não utilizado é posteriormente recuperado.)

## Antes de começar

Este artigo pressupõe que você tenha algum conhecimento básico sobre o funcionamento do USB. Caso contrário, recomendo a leitura de [USB in a NutShell](http://www.beyondlogic.org/usbnutshell). Para obter informações básicas sobre USB, veja as [especificações oficiais do USB](https://www.usb.org/).

A [API WebUSB](https://wicg.github.io/webusb/) está disponível no Chrome 61.

### Disponível para provas de origem

Para obter o máximo de feedback possível dos desenvolvedores que usam a API WebUSB em campo, adicionamos anteriormente esse recurso no Chrome 54 e no Chrome 57 como uma [prova de origem](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md).

A última prova terminou com sucesso em setembro de 2017.

## Privacidade e segurança

### Apenas HTTPS

Por causa do poder deste recurso, ele só funciona em [contextos seguros](https://w3c.github.io/webappsec/specs/powerfulfeatures/#intro). Isto significa que você precisará construir com a [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) em mente.

### Gesto do usuário necessário

Como medida de segurança, `navigator.usb.requestDevice()` só pode ser chamado por meio de um gesto do usuário, como um toque ou clique do mouse.

### Política de Recursos

Uma [política de recursos](https://developer.mozilla.org/docs/Web/HTTP/Feature_Policy) é um mecanismo que permite aos desenvolvedores ativar e desativar seletivamente vários recursos e APIs do navegador. Ela pode ser definida por meio de um cabeçalho HTTP e/ou um atributo "allow" do iframe.

Você pode definir uma política de recursos que controla se o atributo usb é exposto no objeto Navigator ou, em outras palavras, se você permite WebUSB.

Eis um exemplo de uma política de cabeçalhos em que o WebUSB não é permitido:

```http
Feature-Policy: fullscreen "*"; usb "none"; payment "self" https://payment.example.com
```

Abaixo está outro exemplo de política de container onde o USB é permitido:

```html
<iframe allowpaymentrequest allow="usb; fullscreen"></iframe>
```

## Vamos começar a programar

A API WebUSB depende muito das [Promessas](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) do JavaScript. Se você não estiver familiarizado com elas, confira este incrível [tutorial sobre Promessas](/promises). Além disso, `() => {}` são simplesmente [funções de seta](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions) do ECMAScript 2015.

### Obtenha acesso a dispositivos USB

Você pode ou solicitar que o usuário selecione um único dispositivo USB conectado usando `navigator.usb.requestDevice()` ou chamar `navigator.usb.getDevices()` para obter uma lista de todos os dispositivos USB conectados aos quais a origem tem acesso.

A `navigator.usb.requestDevice()` usa um objeto JavaScript obrigatório que define `filters`. Esses filtros são usados para fazer a correspondência de qualquer dispositivo USB com o fornecedor (`vendorId`) e, opcionalmente, identificadores `productId`. As chaves `classCode`, `protocolCode`, `serialNumber` e `subclassCode` também podem ser definidas lá.

<figure>   {% Img src="image/admin/KIbPwUfEqgZZLxugxBOY.png", alt="Captura de tela do prompt do usuário do dispositivo USB no Chrome", width="800", height="533" %}   <figcaption>Solicitação do usuário do dispositivo USB.</figcaption></figure>

Por exemplo, eis como obter acesso a um dispositivo Arduino conectado e configurado para permitir a origem.

```js
navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(device => {
  console.log(device.productName);      // "Arduino Micro"
  console.log(device.manufacturerName); // "Arduino LLC"
})
.catch(error => { console.error(error); });
```

Antes que você pergunte, eu não consegui magicamente esse número hexadecimal `0x2341` Eu simplesmente procurei a palavra "Arduino" nesta [Lista de IDs USB](http://www.linux-usb.org/usb.ids).

O `device` USB retornado na promessa cumprida acima tem algumas informações básicas mas importantes sobre o dispositivo, como a versão USB suportada, tamanho máximo do pacote, IDs de fornecedor e produto, além do número de configurações possíveis que o dispositivo pode ter. Basicamente, ele contém todos os campos do [Descritor USB do dispositivo](http://www.beyondlogic.org/usbnutshell/usb5.shtml#DeviceDescriptors).

A propósito, se um dispositivo USB anunciar seu [suporte para WebUSB](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor), além de definir uma URL da página de destino, o Chrome mostrará uma notificação persistente quando o dispositivo USB for conectado. Clicar nesta notificação abrirá a página de destino.

<figure>   {% Img src="image/admin/1gRIz2wY4LYofeFq5cc3.png", alt="Captura de tela da notificação WebUSB no Chrome", width="800", height="450" %}   <figcaption>Notificação WebUSB.</figcaption></figure>

A partir daí, você pode simplesmente chamar `navigator.usb.getDevices()` e acessar seu dispositivo Arduino conforme mostrado abaixo.

```js
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log(device.productName);      // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  });
})
```

### Fale com uma placa USB Arduino

Ok, agora vamos ver como é fácil se comunicar com uma placa compatível com Arduino usando WebUSB pela porta USB. Veja as instruções em [https://github.com/webusb/arduino](https://github.com/webusb/arduino) para habilitar seus [sketches](http://www.arduino.cc/en/Tutorial/Sketch) para usar WebUSB.

Não se preocupe, abordarei todos os métodos de dispositivo WebUSB mencionados abaixo, posteriormente neste artigo.

```js
let device;

navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(selectedDevice => {
    device = selectedDevice;
    return device.open(); // Begin a session.
  })
.then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
.then(() => device.claimInterface(2)) // Request exclusive control over interface #2.
.then(() => device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 0x22,
    value: 0x01,
    index: 0x02})) // Ready to receive data
.then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint #5.
.then(result => {
  const decoder = new TextDecoder();
  console.log('Received: ' + decoder.decode(result.data));
})
.catch(error => { console.error(error); });
```

Lembre-se de que a biblioteca WebUSB que estou usando aqui está apenas implementando um protocolo de exemplo (com base no protocolo USB serial padrão) e que os fabricantes podem criar qualquer conjunto e tipo de endpoint que desejarem. As transferências de controle são especialmente adequadas para pequenos comandos de configuração, pois têm prioridade no barramento e têm uma estrutura bem definida.

E aqui está o sketch que foi carregado na placa Arduino.

```arduino
// Biblioteca WebUSB Arduino de terceiros
#include <WebUSB.h>

WebUSB WebUSBSerial (1 / * https: // * /, "webusb.github.io/arduino/demos");

#define Serial WebUSBSerial

void setup () {
Serial.begin (9600);
while (! Serial) {
; // Aguarde a conexão da porta serial.
}
Serial.write ("WebUSB FTW!");
Serial.flush ();
}

void loop () {
// Nada aqui por enquanto.
}
```

A [biblioteca WebUSB Arduino de](https://github.com/webusb/arduino/tree/gh-pages/library/WebUSB) terceiros usada no código do exemplo acima faz basicamente duas coisas:

- O dispositivo atua como um dispositivo WebUSB, permitindo que o Chrome leia a [URL da página de destino](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor).
- Ela expõe uma API Serial WebUSB que você pode usar para substituir a default.

Dê uma olhada mais uma vez no código JavaScript. Assim que obtenho o `device` escolhido pelo usuário, `device.open()` executa todas as etapas específicas da plataforma para iniciar uma sessão com o dispositivo USB. Então, tenho que selecionar uma configuração USB disponível com `device.selectConfiguration()`. Lembre-se de que uma configuração especifica como o dispositivo é alimentado, seu consumo máximo de energia e seu número de interfaces. Por falar em interfaces, também preciso solicitar acesso exclusivo com `device.claimInterface()` uma vez que os dados só podem ser transferidos para uma interface ou endpoints associados quando a interface é solicitada. Finalmente, chamar `device.controlTransferOut()` é necessário para configurar o dispositivo Arduino com os comandos apropriados para se comunicar por meio da API Serial WebUSB.

A partir daí, `device.transferIn()` executa uma transferência em massa (bulk) para o dispositivo para informá-lo de que o host está pronto para receber dados em massa. Então, a promessa é cumprida com um objeto `result` contendo um <code>data</code> <a>DataView</a> que precisam ser processado de forma apropriada.

Se você tem familiaridade com USB, tudo isso deve parecer bastante familiar.

### Quero mais

A API WebUSB permite que você interaja com todos os tipos de transferência/endpoint USB:

- As transferências CONTROL, usadas para enviar ou receber parâmetros de configuração ou comando para um dispositivo USB, são tratadas com `controlTransferIn(setup, length)` e `controlTransferOut(setup, data)`.
- As transferências INTERRUPT, usadas para uma pequena quantidade de dados sensíveis ao tempo, são tratadas com os mesmos métodos das transferências BULK com `transferIn(endpointNumber, length)` e `transferOut(endpointNumber, data)`.
- As transferências ISOCHRONOUS, usadas para streams de dados como vídeo e som, são tratadas com `isochronousTransferIn(endpointNumber, packetLengths)` e `isochronousTransferOut(endpointNumber, data, packetLengths)`.
- As transferências BULK, usadas para transferir uma grande quantidade de dados não sensíveis ao tempo de maneira confiável, são tratadas com `transferIn(endpointNumber, length)` e `transferOut(endpointNumber, data)`.

Você também pode querer dar uma olhada no [projeto WebLight](https://github.com/sowbug/weblight) de Mike Tsao, que fornece um exemplo básico de construção de um dispositivo LED controlado por USB projetado para a API WebUSB (sem usar um Arduino aqui). Você encontrará hardware, software e firmware.

## Dicas

Depurar USB no Chrome é mais fácil com a página interna `about://device-log` onde você pode ver todos os eventos relacionados a dispositivos USB num só lugar.

<figure>   {% Img src="image/admin/ssq2mMZmxpWtALortfZx.png", alt="Captura de tela da página de registro do dispositivo para depurar WebUSB no Chrome", width="800", height="442" %}   <figcaption>Página de log do dispositivo no Chrome para depurar a API WebUSB.</figcaption></figure>

A página interna `about://usb-internals` também é útil e permite simular a conexão e a desconexão de dispositivos virtuais WebUSB. Isto é útil para fazer testes de IU sem hardware real.

<figure>   {% Img src="image/admin/KB5z4p7fZRsvkfhVTNkb.png", alt="Captura de tela da página interna para depurar WebUSB no Chrome", width="800", height="294" %}   <figcaption>Página interna no Chrome para depurar a API WebUSB.</figcaption></figure>

Na maioria dos sistemas Linux, os dispositivos USB são mapeados com permissões somente leitura por default. Para permitir que o Chrome abra um dispositivo USB, você precisará adicionar uma nova [regra udev](https://www.freedesktop.org/software/systemd/man/udev.html). Crie um arquivo em `/etc/udev/rules.d/50-yourdevicename.rules` com o seguinte conteúdo:

```vim
SUBSYSTEM=="usb", ATTR{idVendor}=="[yourdevicevendor]", MODE="0664", GROUP="plugdev"
```

onde `[yourdevicevendor]` é `2341` se o seu dispositivo for um Arduino, por exemplo. `ATTR{idProduct}` também pode ser adicionado para uma regra mais específica. Certifique-se de que seu `user` seja [membro](https://wiki.debian.org/SystemGroups) do grupo `plugdev` Em seguida, basta reconectar o dispositivo.

{% Aside  %} Descritores do Microsoft OS 2.0 usados pelos exemplos do Arduino funcionam apenas no Windows 8.1 e posterior. Sem esse suporte o Windows ainda requer a instalação manual de um arquivo INF. {% endAside %}

## Recursos

- Stack Overflow: [https://stackoverflow.com/questions/tagged/webusb](https://stackoverflow.com/questions/tagged/webusb)
- Especificação da API WebUSB: [http://wicg.github.io/webusb/](https://wicg.github.io/webusb/)
- Status do recurso no Chrome: [https://www.chromestatus.com/feature/5651917954875392](https://www.chromestatus.com/feature/5651917954875392)
- Problemas de especificação: [https://github.com/WICG/webusb/issues](https://github.com/WICG/webusb/issues)
- Bugs de implementação: [http://crbug.com?q=component:Blink&gt;USB](http://crbug.com?q=component:Blink%3EUSB)
- WebUSB ❤ ️Arduino: [https://github.com/webusb/arduino](https://github.com/webusb/arduino)
- IRC: [#webusb](irc://irc.w3.org:6665/#webusb) no IRC do W3C
- Lista de correspondência do WICG: [https://lists.w3.org/Archives/Public/public-wicg/](https://lists.w3.org/Archives/Public/public-wicg/)
- Projeto WebLight: [https://github.com/sowbug/weblight](https://github.com/sowbug/weblight)

Envie um tweet para [@ChromiumDev] [cr-dev-twitter] usando a hashtag [`#WebUSB`](https://twitter.com/search?q=%23WebUSB&src=typed_query&f=live) e diga-nos onde e como você está usando a API.

## Agradecimentos

Agradecimentos a [Joe Medley](https://github.com/jpmedley) por revisar este artigo.
