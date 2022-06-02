---
layout: post
title: На странице отсутствует тип документа HTML, поэтому запускается режим совместимости
description: |2-

  Узнайте, как сделать так, чтобы ваша страница не запускала режим совместимости в более ранних версиях браузеров.
web_lighthouse:
  - doctype
date: 2019-05-02
updated: 2019-08-28
---

Указание типа документа предотвращает переключение браузера в [режим совместимости](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode), что может привести к [непредусмотренному отображению](https://quirks.spec.whatwg.org/#css) вашей страницы.

## Почему не удается выполнить аудит типа документа Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) отмечает страницы без объявления `<!DOCTYPE html>`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l6IEjHdtgCa45QimENjb.png", alt="Аудит Lighthouse показывает отсутствие типа документа", width="800", height="76" %}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Как добавить объявление doctype

Добавьте объявление `<!DOCTYPE html>` в верхнюю часть HTML-документа:

```html
<!DOCTYPE html>
<html lang="en">
…
```

См. дополнительную информацию на странице MDN [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype).

## Ресурсы

- [Исходный код для аудита «**На странице отсутствует тип документа HTML, что вызывает запуск режима совместимости**».](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/doctype.js)
- [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype)
- [Режим совместимости и стандартный режим](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)
