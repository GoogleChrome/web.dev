---
layout: post
title: Precarga de rutas en Next.js
authors:
  - mihajlija
subhead: Cómo acelera Next.js la navegación con la precarga de rutas y cómo personalizarla.
date: 2019-11-08
updated: 2022-08-12
feedback:
  - api
---

## ¿Que aprenderá?

En esta publicación, aprenderá cómo funciona el enrutamiento en Next.js, cómo está optimizado para la velocidad y cómo personalizarlo para que se adapte mejor a sus necesidades.

## El componente `<Link>`

En [Next.js](https://nextjs.org/), no es necesario configurar el enrutamiento manualmente. Next.js usa un enrutamiento basado en el sistema de archivos, lo que le permite crear archivos y carpetas dentro del directorio `./pages/`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7cwpyvEgBCIbkqrbsbL0.png", alt="Captura de pantalla de un directorio de páginas que contiene tres archivos: index.js, margherita.js y pineapple-pizza.",  width="376", height="348" %}</figure>

Para enlazar a diferentes páginas, use el componente [`<Link>`](https://nextjs.org/docs/api-reference/next/link), de manera similar a como usaría el viejo elemento `<a>`:

```js
<Link href="/margherita">
  <a>Margherita</a>
</Link>
```

Cuando usa el elemento `<Link>` para la navegación, Next.js hace un poco más por usted. Normalmente, una página se descarga cuando usted sigue un enlace a ella, pero Next.js busca automáticamente el JavaScript necesario para renderizar la página.

Cuando carga una página con algunos enlaces, lo más probable es que cuando siga un enlace, el componente detrás de él ya se haya cargado. Esto mejora la capacidad de respuesta de la aplicación al agilizar la navegación a nuevas páginas.

En la aplicación de ejemplo a continuación, la página `index.js` se enlaza a `margherita.js` con un `<Link>`:

{% Glitch { id: 'nextjs-prefetching', path: 'pages/index.js', height: 480 } %}

Utilice Chrome DevTools para verificar que `margherita.js` se haya precargado: {% Instruction 'preview', 'ol' %}

{% Instruction 'devtools-network', 'ol' %}

{% Instruction 'disable-cache', 'ol' %}

{% Instruction 'reload-page', 'ol' %}

Cuando usted carga `index.js`, la pestaña **Red** muestra que `margherita.js` se descarga también:

{% Img src="image/admin/ajJKWGvPidRa1nvqzXKL.png", alt="Pestaña DevTools Network con margherita.js resaltado.", width="800", height="639" %}

## Cómo funciona la precarga automática

Next.js precarga solo los enlaces que aparecen en la ventana gráfica y usa la [API observador de intersecciones](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) para detectarlos. También deshabilita la precarga cuando la conexión de red es lenta o cuando los usuarios tienen activada la función [`Save-Data`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Save-Data). Según estas comprobaciones, Next.js inyecta dinámicamente las etiquetas [`<link rel="preload">`](/preload-critical-assets/) para descargar componentes para navegaciones posteriores.

Next.js solo *lee* JavaScript; no lo ejecuta. De esa manera, no descargará ningún contenido adicional que la página precargada pueda solicitar hasta que visite el enlace.

{% Aside 'caution' %} Los ejemplos de fallas se ejecutan en modo de producción porque la precarga depende de las condiciones de navegación y está habilitada solo en compilaciones de producción optimizadas. Para cambiar al modo de desarrollo, verifique el archivo `README.md` en los ejemplos de Glitch. {% endAside %}

{% Aside %} Debido a que `<link rel="preload">` solicita recursos con prioridad alta, el navegador espera que se utilicen de inmediato, lo que activa las advertencias de la consola. Las [sugerencias de prioridad](/priority-hints/) pronto estarán disponibles en Chrome, lo que permitirá que Next.js indique una prioridad más baja para los recursos que no se necesitan de inmediato con `<link rel="preload" fetchpriority="low">`. {% endAside %}

## Evite la precarga innecesaria

Para evitar la descarga de contenido innecesario, puede deshabilitar la precarga para las páginas poco visitadas si establece la propiedad `prefetch` en `<Link>` como `false`:

```js
<Link href="/pineapple-pizza" prefetch={false}>
  <a>Pineapple pizza</a>
</Link>
```

En esta segunda aplicación de ejemplo, la página `index.js` tiene un `<Link>` a `pineapple-pizza.js` con el parámetro `prefetch` establecido en `false`:

{% Glitch { id: 'nextjs-noprefetch', path: 'pages/index.js:12:50', height: 480 } %}

Para inspeccionar la actividad de la red, siga los pasos del primer ejemplo. Cuando carga `index.js` , la pestaña **Red** de DevTools muestra que se descargó  `margherita.js`, pero no `pineapple-pizza.js`:

{% Img src="image/admin/8YTg0ym7vJbQm9oCVQYz.png", alt="Pestaña Red de DevTools con margherita.js resaltado.", width="800", height="639" %}

## Precarga con enrutamiento personalizado

El componente `<Link>` es adecuado para la mayoría de los casos de uso, pero también puede crear su propio componente para realizar el enrutamiento. Next.js se lo facilita con la API de enrutador disponible en [`next/router`](https://nextjs.org/docs/api-reference/next/router#userouter). Si desea hacer algo (por ejemplo, enviar un formulario) antes de navegar hacia una nueva ruta, puede definirlo en su código de ruta personalizado.

Cuando utiliza componentes personalizados para el enrutamiento, también puede agregarles la precarga. Para llevar a cabo la precarga en el código de enrutamiento, utilice el método `prefetch` de `useRouter`.

Échele un vistazo a `components/MyLink.js` en esta aplicación de ejemplo:

{% Glitch { id: 'custom-routing-nextjs', path: 'components/MyLink.js', height: 480 } %}

La precarga se realiza dentro del gancho [`useEffect`](https://reactjs.org/docs/hooks-effect.html). Si la propiedad `prefetch` en un `<MyLink>` se establece en `true`, la ruta especificada en la `href` se precarga cuando se representa ese `<MyLink>`:

```js
useEffect(() => {
    if (prefetch) router.prefetch(href)
});
```

Cuando hace clic en el enlace, el enrutamiento se realiza en `handleClick`. Se registra un mensaje en la consola y el método `push` navega a la nueva ruta especificada en `href`:

```js
const handleClick = e => {
    e.preventDefault();
    console.log("Having fun with Next.js.");
    router.push(href);
};

```

En esta aplicación de ejemplo, la página `index.js` tiene un `<MyLink>` para `margherita.js` y para `pineapple-pizza.js`. La propiedad `prefetch` se establece en `true` para `/margherita` y en `false` para `/pineapple-pizza`.

```js
<MyLink href="/margherita" title="Margherita" prefetch={true} />
<MyLink href="/pineapple-pizza"  title="Pineapple pizza" prefetch={false} />
```

Cuando usted carga `index.js`, la pestaña **Red** muestra que `margherita.js` se descarga y `pineapple-pizza.js` no:

{% Img src="image/admin/MWPy8nvBJCnzy4zGVRln.png", alt="Pestaña Red de DevTools con margherita.js resaltado.", width="800", height="639" %}

Al hacer clic en cualquiera de los enlaces, la **Consola** registra "Divertirse con Next.js." y navega a la nueva ruta:

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/goiEqi3SIWJBUqsk7j6H.png", alt="La consola DevTools muestra el mensaje 'Divertirse con Next.js.'", width="800", height="690" %}

## Conclusión

Cuando se usa `<Link>`, Next.js busca automáticamente el JavaScript necesario para representar la página enlazada, lo que agiliza la navegación a nuevas páginas. Si está utilizando el enrutamiento personalizado, puede usar la API del enrutador Next.js para implementar la precarga usted mismo. Evite descargar contenido innecesariamente al desactivar la precarga las páginas poco visitadas.
