---
layout: post
title: Não usa HTTPS
description: |2

  Aprenda como proteger seu site com HTTPS.
web_lighthouse:
  - is-on-https
date: 2019-05-04
updated: 2020-04-29
---

Todos os sites devem ser protegidos com HTTPS, mesmo aqueles que não lidam com dados confidenciais. O HTTPS evita que intrusos adulterem ou escutem passivamente as comunicações entre o seu site e seus usuários.

Uma página não pode ser qualificada como um [Progressive Web App (PWA)](/discover-installable) se não for executada em HTTPS; muitas tecnologias principais de PWA, como service workers, exigem HTTPS.

Para obter mais informações sobre por que todos os sites devem ser protegidos com HTTPS, consulte [Por que o HTTPS é importante](/why-https-matters/).

## Como a auditoria Lighthouse HTTPS falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza páginas que não estão em HTTPS:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FD2HDFl8SQCgRdhV4tzZ.png", alt="A auditoria do Lighthouse mostrando que a página não está em HTTPS", width="800", height="139" %}</figure>

O Lighthouse aguarda um evento do [Protocolo de depuração remota do Chrome](https://github.com/ChromeDevTools/devtools-protocol) indicando que a página está sendo executada em uma conexão segura. Se o evento não for ouvido em 10 segundos, a auditoria falhará.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como migrar seu site para HTTPS

Considere hospedar seu site em um CDN. A maioria dos CDNs é segura por padrão.

Para saber como ativar o HTTPS em seus servidores, consulte [Como ativar o HTTPS em seus servidores do Google](/enabling-https-on-your-servers/). Se você está executando seu próprio servidor e precisa de uma maneira fácil e barata de gerar certificados, o [Let's Encrypt](https://letsencrypt.org/) é uma boa opção.

Se sua página já está sendo executada em HTTPS, mas você está falhando nesta auditoria, você pode ter problemas com [conteúdo misto](/what-is-mixed-content/). Uma página possui conteúdo misto quando a própria página é carregada por HTTPS, mas solicita um recurso desprotegido (HTTP). Verifique o seguinte documento no painel do de Segurança do Chrome DevTools para saber como depurar essas situações: [Entenda os problemas de segurança com o Chrome DevTools](https://developer.chrome.com/docs/devtools/security/).

## Recursos

- [Código-fonte para **Não use a auditoria do HTTPS**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/is-on-https.js)
- [Por que você deve sempre usar o HTTPS](/why-https-matters/)
- [Como ativar o HTTPS em seus servidores](/enabling-https-on-your-servers/)
- [Entenda os problemas de segurança com o Chrome DevTools](https://developer.chrome.com/docs/devtools/security/)
- [O que é conteúdo misto?](/what-is-mixed-content/)
- [Let's Encrypt](https://letsencrypt.org/)
