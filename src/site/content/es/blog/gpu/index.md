---
title: Acceda a funciones modernas de GPU con WebGPU
subhead: |2-

  WebGPU permite gráficos 3D de alto rendimiento y cálculo paralelo de datos en

  La web.
authors:
  - beaufortfrancois
  - cwallez
date: 2021-08-26
updated: 2021-11-24
hero: image/vvhSqZboQoZZN9wBvoXq72wzGAf1/SN6GIsxmcINXJZKszOTr.jpeg
thumbnail: image/vvhSqZboQoZZN9wBvoXq72wzGAf1/SN6GIsxmcINXJZKszOTr.jpeg
description: |2

  WebGPU permite gráficos 3D de alto rendimiento y cálculo paralelo de datos en

  La web.
origin_trial:
  url: "https://developer.chrome.com/origintrials/#/view_trial/118219490218475521"
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - games
feedback:
  - api
stack_overflow_tag: webgpu
---

## ¿Qué es WebGPU? {: #what }

[WebGPU](https://gpuweb.github.io/gpuweb/) es una nueva API web que expone las capacidades gráficas de sistemas modernos, específicamente Direct3D 12, Metal y Vulkan, para realizar operaciones de renderizado y cálculo en una unidad de procesamiento gráfico (GPU).

<figure>{% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/WHoJmX2IU7roV4iabH6M.png", alt="Architecture diagram showing WebGPUs connection between OS APIs and Direct3D 12, Metal, and Vulkan.", width="800", height="313" %} <figcaption>Diagrama de arquitectura WebGPU</figcaption></figure>

Este objetivo es similar al de la familia de APIs [WebGL](https://developer.mozilla.org/docs/Web/API/WebGL_API), pero WebGPU permite el acceso a funciones más avanzadas de las GPUs. Mientras que WebGL es principalmente para dibujar imágenes, y también se puede utilizar con gran esfuerzo para otros tipos de cálculos, WebGPU proporciona soporte de primera clase para realizar cálculos generales en la GPU.

Después de cuatro años de desarrollo en el [grupo comunitario "GPU para la Web" de W3C](https://www.w3.org/community/gpu/), WebGPU ya está lista para que los desarrolladores la prueben en Chrome y brinden comentarios sobre la API y el lenguaje de sombreado.

{% Blockquote 'Mr.doob, Creator of Three.js' %} "Tras una década en la que WebGL ha llevado los gráficos 3D a la web y ha permitido todo tipo de nuevas experiencias, ha llegado el momento de actualizar la pila y ayudar a los desarrolladores web a aprovechar al máximo las tarjetas gráficas modernas. ¡WebGPU llega justo a tiempo!" {% endBlockquote %}

{% Blockquote 'David Catuhe, Creator of Babylon.js' %} WebGPU nos acerca al metal y también desbloquea el poder del sombreador de cómputo para desarrolladores web. Hoy se pueden crear nuevas experiencias 3D en [Babylon.js Playground](https://playground.babylonjs.com/#XCNL7Y). {% endBlockquote %}

<figure>{% Video src="video/vvhSqZboQoZZN9wBvoXq72wzGAf1/Xb7LvsJ5e8efTssp94c6.mov", autoplay=true, muted=true, playsinline=true, loop=true %} <figcaption> Una demostración en Babylon.js de la simulación de un mar embravecido utilizando la capacidad de sombreado de cómputo de WebGPU. </figcaption></figure>

## Estado actual {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Paso</th>
<th data-md-type="table_cell">Estado</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crear un explicador</td>
<td data-md-type="table_cell"><a href="https://gpuweb.github.io/gpuweb/explainer/" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crear borrador inicial de especificación</td>
<td data-md-type="table_cell"><a href="https://gpuweb.github.io/gpuweb/" data-md-type="link">En curso</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Recoger opiniones y repetir el diseño</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">En curso</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. <strong data-md-type="double_emphasis">Prueba de origen</strong>
</td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis"><p data-md-type="paragraph"><a href="https://developer.chrome.com/origintrials/#/view_trial/118219490218475521" data-md-type="link">En curso</a></p></strong></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Iniciar</td>
<td data-md-type="table_cell">Sin comenzar</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Cómo usar WebGPU {: #use }

### Habilitación a través de about: // flags

Para experimentar con WebGPU localmente, sin un token de prueba de origen, habilita `#enable-unsafe-webgpu` en `about://flags`.

### Soporte durante la fase de prueba de origen

A partir de Chrome 94, WebGPU está disponible como prueba de origen en Chrome. Se espera que la prueba de origen finalice en Chrome 101 (18 de mayo de 2022).

{% include 'content/origin-trials.njk' %}

### Registrarse para la prueba de origen {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Detección de características {: #feature-deployment }

Para verificar si WebGPU es compatible, usa:

```js
if ("gpu" in navigator) {
  // WebGPU is supported! 🎉
}
```

{% Aside 'caution' %} El adaptador de GPU devuelto por `navigator.gpu.requestAdapter()` puede ser `null`. {% endAside %}

### Comenzar {: #get-started }

WebGPU es una API de bajo nivel, como WebGL. Es muy potente, bastante detallada y requiere comprender conceptos claves antes de sumergirse en ella. Por eso, en este artículo te enlazaré a contenidos existentes de alta calidad para que te inicies en WebGPU.

- [Empieza a utilizar GPU Compute en la web](/gpu-compute/)
- [Una muestra de WebGPU en Firefox](https://hacks.mozilla.org/2020/04/experimental-webgpu-in-firefox/)
- [WebGPU para desarrolladores de Metal, primera parte](https://metalbyexample.com/webgpu-part-one/)
- [Aprende qué tipos y estructuras de datos clave se necesitan para dibujar en WebGPU](https://alain.xyz/blog/raw-webgpu)
- [Explicador de WebGPU](https://gpuweb.github.io/gpuweb/explainer/)
- [Mejores prácticas de WebGPU](https://toji.github.io/webgpu-best-practices/)

## Compatibilidad con navegadores {: #browser-support }

WebGPU está disponible en determinados dispositivos de ChromeOS, macOS y Windows 10 en Chrome 94 y se admitirán más dispositivos en el futuro. La compatibilidad experimental con Linux está disponible ejecutando Chrome con `--enable-features=Vulkan`. Más adelante habrá más soporte para más plataformas.

La lista completa de problemas conocidos está disponible en el [documento de Advertencias de la Prueba de Origin](https://hackmd.io/QcdsK_g7RVKRCIIBqgs5Hw).

En el momento de redactar este artículo, la compatibilidad con WebGPU está en curso en [Safari](https://webkit.org/blog/9528/webgpu-and-wsl-in-safari/) y [Firefox](https://hacks.mozilla.org/2020/04/experimental-webgpu-in-firefox/).

## Soporte de plataformas {: #platform-support }

Al igual que en el mundo de WebGL, algunas bibliotecas también implementan WebGPU:

- [Dawn](https://dawn.googlesource.com/dawn) es una implementación C++ de WebGPU utilizada en Chromium. Se puede usar para apuntar a WebGPU en aplicaciones C y C++ que luego se pueden portar a [WebAssembly](https://developer.mozilla.org/docs/WebAssembly) usando [Emscripten](https://emscripten.org/) y aprovechar automáticamente WebGPU en el navegador.
- [Wgpu](https://sotrh.github.io/learn-wgpu/#what-is-wgpu) es una implementación de Rust de WebGPU utilizada en Firefox. Es utilizado por varias aplicaciones de GPU en el ecosistema de Rust, por ejemplo [Veloren](https://veloren.net/devblog-125/), un juego de rol multijugador de voxel.

## Demos {: #demos }

- [Muestras de WebGPU](https://austin-eng.com/webgpu-samples/)
- [Metaballs renderizados en WebGPU](https://toji.github.io/webgpu-metaballs/)
- [Sombreado directo agrupado de WebGPU](https://toji.github.io/webgpu-clustered-shading/)

## Seguridad y privacidad {: #security-privacy }

Para garantizar que una página web solo pueda funcionar con sus propios datos, todos los comandos se validan estrictamente antes de que lleguen a la GPU. Consulta la sección [Consideraciones sobre el uso malicioso](https://gpuweb.github.io/gpuweb/#malicious-use) de la especificación de WebGPU para obtener más información sobre las compensaciones de seguridad relacionadas con los errores de los controladores, por ejemplo.

## Comentarios {: #feedback }

El equipo de Chrome desea conocer tus experiencias con WebGPU.

### Contanos sobre el diseño de la API

¿Hay algo sobre la API o el lenguaje de sombreado que no funciona como esperabas? ¿O faltan métodos o propiedades que necesitas para implementar tu idea? ¿Tienes alguna pregunta o comentario sobre el modelo de seguridad? Presenta un tema en el [repositorio de GitHub](https://github.com/gpuweb/gpuweb/issues/) correspondiente o agrega tus ideas a un tema existente.

### Informar problemas sobre la implementación

¿Encontraste un error con la implementación de Chrome? ¿O la implementación es diferente de la especificación? Presenta tu error en [new.crbug.com](https://new.crbug.com). Asegúrate de incluir tantos detalles como puedas, como el contenido de la página interna `about:gpu`, instrucciones simples para reproducirlo e ingresa `Blink>WebGPU` en la casilla **Componentes.** [Glitch](https://glitch.com/) funciona muy bien para compartir repros rápidos y fáciles.

### Mostrar soporte para WebGPU

¿Estás pensando en utilizar WebGPU? Su apoyo público ayuda al equipo de Chrome a priorizar funciones y mostrar a otros proveedores de navegadores lo importante que es brindarles soporte.

Envía un tweet a [@ChromiumDev](https://twitter.com/ChromiumDev) usando el hashtag[`#WebGPU`](https://twitter.com/search?q=%23WebGPU&src=recent_search_click&f=live) y hacenos saber dónde y cómo lo estás usando. También puedes hacer una pregunta en StackOverflow con el hashtag [`#webgpu`](https://stackoverflow.com/questions/tagged/webgpu).

## Enlaces útiles {: #helpful }

- [Explicador público](https://gpuweb.github.io/gpuweb/explainer/)
- [Especificaciones de API de WebGPU](https://gpuweb.github.io/gpuweb/)
- [Lenguaje de sombreado de WebGPU (WGSL)](https://gpuweb.github.io/gpuweb/wgsl/)
- [Error de seguimiento de Cromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1156646)
- [Entrada de ChromeStatus.com](https://chromestatus.com/feature/6213121689518080)
- Componente Blink: [`Blink>WebGPU`](https://chromestatus.com/features#component%3ABlink%3EWebGPU)
- [Revisión de TAG](https://github.com/w3ctag/design-reviews/issues/626)
- [Intención de experimentar](https://groups.google.com/a/chromium.org/g/blink-dev/c/K4_egTNAvTs/m/ApS804L_AQAJ)
- [Canal matriz de WebGPU](https://matrix.to/#/#WebGPU:matrix.org)

## Agradecimientos {: #acknowledgements }

Imagen de héroe a través de [Maxime Rossignol](https://unsplash.com/@maxoor) en [Unsplash](https://unsplash.com/photos/ukOCJ09jpgc).
