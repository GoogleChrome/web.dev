---
layout: post
title: Faça seu PWA parecer mais um aplicativo
subhead: Faça com que seu Progressive Web App não pareça um site, mas sim um aplicativo "real"
authors:
  - thomassteiner
description: |2

  Aprenda como fazer seu Progressive Web App parecer um aplicativo "real" compreendendo

  como implementar padrões de aplicativos específicos da plataforma com tecnologias da web.
date: 2020-06-15
updated: 2020-07-23
tags:
  - capabilities
---

Quando você joga o buzzword bingo Progressive Web App, é uma aposta segura marcar como "PWAs são apenas sites". A documentação do PWA da Microsoft [concorda](https://docs.microsoft.com/microsoft-edge/progressive-web-apps-chromium/#progressive-web-apps-on-windows:~:text=PWAs%20are%20just%20websites), [dizemos isso](/progressive-web-apps/#content:~:text=Progressive%20Web%20Apps,Websites) neste mesmo site, e até mesmo os indicados pelo PWA, Frances Berriman e Alex Russell, também assim o [escrevem.](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/#post-2263:~:text=they%E2%80%99re%20just%20websites) Sim, os PWAs são apenas sites, mas também são muito mais do que isso. Se feitos da maneira certa, um PWA não se parecerá com um site, mas como aplicativo "real". Então, o que significa parecer um aplicativo de verdade?

Para responder a essa pergunta, deixe-me usar o [aplicativo Apple Podcasts](https://support.apple.com/HT201859) como exemplo. Ele está disponível no macOS para desktop e no iOS (e iPadOS, respectivamente) no celular. Embora o Podcasts seja um aplicativo de mídia, as ideias centrais que ilustro com sua ajuda se aplicam também a outras categorias de aplicativos.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aNYiT2EkVkjNplAIKbLU.png", alt="Um iPhone e um MacBook lado a lado, ambos executando o aplicativo Podcasts.", width="800", height="617" %} <figcaption>Apple Podcasts no iPhone e no macOS (<a href="https://support.apple.com/HT201859">Fonte</a>).</figcaption></figure>

{% Aside 'caution' %} Cada recurso de aplicativo iOS/Android/computador listado abaixo tem um componente <br> **Como fazer isso na web** que você pode abrir para obter mais detalhes. Observe que nem todos os navegadores nos vários sistemas operacionais oferecem suporte a todas as APIs ou funcionalidades listadas. Certifique-se de revisar cuidadosamente as notas de compatibilidade nos artigos associados.{% endAside %}

## Capaz de funcionar offline

Se você der um passo para trás e pensar em alguns dos aplicativos específicos da plataforma que você pode ter em seu telefone celular ou computador desktop, uma coisa se destaca: você nunca ganha nada. No aplicativo Podcasts, mesmo se eu estiver offline, sempre há algo. Quando não há conexão de rede, o aplicativo ainda abre naturalmente. A seção **Top Charts** não mostra nenhum conteúdo, mas em vez disso mostra alternativamente uma mensagem **Não é possível conectar agora** emparelhada com um botão **Tentar novamente.** Pode não ser a experiência mais acolhedora, mas a menos recebo algo.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMbGLQkbLROxmUMdxLET.png", alt="O aplicativo Podcasts mostrando um 'Não é possível conectar agora.' mensagem informativa quando nenhuma conexão de rede estiver disponível.", width="800", height="440" %} <figcaption>Aplicativo Podcasts sem conexão de rede.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} O aplicativo Podcasts segue o chamado modelo de shell de aplicativo. Todo o conteúdo estático necessário para mostrar o aplicativo principal é armazenado em cache localmente, incluindo imagens decorativas como os ícones de menu à esquerda e os ícones da interface do usuário do player principal. O conteúdo dinâmico, como os dados do <b>Top Charts</b> só é carregado sob demanda, com conteúdo alternativo em cache local disponível caso o carregamento falhe. Leia o artigo <a href="https://developers.google.com/web/fundamentals/architecture/app-shell">The App Shell Model</a> para aprender como aplicar este modelo de arquitetura ao seu aplicativo da web. {% endDetails %}

## Conteúdo offline disponível e reproduzível em mídia

Quando offline, através da gaveta do lado esquerdo, eu ainda consigo navegar até a seção **Baixados** e curtir episódios de podcast transferidos que estão prontos para ser tocados e exibidos com todos os metadados como capas e descrições.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/onUIDiaFNNHOmnwXzRh1.png", alt="Aplicativo Podcasts com um episódio baixado de um podcast em execução.", width="800", height="440" %} <figcaption>Os episódios de podcast baixados podem ser reproduzidos mesmo sem rede.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} O conteúdo de mídia baixado anteriormente pode ser servido a partir do cache, por exemplo, usando a receita <a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">Servir áudio e vídeo em cache</a> da biblioteca <a href="https://developer.chrome.com/docs/workbox/">Workbox.</a> Outro conteúdo sempre pode ser armazenado no cache ou em IndexedDB. Leia o artigo <a href="/storage-for-the-web/">Armazenamento para a web</a> para saber todos os detalhes e para saber quando usar qual tecnologia de armazenamento. Se você tiver dados que devem ser armazenados de forma persistente sem o risco de serem eliminados quando a quantidade de memória disponível ficar baixa, você pode usar a <a href="/persistent-storage/">API de armazenamento persistente</a>. {% endDetails %}

## Download proativo em segundo plano

Quando estiver on-line novamente, posso pesquisar conteúdo com uma consulta como `http 203` , e quando decidir assinar o resultado da pesquisa, o [podcast HTTP 203](/podcasts/), o último episódio da série é baixado imediatamente, sem mais perguntas.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WbCk4nPpBS3zwkPVRGuo.png", alt="O aplicativo Podcasts baixando o último episódio de um podcast imediatamente após a assinatura.", width="800", height="658" %}<br><figcaption> Depois de assinar um podcast, o último episódio é baixado imediatamente.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Baixar um episódio de podcast é uma operação que pode levar mais tempo. A <a href="https://developers.google.com/web/updates/2018/12/background-fetch">API Background Fetch</a> permite delegar downloads ao navegador, que cuida deles em segundo plano. No Android, o navegador, por sua vez, pode até mesmo delegar esses downloads ao sistema operacional para que o navegador não precise estar em execução contínua. Assim que o download for concluído, o service worker do seu aplicativo é ativado e você pode decidir o que fazer com a resposta. {% endDetails %}

## Compartilhando e interagindo com outros aplicativos

O aplicativo Podcasts se integra naturalmente a outros aplicativos. Por exemplo, quando clico com o botão direito em um episódio de que gosto, posso compartilhá-lo com outros aplicativos do meu dispositivo, como o aplicativo Mensagens. Ele também se integra naturalmente à área de transferência do sistema. Posso clicar com o botão direito em qualquer episódio e copiar um link nela.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gKeFGOAZ2muuYeDNFbBW.png", alt="O menu de contexto do aplicativo Podcasts invocado em um episódio de podcast com a opção 'Compartilhar Episódio &gt; Mensagens' selecionada.", width="800", height="392" %} <figcaption>Compartilhando um episódio de podcast com o aplicativo Mensagens.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} A <a href="/web-share/">API Web Share</a> e a <a href="/web-share-target/">API Web Share Target</a> permitem que seu aplicativo compartilhe e receba textos, arquivos e links de e para outros aplicativos no dispositivo. Embora ainda não seja possível para um aplicativo da web adicionar itens de menu ao menu de atalho embutido do sistema operacional, há muitas outras maneiras de se conectar a outros aplicativos no dispositivo. Com a <a href="/image-support-for-async-clipboard/">API Async Clipboard</a> , você pode ler e gravar texto e dados de imagem (imagens PNG) programaticamente de e para a área de transferência do sistema. No Android, você pode usar a <a href="/contact-picker/">API Contact Picker</a> para selecionar entradas do gerenciador de contatos do dispositivo. Se você oferece um aplicativo específico da plataforma e um PWA, pode usar a <a href="/get-installed-related-apps/">API Get Installed Related Apps</a> para verificar se o aplicativo específico da plataforma está instalado; nesse caso, você não precisa encorajar o usuário a instalar o PWA ou aceitar notificações push da web. {% endDetails %}

## Atualização do app em segundo plano

Nas configurações do aplicativo Podcasts, posso configurar o aplicativo para baixar novos episódios automaticamente. Assim, não preciso nem pensar nisso, sempre haverá conteúdo atualizado. É mágica.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iTKgVVjX0EM0RQS3ap4X.png", alt="O menu de configurações do aplicativo Podcasts na seção 'Geral' onde a opção 'Atualizar Podcasts' está definida como 'A cada hora'.", width="800", height="465" %} <figcaption>Podcasts configurado para verificar novos episódios de podcast a cada hora.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} A <a href="/periodic-background-sync/">API Periodic Background Sync</a> permite que seu aplicativo atualize seu conteúdo regularmente em segundo plano, sem a necessidade de estar em execução. Isso significa que o novo conteúdo está disponível de forma proativa, para que seus usuários possam começar a mergulhar nele imediatamente, quando quiserem. {% endDetails %}

## Estado sincronizado na nuvem

Ao mesmo tempo, minhas assinaturas são sincronizadas em todos os dispositivos que possuo. Em um mundo perfeito, não preciso me preocupar em manter sincronizadas as assinaturas de podcast manualmente. Da mesma forma, não preciso ter medo de que a memória do meu dispositivo móvel seja consumida por episódios que já ouvi em meu desktop e vice-versa. O estado de reprodução é mantido em sincronia e os episódios ouvidos são excluídos automaticamente.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uVJJ40Zxi5jx1AP1jd9U.png", alt="O menu de configurações do aplicativo Podcasts na seção 'Avançado', onde a opção 'Sincronizar assinaturas entre dispositivos' está ativada.", width="800", height="525" %} <figcaption>O estado é sincronizado na nuvem.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Sincronizar dados de estado do aplicativo é uma tarefa que você pode delegar à <a href="https://developers.google.com/web/updates/2015/12/background-sync">API Background Sync</a>. A operação de sincronização em si não precisa acontecer imediatamente, apenas <em>eventualmente</em>, e talvez até mesmo quando o usuário já tiver fechado o aplicativo novamente. {% endDetails %}

## Principais controles de mídia de hardware

Quando estou ocupado com outro aplicativo, digamos, lendo uma página de notícias no navegador Chrome, ainda posso controlar o aplicativo Podcasts com as teclas de mídia do meu laptop. Não há necessidade de alternar para o aplicativo apenas para avançar ou retroceder.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TqRtzNtfhahjX93hI1P6.png", alt="Magic Keyboard do Apple MacBook Pro com teclas de mídia anotadas.", width="800", height="406" %} <figcaption>As teclas de mídia permitem controlar o aplicativo Podcasts (<a href="https://support.apple.com/guide/macbook-pro/magic-keyboard-apdd0116a6a2/mac">Fonte</a>).</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} As teclas de mídia são suportadas pela <a href="/media-session/">API de sessão de mídia</a>. Assim, os usuários podem usar as teclas de mídia de hardware em seus teclados físicos, fones de ouvido ou até mesmo controlar o aplicativo da web a com as teclas de mídia de software em seus smartwatches. Uma ideia adicional para suavizar as operações de busca é enviar um <a href="https://developer.mozilla.org/docs/Web/API/Vibration_API">padrão de vibração</a> quando o usuário estiver buscando uma parte significativa do conteúdo, por exemplo, passando os créditos de abertura ou o limite de um capítulo. {% endDetails %}

## Multitarefa e atalho de aplicativo

É claro que sempre posso executar várias tarefas ao mesmo tempo no aplicativo Podcasts de qualquer lugar. O aplicativo tem um ícone claramente distinguível que também posso colocar na minha Mesa ou Dock de aplicativos para que os podcasts possam ser iniciados imediatamente, quando eu quiser.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l5EzElV5BGweYXLAqF4u.png", alt="O alternador de tarefas do macOS com vários ícones de aplicativos para escolher, um deles o aplicativo Podcasts.", width="800", height="630" %} <figcaption>Multitarefa de volta ao aplicativo Podcasts.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Os Progressive Web Apps no desktop e no celular podem ser instalados na tela inicial, menu iniciar ou dock de aplicativo. A instalação pode acontecer com base em uma solicitação proativa ou totalmente controlada pelo desenvolvedor do aplicativo. O artigo <a href="/install-criteria/">O que é necessário para ser instalável?</a> cobre tudo que você precisa saber. Durante a multitarefa, os PWAs aparecem independentemente do navegador. {% endDetails %}

## Ações rápidas no menu de contexto

As ações mais comuns do aplicativo, **Pesquisar** por novo conteúdo e **Verificar novos episódios** , estão disponíveis diretamente no menu de contexto do aplicativo no Dock. Através do **menu Opções** , também posso decidir abrir o aplicativo no momento do login.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SnA6Thz5xaopuTWRzWgQ.png", alt="Menu de contexto do ícone do aplicativo Podcasts mostrando as opções 'Pesquisar' e 'Verificar novos episódios'.", width="534", height="736" %} <figcaption>As ações rápidas estão imediatamente disponíveis diretamente no ícone do aplicativo.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Ao especificar os <a href="/app-shortcuts/">atalhos do ícone do aplicativo</a> no manifesto do aplicativo da web do PWA, você pode registrar rotas rápidas para tarefas comuns que os usuários podem acessar diretamente com o ícone do aplicativo. Em sistemas operacionais como o macOS, os usuários também podem clicar com o botão direito do mouse no ícone do aplicativo e configurá-lo para iniciar no momento do login. Há um trabalho em andamento em uma proposta para <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/RunOnLogin/Explainer.md">executar no login</a>. {% endDetails %}

## Atuar como aplicativo padrão

Outros aplicativos iOS e até mesmo sites ou e-mails podem se integrar ao aplicativo Podcasts, aproveitando o esquema de URL `podcasts://` Se eu seguir um link como [`podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903`](podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903) enquanto estiver no navegador, sou levado diretamente para o aplicativo Podcasts e posso decidir se quero assinar ou ouvir o podcast.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/x8mjOWiMO4CVigvtV8Kg.png", alt="O navegador Chrome mostra uma caixa de diálogo de confirmação perguntando ao usuário se deseja abrir o aplicativo Podcasts.", width="800", height="492" %} <figcaption>O aplicativo Podcasts pode ser aberto diretamente no navegador.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Lidar com esquemas de URL totalmente personalizados ainda não é possível, mas há um trabalho em andamento em uma proposta para <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">Manipulação de protocolo de URL</a> para PWAs. Atualmente, <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a> com um <code>web+</code> é a melhor alternativa. {% endDetails %}

## Integração do sistema de arquivos local

Você pode não pensar nisso imediatamente, mas o aplicativo Podcasts se integra naturalmente ao sistema de arquivos local. Quando eu faço download de um episódio de podcast, no meu laptop ele é armazenado em `~/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/Library/Cache`. Ao contrário de, digamos, `~/Documents`, esse diretório obviamente não deve ser acessado diretamente por usuários regulares, mas está lá. Outros mecanismos de armazenamento além dos arquivos são mencionados na seção de [conteúdo offline.](#offline-content-available-and-media-playable)

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Og60tp5kB9lVZsi3Prdt.png", alt="O macOS Finder acessou o diretório do sistema do aplicativo Podcasts.", width="800", height="337" %} <figcaption>Os episódios de podcast são armazenados em uma pasta especial do aplicativo do sistema.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} A <a href="/file-system-access/">API</a> de acesso ao sistema de arquivos permite que os desenvolvedores tenham acesso ao sistema de arquivos local do dispositivo. Você pode usá-lo diretamente ou por meio da <a href="https://github.com/GoogleChromeLabs/browser-fs-access">biblioteca de suporte browser-fs-access,</a> que fornece uma alternativa transparente para navegadores que não oferecem suporte à API. Por motivos de segurança, os diretórios do sistema não são acessíveis pela web. {% endDetails %}

## Aparência e comportamento da plataforma

Existe uma coisa mais sutil que é evidente para um aplicativo iOS como Podcasts: nenhum dos rótulos de texto é selecionável e todo o texto se mistura com a fonte do sistema da máquina. Além disso, minha opção para o tema de cores do sistema (modo escuro) é respeitada.

<div class="switcher">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OApP9uGUje6CkS7cKcZh.png", alt="O aplicativo Podcasts no modo escuro.", width="800", height="463" %} <figcaption>O aplicativo Podcasts oferece suporte aos modos claro e escuro.</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cnVihfFR2anSBlIVfCSW.png", alt="O aplicativo Podcasts em modo claro.", width="800", height="463" %} <figcaption>O aplicativo usa a fonte padrão do sistema.</figcaption></figure>
</div>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Aproveitando a <a href="https://developer.mozilla.org/docs/Web/CSS/user-select"><code>user-select</code></a> pelo usuário com o valor <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>none</code></a> , você pode proteger os elementos da IU de serem selecionados acidentalmente. No entanto, certifique-se de não abusar dessa propriedade para tornar o <em>conteúdo do aplicativo</em> não selecionável. Isso deve ser usado apenas para elementos da IU, como textos de botão etc. O <a href="https://developer.mozilla.org/docs/Web/CSS/font-family#&lt;generic-name&gt;:~:text=system%2Dui,-Glyphs"><code>system-ui</code></a> para a <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family</code></a> permite que você especifique a fonte da IU padrão do sistema a ser usada para seu aplicativo. Finalmente, seu aplicativo pode obedecer à preferência de esquema de cores do usuário, respeitando a preferência<a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a> com uma <a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">chave alternante para modo escuro</a> opcional para substituí-la. Outra coisa a se decidir pode ser o que o navegador deve fazer ao atingir o limite de uma área de rolagem, por exemplo, para implementar <em>puxar personalizado para atualizar</em>. Isso é possível com a propriedade CSS de <a href="https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior"><code>overscroll-behavior</code></a> {% endDetails %}

## Barra de título personalizada

Ao olhar para a janela do aplicativo Podcasts, você percebe que ela não possui uma barra de título e uma barra de ferramentas integradas clássicas, como, por exemplo, a janela do navegador Safari, mas sim uma experiência personalizada que se parece com uma barra lateral encaixada na janela do player principal.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cB7G2e31JXU71EfvhG3i.png", alt="A barra de blocos e a barra de ferramentas integradas do navegador Safari.", width="800", height="40" %} <figcaption></figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mFvLbyQ90wsDPQ9l86s3.png", alt="A barra de título dividida personalizada do aplicativo Podcasts.", width="800", height="43" %} <figcaption>Barras de título personalizadas do Safari e Podcasts.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Embora não seja possível no momento, a <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">personalização da barra de título</a> está sendo trabalhada no momento. Você pode (e deve), no entanto, especificar a <a href="/add-manifest/#display"><code>display</code></a> e as <a href="/add-manifest/#theme-color"><code>theme-color</code></a> do tema do manifesto do aplicativo da web para determinar a aparência e comportamento da janela do seu aplicativo e para decidir quais controles padrão do navegador - potencialmente nenhum deles - devem ser mostrados. {% endDetails %}

## Animações rápidas

As animações no aplicativo são rápidas e suaves em podcasts. Por exemplo, quando abro a gaveta **Notas de Episódio** à direita, ela desliza elegantemente para dentro. Quando eu removo um episódio de meus downloads, os episódios restantes flutuam e consomem o espaço da tela que foi liberado pelo episódio excluído.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ucob9t4Ga3jMK20RVvSD.png", alt="O aplicativo Podcasts com a gaveta 'Notas do Episódio' foi expandida.", width="800", height="463" %} <figcaption>As animações no aplicativo, como ao abrir uma gaveta, são rápidas.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Animações performáticas na web certamente são possíveis se você levar em consideração uma série de práticas recomendadas descritas no artigo <a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">Animações e desempenho</a>. As animações de rolagem normalmente vistas em conteúdo paginado ou carrosséis de mídia podem ser bastante aprimoradas usando o recurso<a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS Scroll Snap</a>. Para ter controle total, você pode usar a <a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">API Web Animations</a>. {% endDetails %}

## Conteúdo que aparece fora do aplicativo

O aplicativo Podcasts no iOS pode exibir conteúdo em outros locais que não o aplicativo real, por exemplo, na exibição de Widgets do sistema ou na forma de uma sugestão de Siri. Ter chamadas à ação proativas baseadas no uso que requerem apenas um toque para interagir pode aumentar muito a taxa de novos engajamentos de um aplicativo como o Podcasts.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w8zhRHcKzRfgjXZu7y4h.png", alt="Visualização do widget iOS mostrando o aplicativo Podcasts, sugerindo um novo episódio de um podcast.", width="751", height="1511" %} <figcaption>O conteúdo do aplicativo é exibido fora do aplicativo Podcasts principal.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} A <a href="/content-indexing-api/">API de índice de conteúdo</a> permite que seu aplicativo informe ao navegador qual conteúdo do PWA está disponível offline. Isso permite que o navegador exiba esse conteúdo fora do aplicativo principal. Marcando conteúdo interessante em seu aplicativo como adequado para reprodução de áudio <a href="https://developers.google.com/search/docs/data-types/speakable">falável</a> e usando marcação <a href="https://developers.google.com/search/docs/guides/search-gallery">estruturada</a> em geral, você pode ajudar mecanismos de pesquisa e assistentes virtuais como o Google Assistant a apresentar suas ofertas em uma apresentação ideal. {% endDetails %}

## Widget de controle de mídia da tela de bloqueio

Quando um episódio de podcast está sendo reproduzido, o aplicativo Podcasts mostra um belo widget de controle na tela de bloqueio que apresenta metadados como a capa do episódio, o título do episódio e o nome do podcast.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Lr9R2zpjDEgHtyJ7hjHf.png", alt="Widget de reprodução de mídia do iOS na tela de bloqueio mostrando um episódio de podcast com metadados avançados.", width="751", height="1511" %} <figcaption>A reprodução de mídia no aplicativo pode ser controlada a partir da tela de bloqueio.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} A <a href="/media-session/">API de sessão de mídia</a> permite que você especifique metadados como arte, títulos de faixas etc. que são exibidos na tela de bloqueio, smartwatches ou outros widgets de mídia no navegador. {% endDetails %}

## Notificações via push

As notificações push se tornaram um pouco incômodas na web (embora os [prompts de notificação estejam muito mais silenciosos](https://blog.chromium.org/2020/01/introducing-quieter-permission-ui-for.html) agora). Mas, se usados corretamente, eles podem agregar muito valor. Por exemplo, o aplicativo iOS Podcasts pode, opcionalmente, me notificar sobre novos episódios de podcasts nos quais estou inscrito ou recomendar novos, bem como me alertar sobre novos recursos do aplicativo.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IFnNRo6BnHL6BxDmiqF7.png", alt="Aplicativo iOS Podcasts na tela de configurações de 'Notificações' mostrando a alternância de notificações de 'Novos episódios' ativada.", width="751", height="1511" %} <figcaption>Os aplicativos podem enviar notificações push para informar o usuário sobre novos conteúdos.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} A <a href="https://developers.google.com/web/fundamentals/push-notifications">API Push</a> permite que seu aplicativo receba notificações push para que você possa notificar seus usuários sobre eventos importantes sobre seu PWA. Para notificações que devem ser disparadas em um momento conhecido no futuro e que não requerem uma conexão de rede, você pode usar a <a href="/notification-triggers/">API Notification Triggers</a>. {% endDetails %}

## Emblema do ícone do app

Sempre que houver novos episódios disponíveis de um dos podcasts em que estiver inscrito, um emblema do ícone do aplicativo no ícone da tela inicial do Podcasts aparece, mais uma vez me encorajando a voltar a interagir com o aplicativo de uma forma que não seja intrusiva.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3smO2sJz5oMwy4RYpQoF.png", alt="Tela de configurações do iOS mostrando o botão 'Emblemas' ativado.", width="751", height="1511" %} <figcaption>Os emblemas são uma forma sutil de os aplicativos informarem os usuários sobre o novo conteúdo.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Você pode definir emblemas de ícones de aplicativos com a <a href="/badging-api/">Badging API</a>. Isso é especialmente útil quando seu PWA tem alguma noção de itens "não lidos" ou quando você precisa de um meio para chamar discretamente a atenção do usuário de volta para o aplicativo. {% endDetails %}

## A reprodução de mídia tem precedência sobre as configurações de economia de energia

Quando a mídia de podcast está sendo reproduzida, a tela pode desligar, mas o sistema não entrará no modo de espera. Os aplicativos também podem manter a tela ativada, por exemplo, para exibir letras ou legendas.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CRkipfmdkLJrND83qvQw.png", alt="Preferências do macOS na seção 'Economizador de energia'.", width="800", height="573" %} <figcaption>Os aplicativos podem manter a tela ativa.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} A <a href="/wakelock/">API Screen Wake Lock</a> permite evitar que a tela desligue. A reprodução de mídia na web impede automaticamente que o sistema entre no modo de espera. {% endDetails %}

## Descoberta de aplicativos em uma loja de aplicativos

Embora o aplicativo Podcasts faça parte da experiência de desktop do macOS, no iOS ele precisa ser instalado a partir da App Store. Uma busca rápida por `podcast` , `podcasts` ou `apple podcasts` transforma imediatamente o aplicativo na App Store.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZLr5quaQWA9VJGAHNrLd.png", alt="A pesquisa da iOS App Store por 'podcasts' revela o aplicativo Podcasts.", width="751", height="1511" %} <figcaption>Os usuários aprenderam a descobrir aplicativos em lojas de aplicativos.</figcaption></figure>

{% Details %} {% DetailsSummary %} Como fazer isso na web {% endDetailsSummary %} Embora a Apple não permita PWAs na App Store, no Android, você pode enviar seu PWA <a href="/using-a-pwa-in-your-android-app/">como um wrap de uma Atividade da Web confiável</a>. O <a href="https://github.com/GoogleChromeLabs/bubblewrap"><code>bubblewrap</code></a> amacia essa operação. Este script também é o que alimenta internamente o <a href="https://www.pwabuilder.com/">recurso de exportação de aplicativos Android do PWABuilder</a>, que você pode usar sem mexer na linha de comando. {% endDetails %}

## Resumo sobre os recursos

A tabela abaixo mostra uma visão geral compacta de todos os recursos e fornece uma lista de recursos úteis para realizá-los na web.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Recurso</th>
        <th>Recursos úteis para fazer isso na web</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="#capable-of-running-offline">Capacidade de funcionar offline</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/architecture/app-shell">Modelo de shell de aplicativo</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#offline-content-available-and-media-playable">Conteúdo offline disponível e reproduzível em mídia</a></td>
        <td>
          <ul>
            <li><a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">Exibir áudio e vídeo em cache</a></li>
            <li><a href="https://developer.chrome.com/docs/workbox/">Biblioteca Workbox</a></li>
            <li><a href="/storage-for-the-web/">API de armazenamento</a></li>
            <li><a href="/persistent-storage/">API de armazenamento persistente</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#proactive-background-downloading">Download proativo em segundo plano</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2018/12/background-fetch">API Background Fetch</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#sharing-to-and-interacting-with-other-applications">Compartilhamento e interação com outros aplicativos</a></td>
        <td>
          <ul>
            <li><a href="/web-share/">API Web Share</a></li>
            <li><a href="/web-share-target/">API Web Share Target</a></li>
            <li><a href="/image-support-for-async-clipboard/">API Async Clipboard</a></li>
            <li><a href="/contact-picker/">API Contact Picker</a></li>
            <li><a href="/get-installed-related-apps/">API para obtenção de aplicativos relacionados instalados</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#background-app-refreshing">Atualização do app em segundo plano</a></td>
        <td>
          <ul>
            <li><a href="/periodic-background-sync/">API de sincronização periódica em segundo plano</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#state-synchronized-over-the-cloud">Estado sincronizado na nuvem</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2015/12/background-sync">API de sincronização de segundo plano</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#hardware-media-key-controls">Principais controles de mídia de hardware</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">API de sessão de mídia</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#multitasking-and-app-shortcut">Multitarefa e atalhos de aplicativo</a></td>
        <td>
          <ul>
            <li><a href="/install-criteria/">Critérios de instalabilidade</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#quick-actions-in-context-menu">Ações rápidas no menu de contexto</a></td>
        <td>
          <ul>
            <li><a href="/app-shortcuts/">Atalhos do ícone do aplicativo</a></li>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/tree/master/RunOnLogin">Executar no login</a> (estágio inicial)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#act-as-default-app">Atuar como aplicativo padrão</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">Tratamento do protocolo de URL</a> (estágio inicial)</li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#local-file-system-integration">Integração do sistema de arquivos local</a></td>
        <td>
          <ul>
            <li><a href="/file-system-access/">API de acesso ao sistema de arquivos</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/browser-fs-access">biblioteca browser-fs-access</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#platform-look-and-feel">Aparência e comportamento da plataforma</a></td>
        <td>
          <ul>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>user-select: none</code></a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family: system-ui</code></a>
            </li>
            <li>
              <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a>
            </li>
            <li><a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">Alternar para modo escuro</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#customized-title-bar">Barra de título personalizada</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">Personalização da barra de título</a> (estágio inicial)</li>
            <li><a href="/add-manifest/#display">Modo de exibição</a></li>
            <li><a href="/add-manifest/#theme-color">Cor do tema</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#snappy-animations">Animações rápidas</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">Animações e dicas de desempenho</a></li>
            <li><a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS Scroll Snap</a></li>
            <li><a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">API de animações da web</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#content-surfaced-outside-of-app">Conteúdo que aparece fora do aplicativo</a></td>
        <td>
          <ul>
            <li><a href="/content-indexing-api/">API de índice de conteúdo</a></li>
            <li><a href="https://developers.google.com/search/docs/data-types/speakable">Conteúdo falável</a></li>
            <li><a href="https://developers.google.com/search/docs/guides/search-gallery">Marcação estruturada</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#lock-screen-media-control-widget">Widget de controle de mídia da tela de bloqueio</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">API de sessão de mídia</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#push-notifications">Notificações via push</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/push-notifications">API push</a></li>
            <li><a href="/notification-triggers/">API Notification Triggers</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-icon-badging">Selo do ícone do app</a></td>
        <td>
          <ul>
            <li><a href="/badging-api/">API Badging</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#media-playback-takes-precedence-over-energy-saver-settings">A reprodução de mídia tem precedência sobre as configurações de economia de energia</a></td>
        <td>
          <ul>
            <li><a href="/wakelock/">API Screen Wake Lock</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-discovery-through-an-app-store">Descoberta de aplicativos em uma loja de aplicativos</a></td>
        <td>
          <ul>
            <li><a href="/using-a-pwa-in-your-android-app/">Atividade confiável na web</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/bubblewrap">biblioteca <code>bubblewrap</code></a></li>
            <li><a href="https://www.pwabuilder.com/">Ferramenta PWABuilder</a></li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Conclusão

Os PWAs já percorreram um longo caminho desde sua introdução em 2015. No contexto do [Projeto Fugu 🐡](https://developer.chrome.com/blog/fugu-status), a equipe multiempresarial do Chromium está trabalhando para preencher as últimas lacunas restantes. Seguindo apenas alguns dos conselhos deste artigo, você pode chegar mais perto de oferecer uma sensação de app e fazer com que seus usuários esqueçam que estão lidando com "apenas um site", porque, sinceramente, a maioria deles não se preocupe como seu aplicativo é construído (e por que deveria?), contanto que pareça um aplicativo *de verdade.*

## Agradecimentos

Este artigo foi revisado por [Kayce Basques](/authors/kaycebasques/) , [Joe Medley](/authors/joemedley/) , [Joshua Bell](https://github.com/inexorabletash) , [Dion Almaer](https://blog.almaer.com/) , [Ade Oshineye](https://blog.oshineye.com/) , [Pete LePage](/authors/petelepage/) , [Sam Thorogood](/authors/samthor/) , [Reilly Grant](https://github.com/reillyeon) e [Jeffrey Yasskin.](https://github.com/jyasskin)
