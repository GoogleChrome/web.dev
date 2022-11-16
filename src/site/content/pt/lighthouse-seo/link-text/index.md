---
layout: post
title: Os links não possuem texto descritivo
description: |2-

  Saiba mais sobre a auditoria do Lighthouse "Os links não possuem texto descritivo".
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - link-text
---

O texto do link é a palavra ou frase clicável em um hiperlink. Quando ele transmite o destino do hiperlink com clareza, tanto os usuários quanto os mecanismos de pesquisa conseguem entender mais facilmente seu conteúdo e como ele se relaciona com as outras páginas.

## Como a auditoria do Lighthouse de texto do link falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza links sem texto descritivo:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hiv184j4TFNCsmqTCTNY.png", alt="Auditoria do Lighthouse mostrando links sem texto descritivo", width="800", height="191" %}</figure>

O Lighthouse sinaliza o seguinte texto de link genérico:

- `clique aqui`
- `clique nisto`
- `acesse`
- `aqui`
- `isto`
- `comece`
- `aqui mesmo`
- `mais`
- `saiba mais`

{% include 'content/lighthouse-seo/scoring.njk' %}

## Como adicionar texto de link descritivo

Substitua frases genéricas como "clique aqui" e "saiba mais" por descrições específicas. Em geral, escolha um texto de link que indique claramente o tipo de conteúdo que os usuários verão se seguirem o hiperlink.

```html
<p>Para ver todos os nossos vídeos de basquete, <a href="videos.html">clique aqui</a>.</p>
```

{% Compare 'worse', 'Don\'t' %} "Clique aqui" não indica o destino do hiperlink para os usuários. {% endCompare %}

```html
<p>Confira todos os nossos <a href="videos.html">vídeos de basquete</a>.</p>
```

{% Compare 'better', 'Do' %} "Vídeos de basquete" indica claramente que o hiperlink leva os usuários a uma página de vídeos. {% endCompare %}

{% Aside %} Com frequência, você precisará revisar a frase inteira para tornar o texto do link descritivo. {% endAside %}

## Práticas recomendadas para texto de link

- Não fuja do assunto. Não use texto de link que não tenha relação com o conteúdo da página.
- Não use o URL da página como a descrição do link, a menos que tenha um bom motivo para fazer isso, como indicar o novo endereço do site.
- Mantenha as descrições concisas. Procure usar poucas palavras ou uma frase curta.
- Preste atenção também nos links internos. Melhorar a qualidade deles pode ajudar os usuários e os mecanismos de pesquisa a navegar no site com mais facilidade.

Consulte a seção [Usar os links de maneira inteligente](https://support.google.com/webmasters/answer/7451184#uselinkswisely) no [Guia de otimização de mecanismos de pesquisa (SEO) para iniciantes](https://support.google.com/webmasters/answer/7451184) do Google para ver mais dicas.

## Recursos

- [Código-fonte da auditoria **Os links não possuem texto descritivo**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/link-text.js)
- [Guia de otimização de mecanismos de pesquisa (SEO) para iniciantes](https://support.google.com/webmasters/answer/7451184)
