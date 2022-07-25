---
layout: post
title: As tags <video> e <source>
authors:
  - samdutton
  - joemedley
  - derekherman
description: |2-

  Você preparou adequadamente um arquivo de vídeo para a web. Você lhe atribuiu as dimensões e a resolução corretas. Você até criou arquivos WebM e MP4 separados para navegadores diferentes. Para que qualquer um possa vê-lo, você ainda precisa adicioná-lo a uma página da web.
date: 2014-02-15
updated: 2021-07-05
tags:
  - media
---

Você [preparou adequadamente um arquivo de vídeo](/prepare-media/) para a web. Você lhe atribuiu as dimensões e a resolução corretas. Você até criou arquivos WebM e MP4 separados para navegadores diferentes.

Para que qualquer um consiga ver seu vídeo, você ainda precisa adicioná-lo a uma página da web. Fazer isso corretamente requer a adição de dois elementos HTML: o elemento [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video) e o elemento [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source) . Além das noções básicas sobre essas tags, este artigo explica os atributos que você deve adicionar a elas para criar uma boa experiência do usuário.

{% Aside %} Você tem sempre a opção de enviar seu arquivo para o [YouTube](https://www.youtube.com/) ou o [Vimeo](https://vimeo.com). Em muitos casos, isso é melhor que o procedimento aqui descrito. Esses serviços cuidam da formatação e da conversão de tipo de arquivo para você, além de fornecer os meios para inserir um vídeo em sua página da web. Se você precisa gerenciar isso sozinho, continue lendo. {% endAside %}

## Especifique um único arquivo

Embora não seja recomendado, você pode usar o elemento de vídeo sozinho. Sempre use o atributo `type` conforme mostrado abaixo. O navegador usa isso para determinar se pode reproduzir o arquivo de vídeo fornecido. Se não puder, o texto incluído será exibido.

```html
<video src="chrome.webm" tipo="video/webm">
    <p>Seu navegador não pode reproduzir o arquivo de vídeo fornecido.</p>
</video>
```

### Especifique vários formatos de arquivo

Lembre-se das [noções básicas de arquivos de mídia](/media-file-basics/), de que nem todos os navegadores suportam os mesmos formatos de vídeo. O elemento `<source>` permite que você especifique vários formatos como substituto, caso o navegador do usuário não ofereça suporte a algum deles.

O exemplo abaixo produz o vídeo incorporado que é usado posteriormente como exemplo neste artigo.

```html
<video controls>
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm" type="video/webm">
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4" type="video/mp4">
  <p>Seu navegador não pode reproduzir o arquivo de vídeo fornecido.</p>
</video>
```

[Experimente no Glitch](https://track-demonstration.glitch.me) ([fonte](https://glitch.com/edit/#!/track-demonstration))

{% Aside %} Observe no exemplo anterior que o atributo `controls` foi introduzido. Isso instrui os navegadores a permitir que o usuário controle a reprodução do vídeo, incluindo volume, busca, seleção de legendas e pausar / retomar a reprodução, entre outros. {% endAside %}

Você sempre deve adicionar um atributo de `type` ao `<source>` , embora ele seja opcional. Isso garante que o navegador baixe apenas o arquivo que é capaz de reproduzir.

Essa abordagem possui várias vantagens em relação à exibição de HTML diferente ou script do lado do servidor, especialmente em dispositivos móveis:

- Você pode listar os formatos em ordem de preferência.
- A comutação do lado do cliente reduz a latência; apenas uma solicitação é feita para obter conteúdo.
- Deixar o navegador escolher um formato é mais simples, rápido e potencialmente mais confiável do que usar um banco de dados de suporte do lado do servidor com detecção de agente de usuário.
- Especificar o tipo de cada fonte de arquivo melhora o desempenho da rede; o navegador pode selecionar uma fonte de vídeo sem ter que baixar parte do vídeo para "farejar" o formato.

Esses problemas são especialmente importantes em contextos móveis, onde a largura de banda e a latência são precárias e a paciência do usuário provavelmente é limitada. A omissão do `type` pode afetar o desempenho quando há várias fontes com tipos não suportados.

Existem algumas maneiras de se aprofundar nos detalhes. Confira [A Digital Media Primer for Geeks](https://www.xiph.org/video/vid1.shtml) para saber mais sobre como o vídeo e o áudio funcionam na web. Você também pode usar [a depuração remota](https://developer.chrome.com/docs/devtools/remote-debugging/) em DevTools para comparar a atividade de rede [com atributos de tipo](https://googlesamples.github.io/web-fundamentals/fundamentals/media/video-main.html) e [sem atributos de tipo](https://googlesamples.github.io/web-fundamentals/fundamentals/design-and-ux/responsive/notype.html) .

{% Aside 'caution' %} Certifique-se de verificar os cabeçalhos de resposta nas ferramentas de desenvolvedor de seu navegador para [garantir que seu servidor informe o tipo MIME correto](https://developer.mozilla.org/en/docs/Properly_Configuring_Server_MIME_Types) ; caso contrário, as verificações do tipo de fonte de vídeo não funcionarão. {% endAside %}

### Especifique os horários de início e término

Economize largura de banda e torne seu site mais responsivo: use fragmentos de mídia para adicionar horários de início e término ao elemento de vídeo.

<figure>
  <video controls width="100%">
    <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm#t=5,10" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4#t=5,10" type="video/mp4">
    <p>Este navegador não oferece suporte ao elemento de vídeo.</p>
  </source></source></video></figure>

Para usar um fragmento de mídia, adicione `#t=[start_time][,end_time]` ao URL da mídia. Por exemplo, para reproduzir o vídeo dos segundos 5 a 10, especifique:

```html
<source src="video/chrome.webm#t=5,10" type="video/webm">
```

Você também pode especificar os tempos em `<hours>:<minutes>:<seconds>` . Por exemplo, `#t=00:01:05` inicia o vídeo em um minuto e cinco segundos. Para reproduzir apenas o primeiro minuto do vídeo, especifique `#t=,00:01:00` .

Você pode usar esse recurso para fornecer várias visualizações no mesmo vídeo - como pontos de sinalização em um DVD - sem ter que codificar e servir vários arquivos.

Para que esse recurso funcione, seu servidor deve oferecer suporte a solicitações de intervalo e esse recurso deve ser ativado. A maioria dos servidores habilita solicitações de intervalo por padrão. Como alguns serviços de hospedagem os desativam, você deve confirmar se as solicitações de intervalo estão disponíveis para o uso de fragmentos em seu site.

Felizmente, você pode fazer isso nas ferramentas de desenvolvedor do seu navegador. No Chrome, por exemplo, está no [painel Rede](https://developer.chrome.com/docs/devtools/#network) . Procure o `Accept-Ranges` e verifique se ele diz `bytes` . Na imagem, desenhei uma caixa vermelha ao redor deste cabeçalho. Se você não vir `bytes` como o valor, entre em contato com seu provedor de hospedagem.

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/20DlLyicG5PAo6TXBKh3.png", alt = "Captura de tela do Chrome DevTools: Intervalos de aceitação: bytes.", width = "800", height = "480"%}<figcaption> Captura de tela do Chrome DevTools: Intervalos de aceitação: bytes.</figcaption></figure>

### Incluir uma imagem de pôster

Adicione um atributo pôster ao `video` para que os espectadores tenham uma ideia do conteúdo assim que o elemento for carregado, sem a necessidade de baixar o vídeo ou iniciar a reprodução.

```html
<video poster="poster.jpg" ...>
  …
</video>
```

Um pôster também pode ser um substituto se o `src` do vídeo estiver quebrado ou se nenhum dos formatos de vídeo fornecidos for compatível. A única desvantagem das imagens de pôster é uma solicitação de arquivo adicional, que consome parte da largura de banda e requer renderização. Para obter mais informações, consulte [Codificar imagens com eficiência](/uses-optimized-images/) .

<div class="w-columns">{% Compare 'worse' %}<figure> {% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/R8VNeplKwajJhOuVkPDT.png", alt = "Sem um pôster substituto, o vídeo parece quebrado.", width = "360", height = "600"%}</figure>
</div>
<p data-md-type="paragraph">{% CompareCaption %} Sem um pôster substituto, o vídeo parece quebrado. {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better' %}</p>
<div data-md-type="block_html"><figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rNhydHVGeL2P0sQ0je5k.png", alt = "Um pôster substituto faz parecer que o primeiro quadro foi capturado.", width = "360", height = "600"%}</figure></div>
<p data-md-type="paragraph">{% CompareCaption %} Um pôster substituto faz parecer que o primeiro quadro foi capturado. {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

### Certifique-se de que os vídeos não transbordem de contêineres

Quando os elementos de vídeo são muito grandes para a janela de visualização, eles podem estourar seu contêiner, tornando impossível para o usuário ver o conteúdo ou usar os controles.

<div class="w-columns">
  <figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cDl2OfCE3hQivhaNvMUh.png", alt = "Captura de tela do Android Chrome, retrato: elemento de vídeo sem estilo transborda janela de visualização.", width = "338", height = "600"%}<figcaption> Captura de tela do Android Chrome, retrato: o elemento de vídeo sem estilo ultrapassa a janela de visualização.</figcaption></figure>
  <figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bCiZsNkZNsAhWbOBsLCs.png", alt = "Captura de tela do Android Chrome, paisagem: elemento de vídeo sem estilo estourou janela de visualização.", width = "800", height = "450"%}<figcaption> Captura de tela do Android Chrome, paisagem: o elemento de vídeo sem estilo ultrapassa a janela de visualização.</figcaption></figure>
</div>

Você pode controlar as dimensões do vídeo usando CSS. Se o CSS não atender a todas as suas necessidades, bibliotecas e plug-ins JavaScript como o [FitVids](http://fitvidsjs.com/) (fora do escopo deste artigo) podem ajudar, mesmo para vídeos do YouTube e outras fontes. Infelizmente, esses recursos podem aumentar o [tamanho da carga útil da rede,](/total-byte-weight/) com consequências negativas para suas receitas e carteiras de usuários.

Para usos simples como os que estou descrevendo aqui, use [consultas de mídia CSS](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#css-media-queries) para especificar o tamanho dos elementos dependendo das dimensões da janela de visualização; `max-width: 100%` é seu amigo.

Para conteúdo de mídia em iframes (como vídeos do YouTube), tente uma abordagem responsiva (como a [proposta por John Surdakowski](http://avexdesigns.com/responsive-youtube-embed/) ).

{% Aside 'caution' %} Não force o tamanho do elemento que resulta em uma [proporção](https://www.google.com/search?q=aspect+ratio&oq=aspect+ratio&aqs=chrome..69i57j35i39j0l6.1896j0j7&sourceid=chrome&ie=UTF-8) diferente do vídeo original. Vídeos comprimidos ou esticados parecem horríveis. {% endAside %}

#### CSS

```css
.video-container {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 0;
    height: 0;
    overflow: hidden;
}

.video-container iframe,
.video-container object,
.video-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

#### HTML

```html
<div class="video-container">
  <iframe src="//www.youtube.com/embed/l-BA9Ee2XuM"
          frameborder="0" width="560" height="315">
  </iframe>
</div>
```

[Tente](https://googlesamples.github.io/web-fundamentals/fundamentals/media/responsive_embed.html)

Compare a [amostra responsiva](https://googlesamples.github.io/web-fundamentals/fundamentals/media/responsive_embed.html) com a [versão que não responde](https://googlesamples.github.io/web-fundamentals/fundamentals/design-and-ux/responsive/unyt.html) . Como você pode ver, a versão que não responde não é uma ótima experiência para o usuário.

### Orientação do dispositivo

A orientação do dispositivo não é um problema para monitores de desktop ou laptops, mas é extremamente importante ao considerar o design da página da web para dispositivos móveis e tablets.

O Safari no iPhone faz um bom trabalho ao alternar entre a orientação retrato e paisagem:

<div class="w-columns">
<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AmHneDShMOioWZwYG2kF.png", alt = "Captura de tela do vídeo reproduzindo no Safari no iPhone, retrato.", width = "338", height = "600" %}<figcaption> Captura de tela do vídeo sendo reproduzido no Safari no iPhone, retrato.</figcaption></figure><figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MZwkLJaXVk4g8lruhiKZ.png", alt = "Captura de tela do vídeo reproduzido no Safari no iPhone, paisagem.", width = "600", height = "338" %}<figcaption> Captura de tela do vídeo reproduzido no Safari no iPhone, paisagem.</figcaption></figure>
</div>

A orientação do dispositivo em um iPad e Chrome no Android pode ser problemática. Por exemplo, sem qualquer personalização, um vídeo reproduzido em um iPad na orientação paisagem fica assim:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9FsExgY6cJFfMkxOPNkl.png", alt = "Captura de tela do vídeo reproduzido no Safari no iPad, paisagem.", width = "600", height = "450" %}<figcaption> Captura de tela do vídeo reproduzido no Safari no iPad, paisagem.</figcaption></figure>

Definir a `width: 100%` ou `max-width: 100%` com CSS pode resolver muitos problemas de layout de orientação do dispositivo.

### Reprodução automática

O `autoplay` controla se o navegador baixa e reproduz um vídeo imediatamente. A maneira precisa como funciona depende da plataforma e do navegador.

- Chrome: depende de vários fatores, incluindo, sem limitação, se a visualização é no desktop e se o usuário móvel adicionou seu site ou aplicativo à tela inicial. Para obter detalhes, consulte [Práticas recomendadas de reprodução automática](/autoplay-best-practices/) .

- Firefox: bloqueia todos os vídeos e sons, mas dá aos usuários a capacidade de relaxar essas restrições para todos os sites ou sites específicos. Para obter detalhes, consulte [Permitir ou bloquear a reprodução automática de mídia no Firefox](https://support.mozilla.org/en-US/kb/block-autoplay)

- Safari: historicamente exige um gesto do usuário, mas tem relaxado esse requisito nas versões recentes. Para obter detalhes, consulte [Novas políticas de &lt;vídeo&gt; para iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/) .

Mesmo em plataformas onde a reprodução automática é possível, você precisa considerar se é uma boa ideia habilitá-la:

- O uso de dados pode ser caro.
- A reprodução de mídia antes que o usuário deseje pode consumir largura de banda e CPU e, portanto, atrasar a renderização da página.
- Os usuários podem estar em um contexto em que a reprodução de vídeo ou áudio é invasiva.

### Pré-carga

O `preload` fornece uma dica ao navegador quanto à quantidade de informações ou conteúdo a ser pré-carregado.

<table class="responsive">
  <thead>
    <tr>
      <th>Valor</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-th="Value"><code>none</code></td>
      <td data-th="Description">O usuário pode optar por não assistir ao vídeo, portanto, não pré-carregue nada.</td>
    </tr>
    <tr>
      <td data-th="Value"><code>metadata</code></td>
      <td data-th="Description">Os metadados (duração, dimensões, trilhas de texto) devem ser pré-carregados, mas com o mínimo de vídeo.</td>
    </tr>
    <tr>
      <td data-th="Value"><code>auto</code></td>
      <td data-th="Description">Baixar o vídeo inteiro imediatamente é considerado desejável. Uma string vazia produz o mesmo resultado.</td>
    </tr>
  </tbody>
</table>

O `preload` tem efeitos diferentes em plataformas diferentes. Por exemplo, o Chrome armazena 25 segundos de vídeo no desktop, mas nenhum no iOS ou Android. Isso significa que no celular, pode haver atrasos na inicialização da reprodução que não acontecem no desktop. Consulte Reprodução rápida com pré- [carregamento de áudio e vídeo](/fast-playback-with-preload/) [ou o blog de Steve Souders](https://www.stevesouders.com/blog/2013/04/12/html5-video-preload/) para obter mais detalhes.

Agora que você sabe como adicionar mídia à sua página da web, é hora de aprender sobre [Acessibilidade de mídia,](/media-accessibility/) onde você adicionará legendas ao seu vídeo para deficientes auditivos ou quando reproduzir o áudio não for uma opção viável.
