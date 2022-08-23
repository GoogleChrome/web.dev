---
layout: post
title: 'prefere movimento reduzido: às vezes, menos movimento é mais'
subhead: |2

  A consulta de mídia preferencialmente reduzida detecta se o usuário solicitou

  o sistema operacional para minimizar a quantidade de animação ou movimento que usa.
authors:
  - thomassteiner
description: "A consulta de mídia preferencialmente reduzida detecta se o usuário solicitou que o sistema minimizasse a quantidade de animação ou movimento que usa. Isso é para usuários que exigem ou preferem animações minimizadas; por exemplo, pessoas com distúrbios vestibulares geralmente desejam que as animações sejam reduzidas ao mínimo."
date: 2019-03-11
updated: 2019-12-10
tags:
  - blog
  - media-queries
  - css
hero: image/admin/LI2vYKZwQ98w3MLtUF8V.jpg
alt: Lapso de tempo da mulher em um trem
feedback:
  - api
---

Nem todo mundo gosta de animações ou transições decorativas, e alguns usuários ficam enjoados quando enfrentam rolagem paralaxe, efeitos de zoom e assim por diante. O Chrome 74 oferece suporte a uma consulta de mídia de preferência do usuário `prefers-reduced-motion` que permite criar uma variante de movimento reduzido de seu site para usuários que expressaram essa preferência.

## Muito movimento na vida real e na web

Outro dia, eu estava patinando no gelo com meus filhos. Estava um dia lindo, o sol estava forte e a pista de gelo estava lotada de gente ⛸. O único problema com isso: eu não lido bem com multidões. Com tantos alvos móveis, não consigo me concentrar em nada, acabo perdido e com uma sensação de total sobrecarga visual, quase como olhar para um formigueiro 🐜.

<figure>{% Img src="image/admin/JA5v1s8gSBk70eJBB8xW.jpg", alt="Multidão de pés de pessoas que patinam no gelo", width="580", height="320" %} <figcaption>Sobrecarga visual na vida real.</figcaption></figure>

Ocasionalmente, o mesmo pode acontecer na web: com anúncios piscando, efeitos extravagantes de paralaxe, animações de revelação surpreendentes, vídeos de reprodução automática e assim por diante, *a web às vezes pode ser bastante opressora* … Felizmente, ao contrário da vida real, há uma solução para isso . A consulta de mídia CSS `prefers-reduced-motion` permite que os desenvolvedores criem uma variante de uma página para usuários que, bem, preferem movimento reduzido. Isso pode incluir qualquer coisa, desde evitar a reprodução automática de vídeos até a desativação de certos efeitos puramente decorativos e até o redesenho completo de uma página para determinados usuários.

Antes de mergulhar no recurso, vamos dar um passo para trás e pensar em como as animações são usadas na web. Se desejar, você também pode pular as informações básicas e [ir direto para os detalhes técnicos](#working_with_the_media_query) abaixo.

## Animação na web

A animação é frequentemente usada para fornecer *feedback* ao usuário, por exemplo, para informá-lo de que uma ação foi recebida e está sendo processada. Por exemplo, em um site de compras, um produto pode ser animado para "voar" em um carrinho de compras virtual, representado como um ícone no canto superior direito do site.

Outro caso de uso envolve o uso de movimento para [hackear a percepção do usuário](https://medium.com/dev-channel/hacking-user-perception-to-make-your-websites-and-apps-feel-faster-922636b620e3) usando uma mistura de telas de esqueleto, metadados contextuais e visualizações de imagem de baixa qualidade para ocupar muito do tempo do usuário e fazer com que toda a experiência *pareça mais rápida*. A ideia é dar contexto ao usuário do que está por vir e, enquanto isso, carregar as coisas o mais rápido possível.

Finalmente, existem *efeitos decorativos* como gradientes animados, rolagem paralaxe, vídeos de fundo e vários outros. Enquanto muitos usuários gostam de tais animações, alguns usuários não gostam delas porque se sentem distraídos ou retardados por elas. No pior dos casos, os usuários podem até sofrer de enjôo como se fosse uma experiência da vida real, portanto, para esses usuários, reduzir as animações é uma *necessidade médica*.

## Desordem do espectro vestibular desencadeada por movimento

Alguns usuários se [distraem ou sentem náusea com o conteúdo animado](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html). Por exemplo, as animações de rolagem podem causar distúrbios vestibulares quando outros elementos além do elemento principal associado à rolagem se movem muito. Por exemplo, as animações de rolagem em paralaxe podem causar distúrbios vestibulares porque os elementos do plano de fundo se movem em uma taxa diferente dos elementos do primeiro plano. As reações de distúrbios vestibulares (ouvido interno) incluem tontura, náusea e enxaqueca e, às vezes, é necessário repouso na cama para se recuperar.

## Remover movimento em sistemas operacionais

Muitos sistemas operacionais tiveram configurações de acessibilidade para especificar uma preferência por movimento reduzido por um longo tempo. As capturas de tela abaixo mostram a preferência **Reduzir movimento** do macOS Mojave e a preferência **Remover animações** do Android Pie. Quando marcadas, essas preferências fazem com que o sistema operacional não use efeitos decorativos, como animações de inicialização de aplicativos. Os próprios aplicativos também podem e devem respeitar essa configuração e remover todas as animações desnecessárias.

<div class="switcher">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KwuLNPefeDzUfR17EUtr.png", alt="Uma captura de tela da tela de configurações do macOS com a caixa de seleção 'Reduzir movimento' marcada.", width="398", height="300" %}</figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qed7yE6FKVQ5YXHn0TbJ.png", alt="Uma captura de tela da tela de configurações do Android com a caixa de seleção 'Remover animações' marcada.", width="287", height="300" %}</figure>
</div>

## Remover movimento na web

[Media Queries Nível 5](https://drafts.csswg.org/mediaqueries-5/) traz a preferência do usuário de movimento reduzido para a web também. As consultas de mídia permitem que os autores testem e consultem valores ou recursos do agente do usuário ou dispositivo de exibição, independentemente do documento que está sendo processado. A consulta de mídia [`prefers-reduced-motion`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion) é usada para detectar se o usuário definiu uma preferência de sistema operacional para minimizar a quantidade de animação ou movimento que usa. Pode ter dois valores possíveis:

- `no-preference`: indica que o usuário não deu preferência ao sistema operacional subjacente. Este valor de palavra-chave é avaliado como `false` no contexto booleano.
- `reduce`: indica que o usuário definiu uma preferência de sistema operacional indicando que as interfaces devem minimizar o movimento ou a animação, de preferência até o ponto em que todos os movimentos não essenciais sejam removidos.

## Trabalhando com a consulta de mídia

{% Aside %} Consulte [Posso usar a consulta de mídia preferencial com movimento reduzido?](https://caniuse.com/#feat=prefers-reduced-motion) para descobrir quais navegadores suportam `prefers-reduced-motion`. {% endAside %}

Como acontece com todas as consultas de mídia, o movimento `prefers-reduced-motion` pode ser verificado a partir de um contexto CSS e de um contexto JavaScript.

Para ilustrar ambos, digamos que eu tenha um botão de inscrição importante no qual desejo que o usuário clique. Eu poderia definir uma animação de "vibração" que chamasse a atenção, mas, como um bom cidadão da web, só vou reproduzi-la para os usuários que estão explicitamente bem com animações, mas não para todos os outros, que podem ser usuários que optaram por não receber animações, ou usuários em navegadores que não entendem a consulta de mídia.

```css
/*
  If the user has expressed their preference for
  reduced motion, then don't use animations on buttons.
*/
@media (prefers-reduced-motion: reduce) {
  button {
    animation: none;
  }
}

/*
  If the browser understands the media query and the user
  explicitly hasn't set a preference, then use animations on buttons.
*/
@media (prefers-reduced-motion: no-preference) {
  button {
    /* `vibrate` keyframes are defined elsewhere */
    animation: vibrate 0.3s linear infinite both;
  }
}
```

{% Aside %}
Se você tem muito CSS relacionado à animação, pode evitar que os usuários que optaram por não façam o download terceirizando todo o CSS relacionado à animação em uma folha de estilo separada que você carrega apenas condicionalmente por `media` atributo de mídia no elemento de `link`: `<link rel="stylesheet" href="animations.css" media="(prefers-reduced-motion: no-preference)">`
{% endAside %}

Para ilustrar como trabalhar com `prefers-reduced-motion` com JavaScript, vamos imaginar que eu tenha definido uma animação complexa com a [API Web Animations](https://developer.mozilla.org/docs/Web/API/Web_Animations_API). Embora as regras CSS sejam acionadas dinamicamente pelo navegador quando a preferência do usuário muda, para animações JavaScript eu mesmo tenho que escutar as mudanças e, em seguida, parar manualmente minhas animações em potencial (ou reiniciá-las se o usuário permitir):

```js
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
mediaQuery.addEventListener('change', () => {
  console.log(mediaQuery.media, mediaQuery.matches);
  // Stop JavaScript-based animations.
});
```

Observe que os parênteses em torno da consulta de mídia real são obrigatórios:

{% Compare 'worse' %}

```js
window.matchMedia('prefers-reduced-motion: reduce')
```

{% endCompare %}

{% Compare 'better' %}

```js
window.matchMedia('(prefers-reduced-motion: reduce)')
```

{% endCompare %}

## Demo

Criei uma pequena demo baseada nos incríveis [gatos de status de HTTP 🐈](https://http.cat/) de Rogério Vicente. Primeiro, pare um pouco para apreciar a piada, é hilária e vou esperar. Agora que você voltou, vou apresentar a [demonstração](https://prefers-reduced-motion.glitch.me). Quando você rola para baixo, cada gato de status HTTP aparece alternadamente do lado direito ou esquerdo. É uma animação de 60 FPS muito suave, mas como descrito acima, alguns usuários podem não gostar ou até ficar enjoados com ela, então a demo está programada para respeitar o movimento `prefers-reduced-motion`. Isso funciona até mesmo dinamicamente, para que os usuários possam alterar suas preferências rapidamente, sem a necessidade de recarregar. Se um usuário preferir movimento reduzido, as animações de revelação não necessárias desaparecem e apenas o movimento de rolagem regular é deixado. O screencast abaixo mostra a demonstração em ação:

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/zWs45QPPI9C8CjF813Zx.mp4", muted=true, playsinline=true, controls=true, poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CQAw3Ee43Dcv0JOsm9fl.png" %} <figcaption>Vídeo do aplicativo de <a href="https://prefers-reduced-motion.glitch.me">demonstração <code>prefers-reduced-motion</code></a></figcaption></figure>

## Conclusões

Respeitar as preferências do usuário é fundamental para sites modernos, e os navegadores estão expondo cada vez mais recursos para permitir que os desenvolvedores da web façam isso. Outro exemplo lançado é [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme), que detecta se o usuário prefere um esquema de cores claras ou escuras. Você pode ler tudo sobre o `prefers-color-scheme` em meu artigo [Hello Darkness, My Old Friend](/prefers-color-scheme) 🌒.

O CSS Working Group está padronizando mais [consultas de mídia de preferência do usuário,](https://drafts.csswg.org/mediaqueries-5/#mf-user-preferences) como[`prefers-reduced-transparency`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-transparency) (detecta se o usuário prefere transparência reduzida), [`prefers-contrast`](https://drafts.csswg.org/mediaqueries-5/#prefers-contrast) (detecta se o usuário solicitou ao sistema para aumentar ou diminuir a quantidade de contraste entre os adjacentes cores) e [`inverted-colors`](https://drafts.csswg.org/mediaqueries-5/#inverted) (detecta se o usuário prefere cores invertidas). 👀 Observe este espaço, com certeza iremos informá-lo assim que forem lançados no Chrome!

## (Bônus) Forçando movimento reduzido em todos os sites

Nem todo site usará `prefers-reduced-motion` ou talvez não o suficiente para o seu gosto. Se você, por algum motivo, quiser interromper o movimento em todos os sites, pode. Uma maneira de fazer isso acontecer é injetar uma folha de estilo com o seguinte CSS em cada página da web que você visitar. Existem várias [extensões de navegador](https://chrome.google.com/webstore/search/user%20stylesheets?_category=extensions) por aí (use por sua própria conta e risco!) Que permitem isso.

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: initial !important;
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
}
```

A maneira como isso funciona é que o CSS acima substitui as durações de todas as animações e transições para um período tão curto que não são mais perceptíveis. Como alguns sites dependem de uma animação para rodar para funcionar corretamente (talvez porque uma determinada etapa dependa do disparo do [evento de fim de `animationend`](https://developer.mozilla.org/docs/Web/API/HTMLElement/animationend_event)), a `animation: none !important;` abordagem não funcionaria. Mesmo o hack acima não tem garantia de sucesso em todos os sites (por exemplo, ele não pode parar o movimento que foi iniciado por meio da [API do Web Animations](https://developer.mozilla.org/docs/Web/API/Web_Animations_API)), portanto, certifique-se de desativá-lo quando notar uma quebra.

## Links Relacionados

- Mais recente rascunho do editor das especificações de [nível 5 do Media Queries.](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion)
- `prefers-reduced-motion` no [Chrome Platform Status](https://www.chromestatus.com/feature/5597964353404928).
- `prefers-reduced-motion` [bug do Chromium de](http://crbug.com/722548) movimento reduzido.
- Blink [publicação Intent to Implement](https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/NZ3c9d4ivA8/BIHFbOj6DAAJ).

## Reconhecimentos

Um grande [elogio a Stephen McGruer,](https://github.com/stephenmcgruer) que implementou o movimento `prefers-reduced-motion` no Chrome e - junto com [Rob Dodson](https://twitter.com/rob_dodson) - também revisou este artigo. [Imagem do herói](https://unsplash.com/photos/im7Tiw1OY7c) por Hannah Cauhepe em Unsplash.
