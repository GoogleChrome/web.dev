---
layout: post
title: Ler e gravar arquivos e diretórios com a biblioteca browser-fs-access
authors:
  - thomassteiner
description: |2

  "Todos os navegadores modernos podem ler arquivos e diretórios locais; Contudo,"

  verdadeiro acesso de gravação, ou seja, mais do que apenas baixar arquivos,

  está limitado a navegadores que implementam a API de acesso ao sistema de arquivos.

  Esta postagem apresenta uma biblioteca de suporte chamada browser-fs-access

  que atua como uma camada de abstração no topo da API File System Access

  e que, de forma transparente, volta às abordagens legadas para lidar com arquivos.
scheduled: verdadeiro
date: 2020-07-27
updated: 2022-01-25
hero: image/admin/Y4wGmGP8P0Dc99c3eKkT.jpg
tags:
  - blog
  - progressive-web-apps
  - capabilities
feedback:
  - api
---

Os navegadores já conseguem lidar com arquivos e diretórios há muito tempo. A [API Arquivo](https://w3c.github.io/FileAPI/) fornece recursos para representar objetos de arquivo em aplicativos da web, bem como selecioná-los programaticamente e acessar seus dados. No momento em que você olha mais de perto, porém, nem tudo o que reluz é ouro.

## A maneira tradicional de lidar com arquivos

{% Aside %} Se você sabe como funcionava do jeito antigo, pode [pular direto para o novo jeito](#the-file-system-access-api). {% endAside %}

### Abrindo arquivos

Como desenvolvedor, você pode abrir e ler arquivos por meio do elemento [`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file). Em sua forma mais simples, abrir um arquivo pode ser parecido com o exemplo de código abaixo. O objeto de `input` [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList), que no caso a seguir consiste em apenas um [`File`](https://developer.mozilla.org/docs/Web/API/File). Um `File` é um tipo específico de [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) e pode ser usado em qualquer contexto em que um Blob.

```js
const openFile = async () => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', () => {
      resolve(input.files[0]);
    });
    input.click();
  });
};
```

### Abrindo diretórios

Para abrir pastas (ou diretórios), você pode definir o atributo [`<input webkitdirectory>`](https://developer.mozilla.org/docs/Web/HTML/Element/input#attr-webkitdirectory) Tirando isso, todo o resto funciona da mesma forma que acima. Apesar de seu nome com o prefixo do fornecedor, `webkitdirectory` não pode ser usado apenas nos navegadores Chromium e WebKit, mas também no Edge baseado em EdgeHTML legado e no Firefox.

### Salvando (em vez de baixando) arquivos

Para salvar um arquivo, tradicionalmente, você está limitado a *baixar* um arquivo, o que funciona graças ao atributo [`<a download>`](https://developer.mozilla.org/docs/Web/HTML/Element/a#attr-download:~:text=download) Dado um Blob, você pode definir o `href` da âncora como um `blob:` URL que pode ser obtido no método [`URL.createObjectURL()`](https://developer.mozilla.org/docs/Web/API/URL/createObjectURL) {% Aside 'caution' %} Para evitar vazamentos de memória, sempre revogue o URL após o download. {% endAside %}

```js
const saveFile = async (blob) => {
  const a = document.createElement('a');
  a.download = 'my-file.txt';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};
```

### O problema

Uma grande desvantagem da *abordagem de download* é que não há como fazer um fluxo clássico abrir → editar → salvar, ou seja, não há como *sobrescrever* o arquivo original. Em vez disso, você acaba com uma nova *cópia* do arquivo original na pasta de Downloads padrão do sistema operacional sempre que "salva".

## A API de acesso ao sistema de arquivos

A API de acesso ao sistema de arquivos torna ambas as operações, abrir e salvar, muito mais simples. Também possibilita *o salvamento real*, ou seja, você não só pode escolher onde salvar um arquivo, mas também sobrescrever um arquivo existente.

{% Aside %} Para obter uma introdução mais completa à API de acesso ao sistema de arquivos, consulte o artigo [A API de acesso ao sistema de arquivos: simplificando o acesso a arquivos locais](/file-system-access/). {% endAside %}

### Abrindo arquivos

Com a [API de acesso ao sistema de arquivos](https://wicg.github.io/file-system-access/), abrir um arquivo é uma questão de chamar o método `window.showOpenFilePicker()`. Esta chamada retorna um identificador de arquivo, do qual você pode obter o `File` real por meio do método `getFile()`.

```js
const openFile = async () => {
  try {
    // Always returns an array.
    const [handle] = await window.showOpenFilePicker();
    return handle.getFile();
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

### Abrindo diretórios

Abra um diretório chamando `window.showDirectoryPicker()` que torna os diretórios selecionáveis na caixa de diálogo do arquivo.

### Salvando arquivos

Salvar arquivos é igualmente simples. A partir de um identificador de arquivo, você cria um fluxo gravável por meio de `createWritable()`, depois grava os dados Blob chamando o `write()` do fluxo e, por fim, fecha o fluxo chamando seu método `close()`.

```js
const saveFile = async (blob) => {
  try {
    const handle = await window.showSaveFilePicker({
      types: [{
        accept: {
          // Omitted
        },
      }],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return handle;
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

## Apresentando o navegador-fs-access

Por mais perfeita que seja a API de acesso ao sistema de arquivos, ela [ainda não está amplamente disponível](https://caniuse.com/native-filesystem-api).

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/G1jsSjCBR871W1uKQWeN.png", alt="Tabela de suporte do navegador para a API de acesso ao sistema de arquivos. Todos os navegadores são marcados como 'sem suporte' ou 'atrás de um sinalizador'.", width="800", height="224" %} <figcaption>Tabela de suporte do navegador para a API de acesso ao sistema de arquivos. (<a href="https://caniuse.com/native-filesystem-api">Fonte</a>)</figcaption></figure>

É por isso que vejo a API de acesso ao sistema de arquivos como um [aprimoramento progressivo](/progressively-enhance-your-pwa). Como tal, quero usá-lo quando o navegador oferecer suporte e, se não for, usar a abordagem tradicional; ao mesmo tempo, nunca pune o usuário com downloads desnecessários de código JavaScript não suportado. A [biblioteca browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) é minha resposta para esse desafio.

### Filosofia de design

Como a API de acesso ao sistema de arquivos provavelmente ainda mudará no futuro, a API browser-fs-access não é modelada a partir dela. Ou seja, a biblioteca não é um [polyfill](https://developer.mozilla.org/docs/Glossary/Polyfill), mas sim um [ponyfill](https://github.com/sindresorhus/ponyfill). Você pode (estaticamente ou dinamicamente) importar exclusivamente qualquer funcionalidade necessária para manter seu aplicativo o menor possível. Os métodos disponíveis são os nomeados apropriadamente [`fileOpen()`](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files), [`directoryOpen()`](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories) e [`fileSave()`](https://github.com/GoogleChromeLabs/browser-fs-access#saving-files). Internamente, o recurso de biblioteca detecta se a API de acesso ao sistema de arquivos é compatível e, a seguir, importa o caminho do código correspondente.

### Usando a biblioteca browser-fs-access

Os três métodos são intuitivos de usar. Você pode especificar os `mimeTypes` ou `extensions` arquivo aceitos do seu aplicativo e definir um `multiple` para permitir ou proibir a seleção de vários arquivos ou diretórios. Para obter detalhes completos, consulte a [documentação da API browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access#api-documentation). O exemplo de código abaixo mostra como você pode abrir e salvar arquivos de imagem.

```js
// The imported methods will use the File
// System Access API or a fallback implementation.
import {
  fileOpen,
  directoryOpen,
  fileSave,
} from 'https://unpkg.com/browser-fs-access';

(async () => {
  // Open an image file.
  const blob = await fileOpen({
    mimeTypes: ['image/*'],
  });

  // Open multiple image files.
  const blobs = await fileOpen({
    mimeTypes: ['image/*'],
    multiple: true,
  });

  // Open all files in a directory,
  // recursively including subdirectories.
  const blobsInDirectory = await directoryOpen({
    recursive: true
  });

  // Save a file.
  await fileSave(blob, {
    fileName: 'Untitled.png',
  });
})();
```

### Demo

Você pode ver o código acima em ação em uma [demonstração](https://browser-fs-access.glitch.me/) no Glitch. Seu [código-fonte](https://glitch.com/edit/#!/browser-fs-access) também está disponível lá. Como, por razões de segurança, os subquadros de origem cruzada não têm permissão para mostrar um seletor de arquivos, a demonstração não pode ser incorporada neste artigo.

## A biblioteca browser-fs-access em liberdade

Em meu tempo livre, contribuo um pouquinho para um [PWA instalável](/progressive-web-apps/#make-it-installable) chamado [Excalidraw](https://excalidraw.com/), uma ferramenta de quadro branco que permite esboçar diagramas facilmente com uma sensação de desenho à mão. É totalmente responsivo e funciona bem em uma variedade de dispositivos, desde pequenos telefones celulares a computadores com telas grandes. Isso significa que ele precisa lidar com arquivos em todas as várias plataformas, independentemente de serem ou não compatíveis com a API de acesso ao sistema de arquivos. Isso o torna um ótimo candidato para a biblioteca browser-fs-access.

Posso, por exemplo, iniciar um desenho no meu iPhone, salvá-lo (tecnicamente: baixe-o, pois o Safari não oferece suporte à API de acesso ao sistema de arquivos) na pasta Downloads do meu iPhone, abra o arquivo no meu desktop (após transferi-lo do meu telefone), modifique o arquivo e substitua-o com minhas alterações ou mesmo salve-o como um novo arquivo.

<figure>{% Img src="image/admin/u1Gwxp5MxS39wl8PW2vz.png", alt="Um desenho Excalidraw em um iPhone.", width="300", height="649" %} <figcaption> Iniciando um desenho Excalidraw em um iPhone onde a API de acesso ao sistema de arquivos não é suportada, mas onde um arquivo pode ser salvo (baixado) na pasta Downloads.</figcaption></figure>

<figure>{% Img src="image/admin/W1lt36DtKuveBJJTzonC.png", alt="O desenho Excalidraw modificado no Chrome na área de trabalho.", width="800", height="592" %} <figcaption> Abrindo e modificando o desenho Excalidraw na área de trabalho onde a API de acesso ao sistema de arquivos é suportada e, portanto, o arquivo pode ser acessado por meio da API.</figcaption></figure>

<figure>{% Img src="image/admin/srqhiMKy2i9UygEP4t8e.png", alt="Substituindo o arquivo original com as modificações.", width="800", height="585" %} <figcaption>Substituindo o arquivo original com as modificações no arquivo de desenho original Excalidraw. O navegador mostra uma caixa de diálogo perguntando se está tudo bem.</figcaption></figure>

<figure>{% Img src="image/admin/FLzOZ4eXZ1lbdQaA4MQi.png", alt="Salvando as modificações em um novo arquivo de desenho Excalidraw.", width="800", height="592" %} <figcaption>Salvando as modificações em um novo arquivo Excalidraw. O arquivo original permanece intocado.</figcaption></figure>

### Amostra de código de aplicação real

Abaixo, você pode ver um exemplo real de navegador-fs-access como ele é usado no Excalidraw. Este trecho foi retirado de [`/src/data/json.ts`](https://github.com/excalidraw/excalidraw/blob/cd87bd6901b47430a692a06a8928b0f732d77097/src/data/json.ts#L24-L52). É de interesse especial como o `saveAsJSON()` passa um identificador de arquivo ou `null` para o método browser-fs-access ' `fileSave()`, o que faz com que ele seja sobrescrito quando um identificador é fornecido, ou salva em um novo arquivo se não for.

```js
export const saveAsJSON = async (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  fileHandle: any,
) => {
  const serialized = serializeAsJSON(elements, appState);
  const blob = new Blob([serialized], {
    type: "application/json",
  });
  const name = `${appState.name}.excalidraw`;
  (window as any).handle = await fileSave(
    blob,
    {
      fileName: name,
      description: "Excalidraw file",
      extensions: ["excalidraw"],
    },
    fileHandle || null,
  );
};

export const loadFromJSON = async () => {
  const blob = await fileOpen({
    description: "Excalidraw files",
    extensions: ["json", "excalidraw"],
    mimeTypes: ["application/json"],
  });
  return loadFromBlob(blob);
};
```

### Considerações de interface do usuário

Seja no Excalidraw ou em seu aplicativo, a IU deve se adaptar à situação de suporte do navegador. Se a API de acesso ao sistema de arquivos for suportada (`if ('showOpenFilePicker' in window) {}`), você pode mostrar um **botão Salvar como** além de um botão **Salvar**. As imagens abaixo mostram a diferença entre a barra de ferramentas responsiva do aplicativo principal do Excalidraw no iPhone e na área de trabalho do Chrome. Observe como no iPhone o **botão Salvar como** está faltando.

<figure>{% Img src="image/admin/c2sjjj86zh53VDrPIo6M.png", alt="Excalidraw app toolbar no iPhone com apenas um botão 'Salvar'.", width="300", height="226" %} <figcaption>Barra de ferramentas do aplicativo Excalidraw no iPhone com apenas um botão <strong>Salvar</strong>.</figcaption></figure>

<figure>{% Img src="image/admin/unUUghwH5mG2hLnaViHK.png", alt="Barra de ferramentas do aplicativo Excalidraw na área de trabalho do Chrome com um botão 'Salvar' e 'Salvar como'.", width="300", height="66" %} <figcaption>Barra de ferramentas do aplicativo Excalidraw no Chrome com um botão <strong>Salvar</strong> e um botão <strong>Salvar</strong> em foco.</figcaption></figure>

## Conclusões

Trabalhar com arquivos de sistema funciona tecnicamente em todos os navegadores modernos. Em navegadores que suportam a API de acesso ao sistema de arquivos, você pode tornar a experiência melhor permitindo o verdadeiro salvamento e sobrescrita (não apenas o download) de arquivos e permitindo que seus usuários criem novos arquivos onde quiserem, ao mesmo tempo em que permanecem funcionais em navegadores que não suporta a API de acesso ao sistema de arquivos. O [navegador-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) torna sua vida mais fácil, lidando com as sutilezas do aprimoramento progressivo e tornando seu código o mais simples possível.

## Reconhecimentos

Este artigo foi revisado por [Joe Medley](https://github.com/jpmedley) e [Kayce Basques](https://github.com/kaycebasques). Agradeço aos [colaboradores da Excalidraw](https://github.com/excalidraw/excalidraw/graphs/contributors) por seu trabalho no projeto e por revisar minhas solicitações de pull. [Imagem do herói](https://unsplash.com/photos/hXrPSgGFpqQ) por [Ilya Pavlov](https://unsplash.com/@ilyapavlov) em Unsplash.
