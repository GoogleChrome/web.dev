---
layout: post
title: Accesibilidad de color y contraste
authors:
  - dgash
  - megginkearney
  - rachelandrew
  - robdodson
date: 2020-03-31
updated: 2020-05-29
description: |2

  Si tiene buena visión, es fácil suponer que todos perciben los colores o la legibilidad del texto de la misma manera que usted, pero, por supuesto, ese no es el caso.
tags:
  - accessibility
---

Si tiene una buena visión, es fácil suponer que todos perciben los colores o la legibilidad del texto de la misma manera que usted, pero, por supuesto, ese no es el caso.

Como puede imaginar, algunas combinaciones de colores que son fáciles de leer para algunas personas son difíciles o imposibles para otras. Esto generalmente se reduce al contraste de color, la relación entre la luminancia de los colores de primer plano y de fondo. Cuando los colores son similares, la relación de contraste es baja; cuando son diferentes, la relación de contraste es alta.

Las [pautas de WebAIM](https://webaim.org/standards/wcag/) recomiendan una relación de contraste AA (mínima) de 4.5: 1 para todo el texto. Se hace una excepción para el texto muy grande (120-150% más grande que el texto del cuerpo predeterminado), para el cual la proporción puede bajar a 3: 1. Observe la diferencia en las relaciones de contraste que se muestran a continuación.

<figure>{% Img src="image/admin/DcYclKelVqhQ2CWlIG97.jpg", alt="Una imagen que muestra las diferentes relaciones de contraste", width="800", height="328"%}</figure>

Se eligió la relación de contraste de 4.5: 1 para el nivel AA porque compensa la pérdida de sensibilidad al contraste que suelen experimentar los usuarios con una pérdida de visión equivalente a aproximadamente una visión 20/40. Una agudeza visual de 20/40 se considera comúnmente como típica de personas de aproximadamente 80 años. Para usuarios con problemas de visión baja o deficiencias de color, podemos aumentar el contraste hasta 7: 1 para el texto del cuerpo.

Puede utilizar la Auditoría de accesibilidad en Lighthouse para comprobar el contraste de color. Abra DevTools, haga clic en Auditorías y seleccione Accesibilidad para ejecutar el informe.

<figure>{% Img src = "image/admin/vSFzNOurQO6z2xV6qWuW.png", alt = "Una captura de pantalla de la salida de una auditoría para el contraste de color.", width = "800", height = "218"%}</figure>

Chrome también incluye una función experimental para ayudarlo a [detectar todos los textos de bajo contraste de su página](https://developers.google.com/web/updates/2020/10/devtools#css-overview) . También puede utilizar la [sugerencia de color accesible](https://developers.google.com/web/updates/2020/08/devtools#accessible-color) para corregir el texto de bajo contraste.

<figure>{% Img src = "image/admin/VYZeK2l2vs6pIoWhH2hO.png", alt="Una captura de pantalla del resultado de la función experimental de texto de bajo contraste de Chrome.", width="800", height="521" %}</figure>

Para obtener un informe más completo, instale la [extensión Accessibility Insights](https://accessibilityinsights.io/). Una de las comprobaciones del informe Fastpass es el contraste de color. Obtendrá un informe detallado de cualquier elemento defectuoso.

<figure>{% Img src = "image/admin/CR21TFMZw8gWsSTWOGIF.jpg", alt = "El informe en Accessibility Insights", width = "800", height = "473"%}</figure>

## Algoritmo de contraste de percepción avanzado (APCA)

El [algoritmo de contraste de percepción avanzado (APCA)](https://w3c.github.io/silver/guidelines/methods/Method-font-characteristic-contrast.html) es una nueva forma de calcular el contraste basada en la investigación moderna sobre la percepción del color.

En comparación con las pautas [AA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum)/[AAA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-enhanced), el APCA depende más del contexto.

El contraste se calcula en función de las siguientes características:

- Propiedades espaciales (peso de la fuente y tamaño del texto)
- Color del texto (diferencia de luminosidad percibida entre el texto y el fondo)
- Contexto (luz ambiental, entorno y propósito previsto del texto)

Chrome incluye una [función experimental para reemplazar las pautas de relación de contraste AA / AAA con APCA](https://developers.google.com/web/updates/2021/01/devtools#apca) .

<figure>{% Img src="image/admin/YhGKRLYvt37j3ldlwiXE.png", alt="Una captura de pantalla de la salida de la función APCA en Chrome.", width="800", height="543"%}</figure>

## No transmita información solo con colores

Hay aproximadamente 320 millones de personas en todo el mundo con deficiencia de visión de los colores. Aproximadamente 1 de cada 12 hombres y 1 de cada 200 mujeres tienen alguna forma de "daltonismo"; eso significa que alrededor de una vigésima parte, o el 5%, de sus usuarios no experimentarán su sitio de la manera deseada. Cuando confiamos en el color para transmitir información, llevamos ese número a niveles inaceptables.

{% Aside %} Nota: El término "daltonismo" se utiliza a menudo para describir una condición visual en la que una persona tiene problemas para distinguir los colores, pero de hecho, muy pocas personas son realmente daltónicas. La mayoría de las personas con deficiencias de visión de color pueden ver algunos o la mayoría de los colores, pero tienen dificultades para diferenciar algunos, como rojos y verdes (los más comunes), marrones y naranjas, y azules y púrpuras. {% endAside %}

Por ejemplo, en un formulario de entrada, un número de teléfono puede estar subrayado en rojo para indicar que no es válido. Pero a un usuario de lector de pantalla o de color deficiente, esa información no se transmite bien, si es que se transmite. Por lo tanto, siempre debe intentar proporcionar múltiples vías para que el usuario acceda a información crítica.

<figure style="width: 200px">{% Img src="image/admin/MKmlhejyjNpk7XE9R2KV.png", alt="Una imagen de un formulario de entrada con un número de teléfono incorrecto resaltado solo con un color rojo.", width="293", height="323" %}</figure>

La [lista de verificación de WebAIM establece en la sección 1.4.1](https://webaim.org/standards/wcag/checklist#sc1.4.1) que "el color no debe usarse como el único método para transmitir contenido o distinguir elementos visuales". También señala que "el color solo no debe usarse para distinguir los enlaces del texto circundante" a menos que cumplan ciertos requisitos de contraste. En cambio, la lista de verificación recomienda agregar un indicador adicional, como un guión bajo (usando la propiedad CSS `text-decoration`) para indicar cuándo el enlace está activo.

Una forma fácil de corregir el ejemplo anterior es agregar un mensaje adicional al campo, anunciando que no es válido y por qué.

<figure style="width: 200px">{% Img src = "image/admin/FLQPcG16akNRoElx3pnz.png", alt = "El mismo formulario de entrada que en el último ejemplo, esta vez con una etiqueta de texto que indica el problema con el campo.", width="292", height="343" %}</figure>

Cuando cree una aplicación, tenga en cuenta este tipo de cosas y tenga cuidado con las áreas en las que puede depender demasiado del color para transmitir información importante.

Si tiene curiosidad acerca de cómo se ve su sitio para diferentes personas, o si depende en gran medida del uso del color en su interfaz de usuario, puede usar DevTools para simular varias formas de discapacidad visual, incluidos diferentes tipos de daltonismo. Chrome incluye una función [Emular deficiencias visuales](https://developers.google.com/web/updates/2020/03/devtools#vision-deficiencies). Para acceder a él, abra DevTools y luego abra la **pestaña Renderización** en el cuadro, y así podrá emular las siguientes deficiencias de color.

- Protanopia: incapacidad para percibir la luz roja.
- Deuteranopia: incapacidad para percibir la luz verde.
- Tritanopia: incapacidad para percibir la luz azul.
- Acromatopsia: incapacidad para percibir cualquier color excepto los tonos de gris (extremadamente raro).

<figure>{% Img src="image/admin/VAnFxYhzFcpovdTCToPl.jpg", alt="Emular la visión de una persona con acromatopsia muestra nuestra página en escala de grises.", width="800", height="393" %}</figure>

## Modo de alto contraste

El modo de alto contraste permite al usuario invertir los colores de primer plano y de fondo, lo que a menudo ayuda a que el texto se destaque mejor. Para alguien con una discapacidad de baja visión, el modo de alto contraste puede facilitar la navegación por el contenido de la página. Hay algunas formas de obtener una configuración de alto contraste en su máquina.

Los sistemas operativos como Mac OSX y Windows ofrecen modos de alto contraste que se pueden habilitar para todo en el nivel del sistema.

Un ejercicio útil es activar la configuración de alto contraste y verificar que toda la interfaz de usuario de su aplicación aún sea visible y utilizable.

Por ejemplo, una barra de navegación puede usar un color de fondo sutil para indicar qué página está seleccionada actualmente. Si lo ve en una extensión de alto contraste, esa sutileza desaparece por completo, y con ella desaparece la comprensión del lector de qué página está activa.

<figure style="width: 500px">{% Img src="image/admin/dgmA4W1Qu8JmcgsH80HD.png", alt="Captura de pantalla de una barra de navegación en modo de alto contraste donde la pestaña activa es difícil de leer", width="640", height="57" %}</figure>

De manera similar, si considera el ejemplo de la lección anterior, el subrayado rojo en el campo del número de teléfono no válido puede mostrarse en un color azul-verde difícil de distinguir.

<figure>{% Img src="image/admin/HtlXwmHQHBcAO4LYSfAA.jpg", alt="Captura de pantalla del formulario de dirección utilizado anteriormente, esta vez en modo de alto contraste. El cambio de color del elemento no válido es difícil de leer.",  width="700", height="328" %}</figure>

Si cumple con los índices de contraste mencionados anteriormente, debería poder soportar el modo de alto contraste. Pero para mayor tranquilidad, considere la posibilidad de instalar la [extensión de Chrome de alto contraste](https://chrome.google.com/webstore/detail/high-contrast/djcfdncoelnlbldjfhinnjlhdjlikmph) y revise su página para comprobar que todo funciona y se ve como se espera.
