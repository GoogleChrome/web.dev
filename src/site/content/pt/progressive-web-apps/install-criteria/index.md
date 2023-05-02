---
layout: post
title: O que é necessário para ser instalável?
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: |2-

  Critérios de instalabilidade dos Progressive Web Apps.
tags:
  - progressive-web-apps
---

Os Progressive Web Apps (PWAs) são aplicativos modernos e de alta qualidade desenvolvidos com tecnologia da web. Os PWAs oferecem recursos semelhantes aos dos aplicativos para iOS/Android/desktop, são confiáveis mesmo em condições de rede instáveis e são instaláveis, tornando mais fácil para os usuários localizá-los e usá-los.

A maioria dos usuários está familiarizada com a instalação de aplicativos e com os benefícios de uma experiência de instalação. Os aplicativos instalados aparecem nas áreas de inicialização do sistema operacional, como a pasta Aplicativos no Mac OS X, o menu Iniciar no Windows e a tela inicial no Android e iOS. Os aplicativos instalados também aparecem no seletor de atividades, nos mecanismos de pesquisa do dispositivo, como o Spotlight, e nas planilhas de compartilhamento de conteúdo.

A maioria dos navegadores indica ao usuário que seu Progressive Web App (PWA) pode ser instalado quando atende a determinados critérios. Entre exemplos de indicadores, temos o botão Instalar na barra de endereço ou o item de menu Instalar no menu suspenso.

<div class="switcher">
  <figure id="browser-install-promo"> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/O9KXz4aQXm3ZOzPo98uT.png", alt="Captura de tela do omnibox com indicador de instalação visível.", width="800", height="307" %} <figcaption> Divulgação de instalação fornecida pelo navegador (desktop) </figcaption></figure>
  <figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bolh05TCEeT7xni4eUTG.png", alt="Captura de tela da divulgação de instalação fornecida pelo navegador.", width="800", height="307" %} <figcaption> Divulgação de instalação fornecida pelo navegador (dispositivos móveis) </figcaption></figure>
</div>

Além disso, quando os critérios são atendidos, muitos navegadores disparam um evento `beforeinstallprompt`, permitindo que você forneça uma experiência de usuário personalizada dentro do aplicativo que acionará o fluxo de instalação no aplicativo.

## Critérios de instalação {: #criteria}

No Chrome, seu Progressive Web App deve atender aos seguintes critérios antes de disparar o evento `beforeinstallprompt` e mostrar a divulgação de instalação no navegador:

- O aplicativo da web ainda não está instalado
- Atende a uma heurística de engajamento do usuário
- É fornecido por HTTPS
- Inclui um [manifesto de aplicativo da web](/add-manifest/) que tenha:
    - `short_name` ou `name`
    - `icons` – deve incluir um ícone de 192 e de 512 pixels
    - `start_url`
    - `display` – deve ser `fullscreen` , `standalone` ou `minimal-ui`
    - `prefer_related_applications` não deve estar presente ou ser `false`
- Registra um trabalho de serviço com um manipulador `fetch`

Outros navegadores têm critérios de instalação semelhantes, embora possa haver pequenas diferenças. Verifique os respectivos sites para conferir todos os detalhes:

- [Edge](https://docs.microsoft.com/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Installable_PWAs)
- [Opera](https://dev.opera.com/articles/installable-web-apps/)

{% Aside %} No Android, se o manifesto do aplicativo da web incluir `related_applications` e `"prefer_related_applications": true` , o usuário será direcionado para a Google Play Store e [solicitado a instalar o aplicativo Android especificado](https://developer.chrome.com/blog/app-install-banners-native/). {% endAside %}
