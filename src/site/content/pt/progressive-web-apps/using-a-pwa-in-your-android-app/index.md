---
layout: post
title: Como usar um PWA em seu aplicativo Android
authors:
  - andreban
date: 2020-03-19
updated: 2021-12-06
description: |2-

  Como abrir um Progressive Web App em um aplicativo Android.
tags:
  - progressive-web-apps
---

## Inicie um PWA em um aplicativo Android

Os [Progressive Web Apps](/progressive-web-apps/) (PWA) são aplicativos da web que usam recursos semelhantes aos de aplicativos para criar experiências de alta qualidade que são rápidas, confiáveis e atraentes.

A web tem um alcance incrível e oferece maneiras poderosas para os usuários descobrirem novas experiências. Mas os usuários também estão acostumados a pesquisar aplicativos em sua loja de sistema operacional. Em muitos casos, esses usuários já estão familiarizados com a marca ou serviço que procuram e têm um alto nível de intencionalidade que resulta em métricas de engajamento superiores à média.

A Play Store é uma loja de aplicativos Android, e os desenvolvedores muitas vezes querem abrir seus Progressive Web Apps a partir de seus aplicativos Android.

A Atividade da Web Confiável é um padrão aberto que permite aos navegadores fornecer um contêiner totalmente compatível com a plataforma da web que renderiza PWAs dentro de um aplicativo Android. O recurso está disponível no [Chrome](https://play.google.com/store/apps/details?id=com.android.chrome) e em desenvolvimento no [Firefox Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix) .

### As soluções existentes eram limitadas

Sempre foi possível incluir experiências da web em um aplicativo Android, usando tecnologias como o [Android WebView](https://developer.android.com/reference/android/webkit/WebView) ou estruturas como [Cordova](https://cordova.apache.org/) .

A limitação do Android WebView é que ele não pretende ser um substituto do navegador. O Android WebView é uma ferramenta de desenvolvedor para usar a interface do usuário da web em um aplicativo Android e não fornece acesso completo aos recursos da plataforma web moderna, como [seletor de contatos](/contact-picker/) ou [sistema de arquivos](/file-system-access/) , [entre outros](https://developer.chrome.com/blog/fugu-status/) .

Cordova foi projetado para aumentar as deficiências do WebView, mas as APIs são então limitadas ao ambiente Cordova. Isso significa que você precisa manter uma base de código adicional para usar as APIs do Cordova para seu aplicativo Android, separada de seu PWA na web aberta.

Além disso, a descoberta de recursos nem sempre funciona conforme o esperado e os problemas de compatibilidade entre as versões do Android e OEMs também podem ser um problema. Ao utilizar uma dessas soluções, os desenvolvedores precisam de processos adicionais de garantia de qualidade e incorrem em um custo extra de desenvolvimento para detectar e criar soluções alternativas.

### A Atividade da Web Confiável é um novo contêiner para aplicativos da Web no Android

Os desenvolvedores agora podem usar uma [Atividade da Web Confiável](https://developer.chrome.com/docs/android/trusted-web-activity/) como um contêiner para incluir um PWA como uma atividade de inicialização para um aplicativo Android. A tecnologia aproveita o navegador para renderizar o PWA em tela cheia, garantindo que a Atividade da Web Confiável tenha a mesma compatibilidade com os recursos da plataforma da Web e APIs que o navegador subjacente tem. Existem também utilitários de código aberto para tornar a implementação de um aplicativo Android usando uma Atividade da Web Confiável ainda mais fácil.

Outra vantagem não disponível em outras soluções é que o contêiner compartilha armazenamento com o navegador. Os estados de login e as preferências dos usuários são compartilhados perfeitamente entre as experiências.

#### Compatibilidade do navegador

O recurso está disponível no Chrome desde a versão 75, com o Firefox implementando-o em sua versão noturna.

### Critérios de qualidade

Os desenvolvedores da Web devem usar uma Atividade da Web Confiável quando desejam incluir conteúdo da Web em um aplicativo Android.

O conteúdo da Web em uma Atividade da Web Confiável deve atender aos critérios de instalabilidade do PWA.

Além disso, para corresponder ao comportamento que os usuários esperam dos aplicativos Android, o [Chrome 86 apresentou uma mudança em](https://blog.chromium.org/2020/06/changes-to-quality-criteria-for-pwas.html) que a falha em lidar com os seguintes cenários é considerada uma falha:

- Falha ao verificar links de ativos digitais no lançamento do aplicativo.
- Falha ao retornar HTTP 200 para uma solicitação de recurso de rede offline.
- Uma solicitação de navegação que retorna um erro HTTP 404 ou 5xx".

Quando um desses cenários acontece na Atividade da Web Confiável, causa uma falha visível do usuário no aplicativo Android. Confira a [orientação](https://developer.chrome.com/docs/android/trusted-web-activity/whats-new/#updates-to-the-quality-criteria) sobre como lidar com esses cenários em seu prestador de serviços.

O aplicativo também deve atender a critérios adicionais específicos do Android, como [conformidade com as políticas](https://play.google.com/about/developer-content-policy/) .

{% Aside 'caution' %} Quando seu app é projetado principalmente para crianças menores de 13 anos, [são aplicadas políticas adicionais para a família do Play](https://play.google.com/about/families/) , que podem ser incompatíveis com o uso de Atividade da Web Confiável. {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9Z70W3aCI8ropKpMXHcz.png", alt="Uma captura de tela mostrando a pontuação do Lighthouse para AirHorn, com o emblema PWA e uma pontuação de desempenho de 100.", width="800", height="141" %} <figcaption> O emblema do PWA no Lighthouse mostra se o seu PWA passa nos critérios de instalabilidade.</figcaption></figure>

## Ferramentas

Os desenvolvedores Web que desejam aproveitar as vantagens da Atividade da Web Confiável não precisam aprender novas tecnologias ou APIs para transformar seu PWA em um aplicativo Android. Juntos, Bubblewrap e PWABuilder fornecem ferramentas de desenvolvedor na forma de uma biblioteca, Interface de Linha de Comando (CLI) e Interface Gráfica do Usuário (GUI).

### Plástico bolha

O projeto [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) gera aplicativos Android na forma de uma biblioteca NodeJS e uma Interface de Linha de Comando (CLI).

A inicialização de um novo projeto é realizada executando a ferramenta e passando a URL do Manifesto da Web:

```shell
npx @bubblewrap/cli init --manifest=https://pwa-directory.appspot.com/manifest.json
```

A ferramenta também pode construir o projeto, e executar o comando abaixo produzirá um aplicativo Android pronto para ser carregado na Play Store:

```shell
npx @bubblewrap/cli build
```

Depois de executar este comando, um arquivo chamado `app-release-signed.apk` estará disponível no diretório raiz do projeto. Este é o arquivo que será [carregado na Play Store](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB) .

### PWABuilder

O [PWABuilder](https://pwabuilder.com/) ajuda os desenvolvedores a transformar sites existentes em Progressive Web Apps. Também se integra ao Bubblewrap para fornecer uma interface GUI para envolver esses PWAs em um aplicativo Android. A equipe PWABuilder elaborou uma [ótima postagem no blog](https://www.davrous.com/2020/02/07/publishing-your-pwa-in-the-play-store-in-a-couple-of-minutes-using-pwa-builder/)  sobre como gerar um aplicativo Android usando a ferramenta.

## Verificação da propriedade do AWP no aplicativo Android

Um desenvolvedor que constrói um ótimo Progressive Web App não gostaria que outro desenvolvedor construísse um aplicativo Android com ele sem sua permissão. Para garantir que isso não aconteça, o aplicativo Android deve ser emparelhado com o Progressive Web App usando uma ferramenta chamada [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started).

O Bubblewrap e PWABuilder cuidam da configuração necessária no aplicativo Android, mas resta uma última etapa, que é adicionar o arquivo `assetlinks.json` ao PWA.

Para gerar esse arquivo, os desenvolvedores precisam da assinatura SHA-256 da chave usada para assinar o APK que está sendo baixado pelos usuários.

A chave pode ser gerada de várias maneiras, e a maneira mais fácil de descobrir qual chave assinou o APK sendo servida aos usuários finais é baixá-la da própria Play Store.

Para evitar mostrar um aplicativo quebrado aos usuários, implante o aplicativo em um [canal de teste fechado](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB) , instale-o em um dispositivo de teste e use [Peter's Asset Link Tool](https://play.google.com/store/apps/details?id=dev.conn.assetlinkstool) para gerar o arquivo `assetlinks.json` correto para o aplicativo. Disponibilize o arquivo `assetlinks.json` `/.well-known/assetlinks.json`, no domínio que está sendo validado.

## Para onde ir a seguir

Um Progressive Web App é uma experiência da web de alta qualidade. A Atividade da Web Confiável é uma nova maneira de abrir experiências de alta qualidade de um aplicativo Android quando atendem aos critérios mínimos de qualidade.

Se estiver começando a usar Progressive Web Apps, leia [nossa orientação sobre como criar um ótimo PWA](/progressive-web-apps/). Para desenvolvedores que já têm um PWA, use o [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) para verificar se ele atende aos critérios de qualidade.

Em seguida, use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) ou [PWABuilder](https://pwabuilder.com/) para gerar o aplicativo Android, [carregue o aplicativo em um canal de teste fechado na Play Store](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB) e emparelhe-o com o PWA usando [Peter's Asset Link Tool](https://play.google.com/store/apps/details?id=dev.conn.assetlinkstool).

Por último, passe seu aplicativo do canal de teste fechado para a produção!
