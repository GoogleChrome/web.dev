---
layout: post
title: Não usa HTTP/2 para todos os seus recursos.
description: Saiba por que HTTP/2 é importante para o tempo de carregamento de sua página e como ativar HTTP/2 no seu servidor.
web_lighthouse:
  - uses-http2
date: 2019-05-02
updated: 2019-08-28
---

O HTTP/2 serve os recursos de sua página com mais rapidez e menos movimentação pela rede.

## Como a auditoria Lighthouse HTTP/2 falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) lista todos os recursos que não são servidos por HTTP/2:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Gs0J63479ELUkMeI8MRS.png", alt="A auditoria do Lighthouse audit mostra recursos não atendidos por HTTP/2 ", width="800", height="191" %}</figure>

O Lighthouse reúne todos os recursos solicitados pela página e verifica a versão do protocolo HTTP de cada um. Existem alguns casos em que as solicitações não HTTP/2 serão ignoradas nos resultados da auditoria. [Veja a implementação](https://github.com/GoogleChrome/lighthouse/blob/9fad007174f240982546887a7e97f452e0eeb1d1/lighthouse-core/audits/dobetterweb/uses-http2.js#L138) para mais detalhes.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Como passar nesta auditoria

Sirva seus recursos via HTTP/2.

Para saber como habilitar HTTP/2 nos seus servidores, veja [Configurando HTTP/2](https://dassur.ma/things/h2setup/).

## Recursos

- [Código-fonte para a auditoria **Não usa HTTP/2 para todos os seus recursos**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/uses-http2.js)
- [Introdução ao HTTP/2](/performance-http2/)
- [Perguntas frequentes sobre HTTP/2](https://http2.github.io/faq/)
