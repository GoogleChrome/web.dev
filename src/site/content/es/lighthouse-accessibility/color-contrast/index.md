---
layout: post
title: Los colores del fondo y del primer plano no tienen una suficiente relación de contraste
description: |2

  Aprenda a mejorar la accesibilidad de su página web asegurándose de que

  todo el texto tiene suficiente contraste de color.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - color-contrast
---

Los textos que tienen una relación de contraste baja, es decir, textos cuyos brillos están demasiado cerca del brillo del fondo, pueden ser difíciles de leer. Por ejemplo, presentar un texto gris claro sobre un fondo blanco hace que a los usuarios les sea más difícil distinguir las formas de los caracteres, lo que puede reducir la comprensión lectora y ralentizar la velocidad de lectura.

Si bien este problema es particularmente desafiante para las personas con mala visión, el texto con bajo contraste puede afectar negativamente la experiencia de lectura de todos tus usuarios. Por ejemplo, si alguna vez has leído algo en tu dispositivo móvil en el exterior, probablemente hayas experimentado la necesidad de un texto con suficiente contraste.

## Cómo falla la auditoría de Lighthouse sobre el contraste de color

Lighthouse señala los textos cuyos colores de fondo y de primer plano no tienen una relación de contraste suficientemente alta:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hD4Uc22QqAdrBLdRPhJe.png", alt="Auditoría de Lighthouse que muestra que los colores de fondo y de primer plano no tienen una relación de contraste suficiente", width="800", height="343" %}</figure>

Para evaluar el contraste de color del texto, Lighthouse utiliza el <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">criterio de éxito 1.4.3 de WCAG 2.1</a>:

- El texto de 18 puntos o 14 puntos y en negrita necesita una relación de contraste de 3:1.
- El resto del texto necesita una relación de contraste de 4.5:1.

Debido a la naturaleza de la auditoría, Lighthouse no puede verificar el contraste de color del texto superpuesto a una imagen.

{% Aside 'caution' %} En la versión 2.1, WCAG expandió sus requisitos de contraste de color para [incluir elementos e imágenes de la interfaz de usuario](https://www.w3.org/TR/WCAG21/#non-text-contrast). Lighthouse no verifica estos elementos, pero debes de hacerlo manualmente para asegurarte de que todo tu sitio sea accesible para personas con mala visión. {% endAside %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo asegurarte de que el texto tenga suficiente contraste de color

Asegúrate de que todo el texto de tu página cumpla con las proporciones mínimas de contraste de color <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">especificadas por WCAG</a>:

- 3:1 para texto de 18 puntos o 14 puntos y en negrita
- 4.5:1 para el resto del texto

Una forma de encontrar un color que cumpla con los requisitos de contraste es utilizar el selector de color de Chrome DevTools:

1. Haz clic con el botón derecho (o `Command` + clic en Mac) en el elemento que deseas verificar y selecciona **Inspeccionar**.
2. En la pestaña de **Estilos** del panel de **Elementos**, busca el `color` del elemento.
3. Haz clic en la miniatura de color junto al valor.

El selector de color te indica si el elemento cumple con los requisitos de contraste de color, teniendo en cuenta el tamaño y el peso de la fuente:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/osaU6NOcyElBALiXmRa5.png", alt="Captura de pantalla del selector de color de Chrome DevTools con información de contraste de color resaltada", width="298", height="430" %}</figure>

Puedes usar el selector de color para ajustar el color hasta que tu contraste sea lo suficientemente alto. Es más fácil realizar ajustes en el modelo de color HSL. Cambia a ese formato haciendo clic en el botón de alternancia a la derecha del selector:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uUGdLr7fYCrmqtCrtpJK.png", alt="Captura de pantalla del selector de color de Chrome DevTools con el formato de color resaltado", width="298", height="430" %}</figure>

Una vez que tengas un valor de color que pase la prueba, actualiza el CSS de tu proyecto.

En los casos más complejos, como el texto en un degradado o el texto en una imagen, deben de verificarse manualmente, al igual que los elementos y las imágenes de la interfaz de usuario. Para el texto de una imagen, puedes utilizar el selector de color de fondo de DevTools para comprobar el fondo en el que aparece el texto:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PFznOtjzMF3nZy3IsCtW.png", alt="Captura de pantalla del selector de color de fondo de Chrome DevTools", width="301", height="431" %}</figure>

Para otros casos, considera usar una herramienta como el <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Colour Contrast Analyser (Analizador de contraste de color)</a> de Paciello Group.

## Recursos

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/color-contrast.js" rel="noopener">El código fuente para la auditoría de <strong>Los colores del fondo y del primer plano no tienen una suficiente relación de contraste</strong></a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/color-contrast" rel="noopener">Los elementos de texto deben tener suficiente contraste de color con el fondo (Deque University)</a>
- <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Colour Contrast Analyser (Analizador de contraste de color)</a>
