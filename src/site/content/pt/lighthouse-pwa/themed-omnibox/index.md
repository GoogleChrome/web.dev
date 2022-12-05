---
layout: post
title: Não define uma cor de tema para a barra de endereço
description: Aprenda a definir uma cor de tema da barra de endereço para seu Progressive Web App.
web_lighthouse:
  - themed-omnibox
date: 2019-05-04
updated: 2020-06-17
---

Aplicar um tema na barra de endereço do navegador para corresponder às cores da marca de seu [Progressive Web App (PWA)](/discover-installable) fornece uma experiência de usuário mais envolvente.

## Compatibilidade dos navegadores

No momento em que este artigo foi escrito, o tema da barra de endereço do navegador era suportado em navegadores baseados em Android. Veja a [compatibilidade dos navegadores](https://developer.mozilla.org/docs/Web/Manifest/theme_color#Browser_compatibility) para atualizações.

## Como a auditoria de cor do tema do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca páginas que não aplicam um tema à barra de endereço:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YadFSuw8denjl1hhnvFs.png", alt="Auditoria Lighthouse mostrando barra de endereço que não tem o tema das cores da página", width="800", height="98" %}</figure>

A auditoria falha se o Lighthouse não encontrar uma meta tag `theme-color` no HTML da página e uma propriedade `theme_color` no [manifesto web app](/add-manifest).

Observe que o Lighthouse não testa se os valores são valores de cor CSS válidos.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como definir uma cor de tema para a barra de endereço

### Passo 1: adicione uma meta tag `theme-color` a cada página que deseja marcar

A meta tag `theme-color` garante que a barra de endereço seja marcada quando um usuário visitar seu site como uma página da web normal. Defina o atributo `content` da tag para qualquer valor de cor CSS válido:

```html/4
<!DOCTYPE html>
<html lang="en">
<head>
  …
  <meta name="theme-color" content="#317EFB"/>
  …
</head>
…
```

Saiba mais sobre a meta tag `theme-color` no artigo <a href="https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android" data-md-type="link">Suporte a `theme-color` no Chrome 39 para Android</a> do Google.

### Passo 2: adicione a propriedade `theme_color` ao seu manifesto web app

A propriedade `theme_color` em seu manifesto web app garante que a barra de endereço seja marcada quando um usuário iniciar seu PWA a partir da tela inicial. Ao contrário da meta tag `theme-color` do tema, você só precisa defini-la uma vez, no [manifesto](/add-manifest). Defina a propriedade para qualquer valor de cor CSS válido:

```html/1
{
  "theme_color": "#317EFB"
  …
}
```

O navegador definirá a cor da barra de endereço de cada página do seu aplicativo de acordo com o `theme_color` do manifesto.

## Recursos

- [Código fonte para a auditoria**Não define uma cor de tema para a barra de endereço**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/themed-omnibox.js)
- [Adicionar um manifesto web app](/add-manifest)
- [Suporte a <code>theme-color</code> no Chrome 39 para Android](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android)
