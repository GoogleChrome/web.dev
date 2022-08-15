---
layout: post
title: A página não contém um título, link para pular ou região de referência
description: |2

  Aprenda como melhorar a acessibilidade de sua página da web, tornando-a mais fácil para

  tecnologias assistivas para pular elementos de navegação repetidos.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - bypass
---

Para usuários que não podem usar um mouse, o conteúdo que se repete nas páginas do seu site pode dificultar a navegação. Por exemplo, os usuários de leitores de tela podem ter que navegar por vários links em um menu de navegação para chegar ao conteúdo principal da página.

Fornecer uma maneira de contornar o conteúdo repetitivo torna a navegação sem mouse mais fácil.

## Como esta auditoria Lighthouse falha

O Lighthouse sinaliza páginas que não oferecem uma maneira de pular conteúdo repetitivo:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fJBo4Nbmlks8cj5i2UMJ.png", alt = "A auditoria Lighthouse mostrando que a página não contém um título, link para pular ou região do ponto de referência", width = "800", height = "185" %}</figure>

O Lighthouse verifica se a página contém pelo menos um dos seguintes:

- Um elemento `<header>`
- Um [link para pular](/headings-and-landmarks#bypass-repetitive-content-with-skip-links)
- Um [marco](/headings-and-landmarks/#use-landmarks-to-aid-navigation)

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como melhorar a navegação do teclado

A aprovação na auditoria do Lighthouse é simples: adicione um título, um [link para pular](/headings-and-landmarks#bypass-repetitive-content-with-skip-links) ou um [ponto de referência](/headings-and-landmarks/#use-landmarks-to-aid-navigation) à sua página.

No entanto, para melhorar significativamente a experiência de navegação para usuários de tecnologia assistiva,

- Coloque todo o conteúdo da página dentro de um elemento de referência.
- Certifique-se de que cada ponto de referência reflita com precisão o tipo de conteúdo que contém.
- Forneça um link para ignorar.

{% Aside %} Enquanto a maioria dos leitores de tela permite que os usuários naveguem por pontos de referência, outras tecnologias de assistência, como [dispositivos de troca](https://en.wikipedia.org/wiki/Switch_access) , permitem apenas que os usuários percorram cada elemento na ordem das guias, um de cada vez. Portanto, é importante fornecer pontos de referência e pular links sempre que possível. {% endAside %}

Neste exemplo, todo o conteúdo está dentro de um ponto de referência, os títulos criam um contorno do conteúdo da página, nenhum título é pulado e um link para pular é fornecido para pular o menu de navegação:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document title</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <a class="skip-link" href="#maincontent">Skip to main</a>
    <h1>Page title</h1>
    <nav>
      <ul>
        <li>
          <a href="https://google.com">Nav link</a>
          <a href="https://google.com">Nav link</a>
          <a href="https://google.com">Nav link</a>
        </li>
      </ul>
    </nav>
    <main id="maincontent">
      <section>
        <h2>Section heading</h2>
	      <p>
	        Bacon ipsum dolor amet brisket meatball chicken, cow hamburger pork belly
	        alcatra pig chuck pork loin jerky beef tri-tip porchetta shank. Kevin porchetta
	        landjaeger, ribeye bacon strip steak pork chop tenderloin andouille.
	      </p>
        <h3>Sub-section heading</h3>
          <p>
            Prosciutto pork chicken chuck turkey tongue landjaeger shoulder picanha capicola
            ball tip meatball strip steak venison salami. Shoulder frankfurter short ribs
            ham hock, ball tip pork chop tenderloin beef ribs pastrami filet mignon.
          </p>
      </section>
    </main>
  </body>
</html>
```

Normalmente, você não deseja mostrar o link de pular para os usuários do mouse, então é convencional usar CSS para ocultá-lo fora da tela até que receba o [foco](/keyboard-access/#focus-and-the-tab-order) :

```css
/* style.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

Consulte a [postagem de títulos e pontos de referência](/headings-and-landmarks) para obter mais informações.

## Recursos

- [O código-fonte da **página não contém um título, link para pular ou** auditoria de região de referência](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/bypass.js)
- [A página deve ter meios para contornar bloqueios repetidos (Universidade Deque)](https://dequeuniversity.com/rules/axe/3.3/bypass)
