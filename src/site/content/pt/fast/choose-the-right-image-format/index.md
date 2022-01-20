---
layout: post
title: Escolha o formato de imagem certo
authors:
  - ilyagrigorik
description: |2

  Selecionar o formato de imagem correto é o primeiro passo para fornecer imagens otimizadas em seu site. Esta postagem ajuda você a fazer a escolha certa.
date: 2018-08-30
updated: 2020-06-18
tags:
  - performance
  - images
---

A primeira pergunta que você deve fazer é se uma imagem é, de fato, necessária para alcançar o efeito que você deseja. Um bom design é simples e sempre produzirá o melhor desempenho. Se você puder eliminar um recurso de imagem, que geralmente requer um grande número de bytes em relação a HTML, CSS, JavaScript e outros ativos na página, essa é sempre a melhor estratégia de otimização. Dito isso, uma imagem bem posicionada também pode comunicar mais informações do que mil palavras, portanto, cabe a você encontrar esse equilíbrio.

Em seguida, você deve considerar se existe uma tecnologia alternativa que possa fornecer os resultados desejados, mas de uma maneira mais eficiente:

- **Efeitos CSS** (como sombras ou gradientes) e animações CSS podem ser usados para produzir ativos independentes de resolução que sempre parecem nítidos em cada resolução e nível de zoom, geralmente em uma fração dos bytes exigidos por um arquivo de imagem.
- **Fontes da Web** permitem o uso de belos tipos de fontes, preservando a capacidade de selecionar, pesquisar e redimensionar o texto - uma melhoria significativa na usabilidade.

Se você alguma vez codificar texto em um recurso de imagem, pare e reconsidere. Uma boa tipografia é crítica para um bom design, branding e legibilidade, mas o texto em imagens oferece uma experiência do usuário ruim: o texto não é selecionável, não pesquisável, não pode ser ampliado, não acessível e não é amigável para dispositivos de alto DPI. O uso de fontes da web requer seu [próprio conjunto de otimizações](https://www.igvita.com/2014/01/31/optimizing-web-font-rendering-performance/), mas atende a todas essas questões e é sempre a melhor opção para exibir texto.

## Escolha o formato de imagem certo

Se você tiver certeza de que uma imagem é a opção correta, você deve selecionar cuidadosamente o tipo certo de imagem para o trabalho.

<figure>{% Img src="image/admin/dJuB2DQcbhtwD5VdPVlR.png", alt="Imagens vetoriais e raster ampliadas", width="585", height="313" %} <figcaption>Imagem vetorial ampliada (L) imagem raster (R)</figcaption></figure>

- [Gráficos vetoriais](https://en.wikipedia.org/wiki/Vector_graphics) usam linhas, pontos e polígonos para representar uma imagem.
- [Gráficos raster](https://en.wikipedia.org/wiki/Raster_graphics) representam uma imagem codificando os valores individuais de cada pixel em uma grade retangular.

Cada formato tem seu próprio conjunto de prós e contras. Os formatos vetoriais são ideais para imagens que consistem em formas geométricas simples, como logotipos, texto ou ícones. Eles fornecem resultados nítidos em todas as configurações de resolução e zoom, o que os torna o formato ideal para telas e recursos de alta resolução que precisam ser exibidos em tamanhos variados.

No entanto, os formatos de vetor ficam aquém quando a cena é complicada (por exemplo, uma foto): a quantidade de marcação SVG para descrever todas as formas pode ser proibitivamente alta e a saída pode ainda não parecer "fotorrealística". Quando for esse o caso, é quando você deve usar um formato de imagem raster como PNG, JPEG ou WebP.

As imagens raster não têm as mesmas propriedades de serem independentes de resolução ou zoom - ao aumentar a escala de uma imagem raster, você verá gráficos irregulares e borrados. Como resultado, pode ser necessário salvar várias versões de uma imagem rasterizada em várias resoluções para fornecer a experiência ideal aos usuários.

## Implicações de telas de alta resolução

Existem dois tipos diferentes de pixels: pixels CSS e pixels de dispositivo. Um único pixel CSS pode corresponder diretamente a um único pixel de dispositivo ou pode ser apoiado por vários pixels de dispositivo. Qual é o ponto? Bem, quanto mais pixels de dispositivo houver, mais precisos serão os detalhes do conteúdo exibido na tela.

<figure>{% Img src="image/admin/oQV7qJ9fUMkYsKlUMrL4.png", alt="Três imagens mostrando a diferença entre pixels CSS e pixels do dispositivo.", width="470", height="205" %} <figcaption>A diferença entre pixels CSS e pixels do dispositivo.</figcaption></figure>

Telas de alto DPI (HiDPI) produzem resultados bonitos, mas há uma desvantagem óbvia: os ativos de imagem requerem mais detalhes para aproveitar as vantagens das contagens de pixels mais altas do dispositivo. A boa notícia é que as imagens vetoriais são ideais para essa tarefa, pois podem ser renderizadas em qualquer resolução com resultados nítidos - você pode incorrer em um custo de processamento mais alto para renderizar os detalhes mais finos, mas o ativo subjacente é o mesmo e não depende da resolução.

Por outro lado, as imagens raster representam um desafio muito maior porque codificam os dados da imagem por pixel. Portanto, quanto maior o número de pixels, maior será o tamanho do arquivo de uma imagem raster. Como exemplo, vamos considerar a diferença entre um recurso de foto exibido em pixels de 100 x 100 (CSS):

<div class="table-wrapper scrollbar"><table>
<thead>
  <tr>
    <th>Resolução da tela</th>
    <th>Pixels totais</th>
    <th>Tamanho do arquivo não compactado (4 bytes por pixel)</th>
  </tr>
</thead>
<tbody>
<tr>
  <td data-th="resolution">1x</td>
  <td data-th="total pixels">100 x 100 = 10.000</td>
  <td data-th="filesize">40.000 bytes</td>
</tr>
<tr>
  <td data-th="resolution">2x</td>
  <td data-th="total pixels">100 x 100 x 4 = 40.000</td>
  <td data-th="filesize">160.000 bytes</td>
</tr>
<tr>
  <td data-th="resolution">3x</td>
  <td data-th="total pixels">100 x 100 x 9 = 90.000</td>
  <td data-th="filesize">360.000 bytes</td>
</tr>
</tbody>
</table></div>

Quando duplicamos a resolução da tela física, o número total de pixels aumenta por um fator de quatro: o dobro do número de pixels horizontais, vezes o dobro do número de pixels verticais. Conseqüentemente, uma tela "2x" não apenas dobra, mas quadruplica o número de pixels necessários!

Então, o que isso significa na prática? Telas de alta resolução permitem que você exiba belas imagens, o que pode ser um ótimo recurso do produto. No entanto, telas de alta resolução também requerem imagens de alta resolução, portanto:

- Prefira imagens vetoriais sempre que possível, pois elas são independentes da resolução e sempre fornecem resultados nítidos.
- Se uma imagem raster for necessária, exiba [imagens responsivas](/serve-responsive-images/).

## Recursos de diferentes formatos de imagem raster

Além de diferentes algoritmos de compactação com e sem perdas, diferentes formatos de imagem oferecem suporte a diferentes recursos, como canais de animação e transparência (alfa). Como resultado, a escolha do "formato certo" para uma determinada imagem é uma combinação dos resultados visuais desejados e dos requisitos funcionais.

<div class="table-wrapper scrollbar"><table>
<thead>
  <tr>
    <th>Formato</th>
    <th>Transparência</th>
    <th>Animação</th>
    <th>Navegador</th>
  </tr>
</thead>
<tbody>
<tr>
  <td data-th="format"><a href="http://en.wikipedia.org/wiki/Portable_Network_Graphics">PNG</a></td>
  <td data-th="transparency">sim</td>
  <td data-th="animation">Não</td>
  <td data-th="browser">Tudo</td>
</tr>
<tr>
  <td data-th="format"><a href="http://en.wikipedia.org/wiki/JPEG">JPEG</a></td>
  <td data-th="transparency">Não</td>
  <td data-th="animation">Não</td>
  <td data-th="browser">Tudo</td>
</tr>
<tr>
  <td data-th="format"><a href="http://en.wikipedia.org/wiki/WebP">WebP</a></td>
  <td data-th="transparency">sim</td>
  <td data-th="animation">sim</td>
  <td data-th="browser">Todos os navegadores modernos. Veja <a href="https://caniuse.com/#feat=webp">Posso usar?</a>
</td>
</tr>
</tbody>
</table></div>

Existem dois formatos de imagem raster com suporte universal: PNG e JPEG. Além desses formatos, os navegadores modernos suportam o formato mais recente WebP, que oferece melhor compactação geral e mais recursos. Então, qual formato você deve usar?

O formato WebP geralmente fornece melhor compactação do que os formatos mais antigos e deve ser usado sempre que possível. Você pode usar o WebP junto com outro formato de imagem como um substituto. Consulte [Usar imagens WebP](/serve-images-webp/) para obter mais detalhes.

Em termos de formatos de imagem mais antigos, considere o seguinte:

1. **Você precisa de animação? Use elementos `<video>`**
    - E quanto ao GIF? O GIF limita a paleta de cores a no máximo 256 cores e cria tamanhos de arquivo significativamente maiores do que os elementos `<video>` Consulte [Substituir GIFs animados por vídeo](/replace-gifs-with-videos/).
2. **Você precisa preservar os detalhes finos com a resolução mais alta? Use PNG.**
    - PNG não aplica nenhum algoritmo de compressão com perdas além da escolha do tamanho da paleta de cores. Como resultado, ele produzirá imagem da mais alta qualidade, mas a um custo de tamanho de arquivo significativamente maior do que outros formatos. Use criteriosamente.
    - Se o ativo de imagem contiver imagens compostas de formas geométricas, considere convertê-lo em um formato vetorial (SVG)!
    - Se o ativo de imagem contiver texto, pare e reconsidere. O texto nas imagens não pode ser selecionado, pesquisado ou "ampliado". Se você precisar transmitir uma aparência personalizada (por motivos de marca ou outros), use uma fonte da web.
3. **Você está otimizando uma foto, captura de tela ou recurso de imagem semelhante? Use JPEG.**
    - JPEG usa uma combinação de otimização com e sem perdas para reduzir o tamanho do arquivo do ativo de imagem. Experimente vários níveis de qualidade JPEG para encontrar a melhor relação entre qualidade e tamanho de arquivo para o seu ativo.

Por fim, observe que se você estiver usando um WebView para renderizar conteúdo em seu aplicativo específico da plataforma, terá controle total do cliente e poderá usar o WebP exclusivamente! O Facebook e muitos outros usam o WebP para fornecer todas as suas imagens em seus aplicativos - a economia definitivamente vale a pena.
