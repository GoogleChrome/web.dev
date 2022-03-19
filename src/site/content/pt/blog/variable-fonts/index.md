---
layout: post
title: Introdução às fontes variáveis na web
subhead: Uma nova especificação de fontes que pode reduzir significativamente o tamanho dos arquivos de fontes
description: |-
  Como funcionam as fontes variáveis, como os tipógrafos implementam fontes variáveis e
  como trabalhar com fontes variáveis em CSS.
authors:
  - mustafakurtuldu
  - thomassteiner
  - dcrossland
  - roeln
date: 2018-02-19
updated: 2020-08-17
hero: image/admin/SHy7jOlEVPU1lsyfgvlG.jpg
tags:
  - blog
  - fonts
  - performance
  - ux
feedback:
  - api
---

Neste artigo, veremos o que são fontes variáveis, os benefícios que oferecem e como podemos usá-las em nosso trabalho. Primeiro, vamos revisar como a tipografia funciona na web e quais inovações as fontes variáveis trazem.

## Compatibilidade dos navegadores

Em maio de 2020, as fontes variáveis eram suportadas na maioria dos navegadores. Veja [Posso usar fontes variáveis?](https://caniuse.com/#feat=variable-fonts) e [Fallbacks](#fallbacks).

## Introdução

Os termos fonte e tipo são frequentemente usados de forma intercambiável pelos desenvolvedores. No entanto, há uma diferença: um tipo é o design visual subjacente que pode existir em diferentes tecnologias de tipografia, e uma fonte é uma dessas implementações, no formato de um arquivo digital. Em outras palavras, um tipo é o que você *vê* e a fonte é o que você *usa*.

Outro conceito que muitas vezes é deixado em segundo plano é a distinção entre um estilo e uma família. Um estilo é um tipo único e específico, como Bold Italic, e uma família é o conjunto completo de estilos.

Antes das fontes variáveis, cada estilo era implementado como um arquivo de fonte separado. Com fontes variáveis, todos os estilos podem estar contidos num único arquivo.

<figure>{% Img src="image/admin/RbhgXwS81Y9PVRJnTjPX.png", alt="Uma composição e lista de estilos diferentes da família Roboto", width="800", height="600" %}   <figcaption>     À esquerda: uma amostra da família de tipos Roboto. À direita: estilos nomeados dentro da família.   </figcaption></figure>

## Desafios para designers e desenvolvedores

Quando um designer cria um projeto de impressão, ele enfrenta algumas restrições, como o tamanho físico do layout da página, o número de cores que pode usar (que é determinado pelo tipo de impressora que será usada) e assim por diante. Mas eles podem usar quantos estilos de tipos quiserem. Isto significa que a tipografia da mídia impressa costuma ser rica e sofisticada, de modo que a experiência de leitura é verdadeiramente agradável. Pense na última vez em que você gostou de folhear uma excelente revista.

Os web designers e desenvolvedores têm restrições diferentes das dos designers de impressão, e uma que é importante são os custos de largura de banda associados aos nossos designs. Este tem sido um obstáculo para experiências tipográficas mais ricas, pois elas têm um custo. Com as fontes tradicionais da web, cada estilo usado em nossos designs exige que os usuários baixem um arquivo de fonte separado, o que aumenta a latência e o tempo de renderização da página. Incluir apenas os estilos Regular e Negrito, além de suas contrapartes em itálico, pode implicar em 500 KB ou mais de dados de fonte. Isto antes mesmo de levarmos em conta a maneira como as fontes serão renderizadas, os padrões de fallback que terão que ser usados ou efeitos colaterais indesejáveis, como [FOIT e FOUT](https://www.zachleat.com/web/fout-vs-foit/).

Muitas famílias de fontes oferecem uma gama muito mais ampla de estilos, de espessuras finas a grossas, larguras estreitas e largas, uma variedade de detalhes estilísticos e até designs de tamanhos específicos (otimizados para tamanhos de texto grandes ou pequenos). Como você teria que carregar um novo arquivo de fonte para cada estilo (ou combinações de estilos), muitos desenvolvedores web optam por não usar esses recursos, reduzindo a experiência de leitura de seus usuários.

## Anatomia de uma fonte variável

As fontes variáveis lidam com esses desafios, agrupando vários estilos num único arquivo.

Isto funciona partindo de um estilo central ou 'default', geralmente o 'Regular' - um design romano vertical com peso e largura mais típicos que é mais adequado para texto comum. Em seguida, isto é conectado a outros estilos num intervalo contínuo, chamado de 'eixo'. O eixo mais comum é o **Peso** (Weight), que pode conectar o estilo default a um estilo Negrito (Bold). Qualquer estilo individual pode ser localizado ao longo de um eixo e é chamado de 'instância' da fonte variável. Algumas instâncias são nomeadas pelo desenvolvedor da fonte, por exemplo, a localização do eixo de Peso 600 é chamada de SemiBold.

A fonte variável [Roboto Flex](https://github.com/TypeNetwork/Roboto-Flex) possui três estilos para seu eixo **Peso**. O estilo Regular está no centro e existem dois estilos nas extremidades opostas do eixo, um mais leve e outro mais pesado. Entre eles, você pode escolher dentre 900 instâncias:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ecr5godvTKunVXP7W8aU.png", alt="A letra 'A' mostrada em pesos diferentes", width="800", height="218" %}   <figcaption>    Acima: Anatomia ilustrada do eixo Weight (Peso) para a fonte Roboto.   </figcaption></figure>

O desenvolvedor da fonte pode oferecer um conjunto de eixos diferentes. Você pode combiná-los porque todos compartilham os mesmos estilos padrão. Roboto tem três estilos no eixo Largura (Width): o Regular está no centro do eixo e dois estilos, Narrower (mais estreito) e Wider (mais largo), estão em cada extremidade. Eles fornecem todas as larguras possíveis para o estilo Regular e se combinam com o eixo Peso (Weight) para fornecer todas as larguras para cada peso.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/roboto-dance.mp4" type="video/mp4">
  </source></video>
  <figcaption>Roboto Flex em combinações aleatórias de largura e peso</figcaption></figure>

Isto significa que existem milhares de estilos! Pode parecer exagero, mas a qualidade da experiência de leitura pode ser bastante aprimorada por essa diversidade de estilos de tipos. E, se não houver prejuízo no desempenho, os desenvolvedores web podem usar alguns poucos ou quantos estilos desejarem, dependendo do seu design.

### Itálico

A forma como o estilo itálico é tratado em fontes variáveis é interessante, pois existem duas abordagens diferentes. Fontes como Helvetica ou Roboto têm contornos compatíveis com a interpolação, portanto, seus estilos romano e itálico podem ser interpolados. Assim, para variar entre o estilo romano (vertical) e itálico (inclinado) pode-se usar o eixo **Inclinação** (Slant).

Outros tipos (como Garamond, Baskerville ou Bodoni) têm contornos de glifo romano e itálico que não são compatíveis com interpolação. Por exemplo, os contornos normalmente usados para desenhar um "n" minúsculo no estilo Roman não correspondem aos mesmos contornos usados para desenhar um "n" minúsculo no estilo Italic. Em vez de interpolar um contorno ao outro, o eixo **Itálico** (Italic) alterna entre os dois contornos romano e itálico.

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EySl1LIfX1QIrGq654PO.png", alt="Exemplo de eixos Weight para a fonte Amstelvar", width="800", height="520" %}   <figcaption>     Contornos do "n" do tipo Amstelvar em itálico (12 pontos, peso regular, largura normal) e romano. Imagem fornecida por David Berlow, designer de tipos e tipógrafo na Font Bureau.  </figcaption></figure>

Após a mudança para Itálico, os eixos disponíveis ao usuário devem ser os mesmos disponíveis ao estilo Romano, assim como o conjunto de caracteres deve ser o mesmo.

A capacidade de substituição de glifos também pode ser aplicada a glifos individuais e usada em qualquer lugar no espaço de design de uma fonte variável. Por exemplo, um desenho de cifrão com duas barras verticais funciona melhor em tamanhos de pontos maiores, mas em tamanhos de pontos menores, um desenho com apenas uma barra é melhor. Quando temos menos pixels para renderizar o glifo, um desenho de duas barras pode se tornar ilegível. Para evitar isso, assim como ocorre com o eixo Itálico, uma substituição de um glifo por outro pode ocorrer ao longo do eixo **Tamanho Ótico** (Optical Size) num ponto decidido pelo designer de tipo.

Em suma, onde os contornos permitem, os designers de texto podem criar fontes que interpolam entre vários estilos num espaço de design multidimensional. Isto lhe dá controle granular sobre sua tipografia e bastante poder.

## Definições dos eixos

Existem cinco [eixos registrados](https://docs.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg#registered-axis-tags), que controlam características conhecidas e previsíveis da fonte: peso (weight), largura (width), tamanho óptico (optical size), inclinação (slant) e itálico (italics). Além disso, uma fonte pode conter eixos personalizados. Estes podem controlar qualquer aspecto de design da fonte que o designer de tipo desejar: o tamanho das serifas, o comprimento dos traços, a altura dos ascendentes ou o tamanho do ponto no i.

Mesmo que os eixos possam controlar o mesmo recurso, eles talvez usem valores diferentes. Por exemplo, nas fontes variáveis Oswald e Hepta Slab, há apenas um eixo disponível, Peso, mas os intervalos são diferentes: Oswald tem o mesmo intervalo de antes de ser atualizada para ser variável, 200 a 700, mas Hepta Slab começa com um peso extremo de fio do cabelo em 1 que pode variar até 900.

Os cinco eixos registrados têm tags em letras minúsculas de 4 caracteres que são usadas para definir seus valores em CSS:

<table>
	<tbody>
		<tr>
			<th colspan="2">Nomes de eixo e valores CSS</th>
		</tr>
		<tr>
			<td> 				Weight 			(Peso)</td>
			<td>
				<code>wght</code>
			</td>
		</tr>
		<tr>
			<td> 				Width 			(Largura)</td>
			<td>
				<code>wdth</code>
			</td>
		</tr>
		<tr>
			<td> 				Slant 			(Inclinação)</td>
			<td>
				<code>slnt</code>
			</td>
		</tr>
		<tr>
			<td> 				Optical Size 			(Tamanho ótico)</td>
			<td>
				<code>opsz</code>
			</td>
		</tr>
		<tr>
			<td> 				Italics 			(Itálico)</td>
			<td>
				<code>ital</code>
			</td>
		</tr>
	</tbody>
</table>

Como o desenvolvedor da fonte determina quais eixos estarão disponíveis numa fonte variável e quais valores eles poderão ter, é essencial descobrir o que cada fonte oferece. A documentação da fonte deve fornecer essas informações ou você pode inspecionar a fonte usando uma ferramenta como o [Wakamai Fondue](https://wakamaifondue.com).

## Casos de uso e benefícios

Definir os valores dos eixos depende do gosto pessoal e da aplicação das melhores práticas tipográficas. O perigo de qualquer nova tecnologia é o possível uso indevido, e as configurações que são excessivamente artísticas ou exploratórias também podem diminuir a legibilidade do texto final. Para os títulos, explorar diferentes eixos para criar grandes designs artísticos é empolgante, mas para o corpo, isto pode deixar o texto ilegível.

### Expressão interessante

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rh7wLaBLauEF02D2dqMC.png", alt="Exemplo de grama por Mandy Michael", width="495", height="174" %}</figure>

Um ótimo exemplo de expressão artística está mostrado acima: uma exploração do tipo de letra [Decovar](https://www.typenetwork.com/brochure/decovar-a-decorative-variable-font-by-david-berlow) por Mandy Michael.

Você pode ver o exemplo em funcionamento e seu código-fonte [aqui](https://codepen.io/mandymichael/pen/YYaWop) .

### Animação

<figure>   {% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/2Du2L0Ii5nUqz8n6S3Vz.mp4", controls=false,   autoplay=true,   loop=true,   muted=true,   playsinline=true   %}   <figcaption>     O tipo Zycon, projetado para animação por David Berlow, designer de tipos e tipógrafo do Font Bureau.  </figcaption></figure>

Também existe a possibilidade de explorar caracteres animados com fontes variáveis. Acima está um exemplo de diferentes eixos sendo usados com a fonte Zycon. Veja o [exemplo de animação](https://www.axis-praxis.org/specimens/zycon) ao vivo no Axis Praxis.

[Anicons](https://typogram.github.io/Anicons) é a primeira fonte de ícones coloridos animados do mundo, baseadas no Material Design Icons. Anicons é um experimento que combina duas tecnologias de ponta para fontes: fontes variáveis e fontes coloridas.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/anicons-animation.mp4" type="video/mp4">
  </source></video>
  <figcaption>Alguns exemplos de animações com a fonte de ícones colorida Anicons</figcaption></figure>

### Finesse

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/larger-widths.mp4" type="video/mp4">
  </source></video>
  <figcaption>Amstelvar, usando pequenas quantidades de XTRA em direções opostas para que as larguras das palavras sejam uniformizadas</figcaption></figure>

[Roboto Flex](https://github.com/TypeNetwork/Roboto-Flex) e [Amstelvar](https://github.com/TypeNetwork/Amstelvar) oferecem um conjunto de "Eixos paramétricos". Nesses eixos, as letras são desconstruídas em 4 aspectos fundamentais da forma: formas pretas ou positivas, formas brancas ou negativas e as dimensões x e y. Da mesma forma que as cores primárias podem ser combinadas com qualquer outra cor para ajustá-la, esses 4 aspectos podem ser combinados para ajustar qualquer outro eixo.

O eixo XTRA em Amstelvar permite ajustar o valor "branco" com precisão de milésimos, conforme mostrado acima. Usando pequenas quantidades de XTRA em direções opostas, as larguras das palavras são uniformizadas.

## Fontes variáveis em CSS

### Carregando arquivos de fonte variável

As fontes variáveis são carregadas por meio do mesmo `@font-face` que as fontes estáticas tradicionais da web, mas com dois novos aprimoramentos:

```css
@font-face {
	font-family: 'Roboto Flex';
	src: url('RobotoFlex-VF.woff2') format('woff2 supports variations'),
       url('RobotoFlex-VF.woff2') format('woff2-variations');
	font-weight: 100 1000;
	font-stretch: 25% 151%;
}
```

**1. Formatos de origem:** não queremos que o navegador baixe a fonte se ele não suportar fontes variáveis, então adicionamos uma descrição de formato (`format`): uma vez no [formato futuro](https://www.w3.org/TR/css-fonts-4/#font-face-src-requirement-types) ( `woff2 supports variations`), uma vez no formato atual, mas que em breve será deprecado (`woff2-variations`). Se o navegador suportar fontes variáveis e a sintaxe futura, ele usará a primeira declaração. Se ele suportar fontes variáveis e a sintaxe atual, ele usará a segunda declaração. Ambos apontam para o mesmo arquivo de fonte.

<!-- TODO 2021 Q1 revisit this, based on progress in
     https://www.w3.org/TR/css-fonts-4/#font-face-src-requirement-types
     to allow removing the 2nd src -->

**2. Intervalos de estilo:** você perceberá que estamos fornecendo dois valores para `font-weight` e `font-stretch`. Em vez de informar ao navegador qual peso específico fornecido por esta fonte (por exemplo `font-weight: 500;`), agora fornecemos um **intervalo** de pesos suportados pela fonte. Para Roboto Flex, o eixo Peso varia de 100 a 1000, e o CSS mapeia o intervalo do eixo diretamente à propriedade de estilo `font-weight`. Ao especificar o intervalo em `@font-face`, qualquer valor fora desse intervalo será "truncado" ao valor válido mais próximo. O intervalo do eixo Largura é mapeado da mesma maneira para a propriedade `font-stretch`.

Se você estiver usando a API do Google Fonts, tudo isso será resolvido automaticamente. O CSS irá conter não apenas os formatos e intervalos de origem adequados, como o Google Fonts também enviará fontes de fallback estático caso as fontes variáveis não sejam suportadas.

### Usando pesos e larguras

Atualmente, os eixos que você pode definir com segurança no CSS são o eixo `wght` através de `font-weight` e o eixo `wdth` através de `font-stretch`.

Tradicionalmente, você definiria a `font-weight` como uma palavra-chave (`light`, `bold`) ou como um valor numérico entre 100 e 900, em etapas de 100. Com fontes variáveis, você pode definir qualquer valor dentro do intervalo de largura da fonte:

```css
.kinda-light {
  font-weight: 125;
}

.super-heavy {
  font-weight: 1000;
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/roboto-flex-weight.mp4" type="video/mp4">
  </source></video>
  <figcaption>Eixo Weight do Roboto Flex sendo alterado do mínimo para o máximo.</figcaption></figure>

De forma similar, podemos definir `font-stretch` com as palavras-chave `condensed`, `ultra-expanded`) ou com valores percentuais:

```css
.kinda-narrow {
  font-stretch: 33.3%;
}

.super-wide {
  font-stretch: 151%;
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/roboto-flex-width.mp4" type="video/mp4">
  </source></video>
  <figcaption>Eixo Width do Roboto Flex sendo alterado do mínimo para o máximo.</figcaption></figure>

### Usando os formatos itálico e inclinado

O eixo `ital` se destina a fontes que contêm um estilo regular e um estilo itálico. O eixo funciona como uma chave liga/desliga: o valor `0` é o valor desligado e mostrará o estilo regular, enquanto que o valor `1` mostrará o itálico. Ao contrário de outros eixos, não há transição. Um valor de `0.5` não resultará em "meio itálico".

O `slnt` difere do itálico porque não é um *estilo* novo, mas apenas inclina o estilo regular. Por default, seu valor é `0`, o que significa que as letras serão o default vertical. O Roboto Flex tem uma inclinação máxima de -10 graus, o que significa que as letras irão inclinar-se para a direita ao variar de 0 a -10.

Seria intuitivo definir esses eixos por meio da `font-style`, mas até abril de 2020, exatamente como fazer isto [ainda não tinha sido decidido](https://github.com/w3c/csswg-drafts/issues/3125). Portanto, por enquanto, você deve tratá-los como eixos personalizados e defini-los por meio de `font-variation-settings`:

```css
i, em, .italic {
	/* Should be font-style: italic; */
	font-variation-settings: 'ital' 1;
}

.slanted {
	/* Should be font-style: oblique 10deg; */
	font-variation-settings: 'slnt' 10;
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/roboto-flex-slant.mp4" type="video/mp4">
  </source></video>
  <figcaption>Eixo Slant do Roboto Flex sendo alterado do mínimo para o máximo.</figcaption></figure>

### Usando tamanhos ópticos

Um tipo de letra pode ser renderizado numa dimensão muito pequena (uma nota de rodapé de 12 px) ou muito grande (um título de 80 px). As fontes podem responder a essas mudanças de tamanho, alterando o formato das letras para que sejam melhor adequadas ao seu tamanho. Um tamanho pequeno pode ficar melhor sem detalhes finos, enquanto um tamanho grande pode se beneficiar de mais detalhes e traços mais finos.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wrVCGSQNaGWhNp97BoRS.png", alt="A letra 'a' mostrada em diferentes tamanhos ópticos", width="800", height="147" %}   <figcaption>     A letra 'a' no Roboto Flex em diferentes tamanhos de pixel, depois dimensionada para ter o mesmo tamanho, mostrando as diferenças no design. <a href="https://codepen.io/RoelN/pen/PoPvdeV">Experimente você mesmo no Codepen</a>   </figcaption></figure>

Uma nova propriedade CSS foi introduzida para este eixo: `font-optical-sizing`. Por default, é definida como `auto`, o que faz com que o navegador defina o valor do eixo com base no `font-size` da fonte. Isto significa que o navegador escolherá o melhor tamanho ótico automaticamente, mas se você desejar desligar esse recurso, você pode definir `font-optical-sizing` como `none`.

Você também pode definir um valor personalizado para o eixo `opsz` se desejar deliberadamente um tamanho ótico que não corresponda ao tamanho da fonte. O seguinte CSS faria com que o texto fosse mostrado em tamanho grande, mas num tamanho ótico como se fosse impresso em `8pt`:

```css
.small-yet-large {
  font-size: 100px;
  font-variation-settings: 'opsz' 8;
}
```

### Usando eixos personalizados

Diferentemente dos eixos registrados, os eixos personalizados não serão mapeados a uma propriedade CSS existente, portanto, você sempre terá que defini-los através de `font-variation-settings`. Tags para eixos personalizados estão sempre em maiúsculas, para distingui-los dos eixos registrados.

O Roboto Flex oferece alguns eixos personalizados, e o mais importante é o Grade (`GRAD`). Um eixo de graduação é interessante já que altera o peso da fonte sem alterar as larguras, de forma que não mudam as quebras de linha. Ao brincar com um eixo de graduação, você pode evitar ser forçado a fazer alterações no eixo Peso, que afeta a largura geral e, em seguida, alterações no eixo Largura que afeta o peso geral.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/roboto-flex-grade.mp4" type="video/mp4">
  </source></video>
  <figcaption>Eixo Grade do Roboto Flex sendo alterado do mínimo para o máximo.</figcaption></figure>

Como `GRAD` é um eixo personalizado, com um intervalo de -200 a 150, precisamos usá-lo com `font-variation-settings`:

```css
.grade-light {
	font-variation-settings: `GRAD` -200;
}

.grade-normal {
	font-variation-settings: `GRAD` 0;
}

.grade-heavy {
	font-variation-settings: `GRAD` 150;
}
```

### Fontes variáveis no Google Fonts

O Google Fonts ampliou seu catálogo com [fontes variáveis](https://fonts.google.com/?vfonly=true) e adiciona novas fontes regularmente. A interface atualmente tem como objetivo escolher instâncias individuais da fonte: você seleciona a variação desejada, clica em "Selecionar este estilo" e ela será adicionada ao `<link>` que busca o CSS e as fontes do Google Fonts.

Para usar todos os eixos disponíveis, ou intervalos de valores, você terá que [compor manualmente](https://developers.google.com/fonts/docs/css2) a URL para a API do Google Fonts. Veja [Visão geral das fontes variáveis](https://fonts.google.com/variablefonts), que lista todos os eixos e valores.

A ferramenta [Google Variable Fonts Links](https://github.com/RoelN/google-variable-fonts-links) também pode fornecer as URLs mais recentes para as fontes variáveis completas.

## Herança de font-variation-settings

Embora todos os eixos registrados em breve serão suportados através das propriedades CSS existentes, por enquanto você talvez precise confiar em `font-variation-settings` como um fallback. Você também vai precisar de `font-variation-settings` se sua fonte tiver eixos personalizados.

No entanto, existe um pequeno problema em usar `font-variation-settings`. Cada propriedade que você *não definir explicitamente* será redefinida automaticamente para o default. Os valores definidos anteriormente não são herdados! Isto significa que o código a seguir não irá funcionar como esperado:

```html
<span class="slanted grade-light">
	I should be slanted and have a light grade
</span>
```

Primeiro, o navegador aplicará `font-variation-settings: 'slnt' 10` da classe `.slanted`. Em seguida, aplicará `font-variation-settings: 'GRAD' -200` da classe `.grade-light`. Mas isto vai redefinir o `slnt` de volta ao seu default, que é 0! O resultado será um texto com uma graduação leve, mas que não será inclinado.

Por sorte, podemos contornar isso usando variáveis CSS:

```css
/* Defina valores default */
:root {
	--slnt: 0;
	--GRAD: 0;
}

/* Mude valor para estes elementos e seus filhos */
.slanted {
	--slnt: 10;
}

.grade-light {
	--grad: -200;
}

.grade-normal {
	--grad: 0;
}

.grade-heavy {
	--grad: 150;
}

/* Aplique quaisquer valores armazenados nas variaveis CSS */
.slanted,
.grade-light,
.grade-normal,
.grade-heavy {
	font-variation-settings: 'slnt' var(--slnt), 'GRAD' var(--GRAD);
}
```

Variáveis CSS serão afetadas pelo efeito cascata, portanto, se um elemento (ou um de seus pais) tiver definido o `slnt` a `10`, ele manterá esse valor mesmo que você defina `GRAD` para outra coisa. Veja [Corrigindo herança de fontes variáveis](https://pixelambacht.nl/2019/fixing-variable-font-inheritance/) para uma explicação detalhada dessa técnica.

Observe que animar variáveis CSS não funciona (por design), então algo desse tipo não vai funcionar:

```css
@keyframes width-animation {
   from { --wdth: 25; }
   to   { --wdth: 151; }
}
```

Essas animações terão que acontecer diretamente em `font-variation-settings`.

## Performance gains

As fontes variáveis OpenType permitem armazenar diversas variações de uma família de tipos num único arquivo de fonte. [Monotype](https://medium.com/@monotype/part-2-from-truetype-gx-to-variable-fonts-4c28b16997c3) executou um experimento combinando 12 fontes de entrada para gerar oito pesos, em três larguras, nos estilos itálico e romano. O armazenamento de 48 fontes individuais num único arquivo de fonte variável significou uma *redução de 88% no tamanho do arquivo*.

No entanto, se você estiver usando uma única fonte, como Roboto Regular e nada mais, poderá não perceber um ganho líquido no tamanho da fonte se mudasse para uma fonte variável com vários eixos. Como sempre, isto vai depender do seu caso de uso.

Por outro lado, animar a fonte entre as configurações pode causar problemas de desempenho. Embora isto vá melhorar quando o suporte a fontes variáveis nos navegadores ficar mais maduro, o problema pode ser reduzido um pouco animando apenas as fontes que estão na tela. Este trecho do [Dinamo](https://abcdinamo.com/news/using-variable-fonts-on-the-web) pausa animações em elementos com a classe `vf-animation`, quando eles não estão na tela:

```javascript
var observer = new IntersectionObserver(function(entries, observer) {
  entries.forEach(function(entry) {
    // Pause/Play the animation
    if (entry.isIntersecting) entry.target.style.animationPlayState = "running"
    else entry.target.style.animationPlayState = "paused"
  });
});

var variableTexts = document.querySelectorAll(".vf-animation");
variableTexts.forEach(function(el) { observer.observe(el); });
```

Se sua fonte responde à interação do usuário, é uma boa ideia limitar a execução das chamadas usando [throttle ou debounce](https://css-tricks.com/debouncing-throttling-explained-examples/) em eventos de input. Isto impedirá que o navegador renderize instâncias da fonte variável que mudou tão pouco em relação à instância anterior que o olho humano não perceberia a diferença.

Se você estiver usando o Google Fonts, é uma boa ideia usar [preconnect](/preconnect-and-dns-prefetch/) com `https://fonts.gstatic.com`, o domínio onde as fontes do Google estão hospedadas. Isto vai garantir que o navegador saiba desde o início onde obter as fontes ao encontrá-las no CSS:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" />
```

Essa dica também funciona para outros CDNs: quanto antes você permitir que o navegador estabeleça uma conexão de rede, mais cedo ele poderá baixar suas fontes.

Encontre mais dicas de desempenho para carregar Google Fonts no artigo [The Fastest Google Fonts](https://csswizardry.com/2020/05/the-fastest-google-fonts/).

## Substitutos e suporte ao navegador {: #fallbacks}

Todos os navegadores modernos [suportam fontes variáveis](https://caniuse.com/#feat=variable-fonts). Caso precise suportar navegadores mais antigos, você pode optar por construir seu site com fontes estáticas e usar fontes variáveis como aprimoramento progressivo:

```css
/* Configurar Roboto para navegadores antigos, apenas regular + bold */
@font-face {
  font-family: Roboto;
  src: url('Roboto-Regular.woff2');
  font-weight: normal;
}

@font-face {
  font-family: Roboto;
  src: url('Roboto-Bold.woff2');
  font-weight: bold;
}

body {
  font-family: Roboto;
}

.super-bold {
  font-weight: bold;
}

/* Configurar Roboto para navegadores modernos, todos os weights */
@supports (font-variation-settings: normal) {
  @font-face {
    font-family: 'Roboto';
    src: url('RobotoFlex-VF.woff2') format('woff2 supports variations'),
         url('RobotoFlex-VF.woff2') format('woff2-variations');
    font-weight: 100 1000;
    font-stretch: 25% 151%;
  }

  .super-bold {
    font-weight: 1000;
  }
}
```

Para navegadores mais antigos, o texto com a classe `.super-bold` será renderizado em negrito normal, pois essa é a única fonte em negrito que temos disponível. Somente quando fontes variáveis forem suportadas é que poderemos usar o peso máximo de 1000.

Se você estiver usando a API Google Fonts, ela cuidará de carregar as fontes adequadas aos navegadores do seu visitante. Digamos que você solicite a fonte Oswald no intervalo de peso de 200 a 700, assim:

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">
```

Navegadores modernos que podem lidar com fontes variáveis irão obter a fonte variável e terão disponíveis todos os pesos entre 200 e 700. Os navegadores mais antigos receberão fontes estáticas individuais para cada peso. Nesse caso, isto significa que eles farão o download de 6 arquivos de fontes: um para peso 200, um para peso 300 e assim por diante.

## Obrigado

Este artigo só teria sido possível com a ajuda das seguintes pessoas:

- [Mustafa Kurtuldu](https://twitter.com/mustafa_x), designer de UX e design advocate no Google
- [Roel Nieskens](https://twitter.com/PixelAmbacht), designer/desenvolvedor de UX e especialista em tipografia na [Kabisa](https://kabisa.nl)
- [Dave Crossland](https://twitter.com/davelab6), gerente de programa, Google Fonts
- [David Berlow](https://twitter.com/dberlow), designer de tipos e tipógrafo do [Font Bureau](https://fontbureau.typenetwork.com/)
- [Laurence Penney](https://twitter.com/lorp), desenvolvedor do [axis-praxis.org](https://axis-praxis.org)
- [Mandy Michael](https://twitter.com/Mandy_Kerr), desenvolvedora do [variablefonts.dev](https://variablefonts.dev)

Imagem herói por [Bruno Martins](https://unsplash.com/@brunus) no [Unsplash](https://unsplash.com/photos/OhJmwB4XWLE).
