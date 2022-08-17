---
title: Faça com que os aplicativos da web instalados se tornem gerenciadores de arquivos
subhead: Registre um aplicativo como um gerenciador de arquivos com o sistema operacional.
authors:
  - thomassteiner
Description: |2-

  Registre um aplicativo como um gerenciador de arquivos com o sistema operacional

  e abra arquivos com o aplicativo adequado.
date: 2020-10-22
updated: 2021-12-03
tags:
  - blog
  - capabilities
hero: image/admin/tf0sUZX6G7AM8PvU1t0B.jpg
alt: Fichários em várias cores.
---

{% Aside %} A API de Gerenciamento de Arquivos faz parte do [projeto de recursos](https://developer.chrome.com/blog/fugu-status/) e está atualmente em desenvolvimento. Esta postagem será atualizada conforme o andamento da implementação. {% endAside %}

Agora que os aplicativos da web são [capazes de ler e gravar arquivos](/file-system-access/) , a próxima etapa lógica é permitir que os desenvolvedores declarem esses mesmos aplicativos da web como gerenciadores de arquivos para os arquivos que seus aplicativos podem criar e processar. A API de gerenciamento de arquivos permite que você faça exatamente isso. Depois de registrar um aplicativo de editor de texto como um gerenciador de arquivos e depois de instalá-lo, você pode clicar com o botão direito em um arquivo `.txt` no macOS e selecionar "Obter informações" para instruir o sistema operacional de que ele deve sempre abrir arquivos `.txt` com este aplicativo como padrão .

### Casos de uso sugeridos para a API de gerenciamento de arquivos {: # use-cases}

Exemplos de sites que podem usar essa API incluem:

- Aplicativos de escritório como editores de texto, aplicativos de planilhas e criadores de apresentações de slides.
- Editores gráficos e ferramentas de desenho.
- Ferramentas de edição de níveis de videogames.

## Status atual {: #status}

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Etapa</th>
<th data-md-type="table_cell">Status</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Criação de um explicador</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/file-handling/blob/main/explainer.md" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Criação da versão preliminar das especificações</td>
<td data-md-type="table_cell">Não foi iniciado</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Coleta de feedback e iteração do design</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Em progresso</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Teste de origem</td>
<td data-md-type="table_cell">Completo</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Lançamento</td>
<td data-md-type="table_cell">Não foi iniciado</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Como usar a API de gerenciamento de arquivos {: #use}

### Ativando via about: // flags

Para testar a API de gerenciamento de arquivos localmente, sem um token de teste de origem, habilite o sinalizador `#file-handling-api` em `about://flags` .

### Aprimoramento progressivo

A API de gerenciamento de arquivos por si só não permite polyfill. A funcionalidade de abrir arquivos com um aplicativo da web, no entanto, pode ser obtida por dois outros meios:

- A [API de destino de compartilhamento da web](/web-share-target/) permite que os desenvolvedores especifiquem seu aplicativo como um destino de compartilhamento para que os arquivos possam ser abertos a partir da planilha de compartilhamento do sistema operacional.
- A [API de acesso ao sistema de arquivos](/file-system-access/) pode ser integrada à função de arrastar e soltar arquivos, para que os desenvolvedores possam processar arquivos soltos no aplicativo já aberto.

### Detecção de recursos

Para verificar se a API gerenciamento de arquivos é compatível, use:

```javascript
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  // The File Handling API is supported.
}
```

{% Aside %} O gerenciamento de arquivos está atualmente limitado a sistemas operacionais de desktop. {% endAside %}

### A parte declarativa da API de gerenciamento de arquivos

Como uma primeira etapa, os aplicativos da web precisam descrever declarativamente em seu [manifesto do aplicativo da web](/add-manifest/) que tipo de arquivos eles podem gerenciar. A API de gerenciamento de arquivos estende o manifesto do aplicativo da web com uma nova propriedade chamada `"file_handlers"` que aceita uma matriz de, bem, gerenciadores de arquivo. Um gerenciador de arquivo é um objeto com duas propriedades:

- Uma propriedade `"action"` que aponta para um URL dentro do escopo do aplicativo como seu valor.
- Uma propriedade `"accept"` com um objeto de tipo MIME como chaves e listas de extensões de arquivo como seus valores.
- Uma propriedade `"icons"` com uma matriz de ícones [`ImageResource`](https://www.w3.org/TR/image-resource/). Alguns sistemas operacionais permitem que uma associação de tipo de arquivo exiba um ícone que não é apenas o ícone do aplicativo associado, mas um ícone especial relacionado ao uso desse tipo de arquivo com o aplicativo.

O exemplo abaixo, mostrando apenas o trecho relevante do manifesto do aplicativo da web, deve deixar isso mais claro:

```json
{
  "file_handlers": [
    {
      "action": "/open-csv",
      "accept": {
        "text/csv": [".csv"]
      },
      "icons": [
        {
          "src": "csv-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    },
    {
      "action": "/open-svg",
      "accept": {
        "image/svg+xml": ".svg"
      },
      "icons": [
        {
          "src": "svg-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    },
    {
      "action": "/open-graf",
      "accept": {
        "application/vnd.grafr.graph": [".grafr", ".graf"],
        "application/vnd.alternative-graph-app.graph": ".graph"
      },
      "icons": [
        {
          "src": "graf-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    }
  ]
}
```

Isso é para um aplicativo hipotético que processa arquivos `.csv` de valores separados por vírgula em `/open-csv` , arquivos de gráficos vetoriais escaláveis ( `.svg` em `/open-svg` e um formato de arquivo Grafr inventado com `.grafr` , `.graf` ou `.graph` como a extensão em `/open-graf` .

{% Aside %} Para que esta declaração tenha efeito, o aplicativo deve estar instalado. Você pode aprender mais em uma série de artigos neste mesmo site sobre como [tornar seu aplicativo instalável](/progressive-web-apps/#installable) . {% endAside %}

### A parte fundamental da API de gerenciamento de arquivos

Agora que o aplicativo declarou quais arquivos ele pode teoricamente gerenciar em qual URL em escopo, ele precisa imperativamente fazer algo com os arquivos de entrada na prática. É aqui que o `launchQueue` entra em ação. Para acessar os arquivos iniciados, um site precisa especificar um consumidor para o objeto `window.launchQueue`. Os lançamentos são enfileirados até serem tratados pelo consumidor especificado, que é chamado exatamente uma vez para cada lançamento. Dessa forma, todo lançamento é realizado, independentemente de quando o consumidor foi especificado.

```js
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  launchQueue.setConsumer((launchParams) => {
    // Nothing to do when the queue is empty.
    if (!launchParams.files.length) {
      return;
    }
    for (const fileHandle of launchParams.files) {
      // Handle the file.
    }
  });
}
```

### Suporte para DevTools

Não havia suporte para DevTools no momento em que este artigo foi redigido, mas preenchi uma [solicitação de recurso](https://bugs.chromium.org/p/chromium/issues/detail?id=1130552) para que o suporte seja adicionado.

## Demo

Adicionei suporte para o gerenciamento de arquivos ao [Excalidraw](https://excalidraw.com/) , um aplicativo de desenho ao estilo cartoon. Para testá-lo, primeiro você precisa instalar o Excalidraw. Ao criar um arquivo com ele e armazená-lo em algum lugar do sistema de arquivos, você pode abrir o arquivo com um clique duplo ou com o botão direito e selecionar "Excalidraw" no menu de contexto. Você pode verificar a [implementação](https://github.com/excalidraw/excalidraw/search?q=launchqueue&type=code) no código-fonte.

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMh8Qev0XdwgIx7jJlP5.png", alt = "A janela do localizador do macOS com um arquivo Excalidraw.", width = "800", height = "422" %}<figcaption> Clique duas vezes ou clique com o botão direito em um arquivo no explorador de arquivos do seu sistema operacional.</figcaption></figure>

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wCNbMl6kJ11XziG3LO65.png", alt = "O menu de contexto que aparece ao clicar com o botão direito em um arquivo com o item 'Abrir com… Excalidraw'.", width = "488", height = " 266 " %}<figcaption> Excalidraw é o gerenciador de arquivos padrão para arquivos <code>.excalidraw</code></figcaption>.</figure>

## Segurança

A equipe do Chrome projetou e implementou a API de gerenciamento de arquivos usando os princípios básicos definidos em [Controle de acesso a recursos poderosos da plataforma da Web](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md) , incluindo controle do usuário, transparência e ergonomia.

## Permissões, persistência de permissões e atualizações do gerenciador de arquivos

Para garantir a confiança do usuário e a segurança dos seus arquivos quando a API gerenciador de arquivos é usada para abrir um arquivo, um prompt de permissão será exibido antes que um PWA possa visualizar um arquivo. Este prompt de permissão será exibido logo após o usuário selecionar o PWA para abrir um arquivo, de forma que a permissão seja rigorosamente associada à ação de abrir um arquivo usando o PWA, tornando-o mais compreensível e relevante.

Essa permissão será exibida toda vez, até que o usuário clique em **Permitir** ou **Bloquear** o gerenciamento de arquivos para o site ou ignorar o prompt três vezes (após o qual o Chromium embargará e bloqueará essa permissão). A configuração selecionada será mantida com o fechamento e reabertura do PWA.

Quando atualizações e mudanças de manifesto na seção `"file_handlers"` forem detectadas, as permissões serão redefinidas.

### Desafios relacionados a arquivos

Há uma grande categoria de vetores de ataque que se abrem ao permitir que sites acessem arquivos. Eles são descritos no [artigo sobre API de acesso ao sistema de arquivos](/file-system-access/#security-considerations) . O recurso adicional relacionado à segurança que a API de gerenciamento de arquivos proporciona para a API de acesso ao sistema de arquivos é a capacidade de conceder acesso a determinados arquivos por meio da IU integrada do sistema operacional, em vez de por meio de um seletor de arquivos exibido por um aplicativo da web.

Ainda existe o risco de que os usuários possam conceder acidentalmente o acesso a um aplicativo da Web para um arquivo, ao abri-lo. No entanto, geralmente se entende que a abertura de um arquivo permite que o aplicativo com o qual foi aberto leia e / ou gerencie esse arquivo. Portanto, a escolha explícita do usuário de abrir um arquivo em um aplicativo instalado, como por meio de um menu de contexto "Abrir com …", pode ser lida como um sinal suficiente de confiança no aplicativo.

### Desafios do gerenciador padrão

A exceção é quando não há aplicativos no sistema anfitrião para um determinado tipo de arquivo. Nesse caso, alguns sistemas operacionais anfitriões podem promover automaticamente o gerenciador recém registrado para gerenciador padrão para esse tipo de arquivo, de forma silenciosa e sem nenhuma intervenção do usuário. Isso significa que, se o usuário clicar duas vezes em um arquivo desse tipo, ele será aberto automaticamente no aplicativo da web registrado. Em tais sistemas operacionais anfitriões, quando o agente do usuário determina que não há um gerenciador padrão existente para o tipo de arquivo, um prompt de permissão explícito pode ser necessário a fim de evitar o envio acidental do conteúdo de um arquivo para um aplicativo da web sem o consentimento do usuário.

### Controle do usuário

A especificação afirma que os navegadores não devem registrar todos os sites que podem gerenciar arquivos como um gerenciador. Em vez disso, o registro de gerenciamento de arquivo deve ser bloqueado por trás da instalação e nunca acontecer sem a confirmação explícita do usuário, especialmente caso um site se torne o gerenciador padrão. Em vez de sequestrar extensões existentes como `.json` para as quais o usuário provavelmente já tem um gerenciador padrão registrado, os sites devem considerar a criação de suas próprias extensões.

### Transparência

Todos os sistemas operacionais permitem que os usuários alterem as associações de arquivos presentes. Isso está fora do escopo do navegador.

## Feedback {: #feedback}

A equipe do Chrome deseja saber mais sobre suas experiências com a API gerenciamento de arquivos.

### Conte-nos sobre o design da API

Existe algo na API que não funciona como você esperava? Ou faltam métodos ou propriedades de que você precisa para implementar sua ideia? Você tem uma pergunta ou comentário sobre o modelo de segurança?

- Registre um problema de especificação no [repositório GitHub](https://github.com/WICG/file-handling/issues) correspondente ou acrescente suas ideias a um problema existente.

### Comunicar um problema com a implementação

Você encontrou um bug com a implementação do Chrome? Ou a implementação é diferente da especificação?

- Registre um bug em [new.crbug.com](https://new.crbug.com). Inclua o máximo de detalhes que puder, instruções simples para reprodução e insira `UI>Browser>WebAppInstalls>FileHandling` na caixa **Componentes**. [Glitch](https://glitch.com/) funciona muito bem para compartilhar reproduções rápidas e fáceis.

### Mostre suporte para a API

Você pretende usar a API de gerenciamento de arquivos? Seu suporte público ajuda a equipe do Chrome a priorizar os recursos e mostra a outros fornecedores de navegadores como é fundamental apoiá-los.

- Compartilhe como você planeja usá-lo no [tópico de WICG Discourse](https://discourse.wicg.io/t/proposal-ability-to-register-file-handlers/3084).
- Envie um tweet para [@ChromiumDev](https://twitter.com/ChromiumDev) usando a hashtag [`#FileHandling`](https://twitter.com/search?q=%23FileHandling&src=typed_query&f=live) e diga-nos onde e como você está usando-a.

## Links úteis {: #helpful}

- [Explicador público](https://github.com/WICG/file-handling/blob/main/explainer.md)
- [Demonstração da API de gerenciamento de arquivos](https://excalidraw.com/) | [Fonte de demonstração da API de gerenciamento de arquivos](https://github.com/excalidraw/excalidraw/search?q=launchqueue&type=code)
- [Bug de rastreamento do Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=829689)
- [Entrada ChromeStatus.com](https://chromestatus.com/feature/5721776357113856)
- Componente Blink: [`UI>Browser>WebAppInstalls>FileHandling`](https://bugs.chromium.org/p/chromium/issues/list?q=component:UI%3EBrowser%3EWebAppInstalls%3EFileHandling)
- [Revisão de TAG](https://github.com/w3ctag/design-reviews/issues/371)
- [Posição dos padrões da Mozilla](https://github.com/mozilla/standards-positions/issues/158)

## Reconhecimentos

A API de gerenciamento de arquivos foi especificada por [Eric Willigers](https://github.com/ericwilligers) , [Jay Harris](https://github.com/fallaciousreasoning) e [Raymes Khoury](https://github.com/raymeskhoury) . Este artigo foi revisado por [Joe Medley](https://github.com/jpmedley) .
