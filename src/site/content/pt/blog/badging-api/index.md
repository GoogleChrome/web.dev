---
title: Emblema para ícones de aplicativos
subhead: A App Badging API permite que os aplicativos da web instalados definam um emblema para todo o aplicativo no ícone do aplicativo.
authors:
  - petelepage
description: A API App Badging permite que os aplicativos da web instalados definam um emblema para todo o aplicativo, mostrado em um local específico do sistema operacional associado ao aplicativo, como a tela de notificações ou a tela inicial. Os emblemas tornam mais fácil notificar sutilmente o usuário de que há alguma atividade nova que pode exigir sua atenção ou podem ser usados para indicar uma pequena quantidade de informações, como uma contagem não lida.
date: 2018-12-11
updated: 2021-02-23
tags:
  - blog
  - capabilities
  - progressive-web-apps
  - notifications
hero: image/admin/AFvb0uBtN7ZX9qToptEo.jpg
alt: Sinal de néon com coração e zero
feedback:
  - api
---

## O que é a App Badging API? {: #what }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/t7XqI06whZr4oJe0yawc.jpg", alt="Exemplo de Twitter com oito notificações e outro aplicativo mostrando um emblema do tipo flag.", width="600", height="189" %}<figcaption> Exemplo de Twitter com oito notificações e outro aplicativo mostrando um emblema do tipo flag.</figcaption></figure>

A API App Badging permite que os aplicativos da web instalados definam um emblema para todo o aplicativo, mostrado em um local específico do sistema operacional associado ao aplicativo (como a tela de notificações ou tela inicial).

Os emblemas tornam mais fácil notificar sutilmente o usuário de que há uma nova atividade que pode exigir sua atenção ou indicar uma pequena quantidade de informações, como uma contagem não lida.

Os emblemas tendem a ser mais amigáveis do que as notificações e podem ser atualizados com uma frequência muito maior, pois não interrompem o usuário. E, como não interrompem o usuário, não precisam da permissão do mesmo.

### Possíveis casos de uso {: #use-cases }

Exemplos de sites que podem usar essa API incluem:

- Bate-papo, e-mail e aplicativos sociais, para sinalizar que novas mensagens chegaram ou para mostrar o número de itens não lidos.
- Aplicativos de produtividade, para sinalizar que uma tarefa em segundo plano de longa execução (como renderizar uma imagem ou vídeo) foi concluída.
- Jogos, para sinalizar que uma ação do jogador é necessária (por exemplo, no xadrez, quando é a vez do jogador).

## Status atual {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Degrau</th>
<th data-md-type="table_cell">Status</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crie um explicador</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/badging/blob/master/explainer.md" data-md-type="link" class="">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crie o rascunho inicial das especificações</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/badging/" data-md-type="link" class="">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Reúna feedback e repita o design</td>
<td data-md-type="table_cell">Completo</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Teste de origem</td>
<td data-md-type="table_cell">Completo</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Lançamento</strong></td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">Completo</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

A App Badging API funciona no Windows e macOS, no Chrome 81 ou posterior. Também foi confirmado que funciona no Edge 84 ou posterior. O suporte para o ChromeOS está em desenvolvimento e estará disponível em uma versão futura do Chrome. No Android, a Badging API não é compatível. Em vez disso, o Android mostra automaticamente um emblema no ícone do aplicativo para o aplicativo da web instalado quando há uma notificação não lida, assim como para aplicativos Android.

## Tente

1. Usando o Chrome 81 ou posterior no Windows ou Mac, abra a [demonstração da API App Badging](https://badging-api.glitch.me/) .
2. Quando solicitado, clique em **Instalar** para instalar o aplicativo ou use o menu do Chrome para instalá-lo.
3. Abra-o como um PWA instalado. Observe que ele deve ser executado como um PWA instalado (na barra de tarefas ou dock).
4. Clique no botão **Definir** ou **Limpar** para definir ou limpar o emblema do ícone do aplicativo. Você também pode fornecer um número para o *valor do emblema*.

## Como usar a App Badging API {: #use }

Para usar a API App Badging, seu aplicativo da web precisa atender aos [critérios de instalação do Chrome](/install-criteria/#criteria) e os usuários devem adicioná-lo às telas iniciais.

A Badge API consiste em dois métodos no `navigator`:

- `setAppBadge(` *`number`* `)`: define o emblema do aplicativo. Se um valor for fornecido, defina o emblema com o valor fornecido, caso contrário, exiba um ponto branco simples (ou outro sinalizador conforme apropriado para a plataforma). Definir o *`number`* como `0` é o mesmo que chamar `clearAppBadge()`.
- `clearAppBadge()` : Remove o emblema do aplicativo.

Ambos retornam valores vazios que você pode usar para tratamento de erros.

O emblema pode ser definido a partir da página atual ou do service worker registrado. Para definir ou limpar o emblema (na página de primeiro plano ou no service worker), chame:

```js
// Define o emblema
const unreadCount = 24;
navigator.setAppBadge(unreadCount).catch((error) => {
  //Faça alguma coisa com o erro.
});

// Limpe o emblema
navigator.clearAppBadge().catch((error) => {
  // Faça alguma coisa com o erro.
});
```

Em alguns casos, o SO pode não permitir a representação exata do emblema. Nesses casos, o navegador tentará fornecer a melhor representação para esse dispositivo. Por exemplo, como a Badging API não é compatível com Android, o Android só mostra um ponto em vez de um valor numérico.

Não presuma nada sobre como o agente do usuário exibe o emblema. Alguns agentes de usuário podem pegar um número como "4000" e regravá-lo como "99+". Se você mesmo saturar o emblema (por exemplo, definindo-o para "99"), o "+" não aparecerá. Não importa o número real, apenas chame `setAppBadge(unreadCount)` e deixe o agente do usuário lidar com a exibição de acordo.

Embora a App Badging API *no Chrome* exija um aplicativo instalado, você não deve fazer chamadas para a API de emblemas dependendo do estado da instalação. Basta chamar a API quando ela existir, pois outros navegadores podem mostrar o emblema em outros locais. Se funcionar, funciona. Do contrário, simplesmente não funciona.

## Definir e limpar o emblema em segundo plano de um service worker

Você também pode definir o emblema do aplicativo em segundo plano usando o service worker, permitindo que sejam atualizados mesmo quando o aplicativo não estiver aberto. Faça isso por meio da API Push, sincronização periódica em segundo plano ou uma combinação de ambos.

### Sincronização periódica em segundo plano

[A sincronização periódica em segundo plano](/periodic-background-sync/) permite a um service worker sondar periodicamente o servidor, que pode ser usado para obter um status atualizado, e chamar `navigator.setAppBadge()`.

No entanto, a frequência com que a sincronização é chamada não é perfeitamente confiável e fica a critério do navegador.

### API Web Push

A [API Push](https://www.w3.org/TR/push-api/) permite que os servidores enviem mensagens para service workers, que podem executar código JavaScript mesmo quando nenhuma página de primeiro plano está sendo executada. Portanto, um push de servidor pode atualizar o emblema chamando `navigator.setAppBadge()`.

No entanto, a maioria dos navegadores, incluindo o Chrome, exige que uma notificação seja exibida sempre que uma mensagem push for recebida. Isso é bom para alguns casos de uso (por exemplo, mostrar uma notificação ao atualizar o emblema), mas torna impossível atualizar sutilmente o emblema sem exibir uma notificação.

Além disso, os usuários devem conceder permissão de notificação ao seu site para receber mensagens push.

### Uma combinação de ambos

Embora não seja perfeito, usar a API Push e a sincronização periódica em segundo plano fornecem uma boa solução. As informações de alta prioridade são fornecidas por meio da API Push, mostrando uma notificação e atualizando o emblema. E as informações de prioridade mais baixa são entregues atualizando o emblema, seja quando a página é aberta ou por meio de sincronização periódica em segundo plano.

### O futuro

A equipe do Chrome está investigando maneiras de [atualizar o app badge em segundo plano](https://github.com/w3c/badging/blob/master/explainer.md#background-updates) de forma mais confiável e deseja ouvir você. Informe-os sobre o que funciona melhor para o seu caso de uso, comentando sobre o problema de [Atualizações em Segundo Plano de Notificação](https://github.com/w3c/badging/issues/28).

## Feedback {: #feedback }

A equipe do Chrome quer saber sobre suas experiências com a API App Badging.

### Conte-nos sobre o design da API

Existe algo na API que não funciona como você esperava? Ou faltam métodos ou propriedades de que você precisa para implementar sua ideia? Você tem alguma pergunta ou comentário sobre o modelo de segurança?

- Registre um problema de especificação no [repositório Badging API GitHub](https://github.com/WICG/badging/issues) ou adicione suas ideias a um problema existente.

### Comunicar um problema com a implementação

Você encontrou um bug com a implementação do Chrome? Ou a implementação é diferente da especificação?

- Registre um bug em [https://new.crbug.com](https://new.crbug.com). Certifique-se de incluir o máximo de detalhes possível, instruções simples para reproduzir e definir **Componentes** para `UI>Browser>WebAppInstalls`. [Glitch](https://glitch.com) funciona muito bem para compartilhar reproduções rápidas e fáceis.

### Mostrar suporte para a API

Está planejando usar a API App Badging em seu site? Seu suporte público ajuda a equipe do Chrome a priorizar os recursos e mostra a outros fornecedores de navegadores como é fundamental apoiá-los.

- Envie um tweet para [@ChromiumDev](https://twitter.com/chromiumdev) usando a hashtag [`#BadgingAPI`](https://twitter.com/search?q=%23BadgingAPI&src=typed_query&f=live) e diga-nos onde e como você a está usando.

## Links úteis {: #helpful}

- [Explicador Público](https://github.com/WICG/badging/blob/master/explainer.md)
- [Demonstração da Badging API](https://badging-api.glitch.me/) | [Fonte de demonstração da Badging API](https://glitch.com/edit/#!/badging-api?path=demo.js)
- [Rastreamento de bug](https://bugs.chromium.org/p/chromium/issues/detail?id=719176)
- [Entrada do ChromeStatus.com](https://www.chromestatus.com/feature/6068482055602176)
- Componente Blink: `UI>Browser>WebAppInstalls`

[Foto](https://unsplash.com/photos/xv7-GlvBLFw) do herói por [Prateek Katyal](https://unsplash.com/@prateekkatyal) no [Unsplash](https://unsplash.com/)
