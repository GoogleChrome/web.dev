---
layout: post
title: "\tFirst Meaningful Paint (FMP)"
description: |2-

  Saiba mais sobre a métrica First Meaningful Paint da Lighthouse e como medi-la e otimizá-la.
date: 2019-05-02
updated: 2019-11-05
web_lighthouse:
  - first-meaningful-paint
---

{% Aside 'caution' %} A métrica first-meaningful-paint (FMP) foi descontinuada no Lighthouse 6.0. Na prática, a FMP tem sido excessivamente sensível a pequenas diferenças no carregamento da página, levando a resultados inconsistentes (bimodais). Além disso, a definição da métrica depende de detalhes de implementação específicos do navegador, o que significa que não pode ser padronizada nem implementada em todos os navegadores da web. Seguindo em frente, considere usar a [Largest Contentful Paint](/lcp/). {% endAside %}

First Meaningful Paint (FMP) é uma das seis métricas monitoradas na **seção Desempenho** do relatório Lighthouse. Cada métrica captura algum aspecto da velocidade de carregamento da página.

O Lighthouse exibe FMP em segundos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6XzSjk0QsMpAL8V0bZiq.png", alt="Uma captura de tela da auditoria da First Meaningful Paint", width="800", height="588" %}</figure>

## O que mede a FMP

O FMP mede quando o conteúdo principal de uma página está visível para o usuário. A pontuação bruta para FMP é o tempo em segundos entre o usuário iniciar o carregamento da página e a página que renderiza o conteúdo primário acima da dobra. A FMP mostra essencialmente o tempo da pintura após o qual a maior mudança de layout acima da dobra acontece. Saiba mais sobre os detalhes técnicos da FMP em [Time to First Meaningful Paint do Google: uma abordagem baseada em layout](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view).

[First Contentful Paint (FCP)](/fcp/) e FMP são geralmente as mesmas quando o primeiro bit de conteúdo renderizado na página inclui o conteúdo acima da dobra. No entanto, essas métricas podem ser diferentes quando, por exemplo, há conteúdo acima da dobra em um iframe. A FMP registra quando o conteúdo do iframe é visível para o usuário, enquanto a FCP *não* inclui o conteúdo do iframe.

## Como o Lighthouse determina sua pontuação FMP

Assim como a FCP, a FMP é baseada em [dados reais de desempenho de sites do HTTP Archive](https://httparchive.org/reports/loading-speed#fcp).

Quando FMP e FCP são iguais, suas pontuações são idênticas. Se a FMP ocorrer após a FCP - por exemplo, quando uma página contém conteúdo iframe - a pontuação da FMP será menor do que a pontuação da FCP.

Por exemplo, digamos que sua FCP é de 1,5 segundos e sua FMP é de 3 segundos. A pontuação FCP seria 99, mas a pontuação FMP seria 75.

Esta tabela mostra como interpretar sua pontuação FMP:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Métrica FMP<br> (em segundos)</th>
        <th>Codificação de cores</th>
        <th>Pontuação FMP<br> (Percentil FCP HTTP Archive)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–2</td>
        <td>Verde (rápido)</td>
        <td>75-100</td>
      </tr>
      <tr>
        <td>2-4</td>
        <td>Laranja (moderado)</td>
        <td>50-74</td>
      </tr>
      <tr>
        <td>Acima de 4</td>
        <td>Vermelho (lento)</td>
        <td>0-49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como melhorar sua pontuação FMP

Veja [Como melhorar a Largest Contentful Paint em seu site](/largest-contentful-paint#how-to-improve-largest-contentful-paint-on-your-site). As estratégias para melhorar a FMP são basicamente as mesmas que as estratégias para melhorar a Largest Contentful Paint.

## Rastreando FMP em dispositivos de usuários reais

Para saber como medir quando a FMP realmente ocorre nos dispositivos dos usuários, consulte a página [Métricas de desempenho centradas no usuário do Google.](/user-centric-performance-metrics/) A seção [Acompanhamento de FMP usando elementos hero](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fmp_using_hero_elements) descreve como acessar programaticamente os dados da FCP e enviá-los ao Google Analytics.

Consulte [Avaliação do desempenho de carregamento do Google na vida real com navegação e tempo de recursos](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/) para obter mais informações sobre como coletar métricas de usuários reais. A auditoria [Marcas e medidas de tempo do usuário do Lighthouse](/user-timings) permite que você veja os dados de tempo do usuário em seu relatório.

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código-fonte para auditoria da **First Meaningful Paint**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/first-meaningful-paint.js)
- [Guia de pontuação do Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Tempo até a First Meaningful Paint: uma abordagem baseada em layout](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view)
- [Largest Contentful Paint](/lcp/)
