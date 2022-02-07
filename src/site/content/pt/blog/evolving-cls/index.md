---
title: Evoluindo a métrica CLS
subhead: Planos para melhorar a métrica CLS para ser mais justa para páginas de longa duração.
description: Planos para melhorar a métrica CLS para ser mais justa para páginas que ficam abertas por muito tempo.
authors:
  - anniesullie
  - hbsong
date: 2021-04-07
hero: image/admin/JSBg0yF1fatrTDQSKiTW.webp
alt: Um exemplo de abordagem de janelamento para medir a mudança de layout.
tags:
  - blog
  - performance
  - web-vitals
---

{% Aside %} **2 de junho de 2021:** A atualização do CLS descrita nesta postagem já está disponível nas superfícies de ferramentas da web do Chrome. Consulte [Mudança cumulativa de layout em evolução nas ferramentas da Web](/cls-web-tooling/) para obter detalhes. {% endAside %}

Nós (a equipe de métricas de velocidade do Chrome) recentemente delineamos nossa pesquisa inicial sobre [opções para tornar a métrica CLS mais justa para páginas que ficam abertas por um longo tempo](/better-layout-shift-metric/) . Recebemos muitos comentários muito úteis e, depois de concluir a análise em grande escala, finalizamos a mudança que planejamos fazer na métrica: **janela de sessão máxima com intervalo de 1 segundo, limitado a 5 segundos** .

Continue lendo para saber mais detalhes!

## Como avaliamos as opções?

Revisamos todos os comentários recebidos da comunidade de desenvolvedores e os levamos em consideração.

Também implementamos as [opções principais](/better-layout-shift-metric/#best-strategies) no Chrome e fizemos uma análise em grande escala das métricas em milhões de páginas da web. Verificamos quais tipos de sites cada opção melhorou e como as opções foram comparadas, especialmente observando os sites que foram pontuados de forma diferente por opções diferentes. No geral, descobrimos que:

- **Todas** as opções reduziram a correlação entre o tempo gasto na página e a pontuação de mudança de layout.
- **Nenhuma** das opções resultou em uma pontuação pior para qualquer página. Portanto, não há necessidade de se preocupar com o fato de que essa alteração piorará as pontuações do seu site.

## Pontos de decisão

### Por que uma janela de sessão?

Em nosso [post anterior](/better-layout-shift-metric/), cobrimos [algumas estratégias diferentes de janelas](/better-layout-shift-metric/#windowing-strategies) para agrupar mudanças de layout ao mesmo tempo em que garantimos que a pontuação não cresça ilimitada. O feedback que recebemos dos desenvolvedores favoreceu enormemente a estratégia da janela de sessão porque ela agrupa as mudanças de layout de forma mais intuitiva.

Para revisar as janelas de sessão, aqui está um exemplo:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Exemplo de janela de sessão.</figcaption></figure>

No exemplo acima, muitas mudanças de layout ocorrem ao longo do tempo, conforme o usuário visualiza a página. Cada um é representado por uma barra azul. Você notará acima que as barras azuis têm alturas diferentes; aqueles representam a [pontuação](/cls/#layout-shift-score) de cada mudança de layout individual. Uma janela de sessão começa com a primeira mudança de layout e continua a se expandir até que haja uma lacuna sem mudanças de layout. Quando ocorre a próxima mudança de layout, uma nova janela de sessão é iniciada. Como há três lacunas sem mudanças de layout, há três janelas de sessão no exemplo. Semelhante à definição atual de CLS, as pontuações de cada turno são somadas, de modo que a pontuação de cada janela é a soma de suas alterações de layout individuais.

Com base na [pesquisa inicial](/better-layout-shift-metric/#best-strategies), escolhemos um intervalo de 1 segundo entre as janelas de sessão e esse intervalo funcionou bem em nossa análise em grande escala. Portanto, o "intervalo de sessão" mostrado no exemplo acima é de 1 segundo.

### Por que a janela máxima de sessão?

Reduzimos as [estratégias de resumo](/better-layout-shift-metric/#summarization) a duas opções em nossa pesquisa inicial:

- A **pontuação média** de todas as janelas de sessão, para janelas de sessão muito grandes (janelas sem limite com intervalos de 5 segundos entre elas).
- A **pontuação máxima** de todas as janelas de sessão, para janelas de sessão menores (limitado a 5 segundos, com intervalos de 1 segundo entre elas).

Após a pesquisa inicial, adicionamos cada métrica ao Chrome para que pudéssemos fazer uma análise em grande escala em milhões de URLs. Na análise em grande escala, encontramos muitos URLs com padrões de mudança de layout como este:

{% Img src="image/MZfwZ8oVW8U6tzo5CXffcER0jR83/bW3lHZmss3cqGayZsq4P.png", alt="Exemplo de uma pequena mudança de layout diminuindo a média", width="800", height="550" %}

No canto inferior direito, você pode ver que há apenas uma pequena mudança de layout na janela de sessão 2, dando a ela uma pontuação muito baixa. Isso significa que a pontuação média é muito baixa. Mas, e se o desenvolvedor corrigir essa pequena mudança de layout? Em seguida, a pontuação é calculada apenas na janela de sessão 1, o que significa que a pontuação da página *quase duplica*. Seria muito confuso e desanimador para os desenvolvedores melhorar suas mudanças de layout para então descobrir que a pontuação piorou. E remover essa pequena mudança de layout é obviamente um pouco melhor para a experiência do usuário, logo, não deve piorar a pontuação.

Por causa desse problema com as médias, decidimos avançar com as janelas menores, limitadas e máximas. Portanto, no exemplo acima, a janela de sessão 2 seria ignorada e apenas a soma das mudanças de layout na janela de sessão 1 seria relatada.

### Por que 5 segundos?

Avaliamos vários tamanhos de janela e descobrimos duas coisas:

- Para janelas curtas, carregamentos de página mais lentos e respostas mais lentas às interações do usuário podem quebrar as mudanças de layout em várias janelas e melhorar a pontuação. Queríamos manter a janela grande o suficiente para não premiar a lentidão!
- Existem algumas páginas com um fluxo contínuo de pequenas mudanças de layout. Por exemplo, uma página com placares esportivos que muda um pouco a cada atualização de pontuação. Essas mudanças são irritantes, mas não ficam mais irritantes com o passar do tempo. Portanto, queríamos garantir que a janela fosse limitada para esses tipos de mudanças de layout.

Com essas duas coisas em mente, comparando uma variedade de tamanhos de janela em muitas páginas da web do mundo real, concluímos que 5 segundos seria um bom limite para o tamanho da janela.

## Como isso afetará a pontuação CLS da minha página?

Como essa atualização limita o CLS de uma página, **nenhuma página terá uma pontuação pior** como resultado dessa mudança.

Além disso, de acordo com nossa análise, **55% das origens não verão nenhuma mudança no CLS no 75º percentil**. Isso ocorre porque suas páginas não têm atualmente nenhuma mudança de layout ou as mudanças que eles têm já estão confinadas a uma única janela de sessão.

**O resto das origens verão melhores pontuações no 75º percentil com essa mudança.** A maioria verá apenas uma ligeira melhora, mas cerca de 3% verão suas pontuações melhorarem, passando de uma classificação de "precisa melhorar" ou "ruim" para uma classificação "boa". Essas páginas tendem a usar scrollers infinitos ou ter muitas atualizações lentas da interface do usuário, conforme descrito em nosso [post anterior](/better-layout-shift-metric/) .

## Como posso experimentar?

Estaremos atualizando nossas ferramentas para em breve usar a nova definição de métrica! Até então, você pode experimentar a versão atualizada do CLS em qualquer site usando as [implementações de JavaScript de exemplo](https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver) ou a [bifurcação da extensão Web Vitals](https://github.com/mmocny/web-vitals-extension/tree/experimental-ls).

Obrigado a todos que reservaram um tempo para ler a postagem anterior e deixar seus comentários!
