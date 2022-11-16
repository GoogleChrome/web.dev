---
layout: post
title: Não registra um service worker que controla a página e `start_url`
description: |2

  Aprenda a registrar um service worker que ofereça suporte ao Progressive Web App

  recursos como funcionalidade offline, notificações push e instalabilidade.
web_lighthouse:
  - service-worker
date: 2019-05-04
updated: 2020-06-10
---

Registrar um [service worker](/service-workers-cache-storage/) é a primeira etapa para habilitar os principais recursos do [Progressive Web App (PWA)](/discover-installable):

- Funciona offline
- Suporta notificações push
- Pode ser instalado no dispositivo

Saiba mais em [Service workers](/service-workers-cache-storage/) e na postagem da API Cache Storage.

## Compatibilidade do navegador

Todos os principais navegadores, exceto o Internet Explorer, oferecem suporte a trabalhadores de serviço. Consulte [compatibilidade do navegador](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility) .

## Como a auditoria do service worker do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza páginas que não registram um service worker:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URqaGD5akD2LNczr0jjQ.png", alt="Auditoria do Lighthouse mostrando que o site não registra um service worker", width="800", height="95" %}</figure>

O Lighthouse verifica se o [protocolo de depuração remota  do Chrome](https://github.com/ChromeDevTools/devtools-protocol) retorna uma versão do service worker. Do contrário, a auditoria falha.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como registrar um service worker

{% include 'content/reliable/workbox.njk' %}

O registro de um service worker envolve apenas algumas linhas de código, mas o único motivo pelo qual você utilizaria um ervice worker é para possibilitar a implementação de um dos recursos do PWA descritos acima. Na verdade, a implementação desses recursos requer mais trabalho:

- Para aprender como armazenar arquivos em cache para uso offline, consulte a publicação [O que é confiabilidade de rede e como você a mede?](/network-connections-unreliable).
- Para saber como tornar seu aplicativo instalável, consulte o codelab [Torne-o instalável.](/codelab-make-installable/)
- Para saber como habilitar notificações push, consulte [Adicionando notificações push a um aplicativo da web do Google](https://codelabs.developers.google.com/codelabs/push-notifications) .

## Recursos

- [Código fonte para a auditoria **Não registra um service worker que controla a página e `start_url`**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/service-worker.js)
- [Service workers: uma introdução](https://developer.chrome.com/docs/workbox/service-worker-overview/)
- [Service workers e a API Cache Storage](/service-workers-cache-storage/)
- [O que é confiabilidade de rede e como você a mede?](/network-connections-unreliable)
- [Torne-o instalável](/codelab-make-installable/)
- [Adicionando notificações push a um aplicativo da web](https://codelabs.developers.google.com/codelabs/push-notifications)
