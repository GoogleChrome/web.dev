---
layout: post
title: Corrigindo conteúdo misto
authors:
  - johyphenel
  - rachelandrew
date: 2019-09-07
updated: 2020-09-23
description: |2-

  Descubra como corrigir erros de conteúdo misto em seu site para proteger os usuários e garantir que todo o seu conteúdo seja carregado.
tags:
  - security
  - network
  - privacy
  - html
  - css
  - javascript
  - images
  - media
---

O suporte a HTTPS para seu site é uma etapa importante para proteger seu site e seus usuários contra ataques, mas o conteúdo misto pode tornar essa proteção inútil. O conteúdo misto cada vez mais inseguro será bloqueado pelos navegadores, conforme explicado em [O que é conteúdo misto?](/what-is-mixed-content)

Neste guia, demonstraremos técnicas e ferramentas para corrigir problemas de conteúdo misto existentes e evitar que novos aconteçam.

## Encontrar conteúdo misto visitando seu site

Ao visitar uma página HTTPS no Google Chrome, o navegador o alerta sobre o conteúdo misturado como erros e avisos no console JavaScript.

Em [O que é conteúdo misto?](/what-is-mixed-content), você pode encontrar vários exemplos e ver como os problemas são relatados no Chrome DevTools.

O exemplo de [conteúdo misto passivo](https://passive-mixed-content.glitch.me/) fornecerá os seguintes avisos. Se o navegador conseguir encontrar o conteúdo em um `https` ele o atualizará automaticamente e exibirá uma mensagem.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Y7b4EWAbSL6BgI07FdQq.jpg", alt="Chrome DevTools mostrando os avisos exibidos quando conteúdo misto é detectado e atualizado", width="800", height="294" %}</figure>

[O conteúdo misto ativo](https://active-mixed-content.glitch.me/) é bloqueado e exibe um aviso.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KafrfEz1adCP2eUHQEWy.jpg", alt="Chrome DevTools mostrando os avisos exibidos quando o conteúdo misto ativo é bloqueado", width="800", height="304" %}</figure>

Se você encontrar avisos como esses para `http://` em seu site, será necessário corrigi-los na fonte do site. É útil fazer uma lista desses URLs, junto com a página em que os encontrou para usar ao corrigi-los.

{% Aside %} Erros e avisos de conteúdo misto são mostrados apenas para a página que você está visualizando no momento, e o console JavaScript é limpo sempre que você navegar para uma nova página. Isso significa que você terá que visualizar cada página do seu site individualmente para encontrar esses erros. {% endAside %}

### Encontrar conteúdo misto em seu site

Você pode pesquisar conteúdo misto diretamente em seu código-fonte. Pesquise por `http://` em sua fonte e procure por tags que incluem atributos de URL HTTP. Observe que ter `http://` no `href` das tags âncora (`<a>`) geralmente não é um problema de conteúdo misto, com algumas exceções notáveis discutidas posteriormente.

Se o seu site for publicado usando um sistema de gerenciamento de conteúdo, é possível que links para URLs não seguros sejam inseridos quando as páginas são publicadas. Por exemplo, as imagens podem ser incluídas com um URL completo em vez de um caminho relativo. Você precisará localizar e corrigir esses problemas no conteúdo do CMS.

### Corrigindo conteúdo misto

Depois de encontrar o conteúdo misto na fonte do seu site, você pode seguir estas etapas para corrigi-lo.

Se receber uma mensagem do console informando que uma solicitação de recurso foi atualizada automaticamente de HTTP para HTTPS, você pode alterar com segurança o URL `http://` do recurso em seu código para `https://`. Você também pode verificar se um recurso está disponível com segurança alterando `http://` para `https://` na barra de URL do navegador e tentar abrir o URL em uma guia do navegador.

Se o recurso não estiver disponível via `https://` , você deve considerar uma das seguintes opções:

- Incluir o recurso de um host diferente, se houver um disponível.
- Baixar e hospedar o conteúdo do seu site diretamente, se você tiver permissão legal para fazê-lo.
- Excluir o recurso de seu site completamente.

Tendo corrigido o problema, visualize a página onde você encontrou o erro originalmente e verifique se o erro não aparece mais.

### Cuidado com o uso de tag fora do padrão

Cuidado com o uso de tags fora do padrão em seu site. Por exemplo, `<a>` ) não resultam em erros de conteúdo misto, pois fazem com que o navegador acesse uma nova página. Isso significa que eles geralmente não precisam ser consertados. No entanto, alguns scripts de galeria de imagens substituem a funcionalidade da `<a>` e carregam o recurso HTTP especificado pelo `href` em uma exibição lightbox na página, causando um problema de conteúdo misto.

## Lidar com conteúdo misto em grande escala

As etapas manuais acima funcionam bem para sites menores; mas, para grandes sites ou sites com muitas equipes de desenvolvimento separadas, pode ser difícil controlar todo o conteúdo sendo carregado. Para ajudar nesta tarefa, você pode usar a política de segurança de conteúdo para instruir o navegador a notificá-lo sobre o conteúdo misturado e garantir que suas páginas nunca carreguem recursos inseguros inesperadamente.

### Política de segurança de conteúdo

[A política de segurança de conteúdo](/csp/) (CSP) é um recurso de navegador multifuncional que você pode usar para gerenciar conteúdo misto em escala. O mecanismo de relatório CSP pode ser usado para rastrear o conteúdo misto em seu site e oferecer políticas de aplicação para proteger os usuários através de atualização ou bloqueio de conteúdo misto.

Você pode habilitar esses recursos para uma página incluindo o `Content-Security-Policy` ou `Content-Security-Policy-Report-Only` na resposta enviada de seu servidor. Além disso, você pode definir `Content-Security-Policy` (embora **não** `Content-Security-Policy-Report-Only` ) usando uma `<meta>` na seção `<head>` de sua página.

{% Aside %} Navegadores modernos aplicam todas as políticas de segurança de conteúdo que recebem. Vários valores de cabeçalho CSP recebidos pelo navegador no cabeçalho de resposta ou `<meta>` são combinados e aplicados como uma única política; as políticas de relatórios são combinadas da mesma forma. As políticas são combinadas tomando a interseção das políticas; ou seja, cada política após a primeira só pode restringir ainda mais o conteúdo permitido, e não ampliá-lo. {% endAside %}

### Encontrar conteúdo misto com política de segurança de conteúdo

Você pode usar a política de segurança de conteúdo para coletar relatórios de conteúdo misto em seu site. Para habilitar esse recurso, defina a `Content-Security-Policy-Report-Only` adicionando-a como um cabeçalho de resposta para o seu site.

Cabeçalho de resposta:

`Content-Security-Policy-Report-Only: default-src https: 'unsafe-inline' 'unsafe-eval'; report-uri https://example.com/reportingEndpoint`

{% Aside %} O [cabeçalho de resposta report-uri](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri) está sendo substituído por [report-to](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/report-to). O suporte do navegador para `report-to` está atualmente limitado ao Chrome e ao Edge. Você pode fornecer os dois cabeçalhos; nesse caso, `report-uri` será ignorado se o navegador suportar `report-to`. {% endAside %}

Sempre que um usuário visita uma página em seu site, o navegador envia relatórios formatados em JSON sobre qualquer coisa que viole a política de segurança de conteúdo para `https://example.com/reportingEndpoint` . Nesse caso, sempre que um sub-recurso é carregado por HTTP, um relatório é enviado. Esses relatórios incluem o URL da página onde ocorreu a violação da política e o URL do sub-recurso que violou a política. Se você configurar seu endpoint de relatório para registrar esses relatórios, poderá rastrear o conteúdo misto em seu site sem ter que você mesmo visitar cada página.

As duas ressalvas são:

- Os usuários devem visitar sua página em um navegador que entenda o cabeçalho CSP. Isso é verdade para a maioria dos navegadores modernos.
- Você só obtém relatórios para páginas visitadas por seus usuários. Portanto, se você tiver páginas que não recebam muito tráfego, pode levar algum tempo até que você obtenha relatórios para todo o site.

O [guia de política de segurança de conteúdo](/csp/) contém mais informações e um exemplo de terminal.

### Alternativas para relatar com CSP

Se o seu site for hospedado por uma plataforma como o Blogger, você não terá acesso para modificar cabeçalhos e adicionar um CSP. Em vez disso, uma alternativa viável poderia ser usar um rastreador de site da Web para encontrar problemas em seu site para você, como [HTTPSChecker](https://httpschecker.net/how-it-works#httpsChecker) ou [Mixed Content Scan](https://github.com/bramus/mixed-content-scan).

### Atualizando solicitações inseguras

Os navegadores estão começando a atualizar e bloquear solicitações inseguras. Você pode usar as diretivas CSP para forçar a atualização automática ou o bloqueio desses ativos.

A [`upgrade-insecure-requests`](https://www.w3.org/TR/upgrade-insecure-requests/) instrui o navegador a atualizar URLs inseguros antes de fazer solicitações de rede.

Por exemplo, se uma página contém uma tag de imagem com um URL HTTP, como `<img src="http://example.com/image.jpg">`

Em vez disso, o navegador faz uma solicitação segura para `https://example.com/image.jpg` , salvando assim o usuário de conteúdo misto.

Você pode ativar esse comportamento enviando um `Content-Security-Policy` com esta diretiva:

```markup
Content-Security-Policy: upgrade-insecure-requests
```

Ou incorporando a mesma diretiva in-line na `<head>` do documento usando um elemento `<meta>`

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

Tal como acontece com a atualização automática do navegador, se o recurso não estiver disponível em HTTPS, a solicitação atualizada falhará e o recurso não será carregado. Isso mantém a segurança de sua página. A `upgrade-insecure-requests` irá além da atualização automática do navegador, tentando atualizar as solicitações que o navegador atualmente não faz.

A `upgrade-insecure-requests` desdobra-se em `<iframe>`, garantindo que a página inteira seja protegida.

### Bloqueando todo o conteúdo misto

Uma opção alternativa para proteger os usuários é a diretiva CSP [`block-all-mixed-content`](https://www.w3.org/TR/mixed-content/#strict-checking). Esta diretiva instrui o navegador a nunca carregar conteúdo misto; todas as solicitações de recursos de conteúdo misto são bloqueadas, incluindo conteúdo misto ativo e passivo. Essa opção também se desdobra em `<iframe>` , garantindo que toda a página tenha conteúdo misto livre.

Uma página pode optar por esse comportamento enviando um `Content-Security-Policy` com esta diretiva:

```markup
Content-Security-Policy: block-all-mixed-content
```

Ou incorporando a mesma diretiva in-line na `<head>` do documento usando um elemento `<meta>`

```html
<meta http-equiv="Content-Security-Policy" content="block-all-mixed-content">
```

{% Aside %} Se você definir `upgrade-insecure-requests` e `block-all-mixed-content`, `upgrade-insecure-requests` será avaliada e usada primeiro. O navegador não bloqueará solicitações. Portanto, você deve usar uma ou outra. {% endAside %}
