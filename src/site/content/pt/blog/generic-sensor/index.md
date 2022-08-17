---
title: Sensores para a Web
subhead: Use a API Generic Sensor para ter acesso a sensores no dispositivo, como acelerômetros, giroscópios e magnetômetros.
authors:
  - alexshalamov
  - pozdnyakov
  - thomassteiner
description: Os sensores são usados em vários aplicativos para habilitar recursos avançados, como jogos, que consideram a orientação ou a aceleração do dispositivo em que são executados. A API Generic Sensor fornece uma interface genérica para o acesso a esses dados de sensores na Web.
date: 2017-09-18
updated: 2021-02-17
tags:
  - blog
  - devices
  - capabilities
hero: image/admin/2AGc7aV66zc69fiqNJBZ.jpg
alt: Um giroscópio simples.
---

Hoje, os dados dos sensores são usados em vários aplicativos específicos para uma plataforma para permitir casos de uso, como jogos imersivos, monitoramento de condicionamento físico e realidade aumentada ou virtual. Não seria legal conectar os aplicativos específicos para uma plataforma e os aplicativos Web? Use a [API Generic Sensor](https://www.w3.org/TR/generic-sensor/) (Sensor Genérico) para a Web!

## O que é a API Generic Sensor? {: #what-is-generic-sensor-api }

A [API Generic Sensor](https://www.w3.org/TR/generic-sensor/) é um conjunto de interfaces que expõe os sensores à plataforma da Web. A API consiste em uma interface [`Sensor`](https://w3c.github.io/sensors/#the-sensor-interface) de base e um conjunto de classes de sensores concretos desenvolvidos em cima disso. A interface de base simplifica o processo de implementação e especificação das classes de sensores concretos. Por exemplo, veja a classe [`Gyroscope`](https://w3c.github.io/gyroscope/#gyroscope-interface). É muito pequena! A funcionalidade principal é especificada pela interface de base e o `Gyroscope` apenas a amplia com três atributos que representam a velocidade angular.

Algumas classes de sensores fazem interface com sensores de hardware reais, como classes de acelerômetros ou giroscópios. Eles são chamados de sensores de baixo nível. Outros tipos, chamados de [sensores de fusão](https://w3c.github.io/sensors/#sensor-fusion), mesclam os dados de vários sensores de baixo nível para expor as informações que um script precisaria calcular. Por exemplo, o sensor [`AbsoluteOrientation`](https://www.w3.org/TR/orientation-sensor/#absoluteorientationsensor) fornece uma matriz de rotação quatro por quatro pronta para uso com base nos dados do acelerômetro, giroscópio e magnetômetro.

Você pode achar que a plataforma da Web já fornece os dados dos sensores e está absolutamente certo! Por exemplo, os eventos [`DeviceMotion`](https://developer.mozilla.org/docs/Web/API/DeviceMotionEvent) e [`DeviceOrientation`](https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent) expõem os dados dos sensores de movimento. Então, por que precisamos de uma nova API?

Em comparação com as interfaces existentes, a API Generic Sensor oferece um grande número de vantagens:

- A API Generic Sensor é um framework de sensores que pode ser facilmente ampliado com novas classes e cada uma delas manterá a interface genérica. O código do cliente escrito para um tipo de sensor pode ser reutilizado para outro com poucas modificações.
- É possível configurar o sensor. Por exemplo, você pode definir a frequência de amostragem adequada de acordo com as necessidades do aplicativo.
- Você pode detectar se um sensor está disponível na plataforma.
- As leituras do sensor têm carimbos de data e hora de alta precisão, permitindo uma melhor sincronização com as outras atividades no aplicativo.
- Os modelos dos dados de sensores e os sistemas de coordenadas são claramente definidos, permitindo que os fornecedores de navegadores implementem soluções interoperáveis.
- As interfaces baseadas na API Generic Sensor não estão vinculadas ao DOM, o que significa que não são objetos `navigator` nem `window`, e isso abre oportunidades futuras para usar a API em service workers ou implementá-la em tempos de execução de JavaScript sem interface, como os dispositivos incorporados.
- A [segurança e privacidade](#privacy-and-security) é a principal prioridade da API Generic Sensor, que fornece muito mais segurança em comparação com as APIs de sensores mais antigas. Há integração com a API Permissions.
- A [sincronização automática com as coordenadas da tela](#synchronization-with-screen-coordinates) está disponível para `Accelerometer`, `Gyroscope`, `LinearAccelerationSensor`, `AbsoluteOrientationSensor`, `RelativeOrientationSensor` e `Magnetometer`.

## Compatibilidade com os navegadores

A API Generic Sensor é compatível com o Google Chrome a partir da versão 67. A maioria dos navegadores derivados do Chromium, como o Microsoft Edge, o Opera ou o Samsung Internet, também oferecem suporte à API. Para outros navegadores, consulte [Posso usar](https://caniuse.com/mdn-api_sensor). Observe que o [polyfill](#polyfill) está disponível para a API Generic Sensor.

## APIs de sensores genéricos disponíveis {: #available-generic-sensor-apis }

No momento, vários sensores estão disponíveis para você experimentar.

**Sensores de movimento:**

- `Accelerometer`
- `Gyroscope`
- `LinearAccelerationSensor`
- `AbsoluteOrientationSensor`
- `RelativeOrientationSensor`
- `GravitySensor`

**Sensores de ambiente:**

- `AmbientLightSensor` (na sinalização `#enable-generic-sensor-extra-classes` do Chromium)
- `Magnetometer` (na sinalização `#enable-generic-sensor-extra-classes` do Chromium)

## Detecção de recursos {: #feature-detection }

A detecção de recursos das APIs de hardware é complicada, pois você precisa detectar se o navegador é compatível com a interface em questão *e* se o dispositivo possui o sensor correspondente. Verificar se o navegador oferece suporte a uma interface é simples. Substitua `Accelerometer` por qualquer uma das outras interfaces mencionadas [acima](#available-generic-sensor-apis).

```js
if ('Accelerometer' in window) {
  // A interface 'Accelerometer' é compatível com o navegador.
  // Porém, o dispositivo tem um acelerômetro?
}
```

Para ter um resultado realmente significativo com a detecção de recursos, você também precisa tentar se conectar ao sensor. Este exemplo mostra como fazer isso.

```js
let accelerometer = null;
try {
  accelerometer = new Accelerometer({ frequency: 10 });
  accelerometer.onerror = (event) => {
    // Lide com os erros de tempo de execução.
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
  // Lide com os erros de construção.
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

Para os navegadores que não são compatíveis com a API Generic Sensor, o [polyfill](https://github.com/kenchris/sensor-polyfills) está disponível. Ele permite carregar apenas as implementações dos sensores relevantes.

```js
// Importe os objetos necessários.
import { Gyroscope, AbsoluteOrientationSensor } from './src/motion-sensors.js';

// E estão prontos para uso!
const gyroscope = new Gyroscope({ frequency: 15 });
const orientation = new AbsoluteOrientationSensor({ frequency: 60 });
```

## O que são todos esses sensores? Como posso usá-los? {: #what-are-sensors-how-to-use-them }

Talvez seja necessária uma breve introdução aos sensores. Se você está familiarizado com eles, pule direto para a [seção de programação prática](#lets-code). Caso contrário, vamos analisar cada sensor compatível em detalhes.

### Acelerômetro e sensor de aceleração linear {: #acceleration-and-linear-accelerometer-sensor }

 <figure>{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/FCf9iuCaNASEB3V0x8Ld.mp4", width="800", autoplay="true", loop="true", muted="true" %} <figcaption> Medidas do acelerômetro</figcaption></figure>

O sensor [`Accelerometer`](https://developer.mozilla.org/docs/Web/API/Accelerometer) mede a aceleração de um dispositivo que hospeda o sensor em três eixos (X, Y e Z). É um sensor inercial, ou seja, quando o dispositivo está em queda livre linear, a aceleração total medida é de 0 m/s<sup>2</sup>, e, quando o dispositivo está deitado sobre uma mesa, a aceleração para cima (eixo Z) é igual à gravidade da Terra, aproxidamente +9,8 m/s<sup>2</sup>, pois mede a força da mesa empurrando o dispositivo para cima. Se você empurrar o dispositivo para a direita, a aceleração no eixo X será positiva. Se ele for acelerado da direita para a esquerda, essa aceleração será negativa.

Os acelerômetros podem ser usados para, por exemplo, a contagem de passos, a detecção de movimento ou a orientação simples do dispositivo. Muitas vezes, as medidas do acelerômetro são combinadas com os dados de outras origens para criar sensores de fusão, como os sensores de orientação.

O [`LinearAccelerationSensor`](https://developer.mozilla.org/docs/Web/API/LinearAccelerationSensor) mede a aceleração que é aplicada ao dispositivo que hospeda o sensor, excluindo a contribuição da gravidade. Quando um dispositivo está em repouso, por exemplo, sobre uma mesa, o sensor mede uma aceleração de aproximadamente 0 m/s<sup>2</sup> nos três eixos.

### Sensor de gravidade {: # gravity-sensor }

Os usuários já conseguem derivar manualmente leituras próximas às de um sensor de gravidade ao inspecionar as leituras do `Accelerometer` e  `LinearAccelerometer`. No entanto, isso pode ser complicado e depende da precisão dos valores fornecidos pelos sensores. Plataformas como o Android podem fornecer leituras de gravidade como parte do sistema operacional, o que é mais barato em termos de computação, fornece valores mais precisos dependendo do hardware do usuário e é mais fácil de usar em relação à ergonomia da API. O [`GravitySensor`](https://w3c.github.io/accelerometer/#gravitysensor-interface) retorna o efeito de aceleração ao longo dos eixos X, Y e Z do dispositivo devido à gravidade.

### Giroscópio {: #gyroscope-sensor }

 <figure>{% Video src="https://github.com/GoogleChrome/web.dev/blob/main/src/site/content/en/blog/generic-sensor/video/8WbTDNrhLsU0El80frMBGE4eMCD3/7VItzZMC9Rb2QglsE3s5.mp4?raw=true", width="800", autoplay="true", loop="true", muted="true" %}<br>Medidas do giroscópio</figure>

O [`Gyroscope`](https://developer.mozilla.org/docs/Web/API/Gyroscope) mede a velocidade angular em radianos por segundo em torno dos eixos X, Y e Z locais do dispositivo. A maioria dos dispositivos para consumidores tem giroscópios mecânicos ([MEMS](https://en.wikipedia.org/wiki/Microelectromechanical_systems)), que são sensores inerciais que medem a taxa de rotação com base na [força inercial de Coriolis](https://en.wikipedia.org/wiki/Coriolis_force). Os giroscópios MEMS são propensos à deriva causada pela sensibilidade gravitacional do sensor, que deforma o sistema mecânico interno dele. Os giroscópios oscilam em frequências relativamente altas (por exemplo, 10s de kHz) e, portanto, podem consumir mais energia em comparação com outros sensores.

### Sensores de orientação {: #orientation-sensors }

<figure>% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/rhpW784mCvR78nwg6rd1.mp4", width="800", autoplay="true", loop="true", muted="true" %} <figcaption> Medidas do sensor de orientação absoluta</figcaption></figure>

O [`AbsoluteOrientationSensor`](https://developer.mozilla.org/docs/Web/API/AbsoluteOrientationSensor) é um sensor de fusão que mede a rotação de um dispositivo em relação ao sistema de coordenadas da Terra, enquanto o [`RelativeOrientationSensor`](https://developer.mozilla.org/docs/Web/API/RelativeOrientationSensor) fornece dados que representam a rotação de um dispositivo que hospeda sensores de movimento em relação a um sistema de coordenadas de referência estático.

Todos os frameworks de JavaScript 3D modernos são compatíveis com os [quatérnios](https://en.wikipedia.org/wiki/Quaternion) e as [matrizes de rotação](https://en.wikipedia.org/wiki/Rotation_matrix) para representar a rotação. No entanto, se você usar o WebGL diretamente, o `OrientationSensor` convenientemente possui uma [propriedade `quaternion`](https://developer.mozilla.org/docs/Web/API/OrientationSensor/quaternion) e um [método `populateMatrix()`](https://developer.mozilla.org/docs/Web/API/OrientationSensor/populateMatrix). Aqui estão alguns snippets:

**[three.js](https://threejs.org/docs/index.html#api/core/Object3D.quaternion)**

```js
let torusGeometry = new THREE.TorusGeometry(7, 1.6, 4, 3, 6.3);
let material = new THREE.MeshBasicMaterial({ color: 0x0071c5 });
let torus = new THREE.Mesh(torusGeometry, material);
scene.add(torus);

// Atualize a rotação de malha usando o quatérnio.
const sensorAbs = new AbsoluteOrientationSensor();
sensorAbs.onreading = () => torus.quaternion.fromArray(sensorAbs.quaternion);
sensorAbs.start();

// Atualize a rotação de malha usando a matriz de rotação.
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
// Inicialize o sensor e atualize a matriz do modelo quando a nova leitura estiver disponível.
let modMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
const sensorAbs = new AbsoluteOrientationSensor({ frequency: 60 });
sensorAbs.onreading = () => sensorAbs.populateMatrix(modMatrix);
sensorAbs.start();

// Na renderização do código, atualize o atributo de sombras do vértice para o modelo
gl.uniformMatrix4fv(modMatrixAttr, false, modMatrix);
```

Os sensores de orientação permitem vários casos de uso, como jogos imersivos e a realidade aumentada e virtual.

Para mais informações sobre os sensores de movimento, casos de uso avançados e requisitos, verifique o documento [explicativo sobre os sensores de movimento](https://w3c.github.io/motion-sensors/).

## Sincronização com as coordenadas da tela {: #synchronization-with-screen-coordinates }

Por padrão, as leituras dos [sensores espaciais](https://w3c.github.io/sensors/#spatial-sensor) são resolvidas em um sistema de coordenadas local vinculado ao dispositivo e não considera a orientação da tela.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/xI2V6To5gx5WbXunpOBh.png", alt="Sistema de coordenadas do dispositivo", width="800", height="520" %} <figcaption>Sistema de coordenadas do dispositivo</figcaption></figure>

No entanto, vários casos de uso, como os jogos ou a realidade aumentada e virtual, exigem que as leituras dos sensores sejam resolvidas em um sistema de coordenadas que, em vez disso, está vinculado à orientação da tela.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/x1PUlYnAXb9QkqwLV04g.png", alt="Sistema de coordenadas da tela", width="800", height="520" %} <figcaption>Sistema de coordenadas da tela</figcaption></figure>

Anteriormente, o remapeamento das leituras dos sensores para as coordenadas da tela precisava ser implementado no JavaScript. Essa abordagem é ineficiente e também aumenta significativamente a complexidade do código do aplicativo da Web. O aplicativo precisa observar as mudanças de orientação da tela e realizar transformações de coordenadas para as leituras dos sensores, o que não é fácil para quatérnios ou ângulos de Euler.

A API Generic Sensor oferece uma solução muito mais simples e confiável. O sistema de coordenadas local é configurável para todas as classes definidas de sensores espaciais: `Accelerometer`, `Gyroscope`, `LinearAccelerationSensor`, `AbsoluteOrientationSensor`, `RelativeOrientationSensor` e `Magnetometer`. Ao transmitir a opção  `referenceFrame` para o construtor de objeto do sensor, o usuário define se as leituras retornadas serão resolvidas nas coordenadas do [dispositivo](https://w3c.github.io/accelerometer/#device-coordinate-system) ou da [tela](https://w3c.github.io/accelerometer/#screen-coordinate-system).

```js
// As leituras dos sensores são resolvidas no sistema de coordenadas do dispositivo por padrão.
// Como alternativa, pode ser RelativeOrientationSensor({referenceFrame: "device"}).
const sensorRelDevice = new RelativeOrientationSensor();

// As leituras dos sensores são resolvidas no sistema de coordenadas da tela. O remapeamento manual não é necessário.
const sensorRelScreen = new RelativeOrientationSensor({ referenceFrame: 'screen' });
```

## Vamos programar! {: #lets-code }

A API Generic Sensor é muito simples e fácil de usar. A interface tem métodos [`start()`](https://w3c.github.io/sensors/#sensor-start) e [`stop()`](https://w3c.github.io/sensors/#sensor-stop) para controlar o estado do sensor e vários manipuladores de eventos para receber notificações sobre a ativação do sensor, os erros e as últimas leituras disponíveis. As classes de sensores concretos geralmente adicionam seus atributos de leitura específicos à classe base.

### Ambiente de desenvolvimento

Durante o desenvolvimento, você poderá usar sensores pelo `localhost`. Se estiver desenvolvendo para dispositivos móveis, configure o [encaminhamento de porta](https://developer.chrome.com/docs/devtools/remote-debugging/local-server/) para seu servidor local e você está pronto para começar.

Quando o código estiver pronto, faça a implantação em um servidor que ofereça suporte a HTTPS. As [páginas do GitHub](https://pages.github.com/) são exibidas em HTTPS e, por isso, são ótimas para compartilhar demonstrações.

### Rotação do modelo 3D

Neste exemplo simples, usamos os dados de um sensor de orientação absoluta para modificar o quatérnio de rotação de um modelo 3D. O `model` é uma instância da classe [`Object3D`](https://threejs.org/docs/index.html#api/core/Object3D) three.js que possui uma propriedade [`quaternion`](https://threejs.org/docs/index.html#api/core/Object3D.quaternion). O seguinte snippet de código da demonstração de [orientação do smartphone](https://github.com/intel/generic-sensor-demos/tree/master/orientation-phone) mostra como o sensor de orientação absoluta pode ser usado para girar um modelo 3D.

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

A orientação do dispositivo será refletida na rotação do  `model` 3D na cena WebGL.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/CdYXzmhv0ZNBvETuC6SX.png", alt="Atualização da orientação do modelo 3D pelo sensor", width="338", height="368" %}<br>Atualização da orientação do modelo 3D pelo sensor</figure>

### Medidor de socos

O snippet de código a seguir foi extraído da [demonstração do medidor de socos](https://github.com/intel/generic-sensor-demos/tree/master/punchmeter), ilustrando como o sensor de aceleração linear pode ser usado para calcular a velocidade máxima de um dispositivo, supondo que ele esteja inicialmente parado.

```js
this.maxSpeed = 0;
this.vx = 0;
this.ax = 0;
this.t = 0;

/* … */

this.accel.onreading = () => {
  let dt = (this.accel.timestamp - this.t) * 0.001; // Em segundos.
  this.vx += ((this.accel.x + this.ax) / 2) * dt;

  let speed = Math.abs(this.vx);

  if (this.maxSpeed < speed) {
    this.maxSpeed = speed;
  }

  this.t = this.accel.timestamp;
  this.ax = this.accel.x;
};
```

A velocidade atual é calculada como uma aproximação da integral da função de aceleração.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/37a9DYv1huOcraAMfXpO.png", alt="Demonstração de app da Web para medir a velocidade de um soco", width="338", height="347" %}<br>Medida da velocidade de um soco</figure>

## Depuração e substituição do sensor com o Chrome DevTools

Em alguns casos, você não precisa de um dispositivo físico para testar a API Generic Sensor. O Chrome DevTools oferece um ótimo suporte para [simular a orientação do dispositivo](https://developer.chrome.com/docs/devtools/device-mode/orientation/).

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/OWhCoZXMZllhI7fN7BMR.png", alt="Uso do Chrome DevTools para substituir os dados de orientação personalizados de um telefone virtual", width="800", height="648" %} <figcaption>Simulação da orientação do dispositivo com o Chrome DevTools</figcaption></figure>

## Privacidade e segurança {: #privacy-and-security }

As leituras dos sensores são dados confidenciais que podem estar sujeitos a vários ataques de páginas da Web maliciosas. As implementações das APIs de sensores genéricos impõem algumas limitações para mitigar os possíveis riscos de segurança e privacidade. Essas limitações devem ser levadas em consideração pelos desenvolvedores que pretendem usar a API, portanto, vamos listá-las resumidamente.

### Apenas HTTPS

Como a API Generic Sensor é um recurso poderoso, ela só é permitida pelo navegador em contextos seguros. Na prática, significa que, para usar a API Generic Sensor, você precisará acessar sua página por meio de HTTPS. Durante o desenvolvimento, você pode fazer isso pelo [http://localhost](http://localhost), mas, na produção, você precisará habilitar o HTTPS no seu servidor. Consulte a coleção [Seguro e protegido](/secure/) para conferir as práticas recomendadas e diretrizes.

### Integração com as políticas de permissão

A [integração com as políticas de permissão](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/) na API Generic Sensor controla o acesso aos dados dos sensores para um frame.

Por padrão, os objetos `Sensor` podem ser criados apenas dentro de um frame principal ou subframes de mesma origem, evitando que iframes de origem cruzada não autorizados leiam os dados dos sensores. Esse comportamento padrão pode ser modificado ativando ou desativando explicitamente os [recursos controlados pelas políticas](https://w3c.github.io/webappsec-permissions-policy/#features) correspondentes.

O snippet abaixo mostra o acesso aos dados do acelerômetro concedido para um iframe de origem cruzada, ou seja, agora os objetos `Accelerometer` ou `LinearAccelerationSensor` podem ser criados ali.

```html
<iframe src="https://third-party.com" allow="accelerometer" />
```

### A entrega das leituras dos sensores pode ser suspensa

As leituras dos sensores podem ser acessadas apenas por uma página da Web visível, ou seja, quando o usuário está realmente interagindo com ela. Além disso, os dados dos sensores não são fornecidos ao frame pai se o foco do usuário mudar para um subframe de origem cruzada. Isso evita a interferência do frame pai no input do usuário.

## O que está por vir? {: #whats-next }

Um conjunto de classes de sensores já especificadas serão implementadas em um futuro próximo, como o [Sensor de luz ambiente](https://w3c.github.io/ambient-light/) ou o [Sensor de proximidade](https://w3c.github.io/proximity/). No entanto, graças à grande extensibilidade do framework da Generic Sensor, podemos antecipar o surgimento de ainda mais classes novas representando vários tipos de sensores.

Outra área importante para trabalho futuro é o aprimoramento da própria API Generic Sensor. A especificação é atualmente uma Recomendação do candidato, o que significa que ainda há tempo para fazer correções e trazer novas funcionalidades de que os desenvolvedores precisam.

## Você pode ajudar!

As especificações dos sensores atingiram o nível de maturidade [Recomendação do candidato](https://www.w3.org/Consortium/Process/Process-19991111/tr.html#RecsCR). Portanto, o feedback dos desenvolvedores da Web e do navegador é muito apreciado. Informe quais recursos você queria que fossem adicionados ou se há algo que você gostaria de modificar na API atual.

Sinta-se à vontade para registrar [problemas de especificação](https://github.com/w3c/sensors/issues/new), bem como [bugs](https://bugs.chromium.org/p/chromium/issues/entry) na implementação do Chrome.

## Recursos

- Projetos de demonstração: [https://intel.github.io/generic-sensor-demos/](https://intel.github.io/generic-sensor-demos/)
- Especificação da API Generic Sensor: [https://w3c.github.io/sensors/](https://w3c.github.io/sensors/)
- Problemas de especificação: [https://github.com/w3c/sensors/issues](https://github.com/w3c/sensors/issues)
- Lista de e-mail do grupo de trabalho do W3C: [public-device-apis@w3.org](mailto:public-device-apis@w3.org)
- Status do recurso do Chrome: [https://www.chromestatus.com/feature/5698781827825664](https://www.chromestatus.com/feature/5698781827825664)
- Bugs de implementação: [http://crbug.com?q=component:Blink&gt;Sensor](http://crbug.com?q=component:Blink%3ESensor)

## Agradecimentos

Este artigo foi revisado por [Joe Medley](https://github.com/jpmedley) e [Kayce Basques](https://github.com/kaycebasques). Imagem principal por [Misko](https://www.flickr.com/photos/msk13/) via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Simple_Gyroscope.jpg).
