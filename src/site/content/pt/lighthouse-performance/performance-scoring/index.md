---
layout: post
title: Pontuação de desempenho no Lighthouse
description: |2-

  Saiba como o Lighthouse gera a pontuação geral de desempenho de sua página.
subhead: Como o Lighthouse calcula sua pontuação geral de desempenho
date: 2019-09-19
updated: 2021-06-04
---

Em geral, apenas as [métricas](/lighthouse-performance/#metrics) contribuem para sua pontuação de desempenho no Lighthouse, não os resultados de oportunidades ou diagnósticos. Dito isso, melhorar as oportunidades e os diagnósticos provavelmente irá melhorar os valores da métrica, portanto, existe uma relação indireta.

Abaixo, descrevemos por que a pontuação pode flutuar, como é composta e como o Lighthouse pontua cada métrica individual.

## Por que sua pontuação flutua {: #fluctuations}

Grande parte da variabilidade na sua pontuação geral de desempenho e valores de métricas não se deve ao Lighthouse. Quando sua pontuação de desempenho flutua, geralmente é devido a mudanças nas condições subjacentes. Problemas comuns incluem:

- Testes A/B ou alterações nos anúncios veiculados
- Mudanças no roteamento do tráfego da Internet
- Teste realizados em diferentes dispositivos, como em um desktop de alto desempenho e um notebook de baixo desempenho
- Extensões de navegador que injetam JavaScript e adicionam/modificam solicitações da rede
- Software antivírus

[A documentação do Lighthouse sobre variabilidade](https://github.com/GoogleChrome/lighthouse/blob/master/docs/variability.md) trata disso com mais profundidade.

Além disso, embora o Lighthouse possa fornecer uma pontuação geral de desempenho única, pode ser mais útil pensar no desempenho do seu site como uma distribuição de pontuações, em vez de um único número. Veja a introdução das [Métricas de desempenho centradas no usuário](/user-centric-performance-metrics/) para entender o porquê.

## Como a pontuação de desempenho é ponderada {: #weightings}

A pontuação de desempenho é uma [média ponderada](https://www.wikihow.com/Calculate-Weighted-Average#Weighted_Averages_without_Percentages_sub) das *pontuações de métricas*. Naturalmente, métricas mais pesadas têm um efeito maior na sua pontuação geral de desempenho. As pontuações das métricas não são visíveis no relatório, mas são calculadas internamente.

{% Aside %} As ponderações são escolhidas para proporcionar uma representação equilibrada da percepção de desempenho pelo usuário. As ponderações mudaram com o tempo porque a equipe do Lighthouse tem feito pesquisas regularmente e reunido feedback para entender o que tem o maior impacto no desempenho percebido pelo usuário. {% endAside %}

<figure>
  <p data-md-type="paragraph"><a href="https://googlechrome.github.io/lighthouse/scorecalc/">     {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rLftIdSA8JJYruHOHrOn.png", alt="Aplicativo web Lighthouse - calculadora de pontuação ", width="600", height="414" %}   </a></p>
  <figcaption>Explore a pontuação com a <a href="https://googlechrome.github.io/lighthouse/scorecalc/">calculadora de pontuação do Lighthouse</a></figcaption></figure>

### Lighthouse 8

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Auditoria</th>
        <th>Peso</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>First Contentful Paint</td>
        <td>10%</td>
      </tr>
      <tr>
        <td>Speed Index</td>
        <td>10%</td>
      </tr>
      <tr>
        <td>Largest Contentful Paint</td>
        <td>25%</td>
      </tr>
      <tr>
        <td>Time to Interactive</td>
        <td>10%</td>
      </tr>
      <tr>
        <td>
<a href="/lighthouse-total-blocking-time/">Total Blocking Time</a> (tempo de bloqueio total)</td>
        <td>30%</td>
      </tr>
      <tr>
        <td>Cumulative Layout Shift (CLS)</td>
        <td>15%</td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 6

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Auditoria</th>
        <th>Peso</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>First Contentful Paint</td>
        <td>15%</td>
      </tr>
      <tr>
        <td>Speed Index</td>
        <td>15%</td>
      </tr>
      <tr>
        <td>Largest Contentful Paint</td>
        <td>25%</td>
      </tr>
      <tr>
        <td>Time to Interactive</td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lighthouse-total-blocking-time/">Total Blocking Time</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td>Cumulative Layout Shift (CLS)</td>
        <td>5%</td>
      </tr>
    </tbody>
  </table>
</div>

### Como são determinadas as pontuações das métricas {: #metric-scores}

Depois que o Lighthouse termina de reunir as métricas de desempenho (geralmente relatadas em milissegundos), ele converte cada valor bruto numa pontuação de 0 a 100, observando onde o valor da métrica cai na distribuição de pontuação do Lighthouse. A distribuição de pontuação é uma distribuição logarítmica normal derivada das métricas de desempenho obtidas a partir de dados de desempenho de sites reais no [HTTP Archive](https://httparchive.org/) .

Por exemplo, a métrica Largest Contentful Paint (LCP) mede quando um usuário percebe que o maior conteúdo de uma página está visível. O valor da métrica para LCP representa a duração entre o início do carregamento da página pelo usuário e a renderização na página do seu conteúdo principal. Com base em dados reais do site, os sites de melhor desempenho renderizam a LCP em cerca de 1.220 ms, de modo que o valor da métrica é mapeado para uma pontuação de 99.

Indo um pouco mais fundo, o modelo de curva de pontuação do Lighthouse usa dados do HTTPArchive para determinar dois pontos de controle que depois definem a forma de uma curva [logarítmica normal](https://en.wikipedia.org/wiki/Weber%E2%80%93Fechner_law). O 25º percentil dos dados de HTTPArchive torna-se uma pontuação de 50 (o ponto de controle mediano) e o 8º percentil torna-se uma pontuação de 90 (o ponto de controle bom/verde). Ao explorar o gráfico da curva de pontuação abaixo, observe que entre 0,50 e 0,92, há uma relação quase linear entre o valor da métrica e a pontuação. Em torno de uma pontuação de 0,96 encontra-se o "ponto de diminuição dos retornos", já que acima dela a curva se afasta, exigindo cada vez mais melhorias métricas para melhorar uma pontuação já alta.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/y321cWrLLbuY4SHlvYCc.png", alt="Imagem da curva de pontuação para TTI", width="600", height="329" %}   <figcaption>     <a href="https://www.desmos.com/calculator/o98tbeyt1t">Explore a curva de pontuação para TTI</a>.   </figcaption></figure>

### Como se lida com desktop vs celular {: #desktop}

Como mencionado acima, as curvas de pontuação são determinadas a partir de dados de desempenho reais. Antes do Lighthouse v6, todas as curvas de pontuação eram baseadas em dados de desempenho em dispositivos móveis. Apesar disso, uma execução do Lighthouse em desktop usaria esses dados. Na prática, isso levava a pontuações de desktop artificialmente infladas. O Lighthouse v6 corrigiu esse bug usando pontuações específicas para desktop. Embora você certamente possa esperar mudanças gerais na sua pontuação de desempenho entre 5 e 6, quaisquer pontuações para desktop serão significativamente diferentes.

### Como as pontuações são codificadas por cores {: #color-coding}

As pontuações de métricas e a pontuação de desempenho são coloridas de acordo com os intervalos a seguir:

- 0 a 49 (vermelho): Ruim
- 50 a 89 (laranja): Precisa melhorar
- 90 a 100 (verde): Bom

Para fornecer uma boa experiência do usuário, os sites devem se esforçar para ter uma boa pontuação (90-100). Uma pontuação "perfeita" de 100 é um grande desafio e não é esperada. Por exemplo, para obter uma pontuação de 99 a 100 requer aproximadamente a mesma quantidade de melhoria métrica que levaria para uma mudança de 90 a 94.

### O que os desenvolvedores podem fazer para melhorar sua pontuação de desempenho?

Primeiro, use a [calculadora de pontuação do Lighthouse](https://googlechrome.github.io/lighthouse/scorecalc/)  para ajudar a entender quais limites você deve almejar para atingir uma determinada pontuação de desempenho.

No relatório do Lighthouse, a seção **Oportunidades** contém sugestões detalhadas e documentação sobre como implementá-las. Além disso, a seção **Diagnóstico** lista orientações adicionais que os desenvolvedores podem explorar para melhorar ainda mais seu desempenho.

<!--
We don't think users care about the historical scoring rubrics, but we'd still prefer to keep them around because X
## Historical versions

### Lighthouse 5

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>20%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>13%</td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 3 and 4

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>23%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 2

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>29%</td>
      </tr>
    </tbody>
  </table>
</div>

-->
