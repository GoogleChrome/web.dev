---
layout: post
title: Padrões para promover a instalação de PWAs
authors:
  - pjmclachlan
  - mustafakurtuldu
date: 2019-06-04
updated: 2020-06-17
description: |2-

  Como promover a instalação de Progressive Web Apps e as práticas recomendadas.
tags:
  - progressive-web-apps
feedback:
  - api
---

A instalação do Progressive Web App (PWA) pode facilitar a descoberta e o uso pelos usuários. Mesmo com a promoção no navegador, alguns usuários não percebem que podem instalar um PWA, então pode ser útil fornecer uma experiência no app para promover e habilitar a instalação do seu PWA.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PtJp54jasjOYyh9Soqzu.png", alt="Captura de tela de um botão de instação simples no PWA.", width="800", height="368" %} <figcaption> Um botão de instalação simples fornecido no seu PWA.</figcaption></figure>

Esta lista não é exaustiva, mas oferece um ponto de partida para as diversas maneiras de promover a instalação do seu PWA. Independentemente do padrão, *ou padrões*, que você usa, todos eles levam ao mesmo código que aciona o fluxo de instalação, documentado em [Como fornecer sua própria experiência de instalação no app](/customize-install/).

<div class="w-clearfix"> </div>

## Práticas recomendadas para promover a instalação do PWA {: #best-practices }

Algumas práticas recomendadas são aplicáveis independentemente dos padrões promocionais usados no seu site.

- Mantenha as promoções fora do fluxo das jornadas do usuário. Por exemplo, em uma página de login do PWA, coloque a call to action (chamada para ação) abaixo do formulário de login e do botão de envio. O uso intrusivo de padrões promocionais reduz a usabilidade do PWA e afeta negativamente as métricas de engajamento.
- Inclua a capacidade de dispensar ou recusar a promoção. Lembre-se dessa preferência do usuário e apenas exiba a promoção novamente se houver uma mudança na relação do usuário com seu conteúdo, como o login ou a finalização de uma compra.
- Combine mais de uma dessas técnicas em diferentes partes do PWA, mas tome cuidado para não sobrecarregar ou irritar seu usuário com a promoção da instalação.
- Mostre a promoção somente **depois** que o [evento `beforeinstallprompt`](/customize-install/#beforeinstallprompt) for disparado.

## Promoção automática no navegador {: #browser-promotion }

Quando [determinados critérios](/install-criteria/) são atendidos, a maioria dos navegadores indica automaticamente ao usuário que o Progressive Web App pode ser instalado. Por exemplo, o Chrome para desktop mostra um botão de instalação na omnibox.

<div class="switcher">
  <figure id="browser-install-promo">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zIfRss5zOrZ49c4VdJ52.png", alt="Captura de tela da omnibox com o indicador de instalação visível.", width="800", height="307" %} <figcaption> Promoção de instalação fornecida pelo navegador (desktop)</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kRjcsxlHDZa9Nqg2Fpei.png", alt="Captura de tela da promoção de instalação fornecida pelo navegador.", width="800", height="307" %} <figcaption> Promoção de instalação fornecida pelo navegador (dispositivos móveis)</figcaption></figure>
</div>

<div class="w-clearfix"> </div>

O Chrome para Android mostrará uma minibarra de informações ao usuário. Isso possa ser evitado ao chamar `preventDefault()` no evento `beforeinstallprompt`. Se você não chamar `preventDefault()`, o banner será mostrado na primeira vez que um usuário acessar seu site quando atender aos critérios de instalação no Android e, depois, novamente após cerca de 90 dias.

## Padrões promocionais da IU do app {: #app-ui-patterns }

Os padrões promocionais da IU (interface do usuário) do app podem ser usados para quase qualquer tipo de PWA e aparecem na IU do app, como na navegação do site e nos banners. Como acontece com qualquer outro tipo de padrão promocional, é importante estar ciente do contexto do usuário para minimizar a interrupção da jornada do usuário.

Os sites que consideram o momento em que acionam a IU da promoção alcançam um número maior de instalações e evitam as interferências nas jornadas dos usuários que não estão interessados.

<div class="w-clearfix"> </div>

### Botão de instalação simples {: #simple-button }

A experiência do usuário mais simples possível é incluir um botão "Instalar" ou "Fazer download do app" em um local apropriado no conteúdo da Web. Verifique se o botão não bloqueia outras funcionalidades importantes e não atrapalha a jornada do usuário no app.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kv0x9hxZ0TLVaIiP4Bqx.png", alt="Botão de instalação personalizado", width="800", height="448" %} <figcaption> Botão de instalação simples </figcaption></figure>

<div class="w-clearfix"> </div>

### Cabeçalho fixo {: #header }

Esse botão de instalação faz parte do cabeçalho do seu site. O conteúdo do cabeçalho geralmente inclui também a marca do site, como um logotipo, e o menu hambúrguer. Os cabeçalhos podem ser `position:fixed` ou não, dependendo da funcionalidade do seu site e das necessidades do usuário.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GPJdkXcpNLR30r2zo7RR.png", alt="Botão de instalação personalizado no cabeçalho", width="800", height="448" %} <figcaption> Botão de instalação personalizado no cabeçalho </figcaption></figure>

Quando usado de maneira apropriada, a promoção da instalação do PWA no cabeçalho do site é uma ótima maneira de facilitar o retorno dos clientes fiéis à experiência. Os pixels no cabeçalho do PWA são preciosos. Portanto, confira se a call to action tem o tamanho adequado, apresenta maior importância que os outros conteúdos possíveis no cabeçalho e não é intrusiva.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/L01AoSoy7LNk1ttMMax0.png", alt="Botão de instalação personalizado no cabeçalho", width="800", height="430" %} <figcaption> Botão de instalação personalizado no cabeçalho </figcaption></figure>

Faça o seguinte:

- Não mostre o botão de instalação, a menos que `beforeinstallprompt` tenha sido disparado.
- Avalie o valor do caso de uso instalado para seus usuários. Considere a segmentação seletiva para apresentar sua promoção apenas para os usuários que provavelmente se beneficiarão com ela.
- Use o espaço precioso do cabeçalho de forma eficiente. Considere o que mais seria útil oferecer ao usuário no cabeçalho e avalie a prioridade da promoção da instalação em relação a outras opções.

<div class="w-clearfix"> </div>

### Menu de navegação {: #nav }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aT7NHi8lbsZW8TOm3Gaw.png", alt="Botão de instalação personalizado no menu de navegação", width="800", height="1117" %} <figcaption> Adicione uma promoção ou um botão de instalação em um menu de navegação retrátil. </figcaption></figure>

O menu de navegação é um ótimo lugar para promover a instalação do seu app, pois a abertura do menu pelos usuários sinaliza o engajamento com a experiência.

Faça o seguinte:

- Evite interferir em conteúdo de navegação importante. Coloque a promoção da instalação do PWA abaixo dos outros itens no menu.
- Ofereça um argumento curto e relevante sobre o motivo pelo qual o usuário se beneficiaria com a instalação do PWA.

<div class="w-clearfix"> </div>

### Página de destino {: #landing }

O objetivo de uma página de destino é promover seus produtos e serviços. Por isso, é um lugar onde é apropriado promover os benefícios da instalação do seu PWA.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7q09M12HFxgIiWhKPGma.png", alt="Solicitação de instalação personalizada na página de destino", width="800", height="1117" %} <figcaption> Solicitação de instalação personalizada na página de destino </figcaption></figure>

Primeiro, explique a proposta de valor do seu site e, em seguida, informe aos visitantes as vantagens da instalação.

Faça o seguinte:

- Apele para os recursos que mais importam para seus visitantes e enfatize as palavras-chave que talvez os tenham levado à página de destino.
- Inclua uma promoção de instalação e call to action atrativas, mas somente depois de deixar clara a proposta de valor. Afinal, essa é sua página de destino.
- Considere adicionar uma promoção de instalação na parte do app em que os usuários passam a maior parte do tempo.

<div class="w-clearfix"> </div>

### Banner de instalação {: #banner }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7fLCQQhdk2OzrQD3Xh4E.png", alt="Banner de instalação personalizado no topo da página.", width="800", height="1000" %} <figcaption> Um banner dispensável no topo da página. </figcaption></figure>

A maioria dos usuários já se deparou com banners de instalação em experiências de dispositivos móveis e está familiarizada com as interações oferecidas por um banner. Os banners devem ser usados com cuidado porque podem incomodar o usuário.

Faça o seguinte:

- Espere o usuário demonstrar interesse no seu site antes de exibir um banner. Se o usuário dispensar o banner, não o exiba novamente, a menos que o usuário acione um evento de conversão que indique um nível mais alto de engajamento com o conteúdo, como uma compra em um site de e-commerce ou a inscrição em uma conta.
- Explique brevemente o valor da instalação do PWA no banner. Por exemplo, você pode distinguir a instalação do PWA de um app iOS/Android ao mencionar que ele quase não usa o armazenamento no dispositivo do usuário ou que será instalado instantaneamente sem o redirecionamento para a loja.

<div class="w-clearfix"> </div>

### IU temporária {: #temporary-ui }

A IU temporária, como o padrão de design [Snackbar](https://material.io/components/snackbars/), notifica o usuário e permite que ele conclua uma ação com facilidade. Nesse caso, instalar o app. Quando usados de maneira adequada, esses tipos de padrões de IU não interrompem o fluxo do usuário e, em geral, são dispensados automaticamente quando ignorados pelo usuário.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6DySYRtyegazEfMcWXQL.png", alt="Banner de instalação personalizado como snackbar.", width="800", height="448" %} <figcaption> Snackbar dispensável indicando que é possível instalar o PWA. </figcaption></figure>

Mostre o snackbar depois de alguns engajamentos e interações com seu app. Se ele aparecer no carregamento da página ou fora de contexto, pode não ser notado ou causar sobrecarga cognitiva. Quando isso acontece, os usuários simplesmente ignoram tudo o que veem. Além disso, lembre-se de que os novos usuários no seu site podem não estar prontos para instalar o PWA. Portanto, é melhor esperar até que você tenha fortes sinais de interesse do usuário antes de usar esse padrão, como visitas repetidas, o login ou um evento de conversão semelhante.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/d8dwdIe1rYSgd0JdCGtt.png", alt="Banner de instalação personalizado como snackbar.", width="800", height="424" %} <figcaption> Um snackbar dispensável indicando que é possível instalar o PWA. </figcaption></figure>

Faça o seguinte:

- Mostre o snackbar de 4 a 7 segundos para dar aos usuários tempo suficiente para ver e reagir, sem causar interrupções.
- Evite a exibição em cima de outra IU temporária, como banners.
- Aguarde até que você tenha fortes sinais de interesse do usuário antes de usar esse padrão, como visitas repetidas, o login ou um evento de conversão semelhante.

<div class="w-clearfix"> </div>

## Depois da conversão

Imediatamente após um evento de conversão do usuário, como uma compra em um site de e-commerce, é uma excelente oportunidade para promover a instalação do seu PWA. O usuário está claramente engajado com o conteúdo e uma conversão geralmente indica que ele retornará para interagir com seus serviços.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/DrepSPFAm64d5cvTFoXe.png", alt="Captura de tela da promoção da instalação após a conversão.", width="800", height="448" %} <figcaption> Promoção da instalação depois que o usuário concluiu uma compra. </figcaption></figure>

### Jornada de reserva ou finalização da compra {: #journey }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bOYZM2UiWK5itVSpjKWO.png", alt="Promoção da instalação após a jornada do usuário.", width="800", height="1419" %} <figcaption> Promoção da instalação após a jornada do usuário. </figcaption></figure>

Mostre uma promoção de instalação durante ou após uma jornada sequencial, como aquelas que são típicas de reservas ou fluxos de finalização da compra. Ao mostrar a promoção depois que o usuário tiver concluído a jornada, isso pode fazer com que ela ganhe mais destaque.

Faça o seguinte:

- Inclua uma call-to-action relevante. Quais usuários se beneficiarão com a instalação do seu app e por quê? Como isso é relevante para a jornada que estão empreendendo atualmente?
- Caso sua marca tenha ofertas exclusivas para usuários de apps instalados, mencione aqui.
- Mantenha a promoção fora do caminho nas próximas etapas ou você pode afetar negativamente as taxas de conclusão das jornadas. No exemplo de e-commerce acima, observe como a call to action principal para finalizar a compra está acima da promoção de instalação do app.

<div class="w-clearfix"> </div>

### Fluxo de inscrição, login ou logout {: #sign-up}

Essa promoção é um caso especial de padrão promocional de [jornada](#journey) em que o cartão da promoção pode ganhar mais destaque.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PQXqSqtwRSwyELdJMjtd.png", alt="Botão de instalação personalizado na página de inscrição.", width="800", height="1117" %} <figcaption> Botão de instalação personalizado na página de inscrição. </figcaption></figure>

Essas páginas geralmente são visualizadas apenas por usuários engajados, onde a proposta de valor do PWA já foi estabelecida. Com frequência, também não há outros conteúdos úteis para colocar nessas páginas. Como resultado, é menos intrusivo adicionar uma call to action maior, desde que não atrapalhe.

Faça o seguinte:

- Evite interromper a jornada do usuário dentro do formulário de inscrição. Se for um processo de várias etapas, convém esperar até que o usuário conclua a jornada.
- Promova os recursos mais relevantes para um usuário inscrito.
- Considere adicionar uma promoção de instalação adicional nas áreas de usuários logados do seu app.

<div class="w-clearfix"> </div>

## Padrões promocionais inline

As técnicas promocionais inline combinam as promoções com o conteúdo do site. Geralmente, elas são mais sutis do que a promoção na IU do app, que tem vantagens e desvantagens. A promoção deve se destacar o suficiente para que seja notada pelos usuários interessados, mas não a ponto de prejudicar a qualidade da experiência.

### In-feed {: #in-feed }

Uma promoção de instalação in-feed aparece entre notícias ou outras listas de cartões de informações no PWA.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/LS5qSE2vicfjRBBkA47a.png", alt="Promoção de instalação no feed do conteúdo.", width="800", height="1000" %} <figcaption> Promoção de instalação no feed do conteúdo. </figcaption></figure>

O objetivo é mostrar aos usuários como acessar o conteúdo que estão apreciando de uma forma mais conveniente. Concentre-se em promover recursos e funcionalidades que serão úteis para os usuários.

Faça o seguinte:

- Limite a frequência das promoções para evitar incomodar os usuários.
- Forneça aos usuários a capacidade de dispensar as promoções.
- Lembre-se da preferência do usuário quando ele escolher dispensar.
