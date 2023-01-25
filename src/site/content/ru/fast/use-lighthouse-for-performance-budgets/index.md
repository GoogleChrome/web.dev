---
layout: post
title: Используйте Lighthouse для расчета бюджета производительности
authors:
  - katiehempenius
description: Теперь Lighthouse поддерживает бюджеты производительности. Эта функция, LightWallet, предоставляет информацию о размерах и количестве ресурсов страницы, а настроить ее можно всего за пять минут.
date: 2019-06-14
updated: 2020-04-03
tags:
  - blog
  - performance
---

Теперь [Lighthouse](https://github.com/GoogleChrome/lighthouse) поддерживает бюджеты производительности. Эта функция, [LightWallet](https://developers.google.com/web/tools/lighthouse/audits/budgets), предоставляет информацию о показателях производительности, размерах и количестве ресурсов страницы, а настроить ее можно всего за пять минут.

## Установите Lighthouse

LightWallet доступен в версии Lighthouse v5 и выше для командной строки.

Для начала установите Lighthouse:

```bash
npm install -g lighthouse
```

## Создайте бюджет

Создайте файл с именем `budget.json`. В этот файл добавьте следующий JSON:

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

В показанном файле `budget.json` задаются пять отдельных бюджетов:

- Бюджет Time to Interactive (времени до интерактивности) составляет 3000 мс.
- Бюджет First Meaningful Paint (первой значимой отрисовки) составляет 1000 мс.
- Бюджет на общий объем JavaScript на странице равен 125 КБ.
- Бюджет общего размера страницы равен 300 КБ.
- Бюджет на количество запросов к сторонним источникам равен 10 запросам.

Полный список поддерживаемых показателей производительности и типов ресурсов см. в разделе «[Бюджеты производительности](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md)» документации Lighthouse.

## Запустите Lighthouse

Запустите Lighthouse с флагом `--budget-path`. Этот флаг сообщает Lighthouse местонахождение вашего файла бюджета.

```bash
lighthouse https://example.com --budget-path=./budget.json
```

{% Aside %} **Примечание**: файл бюджета не обязательно должен называться `budget.json`. {% endAside %}

## Посмотрите результаты

Если LightWallet настроен правильно, отчет Lighthouse будет содержать раздел «**Бюджеты**» в категории «**Производительность**».

{% Img src="image/admin/FdUeI8rKZtJB3Ol624S3.png", alt="Раздел «Бюджеты» отчета Lighthouse", width="800", height="289" %}

В версии отчета Lighthouse в формате JSON результаты Lightwallet можно найти в результатах аудита `performance-budget`.
