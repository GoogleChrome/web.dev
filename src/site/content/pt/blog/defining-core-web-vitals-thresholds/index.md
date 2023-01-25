---
layout: post
title: Definindo os limites das métricas Core Web Vitals
subhead: A pesquisa e a metodologia por trás dos limites das Core Web Vitals
authors:
  - bmcquade
description: A pesquisa e a metodologia por trás dos limites das Core Web Vitals
date: 2020-05-21
updated: 2022-07-18
hero: image/admin/WNrgCVjmp8Gyc8EbZ9Jv.png
alt: A pesquisa e a metodologia por trás dos limites das Core Web Vitals
tags:
  - blog
  - performance
  - web-vitals
---

[Core Web Vitals](/vitals/#core-web-vitals) são um conjunto de métricas de campo que medem aspectos importantes da experiência do usuário no mundo real na web. Core Web Vitals inclui métricas, bem como limites-alvo para cada métrica, que ajudam os desenvolvedores a compreender qualitativamente se a experiência de seu site é "boa", "precisa melhorar" ou é "ruim". Este artigo irá explicar a abordagem usada para escolher os limites para as métricas do Core Web Vitals em geral, bem como explicar como os limites para cada métrica específica do Core Web Vitals foram escolhidos.

## Atualização: métricas e limites da Core Web Vitals

Em 2020, o Core Web Vitals são três métricas: Largest Contentful Paint - LCP (Maior renderização de conteúdo), First Input Delay - FID (Primeiro atraso de entrada) e Cumulative Layout Shift - CLS (Deslocamento cumulativo de layout). Cada métrica mede um aspecto diferente da experiência do usuário: a LCP mede a velocidade de carregamento percebida e marca o ponto na linha do tempo de carregamento da página quando o conteúdo principal da página provavelmente já foi carregado; A FID mede a responsividade e quantifica a experiência que os usuários sentem ao tentar interagir pela primeira vez com a página; e a CLS mede a estabilidade visual e mede a quantidade de mudanças inesperadas de layout do conteúdo visível da página.

Cada métrica Core Web Vitals tem limites associados, que categorizam o desempenho como "bom", "precisa melhorar" ou "ruim":

<style>
  .cluster > img {
    max-width: 30%;
  }
</style>
<div class="cluster">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="Recomendações de limites para Largest Contentful Paint", width="400", height="350" %}
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="Recomendações de limites para First Input Delay", width="400", height="350" %}
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="Recomendações de limites para Cumulative Layout Shift", width="400", height="350" %}
</div>

<div>
  <table>
    <tr>
      <th> </th>
      <th>Bom</th>
      <th>Ruim</th>
      <th>Percentil</th>
    </tr>
    <tr>
      <td>Largest Contentful Paint (LCP)</td>
      <td>≤2500ms</td>
      <td>&gt; 4000ms</td>
      <td>75</td>
    </tr>
    <tr>
      <td>First Input Delay (FID)</td>
      <td>≤100ms</td>
      <td>&gt; 300ms</td>
      <td>75</td>
    </tr>
    <tr>
      <td>Cumulative Layout Shift (CLS)</td>
      <td>≤0,1</td>
      <td>&gt; 0,25</td>
      <td>75</td>
    </tr>
</table>
</div>
<p data-md-type="paragraph">Além disso, para classificar o desempenho geral de uma página ou site, usamos o valor do 75º percentil de todas as visualizações de página dessa página ou site. Em outras palavras, se pelo menos 75 por cento das visualizações de página de um site atingirem o limite "bom", o site será classificado como tendo um desempenho "bom" para essa métrica. Por outro lado, se pelo menos 25% das visualizações de página atingirem o limite "ruim", o site será classificado como tendo desempenho "ruim". Assim, por exemplo, uma LCP do 75º percentil de 2 segundos é classificada como "boa", enquanto uma LCP do 75º percentil de 5 segundos é classificada como "ruim".</p>
<h2 data-md-type="header" data-md-header-level="2">Critérios para os limites das métricas Core Web Vitals</h2>
<p data-md-type="paragraph">Ao estabelecer limites para as métricas do Core Web Vitals, primeiro identificamos os critérios que cada limite deve atender. Abaixo, eu explico os critérios que usamos no Google para avaliar os limites de métrica do Core Web Vitals em 2020. As seções subsequentes irão se aprofundar sobre como esses critérios foram aplicados para selecionar os limites para cada métrica em 2020. Nos próximos anos, prevemos fazer melhorias e adições aos critérios e limites para deixar nossa capacidade de medir excelentes experiências do usuário no rede ainda melhor.</p>
<h3 data-md-type="header" data-md-header-level="3">Alta qualidade da experiência do usuário</h3>
<p data-md-type="paragraph">Nosso principal objetivo é otimizar para o usuário para a qualidade de sua experiência. Diante disso, nosso objetivo é garantir que as páginas que atendem aos "bons" limites do Core Web Vitals proporcionem uma experiência de usuário de alta qualidade.</p>
<p data-md-type="paragraph">Para identificar um limite associado à experiência do usuário de alta qualidade, olhamos para a percepção humana e a pesquisa de HCI. Embora essa pesquisa às vezes seja resumida usando um único limite fixo, descobrimos que a pesquisa subjacente é normalmente expressa como uma gama de valores. Por exemplo, a pesquisa sobre a quantidade de tempo que os usuários normalmente esperam antes de perder o foco às vezes é descrita como 1 segundo, enquanto que a pesquisa subjacente é, na verdade, expressa como um intervalo, de centenas de milissegundos a vários segundos. O fato de que os limites de percepção variam dependendo do usuário e do contexto é ainda suportado por dados de métricas agregados e anônimos do Chrome, o que mostra que não há uma quantidade de tempo única que os usuários esperam para uma página web exibir o conteúdo antes de abortar o carregamento. Em vez disso, esses dados mostram uma distribuição uniforme e contínua. Para uma análise mais aprofundada dos limites de percepção humana e pesquisas relevantes de HCI, veja <a href="https://blog.chromium.org/2020/05/the-science-behind-web-vitals.html" data-md-type="link">The Science Behind Web Vitals</a> .</p>
<p data-md-type="paragraph">Nos casos em que pesquisas relevantes sobre a experiência do usuário estão disponíveis para uma determinada métrica e há um consenso razoável sobre a faixa de valores na literatura, usamos essa faixa como entrada para orientar nosso processo de seleção de limite. Nos casos em que pesquisas relevantes sobre a experiência do usuário não estão disponíveis, o que pode ocorrer com as novas métricas, tais como Cumulative Layout Shift, avaliamos as páginas do mundo real que atendem a diferentes limites de candidatos para uma métrica, para identificar um limite que resulte em uma boa experiência do usuário.</p>
<h3 data-md-type="header" data-md-header-level="3">Alcançável a partir do conteúdo web existente</h3>
<p data-md-type="paragraph">Além disso, para garantir que os proprietários de sites possam otimizar seus sites para atender aos "bons" limites, exigimos que esses limites sejam alcançáveis para o conteúdo existente na web. Por exemplo, embora zero milissegundos seja um limite "bom" de LCP ideal, resultando em experiências de carregamento instantâneo, um limite de zero milissegundos não é alcançável na prática na maioria dos casos, devido às latências de processamento de rede e dispositivo. Portanto, zero milissegundos não é um limite razoável de LCP "bom" para Core Web Vitals.</p>
<p data-md-type="paragraph">Ao avaliar os candidatos a limites "bons" do Core Web Vitals, verificamos se esses limites são alcançáveis, com base nos dados do <a href="https://developer.chrome.com/docs/crux/" data-md-type="link">Relatório de Experiência do Usuário Chrome</a> (CrUX). Para confirmar que um limite é alcançável, exigimos que pelo menos 10% das <a href="/same-site-same-origin/#origin" data-md-type="link">origens</a> atualmente atendam ao limite "bom". Além disso, para garantir que sites bem otimizados não sejam classificados incorretamente devido à variabilidade nos dados de campo, também verificamos se o conteúdo bem otimizado atende consistentemente ao limite "bom".</p>
<p data-md-type="paragraph">Por outro lado, estabelecemos o limite "ruim" identificando um nível de desempenho que apenas uma minoria das origens não está atingindo atualmente. A menos que haja pesquisas disponíveis relevantes para definir um limite "ruim", por default, 10-30% das origens com pior desempenho são classificadas como "ruim".</p>
<h3 data-md-type="header" data-md-header-level="3">Considerações finais sobre os critérios</h3>
<p data-md-type="paragraph">Ao avaliar os limites dos candidatos, descobrimos que os critérios às vezes estavam em conflito uns com os outros. Por exemplo, pode haver uma tensão entre um limite ser consistentemente alcançável e garantir boas experiências do usuário consistentemente. Além disso, dado que a pesquisa de percepção humana normalmente fornece uma gama de valores, e as métricas de comportamento do usuário mostram mudanças graduais no comportamento, descobrimos que muitas vezes não há um único limite "correto" para uma métrica. Portanto, nossa abordagem para o 2020 Core Web Vitals tem sido escolher os limites que melhor atendem aos critérios acima, embora reconhecendo que não há um limite perfeito e que às vezes podemos precisar escolher entre vários candidatos razoáveis a limites. Em vez de perguntar "qual é o limite perfeito?" em vez disso, nos concentramos em perguntar "qual candidato a limite que melhor atende aos nossos critérios?"</p>
<h2 data-md-type="header" data-md-header-level="2">Escolha de percentil</h2>
<p data-md-type="paragraph">Conforme observado anteriormente, para classificar o desempenho geral de uma página ou site, usamos o valor do 75º percentil de todas as visitas a essa página ou site. O 75º percentil foi escolhido com base em dois critérios. Primeiro, o percentil deve garantir que a maioria das visitas a uma página ou site tenham o nível de desempenho desejado. Em segundo lugar, o valor no percentil escolhido não deve ser excessivamente impactado por pontos fora da curva.</p>
<p data-md-type="paragraph">Esses objetivos são um tanto contraditórios. Para satisfazer a primeira meta, um percentil mais alto é normalmente a melhor escolha. No entanto, com percentis mais altos, a probabilidade de o valor resultante ser impactado por pontos fora da curva também aumenta. Se acontecer de algumas visitas a um site ocorrerem em conexões de rede instáveis que resultam em amostras LCP excessivamente grandes, não queremos que nossa classificação de site seja decidida por essas amostras discrepantes. Por exemplo, se estivéssemos avaliando o desempenho de um site com 100 visitas usando um percentil alto, como o 95º, seriam necessárias apenas 5 amostras de valores discrepantes para o valor do 95º percentil ser afetado pelos valores discrepantes.</p>
<p data-md-type="paragraph">Dado que essas metas são um pouco contraditórias, após a análise, concluímos que o 75º percentil atinge um equilíbrio razoável. Usando o 75º percentil, sabemos que a maioria das visitas ao site (3 de 4) atingiu o nível de desempenho desejado ou melhor. Além disso, o valor do 75º percentil tem menos probabilidade de ser afetado por pontos fora da curva. Voltando ao nosso exemplo, para um site com 100 visitas, 25 dessas visitas precisariam relatar amostras grandes de pontos fora da curva para o valor no 75º percentil a ser afetado por esses pontos. Embora seja possível 25 de 100 amostras serem discrepantes, isso é muito menos provável do que para o caso do 95º percentil.</p>
<h2 data-md-type="header" data-md-header-level="2">Largest Contentful Paint (LCP)</h2>
<h3 data-md-type="header" data-md-header-level="3">Qualidade da experiência</h3>
<p data-md-type="paragraph">Um segundo é frequentemente citado como a quantidade de tempo que um usuário irá esperar antes de começar a perder o foco em uma tarefa. Em uma inspeção mais detalhada de pesquisas relevantes, descobrimos que um segundo é uma aproximação para descrever uma gama de valores, de aproximadamente várias centenas de milissegundos a vários segundos.</p>
<p data-md-type="paragraph">Duas fontes comumente citadas para o limite de um segundo são <a href="https://dl.acm.org/doi/10.1145/108844.108874" data-md-type="link">Card et al</a> e <a href="https://dl.acm.org/doi/10.1145/1476589.1476628" data-md-type="link">Miller</a>. Card define um limite de "resposta imediata" de um segundo, citando as <a href="https://dl.acm.org/doi/book/10.5555/86564" data-md-type="link">Teorias Unificadas de Cognição</a> de Newell. Newell explica as respostas imediatas como "respostas que devem ser feitas a algum estímulo dentro de <em data-md-type="emphasis">aproximadamente um segundo</em> (isto é, aproximadamente de ~ 0,3s a ~ 3s)." Isso segue a discussão de Newell sobre "restrições em tempo real na cognição", onde se observa que "as interações com o ambiente que evocam considerações cognitivas ocorrem na ordem dos segundos", que variam de aproximadamente 0,5 a 2-3 segundos. Miller, outra fonte frequentemente citada para o limite de um segundo, observa que "tarefas que os humanos podem e irão realizar nas comunicações com máquinas terão suas características alteradas consideravelmente se os atrasos de resposta forem maiores que dois segundos ou algo em torno disso."</p>
<p data-md-type="paragraph">A pesquisa de Miller e Card descreve a quantidade de tempo que um usuário irá esperar, antes de perder o foco, como um intervalo de aproximadamente 0,3 a 3 segundos, o que sugere que nosso limite "bom" de LCP deve estar nesta faixa. Além disso, dado que o limite "bom" da First Contentful Paint existente é de um segundo e que a Largest Contentful Paint normalmente ocorre após a First Contentful Paint, restringimos ainda mais nossa faixa de candidatos a limites de LCP, de 1 segundo a 3 segundos. Para escolher o limite nesta faixa que melhor atende aos nossos critérios, examinamos abaixo a possibilidade de alcançar esses candidatos a limites.</p>
<h3 data-md-type="header" data-md-header-level="3">Possibilidade de realização</h3>
<p data-md-type="paragraph">Usando os dados do CrUX, podemos determinar a porcentagem de origens na web que atendem aos limites "bons" de nosso candidato LCP.</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de origens CrUX classificadas como "boas" (para candidatos a limites de LCP)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>1 segundo</th>
      <th>1,5 segundos</th>
      <th>2 segundos</th>
      <th>2,5 segundos</th>
      <th>3 segundos</th>
    </tr>
    <tr>
      <td><strong>telefone</strong></td>
      <td>3,5%</td>
      <td>13%</td>
      <td>27%</td>
      <td>42%</td>
      <td>55%</td>
    </tr>
    <tr>
      <td><strong>desktop</strong></td>
      <td>6,9%</td>
      <td>19%</td>
      <td>36%</td>
      <td>51%</td>
      <td>64%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Embora menos de 10% das origens atendam ao limite de 1 segundo, todos os outros limites de 1,5 a 3 segundos atendem ao nosso requisito de que pelo menos 10% das origens atendam ao limite "bom" e, portanto, ainda são candidatos válidos.</p>
<p data-md-type="paragraph">Além disso, para garantir que o limite escolhido seja consistentemente atingível para sites bem otimizados, analisamos o desempenho do LCP para sites de alto desempenho em toda a web, para determinar quais limites são consistentemente atingíveis para esses sites. Especificamente, nosso objetivo é identificar um limite que seja consistentemente atingível no 75º percentil para sites de melhor desempenho. Descobrimos que os limites de 1,5 e 2 segundos não são consistentemente alcançáveis, enquanto 2,5 segundos são consistentemente alcançáveis.</p>
<p data-md-type="paragraph">Para identificar um limite "ruim" para LCP, usamos dados CrUX para identificar um limite atingido pela maioria das origens:</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de origens CrUX classificadas como "ruins" (para candidatos a limites de LCP)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>3 segundos</th>
      <th>3,5 segundos</th>
      <th>4 segundos</th>
      <th>4,5 segundos</th>
      <th>5 segundos</th>
    </tr>
    <tr>
      <td><strong>telefone</strong></td>
      <td>45%</td>
      <td>35%</td>
      <td>26%</td>
      <td>20%</td>
      <td>15%</td>
    </tr>
    <tr>
      <td><strong>desktop</strong></td>
      <td>36%</td>
      <td>26%</td>
      <td>19%</td>
      <td>14%</td>
      <td>10%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Para um limite de 4 segundos, cerca de 26% das origens de telefone e 21% das origens de desktop seriam classificadas como ruins. Isto cai em nossa faixa-alvo de 10-30%, então concluímos que 4 segundos é um limite "ruim" aceitável.</p>
<p data-md-type="paragraph">Portanto, concluímos que 2,5 segundos é um limite "bom" razoável e 4 segundos é um limite "ruim" razoável para a Largest Contentful Paint.</p>
<h2 data-md-type="header" data-md-header-level="2">First Input Delay (FID)</h2>
<h3 data-md-type="header" data-md-header-level="3">Qualidade da experiência</h3>
<p data-md-type="paragraph">A pesquisa é razoavelmente consistente ao concluir que atrasos no feedback visual de até cerca de 100 ms são percebidos como sendo causados por uma fonte associada, como uma entrada do usuário. Isto sugere que um limite "bom" de 100 ms para First Input Delay é provavelmente apropriado como um valor mínimo: se o atraso para processamento de entrada exceder 100 ms, não há chance de outras etapas de processamento e renderização serem concluídas a tempo.</p>
<p data-md-type="paragraph">Os tempos de resposta comumente citados por Jakob Nielsen<a href="https://www.nngroup.com/articles/response-times-3-important-limits/" data-md-type="link">: Os 3 limites importantes</a> definem 0,1 segundo como o limite para que o usuário sinta que o sistema está reagindo instantaneamente. Nielsen cita Miller e Card, que cita <a href="https://psycnet.apa.org/record/1964-05029-000" data-md-type="link">The Perception of Causality</a>, de Michotte, de 1962. Na pesquisa de Michotte, aos participantes de um experimento são mostrados "dois objetos em uma tela. O objeto A parte e se move em direção a B. Ele para no momento em que entra em contato com B, enquanto este último começa a se mover e se afasta de A." Michotte varia o intervalo de tempo entre o momento em que o objeto A para e o momento em que o objeto B começa a se mover. Michotte descobre que, para atrasos de até cerca de 100 ms, os participantes têm a impressão de que o objeto A causa o movimento do objeto B. Para atrasos de cerca de 100 ms a 200 ms, a percepção de causalidade é mista, e para atrasos de mais de 200 ms, o movimento do objeto B não é mais visto como tendo sido causado pelo Objeto A.</p>
<p data-md-type="paragraph">Da mesma forma, Miller define um limite de resposta para "Resposta à ativação de controle" como "a indicação de ação dada, normalmente, pelo movimento de uma chave, interruptor ou outro membro de controle que sinaliza que foi fisicamente ativado. Esta resposta deve ser ... percebida como parte da ação mecânica induzida pelo operador. Atraso de tempo: Não mais do que 0,1 segundo "e mais tarde" o atraso entre o pressionamento de uma tecla e o feedback visual não deve ser mais do que 0,1 a 0,2 segundos ".</p>
<p data-md-type="paragraph">Mais recentemente, em <a href="https://dl.acm.org/doi/10.1145/2611387" data-md-type="link">Towards the Temporally Perfect Virtual Button</a>, Kaaresoja et al investigaram a percepção de simultaneidade entre o toque de um botão virtual numa tela sensível ao toque e o feedback visual subsequente indicando que o botão foi tocado, para vários atrasos. Quando o atraso entre o pressionamento do botão e o feedback visual foi de 85ms ou menos, os participantes relataram que o feedback visual apareceu simultaneamente com o pressionamento do botão 75% das vezes. Além disso, para atrasos de 100ms ou menos, os participantes relataram uma qualidade percebida consistentemente alta do pressionamento do botão, com a qualidade percebida caindo para atrasos de 100ms a 150ms, e atingindo níveis muito baixos para atrasos de 300ms.</p>
<p data-md-type="paragraph">Diante do exposto, concluímos que a pesquisa aponta para uma faixa de valores em torno de 100 ms como limite apropriado de First Input Delay para Web Vitals. Além disso, como os usuários relataram níveis de qualidade baixos para atrasos de 300 ms ou mais, 300 ms se apresenta como um limite "ruim" razoável.</p>
<h3 data-md-type="header" data-md-header-level="3">Possibilidade de realização</h3>
<p data-md-type="paragraph">Usando dados do CrUX, determinamos que a maioria das origens na web atendem ao limite "bom" do FID de 100 ms no 75º percentil:</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de origens CrUX classificadas como "boas" para o limite FID de 100 ms</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th></th>
      <th>100ms</th>
    </tr>
    <tr>
      <td><strong>telefone</strong></td>
      <td>78%</td>
    </tr>
    <tr>
      <td><strong>desktop</strong></td>
      <td>&gt; 99%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Além disso, observamos que os principais sites da web conseguem atingir esse limite de forma consistente no 75º percentil (e muitas vezes no 95º percentil).</p>
<p data-md-type="paragraph">Diante do exposto, concluímos que 100 ms é um limite "bom" razoável para a FID.</p>
<h2 data-md-type="header" data-md-header-level="2">Cumulative Layout Shift (CLS)</h2>
<h3 data-md-type="header" data-md-header-level="3">Qualidade da experiência</h3>
<p data-md-type="paragraph">O Cumulative Layout Shift - CLS (deslocamento cumulativo de layout) é uma nova métrica que mede o quanto o conteúdo visível de uma página muda. Como CLS é uma métrica nova, não temos conhecimento de pesquisas que possam informar diretamente os seus limites. Assim, para identificar um limite que esteja alinhado com as expectativas do usuário, avaliamos as páginas do mundo real com diferentes quantidades de mudança de layout, para determinar a quantidade máxima de mudança que é percebida como aceitável antes de causar interrupções significativas ao consumir o conteúdo da página. Em nossos testes internos, descobrimos que os níveis de mudança de 0,15 e acima foram consistentemente percebidos como perturbadores, enquanto as mudanças de 0,1 e abaixo foram perceptíveis, mas não excessivamente perturbadoras. Assim, embora a mudança de layout zero seja ideal, concluímos que valores de até 0,1 são candidatos a limites "bons" de CLS.</p>
<h3 data-md-type="header" data-md-header-level="3">Possibilidade de realização</h3>
<p data-md-type="paragraph">Com base nos dados CrUX, podemos ver que quase 50% das origens têm CLS de 0,05 ou menos.</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de origens CrUX classificadas como "boas" (para candidatos a limites de CLS)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>0,05</th>
      <th>0,1</th>
      <th>0,15</th>
    </tr>
    <tr>
      <td><strong>telefone</strong></td>
      <td>49%</td>
      <td>60%</td>
      <td>69%</td>
    </tr>
    <tr>
      <td><strong>desktop</strong></td>
      <td>42%</td>
      <td>59%</td>
      <td>69%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Embora os dados do CrUX sugiram que 0,05 pode ser um limite "bom" razoável para CLS, reconhecemos que existem alguns casos de uso em que é difícil evitar mudanças de layout perturbadoras. Por exemplo, para conteúdo incorporado de terceiros, como incorporações de mídia social, a altura do conteúdo incorporado às vezes não é conhecida até que termine de carregar, o que pode levar a uma mudança de layout maior que 0,05. Assim, concluímos que, embora muitas origens atendam ao limite de 0,05, o limite ligeiramente menos rigoroso do CLS de 0,1 atinge um melhor equilíbrio entre a qualidade da experiência e a capacidade de realização. Esperamos que, daqui para frente, o ecossistema da web identifique soluções para lidar com mudanças de layout causadas por incorporações de terceiros, o que permitiria o uso de um limite CLS "bom" mais rigoroso de 0,05 ou 0 em uma iteração futura dos Core Web Vitals.</p>
<p data-md-type="paragraph">Além disso, para determinar um limite "ruim" para CLS, usamos dados CrUX para identificar um limite atingido pela maioria das origens:</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de origens CrUX classificadas como "ruins" (para candidatos a limites de CLS)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>0,15</th>
      <th>0,2</th>
      <th>0,25</th>
      <th>0,3</th>
    </tr>
    <tr>
      <td><strong>telefone</strong></td>
      <td>31%</td>
      <td>25%</td>
      <td>20%</td>
      <td>18%</td>
    </tr>
    <tr>
      <td><strong>desktop</strong></td>
      <td>31%</td>
      <td>23%</td>
      <td>18%</td>
      <td>16%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Para um limite de 0,25, cerca de 20% das origens de telefone e 18% das origens de desktop seriam classificadas como "ruins". Isto cai em nossa faixa-alvo de 10-30%, então concluímos que 0,25 é um limite "ruim" aceitável.</p>
