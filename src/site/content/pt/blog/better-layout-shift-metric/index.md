---
title: 'Procura-se comentários: o caminho para uma melhor métrica de mudança de layout para páginas de longa duração'
subhead: Saiba mais sobre nossos planos para melhorar a métrica de Mudança Cumulativa de Layout e envie-nos seus comentários.
description: |2

  Saiba mais sobre nossos planos para melhorar a métrica de Mudança Cumulativa de Layout e envie-nos seus comentários.
authors:
  - anniesullie
  - mmocny
date: 2021-01-25
hero: image/admin/JSBg0yF1fatrTDQSKiTW.webp
alt: Um exemplo de abordagem de janelamento para medir a mudança de layout.
tags:
  - blog
  - performance
  - web-vitals
---

[O Cumulative Layout Shigt - mudança cumulativa de layout](/cls) (CLS) é uma métrica que mede a estabilidade visual de uma página da web. A métrica é chamada de mudança cumulativa de layout  porque a pontuação de cada mudança individual é somada ao longo da vida útil da página.

Embora todas as mudanças de layout sejam experiências do usuário ruins, elas agregam mais em páginas que ficam abertas por mais tempo. É por isso que a equipe de métricas de velocidade do Chrome decidiu melhorar a métrica CLS para ser mais neutra em relação ao tempo gasto em uma página.

É importante que a métrica se concentre na experiência do usuário durante todo o tempo de vida da página, pois descobrimos que os usuários costumam ter experiências negativas após o carregamento, ao rolar ou navegar pelas páginas. Mas ouvimos preocupações sobre como isso afeta as páginas de longa duração: páginas que o usuário geralmente mantém abertas por um longo tempo. Existem vários tipos diferentes de páginas que tendem a permanecer abertas por mais tempo; alguns dos mais comuns são aplicativos de mídia social com rolagem infinita e aplicativos de página única.

Uma análise interna de páginas de longa duração com pontuações CLS altas descobriu que a maioria dos problemas era causada pelos seguintes padrões:

- [Os scrollers infinitos mudam o conteúdo](https://addyosmani.com/blog/infinite-scroll-without-layout-shifts/) conforme o usuário rola.
- Manipuladores de entrada que levam mais de 500 ms para atualizar a IU em resposta a uma interação do usuário, sem qualquer tipo de marcador de posição ou padrão de esqueleto.

Embora incentivemos os desenvolvedores a melhorar essas experiências do usuário, também estamos trabalhando para melhorar a métrica e procurando feedback sobre as possíveis abordagens.

## Como decidiríamos se uma nova métrica é melhor?

Antes de mergulhar no design de métricas, queríamos garantir que avaliássemos nossas ideias em uma ampla variedade de páginas da web e casos de uso do mundo real. Para começar, projetamos um pequeno estudo dos usuários.

Primeiro, gravamos vídeos e [rastros do Chrome](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) de 34 jornadas de usuários por meio de vários sites. Ao selecionar as jornadas do usuário, buscamos algumas coisas:

- Uma variedade de diferentes tipos de sites, como sites de notícias e de compras.
- Uma variedade de jornadas do usuário, como carregamento inicial da página, rolagem, navegações em uma única página no aplicativo e interações do usuário.
- Uma variedade de número e intensidade de mudanças de layout individuais nos sites.
- Poucas experiências negativas nos sites além de mudanças de layout.

Pedimos a 41 de nossos colegas que assistissem a dois vídeos por vez, avaliando qual dos dois era melhor em termos de mudança de layout. A partir dessas classificações, criamos uma ordem de classificação idealizada dos sites. Os resultados da classificação do usuário confirmaram nossas suspeitas de que nossos colegas, como a maioria dos usuários, ficam realmente frustrados com as mudanças de layout após o carregamento, especialmente durante a rolagem e navegações de aplicativos em uma única página. Vimos que alguns sites têm experiências de usuário muito melhores durante essas atividades do que outros.

Como gravamos os rastros do Chrome junto com os vídeos, tínhamos todos os detalhes das mudanças de layout individuais em cada jornada do usuário. Nós os usamos para calcular os valores métricos de cada ideia para cada jornada do usuário. Isso nos permitiu ver como cada variante da métrica classificou as jornadas do usuário e quão diferente cada uma era da classificação ideal.

## Quais ideias de métricas testamos?

### Estratégias de janelamento

Frequentemente as páginas têm várias mudanças de layout agrupadas, porque os elementos podem mudar várias vezes conforme o novo conteúdo surge peça por peça. Isso nos levou a experimentar técnicas para agrupamento de mudanças. Para isso, examinamos três abordagens de janelas:

- Janelas caindo
- Janelas deslizantes
- Janelas de sessão

Em cada um desses exemplos, a página tem mudanças de layout de gravidade variável ao longo do tempo. Cada barra azul representa uma única mudança de layout e o comprimento representa a [pontuação](/cls/#layout-shift-score) dessa mudança. As imagens ilustram as maneiras como diferentes estratégias de janelamento agrupam as mudanças de layout ao longo do tempo.

#### Janelas caindo

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/tumbling-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/tumbling-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Exemplo de uma janela tombada.</figcaption></figure>

A abordagem mais simples é dividir a página em janelas de blocos de tamanhos iguais. Estas são chamadas de janelas caindo. Você notará acima que a quarta barra realmente parece que deveria ser agrupada na segunda janela pendente, mas como todas as janelas têm um tamanho fixo, ela está na primeira janela. Se houver pequenas diferenças no tempo de carregamento ou nas interações do usuário na página, as mesmas mudanças de layout podem ocorrer em lados diferentes dos limites da janela caindo.

#### Janelas deslizantes

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/sliding-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/sliding-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Exemplo de janela deslizante.</figcaption></figure>

Uma abordagem que nos permite ver mais agrupamentos possíveis do mesmo comprimento é atualizar continuamente a janela potencial ao longo do tempo. A imagem acima mostra uma janela deslizante de cada vez, mas poderíamos olhar todas as janelas deslizantes possíveis ou um subconjunto delas para criar uma métrica.

#### Janelas de sessão

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Exemplo de uma janela de sessão.</figcaption></figure>

Se quiséssemos nos concentrar na identificação de áreas da página com rajadas de mudanças de layout, poderíamos iniciar cada janela em uma mudança e continuar crescendo até encontrar um intervalo de um determinado tamanho entre as mudanças de layout. Essa abordagem agrupa as mudanças de layout e ignora a maior parte da experiência do usuário sem mudanças. Um problema potencial é que, se não houver lacunas nas mudanças de layout, uma métrica baseada em janelas de sessão pode crescer sem limites, assim como a métrica CLS atual. Então, também tentamos fazer isso com um tamanho máximo de janela.

### Tamanhos de janela

A métrica pode fornecer resultados muito diferentes, dependendo do tamanho real das janelas, então tentamos vários tamanhos de janela diferentes:

- Cada mudança como sua própria janela (sem janelas)
- 100 ms
- 300 ms
- 1 segundo
- 5 segundos

### Processo de resumo

Tentamos várias maneiras de resumir as diferentes janelas.

#### Percentis

Observamos o valor máximo da janela, bem como o percentil 95, o percentil 75 e a mediana.

#### Média

Observamos o valor médio da janela.

#### Orçamentos

Ficamos imaginando se talvez houvesse alguma pontuação mínima de mudança de layout que os usuários não notariam, e poderíamos apenas contar as mudanças de layout acima desse "orçamento" na pontuação. Portanto, para vários valores de "orçamento" em potencial, observamos a porcentagem de turnos acima do orçamento e a pontuação total de turnos acima do orçamento.

### Outras estratégias

Também examinamos muitas estratégias que não envolviam janelas, como a mudança total de layout dividido por tempo na página e a média das piores N mudanças individuais.

## Os resultados iniciais

No geral, testamos **145 definições de métricas diferentes com** base em permutações das ideias acima. Para cada métrica, classificamos todas as jornadas do usuário de acordo com sua pontuação na métrica e, em seguida, classificamos as métricas de acordo com a proximidade da classificação ideal.

Para obter uma linha de base, também classificamos todos os sites de acordo com sua pontuação CLS atual. CLS ficou em 32º lugar, empatado com 13 outras estratégias, por isso foi melhor do que a maioria das permutações das estratégias acima. Para garantir que os resultados fossem significativos, também adicionamos três ordenações aleatórias. Como esperado, as ordenações aleatórias foram piores do que todas as estratégias testadas.

Para entender se poderíamos estar sobreajustando para o conjunto de dados, após nossa análise, gravamos alguns novos vídeos de mudança de layout e rastros, classificamos manualmente e vimos que as classificações de métricas eram muito semelhantes para o novo conjunto de dados e o original.

Algumas estratégias diferentes se destacaram nas classificações.

### Melhores estratégias

Quando classificamos as estratégias, descobrimos que três tipos de estratégias encabeçam a lista. Cada um teve aproximadamente o mesmo desempenho, então planejamos avançar com uma análise mais profunda em todos os três. Também gostaríamos de ouvir o feedback do desenvolvedor para entender se existem fatores fora da experiência do usuário que devemos considerar ao decidir entre eles. (Veja abaixo como deixar seus comentários.)

#### Altos percentis de janelas longas

Algumas estratégias de janelamento funcionaram bem com janelas grandes:

- Janelas deslizantes de 1 segundo
- As janelas de sessão são limitadas a 5 segundos com intervalo de 1 segundo
- Janelas de sessão sem limite com intervalo de 1 segundo

Todos eles se classificaram muito bem no 95º percentil e no máximo.

Mas, para tamanhos de janela tão grandes, estávamos preocupados em usar o percentil 95 - frequentemente, olhávamos apenas 4 a 6 janelas e pegar o percentil 95 disso seria muita interpolação. Não está claro o que a interpolação faz em termos de valor métrico. O valor máximo é muito mais claro, então decidimos seguir em frente com a verificação do máximo.

#### Média de janelas de sessão com intervalos longos

A média das pontuações de todas as janelas de sessão sem limite com intervalos de 5 segundos entre elas teve um desempenho muito bom. Essa estratégia tem algumas características interessantes:

- Se a página não tiver lacunas entre as mudanças de layout, ela acabará sendo uma janela de sessão longa com exatamente a mesma pontuação do CLS atual.
- Essa métrica não levou em consideração o tempo ocioso diretamente; ela apenas considerou as mudanças que ocorreram na página, e não em pontos no tempo em que a página não estava mudando.

#### Altos percentis de janelas curtas

A janela deslizante máxima de 300 ms teve uma classificação muito alta, assim como o 95º percentil. Para o tamanho de janela menor, há menos interpolação de percentil do que tamanhos de janela maiores, mas também estávamos preocupados em "repetir" janelas deslizantes: se um conjunto de mudanças de layout ocorrer em dois quadros, haverá várias janelas de 300 ms que as incluem. Tirar o máximo é muito mais claro e simples do que tirar o 95º percentil. Então, mais uma vez, decidimos seguir em frente com a verificação do máximo.

### Estratégias que não deram certo

As estratégias que tentaram considerar a experiência "média" de tempo gasto sem mudanças de layout e com mudanças de layout se saíram muito mal. Nenhum dos resumos da mediana ou do 75º percentil de qualquer estratégia de janelamento classificou bem os sites. Nem a soma das mudanças de layout ao longo do tempo.

Avaliamos uma série de "orçamentos" diferentes para mudanças de layout aceitáveis:

- A porcentagem do layout muda acima de algum orçamento. Para vários orçamentos, todos eles tiveram uma classificação muito ruim.
- Mudança de layout média acima de algum excesso. A maioria das variações dessa estratégia teve um desempenho ruim, mas o excesso médio em uma sessão longa com um grande intervalo teve um desempenho quase tão bom quanto a média das janelas de sessão com intervalos longos. Decidimos seguir em frente apenas com o último por ser mais simples.

## Próximos passos

### Análise em grande escala

Implementamos as principais estratégias listadas acima no Chrome para que possamos obter dados sobre o uso no mundo real para um conjunto muito maior de sites. Planejamos usar uma abordagem semelhante de sites de classificação com base em suas pontuações métricas para fazer a análise em larga escala:

- Classificar todos os sites por CLS e por cada novo candidato a métrica.
    - Quais sites são classificados de maneira mais diferente pelo CLS e por cada candidato? Encontramos algo inesperado quando observamos para esses sites?
    - Quais são as maiores diferenças entre os novos candidatos à métrica? Alguma das diferenças se destaca como vantagens ou desvantagens de um candidato específico?
- Repetir a análise acima, mas classificando por tempo gasto em cada carregamento de página. Vemos uma melhoria esperada nos carregamentos de página de longa duração com mudança de layout aceitável? Vemos algum resultado inesperado em páginas de curta duração?

### Comentários sobre nossa abordagem

Adoraríamos ouvir os comentários de desenvolvedores da web sobre essas abordagens. Algumas coisas a se ter em mente ao considerar as novas abordagens:

#### O que não está mudando

Queremos esclarecer que muitas coisas não mudarão com uma nova abordagem:

- Nenhuma de nossas ideias de métricas muda a maneira como as pontuações de mudança de layout para [frames individuais são calculadas](/cls/#layout-shift-score), apenas a maneira como resumimos vários frames. Isso significa que a [API JavaScript](/cls/#measure-cls-in-javascript) para mudanças de layout permanecerá a mesma e os eventos subjacentes nos traços do Chrome que as ferramentas de desenvolvedor usam também permanecerão os mesmos, portanto, retificações de mudança de layout em ferramentas como WebPageTest e Chrome DevTools continuarão a funcionar da mesma maneira.
- Continuaremos a trabalhar duro para tornar as métricas fáceis de serem adotadas pelos desenvolvedores, incluindo-as na [biblioteca web-vitals](https://github.com/GoogleChrome/web-vitals) , documentando no [web.dev](/metrics) e relatando-as em nossas ferramentas de desenvolvedor como o Lighthouse.

#### Compromissos entre métricas

Uma das principais estratégias resume as janelas de mudança de layout como uma média e as demais relatam a janela máxima. Em páginas que ficam abertas por muito tempo, a média provavelmente relatará um valor mais representativo, mas em geral será mais fácil para os desenvolvedores agirem em uma única janela: eles podem registrar quando isso ocorreu, os elementos que mudaram e em breve. Adoraríamos ouvir os comentários sobre o que é mais importante para os desenvolvedores.

Você acha que as janelas deslizantes ou de sessão são mais fáceis de entender? As diferenças são importantes para você?

#### Como deixar seus comentários

Você pode experimentar as novas métricas de mudança de layout em qualquer site usando nossas [implementações de exemplo de JavaScript](https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver) ou nosso [fork da extensão Core Web Vitals](https://github.com/mmocny/web-vitals-extension/tree/experimental-ls).

Envie feedback por e-mail para nosso grupo **[web-vitals-feedback](https://groups.google.com/g/web-vitals-feedback)**  do Google, com "[Layout Shift Metrics]" na linha de assunto. Estamos ansiosos para ouvir sua opinião!
