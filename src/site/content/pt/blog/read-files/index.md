---
title: Leia arquivos em JavaScript
subhead: Como selecionar arquivos, ler metadados e conteúdo de arquivos e monitorar o progresso de leitura.
description: |2

  Como selecionar arquivos, ler metadados e conteúdo de arquivos e monitorar o progresso de leitura.
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

Poder selecionar e interagir com arquivos no dispositivo local do usuário é um dos recursos mais usados da web. Ele permite que os usuários selecionem arquivos e os enviem para um servidor, por exemplo, transferindo fotos ou documentos fiscais, etc. Mas, também permite que os sites os leiam e manipulem sem nunca ter que transferir os dados pela rede.

## A moderna API File System Access

A API File System Access, que permite o acesso ao sistema de arquivos, fornece uma maneira fácil de ler e gravar em arquivos e diretórios no sistema local do usuário. Atualmente ela está disponível na maioria dos navegadores derivados do Chromium, como Chrome ou Edge. Para saber mais sobre isso, consulte o artigo [API File System Access](/file-system-access/).

Como a API File System Access ainda não é compatível com todos os navegadores, dê uma olhada na biblioteca  [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access), uma biblioteca auxiliar que usa a nova API onde quer que esteja disponível, mas volta para abordagens legadas quando ela não estiver.

## Trabalhando com arquivos, da maneira clássica

Este guia mostra como:

- Selecionar arquivos
    - [Usando o elemento input do HTML](#select-input)
    - [Usando uma zona de arrastar e soltar](#select-dnd)
- [Ler os metadados do arquivo](#read-metadata)
- [Ler o conteúdo de um arquivo](#read-content)

## Selecionar arquivos {: #select}

### Elemento input do HTML {: #select-input}

A maneira mais fácil de permitir que os usuários selecionem arquivos é usando o elemento [`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file), que é suportado todos os principais navegadores. Quando clicado, ele permite que um usuário selecione um arquivo (ou vários arquivos se o atributo [`multiple`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes) estiver incluído), usando a interface de usuário de seleção de arquivo integrada do sistema operacional. Quando o usuário termina de selecionar um arquivo ou arquivos, o evento `change` do elemento é disparado. Você pode acessar a lista de arquivos através de `event.target.files`, que é um objeto [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList). Cada item em `FileList` é um objeto [`File`](https://developer.mozilla.org/docs/Web/API/File).

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

{% Aside %} Verifique se o [`window.showOpenFilePicker()`](/file-system-access/#ask-the-user-to-pick-a-file-to-read) é uma alternativa viável para o seu caso de uso, pois ele também devolve uma referência de arquivo para que você possa, além de ler o arquivo, também escrever de volta nele. Este método pode ser executado via [polyfill](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files). {% endAside %}

Este exemplo permite que um usuário selecione vários arquivos usando a IU de seleção de arquivo integrada do sistema operacional e, a seguir, registra cada arquivo selecionado no console.

{% Glitch {id: 'arquivo do tipo de entrada', altura: 480}%}

#### Limite os tipos de arquivos que o usuário pode selecionar {: #accept}

Em alguns casos, você pode querer limitar os tipos de arquivos que os usuários podem selecionar. Por exemplo, um aplicativo de edição de imagens deve aceitar apenas imagens, não arquivos de texto. Para fazer isso, você pode adicionar um [`accept`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes) ao elemento de entrada para especificar quais arquivos são aceitos.

```html
<input type="file" id="file-selector" accept=".jpg, .jpeg, .png">
```

### Arrastar e soltar personalizado {: #select-dnd}

Em alguns navegadores, o elemento `<input type="file">` também é um destino para soltar, permitindo que os usuários arrastem e soltem arquivos em seu aplicativo. Mas, o alvo de soltar é pequeno e pode ser difícil de usar. Em vez disso, depois de fornecer a funcionalidade principal usando um elemento `<input type="file">`, você deve fornecer uma grande superfície personalizada de arrastar e soltar.

{% Aside %} Verifique se o [`DataTransferItem.getAsFileSystemHandle()`](/file-system-access/#drag-and-drop-integration) é uma alternativa viável para o seu caso de uso, pois ele também devolve uma referência de arquivo para que você possa, além de ler o arquivo, também escrever de volta nele. {% endAside %}

#### Escolha sua zona de soltar {: #choose-drop-zone}

Sua superfície de soltar dependerá do design de sua aplicação. Você pode querer que apenas parte da janela seja uma superfície de soltar ou, potencialmente, a janela inteira.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xX8UXdqkLmZXu3Ad1Z2q.png", alt="Uma captura de tela do Squoosh, um aplicativo da web de compressão de imagem.", width="800", height="589" %}   <figcaption>     Squoosh torna a janela inteira uma zona de soltar.   </figcaption></figure>

O Squoosh permite que o usuário arraste e solte uma imagem em qualquer lugar da janela, e clicar em **selecionar uma imagem** invoca o elemento `<input type="file">`. Independentemente do que você escolher como zona para soltar, certifique-se de que esteja claro para o usuário que ele pode arrastar e soltar arquivos nessa superfície.

#### Defina a zona de soltar {: #define-drop-zone}

Para permitir que um elemento seja uma zona de arrastar e soltar, você precisará escutar dois eventos, [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event) e [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event). O `dragover` atualiza a IU do navegador para indicar visualmente que a ação arrastar e soltar está criando uma cópia do arquivo. O `drop` é disparado depois que o usuário solta os arquivos na superfície. Semelhante ao elemento input, você pode acessar a lista de arquivos em `event.dataTransfer.files`, que é um objeto [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList). Cada item em `FileList` é um objeto [`File`](https://developer.mozilla.org/docs/Web/API/File).

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

[`event.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) e [`event.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) impedem que o comportamento default do navegador aconteça e permitem que seu código seja executado. Sem eles, o navegador navegaria para fora da sua página e abriria os arquivos que o usuário colocou na janela do navegador.

{# Este exemplo não funciona como um embed. #}

Confira [Arrastar e soltar personalizado](https://custom-drag-and-drop.glitch.me/) para uma demonstração ao vivo.

### E quanto aos diretórios? {: #diretórios}

Infelizmente, hoje não existe uma boa maneira de obter acesso a um diretório.

O [`webkitdirectory`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory) no elemento `<input type="file">` permite que o usuário escolha um diretório ou diretórios. É compatível com alguns navegadores baseados em Chromium e possivelmente no Safari para desktop, mas tem relatos [conflitantes](https://caniuse.com/#search=webkitdirectory) quanto à compatibilidade de navegadores.

{% Aside %} Verifique se o [`window.showDirectoryPicker()`](/file-system-access/#opening-a-directory-and-enumerating-its-contents) é uma alternativa viável para o seu caso de uso, pois ele também devolve uma referência de diretório para que você possa, além de ler o conteúdo do diretório, também gravar de volta nele. Este método pode ser executado via [polyfill](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories). {% endAside %}

Se o comportamento de arrastar e soltar estiver ativado, um usuário pode tentar arrastar um diretório para a zona de soltar. Quando o evento drop for disparado, ele incluirá um objeto `File` para o diretório, mas não poderá acessar nenhum dos arquivos do diretório.

## Ler os metadados do arquivo {: #read-metadata}

O objeto [`File`](https://developer.mozilla.org/docs/Web/API/File) contém várias propriedades de metadados sobre o arquivo. A maioria dos navegadores fornece o nome do arquivo, o tamanho do arquivo e o tipo MIME, embora dependendo da plataforma, navegadores diferentes possam fornecer informações diferentes ou adicionais.

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

Você pode ver isto em ação na demonstração Glitch do [`input-type-file`](https://input-type-file.glitch.me/)

## Ler o conteúdo de um arquivo {: #read-content}

Para ler um arquivo, use [`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader), que permite ler o conteúdo de um objeto `File` na memória. Você pode instruir o `FileReader` a ler um arquivo como um [array buffer](https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer), uma [URL de dados](https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL) ou [texto](https://developer.mozilla.org/docs/Web/API/FileReader/readAsText) .

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

O exemplo acima lê um `File` fornecido pelo usuário, depois o converte em uma URL de dados e usa essa URL de dados para exibir a imagem em um elemento `img`. Veja o Glitch [`read-image-file`](https://read-image-file.glitch.me/) para saber como verificar se o usuário selecionou um arquivo de imagem.

{% Glitch {id: 'arquivo de imagem lido', altura: 480}%}

### Monitore o progresso de um arquivo lido {: #monitor-progress}

Ao ler arquivos grandes, pode ser útil fornecer alguma experiência ao usuário para indicar o quanto a leitura progrediu. Para isso, use o evento [`progress`](https://developer.mozilla.org/docs/Web/API/FileReader/progress_event) fornecido pelo `FileReader`. O evento `progress` fornece duas propriedades, `loaded`, a quantidade lida e `total`, a quantidade total a ser lida.

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

Imagem do herói por Vincent Botta de [Unsplash](https://unsplash.com/photos/bv_rJXpNU9I)
