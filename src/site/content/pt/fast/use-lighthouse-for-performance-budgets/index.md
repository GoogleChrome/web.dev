---
layout: post
title: Use o Lighthouse para orçamentos de desempenho
authors:
  - katiehempenius
description: |2-

  O Lighthouse agora oferece suporte a orçamentos de desempenho. Esse recurso, LightWallet, pode ser configurado em menos de cinco minutos e fornece feedback sobre o tamanho e a quantidade de recursos da página.
date: 2019-06-14
updated: 2020-04-03
tags:
  - blog
  - performance
---

O [Lighthouse](https://github.com/GoogleChrome/lighthouse) agora oferece suporte a orçamentos de desempenho. Esse recurso, [LightWallet](https://developers.google.com/web/tools/lighthouse/audits/budgets), pode ser configurado em menos de cinco minutos e fornece feedback sobre as métricas de desempenho e o tamanho e a quantidade de recursos da página.

## Instale o Lighthouse

O LightWallet está disponível na versão de linha de comando do Lighthouse v5+.

Para começar, instale o Lighthouse:

```bash
npm install -g lighthouse
```

## Crie um orçamento

Crie um arquivo chamado `budget.json` e adicione o seguinte JSON:

```json
[
  {
    "path": "/*",
    "timings": [
      {
        "metric": "interactive",
        "budget": 3000
      },
      {
        "metric": "first-meaningful-paint",
        "budget": 1000
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 125
      },
      {
        "resourceType": "total",
        "budget": 300
      }
    ],
    "resourceCounts": [
      {
        "resourceType": "third-party",
        "budget": 10
      }
    ]
  }
]
```

Esse exemplo de `budget.json` define cinco orçamentos separados:

- Um orçamento de 3000 ms para Time to Interactive (TTI), ou  tempo até interatividade
- Um orçamento de 1000 ms para First Meaningful Paint (FMP), ou primeira exibição importante
- Um orçamento de 125 KB para a quantidade total de JavaScript na página
- Um orçamento de 300 KB para o tamanho geral da página
- Um orçamento de 10 solicitações feitas a origens de terceiros

Para ver uma lista completa de métricas de desempenho e tipos de recursos compatíveis, consulte a seção [Orçamentos de desempenho](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md) na documentação do Lighthouse.

## Execute o Lighthouse

Execute o Lighthouse usando a flag `--budget-path` , que informa a localização do seu arquivo de orçamento à ferramenta.

```bash
lighthouse https://example.com --budget-path=./budget.json
```

{% Aside %} **Observação**: um arquivo de orçamento não precisa ser nomeado `budget.json`. {% endAside %}

## Veja os resultados

Se o LightWallet tiver sido configurado corretamente, o relatório do Lighthouse conterá uma seção de **Orçamentos** na categoria **Desempenho.**

{% Img src="image/admin/FdUeI8rKZtJB3Ol624S3.png", alt="Seção 'Orçamentos' no relatório do Lighthouse", width="800", height="289" %}

Na versão JSON do relatório do Lighthouse, é possível encontrar os resultados do LightWallet nos achados da auditoria de `performance-budget`.
