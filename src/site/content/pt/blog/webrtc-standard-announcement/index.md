---
title: Agora WebRTC é um padrão W3C e IETF
subhead: Uma breve visão geral da história, arquitetura, casos de uso e futuro do WebRTC.
description: Uma breve visão geral da história, arquitetura, casos de uso e futuro do WebRTC.
date: 2021-01-26
updated: 2021-01-26
authors:
  - huib
tags:
  - blog
  - media
---

O processo de definição de um padrão web é um processo demorado que garante utilidade, consistência e compatibilidade entre navegadores. Hoje, o [W3C e o IETF](https://www.w3.org/2021/01/pressrelease-webrtc-rec.html.en) marcam a conclusão de talvez um dos padrões mais importantes durante a pandemia: o WebRTC.

{% Aside %} Veja o codelab [Comunicação em tempo real com o WebRTC](https://codelabs.developers.google.com/codelabs/webrtc-web) para instruções hands-on para a implementação do WebRTC. {% endAside %}

## História {: #history}

WebRTC é uma plataforma que dá a navegadores, aplicativos móveis e aplicativos de desktop recursos de comunicação em tempo real, normalmente usados para chamadas de vídeo. A plataforma consiste de um conjunto abrangente de tecnologias e padrões. O Google iniciou a ideia de criar o WebRTC em 2009, como uma alternativa ao Adobe Flash e aplicativos de desktop que não podiam ser executados no navegador. A geração anterior de produtos baseados em navegador foi desenvolvida com base em tecnologia proprietária licenciada. Vários produtos foram desenvolvidos com essa tecnologia, incluindo Hangouts. O Google então adquiriu as empresas das quais vinha licenciando a tecnologia e a disponibilizou como o projeto WebRTC de código aberto. Esta base de código é integrada no Chrome e usada pela maioria dos aplicativos que usam WebRTC. Junto com outros fornecedores de navegadores e líderes do setor, como Mozilla, Microsoft, Cisco e Ericsson, a padronização do WebRTC foi iniciada no W3C e no IETF. Em 2013, a Mozilla e o Google [demonstraram](https://blog.chromium.org/2013/02/hello-firefox-this-is-chrome-calling.html) chamadas de vídeo entre seus navegadores. Com a evolução do padrão, muitas discussões arquitetônicas levaram a diferenças de implementação entre navegadores e desafiaram a compatibilidade e a interoperabilidade. A maioria dessas divergências foi finalmente resolvida quando o padrão foi finalizado nos últimos anos. A especificação WebRTC agora é acompanhada com um [conjunto completo de testes de plataforma](https://wpt.fyi/results/webrtc?label=experimental&label=master&aligned) e ferramentas para lidar com a compatibilidade e os navegadores têm adaptado amplamente suas implementações de acordo. Isto põe fim a um período desafiador em que os desenvolvedores web tiveram que adotar continuamente seus serviços em diferentes implementações de navegador e mudanças nas especificações.

## Arquitetura e funcionalidade {: #architecture}

A [API `RTCPeerConnection`](https://developer.mozilla.org/docs/Web/API/RTCPeerConnection) é a parte central da especificação WebRTC. A `RTCPeerConnection` trata da conexão de dois aplicativos em endpoints diferentes para se comunicarem usando um protocolo ponto a ponto. A API `PeerConnection` interage intimamente com [`getUserMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) para acessar a câmera e o microfone, e com [`getDisplayMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getDisplayMedia) para capturar o conteúdo da tela. O WebRTC permite enviar e receber streams que incluem conteúdo de áudio e/ou vídeo, bem como dados binários arbitrários através do `DataChannel`. A funcionalidade de mídia para processar, codificar e decodificar áudio e vídeo é o núcleo de qualquer implementação WebRTC. O WebRTC suporta vários codecs de áudio, sendo o Opus o mais usado e versátil. As implementações WebRTC precisam suportar o codec de vídeo VP8 gratuito do Google e ao H.264 para processamento de vídeo. As conexões WebRTC são sempre criptografadas, o que é alcançado por meio de dois protocolos existentes: DTLS e SRTP. O WebRTC depende fortemente dos padrões e tecnologias existentes, desde codecs de vídeo (VP8, H264), travessia de rede (ICE), transporte (RTP, SCTP) e protocolos de descrição de mídia (SDP). Isso tudo está documentado em mais de 50 RFCs.

## Casos de uso: quando é uma questão de milissegundos {: #use-cases }

O WebRTC é amplamente usado em aplicativos de tempo crítico, como cirurgias remotas, monitoramento de sistemas e controle remoto de carros autônomos, além de chamadas de voz ou vídeo criadas em UDP onde o armazenamento em buffer não é possível. Quase todos os serviços de chamadas de vídeo baseados em navegador de empresas como Google, Facebook, Cisco, RingCentral e Jitsi usam WebRTC. Google Stadia e NVIDIA GeForce NOW usam WebRTC para obter o stream de jogo da nuvem para um navegador sem atraso perceptível.

## A pandemia coloca o foco no desempenho das videochamadas {: #performance}

No ano passado, o WebRTC observou um aumento de 100 vezes no seu uso no Chrome devido ao aumento das chamadas de vídeo de dentro do navegador. Reconhecendo que a videochamada se tornou uma parte fundamental da vida de muitas pessoas durante a pandemia, os fornecedores de navegadores começaram a otimizar as tecnologias das quais a videochamada depende. Isto foi particularmente importante porque reuniões grandes que demandavam recursos e efeitos de vídeo se tornaram mais comuns quando funcionários e alunos começaram a trabalhar e estudar em casa. No ano passado, o Chrome se tornou até 30% mais econômico em relação ao consumo de bateria para videochamadas, com mais otimizações para cenários de uso intenso. Mozilla, Apple e Microsoft [fizeram melhorias significativas](https://www.youtube.com/watch?v=YZROn-WsyO4) em sua implementação do WebRTC durante a pandemia, principalmente garantindo que aderem ao padrão agora formalizado.

## O futuro do WebRTC {: # future}

Embora o WebRTC agora esteja concluído como um padrão W3C, as melhorias continuam. O novo codec de vídeo AV1, que [economiza até 50% da largura de banda](https://blog.google/products/duo/4-new-google-duo-features-help-you-stay-connected/), está se tornando disponível em WebRTC e navegadores web. As melhorias contínuas na base do código-fonte aberto devem reduzir ainda mais o atraso e melhorar a qualidade do vídeo que pode ser transmitido. O [WebRTC NV](https://www.w3.org/TR/webrtc-nv-use-cases/) reúne a iniciativa de criar APIs complementares para permitir novos casos de uso. Estes consistem em extensões para APIs existentes para dar mais controle sobre a funcionalidade existente, como [codificação de vídeo escalável](https://www.w3.org/TR/webrtc-svc/), bem como APIs que dão acesso a [componentes de nível inferior](https://github.com/w3c/mediacapture-insertable-streams/blob/main/explainer.md). O último oferece mais flexibilidade para os desenvolvedores web inovarem, integrando componentes WebAssembly personalizados de alto desempenho. Com as redes 5G emergentes e a demanda por serviços mais interativos, esperamos ver um aumento contínuo de serviços baseados em WebRTC no próximo ano.
