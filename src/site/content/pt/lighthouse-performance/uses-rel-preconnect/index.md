---
layout: post
title: Pré-conectar às origens necessárias
description: |2

  Saiba mais sobre a auditoria uses-rel-preconnect.
date: 2019-05-02
updated: 2020-05-06
web_lighthouse:
  - usa-rel-preconnect
---

A seção Oportunidades de seu relatório Lighthouse lista todas as solicitações principais que ainda não estão priorizando solicitações de busca com `<link rel=preconnect>`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K5TLz5LOyRjffxJ6J9zl.png", alt="Uma captura de tela do Lighthouse Preconnect para auditoria de origens exigidas", width="800", height="226" %}</figure>

## Compatibilidade do navegador

`<link rel=preconnect>` é compatível com a maioria dos navegadores. Consulte [Compatibilidade do navegador](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility).

## Melhore a velocidade de carregamento da página com pré-conexão

Considere adicionar `preconnect` ou `dns-prefetch` para estabelecer conexões antecipadas com origens de terceiros importantes.

`<link rel="preconnect">` informa ao navegador que sua página pretende estabelecer uma conexão com outra origem e que deseja que o processo seja iniciado o mais rápido possível.

O estabelecimento de conexões geralmente envolve um tempo significativo em redes lentas, especialmente quando se trata de conexões seguras, pois pode envolver pesquisas de DNS, redirecionamentos e várias viagens de ida e volta ao servidor final que lida com a solicitação do usuário.

Cuidar de tudo isso com antecedência pode tornar seu aplicativo muito mais ágil para o usuário, sem afetar negativamente o uso da largura de banda. A maior parte do tempo para estabelecer uma conexão é gasta em espera, em vez de troca de dados.

Informar o navegador da sua intenção é tão simples quanto adicionar uma tag de link à sua página:

`<link rel="preconnect" href="https://example.com">`

Isso permite que o navegador saiba que a página pretende se conectar a `example.com` e recuperar o conteúdo de lá.

Lembre-se de que, embora `<link rel="preconnect">` seja muito barato, ele ainda pode consumir um tempo valioso da CPU, principalmente em conexões seguras. Isso é especialmente ruim se a conexão não for usada em 10 segundos, quando o navegador a fecha, desperdiçando todo o trabalho de conexão anterior.

Em geral, tente usar `<link rel="preload">`, pois é um ajuste de desempenho mais abrangente, mas mantenha `<link rel="preconnect">` em seu cinto de ferramentas para casos extremos como:

- [Caso de uso: Saber de onde, mas não o que você está buscando](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)
- [Caso de uso: Mídia de streaming](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)

`<link rel="dns-prefetch">` é outro `<link>` relacionado a conexões. Ele lida apenas com a pesquisa de DNS, mas tem suporte para navegador mais amplo, então pode servir como um bom substituto. Você o usa exatamente da mesma maneira:

```html
<link rel="dns-prefetch" href="https://example.com">.
```

## Orientação específica para pilha

### Drupal

Use [um módulo que ofereça suporte a dicas de recursos do agente do usuário](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=dns-prefetch&solrsort=iss_project_release_usage+desc&op=Search) para que você possa instalar e configurar dicas de pré-conexão ou pré-busca de recursos DNS.

### Magento

[Modifique o layout dos seus temas](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html) e adicione dicas de recursos de pré-conexão ou pré-busca de DNS.

## Recursos

- [Código-fonte para **pré-conexão à** auditoria de origens exigida](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect)
- [Priorização de recursos - Obtendo o navegador para ajudá-lo](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect)
- [Estabeleça conexões de rede com antecedência para melhorar a velocidade percebida da página](/preconnect-and-dns-prefetch/)
- [Tipos de link: pré-conexão](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)
