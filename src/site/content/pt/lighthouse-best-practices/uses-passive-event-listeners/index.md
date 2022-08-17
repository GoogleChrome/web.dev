---
layout: post
title: Use ouvintes passivos para melhorar o desempenho de rolagem
description: Aprenda como melhorar a responsividade da rolagem da página, evitando ouvintes de eventos passivos.
web_lighthouse:
  - uses-passive-event-listeners
date: 2019-05-02
updated: 2019-08-28
---

Ouvintes de eventos de toque e de roda do mouse são úteis para rastrear as interações do usuário e criar experiências de rolagem personalizadas, mas eles também podem atrasar a rolagem da página. Atualmente, os navegadores não têm como saber se um ouvinte de evento impedirá a rolagem, então eles sempre esperam que o ouvinte termine a execução antes de rolar a página. Ouvintes de eventos passivos resolvem esse problema permitindo que você indique que um ouvinte de eventos nunca impedirá a rolagem.

## Compatibilidade dos navegadores

A maioria dos navegadores oferece suporte a ouvintes de eventos passivos. Veja [Compatibilidade de navegadores](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener#Browser_compatibility)

## Como falha a auditoria do ouvinte de evento passivo do Lighthouse

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza ouvintes de eventos que podem atrasar a rolagem da página:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a59Rk7aCUDvyKNqqoYRJ.png", alt="A auditoria Lighthouse mostra que a página não usa ouvintes de eventos passivos para melhorar o desempenho de rolagem", width="800", height="213" %}</figure>

O Lighthouse usa o seguinte processo para identificar ouvintes de eventos que podem afetar o desempenho da rolagem:

1. Coleta todos os ouvintes de eventos na página.
2. Filtra os ouvintes que não são de toque ou roda.
3. Filtra os ouvintes que chamam `preventDefault()`.
4. Filtra os ouvintes de um host que não é o da página.

O Lighthouse filtra os ouvintes de hosts diferentes porque provavelmente você não tem controle sobre esses scripts. Pode haver scripts de terceiros que estão prejudicando o desempenho de rolagem da sua página, mas eles não aparecem listados no seu relatório Lighthouse.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Como deixar passivos os ouvintes de eventos para melhorar o desempenho da rolagem

Adicione uma flag `passive` a cada ouvinte de evento que o Lighthouse identificou.

Se você só oferece suporte a navegadores que suportam ouvintes de evento passivos, basta adicionar a flag. Por exemplo:

```js
document.addEventListener('touchstart', onTouchStart, {passive: true});
```

Se você [oferece suporte a navegadores mais antigos que não suportam ouvintes de eventos passivos](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener#Browser_compatibility), será necessário usar a detecção do recurso ou um polyfill. Consulte a seção [Feature Detection](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection) da documentação do WICG sobre [Ouvintes de evento passivos](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md) para mais informações.

## Recursos

- [Código-fonte da auditoria **Não usa ouvintes passivos para melhorar o desempenho da rolagem**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/uses-passive-event-listeners.js)
- [Melhorando o desempenho da rolagem com ouvintes de eventos passivos](https://developers.google.com/web/updates/2016/06/passive-event-listeners)
- [Explicação sobre ouvintes de evento passivos](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
- [EventTarget.addEventListener()](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)
