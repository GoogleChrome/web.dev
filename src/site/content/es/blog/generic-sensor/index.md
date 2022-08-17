---
title: Sensores para la web
subhead: Utilice la API Generic Sensor para acceder a los sensores del dispositivo, como acelerómetros, giroscopios y magnetómetros.
authors:
  - alexshalamov
  - pozdnyakov
  - thomassteiner
description: Los sensores se utilizan en muchas aplicaciones para habilitar funciones avanzadas como los juegos que tienen en cuenta la orientación o la aceleración del dispositivo en el que funcionan. La API Generic Sensor proporciona una interfaz genérica para acceder a los datos de estos sensores en la web.
date: 2017-09-18
updated: 2021-02-17
tags:
  - blog
  - devices
  - capabilities
hero: image/admin/2AGc7aV66zc69fiqNJBZ.jpg
alt: Un simple giroscopio.
---

En la actualidad, los datos de los sensores se utilizan en muchas aplicaciones específicas de plataformas para permitir casos de uso como juegos inmersivos, seguimiento del estado físico y realidad aumentada o virtual. ¿No sería genial cerrar la brecha entre las aplicaciones web y las específicas de plataformas? ¡Abran paso a la [API Generic Sensor](https://www.w3.org/TR/generic-sensor/), para la web!

## ¿Qué es la API Generic Sensor? {: #what-is-generic-sensor-api }

La [API Generic Sensor](https://www.w3.org/TR/generic-sensor/) es un conjunto de interfaces que exponen los dispositivos de sensor a la plataforma web. La API consta de la base [`Sensor`](https://w3c.github.io/sensors/#the-sensor-interface) y un conjunto de clases de sensores concretas construidas encima. Al tener una interfaz básica se simplifica el proceso de implementación y especificación para las clases concretas de sensores. Por ejemplo, vea la clase [`Gyroscope`](https://w3c.github.io/gyroscope/#gyroscope-interface). ¡Es super pequeña! La funcionalidad principal está especificada por la interfaz base, y `Gyroscope` simplemente la extiende con tres atributos que representan la velocidad angular.

Algunas clases de sensores interactúan con sensores de hardware reales como, por ejemplo, las clases de acelerómetro o giroscopio. Estos se conocen como sensores de bajo nivel. Otros sensores, denominados [sensores agrupados](https://w3c.github.io/sensors/#sensor-fusion), combinan datos de varios sensores de bajo nivel para exponer información que, de otro modo, necesitaría ser calculada por un script. Por ejemplo, el sensor [`AbsoluteOrientation`](https://www.w3.org/TR/orientation-sensor/#absoluteorientationsensor) da una matriz de rotación de cuatro por cuatro lista para usar basada en los datos obtenidos del acelerómetro, giroscopio y magnetómetro.

Podría pensar que la plataforma web ya proporciona datos de sensores ¡y tiene toda la razón! Por ejemplo, los eventos [`DeviceMotion`](https://developer.mozilla.org/docs/Web/API/DeviceMotionEvent) y [`DeviceOrientation`](https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent) exponen los datos del sensor de movimiento. Entonces, ¿por qué necesitamos una nueva API?

En comparación con las interfaces existentes, la API Generic Sensor ofrece una gran cantidad de ventajas:

- La API Generic Sensor es un marco de sensores que se puede ampliar fácilmente con nuevas clases de sensor y cada una de estas clases mantendrá la interfaz genérica. El código de cliente escrito para un tipo de sensor se puede reutilizar para otro ¡con muy pocas modificaciones!
- Puede configurar el sensor. Por ejemplo, puede establecer la frecuencia de muestreo adecuada para las necesidades de su aplicación.
- Puede detectar si hay un sensor disponible en la plataforma.
- Las lecturas del sensor tienen marcas de tiempo de alta precisión, lo que permite una mejor sincronización con otras actividades en su aplicación.
- Los modelos de datos de sensores y los sistemas de coordenadas están claramente definidos, lo que permite a los proveedores de navegadores implementar soluciones interoperables.
- Las interfaces basadas en Generic Sensor no están vinculadas al DOM (lo que significa que no son objetos `navigator` ni `window`), y esto abre oportunidades futuras para usar la API dentro de los trabajadores de servicio o implementarla en runtimes de JavaScript sin encabezado, como dispositivos integrados.
- Los [aspectos de seguridad y privacidad](#privacy-and-security) son la máxima prioridad para la API Generic Sensor y brindan una seguridad mucho mejor en comparación con las APIs de sensores más antiguas. Está integrada con la API Permissions.
- La [sincronización automática con las coordenadas de la pantalla](#synchronization-with-screen-coordinates) está disponible para `Accelerometer`, `Gyroscope`, `LinearAccelerationSensor`, `AbsoluteOrientationSensor`, `RelativeOrientationSensor` y `Magnetometer`.

## Compatibilidad del navegador

La API Generic Sensor es compatible con Google Chrome a partir de la versión 67. La mayoría de los navegadores derivados de Chromium como Microsoft Edge, Opera o Samsung Internet también admiten esta API. Para otros navegadores, consulte [¿Puedo usarlo](https://caniuse.com/mdn-api_sensor). Tenga en cuenta que la API Generic Sensor se puede usar con [polyfill](#polyfill).

## APIs de sensores genéricos disponibles {: #available-generic-sensor-apis }

En el momento de escribir este artículo, hay varios sensores con los que puede experimentar.

**Sensores de movimiento:**

- `Accelerometer`
- `Gyroscope`
- `LinearAccelerationSensor`
- `AbsoluteOrientationSensor`
- `RelativeOrientationSensor`
- `GravitySensor`

**Sensores ambientales:**

- `AmbientLightSensor` (detrás de la bandera `#enable-generic-sensor-extra-classes` en Chromium).
- `Magnetometer` (detrás de la bandera `#enable-generic-sensor-extra-classes` en Chromium).

## Detección de características {: #feature-deployment }

La detección de características de las APIs de hardware es complicada, ya que debe detectar si el navegador es compatible con la interfaz en cuestión *y* si el dispositivo tiene el sensor correspondiente. Comprobar si el navegador es compatible con una interfaz es sencillo. (Reemplace `Accelerometer` con cualquiera de las otras interfaces mencionadas [anteriormente](#available-generic-sensor-apis)).

```js
if ('Accelerometer' in window) {
  // The `Accelerometer` interface is supported by the browser.
  // Does the device have an accelerometer, though?
}
```

Para obtener un resultado de detección de características realmente significativo, también debe intentar conectarse al sensor. Este ejemplo ilustra cómo hacerlo.

```js
let accelerometer = null;
try {
  accelerometer = new Accelerometer({ frequency: 10 });
  accelerometer.onerror = (event) => {
    // Handle runtime errors.
    if (event.error.name === 'NotAllowedError') {
      console.log('Permission to access sensor was denied.');
    } else if (event.error.name === 'NotReadableError') {
      console.log('Cannot connect to the sensor.');
    }
  };
  accelerometer.onreading = (e) => {
    console.log(e);
  };
  accelerometer.start();
} catch (error) {
  // Handle construction errors.
  if (error.name === 'SecurityError') {
    console.log('Sensor construction was blocked by the Permissions Policy.');
  } else if (error.name === 'ReferenceError') {
    console.log('Sensor is not supported by the User Agent.');
  } else {
    throw error;
  }
}
```

## Polyfill

Para los navegadores que no son compatibles con la API Generic Sensor, hay un [polyfill](https://github.com/kenchris/sensor-polyfills) disponible. El polyfill le permite cargar solo las implementaciones de los sensores relevantes.

```js
// Import the objects you need.
import { Gyroscope, AbsoluteOrientationSensor } from './src/motion-sensors.js';

// And they're ready for use!
const gyroscope = new Gyroscope({ frequency: 15 });
const orientation = new AbsoluteOrientationSensor({ frequency: 60 });
```

## ¿Qué son todos estos sensores? ¿Cómo puedo usarlos? {: #what-are-sensors-how-to-use-them }

El tema de los sensores puede necesitar una breve introducción. Si está familiarizado con ellos, puede pasar directamente a la [sección de codificación práctica](#lets-code). De lo contrario, veamos en detalle cada sensor compatible.

### Acelerómetro y sensor de aceleración lineal {: #acceleration-and-linear-accelerometer-sensor }

 <figure>{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/FCf9iuCaNASEB3V0x8Ld.mp4", width="800", autoplay="true", loop="true", muted="true" %} <figcaption> Mediciones del sensor del acelerómetro </figcaption></figure>

El sensor [`Accelerometer`](https://developer.mozilla.org/docs/Web/API/Accelerometer) mide la aceleración del dispositivo que lo aloja en tres ejes (X, Y y Z). Este es un sensor de inercia, lo que significa que cuando el dispositivo está en caída libre lineal, la aceleración total medida sería 0 m/s<sup>2</sup>, y cuando un dispositivo está acostado sobre una mesa, la aceleración en dirección ascendente (eje Z) será igual a la gravedad de la Tierra, es decir, g≈+9.8m/s<sup>2</sup>, ya que mide la fuerza de la mesa que empuja el dispositivo hacia arriba. Si empuja el dispositivo hacia la derecha, la aceleración en el eje X sería positiva o negativa si el dispositivo se acelera de derecha a izquierda.

Los acelerómetros se pueden usar para cosas como: conteo de pasos, detección de movimiento u orientación simple del dispositivo. Muy a menudo, las mediciones del acelerómetro se combinan con datos de otras fuentes para crear sensores agrupados, como sensores de orientación.

[`LinearAccelerationSensor`](https://developer.mozilla.org/docs/Web/API/LinearAccelerationSensor) mide la aceleración que se aplica al dispositivo que lo aloja, excluyendo la contribución de la gravedad. Cuando un dispositivo está en reposo, por ejemplo, acostado sobre la mesa, el sensor mediría≈0 m/s <sup>2</sup> de aceleración en tres ejes.

### Sensor de gravedad {: #gravity-sensor }

Ya es posible para los usuarios derivar manualmente lecturas cercanas a las de un sensor de gravedad inspeccionando manualmente las lecturas del `Accelerometer` y del `LinearAccelerometer`, pero esto puede ser engorroso y depende de la precisión de los valores proporcionados por esos sensores. Las plataformas como Android pueden proporcionar lecturas de gravedad como parte del sistema operativo, que debería ser más económico en términos de cálculo, proporcionar valores más precisos según el hardware del usuario y ser más fácil de usar en términos de ergonomía API. El [`GravitySensor`](https://w3c.github.io/accelerometer/#gravitysensor-interface) devuelve el efecto de la aceleración a lo largo de los ejes X, Y y Z del dispositivo debido a la gravedad.

### Giroscopio {: #gyroscope-sensor }

 <figure>{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/7VItzZMC9Rb2QglsE3s5.mp4", width="800", autoplay="true", loop="true", muted="true" %}<figcaption> Medidas del sensor de giroscopio</figcaption></figure>

El sensor [`Gyroscope`](https://developer.mozilla.org/docs/Web/API/Gyroscope) mide la velocidad angular en radianes por segundo alrededor de los ejes X, Y y Z locales del dispositivo. La mayoría de los dispositivos de consumo tienen [giroscopios mecánicos (MEMS](https://en.wikipedia.org/wiki/Microelectromechanical_systems)), que son sensores inerciales que miden la velocidad de rotación en función de [la fuerza inercial de Coriolis](https://en.wikipedia.org/wiki/Coriolis_force). Los giroscopios MEMS son propensos a la desviación causada por la sensibilidad gravitacional del sensor que deforma el sistema mecánico interno del sensor. Los giroscopios oscilan a frecuencias relativamente altas, por ejemplo, decenas de kHz y, por lo tanto, pueden consumir más energía en comparación con otros sensores.

### Sensores de orientación {: #orientation-sensors }

<figure>{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/rhpW784mCvR78nwg6rd1.mp4", width="800", autoplay="true", loop="true", muted="true" %}<figcaption> Medidas del sensor de orientación absoluta</figcaption></figure>

[`AbsoluteOrientationSensor`](https://developer.mozilla.org/docs/Web/API/AbsoluteOrientationSensor) es un sensor agrupado que mide la rotación de un dispositivo en relación con el sistema de coordenadas de la Tierra, mientras que el [`RelativeOrientationSensor`](https://developer.mozilla.org/docs/Web/API/RelativeOrientationSensor) proporciona datos que representan la rotación de un dispositivo que aloja sensores de movimiento en relación con un sistema de coordenadas de referencia estacionario.

Todos los marcos de JavaScript 3D modernos admiten [cuaterniones](https://en.wikipedia.org/wiki/Quaternion) y [matrices de rotación](https://en.wikipedia.org/wiki/Rotation_matrix) para representar la rotación; sin embargo, si usa WebGL directamente, `OrientationSensor` tiene convenientemente una [propiedad `quaternion`](https://developer.mozilla.org/docs/Web/API/OrientationSensor/quaternion) y un [método `populateMatrix()`](https://developer.mozilla.org/docs/Web/API/OrientationSensor/populateMatrix). Aquí hay algunos fragmentos:

**[three.js](https://threejs.org/docs/index.html#api/core/Object3D.quaternion)**

```js
let torusGeometry = new THREE.TorusGeometry(7, 1.6, 4, 3, 6.3);
let material = new THREE.MeshBasicMaterial({ color: 0x0071c5 });
let torus = new THREE.Mesh(torusGeometry, material);
scene.add(torus);

// Update mesh rotation using quaternion.
const sensorAbs = new AbsoluteOrientationSensor();
sensorAbs.onreading = () => torus.quaternion.fromArray(sensorAbs.quaternion);
sensorAbs.start();

// Update mesh rotation using rotation matrix.
const sensorRel = new RelativeOrientationSensor();
let rotationMatrix = new Float32Array(16);
sensor_rel.onreading = () => {
  sensorRel.populateMatrix(rotationMatrix);
  torus.matrix.fromArray(rotationMatrix);
};
sensorRel.start();
```

**[BABYLON](https://doc.babylonjs.com/typedoc/classes/babylon.abstractmesh#rotationquaternion)**

```js
const mesh = new BABYLON.Mesh.CreateCylinder('mesh', 0.9, 0.3, 0.6, 9, 1, scene);
const sensorRel = new RelativeOrientationSensor({ frequency: 30 });
sensorRel.onreading = () => mesh.rotationQuaternion.FromArray(sensorRel.quaternion);
sensorRel.start();
```

**[WebGL](https://www.khronos.org/registry/webgl/specs/latest/2.0/)**

```js
// Initialize sensor and update model matrix when new reading is available.
let modMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
const sensorAbs = new AbsoluteOrientationSensor({ frequency: 60 });
sensorAbs.onreading = () => sensorAbs.populateMatrix(modMatrix);
sensorAbs.start();

// Somewhere in rendering code, update vertex shader attribute for the model
gl.uniformMatrix4fv(modMatrixAttr, false, modMatrix);
```

Los sensores de orientación permiten varios casos de uso, como juegos inmersivos, realidad aumentada y virtual.

Para obtener más información sobre los sensores de movimiento, los casos de uso avanzados y sus requisitos, consulte el documento [explicador de los sensores de movimiento.](https://w3c.github.io/motion-sensors/)

## Sincronización con las coordenadas de la pantalla {: #synchronization-with-screen-coordinates }

De forma predeterminada, las lecturas de los [sensores espaciales](https://w3c.github.io/sensors/#spatial-sensor) se resuelven en un sistema de coordenadas local que está vinculado al dispositivo y no tiene en cuenta la orientación de la pantalla.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/xI2V6To5gx5WbXunpOBh.png", alt="Sistema de coordenadas del dispositivo", width="800", height="520" %}<figcaption> Sistema de coordenadas del dispositivo</figcaption></figure>

Sin embargo, muchos casos de uso, como juegos o realidad virtual y aumentada, requieren que las lecturas de los sensores se resuelvan en un sistema de coordenadas que, en cambio, esté vinculado a la orientación de la pantalla.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/x1PUlYnAXb9QkqwLV04g.png", alt="Sistema de coordenadas de pantalla", width="800", height="520" %}<figcaption> Sistema de coordenadas de pantalla</figcaption></figure>

Anteriormente, la reasignación de las lecturas del sensor a las coordenadas de la pantalla tenía que implementarse en JavaScript. Este enfoque es ineficaz y también aumenta significativamente la complejidad del código de la aplicación web; la aplicación web debe observar los cambios de orientación de la pantalla y realizar transformaciones de coordenadas para las lecturas de los sensores, lo cual no es algo trivial para los ángulos o cuaterniones de Euler.

¡La API Generic Sensor proporciona una solución mucho más simple y confiable! El sistema de coordenadas local se puede configurar para todas las clases de sensores espaciales definidas: `Accelerometer`, `Gyroscope`, `LinearAccelerationSensor`, `AbsoluteOrientationSensor`, `RelativeOrientationSensor` y `Magnetometer`. Al pasar la opción `referenceFrame` al constructor del objeto sensor, el usuario define si las lecturas devueltas se resolverán en las coordenadas del [dispositivo](https://w3c.github.io/accelerometer/#device-coordinate-system) o de la [pantalla.](https://w3c.github.io/accelerometer/#screen-coordinate-system)

```js
// Sensor readings are resolved in the Device coordinate system by default.
// Alternatively, could be RelativeOrientationSensor({referenceFrame: "device"}).
const sensorRelDevice = new RelativeOrientationSensor();

// Sensor readings are resolved in the Screen coordinate system. No manual remapping is required!
const sensorRelScreen = new RelativeOrientationSensor({ referenceFrame: 'screen' });
```

## ¡Codifiquemos! {: #lets-code }

¡La API Generic Sensor es muy simple y fácil de usar! La interfaz Sensor tiene métodos [`start()`](https://w3c.github.io/sensors/#sensor-start) y [`stop()`](https://w3c.github.io/sensors/#sensor-stop) para controlar el estado del sensor y varios controladores de eventos para recibir notificaciones sobre la activación, errores y lecturas recientes disponibles del sensor. Las clases de sensores concretas generalmente agregan sus atributos de lectura específicos a la clase base.

### Entorno de desarrollo

Durante el desarrollo, podrá utilizar sensores a través de `localhost`. Si está desarrollando para dispositivos móviles, configure el [reenvío de puertos](https://developer.chrome.com/docs/devtools/remote-debugging/local-server/) para su servidor local, ¡y manos a la obra!

Cuando su código esté listo, impleméntelo en un servidor que admita HTTPS. Las [páginas de GitHub](https://pages.github.com/) se sirven a través de HTTPS, lo que lo hace en un excelente lugar para compartir sus demostraciones.

### Rotación del modelo 3D

En este ejemplo simple, usamos los datos de un sensor de orientación absoluta para modificar el cuaternión de rotación de un modelo 3D. `model` es una instancia de clase [`Object3D`](https://threejs.org/docs/index.html#api/core/Object3D) de three.js que tiene una propiedad [`quaternion`](https://threejs.org/docs/index.html#api/core/Object3D.quaternion). El siguiente fragmento de código de la demostración de [orientación del teléfono](https://github.com/intel/generic-sensor-demos/tree/master/orientation-phone) ilustra cómo se puede usar el sensor de orientación absoluta para rotar un modelo 3D.

```js
function initSensor() {
  sensor = new AbsoluteOrientationSensor({ frequency: 60 });
  sensor.onreading = () => model.quaternion.fromArray(sensor.quaternion);
  sensor.onerror = (event) => {
    if (event.error.name == 'NotReadableError') {
      console.log('Sensor is not available.');
    }
  };
  sensor.start();
}
```

La orientación del dispositivo se reflejará en la rotación del `model` 3D dentro de la escena WebGL.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/CdYXzmhv0ZNBvETuC6SX.png", alt="El sensor actualiza la orientación del modelo 3D", width="338", height="368" %}<figcaption> El sensor actualiza la orientación de un modelo 3D</figcaption></figure>

### Punchmeter

El siguiente fragmento de código se extrae de la [demostración del Punchmeter](https://github.com/intel/generic-sensor-demos/tree/master/punchmeter), que ilustra cómo se puede usar el sensor de aceleración lineal para calcular la velocidad máxima de un dispositivo bajo el supuesto de que inicialmente está quieto.

```js
this.maxSpeed = 0;
this.vx = 0;
this.ax = 0;
this.t = 0;

/* … */

this.accel.onreading = () => {
  let dt = (this.accel.timestamp - this.t) * 0.001; // In seconds.
  this.vx += ((this.accel.x + this.ax) / 2) * dt;

  let speed = Math.abs(this.vx);

  if (this.maxSpeed < speed) {
    this.maxSpeed = speed;
  }

  this.t = this.accel.timestamp;
  this.ax = this.accel.x;
};
```

La velocidad actual se calcula como una aproximación a la integral de la función de aceleración.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/37a9DYv1huOcraAMfXpO.png", alt="Aplicación web de demostración para medir la velocidad del puñetazo", width="338", height="347" %}<figcaption> Medición de la velocidad de un puñetazo</figcaption></figure>

## Depuración y anulación de sensores con Chrome DevTools

En algunos casos, no necesita un dispositivo físico para jugar con la API Generic Sensor. Chrome DevTools tiene un gran soporte para [simular la orientación del dispositivo](https://developer.chrome.com/docs/devtools/device-mode/orientation/).

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/OWhCoZXMZllhI7fN7BMR.png", alt="Chrome DevTools utilizadas para anular los datos de orientación personalizados de un teléfono virtual", width="800", height="648" %}<figcaption> Simular la orientación del dispositivo con Chrome DevTools</figcaption></figure>

## Privacidad y seguridad {: #privacy-and-security }

Las lecturas de los sensores son datos confidenciales que pueden estar sujetos a varios ataques de páginas web maliciosas. Las implementaciones de las APIs Generic Sensor imponen algunas limitaciones para mitigar los posibles riesgos de seguridad y privacidad. Los desarrolladores que deseen utilizar la API deben tener en cuenta estas limitaciones, así que enumerémoslas brevemente.

### Solo HTTPS

Debido a que la API Generic Sensor es una característica poderosa, el navegador solo la permite en contextos seguros. En la práctica, significa que para utilizar la API Generic Sensor, deberá acceder a su página a través de HTTPS. Durante el desarrollo, puede hacerlo a través de [http://localhost,](http://localhost) pero para producción deberá tener HTTPS en su servidor. Consulte la colección [Seguro y protegido](/secure/) para conocer las mejores prácticas y pautas.

### Integración de la política de permisos

La [integración de la política de permisos](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/) en la API Generic Sensor controla el acceso a los datos de los sensores para una trama.

De forma predeterminada, los objetos `Sensor` se pueden crear solo dentro de una trama principal o subtramas del mismo origen, evitando así que haya iframes de origen cruzado leyendo datos del sensor de forma no autorizada. Este comportamiento predeterminado se puede modificar habilitando o deshabilitando explícitamente las [funciones controladas por políticas](https://w3c.github.io/webappsec-permissions-policy/#features) correspondientes.

El siguiente fragmento ilustra la concesión de acceso a los datos del acelerómetro a un iframe de origen cruzado, lo que significa que ahora los objetos `Accelerometer` o `LinearAccelerationSensor` se pueden crear allí.

```html
<iframe src="https://third-party.com" allow="accelerometer" />
```

### La entrega de lecturas del sensor se puede suspender

Las lecturas del sensor solo son accesibles a través de una página web visible, es decir, cuando el usuario está interactuando con ella. Además, los datos del sensor no se proporcionarían a la trama principal si el enfoque del usuario cambia a una subtrama de origen cruzado. Esto evita que la trama padre infiera la entrada del usuario.

## ¿Que sigue? {: #whats-next }

Existe un conjunto de clases de sensores ya especificadas que se implementarán en un futuro próximo, como el [sensor de luz ambiental](https://w3c.github.io/ambient-light/) o el [sensor de proximidad](https://w3c.github.io/proximity/); sin embargo, gracias a la gran extensibilidad del marco Generic Sensor, podemos anticipar la aparición de aún más clases nuevas que representen varios tipos de sensores.

Otra área importante para el trabajo futuro es mejorar la API Generic Sensor en sí; la especificación Generic Sensor es actualmente una recomendación candidata, lo que significa que todavía hay tiempo para hacer correcciones e incluir nuevas funciones que los desarrolladores necesitan.

## ¡Usted puede ayudar!

Las especificaciones del sensor alcanzaron el nivel de madurez de [Recomendación Candidata](https://www.w3.org/Consortium/Process/Process-19991111/tr.html#RecsCR), por lo que se agradece mucho la retroalimentación de los desarrolladores web y desarrolladores de navegadores. Háganos saber qué características sería bueno agregar o si hay algo que le gustaría modificar en la API actual.

No dude en informar de [problemas en la especificación](https://github.com/w3c/sensors/issues/new), así como [errores](https://bugs.chromium.org/p/chromium/issues/entry) para la implementación en Chrome.

## Recursos

- Proyectos de demostración: [https://intel.github.io/generic-sensor-demos/](https://intel.github.io/generic-sensor-demos/)
- Especificación de la API de sensor genérico: [https://w3c.github.io/sensors/](https://w3c.github.io/sensors/)
- Problemas de especificación: [https://github.com/w3c/sensors/issues](https://github.com/w3c/sensors/issues)
- Lista de correo del grupo de trabajo del W3C: [public-device-apis@w3.org](mailto:public-device-apis@w3.org)
- Estado de la función de Chrome: [https://www.chromestatus.com/feature/5698781827825664](https://www.chromestatus.com/feature/5698781827825664)
- Errores de implementación: [http://crbug.com?q=component:Blink&gt;Sensor](http://crbug.com?q=component:Blink%3ESensor)

## Agradecimientos

Este artículo fue revisado por [Joe Medley](https://github.com/jpmedley) y [Kayce Basques](https://github.com/kaycebasques). Imagen héroe de [Misko a](https://www.flickr.com/photos/msk13/) través de [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Simple_Gyroscope.jpg).
