---
layout: post
title: Reduzir o tamanho do WebFont
authors:
  - ilyagrigorik
date: 2019-08-16
updated: 2020-07-03
description: Este post explica como reduzir o tamanho das WebFonts que você usa em seu site, para que uma boa tipografia não signifique um site lento.
tags:
  - performance
  - fonts
---

A tipografia é fundamental para um bom design, identidade visual, legibilidade e acessibilidade. WebFonts permite tudo isso acima e muito mais: o texto é selecionável, pesquisável, com zoom e compatível com alto DPI, fornecendo renderização de texto consistente e nítida, independentemente do tamanho da tela e da resolução. WebFonts são essenciais para um bom design, UX e desempenho.

A otimização WebFont é uma peça crítica da estratégia de desempenho geral. Cada fonte é um recurso adicional e algumas fontes podem bloquear a renderização do texto, mas só porque a página está usando WebFonts não significa que ela tenha que renderizar mais lentamente. Ao contrário, as fontes otimizadas, combinadas com uma estratégia criteriosa de como são carregadas e aplicadas na página, podem ajudar a reduzir o tamanho total da página e melhorar o tempo de renderização da página.

## Anatomia de uma WebFont

Uma *WebFont* é uma coleção de glifos e cada glifo é uma forma vetorial que descreve uma letra ou símbolo. Como resultado, duas variáveis simples determinam o tamanho de um arquivo de fonte específico: a complexidade dos caminhos vetoriais de cada glifo e o número de glifos em uma fonte específica. Por exemplo, Open Sans, que é uma das WebFonts mais populares, contém 897 glifos, que incluem caracteres latinos, gregos e cirílicos.

{% Img src="image/admin/B92rhiBJD9sx88a5CvVy.png", alt="Tabela de glifo de fonte", width="800", height="309" %}

Ao escolher uma fonte, é importante considerar quais conjuntos de caracteres são suportados. Se você precisar localizar o conteúdo da sua página para vários idiomas, deve usar uma fonte que possa fornecer uma aparência e uma experiência consistentes aos seus usuários. Por exemplo, [a família de fontes Noto do Google](https://www.google.com/get/noto/) visa oferecer suporte a todos os idiomas do mundo. Observe, no entanto, que o tamanho total do Noto, com todos os idiomas incluídos, resulta em um download de 1,1 GB+ ZIP.

Nesta postagem, você descobrirá como reduzir o tamanho do arquivo entregue de suas WebFonts.

### Formatos WebFont

Hoje, existem quatro formatos de contêiner de fonte em uso na web:

- [EOT](https://en.wikipedia.org/wiki/Embedded_OpenType)
- [TTF](https://en.wikipedia.org/wiki/TrueType)
- [WOFF](https://en.wikipedia.org/wiki/Web_Open_Font_Format)
- [WOFF2](https://www.w3.org/TR/WOFF2/) .

[WOFF](http://caniuse.com/#feat=woff) e [WOFF 2.0](http://caniuse.com/#feat=woff2) têm o mais amplo suporte, no entanto, para compatibilidade com navegadores mais antigos, você pode precisar incluir outros formatos:

- Veicula a variante WOFF 2.0 para navegadores que a suportam.
- Veicula a variante WOFF para a maioria dos navegadores.
- Veicule a variante TTF para navegadores Android antigos (abaixo de 4.4).
- Servir a variante EOT para navegadores IE antigos (abaixo do IE9).

{% Aside %} Tecnicamente, há outro formato de contêiner, o [contêiner de fonte SVG](http://caniuse.com/svg-fonts) , mas o IE e o Firefox nunca o suportaram e agora está obsoleto no Chrome. Como tal, é de uso limitado e foi omitido intencionalmente neste guia. {% endAside %}

### Reduza o tamanho da fonte com compressão

Uma fonte é uma coleção de glifos, cada um dos quais sendo um conjunto de caminhos que descrevem a forma da letra. Os glifos individuais são diferentes, mas contêm muitas informações semelhantes que podem ser compactadas com GZIP ou um compressor compatível:

- Os formatos EOT e TTF não são compactados por padrão. Certifique-se de que seus servidores estejam configurados para aplicar [compactação GZIP](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer#text-compression-with-gzip) ao entregar esses formatos.
- WOFF tem compressão embutida. Certifique-se de que seu compressor WOFF está usando as configurações de compressão ideais.
- O WOFF2 usa algoritmos de pré-processamento e compressão personalizados para oferecer uma redução de tamanho de arquivo de aproximadamente 30% em relação a outros formatos. Para obter mais informações, consulte [o relatório de avaliação do WOFF 2.0](http://www.w3.org/TR/WOFF20ER/) .

Finalmente, é importante notar que alguns formatos de fonte contêm metadados adicionais, como [dicas de fonte](https://en.wikipedia.org/wiki/Font_hinting) e [informações de kerning](https://en.wikipedia.org/wiki/Kerning) que podem não ser necessários em algumas plataformas, o que permite uma otimização adicional do tamanho do arquivo. Consulte o seu compressor de fontes para obter as opções de otimização disponíveis e, se você seguir esse caminho, certifique-se de ter a infraestrutura apropriada para testar e entregar essas fontes otimizadas para cada navegador. Por exemplo, o [Google Fonts](https://fonts.google.com/) mantém mais de 30 variantes otimizadas para cada fonte e detecta e fornece automaticamente a variante ideal para cada plataforma e navegador.

{% Aside %} Considere o uso da [compactação Zopfli](http://en.wikipedia.org/wiki/Zopfli) para os formatos EOT, TTF e WOFF. Zopfli é um compressor compatível com zlib que oferece redução de tamanho de arquivo de aproximadamente 5% em relação ao gzip. {% endAside %}

## Defina uma família de fontes com @font-face

A `@font-face` permite definir a localização de um recurso de fonte específico, suas características de estilo e os pontos de código Unicode para os quais deve ser usado. Uma combinação dessas `@font-face` pode ser usada para construir uma "família de fontes", que o navegador usará para avaliar quais recursos de fontes precisam ser baixados e aplicados à página atual.

### Considere uma fonte variável

Fontes variáveis podem reduzir significativamente o tamanho do arquivo de suas fontes nos casos em que você precisa de várias variantes de uma fonte. Em vez de precisar carregar os estilos regular e em negrito mais suas versões em itálico, você pode carregar um único arquivo que contém todas as informações.

Fontes variáveis agora são suportadas por todos os navegadores modernos, descubra mais na [Introdução às fontes variáveis na web](/variable-fonts/) .

### Selecione o formato certo

Cada `@font-face` fornece o nome da família da fonte, que atua como um grupo lógico de várias declarações, [propriedades da fonte](http://www.w3.org/TR/css3-fonts/#font-prop-desc) , como estilo, peso e extensão, e o [descritor src](http://www.w3.org/TR/css3-fonts/#src-desc) , que especifica uma lista priorizada de locais para a fonte recurso.

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome.woff2') format('woff2'),
        url('/fonts/awesome.woff') format('woff'),
        url('/fonts/awesome.ttf') format('truetype'),
        url('/fonts/awesome.eot') format('embedded-opentype');
}

@font-face {
  font-family: 'Awesome Font';
  font-style: italic;
  font-weight: 400;
  src: local('Awesome Font Italic'),
        url('/fonts/awesome-i.woff2') format('woff2'),
        url('/fonts/awesome-i.woff') format('woff'),
        url('/fonts/awesome-i.ttf') format('truetype'),
        url('/fonts/awesome-i.eot') format('embedded-opentype');
}
```

Primeiro, observe que os exemplos acima definem uma única *família Awesome Font* com dois estilos (normal e *itálico* ), cada um apontando para um conjunto diferente de recursos de fonte. Por sua vez, cada `src` contém uma lista priorizada e separada por vírgulas de variantes de recursos:

- A `local()` permite que você faça referência, carregue e use fontes instaladas localmente.
- A `url()` permite que você carregue fontes externas e pode conter uma `format()` indicando o formato da fonte referenciada pelo URL fornecido.

{% Aside %} A menos que você esteja fazendo referência a uma das fontes padrão do sistema, é raro o usuário tê-la instalada localmente, especialmente em dispositivos móveis, onde é efetivamente impossível "instalar" fontes adicionais. Você deve sempre começar com uma `local()` "por precaução" e, em seguida, fornecer uma lista de entradas `url()` {% endAside %}

Quando o navegador determina que a fonte é necessária, ele itera através da lista de recursos fornecida na ordem especificada e tenta carregar o recurso apropriado. Por exemplo, seguindo o exemplo acima:

1. O navegador executa o layout da página e determina quais variantes de fonte são necessárias para processar o texto especificado na página.
2. Para cada fonte necessária, o navegador verifica se a fonte está disponível localmente.
3. Se a fonte não estiver disponível localmente, o navegador itera sobre as definições externas:
    - Se uma dica de formato estiver presente, o navegador verifica se ele suporta a dica antes de iniciar o download. Se o navegador não suportar a dica, o navegador avança para a próxima.
    - Se nenhuma dica de formato estiver presente, o navegador fará o download do recurso.

A combinação de diretivas locais e externas com dicas de formato apropriadas permite que você especifique todos os formatos de fonte disponíveis e deixe o navegador cuidar do resto. O navegador determina quais recursos são necessários e seleciona o formato ideal.

{% Aside %} A ordem em que as variantes de fonte são especificadas é importante. O navegador escolhe o primeiro formato compatível. Portanto, se você deseja que os navegadores mais novos usem WOFF 2.0, você deve colocar a declaração WOFF 2.0 acima de WOFF. {% endAside %}

### Subconjunto de intervalo Unicode

Além das propriedades da fonte, como estilo, peso e extensão, a `@font-face` permite definir um conjunto de pontos de código Unicode com suporte para cada recurso. Isso permite que você divida uma fonte Unicode grande em subconjuntos menores (por exemplo, subconjuntos latinos, cirílicos e gregos) e baixe apenas os glifos necessários para renderizar o texto em uma página específica.

O [descritor de intervalo Unicode](http://www.w3.org/TR/css3-fonts/#descdef-unicode-range) permite que você especifique uma lista delimitada por vírgulas de intervalo de valores, cada um dos quais podendo estar em uma de três formas diferentes:

- Ponto de código único (por exemplo, `U+416` )
- Intervalo de intervalo (por exemplo, `U+400-4ff` ): indica os pontos de código inicial e final de um intervalo
- Intervalo de curingas (por exemplo, `U+4??` ) `?` caracteres indicam qualquer dígito hexadecimal

Por exemplo, você pode dividir sua *família Awesome Font* em subconjuntos latinos e japoneses, cada um dos quais o navegador baixa conforme necessário:

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-l.woff2') format('woff2'),
        url('/fonts/awesome-l.woff') format('woff'),
        url('/fonts/awesome-l.ttf') format('truetype'),
        url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* glifos latinos */
}

@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-jp.woff2') format('woff2'),
        url('/fonts/awesome-jp.woff') format('woff'),
        url('/fonts/awesome-jp.ttf') format('truetype'),
        url('/fonts/awesome-jp.eot') format('embedded-opentype');
  unicode-range: U+3000-9FFF, U+ff??; /* glifos japoneses */
}
```

{% Aside %} O subconjunto do intervalo Unicode é particularmente importante para os idiomas asiáticos, onde o número de glifos é muito maior do que nos idiomas ocidentais e uma fonte "completa" típica geralmente é medida em megabytes em vez de dezenas de kilobytes. {% endAside %}

O uso de subconjuntos de faixas Unicode e arquivos separados para cada variante estilística da fonte permite definir uma família de fontes composta que é mais rápida e eficiente para fazer download. Os visitantes apenas baixam as variantes e subconjuntos de que precisam e não são forçados a baixar subconjuntos que talvez nunca vejam ou usem na página.

A maioria dos navegadores [agora oferece suporte a intervalo Unicode](http://caniuse.com/#feat=font-unicode-range) . Para compatibilidade com navegadores mais antigos, você pode precisar voltar para "subconjunto manual". Nesse caso, você deve voltar a fornecer um único recurso de fonte que contenha todos os subconjuntos necessários e ocultar o restante do navegador. Por exemplo, se a página estiver usando apenas caracteres latinos, você pode remover outros glifos e servir esse subconjunto específico como um recurso autônomo.

1. **Determine quais subconjuntos são necessários:**
    - Se o navegador suportar subconjunto de intervalo de Unicode, ele selecionará automaticamente o subconjunto correto. A página só precisa fornecer os arquivos de subconjunto e especificar os intervalos de unicode apropriados nas regras `@font-face`
    - Se o navegador não suportar subconjuntos de intervalo de Unicode, a página precisará ocultar todos os subconjuntos desnecessários; ou seja, o desenvolvedor deve especificar os subconjuntos necessários.
2. **Gerar subconjuntos de fontes:**
    - Use a [ferramenta pyftsubset de](https://github.com/behdad/fonttools/) código aberto para criar um subconjunto e otimizar suas fontes.
    - Alguns serviços de fonte permitem subconjunto manual por meio de parâmetros de consulta personalizados, que você pode usar para especificar manualmente o subconjunto necessário para sua página. Consulte a documentação do seu provedor de fontes.

### Seleção e síntese de fontes

Cada família de fontes é composta de múltiplas variantes estilísticas (regular, negrito, itálico) e vários pesos para cada estilo, cada um dos quais, por sua vez, pode conter formas de glifo muito diferentes - por exemplo, espaçamento, tamanho ou uma forma completamente diferente.

{% Img src="image/admin/FNtAc2xRmx2MuUt2MADj.png", alt="Pesos da Fonte", width="697", height="127" %}

Por exemplo, o diagrama acima ilustra uma família de fontes que oferece três pesos de negrito diferentes: 400 (normal), 700 (negrito) e 900 (negrito extra). Todas as outras variantes intermediárias (indicadas em cinza) são mapeadas automaticamente para a variante mais próxima pelo navegador.

<blockquote>
  <p>Quando um peso é especificado para o qual não existe face, uma face com um peso próximo é usado. Em geral, os pesos em negrito são mapeados para faces com pesos mais pesados e os pesos leves são mapeados para faces com pesos mais leves.</p>
<cite><p data-md-type="paragraph"><a href="http://www.w3.org/TR/css3-fonts/#font-matching-algorithm">Algoritmo de correspondência de fonte CSS</a></p></cite>
</blockquote>

Lógica semelhante se aplica a variantes em *itálico.* O designer de fonte controla quais variantes eles produzirão e você controla quais variantes usará na página. Como cada variante é um download separado, é uma boa ideia manter o número de variantes pequeno. Por exemplo, você pode definir duas variantes em negrito para a família *Awesome Font:*

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-l.woff2') format('woff2'),
        url('/fonts/awesome-l.woff') format('woff'),
        url('/fonts/awesome-l.ttf') format('truetype'),
        url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Glifos latinos */
}

@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 700;
  src: local('Awesome Font'),
        url('/fonts/awesome-l-700.woff2') format('woff2'),
        url('/fonts/awesome-l-700.woff') format('woff'),
        url('/fonts/awesome-l-700.ttf') format('truetype'),
        url('/fonts/awesome-l-700.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Glifos latinos */
}
```

O exemplo acima declara a *família Awesome Font* que é composta por dois recursos que cobrem o mesmo conjunto de glifos latinos ( `U+000-5FF` ), mas oferecem dois "pesos" diferentes: normal (400) e negrito (700). No entanto, o que acontece se uma de suas regras CSS especificar uma espessura de fonte diferente ou definir a propriedade de estilo de fonte como itálico?

- Se uma correspondência de fonte exata não estiver disponível, o navegador substitui a correspondência mais próxima.
- Se nenhuma correspondência estilística for encontrada (por exemplo, nenhuma variante em itálico foi declarada no exemplo acima), o navegador sintetiza sua própria variante de fonte.

{% Img src="image/admin/a8Jo2cIO1tPsj71AzftS.png", alt="Síntese de fontes", width="800", height="356" %}

{% Aside 'warning' %} Esteja ciente de que as abordagens sintetizadas podem não ser adequadas para scripts como o cirílico, onde as formas em itálico são muito diferentes. Para fidelidade adequada nesses scripts, use uma fonte real em itálico. {% endAside %}

O exemplo acima ilustra a diferença entre os resultados de fontes reais e sintetizadas para Open Sans. Todas as variantes sintetizadas são geradas a partir de uma única fonte de peso 400. Como você pode ver, há uma diferença notável nos resultados. Os detalhes de como gerar as variantes em negrito e oblíquas não são especificados. Portanto, os resultados variam de navegador para navegador e são altamente dependentes da fonte.

{% Aside %} Para obter melhor consistência e resultados visuais, não confie na síntese de fontes. Em vez disso, minimize o número de variantes de fonte usadas e especifique seus locais, de forma que o navegador possa baixá-las quando forem usadas na página. Ou opte por usar uma fonte variável. Dito isso, em alguns casos, uma variante sintetizada [pode ser uma opção viável](https://www.igvita.com/2014/09/16/optimizing-webfont-selection-and-synthesis/), mas seja cauteloso ao usar variantes sintetizadas. {% endAside %}

## Lista de verificação de otimização de tamanho WebFont

- **Audite e monitore o uso de fontes:** não use muitas fontes em suas páginas e, para cada fonte, minimize o número de variantes usadas. Isso ajuda a produzir uma experiência mais consistente e rápida para seus usuários.
- **Subconjunto de seus recursos de fonte:** muitas fontes podem ser subdivididas em vários intervalos de Unicode para fornecer apenas os glifos que uma página específica requer. Isso reduz o tamanho do arquivo e melhora a velocidade de download do recurso. No entanto, ao definir os subconjuntos, tome cuidado para otimizar a reutilização de fontes. Por exemplo, não baixe um conjunto diferente, mas sobreposto de caracteres em cada página. Uma boa prática é criar subconjuntos com base no script: por exemplo, latim e cirílico.
- **Forneça formatos de fonte otimizados para cada navegador:** forneça cada fonte nos formatos WOFF 2.0, WOFF, EOT e TTF. Certifique-se de aplicar a compactação GZIP aos formatos EOT e TTF, porque eles não são compactados por padrão.
- **Dê preferência a `local()` em sua lista `src`** : listar `local('Font Name')` primeiro em sua `src` garante que solicitações HTTP não sejam feitas para fontes já instaladas.
- **Use o [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)** para testar a [compactação de texto](https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/) .
