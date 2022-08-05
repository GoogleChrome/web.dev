---
layout: post
title: O que torna um Progressive Web App bom?
authors:
  - samrichard
  - petelepage
date: 2020-01-06
updated: 2022-07-18
description: |2

  O que torna um Progressive Web App bom ou ótimo?
tags:
  - progressive-web-apps
---

<!-- Disable heading-increment because it mucks with the Details widget -->

<!--lint disable heading-increment-->

Os Progressive Web Apps (PWA) são desenvolvidos e aprimorados com APIs modernas para fornecer recursos aprimorados, confiabilidade e capacidade de instalação, ao mesmo tempo em que alcançam *qualquer pessoa, em qualquer lugar, em qualquer dispositivo* com uma única base de código. Para ajudar você a criar a melhor experiência possível, use as listas de verificação e recomendações [básicas](#core) e [ideais](#optimal).

## Lista de verificação do Core Progressive Web App {: #core}

A lista de verificação principal do Progressive Web App descreve o que torna um aplicativo instalável e utilizável por todos os usuários, independentemente do tamanho ou tipo de entrada.

{% Details %} {% DetailsSummary 'h3' %}

Começa rápido, permanece rápido

O desempenho tem um papel significativo no sucesso de qualquer experiência online, pois os sites de alto desempenho envolvem e retêm os usuários melhor do que os de baixo desempenho. Os sites devem se concentrar na otimização de métricas de desempenho centradas no usuário.

{% endDetailsSummary %}

O desempenho tem um papel significativo no sucesso de qualquer experiência online, pois os sites de alto desempenho envolvem e retêm os usuários melhor do que os de baixo desempenho. Os sites devem se concentrar na otimização de métricas de desempenho centradas no usuário.

#### Por quê

A velocidade é crítica para fazer os usuários *usarem* seu aplicativo. Na verdade, à medida que o tempo de carregamento da página vai de um a dez segundos, a probabilidade de um usuário sair aumenta em 123%. O evento `load` não é o único aspecto importante para um bom desempenho. Os usuários nunca devem se perguntar se a interação (por exemplo, clicar em um botão) foi registrada ou não. A rolagem e a animação devem ser fluidas. O desempenho afeta toda a sua experiência, desde como os usuários percebem seu aplicativo até como ele realmente funciona.

Embora todos os aplicativos tenham necessidades diferentes, as auditorias de desempenho no Lighthouse são baseadas no [modelo de desempenho centrado no usuário RAIL](/rail/), e uma pontuação alta nessas auditorias aumentará a chance de que seus usuários tenham uma experiência agradável. Você também pode usar o [PageSpeed Insights](https://pagespeed.web.dev/) ou o [Relatório de experiência do usuário do Chrome](https://developer.chrome.com/docs/crux/) para obter dados de desempenho do mundo real para seu aplicativo da web.

#### Como

Siga nosso [guia sobre tempos de carregamento curtos](/fast/) para aprender como fazer seu PWA começar rápido e permanecer rápido.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Funciona em qualquer navegador

Os usuários podem usar qualquer navegador que escolherem para acessar seu aplicativo da web antes de instalá-lo.

{% endDetailsSummary%}

Os usuários podem usar qualquer navegador que escolherem para acessar seu aplicativo da web antes de instalá-lo.

#### Por quê

Os Progressive Web Apps são, em primeiro lugar, aplicativos da web e, portanto, eles precisam funcionar em vários navegadores, não apenas em um.

Uma maneira eficaz de fazer isso é, nas palavras de Jeremy Keith em [Resilient Web Design](https://resilientwebdesign.com/) (Design web resiliente), identificar a funcionalidade central, disponibilizar essa funcionalidade usando a tecnologia mais simples possível e, em seguida, aprimorar a experiência quando possível. Em muitos casos, isso significa começar apenas com HTML para criar a funcionalidade principal e aprimorar a experiência do usuário com CSS e JavaScript para criar uma experiência mais envolvente.

Vejamos o envio de formulário, por exemplo. A maneira mais simples de implementar é um formulário HTML que envia uma solicitação `POST`. Depois de criar isso, você pode aprimorar a experiência com JavaScript para fazer a validação do formulário e enviá-lo via AJAX, melhorando a experiência para os usuários que podem usar essa tecnologia.

Considere que seus usuários usarão o site em uma variedade de dispositivos e navegadores. Você não pode simplesmente visar a extremidade superior do espectro. Ao usar a detecção de recursos, você poderá fornecer uma experiência utilizável para a mais ampla gama de possíveis usuários, incluindo aqueles que usam navegadores e dispositivos que podem não existir hoje.

#### Como

O [Resilient Web Design](https://resilientwebdesign.com/) de Jeremy Keith é um excelente recurso que descreve como pensar sobre web design nesta metodologia progressiva para vários navegadores.

#### Leitura adicional

- [Understanding Progressive Enhancement](https://alistapart.com/article/understandingprogressiveenhancement/) (Entendendo a melhoria progressiva) de A List Apart (Uma lista à parte) é uma boa introdução ao tópico.
- [Progressive Enhancement: What It Is, And How To Use It?](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/) (Aprimoramento progressivo: o que é e como usar?) da Smashing Magazine oferece uma introdução prática e links para tópicos mais avançados.
- O MDN tem um artigo intitulado [Implementing feature detection](https://developer.mozilla.org/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection) (Implementação de detecção de recursos) que fala sobre como detectar um recurso fazendo uma consulta direta a ele.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Responsivo em qualquer tamanho de tela

Os usuários podem usar seu PWA em tela de qualquer tamanho, e todo o conteúdo fica disponível em qualquer tamanho de visor.

{% endDetailsSummary %}

Os usuários podem usar seu PWA em tela de qualquer tamanho, e todo o conteúdo fica disponível em qualquer tamanho de visor.

#### Por quê

Os dispositivos têm diversos tamanhos diferentes, e os usuários podem usar seu aplicativo em uma variedade de tamanhos, até no mesmo dispositivo. Portanto, é fundamental garantir que seu conteúdo não apenas se encaixe no visor, mas que todos os recursos e conteúdo do site possam ser usados em todos os tamanhos de visor.

As tarefas que os usuários desejam concluir e o conteúdo que desejam acessar não mudam com o tamanho do visor. O conteúdo pode ser reorganizado em diferentes tamanhos de visor, e tudo deve estar lá, de uma forma ou de outra. Na verdade, como Luke Wroblewski afirma em seu livro Mobile First (Mobilidade em primeiro lugar), começar pequeno e ir crescendo, em vez do contrário, pode melhorar muito o design de um site:

> Os dispositivos móveis exigem que as equipes de desenvolvimento de software se concentrem apenas nos dados e ações mais importantes de um aplicativo. Simplesmente não há espaço em uma tela de 320 por 480 pixels para elementos extras e desnecessários. É preciso priorizar.

#### Como

Existem muitos recursos sobre design responsivo, incluindo o [artigo original de Ethan Marcotte](https://alistapart.com/article/responsive-web-design/), uma [coleção de conceitos importantes](https://snugug.com/musings/principles-responsive-web-design/) relacionados a ele, bem como livros e palestras em abundância. Para restringir essa discussão aos aspectos de conteúdo do design responsivo, você pode mergulhar no [design que prioriza o conteúdo](https://uxdesign.cc/why-you-should-design-the-content-first-for-better-experiences-374f4ba1fe3c) e nos [layouts responsivos começando primeiro pelo conteúdo](https://alistapart.com/article/content-out-layout/). Por fim, embora seja voltado para dispositivos móveis, as lições em [Seven Deadly Mobile Myths](https://www.forbes.com/sites/anthonykosner/2012/05/03/seven-deadly-mobile-myths-josh-clark-debunks-the-desktop-paradigm-and-more/#21ecac977bca) (Sete mitos mortais sobre mobilidade), de Josh Clark, são tão relevantes para visualizações de sites responsivos de pequeno porte quanto para mobilidade.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Fornece uma página offline personalizada

Quando os usuários estão offline, mantê-los em seu PWA oferece uma experiência mais transparente do que voltar para a página offline padrão do navegador.

{% endDetailsSummary %}

Quando os usuários estão offline, mantê-los em seu PWA oferece uma experiência mais transparente do que voltar para a página offline padrão do navegador.

#### Por quê

Os usuários esperam que os aplicativos instalados funcionem independentemente de seu status de conexão. O aplicativo de uma plataforma específica nunca mostra uma página em branco quando está offline, e um Progressive Web App nunca deve mostrar a página offline padrão do navegador. Fornecer uma experiência offline personalizada, tanto quando um usuário navega para uma URL que não foi armazenada em cache quanto quando um usuário tenta usar um recurso que requer conexão, ajuda a sentir que sua experiência na web faz parte do dispositivo no qual ela está sendo executada.

#### Como

Durante o evento `install` de um trabalho de serviço, você pode pré-armazenar em cache uma página offline personalizada para uso posterior. Se um usuário ficar offline, você pode responder com a página offline personalizada pré-armazenada em cache. Acompanhe nosso [exemplo de página offline](https://googlechrome.github.io/samples/service-worker/custom-offline-page/) personalizada para ver um exemplo disso em ação e aprender como implementar por contra própria.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

É instalável

Os usuários que instalam ou adicionam aplicativos aos seus dispositivos tendem a se envolver mais com esses aplicativos.

{% endDetailsSummary %}

Os usuários que instalam ou adicionam aplicativos aos seus dispositivos tendem a se envolver mais com esses aplicativos.

#### Por quê

Instalar um Progressive Web App permite que ele se pareça e se comporte como todos os outros aplicativos instalados. Ele é iniciado do mesmo lugar em que os usuários iniciam outros aplicativos. Ele é executado em sua própria janela de aplicativo, separada do navegador, e aparece na lista de tarefas, assim como outros aplicativos.

Por que você deseja que um usuário instale seu PWA? Pelo mesmo motivo que você deseja que um usuário instale seu aplicativo de uma loja de aplicativos. Os usuários que instalam seus aplicativos são seu público mais engajado e têm melhores métricas de engajamento do que os visitantes típicos, geralmente em paridade com os usuários de aplicativos em dispositivos móveis. Essas métricas incluem mais visitas recorrentes, tempos mais longos em seu site e taxas de conversão mais altas.

#### Como

Você pode seguir nosso [guia de capacidade de instalação](/customize-install/) para aprender como tornar seu PWA instalável, como testar para ver se ele pode ser instalado e tentar fazer por conta própria.

{% endDetails %}

## Lista de verificação do Progressive Web App ideal {: #optimal}

Para criar um Progressive Web App verdadeiramente excelente, que pareça o melhor da categoria, você precisa de mais do que apenas a lista de verificação básica. A lista de verificação do Progressive Web App ideal serve para fazer com que seu PWA pareça parte do dispositivo no qual está sendo executado, aproveitando as vantagens do que torna a web poderosa.

{% Details %} {% DetailsSummary 'h3' %}

Oferece uma experiência offline

Quando a conectividade não é estritamente necessária, seu aplicativo funciona tanto offline quanto online.

{% endDetailsSummary %}

Quando a conectividade não é estritamente necessária, seu aplicativo funciona tanto offline quanto online.

#### Por quê

Além de fornecer uma página offline personalizada, os usuários esperam que os Progressive Web Apps possam ser usados offline. Por exemplo, aplicativos de viagens e companhias aéreas devem ter detalhes da viagem e cartões de embarque facilmente disponíveis quando offline. Aplicativos de música, vídeo e podcast devem permitir a reprodução offline. Aplicativos de notícias e redes sociais devem armazenar em cache o conteúdo recente para que os usuários possam lê-lo quando estiverem offline. Os usuários também esperam permanecer autenticados quando estiverem offline, então projete o PWA para autenticação offline. Um PWA offline oferece aos usuários uma verdadeira experiência semelhante à de um aplicativo.

#### Como

Após determinar quais recursos seus usuários esperam que funcionem offline, você precisará tornar seu conteúdo disponível e adaptável a contextos offline. Além disso, você pode usar [IndexedDB](https://developers.google.com/web/ilt/pwa/working-with-indexeddb), um sistema de armazenamento NoSQL no navegador, para armazenar e recuperar dados, e a [sincronização em segundo plano](https://developer.chrome.com/blog/background-sync/) para permitir que os usuários realizem ações enquanto estiverem offline e para adiar as comunicações do servidor até que o usuário volte a ter uma conexão estável. Você também pode usar trabalhos de serviço para armazenar outros tipos de conteúdo, como imagens, arquivos de vídeo e arquivos de áudio para uso offline, bem como usá-los para implementar [sessões seguras e de longa duração](https://developer.chrome.com/blog/2-cookie-handoff/) para manter os usuários autenticados. Da perspectiva de experiência do usuário, você pode usar [telas esqueleto](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a), que dão aos usuários uma percepção de velocidade e conteúdo durante o carregamento, que pode então voltar para o conteúdo em cache ou um indicador offline, conforme necessário.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

É totalmente acessível

Todas as interações do usuário atendem aos requisitos de acessibilidade do [WCAG 2.0.](https://www.w3.org/TR/WCAG20/)

{% endDetailsSummary %}

Todas as interações do usuário atendem aos requisitos de acessibilidade do [WCAG 2.0.](https://www.w3.org/TR/WCAG20/)

#### Por quê

A maioria das pessoas, em algum momento da vida, desejará aproveitar as vantagens do seu PWA de uma forma que seja coberta pelos requisitos de acessibilidade do [WCAG 2.0.](https://www.w3.org/TR/WCAG20/) Existe um amplo espectro da capacidade dos humanos de interagir e compreender seu PWA, e as necessidades podem ser temporárias ou permanentes. Ao tornar seu PWA acessível, você garante que ele possa ser usado por todos.

#### Como

A [Introdução à Acessibilidade Web](https://www.w3.org/WAI/fundamentals/accessibility-intro/) do W3C é um bom lugar para começar. A maioria dos testes de acessibilidade deve ser feita manualmente. Ferramentas como as auditorias de [Acessibilidade](/lighthouse-accessibility/) do Lighthouse, [axe](https://github.com/dequelabs/axe-core) e [Accessibility Insights](https://accessibilityinsights.io/) podem ajudar a automatizar alguns testes de acessibilidade. Também é importante usar elementos semanticamente corretos em vez de recriar esses elementos por conta própria, por exemplo, os elementos `a` e `button`. Isso garante que, quando você precisar criar uma funcionalidade mais avançada, as expectativas de acessibilidade sejam atendidas (como quando usar setas em vez de tab). A [A11Y Nutrition Cards](https://accessibilityinsights.io/) tem excelentes conselhos sobre isso para alguns componentes comuns.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Pode ser descoberto por meio de pesquisa

Seu PWA pode ser facilmente [descoberto por meio de pesquisa](/discoverable/).

{% endDetailsSummary %}

Seu PWA pode ser facilmente [descoberto por meio de pesquisa](/discoverable/).

#### Por quê

Uma das maiores vantagens da web é a capacidade de descobrir sites e aplicativos por meio de pesquisa. Na verdade, [mais da metade](https://www.brightedge.com/resources/research-reports/channel_share) de todo o tráfego do site vem da pesquisa orgânica. Certificar-se de que existem URLs canônicos para o conteúdo e de que os mecanismos de pesquisa consigam indexar seu site é fundamental para que os usuários encontrem seu PWA. Isso é especialmente verdadeiro ao adotar a renderização no cliente.

#### Como

Comece garantindo que cada URL tenha um título descritivo exclusivo e uma descrição meta. Em seguida, você pode usar o [Google Search Console](https://search.google.com/search-console/about) e as [auditorias de otimização de mecanismo de pesquisa](/lighthouse-seo/) do Lighthouse para ajudar a depurar e corrigir problemas de descoberta em seu PWA. Você também pode usar as ferramentas para webmasters do [Bing](https://www.bing.com/toolbox/webmaster) ou [Yandex](https://webmaster.yandex.com/welcome/) e considerar a inclusão de [dados estruturados](https://goo.gle/search-gallery) por meio de esquemas do [Schema.org](https://schema.org/) em seu PWA.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Funciona com qualquer tipo de entrada

Seu PWA pode ser usado da mesma forma com um mouse, teclado, caneta ou toque.

{% endDetailsSummary %}

Seu PWA pode ser usado da mesma forma com um mouse, teclado, caneta ou toque.

#### Por quê

Os dispositivos oferecem vários métodos de entrada, e os usuários devem ser capazes de alternar facilmente entre eles enquanto usam seu aplicativo. Outro aspecto tão importante quanto é que os métodos de entrada não devem depender do tamanho da tela, ou seja, visores grandes precisam oferecer suporte ao toque, e visores pequenos precisam oferecer suporte a teclados e mouses. Garanta da melhor forma possível que seu aplicativo e todos os recursos ofereçam suporte ao uso de qualquer método de entrada que o usuário decida usar. Quando apropriado, você também deve aprimorar as experiências para permitir controles específicos de entrada (como puxar para atualizar).

#### Como

A [API Pointer Events](https://developer.chrome.com/blog/pointer-events/) fornece uma interface unificada para trabalhar com várias opções de entrada e é especialmente boa para adicionar suporte à caneta. Para oferecer suporte ao toque e teclado, você deve usar os elementos semânticos corretos (âncoras, botões, controles de formulário, etc.), e não reconstruí-los com HTML não semântico (o que é bom para acessibilidade). Ao incluir interações que são ativadas ao passar o mouse, garanta que elas também possam ser ativadas ao clicar ou tocar.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Fornece contexto para solicitações de permissão

Ao pedir permissão para usar APIs avançadas, forneça contexto e peça permissão somente quando a API for necessária.

{% endDetailsSummary %}

Ao pedir permissão para usar APIs avançadas, forneça contexto e peça permissão somente quando a API for necessária.

#### Por quê

As APIs que acionam uma janela de permissão, como notificações, geolocalização e credenciais, são projetadas intencionalmente para perturbar o usuário porque tendem a estar relacionadas a uma funcionalidade avançada que requer aceitação. Acionar essas janelas sem contexto adicional, como no carregamento da página, deixa os usuários menos propensos a aceitar essas permissões e mais propensos a desconfiar delas no futuro. Em vez disso, só acione essas janelas após fornecer ao usuário uma justificativa contextualizada do motivo pelo qual você precisa dessa permissão.

#### Como

Os artigos [Permission UX](https://developers.google.com/web/fundamentals/push-notifications/permission-ux) (Experiência de usuário com permissões) e [The Right Ways to Ask Users for Permissions](https://uxplanet.org/mobile-ux-design-the-right-ways-to-ask-users-for-permissions-6cdd9ab25c27) (As maneiras certas de solicitar permissões aos usuários) do UX Planet são bons recursos para entender como criar janelas de permissão que, embora focadas em dispositivos móveis, se aplicam a todos os PWAs.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Segue as melhores práticas para códigos íntegros

Manter sua base de código íntegra torna mais fácil cumprir seus objetivos e fornecer novos recursos.

{% endDetailsSummary %}

Manter sua base de código íntegra torna mais fácil cumprir seus objetivos e fornecer novos recursos.

#### Por quê

A construção de um aplicativo da web moderno envolve muita coisa. Manter seu aplicativo atualizado e sua base de código íntegra facilita o fornecimento de novos recursos que atendam às outras metas estabelecidas na lista de verificação.

#### Como

Há uma série de verificações de alta prioridade para garantir uma base de código íntegra: evitar o uso de bibliotecas com vulnerabilidades conhecidas, garantir que você não esteja usando APIs obsoletas, remover antipadrões da web de sua base de código (como usar `document.write()` ou ter ouvintes de eventos de rolagem não passivos) e até mesmo programar defensivamente para garantir que seu PWA não fique inutilizável se as análises ou outras bibliotecas de terceiros não forem carregadas. Considere exigir análise de código estático, como lint, bem como testes automatizados, em vários navegadores e canais de lançamento. Essas técnicas podem ajudar a detectar erros antes da entrada em produção.

{% endDetails %}
