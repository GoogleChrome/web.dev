---
title: Comunicação com dispositivos Bluetooth por JavaScript
subhead: |2

  A API Web Bluetooth permite que sites se comuniquem com dispositivos Bluetooth.
authors:
  - beaufortfrancois
date: 2015-07-21
updated: 2021-10-01
hero: image/admin/CME5IVhdn0pngs7jAlFX.jpg
thumbnail: image/admin/1J1OTu90a2oH8wFogKnF.jpg
alt: Um chip Bluetooth em uma moeda
description: |2

  A API Web Bluetooth permite que sites se comuniquem com dispositivos Bluetooth.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: web-bluetooth
---

E se eu dissesse que os sites podem se comunicar com dispositivos Bluetooth próximos de maneira segura e com privacidade? Dessa forma, monitores de frequência cardíaca, lâmpadas de som e até [tartarugas](https://www.youtube.com/watch?v=1LV1Fk5ZXwA) podem interagir diretamente com um site.

Até agora, a capacidade de interagir com dispositivos Bluetooth era possível apenas para aplicativos específicos da plataforma. A API Web Bluetooth tem como objetivo mudar essa situação e possibilitar que navegadores da web também façam isso.

## Antes de começarmos

Este artigo pressupõe que você tenha algum conhecimento básico de como o Bluetooth Low Energy (BLE) e o [Generic Attribute Profile](https://www.bluetooth.com/specifications/gatt/) (GATT) funcionam.

Mesmo que a [especificação da API Web Bluetooth](https://webbluetoothcg.github.io/web-bluetooth/) ainda não esteja finalizada, os autores das especificações estão procurando ativamente por desenvolvedores entusiasmados para experimentar essa API e fornecer [feedback sobre as especificações](https://github.com/WebBluetoothCG/web-bluetooth/issues) e [comentários sobre a implementação](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EBluetooth).

Um subconjunto da API Web Bluetooth está disponível no ChromeOS, Chrome para Android 6.0, Mac (Chrome 56) e Windows 10 (Chrome 70). Isso significa que você deve ser capaz de [solicitar](#request) e se [conectar a](#connect) dispositivos Bluetooth Low Energy próximos, [ler](#read)/[gravar](#write) características do Bluetooth, [receber notificações GATT](#notifications), saber quando um [dispositivo Bluetooth é desconectado](#disconnect) e até [ler e gravar descritores Bluetooth](#descriptors). Consulte a tabela de [compatibilidade com navegador](https://developer.mozilla.org/docs/Web/API/Web_Bluetooth_API#Browser_compatibility) do MDN para obter mais informações.

Para Linux e versões anteriores do Windows, habilite o sinalizador `#experimental-web-platform-features` `about://flags`.

### Disponível para testes de origem

Para obter o máximo de feedback possível dos desenvolvedores que usam a API Web Bluetooth no campo, o Chrome já adicionou esse recurso no Chrome 53 como uma [versão de teste original](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md) para o ChromeOS, Android e Mac.

O teste foi finalizado com êxito em janeiro de 2017.

## Requisitos de segurança

Para entender as vantagens e desvantagens da segurança, recomendo a [publicação do modelo de segurança do Web Bluetooth](https://medium.com/@jyasskin/the-web-bluetooth-security-model-666b4e7eed2) de Jeffrey Yasskin, engenheiro de software da equipe do Chrome, que trabalha na especificação da API Web Bluetooth.

### Apenas HTTPS

Como essa API experimental é um recurso novo e poderoso adicionado à web, está disponível apenas para [contextos seguros](https://w3c.github.io/webappsec-secure-contexts/#intro). Isso significa que você precisará construir com o [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) em mente.

### Gesto do usuário necessário

Como recurso de segurança, a descoberta de dispositivos Bluetooth com `navigator.bluetooth.requestDevice` deve ser acionada por [um gesto do usuário](https://html.spec.whatwg.org/multipage/interaction.html#activation), como toque ou clique do mouse. Estamos falando sobre ouvir eventos de [`pointerup`](https://developer.chrome.com/blog/pointer-events/), `click` e `touchend`.

```js
button.addEventListener('pointerup', function(event) {
  // Call navigator.bluetooth.requestDevice
});
```

## Entre no código

A API Web Bluetooth depende muito das [Promessas](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) do JavaScript. Se você não estiver familiarizado com elas, confira este incrível [tutorial sobre Promessas](/promises). Além disso, `() => {}` são simplesmente [funções de seta](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions) do ECMAScript 2015.

### Solicite dispositivos Bluetooth {: #request}

Esta versão da especificação da API Web Bluetooth permite que sites, executando na função Central, se conectem a servidores GATT remotos por meio de uma conexão BLE. É compatível com comunicação entre dispositivos que implementam Bluetooth 4.0 ou mais recente.

Quando um site solicita acesso a dispositivos próximos usando `navigator.bluetooth.requestDevice`, o navegador exibe ao usuário um seletor de dispositivos no qual é possível escolher um dispositivo ou simplesmente cancelar a solicitação.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/bluetooth/bluetooth-device-chooser.mp4">
  </source></video>
  <figcaption>
    <p data-md-type="paragraph"><a href="https://webbluetoothcg.github.io/demos/playbulb-candle/">Prompt do usuário de dispositivo Bluetooth.</a></p>
  </figcaption></figure>

O `navigator.bluetooth.requestDevice()` obtém um objeto obrigatório que define os filtros. Esses filtros são usados para retornar apenas dispositivos que correspondam a alguns serviços GATT Bluetooth anunciados e/ou o nome do dispositivo.

#### Filtro de serviços

Por exemplo, para solicitar dispositivos Bluetooth que anunciam o [serviço de bateria Bluetooth GATT](https://www.bluetooth.com/specifications/gatt/):

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

Se o seu serviço Bluetooth GATT não estiver na lista de [serviços Bluetooth GATT padronizados](https://www.bluetooth.com/specifications/assigned-numbers/), você poderá inserir o UUID Bluetooth completo ou um formato curto de 16 ou 32 bits.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    services: [0x1234, 0x12345678, '99999999-0000-1000-8000-00805f9b34fb']
  }]
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### Filtro de nome

Você também pode solicitar dispositivos Bluetooth com base no nome do dispositivo anunciado com a chave de filtros `name` ou até um prefixo desse nome com a chave de filtros `namePrefix`. Observe que, nesse caso, você também precisará definir a chave `optionalServices` para poder acessar serviços não incluídos em um filtro de serviço. Do contrário, você obterá um erro mais tarde ao tentar acessá-los.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    name: 'Francois robot'
  }],
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### Filtro de dados do fabricante

Também é possível solicitar dispositivos Bluetooth com base nos dados específicos do fabricante anunciados com a chave de filtros `manufacturerData`. Essa chave é uma matriz de objetos com uma chave obrigatória de [identificação de empresa Bluetooth](https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/), com o nome `companyIdentifier`. Você também pode fornecer um prefixo de dados que filtra os dados do fabricante de dispositivos Bluetooth que iniciam com ele. Observe que você também precisará definir a chave `optionalServices` para poder acessar serviços não incluídos em um filtro de serviço. Do contrário, você obterá um erro mais tarde ao tentar acessá-los.

```js
// Filter Bluetooth devices from Google company with manufacturer data bytes
// that start with [0x01, 0x02].
navigator.bluetooth.requestDevice({
  filters: [{
    manufacturerData: [{
      companyIdentifier: 0x00e0,
      dataPrefix: new Uint8Array([0x01, 0x02])
    }]
  }],
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

Uma máscara também pode ser usada com um prefixo de dados para corresponder a alguns padrões nos dados do fabricante. Confira o [explicador de filtros de dados Bluetooth](https://github.com/WebBluetoothCG/web-bluetooth/blob/main/data-filters-explainer.md) para saber mais.

{% Aside %} No momento em que este artigo foi escrito, a chave de filtro `manufacturerData` está disponível no Chrome 92. Se deseja compatibilidade com navegadores mais antigos, é necessário fornecer uma opção de fallback, pois o filtro de dados do fabricante é considerado vazio. Veja um [exemplo](https://groups.google.com/a/chromium.org/g/blink-dev/c/5Id2LANtFko/m/5SIig7ktAgAJ). {% endAside %}

#### Sem filtros

Por fim, em vez de `filters`, você pode usar a chave `acceptAllDevices` para mostrar todos os dispositivos Bluetooth próximos. Também será necessário definir a chave `optionalServices` para poder acessar alguns serviços. Do contrário, um erro ocorrerá mais tarde ao tentar acessá-los.

```js
navigator.bluetooth.requestDevice({
  acceptAllDevices: true,
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

{% Aside 'caution' %} Isso pode resultar na exibição de vários dispositivos não relacionados mostrados no seletor, além de desperdício de energia, pois não há filtros. Use com cuidado. {% endAside %}

### Conecte-se a um dispositivo Bluetooth {: #connect }

Então, o que fazer agora que você tem um `BluetoothDevice`? Vamos nos conectar ao servidor GATT remoto Bluetooth que contém as definições de serviço e características.

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {
  // Human-readable name of the device.
  console.log(device.name);

  // Attempts to connect to remote GATT Server.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });
```

### Leia uma característica do Bluetooth {: #read }

Estamos conectados ao servidor GATT do dispositivo Bluetooth remoto. Agora queremos obter um Serviço GATT Primário e ler uma característica que pertence a esse serviço. Vamos tentar, por exemplo, ler o nível de carga atual da bateria do dispositivo.

No exemplo abaixo, `battery_level` é a [Característica Nível de Bateria padronizada](https://www.bluetooth.com/specifications/gatt/).

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => device.gatt.connect())
.then(server => {
  // Getting Battery Service…
  return server.getPrimaryService('battery_service');
})
.then(service => {
  // Getting Battery Level Characteristic…
  return service.getCharacteristic('battery_level');
})
.then(characteristic => {
  // Reading Battery Level…
  return characteristic.readValue();
})
.then(value => {
  console.log(`Battery percentage is ${value.getUint8(0)}`);
})
.catch(error => { console.error(error); });
```

Se você usar uma característica GATT Bluetooth personalizada, é possível inserir o UUID Bluetooth completo ou um formulário curto de 16 ou 32 bits para `service.getCharacteristic`.

Note que você também pode adicionar um ouvinte de evento `characteristicvaluechanged` em uma característica para ler seu valor. Verifique a [Amostra alterada de leitura de valor de característica](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html) para ver como tratar as próximas notificações do GATT opcionalmente.

```js
…
.then(characteristic => {
  // Set up event listener for when characteristic value changes.
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleBatteryLevelChanged);
  // Reading Battery Level…
  return characteristic.readValue();
})
.catch(error => { console.error(error); });

function handleBatteryLevelChanged(event) {
  const batteryLevel = event.target.value.getUint8(0);
  console.log('Battery percentage is ' + batteryLevel);
}
```

### Grave em uma característica Bluetooth {: #write }

Gravar em uma característica GATT Bluetooth é tão fácil quanto ler. Desta vez, vamos usar o Ponto de Controle da Freqüência Cardíaca para redefinir o valor do campo Energia Despendida para 0 em um dispositivo de monitoramento de freqüência cardíaca.

Eu prometo que não há mágica aqui. Tudo está explicado na [página Característica Ponto de Controle da Freqüência Cardíaca](https://www.bluetooth.com/specifications/gatt/).

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_control_point'))
.then(characteristic => {
  // Writing 1 is the signal to reset energy expended.
  const resetEnergyExpended = Uint8Array.of(1);
  return characteristic.writeValue(resetEnergyExpended);
})
.then(_ => {
  console.log('Energy expended has been reset.');
})
.catch(error => { console.error(error); });
```

### Receba notificações GATT {: #notifications }

Agora veremos como receber notificações quando a característica [Medição de Frequência Cardíaca](https://www.bluetooth.com/specifications/gatt/) for alterada no dispositivo:

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_measurement'))
.then(characteristic => characteristic.startNotifications())
.then(characteristic => {
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleCharacteristicValueChanged);
  console.log('Notifications have been started.');
})
.catch(error => { console.error(error); });

function handleCharacteristicValueChanged(event) {
  const value = event.target.value;
  console.log('Received ' + value);
  // TODO: Parse Heart Rate Measurement value.
  // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
}
```

A [Amostra de Notificações](https://googlechrome.github.io/samples/web-bluetooth/notifications.html) mostra como parar notificações com `stopNotifications()` e remover corretamente o ouvinte de evento `characteristicvaluechanged` adicionado.

### Desconecte-se de um dispositivo Bluetooth {: #disconnect }

Para proporcionar uma experiência melhor ao usuário, você pode ouvir eventos de desconexão e convidar o usuário a se reconectar:

```js
navigator.bluetooth.requestDevice({ filters: [{ name: 'Francois robot' }] })
.then(device => {
  // Set up event listener for when device gets disconnected.
  device.addEventListener('gattserverdisconnected', onDisconnected);

  // Attempts to connect to remote GATT Server.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });

function onDisconnected(event) {
  const device = event.target;
  console.log(`Device ${device.name} is disconnected.`);
}
```

Você também pode chamar `device.gatt.disconnect()` para desconectar seu aplicativo da web do dispositivo Bluetooth. Isso acionará os ouvintes de eventos exisentes do `gattserverdisconnected`. Observe que a comunicação do dispositivo Bluetooth NÃO será interrompida se outro aplicativo já estiver se comunicando com o dispositivo Bluetooth. Verifique a [Amostra de Desconexão de Dispositivo](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html) e a [Amostra de Reconexão Automática](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html) para saber mais.

{% Aside 'caution' %} Atributos, serviços, características, entre outros, do Bluetooth GATT são invalidados quando um dispositivo é desconectado. Isso significa que seu código deve sempre recuperar (por meio de `getPrimaryService(s)` , `getCharacteristic(s)`, etc.) esses atributos após a reconexão. {% endAside %}

### Leia e grave em descritores Bluetooth {: #descriptors }

Os descritores GATT do Bluetooth são atributos que descrevem um valor característico. Você pode lê-los e gravá-los de maneira semelhante às características do Bluetooth GATT.

Vamos ver, por exemplo, como ler a descrição do usuário do intervalo de medição do termômetro de integridade do dispositivo.

No exemplo abaixo, `health_thermometer` é o [Serviço de Termômetro de Integridade](https://www.bluetooth.com/specifications/gatt/), `measurement_interval`  é a [característica Intervalo de Medição](https://www.bluetooth.com/specifications/gatt/) e `gatt.characteristic_user_description` é o [descritor Descrição de Usuário Característico](https://www.bluetooth.com/specifications/assigned-numbers/).

```js/4-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => descriptor.readValue())
.then(value => {
  const decoder = new TextDecoder('utf-8');
  console.log(`User Description: ${decoder.decode(value)}`);
})
.catch(error => { console.error(error); });
```

Agora que lemos a descrição do usuário do intervalo de medição do termômetro de integridade do dispositivo, vamos ver como atualizá-lo e gravar um valor personalizado.

```js/5-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => {
  const encoder = new TextEncoder('utf-8');
  const userDescription = encoder.encode('Defines the time between measurements.');
  return descriptor.writeValue(userDescription);
})
.catch(error => { console.error(error); });
```

## Amostras, demonstrações e codelabs

Todos [os exemplos da Web Bluetooth](https://googlechrome.github.io/samples/web-bluetooth/index.html) abaixo foram testados com êxito. Para aproveitar essas amostras ao máximo, recomendo que você instale o [aplicativo BLE Peripheral Simulator Android,](https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral) que simula um periférico BLE com um serviço de bateria, um serviço de frequência cardíaca ou um serviço de termômetro de integridade.

### Principiante

- [Informações do dispositivo](https://googlechrome.github.io/samples/web-bluetooth/device-info.html) - recupera informações básicas do dispositivo em um dispositivo BLE.
- [Nível da bateria](https://googlechrome.github.io/samples/web-bluetooth/battery-level.html) - recupera as informações da bateria em um dispositivo BLE que anuncia as informações da bateria.
- [Redefinir energia](https://googlechrome.github.io/samples/web-bluetooth/reset-energy.html) - redefine a energia despendida em um dispositivo BLE que anuncia a frequência cardíaca.
- [Propriedades da característica](https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html) - exibe todas as propriedades de uma característica específica de um dispositivo BLE.
- [Notificações](https://googlechrome.github.io/samples/web-bluetooth/notifications.html) - inicie e pare notificações de características em um dispositivo BLE.
- [Desconexão do dispositivo](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html) - desconecte e seja notificado de uma desconexão de um dispositivo BLE após conectar-se.
- [Obtenha características](https://googlechrome.github.io/samples/web-bluetooth/get-characteristics.html) - obtenha todas as características de um serviço anunciado em um dispositivo BLE.
- [Obtenha descritores](https://googlechrome.github.io/samples/web-bluetooth/get-descriptors.html) - obtenha todos os descritores das características de um serviço anunciado em um dispositivo BLE.
- [Filtro de dados do fabricante](https://googlechrome.github.io/samples/web-bluetooth/manufacturer-data-filter.html) - recupera informações básicas do dispositivo em um dispositivo BLE que correspondem aos dados do fabricante.

### Combinando múltiplas operações

- [Características GAP](https://googlechrome.github.io/samples/web-bluetooth/gap-characteristics.html) - obtenha todas as características GAP de um dispositivo BLE.
- [Características de informações do dispositivo](https://googlechrome.github.io/samples/web-bluetooth/device-information-characteristics.html) - obtenha todas as características de informações do dispositivo de um dispositivo BLE.
- [Perda de link](https://googlechrome.github.io/samples/web-bluetooth/link-loss.html) - defina a característica do nível de alerta de um dispositivo BLE (readValue e writeValue).
- [Descubra serviços e características](https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html) - descubra todos os serviços primários acessíveis e suas características em um dispositivo BLE.
- [Reconexão automática](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html) - reconecte-se a um dispositivo BLE desconectado usando um algoritmo de backoff exponencial.
- [Read Characteristic Value Changed](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html) - leia o nível da bateria e seja notificado sobre as alterações em um dispositivo BLE.
- [Ler descritores](https://googlechrome.github.io/samples/web-bluetooth/read-descriptors.html) - leia todos os descritores de características de um serviço em um dispositivo BLE.
- [Write Descriptor](https://googlechrome.github.io/samples/web-bluetooth/write-descriptor.html) - grave no descritor "Descrição de Usuário Característico" em um dispositivo BLE.

Confira também nossas [Demos da Web Bluetooth coletadas](https://github.com/WebBluetoothCG/demos) e [Codelabs oficiais da Web Bluetooth](https://github.com/search?q=org%3Agooglecodelabs+bluetooth).

## Bibliotecas

- [web-bluetooth-utils](https://www.npmjs.com/package/web-bluetooth-utils) é um módulo npm que adiciona algumas funções convenientes à API.
- Um shim de API Web Bluetooth está disponível no [noble](https://github.com/sandeepmistry/noble), o módulo central Node.js BLE mais popular. Isso permite que você empacote/navegue na web noble sem a necessidade de um servidor WebSocket ou outros plug-ins.
- [angular-web-bluetooth](https://github.com/manekinekko/angular-web-bluetooth) é um módulo para [Angular](https://angularjs.org) que abstrai todo o clichê necessário para configurar a API Web Bluetooth.

## Ferramentas

- [Introdução à Web Bluetooth](https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator) é um aplicativo da web simples que irá gerar todo o código padrão do JavaScript para começar a interagir com um dispositivo Bluetooth. Insira um nome de dispositivo, um serviço, uma característica, defina suas propriedades e pronto.
- Se você já for um desenvolvedor Bluetooth, o [Web Bluetooth Developer Studio Plugin](https://github.com/beaufortfrancois/sandbox/tree/gh-pages/web-bluetooth/bluetooth-developer-studio-plugin) também gerará o código do Web Bluetooth JavaScript para o seu dispositivo Bluetooth.

## Dicas

Uma **página Bluetooth Internals** está disponível no Chrome em `about://bluetooth-internals` para que você possa inspecionar tudo sobre dispositivos Bluetooth próximos: status, serviços, características e descritores.

<figure>{% Img src="image/admin/nPX2OfcQKwKtU9xBNhMe.jpg", alt="Captura de tela da página interna para depurar Bluetooth no Chrome", width="800", height="572" %}<figcaption> Página interna no Chrome para depurar dispositivos Bluetooth.</figcaption></figure>

Também recomendo verificar a página oficial [Como arquivar bugs do Web Bluetooth](https://sites.google.com/a/chromium.org/dev/developers/how-tos/file-web-bluetooth-bugs), pois às vezes pode ser difícil depurar o Bluetooth.

{% Aside 'caution' %} Ler e gravar nas características do Bluetooth em paralelo pode gerar erros, dependendo da plataforma. Eu sugiro fortemente que você enfileire manualmente as solicitações de operação do GATT quando apropriado. Consulte ["Operação GATT em andamento - como lidar com isso?"](https://github.com/WebBluetoothCG/web-bluetooth/issues/188). {% endAside %}

## Próximos passos

Verifique o [status de implementação do navegador e da plataforma](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md) primeiro para saber quais partes da API Web Bluetooth estão sendo implementadas no momento.

Embora ainda esteja incompleta, aqui está uma prévia do que esperar no futuro próximo:

- A [varredura de anúncios BLE próximos](https://github.com/WebBluetoothCG/web-bluetooth/pull/239) acontecerá com `navigator.bluetooth.requestLEScan()` .
- Um novo `serviceadded` rastreará os serviços Bluetooth GATT recém-descobertos, enquanto o `serviceremoved` rastreará os removidos. Um novo `servicechanged` será disparado quando qualquer característica e/ou descritor for adicionado ou removido de um serviço GATT Bluetooth.

### Mostre seu apoio à API

Você está planejando usar a API Web Bluetooth? Seu apoio público ajuda a equipe do Chrome a priorizar os recursos e mostra a outros fornecedores de navegadores como o apoio é fundamental.

Envie um tweet para [@ChromiumDev](https://twitter.com/ChromiumDev) usando a hashtag [`#WebBluetooth`](https://twitter.com/search?q=%23WebBluetooth&src=typed_query&f=live) e diga-nos onde e como você está usando a API.

## Recursos

- Stack Overflow: [https://stackoverflow.com/questions/tagged/web-bluetooth](https://stackoverflow.com/questions/tagged/web-bluetooth)
- Status do recurso do Chrome: [https://www.chromestatus.com/feature/5264933985976320](https://www.chromestatus.com/feature/5264933985976320)
- Erros de implementação do Chrome: [https://crbug.com/?q=component:Blink&gt;Bluetooth](https://crbug.com/?q=component:Blink%3EBluetooth)
- Especificação de Bluetooth da web: [https://webbluetoothcg.github.io/web-bluetooth](https://webbluetoothcg.github.io/web-bluetooth)
- Problemas de especificações: [https://github.com/WebBluetoothCG/web-bluetooth/issues](https://github.com/WebBluetoothCG/web-bluetooth/issues)
- Aplicativo BLE Peripheral Simulator: [https://github.com/WebBluetoothCG/ble-test-peripheral-android](https://github.com/WebBluetoothCG/ble-test-peripheral-android)

{% YouTube '_BUwOBdLjzQ'%}

## Reconhecimentos

Agradecimentos a [Kayce Basques](https://github.com/kaycebasques) por revisar este artigo. Imagem do herói elaborada por [SparkFun Electronics de Boulder, EUA](https://commons.wikimedia.org/wiki/File:Bluetooth_4.0_Module_-_BR-LE_4.0-S2A_(16804031059).jpg).
