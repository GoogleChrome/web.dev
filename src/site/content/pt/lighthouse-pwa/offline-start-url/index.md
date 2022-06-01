---
layout: post
title: "`start_url` não responde com 200 quando está off-line"
description: |2-

  Aprenda a configurar o start_url do Progressive Web App para que ele seja

  acessível off-line.
web_lighthouse:
  - offline-start-url
date: 2019-05-04
updated: 2020-04-29
---

O [manifesto](/add-manifest) para um [Progressive Web App](/what-are-pwas/) (PWA) deve incluir um `start_url`, que indica a URL a ser carregada quando o usuário inicia o aplicativo.

Se o navegador não receber uma [resposta HTTP 200](https://developer.mozilla.org/docs/Web/HTTP/Status#Successful_responses) ao acessar um aplicativo do `start_url`, o `start_url` não está correto ou a página não está acessível offline. Isso causa problemas para os usuários que instalaram o aplicativo em seus dispositivos.

## Como a auditoria `start_url` falha

[O Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza aplicativos da web cujo URL inicial não responde com 200 quando off-line:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZR8gYzKNpBkrXEgQQnbl.png", alt="Auditoria do Lighthouse mostrando que URL inicial não responde com 200 quando está off-line", width="800", height="76" %}</figure>

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como garantir que sua página esteja disponível off-line

{% include 'content/reliable/workbox.njk' %}

1. Se você ainda não tiver um, [adicione um manifesto de aplicativo da web](/add-manifest/).
2. Verifique se `start_url` em seu manifesto está correto.
3. Adicione um service worker ao seu aplicativo.
4. Use o service worker para armazenar arquivos em cache localmente.
5. Quando estiver offline, use o service worker como proxy de rede para retornar a versão do arquivo armazenada localmente em cache.

Consulte a [página atual não responde com um guia 200 quando está off-line](/works-offline) para obter mais informações.

## Recursos

- [O que é confiabilidade de rede e como você a mede?](/network-connections-unreliable/)
- [Adicionar um manifesto de aplicativo da web](/add-manifest/)
- [Caixa de trabalho: seu kit de ferramentas de serviço de alto nível](/workbox/)
