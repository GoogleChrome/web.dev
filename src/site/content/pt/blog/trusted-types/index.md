---
title: Evite vulnerabilidades de scripting cross-site baseado em DOM com Tipos confiáveis
subhead: Reduza a superfície de ataque DOM XSS de seu aplicativo.
authors:
  - koto
date: 2020-03-25
hero: image/admin/3Mgu37qU0P4fVdI4NTxM.png
alt: Snippets de código que demonstram vulnerabilidades de scripting cross-site.
description: |2

  Apresentando Tipos confiáveis: uma API de navegador para evitar cross-site baseado em DOM

  scripts em aplicativos da web modernos.
tags:
  - blog
  - security
feedback:
  - api
---

## Por que você deveria se importar?

Cross-site scripting baseado em DOM (DOM XSS) é uma das vulnerabilidades de segurança da web mais comuns e é muito fácil introduzi-lo em seu aplicativo. Ps [Tipos confiáveis](https://github.com/w3c/webappsec-trusted-types) fornecem as ferramentas para escrever, revisar a segurança e manter aplicativos livres de vulnerabilidades DOM XSS, tornando as funções perigosas da API da web seguras por padrão. Tipos confiáveis são suportados no Chrome 83 e um [polyfill](https://github.com/w3c/webappsec-trusted-types#polyfill) está disponível para outros navegadores. Consulte [Compatibilidade do navegador](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types#browser_compatibility) para obter informações atualizadas de suporte entre navegadores.

{% Aside 'key-term' %} O script cross-site baseado em DOM acontece quando os dados de uma *fonte* controlada pelo usuário (como nome de usuário ou URL de redirecionamento obtido do fragmento de URL) chegam a um *coletor*, que é uma função como `eval()` ou um definidor de propriedade como `.innerHTML`, que pode executar código JavaScript arbitrário. {% endAside %}

## Histórico

Por muitos anos, o [DOM XSS](https://owasp.org/www-community/attacks/xss/) foi uma das vulnerabilidades de segurança da web mais prevalentes e perigosas.

Existem dois grupos distintos de scripting cross-site. Algumas vulnerabilidades XSS são causadas pelo código do lado do servidor que cria de forma insegura o código HTML que forma o site. Outros têm uma causa raiz no cliente, em que o código JavaScript chama funções perigosas com conteúdo controlado pelo usuário.

Para [evitar o XSS do lado do servidor](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), não gere HTML concatenando strings e, em vez disso, use bibliotecas de modelos de escape automático contextual. Use uma [Política de Segurança de Conteúdo baseada em nonce](https://csp.withgoogle.com/docs/strict-csp.html) para mitigação adicional contra os bugs conforme eles inevitavelmente acontecerem.

Agora, um navegador também pode ajudar a prevenir os XSSes do lado do cliente (também conhecidos como baseados em DOM) com [Tipos confiáveis](https://bit.ly/trusted-types) .

## Introdução sobre a API

Tipos confiáveis funcionam bloqueando as seguintes funções de coletor de risco. Você já deve reconhecer alguns deles, pois os fornecedores de navegadores e [estruturas da web](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) já afastam você do uso desses recursos por motivos de segurança.

- **Manipulação de script** :<br> [`<script src>`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-src) e configuração do conteúdo de texto dos elementos [`<script>`](https://developer.mozilla.org/docs/Web/HTML/Element/script)

- **Gerando HTML a partir de uma string** :<br>

    [`innerHTML`](https://developer.mozilla.org/docs/Web/API/Element/innerHTML), [`outerHTML`](https://developer.mozilla.org/docs/Web/API/Element/outerHTML),[`insertAdjacentHTML`](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML), [`<iframe> srcdoc`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#attr-srcdoc), [`document.write`](https://developer.mozilla.org/docs/Web/API/Document/write), [`document.writeln`](https://developer.mozilla.org/docs/Web/API/Document/writeln) e [`DOMParser.parseFromString`](https://developer.mozilla.org/docs/Web/API/DOMParser#DOMParser.parseFromString)

- **Executando o conteúdo do plugin** :<br> [`<embed src>`](https://developer.mozilla.org/docs/Web/HTML/Element/embed#attr-src), [`<object data>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-data) e [`<object codebase>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-codebase)

- **Compilação de código JavaScript em tempo de execução** :<br> `eval` , `setTimeout` , `setInterval` , `new Function()`

Tipos confiáveis exigem que você processe os dados antes de transmiti-los às funções de coletor acima. Apenas usar uma string irá falhar, pois o navegador não sabe se os dados são confiáveis:

{% Compare 'worse' %}

```javascript
anElement.innerHTML  = location.href;
```

{% CompareCaption %} Com Tipos Confiáveis habilitado, o navegador lança um *TypeError* e evita o uso de um coletor DOM XSS com uma string. {% endCompareCaption %}

{% endCompare %}

Para indicar que os dados foram processados com segurança, crie um objeto especial - um tipo confiável.

{% Compare 'better' %}

```javascript
anElement.innerHTML = aTrustedHTML;
```

{% CompareCaption %} Com Tipos Confiáveis habilitado, o navegador aceita um `TrustedHTML` para coletores que esperam fragmentos de HTML. Há também objetos `TrustedScript` e `TrustedScriptURL` para outros sinks sensíveis. {% endCompareCaption %}

{% endCompare %}

Tipos confiáveis reduzem fortemente a [superfície de ataque](https://en.wikipedia.org/wiki/Attack_surface) DOM XSS de seu aplicativo. Ele simplifica as revisões de segurança e permite que você aplique as verificações de segurança baseadas em tipo feitas durante a compilação, linting ou agrupamento de seu código em tempo de execução, no navegador.

## Como usar Tipos Confiáveis

### Prepare-se para relatórios de violação da política de segurança de conteúdo

Você pode implantar um coletor de relatórios (como o [go-csp-collector de](https://github.com/jacobbednarz/go-csp-collector) código aberto) ou usar um dos equivalentes comerciais. Você também pode depurar as violações no navegador:

```js
window.addEventListener('securitypolicyviolation',
    console.error.bind(console));
```

### Adicione um cabeçalho CSP somente para relatório

Adicione o seguinte cabeçalho de resposta HTTP aos documentos que deseja migrar para tipos confiáveis.

```text
Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

Agora todas as violações são relatadas para `//my-csp-endpoint.example` , mas o site continua a funcionar. A próxima seção explica como `//my-csp-endpoint.example` funciona.

{% Aside 'caution' %} Tipos confiáveis estão disponíveis apenas em um [contexto seguro](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts) como HTTPS e `localhost`. {% endAside %}

### Identifique violações de tipos confiáveis

A partir de agora, toda vez que os Tipos Confiáveis detectarem uma violação, um relatório será enviado para um `report-uri` configurado. Por exemplo, quando seu aplicativo passa uma string para `innerHTML`, o navegador envia o seguinte relatório:

```json/6,8,10
{
"csp-report": {
    "document-uri": "https://my.url.example",
    "violated-directive": "require-trusted-types-for",
    "disposition": "report",
    "blocked-uri": "trusted-types-sink",
    "line-number": 39,
    "column-number": 12,
    "source-file": "https://my.url.example/script.js",
    "status-code": 0,
    "script-sample": "Element innerHTML <img src=x"
}
}
```

Isso diz que em `https://my.url.example/script.js` na linha 39 `innerHTML` foi chamado com a string começando com `<img src=x` . Essas informações devem ajudá-lo a restringir quais partes do código podem estar introduzindo o DOM XSS e precisam ser alteradas.

{% Aside %} A maioria das violações como essa também podem ser detectadas executando um linter de código ou [verificadores de código estático](https://github.com/mozilla/eslint-plugin-no-unsanitized) em sua base de código. Isso ajuda a identificar rapidamente um grande bloco de violações.

Dito isso, você também deve analisar as violações de CSP, já que elas são acionadas quando o código não conforme é executado. {% endAside %}

### Corrija as violações

Existem algumas opções para corrigir uma violação de tipo confiável. Você pode [remover o código ofensivo](#remove-the-offending-code), [usar uma biblioteca](#use-a-library), [criar uma política de Tipo Confiável](#create-a-trusted-type-policy) ou, como último recurso, [criar uma política padrão](#create-a-default-policy) .

#### Reescreva o código ofensivo

Talvez a funcionalidade não conforme não seja mais necessária ou possa ser reescrita de uma maneira moderna sem usar as funções sujeitas a erros?

{% Compare 'worse' %}

```javascript
el.innerHTML = '<img src=xyz.jpg>';
```

{% endCompare %}

{% Compare 'better' %}

```javascript
el.textContent = '';
const img = document.createElement('img');
img.src = 'xyz.jpg';
el.appendChild(img);
```

{% endCompare %}

#### Use uma biblioteca

Algumas bibliotecas já geram Tipos Confiáveis que você pode passar para as funções de coletor. Por exemplo, você pode usar [DOMPurify](https://github.com/cure53/DOMPurify) para limpar um trecho de HTML, removendo cargas úteis de XSS.

```javascript
import DOMPurify from 'dompurify';
el.innerHTML = DOMPurify.sanitize(html, {RETURN_TRUSTED_TYPE: true});
```

DOMPurify [suporta Trusted Tipos](https://github.com/cure53/DOMPurify#what-about-dompurify-and-trusted-types) e irá retornar HTML higienizado envolto em um `TrustedHTML` objeto de tal forma que o navegador não gera uma violação. {% Aside 'caution' %} Se a lógica de sanitização em DOMPurify estiver bugada, seu aplicativo ainda pode ter uma vulnerabilidade DOM XSS. Tipos confiáveis forçam você a processar um valor de *alguma forma*, mas ainda não definem quais são as regras de processamento exatas e se elas são seguras. {% endAside %}

#### Crie uma política de Tipo Confiável

Às vezes, não é possível remover a funcionalidade e não há biblioteca para higienizar o valor e criar um tipo confiável para você. Nesses casos, crie você mesmo um objeto Tipo confiável.

Para isso, primeiro crie uma [política](https://w3c.github.io/webappsec-trusted-types/dist/spec/#policies-hdr). As políticas são fábricas de Tipos Confiáveis que impõem certas regras de segurança em suas entradas:

```javascript/2
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: string => string.replace(/\</g, '<')
  });
}
```

Este código cria uma política chamada `myEscapePolicy` que pode produzir `TrustedHTML` por meio de sua função `createHTML()`. As regras definidas irão escapar de HTML `<` caracteres para evitar a criação de novos elementos HTML.

Use a política da seguinte forma:

```javascript
const escaped = escapeHTMLPolicy.createHTML('<img src=x onerror=alert(1)>');
console.log(escaped instanceof TrustedHTML);  // true
el.innerHTML = escaped;  // '<img src=x onerror=alert(1)>'
```

{% Aside %} Enquanto a função JavaScript passada para `trustedTypes.createPolicy()` como `createHTML()` retorna uma string, `createPolicy()` retorna um objeto de política que envolve o valor de retorno em um tipo correto, neste caso `TrustedHTML` . {% endAside %}

#### Use uma política padrão

Às vezes, você não pode alterar o código ofensivo. Por exemplo, esse é o caso se você estiver carregando uma biblioteca de terceiros de um CDN. Nesse caso, use uma [política padrão](https://w3c.github.io/webappsec-trusted-types/dist/spec/#default-policy-hdr):

```javascript
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => DOMPurify.sanitize(string, {RETURN_TRUSTED_TYPE: true})
  });
}
```

A política com um nome `default` é usada sempre que uma string é usada em um coletor que aceita apenas o tipo confiável. {% Aside 'gotchas' %} Use a política padrão com moderação e prefira refatorar o aplicativo para usar políticas regulares. Isso incentiva projetos nos quais as regras de segurança estejam próximas dos dados que elas processam, onde você tem mais contexto para higienizar corretamente o valor. {% endAside %}

### Mude para a aplicação da Política de Segurança de Conteúdo

Quando seu aplicativo não produzir mais violações, você pode começar a aplicar Tipos Confiáveis:

```text
Content-Security-Policy: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

Aí está! Agora, não importa o quão complexo seja seu aplicativo da web, a única coisa que pode introduzir uma vulnerabilidade DOM XSS é o código em uma de suas políticas, e você pode bloquear isso ainda mais [limitando a criação de políticas](https://w3c.github.io/webappsec-trusted-types/dist/spec/#trusted-types-csp-directive) .

## Leitura adicional

- [Tipos confiáveis do GitHub](https://github.com/w3c/webappsec-trusted-types)
- [Rascunho de especificação W3C](https://w3c.github.io/webappsec-trusted-types/dist/spec/)
- [Perguntas frequentes](https://github.com/w3c/webappsec-trusted-types/wiki/FAQ)
- [Integrações](https://github.com/w3c/webappsec-trusted-types/wiki/Integrations)
