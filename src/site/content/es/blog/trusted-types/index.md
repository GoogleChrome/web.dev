---
title: Evita las vulnerabilidades de secuencias de comandos en sitios cruzados basadas en DOM con Trusted Types
subhead: Reduce la superficie de ataque DOM XSS de tu aplicación.
authors:
  - koto
date: 2020-03-25
hero: image/admin/3Mgu37qU0P4fVdI4NTxM.png
alt: Fragmentos de código que demuestran las vulnerabilidades de secuencias de comandos en sitios cruzados.
description: |2-

  Presentamos Trusted Types (Tipos de confianza): una API del navegador para evitar ataques de cross-site scripting (secuencias de comandos en sitios cruzados) basados en DOM en las aplicaciones modernas de la web.
tags:
  - blog
  - security
feedback:
  - api
---

## ¿Por qué debería preocuparte?

El cross-site scripting (secuencias de comandos en sitios cruzados) basado en DOM (DOM XSS) es una de las vulnerabilidades de la seguridad web más comunes y fáciles de introducir en tu aplicación. [Trusted Types](https://github.com/w3c/webappsec-trusted-types) te brinda las herramientas para escribir, revisar la seguridad y mantener las aplicaciones libres de vulnerabilidades DOM XSS haciendo que las peligrosas funciones de la API web sean seguras de manera predeterminada. Trusted Types es compatible con Chrome 83 y cuenta con un [polyfill](https://github.com/w3c/webappsec-trusted-types#polyfill) disponible para otros navegadores. Consulta [Compatibilidad con navegadores](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types#browser_compatibility) para obtener información actualizada sobre compatibilidad con varios navegadores.

{% Aside 'key-term' %} La secuencia de comandos en sitios cruzados basados en DOM ocurre cuando los datos de una *fuente* controlada por el usuario (como el nombre de usuario o la URL de redireccionamiento tomada del fragmento de URL) llegan a un *receptor*, una función como `eval()` o un creador de propiedades como `.innerHTML`, que puede escribir código JavaScript arbitrario y ejecutarlo mediante una de estas funciones. {% endAside %}

## Antecedentes

Durante muchos años, [DOM XSS](https://owasp.org/www-community/attacks/xss/) ha sido una de las vulnerabilidades de seguridad web más frecuentes y peligrosas.

Hay dos grupos distintos de secuencias de comandos entre sitios. Algunas vulnerabilidades XSS son causadas por el código del lado del servidor que crea de manera insegura el código HTML que forma el sitio web. Otras tienen su origen en el cliente, donde el código JavaScript llama a funciones peligrosas con contenido controlado por el usuario.

Para [evitar XSS del lado del servidor](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), no generes HTML concatenando cadenas y utiliza bibliotecas de plantillas seguras con escape automático contextual. Usa una [Política de seguridad de contenido basada en nonce](https://csp.withgoogle.com/docs/strict-csp.html) para una mitigación adicional contra los errores, ya que inevitablemente se producen.

Ahora, un navegador también puede ayudar a prevenir los XSS del lado del cliente (también conocidos como basados en DOM) con [Trusted Types](https://bit.ly/trusted-types).

## Introducción a la API

Trusted Types funciona bloqueando las siguientes funciones de sumidero de riesgo. Es posible que ya reconozcas algunas de ellas, ya que los proveedores de navegadores y [los marcos web](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) ya te alejan del uso de estas funciones por razones de seguridad.

- **Manipulación de guiones** :<br> [`<script src>`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-src) y configurar el contenido del texto de los elementos [`<script>`](https://developer.mozilla.org/docs/Web/HTML/Element/script).

- **Generación de HTML a partir de una cadena**:<br>

    [`innerHTML`](https://developer.mozilla.org/docs/Web/API/Element/innerHTML), [`outerHTML`](https://developer.mozilla.org/docs/Web/API/Element/outerHTML),[`insertAdjacentHTML`](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML), [`<iframe> srcdoc`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#attr-srcdoc), [`document.write`](https://developer.mozilla.org/docs/Web/API/Document/write), [`document.writeln`](https://developer.mozilla.org/docs/Web/API/Document/writeln) y [`DOMParser.parseFromString`](https://developer.mozilla.org/docs/Web/API/DOMParser#DOMParser.parseFromString)

- **Ejecutar contenido del complemento (plugin)**:<br> [`<embed src>`](https://developer.mozilla.org/docs/Web/HTML/Element/embed#attr-src), [`<object data>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-data) y [`<object codebase>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-codebase)

- **Compilar código JavaScript en tiempo de ejecución**:<br> `eval`, `setTimeout`, `setInterval`, `new Function()`

Trusted Types requiere que se procesen los datos antes de pasarlos a las funciones de sumidero mencionadas. El simple hecho de usar una cadena fallará, ya que el navegador no sabe si los datos son confiables:

{% Compare 'worse' %}

```javascript
anElement.innerHTML  = location.href;
```

{% CompareCaption %} Con Trusted Types habilitado, el navegador genera un *TypeError* y evita el uso de un receptor DOM XSS con una cadena. {% endCompareCaption %}

{% endCompare %}

Para indicar que los datos se procesaron de forma segura, crea un objeto especial - un Trusted Types.

{% Compare 'better' %}

```javascript
anElement.innerHTML = aTrustedHTML;
```

{% CompareCaption %} Con Trusted Types habilitado, el navegador acepta un `TrustedHTML` para receptores que esperan fragmentos de HTML. También hay `TrustedScript` y `TrustedScriptURL` para otros receptores sensibles. {% endCompareCaption %}

{% endCompare %}

Trusted Types reduce considerablemente la [superficie](https://en.wikipedia.org/wiki/Attack_surface) de ataque DOM XSS de tu aplicación. Simplifica las revisiones de seguridad y te permite hacer cumplir las verificaciones de seguridad basadas en tipos que se realizan al compilar, enlazar o empaquetar tu código en tiempo de ejecución, en el navegador.

## Cómo utilizar Trusted Types

### Prepárate para los informes de infracción de la política de seguridad de contenido

Puedes implementar un recopilador de informes (como el de código abierto [go-csp-collector](https://github.com/jacobbednarz/go-csp-collector)) o utilizar uno de los equivalentes comerciales. También puedes depurar las infracciones en el navegador:

```js
window.addEventListener('securitypolicyviolation',
    console.error.bind(console));
```

### Agregar un encabezado de CSP solo para informes

Agrega el siguiente encabezado de respuesta HTTP a los documentos que deseas migrar a Trusted Types.

```text
Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

Ahora todas las infracciones se informan a `//my-csp-endpoint.example`, pero el sitio web sigue funcionando. La siguiente sección explica cómo funciona  `//my-csp-endpoint.example`

{% Aside 'caution' %} Trusted Types solo está disponible en un [contexto seguro](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts) como HTTPS y `localhost`. {% endAside %}

### Identificar infracciones de Trusted Types

A partir de ahora, cada vez que Trusted Types detecte una infracción, se enviará un informe a un `report-uri` configurado. Por ejemplo, cuando tu aplicación pasa una cadena a `innerHTML`, el navegador envía el siguiente informe:

```json/6,8,10
{
"csp-report": {
    "document-uri": "https://my.url.example",
    "violated-directive": "require-trusted-types-for",
    "disposition": "report",
    "blocked-uri": "trusted-types-sink",
    "line-number": 39,
    "column-number": 12,
    "source-file": "https://my.url.example/script.js",
    "status-code": 0,
    "script-sample": "Element innerHTML <img src=x"
}
}
```

Esto dice que en `https://my.url.example/script.js` la línea 39 `innerHTML` fue llamado con la cadena que comienza con `<img src=x`. Esta información debería ayudarte a delimitar qué partes del código pueden estar introduciendo DOM XSS y deben cambiar.

{% Aside %} La mayoría de las infracciones como esta también se pueden detectar ejecutando un linter de código o [verificadores de código estático](https://github.com/mozilla/eslint-plugin-no-unsanitized) en su base de código. Esto ayuda a identificar rápidamente una gran cantidad de infracciones.

Dicho esto, también debe analizar las infracciones de CSP, ya que se activan cuando se ejecuta el código no conforme. {% endAside %}

### Resolver las infracciones

Hay un par de opciones para corregir una infracción de Trusted Type. Puedes [eliminar el código infractor](#remove-the-offending-code), [utilizar una biblioteca](#use-a-library), [crear una política de Trusted Type](#create-a-trusted-type-policy) o, como último recurso, [crear una política predeterminada](#create-a-default-policy).

#### Vuelve a escribir el código infractor

¿Quizás la funcionalidad no conforme ya no sea necesaria o se pueda reescribir de una manera moderna sin usar las funciones propensas a errores?

{% Compare 'worse' %}

```javascript
el.innerHTML = '<img src=xyz.jpg>';
```

{% endCompare %}

{% Compare 'better' %}

```javascript
el.textContent = '';
const img = document.createElement('img');
img.src = 'xyz.jpg';
el.appendChild(img);
```

{% endCompare %}

#### Usa una biblioteca

Algunas bibliotecas ya generan tipos de confianza que puede pasar a las funciones de receptor. Por ejemplo, puedes usar [DOMPurify](https://github.com/cure53/DOMPurify) para desinfectar un fragmento de HTML, eliminando cargas útiles XSS.

```javascript
import DOMPurify from 'dompurify';
el.innerHTML = DOMPurify.sanitize(html, {RETURN_TRUSTED_TYPE: true});
```

DOMPurify [admite Trusted Types](https://github.com/cure53/DOMPurify#what-about-dompurify-and-trusted-types) y devolverá HTML desinfectado envuelto en un `TrustedHTML` de manera que el navegador no genere una infracción. {% Aside 'caution' %} Si la lógica de desinfección en DOMPurify tiene errores, es posible que tu aplicación aún tenga una vulnerabilidad DOM XSS. Los tipos de confianza lo obligan a procesar un valor de *alguna manera*, pero aún no define cuáles son las reglas de procesamiento exactas y si son seguras. {% endAside %}

#### Crea una política de Trusted Type

A veces no es posible eliminar la funcionalidad y no existe una biblioteca para desinfectar el valor y crear un tipo de confianza para ti. En esos casos, crea para ti mismo un objeto Trusted Type.

Para eso, primero crea una [política](https://w3c.github.io/webappsec-trusted-types/dist/spec/#policies-hdr). Las políticas son fábricas de tipos de confianza que imponen ciertas reglas de seguridad en sus entradas:

```javascript/2
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: string => string.replace(/\</g, '<')
  });
}
```

Este código crea una política llamada `myEscapePolicy` que puede producir `TrustedHTML` través de su función `createHTML()`. Las reglas definidas con HTML-escape `<` caracteres evitarán la creación de nuevos elementos HTML.

Utiliza la política de esta manera:

```javascript
const escaped = escapeHTMLPolicy.createHTML('<img src=x onerror=alert(1)>');
console.log(escaped instanceof TrustedHTML);  // true
el.innerHTML = escaped;  // '<img src=x onerror=alert(1)>'
```

{% Aside %} Mientras que la función de JavaScript pasada a `trustedTypes.createPolicy()` como `createHTML()` devuelve una cadena, `createPolicy()` devuelve un objeto de política que envuelve el valor de retorno en un tipo correcto, en este caso `TrustedHTML`. {% endAside %}

#### Utiliza una política predeterminada

A veces no se puede cambiar el código infractor. Por ejemplo, este es el caso si está cargando una biblioteca de terceros desde una CDN. En ese caso, utilice una [política predeterminada](https://w3c.github.io/webappsec-trusted-types/dist/spec/#default-policy-hdr):

```javascript
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => DOMPurify.sanitize(string, {RETURN_TRUSTED_TYPE: true})
  });
}
```

La política con un nombre `default` se usa siempre que se usa una cadena en un receptor que solo acepta Trusted Type. {% Aside 'gotchas' %} Usa la política predeterminada con moderación prefiriendo refactorizar la aplicación para usar políticas regulares en su lugar. Hacerlo, fomenta los diseños en los que las reglas de seguridad están cerca de los datos que procesan, donde tiene el mayor contexto para desinfectar correctamente el valor. {% endAside %}

### Pasa a aplicar la política de seguridad de contenidos

Cuando su aplicación ya no produzca infracciones, puede comenzar a hacer cumplir los tipos de confianza:

```text
Content-Security-Policy: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

¡Ya está! Ahora, no importa cuán compleja sea tu aplicación web, lo único que puede introducir una vulnerabilidad DOM XSS es el código en una de tus políticas, y puedes bloquearlo aún más [limitando la creación de políticas](https://w3c.github.io/webappsec-trusted-types/dist/spec/#trusted-types-csp-directive).

## Otras lecturas

- [Tipos de confianza GitHub](https://github.com/w3c/webappsec-trusted-types)
- [Borrador de la especificación W3C](https://w3c.github.io/webappsec-trusted-types/dist/spec/)
- [Preguntas más frecuentes](https://github.com/w3c/webappsec-trusted-types/wiki/FAQ)
- [Integraciones](https://github.com/w3c/webappsec-trusted-types/wiki/Integrations)
