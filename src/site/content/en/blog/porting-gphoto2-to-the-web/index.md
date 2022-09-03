---
title: 'Porting USB applications to the web. Part 2: gPhoto2'
subhead: Learn how gPhoto2 was ported to WebAssembly to control external cameras over USB from a web app.
description: Learn how gPhoto2 was ported to WebAssembly to control external cameras over USB from a web app.
date: 2022-02-01
hero: image/9oK23mr86lhFOwKaoYZ4EySNFp02/MR4YGRvl0Z9AWT6vv3sQ.jpg
alt: A picture of DSLR camera connected via a USB cable to a laptop. The laptop is running the web demo mentioned in the article, which mirrors a live video feed from the camera and allows tweaking of its settings via form controls.
authors:
  - rreverser
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - webassembly
  - capabilities
  - devices
---

In [the previous post](/porting-libusb-to-webusb/) I showed how the [libusb](https://libusb.info/) library was ported to run on the web with WebAssembly / [Emscripten](https://emscripten.org/), Asyncify, and [WebUSB](/usb/).

I also showed [a demo](/porting-libusb-to-webusb/#first-things-first-a-demo) built with [gPhoto2](http://gphoto.org/) that can control DSLR and mirrorless cameras over USB from a web application. In this post I'll go deeper into the technical details behind the gPhoto2 port.

## Pointing build systems to custom forks

Since I was targeting WebAssembly, I couldn't use the libusb and libgphoto2 provided by the system distributions. Instead, I needed my application to use my custom fork of libgphoto2, while that fork of libgphoto2 had to use my custom fork of libusb.

Additionally, libgphoto2 uses libtool for loading dynamic plugins, and even though I didn't have to fork libtool like the other two libraries, I still had to build it to WebAssembly, and point libgphoto2 to that custom build instead of the system package.

Here's an approximate dependency diagram (dashed lines denote dynamic linking):

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/ziuavwzLjYb5ZopEUzvi.svg", alt="A diagram shows 'the app' depending on 'libgphoto2 fork', which depends on 'libtool'. 'libtool' block depends dynamically on 'libgphoto2 ports' and 'libgphoto2 camlibs'. Finally, 'libgphoto2 ports' depends statically on the 'libusb fork'.", width="800", height="481" %}

Most configure-based build systems, including the ones used in these libraries, allow overriding paths for dependencies via various flags, so that's what I tried to do first. However, when the dependency graph becomes complex, the list of path overrides for each library's dependencies becomes verbose and error-prone. I also found some bugs where build systems weren't actually prepared for their dependencies to live in non-standard paths.

Instead, an easier approach is to create a separate folder as a custom system root (often shortened to "sysroot") and point all the involved build systems to it. That way, each library will both search for its dependencies in the specified sysroot during build, and it will also install itself in the same sysroot so that others can find it more easily.

Emscripten already has its own sysroot under `(path to emscripten cache)/sysroot`, which it uses for its [system libraries](https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-link-against-system-libraries-like-sdl-boost-etc), [Emscripten ports](https://emscripten.org/docs/compiling/Building-Projects.html#emscripten-ports), and tools like CMake and pkg-config. I chose to reuse the same sysroot for my dependencies too.

```makefile
# This is the default path, but you can override it
# to store the cache elsewhere if you want.
#
# For example, it might be useful for Docker builds
# if you want to preserve the deps between reruns.
EM_CACHE = $(EMSCRIPTEN)/cache

# Sysroot is always under the `sysroot` subfolder.
SYSROOT = $(EM_CACHE)/sysroot

# …

# For all dependencies I've used the same ./configure command with the
# earlier defined SYSROOT path as the --prefix.
deps/%/Makefile: deps/%/configure
        cd $(@D) && ./configure --prefix=$(SYSROOT) # …
```

With such configuration, I only needed to run `make install` in each dependency, which installed it under the sysroot, and then the libraries found each other automatically.

## Dealing with dynamic loading

As mentioned above, libgphoto2 uses libtool to enumerate and dynamically load I/O port adapters and camera libraries. For example, the code for loading I/O libraries looks like this:

```c
lt_dlinit ();
lt_dladdsearchdir (iolibs);
result = lt_dlforeachfile (iolibs, foreach_func, list);
lt_dlexit ();
```

There are a few problems with this approach on the web:

- There is no standard support for dynamic linking of WebAssembly modules. Emscripten has its [custom implementation](https://emscripten.org/docs/compiling/Dynamic-Linking.html) that can simulate the [`dlopen()`](https://man7.org/linux/man-pages/man3/dlopen.3.html) API used by libtool, but it requires you to build "main'' and "side" modules with different flags, and, specifically for `dlopen()`, also to [preload the side modules into the emulated filesystem](https://emscripten.org/docs/compiling/Dynamic-Linking.html#runtime-dynamic-linking-with-dlopen) during the application start-up. It can be difficult to integrate those flags and tweaks into an existing autoconf build system with lots of dynamic libraries.
- Even if the `dlopen()` itself is implemented, there's no way to enumerate all dynamic libraries in a certain folder on the web, because most HTTP servers don't expose directory listings for security reasons.
- Linking dynamic libraries on the command line instead of enumerating in runtime can also lead to problems, such as the [duplicate symbols issue](https://github.com/emscripten-core/emscripten/issues/11985), that are caused by differences between representation of shared libraries in Emscripten and on other platforms.

It's possible to adapt the build system to those differences and hardcode the list of dynamic plugins somewhere during the build, but an even easier way to solve all those issues is to avoid dynamic linking to begin with.

Turns out, libtool abstracts away various [dynamic linking methods](https://www.gnu.org/software/libtool/manual/html_node/Module-loaders-for-libltdl.html) on different platforms, and even supports writing custom loaders for others. One of the built-in loaders it supports is called ["Dlpreopening"](https://www.gnu.org/software/libtool/manual/html_node/Dlpreopening.html):

**“Libtool provides special support for dlopening libtool object and libtool library files, so that their symbols can be resolved even on platforms without any dlopen and dlsym functions.  
…  
Libtool emulates -dlopen on static platforms by linking objects into the program at compile time, and creating data structures that represent the program’s symbol table. In order to use this feature, you must declare the objects you want your application to dlopen by using the -dlopen or -dlpreopen flags when you link your program (see [Link mode](https://www.gnu.org/software/libtool/manual/html_node/Link-mode.html#Link-mode)).”**

This mechanism allows emulating dynamic loading at libtool level instead of Emscripten, while linking everything statically into a single library.

The only problem this doesn't solve is enumeration of dynamic libraries. The list of those still needs to be hardcoded somewhere. Luckily, the set of plugins I needed for the app is minimal:

- On the ports side, I only care about the libusb-based camera connection and not about PTP/IP, serial access, or USB drive modes.
- On the camlibs side, there are various vendor-specific plugins which might provide some specialized functions, but for general settings control and capture it's enough to use the [Picture Transfer Protocol](https://en.wikipedia.org/wiki/Picture_Transfer_Protocol), which is represented by the ptp2 camlib and supported by virtually every camera on the market.

Here's what the updated dependency diagram looks like with everything linked statically together:

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/5Fg5aJnydnIVMn44fiBE.svg", alt="A diagram shows 'the app' depending on 'libgphoto2 fork', which depends on 'libtool'. 'libtool' depends on 'ports: libusb1' and 'camlibs: libptp2'. 'ports: libusb1' depends on the 'libusb fork'.", width="800", height="481" %}

So that's what I hardcoded for Emscripten builds:

```c/2-4
LTDL_SET_PRELOADED_SYMBOLS();
lt_dlinit ();
#ifdef __EMSCRIPTEN__
  result = foreach_func("libusb1", list);
#else
  lt_dladdsearchdir (iolibs);
  result = lt_dlforeachfile (iolibs, foreach_func, list);
#endif
lt_dlexit ();
```

and

```c/2-4
LTDL_SET_PRELOADED_SYMBOLS();
lt_dlinit ();
#ifdef __EMSCRIPTEN__
  ret = foreach_func("libptp2", &foreach_data);
#else
  lt_dladdsearchdir (dir);
  ret = lt_dlforeachfile (dir, foreach_func, &foreach_data);
#endif
lt_dlexit ();
```

In the autoconf build system, I now had to add `-dlpreopen` with both of those files as link flags for all executables (examples, tests and my own demo app), like this:

```bash
if HAVE_EMSCRIPTEN
LDADD += -dlpreopen $(top_builddir)/libgphoto2_port/usb1.la \
         -dlpreopen $(top_builddir)/camlibs/ptp2.la
endif
```

Finally, now that all the symbols are linked statically in a single library, libtool needs a way to determine which symbol belongs to which library. To achieve this, it requires developers to rename all exposed symbols like `{function name}` to `{library name}_LTX_{function name}`. The easiest way to do this is by using `#define` to redefine symbol names at the top of the implementation file:

```c
// …
#include "config.h"

/* Define _LTX_ names - required to prevent clashes when using libtool preloading. */
#define gp_port_library_type libusb1_LTX_gp_port_library_type
#define gp_port_library_list libusb1_LTX_gp_port_library_list
#define gp_port_library_operations libusb1_LTX_gp_port_library_operations

#include <gphoto2/gphoto2-port-library.h>
// …
```

This naming scheme also prevents name clashes in case I decide to link camera-specific plugins in the same app in the future.

After all these changes were implemented, I could build the test application and load the plugins successfully.

## Generating the settings UI

gPhoto2 allows camera libraries to define their own settings in a form of widget tree. The hierarchy of [widget types](http://www.gphoto.org/doc/api/gphoto2-widget_8h.html#a8c7e7c5b04d992022d9a821a0d3f9c30) consists of:

- Window - top-level configuration container
  - Sections - named groups of other widgets
    - Button fields
    - Text fields
    - Numeric fields
    - Date fields
    - Toggles
    - Radio buttons

The name, type, children, and all the other relevant properties of each widget can be queried (and, in case of values, also modified) via the [exposed C API](http://www.gphoto.org/doc/api/gphoto2-widget_8h.html). Together, they provide a foundation for automatically generating settings UI in any language that can interact with C.

Settings can be changed either via gPhoto2, or on the camera itself at any point in time. Additionally, some widgets can be readonly, and even the readonly state itself depends on the camera mode and other settings. For example, [shutter speed](https://en.wikipedia.org/wiki/Shutter_speed) is a writable numeric field in [M (manual mode)](https://en.wikipedia.org/wiki/Digital_camera_modes#:~:text=an%20ISO%20sensitivity\).-,M%3A%20Manual%20mode,-both%20shutter%20speed), but becomes an informational readonly field in [P (program mode)](https://en.wikipedia.org/wiki/Digital_camera_modes#:~:text=abbreviated%20%22PASM%22%2C%20are%3A-,P%3A%20Program%20mode,-has%20the%20camera). In P mode, the value of shutter speed will also be dynamic and continuously changing depending on the brightness of the scene the camera is looking at.

All in all, it's important to always show up-to-date information from the connected camera in the UI, while at the same time allowing the user to edit those settings from the same UI. Such bidirectional data flow is more complex to handle.

gPhoto2 does not have a mechanism to retrieve only changed settings, only the entire tree or individual widgets. In order to keep the UI up-to-date without flickering and losing input focus or scroll position, I needed a way to diff the widget trees between the invocations and update only the changed UI properties. Luckily, this is a solved problem on the web, and is the core functionality of frameworks like [React](https://reactjs.org/) or [Preact](https://preactjs.com/). I went with Preact for this project, as it's much more lightweight and does everything I need.

On the C++ side I now needed to retrieve and recursively walk the settings tree via the earlier linked C API, and convert each widget to a JavaScript object:

```cpp
static std::pair<val, val> walk_config(CameraWidget *widget) {
  val result = val::object();

  val name(GPP_CALL(const char *, gp_widget_get_name(widget, _)));
  result.set("name", name);
  result.set("info", /* … */);
  result.set("label", /* … */);
  result.set("readonly", /* … */);

  auto type = GPP_CALL(CameraWidgetType, gp_widget_get_type(widget, _));

  switch (type) {
    case GP_WIDGET_RANGE: {
      result.set("type", "range");
      result.set("value", GPP_CALL(float, gp_widget_get_value(widget, _)));

      float min, max, step;
      gpp_try(gp_widget_get_range(widget, &min, &max, &step));
      result.set("min", min);
      result.set("max", max);
      result.set("step", step);

      break;
    }
    case GP_WIDGET_TEXT: {
      result.set("type", "text");
      result.set("value",
                  GPP_CALL(const char *, gp_widget_get_value(widget, _)));

      break;
    }
    // …
```

On the JavaScript side, I could now call `configToJS`, walk over the returned JavaScript representation of the settings tree, and build the UI via Preact function `h`:

```js
let inputElem;
switch (config.type) {
  case 'range': {
    let { min, max, step } = config;
    inputElem = h(EditableInput, {
      type: 'number',
      min,
      max,
      step,
      …attrs
    });
    break;
  }
  case 'text':
    inputElem = h(EditableInput, attrs);
    break;
  case 'toggle': {
    inputElem = h('input', {
      type: 'checkbox',
      …attrs
    });
    break;
  }
  // …
```

By running this function repeatedly in an infinite event loop, I could get the settings UI to always show the latest information, while also sending commands to the camera whenever one of the fields is edited by the user.

Preact can take care of diffing the results and updating the DOM only for the changed bits of the UI, without disrupting the page focus or edit states. One problem that remains is the bidirectional data flow. Frameworks like React and Preact were designed around unidirectional data flow, because it makes it a lot easier to reason about the data and compare it between reruns, but I'm breaking that expectation by allowing an external source - the camera - to update the settings UI at any time.

I worked around this problem by opting out from UI updates for any input fields that are currently being edited by the user:

```js
/**
 * Wrapper around <input /> that doesn't update it while it's in focus to allow editing.
 */
class EditableInput extends Component {
  ref = createRef();

  shouldComponentUpdate() {
    return this.props.readonly || document.activeElement !== this.ref.current;
  }

  render(props) {
    return h('input', Object.assign(props, {ref: this.ref}));
  }
}
```

This way, there is always only one owner of any given field. Either the user is currently editing it, and won't be disrupted by the updated values from the camera, or the camera is updating the field value while it's out of focus.

## Building a live "video" feed

During the pandemic, a lot of people moved to online meetings. Among other things, this led to [shortages on the webcam market](https://www.bbc.co.uk/news/technology-53506401). To get a better video quality compared to built-in cameras in laptops, and in response to said shortages, many DSLR and mirrorless camera owners started looking for ways to use their photography cameras as webcams. Several camera vendors even [shipped](https://www.pcmag.com/how-to/how-to-use-your-canon-dslr-as-a-webcam) official utilities for this very purpose.

Like the official tools, gPhoto2 [supports](http://www.gphoto.org/doc/remote/#:~:text=Using%20as%20webcam%20/%20video%20conferencing%20camera) streaming video from the camera to a locally stored file or directly to a virtual webcam too. I wanted to use that feature to provide a live view in my demo. However, while it's available in the console utility, I couldn't find it anywhere in the libgphoto2 library APIs.

Looking at the source code of the corresponding function in the console utility, I found that it's not actually getting a video at all, but instead [keeps retrieving the camera's preview](https://github.com/gphoto/gphoto2/blob/e9ad2a460990afec3d09033000642297b16d8950/gphoto2/actions.c#L1068-L1070) as individual JPEG images in an endless loop, and writing them out one by one to form an [M-JPEG](https://en.wikipedia.org/wiki/Motion_JPEG) stream:

```c
while (1) {
  const char *mime;
  r = gp_camera_capture_preview (p->camera, file, p->context);
  // …
```

I was astonished that this approach works efficiently enough to get an impression of smooth realtime video. I was even more skeptical about being able to match the same performance in the web application too, with all the extra abstractions and Asyncify in the way. However, I decided to try anyway.

On the C++ side I exposed a method called `capturePreviewAsBlob()` that invokes the same `gp_camera_capture_preview()` function, and converts the resulting in-memory file to a [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) that can be passed to other web APIs more easily:

```cpp
val capturePreviewAsBlob() {
  return gpp_rethrow([=]() {
    auto &file = get_file();

    gpp_try(gp_camera_capture_preview(camera.get(), &file, context.get()));

    auto params = blob_chunks_and_opts(file);
    return Blob.new_(std::move(params.first), std::move(params.second));
  });
}
```

On the JavaScript side, I have a loop, similar to the one in gPhoto2, that keeps retrieving preview images as `Blob`s, decodes them in the background with [`createImageBitmap`](https://developer.mozilla.org/docs/Web/API/createImageBitmap), and [transfers](https://developer.mozilla.org/docs/Web/API/ImageBitmapRenderingContext/transferFromImageBitmap) them to the canvas on the next animation frame:

```js
while (this.canvasRef.current) {
  try {
    let blob = await this.props.getPreview();

    let img = await createImageBitmap(blob, { /* … */ });
    await new Promise(resolve => requestAnimationFrame(resolve));
    canvasCtx.transferFromImageBitmap(img);
  } catch (err) {
    // …
  }
}
```

Using those modern APIs ensures that all of the decoding work is done in the background, and the canvas gets updated only when both the image and the browser are fully prepared for drawing. This achieved a consistent 30+ FPS on my laptop, which matched the native performance of both gPhoto2 and the official Sony software.

## Synchronizing the USB access

When a USB data transfer is requested while another operation is already in progress, it will commonly result in a "device is busy" error. Since the preview and the settings UI update regularly, and the user might be trying to capture an image or modify settings at the same time, such conflicts between different operations turned out to be very frequent.

To avoid them, I needed to synchronize all the accesses within the application. For that, I've built a promise-based async queue:

```js
let context = await new Module.Context();

let queue = Promise.resolve();

function schedule(op) {
  let res = queue.then(() => op(context));
  queue = res.catch(rethrowIfCritical);
  return res;
}
```

By chaining each operation in a `then()` callback of the existing `queue` promise, and storing the chained result as the new value of `queue`, I can make sure that all operations are executed one by one, in order and without overlaps.

Any operation errors are returned to the caller, while critical (unexpected) errors mark the entire chain as a rejected promise, and ensure that no new operation will be scheduled afterwards.

By keeping the module context in a private (non-exported) variable, I'm minimizing the risks of accessing the `context` by accident somewhere else in the app without going through the `schedule()` call.

To tie things together, now each access to the device context has to be wrapped in a `schedule()` call like this:

```js
let config = await this.connection.schedule((context) => context.configToJS());
```

and

```js
this.connection.schedule((context) => context.captureImageAsFile());
```

After that, all the operations were executing successfully without conflicts.

## Conclusion

Feel free to browse the [codebase on Github](https://github.com/GoogleChromeLabs/web-gphoto2) for more implementation insights. I also want to thank [Marcus Meissner](https://github.com/msmeissn) for maintenance of gPhoto2 and for his reviews of my upstream PRs.

As shows in these posts, WebAssembly, Asyncify and Fugu APIs provide a capable compilation target for even the most complex applications. They allow you to take a library or an application previously built for a single platform, and port it to the web, making it available to a vastly larger number of users across desktop and mobile devices alike.
