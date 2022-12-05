---
layout: post
title: Os pontos de toque não têm o tamanho adequado
description: |2

  Saiba mais sobre a auditoria do Lighthouse "Os pontos de toque não têm o tamanho adequado".
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - tap-targets
---

Os pontos de toque são as áreas de uma página da web com as quais os usuários em dispositivos de toque podem interagir. Botões, links e elementos de formulário têm pontos de toque.

Muitos mecanismos de pesquisa classificam as páginas com base no grau de compatibilidade com dispositivos móveis. Garantir que os pontos de toque sejam grandes e distantes um do outro torna sua página mais acessível e compatível com dispositivos móveis.

## Como a auditoria dos pontos de toque do Lighthouse falha

[O Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza páginas com pontos de toque muito pequenos ou muito próximos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6Dhlxe7vkj7gX3e5rX4B.png", alt="Auditoria do Lighthouse mostrando pontos de toque de tamanho inadequado", width="800", height="206" %}</figure>

Os destinos menores que 48 x 48 pixels ou mais próximos do que 8 pixels entre eles falham na auditoria. Quando a auditoria falha, o Lighthouse lista os resultados em uma tabela com três colunas:

<div class="table-wrapper scrollbar">
  <table>
    <tbody>
      <tr>
        <td><strong>Pontos de toque</strong></td>
        <td>O ponto de toque com tamanho inadequado.</td>
      </tr>
      <tr>
        <td><strong>Tamanho</strong></td>
        <td>O tamanho do retângulo delimitador do destino em pixels.</td>
      </tr>
      <tr>
        <td><strong>Pontos de sobreposição</strong></td>
        <td>Quais outros pontos de toque, se houver, estão muito próximos.</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-seo/scoring.njk' %}

## Como corrigir seus pontos de toque

**Etapa 1:** aumente o tamanho dos pontos de toque que são muito pequenos. Os pontos de toque com 48 x 48 px nunca falham na auditoria. Se você tiver elementos que não deveriam *parecer* maiores (por exemplo, ícones), tente aumentar a propriedade `padding`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ggUhPDcAaExFfcmm8kaF.jpg", alt="pontos de toque de tamanho adequado", width="800", height="419" %}<figcaption> Use <code>padding</code> para tornar os pontos de toque maiores sem alterar a aparência de um elemento.</figcaption></figure>

**Etapa 2:** aumente o espaçamento entre os pontos de toque que estão muito próximos usando propriedades como `margin` . Deve haver pelo menos 8 px entre os pontos de toque.

## Recursos

- [Pontos de toque acessíveis](/accessible-tap-targets) : mais informações sobre como garantir que seus pontos de toque sejam acessíveis a todos os usuários.
- [O código-fonte dos pontos de auditoria **pontos de toque não são dimensionados de forma adequada**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/tap-targets.js)
