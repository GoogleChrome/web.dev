---
title: Suporte de ícones adaptáveis em PWAs com ícones mascaráveis
subhead: Um novo formato de ícone para usar ícones adaptáveis em plataformas suportadas.
description: Os ícones mascaráveis são um novo formato de ícone que oferece mais controle e permite que sua Progressive Web App use ícones adaptáveis. Ao fornecer um ícone mascarável, seu ícone pode ficar ótimo em todos os dispositivos Android.
authors:
  - tigeroakes
  - thomassteiner
date: 2019-12-19
updated: 2021-05-19
hero: image/admin/lzLo9JCh6bcehH2nSH0n.png
alt: Ícones contidos dentro de círculos brancos em comparação com ícones que cobrem todo o seu círculo
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

## O que são ícones mascaráveis? {: #what }

Se você instalou uma Progressive Web App num celular Android recente, pode ter percebido que o ícone é exibido com um fundo branco. O Android Oreo introduziu ícones adaptáveis, que exibem ícones de aplicativos numa variedade de formas em diferentes modelos de dispositivos. Os ícones que não seguem esse novo formato recebem fundos brancos.

<figure>   {% Img src="image/admin/jzjx6dGkXN9EdqnUzAeg.png", alt="Ícones PWA em círculos brancos no Android", width="400", height="100" %}   <figcaption>Ícones transparentes de PWA aparecem dentro de círculos brancos no Android</figcaption></figure>

Os ícones mascaráveis são um novo formato de ícone que oferece mais controle e permite que a Progressive Web App use ícones adaptáveis. Se você fornecer um ícone mascarável, seu ícone pode preencher toda a forma e ter uma ótima aparência em todos os dispositivos Android. O Firefox e o Chrome adicionaram recentemente suporte para esse novo formato e você pode adotá-lo nas suas aplicações.

<figure>{% Img src="image/admin/J7gkg9ylP2ANlFawblze.png", alt="Ícones PWA cobrindo todo o círculo no Android", width="400", height="100" %} <figcaption>Ícones mascaráveis cobrem todo o círculo</figcaption></figure>

## Meus ícones atuais estão prontos?

Uma vez que os ícones mascaráveis precisam suportar uma variedade de formas, você deve fornecer uma imagem opaca com algum padding que o navegador possa posteriormente cortar na forma e no tamanho desejados. É melhor não confiar em nenhuma forma específica, uma vez que a forma escolhida pode variar de acordo com o navegador e a plataforma.

<figure data-float="right">   {% Video     src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/mx1PEstODUy6b5TXjo4S.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tw7QbXq9SBjGL3UYW0Fq.mp4"],     autoplay=true,     loop=true,     muted=true,     playsinline=true   %}   <figcaption>     Diferentes formatos específicos de plataforma </figcaption></figure>

Felizmente, existe uma "zona mínima de segurança" bem definida e [padronizada](https://w3c.github.io/manifest/#icon-masks) que todas as plataformas respeitam. As partes importantes de seu ícone, como seu logotipo, devem estar dentro de uma área circular no centro do ícone com um raio igual a 40% da largura do ícone. A borda externa de 10% pode ser cortada.

Você pode verificar quais partes de seus ícones estão dentro da zona de segurança com o Chrome DevTools. Com a sua Progressive Web App aberta, inicie o DevTools e navegue até o painel **Aplicação**. Na seção **Ícones** você pode escolher **Mostrar apenas a área mínima de segurança para ícones mascaráveis**. Seus ícones serão cortados para que apenas a área segura fique visível. Se o seu logotipo estiver visível nesta área segura, seu problema está resolvido.

<figure>   {% Img src="image/admin/UeKTJM2SE0SQhgnnyaQG.png", alt="Painel de aplicativos em DevTools exibindo ícones PWA com bordas cortadas", width="762", height="423" %}   <figcaption>O painel de aplicativos</figcaption></figure>

Para testar seu ícone mascarável com a variedade de formas Android, use a ferramenta [Maskable.app](https://maskable.app/) que criei. Abra um ícone e, em seguida, Maskable.app permitirá que você experimente com várias formas e tamanhos, e você pode compartilhar a visualização com outras pessoas de sua equipe.

## Como adoto ícones mascaráveis?

Se você deseja criar um ícone mascarável com base em seu ícone existente, você pode usar o [Editor Maskable.app](https://maskable.app/editor). Faça upload do seu ícone, ajuste a cor e o tamanho e exporte a imagem.

<figure>   {% Img src="image/admin/MDXDwH3RWyj4po6daeXw.png", alt="Maskable.app Editor screenshot", width="670", height="569" %}   <figcaption>Criação de ícones no Maskable.app Editor</figcaption></figure>

Depois de criar uma imagem de ícone mascarável e testá-la no DevTools, você precisará atualizar o {a0web app manifest  para apontar para os novos ativos. O web app manifest fornece informações sobre sua aplicação web em um arquivo JSON e inclui um [array de `icons`](/add-manifest/#icons).

Com a inclusão de ícones mascaráveis, um novo valor de propriedade foi adicionado para recursos de imagem listados num web app manifest. O campo `purpose` informa ao navegador como seu ícone deve ser usado. Por default, os ícones terão a finalidade `"any"`. Esses ícones serão redimensionados sobre um fundo branco no Android.

Os ícones que podem ser mascarados devem definir uma finalidade diferente: `"maskable"`. Isto indica que uma imagem deve ser usada com máscaras de ícones, dando a você mais controle sobre o resultado. Dessa forma, seus ícones não terão um fundo branco. Você também pode especificar múltiplas finalidades separadas por espaço (por exemplo, `"any maskable"` ), se desejar que o ícone mascarável seja usado sem máscara em outros dispositivos.

{% Aside %} Embora você *possa* especificar múltiplas finalidades separadas por espaço, como `"any maskable"`, na prática você *não deve*. Usar ícones `"maskable"` como ícones `"any"` não é o ideal, pois o ícone será usado como está, resultando em padding excessivo e deixando o conteúdo do ícone principal menor. Idealmente, os ícones para a finalidade `"any"` devem ter regiões transparentes e nenhum preenchimento extra, como os favicons do seu site, já que o navegador não vai adicionar isto neles. {% endAside %}

```json
{
  …
  "icons": [
    …
    {
      "src": "path/to/regular_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "path/to/maskable_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "maskable" // <-- New property value `"maskable"`
    },
    …
  ],
  …
}
```

Com isto, você pode seguir em frente e criar seus próprios ícones mascaráveis, garantindo que seu aplicativo tenha uma ótima aparência de ponta a ponta (ou círculo a círculo, oval a oval 😄).

## Agradecimentos

Este artigo foi revisado por [Joe Medley](https://github.com/jpmedley).
