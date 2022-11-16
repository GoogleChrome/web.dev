---
layout: post
title: Los enlaces a destinos de origen cruzado no son seguros
description: |2-

  Obtenga información sobre cómo vincular  recursos en otro host de forma segura.
web_lighthouse:
  - external-anchors-use-rel-noopener
date: 2019-05-02
updated: 2019-08-28
---

Cuando se vincula a una página de otro sitio mediante el atributo `target="_blank"`, puede exponer su sitio a problemas de rendimiento y seguridad:

- La otra página puede ejecutarse en el mismo proceso que su página. Si la otra página ejecuta mucho JavaScript, el rendimiento de su página puede verse afectado.
- La otra página puede acceder a su objeto de `window` con la propiedad `window.opener`. Esto puede permitir que la otra página redirija su página a una URL maliciosa.

Agregar `rel="noopener"` o `rel="noreferrer"` a sus `target="_blank"` evita estos problemas.

{% Aside %} A partir de la versión 88 de Chromium, los anclajes con `target="_blank"` obtienen automáticamente un [comportamiento `noopener` de forma predeterminada](https://www.chromestatus.com/feature/6140064063029248). La especificación explícita de `rel="noopener"` ayuda a proteger a los usuarios de navegadores heredados, incluidos Edge Legacy e Internet Explorer. {% endAside %}

## Cómo fallar la auditoría de destino de origen cruzado de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) señala enlaces inseguros a destinos de origen cruzado:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ztiQKS8eOfdzONC7bocp.png", alt="Auditoría Lighthouse que muestra enlaces inseguros a destinos de origen cruzado", width="800", height="213" %}</figure>

Lighthouse utiliza el siguiente proceso para identificar enlaces como inseguros:

1. Reúne todas las etiquetas `<a>` que contengan el atributo `target="_blank"`, pero no los `rel="noopener"` o `rel="noreferrer"`.
2. Filtra los enlaces del mismo host.

Debido a que Lighthouse filtra los enlaces del mismo host, existe una situación limítrofe que debe tener en cuenta si está trabajando en un sitio grande: si una página contiene un enlace `target="_blank"` a otra página de su sitio sin usar `rel="noopener"`, las implicaciones de rendimiento de esta auditoría aún se aplican. Sin embargo, no verá estos enlaces en los resultados de Lighthouse.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Cómo mejorar el rendimiento de su sitio y prevenir vulnerabilidades de seguridad

Agregue `rel="noopener"` o `rel="noreferrer"` a cada enlace identificado en su informe Lighthouse. En general, cuando use `target="_blank"`, siempre agregue `rel="noopener"` o `rel="noreferrer"`:

```html
<a href="https://examplepetstore.com" target="_blank" rel="noopener">
  Example Pet Store
</a>
```

- `rel="noopener"` evita que la nueva página pueda acceder a la `window.opener` y garantiza que se ejecute en un proceso separado.
- `rel="noreferrer"` tiene el mismo efecto, pero también evita que la cabecera `Referer` se envíe a la nueva página. Consulte [Tipo de enlace "noreferrer"](https://html.spec.whatwg.org/multipage/links.html#link-type-noreferrer).

Consulte la publicación [Compartir recursos de origen cruzado de forma segura](/cross-origin-resource-sharing/) para obtener más información.

## Recursos

- [Código fuente para la auditoría **Enlaces a destinos de origen cruzado inseguros**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/external-anchors-use-rel-noopener.js)
- [Comparta recursos de origen cruzado de forma segura](/cross-origin-resource-sharing/)
- [Aislamiento del sitio para desarrolladores web](https://developers.google.com/web/updates/2018/07/site-isolation)
