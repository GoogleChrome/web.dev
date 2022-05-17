---
title: Desbloqueando o acesso à área de transferência
subhead: Acesso mais seguro e desbloqueado à área de transferência para textos e imagens
authors:
  - developit
  - thomassteiner
description: A API Async Clipboard simplifica copiar e colar com permissões.
date: 2020-07-31
updated: 2021-07-29
tags:
  - blog
  - capabilities
hero: image/admin/aA9eqo0ZZNHFcFJGUGQs.jpg
alt: Área de transferência com lista de compras
feedback:
  - api
---

Nos últimos anos, os navegadores têm usado [`document.execCommand()`](https://developers.google.com/web/updates/2015/04/cut-and-copy-commands) para interações com a área de transferência. Embora amplamente suportado, esse método de recortar e colar tinha um custo: o acesso à área de transferência era síncrono e só podia ler e gravar no DOM.

Isso não é problema para pequenos trechos de texto, mas há muitas situações em que bloquear a página durante a transferência é uma experiência ruim. Pode ser necessária uma higienização ou decodificação de imagem demorada antes que o conteúdo possa ser colado com segurança. O navegador pode precisar carregar ou embutir recursos vinculados de um documento colado. Isto bloquearia a página enquanto espera no disco ou na rede. Imagine adicionar permissões à combinação, exigindo que o navegador bloqueie a página enquanto solicita acesso à área de transferência. Além disso, as permissões implementadas em torno de `document.execCommand()` para a interação com área de transferência são definidas vagamente e variam entre os navegadores.

A [API Async Clipboard](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api) resolve esses problemas, fornecendo um modelo de permissões bem definido que não bloqueia a página. O Safari anunciou recentemente o [suporte para ela na versão 13.1](https://webkit.org/blog/10855/). Com isso, os principais navegadores recebem um nível básico de suporte. No momento em que este livro foi escrito, o Firefox só oferecia suporte a texto; e o suporte a imagens é limitado ao formato PNG em alguns navegadores. Se você estiver interessado em usar a API, [consulte uma tabela que mostra o suporte em navegadores](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility) antes de continuar.

{% Aside %} A API Async Clipboard é limitada ao tratamento de texto e imagens. O Chrome 84 apresenta um recurso experimental que permite à área de transferência lidar com qualquer tipo de dados arbitrário. {% endAside %}

## Copiar: gravando dados na área de transferência

### writeText()

Para copiar texto para a área de transferência, chame `writeText()`. Como esta API é assíncrona, a `writeText()` retorna uma promessa que resolve ou rejeita dependendo se o texto passado foi copiado com sucesso:

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

Na verdade, `writeText()` nada mais é que que um método de conveniência para o método `write()` genérico, que também permite copiar imagens para a área de transferência. Como `writeText()`, ele é assíncrono e retorna uma promessa.

Para gravar uma imagem na área de transferência, você precisa da imagem como um [`blob`](https://developer.mozilla.org/docs/Web/API/blob). Uma maneira de fazer isso é solicitando a imagem de um servidor usando `fetch()` e, em seguida, chamando [`blob()`](https://developer.mozilla.org/docs/Web/API/Body/blob) na resposta.

Solicitar uma imagem do servidor pode não ser desejável ou possível por vários motivos. Felizmente, você também pode desenhar a imagem numa canvas e chamar o método [`toBlob()`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob)

Em seguida, passe um array de objetos `ClipboardItem` como parâmetro para o método `write()`. Atualmente, você só pode passar uma imagem de cada vez, mas esperamos adicionar suporte para múltiplas imagens no futuro. `ClipboardItem` recebe um objeto com o tipo MIME da imagem como chave e o blob como valor. Nos objetos Blob obtidos de `fetch()` ou `canvas.toBlob()`, a propriedade `blob.type` contém automaticamente o tipo MIME correto para uma imagem.

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

{% Aside 'warning' %} O Safari (WebKit) trata a ativação do usuário de maneira diferente do Chromium (Blink) (veja o [bug # 222262 do WebKit](https://bugs.webkit.org/show_bug.cgi?id=222262)). Para o Safari, rode todas as operações assíncronas numa promessa cujo resultado você atribui ao `ClipboardItem`:

```js
new ClipboardItem({
  'foo/bar': new Promise(async (resolve) => {
      // Prepare `blobValue` of type `foo/bar`
      resolve(new Blob([blobValue], { type: 'foo/bar' }));
    }),
  })
```

{% endAside %}

### O evento copy

No caso em que um usuário inicia uma cópia da área de transferência, os dados não textuais são fornecidos como um Blob para você. O [evento `copy`](https://developer.mozilla.org/docs/Web/API/Document/copy_event) inclui uma propriedade `clipboardData` com os itens já no formato correto, eliminando a necessidade de criar manualmente um Blob. Chame `preventDefault()` para evitar o comportamento default em favor de sua própria lógica e, em seguida, copie o conteúdo para a área de transferência. O que não é abordado neste exemplo é o fallback para APIs anteriores quando a API Clipboard não é suportada. Abordarei isto em [Detecção de recursos](#feature-detection), mais adiante neste artigo.

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

## Colar: lendo dados da área de transferência

### readText()

Para ler o texto da área de transferência, chame `navigator.clipboard.readText()` e aguarde a promessa retornada para resolver:

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

O método `navigator.clipboard.read()` também é assíncrono e retorna uma promessa. Para ler uma imagem da área de transferência, obtenha uma lista de objetos [`ClipboardItem`](https://developer.mozilla.org/docs/Web/API/ClipboardItem) e itere sobre eles.

Cada `ClipboardItem` pode manter seu conteúdo em diferentes tipos, então você precisará iterar sobre a lista de tipos, novamente usando um loop `for...of`. Para cada tipo, chame o `getType()` com o tipo atual como um argumento para obter o Blob correspondente. Como antes, esse código não está vinculado a imagens e funcionará com outros tipos de arquivo futuros.

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

### Trabalhando com arquivos colados

É útil para os usuários poderem usar os atalhos do teclado da área de transferência, como <kbd>ctrl</kbd> + <kbd>c</kbd> e <kbd>ctrl</kbd> + <kbd>v</kbd>. O Chromium expõe *arquivos somente leitura* na área de transferência, conforme descrito abaixo. Isto é acionado quando o usuário acessa o atalho de colar default do sistema operacional ou quando clica em **Editar** e depois em **Colar** na barra de menu do navegador. Nenhum código adicional é necessário.

```js
document.addEventListener("paste", async e => {
  e.preventDefault();
  if (!e.clipboardData.files.length) {
    return;
  }
  const file = e.clipboardData.files[0];
  // Leia conteúdo do arquivo, assumindo ser texto.
  // Não há como gravar nele de volta.
  console.log(await file.text());
});
```

### O evento paste

Conforme observado antes, existem planos para introduzir eventos para trabalhar com a API Clipboard, mas por enquanto você pode usar o evento `paste`. Ele funciona bem com os novos métodos assíncronos de leitura de texto da área de transferência. Tal como acontece com o `copy`, não se esqueça de chamar `preventDefault()`.

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  const text = await navigator.clipboard.readText();
  console.log('Pasted text: ', text);
});
```

Tal como acontece com o evento `copy`, o fallback para APIs anteriores quando a API Clipboard não é suportada será tratada em [Detecção de recursos](#feature-detection).

## Lidando com múltiplos tipos de arquivo

A maioria das implementações coloca múltiplos formatos de dados na área de transferência para uma única operação corte ou cópia. Há dois motivos para isso: como desenvolvedor de aplicações, você não tem como saber os recursos da aplicação para os quais um usuário deseja copiar texto ou imagens, e muitas aplicações suportam a colagem de dados estruturados como texto simples. Isto é apresentado aos usuários com um item de menu **Editar** com um nome como **Colar e combinar estilo** ou **Colar sem formatação**.

O exemplo a seguir mostra como fazer isso. Este exemplo usa `fetch()` para obter dados de imagem, mas esses dados também poderiam vir de um [`<canvas>`](https://developer.mozilla.org/docs/Web/HTML/Element/canvas) ou da [API File System Access](/file-system-access/).

```js
async function copy() {
  const image = await fetch('kitten.png').then(response => response.blob());
  const text = new Blob(['Cute sleeping kitten'], {type: 'text/plain'});
  const item = new ClipboardItem({
    'text/plain': text,
    'image/png': image
  });
  await navigator.clipboard.write([item]);
}
```

## Segurança e permissões

O acesso à área de transferência sempre representou uma preocupação de segurança para os navegadores. Sem as permissões adequadas, uma página poderia copiar silenciosamente todo tipo de conteúdo malicioso para a área de transferência de um usuário, o que produziria resultados catastróficos quando colado. Imagine uma página da web que copia silenciosamente `rm -rf /` ou uma [imagem de bomba de descompressão](http://www.aerasec.de/security/advisories/decompression-bomb-vulnerability.html) para sua área de transferência.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dt4QpuEuik9ja970Zos1.png", alt="Prompt do navegador pedindo permissão ao usuário para a área de transferência.", width="800", height="338" %}   <figcaption>O prompt de permissão para a API Clipboard. </figcaption></figure>

Dar às páginas web acesso irrestrito de leitura à área de transferência é ainda mais problemático. Os usuários copiam rotineiramente informações confidenciais, como senhas e detalhes pessoais, para a área de transferência, que poderia então ser lida por qualquer página sem o conhecimento do usuário.

Tal como acontece com muitas novas APIs, a Clipboard API só é suportada em páginas servidas por HTTPS. Para ajudar a prevenir abusos, o acesso à área de transferência só é permitido quando uma página é a aba ativa. As páginas nas abas ativas podem gravar na área de transferência sem solicitar permissão, mas a leitura da área de transferência sempre requer permissão.

Permissões para copiar e colar foram adicionadas à [Permissions API](https://developers.google.com/web/updates/2015/04/permissions-api-for-the-web). A permissão `clipboard-write` é concedida automaticamente às páginas quando elas estão na aba ativa. A permissão `clipboard-read` precisa ser solicitada, o que você pode fazer ao tentar ler dados da área de transferência. O código abaixo mostra o último:

```js
const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
const permissionStatus = await navigator.permissions.query(queryOpts);
// Será 'granted', 'denied' or 'prompt':
console.log(permissionStatus.state);

// Escuta mudanças ao estado de permissão
permissionStatus.onchange = () => {
  console.log(permissionStatus.state);
};
```

Você também pode controlar se um gesto do usuário é necessário para chamar a ação de cortar ou colar usando a opção `allowWithoutGesture`. O default para este valor varia de acordo com o navegador, portanto, você deve sempre incluí-lo.

É aqui que a natureza assíncrona da API da área de transferência é realmente útil: a tentativa de ler ou gravar dados da área de transferência automaticamente solicita permissão ao usuário, caso ainda não tenha sido concedida. Como a API é baseada em promessas, isto é completamente transparente e um usuário negando a permissão à área de transferência faz com que a promessa seja rejeitada para que a página possa responder apropriadamente.

Como o Chrome só permite acesso à área de transferência quando uma página é a aba ativa, você descobrirá que alguns dos exemplos aqui não rodam se colados diretamente no DevTools, já que o próprio DevTools é a aba ativa. Há um truque: adie o acesso à área de transferência usando `setTimeout()` e clique rapidamente dentro da página para obter seu foco antes que as funções sejam chamadas:

```js
setTimeout(async () => {
  const text = await navigator.clipboard.readText();
  console.log(text);
}, 2000);
```

## Integração de políticas de permissões

Para usar a API em iframes, você precisa habilitá-la com a [Política de Permissões](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/), que define um mecanismo que permite ativar e desativar seletivamente diversos recursos do navegador e APIs. Concretamente, você precisa passar ou `clipboard-read` ou `clipboard-write`, dependendo das necessidades da sua aplicação.

```html/2
<iframe
    src="index.html"
    allow="clipboard-read; clipboard-write"
>
</iframe>
```

## Detecção de recursos

Para usar a API Async Clipboard e oferecer suporte a todos os navegadores, teste o `navigator.clipboard` e substitua por métodos anteriores. Por exemplo, veja um exemplo de como você pode implementar a colagem para incluir outros navegadores.

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

Essa não é toda a história. Antes da API Async Clipboard, havia uma mistura de diferentes implementações da técnica de copiar e colar em diferentes navegadores web. Na maioria dos navegadores, a o recurso copiar/colar do próprio navegador pode ser acionado usando `document.execCommand('copy')` e `document.execCommand('paste')`. Se o texto a ser copiado for uma string que não está presente no DOM, ela deve ser injetada no DOM e selecionada:

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

No Internet Explorer, você também pode acessar a área de transferência por meio de `window.clipboardData`. Se acessado por meio de um gesto do usuário, como um evento de clique - parte do ato de pedir permissão com responsabilidade - nenhum prompt de permissão será mostrado.

## Demos

Você pode experimentar com a API Async Clipboard nas demos abaixo ou [diretamente no Glitch](https://async-clipboard-api.glitch.me/) .

O primeiro exemplo demonstra como mover o texto para dentro e para fora da área de transferência.

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-text.glitch.me/" title="async-clipboard-text on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Para experimentar a API com imagens, use esta demonstração. Lembre-se de que apenas PNGs são suportados e apenas em [alguns navegadores](https://developer.mozilla.org/docs/Web/API/Clipboard_API#browser_compatibility).

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-api.glitch.me/" title="async-clipboard-api on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Próximos passos

O Chrome está trabalhando ativamente na expansão da API Asynchronous Clipboard com eventos simplificados alinhados com a [API Drag and Drop](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API). Por causa dos riscos potenciais, o Chrome está trilhando com cuidado. Para se manter atualizado sobre o progresso do Chrome, acompanhe este artigo e nosso [blog](/blog/) para atualizações.

No momento, o suporte para a API Clipboard está disponível em [vários navegadores](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility) .

Boas cópias e colagens!

## Links relacionados

- [MDN](https://developer.mozilla.org/docs/Web/API/Clipboard_API)

## Agradecimentos

A API Asynchronous Clipboard foi implementada por [Darwin Huang](https://www.linkedin.com/in/darwinhuang/) e [Gary Kačmarčík](https://www.linkedin.com/in/garykac/). Darwin também forneceu a demonstração. Obrigado a [Kyarik](https://github.com/kyarik) e novamente a Gary Kačmarčík por revisar partes deste artigo.

Imagem herói por [Markus Winkler](https://unsplash.com/@markuswinkler) no [Unsplash](https://unsplash.com/photos/7iSEHWsxPLw).
