---
layout: post
title: 'Compat 2021: eliminando os cinco principais pontos fracos de compatibilidade na web'
subhead: |-
  O Google está trabalhando com outros fornecedores de navegadores e parceiros do setor para corrigir o
  cinco principais pontos problemáticos de compatibilidade de navegador para desenvolvedores da web: CSS flexbox,
  Grid CSS, `position: sticky`, `aspect-ratio` e transformações CSS.
description: 'Saiba mais sobre como o Google está trabalhando com outros fornecedores de navegadores e parceiros do setor para corrigir os cinco principais pontos problemáticos de compatibilidade do navegador para desenvolvedores da web: CSS flexbox, CSS Grid, position: sticky, aspect-ratio e transformações CSS.'
authors:
  - robertnyman
  - foolip
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/KQ5oNcLGKdBSuUM8pFPx.jpeg
alt: Um quebra-cabeça sem uma peça.
date: 2021-03-22
updated: 2021-11-16
tags:
  - blog
  - css
---

O Google está trabalhando com outros fornecedores de navegadores e parceiros do setor para corrigir os cinco principais problemas de compatibilidade de navegadores para desenvolvedores da web. As áreas de foco são CSS flexbox, CSS Grid, `position: sticky` , `aspect-ratio` e transformações CSS. Confira [Como você pode contribuir e acompanhar](#contribute) para saber como se envolver.

## Histórico

A compatibilidade na web sempre foi um grande desafio para os desenvolvedores. Nos últimos dois anos, o Google e outros parceiros, incluindo Mozilla e Microsoft, decidiram aprender mais sobre os principais pontos fracos para desenvolvedores da web, para conduzir nosso trabalho e priorização para melhorar a situação. Este projeto está conectado ao trabalho de [Satisfação do Desenvolvedor do Google](/developer-satisfaction) (DevSAT) e começou em uma escala maior com a criação das pesquisas [MDN DNA (Avaliação das Necessidades do Desenvolvedor)](https://insights.developer.mozilla.org/) em 2019 e 2020, e um esforço de pesquisa aprofundado apresentado no [Relatório de compatibilidade de navegador MDN2020](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html). Pesquisas adicionais foram feitas em vários canais, como as pesquisas [State of CSS](https://stateofcss.com/) e [State of JS](https://stateofjs.com/).

A meta em 2021 é eliminar os problemas de compatibilidade do navegador em cinco áreas de foco principais, para que os desenvolvedores possam construir sobre eles com segurança como bases confiáveis. Esse esforço é denominado [**#Compat 2021**](https://twitter.com/search?q=%23compat2021&src=typed_query&f=live).

## Escolhendo no que focar

Embora existam problemas de compatibilidade do navegador em basicamente toda a plataforma da web, o foco deste projeto está em um pequeno número das áreas mais problemáticas que podem ser significativamente melhoradas, removendo-as assim como os principais problemas para os desenvolvedores.

O projeto de compatibilidade usa vários critérios que influenciam quais áreas priorizar, e alguns deles são:

- Uso de recursos. Por exemplo, o flexbox é usado em [75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692) de todas as visualizações de página e a adoção está crescendo fortemente no [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout).

- Número de bugs (no [Chromium](https://bugs.chromium.org/p/chromium/issues/list) , [Gecko](https://bugzilla.mozilla.org/describecomponents.cgi) , [WebKit](https://bugs.webkit.org/) ) e, para o Chromium, quantas estrelas esses bugs têm.

- Resultados da pesquisa:

    - [Pesquisas MDN DNA](https://insights.developer.mozilla.org/)
    - [Relatório de compatibilidade do navegador MDN](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)
    - [Estado dos recursos CSS](https://2020.stateofcss.com/en-US/features/) mais conhecidos e usados

- Resultados de teste de testes de [plataforma](https://github.com/web-platform-tests/wpt#the-web-platform-tests-project) da web. Por exemplo, [flexbox em wpt.fyi](https://wpt.fyi/results/css/css-flexbox) .

- Recursos mais procurados [Posso usar](https://caniuse.com/).

## As cinco principais áreas de foco em 2021

Em 2020, o Chromium começou a trabalhar abordando as principais áreas descritas em [Melhorando a compatibilidade do navegador do Chromium em 2020](https://blog.chromium.org/2020/06/improving-chromiums-browser.html). Em 2021, iniciamos0 um esforço dedicado para ir ainda mais longe. O Google e a [Microsoft estão trabalhando juntos para resolver os principais problemas do Chromium](https://blogs.windows.com/msedgedev/2021/03/22/better-compatibility-compat2021/) junto com a [Igalia](https://www.igalia.com/). A Igalia, que contribui regularmente com o Chromium e WebKit e também é mantenedora da porta oficial do WebKit para dispositivos embarcados, tem dado muito suporte e se engajado nesses esforços de compatibilidade e ajudará a resolver e acompanhar os problemas identificados.

Aqui estão as áreas a serem consertadas em 2021.

### CSS flexbox

O [CSS flexbox](https://developer.mozilla.org/docs/Web/CSS/CSS_Flexible_Box_Layout) é[amplamente utilizado](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692) na web e ainda existem alguns desafios importantes para os desenvolvedores. Por exemplo, o [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=721123) e o [WebKit](https://bugs.webkit.org/show_bug.cgi?id=209983) tiveram problemas com o `auto-height`, levando a imagens de tamanho incorreto.

<div class="switcher">
    <figure style="display: flex; flex-direction: column;">{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/qmKoKHkZga5hgBeiHuBz.png", alt="Foto esticada de um tabuleiro de xadrez.", width="800", height="400" %} <figcaption style="margin-top: auto"> Imagem de tamanho incorreto devido a bugs. </figcaption></figure>
    <figure style="display: flex; flex-direction: column;">{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/0ruhCiZKRP9jBhnN70Xh.png", alt="Tabuleiro de Xadrez.", width="800", height="800" %} <figcaption style="margin-top: auto"> Imagem de tamanho correto. <br> Foto por <a href="https://unsplash.com/photos/ab5OK9mx8do">Alireza Mahmoudi.</a> </figcaption></figure>
</div>

[A postagem do blog Cats do flexbox da Igalia](https://blogs.igalia.com/svillar/2021/01/20/flexbox-cats-a-k-a-fixing-images-in-flexbox/) se aprofunda nesses problemas com muitos outros exemplos.

#### Por que ele é priorizado

- Pesquisas: problema principal no [Relatório de compatibilidade de navegadores MDN](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html), mais conhecido e usado no [State of CSS](https://2020.stateofcss.com/en-US/features/)
- Testes: [85% passam](https://wpt.fyi/results/css/css-flexbox) em todos os navegadores
- Uso: [75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692) das visualizações de página, crescendo fortemente no [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout)

### CSS Grid

[CSS Grid](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout) é um bloco de construção central para layouts de web modernos, substituindo muitas técnicas e soluções alternativas mais antigas. Como a adoção está crescendo, ela precisa ser sólida como uma rocha, para que as diferenças entre os navegadores nunca sejam um motivo para evitá-la. Uma área que está faltando é a capacidade de animar layouts de grade, com suporte no Gecko, mas não no [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=759665) ou [WebKit](https://bugs.webkit.org/show_bug.cgi?id=204580). Quando suportado, efeitos como este são possíveis:

<figure>{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/Ovs6wg9o5AJUG4IIoVvj.mp4", height="400", controls=false, autoplay=true, loop=true, muted=true, playsinline=true %} <figcaption> Demonstração de xadrez animada por <a href="https://chenhuijing.com/blog/recreating-the-fools-mate-chess-move-with-css-grid/">Chen Hui Jing</a>. </figcaption></figure>

#### Por que ele é priorizado

- Pesquisas: segundo colocado no [relatório de compatibilidade de navegadores MDN](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html), bem conhecido, mas menos usado no [State of CSS](https://2020.stateofcss.com/en-US/features/)
- Testes: [75% passam](https://wpt.fyi/results/css/css-grid) em todos os navegadores
- Uso:[8% e crescimento constante](https://www.chromestatus.com/metrics/feature/timeline/popularity/1693) , ligeiro crescimento no [Arquivo HTTP](https://almanac.httparchive.org/en/2020/css#layout)

{% Aside %} Embora um recurso mais recente, como o [subgrid,](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid) seja importante para os desenvolvedores, ele não faz parte desse esforço específico. Para acompanhar, consulte [Subgrid compat em MDN](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid#browser_compatibility). {% endAside %}

### Posição CSS: sticky

[O posicionamento sticky](https://developer.mozilla.org/docs/Web/CSS/position#sticky_positioning) permite que o conteúdo fique preso à borda da janela de visualização e é comumente usado para cabeçalhos que estão sempre visíveis na parte superior da janela de visualização. Embora seja compatível com todos os navegadores, há casos de uso comuns em que não funciona conforme o esperado. Por exemplo, [cabeçalhos de tabela fixos](https://bugs.chromium.org/p/chromium/issues/detail?id=702927) não são compatíveis com o Chromium e, embora agora sejam [compatíveis com um sinalizador](https://bugs.chromium.org/p/chromium/issues/detail?id=958381) , os resultados são inconsistentes entre os navegadores:

<div class="switcher">
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/DtNtuWCZUNwi7GGSBPvA.png", alt="", width="250", height="350" %} <figcaption> Chromium com "TablesNG" </figcaption></figure>
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/hJwLpLeJNfG6kVBUK9Yn.png", alt="", width="250", height="350" %} <figcaption> Gecko </figcaption></figure>
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/od1YyD2BoBqfrnkzynUK.png", alt="", width="250", height="350" %} <figcaption> WebKit </figcaption></figure>
</div>

Confira a <a href="https://output.jsbin.com/xunosud">demonstração dos cabeçalhos de tabela sticky</a> de Rob Flack.

#### Por que é priorizado

- Pesquisas: altamente conhecidas/usadas no [CSS State](https://2020.stateofcss.com/en-US/features/) e foram mencionadas várias vezes no [relatório de compatibilidade de navegadores MDN](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)
- Testes: [66% passa](https://wpt.fyi/results/css/css-position/sticky?label=master&label=experimental&product=chrome&product=firefox&product=safari&aligned&q=%28status%3A%21missing%26status%3A%21pass%26status%3A%21ok%29) em todos os navegadores
- Uso: [8%](https://www.chromestatus.com/metrics/feature/timeline/popularity/3354)

### Propriedade de proporção de aspecto CSS

A nova propriedade [`aspect-ratio`](https://developer.mozilla.org/docs/Web/CSS/aspect-ratio) facilita a manutenção de uma proporção consistente de largura e altura para os elementos, eliminando a necessidade do conhecido [hack `padding-top`](/aspect-ratio/#the-old-hack-maintaining-aspect-ratio-with-padding-top) :

<div class="switcher">{% Compare 'worse', 'Usando padding-top' %} ```css .container { width: 100%; padding-top: 56.25%; } ``` {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'Usando aspect-ratio' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

Por ser um caso de uso tão comum, espera-se que ele se torne amplamente utilizado e queremos ter certeza de que é sólido em todos os cenários comuns e entre navegadores.

#### Por que ele é priorizado

- Pesquisas: já bem conhecidas, mas ainda não amplamente utilizadas no [CSS State](https://2020.stateofcss.com/en-US/features/)
- Testes: [27% passam](https://wpt.fyi/results/css/css-sizing/aspect-ratio) em todos os navegadores
- Uso: [3%](https://www.chromestatus.com/metrics/css/timeline/popularity/657) e espera-se que cresça

### Transformações CSS

As [transformações CSS](https://developer.mozilla.org/docs/Web/CSS/transform) são suportadas em todos os navegadores há muitos anos e são amplamente utilizadas na web. No entanto, ainda existem muitas áreas onde eles não funcionam da mesma forma em todos os navegadores, principalmente com animações e transformações 3D. Por exemplo, um efeito de virada de cartão pode ser muito inconsistente entre os navegadores:

<figure>{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/RhyPpk7dUooEobKZ3VOC.mp4", controls=false, autoplay=true, loop=true, muted=true, playsinline=true %} <figcaption> Efeito de virada do cartão no Chromium (left), Gecko (middle) e WebKit (right). Demo por David Baron a partir de <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=1008483#c42">comentário sobre o bug</a>. </figcaption></figure>

#### Por que é priorizado

- Pesquisas: Muito conhecidas e utilizadas no [State of CSS](https://2020.stateofcss.com/en-US/features/)
- Testes: [55% passam](https://wpt.fyi/results/css/css-transforms) em todos os navegadores
- Uso: [80%](https://www.chromestatus.com/metrics/css/timeline/popularity/446)

## Como você pode contribuir e acompanhar {: #contribute}

Siga e compartilhe todas as atualizações que [postarmos](https://twitter.com/ChromiumDev) no @ChromiumDev ou na [lista de e-mails pública, Compat 2021](https://groups.google.com/g/compat2021). Certifique-se de que existem bugs ou [registre-os](/how-to-file-a-good-bug/) para os problemas que você está enfrentando e, se houver algo faltando, entre em contato através dos canais acima.

Haverá atualizações regulares sobre o progresso aqui no web.dev e você também pode acompanhar o progresso de cada área de foco no [Compat 2021 Dashboard](https://wpt.fyi/compat2021).

<figure><p data-md-type="paragraph"><a href="https://wpt.fyi/compat2021"> {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/BgX0dnesIhLaFAKyILzk.png", alt="Painel Compat 2021", width="800", height="942" %} </a></p>
<figcaption>O Painel Compat 2021 (captura de tela tirada em 16 de novembro de 2021).</figcaption></figure>

Esperamos que este esforço conjunto entre os fornecedores de navegadores para melhorar a confiabilidade e a interoperabilidade ajude você a criar coisas incríveis na web!
