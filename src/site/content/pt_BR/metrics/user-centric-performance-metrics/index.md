---
layout: post
title: User-centric performance metrics
authors:
  - philipwalton
date: '2019-11-08'
description: As métricas de desempenho centradas no usuário são uma ferramenta crítica para a compreensão e melhoria da experiência do seu site de uma forma que beneficie usuários reais.
tags:
  - performance
  - metrics
---

Todos nós já ouvimos como o desempenho é importante. Mas quando falamos sobre desempenho — e sobre como tornar os sites "rápidos" — o que queremos dizer exatamente?

The truth is performance is relative:

- A site might be fast for one user (on a fast network with a powerful device) but slow for another user (on a slow network with a low-end device).
- Two sites may finish loading in the exact same amount of time, yet one may *seem* to load faster (if it loads content progressively rather than waiting until the end to display anything).
- A site might *appear* to load quickly but then respond slowly (or not at all) to user interaction.

Portanto, ao falar sobre desempenho, é importante ser preciso e se referir ao desempenho em termos de critérios objetivos que possam ser medidos quantitativamente. Esses critérios são conhecidos como *métricas* .

Mas só porque uma métrica é baseada em critérios objetivos e pode ser medida quantitativamente, não significa necessariamente que essas medidas sejam úteis.

## Defining metrics

Historicamente, o desempenho da web tem sido medido com o evento <code>&lt;a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event" data-md-type="link"&gt;load&lt;/a&gt;</code>. No entanto, embora o <code>load</code> seja um momento bem definido no ciclo de vida de uma página, esse momento não corresponde necessariamente a algo com que o usuário se importe.

Por exemplo, um servidor pode responder com uma página mínima que "carrega" imediatamente, mas adia a busca de conteúdo e a exibição de qualquer coisa na página até vários segundos após o evento `load`. Embora tal página possa tecnicamente ter um tempo de carregamento rápido, esse tempo não corresponderia à forma como o usuário realmente percebe o carregamento da página.

Nos últimos anos, membros da equipe do Chrome — em colaboração com o [W3C Web Performance Working Group](https://www.w3.org/webperf/) — têm trabalhado para padronizar um conjunto de novas APIs e métricas que medem com mais precisão como os usuários experimentam o desempenho de uma página web.

Para ajudar a garantir que as métricas sejam relevantes para os usuários, nós as organizamos em torno de algumas questões-chave:

<table id="questions">
  <tr>
    <td><strong>Isto está acontecendo?</strong></td>
    <td>Did the navigation start successfully? Has the server responded?</td>
  </tr>
  <tr>
    <td><strong>Is it useful?</strong></td>
    <td>Has enough content rendered that users can engage with it?</td>
  </tr>
  <tr>
    <td><strong>Is it usable?</strong></td>
    <td>Can users interact with the page, or is it busy?</td>
  </tr>
  <tr>
    <td><strong>É agradável?</strong></td>
    <td>Are the interactions smooth and natural, free of lag and jank?</td>
  </tr>
</table>

## How metrics are measured

Performance metrics are generally measured in one of two ways:

- **In the lab:** using tools to simulate a page load in a consistent, controlled environment
- **No campo** : em usuários reais carregando e interagindo com uma página no mundo real

Nenhuma dessas opções é necessariamente melhor ou pior do que a outra — na verdade, geralmente o ideal é usar as duas para garantir um bom desempenho.

### Em laboratório

O desempenho do teste em laboratório é essencial ao desenvolver novos recursos. Antes dos recursos serem lançados em produção, é impossível medir suas características de desempenho em usuários reais, portanto, testá-los no laboratório antes do lançamento do recurso é a melhor maneira de evitar regressões de desempenho.

### Em campo

Por outro lado, embora o teste em laboratório seja um proxy razoável para o desempenho, não é necessariamente o reflexo de como todos os usuários experimentam seu site no mundo real.

O desempenho de um site pode variar drasticamente com base nos recursos do dispositivo do usuário e nas condições da rede. Também pode variar com base em se (ou como) um usuário está interagindo com a página.

Moreover, page loads may not be deterministic. For example, sites that load personalized content or ads may experience vastly different performance characteristics from user to user. A lab test will not capture those differences.

A única maneira de realmente conhecer o desempenho do seu site para os usuários é medir seu desempenho à medida que esses usuários o carregam e interagem com ele. Este tipo de medição é frequentemente chamada de [Real User Monitoring](https://en.wikipedia.org/wiki/Real_user_monitoring) (monitoramento do usuário real) ou RUM.

## Types of metrics

There are several other types of metrics that are relevant to how users perceive performance.

- **Perceived load speed:** how quickly a page can load and render all of its visual elements to the screen.
- **Responsividade de carga:** a rapidez com que uma página pode carregar e executar qualquer código JavaScript necessário para que os componentes respondam rapidamente à interação do usuário
- **Responsividade do tempo de execução:** após o carregamento da página, com que rapidez a página pode responder à interação do usuário.
- **Visual stability:** do elements on the page shift in ways that users don't expect and potentially interfere with their interactions?
- **Suavidade:** as transições e animações são renderizadas numa taxa de quadros consistente e fluem com fluidez de um estado para o outro?

Dados todos os tipos de métricas de desempenho acima, esperamos ter ficado claro que nenhuma métrica única é suficiente para capturar todas as características de desempenho de uma página.

## Important metrics to measure

- **[First contentful paint (FCP)](/fcp/)**, ou primeira renderização de conteúdo, mede o tempo desde o início do carregamento da página até o momento em que qualquer parte do conteúdo da página é renderizada na tela. *([laboratório](#in-the-lab), [campo](#in-the-field))*
- **[Largest contentful paint (LCP)](/lcp/)**, ou maior renderização de conteúdo mede o tempo desde o início do carregamento da página até o momento em que o maior bloco de texto ou elemento de imagem é renderizado na tela. *([laboratório](#in-the-lab), [campo](#in-the-field))*
- **[First input delay (FID)](/fid/)**, ou atraso na primeira entrada, mede o tempo desde quando um usuário interage pela primeira vez com seu site (ou seja, quando ele clica num link, toca num botão ou usa um controle personalizado em JavaScript) até o momento em que o navegador seja capaz de responder a essa interação. *([campo](#in-the-field))*
- **[Time to Interactive (TTI)](/tti/)**, ou tempo até interatividade, mede o tempo desde o início do carregamento da página até o momento em que é renderizada visualmente, seus scripts iniciais (se houver) tenham sido totalmente carregados e que seja capaz de responder de forma confiável e rápida à entrada do usuário. *([laboratório](#in-the-lab))*
- **[Total blocking time (TBT)](/tbt/)**, ou tempo total de bloqueio mede a quantidade total de tempo entre a FCP e a TTI onde a thread principal foi bloqueada por tempo suficiente para evitar a responsividade de entrada. *([laboratório](#in-the-lab))*
- **[Cumulative layout shift (CLS)](/cls/)**, ou mudança de layout cumulativa, mede a pontuação cumulativa de todas as mudanças de layout inesperadas que ocorrem entre quando a página começa a ser carregada e quando seu [estado de ciclo de vida](https://developers.google.com/web/updates/2018/07/page-lifecycle-api) muda para "oculta". *([laboratório](#in-the-lab), [campo](#in-the-field))*

Embora esta lista inclua métricas que medem muitos dos vários aspectos de desempenho relevantes para os usuários, ela não inclui tudo (por exemplo, a responsividade e suavidade durante a execução não são cobertas atualmente).

In some cases, new metrics will be introduced to cover missing areas, but in other cases the best metrics are ones specifically tailored to your site.

## Custom metrics

As métricas de desempenho listadas acima são boas para obter uma compreensão geral das características de desempenho da maioria dos sites na web. Elas também são boas por terem um conjunto comum de métricas que os sites podem usar para comparar seu desempenho com o de seus concorrentes.

No entanto, pode haver momentos em que um site específico é único de alguma maneira que requer métricas adicionais para capturar uma medida do seu desempenho total. Por exemplo, a métrica LCP se destina a medir quando o conteúdo principal de uma página terminou de carregar, mas pode haver casos em que o maior elemento não faz parte do conteúdo principal da página e, portanto, a LCP pode não ser relevante.

To address such cases, the Web Performance Working Group has also standardized lower-level APIs that can be useful for implementing your own custom metrics:

- [API User Timing](https://w3c.github.io/user-timing/) (tempo do usuário)
- [API Long Tasks](https://w3c.github.io/longtasks/) (tarefa longas)
- [API Element Timing](https://wicg.github.io/element-timing/) (tempo de elementos)
- [API Navigation Timing](https://w3c.github.io/navigation-timing/) (tempo de navegação)
- [API Resource Timing](https://w3c.github.io/resource-timing/) (tempo de recursos)
- [Server timing](https://w3c.github.io/server-timing/)

Refer to the guide on [Custom Metrics](/custom-metrics/) to learn how to use these APIs to measure performance characteristics specific to your site.
