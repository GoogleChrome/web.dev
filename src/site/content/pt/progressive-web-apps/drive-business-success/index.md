---
layout: post
title: Como os Progressive Web Apps podem impulsionar o sucesso dos negócios
authors:
  - sfourault
date: 2020-05-20
updated: 2020-05-20
description: Crie um caso de negócios sólido para seu PWA. Saiba quando você deve investir e como pode medir seu sucesso.
tags:
  - progressive-web-apps
---

Os Progressive Web Apps estão no roteiro de muitas empresas para modernizar seus sites e se adaptar às novas expectativas dos usuários. Como todos os novos conceitos e capacidades técnicas, eles levantam questões: é isso que meus clientes querem, quanto vai crescer meu negócio, o que é tecnicamente viável?

{% Img src="image/admin/o70RxMcAQVPrjxH34a8r.jpg", alt="Identifique seus participantes", width="800", height="254" %}

Para moldar sua estratégia digital, geralmente há vários participantes envolvidos: o gerente de produto e o CMO são coproprietários do impacto comercial de cada recurso, o CTO avalia a viabilidade e a confiabilidade de uma tecnologia, os pesquisadores de experiência do usuário confirmam que um recurso responde a um problema real do cliente.

Este artigo tem como objetivo ajudá-lo a responder a essas três perguntas e a moldar seu projeto de PWA. Você começará a partir das necessidades do cliente, traduzirá isso em recursos de PWA e se concentrará em medir o impacto comercial que cada recurso proporciona.

## Os PWAs resolvem as necessidades do cliente {: #solução-necessidades-cliente }

Uma regra que adoramos seguir no Google ao criar produtos é "[concentre-se no usuário e todo o resto vai dar certo](https://www.google.com/about/philosophy.html)". Pense *primeiro no usuário* : quais são as necessidades dos meus clientes e como um PWA as fornece?

{% Img src="image/admin/TcmXmWb5mSUqal98NIAH.jpg", alt="Identificar as necessidades do cliente", width="800", height="262" %}

Ao fazer a pesquisa do usuário, encontramos alguns padrões interessantes:

- Os usuários odeiam atrasos e falta de confiabilidade em dispositivos móveis: o nível de estresse causado por atrasos em dispositivos móveis é [comparável a assistir a um filme de terror](https://blog.hubspot.com/marketing/mobile-website-load-faster).
- Cinquenta por cento dos usuários de smartphones são mais propensos a usar a versão móvel do site de uma empresa ao navegar ou fazer compras porque [não desejam baixar um aplicativo](https://www.thinkwithgoogle.com/data/smartphone-user-mobile-shopping-preferences/).
- Um dos principais motivos para desinstalar um aplicativo é o [armazenamento limitado](https://www.thinkwithgoogle.com/data/why-users-uninstall-travel-apps/) (enquanto um PWA instalado geralmente ocupa menos de 1 MB).
- Os usuários de smartphones são mais propensos a comprar em sites móveis que [oferecem recomendações relevantes](https://www.thinkwithgoogle.com/data/smartphone-mobile-app-and-site-purchase-data/) sobre produtos, e 85% dos usuários de smartphones dizem que [as notificações móveis são úteis](https://www.thinkwithgoogle.com/data/smartphone-user-notification-preferences/).

De acordo com essas observações, descobrimos que os clientes preferem experiências que sejam rápidas, instaláveis, confiáveis e envolventes (F.I.R.E)!

## Os PWAs aproveitam os recursos modernos da web {: #capacidades-modernas }

Os PWAs fornecem um conjunto de práticas recomendadas e APIs da web modernas que visam atender às necessidades de seus clientes, tornando seu site rápido, instalável, confiável e envolvente.

Por exemplo, usar um trabalho de serviço para [armazenar seus recursos em cache](/service-workers-cache-storage/) e fazer uma [pré-busca preditiva](/precache-with-workbox/) torna seu site mais rápido e confiável. Tornar seu site instalável fornece uma maneira fácil para seus clientes acessarem diretamente na sua tela inicial ou inicializador de aplicativo. E novas APIs, como [Web Push Notifications,](https://developer.mozilla.org/docs/Web/API/Push_API/Best_Practices) tornam mais fácil envolver novamente seus usuários com conteúdo personalizado para gerar fidelidade.

{% Img src="image/admin/rP0eNCflNYOhzjPi1Lq5.jpg", alt="Melhorando a experiência do usuário com novos recursos", width="800", height="393" %}

## Entenda o impacto nos negócios {: #impacto-negócios }

A definição de sucesso do negócio pode ser uma série de coisas, dependendo da sua atividade:

- Usuários que passam mais tempo em seu serviço
- Taxas de rejeição reduzidas para seus clientes potenciais
- Taxas de conversão aprimoradas
- Mais visitantes recorrentes

A maioria dos projetos de PWA resulta em uma taxa de conversão móvel mais alta e você pode aprender mais com os diversos [estudos de caso de PWA](https://www.pwastats.com/). Dependendo dos seus objetivos, você pode priorizar alguns aspectos do PWA que façam mais sentido para o seu negócio, e está tudo bem. Os recursos do PWA podem ser escolhidos a dedo e iniciados separadamente.

Vamos medir o impacto comercial de cada um desses excelentes recursos do F.I.R.E.

### O impacto comercial de um site rápido {: # impact-fast}

Um [estudo recente da Deloitte Digital](https://www2.deloitte.com/ie/en/pages/consulting/articles/milliseconds-make-millions.html) mostra que a velocidade da página tem um impacto significativo nas métricas de negócios.

Há muito que você pode fazer para otimizar a velocidade do seu site e otimizar as jornadas críticas para todos os seus usuários. Se você não sabe por onde começar, dê uma olhada em nossa [seção Rápido](/fast/) e use o [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) para priorizar as coisas mais importantes a serem consertadas.

Ao trabalhar em suas otimizações de velocidade, comece a medir a velocidade de seu site frequentemente com ferramentas e métricas apropriadas para monitorar seu progresso. Por exemplo, meça suas métricas com o [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/), fixe metas claras, como ter [pontuações "Boas" no Core Web Vitals](/vitals/#core-web-vitals), e incorpore um [orçamento de desempenho em seu processo de construção](/incorporate-performance-budgets-into-your-build-tools/). Graças às suas medições diárias e [à metodologia do "valor da velocidade"](/value-of-speed/), você pode isolar o impacto de suas mudanças incrementais de velocidade e calcular quanta receita extra seu trabalho gerou.

{% Img src="image/admin/yyRfQaDL3NcGhB0f79RN.jpg", alt="Meça o valor da velocidade e correlacione-o com as conversões", width="800", height="306" %}

O Ebay tornou a [velocidade um objetivo da empresa](/shopping-for-speed-on-ebay/) para 2019. Eles usaram técnicas como orçamento de desempenho, otimização de caminho crítico e pré-busca preditiva. Concluíram que, para cada 100 milissegundos de melhoria no tempo de carregamento da página de pesquisa, a contagem de adicionar ao cartão aumentava 0,5%.

{% Img src="image/admin/Qq3wo5UOqzC1ugnTzdqT.jpg", alt="Uma melhoria de 100 ms no tempo de carregamento resultou em um aumento de 0,5% na contagem de adicionar ao carrinho para o eBay", width="800", height="184" %}

### O impacto comercial de um site instalável {: #impacto-instalável }

Por que você deseja que um usuário instale seu PWA? Para facilitar o retorno ao seu site, em que a instalação de um aplicativo Android adicionaria pelo menos três etapas (redirecionamento para Play Store, download, relançamento do aplicativo Android na parte superior do funil). A instalação do PWA é feita perfeitamente com um clique e não afasta o usuário o funil de conversão atual.

{% Img src="image/admin/u1jcKrBBOHEzSz3SqhEB.jpg", alt="A experiência de instalação deve ser perfeita", width="800", height="239" %}

Depois de instalado, os usuários podem iniciá-lo com um clique no ícone em sua tela inicial, vê-lo na bandeja de aplicativos quando alternam entre os aplicativos, ou encontrá-lo por meio de um resultado de pesquisa de aplicativo. Chamamos esse aplicativo dinâmico de Discover-Launch-Switch, e tornar seu PWA instalável é a chave para desbloquear o acesso.

Além de ser acessível a partir de superfícies de descoberta e inicialização familiares em seus dispositivos, um PWA é iniciado exatamente como um aplicativo específico de plataforma: em uma experiência autônoma, separada do navegador. Além disso, se beneficia de serviços de dispositivo de nível de sistema operacional, como o alternador de aplicativos e configurações.

Os usuários que instalam seu PWA são provavelmente os usuários mais engajados, com melhores métricas de engajamento do que visitantes casuais, incluindo mais visitas repetidas, mais tempo no site e taxas de conversão mais altas, muitas vezes em paridade com usuários de aplicativos específicos da plataforma em dispositivos móveis.

Para tornar seu PWA instalável, ele precisa atender aos [critérios básicos](/install-criteria/). Assim que atender a esses critérios, você pode [promover a instalação](/promote-install/) em sua experiência de usuário em desktops e dispositivos móveis, incluindo iOS.

{% Img src="image/admin/5sH5YX7kFrwv4f6duqVf.jpg", alt="PWAs são instaláveis em qualquer lugar", width="800", height="227" %}

Depois de começar a promover a instalação de seu PWA, você deve medir quantos usuários estão instalando seu PWA e como eles usam seu PWA.

Para maximizar o número de usuários que instalam seu site, você pode querer [testar diferentes](https://pwa-book.awwwards.com/chapter-4) mensagens de promoção ("instale em um segundo" ou "adicione nosso atalho para acompanhar seu pedido", por exemplo), diferentes canais (faixa de cabeçalho, no feed) e tentar oferecê-lo em diferentes etapas do funil (na segunda página visitada ou após uma reserva).

Para entender de onde seus usuários estão saindo e como melhorar a retenção, o funil de instalação pode ser [medido](https://pwa-book.awwwards.com/chapter-8) de quatro maneiras:

- Número de usuários qualificados para instalar
- Número de usuários que clicaram no prompt de instalação da IU
- Número de usuários que aceitaram e recusaram a instalação
- Número de usuários que instalaram com sucesso

Você pode começar a promover a instalação do PWA para todos os usuários ou usar uma abordagem mais cautelosa, experimentando apenas com um pequeno grupo de usuários.

Depois de alguns dias ou semanas, você já deve ter alguns dados para medir o impacto em seu negócio. Qual é o comportamento das pessoas provenientes do atalho instalado? Elas se envolvem mais, convertem mais?

Para segmentar os usuários que instalaram seu PWA, rastreie o evento [`appinstalled`](/customize-install/#detect-install) e use o JavaScript para [verificar se os usuários estão no modo autônomo](/customize-install/#detect-launch-type) (indicando o uso do PWA instalado). Em seguida, use-os como variáveis ou dimensões para seu rastreamento analítico.

{% Img src="image/admin/H2U4jKTmATNzVJQ3WNCO.jpg", alt="Meça o valor da instalação", width="800", height="253" %}

O [estudo de caso da Weekendesk](https://www.thinkwithgoogle.com/_qs/documents/8971/Weekendesk_PWA_-_EXTERNAL_CASE_STUDY.pdf) é interessante: eles propõem a instalação na segunda página visitada para maximizar a taxa de instalação e observam que os clientes que voltam por meio do ícone na tela inicial têm duas vezes mais chances de reservar uma estadia com eles.

{% Img src="image/admin/eR23C2o1adHq5tATNw34.jpg", alt="Os usuários instalados tiveram uma taxa de conversão 2,5x maior", width="800", height="201" %}

A instalação é uma ótima maneira de fazer as pessoas retornarem ao seu site e aumentar a fidelidade do cliente. Você também pode pensar em personalizar a experiência para esses usuários premium.

Mesmo se você já tiver um aplicativo específico de plataforma, você pode testar para oferecer seu aplicativo primeiro e, em seguida, enviar o PWA mais tarde para aqueles que recusaram ou não se envolveram com a faixa de instalação do aplicativo. Alguns de seus usuários que estão "semiengajados" podem não atingir o limite para uma instalação baseada na loja de aplicativos. Esse coorte pode ser resolvido com a instalabilidade do PWA, que geralmente é percebida como mais leve e com menos atrito.

{% Img src="image/admin/iNQalNPhjdBueuqPHiad.jpg", alt="PWAs podem alcançar usuários semiengajados", width="800", height="229" %}

### O impacto comercial de um site confiável {: #impacto-confiável }

O jogo Chrome Dino, oferecido quando o usuário está off-line, é jogado mais de [270 milhões de vezes](https://www.blog.google/products/chrome/chrome-dino/) por mês. Este número impressionante mostra que a confiabilidade da rede é uma oportunidade considerável, especialmente em mercados com dados móveis não confiáveis ou caros, como Índia, Brasil, México ou Indonésia.

Quando um aplicativo instalado de uma loja de aplicativos é iniciado, os usuários esperam que ele seja aberto, independentemente de estarem conectados à nternet. Os Progressive Web Apps não devem ser diferentes.

No mínimo, uma página off-line simples que informa ao usuário que o aplicativo não está disponível sem uma conexão de rede deve ser proporcionada. Em seguida, considere levar a experiência um passo adiante, fornecendo algumas [funcionalidades que fazem sentido enquanto você estiver off-line](https://pwa-book.awwwards.com/chapter-6). Por exemplo, fornecer acesso a bilhetes ou cartões de embarque, listas de desejos off-line, informações de contato da central de atendimento, artigos ou receitas que o usuário viu recentemente, etc.

{% Img src="image/admin/ubglZLCoddAfB5cl8JSz.jpg", alt="Seja útil, mesmo quando off-line", width="800", height="243" %}

Depois de implementar uma [experiência de usuário confiável](https://pwa-book.awwwards.com/chapter-6), você pode querer medi-la. Quantos usuários ficam off-line, em quais locais geográficos, eles permanecem no site quando a rede está de volta?

O uso off-line pode ser medido gravando pings analíticos quando o usuário fica [off-line ou on-line](https://pwa-book.awwwards.com/chapter-8). Informa quantos usuários continuam navegando no seu site depois que a rede volta.

{% Img src="image/admin/UfjYsWQWJjVIk2sp5bnE.jpg", alt="Trivago viu que 67% dos usuários que voltaram a ficar on-line continuaram navegando", width="800", height="272" %}

O [estudo de caso do Trivago](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/case-studies/trivago-embrace-progressive-web-apps-as-the-future-of-mobile/) ilustra como isso pode impactar seus objetivos de negócio: para os usuários cujas sessões foram interrompidas por um período off-line (cerca de três por cento dos usuários), 67% dos que voltaram a ficar on-line continuaram navegando no site.

### O impacto comercial de um site envolvente {: #impacto-envolvente }

As notificações por push da web permitem que os usuários optem por atualizações oportunas de sites que amam e permitem que você os reconecte efetivamente com conteúdo personalizado e relevante.

Mas tenha cuidado. Pedir aos usuários que se inscrevam para receber notificações da web assim que chegarem e sem expor os benefícios pode ser considerado spam e afetar negativamente sua experiência. Certifique-se de seguir as [práticas recomendadas](https://developers.google.com/web/fundamentals/push-notifications/permission-ux) ao solicitar notificações e inspirar aceitação por meio de usos relevantes, como atrasos de trens, rastreamento de preços, produtos fora de estoque, etc.

Tecnicamente, as [notificações por push](https://developers.google.com/web/fundamentals/push-notifications/) na web são executadas em segundo plano graças a um trabalho de serviço e costumam ser enviadas por um sistema criado para gerenciar campanhas (por exemplo, Firebase). Esse recurso traz grande valor de negócios para usuários de celular (Android) e desktop: aumenta as visitas repetidas e, consequentemente, as vendas e conversões.

Para medir a eficácia de suas campanhas por push, você precisa medir todo o funil:

- Número de usuários qualificados para notificações por push
- Número de usuários que clicam em um prompt de IU de notificação personalizada
- Número de usuários que concedem permissão de notificação por push
- Número de usuários que recebem notificações por push
- Número de usuários que se envolvem com notificações
- Conversão e engajamento de usuários provenientes de uma notificação

{% Img src="image/admin/UpzfxBDi3e66cZ9gzkkS.jpg", alt="Medir o valor das notificações por push da web", width="800", height="255" %}

Existem muitos estudos de caso excelentes sobre notificações por push na web, como o [Carrefour, que multiplicou sua taxa de conversão por 4,5](https://useinsider.com/case-studies/carrefour/) ao envolver novamente os usuários com carrinhos abandonados.

## O P no PWA: um lançamento progressivo, recurso por recurso {: #recurso-por-recurso }

Os PWAs são sites modernos que se beneficiam do enorme alcance da web, combinado com todos os recursos amigáveis que os usuários adoram em aplicativos para Android/iOS/desktop. Eles alavancam um conjunto de melhores práticas e APIs da web modernas, que podem ser implementadas de forma independente, dependendo das especificidades e prioridades de seus negócios.

{% Img src="image/admin/7g1j2z7h5m9QSHQhHceM.jpg", alt="Inicie progressivamente seu PWA", width="800", height="253" %}

Para acelerar a modernização do seu site e torná-lo um verdadeiro PWA, incentivamos que você seja ágil: lance recurso por recurso. Primeiro, pesquise com seus usuários quais recursos trariam mais valor para eles, depois entregue isso aos designers e desenvolvedores e, por fim, não se esqueça de medir com precisão quanto dinheiro extra seu PWA gerou.
