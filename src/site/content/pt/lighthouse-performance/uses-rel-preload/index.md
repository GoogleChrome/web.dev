---
layout: post
title: Pré-carregue solicitações importantes
description: Saiba mais sobre a auditoria uses-rel-preload.
date: 2019-05-02
updated: 2020-06-04
web_lighthouse:
  - uses-rel-preload
---

A seção Oportunidades de seu relatório Lighthouse sinaliza o terceiro nível de solicitações em sua cadeia de solicitações críticas como candidatos de pré-carregamento:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fvwBQLvwfogd6ukq4vTZ.png", alt="Uma captura de tela da auditoria Lighthouse Pré-carregue solicitações importantes", width="800", height="214" %}</figure>

## Como sinalizações do Lighthouse determinam candidatos a pré-carregamento

[Suponha que a cadeia de solicitações críticas](/critical-request-chains) de sua página seja a seguinte:

```html
index.html
|--app.js
   |--styles.css
   |--ui.js
```

Seu arquivo `index.html` declara `<script src="app.js">`. Quando o `app.js` é executado, ele chama `fetch()` para baixar `styles.css` e `ui.js`. A página não aparece completa até que esses 2 últimos recursos sejam baixados, processados e executados. Usando o exemplo acima, o Lighthouse sinalizaria `styles.css` e `ui.js` como candidatos.

A economia potencial é baseada em quanto antes o navegador seria capaz de iniciar as solicitações se você declarasse links de pré-carregamento. Por exemplo, se `app.js` leva 200ms para baixar, analisar e executar, a economia potencial para cada recurso é de 200ms, pois `app.js` não é mais um gargalo para cada uma das solicitações.

O pré-carregamento de solicitações pode fazer com que suas páginas carreguem mais rápido.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OiT1gArpZxNliikhBgx7.png", alt="Sem links de pré-carregamento, styles.css e ui.js são solicitados somente depois que app.js foi baixado, processado e executado.", width="800", height="486" %}   <figcaption>     Sem links de pré-carregamento, <code>styles.css</code> e <code>ui.js</code> são solicitados somente depois que <code>app.js</code> foi baixado, processado e executado. </figcaption></figure>

O problema aqui é que o navegador só fica ciente desses 2 últimos recursos depois de baixar, `app.js`. Mas você sabe que esses recursos são importantes e devem ser baixados o mais rápido possível.

## Declare seus links de pré-carregamento

Declare links de pré-carregamento em seu HTML para instruir o navegador a fazer download dos principais recursos o mais rápido possível.

```html
<head>
  ...
  <link rel="preload" href="styles.css" as="style">
  <link rel="preload" href="ui.js" as="script">
  ...
</head>
```

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tJLJXH2qXcrDBUfsSAK5.png", alt="Com links de pré-carregamento, styles.css e ui.js são solicitados ao mesmo tempo que app.js.", width="800", height="478" %}   <figcaption>Com links de pré-carregamento, <code>styles.css</code> e <code>ui.js</code> são solicitados ao mesmo tempo que <code>app.js</code> </figcaption></figure>

Veja também [Pré-carregue ativos importantes para melhorar a velocidade de carregamento](/preload-critical-assets) para mais orientações.

### Compatibilidade de navegadores

Até junho de 2020, o pré-carregamento já era suportado nos navegadores baseados no Chromium. Veja [Compatibilidade de navegadores](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility) para atualizações.

### Suporte de ferramentas de build para pré-carregamento {: #tools}

Veja a página [Preloading Assets da Tooling.Report](https://bundlers.tooling.report/non-js-resources/html/preload-assets/?utm_source=web.dev&utm_campaign=lighthouse&utm_medium=uses-rel-preload).

## Orientações para pilhas específicas

### Angular

[Pré-carregue as rotas](/route-preloading-in-angular/) com antecedência para acelerar a navegação.

### Magento

[Modifique o layout dos seus temas](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html) e adicione tags `<link rel=preload>`

## Recursos

- [Código fonte para a auditoria **Pré-carregue solicitações importantes**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/uses-rel-preload.js)
