---
layout: post
title: Elementos com um ARIA `[role]` que exigem que os filhos contenham um `[role]` específico estão faltando alguns ou todos os filhos necessários
description: |2

  Aprenda como melhorar a acessibilidade de sua página da web para tecnologia assistiva

  usuários, certificando-se de que todos os elementos com funções ARIA tenham o filho

  elementos
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-required-children
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Algumas funções ARIA requerem funções secundárias específicas. Por exemplo, a `tablist` deve possuir pelo menos um elemento com a função `tab`. Se as funções secundárias necessárias não estiverem presentes, as tecnologias assistivas podem transmitir informações confusas sobre sua página, como anunciar um conjunto de guias sem guias.

## Como o Lighthouse identifica funções filhas ausentes

O <a href="https://developer.chrome.com/docs/lighthouse/overview/" rel="noopener">Lighthouse</a> sinaliza funções ARIA que não têm as funções filho necessárias:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/meMpRNGub2polfC7ysFf.png", alt="Auditoria Lighthouse mostrando função ARIA sem função(ões) filho(s) necessária(s)", width="800", height="205" %}</figure>

O Lighthouse usa as <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">definições de função da especificação WAI-ARIA</a> para verificar <a href="https://www.w3.org/TR/wai-aria/#mustContain" rel="noopener">os elementos de propriedade necessários</a> - ou seja, funções filho obrigatórias. Uma página falha nesta auditoria quando contém uma função pai que esteja sem suas funções filho necessárias.

No exemplo de auditoria Lighthouse acima, a função `radiogroup` requer elementos filho com a função `radio`. Como não há filhos com uma `radio` definida, a auditoria falha. Isso faz sentido, pois seria confuso ter um grupo de opção sem botões de opção.

É importante corrigir esse problema, pois ele pode interromper a experiência dos usuários. No exemplo acima, o elemento ainda pode ser anunciado como um grupo de opção, mas os usuários não saberão quantos botões de opção ele contém.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como adicionar funções filhas secundárias

Consulte as <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">definições de função WAI-ARIA</a> para ver quais funções filhas são necessárias para os elementos que o Lighthouse sinalizou. (A especificação refere-se a filhas <a href="https://www.w3.org/TR/wai-aria/#mustContain" rel="noopener">obrigatórias como elementos de propriedade obrigatórios</a>.)

{% include 'content/lighthouse-accessibility/aria-child-parent.njk' %}

## Recursos

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/aria-required-children.js" rel="noopener">O código-fonte para a auditoria <strong>Elementos com um ARIA <code>[role]</code> que exigem que as filhas contenham uma [role] específica estão faltando alguns ou todos as filhas necessárias</strong></a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-required-children" rel="noopener">Certas funções ARIA devem conter filhas específicas (Deque University)</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">Definições de função da especificação WAI-ARIA</a>
