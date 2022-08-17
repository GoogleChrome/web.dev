---
title: Acessando dispositivos de hardware na web
subhead: |2

  Escolha a API apropriada para se comunicar com um dispositivo de hardware de sua escolha.
description: |2

  Este artigo ajuda os desenvolvedores da Web a escolher a API de hardware certa com base em um determinado dispositivo.
authors:
  - beaufortfrancois
date: 2021-02-12
updated: 2021-11-16
hero: image/admin/vAnNpGQruw5EUXxob47V.jpg
alt: Uma mulher sentada em frente a uma foto de mesa de madeira.
tags:
  - blog
  - capabilities
  - devices
---

O objetivo deste guia é ajudá-lo a escolher a melhor API para se comunicar com um dispositivo de hardware (por exemplo, webcam, microfone, etc.) na web. Por "melhor", quero dizer que oferece tudo o que você precisa com o mínimo de trabalho. Em outras palavras, você conhece o caso de uso geral que deseja resolver (por exemplo, acessar vídeo), mas não sabe qual API usar ou se pergunta se há outra maneira de fazer isso.

Um problema que normalmente vejo os desenvolvedores da web cairem é pular para APIs de baixo nível sem aprender sobre as APIs de nível superior que são mais fáceis de implementar e fornecem uma UX melhor. Portanto, este guia começa recomendando APIs de nível superior primeiro, mas também menciona APIs de nível inferior caso você tenha determinado que a API de nível superior não atende às suas necessidades.

## 🕹 Receba eventos de entrada deste dispositivo {: #input}

Tente ouvir eventos de [teclado](https://developer.mozilla.org/docs/Web/API/KeyboardEvent) e [ponteiro.](https://developer.mozilla.org/docs/Web/API/Pointer_events) Se este dispositivo for um controlador de jogo, use a [API](/gamepad/) do Gamepad para saber quais botões estão sendo pressionados e quais eixos são movidos.

Se nenhuma dessas opções funcionar para você, uma API de baixo nível pode ser a solução. Confira [Descubra como se comunicar com seu dispositivo](#discover) para iniciar sua jornada.

## 📸 Acesse áudio e vídeo a partir deste dispositivo {: #audio-video}

Use [MediaDevices.getUserMedia ()](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) para obter fluxos de áudio e vídeo ao vivo a partir deste dispositivo e aprender sobre a [captura de áudio e vídeo](https://www.html5rocks.com/en/tutorials/getusermedia/intro/) . Você também pode [controlar a panorâmica, inclinação e zoom da câmera](/camera-pan-tilt-zoom/) e outras configurações da câmera, como [brilho e contraste](https://developers.google.com/web/updates/2016/12/imagecapture) , e até mesmo [tirar fotos](https://beaufortfrancois.github.io/sandbox/image-capture/playground) . [O Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API) pode ser usado para adicionar efeitos ao áudio, criar visualizações de áudio ou aplicar efeitos espaciais (como panorâmica). Veja [como traçar o perfil de desempenho de aplicativos de áudio da web](/profiling-web-audio-apps-in-chrome/) no Chrome também.

Se nenhuma dessas opções funcionar para você, uma API de baixo nível pode ser a solução. Confira [Descubra como se comunicar com seu dispositivo](#discover) para iniciar sua jornada.

## 🖨 Imprima neste dispositivo {: #print}

Use [window.print ()](https://developer.mozilla.org/docs/Web/API/Window/print) para abrir uma caixa de diálogo do navegador que permite ao usuário escolher este dispositivo como um destino para imprimir o documento atual.

Se isso não funcionar para você, uma API de baixo nível pode ser a solução. Confira [Descubra como se comunicar com seu dispositivo](#discover) para iniciar sua jornada.

## 🔐 Autentique-se com este dispositivo {: #auth}

Use o [WebAuthn](https://webauthn.io/) para criar uma credencial de chave pública forte, atestada e com escopo de origem com este dispositivo de segurança de hardware para autenticar usuários. Ele suporta o uso de Bluetooth, NFC e autenticadores U2F ou FIDO2 em roaming USB - também conhecidos como chaves de segurança - bem como um autenticador de plataforma, que permite aos usuários autenticar com suas impressões digitais ou bloqueios de tela. Confira [Construir seu primeiro aplicativo WebAuthn](https://developers.google.com/codelabs/webauthn-reauth) .

Se este dispositivo for outro tipo de dispositivo de segurança de hardware (por exemplo, uma carteira de criptomoeda), uma API de baixo nível pode ser a solução. Confira [Descubra como se comunicar com seu dispositivo](#discover) para iniciar sua jornada.

## 🗄 Acesse arquivos neste dispositivo {: #files}

Use a [API de acesso](/file-system-access/) ao sistema de arquivos para ler e salvar alterações diretamente em arquivos e pastas no dispositivo do usuário. Se não estiver disponível, use a [API de arquivo](https://developer.mozilla.org/docs/Web/API/File/Using_files_from_web_applications) para solicitar ao usuário que selecione os arquivos locais em uma caixa de diálogo do navegador e, em seguida, leia o conteúdo desses arquivos.

Se nenhuma dessas opções funcionar para você, uma API de baixo nível pode ser a solução. Confira [Descubra como se comunicar com seu dispositivo](#discover) para iniciar sua jornada.

## 🧲 Acessar sensores neste dispositivo {: #sensors}

Use a [API Generic Sensor](/generic-sensor/) para ler os valores brutos dos sensores de movimento (por exemplo, acelerômetro ou giroscópio) e sensores ambientais (por exemplo, luz ambiente, magnetômetro). Se não estiver disponível, use os eventos [DeviceMotion e DeviceOrientation](https://developers.google.com/web/fundamentals/native-hardware/device-orientation) para obter acesso ao acelerômetro, giroscópio e bússola integrados em dispositivos móveis.

Se não funcionar para você, uma API de baixo nível pode ser a solução. Confira [Descubra como se comunicar com seu dispositivo](#discover) para iniciar sua jornada.

## 🛰 Acesse as coordenadas GPS neste dispositivo {: #gps}

Use a [API de geolocalização](/native-hardware-user-location/) para obter a latitude e longitude da posição atual do usuário neste dispositivo.

Se não funcionar para você, uma API de baixo nível pode ser a solução. Confira [Descubra como se comunicar com seu dispositivo](#discover) para iniciar sua jornada.

## 🔋 Verifique a bateria deste dispositivo {: #battery}

Use a [API de bateria](https://developer.mozilla.org/docs/Web/API/Battery_Status_API) para obter informações do host sobre o nível de carga da bateria e ser notificado quando o nível da bateria ou o status de carga mudar.

Se não funcionar para você, uma API de baixo nível pode ser a solução. Confira [Descubra como se comunicar com seu dispositivo](#discover) para iniciar sua jornada.

## 📞 Comunique-se com este dispositivo pela rede {: #network}

Na rede local, use a [API de reprodução remota](https://www.chromestatus.com/feature/5778318691401728) para transmitir áudio e/ou vídeo em um dispositivo de reprodução remoto (por exemplo, uma TV inteligente ou um alto-falante sem fio) ou use a [API de apresentação](https://developers.google.com/web/updates/2018/04/present-web-pages-to-secondary-attached-displays) para renderizar uma página da web em uma segunda tela (por exemplo, uma tela secundária conectada com um cabo HDMI ou uma smart TV com conexão sem fio).

Se este dispositivo expõe um servidor da web, use a [API Fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API) e/ou [WebSockets](https://developer.mozilla.org/docs/Web/API/WebSockets_API) para buscar alguns dados deste dispositivo acessando os terminais apropriados. Embora os soquetes TCP e UDP não estejam disponíveis na web, verifique o [WebTransport](/webtransport/) para lidar com conexões de rede interativas, bidirecionais e multiplexadas. Observe que o [WebRTC](/webrtc-standard-announcement/) também pode ser usado para comunicar dados em tempo real com outros navegadores usando um protocolo ponto a ponto.

## 🧱 Descubra como se comunicar com seu dispositivo {: #discover}

A decisão de qual API de baixo nível você deve usar é determinada pela natureza de sua conexão física com o dispositivo. Se for sem fio, verifique o Web NFC para conexões sem fio de curto alcance e Web Bluetooth para dispositivos sem fio próximos.

- Com o [Web NFC](/nfc) , leia e escreva neste dispositivo quando ele estiver próximo ao dispositivo do usuário (geralmente 5–10 cm, 2–4 polegadas). Ferramentas como [NFC TagInfo da NXP](https://play.google.com/store/apps/details?id=com.nxp.taginfolite) permitem que você navegue no conteúdo deste dispositivo para fins de engenharia reversa.

- Com o [Web Bluetooth](/bluetooth/) , conecte-se a este dispositivo por meio de uma conexão Bluetooth Low Energy. Deve ser muito fácil se comunicar com ele quando ele usa serviços Bluetooth GATT padronizados (como o serviço de bateria), pois seu comportamento é [bem documentado](https://www.bluetooth.com/specifications/gatt/) . Caso contrário, neste ponto, você deve encontrar alguma documentação de hardware para este dispositivo ou fazer engenharia reversa nele. Você pode usar ferramentas externas como [nRF Connect for Mobile](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp) e ferramentas de navegador integradas, como a página interna `about://bluetooth-internals` em navegadores baseados em Chromium para isso. Confira a [engenharia reversa de uma lâmpada Bluetooth](https://urish.medium.com/reverse-engineering-a-bluetooth-lightbulb-56580fcb7546) da Uri Shaked. Observe que os dispositivos Bluetooth também podem falar o HID ou protocolos seriais.

Se conectado, verifique essas APIs nesta ordem específica:

1. Com o [WebHID](/hid/) , compreender os relatórios e descritores de relatórios da HID por meio de [coleções](https://webhid-collections.glitch.me/) é a chave para a sua compreensão deste dispositivo. Isso pode ser desafiador sem a documentação do fornecedor para este dispositivo. Ferramentas como o [Wireshark](https://gitlab.com/wireshark/wireshark/-/wikis/CaptureSetup/USB) podem ajudá-lo a fazer a engenharia reversa.

2. Com o [Web Serial](/serial/) , sem a documentação do fornecedor para este dispositivo e quais comandos ele suporta, é difícil, mas ainda é possível com adivinhação. A engenharia reversa desse dispositivo pode ser feita capturando o tráfego USB bruto com ferramentas como o [Wireshark](https://gitlab.com/wireshark/wireshark/-/wikis/CaptureSetup/USB) . Você também pode usar o [aplicativo da web Terminal Serial](https://googlechromelabs.github.io/serial-terminal/) para fazer experiências com este dispositivo se ele usar um protocolo legível por humanos.

3. Com o [WebUSB](/usb/) , sem documentação clara para este dispositivo e quais comandos USB este dispositivo suporta, é difícil, mas ainda é possível com adivinhação. Assista [Explorando WebUSB e seu potencial empolgante](https://www.youtube.com/watch?v=IpfZ8Nj3uiE) de Suz Hinton. Você também pode fazer a engenharia reversa deste dispositivo capturando tráfego USB bruto e inspecionando [descritores USB](https://www.beyondlogic.org/usbnutshell/usb5.shtml) com ferramentas externas como Wireshark e ferramentas de navegador integradas, como a página interna `about://usb-internals` em navegadores baseados em Chromium.

## Agradecimentos {: #acknowledgements}

Agradecimentos a [Reilly Grant](https://github.com/reillyeon) , [Thomas Steiner](/authors/thomassteiner/) e [Kayce Basques](/authors/kaycebasques/) pela revisão deste artigo.

Foto de [Darya Tryfanava](https://unsplash.com/@darya_tryfanava) no [Unsplash](https://unsplash.com/photos/uZBGDkYkvhM) .
