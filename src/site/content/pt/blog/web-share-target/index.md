---
title: Recebendo dados compartilhados com a API Web Share Target
subhead: Compartilhamento no celular e desktop simplificado com a API Web Share Target
authors:
  - petelepage
  - joemedley
date: 2019-11-08
updated: 2021-06-07
hero: image/admin/RfxdrfKdh5Fp8camulRt.png
alt: Uma ilustração que demonstra que aplicativos específicos da plataforma agora podem compartilhar conteúdo com aplicativos da web.
description: |2-

  Em um dispositivo móvel ou desktop, o compartilhamento deve ser tão simples quanto clicar no botão Compartilhar,

  escolher um aplicativo e, em seguida, escolher com quem compartilhar. A API Web Share Target

  permite que os aplicativos da web instalados se registrem no sistema operacional subjacente para receber conteúdo compartilhado.
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

Em um dispositivo móvel ou desktop, o compartilhamento deve ser tão simples quanto clicar no botão **Compartilhar**, escolher um aplicativo e escolher com quem compartilhar. Por exemplo, você pode querer compartilhar um artigo interessante, enviando-o por e-mail para amigos ou tweetando para o mundo.

No passado, apenas aplicativos específicos da plataforma podiam se registrar no sistema operacional para receber compartilhamentos de outros aplicativos instalados. Mas com a API Web Share Target, os aplicativos da web instalados podem se registrar no sistema operacional subjacente como um destino de compartilhamento para receber conteúdo compartilhado.

{% Aside %} A API Web Share Target é apenas metade da mágica. Os aplicativos da web podem compartilhar dados, arquivos, links ou texto usando a API Web Share. Consulte [Web Share API](/web-share/) para saber mais detalhes. {% endAside %}

<figure data-float="right">{% Img src="image/admin/Q4nuOQMpsQrTilpXA3fL.png", alt="Telefone Android com a gaveta 'Compartilhar com' aberta. ", width="400", height="377" %} <figcaption> Selecionador de compartilhamento de nível de sistema com um PWA instalado como uma opção. </figcaption></figure>

## Veja o Web Share Target em ação

1. Usando o Chrome 76 ou posterior para Android, ou Chrome 89 ou posterior no desktop, abra a [demonstração Web Share Target](https://web-share.glitch.me/) .
2. Quando solicitado, clique em **Instalar** para adicionar o aplicativo à tela inicial ou use o menu do Chrome para adicioná-lo à tela inicial.
3. Abra qualquer aplicativo que suporte compartilhamento ou use o botão Compartilhar no aplicativo de demonstração.
4. No seletor de destino, escolha **Web Share Test** .

Após o compartilhamento, você deve ver todas as informações compartilhadas no aplicativo da web de destino para compartilhamento web.

## Registre seu aplicativo como um alvo de compartilhamento

Para registrar seu aplicativo como um alvo de compartilhamento, ele precisa atender aos critérios de [instalabilidade do Chrome](https://developers.google.com/web/fundamentals/app-install-banners/#criteria). Além disso, para que um usuário possa compartilhar com seu aplicativo, ele deve adicioná-lo à tela inicial. Isso evita que os sites se adicionem aleatoriamente ao seletor de intent de compartilhamento do usuário e garante que o compartilhamento seja algo que os usuários desejam fazer com seu aplicativo.

## Atualize o manifesto do seu aplicativo da web

Para registrar seu aplicativo como um alvo de compartilhamento, adicione uma entrada `share_target` [ao manifesto do aplicativo da web](/add-manifest/). Isso informa ao sistema operacional para incluir seu aplicativo como uma opção no seletor de intent. O que você adicionar ao manifesto irá controlar os dados que seu aplicativo irá aceitar. Existem três cenários comuns para a entrada `share_target`

- Aceitando informações básicas
- Aceitando alterações de aplicativo
- Aceitando arquivos

{% Aside %} Você só pode ter um `share_target` por manifesto. Se quiser compartilhar em diferentes lugares em seu aplicativo, forneça isso como uma opção na página de destino do alvo de compartilhamento. {% endAside %}

### Aceitando informações básicas

Se seu aplicativo de destino aceita apenas informações básicas, como dados, links e texto, adicione o seguinte ao arquivo `manifest.json`

```json
"share_target": {
  "action": "/share-target/",
  "method": "GET",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}
```

Se o seu aplicativo já tem um esquema de URL de compartilhamento, você pode substituir os valores de `param` com os seus parâmetros de consulta existentes. Por exemplo, se o seu esquema de URL de compartilhamento usa `body` vez de `text`, você pode substituir `"text": "text"` por `"text": "body"` .

O valor padrão do `method` `"GET"` se não for fornecido. O `enctype`, não mostrado neste exemplo, indica o[tipo de codificação](https://developer.mozilla.org/docs/Web/HTML/Element/form#attr-enctype) dos dados. Para o método `"GET"`, `enctype` tem como padrão `"application/x-www-form-urlencoded"` e é ignorado se for configurado como qualquer outra coisa.

### Aceitando alterações do aplicativo

Se os dados compartilhados alterarem o aplicativo de destino de alguma forma - por exemplo, salvando um marcador no aplicativo de destino - defina o valor `method` `"POST"` e inclua o campo `enctype`. O exemplo abaixo cria um favorito no aplicativo de destino, portanto, usa `"POST"` para `method` e `"multipart/form-data"` para `enctype` :

```json/4-5
{
  "name": "Bookmark",
  "share_target": {
    "action": "/bookmark",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "url": "link"
    }
  }
}
```

### Aceitando arquivos

Tal como acontece com as alterações do aplicativo, aceitar arquivos requer que o `method` seja `"POST"` e que `enctype` esteja presente. Além disso, `enctype` deve ser `"multipart/form-data"` e deve-se adicionar entrada `files`.

Você também deve adicionar uma matriz `files` definindo os tipos de arquivos que seu aplicativo aceita. Os elementos da matriz são entradas com dois membros: um campo `name` e um campo de `accept`. O campo `accept` leva um tipo MIME, uma extensão de arquivo ou uma matriz contendo ambos. É melhor fornecer uma matriz que inclua um tipo MIME e uma extensão de arquivo, pois os sistemas operacionais têm diferentes preferências.

```json/5,10-19
{
  "name": "Aggregator",
  "share_target": {
    "action": "/cgi-bin/aggregate",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "name",
      "text": "description",
      "url": "link",
      "files": [
        {
          "name": "records",
          "accept": ["text/csv", ".csv"]
        },
        {
          "name": "graphs",
          "accept": "image/svg+xml"
        }
      ]
    }
  }
}
```

## Manipulando o conteúdo de entrada

A forma como você lida com os dados compartilhados de entrada deve ser feita de acordo com suas preferências e depende do seu aplicativo. Por exemplo:

- Um cliente de e-mail poderia criar um rascunho de um novo e-mail usando `title` como assunto de um e-mail, com `text` e `url` concatenados como o corpo.
- Um aplicativo de rede social poderia criar um rascunho de uma nova postagem ignorando o `title` , usando o `text` como corpo da mensagem e adicionando `url` como link. Se `text` estiver ausente, o aplicativo também pode usar `url` no corpo. Se o `url` estiver faltando, o aplicativo pode verificar o `text` busca de um URL e adicioná-lo como um link.
- Um aplicativo de compartilhamento de fotos pode criar uma nova apresentação de slides usando `title` como título da apresentação de slides, `text` como descrição e `files` como imagens da apresentação de slides.
- Um aplicativo de mensagens de texto poderia esboçar uma nova mensagem usando `text` e `url` concatenados e descartando o `title` .

### Processando compartilhamentos GET

Se o usuário selecionar seu aplicativo e seu `method` for `"GET"` (o padrão), o navegador abre uma nova janela no URL de `action`. O navegador então gera uma string de consulta usando os valores codificados por URL fornecidos no manifesto. Por exemplo, se o aplicativo de compartilhamento fornecer `title` e `text`, a string de consulta será `?title=hello&text=world`. Para processar isso, use um `DOMContentLoaded` em sua página de primeiro plano e analise a string de consulta:

```js
window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location);
  // searchParams.get() irá lidar apropriadamente com a decodificação dos valores.
  console.log('Title shared: ' + parsedUrl.searchParams.get('title'));
  console.log('Text shared: ' + parsedUrl.searchParams.get('text'));
  console.log('URL shared: ' + parsedUrl.searchParams.get('url'));
});
```

Certifique-se de usar um service worker para [pré-armazenar](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker) em cache a página `action` para que ela carregue rapidamente e funcione de forma confiável, mesmo se o usuário estiver offline. [Workbox](https://developer.chrome.com/docs/workbox/) é uma ferramenta que pode ajudá-lo a [implementar o pré-cache](/precache-with-workbox/) em seu service worker.

### Processando compartilhamentos POST

Se seu `method` for `"POST"` , como seria se seu aplicativo de destino aceitasse um favorito salvo ou arquivos compartilhados, o corpo da solicitação `POST` contém os dados passados pelo aplicativo de compartilhamento, codificados usando o `enctype` informado no manifesto .

A página de primeiro plano não pode processar esses dados diretamente. Como a página vê os dados como uma solicitação, ela os repassa para o service worker, onde você pode interceptá-los com um listener de evento de `fetch`. A partir daqui, você pode passar os dados de volta para a página de primeiro plano usando `postMessage()` ou passá-los para o servidor:

```js
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Se esta for uma solicitação POST de entrada para a
  // URL de "ação" registrada, responda a ela.
  if (event.request.method === 'POST' &&
      url.pathname === '/bookmark') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const link = formData.get('link') || '';
      const responseUrl = await saveBookmark(link);
      return Response.redirect(responseUrl, 303);
    })());
  }
});
```

### Verificando o conteúdo compartilhado

<figure data-float="right">{% Img src="image/admin/hSwbgPk8IFgPC81oJbxZ.png", alt="Um telefone Android exibindo o aplicativo de demonstração com conteúdo compartilhado.", width="400", height="280" %} <figcaption> O aplicativo de destino de compartilhamento de amostra. </figcaption></figure>

Certifique-se de verificar os dados de entrada. Infelizmente, não há garantia de que outros aplicativos compartilharão o conteúdo apropriado no parâmetro certo.

Por exemplo, no Android, o campo [`url` ficará vazio](https://bugs.chromium.org/p/chromium/issues/detail?id=789379) porque não é compatível com o sistema de compartilhamento do Android. Em vez disso, os URLs geralmente aparecem no campo `text` ou, ocasionalmente, no campo `title`.

## Suporte de navegadores

Desde o início de 2021, a API Web Share Target é compatível com:

- Chrome e Edge 76 ou posterior no Android.
- Chrome 89 ou posterior no ChromeOS.

Em todas as plataformas, seu aplicativo da web deve ser [instalado](https://developers.google.com/web/fundamentals/app-install-banners/#criteria) antes de aparecer como um alvo potencial para receber dados compartilhados.

## Aplicativos de amostra

- [Squoosh](https://github.com/GoogleChromeLabs/squoosh)
- [Scrapbook PWA](https://github.com/GoogleChrome/samples/blob/gh-pages/web-share/README.md#web-share-demo)

### Mostrar suporte para a API

Pretende usar a API Web Share Target? Seu apoio público ajuda a equipe do Chromium a priorizar os recursos e mostra a outros fornecedores de navegadores como é fundamental apoiá-los.

Envie um tweet para [@ChromiumDev](https://twitter.com/ChromiumDev) usando a hashtag [`#WebShareTarget`](https://twitter.com/search?q=%23WebShareTarget&src=recent_search_click&f=live) e diga-nos onde e como você está usando a API.
