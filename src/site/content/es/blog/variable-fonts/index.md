---
layout: post
title: Introducción a las fuentes variables en la web
subhead: Una nueva especificación de fuente que puede reducir significativamente el tamaño de los archivos de fuente
description: |
  Cómo funcionan las fuentes variables, cómo implementan los tipógrafos las fuentes variables y
  cómo trabajar con fuentes variables en CSS.
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

En este artículo, veremos qué son las fuentes variables, los beneficios que ofrecen y cómo podemos usarlas en nuestro trabajo. Primero, repasemos cómo funciona la tipografía en la web y qué innovaciones aportan las fuentes variables.

## Compatibilidad con los navegadores

A partir de mayo de 2020, la mayoría de los navegadores son compatibles con las fuentes variables. Consulta [¿Puedo usar fuentes variables?](https://caniuse.com/#feat=variable-fonts) y [Fallbacks](#fallbacks).

## Introducción

Los desarrolladores suelen utilizar indistintamente los términos de fuente y tipo de letra. Sin embargo, hay una diferencia: un tipo de letra es el diseño visual subyacente que puede existir en muchas tecnologías de composición tipográfica diferentes, y una fuente es una de estas implementaciones, en un formato de archivo digital. En otras palabras, un tipo de letra es lo que *miras* y la fuente es lo que *usas*.

Otro concepto que usualmente es ignorado es la distinción entre un estilo y una familia. Un estilo es un tipo de letra único y específico, como negrita cursiva, y una familia es el conjunto completo de estilos.

Antes de las fuentes variables, cada estilo se implementaba como un archivo de fuente independiente. Con fuentes variables, todos los estilos pueden estar contenidos en un solo archivo.

<figure>{% Img src="image/admin/RbhgXwS81Y9PVRJnTjPX.png", alt="Una composición de muestras y una lista de diferentes estilos de la familia Roboto", width="800", height="600" %} <figcaption> Izquierda: un ejemplar de la familia tipográfica Roboto. Derecha: estilos con nombre dentro de la familia.</figcaption></figure>

## Desafíos para el diseñador y el desarrollador

Cuando un diseñador crea un proyecto de impresión, se enfrenta a algunas limitaciones, como el tamaño físico del diseño de la página, la cantidad de colores que se pueden utilizar (el cual está determinada por el tipo de imprenta que se utilizará), entre otros. Pero ellos pueden usar tantos estilos de tipografía como deseen. Esto significa que la tipografía de los medios impresos es a menudo rica y sofisticada, por lo que la experiencia de lectura es realmente agradable. Piensa en la última vez que disfrutaste hojear una increíble revista.

Los diseñadores y los desarrolladores web tienen restricciones diferentes a las de los diseñadores de impresión, y una de las más importantes son los costos de ancho de banda asociados a nuestros diseños. Esto ha sido un tema debatido para obtener experiencias tipográficas más ricas, ya que tienen un costo. Con las fuentes web tradicionales, cada estilo que se utiliza en nuestros diseños requiere que los usuarios descarguen un archivo de fuente separado, lo que aumenta la latencia y el tiempo de renderizaje de la página. Solo incluir los estilos regular y negrita, más sus contrapartes en cursiva, puede ascender a 500 KB o más los datos de las fuentes. Esto es incluso antes de que nos hayamos ocupado de cómo se renderizan las fuentes, los patrones de respaldo que debemos usar o los efectos secundarios indeseables como [FOIT y FOUT](https://www.zachleat.com/web/fout-vs-foit/).

Muchas familias de fuentes ofrecen una gama mucho más amplia de estilos, desde grosores delgados a negros, anchos y estrechos, una variedad de detalles con mucho estilo e incluso diseños de tamaños específicos (optimizados para tamaños de texto grandes o pequeños). Ya que tienes que cargar un nuevo archivo de fuente para cada estilo (o combinaciones de estilos), muchos desarrolladores web optan por no utilizar estas capacidades, dado que reduce la experiencia de lectura de sus usuarios.

## Anatomía de una fuente variable

Las fuentes variables abordan estos desafíos al empaquetar estilos en un solo archivo.

Esto funciona comenzando con un estilo central o 'predeterminado', generalmente el 'Regular', un diseño romano vertical con el peso y ancho más típico que es más adecuado para texto sin formato. Esto luego se conecta a otros estilos en un rango continuo, llamado "eje". El eje más común es el del **Peso**, que puede conectar el estilo predeterminado a un estilo Negrita. Cualquier estilo individual se puede ubicar a lo largo de un eje y se denomina "instancia" de la fuente variable. Algunas instancias son nombradas por el desarrollador de la fuente, por ejemplo, la ubicación del eje del Peso 600 se llama SemiBold.

La fuente variable [Roboto Flex](https://github.com/TypeNetwork/Roboto-Flex) tiene tres estilos para su eje de **Peso.** El estilo regular está en el centro y hay dos estilos en los extremos opuestos del eje, uno más ligero y otro más pesado. Entre estos, puedes elegir entre 900 instancias:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ecr5godvTKunVXP7W8aU.png", alt="La letra 'A' se muestra en diferentes pesos", width="800", height="218" %}<figcaption> Arriba: Anatomía ilustrada del eje Peso para el tipo de letra Roboto.</figcaption></figure>

El desarrollador de fuentes puede ofrecer un conjunto de diferentes ejes. Puedes combinarlos porque todos comparten los mismos estilos predeterminados. Roboto tiene tres estilos en el eje Ancho: el regular está en el centro del eje y los estilos de estrechos y anchos, ambos están en cada extremo. Estos proporcionan todos los anchos del estilo regular y se combinan con el eje de Peso para proporcionar todos los anchos para cada peso.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/roboto-dance.mp4" type="video/mp4">
  </source></video>
  <figcaption>Roboto Flex en combinaciones aleatorias de ancho y peso</figcaption></figure>

¡Esto significa que hay miles de estilos! Esto puede parecer una exageración masiva, pero la calidad de la experiencia de lectura puede mejorarse notablemente con esta diversidad de estilos tipográficos. Y, si no se reduce el rendimiento, los desarrolladores web pueden utilizar desde unos cuantos hasta todos los que deseen en su diseño.

### Cursiva

La forma en que se manejan las cursivas en fuentes variables es interesante, ya que hay dos enfoques diferentes. Los tipos de letra como Helvetica o Roboto tienen contornos compatibles con la interpolación, por lo que sus estilos, romano (roman) y cursiva (italic), se pueden interpolar y el **eje Slant** se puede usar para pasar de romano a cursiva.

Otros tipos de letra (como Garamond, Baskerville o Bodoni) en sus estilos romanos y cursivos tienen contorno de glifos que no son compatibles con la interpolación. Por ejemplo, los contornos que normalmente definen una "n" minúscula de estilo romano no coinciden con los contornos utilizados para definir una "n" minúscula en cursiva. En lugar de interpolar un contorno a otro, el eje de **cursiva** cambia de los contornos romanos a los de cursiva.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EySl1LIfX1QIrGq654PO.png", alt="{Ejemplo de ejes de peso para el tipo de letra Amstelvar", width="800", height="520" %} <figcaption> Contornos "n" de Amstelvar en cursiva (12 puntos, peso regular, ancho normal) y en romano. Imagen proporcionada por David Berlow, diseñador de tipografías y tipógrafo de Font Bureau.</figcaption></figure>

Después del cambio a cursiva, los ejes disponibles para el usuario deben ser los mismos que los estilos romanos, al igual que el conjunto de caracteres debe ser el mismo.

También se puede ver una capacidad de sustitución de glifos para glifos individuales y se puede usar en cualquier lugar del espacio de diseño de una fuente variable. Por ejemplo, un diseño de signo de dólar con dos barras verticales funciona mejor con tamaños de puntos más grandes, pero con tamaños de puntos más pequeños es mejor un diseño con solo una barra. Cuando tenemos menos píxeles para representar el glifo, un diseño de dos barras puede volverse ilegible. Para solucionar esto, al igual que el eje de Cursiva, puedes hacer una sustitución de glifo de un glifo por otro a lo largo del eje de **Tamaño óptico** en un punto decidido por el diseñador de tipos.

En resumen, donde los contornos lo permiten, los diseñadores de tipos pueden crear fuentes que se interpolan entre varios estilos en un espacio de diseño multidimensional. Esto brinda un control granular sobre su tipografía y una gran cantidad de poder.

## Definición de los ejes

Hay cinco [ejes registrados](https://docs.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg#registered-axis-tags) que controlan características conocidas y predecibles de la fuente: peso, ancho, tamaño óptico, inclinación y cursiva. Además de esos, una fuente puede contener ejes personalizados. Estos pueden controlar cualquier aspecto de diseño de la fuente que el diseñador de tipografía desee: el tamaño de las serifas (o las gracias), la longitud de los caracteres decorativos, la altura de los ascendentes o el tamaño del punto en la i.

Aunque los ejes pueden controlar la misma función, es posible que utilicen valores diferentes. Por ejemplo, en las fuentes variables Oswald y Hepta Slab solo hay un eje disponible, el de Peso, pero los rangos son diferentes: Oswald tiene el mismo rango que antes de que se actualizara para ser variable, desde 200 a 700, pero Hepta Slab tiene un peso extremo de hairline (súper delgado) iniciando en 1 y que va hasta 900.

Los cinco ejes registrados tienen etiquetas en minúsculas de 4 caracteres que se utilizan para definir sus valores en CSS:

<table>
	<tbody>
		<tr>
			<th colspan="2">Nombres de ejes y valores CSS</th>
		</tr>
		<tr>
			<td>Peso</td>
			<td>
				<code>wght</code>
			</td>
		</tr>
		<tr>
			<td>Ancho</td>
			<td>
				<code>wdth</code>
			</td>
		</tr>
		<tr>
			<td>Inclinación</td>
			<td>
				<code>slnt</code>
			</td>
		</tr>
		<tr>
			<td>Tamaño óptico</td>
			<td>
				<code>opsz</code>
			</td>
		</tr>
		<tr>
			<td>Cursiva</td>
			<td>
				<code>ital</code>
			</td>
		</tr>
	</tbody>
</table>

Dado que el desarrollador de fuentes define qué ejes están disponibles en una fuente variable y qué valores pueden tener, es esencial saber qué ofrece cada fuente. La documentación de la fuente debe proporcionar esto, o puedes inspeccionar la fuente usando una herramienta como [Wakamai Fondue](https://wakamaifondue.com).

## Casos de uso y beneficios

Definir los valores de los ejes se define mediante el gusto personal y de la aplicación de las mejores prácticas tipográficas. El peligro de cualquier nueva tecnología es el posible uso indebido, y los escenarios que son demasiado artísticos o exploratorios también podrían disminuir la legibilidad del texto real. Para los títulos, explorar diferentes ejes para crear grandes diseños artísticos es emocionante, pero para el cuerpo del texto, esto significa un riesgo de hacer que el texto sea ilegible.

### Expresión emocionante

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rh7wLaBLauEF02D2dqMC.png", alt="Ejemplo de césped de Mandy Michael", width="495", height="174" %}</figure>

Un gran ejemplo de expresión artística se muestra arriba, una exploración del tipo de letra [Decovar](https://www.typenetwork.com/brochure/decovar-a-decorative-variable-font-by-david-berlow) de Mandy Michael.

Puedes ver el ejemplo en vivo y su código fuente [aquí](https://codepen.io/mandymichael/pen/YYaWop).

### Animación

<figure>{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/2Du2L0Ii5nUqz8n6S3Vz.mp4", controls=false, autoplay=true, loop=true, muted=true, playsinline=true %} <figcaption> Typeface Zycon, diseñado para animación por David Berlow, diseñador de tipografías y tipógrafo de Font Bureau.</figcaption></figure>

También existe la posibilidad de explorar personajes animados con fuentes variables. Arriba hay un ejemplo de diferentes ejes que se utilizan con el tipo de letra Zycon. Mira el [ejemplo de animación en vivo en Axis Praxis](https://www.axis-praxis.org/specimens/zycon).

[Anicons](https://typogram.github.io/Anicons) es la primera fuente de iconos de colores animados del mundo, basada en Material Design Icons. Anicons es un experimento que combina dos tecnologías de fuentes de vanguardia: fuentes variables y fuentes de color.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/anicons-animation.mp4" type="video/mp4">
  </source></video>
  <figcaption>Algunos ejemplos de animaciones al pasar el ratón sobre un elemento utilizando la fuente de iconos de color de Anicon</figcaption></figure>

### Finura

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/larger-widths.mp4" type="video/mp4">
  </source></video>
  <figcaption>Amstelvar usa pequeños trozos de XTRA en direcciones opuestas para que los anchos de las palabras se nivelen</figcaption></figure>

[Roboto Flex](https://github.com/TypeNetwork/Roboto-Flex) y [Amstelvar](https://github.com/TypeNetwork/Amstelvar) ofrecen un conjunto de "ejes paramétricos". En estos ejes, las letras se deconstruyen en 4 aspectos fundamentales de las formas: formas negras o positivas, formas blancas o negativas y las dimensiones x e y. De la misma forma que los colores primarios se pueden mezclar con cualquier otro color para refinar, estos 4 aspectos se pueden utilizar para refinar cualquier otro eje.

El eje XTRA en Amstelvar te permite ajustar el valor "blanco" por mil, como se mostró en el ejemplo anterior. Usando pequeños trozos de XTRA en direcciones opuestas, los anchos de las palabras son igualados.

## Fuentes variables en CSS

### Cargando archivos de fuentes variables

Las fuentes variables se cargan a través del mismo `@font-face` que las fuentes web estáticas tradicionales, pero con dos nuevas mejoras:

```css
@font-face {
	font-family: 'Roboto Flex';
	src: url('RobotoFlex-VF.woff2') format('woff2 supports variations'),
       url('RobotoFlex-VF.woff2') format('woff2-variations');
	font-weight: 100 1000;
	font-stretch: 25% 151%;
}
```

**1. Formatos de origen:** no queremos que el navegador descargue la fuente si no admite fuentes variables, por lo que agregamos una descripción `format`: una vez en el [future format](https://www.w3.org/TR/css-fonts-4/#font-face-src-requirement-types) (`woff2 supports variations`), y una vez en el formato actual, el cual pronto pasara a ser un formato obsoleto(`woff2-variations`). Si el navegador admite fuentes variables y admite la próxima sintaxis, utilizará la primera declaración. Si admite fuentes variables y la sintaxis actual, utilizará la segunda declaración. Ambos apuntan al mismo archivo de fuente.

<!-- TODO 2021 Q1 revisit this, based on progress in
     https://www.w3.org/TR/css-fonts-4/#font-face-src-requirement-types
     to allow removing the 2nd src -->

**2. Rangos de estilo:** notarás que estamos proporcionando dos valores para `font-weight` y `font-stretch`. En lugar de decirle al navegador qué peso específico proporciona esta fuente (por ejemplo, `font-weight: 500;` ), ahora le damos el **rango** de pesos admitidos por la fuente. Para Roboto Flex, el eje de Peso varía de 100 a 1000, y el CSS asigna directamente el rango del eje a la propiedad de estilo de `font-weight`. Al especificar el rango en `@font-face`, cualquier valor fuera de este rango será "limitado" al valor válido más cercano. El rango del eje Ancho se asigna de la misma manera a la propiedad `font-stretch`.

Si estas utilizando la API de Google Fonts, todo esto será solucionado por la API. El CSS no solo contendrá los formatos y rangos de fuentes adecuados, sino que Google Fonts también enviará fuentes estáticas como fallback en caso de que las fuentes variables no sean compatibles.

### Usando los pesos y anchuras

Actualmente, los ejes que puedes definir de manera confiable desde el CSS son el eje de `wght` mediante `font-weight` y el eje de `wdth` mediante `font-stretch`.

Tradicionalmente, definirás `font-weight` como una palabra clave (`light`, `bold`) o como un valor numérico entre 100 y 900, en incrementos de 100. Con las fuentes variables, puedes definir cualquier valor dentro del rango de Ancho de la fuente:

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
  <figcaption>El eje de peso de Roboto Flex se cambia de su mínimo a su máximo.</figcaption></figure>

Asimismo, podemos definir `font-stretch` con palabras clave (`condensed`, `ultra-expanded`) o con valores porcentuales:

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
  <figcaption>El eje de ancho de Roboto Flex se cambia de su mínimo a su máximo.</figcaption></figure>

### Usando cursivas y oblicuos

La eje `ital` está destinado a fuentes que contienen tanto un estilo regular, y un estilo de cursiva. El eje está destinado a ser un interruptor de encendido y apagado: el valor `0` está apagado y mostrará el estilo normal, mientras que el valor `1` mostrará la cursiva. A diferencia de otros ejes, no hay transición. Un valor de `0.5` no te dará una "media cursiva".

El eje `slnt` es diferente de la cursiva en que no es un *estilo* nuevo, sino que solo inclina al estilo normal. De forma predeterminada, su valor es `0`, lo que significa que es la forma de letras verticales predeterminadas. Roboto Flex tiene una inclinación máxima de -10 grados, lo que significa que las letras se inclinarán hacia la derecha al pasar de 0 a -10.

Sería intuitivo definir estos ejes mediante el `font-style`, pero a partir de abril de 2020, [todavía se está intentando resolver](https://github.com/w3c/csswg-drafts/issues/3125) cómo hacer esto exactamente. Entonces, por ahora, debes tratarlos como ejes personalizados y configurarlos a mediante el `font-variation-settings`:

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
  <figcaption>El eje inclinado de Roboto Flex se cambia de su mínimo a su máximo.</figcaption></figure>

### Usando tamaños ópticos

Un tipo de letra puede ser muy pequeño (una nota al pie de 12 píxeles) o muy grande (un título de 80 píxeles). Las fuentes pueden responder a estos cambios de tamaño cambiando las formas de las letras y así adaptarse mejor a su tamaño. Un tamaño pequeño podría estar mejor sin detalles finos, mientras que un tamaño grande podría beneficiarse con trazos y detalles más finos.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wrVCGSQNaGWhNp97BoRS.png", alt="La letra 'a' se muestra en diferentes tamaños ópticos", width="800", height="147" %}<figcaption> La letra 'a' en Roboto Flex en diferentes tamaños de píxeles, luego escalada para tener el mismo tamaño, se muestra las diferencias en el diseño. <a href="https://codepen.io/RoelN/pen/PoPvdeV">Pruébalo en Codepen</a></figcaption></figure>

Se ha introducido una nueva propiedad CSS para este eje: `font-optical-sizing`. De forma predeterminada, este tiene un valor de `auto`, lo que hace que el navegador establezca el valor del eje en función del `font-size`. Esto significa que el navegador elegirá el mejor tamaño óptico automáticamente, pero si deseas desactivarlo, puedes definir `font-optical-sizing` como `none`.

También puedes definir un valor personalizado para el `opsz`, si es que deseas deliberadamente un tamaño óptico que no coincida con el tamaño de fuente. El siguiente CSS haría que el texto se mostrara en un tamaño grande, pero como es un tamaño óptico, este se imprimirá como si fuera uno de `8pt`:

```css
.small-yet-large {
  font-size: 100px;
  font-variation-settings: 'opsz' 8;
}
```

### Usando ejes personalizados

A diferencia de los ejes registrados, los ejes personalizados no se asignarán a una propiedad CSS existente, por lo que siempre tendrás que configurarlos mediante `font-variation-settings`. Las etiquetas de los ejes personalizados siempre están en mayúsculas, para distinguirlas de los ejes registrados.

Roboto Flex ofrece algunos ejes personalizados, y el más importante es Grade (`GRAD`). El eje Grade es interesante ya que cambia el peso de la fuente sin cambiar los anchos, por lo que los saltos de línea no cambian. Al jugar con un eje Grade, puedes evitar estar obligado a juguetear con los cambios en el eje de Peso que afectan al ancho general, y luego los cambios en el eje de Ancho que afectan al peso total.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/roboto-flex-grade.mp4" type="video/mp4">
  </source></video>
  <figcaption>El eje de Grade de Roboto Flex se cambia de su mínimo a su máximo.</figcaption></figure>

Como `GRAD` es un eje personalizado, con un rango de -200 a 150, debemos utilizarlo con `font-variation-settings`:

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

### Fuentes variables en Google Fonts

Google Fonts ha ampliado su catálogo con [fuentes variables](https://fonts.google.com/?vfonly=true) y se encuentra añadido nuevas con regularidad. Actualmente, la interfaz está destinada a seleccionar instancias individuales de la fuente: selecciona la variación que deseas, haz clic en "Seleccionar este estilo" y se agregará al `<link>` que obtiene el CSS y las fuentes de Google Fonts.

Para usar todos los ejes disponibles, o rangos de valores, deberás [componer manualmente](https://developers.google.com/fonts/docs/css2) la URL a la API de Google Fonts. La [descripción general de las fuentes variables](https://fonts.google.com/variablefonts) enumera todos los ejes y valores.

La herramienta de [Vínculos de fuentes variables de Google](https://github.com/RoelN/google-variable-fonts-links) también puede proporcionarte las URL más recientes para las fuentes variables completas.

## Herencia de font-variation-settings

Si bien todos los ejes registrados pronto serán compatibles a través de las propiedades CSS existentes, por el momento, es posible que debas de confiar a `font-variation-settings` como una alternativa. Y si tu fuente tiene ejes personalizados, también necesitarás de `font-variation-settings`.

Sin embargo, tenemos un pequeño problema con `font-variation-settings`. Cada propiedad que *no se establezca explícitamente* se restablecerá automáticamente a su valor predeterminado. ¡Los valores establecidos previamente no se heredarán! Esto significa que lo siguiente no funcionará como se espera:

```html
<span class="slanted grade-light">
	Debería de ser slanted y tener un grade ligero
</span>
```

Primero, el navegador aplicará `font-variation-settings: 'slnt' 10` de la clase `.slanted`. Luego aplicará `font-variation-settings: 'GRAD' -200` de la clase `.grade-light` ¡Pero esto restablecerá el `slnt` a su valor predeterminado de 0! El resultado será un texto en un grade ligero, pero no inclinado.

Afortunadamente, podemos solucionar esto mediante el uso de variables CSS:

```css
/* Definir los valores predeterminados */
:root {
	--slnt: 0;
	--GRAD: 0;
}

/* Cambiar esos valores y los de los hijos */
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

/* Aplicar cual sea el valor que se mantiene en las variables CSS */
.slanted,
.grade-light,
.grade-normal,
.grade-heavy {
	font-variation-settings: 'slnt' var(--slnt), 'GRAD' var(--GRAD);
}
```

Las variables CSS se conectarán en cascada, por lo que si un elemento (o uno de sus padres) ha definido el `slnt` a `10`, mantendrá ese valor, incluso si define `GRAD` con otro valor. Consulta [Arreglar la herencia de fuentes variables](https://pixelambacht.nl/2019/fixing-variable-font-inheritance/) para obtener una explicación detallada de esta técnica.

Ten en cuenta que animar las variables CSS no funciona (por diseño), por lo que algo como esto no funciona:

```css
@keyframes width-animation {
   from { --wdth: 25; }
   to   { --wdth: 151; }
}
```

Estas animaciones tendrán que suceder directamente en `font-variation-settings`.

## Aumento de rendimiento

Las fuentes variables OpenType nos permiten almacenar múltiples variaciones de una familia tipográfica en un solo archivo de fuente. [Monotype](https://medium.com/@monotype/part-2-from-truetype-gx-to-variable-fonts-4c28b16997c3) realizó un experimento combinando 12 fuentes de entrada para generar ocho pesos, en tres anchos, en los estilos romanos y de cursiva. El almacenamiento de 48 fuentes individuales en un solo archivo de fuente variable significó una *reducción del 88% en el tamaño del archivo*.

Sin embargo, si estas utilizando una sola fuente como Roboto Regular y nada más, es posible que no veas una mejora neta en el tamaño de fuente si cambiara a una fuente variable con muchos ejes. Como siempre, depende de su caso de uso.

Por otro lado, animar la fuente entre configuraciones puede causar problemas de rendimiento. Aunque esto mejorará una vez que el soporte de fuentes variables en los navegadores sea más maduro, el problema se puede reducir un poco animando solo las fuentes que están actualmente en la pantalla. Este práctico fragmento de [Dinamo](https://abcdinamo.com/news/using-variable-fonts-on-the-web) detiene las animaciones en elementos con la clase `vf-animation` cuando no están en la pantalla:

```javascript
var observer = new IntersectionObserver(function(entries, observer) {
  entries.forEach(function(entry) {
    // Pausar/Iniciar la animación
    if (entry.isIntersecting) entry.target.style.animationPlayState = "running"
    else entry.target.style.animationPlayState = "paused"
  });
});

var variableTexts = document.querySelectorAll(".vf-animation");
variableTexts.forEach(function(el) { observer.observe(el); });
```

Si tu fuente responde a la interacción del usuario, es una buena idea [acelerar o rebotar (debounce)](https://css-tricks.com/debouncing-throttling-explained-examples/) los eventos de entrada. Esto evitará que el navegador represente instancias de la fuente variable que cambió tan poco con respecto a la instancia anterior que el ojo humano no vería la diferencia.

Si estas utilizando Google Fonts, es una buena idea [preconectarse](/preconnect-and-dns-prefetch/) a `https://fonts.gstatic.com`, el dominio donde se alojan las fuentes de Google. Esto asegurará que el navegador sepa desde el principio dónde obtener las fuentes cuando las encuentre en el CSS:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" />
```

Este consejo también funciona para otros CDN: cuanto antes permitas que el navegador configure una conexión de red, antes podrás descargar tus fuentes.

Podrás encontrar más sugerencias de rendimiento para cargar Google Fonts en [The Fastest Google Fonts (Las fuentes más rápidas de Google)](https://csswizardry.com/2020/05/the-fastest-google-fonts/).

## Respaldos y compatibilidad con navegadores {: #fallbacks }

Todos los navegadores modernos [tienen compatibilidad con fuentes variables](https://caniuse.com/#feat=variable-fonts). En caso de que necesites compatibilidad con navegadores más antiguos, puedes optar por crear tu sitio con fuentes estáticas y utilizar fuentes variables como mejora progresiva:

```css
/* Variables necesarias de Roboto para navegadores antiguos, solo regular + negritas */
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

/* Variables necesarias de Roboto para todos los navegadores modernos, todos los pesos */
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

El texto con la clase `.super-bold` se renderizará en negrita normal en los navegadores más antiguos, ya que es la única letra o fuente en negrita disponible. Si hay compatibilidad con letras variables, puede usar `1000`, el mayor grosor de letra posible.

La regla `@supports` es incompatible con Internet Explorer; por ello, no verá nada en este navegador. Si eso fuera un problema, puede usar una de las [soluciones temporales tradicionales](https://stackoverflow.com/a/20541859/6255000) para conocer los navegadores viejos que sí puede usar.

Si usa la API de Google Fonts, puede cargar las letras o fuentes adecuadas para los navegadores de los visitantes. Supongamos que consulta la letra Oswald en una gama de grosores de 200–700 de la siguiente manera:

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">
```

Los navegadores modernos que pueden manejar fuentes variables obtendrán la fuente variable y tendrán cada peso disponible entre 200 y 700. Los navegadores más antiguos recibirán fuentes estáticas individuales para cada peso. En este caso, esto significa que se descargarán 6 archivos de fuentes: uno para el peso 200, otro para el peso 300 y así sucesivamente.

## Agradecimientos

Este artículo solo habría sido posible con la ayuda de las siguientes personas:

- [Mustafa Kurtuldu](https://twitter.com/mustafa_x), diseñador de UX y promotor del diseño en Google
- [Roel Nieskens](https://twitter.com/PixelAmbacht), diseñador y desarrollador de UX y experto en tipografía en [Kabisa](https://kabisa.nl)
- [Dave Crossland](https://twitter.com/davelab6), director de programas, Google Fonts
- [David Berlow](https://twitter.com/dberlow), diseñador de tipografías y tipógrafo de [Font Bureau](https://fontbureau.typenetwork.com/)
- [Laurence Penney](https://twitter.com/lorp), desarrollador de [axis-praxis.org](https://axis-praxis.org)
- [Mandy Michael](https://twitter.com/Mandy_Kerr), desarrolladora de [variablefonts.dev](https://variablefonts.dev)

Imagen de héroe de [Bruno Martins](https://unsplash.com/@brunus) en [Unsplash](https://unsplash.com/photos/OhJmwB4XWLE).
