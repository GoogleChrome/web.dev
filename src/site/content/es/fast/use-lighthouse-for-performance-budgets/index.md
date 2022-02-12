---
layout: post
title: Usa Lighthouse para los presupuestos de rendimiento
authors:
  - katiehempenius
description: |2-

  Lighthouse ahora admite presupuestos de rendimiento. Esta función, LightWallet, se puede instalar en menos de cinco minutos y proporciona información sobre el tamaño y la cantidad de recursos de la página.
date: 2019-06-14
updated: 2020-04-03
tags:
  - blog
  - performance
---

[Lighthouse](https://github.com/GoogleChrome/lighthouse) ahora admite presupuestos de rendimiento. Esta función, [LightWallet](https://developers.google.com/web/tools/lighthouse/audits/budgets), se puede instalar en menos de cinco minutos y proporciona información sobre el tamaño y la cantidad de recursos de la página.

## Instalar Lighthouse

LightWallet está disponible en la versión de línea de comandos de Lighthouse v5+.

Para comenzar, instala Lighthouse:

```bash
npm install -g lighthouse
```

## Crea un presupuesto

Crea un archivo llamado `budget.json`. En este archivo, agrega el JSON a continuación:

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

Este archivo de ejemplo `budget.json` establece cinco presupuestos separados:

- Un presupuesto de 3000ms para Time to Interactive (TTI): Tiempo para interactuar.
- Un presupuesto de 1000 ms para First Meaningful Paint (FMP): Primera pintura significativa.
- Un presupuesto de 125 KB para la cantidad total de JavaScript en la página.
- Un presupuesto de 300 KB para el tamaño total de la página.
- Un presupuesto de 10 solicitudes por el número de consultas realizadas a orígenes de terceros.

Para obtener una lista completa de las métricas de rendimiento y los tipos de recursos admitidos, consulta la sección [Presupuestos de rendimiento](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md) de la documentación de Lighthouse.

## Ejecutar Lighthouse

Ejecuta Lighthouse con la bandera de `--budget-path`. Esta bandera le dice a Lighthouse la ubicación de tu archivo de presupuesto.

```bash
lighthouse https://example.com --budget-path=./budget.json
```

{% Aside %} **Nota**: No es necesario que un archivo de presupuesto se llame `budget.json`. {% endAside %}

## Ver los resultados

Si LightWallet se ha configurado correctamente, el informe Lighthouse contendrá una sección de **Presupuestos** dentro de la categoría de **Rendimiento**.

{% Img src="image/admin/FdUeI8rKZtJB3Ol624S3.png", alt="Sección de 'Presupuestos' del informe Lighthouse", width="800", height="289" %}

En la versión JSON del informe Lighthouse, los resultados de Lightwallet se pueden encontrar dentro de los hallazgos de la auditoría para la auditoría de `performance-budget`.
