---
title: 解锁剪贴板访问
subhead: 更安全、畅通无阻的文本和图像剪贴板访问
authors:
  - developit
  - thomassteiner
description: 异步剪贴板 API 简化并带来权限友好的复制和粘贴。
date: 2020-07-31
updated: 2021-07-29
tags:
  - blog
  - capabilities
hero: image/admin/aA9eqo0ZZNHFcFJGUGQs.jpg
alt: 含购物清单的剪贴板
feedback:
  - api
---

过去几年中，浏览器使用 [`document.execCommand()`](https://developers.google.com/web/updates/2015/04/cut-and-copy-commands) 进行剪贴板交互。虽然得到了广泛的支持，但这种剪切和粘贴的方法有一定的代价：剪贴板访问是同步的，只能读写 DOM。

这对于少量文本来说没什么问题，但在很多情况下，阻止剪贴板传输页面是一种糟糕的体验。在安全粘贴内容之前，可能需要进行耗时的清理或图像解码。浏览器可能需要从粘贴的文档加载或内联链接资源。这会在等待磁盘或网络时阻塞页面。想象一下这种混乱的权限：要求浏览器在请求剪贴板访问时阻止页面；同时，围绕剪贴板交互的 `document.execCommand()` 权限又采用松散定义，在不同的浏览器之间不同。

[异步剪贴板 API](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api) 解决了这些问题，提供了定义明确的权限模型，不会阻止页面。Safari 最近宣布[在 13.1 版中支持该功能](https://webkit.org/blog/10855/)。有了这个，主要浏览器就有了基本的支持。在撰写本文时，Firefox 仅支持文本；在某些浏览器中，图像支持仅限于 PNG。如果您对使用 API 感兴趣，请在继续之前[查阅浏览器支持表](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility)。

{% Aside %} 异步剪贴板 API 仅限于处理文本和图像。Chrome 84 引入了一项实验性功能，允许剪贴板处理任意数据类型。 {% endAside %}

## 复制：将数据写入剪贴板

### writeText()

要将文本复制到剪贴板，请调用 `writeText()` 。由于此 API 是异步的，因此 `writeText()` 函数会返回一个 Promise，该 Promise 会根据传递的文本是否复制成功来解决或拒绝：

```js
async function copyPageUrl() {
  try {
    await navigator.clipboard.writeText(location.href);
    console.log('Page URL copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
```

### write()

实际上，`writeText()` 只是通用 `write()` 方法的一种便捷方法。后者也允许您将图像复制到剪贴板，与 `writeText()` 一样，它为异步并会返回一个 Promise。

要将图像写入剪贴板，您需要将图像作为 [`blob`](https://developer.mozilla.org/docs/Web/API/blob) 。一种方法是使用 `fetch()` 从服务器请求图像，然后在响应时调用 [`blob()`](https://developer.mozilla.org/docs/Web/API/Body/blob)。

由于各种原因，从服务器请求图像可能是不可取的或不可能的。幸运的是，您还可以将图像绘制到画布上并调用画布的 [`toBlob()`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob) 方法。

接下来，将 `ClipboardItem` 对象数组作为参数传递给 `write()` 方法。目前一次只能传递一张图片，但我们希望在未来增加对多张图片的支持。`ClipboardItem` 以图像的 MIME 类型的对象为键，以 blob 为值。对于从 `fetch()`或`canvas.toBlob()` 获取的 Blob 对象， `blob.type` 属性会自动包含图像的正确 MIME 类型。

```js
try {
  const imgURL = '/images/generic/file.png';
  const data = await fetch(imgURL);
  const blob = await data.blob();
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ]);
  console.log('Image copied.');
} catch (err) {
  console.error(err.name, err.message);
}
```

{% Aside 'warning' %} Safari (WebKit) 处理用户激活的方式与 Chromium (Blink) 不同（请参阅[WebKit 错误 #222262](https://bugs.webkit.org/show_bug.cgi?id=222262) ）。对于 Safari，在您将其结果分配给 `ClipboardItem` 的 Promise 中运行所有异步操作：

```js
new ClipboardItem({
  'foo/bar': new Promise(async (resolve) => {
      // Prepare `blobValue` of type `foo/bar`
      resolve(new Blob([blobValue], { type: 'foo/bar' }));
    }),
  })
```

{% endAside %}

### 复制事件

在用户启动剪贴板复制的情况下，非文本数据作为 Blob 提供给您。 [`copy` 事件](https://developer.mozilla.org/docs/Web/API/Document/copy_event)包含 `clipboardData` 属性，其中的项目已经采用正确的格式，从而无需手动创建 Blob。调用 `preventDefault()` 以阻止默认行为以支持您自己的逻辑，然后将内容复制到剪贴板。本示例中未提到如何在剪贴板 API 不受支持时回退到较早的 API。我将在本文后面的[功能检测](#feature-detection)下进行介绍。

```js
document.addEventListener('copy', async (e) => {
    e.preventDefault();
    try {
      let clipboardItems = [];
      for (const item of e.clipboardData.items) {
        if (!item.type.startsWith('image/')) {
          continue;
        }
        clipboardItems.push(
          new ClipboardItem({
            [item.type]: item,
          })
        );
        await navigator.clipboard.write(clipboardItems);
        console.log('Image copied.');
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  });
```

## 粘贴：从剪贴板读取数据

### readText()

要从剪贴板读取文本，调用 `navigator.clipboard.readText()` 并等待返回的 Promise 以进行解析：

```js
async function getClipboardContents() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Pasted content: ', text);
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
  }
}
```

### read()

`navigator.clipboard.read()` 方法也为异步，会返回一个 Promise。要从剪贴板读取图像，请获取 [`ClipboardItem`](https://developer.mozilla.org/docs/Web/API/ClipboardItem) 对象的列表，然后循环访问它们。

每个 `ClipboardItem` 能够以不同的类型保存其内容，因此您需要循环访问类型列表，再次使用 `for...of` 循环。对于每种类型，以当前类型为参数调用 `getType()` 方法以获取相应的 Blob。和以前一样，此代码与图像无关，并且将适用于未来的其他文件类型。

```js
async function getClipboardContents() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        console.log(URL.createObjectURL(blob));
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

### 处理粘贴的文件

用户能够使用剪贴板键盘快捷键（例如 <kbd>ctrl</kbd> + <kbd>c</kbd> 和 <kbd>ctrl</kbd> + <kbd>v</kbd> ）很有用。Chromium 在剪贴板上公开*只读*文件，如下所述。当用户点击操作系统的默认粘贴快捷方式或当用户依次点击浏览器菜单栏中的**编辑**、**粘贴**时，会触发此事件。不需要进一步的管道代码。

```js
document.addEventListener("paste", async e => {
  e.preventDefault();
  if (!e.clipboardData.files.length) {
    return;
  }
  const file = e.clipboardData.files[0];
  // Read the file's contents, assuming it's a text file.
  // There is no way to write back to it.
  console.log(await file.text());
});
```

### 粘贴事件

如前所述，已在实施一些计划来引入事件与剪贴板 API 一起使用，但现在您可以使用现有的 `paste` 事件。它与用于读取剪贴板文本的新异步方法配合得很好。与 `copy` 事件一样，不要忘记调用 `preventDefault()` 。

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  const text = await navigator.clipboard.readText();
  console.log('Pasted text: ', text);
});
```

与 `copy` 事件一样，将在下文中的[功能检测](#feature-detection)中介绍剪贴板 API 不受支持时回退到早期 API 方面的内容。

## 处理多种文件类型

大多数实现将多种数据格式放在剪贴板上以进行单个剪切或复制操作。这有两个原因：作为应用程序开发人员，您无法知道用户想要复制文本或图像的应用程序的功能，并且许多应用程序支持将结构化数据粘贴为纯文本。这将通过**编辑**菜单项呈现给用户，该菜单项的名称为**粘贴并匹配样式**或**不带格式粘贴** 。

以下示例显示了如何执行此操作。此示例使用 `fetch()` 获取图像数据，但图像数据也可能来自 [`<canvas>`](https://developer.mozilla.org/docs/Web/HTML/Element/canvas) 或[文件系统访问 API](/file-system-access/) 。

```js
async function copy() {
  const image = await fetch('kitten.png');
  const text = new Blob(['Cute sleeping kitten'], {type: 'text/plain'});
  const item = new ClipboardItem({
    'text/plain': text,
    'image/png': image
  });
  await navigator.clipboard.write([item]);
}
```

## 安全和权限

剪贴板访问一直是浏览器的安全问题。如果没有适当的权限，页面可能会悄悄地将各种恶意内容复制到用户的剪贴板，粘贴时会产生灾难性的结果。想象一个网页，它默默地将 `rm -rf /` 或[解压炸弹图像](http://www.aerasec.de/security/advisories/decompression-bomb-vulnerability.html)复制到您的剪贴板。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dt4QpuEuik9ja970Zos1.png", alt="浏览器提示询问用户剪贴板权限。", width="800", height="338" %}<figcaption>剪贴板 API 的权限提示。</figcaption></figure>

让网页不受限制地读取剪贴板的权限就更麻烦了。用户通常会将密码和个人详细信息等敏感信息复制到剪贴板，然后任何页面都可以在用户不知情的情况下读取这些信息。

与许多新 API 一样，剪贴板 API 仅支持通过 HTTPS 提供的页面。为帮助防止滥用，仅当页面是活动选项卡时才允许访问剪贴板。活动选项卡中的页面无需请求许可即可写入剪贴板，但从剪贴板读取始终需要许可。

复制和粘贴权限已添加到 [Permissions API](https://developers.google.com/web/updates/2015/04/permissions-api-for-the-web) 中。当页面处于活动标签页时，会自动授予 `clipboard-write` 权限。必须请求 `clipboard-read` 权限，这在您尝试从剪贴板读取数据时需要执行。下面的代码显示了后者：

```js
const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
const permissionStatus = await navigator.permissions.query(queryOpts);
// Will be 'granted', 'denied' or 'prompt':
console.log(permissionStatus.state);

// Listen for changes to the permission state
permissionStatus.onchange = () => {
  console.log(permissionStatus.state);
};
```

您可以使用 `allowWithoutGesture` 选项控制是否需要用手势来调用剪切或粘贴。此值的默认值因浏览器而异，因此您应始终包含它。

剪贴板 API 的异步特性真正派上用场的地方在于：如果尚未授予权限，尝试读取或写入剪贴板数据的操作会自动提示用户授予权限。由于 API 是基于承诺的，这是完全透明的，用户拒绝剪贴板权限会导致承诺拒绝，因此页面可以做出适当的响应。

因为 Chrome 仅在页面是活动选项卡时才允许剪贴板访问，您会发现这里的某些示例如果直接粘贴到 DevTools 中将无法运行，因为 DevTools 本身就是活动选项卡。有一个技巧：使用 `setTimeout()` 延迟剪贴板访问，然后在调用函数之前快速点击页面内部以将其聚焦：

```js
setTimeout(async () => {
  const text = await navigator.clipboard.readText();
  console.log(text);
}, 2000);
```

## 权限策略集成

要在 iframe 中使用 API，您需要使用[权限策略](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/)启用它，权限策略定义了一种机制，允许有选择地启用和禁用各种浏览器功能和 API。具体来说，您需要根据应用程序的需要传递 `clipboard-read` 或 `clipboard-write` 之一或两者。

```html/2
<iframe
    src="index.html"
    allow="clipboard-read; clipboard-write"
>
</iframe>
```

## 功能检测

要在支持所有浏览器的同时使用异步剪贴板 API，请测试 `navigator.clipboard` 并回退到较早的方法。例如，您可以通过以下方式实现粘贴以包含其他浏览器。

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  let text;
  if (navigator.clipboard) {
    text = await navigator.clipboard.readText();
  }
  else {
    text = e.clipboardData.getData('text/plain');
  }
  console.log('Got pasted text: ', text);
});
```

这还不是全部。在异步剪贴板 API 出现之前，跨 Web 浏览器混合了不同的复制和粘贴实现。在大多数浏览器中，可以使用 `document.execCommand('copy')` 和 `document.execCommand('paste')` 触发浏览器自己的复制和粘贴。如果要复制的文本是 DOM 中不存在的字符串，则必须将其注入 DOM 并选择：

```js
button.addEventListener('click', (e) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  const result = document.execCommand('copy');
  if (result === 'unsuccessful') {
    console.error('Failed to copy text.');
  }
});
```

在 Internet Explorer 中，您还可以通过 `window.clipboardData` 访问剪贴板。如果在用户手势（例如点击事件）中访问（负责任地请求权限的一部分），则不会显示权限提示。

## 演示

您可以在下面的演示中或[直接在 Glitch 上](https://async-clipboard-api.glitch.me/)尝试使用异步剪贴板 API。

第一个示例演示了将文本移入和移出剪贴板的操作。

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-text.glitch.me/" title="async-clipboard-text on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

在此演示中尝试通过图像的 API。回想一下，以往仅支持 PNG，并且仅在[少数浏览器](https://developer.mozilla.org/docs/Web/API/Clipboard_API#browser_compatibility)中受支持。

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-api.glitch.me/" title="async-clipboard-api on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 下一步

Chrome 正在积极致力于使用简化的事件和[拖放 API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API) 来扩展异步剪贴板 API。由于潜在风险，Chrome 谨慎行事。要了解 Chrome 的最新进展，请观看本文和我们的[博客](/blog/)以获取更新。

目前，[许多浏览器](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility)都支持剪贴板 API。

快乐复制和粘贴！

## 相关链接

- [MDN](https://developer.mozilla.org/docs/Web/API/Clipboard_API)

## 致谢

异步剪贴板 API 由 [Darwin Huang](https://www.linkedin.com/in/darwinhuang/) 和 [Gary Kačmarčík](https://www.linkedin.com/in/garykac/) 实现，Darwin 还提供了演示。在此表示衷心的感谢。[Kyarik](https://github.com/kyarik) 和 Gary Kačmarčík 对本文部分内容进行了审阅，在此一并表示感谢。

首图作者：[Unsplash](https://unsplash.com/photos/7iSEHWsxPLw) 上的 [Markus Winkler](https://unsplash.com/@markuswinkler)。
