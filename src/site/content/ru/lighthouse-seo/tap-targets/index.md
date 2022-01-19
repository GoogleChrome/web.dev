---
layout: post
title: Неверный размер целей касания (Tap targets are not sized appropriately)
description: |2-

  Об аудите Lighthouse «Неверный размер целей касания» (Tap targets are not sized appropriately)
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - tap-targets
---

Цели касания — это области веб-страницы, с которыми пользователи на сенсорных устройствах могут взаимодействовать. Цели касания есть у кнопок, ссылок и элементов форм.

Многие поисковые системы ранжируют страницы по тому, насколько они удобны для пользователей мобильных устройств. Достаточный размер целей касания и адекватное расстояние между ними делают страницу более удобной для использования с мобильных устройств.

## Аудит целей касания в Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) помечает страницы, на которых цели касания слишком малы или расположены слишком близко друг к другу.

<figure class="w-figure">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6Dhlxe7vkj7gX3e5rX4B.png", alt="Аудит Lighthouse, показывающий цели касания неправильного размера", width="800", height="206", class="w-screenshot" %}</figure>

Если на странице будут цели, размер которых менее 48 × 48 пкс или расстояние между которыми менее 8 пкс, аудит будет считаться непройденным. В этом случае Lighthouse выводит результаты в таблице с тремя столбцами:

<div class="w-table-wrapper">
  <table>
    <tbody>
      <tr>
        <td><strong>Цель касания (Tap Target)</strong></td>
        <td>Цель касания с неверным размером.</td>
      </tr>
      <tr>
        <td><strong>Размер (Size)</strong></td>
        <td>Размер ограничивающего прямоугольника цели в пикселях.</td>
      </tr>
      <tr>
        <td><strong>Перекрывающаяся цель (Overlapping Target)</strong></td>
        <td>Другие цели касания, находящиеся слишком близко (если таковые имеются).</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-seo/scoring.njk' %}

## Как исправить цели касания

**Шаг 1.** Увеличьте размер слишком маленьких целей касания. Цели касания размером 48 ×48 пкс аудит не проходят. Если какие-то элементы не должны *выглядеть* больше этого размера (например, значки), попробуйте увеличить свойство `padding`:

<figure class="w-figure">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ggUhPDcAaExFfcmm8kaF.jpg", alt="Цели касания правильного размера", width="800", height="419", class="w-screenshot w-screenshot" %}   <figcaption class="w-figcaption">     Свойство <code>padding</code> увеличивает цель касания, не изменяя внешний вид элемента   </figcaption></figure>

**Шаг 2.** Увеличьте расстояние между целями касания, которые находятся слишком близко друг к другу. Для этого можно использовать, например, свойство `margin`. Обеспечьте расстояние как минимум 8 пкс.

## Материалы

- [Удобство использования целей касания](/accessible-tap-targets): подробнее о том, как сделать так, чтобы всем посетителям было удобно пользоваться целями касания.
- [Исходный код аудита **Неверный размер целей касания** (Tap targets are not sized appropriately)](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/tap-targets.js).
