---
title: Uso de las API web asincrónicas de WebAssembly
description: Aprenda a invocar las API web asincrónicas al compilar lenguajes tradicionalmente sincrónicos en WebAssembly.
date: 2021-04-26
hero: image/9oK23mr86lhFOwKaoYZ4EySNFp02/3XqfQyjjfxEw8T3azz0W.jpg
alt: Una señal de paso de peatones que le pide a los peatones que esperen.
authors:
  - rreverser
tags:
  - blog
  - webassembly
  - file-system
---

Las API de E/S en la web son asincrónicas, pero son sincrónicas en la mayoría de los lenguajes del sistema. Al compilar código en WebAssembly, necesita unir un tipo de API a otro, y este puente lo constituye Asyncify. En esta publicación, aprenderá cuándo y cómo usar Asyncify y cómo funciona bajo el capó.

## E/S en lenguajes del sistema

Comenzaré con un ejemplo simple en C. Digamos que desea leer el nombre del usuario de un archivo y saludarlo con un mensaje "¡Hola, (nombre de usuario)!":

```cpp
#include <stdio.h>

int main() {
    FILE *stream = fopen("name.txt", "r");
    char name[20+1];
    size_t len = fread(&name, 1, 20, stream);
    name[len] = '\0';
    fclose(stream);
    printf("Hello, %s!\n", name);
    return 0;
}
```

Si bien el ejemplo no hace mucho, ya demuestra algo que encontrará en una aplicación de cualquier tamaño: lee algunas entradas del mundo exterior, las procesa internamente y escribe las salidas en el mundo exterior. Toda esta interacción con el mundo exterior ocurre a través de algunas funciones comúnmente llamadas funciones de entrada-salida, también abreviadas como E/S.

Para leer el nombre desde C, necesita al menos dos invocaciones de E/S cruciales: `fopen` para abrir el archivo y `fread` para leer los datos desde él. Una vez que recupere los datos, puede usar otra función de E/S `printf` para imprimir el resultado en la consola.

Esas funciones parecen bastante simples a primera vista y no tiene que pensar dos veces en la maquinaria involucrada en la lectura o escritura de los datos. Sin embargo, en función del entorno, pueden ocurrir muchas cosas en el interior:

- Si el archivo de entrada está ubicado en una unidad local, la aplicación necesita realizar una serie de accesos a la memoria y al disco para ubicar el archivo, verificar los permisos, abrirlo para leerlo y luego leer bloque por bloque hasta que se recupere la cantidad solicitada de bytes. Esto puede ser bastante lento, en función de la velocidad de su disco y del tamaño solicitado.
- O bien, el archivo de entrada podría estar localizado en una ubicación de red montada, en cuyo caso, la pila de red ahora también estará involucrada, lo que aumenta la complejidad, la latencia y el número de reintentos potenciales para cada operación.
- Finalmente, incluso no está garantizado que `printf` imprima cosas en la consola y se podría redirigir a un archivo o a una ubicación de red, en cuyo caso tendría que seguir los mismos pasos anteriores.

En pocas palabras, la E/S puede ser lenta y no se puede predecir cuánto tiempo tomará una invocación en particular con un vistazo rápido al código. Mientras se ejecuta esa operación, toda la aplicación aparecerá congelada y no responderá al usuario.

Esto tampoco se limita a C o C ++. La mayoría de los lenguajes de sistema presentan todas las E/S en forma de API sincrónicas. Por ejemplo, si traduce el ejemplo a Rust, la API puede parecer más simple, pero se aplican los mismos principios. Simplemente realiza una invocación y espera sincrónicamente a que devuelva el resultado, mientras realiza todas las operaciones costosas y, finalmente, devuelve el resultado en una única invocación:

```rust
fn main() {
    let s = std::fs::read_to_string("name.txt");
    println!("Hello, {}!", s);
}
```

Pero, ¿qué sucede cuando intenta compilar cualquiera de esos ejemplos en WebAssembly y traducirlos a la web? O, para proporcionar un ejemplo específico, ¿a qué se podría traducir la operación de "lectura de archivo"? Necesitaría leer datos desde algún almacenamiento.

## Modelo asincrónico de la web

La web tiene una variedad de opciones de almacenamiento diferentes a las que puede hacer mapeo, como almacenamiento en memoria (objetos JS), [`localStorage`](https://developer.mozilla.org/docs/Web/API/Window/localStorage), [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API), almacenamiento del lado del servidor y una nueva [API de acceso al sistema de archivos](/file-system-access/).

Sin embargo, solo dos de esas API, la de almacenamiento en memoria y `localStorage` se pueden usar sincrónicamente, además ambas son las opciones más limitantes en cuanto a lo que se puede almacenar y por cuánto tiempo. Todas las demás opciones proporcionan solo API asincrónicas.

Esta es una de las propiedades principales de la ejecución de código en la web: cualquier operación que requiera mucho tiempo, que incluya cualquier E/S, debe ser asíncrónica.

La razón es que la web ha sido históricamente de un solo subproceso, y cualquier código de usuario que toque la interfaz de usuario debe ejecutarse en el mismo subproceso que la interfaz de usuario. Tiene que competir por el tiempo de CPU con otras tareas importantes como el diseño, renderizado y manejo de eventos. No es deseable que una parte de JavaScript o WebAssembly pueda iniciar una operación de "lectura de archivo" y bloquear todo lo demás (la pestaña completa o, en el pasado, todo el navegador) durante un intervalo de unos milisegundos a unos pocos segundos, hasta que termine.

En cambio, el código solo puede programar una operación de E/S junto con una devolución de invocación para que se ejecute una vez finalizada. Estas devoluciones de invocación se ejecutan como parte del ciclo de eventos del navegador. No entraré en detalles aquí, pero si está interesado en aprender cómo funciona el bucle de eventos bajo el capó, consulte el documento [Tareas, microtareas, colas y horarios](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) que explica este tema en profundidad.

La versión corta es que el navegador ejecuta todos los fragmentos de código en una especie de bucle infinito, al tomarlos de la cola uno por uno. Cuando se activa algún evento, el navegador pone en cola el controlador correspondiente y, en la siguiente iteración del ciclo, se saca de la cola y se ejecuta. Este mecanismo permite simular la simultaneidad y ejecutar muchas operaciones paralelas mientras se usa un solo hilo.

Lo importante que debe recordar acerca de este mecanismo es que, mientras se ejecuta su código JavaScript personalizado (o WebAssembly), el bucle de eventos se bloquea y, mientras está así, no hay forma de reaccionar a ningún controlador externo, evento, E/S, etc. La única forma de recuperar los resultados de E/S es registrar una devolución de invocación, terminar de ejecutar su código y devolver el control al navegador para que pueda seguir procesando las tareas pendientes. Una vez finalizada la E/S, su controlador se convertirá en una de esas tareas y se ejecutará.

Por ejemplo, si usted quisiera reescribir los ejemplos anteriores en JavaScript moderno y decide leer un nombre dsde una URL remota, usaría la API Fetch y la sintaxis async-await:

```js
async function main() {
  let response = await fetch("name.txt");
  let name = await response.text();
  console.log("Hello, %s!", name);
}
```

Aunque parece sincrónico, bajo el capó cada `await` es esencialmente un caramelo de sintaxis para las devoluciones de invocación:

```js
function main() {
  return fetch("name.txt")
    .then(response => response.text())
    .then(name => console.log("Hello, %s!", name));
}
```

En este ejemplo descaramelizado, que es un poco más claro, se inicia una solicitud y las respuestas se suscriben con la primera devolución de invocación. Una vez que el navegador recibe la respuesta inicial, solo los encabezados HTTP, invoca de forma asincrónica esta devolución de invocación. La devolución de invocación comienza a leer el cuerpo como texto mediante `response.text()` y se suscribe al resultado con otra devolución de invocación. Finalmente, una vez que `fetch` ha recuperado todo el contenido, invoca la última devolución de invocación, que imprime "¡Hola, (nombre de usuario)!" en la consola.

Gracias a la naturaleza asincrónica de esos pasos, la función original puede devolver el control al navegador tan pronto como se haya programado la E/S y dejar toda la interfaz de usuario receptiva y disponible para otras tareas, incluida la renderización, el desplazamiento, etc., mientras la E/S se está ejecutando en segundo plano.

Como ejemplo final, incluso las API simples como "sleep", que hace que una aplicación espere un número específico de segundos, también son una forma de operación de E/S:

```cpp
#include <stdio.h>
#include <unistd.h>
// ...
printf("A\n");
sleep(1);
printf("B\n");
```

Claro, podría traducirlo de una manera muy sencilla que bloquearía el hilo actual hasta que expire el tiempo:

```js
console.log("A");
for (let start = Date.now(); Date.now() - start < 1000;);
console.log("B");
```

De hecho, eso es exactamente lo que hace Emscripten en [su implementación predeterminada de "suspender",](https://github.com/emscripten-core/emscripten/blob/16d5755a3f71f27d0c67b8d7752f94844e56ef7c/src/library_pthread_stub.js#L47-L52) pero eso es muy ineficiente, bloqueará toda la interfaz de usuario y no permitirá que se manejen otros eventos mientras tanto. Generalmente, no haga eso en el código de producción.

En cambio, una versión más idiomática de "suspender" en JavaScript implicaría invocar a `setTimeout()` y suscribirse con un controlador:

```js
console.log("A");
setTimeout(() => {
    console.log("B");
}, 1000);
```

¿Qué tienen en común todos estos ejemplos y distintas API? En cada caso, el código idiomático en el lenguaje de sistema original usa una API de bloqueo para la E/S, mientras que un ejemplo equivalente para la web usa una API asincrónica en su lugar. Al compilar en la web, necesita transformarse de alguna manera entre esos dos modelos de ejecución, y WebAssembly no tiene todavía la capacidad incorporada para hacerlo.

## Cerrar la brecha con Asyncify

Aquí es donde entra en juego [Asyncify](https://emscripten.org/docs/porting/asyncify.html). Asyncify es una función de tiempo de compilación compatible con Emscripten que permite pausar todo el programa y reanudarlo de forma asincrónica más tarde.

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/VSMrdTiQ7PubW6vfE6WZ.svg", alt="Un gráfico de invocación que describe una invocación JavaScript -&gt; WebAssembly -&gt; API web -&gt; de tarea asincrónica, donde Asyncify vuelve a conectar el resultado de la tarea asincrónica de regreso a WebAssembly", width="800", height="200" %}

### Uso en C / C ++ con Emscripten

Si quisiera usar Asyncify para implementar un "suspender" asincrónico para el último ejemplo, podría hacerlo así:

```cpp
#include <stdio.h>
#include <emscripten.h>

EM_JS(void, async_sleep, (int seconds), {
    Asyncify.handleSleep(wakeUp => {
        setTimeout(wakeUp, seconds * 1000);
    });
});
…
puts("A");
async_sleep(1);
puts("B");
```

[`EM_JS`](https://emscripten.org/docs/api_reference/emscripten.h.html?highlight=em_js#c.EM_JS) es una macro que permite definir fragmentos de JavaScript como si fueran funciones de C. En su interior, usa una función [`Asyncify.handleSleep()`](https://emscripten.org/docs/porting/asyncify.html#making-async-web-apis-behave-as-if-they-were-synchronous) que le inidca a Emscripten que suspenda el programa y proporciona un controlador `wakeUp()` que debe invocarse una vez que la operación asincrónica haya finalizado. En el ejemplo anterior, el controlador se pasa a `setTimeout()`, pero podría usarse en cualquier otro contexto que acepte devoluciones de invocación. Finalmente, puede invocar a `async_sleep()` desde cualquier lugar que desee, al igual que con `sleep()` regular o con cualquier otra API sincrónica.

Al compilar dicho código, debe indicarle a Emscripten que active la función Asyncify. Para hacerlo pase `-s ASYNCIFY` así como también [`-s ASYNCIFY_IMPORTS=[func1, func2]`](https://emscripten.org/docs/porting/asyncify.html#more-on-asyncify-imports) con una lista de funciones en forma de matriz que pueden ser asincrónicas.

```shell
emcc -O2 \
    -s ASYNCIFY \
    -s ASYNCIFY_IMPORTS=[async_sleep] \
    ...
```

Esto le permite a Emscripten saber que cualquier invocación a esas funciones puede requerir que se guarde y restaure el estado, por lo que el compilador inyectará código de soporte alrededor de dichas invocaciones.

Ahora, cuando ejecute este código en el navegador, verá un registro de salida sin interrupciones como es de esperar, con B apareciendo con un breve retraso después de A.

```text
A
B
```

También puede [devolver valores de las funciones Asyncify](https://emscripten.org/docs/porting/asyncify.html#returning-values). Lo que debe hacer es devolver el resultado de `handleSleep()` y pasar el resultado a la devolución de invocación `wakeUp()`. Por ejemplo, si, en lugar de leer de un archivo, desea obtener un número de un recurso remoto, puede usar un fragmento como el que se muestra a continuación para emitir una solicitud, suspender el código C y reanudar una vez que se recupere el cuerpo de la respuesta. Todo hecho a la perfección como si la invocación fuera sincrónica.

```js
EM_JS(int, get_answer, (), {
     return Asyncify.handleSleep(wakeUp => {
        fetch("answer.txt")
            .then(response => response.text())
            .then(text => wakeUp(Number(text)));
    });
});
puts("Getting answer...");
int answer = get_answer();
printf("Answer is %d\n", answer);
```

De hecho, para las API basadas en promesas como `fetch()`, incluso puede combinar Asyncify con la función async-await de JavaScript en lugar de utilizar la API basada en devolución de invocaciones. Para eso, en lugar de `Asyncify.handleSleep()`, invoque a `Asyncify.handleAsync()`. Luego, en lugar de tener que programar una devolución de invocación `wakeUp()`, puede pasar una función JavaScript  `async` con el uso de `await` y `return` adentro, para hacer que el código se vea aún más natural y sincrónico, sin perder ninguno de los beneficios de la E/S asincrónica.

```js
EM_JS(int, get_answer, (), {
     return Asyncify.handleAsync(async () => {
        let response = await fetch("answer.txt");
        let text = await response.text();
        return Number(text);
    });
});

int answer = get_answer();
```

#### Esperar valores complejos

Pero este ejemplo todavía lo limita solo a números. ¿Qué sucede si desea implementar el ejemplo original, donde traté de obtener el nombre de un usuario de un archivo como una cadena? Bueno, ¡también puede hacer eso!

Emscripten proporciona una función llamada [Embind](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html) que le permite manejar conversiones entre valores de JavaScript y C ++. También admite Asyncify, por lo que puede invocar a `await()` en `Promise` externas y actuará como `await` en el código JavaScript async-await:

```cpp
val fetch = val::global("fetch");
val response = fetch(std::string("answer.txt")).await();
val text = response.call<val>("text").await();
auto answer = text.as<std::string>();
```

Al usar este método, ni siquiera necesita pasar `ASYNCIFY_IMPORTS` como una marca de compilación, pues ya está incluido de forma predeterminada.

Bien, entonces todo esto funciona muy bien en Emscripten. ¿Qué pasa con otras cadenas de herramientas y lenguajes?

### Uso de otros lenguajes

Supongamos que tiene una invocación sincrónica similar en algún lugar de su código de Rust que desea asignar a una API asincrónica en la web. ¡Resulta que también puede hacer eso!

Primero, debe definir dicha función como una importación regular a través de un bloque `extern` (o la sintaxis de su lenguaje elegido para funciones externas).

```rust
extern {
    fn get_answer() -> i32;
}

println!("Getting answer...");
let answer = get_answer();
println!("Answer is {}", answer);
```

Luego, compile su código en WebAssembly:

```shell
cargo build --target wasm32-unknown-unknown
```

Ahora necesita instrumentar el archivo WebAssembly con código para almacenar/restaurar la pila. Para C / C ++, Emscripten haría esto por nosotros, pero no se usa aquí, por lo que el proceso es un poco más manual.

Afortunadamente, la transformación Asyncify en sí es completamente independiente de la cadena de herramientas. Puede transformar archivos WebAssembly arbitrarios, sin importar el compilador que los haya producido. La transformación se proporciona por separado como parte del optimizador `wasm-opt` de la [cadena de herramientas Binaryen](https://github.com/WebAssembly/binaryen) y se puede invocar así:

```shell
wasm-opt -O2 --asyncify \
      --pass-arg=asyncify-imports@env.get_answer \
      [...]
```

Pase `--asyncify` para habilitar la transformación y luego use `--pass-arg=…` para proporcionar una lista separada por comas de funciones asincrónicas, donde el estado del programa debe suspenderse y luego reanudarse.

Todo lo que queda es proporcionar código de tiempo de ejecución de soporte que realmente lo haga: suspender y reanudar el código de WebAssembly. Nuevamente, en el caso de C / C ++, esto lo incluiría Emscripten, pero ahora necesita un código de pegamento JavaScript personalizado que maneje archivos WebAssembly arbitrarios. Hemos creado una biblioteca solo para eso.

Puede encontrarlo en GitHub en [https://github.com/GoogleChromeLabs/asyncify](https://github.com/GoogleChromeLabs/asyncify) o en npm con el nombre [`asyncify-wasm`](https://www.npmjs.com/package/asyncify-wasm).

Simula una [API de instanciación de WebAssembly](https://developer.mozilla.org/docs/WebAssembly) estándar, pero con su propio espacio de nombres. La única diferencia es que, en una API de WebAssembly normal, solo puede proporcionar funciones sincrónicas como importaciones, mientras que en el contenedor Asyncify, también puede proporcionar importaciones asincrónicas:

```js
const { instance } = await Asyncify.instantiateStreaming(fetch('app.wasm'), {
    env: {
        async get_answer() {
            let response = await fetch("answer.txt");
            let text = await response.text();
            return Number(text);
        }
    }
});
…
await instance.exports.main();
```

Una vez que intente invocar a una función asincrónica, como `get_answer()` en el ejemplo anterior, desde el lado de WebAssembly, la biblioteca detectará la `Promise` devuelta, suspenderá y guardará el estado de la aplicación WebAssembly, se suscribirá a la finalización de la promesa y más tarde, una vez resuelta, restaurará sin problemas la pila y el estado de invocaciones y seguirá con la ejecución como si nada hubiera sucedido.

Dado que cualquier función en el módulo puede realizar una invocación asincrónica, todas las exportaciones también se vuelven potencialmente asincrónicas, por lo que también se envuelven. Es posible que haya notado en el ejemplo anterior que debe aplicarle un `await` al resultado de `instance.exports.main()` para saber cuándo finaliza realmente la ejecución.

### ¿Cómo funciona todo esto bajo el capó?

Cuando Asyncify detecta una invocación a una de las funciones `ASYNCIFY_IMPORTS`, inicia una operación asincrónica, guarda todo el estado de la aplicación, incluida la pila de invocaciones y los locales temporales, y luego, cuando la operación finaliza, restaura toda la memoria y la pila de invocaciones para reanudar desde el mismo lugar y con el mismo estado como si el programa nunca se hubiera detenido.

Esto es bastante similar a la función async-await en JavaScript que mostré anteriormente, pero, a diferencia de JavaScript, no requiere ninguna sintaxis especial o soporte de tiempo de ejecución del lenguaje y, en cambio, funciona al transformar las funciones sincrónicas simples en tiempo de compilación.

Al compilar el ejemplo de suspensión asincrónica mostrado anteriormente:

```js
puts("A");
async_sleep(1);
puts("B");
```

Asyncify toma este código y lo transforma aproximadamente como el siguiente (pseudocódigo, la transformación real es más complicada que esto):

```js
if (mode == NORMAL_EXECUTION) {
    puts("A");
    async_sleep(1);
    saveLocals();
    mode = UNWINDING;
    return;
}
if (mode == REWINDING) {
    restoreLocals();
    mode = NORMAL_EXECUTION;
}
puts("B");
```

Inicialmente, el parámetro `mode` se establece en `NORMAL_EXECUTION`. En consecuencia, la primera vez que se ejecuta dicho código transformado, solo se evaluará `async_sleep()`. Tan pronto como se programa la operación asincrónica, Asyncify guarda todos los locales y desenrolla la pila regresando desde cada función hasta la parte superior, de esta manera le devuelve el control al bucle de eventos del navegador.

Luego, una vez que `async_sleep()` resuelve, el código de soporte de Asyncify cambiará el parámetro `mode` a `REWINDING` e invocará a la función. Esta vez, se omite la rama de "ejecución normal", puesto que ya hizo el trabajo la última vez y quiero evitar imprimir "A" dos veces, y en su lugar se pasa directamente a la rama de "rebobinado". Una vez que se alcanza, restaura todos los locales almacenados, cambia el modo de nuevo a "normal" y continúa la ejecución como si el código nunca se hubiera detenido en primer lugar.

### Costos de transformación

Desafortunadamente, la transformación Asyncify no es completamente gratuita, ya que tiene que inyectar bastante código de soporte para almacenar y restaurar todos esos locales, navegar por la pila de invocaciones en diferentes modos, etc. Intenta modificar solo las funciones marcadas como asincrónicas en la línea de comando, así como también cualquiera de sus posibles invocadores, pero la sobrecarga del tamaño del código aún podría sumar aproximadamente un 50% antes de la compresión.

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/Im4hmQOYRHFcsg8UTfTR.png", alt="Un gráfico que muestra la sobrecarga del tamaño del código para varios puntos de referencia, desde casi el 0% en condiciones de ajuste fino hasta más del 100% en el peor de los casos", width="800", height="494" %}

Esto no es ideal, pero en muchos casos es aceptable cuando la alternativa es no tener la funcionalidad completa o tener que reescribir significativamente el código original.

Asegúrese de habilitar siempre las optimizaciones para las compilaciones finales para evitar que aumenten aún más. También puede verificar las [opciones de optimización específicas de Asyncify](https://emscripten.org/docs/porting/asyncify.html#optimizing) para reducir la sobrecarga al limitar las transformaciones solo a funciones específicas o solo a invocaciones a funciones directas. También hay un costo menor para el rendimiento del tiempo de ejecución, pero se limita a las propias invocaciones asincrónicas. Sin embargo, en comparación con el costo del trabajo real, generalmente es insignificante.

## Demostraciones del mundo real

Ahora que ha visto los ejemplos simples, pasaré a escenarios más complejos.

Como se mencionó al principio del artículo, una de las opciones de almacenamiento en la web es una [API de acceso al sistema de archivos](/file-system-access/) asincrónica. Proporciona acceso a un sistema de archivos de host real desde una aplicación web.

Por otro lado, existe un estándar de facto llamado [WASI](https://github.com/WebAssembly/WASI) para E/S de WebAssembly en la consola y en el lado del servidor. Fue diseñado como un destino de compilación para los lenguajes del sistema y expone todo tipo de sistema de archivos y otras operaciones en una forma sincrónica tradicional.

¿Y si pudiera mapear de uno a otro? Entonces, podría compilar cualquier aplicación en cualquier lenguaje de origen con cualquier cadena de herramientas compatible con el objetivo WASI y ejecutarla en una caja de arena en la web, ¡mientras le permite operar en archivos de usuario reales! Con Asyncify, puede hacer precisamente eso.

En esta demostración, compilé la caja de Rust [coreutils](https://github.com/RReverser/coreutils) con algunos parches menores para WASI, pasé a través de la transformación Asyncify e implementé [enlaces](https://github.com/GoogleChromeLabs/wasi-fs-access/blob/main/src/bindings.ts) asincrónicos de WASI a la API de acceso al sistema de archivos en el lado de JavaScript. Una vez combinado con el componente de terminal [Xterm.js](https://xtermjs.org/) , esto proporciona un shell realista que se ejecuta en la pestaña del navegador y opera en archivos de usuario reales, como una terminal real.

{% Video src="video/9oK23mr86lhFOwKaoYZ4EySNFp02/4244yB6c9RbMCjGjP8ZW.mp4" %}

Compruébalo en vivo en [https://wasi.rreverser.com/](https://wasi.rreverser.com/).

Los casos de uso de Asyncify tampoco se limitan solo a temporizadores y sistemas de archivos. Puede ir más allá y utilizar más API de nicho en la web.

Por ejemplo, también con la ayuda de Asyncify, es posible mapear [libusb,](https://github.com/libusb/libusb) probablemente la biblioteca nativa más popular para trabajar con dispositivos USB, a una [API WebUSB](/usb/), que brinda acceso asincrónico a dichos dispositivos en la web. Una vez mapeada y compilada, obtuve pruebas estándar de libusb y ejemplos para ejecutar en los dispositivos elegidos directamente en la caja de arena de una página web.

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/2rscL8dyhOVMacuq54Ad.jpg", alt="Captura de pantalla de la salida de depuración libusb en una página web, que muestra información sobre la cámara Canon conectada", width="375", height="548" %}

Sin embargo, probablemente sea una historia para otra publicación de blog.

Esos ejemplos demuestran cuán poderosa puede ser Asyncify para cerrar la brecha y portar todo tipo de aplicaciones a la web, lo que le permite obtener acceso multiplataforma, cajas de arena y mejor seguridad, todo sin perder funcionalidad.
