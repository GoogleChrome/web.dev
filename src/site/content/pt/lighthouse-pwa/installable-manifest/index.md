---
layout: post
title: O manifesto do aplicativo da web não atende aos requisitos de instalabilidade
description: |2

  Aprenda como tornar seu Progressive Web App instalável.
web_lighthouse:
  - installable-manifest
codelabs:
  - codelab-make-installable
date: 2019-05-04
updated: 2019-09-19
---

A instalabilidade é um requisito básico dos [Progressive Web Apps (PWAs)](/discover-installable). Ao solicitar aos usuários que instalem seu PWA, você permite que eles o adicionem às telas iniciais. Os usuários que adicionam aplicativos às telas iniciais se envolvem com esses aplicativos com mais frequência.

Um [manifesto de aplicativo da web](/add-manifest/) inclui informações importantes necessárias para tornar seu aplicativo instalável.

## Como a auditoria de manifesto do aplicativo da web Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza páginas que não têm um [manifesto de aplicativo da web](/add-manifest/) que atenda aos requisitos mínimos de instalação:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/039DlaixA4drrswBzSra.png", alt="Auditoria do farol mostrando que o usuário não pode instalar o aplicativo da web a partir da tela inicial", width="800", height="98" %}</figure>

Se o manifesto de uma página não incluir as seguintes propriedades, ele falhará na auditoria:

- Um [`short_name`](https://developer.mozilla.org/docs/Web/Manifest/short_name) ou propriedade de [`name`](https://developer.mozilla.org/docs/Web/Manifest/name)
- Uma [`icons`](https://developer.mozilla.org/docs/Web/Manifest/icons) que inclui um ícone de 192x192 px e um ícone de 512x512 px
- Uma propriedade [`start_url`](https://developer.mozilla.org/docs/Web/Manifest/start_url)
- Uma propriedade [`display`](https://developer.mozilla.org/docs/Web/Manifest/display) ajustada para `fullscreen`, `standalone` ou `minimal-ui`
- Uma propriedade [`prefer_related_applications`](https://developer.chrome.com/blog/app-install-banners-native/) definida com um valor diferente de `true`.

{% Aside 'caution' %} Um manifesto de aplicativo da web é *necessário* para que seu aplicativo seja instalável, mas não é *suficiente*. Para saber como atender a todos os requisitos de instalabilidade, consulte a postagem [Descubra o que é preciso para ser instalável.](/discover-installable) {% endAside %}

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como tornar seu PWA instalável

Certifique-se de que seu aplicativo tenha um manifesto que atenda aos critérios acima. Consulte a [coleção instalável](/installable/) para obter mais informações sobre como criar um PWA.

## Como verificar se o seu PWA pode ser instalado

### No Chrome

Quando seu aplicativo atende aos requisitos mínimos de instalação, o Chrome dispara um `beforeinstallprompt` que você pode usar para solicitar que o usuário instale seu PWA.

{% Aside 'codelab' %} Saiba como tornar seu aplicativo instalável no Chrome com o codelab [Torná-lo instalável.](/codelab-make-installable) {% endAside %}

### Em outros navegadores

Outros navegadores têm critérios diferentes para instalação e para acionar o evento `beforeinstallprompt`. Verifique seus respectivos sites para obter todos os detalhes:

- [Edge](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready)
- [Opera](https://dev.opera.com/articles/installable-web-apps/)
- [Samsung Internet](https://hub.samsunginter.net/docs/ambient-badging/)
- [Navegador UC](https://plus.ucweb.com/docs/pwa/docs-en/zvrh56)

## Recursos

- [O código-fonte para auditoria **Manifesto do aplicativo da web não atende aos requisitos de instabilidade**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/installable-manifest.js)
- [Adicionar um manifesto de aplicativo da web](/add-manifest/)
- [Descubra o que é necessário para ser instalável](/discover-installable)
- [Manifesto de aplicativo da web](https://developer.mozilla.org/docs/Web/Manifest)
- [Não usa HTTPS](/is-on-https/)
