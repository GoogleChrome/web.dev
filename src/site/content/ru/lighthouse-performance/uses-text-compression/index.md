---
layout: post
title: "**Enable text compression"
description: |2-

  Узнайте, как увеличить скорость загрузки веб-страницы, включив функцию сжатия текста.
date: 2019-05-02
updated: 2020-06-04
web_lighthouse:
  - uses-text-compression
---

Текстовые ресурсы следует предоставлять в сжатом виде, чтобы свести к минимуму общее количество данных, передаваемых по сети. В разделе Opportunities (Возможности) отчета Lighthouse отображаются все несжатые текстовые ресурсы:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZftZfKlPcEu2cs4ltwK8.png", alt = "Снимок экрана с результатами аудита Enable text compression (Включить сжатие текста) в Lighthouse", width = "800", height = "271"%}</figure>

## Как Lighthouse сжимает текст

Lighthouse собирает все ответы, в которых:

- имеются текстовые ресурсы;
- нет заголовка `content-encoding` со значением `br` , `gzip` или `deflate`.

Затем Lighthouse сжимает каждый из ответов с помощью [GZIP](https://www.gnu.org/software/gzip/) и вычисляет, как сильно можно уменьшить объем данных.

Если исходный размер ответа меньше 1,4 КиБ либо если после сжатия исходный размер сократится менее чем на 10 %, Lighthouse не помечает этот ответ в результатах.

{% Aside 'note' %} Сведения о потенциальной экономии, отображаемые в Lighthouse, справедливы только при кодировании ответа с помощью GZIP. Если использовать Brotli, то, возможно, удастся дополнительно уменьшить объем данных. {% endAside %}

## Включение функции сжатия текста на сервере

Чтобы успешно пройти этот аудит, включите сжатие текста на серверах, которые передали эти ответы.

Когда браузер запрашивает ресурс, он использует заголовок HTTP-запроса [`Accept-Encoding`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Encoding), в котором указывает, какие алгоритмы сжатия он поддерживает.

```text
**Accept-Encoding: gzip, compress, br
```

Если браузер поддерживает [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) (`br`), следует использовать Brotli, потому что в этом случае можно уменьшить размер файлов ресурсов еще сильнее, чем при использовании других алгоритмов сжатия. Выполните поиск по ключевым словам `how to enable Brotli compression in <X>` , где `<X>` — имя вашего сервера. По состоянию на июнь 2020 г. Brotli поддерживается во всех основных браузерах, кроме Internet Explorer, Safari для компьютеров и Safari для iOS. См. актуальные сведения в разделе [Совместимость с браузерами](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding#Browser_compatibility).

Используйте GZIP, когда нельзя использовать Brotli. GZIP поддерживается во всех основных браузерах, но он менее эффективен, чем Brotli. См. примеры в разделе [Конфигурации сервера](https://github.com/h5bp/server-configs).

Чтобы сообщить, какой алгоритм сжатия используется, сервер должен возвратить заголовок HTTP-ответа [`Content-Encoding`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding).

```text
**Content-Encoding: br
```

## Проверка того, был ли сжат ответ, в Chrome DevTools

Чтобы проверить, сжал ли сервер ответ, выполните указанные ниже действия.

******{% Instruction 'devtools-network', 'ol' %}

1. Щелкните запрос, на который был получен интересующий вас ответ.
2. Перейдите на вкладку **Headers** (Заголовки).
3. Проверьте заголовок `content-encoding` в разделе  **Response Headers** (Заголовки ответов).

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jBKe0MYnlcQK9OLzAKTa.svg", alt = "Заголовок ответа content-encoding", width = "800", height = "571" %}<figcaption> Заголовок ответа <code>content-encoding</code></figcaption></figure>

Чтобы сравнить размеры сжатых и распакованных данных ответа, выполните указанные ниже действия.

**{% Instruction 'devtools-network', 'ol' %}

1. Включите поддержку больших строк запросов. См. раздел [Использование больших строк запросов](https://developer.chrome.com/docs/devtools/network/reference/#request-rows) .
2. Посмотрите столбец **Size** (Размер) для интересующего вас ответа. Верхнее значение — размер сжатых данных, нижнее значение — размер несжатых данных.

См. также раздел [Уменьшение и сжатие сетевых данных](/reduce-network-payloads-using-text-compression) .

## Инструкции для разных стеков

### **Joomla

Включите параметр Gzip Page Compression (Сжатие страницы с помощью Gzip) в разделе **System** &gt; **Global configuration** &gt; **Server** (Система &gt; Глобальная конфигурация &gt; Сервер).

### **WordPress

Включите сжатие текста в разделе конфигурации веб-сервера.

## **Ресурсы

- [Исходный код для аудита функции **Enable text compression** (Включить сжатие текста)](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-text-compression.js)
