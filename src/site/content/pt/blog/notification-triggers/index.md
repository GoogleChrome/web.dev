---
title: Acionadores de notificação
subhead: Os acionadores de notificação permitem que você agende notificações locais que não requerem uma conexão de rede, o que os torna ideais para casos de uso como aplicações de calendário.
authors:
  - thomassteiner
description: A API dos acionadores de notificação permite aos desenvolvedores agendar notificações locais que não requerem uma conexão de rede, o que os torna ideais para casos de uso como aplicativos de calendário.
date: 2019-10-24
updated: 2021-12-03
hero: image/admin/6ZuVN2HFiIqTVrmjN5XC.jpg
hero_position: Centro
tags:
  - blog
  - capabilities
feedback:
  - api
---

{% Aside 'warning' %} O desenvolvimento da API dos acionadores de notificação, parte do [projeto de recursos](https://developer.chrome.com/blog/capabilities/) do Google, não é mais buscado. O cenário de notificação entre os sistemas operacionais está se movendo com bastante rapidez e não está claro se seríamos capazes de fornecer uma experiência sólida, consistente e confiável entre as plataformas.

Além disso, para criar uma boa experiência, é necessário que haja um mecanismo que consiga eliminar notificações programadas obsoletas ou invalidadas, por exemplo, eventos de calendário cancelados, sem depender da aba estar aberta. Ouvimos comentários de que a frequência com que a <a href="/periodic-background-sync/">sincronização periódica em segundo plano</a> pode ser usada não é suficiente para isso e que, por ser obrigada a mostrar uma notificação, a API Push também não é uma boa solução. {% endAside %}

## O que são acionadores de notificação? {: #what }

Os desenvolvedores da web podem exibir notificações usando a [API de notificações da web](https://www.w3.org/TR/notifications/). Esse recurso é frequentemente usado com a [API Push](https://w3c.github.io/push-api/) para informar o usuário sobre informações urgentes, como notícias de última hora ou mensagens recebidas. As notificações são mostradas executando o JavaScript no dispositivo do usuário.

O problema com a API Push é que ela não é confiável para acionar notificações que *devem* ser mostradas quando uma determinada condição, como hora ou local, é atendida. Um exemplo de *condição com base no tempo* é uma notificação de calendário que o lembra de uma reunião importante com seu chefe às 14h. Um exemplo de *condição baseada em localização* é uma notificação que o lembra de comprar leite quando você entra nas proximidades de sua mercearia. A conectividade de rede ou recursos de preservação de bateria, como o modo doze, podem atrasar a entrega de notificações em push.

Os acionadores de notificação resolvem esse problema permitindo que você agende notificações com sua condição do acionador com antecedência, de modo que o sistema operacional entregue a notificação no momento certo, mesmo se não houver conectividade de rede ou se o dispositivo estiver no modo de economia de bateria.

{% Aside %} Por enquanto, o Chrome só oferece suporte *a acionadores baseados em tempo*. Os acionadores adicionais, como acionadores baseados em localização, podem ser adicionados no futuro com base na demanda do desenvolvedor. {% endAside %}

### Casos de uso {: #use-cases }

Os aplicativos de calendário podem usar acionadores de notificação baseados em tempo para lembrar um usuário de reuniões futuras. O esquema de notificação padrão para um aplicativo de calendário pode ser mostrar uma primeira notificação de alerta uma hora antes de uma reunião e, em seguida, outra notificação mais urgente cinco minutos antes.

Uma rede de TV pode lembrar aos usuários que seu programa de TV favorito está prestes a começar ou uma transmissão ao vivo de uma conferência está prestes a começar.

Os sites de conversão de fuso horário podem usar acionadores de notificação com base no tempo para permitir que seus usuários programem alarmes para conferências telefônicas ou chamadas de vídeo.

## Status atual {: #status}

Passo | Status
--- | ---
1. Criação de um explicador | [Concluído](https://github.com/beverloo/notification-triggers/blob/master/README.md)
2. Criação da versão preliminar das especificações | Não iniciado
3. **Coleta de feedback e iteração do design.** | **[Em andamento](#feedback)**
4. Teste de origem | Concluído
5. Lançamento | Não iniciado

## Como usar acionadores de notificação {: #use }

### Ativar via about://flags

Para experimentar a API de acionadores de notificação localmente, sem um token de teste de origem, ative o sinalizador `#enable-experimental-web-platform-features` em `about://flags`.

{% Aside %} Dois testes de origem anteriores para o recurso, que deram aos desenvolvedores a chance de experimentar a API proposta, foram do Chrome 80 ao 83 e do Chrome 86 ao 88. Você pode ler o resumo do [feedback obtido](https://docs.google.com/document/d/1Nl1emEqxjTzPLNIAPiS26Vtq3mBdNyCxfMY6QwaD45s/edit) até agora. {% endAside %}

### Detecção de recursos

Você pode descobrir se o navegador oferece suporte a disparadores de notificação verificando a existência da propriedade `showTrigger`:

```js
if ('showTrigger' in Notification.prototype) {
  /* Notification Triggers supported */
}
```

### Agendar uma notificação

Agendar uma notificação é semelhante a mostrar uma notificação push regular, exceto que você precisa passar uma propriedade de condição `showTrigger` com um objeto `TimestampTrigger` como o valor do objeto `options` da notificação.

```js/5
const createScheduledNotification = async (tag, title, timestamp) => {
  const registration = await navigator.serviceWorker.getRegistration();
  registration.showNotification(title, {
    tag: tag,
    body: 'This notification was scheduled 30 seconds ago',
    showTrigger: new TimestampTrigger(timestamp + 30 * 1000),
  });
};
```

{% Aside %} Na área de trabalho, os acionadores de notificação são acionados apenas se o Chrome estiver em execução. No Android, eles disparam independentemente. {% endAside %}

### Cancelar uma notificação programada

Para cancelar notificações programadas, primeiro solicite uma lista de todas as notificações que correspondem a uma determinada marca por meio de `ServiceWorkerRegistration.getNotifications()`. Observe que você precisa passar a sinalização do `includeTriggered` para que as notificações programadas sejam incluídas na lista:

```js/4
const cancelScheduledNotification = async (tag) => {
  const registration = await navigator.serviceWorker.getRegistration();
  const notifications = await registration.getNotifications({
    tag: tag,
    includeTriggered: true,
  });
  notifications.forEach((notification) => notification.close());
};
```

### Depuração

Você pode usar o [painel de notificações do Chrome DevTools](https://developers.google.com/web/updates/2019/07/devtools#backgroundservices) para depurar notificações. Para iniciar a depuração, pressione **Iniciar gravação de eventos** {% Img src="image/admin/vf1pad201b4NM9WjgNQh.png", alt="Iniciar gravação de eventos", width="24", height="24" %} ou <kbd>Control</kbd>+<kbd>E</kbd> (<kbd>Command</kbd>+<kbd>E</kbd> no Mac). O Chrome DevTools registra todos os eventos de notificação, incluindo notificações programadas, exibidas e fechadas, por três dias, mesmo quando o DevTools está fechado.

<figure data-size="full">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Fcyc3iFPdNexgqh1peA8.png", alt="Um evento de notificação exibido foi registrado no painel Notificações do Chrome DevTools, localizado no painel do aplicativo.", width="800", height="247" %} <figcaption> Uma notificação agendada. </figcaption></figure>

<figure data-size="full">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7Sj2NxYKbSXv4P894aLh.png", alt="Um evento de notificação exibido foi registrado no painel de Notificações do Chrome DevTools.", width="800", height="247" %} <figcaption> Uma notificação exibida. </figcaption></figure>

### Demonstração

Você pode ver os acionadores de notificação em ação na [demonstração](https://notification-triggers.glitch.me/), que permite agendar notificações, listar notificações agendadas e cancelá-las. O código-fonte está disponível no [Glitch](https://glitch.com/edit/#!/notification-triggers).

<figure data-size="full">{% Img src="image/admin/WVlem3Tf2GEEFwNVA2L1.png", alt="Uma captura de tela do aplicativo da web de demonstração de acionadores de notificação.", width="800", height="525" %} <figcaption>A <a href="https://notification-triggers.glitch.me/">demonstração</a> de acionadores de notificação.</figcaption></figure>

## Segurança e permissões

A equipe do Chrome projetou e implementou a API de acionadores de notificação usando os princípios básicos definidos em [Controle de acesso a recursos poderosos da plataforma da Web](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md), incluindo controle do usuário, transparência e ergonomia. Como essa API requer service workers, ela também requer um contexto seguro. O uso da API requer a mesma permissão das notificações push regulares.

### Controle do usuário

Esta API está disponível apenas no contexto de um `ServiceWorkerRegistration`. Isso significa que todos os dados necessários são armazenados no mesmo contexto e são excluídos automaticamente quando o service worker é excluído ou o usuário exclui todos os dados do site para a origem. O bloqueio de cookies também impede que os service workers sejam instalados no Chrome e, portanto, que essa API seja usada. As notificações sempre podem ser desativadas pelo usuário para o site nas configurações do site.

### Transparência

Ao contrário da API Push, esta API não depende da rede, o que implica que as notificações programadas precisam de todos os dados necessários com antecedência, incluindo recursos de imagem referenciados pelos atributos `badge`, `icon` e `image`. Isso significa mostrar que uma notificação programada não pode ser observada pelo desenvolvedor e não envolve despertar o service worker até que o usuário interaja com a notificação. Consequentemente, não há atualmente nenhuma maneira conhecida de o desenvolvedor obter informações sobre o usuário por meio de abordagens potencialmente invasoras de privacidade, como pesquisa de localização geográfica por endereço IP. Esse design também permite que o recurso toque de forma opcional nos mecanismos de agendamento fornecidos pelo sistema operacional, como o [`AlarmManager`](https://developer.android.com/reference/android/app/AlarmManager) do Android, que ajuda a preservar a bateria.

## Feedback {: #feedback }

A equipe do Chrome quer saber mais sobre suas experiências com os acionadores de notificação.

### Conte-nos sobre o design da API

Existe algo na API que não funciona como você esperava? Ou faltam métodos ou propriedades que você precisa para implementar sua ideia? Tem uma pergunta ou comentário sobre o modelo de segurança? Informe uma questão específica no [repositório do GitHub de acionadores de notificação](https://github.com/beverloo/notification-triggers/issues) ou adicione suas ideias a uma questão já existente.

### Problemas com a implementação?

Você encontrou um bug na implementação do Chrome? Ou a implementação é diferente da especificação? [Informe](https://new.crbug.com/) um bug em new.crbug.com. Certifique-se de incluir o máximo de detalhes que puder, instruções simples para reproduzir e definir os componentes como `UI>Notifications`. O Glitch funciona muito bem para compartilhar reproduções rápidas e fáceis de bugs.

### Planeja usar a API?

Planeja usar disparadores de notificação em seu site? Seu apoio público nos ajuda a priorizar os recursos e mostra a outros fornecedores de navegadores como é fundamental apoiá-los. Envie um tweet para [@ChromiumDev](https://twitter.com/chromiumdev) usando a hashtag [`#NotificationTriggers`](https://twitter.com/search?q=%23NotificationTriggers&src=typed_query&f=live) e diga-nos onde e como você está usando.

## Links úteis {: #helpful}

- [Explicador público](https://github.com/beverloo/notification-triggers/blob/master/README.md)
- [Demonstração de acionadores de notificação](https://notification-triggers.glitch.me/) | [Fonte de demonstração de acionadores de notificação](https://glitch.com/edit/#!/notification-triggers)
- [Bug de rastreamento](https://bugs.chromium.org/p/chromium/issues/detail?id=891339)
- [Entrada do ChromeStatus.com](https://www.chromestatus.com/feature/5133150283890688)
- Componente Blink: `UI>Notifications`

## Reconhecimentos

Os acionadores de notificação foram implementados por [Richard Knoll](https://uk.linkedin.com/in/richardknoll) e o explicador escrito por [Peter Beverloo](https://twitter.com/beverloo?lang=en), com contribuições de Richard. As seguintes pessoas revisaram o artigo de: [Joe Medley](https://twitter.com/medleyjp), [Pete LePage](https://twitter.com/petele), bem como Richard e Peter. [A imagem do herói](https://unsplash.com/photos/UAvYasdkzq8) por [Lukas Blazek](https://unsplash.com/@goumbik) em Unsplash.
