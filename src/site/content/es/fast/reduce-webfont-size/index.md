---
layout: post
title: Reducir el tamaño de WebFont
authors:
  - ilyagrigorik
date: 2019-08-16
updated: 2020-07-03
description: |2-

  Esta publicación explica cómo reducir el tamaño de la WebFont que usas en tu sitio, para que una buena tipografía no signifique un sitio lento.
tags:
  - performance
  - fonts
---

La tipografía es fundamental para un buen diseño, marca, legibilidad y accesibilidad. WebFonts habilita todo lo anterior y más: el texto es seleccionable, se puede buscar, se puede hacer zoom y es compatible con altos DPI, lo que proporciona una representación de texto consistente y nítida independientemente del tamaño y la resolución de la pantalla. Las WebFonts (fuentes web) son fundamentales para un buen diseño, experiencia de usuario y rendimiento.

La optimización de WebFont es una pieza fundamental de la estrategia general de rendimiento. Cada fuente es un recurso adicional y algunas fuentes pueden bloquear la renderización del texto, pero el hecho de que la página utilice WebFonts no significa que deba presentarse más lento. Por lo contrario, las fuentes optimizadas, combinadas con una estrategia juiciosa sobre cómo se cargan y aplican en la página, pueden ayudar a reducir el tamaño total de la página y mejorar los tiempos de renderización de la página.

## Anatomía de una WebFont

Un *WebFont* es una colección de glifos y cada glifo es una forma vectorial que describe una letra o símbolo. Como resultado, dos variables simples determinan el tamaño de un archivo de fuente en particular: la complejidad de las rutas vectoriales de cada glifo y el número de glifos en una fuente en particular. Por ejemplo, Open Sans, que es una de las WebFonts más populares, contiene 897 glifos, que incluyen caracteres latinos, griegos y cirílicos.

{% Img src="image/admin/B92rhiBJD9sx88a5CvVy.png", alt="Tabla de glifos de fuentes", width="800", height="309" %}

Al elegir una fuente, es importante tener en cuenta qué conjuntos de caracteres son compatibles. Si necesitas localizar el contenido de tu página a varios idiomas, debes de utilizar una fuente que pueda ofrecer una apariencia y una experiencia coherentes a tus usuarios. Por ejemplo, [la familia de fuentes Noto de Google](https://www.google.com/get/noto/) tiene como objetivo admitir todos los idiomas del mundo. Sin embargo, ten en cuenta que el tamaño total de Noto, con todos los idiomas incluidos, da como resultado una descarga ZIP de más de 1.1 GB.

En esta publicación, descubrirás cómo reducir el tamaño de los archivos de tus WebFonts.

### Formatos de WebFonts

En la actualidad, hay cuatro formatos de contenedor de fuentes en uso en la web:

- [EOT](https://en.wikipedia.org/wiki/Embedded_OpenType)
- [TTF](https://en.wikipedia.org/wiki/TrueType)
- [WOFF](https://en.wikipedia.org/wiki/Web_Open_Font_Format)
- [WOFF2.0](https://www.w3.org/TR/WOFF2/)

[WOFF](http://caniuse.com/#feat=woff) y [WOFF 2.0](http://caniuse.com/#feat=woff2) disfrutan del soporte más amplio, sin embargo, para compatibilidad con navegadores más antiguos, es posible que debas incluir otros formatos:

- Sirve la variante WOFF 2.0 a los navegadores que tengan compatibilidad.
- Sirve la variante WOFF para la mayoría de navegadores.
- Sirve la variante TTF a los navegadores antiguos de Android (por debajo de 4.4).
- Sirve la variante EOT a los navegadores de Internet Explorer (IE) antiguos (por debajo de IE9).

{% Aside %} Técnicamente, existe otro formato de contenedor, el [contenedor de fuentes SVG](http://caniuse.com/svg-fonts), pero Internet Explorer y Firefox nunca tuvieron compatibilidad y ahora está obsoleto en Chrome. Como tal, es de uso limitado y se omite intencionalmente en esta guía. {% endAside %}

### Reducir el tamaño de la fuente con compresión

Una fuente es una colección de glifos, cada uno de los cuales es un conjunto de rutas que describen la forma de la letra. Los glifos individuales son diferentes, pero contienen mucha información similar que se puede comprimir con GZIP o un compresor compatible:

- Los formatos EOT y TTF no están comprimidos de forma predeterminada. Asegúrate de que tus servidores estén configurados para aplicar una [compresión GZIP](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer#text-compression-with-gzip) al entregar estos formatos.
- WOFF tiene compresión incorporada. Asegúrate de que tu compresor WOFF está utilizando una configuración de compresión óptima.
- WOFF2 utiliza algoritmos personalizados de preprocesamiento y compresión para ofrecer una reducción del tamaño de archivo de aproximadamente un 30% en comparación con otros formatos. Para obtener más información, consulta el [informe de evaluación de WOFF 2.0](http://www.w3.org/TR/WOFF20ER/).

Finalmente, vale la pena señalar que algunos formatos de fuente contienen metadatos adicionales, como [sugerencias de fuentes](https://en.wikipedia.org/wiki/Font_hinting) e [información de kerning](https://en.wikipedia.org/wiki/Kerning) que pueden no ser necesarios en algunas plataformas, los cuales permiten una mayor optimización del tamaño de archivo. Consulta tu compresor de fuentes para conocer las opciones de optimización disponibles y, si tomas esta ruta, asegúrate de tener la infraestructura adecuada para probar y entregar estas fuentes optimizadas a cada navegador. Por ejemplo, [Google Fonts](https://fonts.google.com/) mantiene más de 30 variantes optimizadas para cada fuente y detecta y entrega automáticamente la variante óptima para cada plataforma y navegador.

{% Aside %} Considera usar la [compresión Zopfli](http://en.wikipedia.org/wiki/Zopfli) para los formatos de EOT, TTF y WOFF. Zopfli es un compresor compatible con zlib que ofrece una reducción del tamaño de archivo de un 5% en comparación con gzip. {% endAside %}

## Define una familia de fuentes con @font-face

La regla `@font-face` de CSS te permite definir la ubicación de un recurso de fuente en particular, sus características de estilo y los puntos de código Unicode para los que debe usarse. Se puede usar una combinación de `@font-face` para construir una "font family (familia de fuentes)", que el navegador usará para evaluar qué recursos de fuentes deben descargarse y aplicarse a la página actual.

### Considera una fuente variable

Las fuentes variables pueden reducir significativamente el tamaño de tus fuentes en los casos en que necesites múltiples variantes de una fuente. En lugar de tener que cargar los estilos regular y negrita más sus versiones en cursiva, puedes cargar un solo archivo que contenga toda la información.

Las fuentes variables ahora son compatibles con todos los navegadores modernos. Obtén más información en [Introducción a las fuentes variables en la web](/variable-fonts/).

### Selecciona el formato correcto

Cada `@font-face` proporciona el nombre de la familia de fuentes, que actúa como un grupo lógico de declaraciones múltiples, [propiedades de fuente](http://www.w3.org/TR/css3-fonts/#font-prop-desc) como estilo (style), peso (weight) y estiramiento (stretch), y el [src descriptor](http://www.w3.org/TR/css3-fonts/#src-desc), que especifica una lista priorizada de ubicaciones para la fuente utilizada como recurso.

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

Primero, ten en cuenta que los ejemplos anteriores definen una sola familia *Awesome Font* con dos estilos (normal y *cursiva*), cada uno de los cuales apunta a un conjunto diferente de recursos de fuentes. A su vez, cada descriptor `src` contiene una lista priorizada y separada por comas de variantes de recursos:

- La directiva de `local()` permite hacer referencia, cargar y usar fuentes instaladas localmente.
- La directiva de `url()` permite cargar fuentes externas y puede contener una sugerencia de `format()` opcional que indica el formato de la fuente a la que hace referencia la URL proporcionada.

{% Aside %} A menos que estés haciendo referencia a una de las fuentes predeterminadas del sistema, es raro que el usuario la tenga instalada localmente, especialmente en dispositivos móviles, donde es efectivamente imposible "instalar" fuentes adicionales. Siempre debes de comenzar con una entrada `local()` "por si acaso" y luego proporcionar una lista de entradas `url().` {% endAside %}

Cuando el navegador determina que se necesita la fuente, se recorre la lista de recursos proporcionada en el orden especificado e intenta cargar el recurso apropiado. Por ejemplo, siguiendo el ejemplo anterior:

1. El navegador realiza el diseño de la página y determina qué variantes de fuente son necesarias para renderizar el texto especificado en la página.
2. Para cada fuente requerida, el navegador verifica si la fuente está disponible localmente.
3. Si la fuente no está disponible localmente, el navegador itera sobre definiciones externas:
    - Si hay una sugerencia de formato, el navegador comprueba si admite la sugerencia antes de iniciar la descarga. Si el navegador no admite la sugerencia, el navegador avanza a la siguiente.
    - Si no hay ninguna sugerencia de formato, el navegador descarga el recurso.

La combinación de directivas locales y externas con sugerencias de formato adecuadas te permite especificar todos los formatos de fuente disponibles y dejar que el navegador se encargue del resto. El navegador determina qué recursos son necesarios y selecciona el formato óptimo.

{% Aside %} El orden en el que se especifican las variantes de fuente es importante. El navegador elige el primer formato que admite. Por lo tanto, si deseas que los navegadores más nuevos usen WOFF 2.0, entonces debes de colocar la declaración WOFF 2.0 por encima de WOFF. {% endAside %}

### Subconjunto de rango Unicode

Además de las propiedades de la fuente, como el estilo, el peso y el estiramiento, la `@font-face` permite definir un conjunto de puntos de código Unicode admitidos por cada recurso. Esto te permite dividir una fuente Unicode grande en subconjuntos más pequeños (por ejemplo, subconjuntos latinos, cirílicos y griegos) y solo descargar los glifos necesarios para representar el texto en una página en particular.

El [descriptor de rango Unicode](http://www.w3.org/TR/css3-fonts/#descdef-unicode-range) te permite especificar una lista delimitada por comas de valores de rango, cada uno de los cuales puede estar en una de tres formas diferentes:

- Punto de código único (por ejemplo, `U+416`)
- Rango de intervalo (por ejemplo, `U+400-4ff`): indica los puntos de código de inicio y finalización de un rango
- Rango de comodines (por ejemplo, `U+4??`) `?` los caracteres indican cualquier dígito hexadecimal

Por ejemplo, puedes dividir tu familia *Awesome Font* en subconjuntos latinos y japoneses, cada uno de los cuales el navegador descarga según sea necesario:

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
  unicode-range: U+000-5FF; /* Latin glyphs */
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
  unicode-range: U+3000-9FFF, U+ff??; /* Japanese glyphs */
}
```

{% Aside %} El subconjunto de rango Unicode es particularmente importante para los idiomas asiáticos, donde el número de glifos es mucho mayor que en los idiomas occidentales y una fuente "completa" típica a menudo se mide en megabytes en lugar de decenas de kilobytes. {% endAside %}

El uso de subconjuntos de rango Unicode y archivos separados para cada variante estilística de la fuente te permite definir una familia de fuentes compuestas que es más rápida y eficiente de descargar. Los visitantes solo descargan las variantes y subconjuntos que necesitan y no están obligados a descargar subconjuntos que tal vez nunca vean o usen en la página.

La mayoría de los navegadores [ahora admiten el rango Unicode](http://caniuse.com/#feat=font-unicode-range). Para lograr compatibilidad con navegadores más antiguos, es posible que debas de recurrir a "subconjuntos manuales". En este caso, debes de recurrir a proporcionar un único recurso de fuente que contenga todos los subconjuntos necesarios y ocultar el resto del navegador. Por ejemplo, si la página solo usa caracteres latinos, entonces puedes quitar otros glifos y servir ese subconjunto en particular como un recurso independiente.

1. **Determina qué subconjuntos se necesitan:**
    - Si el navegador permite subconjuntos de rango Unicode, automáticamente se seleccionará el subconjunto correcto. La página solo necesita proporcionar los archivos del subconjunto y especificar los rangos Unicode apropiados en las reglas del `@font-face`.
    - Si el navegador no permite subconjuntos de rango Unicode, entonces la página debe ocultar todos los subconjuntos innecesarios; es decir, el desarrollador debe especificar los subconjuntos necesarios.
2. **Genera subconjuntos de fuentes:**
    - Utiliza la [herramienta pyftsubset](https://github.com/behdad/fonttools/) de código abierto para crear subconjuntos y optimizar tus fuentes.
    - Algunos servicios de fuentes permiten el subconjunto manual a través de parámetros de consulta personalizados, que puedes utilizar para especificar manualmente el subconjunto requerido para tu página. Consulta la documentación de tu proveedor de fuentes.

### Selección y síntesis de fuentes

Cada familia de fuentes se compone de múltiples variantes estilísticas (regular, negrita, cursiva) y varios pesos para cada estilo, cada uno de los cuales, a su vez, puede contener formas de glifos muy diferentes, por ejemplo, diferentes espaciado, tamaño o una forma completamente diferente.

{% Img src="image/admin/FNtAc2xRmx2MuUt2MADj.png", alt="Peso de fuente", width="697", height="127" %}

Por ejemplo, el diagrama anterior ilustra una familia de fuentes que ofrece tres pesos de negrita diferentes: 400 (normal), 700 (negrita) y 900 (extra negrita). Todas las demás variantes intermedias (indicadas en gris) se asignan automáticamente a la variante más cercana por el navegador.

<blockquote>
  <p>Cuando se especifica un peso para el que no existe una font face, se utiliza una font face con un peso cercano. En general, los pesos en negrita se asignan a rostros con pesos más pesados y los pesos ligeros se asignan a font face con pesos más livianos.</p>
<cite><p data-md-type="paragraph"><a href="http://www.w3.org/TR/css3-fonts/#font-matching-algorithm">Algoritmo de coincidencia de fuentes CSS</a></p></cite>
</blockquote>

Se aplica una lógica similar a las variantes en *cursiva.* El diseñador de fuentes controla qué variantes producirán y tú controlas qué variantes usarás en la página. Debido a que cada variante es una descarga separada, es una buena idea mantener pequeña la cantidad de variantes. Por ejemplo, puedes definir dos variantes en negrita para la familia de *Awesome Font:*

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
  unicode-range: U+000-5FF; /* Latin glyphs */
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
  unicode-range: U+000-5FF; /* Latin glyphs */
}
```

El ejemplo anterior declara la familia *Awesome Font* que se compone de dos recursos que cubren el mismo conjunto de glifos latinos (`U+000-5FF`) pero ofrecen dos "pesos" diferentes: normal (400) y negrita (700). Sin embargo, ¿qué sucede si una de tus reglas CSS especifica un peso de fuente diferente o establece la propiedad de font-style en cursiva?

- Si no está disponible una coincidencia de fuente exacta, el navegador sustituye con la coincidencia más cercana.
- Si no se encuentra ninguna coincidencia estilística (por ejemplo, no se declararon variantes en cursiva en el ejemplo anterior), el navegador sintetiza su propia variante de fuente.

{% Img src="image/admin/a8Jo2cIO1tPsj71AzftS.png", alt="Síntesis de fuentes", width="800", height="356" %}

{% Aside 'warning' %} Ten en cuenta que los enfoques sintetizados pueden no ser adecuados para scripts como el cirílico, donde las formas en cursiva tienen formas muy diferentes. Para una fidelidad adecuada en esos guiones, usa una fuente real en cursiva. {% endAside %}

El ejemplo anterior ilustra la diferencia entre los resultados de fuentes reales y sintetizadas para Open Sans. Todas las variantes sintetizadas se generan a partir de una única fuente con un peso de 400. Como puedes ver, hay una diferencia notable en los resultados. No se especifican los detalles de cómo generar las variantes en negrita y oblicua. Por lo tanto, los resultados varían de un navegador a otro y dependen en gran medida de la fuente.

{% Aside %} Para obtener la mejor consistencia y resultados visuales, no confíes en la síntesis de fuentes. En su lugar, minimiza la cantidad de variantes de fuentes utilizadas y especifica tus ubicaciones, de modo que el navegador pueda descargarlas cuando se utilicen en la página. O elije utilizar una fuente variable. Dicho esto, en algunos casos una variante sintetizada [puede ser una opción viable](https://www.igvita.com/2014/09/16/optimizing-webfont-selection-and-synthesis/), pero de igual manera, ten cuidado al usar variantes sintetizadas. {% endAside %}

## Lista de verificación de optimización del tamaño de WebFont

- **Audita y controla el uso de fuentes:** No utilices demasiadas fuentes en tus páginas y, para cada fuente, minimiza la cantidad de variantes utilizadas. Esto ayuda a producir una experiencia más consistente y más rápida para tus usuarios.
- **Realiza subconjuntos de tus recursos de fuentes:** Muchas fuentes pueden ser agregados como subconjuntos o dividirse en múltiples rangos Unicode para entregar solo los glifos que requiere una página en particular. Esto reduce el tamaño del archivo y mejora la velocidad de descarga del recurso. Sin embargo, al definir los subconjuntos, ten cuidado de optimizar para la reutilización de fuentes. Por ejemplo, no descargues un conjunto de caracteres diferente pero que se superpone en cada página. Una buena práctica es crear subconjuntos basados en la escritura: por ejemplo, latín y cirílico.
- **Entrega formatos de fuente optimizados para cada navegador:** Proporciona cada fuente en formatos WOFF 2.0, WOFF, EOT y TTF. Asegúrate de aplicar compresión GZIP a los formatos EOT y TTF, ya que no están comprimidos de forma predeterminada.
- **Dé prioridad a `local()` en su lista `src`** : enumerar `local('Font Name')` primero en su `src` asegura que las solicitudes HTTP no se realicen para fuentes que ya están instaladas.
- **Utiliza [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)** para probar la [compresión de texto](/uses-text-compression/).
