---
layout: post
title: Diretrizes de design UX offline
subhead: Um guia para projetar experiências da web para redes lentas e offline.
authors:
  - mustafakurtuldu
  - thomassteiner
date: 2016-11-10
updated: 2021-05-28
tags:
  - progressive-web-apps
  - ux
  - network
  - offline
---

Este artigo contém diretrizes de design sobre como criar uma ótima experiência em redes lentas e off-line.

A qualidade de uma conexão de rede é influenciada por uma série de fatores, como:

- Má cobertura de um provedor.
- Condições climáticas extremas.
- Quedas de energia.
- Entrar em "zonas mortas" permanentes, como edifícios com paredes que bloqueiam as conexões de rede.
- Entrar em "zonas mortas" temporárias, como quando se viaja em um trem e atravessa um túnel.
- Conexões de Internet com tempo limitado, como aquelas em aeroportos ou hotéis.
- Práticas culturais que exigem acesso limitado ou nenhum acesso à Internet em horários ou dias específicos.

Seu objetivo é fornecer uma boa experiência que reduza o impacto das mudanças na conectividade.

## Decida o que mostrar aos seus usuários quando eles tiverem uma conexão de rede ruim

A primeira pergunta que deve ser feita é como é o sucesso e a falha de uma conexão de rede? Uma conexão bem-sucedida é a experiência online normal do seu aplicativo. A falha de uma conexão, no entanto, pode ser tanto o estado offline do seu aplicativo quanto a forma como o aplicativo se comporta quando há uma rede lenta.

Ao pensar sobre o sucesso ou falha de uma conexão de rede, você precisa se perguntar estas importantes questões de UX:

- Quanto tempo você espera para determinar o sucesso ou a falha de uma conexão?
- O que você pode fazer enquanto o sucesso ou o fracasso estão sendo determinados?
- O que você deve fazer em caso de falha?
- Como você informa o usuário sobre o acima?

### Informar aos usuários sobre seu estado atual e mudança de estado

Informe o usuário sobre as ações que ele ainda pode realizar quando houver uma falha de rede e o estado atual do aplicativo. Por exemplo, uma notificação poderia dizer:

> Você parece ter uma conexão de rede ruim. Não se preocupe! As mensagens serão enviadas quando a rede for restaurada.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/roxoXuJ9x7qUHFVWMgXZ.png", alt="O aplicativo de mensagens emoji Emojoy informa ao usuário quando ocorre uma mudança de estado.", width="335", height="601" %} <figcaption> Informe claramente o usuário quando uma mudança de estado ocorrer o mais rápido possível. </figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GvE07BeSsnTyxnRbkZhz.png", alt="O aplicativo E/S 2016 informa ao usuário quando ocorre uma mudança de estado", width="335", height="601" %} <figcaption> O aplicativo Google E/S usou um "brinde" do Material Design para permitir que o usuário soubesse quando estava off-line.</figcaption></figure>

### Informe os usuários quando a conexão de rede melhorar ou for restaurada

A maneira como você informa ao usuário que a conexão de rede dele melhorou depende do seu aplicativo. Aplicativos como um aplicativo de mercado de ações que priorizam as informações atuais devem se atualizar automaticamente e notificar o usuário o mais rápido possível.

É recomendável que você informe ao usuário que seu aplicativo da web foi atualizado "em segundo plano" usando uma dica visual como, por exemplo, um elemento de brinde de material design. Isso envolve a detecção da presença de um service worker e uma atualização de seu conteúdo gerenciado. Você pode ver um exemplo de código dessa <a href="https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js#L29">função em operação aqui</a>.

Um exemplo disso seria o [Chrome Platform Status,](https://chromestatus.com) que posta uma nota para o usuário quando o aplicativo é atualizado.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ikam7evJEVSicAnVxvWA.png", alt="Um exemplo de aplicativo de previsão do tempo.", width="324", height="598" %} <figcaption> Alguns aplicativos, como o aplicativo de clima, precisam ser atualizados automaticamente, pois os dados antigos não são úteis.</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5TtIkRCPsuxAOajX8LPF.png", alt="Status do Chrome usa um brinde", width="336", height="598" %} <figcaption> Aplicativos como o Chrome Status permitem que o usuário saiba quando o conteúdo foi atualizado por meio de uma notificação do sistema.</figcaption></figure>

Você também pode mostrar a última vez que o aplicativo foi atualizado em todos os momentos em um espaço de destaque. Isso seria útil para um aplicativo de conversor de moeda, por exemplo.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nK4V7aUvmLvaNJgF1S2I.png", alt="O aplicativo Material Money está desatualizado.", width = "324", height = "598"%}<figcaption> Material Money armazena taxas em cache...</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wqaFuHzeAC2wR0D3pt7R.png", alt="Material Money foi atualizado", width="324", height="598" %} <figcaption> …e notifica o usuário quando o aplicativo é atualizado.</figcaption></figure>

Aplicativos, como de notícias, podem mostrar uma notificação simples toque para atualizar informando o usuário sobre o novo conteúdo. A atualização automática faria com que os usuários perdessem seus lugares.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rRLScscdU9BE9Wt4RYAx.png", alt="Um exemplo de aplicativo de notícias, Tailpiece, em seu estado normal", width="360", height="665" %} <figcaption> Tailpiece, um jornal online, fará o download automático das últimas notícias...</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WNIMNF14cSF29fntl1Lc.png", alt="Exemplo de aplicativo de notícias, Tailpiece quando estiver pronto para ser atualizado", width="360", height="665" %} <figcaption> …mas permite que os usuários atualizem manualmente para que não percam seu lugar em um artigo.</figcaption></figure>

### Atualize a IU para refletir o estado contextual atual

Cada bit de IU pode ter seu próprio contexto e funcionalidade, que mudarão dependendo se for necessária uma conexão bem-sucedida. Um exemplo seria um site de comércio eletrônico que pode ser navegado offline. O botão Comprar e o preço seriam desativados até que a conexão fosse restabelecida.

Outras formas de estados contextuais podem incluir dados. Por exemplo, o aplicativo financeiro Robinhood permite que os usuários comprem ações e usa cores e gráficos para notificar o usuário quando o mercado está aberto. Toda a interface fica branca e depois acinzentada quando o mercado fecha. Quando o valor do estoque aumenta ou diminui, cada widget de estoque individual fica verde ou vermelho, dependendo de seu estado.

### Eduque o usuário para que ele entenda o que é o modelo off-line

Off-line é um novo modelo mental para todos. Você precisa instruir seus usuários sobre quais mudanças ocorrerão quando eles não tiverem uma conexão. Informe-os sobre onde os dados grandes são salvos e forneça configurações para alterar o comportamento padrão. Certifique-se de usar vários componentes de design de IU, como linguagem informativa, ícones, notificações, cores e imagens para transmitir essas ideias coletivamente, em vez de depender de uma única escolha de design, como um ícone próprio, para contar a história toda.

## Fornece uma experiência offline por padrão

Se seu aplicativo não requer muitos dados, armazene esses dados em cache por padrão. Os usuários podem ficar cada vez mais frustrados se só puderem acessar seus dados com uma conexão de rede. Tente tornar a experiência o mais estável possível. Uma conexão instável fará com que seu aplicativo pareça não confiável, enquanto um aplicativo que diminui o impacto de uma falha de rede parecerá mágico para o usuário.

Os sites de notícias podem se beneficiar com o download e salvamento automáticos das notícias mais recentes, para que o usuário possa ler as notícias de hoje sem uma conexão, talvez baixando o texto sem as imagens do artigo. Além disso, adapte-se ao comportamento do usuário. Por exemplo, se a seção de esportes é o que eles costumam ver, faça disso o download prioritário.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/M39yiHQYpXacVII6d7zX.png", alt="Tailpiece informa o usuário que está offline com vários widgets de design", width="360", height="665" %} <figcaption> Se o dispositivo estiver off-line, Tailpiece irá notificar o usuário com uma mensagem de status...</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KpkzjYNoCWquWKXTvM28.png", alt="O Tailpiece tem um indicador visual que mostra quais seções estão prontas para uso off-line..", width="360", height="665" %} <figcaption> Informando que eles podem, pelo menos parcialmente, ainda usar o aplicativo.</figcaption></figure>

{% Aside %} Quando se trata de comunicar o status de um aplicativo, dizer "A rede está fora do ar" envia a mensagem de que a rede do aplicativo está com problemas, enquanto "Você está desconectado" deixa claro para o usuário que o problema está no lado dele. {% endAside %}

## Informe o usuário quando o aplicativo estiver pronto para consumo offline

Quando um aplicativo da web é carregado pela primeira vez, você precisa indicar ao usuário se ele está pronto para uso offline. Faça isso com um [widget que fornece um breve feedback](https://material.io/components/snackbars) sobre uma operação por meio de uma mensagem na parte inferior da tela, como, por exemplo, quando uma seção foi sincronizada ou um arquivo de dados foi baixado.

Pense novamente na linguagem que está usando para ter certeza de que é adequada para o seu público. Certifique-se de que a mensagem seja fornecida da mesma forma em todas as instâncias em que é usada. O termo offline geralmente é mal interpretado por um público não técnico, então use uma linguagem baseada em ação com a qual seu público possa se identificar.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fNOute6xBzFcDUNMeXDe.png", alt="Aplicativo de E/S off-line", width="360", height="664" %} <figcaption> O aplicativo Google E/S 2016 notifica o usuário quando o aplicativo está pronto para uso off-line...</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Od6jUnazP8n7CMe18G2C.png", alt="Site de status do Chrome está off-line", width="360", height="664" %} <figcaption>...e também o site Chrome Platform Status, que inclui informações sobre o armazenamento ocupado.</figcaption></figure>

### Torne a função 'salvar para off-line' uma parte óbvia da interface para aplicativos com muitos dados

Se um aplicativo usar grandes quantidades de dados, certifique-se de que haja uma chave ou pino para adicionar um item para uso off-line em vez de download automático, a menos que um usuário tenha solicitado especificamente esse comportamento por meio de um menu de configurações. Certifique-se de que o pino ou a IU de download não sejam obscurecidos por outros elementos da IU e que o recurso seja óbvio para o usuário.

Um exemplo seria um reprodutor de música que requer grandes arquivos de dados. O usuário está ciente do custo de dados associado, mas também pode querer usar o player offline. Baixar música para uso posterior requer que o usuário planeje com antecedência, portanto, pode ser necessária educação sobre isso durante a integração.

### Esclareça o que está disponível offline

Seja claro quanto à opção que você está fornecendo. Pode ser necessário mostrar uma guia ou configuração que mostra uma "biblioteca offline" ou [índice de conteúdo](/content-indexing-api/), para que o usuário possa ver facilmente o que armazenou em seu telefone e o que precisa ser salvo. Certifique-se de que as configurações sejam concisas e deixe claro onde os dados serão armazenados e quem tem acesso a eles.

### Mostra o custo real de uma ação

Muitos usuários equiparam a capacidade offline com 'download'. Os usuários em países onde as conexões de rede falham regularmente ou não estão disponíveis geralmente compartilham conteúdo com outros usuários ou salvam conteúdo para uso offline quando têm conectividade.

Os usuários em planos de dados podem evitar o download de arquivos grandes por medo do custo, portanto, você também pode desejar exibir um custo associado para que os usuários possam fazer uma comparação ativa para um arquivo ou tarefa específica. Por exemplo, se o aplicativo de música acima puder detectar se o usuário está em um plano de dados e mostrar o tamanho do arquivo para que os usuários possam ver o custo de um arquivo.

### Ajude a prevenir experiências hackeadas

Freqüentemente, os usuários invadem uma experiência sem perceber que estão fazendo isso. Por exemplo, antes dos aplicativos da web de compartilhamento de arquivos baseados em nuvem, era comum os usuários salvarem arquivos grandes e anexá-los a e-mails para que pudessem continuar editando em um dispositivo diferente. É importante não ser puxado para a experiência de hackeado, mas sim olhar para o que eles estão tentando alcançar. Em outras palavras, em vez de pensar em como você pode tornar a anexação de um arquivo grande mais amigável, resolva o problema de compartilhamento de arquivos grandes em vários dispositivos.

## Torne as experiências transferíveis de um dispositivo para outro

Ao construir para redes instáveis, tente sincronizar assim que a conexão melhorar para que a experiência seja transferível. Por exemplo, imagine um aplicativo de viagens perdendo uma conexão de rede no meio de uma reserva. Quando a conexão é restabelecida, o aplicativo sincroniza com a conta do usuário, permitindo que ele continue sua reserva em seu dispositivo desktop. Não poder transferir experiências pode ser incrivelmente chocante para os usuários.

Informa o usuário sobre o estado atual de seus dados. Por exemplo, você pode mostrar se o aplicativo foi sincronizado. Eduque-os sempre que possível, mas tente não sobrecarregá-los com mensagens.

## Crie experiências de design inclusivas

Ao projetar, procure ser inclusivo, fornecendo dispositivos de design significativos, linguagem simples, iconografia padrão e imagens significativas que guiarão o usuário para concluir a ação ou tarefa em vez de impedir seu progresso.

### Use uma linguagem simples e concisa

Uma boa UX não se trata apenas de uma interface bem projetada. Inclui o caminho que o usuário segue, bem como as palavras usadas no aplicativo. Evite jargões técnicos ao explicar o estado do aplicativo ou de componentes individuais da IU. Considere que a frase "aplicativo offline" pode não transmitir ao usuário o estado atual do aplicativo.

<div class="switcher">{% Compare 'worse' %} <figure style="display: inline-block; max-width: 45%;"> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MaYiuInHsZ2mbPQcbD4l.png", alt="Um ícone de service worker é um mau exemplo", width="350", height="149" %} <figcaption> Evite termos que não sejam inteligíveis para usuários sem conhecimento técnico.</figcaption></figure> {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better' %}</p>
<div data-md-type="block_html">
<figure style="display: inline-block; max-width: 45%;"> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZIjYKLFK5DbrDJDJeDqu.png", alt="Um ícone de download é um bom exemplo", width="350", height="149" %} <figcaption> Use uma linguagem e imagens que descrevam a ação.</figcaption> </figure> {% endCompare %}</div>

### Use vários dispositivos de design para criar experiências de usuário acessíveis

Use linguagem, cor e componentes visuais para demonstrar uma mudança de estado ou status atual. O uso exclusivo de cores para demonstrar o estado pode não ser percebido pelo usuário e pode estar inacessível para usuários com deficiência visual. Além disso, o instinto dos designers é usar a IU acinzentada para representar off-line, mas isso pode ter um significado carregado na web. A IU acinzentada, como elementos de entrada em um formulário, também significa que um elemento está desabilitado. Isso pode causar confusão se você usar *apenas* cores para representar o estado.

Para evitar mal-entendidos, expresse diferentes estados para o usuário de várias maneiras, por exemplo, com cores, rótulos e componentes de IU.

<div class="switcher">{% Compare 'worse' %} <figure style="display: inline-block; max-width: 45%;"> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Uj28SN1ZepiIvya4YTe1.png", alt="Um exemplo ruim apenas usando cores.", width="720", height="368" %} <figcaption>  Use a cor como único meio de descrever o que está acontecendo. </figcaption> </figure> {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better' %}</p>
<div data-md-type="block_html">
<figure style="display: inline-block; max-width: 45%;"> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/s78eC2GBEkDQouqhBYMO.png", alt="Um bom exemplo que usa cor e texto para mostrar um erro.", width="720", height="368" %} <figcaption> Use uma mistura de elementos de design para transmitir significado </figcaption> </figure> {% endCompare %}</div>

### Use ícones que transmitam significado

Certifique-se de que as informações sejam transmitidas corretamente com rótulos de texto significativos, bem como ícones. Ícones por si só podem ser problemáticos, uma vez que o conceito de off-line na web é relativamente novo. Os usuários podem interpretar mal os ícones usados por conta própria. Por exemplo, usar um disquete para salvar faz sentido para uma geração mais velha, mas os usuários mais jovens que nunca viram um disquete podem ficar confusos com a metáfora. Da mesma forma, o ícone do menu 'hambúrguer' costuma confundir os usuários quando apresentado sem um rótulo.

Ao introduzir um ícone off-line, tente permanecer consistente com os visuais padrão da indústria (quando existirem), além de fornecer um rótulo de texto e uma descrição. Por exemplo, salvar para offline pode ser um ícone de download típico ou, se a ação envolver a sincronização, pode ser um ícone de sincronização. Algumas ações podem ser interpretadas como salvamento para offline em vez de demonstrar o status de uma rede. Pense na ação que você está tentando transmitir, em vez de apresentar ao usuário um conceito abstrato. Por exemplo, salvar ou baixar dados seria baseado em ações.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/h2FFD3nLIOdSzWg5H5kO.png", alt="Diversos exemplos de ícones que transmitem a ideia de conteúdo off-line", width="700", height="299" %}

Off-line pode significar uma série de coisas, dependendo do contexto, como baixar, exportar, fixar, etc. Para obter mais inspiração, verifique o [conjunto de ícones do Material Design](https://material.io/resources/icons/).

### Use layouts de esqueleto com outros mecanismos de feedback

Um layout de esqueleto é essencialmente uma versão wireframe de seu aplicativo que é exibida enquanto o conteúdo está sendo carregado. Isso ajuda a demonstrar ao usuário que o conteúdo está prestes a ser carregado. Considere também o uso de uma IU do pré-carregador, com um rótulo de texto informando ao usuário que o aplicativo está sendo carregado. Um exemplo seria pulsar o conteúdo do wireframe, dando ao aplicativo a sensação de que está vivo e carregando. Isso garante ao usuário que algo está acontecendo e ajuda a evitar reenvios ou atualizações de seu aplicativo.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/pUIrcbblhHe5YPSrrwRy.png", alt="Um exemplo de layout de esqueleto", width="360", height="665" %} <figcaption> O esqueleto do layout do espaço reservado é mostrado durante o download do artigo...</figcaption></figure><figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rRLScscdU9BE9Wt4RYAx.png", alt="Um exemplo de artigo carregado", width="360", height="665" %} <figcaption>...que é substituído pelo conteúdo real assim que o download termina.</figcaption></figure>

### Não bloqueie o conteúdo

Em alguns aplicativos, um usuário pode acionar uma ação, como a criação de um novo documento. Alguns aplicativos tentarão se conectar a um servidor para sincronizar o novo documento e para demonstrar isso, eles exibem uma caixa de diálogo modal de carregamento intrusiva que cobre toda a tela. Isso pode funcionar bem se o usuário tiver uma conexão de rede estável, mas se a rede estiver instável, ele não conseguirá escapar dessa ação e a IU efetivamente os impede de fazer qualquer outra coisa. As solicitações de rede que bloqueiam o conteúdo devem ser evitadas. Permita que o usuário continue a navegar em seu aplicativo e a enfileirar tarefas que serão realizadas e sincronizadas assim que a conexão for aprimorada.

Demonstre o estado de uma ação fornecendo feedback aos usuários. Por exemplo, se um usuário estiver editando um documento, considere alterar o design do feedback para que fique visivelmente diferente de quando eles estão online, mas ainda mostre que o arquivo foi "salvo" e será sincronizado quando eles tiverem uma conexão de rede. Isso instruirá o usuário sobre os diferentes estados disponíveis e garantirá que sua tarefa ou ação foi armazenada. Isso tem o benefício adicional de o usuário ficar mais confiante no uso de seu aplicativo.

## Projete para o próximo bilhão

Em muitas regiões, dispositivos de baixo custo são comuns, a conectividade não é confiável e, para muitos usuários, os dados são inacessíveis. Você precisará conquistar a confiança do usuário sendo transparente e frugal com os dados. Pense em maneiras de ajudar os usuários com conexões ruins e simplificar a interface para ajudar a acelerar as tarefas. Sempre tente perguntar aos usuários antes de baixar conteúdo com muitos dados.

Oferece opções de baixa largura de banda para usuários em conexões lentas. Portanto, se a conexão de rede for lenta, forneça pequenos recursos. Oferece a opção de escolher ativos de alta ou baixa qualidade.

## Conclusão

A educação é fundamental para a experiência do usuário offline, pois os usuários não estão familiarizados com esses conceitos. Tente criar associações com coisas que são familiares, por exemplo, baixar para uso posterior é o mesmo que colocar dados off-line.

Ao projetar para conexões de rede instáveis, lembre-se destas diretrizes:

- Pense em como você projeta para o sucesso, o fracasso e a instabilidade de uma conexão de rede.
- Os dados podem ser caros, portanto, seja atencioso com o usuário.
- Para a maioria dos usuários globalmente, o ambiente de tecnologia é quase exclusivamente móvel.
- Dispositivos de baixo custo são comuns, com armazenamento, memória e poder de processamento limitados, telas pequenas e menor qualidade de tela sensível ao toque. Certifique-se de que o desempenho faça parte do seu processo de design.
- Permita que os usuários naveguem em seu aplicativo quando estiverem offline.
- Informe os usuários sobre seu estado atual e sobre as mudanças nos estados.
- Tente fornecer offline por padrão se seu aplicativo não requer muitos dados.
- Se o aplicativo tiver muitos dados, instrua os usuários sobre como eles podem fazer o download para uso off-line.
- Torne as experiências transferíveis entre dispositivos.
- Utilize linguagem, ícones, imagens, tipografia e cores para expressar ideias ao usuário coletivamente.
- Assegure confiança e feedback para ajudar o usuário.
