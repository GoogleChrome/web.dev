---
layout: post
title: Não está configurado para uma tela inicial personalizada
description: |2

  Aprenda a criar uma tela inicial personalizada para seu Progressive Web App.
web_lighthouse:
  - splash-screen
date: 2019-05-04
updated: 2019-09-19
---

Uma tela inicial personalizada torna seu [Progressive Web App (PWA)](/discover-installable) mais parecido com um aplicativo criado para esse dispositivo. Por padrão, quando um usuário inicia seu PWA a partir da tela de início, o Android exibe uma tela branca até que o PWA esteja pronto. O usuário pode ver essa tela em branco por até 200 ms. Ao configurar uma tela inicial personalizada, você pode mostrar aos usuários uma cor de fundo personalizada e o ícone do seu PWA, proporcionando uma experiência de marca e envolvente.

## Como a auditoria da tela inicial do Lighthouse falha

[O Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza páginas que não têm uma tela inicial personalizada:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKrrTDSCZ0XLZ7ABKlZt.png", alt="Auditoria do Lighthouse mostrando que o site não está configurado para ter uma tela inicial personalizada", width="800", height="98" %}</figure>

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como criar uma tela inicial personalizada

O Chrome para Android mostra automaticamente sua tela inicial personalizada, desde que você atenda aos seguintes requisitos no [manifesto do seu aplicativo da web:](/add-manifest)

- A propriedade `name` é definida como o nome do seu PWA.
- A propriedade `background_color` é definida como um valor de cor CSS válido.
- A matriz `icons` especifica um ícone de pelo menos 512x512 px.
- O ícone especificado existe e é um PNG.

Consulte [Adicionando uma tela inicial para aplicativos da Web instalados no Chrome 47](https://developers.google.com/web/updates/2015/10/splashscreen) para obter mais informações.

{% Aside %} Embora a auditoria do Lighthouse seja aprovada quando um único ícone de 512x512 px estiver presente, há algumas divergências sobre quais ícones um PWA deve incluir. Consulte [Auditoria: cobertura do tamanho do ícone](https://github.com/GoogleChrome/lighthouse/issues/291) para ver uma discussão sobre os prós e os contras das diferentes abordagens. {% endAside %}

## Recursos

[Código-fonte da auditoria **Não está configurado para uma tela inicial personalizada**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/splash-screen.js)
