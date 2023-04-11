---
layout: post
title: Lazy loading de imagens em navegadores
subhead: O lazy loading integrado nos navegadores finalmente chegou!
authors:
  - houssein
  - addyosmani
  - mathiasbynens
date: 2019-08-06
updated: 2020-07-16
hero: image/admin/F6VE4QkpCsomiJilTFNG.png
alt: Contorno de celular com carregamento de imagem e recursos
description: Este artigo trata do atributo "loading" e como ele pode ser usado para controlar o carregamento de imagens.
tags:
  - blog
  - performance
feedback:
  - api
---

O suporte, a nível de navegador, para ao lazy loading de imagens (carregamento assíncrono lento) já é suportado na web! Este vídeo mostra uma [demonstração](https://mathiasbynens.be/demo/img-loading-lazy) do recurso:

<figure data-size="full">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.mp4" type="video/mp4">
  </source></source></video></figure>

Do Chrome 76 em diante, você pode usar o atributo `loading` para carregar imagens usando a técnica de otimização lazy loading sem a necessidade de escrever código personalizado com essa finalidade ou usar uma biblioteca JavaScript separada. Vamos nos aprofundar nos detalhes.

## Compatibilidade dos navegadores

`<img loading=lazy>` é suportado pelos navegadores mais populares do Chromium (Chrome, Edge, Opera) e [Firefox](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/75#HTML). A implementação no WebKit (Safari) [está em andamento](https://bugs.webkit.org/show_bug.cgi?id=200764). O site [caniuse.com](https://caniuse.com/#feat=loading-lazy-attr) tem informações detalhadas sobre o suporte para vários navegadores. Os navegadores que não oferecem suporte ao `loading` simplesmente o ignoram sem efeitos colaterais.

## Por que lazy-loading no nível do navegador?

De acordo com o [HTTPArchive](https://httparchive.org/reports/page-weight), as imagens são o tipo de ativo mais solicitado para a maioria dos sites e geralmente ocupam mais largura de banda do que qualquer outro recurso. No 90º percentil, os sites enviam cerca de 4,7 MB de imagens em computadores e dispositivos móveis. Isso são muitas [fotos de gatos](https://en.wikipedia.org/wiki/Cats_and_the_Internet).

Atualmente, há duas maneiras de adiar o carregamento de imagens fora da tela:

- Usando a [API Intersection Observer](https://developer.chrome.com/blog/intersectionobserver/)
- Usando `scroll`, `resize` ou handlers para o evento `orientationchange` [](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#using_event_handlers_the_most_compatible_way)

Qualquer uma das opções permite que os desenvolvedores incluam a funcionalidade lazy-loading, e muitos desenvolvedores têm criado bibliotecas de terceiros para fornecer abstrações que são ainda mais fáceis de usar. Com o lazy-loading suportado diretamente pelo navegador, no entanto, não há necessidade de uma biblioteca externa. O lazy-loading no nível do navegador também garante que o carregamento adiado de imagens ainda funcione, mesmo se o JavaScript estiver desabilitado no cliente.

## O atributo `loading`

Hoje, o Chrome já carrega imagens com prioridades diferentes, dependendo de onde elas estão localizadas em relação à janela de visualização (viewport) do dispositivo. As imagens abaixo da viewport são carregadas com uma prioridade mais baixa, mas ainda são buscadas o mais rápido possível.

A partir do Chrome 76, você pode usar o atributo `loading` para adiar completamente o carregamento de imagens offscreen (as que só podem ser acessadas ao rolar):

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

Aqui estão os valores suportados para o atributo `loading`

- `auto`: comportamento lazy-loading default, que é o mesmo que não incluir o atributo.
- `lazy`: adia o carregamento do recurso até que ele alcance uma [distância calculada](#distance-from-viewport-thresholds) da viewport.
- `eager` : carrega o recurso imediatamente, independentemente de onde ele esteja localizado na página.

{% Aside 'caution' %} Embora disponível no Chromium, o `auto` não é mencionado na [especificação](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attributes). Uma vez que pode estar sujeito a alterações, recomendamos não usá-lo até que seja incluído. {% endAside %}

### Limites de distância da viewport (distance-from-viewport)

Todas as imagens acima da dobra, ou seja, imediatamente visíveis sem rolagem, são carregadas normalmente. Aquelas que estão muito abaixo da janela de visualização do dispositivo são buscadas apenas quando o usuário rola para perto delas.

A implementação de lazy-loading do Chromium tenta garantir que as imagens fora da tela sejam carregadas com antecedência suficiente para que tenham terminado de carregar no momento em que o usuário rolar para perto delas. Ao baixar imagens próximas antes que se tornem visíveis na janela de visualização, maximizamos a chance de elas já estarem carregadas no momento em que se tornarem visíveis.

Em comparação com as bibliotecas de lazy-loading do JavaScript, os limites para a obtenção de imagens que rolam para dentro da área de exibição podem ser considerados conservadores. O Chromium está procurando alinhar melhor esses limites com as expectativas do desenvolvedor.

{% Aside %} Experimentos realizados com o Chrome no Android sugerem que no 4G, 97,5% das imagens abaixo da dobra que são carregadas usando lazy-loading foram totalmente carregadas dentro de 10 ms do momento em que se tornam visíveis. Mesmo em redes 2G lentas, 92,6% das imagens abaixo da dobra foram totalmente carregadas em 10 ms. Isto significa que o lazy-loading no nível do navegador oferece uma experiência estável em relação à visibilidade dos elementos que são exibidos na tela. {% endAside %}

O limite de distância não é fixo e varia dependendo de vários fatores:

- O tipo de recurso de imagem que está sendo baixado
- Se o [modo Lite](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) está ativado no Chrome para Android
- O [tipo de conexão efetiva](https://googlechrome.github.io/samples/network-information/)

Você pode encontrar os valores default para os diferentes tipos de conexão efetiva na [fonte do Chromium](https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/frame/settings.json5?l=971-1003&rcl=e8f3cf0bbe085fee0d1b468e84395aad3ebb2cad). Esses números, e até mesmo a abordagem de buscar apenas quando uma certa distância da viewport é alcançada, podem mudar num futuro próximo, conforme a equipe do Chrome aprimora a heurística para determinar quando começar o carregamento.

{% Aside %} A partir do Chrome 77, você pode experimentar esses diferentes limites [limitando a rede](https://developer.chrome.com/docs/devtools/network/#throttle) no DevTools. Nesse ínterim, você precisará substituir o tipo de conexão efetiva do navegador usando a flag `about://flags/#force-effective-connection-type`. {% endAside %}

## Melhoria nos limites de economia de dados e distance-from-viewport

Em julho de 2020, o Chrome fez melhorias significativas para alinhar os limites de distance-from-viewport (distância da janela de visualização) para lazy-loading da imagem visando melhor atender às expectativas do desenvolvedor.

Em conexões rápidas (por exemplo, 4G), reduzimos os limites distance-from-viewport de `3000px` para `1250px` e em conexões mais lentas (por exemplo, 3G), alteramos o limite de `4000px` para `2500px`. Essa mudança afeta dois aspectos:

- `<img loading=lazy>` se comporta de maneira mais próxima da experiência oferecida pelas bibliotecas de lazy loading do JavaScript.
- Os novos limites para distance-from-viewport ainda nos permitem garantir que as imagens provavelmente tenham sido carregadas no momento em que o usuário rolar até elas.

Você encontrará uma comparação entre o antigo e o novo limite de distance-from-viewport para uma de nossas demonstrações em conexão rápida (4G) abaixo:

Limites antigos vs. novos:

<figure>   {% Img src="image/admin/xSZMqpbioBRwRTnenK8f.png", alt="Os novos e aprimorados limites para lazy loading de imagens, reduzindo os limites de distance-from-viewport para conexões rápidas de 3000px até 1250px", width="800", height="460" %}</figure>

e os novos limites versus LazySizes (uma biblioteca JS de lazy loading):

<figure>   {% Img src="image/admin/oHMFvflk9aesT7r0iJbx.png", alt="Os novos limites de distance-from-viewport no Chrome carregando 90 KB de imagens em comparação com LazySizes carregando em 70 KB nas mesmas condições de rede", width="800", height="355" %}</figure>

{% Aside %} Para garantir que os usuários do Chrome em versões recentes também se beneficiem dos novos limites, fizemos um backport dessas alterações para que o Chrome 79-85, inclusive, também os use. Lembre-se disso se tentar comparar a economia de dados de versões mais antigas do Chrome com as mais recentes. {% endAside %}

Estamos empenhados em trabalhar junto com a comunidade de padrões da web para explorar melhor o alinhamento em como os limites distance-from-viewport são abordados em diferentes navegadores.

### As imagens devem incluir atributos de dimensão

Quando o navegador carrega uma imagem, ele não sabe imediatamente as dimensões da imagem a menos que elas sejam explicitamente especificadas. Para permitir que o navegador reserve espaço suficiente numa página para imagens, é recomendável que todas as tags `<img>` incluam atributos `width` e `height`. Sem as dimensões especificadas, [podem ocorrer deslocamentos de layout](/cls), que são mais perceptíveis nas páginas que demoram para carregar.

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

Como alternativa, pode-se especificar esses valores diretamente num estilo inline:

```html
<img src="image.png" loading="lazy" alt="…" style="height:200px; width:200px;">
```

As melhores práticas de definir dimensões se aplicam a `<img>` independentemente de estarem ou não sendo carregados com lazy loading. Com o lazy loading, isto se torna ainda mais relevante. Definir `width` e `height` em imagens em navegadores modernos também permite que os navegadores deduzam seu tamanho intrínseco.

Na maioria dos cenários, as imagens ainda carregam via lazy loading se as dimensões não forem incluídas, mas existem alguns casos extremos que você deve conhecer. Se `width` e `height` não forem especificadas, as dimensões da imagem são 0×0 pixels no início. Se você tiver uma galeria de imagens assim, o navegador pode concluir que todas elas cabem dentro da viewport no início, já que cada uma delas praticamente não ocupa espaço e nenhuma imagem é empurrada para fora da tela. Nesse caso, o navegador determina que todas estão visíveis para o usuário e decide carregar tudo.

Além disso, [especificar as dimensões da imagem diminui as chances de ocorrerem deslocamentos de layout](https://www.youtube.com/watch?v=4-d_SoCHeWE). Se você não puder incluir dimensões para suas imagens, carregá-las lentamente pode ser uma compensação entre economizar recursos de rede e, potencialmente, correr mais risco de sofrer deslocamentos de layout.

Embora o lazy loading no Chromium seja implementado de forma que as imagens provavelmente serão carregadas assim que estiverem visíveis, ainda existe uma pequena chance de que elas ainda não tenham sido carregadas. Nesse caso, os atributos `width` e `height` ausentes nessas imagens aumentam seu impacto no Deslocamento Cumulativo de Layout.

{% Aside %} Dê uma olhada nesta [demonstração](https://mathiasbynens.be/demo/img-loading-lazy) para ver como o atributo `loading` funciona com 100 imagens. {% endAside %}

Imagens que são definidas usando o elemento `<picture>` também podem ser carregadas com lazy loading:

```html
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg 1x, larger.jpg 2x">
  <img src="photo.jpg" loading="lazy">
</picture>
```

Embora um navegador possa decidir qual imagem carregar de qualquer um dos elementos `<source>`, o atributo `loading` só precisa ser incluído no elemento `<img>`

## Evite usar lazy-loading em imagens que estão na primeira viewport visível

Você deve evitar definir `loading=lazy` para quaisquer imagens que estejam na primeira viewport visível.

Recomenda-se adicionar `loading=lazy` às imagens que estão posicionadas abaixo da dobra, se possível. Imagens que são carregadas imediatamente (eager) podem ser baixadas imediatamente, enquanto que para imagens que são carregadas de forma lazy o navegador precisará esperar até saber onde a imagem está posicionada na página, que depende do IntersectionObserver para estar disponível.

{% Aside %} No Chromium, o impacto das imagens na viewport inicial marcadas com `loading=lazy` no Largest Contentful Paint é bastante pequeno, com uma regressão de &lt;1% nos percentis 75 e 99 em comparação com as imagens carregadas imediatamente (eager). {% endAside %}

Geralmente, qualquer imagem na viewport deve ser carregada de forma imediata (eager) usando os defaults do navegador. Você não precisa especificar `loading=eager` para que este seja o caso para imagens em viewport.

```html
<!-- visible in the viewport -->
<img src="product-1.jpg" alt="..." width="200" height="200">
<img src="product-2.jpg" alt="..." width="200" height="200">
<img src="product-3.jpg" alt="..." width="200" height="200">

<!-- offscreen images -->
<img src="product-4.jpg" loading="lazy" alt="..." width="200" height="200">
<img src="product-5.jpg" loading="lazy" alt="..." width="200" height="200">
<img src="product-6.jpg" loading="lazy" alt="..." width="200" height="200">
```

## Degradação graciosa

Os navegadores que ainda não oferecem suporte ao atributo `loading` irão ignorar sua presença. Embora esses navegadores obviamente não obtenham os benefícios do lazy loading, incluir o atributo não tem impacto negativo sobre eles.

## Perguntas frequentes

### Existem planos para implementar o lazy-loading de imagens automaticamente no Chrome?

O Chromium já carrega automaticamente de forma lazy quaisquer imagens que sejam adequadas para serem adiadas se o [modo Lite](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) estiver ativado no Chrome para Android. Isto se destina principalmente a usuários conscientes em relação a economia de dados (data-savings).

### Posso alterar o quão perto uma imagem precisa estar antes que um carregamento seja disparado?

Esses valores são hardcoded e não podem ser alterados por meio da API. No entanto, eles podem mudar no futuro, à medida que os navegadores experimentam diferentes limites de distâncias e variáveis.

### Imagens de background CSS podem aproveitar o atributo `loading`?

Não, ele atualmente só pode ser usado com tags `<img>`

### Existe alguma desvantagem em usar lazy-loading com imagens que estão dentro da viewport do dispositivo?

É mais seguro evitar colocar `loading=lazy` em imagens acima da dobra, pois o Chrome não vai pré-carregar as imagens com `loading=lazy`.

### Como o atributo `loading` funciona com imagens que estão na viewport, mas que não estão imediatamente visíveis (por exemplo: atrás de um carrossel ou ocultas por CSS para determinados tamanhos de tela)?

Apenas as imagens que estão abaixo da viewport do dispositivo pela [distância calculada](#distance-from-viewport-thresholds) carregam de forma lazy. Todas as imagens acima da viewport, independentemente de serem imediatamente visíveis, são carregadas normalmente.

### E se eu já estiver usando uma biblioteca de terceiros ou um script para carregar imagens com lazy-loading?

O atributo `loading` não deve, de forma alguma, afetar o código que atualmente carrega de forma lazy seus ativos, mas existem algumas coisas importantes a serem consideradas:

1. Se o seu lazy-loader personalizado tentar carregar imagens ou frames antes do momento em que o Chrome os carrega normalmente, ou seja, a uma distância maior do que os [limites de distance-from-viewport](#distance-from-viewport-thresholds), eles ainda são adiados e carregados com base no comportamento normal do navegador.
2. Se o seu lazy-loader personalizado usa uma distância menor para determinar quando carregar uma imagem específica, do que o navegador, então o comportamento estaria de acordo com suas configurações personalizadas.

Um dos motivos importantes para continuar a usar uma biblioteca de terceiros junto com `loading="lazy"` é fornecer um polyfill para navegadores que ainda não suportam o atributo.

### Como faço para lidar com navegadores que ainda não oferecem suporte ao lazy-loading?

Crie um polyfill ou use uma biblioteca de terceiros para carregar imagens de forma lazy no seu site. A propriedade `loading` pode ser usada para detectar se o recurso é compatível com o navegador:

```js
if ('loading' in HTMLImageElement.prototype) {
  // supported in browser
} else {
  // fetch polyfill/third-party library
}
```

Por exemplo, [lazysizes](https://github.com/aFarkas/lazysizes) é uma biblioteca JavaScript popular de carregamento lazy. Você pode detectar o suporte para o atributo `loading` para carregar lazysizes como uma biblioteca fallback somente quando `loading` não for suportado. Isto funciona da seguinte maneira:

- Substitua `<img src>` por `<img data-src>` para evitar um carregamento imediato em navegadores não suportados. Se o atributo `loading` for suportado, troque `data-src` por `src`.
- Se o atributo `loading` não for suportado, carregue um fallback (lazysizes) e inicie-o. De acordo com a documentação do lazysizes, você usa a classe `lazyload` como uma forma de indicar aos lazysizes quais imagens devem ser carregadas de forma lazy.

```html
<!-- Let's load this in-viewport image normally -->
<img src="hero.jpg" alt="…">

<!-- Let's lazy-load the rest of these images -->
<img data-src="unicorn.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="cats.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="dogs.jpg" alt="…" loading="lazy" class="lazyload">

<script>
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.1.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
</script>
```

Aqui está uma [demonstração](https://lazy-loading.firebaseapp.com/lazy_loading_lib.html) desse padrão. Experimente em um navegador como Firefox ou Safari para ver o fallback em ação.

{% Aside %} A biblioteca lazysizes também fornece um [plug-in de carregamento](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/native-loading) que usa o lazy loading no nível do navegador quando disponível, mas retorna à funcionalidade personalizada da biblioteca quando necessário. {% endAside %}

### O lazy-loading para iframes também é suportado no Chrome?

`<iframe loading=lazy>` foi padronizado recentemente e já está implementado no Chromium. Isto permite que você carregue de forma lazy um iframe usando o atributo de `loading`. Um artigo dedicado sobre iframe lazy-loading será publicado na web.dev em breve.

O atributo `loading` afeta os iframes de maneira diferente das imagens, dependendo se o iframe está oculto ou não. (Iframes ocultos são frequentemente usados para fins analíticos ou de comunicação.) O Chrome usa os seguintes critérios para determinar se um iframe está oculto:

- Os atributos width e height do iframe tem valores de 4 px ou menos.
- `display: none` ou `visibility: hidden` é aplicado.
- O iframe é posicionado offscreen usando posicionamento X ou Y negativos.

Se um iframe atender a qualquer uma dessas condições, o Chrome vai considerá-lo oculto e não fará o lazy loading na maioria dos casos. Iframes que *não estão* ocultos são carregados apenas quando estiverem dentro dos limites de [distância da viewport](#distance-from-viewport-thresholds). Um espaço reservado é mostrado para iframes carregados de forma lazy que ainda estão sendo baixados.

### Como o lazy-loading no nível do navegador afeta os anúncios em uma página da web?

Todos os anúncios exibidos ao usuário na forma de uma imagem ou iframe carregam via lazy loading, como qualquer outra imagem ou iframe.

### Como as imagens são tratadas quando uma página web é impressa?

Embora a funcionalidade não esteja no Chrome atualmente, há um [issue aberto](https://bugs.chromium.org/p/chromium/issues/detail?id=875403) para garantir que todas as imagens e iframes sejam carregados imediatamente se uma página for impressa.

### O Lighthouse reconhece o lazy-loading no nível do navegador?

As versões anteriores do Lighthouse ainda destacavam que páginas que usam `loading=lazy` nas imagens precisavam ter uma estratégia para carregar imagens fora da tela. [O Lighthouse 6.0](/lighthouse-whats-new-6.0/) e acima são melhores nas abordagens para lidar com lazy loading de imagens fora da tela que podem usar limites diferentes, permitindo que eles sejam aprovados na auditoria [Adiar imagens fora da tela.](https://developer.chrome.com/docs/lighthouse/performance/offscreen-images/)

## Conclusão

O suporte para lazy-loading de imagens pode tornar muito mais fácil para você melhorar o desempenho de suas páginas web.

Você está percebendo algum comportamento incomum com esse recurso ativado no Chrome? [Registre um bug](https://bugs.chromium.org/p/chromium/issues/entry?summary=%5BLazyLoad%5D:&comment=Application%20Version%20%28from%20%22Chrome%20Settings%20%3E%20About%20Chrome%22%29:%20%0DAndroid%20Build%20Number%20%28from%20%22Android%20Settings%20%3E%20About%20Phone/Tablet%22%29:%20%0DDevice:%20%0D%0DSteps%20to%20reproduce:%20%0D%0DObserved%20behavior:%20%0D%0DExpected%20behavior:%20%0D%0DFrequency:%20%0D%3Cnumber%20of%20times%20you%20were%20able%20to%20reproduce%3E%20%0D%0DAdditional%20comments:%20%0D&labels=Pri-2&components=Blink%3ELoader%3ELazyLoad%2C) !
