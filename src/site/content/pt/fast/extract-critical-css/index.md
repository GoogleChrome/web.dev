---
layout: post
title: Extraia CSS crítico
subhead: Aprenda como melhorar os tempos de renderização com técnicas críticas de CSS.
authors:
  - mihajlija
date: 2019-05-29
hero: image/admin/ZC6iWHhgnrSZtPJMfwMh.jpg
alt: Uma foto plana de chaves e chaves de fendas.
description: |2

  Aprenda como melhorar os tempos de renderização com técnicas críticas de CSS e como escolher a melhor ferramenta para seu projeto.
codelabs: codelab-extract-and-inline-critical-css
tags:
  - blog
  - performance
  - css
---

O navegador deve baixar e analisar os arquivos CSS antes de mostrar a página, o que torna o CSS um recurso de bloqueio de renderização. Se os arquivos CSS forem grandes ou as condições da rede forem ruins, as solicitações de arquivos CSS podem aumentar significativamente o tempo de renderização de uma página da web.

{% Aside 'key-term' %} CSS crítico é uma técnica que extrai o CSS para conteúdo acima da dobra, a fim de renderizar o conteúdo para o usuário o mais rápido possível. {% endAside %}

<figure>{% Img src="image/admin/t3Kkvh265zi6naTBga41.png", alt="Uma ilustração de um laptop e um dispositivo móvel com páginas da web ultrapassando as bordas das telas", width="800", height="469", class="" %}</figure>

{% Aside 'note' %} Acima da dobra está todo o conteúdo que um visualizador vê no carregamento da página antes de rolar. Não existe uma altura de pixel definida universalmente do que é considerado conteúdo acima da dobra, pois há uma infinidade de dispositivos e tamanhos de tela. {% endAside %}

Colocar inline estilos extraídos no `<head>` do documento HTML elimina a necessidade de fazer uma solicitação adicional para buscar esses estilos. O restante do CSS pode ser carregado de forma assíncrona.

<figure>{% Img src="image/admin/RVU3OphqtjlkrlAtKLEn.png", alt="arquivo HTML com CSS crítico inline (embutido) no cabeçalho", width="800", height="325" %} <figcaption> CSS crítico inline </figcaption></figure>

Melhorar os tempos de renderização pode fazer uma grande diferença no [desempenho percebido](/rail/#focus-on-the-user) , especialmente em caso más condições de rede. Em redes móveis, a alta latência é um problema, independentemente da largura de banda.

<figure>{% Img src="image/admin/NdQz49RVgdHoh3Fff0yr.png", alt="Comparação da visualização da película de filme do carregamento de uma página com CSS de bloqueio de renderização (parte superior) e a mesma página com CSS crítico inline (parte inferior) em uma conexão 3G. tira de filme mostra seis quadros em branco antes de finalmente exibir o conteúdo. Tira de filme inferior exibe conteúdo significativo no primeiro quadro.", width="800", height="363" %} <figcaption> Comparação do carregamento de uma página com CSS de bloqueio de renderização (parte superior) e a mesma página com CSS crítico inline (parte inferior) em uma conexão 3G </figcaption></figure>

Se você tem um [First Contentful Paint (FCP)](/fcp/) ruim e vê a oportunidade "Eliminar recurso de bloqueio de renderização" nas auditorias do Lighthouse, é uma boa ideia dar uma chance ao CSS crítico.

{% Img src="image/admin/0xea7menL90lWHwbjZoP.png", alt="Auditoria do Lighthouse com 'Eliminar recurso de bloqueio de renderização' ou oportunidades de 'Adiar CSS não utilizado'", width="743", height="449" %}

{% Aside 'gotchas' %} Lembre-se de que se você colocar uma grande quantidade de CSS inline, isso atrasará a transmissão do restante do documento HTML. Se tudo for priorizado, nada será. Colocar como inline também tem algumas desvantagens, pois evita que o navegador armazene o CSS em cache para reutilização em carregamentos de página subsequentes, portanto, é melhor usá-lo com moderação. {% endAside %}

<p id="14KB">Para minimizar o número de idas e voltas para a primeira renderização, tente manter o conteúdo acima da dobra abaixo de <strong>14 KB</strong> (compactado).</p>

{% Aside 'note' %} Novas conexões [TCP](https://hpbn.co/building-blocks-of-tcp/) não podem usar imediatamente toda a largura de banda disponível entre o cliente e o servidor, todas elas passam por [uma inicialização lenta](https://hpbn.co/building-blocks-of-tcp/#slow-start) para evitar sobrecarregar a conexão com mais dados do que ela pode transportar. Nesse processo, o servidor inicia a transferência com uma pequena quantidade de dados e se chegar ao cliente em perfeitas condições, dobra a quantidade na próxima ida e volta. Para a maioria dos servidores, 10 pacotes ou aproximadamente 14 KB é o máximo que pode ser transferido na primeira viagem de ida e volta. {% endAside %}

O impacto no desempenho que você pode obter com essa técnica depende do tipo de seu site. De modo geral, quanto mais CSS um site tiver, maior será o impacto possível do CSS inline.

## Visão geral das ferramentas

Existem várias ferramentas excelentes que podem determinar automaticamente o CSS essencial para uma página. Esta é uma boa notícia porque fazer isso manualmente seria um processo tedioso. Requer análise de todo o DOM para determinar os estilos que são aplicados a cada elemento na janela de visualização.

### Critical

O [Critical](https://github.com/addyosmani/critical) extrai, minimiza e alinha CSS acima da dobra e está disponível como [módulo npm](https://www.npmjs.com/package/critical) . Ele pode ser usado com Gulp (diretamente) ou com Grunt (como um [plugin](https://github.com/bezoerb/grunt-critical) ) e há também um [plugin webpack](https://github.com/anthonygore/html-critical-webpack-plugin).

É uma ferramenta simples que exige muito raciocínio durante o processo. Você nem mesmo precisa especificar as folhas de estilo, o Critical as detecta automaticamente. Ele também suporta a extração de CSS crítico para várias resoluções de tela.

### criticalCSS

O [CriticalCSS](https://github.com/filamentgroup/criticalCSS) é outro [módulo npm](https://www.npmjs.com/package/criticalcss) que extrai CSS acima da dobra. Também está disponível como CLI.

Ele não tem opções para embutir e minimizar CSS crítico, mas permite que você force a inclusão de regras que não pertencem realmente ao CSS crítico e dá a você um controle mais granular sobre a inclusão de declarações `@font-face`

### Penthouse

[Penthouse](https://github.com/pocketjoso/penthouse) é uma boa escolha se seu site ou aplicativo tem um grande número de estilos ou estilos que estão sendo injetados dinamicamente no DOM (comum em aplicativos Angular). Ele usa o [Puppeteer](https://github.com/GoogleChrome/puppeteer) nos bastidores e ainda apresenta também uma [versão hospedada online](https://jonassebastianohlsson.com/criticalpathcssgenerator/).

O Penthouse não detecta folhas de estilo automaticamente. Você precisa especificar os arquivos HTML e CSS para os quais deseja gerar CSS crítico. A vantagem é que ele é bom para executar muitos jobs em paralelo.
