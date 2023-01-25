---
layout: codelab
title: Carregamento lento de imagens fora da tela com lazysizes
authors:
  - katiehempenius
description: Neste codelab, aprenda a usar lazysizes para carregar apenas imagens que estejam na janela de visualização atual.
date: 2018-11-05
glitch: lazysizes
related_post: use-lazysizes-to-lazyload-images
tags:
  - performance
---

O carregamento lento é a abordagem que espera para carregar os recursos até que sejam necessários em vez de carregá-los antecipadamente. Isso pode melhorar o desempenho, reduzindo a quantidade de recursos que precisam ser carregados e analisados no carregamento inicial da página.

Imagens que estiverem fora da tela durante o carregamento de página inicial são candidatas ideais para essa técnica. E o melhor de tudo: [lazysizes](https://github.com/aFarkas/lazysizes) torna essa estratégia muito simples de implementar.

## Adicione o script lazysizes à página

{% Instruction 'remix' %}

`lazysizes.min.js` já foi baixado e adicionado a este Glitch. Para incluí-lo na página:

- Adicione a seguinte tag `<script>` ao `index.html` :

```html/0
  <script src="lazysizes.min.js" async></script>
  <!-- Fim da imagem -->
</body>
```

{% Aside %} O [arquivo lazysizes.min.js](https://raw.githubusercontent.com/aFarkas/lazysizes/gh-pages/lazysizes.min.js) já foi adicionado a este projeto, portanto, não há necessidade de adicioná-lo separadamente. O script que você acabou de adicionar pode usar este script. {% endAside %}

O lazysizes carrega imagens de forma inteligente conforme o usuário rola a página e prioriza as imagens que o usuário encontrará em breve.

## Indique as imagens para carregamento lento

- Adicione a classe `lazyload` às imagens que devem ser carregadas lentamente. Além disso, altere o atributo `src` `data-src` .

Por exemplo, as alterações para `flower3.png` ficariam assim:

```html/1/0
<img src="images/flower3.png" alt="">
<img data-src="images/flower3.png" class="lazyload" alt="">
```

Para este exemplo, tente fazer o carregamento lento de `flower3.png` , `flower4.jpg` e `flower5.jpg` .

{% Aside %} Você pode estar se perguntando por que é necessário alterar o atributo `src` `data-src`. Se este atributo não for alterado, todas as imagens serão carregadas imediatamente em vez de serem carregadas lentamente. `data-src` não é um atributo que o navegador reconhece, portanto, quando ele encontra uma tag de imagem com esse atributo, ele não carrega a imagem. Nesse caso, isso é bom, porque permite que o script lazysizes decida quando a imagem deve ser carregada, em vez de o navegador ter que fazer isso. {% endAside %}

## Veja em ação

É isso! Para ver essas mudanças em ação, siga estas etapas:

{% Instruction 'preview' %}

- Abra o console e encontre as imagens que acabaram de ser adicionadas. Suas classes devem mudar de `lazyload` para `lazyloaded` conforme você rola a página para baixo.

{% Img src="image/admin/yXej5KAOMzoqoQAB2paq.png", alt="Imagens durante o carregamento lento", width="428", height="252" %}

- Observe o painel de rede para ver os arquivos de imagem carregados individualmente conforme você rola a página para baixo.

{% Img src="image/admin/tcQpLeAubOW1l42eyXiW.png", alt="Imagens durante o carregamento lento", width="418", height="233" %}

## Verifique usando o Lighthouse

Por último, é uma boa ideia usar o Lighthouse para verificar essas alterações. A auditoria de desempenho "Adiar imagens fora da tela" do Lighthouse indicará se você se esqueceu de adicionar carregamento lento a qualquer imagem fora da tela.

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. Verifique se a auditoria **Adiar imagens fora da tela** foi aprovada.

{% Img src="image/admin/AWMJnCEi3IAgANHhTgiC.png", alt="Auditoria 'Codificar imagens de forma eficiente' aprovada no Lighthouse", width="800", height="774" %}

Sucesso! Você usou lazysizes para carregar lentamente as imagens em sua página.
