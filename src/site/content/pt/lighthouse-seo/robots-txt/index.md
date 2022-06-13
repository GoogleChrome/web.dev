---
layout: post
title: "`robots.txt` não é válido"
description: |2

  Saiba mais sobre a auditoria do Lighthouse "robots.txt não é válido".
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - robôs-txt
---

O `robots.txt` informa aos mecanismos de pesquisa quais páginas do seu site eles podem rastrear. Uma `robots.txt` inválida pode causar dois tipos de problemas:

- Ele pode impedir que os mecanismos de pesquisa rastreiem as páginas públicas, fazendo com que seu conteúdo apareça com menos frequência nos resultados da pesquisa.
- Isso pode fazer com que os mecanismos de pesquisa rastreiem páginas que você não deseja que sejam mostradas nos resultados da pesquisa.

## Como a auditoria `robots.txt`

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza arquivos `robots.txt`

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/X29ztochZPiUVwPo2rg3.png", alt="Auditoria do Lighthouse mostrando robots.txt inválido", width="800", height="203" %}</figure>

{% Aside %} A maioria das auditorias do Lighthouse se aplica apenas à página em que você está atualmente. No entanto, como o `robots.txt` é definido no nível do nome do host, essa auditoria se aplica a todo o seu domínio (ou subdomínio). {% endAside %}

Expandir o **`robots.txt` não é uma** auditoria válida em seu relatório para saber o que há de errado com seu `robots.txt`.

Erros comuns incluem:

- `No user-agent specified`
- `Pattern should either be empty, start with "/" or "*"`
- `Unknown directive`
- `Invalid sitemap URL`
- `$ should only be used at the end of the pattern`

O Lighthouse não verifica se o `robots.txt` está no local correto. Para funcionar corretamente, o arquivo deve estar na raiz do seu domínio ou subdomínio.

{% include 'content/lighthouse-seo/scoring.njk' %}

## Como corrigir problemas com o `robots.txt`

### Certifique-se de que o `robots.txt` não retorne um código de status HTTP 5XX

Se o seu servidor retornar um erro de servidor (um [código de status HTTP](/http-status-code) na casa dos 500) para o `robots.txt`, os mecanismos de pesquisa não saberão quais páginas devem ser rastreadas. Eles podem parar de rastrear todo o seu site, o que impediria que novos conteúdos sejam indexados.

Para verificar o código de status HTTP, abra `robots.txt` no Chrome e [verifique a solicitação no Chrome DevTools](https://developer.chrome.com/docs/devtools/network/reference/#analyze).

### Mantenha o `robots.txt` menor que 500 KiB

Os mecanismos de pesquisa podem parar de processar o `robots.txt` no meio do caminho se o arquivo for maior que 500 KiB. Isso pode confundir o mecanismo de pesquisa, levando ao rastreamento incorreto do seu site.

Para manter o `robots.txt` pequeno, concentre-se menos nas páginas excluídas individualmente e mais nos padrões mais amplos. Por exemplo, se você precisa bloquear o rastreamento de arquivos PDF, não proíba cada arquivo individual. Em vez disso, desabilite todos os URLs que contenham `.pdf` usando `disallow: /*.pdf`.

### Corrija quaisquer erros de formato

- Somente linhas vazias, comentários e diretivas que correspondam ao formato "nome: valor" são permitidos em `robots.txt`.
- Certifique-se de `allow` valores permitir e `disallow` estão vazios ou começam com `/` ou `*`.
- Não use `$` no meio de um valor (por exemplo, `allow: /file$html`).

#### Certifique-se de que haja um valor para `user-agent`

Nomes de agente de usuário para informar aos rastreadores do mecanismo de pesquisa quais diretivas devem ser seguidas. Você deve fornecer um valor para cada instância do `user-agent` de usuário para que os mecanismos de pesquisa saibam se devem seguir o conjunto de diretivas associado.

Para especificar um rastreador de mecanismo de pesquisa específico, use um nome de agente de usuário de sua lista publicada. (Por exemplo, aqui está a [lista de user-agents do Google usados para rastreamento](https://support.google.com/webmasters/answer/1061943).)

Use `*` para corresponder a todos os rastreadores de outra forma incomparáveis.

{% Compare 'worse', 'Don\'t' %}

```text
user-agent:
disallow: /downloads/
```

Nenhum agente de usuário está definido. {% endCompare %}

{% Compare 'better', 'Do' %}

```text
user-agent: *
disallow: /downloads/

user-agent: magicsearchbot
disallow: /uploads/
```

Um agente de usuário geral e um agente de usuário `magicsearchbot` {% endCompare %}

#### Certifique-se de que não há são `allow` ou `disallow` directivas antes `user-agent`

Os nomes do agente do usuário definem as seções de seu arquivo `robots.txt`. Os rastreadores do mecanismo de pesquisa usam essas seções para determinar quais diretivas seguir. Colocar uma diretiva *antes* do primeiro nome do agente do usuário significa que nenhum rastreador a seguirá.

{% Compare 'worse', 'Don\'t' %}

```text
# start of file
disallow: /downloads/

user-agent: magicsearchbot
allow: /
```

Nenhum rastreador de mecanismo de pesquisa lerá a diretiva `disallow: /downloads` {% endCompare %}

{% Compare 'better', 'Do' %}

```text
# start of file
user-agent: *
disallow: /downloads/
```

Todos os mecanismos de pesquisa não podem rastrear a pasta `/downloads` {% endCompare %}

Os rastreadores do mecanismo de pesquisa apenas seguem as diretivas na seção com o nome do agente de usuário mais específico. Por exemplo, se você tiver diretivas para `user-agent: *` e `user-agent: Googlebot-Image`, o Googlebot Images seguirá apenas as diretivas na seção `user-agent: Googlebot-Image`.

#### Fornece um URL absoluto para o `sitemap`

Os [arquivos de mapa de site](https://support.google.com/webmasters/answer/156184) são uma ótima maneira de permitir que os mecanismos de pesquisa conheçam as páginas do seu site. Um arquivo de mapa de site geralmente inclui uma lista de URLs em seu site, junto com informações sobre quando eles foram alterados pela última vez.

Se você optar por enviar um arquivo de mapa do site em `robots.txt`, certifique-se de usar um [URL absoluto](https://tools.ietf.org/html/rfc3986#page-27).

{% Compare 'worse', 'Don\'t' %}

```text
sitemap: /sitemap-file.xml
```

{% endCompare %}

{% Compare 'better', 'Do' %}

```text
sitemap: https://example.com/sitemap-file.xml
```

{% endCompare %}

## Recursos

- [O código-fonte da auditoria **`robots.txt` não é válido**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/robots-txt.js)
- [Crie um `robots.txt file`](https://support.google.com/webmasters/answer/6062596)
- [Robots.txt](https://moz.com/learn/seo/robotstxt)
- [Especificações de metatag de robôs e cabeçalho HTTP X-Robots-Tag](https://developers.google.com/search/reference/robots_meta_tag)
- [Saiba mais sobre mapas de site](https://support.google.com/webmasters/answer/156184)
- [Rastreadores do Google (agentes de usuário)](https://support.google.com/webmasters/answer/1061943)
