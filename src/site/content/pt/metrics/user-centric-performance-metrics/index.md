---
layout: post
title: Métricas de desempenho centradas no usuário
authors:
  - philipwalton
date: 2019-11-08
description: As métricas de desempenho centradas no usuário são uma ferramenta crítica para a compreensão e melhoria da experiência do seu site de uma forma que beneficie usuários reais.
tags:
  - performance
  - metrics
---

Todos nós já ouvimos como o desempenho é importante. Mas quando falamos sobre desempenhoe sobre como tornar os sites "rápidos"o que queremos dizer exatamente?

A verdade é que o desempenho é relativo:

- Um site pode ser rápido para um usuário (em uma rede rápida com um dispositivo poderoso), mas lento para outro usuário (em uma rede lenta com um dispositivo low-end).
- Dois sites podem terminar de carregar exatamente na mesma quantidade de tempo, mas um pode *parecer* carregar mais rápido (se carregar o conteúdo progressivamente, em vez de esperar até o final para exibir qualquer coisa).
- Um site pode *parecer* carregar rapidamente, mas depois responder lentamente (ou não responder) à interação do usuário.

Portanto, ao falar sobre desempenho, é importante ser preciso e se referir ao desempenho em termos de critérios objetivos que possam ser medidos quantitativamente. Esses critérios são conhecidos como *métricas*.

Mas só porque uma métrica é baseada em critérios objetivos e pode ser medida quantitativamente, não significa necessariamente que essas medidas sejam úteis.

## Definindo métricas

Historicamente, o desempenho da web tem sido medido com o evento <code>[load](https://developer.mozilla.org/docs/Web/API/Window/load_event)</code>. No entanto, embora o <code>load</code> seja um momento bem definido no ciclo de vida de uma página, esse momento não corresponde necessariamente a algo com que o usuário se importe.

Por exemplo, um servidor pode responder com uma página mínima que "carrega" imediatamente, mas adia a busca de conteúdo e a exibição de qualquer coisa na página até vários segundos após o evento `load`. Embora tal página possa tecnicamente ter um tempo de carregamento rápido, esse tempo não corresponderia à forma como o usuário realmente percebe o carregamento da página.

Nos últimos anos, membros da equipe do Chromeem colaboração com o [W3C Web Performance Working Group](https://www.w3.org/webperf/)têm trabalhado para padronizar um conjunto de novas APIs e métricas que medem com mais precisão como os usuários experimentam o desempenho de uma página web.

Para ajudar a garantir que as métricas sejam relevantes para os usuários, nós as organizamos em torno de algumas questões-chave:

<table id="questions">
  <tr>
    <td><strong>Isto está acontecendo?</strong></td>
    <td>A navegação começou com sucesso? O servidor respondeu?</td>
  </tr>
  <tr>
    <td><strong>É útil?</strong></td>
    <td>O conteúdo renderizado foi suficiente para que os usuários possam interagir com ele?</td>
  </tr>
  <tr>
    <td><strong>É utilizável?</strong></td>
    <td>Os usuários podem interagir com a página ou ela está ocupada?</td>
  </tr>
  <tr>
    <td><strong>É agradável?</strong></td>
    <td>As interações são suaves e naturais, livres de atrasos e interrupções?</td>
  </tr>
</table>

## Como as métricas são medidas

As métricas de desempenho geralmente são medidas de duas maneiras:

- **No laboratório:** usando ferramentas para simular o carregamento de uma página em um ambiente consistente e controlado
- **No campo** : em usuários reais carregando e interagindo com uma página no mundo real

Nenhuma dessas opções é necessariamente melhor ou pior do que a outrana verdade, geralmente o ideal é usar as duas para garantir um bom desempenho.

### Em laboratório

O desempenho do teste em laboratório é essencial ao desenvolver novos recursos. Antes dos recursos serem lançados em produção, é impossível medir suas características de desempenho em usuários reais, portanto, testá-los no laboratório antes do lançamento do recurso é a melhor maneira de evitar regressões de desempenho.

### Em campo

Por outro lado, embora o teste em laboratório seja um proxy razoável para o desempenho, não é necessariamente o reflexo de como todos os usuários experimentam seu site no mundo real.

O desempenho de um site pode variar drasticamente com base nos recursos do dispositivo do usuário e nas condições da rede. Também pode variar com base em se (ou como) um usuário está interagindo com a página.

Além disso, os carregamentos de página podem não ser determinísticos. Por exemplo, sites que carregam conteúdo ou anúncios personalizados podem apresentar características de desempenho muito diferentes de usuário para usuário. Um teste de laboratório não irá capturar essas diferenças.

A única maneira de realmente conhecer o desempenho do seu site para os usuários é medir seu desempenho à medida que esses usuários o carregam e interagem com ele. Este tipo de medição é frequentemente chamada de [Real User Monitoring](https://en.wikipedia.org/wiki/Real_user_monitoring) (monitoramento do usuário real) ou RUM.

## Tipos de métricas

Existem vários outros tipos de métricas que são relevantes para a forma como os usuários percebem o desempenho.

- **Velocidade de carregamento percebida:** a rapidez com que uma página pode carregar e renderizar todos os seus elementos visuais na tela.
- **Responsividade de carga:** a rapidez com que uma página pode carregar e executar qualquer código JavaScript necessário para que os componentes respondam rapidamente à interação do usuário
- **Responsividade do tempo de execução:** após o carregamento da página, com que rapidez a página pode responder à interação do usuário.
- **Estabilidade visual:** os elementos na página mudam de maneiras que os usuários não esperam e potencialmente interferem em suas interações?
- **Suavidade:** as transições e animações são renderizadas numa taxa de quadros consistente e fluem com fluidez de um estado para o outro?

Dados todos os tipos de métricas de desempenho acima, esperamos ter ficado claro que nenhuma métrica única é suficiente para capturar todas as características de desempenho de uma página.

## Métricas importantes para medir

- **[First contentful paint (FCP)](/fcp/)**, ou primeira renderização de conteúdo, mede o tempo desde o início do carregamento da página até o momento em que qualquer parte do conteúdo da página é renderizada na tela. *([laboratório](#in-the-lab), [campo](#in-the-field))*
- **[Largest contentful paint (LCP)](/lcp/)**, ou maior renderização de conteúdo mede o tempo desde o início do carregamento da página até o momento em que o maior bloco de texto ou elemento de imagem é renderizado na tela. *([laboratório](#in-the-lab), [campo](#in-the-field))*
- **[First input delay (FID)](/fid/)**, ou atraso na primeira entrada, mede o tempo desde quando um usuário interage pela primeira vez com seu site (ou seja, quando ele clica num link, toca num botão ou usa um controle personalizado em JavaScript) até o momento em que o navegador seja capaz de responder a essa interação. *([campo](#in-the-field))*
- **[Time to Interactive (TTI)](/tti/)**, ou tempo até interatividade, mede o tempo desde o início do carregamento da página até o momento em que é renderizada visualmente, seus scripts iniciais (se houver) tenham sido totalmente carregados e que seja capaz de responder de forma confiável e rápida à entrada do usuário. *([laboratório](#in-the-lab))*
- **[Total blocking time (TBT)](/tbt/)**, ou tempo total de bloqueio mede a quantidade total de tempo entre a FCP e a TTI onde a thread principal foi bloqueada por tempo suficiente para evitar a responsividade de entrada. *([laboratório](#in-the-lab))*
- **[Cumulative layout shift (CLS)](/cls/)**, ou mudança de layout cumulativa, mede a pontuação cumulativa de todas as mudanças de layout inesperadas que ocorrem entre quando a página começa a ser carregada e quando seu [estado de ciclo de vida](https://developer.chrome.com/blog/page-lifecycle-api/) muda para "oculta". *([laboratório](#in-the-lab), [campo](#in-the-field))*

Embora esta lista inclua métricas que medem muitos dos vários aspectos de desempenho relevantes para os usuários, ela não inclui tudo (por exemplo, a responsividade e suavidade durante a execução não são cobertas atualmente).

Em alguns casos, novas métricas serão introduzidas para cobrir áreas ausentes, mas em outros casos, as melhores métricas são aquelas especificamente adaptadas ao seu site.

## Métricas personalizadas

As métricas de desempenho listadas acima são boas para obter uma compreensão geral das características de desempenho da maioria dos sites na web. Elas também são boas por terem um conjunto comum de métricas que os sites podem usar para comparar seu desempenho com o de seus concorrentes.

No entanto, pode haver momentos em que um site específico é único de alguma maneira que requer métricas adicionais para capturar uma medida do seu desempenho total. Por exemplo, a métrica LCP se destina a medir quando o conteúdo principal de uma página terminou de carregar, mas pode haver casos em que o maior elemento não faz parte do conteúdo principal da página e, portanto, a LCP pode não ser relevante.

Para resolver esses casos, o Web Performance Working Group também padronizou APIs de nível inferior que podem ser úteis para implementar suas próprias métricas personalizadas:

- [API User Timing](https://w3c.github.io/user-timing/) (tempo do usuário)
- [API Long Tasks](https://w3c.github.io/longtasks/) (tarefa longas)
- [API Element Timing](https://wicg.github.io/element-timing/) (tempo de elementos)
- [API Navigation Timing](https://w3c.github.io/navigation-timing/) (tempo de navegação)
- [API Resource Timing](https://w3c.github.io/resource-timing/) (tempo de recursos)
- [Tempo do servidor](https://w3c.github.io/server-timing/)

Consulte o guia sobre [métricas personalizadas](/custom-metrics/) para aprender como usar essas APIs para medir as características de desempenho específicas do seu site.
