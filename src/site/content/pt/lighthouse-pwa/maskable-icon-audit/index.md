---
layout: post
title: O manifesto não tem um ícone mascarável
description: |2

  Aprenda como adicionar suporte a ícones mascaráveis ao seu PWA.
web_lighthouse:
  - ícone de máscara
date: 2020-05-06
---

Os [ícones mascaráveis](/maskable-icon/) são um novo formato de ícone que garante que seu ícone PWA tenha uma ótima aparência em todos os dispositivos Android. Em dispositivos Android mais recentes, os ícones PWA que não seguem o formato de ícone mascarável recebem um fundo branco. Quando você usa um ícone mascarável, isso garante que o ícone ocupe todo o espaço que o Android fornece para ele.

## Como a auditoria do ícone mascarável do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza páginas que não têm suporte para ícones mascaráveis:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0lXCcsZdOeLZuAw3wbY.jpg", alt="A auditoria do ícone mascarável na IU do relatório Lighthouse.", width="800", height="110" %}</figure>

Para passar na auditoria:

- Deve existir um manifesto de aplicativo da web.
- O manifesto do aplicativo da web deve ter uma matriz de `icons`
- O `icons` deve conter um objeto com uma `purpose` e o valor dessa propriedade de `purpose` `maskable`.

{% Aside 'caution' %} O Lighthouse não inspeciona a imagem especificada como ícone mascarável. Você precisará verificar manualmente se a imagem é exibida corretamente. {% endAside %}

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Como adicionar suporte a ícones mascaráveis ao seu PWA

1. Use o [Editor Maskable.app](https://maskable.app/editor) para converter um ícone existente em um ícone mascarável.

2. Adicione a `purpose` a um dos objetos de `icons` [em seu manifesto de aplicativo da web](/add-manifest/) . Defina o valor de `purpose` como `maskable` ou `any maskable`. Veja [valores](https://developer.mozilla.org/docs/Web/Manifest/icons#Values).

    ```json/8
    {
      …
      "icons": [
        …
        {
          "src": "path/to/maskable_icon.png",
          "sizes": "196x196",
          "type": "image/png",
          "purpose": "any maskable"
        }
      ]
      …
    }
    ```

3. Use o Chrome DevTools para verificar se o ícone mascarável está sendo exibido corretamente. Consulte [Meus ícones atuais estão prontos?](/maskable-icon/#are-my-current-icons-ready)

## Recursos

- [O código-fonte para a auditoria **O manifesto não tem um ícone mascarável**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/maskable-icon.js)
- [Suporte de ícone adaptável em PWAs com ícones mascaráveis](/maskable-icon/)
- [Editor Maskable.app](https://maskable.app/editor)
- [Adicionar um manifesto de aplicativo da web](/add-manifest/)
- [A propriedade `icons` no MDN](https://developer.mozilla.org/docs/Web/Manifest/icons)
