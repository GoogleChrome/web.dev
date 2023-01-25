---
title: Чтение файлов средствами JavaScript
subhead: Как выбирать файлы, читать метаданные и содержимое файлов, а также отслеживать прогресс чтения.
description: |2

  Как выбирать файлы, читать метаданные и содержимое файлов, а также отслеживать прогресс чтения.
date: 2010-06-18
updated: 2021-03-29
authors:
  - kaycebasques
  - petelepage
  - thomassteiner
tags:
  - blog
  - storage
---

Возможность выбирать файлы на локальном устройстве пользователя и взаимодействовать с ними — это одна из наиболее часто используемых функций Интернета. С помощью этой функции пользователи могут выбирать файлы и загружать их на сервер, например, загружать фотографии или подавать налоговую отчетность и т. д. Кроме того, функция также позволяет сайтам читать файлы и управлять ими без необходимости передачи данных по сети.

## Современный API доступа к файловой системе

API доступа к файловой системе обеспечивает простой способ чтения и записи файлов и каталогов в локальной системе пользователя. В настоящее время он доступен в большинстве браузеров на основе Chromium, таких как Chrome или Edge. Чтобы узнать больше об этом, прочитайте статью [«API доступа к файловой системе»](/file-system-access/).

Поскольку API доступа к файловой системе еще не совместим со всеми браузерами, обратите внимание на вспомогательную библиотеку [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access), которая использует новый API везде, где это возможно, но возвращается к устаревшим подходам, если API недоступен.

## Классический способ работы с файлами

В этом руководстве показано, как:

- выбрать файлы
    - [с использованием элементов ввода HTML](#select-input);
    - [с использованием области перетаскивания](#select-dnd);
- [прочитать метаданные файла](#read-metadata);
- [прочитать содержимое файла](#read-content).

## Выбор файлов {: #select}

### Элемент ввода HTML {: #select-input}

Самый простой способ разрешить пользователям выбирать файлы — это использовать элемент [`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file), который поддерживается во всех основных браузерах. После щелчка он позволяет пользователю выбрать один файл или несколько файлов, если включен атрибут [`multiple`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes), используя встроенный в операционную систему пользовательский интерфейс выбора файлов. Когда пользователь завершает выбор файла или файлов, срабатывает событие элемента `change`. Вы можете получить доступ к списку файлов из `event.target.files`, который представляет собой объект [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList). Каждый элемент в `FileList` является объектом [`File`](https://developer.mozilla.org/docs/Web/API/File).

```html
<!-- The `multiple` attribute lets users select multiple files. -->
<input type="file" id="file-selector" multiple>
<script>
  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
  });
</script>
```

{% Aside %} Проверьте, является ли метод [`window.showOpenFilePicker()`](/file-system-access/#ask-the-user-to-pick-a-file-to-read) жизнеспособной альтернативой для вашего варианта использования, поскольку он также дает дескриптор файла, чтобы вы могли записывать обратно в файл, помимо чтения. Для этого метода можно применять [полизаполение](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files). {% endAside %}

В этом примере пользователь может с помощью встроенного в операционную систему пользовательского интерфейса выбора файлов выбрать несколько файлов, которые затем записываются в консоль.

{% Glitch {id: 'input-type-file', height: 480}%}

#### Ограничьте типы файлов, которые пользователь может выбрать {: #accept}

В некоторых случаях вы можете захотеть ограничить типы файлов, которые могут выбирать пользователи. Например, приложение для редактирования изображений должно принимать только изображения, а не текстовые файлы. Для этого вы можете добавить [`accept`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes) к элементу ввода, чтобы указать, какие файлы принимаются.

```html
<input type="file" id="file-selector" accept=".jpg, .jpeg, .png">
```

### Пользовательское перетаскивание {: #select-dnd}

В некоторых браузерах элемент `<input type="file">` также является объектом-приёмником, что позволяет пользователям перетаскивать файлы в приложение. Но объект-приёмник мал, поэтому это неудобно. Вместо этого, после предоставления базовой функциональности с помощью `<input type="file">`, предоставьте большую настраиваемую область перетаскивания.

{% Aside %} Проверьте, является ли метод [`DataTransferItem.getAsFileSystemHandle()`](/file-system-access/#drag-and-drop-integration) жизнеспособной альтернативой для вашего варианта использования, поскольку он также дает дескриптор файла, чтобы вы могли записывать обратно в файл, помимо чтения. {% endAside %}

#### Выберите область перетаскивания {: #choose-drop-zone}

Область объекта-приёмника зависит от дизайна вашего приложения. Вы можете захотеть, чтобы только часть окна была областью перетаскивания, или, возможно, всё окно.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xX8UXdqkLmZXu3Ad1Z2q.png", alt="Скриншот Squoosh, веб-приложения для сжатия изображений.", width="800", height="589" %} <figcaption> В Squoosh всё окно стает областью перетаскивания. </figcaption></figure>

Squoosh позволяет пользователю перетаскивать изображение в любом месте окна, а щелчок по значку **выбора изображения** вызывает элемент `<input type="file">`. Что бы вы ни выбрали в качестве объекта-приёмника, убедитесь, что пользователю понятно, что он может перетаскивать файлы в эту область.

#### Определите область перетаскивания {: #define-drop-zone}

Чтобы включить элемент в зону перетаскивания, необходимо прослушать два события, [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event) и [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event). Событие `dragover` обновляет пользовательский интерфейс браузера, чтобы визуально показать, что действие перетаскивания создает копию файла. Событие `drop` запускается после того, как пользователь опускает файлы на область перетаскивания. Аналогично элементу ввода, вы можете получить доступ к списку файлов из `event.dataTransfer.files`, который представляет собой объект [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList). Каждый элемент в `FileList` является объектом [`File`](https://developer.mozilla.org/docs/Web/API/File).

```js
const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  console.log(fileList);
});
```

События [`event.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) и [`event.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) останавливают поведение браузера по умолчанию и позволяют вместо этого запускаться вашему коду. Без них браузер ушел бы с вашей страницы и открывал файлы, которые пользователь поместил в окно браузера.

{# Код из примера не работает в качестве встроенного. #}

Посмотрите живую демонстрацию [настраиваемой области перетаскивания](https://custom-drag-and-drop.glitch.me/).

### А как насчет каталогов? {: #directories}

К сожалению, на сегодня нет хорошего способа получить доступ к каталогу.

Атрибут [`webkitdirectory`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory) элемента `<input type="file">` позволяет пользователю выбрать каталог или каталоги. Он поддерживается некоторыми браузерами на основе Chromium и, возможно, настольной версией Safari, но имеются [противоречивые](https://caniuse.com/#search=webkitdirectory) сведения о совместимости с другими браузерами.

{% Aside %} Проверьте, является ли метод [`window.showDirectoryPicker()`](/file-system-access/#opening-a-directory-and-enumerating-its-contents) жизнеспособной альтернативой для вашего варианта использования, поскольку он также дает дескриптор каталога, чтобы вы могли записывать обратно в каталог, помимо чтения. Для этого метода можно применять [полизаполнение](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories). {% endAside %}

Если перетаскивание включено, пользователь может попытаться перетащить каталог в область перетаскивания. Когда запускается событие drop, оно будет включать `File` для каталога, но не сможет получить доступ ни к одному из файлов в каталоге.

## Чтение метаданных файла {: #read-metadata}

Объект [`File`](https://developer.mozilla.org/docs/Web/API/File) содержит ряд свойств метаданных о файле. Большинство браузеров предоставляют имя файла, размер файла и тип MIME, хотя в зависимости от платформы разные браузеры могут предоставлять различную или дополнительную информацию.

```js
function getMetadataForFileList(fileList) {
  for (const file of fileList) {
    // Not supported in Safari for iOS.
    const name = file.name ? file.name : 'NOT SUPPORTED';
    // Not supported in Firefox for Android or Opera for Android.
    const type = file.type ? file.type : 'NOT SUPPORTED';
    // Unknown cross-browser support.
    const size = file.size ? file.size : 'NOT SUPPORTED';
    console.log({file, name, type, size});
  }
}
```

Вы можете увидеть это в действии в демонстрации Glitch [`input-type-file`](https://input-type-file.glitch.me/).

## Чтение содержимого файла {: #read-content}

Чтобы прочитать файл, используйте объект [`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader), который позволяет читать содержимое `File` в память. Вы можете указать для объекта `FileReader` методы чтения файлов [ArrayBuffer](https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer), [dataURL](https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL) или [text](https://developer.mozilla.org/docs/Web/API/FileReader/readAsText).

```js
function readImage(file) {
  // Check if the file is an image.
  if (file.type && !file.type.startsWith('image/')) {
    console.log('File is not an image.', file.type, file);
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    img.src = event.target.result;
  });
  reader.readAsDataURL(file);
}
```

В приведенном выше примере считывается предоставленный пользователем `File`, затем он преобразуется в Data URL, который используется для отображения изображения в элементе `img`. Ознакомьтесь с примером на Glitch [`read-image-file`](https://read-image-file.glitch.me/), чтобы узнать, как проверить, выбрал ли пользователь файл изображения.

{% Glitch {id: 'read-image-file', height: 480}%}

### Отслеживайте процесс чтения файла {: #monitor-progress}

При чтении больших файлов будет целесообразно предоставлять определенный интерфейс UX, показывающий насколько далеко продвинулось чтение. Для этого используйте событие [`progress`](https://developer.mozilla.org/docs/Web/API/FileReader/progress_event), предоставляемое `FileReader`. Событие `progress` предоставляет два свойства: количество почитанного `loaded` и общий объем чтения `total`.

```js/7-12
function readFile(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    // Do something with result
  });

  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsDataURL(file);
}
```

Главное изображение взято у Vincent Botta на [Unsplash](https://unsplash.com/photos/bv_rJXpNU9I)
