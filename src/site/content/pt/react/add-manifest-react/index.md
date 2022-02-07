---
layout: post
title: Adicionar um manifesto de aplicativo da web com Create React App
subhead: |2

  Um manifesto de aplicativo da web está incluído em Create React App por padrão e permite que qualquer pessoa instale seu aplicativo React em seu dispositivo.
hero: image/admin/pOjpReVK54kUJP6nZMwn.jpg
date: 2019-04-29
updated: 2021-05-19
description: |2

  Criar aplicativo React inclui um manifesto de aplicativo da web por padrão. Modificando este arquivo

  permitirá que você altere a forma como seu aplicativo é exibido quando instalado em

  dispositivo do usuário.
authors:
  - houssein
---

{% Aside %} Se você não sabe como os arquivos de manifesto do aplicativo da web funcionam, consulte o primeiro o guia [Adicionar um manifesto do aplicativo da web](/add-manifest). {% endAside %}

Criar Aplicativo React (CRA) inclui um manifesto de aplicativo da web por padrão. A modificação deste arquivo permitirá que você altere a forma como seu aplicativo é exibido quando instalado no dispositivo do usuário.

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yra3Y2jPf2tS5ELxJdAK.png", alt = "Um ícone de progressive web app na tela inicial de um telefone celular", width = "317", height = "640"%}</figure>

## Por que isso é útil?

Os arquivos de manifesto do aplicativo da Web fornecem a capacidade de alterar a aparência de um aplicativo instalado na área de trabalho ou dispositivo móvel do usuário. Ao modificar as propriedades no arquivo JSON, você pode modificar uma série de detalhes em seu aplicativo, incluindo:

- Nome
- Descrição
- Ícone do aplicativo
- Cor do tema

A [documentação do MDN](https://developer.mozilla.org/docs/Web/Manifest) cobre todas as propriedades que podem ser alteradas em detalhes.

## Modifique o manifesto padrão

No CRA, um arquivo de manifesto padrão, `/public/manifest.json`, é incluído automaticamente quando um novo aplicativo é criado:

```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

Isso permite que qualquer pessoa instale o aplicativo em seu dispositivo e veja alguns detalhes padrão do aplicativo. O arquivo HTML, `public/index.html` , também inclui um `<link>` para carregar o manifesto.

```html
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```

Aqui está um exemplo de um aplicativo desenvolvido com CRA que possui um arquivo de manifesto modificado:

{% Glitch { id: 'cra-web-app-manifest-defaut', path: 'public/manifest.json', previewSize: 0, height: 480 } %}

Para descobrir se todas as propriedades estão funcionando corretamente neste exemplo:

{% Instruction 'preview' %} {% Instruction 'devtools-application' %}

- No painel do **Aplicativo**, clique na guia **Manifesto.**

{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IpK9fr3O0zEX1GJXq9mw.png", alt = "A guia Manifesto do DevTools mostra as propriedades do arquivo de manifesto do aplicativo.", width = "800", height = "695" %}

## Conclusão

1. Se você estiver construindo um site que você acha que não precisa ser instalado em um dispositivo, remova o manifesto e o `<link>` no arquivo HTML que aponta para ele.
2. Se desejar que os usuários instalem o aplicativo em seus dispositivos, modifique o arquivo de manifesto (ou crie um se não estiver usando o CRA) com as propriedades de sua preferência. A [documentação MDN](https://developer.mozilla.org/docs/Web/Manifest) explica todos os atributos obrigatórios e opcionais.
