---
title: 'Promesas de JavaScript: una introducción'
subhead: |2-

  Las promesas simplifican los cálculos diferidos y asíncronos. Una promesa representa
  una operación que aún no se ha completado.
description: |2-

  Las promesas simplifican los cálculos diferidos y asíncronos. Una promesa representa
  una operación que aún no se ha completado.
date: 2013-12-16
updated: 2021-01-18
tags:
  - javascript
authors:
  - jakearchibald
feedback:
  - api
---

Desarrolladores, prepárense para un momento crucial en la historia del desarrollo web.

<em>[Comienza el redoble]</em>

¡Las promesas han llegado a JavaScript!

<em>[Explotan fuegos artificiales, llueve papel brillante desde arriba, la multitud se enloquece]</em>

En este punto, de seguro caes en una de estas categorías:

- La gente a tu alrededor están muy emocionadas, pero no estás seguro de qué se trata tanto alboroto. Tal vez ni siquiera estás seguro de qué es una "promesa". Te tomas de los hombros, pero el peso del papel brillante recae sobre los mismos. Si es así, no te preocupes por eso, me tomó años averiguar por qué debería preocuparme por estas cosas. Probablemente quieras empezar por el [principio](#whats-all-the-fuss-about).
- ¡Mandas tus puños al aire! Ya era hora, ¿verdad? Has usado estas cosas de Promise (promesas) antes, pero te molesta que todas las implementaciones tengan una API ligeramente diferente. ¿Cuál es la API de la versión oficial de JavaScript? Probablemente desees comenzar con la [terminología](#promise-terminology).
- Ya lo sabías y te burlas de los que están saltando como si fuera una novedad para ellos. Tomate un momento para disfrutar de tu propia superioridad para luego ir directamente a la [referencia del API](#promise-api-reference).

## ¿Qué es todo este alboroto? {: #whats-all-the-fuss-about }

JavaScript es de un solo subproceso (single thread), lo que significa que dos bits de secuencia de comandos no se pueden ser ejecutados al mismo tiempo; tienen que correr uno tras otro. En los navegadores, JavaScript comparte un hilo con un montón de otras cosas que difieren de un navegador a otro. Pero, por lo general, JavaScript está en la misma cola que pintar, actualizar estilos y manejar las acciones del usuario (como resaltar texto e interactuar con los controles del formulario). La actividad en una de estas cosas retrasa las demás.

Como seres humanos, somos multiproceso (multithreaded). Puedes teclear con varios dedos, puedes conducir y mantener una conversación al mismo tiempo. La única función de bloqueo con la que tenemos que lidiar es el estornudo, donde toda la actividad actual debe suspenderse mientras dure el estornudo. Eso es bastante molesto, especialmente cuando conduces e intentas mantener una conversación. No querrás escribir código que provoque un estornudo.

Probablemente ya hayas utilizado eventos y retrollamadas (callbacks) para evitar esto. Aquí están los eventos:

```js
var img1 = document.querySelector('.img-1');

img1.addEventListener('load', function() {
  // woo yey image loaded
});

img1.addEventListener('error', function() {
  // argh everything's broken
});
```

Esto no es un estornudo en lo absoluto. Obtenemos la imagen, agregamos un par de oyentes y luego JavaScript puede dejar de ejecutarse hasta que se llame a uno de esos oyentes.

Desafortunadamente, en el ejemplo anterior, es posible que los eventos ocurrieran antes de que comenzáramos a escucharlos, por lo que debemos solucionar esto mediante el uso de la propiedad "complete" de las imágenes:

```js
var img1 = document.querySelector('.img-1');

function loaded() {
  // woo yey image loaded
}

if (img1.complete) {
  loaded();
}
else {
  img1.addEventListener('load', loaded);
}

img1.addEventListener('error', function() {
  // argh everything's broken
});
```

Esto no capta imágenes con errores antes de que tuviéramos la oportunidad de escucharlas; desafortunadamente, el DOM no nos da una forma de hacerlo. Además, esto está cargando una imagen. Las cosas se vuelven aún más complejas si queremos saber cuándo se ha cargado un conjunto de imágenes.

## Los eventos no siempre son la mejor opción

Los eventos son excelentes para cosas que pueden suceder varias veces en el mismo objeto: `keyup`, `touchstart`, etc. Con esos eventos, realmente no te importa lo que sucedió antes de incluir al oyente. Pero cuando se trata de éxito o fracaso asíncrono, lo ideal es que utilices algo como esto:

```js
img1.callThisIfLoadedOrWhenLoaded(function() {
  // loaded
}).orIfFailedCallThis(function() {
  // failed
});

// and…
whenAllTheseHaveLoaded([img1, img2]).callThis(function() {
  // all loaded
}).orIfSomeFailedCallThis(function() {
  // one or more failed
});
```

Esto es lo que hacen las promesas, pero con un mejor nombre. Si los elementos de la imagen HTML tuvieran un método "listo" que devolviera una promesa, podemos hacer esto:

```js
img1.ready()
.then(function() {
  // loaded
}, function() {
  // failed
});

// and…
Promise.all([img1.ready(), img2.ready()])
.then(function() {
  // all loaded
}, function() {
  // one or more failed
});
```

En su forma más básica, las promesas son un poco como los oyentes de eventos, excepto:

- Una promesa solo puede tener éxito o fracasar una vez. No puede tener éxito o fallar dos veces, tampoco puede pasar del éxito al fracaso o viceversa.
- Si una promesa ha tenido éxito o ha fracasado y luego se agrega una retrollamada de éxito o de fracaso, se retrollamará a la correcta, aunque el evento haya sucedido antes.

Esto es extremadamente útil para el éxito o fracaso asíncrono, porque estás menos interesado en el momento exacto en que algo estuvo disponible y más interesado en reaccionar ante el resultado.

## Terminología de promesas {: #promise-terminology }

[Domenic Denicola](https://twitter.com/domenic) leyó el primer borrador de este artículo y me calificó con una "F" por terminología. Me dio un castigo, me obligó a copiar [States and Fates (Estados y destinos)](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md) 100 veces y escribió una carta de preocupación a mis padres. A pesar de eso, sigo confundiendo gran parte de la terminología, pero aquí están los conceptos básicos:

Una promesa puede estar:

- **cumplida (fulfilled)** - La acción relacionada con la promesa se realizó correctamente.
- **rechazada (rejected)** - La acción relacionada con la promesa fracasó
- **pendiente (pending)** - Aún no se ha cumplido o rechazado
- **finalizada (settled)** - Se ha cumplido o rechazado

[La ECMA](https://www.ecma-international.org/ecma-262/#sec-promise-objects) también usa el término **thenable** para describir un objeto que es similar a una promesa, ya que tiene un método `then`. Este término me recuerda al ex entrenador de fútbol de Inglaterra, [Terry Venables,](https://en.wikipedia.org/wiki/Terry_Venables) así que lo usaré lo menos posible.

## ¡Las promesas llegaron a JavaScript!

Las promesas han existido durante un tiempo en forma de bibliotecas, como:

- [Q](https://github.com/kriskowal/q)
- [when](https://github.com/cujojs/when)
- [WinJS](https://msdn.microsoft.com/library/windows/apps/br211867.aspx)
- [RSVP.js](https://github.com/tildeio/rsvp.js)

Las promesas anteriores y de JavaScript comparten un comportamiento común y estandarizado llamado [Promises/A+](https://github.com/promises-aplus/promises-spec). Si eres un usuario de jQuery, tienen algo similar llamado [Deferreds](https://api.jquery.com/category/deferred-object/). Sin embargo, los Deferreds no cumplen con las normas de Promise/A+, lo que los hace [sutilmente diferentes y menos útiles](https://thewayofcode.wordpress.com/tag/jquery-deferred-broken/), así que ten cuidado. jQuery también tiene [un tipo de promesa](https://api.jquery.com/Types/#Promise), pero este es solo un subconjunto de Deferred y tiene los mismos problemas.

Aunque las implementaciones de promesas siguen un comportamiento estandarizado, de manera general, sus APIs, difieren. Las promesas de JavaScript son similares en API a RSVP.js. Así es como se crea una promesa:

```js
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
```

El constructor de promesas toma un argumento y una retrollamada con dos parámetros, resolve (resolver) y reject (rechazar). Haces algo dentro de la retrollamada, tal vez algo asíncrono, luego llamas a resolve si todo funcionó, de lo contrario, llamas a reject.

Al igual que `throw` en JavaScript antiguo, se usa por costumbre, pero no obligatorio, rechazar con un objeto Error. La ventaja de los objetos Error es que capturan un seguimiento de la pila, lo que hace que las herramientas de depuración sean más útiles.

Así es como se usa esa promesa:

```js
promise.then(function(result) {
  console.log(result); // "Stuff worked!"
}, function(err) {
  console.log(err); // Error: "It broke"
});
```

`then()` toma dos argumentos, una retrollamada para un caso de éxito y otra para el caso de fracaso. Ambos son opcionales, por lo que puedes agregar una retrollamada solo para el caso de éxito o fracaso.

Las promesas de JavaScript comenzaron en DOM como "Futures (Futuros)", se renombró a "Promises (Promesas)" y finalmente se trasladaron a JavaScript. Tenerlos en JavaScript en lugar del DOM es genial porque estarán disponibles en contextos de JS que no son del navegador, como lo es Node.js (si los utilizan en sus API principales es otra cuestión).

Aunque son una función de JavaScript, el DOM no tiene miedo de usarlos. De hecho, todas las API DOM nuevas con métodos asíncronos de éxito o fracaso utilizarán promesas. Esto ya está sucediendo con [Quota Management](https://dvcs.w3.org/hg/quota/raw-file/tip/Overview.html#idl-def-StorageQuota), [Font Load Events](http://dev.w3.org/csswg/css-font-loading/#font-face-set-ready), [ServiceWorker](https://github.com/slightlyoff/ServiceWorker/blob/cf459d473ae09f6994e8539113d277cbd2bce939/service_worker.ts#L17), [Web MIDI](https://webaudio.github.io/web-midi-api/#widl-Navigator-requestMIDIAccess-Promise-MIDIOptions-options), [Streams](https://github.com/whatwg/streams#basereadablestream) y más.

## Soporte de navegador y polyfill

Ya existen implementaciones de promesas en los navegadores de hoy en día.

A partir de Chrome 32, Opera 19, Firefox 29, Safari 8 y Microsoft Edge, las promesas están habilitadas de forma predeterminada.

Para que los navegadores que carecen de una implementación completa de promesas cumplan con las especificaciones, o agregar promesas y Node.js a otros navegadores, consulta [el polyfill](https://github.com/jakearchibald/ES6-Promises#readme) (2k gzipped).

## Compatibilidad con otras bibliotecas

La API de promesas de JavaScript tratará cualquier cosa con un `then()` como una promesa (o `thenable` *en un suspiro* en idioma de promesas), por lo que si usas una biblioteca que devuelve una promesa Q, no hay problema, funcionará de la manera correcta con las nuevas promesas de JavaScript.

Aunque, como mencioné anteriormente, los Deferreds de jQuery son un poco…inútiles. Afortunadamente, puedes convertirlos en promesas estándar, lo que vale la pena hacer lo antes posible:

```js
var jsPromise = Promise.resolve($.ajax('/whatever.json'))
```

Aquí, `$.ajax` jQuery devuelve un Deferred. Puesto que tiene un método `then()`, `Promise.resolve()` puedes convertirlo en una promesa JavaScript. Sin embargo, a veces los Deferreds pasan varios argumentos a sus retrollamadas, por ejemplo:

```js
var jqDeferred = $.ajax('/whatever.json');

jqDeferred.then(function(response, statusText, xhrObj) {
  // ...
}, function(xhrObj, textStatus, err) {
  // ...
})
```

Mientras que JS promete ignorar todo menos el primero:

```js
jsPromise.then(function(response) {
  // ...
}, function(xhrObj) {
  // ...
})
```

Afortunadamente, esto suele ser lo que deseas, o al menos te da acceso a lo que deseas. Además, ten en cuenta que jQuery no sigue la convención de pasar objetos Error a rechazos.

## El código asíncrono complejo es más fácil

Bien, codifiquemos algunas cosas. Digamos que queremos:

1. Iniciar un spinner para indicar que algo se está cargando
2. Obtener el JSON para una historia, lo que nos da el título y las URL de cada capítulo
3. Agregar el título a la página
4. Obtener cada capítulo
5. Agregar la historia a la página
6. Detener el spinner

…pero también decirle al usuario si algo salió mal en el camino. También querremos detener el spinner en ese punto; de lo contrario, seguirá girando, se mareará y chocará contra otra parte de la interfaz de usuario.

Por supuesto, no usaría JavaScript para desplegar una historia, ya que [servir como HTML es más rápido](https://jakearchibald.com/2013/progressive-enhancement-is-faster/), pero este patrón es bastante común cuando se trata de API: múltiples recuperaciones de datos, luego haces algo cuando estén listos.

Para empezar, tratemos de obtener datos de la red:

## Haciendo promesas de XMLHttpRequest

Las API antiguas se actualizarán para usar promesas, si es posible, de una manera compatible con versiones anteriores. `XMLHttpRequest` es un candidato principal, pero mientras tanto, vamos a escribir una función simple para realizar una consulta GET:

```js
function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}
```

Ahora usémoslo:

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
})
```

Ahora podemos realizar consultas HTTP sin escribir `XMLHttpRequest` manualmente, lo cual es genial, porque cuanto menos tenga que ver la exasperante camel case de `XMLHttpRequest`, más feliz será mi vida.

## Encadenamiento

`then()` no es el final de la historia, puedes encadenar varios `then` para transformar valores o ejecutar acciones asíncronas adicionales una tras otra.

### Transformando valores

Puedes transformar valores de manera sencilla devolviendo el nuevo valor:

```js
var promise = new Promise(function(resolve, reject) {
  resolve(1);
});

promise.then(function(val) {
  console.log(val); // 1
  return val + 2;
}).then(function(val) {
  console.log(val); // 3
})
```

Como ejemplo práctico, volvamos a:

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
})
```

La respuesta es JSON, pero actualmente la estamos recibiendo como texto sin formato. Podríamos alterar nuestra función get para usar JSON [`responseType`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest#responseType), pero también podríamos resolverlo utilizando una promesa:

```js
get('story.json').then(function(response) {
  return JSON.parse(response);
}).then(function(response) {
  console.log("Yey JSON!", response);
})
```

Dado que `JSON.parse()` toma un solo argumento y devuelve un valor transformado, podemos utilizar un atajo:

```js
get('story.json').then(JSON.parse).then(function(response) {
  console.log("Yey JSON!", response);
})
```

De hecho, podríamos hacer una función `getJSON()` de una manera muy sencilla:

```js
function getJSON(url) {
  return get(url).then(JSON.parse);
}
```

`getJSON()` todavía devuelve una promesa, una que obtiene un URL y luego analiza la respuesta como JSON.

### Poner en cola acciones asincrónicas

También puedes encadenar varios `then` para ejecutar acciones asíncronas en secuencia.

Cuando devuelves algo de una retrollamada de `then()`, sucede un poco de magia. Si devuelves un valor, el próximo `then()` es llamado con ese valor. Sin embargo, si devuelves una promesa, el siguiente `then()` espera y solo se llama cuando esa promesa se establece (si fue un éxito o si fracasó). Por ejemplo:

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  console.log("Got chapter 1!", chapter1);
})
```

Aquí hacemos una consulta asíncrona a `story.json`, que nos da un conjunto de URL para consultar, luego consultamos la primera de ellas. Aquí es cuando las promesas realmente comienzan a destacarse de los patrones simples de retrollamadas.

Incluso puedes crear un método de acceso directo para obtener capítulos:

```js
var storyPromise;

function getChapter(i) {
  storyPromise = storyPromise || getJSON('story.json');

  return storyPromise.then(function(story) {
    return getJSON(story.chapterUrls[i]);
  })
}

// and using it is simple:
getChapter(0).then(function(chapter) {
  console.log(chapter);
  return getChapter(1);
}).then(function(chapter) {
  console.log(chapter);
})
```

No descargamos `story.json` hasta que `getChapter` es llamado, pero la próxima vez que `getChapter` es llamado vamos a reutilizar la promesa de la historia, por lo que `story.json` solo se recupera una vez. ¡Genial, promesas!

## Manejo de errores

Como vimos anteriormente, `then()` toma dos argumentos, uno para el éxito, otro para el fracaso (o cumplida y rechazada, en idioma de promesas):

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.log("Failed!", error);
})
```

También puedes usar `catch()`:

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).catch(function(error) {
  console.log("Failed!", error);
})
```

No hay nada especial en `catch()`, es una manera linda de escribir `then(undefined, func)`, pero es más legible. Ten en cuenta que los dos ejemplos de código anteriores no se comportan de la misma manera, el último es equivalente a:

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).then(undefined, function(error) {
  console.log("Failed!", error);
})
```

La diferencia es sutil, pero extremadamente útil. Las promesas rechazadas pasan al siguiente `then()` con una retrollamada de rechazo (o `catch()`, ya que es equivalente). Luego `then(func1, func2)`, `func1` o `func2` serán llamados, pero nunca ambos. Pero con `then(func1).catch(func2)`, ambos serán llamados si `func1` rechaza, ya que son pasos separados en la cadena. Observa lo siguiente:

```js
asyncThing1().then(function() {
  return asyncThing2();
}).then(function() {
  return asyncThing3();
}).catch(function(err) {
  return asyncRecovery1();
}).then(function() {
  return asyncThing4();
}, function(err) {
  return asyncRecovery2();
}).catch(function(err) {
  console.log("Don't worry about it");
}).then(function() {
  console.log("All done!");
})
```

El flujo anterior es muy similar al try y catch normal de JavaScript, los errores que ocurren dentro de un "try" van inmediatamente al bloque de `catch()`. Aquí está lo anterior como un diagrama de flujo (porque me encantan los diagramas de flujo):

<div style="position: relative; padding-top: 93%;">
  <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden"
   src="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/simQvoUExWisIW0XxToH.svg" | imgix }}" frameborder="0" allowtransparency="true"></iframe>
</div>

Sigue las líneas azules para las promesas que se cumplen o las rojas para las que se rechazan.

### Promesas y excepciones de JavaScript

Los rechazos ocurren cuando una promesa se rechaza explícitamente, pero también implícitamente si se arroja un error en la retrollamada del constructor:

```js
var jsonPromise = new Promise(function(resolve, reject) {
  // JSON.parse throws an error if you feed it some
  // invalid JSON, so this implicitly rejects:
  resolve(JSON.parse("This ain't JSON"));
});

jsonPromise.then(function(data) {
  // This never happens:
  console.log("It worked!", data);
}).catch(function(err) {
  // Instead, this happens:
  console.log("It failed!", err);
})
```

Esto significa que es útil hacer todo el trabajo relacionado con las promesas dentro de la retrollamada del constructor de promesas, por lo que los errores se detectan automáticamente y se convierten en rechazos.

Lo mismo ocurre con los errores lanzados en las retrollamadas de `then()`.

```js
get('/').then(JSON.parse).then(function() {
  // This never happens, '/' is an HTML page, not JSON
  // so JSON.parse throws
  console.log("It worked!", data);
}).catch(function(err) {
  // Instead, this happens:
  console.log("It failed!", err);
})
```

### Manejo de errores en la práctica

Con nuestra historia y capítulos, podemos usar catch para mostrar un error al usuario:

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  addHtmlToPage(chapter1.html);
}).catch(function() {
  addTextToPage("Failed to show chapter");
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

Si la `story.chapterUrls[0]` falla (por ejemplo, http 500 o el usuario está desconectado del internet), omitirá todas las siguientes retrollamadas exitosas que incluyen la de `getJSON()` que intenta analizar la respuesta como JSON y también omite la retrollamada que agrega chapter1.html a la página. En su lugar, pasa a la retrollamada de captura. Como resultado, "No se pudo mostrar el capítulo" se agregará a la página si falla alguna de las acciones anteriores.

Al igual que el try y catch de JavaScript, el error se detecta y el código subsiguiente continúa, por lo que el spinner siempre está oculto, que es lo que queremos. Lo anterior se convierte en una versión asíncrona sin bloqueo de:

```js
try {
  var story = getJSONSync('story.json');
  var chapter1 = getJSONSync(story.chapterUrls[0]);
  addHtmlToPage(chapter1.html);
}
catch (e) {
  addTextToPage("Failed to show chapter");
}
document.querySelector('.spinner').style.display = 'none'
```

Es posible que desees utilizar `catch()` con fines de registro, sin recuperar del error. Para hacer esto, simplemente vuelves a hacer un throw al error. Podríamos hacer esto en nuestro método de `getJSON()`:

```js
function getJSON(url) {
  return get(url).then(JSON.parse).catch(function(err) {
    console.log("getJSON failed for", url, err);
    throw err;
  });
}
```

Así que logramos obtener un capítulo, pero los queremos todos. Hagamos que eso suceda.

## Paralelismo y secuenciación: obteniendo lo mejor de ambos

Pensar de forma asíncrona no es fácil. Si estás luchando por salirte de la caja, intenta escribir el código como si fuera sincrónico. En este caso:

```js
try {
  var story = getJSONSync('story.json');
  addHtmlToPage(story.heading);

  story.chapterUrls.forEach(function(chapterUrl) {
    var chapter = getJSONSync(chapterUrl);
    addHtmlToPage(chapter.html);
  });

  addTextToPage("All done");
}
catch (err) {
  addTextToPage("Argh, broken: " + err.message);
}

document.querySelector('.spinner').style.display = 'none'
```

{% Glitch {id: 'promises-sync-example', height: 480}%}

¡Eso funciona! Pero se sincroniza y bloquea el navegador mientras se descargan las cosas. Para que esto funcione de forma asincrónica, usamos `then()`, esto es para hacer que las cosas sucedan una tras otra.

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // TODO: for each url in story.chapterUrls, fetch & display
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

Pero, ¿cómo podemos recorrer las URL de los capítulos y buscarlas en orden? Esto **no funciona**:

```js
story.chapterUrls.forEach(function(chapterUrl) {
  // Fetch chapter
  getJSON(chapterUrl).then(function(chapter) {
    // and add it to the page
    addHtmlToPage(chapter.html);
  });
})
```

`forEach` no se percata de lo asíncrono, por lo que nuestros capítulos aparecerían en el orden en que se descarguen, que es básicamente cómo se escribió Pulp Fiction. Esto no es Pulp Fiction, así que vamos a arreglarlo.

### Creando una secuencia

Queremos convertir nuestro `chapterUrls` en una secuencia de promesas. Podemos hacer eso usando `then()`:

```js
// Start off with a promise that always resolves
var sequence = Promise.resolve();

// Loop through our chapter urls
story.chapterUrls.forEach(function(chapterUrl) {
  // Add these actions to the end of the sequence
  sequence = sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
})
```

Esta es la primera vez que vemos `Promise.resolve()`, el cual crea una promesa que se resuelve con cualquier valor que le des. Si le pasas una instancia de `Promise`, simplemente la devolverá (**nota:** este es un cambio en la especificación que algunas implementaciones aún no siguen). Si le pasas algo parecido a una promesa (si tiene un método `then()`), crea una `Promise` genuina que cumple o rechaza de la misma manera. Si pasas cualquier otro valor, por ejemplo, `Promise.resolve('Hello')`, crea una promesa que cumple con ese valor. Si lo llama sin valor, como arriba, cumple como "indefinido".

También está `Promise.reject(val)`, que crea una promesa que se rechaza con el valor que le das (o con indefinido).

Podemos ordenar el código anterior usando [`array.reduce`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) :

```js
// Loop through our chapter urls
story.chapterUrls.reduce(function(sequence, chapterUrl) {
  // Add these actions to the end of the sequence
  return sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
}, Promise.resolve())
```

Esto hace lo mismo que en el ejemplo anterior, pero no necesita la variable de "secuencia" separada. Se llama a nuestra retrollamada reducida para cada elemento de la matriz. "secuencia" es `Promise.resolve()` la primera vez, pero para el resto de las llamadas, "secuencia" es lo que devolvimos de la llamada anterior. `array.reduce` es realmente útil para reducir una matriz a un solo valor, que en este caso es una promesa.

Vamos a juntarlo todo:

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  return story.chapterUrls.reduce(function(sequence, chapterUrl) {
    // Once the last chapter's promise is done…
    return sequence.then(function() {
      // …fetch the next chapter
      return getJSON(chapterUrl);
    }).then(function(chapter) {
      // and add it to the page
      addHtmlToPage(chapter.html);
    });
  }, Promise.resolve());
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch {id: 'promises-async-example', height: 480}%}

Y ahí lo tenemos, una versión totalmente asíncrona de la versión sincronizada. Pero lo podemos hacer mejor. Por el momento, nuestra página se está descargando así:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

Los navegadores son bastante buenos para descargar varias cosas a la vez, por lo que estamos perdiendo rendimiento al descargar capítulos uno tras otro. Lo que queremos hacer es descargarlos todos al mismo tiempo y luego procesarlos cuando hayan llegado. Afortunadamente, hay una API para esto:

```js
Promise.all(arrayOfPromises).then(function(arrayOfResults) {
  //...
})
```

`Promise.all` toma una serie de promesas y crea una promesa que se cumple cuando todas se completan con éxito. Obtienes una variedad de resultados (cualquiera que sea el cumplimiento de las promesas) en el mismo orden en que las promesas que pasaste.

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // Take an array of promises and wait on them all
  return Promise.all(
    // Map our array of chapter urls to
    // an array of chapter json promises
    story.chapterUrls.map(getJSON)
  );
}).then(function(chapters) {
  // Now we have the chapters jsons in order! Loop through…
  chapters.forEach(function(chapter) {
    // …and add to the page
    addHtmlToPage(chapter.html);
  });
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened so far
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch {id: 'promises-async-all-example', height: 480}%}

Dependiendo de la conexión, esto puede ser segundos más rápido que cargar uno por uno, y es menos código que nuestro primer intento. Los capítulos se pueden descargar en cualquier orden, pero aparecen en la pantalla en el orden correcto.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

Sin embargo, aún podemos mejorar el rendimiento percibido. Cuando llegue el capítulo uno debemos agregarlo a la página. Esto le permite al usuario comenzar a leer antes de que llegue el resto de los capítulos. Cuando llegue el capítulo tres, no lo agregaríamos a la página porque es posible que el usuario no se dé cuenta de que falta el capítulo dos. Cuando llegue el capítulo dos, podemos agregar los capítulos dos y tres, etc, etc.

Para hacer esto, buscamos el JSON para todos nuestros capítulos al mismo tiempo, luego creamos una secuencia para agregarlos al documento:

```js
getJSON('story.json')
.then(function(story) {
  addHtmlToPage(story.heading);

  // Map our array of chapter urls to
  // an array of chapter json promises.
  // This makes sure they all download in parallel.
  return story.chapterUrls.map(getJSON)
    .reduce(function(sequence, chapterPromise) {
      // Use reduce to chain the promises together,
      // adding content to the page for each chapter
      return sequence
      .then(function() {
        // Wait for everything in the sequence so far,
        // then wait for this chapter to arrive.
        return chapterPromise;
      }).then(function(chapter) {
        addHtmlToPage(chapter.html);
      });
    }, Promise.resolve());
}).then(function() {
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch {id: 'promises-async-best-example', height: 480}%}

¡Y ahí está, lo mejor de ambos! Se necesita la misma cantidad de tiempo para entregar todo el contenido, pero el usuario obtiene el primer pedazo del contenido antes.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

En este ejemplo trivial, todos los capítulos llegan aproximadamente al mismo tiempo, pero el beneficio de mostrar uno a la vez se exagerará con capítulos más grandes.

Hacer lo anterior con [eventos o retrollamadas al estilo de Node.js](https://gist.github.com/jakearchibald/0e652d95c07442f205ce) es aproximadamente el doble del código, pero lo más importante, no es tan fácil de seguir. Sin embargo, este no es el final de la historia de las promesas, cuando se combinan con otras características de ES6 se vuelven aún más fáciles.

## Ronda extra: capacidades ampliadas

Desde que escribí este artículo originalmente, la capacidad de usar promesas se ha expandido enormemente. Desde Chrome 55, las funciones asíncronas han permitido escribir código basado en promesas como si estuviera en sincronía, pero sin bloquear el hilo principal. Puedes leer más sobre eso en [my async functions article (mi artículo de funciones asíncronas)](/async-functions). Existe un soporte generalizado tanto para promesas como para funciones asíncronas en los principales navegadores. Puedes encontrar los detalles en la [Promise (promesas)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) de MDN y la referencia de [async function (función asíncrona).](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)

Muchas gracias a Anne van Kesteren, Domenic Denicola, Tom Ashworth, Remy Sharp, Addy Osmani, Arthur Evans y Yutaka Hirano quienes revisaron esto e hicieron correcciones y recomendaciones.

Además, gracias a [Mathias Bynens](https://mathiasbynens.be/) por [actualizar varias partes](https://github.com/html5rocks/www.html5rocks.com/pull/921/files) del artículo.
