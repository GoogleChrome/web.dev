---
layout: post
title: O que é conteúdo misto?
authors:
  - johyphenel
  - rachelandrew
date: 2019-09-07
updated: 2020-09-24
description: |2-

  O conteúdo misto ocorre quando o HTML inicial é carregado por meio de uma conexão HTTPS segura,
  mas outros recursos são carregados por meio de uma conexão HTTP insegura.
tags:
  - security
  - network
  - privacy
  - html
  - css
  - javascript
  - images
  - media
---

O **conteúdo misto** ocorre quando o HTML inicial é carregado por meio de uma conexão [HTTPS](/why-https-matters/) segura, mas outros recursos (como imagens, vídeos, folhas de estilo, scripts) são carregados por meio de uma conexão HTTP insegura. Isso é chamado de conteúdo misto porque os conteúdos HTTP e HTTPS estão sendo carregados para exibir a mesma página, e a solicitação inicial era segura por HTTPS.

Solicitar subrecursos usando o protocolo inseguro HTTP diminui a segurança de toda a página, pois essas solicitações são vulneráveis a [**ataques on-path**](https://www.ietf.org/rfc/rfc7835.html#section-2.1.1), em que um invasor escuta uma conexão de rede e visualiza ou modifica a comunicação entre as duas partes. Usando esses recursos, os invasores podem rastrear os usuários e substituir o conteúdo em um site e, no caso de conteúdo misto ativo, assumir o controle total da página, não apenas dos recursos inseguros.

Embora muitos navegadores exibam avisos de conteúdo misto ao usuário, quando isso acontece, é tarde demais: as solicitações inseguras já foram realizadas, e a segurança da página está comprometida.

É por isso que os navegadores estão bloqueando cada vez mais conteúdo misto. Se você misturou conteúdo em seu site, corrigir esse problema garantirá que o conteúdo continue sendo carregado à medida que os navegadores vão ficando mais restritos.

## Os dois tipos de conteúdo misto

Os dois tipos de conteúdo misto são: ativo e passivo.

**Conteúdo misto passivo** refere-se ao conteúdo que não interage com o resto da página e, portanto, os invasores que usam o ataque man-in-the-middle têm restrições quanto ao que podem fazer se interceptarem ou alterarem esse conteúdo. O conteúdo misto passivo é definido como conteúdo de imagens, vídeo e áudio.

O **conteúdo misto ativo** interage com a página como um todo e permite que um invasor faça quase tudo com a página. O conteúdo misto ativo inclui scripts, folhas de estilo, iframes e outros códigos que o navegador pode baixar e executar.

### Conteúdo misto passivo

O conteúdo misto passivo é visto como menos problemático, mas ainda representa uma ameaça à segurança para seu site e usuários. Por exemplo, um invasor pode interceptar solicitações HTTP de imagens em seu site e trocá-las ou substituí-las; o invasor pode trocar as imagens dos botões *salvar* e *excluir*, fazendo com que os usuários excluam conteúdo sem querer; pode substituir os diagramas de produtos por conteúdo obsceno ou pornográfico, desfigurando seu site; ou pode substituir as fotos de produtos por anúncios de um site ou produto diferente.

Mesmo que o invasor não altere o conteúdo do site, ele pode rastrear os usuários por meio de solicitações de conteúdo misto. O invasor pode saber quais páginas um usuário visita e quais produtos ele visualiza com base em imagens ou outros recursos carregados pelo navegador.

Se houver conteúdo misto passivo, a maioria dos navegadores indicará na barra de URL que a página não é segura, mesmo se página tiver sido carregada por HTTPS. Você pode observar esse comportamento com esta [demonstração](https://passive-mixed-content.glitch.me/), que contém exemplos de conteúdo misto passivo.

Até recentemente, o conteúdo misto passivo era carregado em todos os navegadores, pois bloqueá-lo teria deixado muitos sites inutilizáveis. Agora, isso está começando a mudar e, por isso, é essencial atualizar todas as instâncias de conteúdo misto em seu site.

[O Chrome está lançando atualmente](https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html) uma atualização automática de conteúdo misto passivo, sempre que possível. Com a atualização automática, se o ativo estiver disponível por HTTPS, mas tiver sido fixado no código como HTTP, o navegador carregará a versão HTTPS. Se nenhuma versão segura for encontrada, o ativo não será carregado.

Sempre que detecta conteúdo misto ou atualiza automaticamente conteúdo misto passivo, o Chrome registra mensagens detalhadas na guia **Problemas** das DevTools para orientar você sobre como corrigir o problema específico.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HNxoomaHi2ksvYHGuNiE.jpg", alt="A guia Problemas no Chrome DevTools mostra informações detalhadas sobre o problema de conteúdo misto específico e como corrigi-lo", width="800", height="310" %}</figure>

### Conteúdo misto ativo

O conteúdo misto ativo representa uma ameaça maior do que o conteúdo misto passivo. Um invasor pode interceptar e reescrever o conteúdo ativo, assumindo assim o controle total de sua página ou mesmo de todo o site. Isso permite que o invasor altere qualquer coisa na página, incluindo a exibição de conteúdo totalmente diferente, roubo de senhas de usuário ou outras credenciais de login, roubo de cookies da sessão dos usuários ou redirecionamento do usuário para um site totalmente diferente.

Devido à gravidade dessa ameaça, a maioria dos navegadores já bloqueia esse tipo de conteúdo por padrão para proteger os usuários, mas a funcionalidade varia entre os fornecedores e versões dos navegadores.

Esta outra [demonstração](https://active-mixed-content.glitch.me/) contém exemplos de conteúdo misto ativo. [Carregue o exemplo por HTTP](http://active-mixed-content.glitch.me/) para ver o conteúdo que é bloqueado quando você [carrega o exemplo por HTTPS](https://active-mixed-content.glitch.me/). O conteúdo bloqueado também será detalhado na guia **Problemas.**

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xRG5zpKLr0Z3OwfYpn2H.jpg", alt="A guia Problemas no Chrome DevTools mostra informações detalhadas sobre o problema de conteúdo misto específico e como corrigi-lo", width="800", height="361" %}</figure>

{% Aside %} Os navegadores também destacam o conteúdo bloqueado no DevTools. Problemas de conteúdo bloqueado são detalhados na guia **Problemas** em navegadores baseados no Chromium. O Firefox e o Safari registram mensagens no console. {% endAside %}

## Especificação de conteúdo misto

Os navegadores seguem a [especificação de conteúdo misto](https://w3c.github.io/webappsec-mixed-content/), que define o [**conteúdo opcionalmente bloqueável**](https://w3c.github.io/webappsec-mixed-content/#optionally-blockable-mixed-content) e as categorias de [**conteúdo bloqueável.**](https://w3c.github.io/webappsec-mixed-content/#category-blockable)

De acordo com as especificações, um recurso se qualifica como conteúdo opcionalmente bloqueável "quando o risco de permitir seu uso como conteúdo misto é superado pelo risco de inutilizar partes significativas da web"; este é um subconjunto da categoria de conteúdo misto passivo descrita acima.

Todo conteúdo que não seja **opcionalmente bloqueável** é considerado **bloqueável** e deve ser bloqueado pelo navegador.

{% Aside %} Há um [nível 2 da especificação de conteúdo misto](https://w3c.github.io/webappsec-mixed-content/level2.html) em andamento, que adicionará atualização automática à especificação. {% endAside %}

Nos últimos anos, o [uso de HTTPS aumentou dramaticamente](https://transparencyreport.google.com/https/overview) e se tornou o padrão da web. Agora, isso torna mais viável para os navegadores considerarem o bloqueio de todo o conteúdo misto, mesmo aqueles tipos de subrecursos definidos na [especificação de conteúdo misto](https://w3c.github.io/webappsec/specs/mixedcontent/) como **opcionalmente bloqueáveis**. É por isso que agora vemos o Chrome adotando uma abordagem mais rígida quanto a esses subrecursos.

### Navegadores mais antigos

É importante lembrar que nem todos os visitantes do seu site usam os navegadores mais atualizados. Versões diferentes de fornecedores de navegadores diferentes tratam o conteúdo misto de maneira diferente. Na pior das hipóteses, navegadores e versões mais antigos não bloqueiam nenhum conteúdo misto, o que é muito perigoso para o usuário.

Ao corrigir os problemas de conteúdo misto, você garante que o conteúdo fique visível em novos navegadores. Você também ajuda a proteger os usuários contra conteúdo perigoso que não é bloqueado por navegadores mais antigos.
