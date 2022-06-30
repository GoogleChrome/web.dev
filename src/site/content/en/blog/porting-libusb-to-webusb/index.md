---
title: 'Porting USB applications to the web. Part 1: libusb'
subhead: Learn how code that interacts with external devices can be ported to the web with WebAssembly and Fugu APIs.
description: Learn how code that interacts with external devices can be ported to the web with WebAssembly and Fugu APIs.
date: 2022-01-20
hero: image/9oK23mr86lhFOwKaoYZ4EySNFp02/MR4YGRvl0Z9AWT6vv3sQ.jpg
alt: A picture of DSLR camera connected via a USB cable to a laptop. The laptop is running the Web demo mentioned in the article, which mirrors a live video feed from the camera as well as allows to tweak its settings via form controls.
authors:
  - rreverser
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - webassembly
  - capabilities
  - devices
---

In [a previous post](/asyncify/), I showed how to port apps using filesystem APIs to the web with [File System Access API](/file-system-access/), WebAssembly and [Asyncify](https://emscripten.org/docs/porting/asyncify.html). Now I want to continue the same topic of integrating [Fugu APIs](https://fugu-tracker.web.app/) with WebAssembly and porting apps to the web without losing important features.

I'll show how apps that communicate with USB devices can be ported to the web by porting [libusb](https://libusb.info/)—a popular USB library written in C—to WebAssembly (via [Emscripten](https://emscripten.org/)), Asyncify and [WebUSB](/usb/).

{% Aside %}
Fun fact: On some platforms, implementation of WebUSB also uses libusb under the hood. So what the port achieves is, in fact, one libusb, compiled to WebAssembly, talking to another libusb, shipped as part of the browser, through an intermediate layer. Isn't the web fun?
{% endAside %}

## First things first: a demo

The most important thing to do when porting a library is choosing the right demo—something that would showcase the capabilities of the ported library, allowing you to test it in a variety of ways, and be visually compelling at the same time.

The idea I chose was DSLR remote control. In particular, an open source project [gPhoto2](http://gphoto.org/) has been in this space long enough to reverse-engineer and implement support for a wide variety of digital cameras. It supports several protocols, but the one I was most interested in was USB support, which it performs via libusb.

I'll describe the steps for building this demo in two parts. In this blog post, I'll describe how I ported libusb itself, and what tricks might be necessary to port other popular libraries to Fugu APIs. In the [second post](/porting-gphoto2-to-the-web), I'll go into details on porting and integrating gPhoto2 itself.

In the end, I got a working web application that previews live feed from a DSLR and can control its settings over USB. Feel free to check out the [live](https://web-gphoto2.rreverser.com/) or the pre-recorded demo before reading up on technical details:

<figure>
  {% Video src="video/9oK23mr86lhFOwKaoYZ4EySNFp02/4MUKvJhKOPK2CSTkhnEC.mp4", controls="true" %}
  <figcaption>
    <a href="https://web-gphoto2.rreverser.com/">The demo</a> running on a laptop connected to a Sony camera.
  </figcaption>
</figure>

### Note on camera-specific quirks

You might have noticed that changing settings takes a while in the video. Like with most other issues you might see, this is not caused by the performance of WebAssembly or WebUSB, but by how gPhoto2 interacts with the specific camera chosen for the demo.

Sony a6600 doesn't expose an API to set values like ISO, aperture or shutter speed directly, and instead only provides commands to increase or decrease them by the specified number of steps. To make matters more complicated, it doesn't return a list of the actually supported values, either—the returned list seems hardcoded across many Sony camera models.

When setting one of those values, gPhoto2 has no other choice but to:

1. Make a step (or a few) in the direction of the chosen value.
2. Wait a bit for the camera to update the settings.
3. Read back the value the camera actually landed on.
4. Check that the last step didn't jump over the desired value nor wrapped around the end or the beginning of the list.
5. Repeat.

It can take some time, but if the value is actually supported by the camera, it will get there, and, if not, it will stop on the nearest supported value.

Other cameras will likely have different sets of settings, underlying APIs, and quirks. Keep in mind that gPhoto2 is an open-source project, and either automated or manual testing of all the camera models out there is simply not feasible, so detailed issue reports and PRs are always welcome (but make sure to reproduce the issues with the official gPhoto2 client first).

### Important cross-platform compatibility notes

Unfortunately, on Windows any "well-known" devices, including DSLR cameras, are assigned a system driver, which is not compatible with WebUSB. If you want to try the demo on Windows, you'll have to use a tool like [Zadig](https://zadig.akeo.ie/) to override the driver for the connected DSLR to either WinUSB or libusb. This approach works fine for me and many other users, but you should use it at your own risk.

On Linux, you will likely need to [set custom permissions](/build-for-webusb/#linux) to allow access to your DSLR via WebUSB, although this depends on your distribution.

On macOS and Android, the demo should work out of the box. If you're trying it on an Android phone, make sure to switch to the landscape mode as I didn't put much effort into making it responsive (PRs are welcome!):

<figure>
  {% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/POZGEUlnjJeRKvVDFdiR.jpg", alt="Android phone connected to a Canon camera via a USB-C cable.", width="800", height="533" %}
  <figcaption>
    <a href="https://web-gphoto2.rreverser.com/">The same demo</a> running on an Android phone. Picture by <a href="https://twitter.com/DasSurma">Surma</a>.
  </figcaption>
</figure>

For a more in-depth guide on cross-platform usage of WebUSB, see the ["Platform-specific considerations" section of "Building a device for WebUSB"](/build-for-webusb/#platform-specific-considerations).

## Adding a new backend to libusb

Now onto the technical details. While it's possible to provide a shim API similar to libusb (this has been done by others before) and link other applications against it, this approach is error-prone and makes any further extension or maintenance harder. I wanted to do things right, in a way that could be potentially contributed back upstream and merged into libusb in the future.

Luckily, the [libusb README](https://github.com/libusb/libusb/blob/f2b218b61867f27568ba74fa38e156e5f55ed825/README#L13-L15) says:

**“libusb is abstracted internally in such a way that it can hopefully be ported to other operating systems. Please see the [PORTING](https://github.com/libusb/libusb/blob/master/PORTING) file for more information.”**

libusb is structured in a way where the public API is separate from "backends". Those backends are responsible for listing, opening, closing and actually communicating to the devices via the operating system's low-level APIs. This is how libusb already abstracts away differences between Linux, macOS, Windows, Android, OpenBSD/NetBSD, Haiku and Solaris and works on all these platforms.

What I had to do was add another backend for the Emscripten+WebUSB "operating system". The implementations for those backends live in the [`libusb/os`](https://github.com/libusb/libusb/tree/master/libusb/os) folder:

```bash
~/w/d/libusb $ ls libusb/os
darwin_usb.c           haiku_usb_raw.h  threads_posix.lo
darwin_usb.h           linux_netlink.c  threads_posix.o
events_posix.c         linux_udev.c     threads_windows.c
events_posix.h         linux_usbfs.c    threads_windows.h
events_posix.lo        linux_usbfs.h    windows_common.c
events_posix.o         netbsd_usb.c     windows_common.h
events_windows.c       null_usb.c       windows_usbdk.c
events_windows.h       openbsd_usb.c    windows_usbdk.h
haiku_pollfs.cpp       sunos_usb.c      windows_winusb.c
haiku_usb_backend.cpp  sunos_usb.h      windows_winusb.h
haiku_usb.h            threads_posix.c
haiku_usb_raw.cpp      threads_posix.h
```

Each backend includes the [`libusbi.h`](https://github.com/libusb/libusb/blob/master/libusb/libusbi.h) header with common types and helpers, and needs to expose a `usbi_backend` variable of type [`usbi_os_backend`](https://github.com/libusb/libusb/blob/f2b218b61867f27568ba74fa38e156e5f55ed825/libusb/libusbi.h#L886). For example, this is what the [Windows backend](https://github.com/libusb/libusb/blob/6cae9c6dbd74c0840848f343dd605c5ddcef1ad1/libusb/os/windows_common.c#L866-L904) looks like:

```c
const struct usbi_os_backend usbi_backend = {
  "Windows",
  USBI_CAP_HAS_HID_ACCESS,
  windows_init,
  windows_exit,
  windows_set_option,
  windows_get_device_list,
  NULL,   /* hotplug_poll */
  NULL,   /* wrap_sys_device */
  windows_open,
  windows_close,
  windows_get_active_config_descriptor,
  windows_get_config_descriptor,
  windows_get_config_descriptor_by_value,
  windows_get_configuration,
  windows_set_configuration,
  windows_claim_interface,
  windows_release_interface,
  windows_set_interface_altsetting,
  windows_clear_halt,
  windows_reset_device,
  NULL,   /* alloc_streams */
  NULL,   /* free_streams */
  NULL,   /* dev_mem_alloc */
  NULL,   /* dev_mem_free */
  NULL,   /* kernel_driver_active */
  NULL,   /* detach_kernel_driver */
  NULL,   /* attach_kernel_driver */
  windows_destroy_device,
  windows_submit_transfer,
  windows_cancel_transfer,
  NULL,   /* clear_transfer_priv */
  NULL,   /* handle_events */
  windows_handle_transfer_completion,
  sizeof(struct windows_context_priv),
  sizeof(union windows_device_priv),
  sizeof(struct windows_device_handle_priv),
  sizeof(struct windows_transfer_priv),
};
```

Looking through the properties, we can see that the struct includes the backend name, a set of its capabilities, handlers for various low-level USB operations in form of function pointers, and, finally, sizes to allocate for storing private device-/context-/transfer-level data.

The private data fields are useful at least for storing OS handles to all those things, as without handles we don't know which item any given operation applies to. In the web implementation, the OS handles would be the underlying WebUSB JavaScript objects. The natural way to represent and store them in Emscripten is via the [`emscripten::val`](https://emscripten.org/docs/api_reference/val.h.html#_CPPv4N10emscripten10emscripten3valE) class, which is provided as part of [Embind](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html) (Emscripten's bindings system).

Most of the backends in the folder are implemented in C, but a few are implemented in C++. Embind only works with C++, so the choice was made for me and I've added `libusb/libusb/os/emscripten_webusb.cpp` with the required structure and with `sizeof(val)` for the private data fields:

```cpp
#include <emscripten.h>
#include <emscripten/val.h>

#include "libusbi.h"

using namespace emscripten;

// …function implementations

const usbi_os_backend usbi_backend = {
  .name = "Emscripten + WebUSB backend",
  .caps = LIBUSB_CAP_HAS_CAPABILITY,
  // …handlers—function pointers to implementations above
  .device_priv_size = sizeof(val),
  .transfer_priv_size = sizeof(val),
};
```

### Storing WebUSB objects as device handles

libusb provides ready-to-use pointers to the allocated area for private data. To work with those pointers as `val` instances, I've added small helpers that construct them in-place, retrieve them as references, and move values out:

```cpp
// We store an Embind handle to WebUSB USBDevice in "priv" metadata of
// libusb device, this helper returns a pointer to it.
struct ValPtr {
 public:
  void init_to(val &&value) { new (ptr) val(std::move(value)); }

  val &get() { return *ptr; }
  val take() { return std::move(get()); }

 protected:
  ValPtr(val *ptr) : ptr(ptr) {}

 private:
  val *ptr;
};

struct WebUsbDevicePtr : ValPtr {
 public:
  WebUsbDevicePtr(libusb_device *dev)
      : ValPtr(static_cast<val *>(usbi_get_device_priv(dev))) {}
};

val &get_web_usb_device(libusb_device *dev) {
  return WebUsbDevicePtr(dev).get();
}

struct WebUsbTransferPtr : ValPtr {
 public:
  WebUsbTransferPtr(usbi_transfer *itransfer)
      : ValPtr(static_cast<val *>(usbi_get_transfer_priv(itransfer))) {}
};
```

### Async web APIs in synchronous C contexts

Now needed a way to handle async WebUSB APIs where libusb expects synchronous operations. For this, I could use Asyncify, or, more specifically, its Embind integration via [`val::await()`](https://emscripten.org/docs/api_reference/val.h.html#_CPPv4NK10emscripten10emscripten3val5awaitEv).

I also wanted to correctly handle WebUSB errors and convert them into libusb error codes, but Embind currently doesn't have any way to handle JavaScript exceptions or `Promise` rejections from the C++ side. This problem can be worked around by catching a rejection on the JavaScript side and converting the result into an `{ error, value }` object that can be now safely parsed from the C++ side. I did this with a combination of the [`EM_JS`](https://emscripten.org/docs/api_reference/emscripten.h.html#c.EM_JS) macro and [`Emval.to{Handle, Value}`](https://emscripten.org/docs/api_reference/val.h.html#_CPPv4NK10emscripten10emscripten3val9as_handleEv) APIs:

```cpp
EM_JS(EM_VAL, em_promise_catch_impl, (EM_VAL handle), {
  let promise = Emval.toValue(handle);
  promise = promise.then(
    value => ({error : 0, value}),
    error => {
      const ERROR_CODES = {
        // LIBUSB_ERROR_IO
        NetworkError : -1,
        // LIBUSB_ERROR_INVALID_PARAM
        DataError : -2,
        TypeMismatchError : -2,
        IndexSizeError : -2,
        // LIBUSB_ERROR_ACCESS
        SecurityError : -3,
        …
      };
      console.error(error);
      let errorCode = -99; // LIBUSB_ERROR_OTHER
      if (error instanceof DOMException)
      {
        errorCode = ERROR_CODES[error.name] ?? errorCode;
      }
      else if (error instanceof RangeError || error instanceof TypeError)
      {
        errorCode = -2; // LIBUSB_ERROR_INVALID_PARAM
      }
      return {error: errorCode, value: undefined};
    }
  );
  return Emval.toHandle(promise);
});

val em_promise_catch(val &&promise) {
  EM_VAL handle = promise.as_handle();
  handle = em_promise_catch_impl(handle);
  return val::take_ownership(handle);
}

// C++ struct representation for {value, error} object from above
// (performs conversion in the constructor).
struct promise_result {
  libusb_error error;
  val value;

  promise_result(val &&result)
      : error(static_cast<libusb_error>(result["error"].as<int>())),
        value(result["value"]) {}

  // C++ counterpart of the promise helper above that takes a promise, catches
  // its error, converts to a libusb status and returns the whole thing as
  // `promise_result` struct for easier handling.
  static promise_result await(val &&promise) {
    promise = em_promise_catch(std::move(promise));
    return {promise.await()};
  }
};
```

Now I could use `promise_result::await()` on any `Promise` returned from WebUSB operations and inspect its `error` and `value` fields separately.

For example, retrieving a `val` representing a [`USBDevice`](https://developer.mozilla.org/docs/Web/API/USBDevice) from `libusb_device_handle`, calling its [`open()`](https://developer.mozilla.org/docs/Web/API/USBDevice/open) method, awaiting its result, and returning an error code as a libusb status code looks like this:

```cpp
int em_open(libusb_device_handle *handle) {
  auto web_usb_device = get_web_usb_device(handle->dev);
  return promise_result::await(web_usb_device.call<val>("open")).error;
}
```

### Device enumeration

Of course, before I can open any device, libusb needs to retrieve a list of available devices. The backend must implement this operation via a `get_device_list` handler.

The difficulty is that, unlike on other platforms, there is no way to enumerate all the connected USB devices on the web for security reasons. Instead, the flow is split into two parts. First, the web application requests devices with specific properties via [`navigator.usb.requestDevice()`](https://developer.mozilla.org/docs/Web/API/USB/requestDevice) and the user manually chooses which device they want to expose or rejects the permission prompt. Afterwards, the application lists the already approved and connected devices via [`navigator.usb.getDevices()`](https://developer.mozilla.org/docs/Web/API/USB/getDevices).

At first I tried to use `requestDevice()` directly in the implementation of the `get_device_list` handler. However, showing a permission prompt with a list of connected devices is considered a sensitive operation, and it must be triggered by user interaction (like a button click on a page), otherwise it always returns a rejected promise. libusb applications might often want to list the connected devices upon application start-up, so using `requestDevice()` was not an option.

Instead, I had to leave invocation of `navigator.usb.requestDevice()` to the end developer, and only expose the already approved devices from `navigator.usb.getDevices()`:

```cpp
// Store the global `navigator.usb` once upon initialisation.
thread_local const val web_usb = val::global("navigator")["usb"];

int em_get_device_list(libusb_context *ctx, discovered_devs **devs) {
  // C++ equivalent of `await navigator.usb.getDevices()`.
  // Note: at this point we must already have some devices exposed -
  // caller must have called `await navigator.usb.requestDevice(...)`
  // in response to user interaction before going to LibUSB.
  // Otherwise this list will be empty.
  auto result = promise_result::await(web_usb.call<val>("getDevices"));
  if (result.error) {
    return result.error;
  }
  auto &web_usb_devices = result.value;
  // Iterate over the exposed devices.
  uint8_t devices_num = web_usb_devices["length"].as<uint8_t>();
  for (uint8_t i = 0; i < devices_num; i++) {
    auto web_usb_device = web_usb_devices[i];
    // …
    *devs = discovered_devs_append(*devs, dev);
  }
  return LIBUSB_SUCCESS;
}
```

Most of the backend code uses `val` and `promise_result` in a similar way as already shown above. There are few more interesting hacks in the data transfer handling code, but those implementation details are less important for the purposes of this article. Make sure to check the code and comments on Github if you're interested.

## Porting event loops to the web

One more piece of the libusb port that I want to discuss is event handling. As described in the previous article, most APIs in system languages like C are synchronous, and event handling is no exception. It's usually implemented via an infinite loop that "polls" (tries to read data or blocks execution until some data is available) from a set of external I/O sources, and, when at least one of those responds, passes that as an event to the corresponding handler. Once the handler is finished, the control returns to the loop, and it pauses for another poll.

There are a couple of problems with this approach on the web.

First, WebUSB doesn't and cannot expose raw handles of the underlying devices, so polling those directly is not an option. Second, libusb uses [`eventfd`](https://man7.org/linux/man-pages/man2/eventfd.2.html) and [`pipe`](https://man7.org/linux/man-pages/man2/pipe.2.html) APIs for other events as well as for handling transfers on operating systems without raw device handles, but `eventfd` is not currently supported in Emscripten, and `pipe`, while supported, [currently doesn't conform to the spec](https://github.com/emscripten-core/emscripten/issues/13214) and can't wait for events.

Finally, the biggest problem is that the web has its own event loop. This global event loop is used for any external I/O operations (including `fetch()`, timers, or, in this case, WebUSB), and it invokes event or `Promise` handlers whenever corresponding operations finish. Executing another, nested, infinite event loop will block the browser's event loop from ever progressing, which means that not only will the UI become unresponsive, but also that the code will never get notifications for the very same I/O events it's waiting for. This usually results in a deadlock, and that's what happened when I tried to use libusb in a demo, too. The page froze.

Like with other blocking I/O, to port such event loops to the web, developers need to find a way to run those loops without blocking the main thread. One way is to refactor the application to handle I/O events in a separate thread and pass the results back to the main one. The other is to use Asyncify to pause the loop and wait for events in a non-blocking fashion.

I didn't want to do significant changes to either libusb or gPhoto2, and I've already used Asyncify for `Promise` integration, so that's the path I've chosen. To simulate a blocking variant of `poll()`, for the initial proof of concept I've used a loop as shown below:

```cpp
#ifdef __EMSCRIPTEN__
  // TODO: optimize this. Right now it will keep unwinding-rewinding the stack
  // on each short sleep until an event comes or the timeout expires.
  // We should probably create an actual separate thread that does signaling
  // or come up with a custom event mechanism to report events from
  // `usbi_signal_event` and process them here.
  double until_time = emscripten_get_now() + timeout_ms;
  do {
    // Emscripten `poll` ignores timeout param, but pass 0 explicitly just
    // in case.
    num_ready = poll(fds, nfds, 0);
    if (num_ready != 0) break;
    // Yield to the browser event loop to handle events.
    emscripten_sleep(0);
  } while (emscripten_get_now() < until_time);
#else
  num_ready = poll(fds, nfds, timeout_ms);
#endif
```

What it does is:

1. Calls `poll()` to check if any events were reported by the backend yet. If there are some, the loop stops. Otherwise Emscripten's implementation of `poll()` will immediately return with `0`.
2. Calls `emscripten_sleep(0)`. This function uses Asyncify and `setTimeout()` under the hood and is used here to yield control back to the main browser event loop. This allows the browser to handle any user interactions and I/O events, including WebUSB.
3. Check if the specified timeout has expired yet, and, if not, continue the loop.

As the comment mentions, this approach was not optimal, because it kept saving-restoring the entire call stack with Asyncify even when there were no USB events to handle yet (which is most of the time), and because `setTimeout()` itself has a minimal duration of 4ms in modern browsers. Still, it worked well enough to produce 13-14 FPS livestream from DSLR in the proof-of-concept.

Later, I decided to improve it by leveraging the browser event system. There are several ways in which this implementation could be improved further, but for now I've chosen to emit custom events directly on the global object, without associating them with a particular libusb data structure. I've done so via the following wait and notify mechanism based on the [`EM_ASYNC_JS` macro](/emscripten-embedding-js-snippets/#em_async_js-macro):

```js
EM_JS(void, em_libusb_notify, (void), {
  dispatchEvent(new Event("em-libusb"));
});

EM_ASYNC_JS(int, em_libusb_wait, (int timeout), {
  let onEvent, timeoutId;

  try {
    return await new Promise(resolve => {
      onEvent = () => resolve(0);
      addEventListener('em-libusb', onEvent);

      timeoutId = setTimeout(resolve, timeout, -1);
    });
  } finally {
    removeEventListener('em-libusb', onEvent);
    clearTimeout(timeoutId);
  }
});
```

The `em_libusb_notify()` function is used whenever libusb tries to report an event, such as data transfer completion:

```cpp/8-10
void usbi_signal_event(usbi_event_t *event)
{
  uint64_t dummy = 1;
  ssize_t r;

  r = write(EVENT_WRITE_FD(event), &dummy, sizeof(dummy));
  if (r != sizeof(dummy))
    usbi_warn(NULL, "event write failed");
#ifdef __EMSCRIPTEN__
  em_libusb_notify();
#endif
}
```

Meanwhile, the `em_libusb_wait()` part is used to "wake up" from Asyncify sleep when either an `em-libusb` event is received, or the timeout has expired:

```cpp/8
double until_time = emscripten_get_now() + timeout_ms;
for (;;) {
  // Emscripten `poll` ignores timeout param, but pass 0 explicitly just
  // in case.
  num_ready = poll(fds, nfds, 0);
  if (num_ready != 0) break;
  int timeout = until_time - emscripten_get_now();
  if (timeout <= 0) break;
  int result = em_libusb_wait(timeout);
  if (result != 0) break;
}
```

Due to significant reduction in sleeps and wake-ups, this mechanism fixed the efficiency problems of the earlier `emscripten_sleep()`-based implementation, and increased the DSLR demo throughput from 13-14 FPS to consistent 30+ FPS, which is enough for a smooth live feed.

## Build system and the first test

After the backend was done, I had to add it to `Makefile.am` and `configure.ac`. The only interesting bit here is Emscripten-specific flags modification:

```bash
emscripten)
  AC_SUBST(EXEEXT, [.html])
  # Note: LT_LDFLAGS is not enough here because we need link flags for executable.
  AM_LDFLAGS="${AM_LDFLAGS} --bind -s ASYNCIFY -s ASSERTIONS -s ALLOW_MEMORY_GROWTH -s INVOKE_RUN=0 -s EXPORTED_RUNTIME_METHODS=['callMain']"
  ;;
```

First, executables on Unix platforms normally don't have file extensions. Emscripten, however, produces different output depending on which extension you request. I'm using `AC_SUBST(EXEEXT, …)` to change the executable extension to `.html` so that any executable within a package—tests and examples—becomes an HTML with Emscripten's default shell that takes care of loading and instantiating JavaScript and WebAssembly.

Second, because I'm using Embind and Asyncify, I need to enable those features (`--bind -s ASYNCIFY`) as well as allow dynamic memory growth (`-s ALLOW_MEMORY_GROWTH`) via linker parameters. Unfortunately, there is no way for a library to report those flags to the linker, so every application that uses this libusb port will have to add the same linker flags into their build configuration as well.

Finally, as mentioned earlier, WebUSB requires device enumeration to be done via a user gesture. libusb examples and tests assume that they can enumerate devices at start-up, and fail with an error without changes. Instead, I had to disable automatic execution (`-s INVOKE_RUN=0`) and expose the manual `callMain()` method (`-s EXPORTED_RUNTIME_METHODS=...`).

Once all of this was done, I could serve the generated files with a static web server, initialize WebUSB, and run those HTML executables manually with the help of DevTools.

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/i6dUiRRDtb0ucKX9gHOH.png", alt="Screenshot showing a Chrome window with DevTools open on a locally served `testlibusb` page. DevTools console is evaluating `navigator.usb.requestDevice({ filters: [] })`, which triggered a permission prompt and it's currently asking the user to choose a USB device that should be shared with the page. ILCE-6600 (a Sony camera) is currently selected.", width="800", height="626" %}

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/0FhFjozbwA1sqk1Dhx7f.png", alt="Screenshot of the next step, with DevTools still open. After the device was selected, Console has evaluated a new expression `Module.callMain(['-v'])`, which executed the `testlibusb` app in verbose mode. The output shows various detailed information about the previously connected USB camera: manufacturer Sony, product ILCE-6600, serial number, configuration etc.", width="800", height="824" %}

It doesn't look like much, but, when porting libraries to a new platform, getting to the stage where it produces a valid output for the first time is pretty exciting!

## Using the port

As mentioned [above](#build-system-and-the-first-test), the port depends on a few Emscripten features that currently need to be enabled at the linking stage of the application. If you want to use this libusb port in your own application, here's what you'll need to do:

1. Download the latest [libusb](https://github.com/libusb/libusb) either as an archive as part of your build or add it as a git submodule in your project.
2. Run `autoreconf -fiv` in the `libusb` folder.
3. Run `emconfigure ./configure –host=wasm32 –prefix=/some/installation/path` to initialize the project for cross-compilation and to set a path where you want to put the built artifacts.
4. Run `emmake make install`.
5. Point your application or higher-level library to search for the libusb under the earlier chosen path.
6. Add the following flags to your application's link arguments: `--bind -s ASYNCIFY -s ALLOW_MEMORY_GROWTH`.

The library currently has a few limitations:

* No transfer cancellation support. This is a limitation of WebUSB, which, in turn, stems from lack of cross-platform transfer cancellation in libusb itself.
* No isochronous transfer support. It shouldn't be hard to add it by following the implementation of existing transfer modes as examples, but it's also a somewhat rare mode and I didn't have any devices to test it on, so for now I left it as unsupported. If you do have such devices, and want to contribute to the library, PRs are welcome!
* The [earlier mentioned cross-platform limitations](#important-cross-platform-compatibility-notes). Those limitations are imposed by operating systems, so not much we can do here, except ask users to override the driver or permissions. However, if you're porting HID or serial devices, you can follow the libusb example and port some other library to another Fugu API. For example, you could port a C library [hidapi](https://github.com/libusb/hidapi) to [WebHID](/hid/) and side-step those issues, associated with low-level USB access, altogether.

## Conclusion

In this post I've shown how, with the help of Emscripten, Asyncify and Fugu APIs even low-level libraries like libusb can be ported to the web with a few integration tricks.

Porting such essential and widely used low-level libraries is particularly rewarding, because, in turn, it allows bringing higher-level libraries or even whole applications to the web, too. This opens experiences that were previously limited to users of one or two platforms, to all kinds of devices and operating systems, making those experiences available just a link click away.

In the [next post](/porting-gphoto2-to-the-web) I'll walk through the steps involved in building the web gPhoto2 demo which not only retrieves device information, but extensively uses the transfer feature of libusb too. Meanwhile, I hope you found the libusb example inspiring and will try out the demo, play with the library itself, or perhaps even go ahead and port another widely used library to one of the Fugu APIs too.
