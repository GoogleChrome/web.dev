---
title: Integre com a IU de compartilhamento do sistema operacional através da API Web Share
subhead: Aplicações Web podem usar os mesmos recursos de compartilhamento fornecidos pelo sistema que as aplicações específicas da plataforma.
authors:
  - joemedley
date: 2019-11-08
updated: 2021-07-09
hero: image/admin/ruvEms3AeSZvlEI01DKo.png
alt: Uma ilustração que demonstra que aplicações web podem usar a IU de compartilhamento fornecida pelo sistema.
description: Com a API Web Share, as aplicações web podem usar os mesmos recursos de compartilhamento fornecidos pelo sistema que aqueles usados pelas aplicações específicas da plataforma. A API Web Share torna possível para aplicações web compartilharem links, texto e arquivos com outras aplicações instaladas no dispositivo da mesma forma que aplicações específicas da plataforma.
tags:
  - blog
  - capabilities
feedback:
  - api
stack_overflow_tag: web-share
---

Com a API Web Share, as aplicações web podem usar os mesmos recursos de compartilhamento fornecidos pelo sistema que aqueles usados pelas aplicações específicas da plataforma. A API Web Share torna possível para aplicações web compartilharem links, texto e arquivos com outras aplicações instaladas no dispositivo da mesma forma que aplicações específicas da plataforma.

{% Aside %} Compartilhar é apenas metade da mágica. As aplicações web também podem ser alvos de compartilhamento, o que significa que podem receber dados, links, texto e arquivos de aplicações web ou específicas da plataforma. Veja o post [Receber dados compartilhados](/web-share-target/) para detalhes sobre como registrar sua aplicação como alvo de compartilhamento. {% endAside %}

## Conceitos e uso

<figure data-float="right">   {% Img src="image/admin/cCXNoHbXAfkAQzTTuS0Z.png", alt="Selecionador de compartilhamento de nível de sistema com um PWA instalado como opção.", width="370", height="349" %}   <figcaption>  Selecionador de compartilhamento de nível de sistema com um PWA instalado como uma opção.  </figcaption></figure>

### Capacidades e limitações

A Web Share tem os seguintes recursos e limitações:

- Só pode ser usado em um site [acessado via HTTPS](https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features).
- Precisa ser invocado em resposta a uma ação do usuário, como um clique. Invocá-lo por meio do `onload` é impossível.
- Pode compartilhar, URLs, texto ou arquivos.
- Em janeiro de 2021, ele estava disponível nos forks do Safari, Android em Chromium, ChromeOS e Chrome no Windows. O Chrome no MacOS ainda está em desenvolvimento. Consulte [MDN](https://developer.mozilla.org/docs/Web/API/Navigator/share#Browser_compatibility) para obter detalhes.

### Compartilhando links e texto

Para compartilhar links e texto, use o método `share()`, que é um método baseado em promessa com um objeto properties obrigatório. Para evitar que o navegador lance um `TypeError`, o objeto deve conter pelo menos uma das seguintes propriedades: `title`, `text`, `url` ou `files`. Você pode, por exemplo, compartilhar texto sem uma URL ou vice-versa. Permitir todos os três membros aumenta a flexibilidade dos casos de uso. Imagine se depois de executar o código abaixo, o usuário escolhesse um aplicativo de e-mail como destino. O `title` poderia ser o assunto do email, o `text`, o corpo da mensagem e os arquivos, os anexos.

```js
if (navigator.share) {
  navigator.share({
    title: 'web.dev',
    text: 'Check out web.dev.',
    url: 'https://web.dev/',
  })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
}
```

Se o seu site tiver múltiplas URLs para o mesmo conteúdo, compartilhe a URL canônica da página em vez da URL atual. Em vez de compartilhar `document.location.href` , você deve verificar se há uma tag `<meta>` `<head>` e compartilhá-la. Isto proporcionará uma melhor experiência ao usuário. Não apenas evita redirecionamentos, mas também garante que uma URL compartilhada forneça a experiência de usuário correta para um cliente específico. Por exemplo, se um amigo compartilha uma URL móvel e você a visualiza num computador desktop, você verá uma versão desktop:

```js
let url = document.location.href;
const canonicalElement = document.querySelector('link[rel=canonical]');
if (canonicalElement !== null) {
    url = canonicalElement.href;
}
navigator.share({url});
```

### Compartilhando arquivos

Para compartilhar arquivos, primeiro teste e chame `navigator.canShare()`. Em seguida, inclua um array de arquivos na chamada a `navigator.share()`:

```js/0-5
if (navigator.canShare && navigator.canShare({ files: filesArray })) {
  navigator.share({
    files: filesArray,
    title: 'Vacation Pictures',
    text: 'Photos from September 27 to October 14.',
  })
  .then(() => console.log('Share was successful.'))
  .catch((error) => console.log('Sharing failed', error));
} else {
  console.log(`Your system doesn't support sharing files.`);
}
```

Observe que o exemplo lida com a detecção de recursos testando `navigator.canShare()` em vez de `navigator.share()`. O objeto de dados passado para `canShare()` suporta apenas a propriedade de `files`. Arquivos de imagem, vídeo, áudio e texto podem ser compartilhados. (VEJA [Extensões de arquivo permitidas no Chromium](https://docs.google.com/document/d/1tKPkHA5nnJtmh2TgqWmGSREUzXgMUFDL6yMdVZHqUsg/edit?usp=sharing).) Mais tipos de arquivo podem ser adicionados no futuro.

## Estudo de caso do Santa Tracker (Siga o Papai Noel)

<figure data-float="right">   {% Img src="image/admin/2I5iOXaOpzEJlEbM694n.png", alt="O aplicativo Santa Tracker mostrando um botão de compartilhamento.", width="343", height="600" %}   <figcaption>    Botão de compartilhamento do Santa Tracker  </figcaption></figure>

O  [Santa Tracker](https://santatracker.google.com/), um projeto de código aberto, é uma tradição de férias no Google. Todo mês de dezembro, você pode comemorar a temporada com jogos e experiências educacionais.

Em 2016, a equipe do Santa Tracker usou a API Web Share no Android. Esta API foi uma solução perfeita para dispositivos móveis. Em anos anteriores, a equipe removeu os botões de compartilhamento no celular porque o espaço é reduzido e eles não podiam justificar ter vários alvos de compartilhamento.

Mas com a API Web Share, eles puderam apresentar um botão, economizando pixels preciosos. Eles também descobriram que os usuários compartilhavam com o Web Share cerca de 20% a mais do que os usuários sem a API habilitada. Acesse o [Santa Tracker](https://santatracker.google.com/) para ver o Web Share em ação.

## Suporte dos navegadores

O suporte do navegador para a API Web Share tem nuances e é recomendável usar a detecção de recursos (conforme descrito nos exemplos de código anteriores) em vez de presumir que um método específico seja totalmente suportado.

Desde o início de 2021, o uso da API para compartilhar títulos, textos e URLs é suportado por:

- Safari 12 ou posterior no macOS e iOS.
- Chrome 75 ou posterior no Android e 89 ou posterior no ChromeOS e Windows.

O uso da API para compartilhar arquivos é compatível com:

- Safari 15 ou posterior no macOS e iOS.
- Chrome 75 ou posterior no Android e 89 ou posterior no ChromeOS e Windows.

(A maioria dos navegadores baseados em Chromium, como o Edge, tem o mesmo suporte para esse recurso que a versão correspondente do Chrome.)

### Mostre seu apoio à API

Você está planejando usar a API Web Share? Seu apoio público ajuda a equipe do Chromium a priorizar os recursos e mostra a outros fornecedores de navegadores como o apoio é fundamental.

Envie um tweet para [@ChromiumDev](https://twitter.com/ChromiumDev) usando a hashtag [`#WebShare`](https://twitter.com/search?q=%23WebShare&src=recent_search_click&f=live) e diga-nos onde e como você está usando a API.

## Links úteis

- [Demos do Web Share](https://w3c.github.io/web-share/demos/share-files.html)
- [Scrapbook PWA](https://github.com/GoogleChrome/samples/blob/gh-pages/web-share/README.md#web-share-demo)
