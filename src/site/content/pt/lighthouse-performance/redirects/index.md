---
layout: post
title: Evite vários redirecionamentos de página
description: |2

  Saiba por que os redirecionamentos de página diminuem a velocidade de carregamento de sua página da web e

  como evitá-los.
web_lighthouse:
  - redireciona
date: 2019-05-04
updated: 2019-09-19
---

Redirecionamentos diminuem a velocidade de carregamento da página. Quando um navegador solicita um recurso que foi redirecionado, o servidor geralmente retorna uma resposta HTTP como esta:

```js
HTTP/1.1 301 Moved Permanently
Location: /path/to/new/location
```

O navegador deve então fazer outra solicitação HTTP no novo local para recuperar o recurso. Essa viagem adicional pela rede pode atrasar o carregamento do recurso em centenas de milissegundos.

## Como a auditoria de múltiplos redirecionamentos do Lighthouse falha

[O farol](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza páginas que têm vários redirecionamentos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uGOmnhqZoJnMoBgAiFJj.png", alt="", width="800", height="276" %}</figure>

Uma página falha nesta auditoria quando tem dois ou mais redirecionamentos.

## Como eliminar redirecionamentos

Links de pontos para recursos sinalizados para as localizações atuais dos recursos. É especialmente importante evitar redirecionamentos em recursos necessários para seu [caminho de renderização crítico](/critical-rendering-path/).

Se você estiver usando redirecionamentos para desviar os usuários móveis para a versão móvel de sua página, considere projetar seu site novamente para usar [design responsivo](/responsive-web-design-basics/).

## Orientação específica de pilha

### React

Se você estiver usando o React Router, minimize o uso do componente `<Redirect>` [para navegações de rota](https://reacttraining.com/react-router/web/api/Redirect).

## Recursos

- [Código-fonte para evitar auditoria de **redirecionamentos de várias páginas**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/redirects.js)
- [Redirecionamentos em HTTP](https://developer.mozilla.org/docs/Web/HTTP/Redirections)
- [Evite redirecionamentos da página de destino](https://developers.google.com/speed/docs/insights/AvoidRedirects)
