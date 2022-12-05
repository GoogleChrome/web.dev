---
layout: post
title: Meça o desempenho com o modelo RAIL
description: |2

  O modelo RAIL permite que designers e desenvolvedores direcionem de forma confiável o trabalho de otimização de desempenho que tem o maior impacto na experiência do usuário. Aprenda quais objetivos e diretrizes o modelo RAIL estabelece e quais ferramentas você pode usar para alcançá-los.
date: 2020-06-10
tags:
  - performance
  - animations
  - devtools
  - lighthouse
  - metrics
  - mobile
  - network
  - rendering
  - ux
---

**RAIL** é um **modelo de desempenho centrado no usuário** que fornece uma estrutura para analisar o desempenho. O modelo divide a experiência do usuário em ações-chave (por exemplo, tocar, rolar, carregar) e ajuda a definir metas de desempenho para cada uma delas.

RAIL representa quatro aspectos distintos do ciclo de vida do aplicativo da web: resposta, animação, inatividade e carregamento. Os usuários têm expectativas de desempenho diferentes para cada um desses contextos. Portanto, as metas de desempenho são definidas com base no contexto e [na pesquisa de UX sobre como os usuários percebem os atrasos](https://www.nngroup.com/articles/response-times-3-important-limits/).

<figure>{% Img src="image/admin/uc1IWVOW2wEhIY6z4KjJ.png", alt="As quatro partes do modelo de desempenho RAIL: resposta, animação, ocioso e carga.", width = "800", height="290" %}<figcaption> As quatro partes do modelo de desempenho RAIL</figcaption></figure>

## Foco no usuário

Faça dos usuários o ponto central de seu esforço de desempenho. A tabela abaixo descreve as principais métricas de como os usuários percebem atrasos no desempenho:

<table class="table-wrapper scrollbar">
  <thead>Percepção do usuário sobre atrasos de desempenho</thead>
  <tr>
    <td>0 a 16 ms</td>
    <td>Os usuários são excepcionalmente bons em rastrear movimentos e não gostam quando as animações não são suaves. Eles percebem as animações como suaves, desde que 60 novos quadros sejam renderizados a cada segundo. São 16 ms por quadro, incluindo o tempo que leva para o navegador pintar o novo quadro na tela, deixando um aplicativo de cerca de 10 ms para produzir um quadro.</td>
  </tr>
  <tr>
    <td>0 a 100 ms</td>
    <td>Responda às ações do usuário dentro dessa janela de tempo e eles sentirão que o resultado é imediato. Se levar mais tempo, a conexão entre ação e reação é quebrada.</td>
  </tr>
  <tr>
    <td>100 a 1000 ms</td>
    <td>Dentro desta janela, as coisas parecem ser parte de uma progressão natural e contínua de tarefas. Para a maioria dos usuários da web, carregar páginas ou alterar visualizações representa uma tarefa.</td>
  </tr>
  <tr>
    <td>1000 ms ou mais</td>
    <td>Além de 1000 milissegundos (1 segundo), os usuários perdem o foco na tarefa que estão executando.</td>
  </tr>
  <tr>
    <td>10.000 ms ou mais</td>
    <td>Além de 10.000 milissegundos (10 segundos), os usuários ficam frustrados e tendem a abandonar as tarefas. Eles podem ou não voltar mais tarde.</td>
  </tr>
</table>

{% Aside %} Os usuários percebem atrasos de desempenho de maneira diferente, dependendo das condições da rede e do hardware. Por exemplo, carregar sites em uma máquina de desktop poderosa com uma conexão Wi-Fi rápida geralmente ocorre em menos de 1 s e os usuários se acostumaram com isso. Carregar sites em dispositivos móveis com conexões 3G lentas leva mais tempo, então os usuários de celular geralmente são mais pacientes, sendo que carregar em 5 s no celular é uma meta mais realista. {% endAside %}

## Metas e diretrizes

No contexto do RAIL, os termos **objetivos** e **diretrizes** têm significados específicos:

- **Objetivos**. Principais métricas de desempenho relacionadas à experiência do usuário. Por exemplo, toque para pintar em menos de 100 milissegundos. Como a percepção humana é relativamente constante, é improvável que esses objetivos mudem tão cedo.

- **Diretrizes**. Recomendações que ajudam o usuário a atingir objetivos. Podem ser específicas para o hardware atual e as condições de conexão de rede e, portanto, mudar com o tempo.

## Resposta: processar eventos em menos de 50 ms

**Objetivo** : concluir uma transição iniciada pela entrada do usuário em 100 ms, para que sintam que as interações são instantâneas.

**Diretrizes**:

- Para garantir uma resposta visível em 100 ms, processe os eventos de entrada do usuário em 50 ms. Isso se aplica à maioria das entradas, como clicar em botões, alternar controles de formulário ou iniciar animações. Isso não se aplica a arrastar ou rolar por toque.

- Embora possa parecer contra-intuitivo, nem sempre é a chamada certa para responder à entrada do usuário imediatamente. Você pode usar essa janela de 100 ms para fazer outro trabalho caro, mas tome cuidado para não bloquear o usuário. Se possível, trabalhe em segundo plano.

- Para ações que levam mais de 50 ms para serem concluídas, sempre forneça feedback.

### 50 ms ou 100 ms?

O objetivo é responder à entrada em menos de 100 ms, então por que a nossa reserva é de apenas 50 ms? Isso ocorre porque geralmente há outro trabalho sendo feito, além do tratamento de entrada, e ele ocupa parte do tempo disponível para obter uma resposta de entrada aceitável. Se um aplicativo estiver executando o trabalho nos blocos recomendados de 50 ms durante o tempo ocioso, isso significa que a entrada pode ser enfileirada por até 50 ms se ocorrer durante um desses blocos de trabalho. Levando em conta isso, é seguro presumir que apenas os 50 ms restantes estão disponíveis para o tratamento de entrada real. Este efeito é visualizado no diagrama abaixo que mostra como a entrada recebida durante uma tarefa ociosa é enfileirada, reduzindo o tempo de processamento disponível:

<figure>{% Img src="image/admin/I7HDZ9qGxe0jAzz6PxNq.png", alt="Diagrama mostrando como a entrada recebida durante uma tarefa ociosa é enfileirada, reduzindo o tempo de processamento de entrada disponível para 50 ms", width="800", height="400" %}<figcaption> Como as tarefas ociosas afetam a reserva de resposta de entrada.</figcaption></figure>

## Animação: produzir um quadro em 10 ms

**Objetivos** :

- Produza cada quadro de uma animação em 10 ms ou menos. Tecnicamente, a reserva máxima para cada quadro é de 16 ms (1000 ms/60 quadros por segundo ≈ 16 ms), mas os navegadores precisam de cerca de 6 ms para renderizar cada quadro, por isso a diretriz de 10 ms por quadro.

- Procure suavidade visual. Os usuários percebem quando as taxas de quadros variam.

**Diretrizes** :

- Em pontos de alta pressão, como animações, a chave é não fazer nada em que você pode e o mínimo absoluto em que você não pode. Sempre que possível, use a resposta de 100 ms para pré-calcular o trabalho caro, de modo que você maximize suas chances de atingir 60 fps.

- Consulte [Desempenho de renderização](/rendering-performance/) para obter várias estratégias de otimização de animação.

{% Aside %} Reconheça todos os tipos de animações. As animações não são apenas efeitos de interface do usuário sofisticados. Cada uma dessas interações são consideradas animações:

- Animações visuais: como entradas e saídas, [interpolações](https://www.webopedia.com/TERM/T/tweening.html) e indicadores de carregamento.
- Rolagem: inclui arremessar, que é quando o usuário começa a rolar e depois solta, e a página continua rolando.
- Arraste: as animações geralmente seguem as interações do usuário, como movimentar um mapa ou pinçar para aumentar o zoom. {% endAside %}

## Inativo: maximizar o tempo ocioso

**Objetivo**: maximizar o tempo ocioso para aumentar as chances de que a página responda à entrada do usuário em 50 ms.

**Diretrizes**:

- Use o tempo ocioso para concluir o trabalho adiado. Por exemplo, para o carregamento inicial da página, carregue o mínimo de dados possível e, em seguida, use o [tempo ocioso](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback) para carregar o restante.

- Execute o trabalho durante o tempo ocioso em 50 ms ou menos. Ao demorar mais, você corre o risco de interferir na capacidade do aplicativo de responder à entrada do usuário em 50 ms.

- Se um usuário interagir com uma página durante o trabalho em tempo ocioso, a interação do usuário deve sempre ter a prioridade mais alta e interromper o trabalho em tempo ocioso.

## Carregar: entregue conteúdo e torne-se interativo em menos de 5 segundos

Quando as páginas carregam lentamente, a atenção do usuário se dispersa e os usuários percebem a tarefa como interrompida. Sites que carregam rapidamente têm [sessões médias mais longas, taxas de rejeição mais baixas e maior visibilidade do anúncio](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/).

**Objetivos**:

- Otimize para obter desempenho de carregamento rápido em relação aos recursos do dispositivo e da rede de seus usuários. Atualmente, um bom objetivo para os primeiros carregamentos é carregar a página e ser [interativo](/tti/) em [5 segundos ou menos a partir de dispositivos móveis de médio alcance com conexões 3G lentas](/performance-budgets-101/#establish-a-baseline).

- Para os próximos carregamentos, uma boa meta é carregar a página em menos de 2 segundos.

{% Aside %}

Saiba que essas metas podem mudar com o tempo.

{% endAside %}

**Diretrizes**:

- Teste seu desempenho de carregamento nos dispositivos móveis e conexões de rede comuns entre seus usuários. Você pode usar o [Relatório de experiência do usuário do Chrome](/chrome-ux-report/) para descobrir a [distribuição](/chrome-ux-report-data-studio-dashboard/#using-the-dashboard) de conexão de seus usuários. Se os dados não estiverem disponíveis para seu site, [The Mobile Economy 2019](https://www.gsma.com/mobileeconomy/) sugere que uma boa linha de base global é um telefone Android de médio alcance, como um Moto G4 e uma rede 3G lenta (definida como 400 ms RTT e velocidade de transferência de 400 kbps). Essa combinação está disponível em [WebPageTest](https://www.webpagetest.org/easy).

- Lembre-se de que, embora o dispositivo de um usuário móvel típico possa alegar que está em uma conexão 2G, 3G ou 4G, na realidade a [velocidade efetiva da conexão](/adaptive-serving-based-on-network-quality/#how-it-works) costuma ser significativamente mais lenta, devido à perda de pacotes e à variação da rede.

- [Elimine recursos de bloqueio de renderização](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/).

- Você não precisa carregar tudo em menos de 5 segundos para causar a impressão de um carregamento completo. Considere [imagens de carregamento lento](/browser-level-image-lazy-loading/), [pacotes JavaScript de divisão de código](/reduce-javascript-payloads-with-code-splitting/) e outras [otimizações sugeridas em web.dev](/fast/).

{% Aside %} Reconheça os fatores que afetam o desempenho do carregamento da página:

- Velocidade e latência da rede
- Hardware (CPUs mais lentas, por exemplo)
- Remoção de cache
- Diferenças no cache L2/L3
- Analisando JavaScript {% endAside %}

## Ferramentas para medir RAIL

Existem algumas ferramentas para ajudá-lo a automatizar as medições do RAIL. Qual você usa depende do tipo de informação de que você precisa e de qual tipo de fluxo de trabalho você prefere.

### Chrome DevTools

O [Chrome DevTools](https://developer.chrome.com/docs/devtools/) fornece análises detalhadas sobre tudo o que acontece enquanto sua página é carregada ou executada. Consulte [Introdução à análise do desempenho do tempo de execução](https://developer.chrome.com/docs/devtools/evaluate-performance/) para se familiarizar com a IU do painel **Desempenho**.

Os seguintes recursos do DevTools são especialmente relevantes:

- [Acelere sua CPU](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#cpu-throttle) para simular um dispositivo menos potente.

- [Acelere a rede](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network-throttle) para simular conexões mais lentas.

- [Visualize a atividade da thread principal](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#main) para ver todos os eventos que ocorreram na thread principal enquanto você estava gravando.

- [Visualize as principais atividades da thread em uma tabela](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#activities) para classificar as atividades com base naquelas que ocupam mais tempo.

- [Analise quadros por segundo (FPS)](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#fps) para medir se suas animações realmente funcionam sem problemas.

- [Monitore o uso da CPU, tamanho de heap JS, nós DOM, layouts por segundo e muito mais](https://developers.google.com/web/updates/2017/11/devtools-release-notes#perf-monitor) em tempo real com o **Monitor de Desempenho**.

- [Visualize solicitações de rede](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network) que ocorreram enquanto você estava gravando com a seção **Rede.**

- [Capture screenshots durante a gravação](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#screenshots) para reproduzir exatamente como a página parecia enquanto a página era carregada ou uma animação era disparada e assim por diante.

- [Visualize as interações](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#interactions) para identificar rapidamente o que aconteceu em uma página depois que um usuário interagiu com ela.

- [Encontre problemas de desempenho de rolagem em tempo real](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#scrolling-performance-issues) destacando a página sempre que um ouvinte potencialmente problemático for acionado.

- [Visualize eventos de pintura em tempo real](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#paint-flashing) para identificar eventos de pintura custosos que podem prejudicar o desempenho de suas animações.

### Lighthouse

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) está disponível no Chrome DevTools, em [web.dev/measure](/measure/), como uma extensão do Chrome, como um módulo Node.js e dentro do WebPageTest. Você fornece uma URL, ele simula um dispositivo de médio alcance com uma conexão 3G lenta, executa uma série de auditorias na página e, em seguida, fornece um relatório sobre o desempenho de carregamento, além de sugestões de como melhorar.

As seguintes auditorias são especialmente relevantes:

**Resposta**

- [Atraso de entrada com potencial máximo](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-max-potential-fid/). Estima quanto tempo seu aplicativo levará para responder à entrada do usuário, com base no tempo ocioso da thread principal.

- [Não usa ouvintes passivos para melhorar o desempenho de rolagem](https://developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners/).

- [Tempo total de bloqueio](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/). Mede a quantidade total de tempo que uma página fica bloqueada para responder à entrada do usuário, como cliques do mouse, toques na tela ou pressionamentos de teclado.

- [Tempo para interação](https://developers.google.com/web/tools/lighthouse/audits/consistently-interactive). Mede quando um usuário pode interagir de forma consistente com todos os elementos da página.

**Carregamento**

- [Não registra um trabalho de serviço que controla a página e start_url](https://developer.chrome.com/docs/lighthouse/pwa/service-worker/). Um trabalho de serviço pode armazenar em cache recursos comuns no dispositivo de um usuário, reduzindo o tempo gasto na busca de recursos na rede.

- [O carregamento da página não é rápido o suficiente em redes móveis](https://developer.chrome.com/docs/lighthouse/pwa/load-fast-enough-for-pwa/).

- [Elimine recursos de bloqueio de renderização](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources).

- [Adie imagens fora da tela](https://developer.chrome.com/docs/lighthouse/performance/offscreen-images/). Adie o carregamento de imagens fora da tela até que sejam necessárias.

- [Tamanho adequado das imagens](https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images/). Não exiba imagens significativamente maiores do que o tamanho renderizado na janela de visualização móvel.

- [Evite encadear solicitações críticas](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/).

- [Não usa HTTP/2 para todos os seus recursos](https://developer.chrome.com/docs/lighthouse/best-practices/uses-http2/).

- [Codifique imagens de forma eficiente](https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images/).

- [Ative a compactação de texto](https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/).

- [Evite enormes cargas de rede](https://developer.chrome.com/docs/lighthouse/performance/total-byte-weight/).

- [Evite um tamanho excessivo de DOM](https://developer.chrome.com/docs/lighthouse/performance/dom-size/). Reduza os bytes da rede enviando apenas nós DOM necessários para renderizar a página.

### WebPageTest

O WebPageTest é uma ferramenta de desempenho da web que usa navegadores reais para acessar páginas e coletar métricas de tempo. Insira uma URL em [webpagetest.org/easy](https://webpagetest.org/easy) para obter um relatório detalhado sobre o desempenho de carregamento da página em um dispositivo Moto G4 real com uma conexão 3G lenta. Você também pode configurar para incluir uma auditoria do Lighthouse.

## Resumo

RAIL é uma lente para olhar a experiência do usuário de um site como uma jornada composta de interações distintas. Entenda como os usuários percebem seu site para definir metas de desempenho com maior impacto na experiência do usuário.

- Concentre-se no usuário.

- Responda à entrada do usuário em menos de 100 ms.

- Produza um quadro em menos de 10 ms ao animar ou rolar.

- Maximize o tempo ocioso da thread principal.

- Carregue conteúdo interativo em menos de 5000 ms.
