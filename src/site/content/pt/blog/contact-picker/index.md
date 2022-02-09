---
layout: post
title: Um seletor de contatos para a web
subhead: A API Contact Picker proporciona uma maneira fácil para os usuários compartilharem contatos de sua lista de contatos.
authors:
  - petelepage
description: O acesso aos contatos do usuário é um recurso dos aplicativos iOS/Android desde (quase) o início dos tempos. A API Contact Picker é uma API sob demanda que permite aos usuários selecionar uma entrada ou entradas de sua lista de contatos e compartilhar detalhes limitados do(s) contato(s) selecionado(s) com um site. Ele permite que os usuários compartilhem apenas o que desejam, quando desejam, e torna mais fácil para os usuários entrarem em contato e se conectarem com seus amigos e familiares.
date: 2019-08-07
updated: 2021-02-23
tags:
  - blog
  - capabilities
hero: image/admin/K1IN7zWIjFLjZzJ4Us3J.jpg
alt: Telefone em fundo amarelo.
feedback:
  - api
---

## O que é a API Contact Picker? {: #what }

<style>
  #video-demo { max-height: 600px; }
</style>

<figure data-float="right">   {% Video     src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZYR1SBlPglRDE69Xt2xl.mp4", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RbG1WcYhSLn0MQoQjZe.webm"],     poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rif9Fh8w8SR78PcVXCO1.jpg",     loop=true,     autoplay=true,     muted=true,     linkTo=true,     id="video-demo",     playsinline=true   %}</figure>

O acesso aos contatos do usuário em um dispositivo móvel é um recurso dos aplicativos iOS/Android desde (quase) o início dos tempos. É uma das solicitações de recursos mais comuns que ouço de desenvolvedores web e geralmente é o principal motivo para eles criarem um aplicativo iOS/Android.

Disponível no Chrome 80 no Android, a [API Contact Picker](https://wicg.github.io/contact-api/spec/) é uma API sob demanda que permite aos usuários selecionar entradas de sua lista de contatos e compartilhar detalhes limitados das entradas selecionadas com um site. Ela permite que os usuários compartilhem apenas o que desejam, quando desejam, e torna mais fácil para os usuários entrarem em contato e se conectarem com seus amigos e familiares.

Por exemplo, um cliente de email baseado na web pode usar a API Contact Picker para selecionar o(s) destinatário(s) de um email. Um aplicativo de voz sobre IP pode pesquisar para qual número de telefone ligar. Ou uma rede social pode ajudar um usuário a descobrir quais amigos já aderiram.

{% Aside 'caution' %} A equipe do Chrome pensou muito no design e na implementação da API Contact Picker para garantir que o navegador só compartilhe exatamente o que as pessoas escolhem. Consulte a seção [Segurança e privacidade](#security-considerations) abaixo. {% endAside %}

## Status atual {: #status}

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Passo</th>
<th data-md-type="table_cell">Status</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Criar um explicador</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/contact-api/" data-md-type="link">Concluído</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Criar o rascunho inicial das especificações</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">Concluído</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Obter feedback e repetir o design</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">Concluído</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Prova de origem</td>
<td data-md-type="table_cell"><a>Concluído</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Lançamento</strong></td>
<td data-md-type="table_cell">
<strong data-md-type="double_emphasis">Chrome 80</strong><br> Disponível apenas no Android.</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Usando a API Contact Picker {: #how-to-use}

A API Contact Picker requer uma chamada de método com um parâmetro options que especifica os tipos de informações de contato que você deseja. Um segundo método informa quais informações o sistema subjacente fornecerá.

{% Aside %} Confira a [Demonstração da API Contact Picker](https://contact-picker.glitch.me) e veja o [código-fonte](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0). {% endAside %}

### Detecção de recursos

Para verificar se a API Contact Picker é suportada, use:

```js
const supported = ('contacts' in navigator && 'ContactsManager' in window);
```

Além disso, no Android, o Contact Picker requer Android M ou posterior.

### Abrindo o Contact Picker

O ponto de entrada para a API Contact Picker é o método `navigator.contacts.select()`. Quando chamado, ele retorna uma promessa e mostra o seletor de contato, permitindo ao usuário selecionar o(s) contato(s) que deseja compartilhar com o site. Depois de selecionar o que compartilhar e clicar em **Concluído**, a promessa é resolvida com uma série de contatos selecionados pelo usuário.

Ao chamar `select()` você precisa fornecer uma matriz de propriedades que gostaria de retornar como primeiro parâmetro (com os valores permitidos sendo qualquer um dentre `'name'`, `'email'` , `'tel'`, `'address'` ou `'icon'`) e, opcionalmente, se múltiplos contatos podem ser selecionados como segundo parâmetro.

```js
const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = {multiple: true};

try {
  const contacts = await navigator.contacts.select(props, opts);
  handleResults(contacts);
} catch (ex) {
  // Handle any errors here.
}
```

{% Aside 'caution' %} O suporte a `'address'` e `'icon'` requer Chrome 84 ou posterior. {% endAside %}

A API Contacts Picker só pode ser chamada a partir de um contexto de navegação de nível superior [seguro](https://w3c.github.io/webappsec-secure-contexts/) e, como outras APIs poderosas, requer um gesto do usuário.

### Detectando propriedades disponíveis

Para detectar quais propriedades estão disponíveis, chame `navigator.contacts.getProperties()`. Ele retorna uma promessa que é resolvida com um array de strings que indica quais propriedades estão disponíveis. Por exemplo: `['name', 'email', 'tel', 'address']`. Você pode passar esses valores para `select()`.

Lembre-se de que as propriedades nem sempre estão disponíveis e novas propriedades podem ser adicionadas. No futuro, outras plataformas e fontes de contato podem restringir quais propriedades serão compartilhadas.

### Lidando com os resultados

A API Contact Picker retorna um array de contatos e cada contato inclui um array das propriedades solicitadas. Se um contato não tiver dados para a propriedade solicitada ou se o usuário optar por não compartilhar uma propriedade específica, a API retornará um array vazio. (Eu descreverei como o usuário escolhe as propriedades na seção [Controle do usuário](#security-control)).

Por exemplo, se um site solicitar `name`, `email` e `tel`, e um usuário selecionar um único contato que tenha dados no campo name, fornecer dois números de telefone, mas não tiver um endereço de e-mail, a resposta retornada será:

```json
[{
  "email": [],
  "name": ["Queen O'Hearts"],
  "tel": ["+1-206-555-1000", "+1-206-555-1111"]
}]
```

{% Aside 'caution' %} Descrições e outras informações semânticas nos campos de contato são eliminadas. {% endAside %}

## Segurança e permissões {: #security-considerations }

A equipe do Chrome projetou e implementou a API Contact Picker usando os princípios básicos definidos em [Controle de acesso a recursos poderosos da plataforma da Web](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md), incluindo controle do usuário, transparência e ergonomia. Vou explicar cada um a seguir.

### Controle do usuário {: #security-control}

O acesso aos contatos dos usuários é feito através do seletor e ele só pode ser acessado com um gesto do usuário, em um contexto de navegação [seguro](https://w3c.github.io/webappsec-secure-contexts/) e de nível superior. Isto garante que um site não irá mostrar o seletor no carregamento da página ou mostrá-lo aleatoriamente sem qualquer contexto.

<figure data-float="right">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EiHIOYdno52DZ6TNHcfI.jpg", alt="Captura de tela, os usuários podem escolher quais propriedades compartilhar.", width="800", height="639" %}   <figcaption>     Os usuários podem optar por não compartilhar algumas propriedades. Nesta captura de tela, o usuário desmarcou o botão 'Números de telefone'. Mesmo que o site solicite números de telefone, eles não serão compartilhados com o site.  </figcaption></figure>

Não há opção de selecionar em massa todos os contatos, de modo que os usuários são incentivados a selecionar apenas os contatos que precisam compartilhar para aquele site específico. Os usuários também podem controlar quais propriedades são compartilhadas com o site, alternando o botão de propriedade na parte superior do seletor.

### Transparência {: #security-transparency }

Para esclarecer quais detalhes de contato estão sendo compartilhados, o seletor sempre mostra o nome e o ícone do contato, além de quaisquer propriedades que o site tenha solicitado. Por exemplo, se um site solicitar `name`, `email` e `tel`, todas as três propriedades serão mostradas no seletor. Alternativamente, se um site solicitar apenas `tel`, o selecionador mostrará apenas o nome e os números de telefone.

<div class="switcher">
  <figure>     {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ig9SBKtJPlSE3mCjR2Go.jpg", alt="Captura de tela do seletor solicitando todas as propriedades.", width="800", height="639" %}     <figcaption>       Seletor (Picker), solicitando ao site as propriedades <code>name</code>, <code>email</code> e       <code>tel</code>, um contato selecionado.     </figcaption></figure>
  <figure>     {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vOB2nPSrfi1GnmtitElf.jpg", alt="Captura de tela do seletor para site requisitando apenas números de telefone.", width="800", height="639" %}     <figcaption>       Seletor (picker) solicitando ao site apenas a propriedade <code>tel</code>, um contato selecionado.     </figcaption></figure>
</div>

<figure data-float="right">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qLxdnKZwW0e4teyw2OOU.jpg", alt="Captura de tela do seletor quando um contato é selecionado com um toque demorado.", width="800", height="389" %}   <figcaption>     Resultado de um toque demorado sobre um contato.   </figcaption></figure>

Um toque demorado sobre um contato mostrará todas as informações que serão compartilhadas se o contato for selecionado. (Veja a imagem de contato do gato Cheshire.)

### Sem persistência de permissões {: #security-persistence}

O acesso aos contatos é sob demanda e não é persistente. Cada vez que um site quiser acesso, ele precisa chamar `navigator.contacts.select()` com um gesto do usuário, e o usuário deve escolher individualmente o(s) contato(s) que deseja compartilhar com o site.

## Feedback {: #feedback }

A equipe do Chrome quer saber mais sobre suas experiências com a API Contact Picker.

### Problemas com a implementação?

Você encontrou um bug na implementação do Chrome? Ou a implementação é diferente da especificação?

- Registre um bug em [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EContacts). Não deixe de incluir o máximo de detalhes que puder, fornecer instruções simples para reproduzir o bug e definir *Components* como `Blink>Contacts`. O [Glitch](https://glitch.com) funciona muito bem para compartilhar reproduções rápidas e fáceis.

### Planejando usar a API?

Você está planejando usar a API Contact Picker? Seu apoio público ajuda a equipe do Chrome a priorizar os recursos e mostra a outros fornecedores de navegadores como o apoio é fundamental.

- Compartilhe como você planeja usá-la no [tópico WICG Discourse](https://discourse.wicg.io/t/proposal-contact-picker-api/3507).
- Envie um tweet para [@ChromiumDev](https://twitter.com/chromiumdev) usando a hashtag [`#ContactPicker`](https://twitter.com/search?q=%23ContactPicker&src=typed_query&f=live) e diga-nos onde e como você está usando a API.

## Links úteis {: #helpful}

- [Explicador público](https://github.com/WICG/contact-api/)
- [Especificação do Contact Picker](https://wicg.github.io/contact-api/spec/)
- [Demonstração da API Contact Picker](https://contact-picker.glitch.me) e [Código-fonte da demonstração da API Contact Picker](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0)
- [Rastreamento de bug](https://bugs.chromium.org/p/chromium/issues/detail?id=860467)
- [Entrada em ChromeStatus.com](https://www.chromestatus.com/feature/6511327140904960)
- Blink Component: `Blink>Contacts`

### Agradecimentos

Um agradecimento especial a Finnur Thorarinsson e Rayan Kanso que estão implementando o recurso e Peter Beverloo cujo [código](https://tests.peter.sh/contact-api/) eu descaradamente <strike>roubei e</strike> refatorei para a demonstração.

PS: Os nomes em meu seletor de contatos são personagens de Alice no País das Maravilhas.
