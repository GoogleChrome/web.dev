---
layout: post
title: É hora de carregar de forma lazy iframes offscreen!
subhead: O carregamento lazy integrado no navegador para iframes já chegou
authors:
  - addyosmani
date: 2020-07-24
updated: 2022-07-12
hero: image/admin/dMCW2Qqi5Qp2DB3w4DyE.png
alt: Contorno de telefone com carregamento de imagem e recursos
description: Este artigo trata o atributo loading e como ele pode ser usado para controlar o carregamento de iframes.
tags:
  - blog
  - performance
  - memory
feedback:
  - api
---

[O carregamento lazy padrão para imagens](/browser-level-image-lazy-loading/) foi inicialmente suportado no Chrome 76 através do atributo `loading` e posteriormente chegou no Firefox. Estamos felizes em compartilhar que **o carregamento lazy no nível do navegador para iframes** agora é [padrão](https://github.com/whatwg/html/pull/5579) e também é suportado nos navegadores Chrome e baseados em Chromium.

```html/1
<iframe src="https://example.com"
        loading="lazy"
        width="600"
        height="400"></iframe>
```

O carregamento lazy padrão para iframes adia o carregamento de iframes offscreen até que o usuário role para perto deles. Isto preserva dados, acelera o carregamento de outras partes da página e reduz o uso de memória.

Esta [demo](https://lazy-load.netlify.app/iframes/) de `<iframe loading=lazy>` mostra incorporações de vídeo com carregamento lazy:

<figure data-size="full">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/iframe-lazy-loading/lazyload-iframes-compressed.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/iframe-lazy-loading/lazyload-iframes-compressed.mp4" type="video/mp4">
  </source></source></video></figure>

### Por que devemos carregar iframes usando lazy loading?

As incorporações de terceiros cobrem uma ampla gama de casos de uso, desde players de vídeo a postagens em mídias sociais e anúncios. Frequentemente, esse conteúdo não fica imediatamente visível na viewport do usuário. Em vez disso, ele só é visto quando o usuário rola mais para baixo na página. Apesar disso, os usuários pagam o custo elevado do download de dados e JavaScript para todos os frames, mesmo que não role até eles.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xqZMRuULxbz6DVXNP8ea.png", alt="Economia de dados com o carregamento lazy para um iframe. O carregamento eager baixa 3 MB neste exemplo, enquanto o carregamento lazy não baixa nada neste código até que o usuário role para mais perto do iframe. ", width="800", height="460" %}</figure>

Com base na pesquisa do Chrome sobre [carregamento automático de iframes offscreen usando lazy-loading para usuários Data Saver](https://blog.chromium.org/2019/10/automatically-lazy-loading-offscreen.html), o carregamento lazy de iframes pode levar a uma economia média de dados de 2-3%, reduções de 1-2% na [First Contentful Paint](/fcp/) (FCP) na mediana e uma melhora de 2% da [First Input Delay](/fid/) (FID) no percentil 95.

### Como funciona o carregamento lazy integrado para iframes?

O atributo `loading` permite que um navegador adie o carregamento de iframes e imagens offscreen até que os usuários rolarem para perto deles. O atributo `loading` suporta três valores:

- `lazy` : é um bom candidato para carregamento lazy.
- `eager` : não é um bom candidato para carregamento lazy. Carregue imediatamente.

O uso do atributo `loading` em iframes funciona da seguinte maneira:

```html
<!-- Lazy-load the iframe -->
<iframe src="https://example.com"
        loading="lazy"
        width="600"
        height="400"></iframe>

<!-- Eagerly load the iframe -->
<iframe src="https://example.com"
        width="600"
        height="400"></iframe>

<!-- or use loading="eager" to opt out of automatic
lazy-loading in Lite Mode -->
<iframe src="https://example.com"
        loading="eager"
        width="600"
        height="400"></iframe>
```

Não especificar o atributo terá o mesmo efeito que carregar o recurso de forma imediata (eager), exceto para usuários do [Lite Mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html), onde o Chrome usará o `auto` para decidir se deve ser carregado de forma adiada (lazy).

Se você precisar criar iframes *dinamicamente* usando JavaScript, definir `iframe.loading = 'lazy'` no elemento também é [suportado](https://bugs.chromium.org/p/chromium/issues/detail?id=993273):

```js/2
var iframe = document.createElement('iframe');
iframe.src = 'https://example.com';
iframe.loading = 'lazy';
document.body.appendChild(iframe);
```

#### Comportamento de carregamento lazy específico para iframes

O atributo loading afeta os iframes de maneira diferente das imagens, dependendo se o iframe está oculto ou não. (Os iframes ocultos são frequentemente usados para fins de análises ou de comunicação.) O Chrome usa os seguintes critérios para determinar se um iframe está oculto:

- Os atributos width e height do iframe tem valores de 4 px ou menos.
- `display: none` ou `visibility: hidden` é aplicado.
- O iframe é posicionado offscreen usando posicionamento X ou Y negativos.
- Estes critérios se aplicam a `loading=lazy` e `loading=auto`.

Se um iframe atender a qualquer uma dessas condições, o Chrome vai considerá-lo oculto e não fará o lazy loading na maioria dos casos. Os iframes que não estão ocultos serão carregados apenas quando estiverem dentro dos <a>limites de distância de carregamento</a>. O Chrome mostra um placeholder para iframes carregados de forma lazy que ainda estão sendo baixados.

### Que impacto poderemos ver nas incorporações de iframes populares usando carregamento lazy?

E se pudéssemos mudar a web em geral de forma que o default fosse carregar de forma lazy os iframes offscreen? Seria algo assim:

Incorporações de vídeos do YouTube com lazy-loading (economiza 500KB na carga inicial):

```html/1
<iframe src="https://www.youtube.com/embed/YJGCZCaIZkQ"
        loading="lazy"
        width="560"
        height="315"
        frameborder="0"
        allow="accelerometer; autoplay;
        encrypted-media; gyroscope;
        picture-in-picture"
        allowfullscreen></iframe>
```

**Anedota:** quando passamos a fazer incorporações do YouTube com lazy-loading para o Chrome.com, economizamos 10 segundos do tempo em que nossas páginas seriam interativas em dispositivos móveis. Abri um bug interno com o YouTube para discutir a adição de `loading=lazy` ao seu código de incorporação.

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HQkwBgEoyiZsiOaPyz8v.png", alt = "", width = "800", height = "460"%}<br><br>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HQkwBgEoyiZsiOaPyz8v.png", alt="Chrome.com conseguiu uma redução de 10 segundos no tempo de interação ao carregar de forma lazy iframes offscreen para seu vídeo do YouTube incorporado", width="800", height="460" %}</figure>

{% Aside %} Se você estiver procurando maneiras mais eficientes de carregar incorporações do YouTube, talvez interesse explorar o [componente YouTube Lite](https://github.com/paulirish/lite-youtube-embed). {% endAside %}

**Incorporações do Instagram com lazy-loading (preserva &gt;100 KB compactados em gzip na carga inicial):**

As incorporações do Instagram fornecem um bloco de marcação e um script, que injeta um iframe na sua página. O carregamento lazy desse iframe evitaria ter que carregar todo o script necessário para a incorporação. Como essas incorporações são frequentemente exibidas abaixo da viewport na maioria dos artigos, este parece ser um candidato razoável para o carregamento lazy de seu iframe.

**Incorporações do Spotify com lazy-loading (preserva 514KB em carga inicial):**

```html
<iframe src="https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3"
        loading="lazy"
        width="300"
        height="380"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"></iframe>
```

Embora as incorporações acima ilustrem os benefícios potenciais de iframes de carregamento lazy para conteúdo de mídia, há o potencial de também ver esses benefícios em anúncios.

### Estudo de caso: carregamento lazy dos plug-ins sociais do Facebook

Os *plug-ins sociais* do Facebook permitem que os desenvolvedores incorporem conteúdo do Facebook em suas páginas web. Há vários desses plug-ins oferecidos, como postagens incorporadas, fotos, vídeos, comentários… O mais popular é o [plug-in Like](https://developers.facebook.com/docs/plugins/like-button/): um botão que mostra uma contagem de quem "curtiu" a página. Por default, a incorporação do plugin Like numa página web (usando o FB JSSDK) baixa cerca de 215 KB de recursos, 197 KB dos quais é JavaScript. Em muitos casos, o plug-in pode aparecer no final de um artigo ou próximo ao final de uma página, portanto, carregá-lo de forma imediata quando está offscreen pode não ser o ideal.

<figure>   {% Img src="image/admin/fdy8o61jxPN560IkF2Ne.png", alt="Botão Facebook Like", width="800", height="71" %}</figure>

Graças ao engenheiro Stoyan Stefanov, [todos os plug-ins sociais do Facebook agora suportam carregamento lazy padrão de iframes](https://developers.facebook.com/docs/plugins/like-button#settings). Os desenvolvedores que optarem pelo carregamento lazy por meio da configuração `data-lazy` dos plug-ins agora poderão evitar que ele carregue até que o usuário role nas proximidades. Isto permite que os recursos incorporados funcionem totalmente para os usuários que precisarem deles, ao mesmo tempo que oferece economia de dados para aqueles que não rolarem uma página até o fim. Esperamos que esta seja a primeira de muitas incorporações a explorar o carregamento lazy de iframe padrão em produção.

### Posso carregar iframes de forma lazy em múltiplos navegadores? Sim

Os iframes com carregamento lazy podem ser aplicados como um aprimoramento progressivo. Os navegadores que suportam o `loading=lazy` em iframes farão o carregamento lazy do iframe, enquanto o atributo `loading` será ignorado com segurança em navegadores que ainda não o suportam.

Também é possível fazer o carregamento lazy de iframes offscreen usando a biblioteca JavaScript [lazysizes](/use-lazysizes-to-lazyload-images/). Isto pode ser desejável se você:

- requer mais limites personalizados de carregamento lazy do que o que o carregamento lazy padrão oferece atualmente
- deseja oferecer aos usuários uma experiência consistente de carregamento lazy de iframes em todos os navegadores

```html/3
<script src="lazysizes.min.js" async></script>

<iframe frameborder="0"
	  class="lazyload"
    allowfullscreen=""
    width="600"
    height="400"
    data-src="//www.youtube.com/embed/ZfV-aYdU4uE">
</iframe>
```

Use o seguinte padrão para detectar o carregamento lento e buscar lazysizes quando não estiver disponível:

```html/2
<iframe frameborder="0"
	  class="lazyload"
    loading="lazy"
    allowfullscreen=""
    width="600"
    height="400"
    data-src="//www.youtube.com/embed/ZfV-aYdU4uE">
</iframe>

<script>
  if ('loading' in HTMLIFrameElement.prototype) {
    const iframes = document.querySelectorAll('iframe[loading="lazy"]');

    iframes.forEach(iframe => {
      iframe.src = iframe.dataset.src;
    });

  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

</script>
```

### Uma opção para usuários do WordPress {: #wordpress}

Você pode ter uma grande quantidade de iframes espalhados pelo conteúdo de anos de posts num site WordPress. Opcionalmente, você pode adicionar o seguinte código ao arquivo `functions.php` do tema do WordPress para inserir automaticamente `loading="lazy"` nos seus iframes existentes, sem precisar atualizá-los manualmente cada um por um.

Observe que [o suporte no nível do navegador para iframes com lazy loading também está sendo trabalhado no núcleo do WordPress](https://core.trac.wordpress.org/ticket/50756). O trecho de código a seguir verificará as flags relevantes para que, uma vez que o WordPress tenha a funcionalidade integrada, não acrescente mais manualmente o atributo `loading="lazy"`, garantindo que seja interoperável com essas alterações e não resulte num atributo duplicado.

```php
// TODO: Remove once https://core.trac.wordpress.org/ticket/50756 lands.
function wp_lazy_load_iframes_polyfill( $content ) {
	// If WP core lazy-loads iframes, skip this manual implementation.
	if ( function_exists( 'wp_lazy_loading_enabled' ) && wp_lazy_loading_enabled( 'iframe', 'the_content' ) ) {
		return $content;
	}

	return str_replace( '<iframe ', '<iframe loading="lazy" ', $content );
}
add_filter( 'the_content', 'wp_lazy_load_iframes_polyfill' );
```

Se o seu site WordPress utiliza cache (dica: deveria), não se esqueça de reconstruir o cache do seu site depois.

### Conclusão

Incluir suporte padrão para carregamento lazy de iframes torna significativamente mais fácil para você melhorar o desempenho de suas páginas web. Se você tiver algum comentário, sinta-se à vontade para enviar um issue para o [Chromium Bug Tracker](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ELoader%3ELazyLoad).

E, caso você não tenha visto, veja a [coleção de  imagens e vídeos com carregamento lazy](/fast/#lazy-load-images-and-video) do web.dev para obter mais ideias de carregamento lazy.

*Com agradecimentos a Dom Farolino, Scott Little, Houssein Djirdeh, Simon Pieters, Kayce Basques, Joe Medley e Stoyan Stefanov por suas críticas.*
