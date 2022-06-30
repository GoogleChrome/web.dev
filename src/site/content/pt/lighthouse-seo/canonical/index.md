---
layout: post
title: O documento não tem um `rel = canonical` válido
description: |2-

  Saiba mais sobre a auditoria Lighthouse "O documento não tem um rel = canonical".
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - canônico
---

Quando várias páginas têm conteúdo semelhante, os mecanismos de pesquisa as consideram versões duplicadas da mesma página. Por exemplo, as versões para desktop e celular de uma página de produto são frequentemente consideradas duplicatas.

Os mecanismos de pesquisa selecionam uma das páginas como a *versão canônica* ou primária e **rastreiam** essa outra. Os links canônicos válidos permitem informar aos mecanismos de pesquisa qual versão de uma página deve ser rastreada e exibida aos usuários nos resultados da pesquisa.

{% Aside 'key-term' %} *Rastreamento* é como um mecanismo de pesquisa atualiza seu índice de conteúdo na web. {% endAside %}

O uso de links canônicos tem muitas vantagens:

- Ajuda os motores de busca a consolidar vários URLs em um único URL preferencial. Por exemplo, se outros sites colocam parâmetros de consulta nas extremidades dos links para sua página, os mecanismos de pesquisa consolidam esses URLs em sua versão preferida.
- Ele simplifica os métodos de rastreamento. Rastrear um URL é mais fácil do que rastrear muitos.
- Além disso, melhora a classificação da página de conteúdo sindicado, consolidando os links sindicalizados para seu conteúdo original de volta ao seu URL preferido.

## Como a auditoria de links canônicos do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza qualquer página com um link canônico inválido:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TLhOThFgDllifsEEeOH3.png", alt="Auditoria do Lighthouse mostrando documento com link canônico inválido", width="800", height="76" %}</figure>

Uma página falha nesta auditoria se qualquer uma das seguintes condições for atendida:

- Existe mais de um link canônico.
- O link canônico não é um URL válido.
- O link canônico aponta para uma página de uma região ou idioma diferente.
- O link canônico aponta para um domínio diferente.
- O link canônico aponta para a raiz do site. Observe que esse cenário pode ser válido em alguns cenários, como para AMP ou variações de página para dispositivos móveis, mas o Lighthouse o considera uma falha.

{% include 'content/lighthouse-seo/scoring.njk' %}

## Como adicionar links canônicos às suas páginas

Há duas opções para especificar um link canônico.

**Opção 1:** adicione um elemento `<link rel=canonical>` ao `<head>` da página:

```html/4
<!doctype html>
<html lang="en">
  <head>
    …
    <link rel="canonical" href="https://example.com"/>
    …
  </head>
  <body>
    …
  </body>
</html>
```

**Opção 2:** adicione um `Link` à resposta HTTP:

```html
Link: https://example.com; rel=canonical
```

Para obter uma lista dos prós e contras de cada abordagem, consulte a página [Consolidar URLs duplicados do Google.](https://support.google.com/webmasters/answer/139066)

### Diretrizes Gerais

- Certifique-se de que o URL canônico seja válido.
- [Use URLs canônicos HTTPS](/why-https-matters/) seguros em vez de HTTP sempre que possível.
- Se você usar [links `hreflang`](/hreflang) para veicular diferentes versões de uma página, dependendo do idioma ou país do usuário, certifique-se de que o URL canônico aponta para a página apropriada para o respectivo idioma ou país.
- Não aponte o URL canônico para um domínio diferente. Yahoo e Bing não permitem isso.
- Não aponte as páginas de nível inferior para a página raiz do site, a menos que seu conteúdo seja o mesmo.

### Diretrizes específicas do Google

- Use o [Google Search Console](https://search.google.com/search-console/index) para ver quais URLs o Google considera canônicos ou duplicados em todo o seu site.
- Não use a ferramenta de remoção de URL do Google para canonização. Ele remove *todas* as versões de um URL da pesquisa.

{% Aside 'note' %} Recomendações para outros mecanismos de pesquisa são bem-vindas. [Edite esta página](https://github.com/GoogleChrome/web.dev/blob/master/src/site/content/en/lighthouse-seo/canonical/index.md). {% endAside %}

## Recursos

- [Código-fonte para **documento não possui uma auditoria `rel=canonical` válida**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/canonical.js)
- [5 erros comuns com rel=canonical](https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html)
- [Consolidar URLs duplicados](https://support.google.com/webmasters/answer/139066)
- [Bloquear rastreamento de conteúdo duplicado parametrizado](https://support.google.com/webmasters/answer/6080548)
- [Google Search Console](https://search.google.com/search-console/index)
