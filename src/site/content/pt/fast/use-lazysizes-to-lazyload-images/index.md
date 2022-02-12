---
layout: post
title: Use lazysizes para imagens de carregamento lento
authors:
  - katiehempenius
description: |2

  Lazy-loading é a estratégia de carregar recursos conforme eles são necessários, ao invés

  do que antecipadamente. Essa abordagem libera recursos durante o carregamento inicial da página

  e evita carregar ativos que nunca são usados.
date: 2018-11-05
updated: 2019-04-10
codelabs:
  - codelab-use-lazysizes-to-lazyload-images
tags:
  - performance
  - images
feedback:
  - api
---

{% Aside 'note' %} Carregamento lento no nível do navegador já está disponível! Consulte o [artigo da web](/browser-level-image-lazy-loading/) `loading` lento integrado para aprender como usar o atributo de carregamento e aproveitar os lazysizes como fallback para navegadores que ainda não o suportam. {% endAside %}

O **carregamento lento** é a estratégia de carregar recursos conforme eles são necessários, em vez de antecipadamente. Essa abordagem libera recursos durante o carregamento inicial da página e evita o carregamento de ativos que nunca são usados.

Imagens que estão fora da tela durante o carregamento de página inicial são candidatas ideais para essa técnica. E o melhor de tudo: [lazysizes](https://github.com/aFarkas/lazysizes) torna essa estratégia muito simples de implementar.

## O que é lazysizes?

[lazysizes](https://github.com/aFarkas/lazysizes) é a biblioteca mais popular para imagens de carregamento lento. É um script que carrega imagens de forma inteligente conforme o usuário se move pela página e prioriza as imagens que o usuário encontrará em breve.

## Adicionar lazysizes

É simples adicionar lazysizes:

- Adicione o script lazysizes às suas páginas.
- Escolha as imagens que você deseja carregar lentamente.
- Atualize as `<img>` e / ou `<picture>` para essas imagens.

### Adicione o script lazysizes

Adicione o [script](https://github.com/aFarkas/lazysizes/blob/gh-pages/lazysizes.min.js) lazysizes às suas páginas:

```html
<script src="lazysizes.min.js" async></script>
```

### Atualize as `<img>` e/ou `<picture>`

**Instruções da tag `<img>`**

**Antes de:**

```html
<img src="flower.jpg" alt="">
```

**Depois de:**

```html
<img data-src="flower.jpg" class="lazyload" alt="">
```

Ao atualizar a `<img>`, você faz duas alterações:

- **Adicione a classe `lazyload`**: Isso indica aos preguiçosos que a imagem deve ser carregada lentamente.
- **Altere o atributo `src` `data-src`**: quando chegar a hora de carregar a imagem, o código lazysizes define o `src` da imagem usando o valor do atributo `data-src`

**Instruções da tag `<picture>`**

**Antes de:**

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

**Depois de:**

```html
<picture>
  <source type="image/webp" data-srcset="flower.webp">
  <source type="image/jpeg" data-srcset="flower.jpg">
  <img data-src="flower.jpg" class="lazyload" alt="">
</picture>
```

Ao atualizar a `<picture>`, você faz duas alterações:

- Adicione a classe `lazyload` à tag `<img>`
- Altere o atributo `srcset` da tag `<source>` para `data-srcset`.

{% Aside 'codelab' %} [Use lazysizes para carregar apenas imagens que estão na janela de visualização atual](/codelab-use-lazysizes-to-lazyload-images). {% endAside %}

## Verificar

Abra DevTools e role a página para baixo para ver essas mudanças em ação. Conforme você rola, você deve ver novas solicitações de rede ocorrerem e as classes de tag `<img>` de `lazyload` para `lazyloaded`.

Além disso, você pode usar o Lighthouse para verificar se não se esqueceu de carregar lentamente nenhuma imagem fora da tela. Execute a auditoria de desempenho do Lighthouse (**Lighthouse &gt; Opções &gt; Desempenho**) e procure os resultados da auditoria **Deferir imagens fora da tela.**
