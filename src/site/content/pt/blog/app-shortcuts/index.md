---
title: Faça tudo rapidamente com os atalhos de aplicativo
subhead: Os atalhos de aplicativos fornecem acesso rápido a várias ações comuns que os usuários necessitam com frequência.
authors:
  - beaufortfrancois
  - jungkees
date: 2020-05-20
updated: 2020-10-12
hero: image/admin/1ekafMZjtzcd0G3TLQJ4.jpg
alt: Uma foto de um telefone Android mostrando um menu de atalhos de aplicativo
description: Os atalhos de aplicativos fornecem acesso rápido a várias ações comuns que os usuários necessitam com frequência.
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

Para melhorar a produtividade dos usuários e facilitar o reengajamento com as principais tarefas, a plataforma da web agora oferece suporte para atalhos de aplicativos. Eles permitem que os desenvolvedores da web forneçam acesso rápido a várias ações comuns que os usuários precisam com frequência.

Este artigo irá ensiná-lo a definir esses atalhos de aplicativos. Além disso, você aprenderá algumas das melhores práticas associadas.

## Sobre atalhos de aplicativos

Os atalhos de aplicativos ajudam os usuários a iniciar rapidamente tarefas comuns ou recomendadas em seu aplicativo da web. O fácil acesso a essas tarefas de qualquer lugar em que o ícone do aplicativo seja exibido aumentará a produtividade dos usuários e também aumentará seu envolvimento com o aplicativo da web.

O menu de atalhos do aplicativo é invocado clicando com o botão direito no ícone do aplicativo na barra de tarefas (Windows) ou dock (macOS) na área de trabalho do usuário, ou mantendo pressionado o ícone do iniciador do aplicativo no Android.

<figure>{% Img src = "image/admin/F4TsJNfRJNJSt2ZpqVAy.png", alt = "Captura de tela de um menu de atalhos de aplicativo aberto no Android", width = "800", height = "420"%}<figcaption> Menu de atalhos do aplicativo aberto no Android</figcaption></figure>

<figure>{% Img src = "image/admin/RoF6k7Aw6WNvaEcsgIcb.png", alt = "Captura de tela de um menu de atalhos de aplicativo aberto no Windows", width = "800", height = "420"%}<figcaption> Menu de atalhos do aplicativo aberto no Windows</figcaption></figure>

O menu de atalhos do aplicativo é mostrado apenas para [Progressive Web Apps](/progressive-web-apps/) instalados na área de trabalho ou dispositivo móvel do usuário. Confira [O que é necessário para ser instalável?](/install-criteria/) para aprender sobre os requisitos de instalabilidade.

Cada atalho de aplicativo expressa uma intenção do usuário, cada uma delas associada a um URL dentro do [escopo](/add-manifest/#scope) de seu aplicativo da web. O URL é aberto quando os usuários ativam o atalho do aplicativo. Exemplos de atalhos de aplicativos incluem o seguinte:

- Itens de navegação de nível superior (por exemplo, home, linha do tempo, pedidos recentes)
- Procurar
- Tarefas de entrada de dados (por exemplo, redigir um e-mail ou tweet, adicionar um recibo)
- Atividades (por exemplo, iniciar um bate-papo com os contatos mais populares)

{% Aside %} Muito obrigado ao pessoal do Microsoft Edge e da Intel por projetar e padronizar os atalhos de aplicativos. O Chrome depende de uma comunidade de parceiros trabalhando juntos para levar o projeto Chromium adiante. Nem todo parceiro do Chromium é um Googler, e esses colaboradores merecem um reconhecimento especial! {% endAside %}

## Defina os atalhos do aplicativo no manifesto do aplicativo da web

Os atalhos do aplicativo são definidos opcionalmente no [manifesto do aplicativo](/add-manifest) da web, um arquivo JSON que informa o navegador sobre o seu Progressive Web App e como ele deve se comportar quando instalado na área de trabalho ou dispositivo móvel do usuário. Mais especificamente, eles são declarados no membro da matriz de `shortcuts`. Abaixo está um exemplo de um manifesto de aplicativo da web potencial.

```json
{
  "name": "Player FM",
  "start_url": "https://player.fm?utm_source=homescreen",
  …
  "shortcuts": [
    {
      "name": "Open Play Later",
      "short_name": "Play Later",
      "description": "View the list of podcasts you saved for later",
      "url": "/play-later?utm_source=homescreen",
      "icons": [{ "src": "/icons/play-later.png", "sizes": "192x192" }]
    },
    {
      "name": "View Subscriptions",
      "short_name": "Subscriptions",
      "description": "View the list of podcasts you listen to",
      "url": "/subscriptions?utm_source=homescreen",
      "icons": [{ "src": "/icons/subscriptions.png", "sizes": "192x192" }]
    }
  ]
}
```

Cada membro da `shortcuts` é um dicionário que contém pelo menos um `name` e um `url` . Outros membros são opcionais.

### nome

O rótulo legível para o atalho do aplicativo quando exibido para o usuário.

### short_name (opcional)

O rótulo legível por humanos usado onde o espaço é limitado. É recomendável fornecê-lo, embora seja opcional.

### Descrição (opcional)

A finalidade legível para o atalho do aplicativo. Não é usado no momento da redação, mas pode ser exposta à tecnologia assistiva no futuro.

### url

O URL aberto quando um usuário ativa o atalho do aplicativo. Este URL deve existir dentro do escopo do manifesto do aplicativo da web. Se for um URL relativo, o URL base será o URL do manifesto do aplicativo da web.

### ícones (opcional)

Uma matriz de objetos de recursos de imagem. Cada objeto deve incluir o `src` e uma propriedade `sizes`. Ao contrário [dos ícones de manifesto do aplicativo da web](/add-manifest/#icons) , o `type` de imagem é opcional.

Arquivos SVG não são suportados no momento da escrita, use PNG em seu lugar.

Se desejar ícones perfeitos em pixels, forneça-os em incrementos de 48 dp (ou seja, ícones de 36x36, 48x48, 72x72, 96x96, 144x144, 192x192 pixels). Caso contrário, é recomendável usar um único ícone de 192x192 pixels.

Como medida de qualidade, os ícones devem ter pelo menos metade do tamanho ideal do dispositivo no Android, que é 48 dp. Por exemplo, para exibir em uma [tela xxhdpi](https://developer.android.com/training/multiscreen/screendensities#TaskProvideAltBmp) , o ícone deve ter pelo menos 72 por 72 pixels. (Isso é derivado da [fórmula para converter](https://developer.android.com/training/multiscreen/screendensities#dips-pels) unidades dp em unidades de pixel.)

## Teste os atalhos do seu aplicativo

Para verificar se os atalhos do seu aplicativo estão configurados corretamente, use o **painel Manifesto** no painel **Aplicativo** do DevTools.

<figure>{% Img src = "image/admin/rEL0r8lEfYHlsj0ylLSL.png", alt = "Captura de tela dos atalhos do aplicativo no DevTools", width = "800", height = "534"%}<figcaption> Atalhos de aplicativos mostrados no DevTools</figcaption></figure>

Este painel fornece uma versão legível, por humanos, de muitas das propriedades do seu manifesto, incluindo atalhos de aplicativos. Isso torna mais fácil verificar se todos os ícones de atalho, se fornecidos, estão carregando corretamente.

Os atalhos do aplicativo podem não estar disponíveis imediatamente para todos os usuários porque as atualizações do Progressive Web App são limitadas a uma vez por dia. Saiba mais sobre [como o Chrome lida com as atualizações do manifesto do aplicativo da web](/manifest-updates) .

## Melhores Práticas

### Ordenar atalhos de aplicativos por prioridade

Recomendamos que você ordene os atalhos de aplicativos por prioridade, com os atalhos de aplicativos mais críticos aparecendo primeiro na `shortcuts` pois o limite do número de atalhos de aplicativos exibidos varia de acordo com a plataforma. O Chrome e o Edge no Windows, por exemplo, limitam o número de atalhos de aplicativos a 10, enquanto o Chrome para Android leva apenas os primeiros 4 atalhos de aplicativos em consideração.

{% Aside %} Chrome 92 para Android 7 agora permite apenas 3 atalhos de aplicativos. Um atalho para as configurações do site foi adicionado, tomando um dos slots de atalho disponíveis para o aplicativo. {% endAside %}

### Use nomes de atalhos de aplicativos distintos

Você não deve confiar em ícones para diferenciar os atalhos de aplicativos, pois eles nem sempre estão visíveis. Por exemplo, o macOS não oferece suporte a ícones no menu de atalhos do dock. Use nomes distintos para cada atalho de aplicativo.

### Medir o uso de atalhos de aplicativos

Você deve anotar as `url` de atalhos do aplicativo como faria com `start_url` para fins analíticos (por exemplo, `url: "/my-shortcut?utm_source=homescreen"` ).

## Suporte de navegador

Os atalhos de aplicativos estão disponíveis no Android (Chrome 84), Windows (Chrome 85 e Edge 85), ChromeOS (Chrome 92), macOS e Linux (Chrome 96 e Edge 96).

<figure>{% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/6KgvySxUcryuD0gwXa0u.png", alt="Captura de tela de um menu de atalhos de aplicativo aberto no ChromeOS", width="800", height="450" %}<figcaption> Menu de atalhos do aplicativo aberto no ChromeOS</figcaption></figure>

## Suporte para atividades confiáveis na web

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) , a ferramenta recomendada para construir aplicativos Android que usam [Atividade da Web confiável](/using-a-pwa-in-your-android-app/) , lê os atalhos do aplicativo a partir do manifesto do aplicativo da web e gera automaticamente a configuração correspondente para o aplicativo Android. Observe que os ícones para atalhos de aplicativos são [obrigatórios](https://github.com/GoogleChromeLabs/bubblewrap/issues/116) e devem ter pelo menos 96 por 96 pixels no Bubblewrap.

[O PWABuilder](https://www.pwabuilder.com/) , uma ótima ferramenta para transformar facilmente um Progressive Web App em uma Atividade da Web Confiável, oferece suporte a atalhos de aplicativos com algumas [ressalvas](https://github.com/pwa-builder/CloudAPK/issues/25) .

Para os desenvolvedores que integram a Atividade da Web confiável manualmente em seu aplicativo [Android, os atalhos do aplicativo Android](https://developer.android.com/guide/topics/ui/shortcuts) podem ser usados para implementar os mesmos comportamentos.

## Amostra

<figure>
  <video controls autoplay loop muted src="https://storage.googleapis.com/web-dev-assets/app-shortcuts/app-shortcuts-recording.mp4">
  </video></figure>

Confira o [exemplo de atalhos](https://app-shortcuts.glitch.me) do aplicativo e sua [fonte](https://glitch.com/edit/#!/app-shortcuts) .

{% Glitch { id: 'app-shortcuts', path: 'public/manifest.json', height: 480 } %}

## Links úteis

- [Explicador](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Shortcuts/explainer.md)
- [Spec](https://w3c.github.io/manifest/#shortcuts-member)
- [Amostra de atalhos do aplicativo](https://app-shortcuts.glitch.me) | [Fonte de amostra de atalhos de aplicativos](https://glitch.com/edit/#!/app-shortcuts)
- [Bug de rastreamento](https://bugs.chromium.org/p/chromium/issues/detail?id=955497)
- [Entrada ChromeStatus.com](https://chromestatus.com/feature/5706099464339456)
- Componente Blink: [`UI>Browser>WebAppInstalls`](https://crbug.com/?q=component:UI%3EBrowser%3EWebAppInstalls)
