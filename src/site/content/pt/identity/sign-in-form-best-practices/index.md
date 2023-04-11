---
layout: post
title: Práticas recomendadas do formulário de login
subhead: Use recursos de navegador de plataforma cruzada para criar formulários de login que sejam seguros, acessíveis e fáceis de usar.
authors:
  - samdutton
scheduled: verdadeiro
date: 2020-06-29
updated: 2021-09-27
description: Use recursos de navegador de plataforma cruzada para criar formulários de login que sejam seguros, acessíveis e fáceis de usar.
hero: image/admin/pErOjllBUXhnj68qOhfr.jpg
alt: Uma pessoa segurando um telefone.
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
codelabs:
  - codelab-sign-in-form-best-practices
---

{% YouTube 'alGcULGtiv8' %}

Se os usuários precisarem fazer login em seu site, um bom design de formulário de login é essencial. Isso é especialmente verdadeiro para pessoas com conexões ruins, no celular, com pressa ou sob estresse. Formulários de login mal projetados obtêm altas taxas de rejeição. Cada rejeição pode significar um usuário perdido e insatisfeito - não apenas uma oportunidade perdida de login.

{% Aside 'codelab' %} Se você preferir aprender essas práticas recomendadas com um tutorial prático, verifique o [codelab de práticas recomendadas do formulário de login](/codelab-sign-in-form-best-practices/) . {% endAside %}

Aqui está um exemplo de um formulário de login simples que demonstra todas as práticas recomendadas:

{% Glitch {id: 'sign-in-form', caminho: 'index.html', altura: 480}%}

## Lista de controle

- [Use elementos HTML significativos](#meaningful-html): `<form>`, `<input>`, `<label>` e `<button>`.
- [Rotule cada entrada com um `<label>`](#label).
- Use atributos de elemento para [acessar os recursos integrados do navegador](#element-attributes) : `type`, `name`, `autocomplete`, `required`.
- Dê ao `name` entrada e aos `id` valores estáveis que não mudam entre carregamentos de página ou implantações de site.
- Coloque o login [em seu próprio elemento &lt;form&gt;](#form).
- [Garanta o envio bem-sucedido do formulário](#submission).
- Use [`autocomplete="new-password"`](#new-password) e [`id="new-password"`](#new-password) para a entrada de senha em um formulário de inscrição e para a nova senha em um formulário de redefinição de senha.
- Use [`autocomplete="current-password"`](#current-password) e [`id="current-password"`](#current-password) para inserir a senha de login.
- Fornece a funcionalidade [Mostrar senha.](#show-password)
- [Use `aria-label` e `aria-describedby`](#accessible-password-inputs) para entradas de senha.
- [Não duplique as entradas](#no-double-inputs).
- Projete formulários para que o [teclado móvel não oculte entradas ou botões](#keyboard-obstruction).
- Certifique-se de que os formulários possam ser usados no celular: use [texto legível](#size-text-correctly) e certifique-se de que as entradas e os botões sejam [grandes o suficiente para funcionar como alvos de toque](#tap-targets).
- [Mantenha a marca e o estilo](#general-guidelines) em suas páginas de inscrição e login.
- [Teste em campo e também no laboratório](#analytics): crie análises de página, análises de interação e medição de desempenho centrada no usuário em seu fluxo de inscrição e inscrição.
- [Teste em navegadores e dispositivos](#devices): o comportamento do formulário varia significativamente entre as plataformas.

{% Aside %} Este artigo é sobre as práticas recomendadas de front-end. Não explica como construir serviços de back-end para autenticar usuários, armazenar suas credenciais ou gerenciar suas contas. [12 melhores práticas para contas de usuário, autorização e gerenciamento de senhas](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account) descrevem os princípios básicos para executar seu próprio back-end. Se você tem usuários em diferentes partes do mundo, deve considerar a localização do uso de serviços de identidade de terceiros em seu site, bem como seu conteúdo.

Existem também duas APIs relativamente novas não abordadas neste artigo que podem ajudá-lo a construir uma melhor experiência de login:

- [**WebOTP**](/web-otp/): para fornecer senhas únicas ou números PIN via SMS para telefones celulares. Isso pode permitir que os usuários selecionem um número de telefone como identificador (não é necessário inserir um endereço de e-mail!). Também permite a verificação em duas etapas para login e códigos únicos para confirmação de pagamento.
- [**Gerenciamento de credenciais**](https://developer.chrome.com/blog/credential-management-api/): para permitir que os desenvolvedores armazenem e recuperem credenciais de senha e credenciais federadas de maneira programática. {% endAside %}

## Use HTML significativo {: #meaningful-html}

Use elementos construídos para o trabalho: `<form>`, `<label>` e `<button>`. Isso habilita a funcionalidade do navegador embutido, melhora a acessibilidade e adiciona significado à sua marcação.

### Use `<form>` {: #form}

Você pode ficar tentado a envolver as entradas em um `<div>` e lidar com o envio de dados de entrada puramente com JavaScript. Geralmente é melhor usar um elemento [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form). Isso torna seu site acessível para leitores de tela e outros dispositivos de assistência, permite uma variedade de recursos integrados do navegador, torna mais simples construir login funcional básico para navegadores mais antigos e ainda pode funcionar mesmo se o JavaScript falhar.

{% Aside 'gotchas' %} Um erro comum é embrulhar uma página da web inteira em um único formulário, mas isso pode causar problemas para gerenciadores de senhas do navegador e preenchimento automático. Use um &lt;form&gt; diferente para cada componente de IU que precisa de um formulário. Por exemplo, se você fizer login e pesquisar na mesma página, deverá usar dois elementos de formulário. {% endAside %}

### Use `<label>` {: #label}

Para rotular uma entrada, use um [`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label)!

```html
<label for="email">Email</label>
<input id="email" …>
```

Duas razões:

- Um toque ou clique em um rótulo move o foco para sua entrada. Associe um rótulo a uma entrada usando o `for` com o `name` ou `id` da entrada.
- Os leitores de tela anunciam o texto do rótulo quando o rótulo ou a entrada do rótulo obtém o foco.

Não use marcadores de posição como rótulos de entrada. As pessoas podem esquecer para que serve a entrada depois de começarem a digitar o texto, especialmente se ficarem distraídas ("Eu estava digitando um endereço de e-mail, um número de telefone ou um ID de conta?"). Existem muitos outros problemas potenciais com espaços reservados: consulte [Não use o atributo](https://www.smashingmagazine.com/2018/06/placeholder-attribute/) Placeholder e [Placeholders em campos de formulário são prejudiciais,](https://www.nngroup.com/articles/form-design-placeholders/) se você não estiver convencido.

Provavelmente, é melhor colocar seus rótulos acima de suas entradas. Isso permite um design consistente em dispositivos móveis e desktops e, de acordo com a [pesquisa de IA do Google](https://ai.googleblog.com/2014/07/simple-is-better-making-your-web-forms.html), permite uma digitalização mais rápida pelos usuários. Você obtém rótulos e entradas de largura total e não precisa ajustar o rótulo e a largura de entrada para caber no texto do rótulo.

<figure>{% Img src="image/admin/k0ioJa9CqnMI8vyAvQPS.png", alt="Captura de tela mostrando a posição do rótulo de entrada do formulário no celular: próximo à entrada e acima da entrada.", width="500", height="253" %} <figcaption> O rótulo e a largura de entrada são limitados quando ambos estão na mesma linha.</figcaption></figure>

Abra o [Glitch de posição de rótulo](https://label-position.glitch.me) em um dispositivo móvel para ver por si mesmo.

### Use `<button>` {: #button}

Use [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button) para botões! Os elementos de botão fornecem comportamento acessível e funcionalidade de envio de formulário integrada e podem ser facilmente estilizados. Não faz sentido usar um `<div>` ou algum outro elemento fingindo ser um botão.

Certifique-se de que o botão enviar diz o que faz. Os exemplos incluem **Criar conta** ou **Entrar**, não **Enviar** ou **Iniciar**.

### Garanta o envio bem-sucedido do formulário {: #submission}

Ajude os gerentes de senha a entender que um formulário foi enviado. Existem duas maneiras de fazer isso:

- Navegue para uma página diferente.
- Emule a navegação com `History.pushState()` ou `History.replaceState()` e remova o formulário de senha.

Com um `XMLHttpRequest` ou `fetch`, certifique-se de que o sucesso do login seja relatado na resposta e tratado retirando o formulário do DOM e também indicando o sucesso para o usuário.

Considere desativar o **botão Sign in** depois que o usuário tocar ou clicar nele. [Muitos usuários clicam nos botões várias vezes,](https://baymard.com/blog/users-double-click-online) mesmo em sites rápidos e responsivos. Isso retarda as interações e aumenta a carga do servidor.

Por outro lado, não desative o envio de formulário que aguarda a entrada do usuário. Por exemplo, não desative o **botão Sign in** se os usuários não tiverem inserido o PIN do cliente. Os usuários podem perder algo no formulário e, em seguida, tentar tocar repetidamente **no botão Sign in** (desabilitado) e pensar que não está funcionando. No mínimo, se você deve desabilitar o envio de formulário, explique ao usuário o que está faltando quando ele clicar no botão desabilitado.

{% Aside 'caution' %} O tipo padrão de botão em um formulário é `submit` . Se você quiser adicionar outro botão em um formulário (para **Mostrar senha**, por exemplo), adicione `type="button"`. Caso contrário, clicar ou tocar no botão enviará o formulário.

Pressionar a `Enter` enquanto qualquer campo do formulário estiver em foco simula um clique no primeiro `submit` do formulário. Se você incluir um botão em seu formulário antes do **botão Enviar** e não especificar o tipo, esse botão terá o tipo padrão para botões em um formulário ( `submit` ) e receberá o evento de clique antes do formulário ser enviado. Para ver um exemplo disso, veja nossa [demonstração](https://enter-button.glitch.me/): preencha o formulário e pressione `Enter`. {% endAside %}

### Não duplique as entradas {: #no-double-inputs}

Alguns sites forçam os usuários a inserir e-mails ou senhas duas vezes. Isso pode reduzir erros para alguns usuários, mas causa trabalho extra para *todos* os usuários e [aumenta as taxas de abandono](https://uxmovement.com/forms/why-the-confirm-password-field-must-die/). Perguntar duas vezes também não faz sentido quando os navegadores preenchem automaticamente endereços de e-mail ou sugerem senhas fortes. É melhor permitir que os usuários confirmem seus endereços de e-mail (você precisará fazer isso de qualquer maneira) e facilitar a redefinição de suas senhas, se necessário.

## Aproveite ao máximo os atributos do elemento {: #element-attribute}

É aqui que a mágica realmente acontece! Os navegadores têm vários recursos integrados úteis que usam atributos de elemento de entrada.

## Mantenha as senhas privadas, mas permita que os usuários as vejam se quiserem {: #show-password}

As entradas de senhas devem ter `type="password"` para ocultar o texto da senha e ajudar o navegador a entender que a entrada é para senhas. Observe que os navegadores usam [uma variedade de técnicas](#autofill) para entender as funções de entrada e decidir se devem ou não se oferecer para salvar as senhas.

Você deve adicionar um **ícone ou botão Mostrar senha** para permitir que os usuários verifiquem o texto que inseriram - e não se esqueça de adicionar um link **Esqueci a senha.** Consulte [Habilitar exibição de senha](#password-display).

<figure> {% Img src="image/admin/58suVe0HnSLaJvNjKY53.png", alt="Formulário de login do Google mostrando o ícone de senha.", width="300", height="107" %} <figcaption> Entrada de senha a partir do formulário de login do Google: com <strong>Mostrar</strong> ícone de senha e link <strong>Esqueci minha senha.</strong></figcaption></figure>

## Dê aos usuários de celular o teclado certo {: #mobile-keyboards}

Use `<input type="email">` para dar aos usuários móveis um teclado apropriado e habilitar a validação de endereço de e-mail embutida básica pelo navegador … sem necessidade de JavaScript!

Se você precisar usar um número de telefone em vez de um endereço de e-mail, `<input type="tel">` habilita um teclado de telefone no celular. Você também pode usar o `inputmode` onde necessário: `inputmode="numeric"` é ideal para números PIN. [Tudo o que você sempre quis saber sobre o modo de entrada](https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/) tem mais detalhes.

{% Aside 'caution' %} `type="number"` adiciona uma seta para cima/para baixo para aumentar os números, portanto, não use para números que não devem ser aumentados, como IDs e números de contas. {% endAside %}

### Impedir que o teclado móvel obstrua o **botão Login** {: #keyboard-obstruction}

Infelizmente, se você não tiver cuidado, os teclados móveis podem cobrir seu formulário ou, pior, obstruir parcialmente o botão **Login.** Os usuários podem desistir antes de perceber o que aconteceu.

<figure>{% Img src="image/admin/rLo5sW9LBpTcJU7KNnb7.png", alt="Duas capturas de tela de um formulário de login em um telefone Android: uma mostrando como o botão Enviar é obscurecido pelo teclado do telefone.", width="400", height="360" %}<figcaption> O <b>botão Sign in</b>: agora você o vê, agora não.</figcaption></figure>

Sempre que possível, evite isso exibindo apenas as entradas de e-mail / telefone e senha e o **botão Sign in** na parte superior de sua página de login. Coloque outro conteúdo abaixo.

<figure>{% Img src="image/admin/0OebKiAP4sTgaXbcbvYx.png", alt="Captura de tela de um formulário de login em um telefone Android: o botão Sign in não é obscurecido pelo teclado do telefone.", width="200", height="342" %} <figcaption><figcaption> O teclado não obstrui o botão <b>Sign in.</b></figcaption></figcaption></figure>

#### Teste em uma variedade de dispositivos {: #devices}

Você precisará testar em uma variedade de dispositivos para seu público-alvo e ajustar de acordo. O BrowserStack permite [o teste gratuito de projetos de código aberto](https://www.browserstack.com/open-source) em uma variedade de dispositivos e navegadores reais.

<figure>{% Img src="image/admin/jToMlWgjS3J2WKmjs1hx.png", alt="Capturas de tela de um formulário de login no iPhone 7, 8 e 11. No iPhone 7 e 8, o botão Sign in é obscurecido pelo teclado do telefone, mas não no iPhone 11 ", width="800", height="522" %} <figcaption> O <b>botão Sign in</b>: obscurecido no iPhone 7 e 8, mas não no iPhone 11.</figcaption></figure>

#### Considere o uso de duas páginas {: #two-pages}

Alguns sites (incluindo Amazon e eBay) evitam o problema pedindo e-mail/telefone e senha em duas páginas. Essa abordagem também simplifica a experiência: o usuário recebe apenas uma tarefa de cada vez.

<figure>{% Img src="image/admin/CxpObjYZMs0MMFo66f4P.png", alt="Captura de tela de um formulário de login no site da Amazon: e-mail / telefone e senha em duas 'páginas' separadas.", width="400", height="385" %} <figcaption> Login em duas etapas: e-mail ou telefone e senha.</figcaption></figure>

Idealmente, isso deve ser implementado com um único &lt;form&gt;. Use JavaScript para exibir inicialmente apenas a entrada de e-mail, depois oculte-o e mostre a entrada de senha. Se você precisar forçar o usuário a navegar para uma nova página entre inserir seu e-mail e senha, o formulário na segunda página deve ter um elemento de entrada oculto com o valor de e-mail, para ajudar a permitir que os gerenciadores de senha armazenem o valor correto. [Estilos de formulário de senha que o Chromium entende](https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands) fornece um exemplo de código.

### Ajude os usuários a evitar inserir dados novamente {: #autofill}

Você pode ajudar os navegadores a armazenar dados corretamente e preencher automaticamente as entradas, para que os usuários não tenham que se lembrar de inserir os valores de e-mail e senha. Isso é particularmente importante no celular e crucial para entradas de e-mail, que obtêm [altas taxas de abandono](https://www.formisimo.com/blog/conversion-rate-increases-57-with-form-analytics-case-study/).

Existem duas partes para isso:

1. Os `autocomplete` , `name` , `id` e `type` ajudam os navegadores a entender a função das entradas para armazenar dados que podem ser usados posteriormente para o preenchimento automático. Para permitir que os dados sejam armazenados para preenchimento automático, os navegadores modernos também exigem que as entradas tenham um `name` estável ou `id` (não gerado aleatoriamente em cada carregamento de página ou implantação de site) e que estejam em um &lt;form&gt; com um botão de `submit`

2. O `autocomplete` entradas automaticamente usando os dados armazenados.

Para entradas de e-mail, use `autocomplete="username"`, já que o `username` é reconhecido pelos gerenciadores de senha em navegadores modernos - mesmo que você deva usar `type="email"` e talvez queira usar `id="email"` e `name="email"`.

Para entradas de senha, use os `autocomplete` e `id` apropriados para ajudar os navegadores a diferenciar entre as senhas novas e atuais.

### Use `autocomplete="new-password"` e `id="new-password"` para uma nova senha {: #new-password}

- Use `autocomplete="new-password"` e `id="new-password"` para inserir a senha em um formulário de inscrição ou a nova senha em um formulário de alteração de senha.

### Use `autocomplete="current-password"` e `id="current-password"` para uma senha existente {: #current-password}

- Use `autocomplete="current-password"` e `id="current-password"` para inserir a senha em um formulário de login ou inserir a senha antiga do usuário em um formulário de alteração de senha. Isso informa ao navegador que você deseja usar a senha atual armazenada para o site.

Para um formulário de inscrição:

```html
<input type="password" autocomplete="new-password" id="new-password" …>
```

Para fazer login:

```html
<input type="password" autocomplete="current-password" id="current-password" …>
```

{% Aside %} Navegadores como o Chrome podem usar o gerenciador de senhas do navegador para preencher campos automaticamente no processo de login para usuários recorrentes. Para que esses recursos funcionem, o navegador precisa ser capaz de distinguir quando um usuário altera sua senha.

Especificamente, o formulário para alterar a senha do usuário deve ser apagado ou ocultado da página após a configuração da nova senha. Se o formulário para alteração da senha do usuário permanecer preenchido na página após a alteração da senha, o navegador pode não conseguir registrar a atualização. {% endAside %}

### Suporte a gerenciadores de senhas {: #password-managers}

Navegadores diferentes lidam com o preenchimento automático de e-mail e a sugestão de senha de maneira um pouco diferente, mas os efeitos são os mesmos. No Safari 11 e superior na área de trabalho, por exemplo, o gerenciador de senha é exibido e, em seguida, a autenticação biométrica (impressão digital ou reconhecimento facial) é usada, se disponível.

<figure>{% Img src="image/admin/UjBRRYaLbX9bh3LDFcAM.png", alt="Capturas de tela de três estágios do processo de login no Safari no desktop: gerenciador de senha, autenticação biométrica, preenchimento automático.", width="800", height="234" %} <figcaption>Faça login com preenchimento automático - nenhuma entrada de texto necessária!</figcaption></figure>

O Chrome na área de trabalho exibe sugestões de e-mail, mostra o gerenciador de senhas e preenche automaticamente a senha.

<figure>{% Img src="image/admin/mDm1cstWZB9jJDzMmzgE.png", alt="Capturas de tela de quatro estágios do processo de login no Chrome na área de trabalho: conclusão de e-mail, sugestão de e-mail, gerenciador de senha, preenchimento automático na seleção.", width="800", height="232" %} <figcaption>Fluxo de login de preenchimento automático no Chrome 84.</figcaption></figure>

A senha do navegador e os sistemas de preenchimento automático não são simples. Os algoritmos para adivinhar, armazenar e exibir valores não são padronizados e variam de plataforma para plataforma. Por exemplo, como apontado por [Hidde de Vries](https://hiddedevries.nl/en/blog/2018-01-13-making-password-managers-play-ball-with-your-login-form): "O gerenciador de senhas do Firefox complementa sua heurística com um [sistema de receita](https://bugzilla.mozilla.org/show_bug.cgi?id=1119454)."

[Preenchimento automático: o que os desenvolvedores da web devem saber, mas não](https://cloudfour.com/thinks/autofill-what-web-devs-should-know-but-dont) tem muito mais informações sobre como usar o `name` e o `autocomplete`. A [especificação HTML](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#inappropriate-for-the-control) lista todos os 59 valores possíveis.

{% Aside %} Você pode ajudar os gerenciadores de senha usando diferentes `name` e `id` em formulários de inscrição e login, para o `form` , bem como qualquer elemento `input`, `select` e `textarea`. {% endAside %}

### Ative o navegador para sugerir uma senha forte {: #password-suggestions}

Os navegadores modernos usam heurísticas para decidir quando mostrar a IU do gerenciador de senhas e sugerir uma senha forte.

Veja como o Safari faz isso no desktop.

<figure>{% Img src="image/admin/B1DlZK0CllVjrOUbb5xB.png", alt="Captura de tela do gerenciador de senhas do Firefox na área de trabalho.", width="800", height="229" %} <figcaption>Fluxo de sugestão de senha no Safari.</figcaption></figure>

(A sugestão de senha única forte está disponível no Safari desde a versão 12.0.)

Geradores de senha de navegador integrados significam que usuários e desenvolvedores não precisam descobrir o que é uma "senha forte". Como os navegadores podem armazenar senhas com segurança e preenchê-las automaticamente conforme necessário, não há necessidade de os usuários se lembrarem ou inserirem as senhas. Incentivar os usuários a aproveitar as vantagens dos geradores de senha do navegador integrados também significa que eles têm mais probabilidade de usar uma senha única e forte em seu site e menos probabilidade de reutilizar uma senha que poderia estar comprometida em outro lugar.

{% Aside %} A desvantagem dessa abordagem é que não há como compartilhar senhas entre plataformas. Por exemplo, um usuário pode usar o Safari em seu iPhone e o Chrome em seu laptop Windows. {% endAside %}

### Ajude a proteger os usuários de entradas perdidas acidentalmente {: #required-fields}

Adicione o `required` aos campos de e-mail e senha. Os navegadores modernos solicitam e definem o foco automaticamente para os dados ausentes. Não requer JavaScript!

<figure>{% Img src="image/admin/n5Nr290upVmQGvlc263U.png", alt="Captura de tela do desktop Firefox e Chrome para Android mostrando o prompt 'Preencha este campo' para dados ausentes.", width="600", height="392" %} <figcaption> Avisar e focar em dados ausentes no Firefox para desktop (versão 76) e Chrome para Android (versão 83).</figcaption></figure>

## Design para dedos e polegares {: #mobile-design}

O tamanho padrão do navegador para quase tudo relacionado a elementos de entrada e botões é muito pequeno, especialmente em dispositivos móveis. Isso pode parecer óbvio, mas é um problema comum com formulários de login em muitos sites.

### Certifique-se de que as entradas e os botões sejam grandes o suficiente {: #tap-targets}

O tamanho e o preenchimento padrão para entradas e botões são muito pequenos na área de trabalho e ainda pior no celular.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lJNO6w2dOyp4cYKl5b3y.png", alt="Captura de tela do formulário sem estilo no Chrome para desktop e Chrome para Android.", width="800", height="434" %}</figure>

De acordo com as [orientações de acessibilidade do Android,](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB) o tamanho alvo recomendado para objetos touchscreen é de 7 a 10 mm. As diretrizes de interface da Apple sugerem 48x48 px, e o W3C sugere [pelo menos 44x44 pixels CSS](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html). Com base nisso, adicione (pelo menos) cerca de 15 px de preenchimento para inserir elementos e botões para dispositivos móveis e cerca de 10 px para desktop. Experimente fazer isso com um dispositivo móvel real e um dedo ou polegar real. Você deve ser capaz de tocar confortavelmente em cada uma de suas entradas e botões.

Os [pontos de toque não são dimensionados de forma adequada](https://developer.chrome.com/docs/lighthouse/seo/http-status-code/). A auditoria do Lighthouse pode ajudá-lo a automatizar o processo de detecção de elementos de entrada que são muito pequenos.

#### Design para polegares {: #design-for-thumbs}

Pesquise o [alvo de toque](https://www.google.com/search?q=touch+target) e você verá muitas fotos de indicadores. No entanto, no mundo real, muitas pessoas usam os polegares para interagir com os telefones. Os polegares são maiores do que os indicadores e o controle é menos preciso. Mais uma razão para alvos de toque de tamanho adequado.

### Torne o texto grande o suficiente {: #size-text-correctly}

Assim como acontece com o tamanho e o preenchimento, o tamanho da fonte do navegador padrão para elementos de entrada e botões é muito pequeno, principalmente em dispositivos móveis.

<figure>{% Img src="image/admin/EeIsqWhLbot15p4SYpo2.png", alt="Captura de tela do formulário não estilizado no Chrome no desktop e no Android.", width="800", height="494" %} <figcaption>Estilo padrão no desktop e no celular: o texto de entrada é muito pequeno para ser legível para muitos usuários.</figcaption></figure>

Navegadores em diferentes plataformas têm tamanhos de fontes diferentes, então é difícil especificar um tamanho de fonte específico que funcione bem em qualquer lugar. Uma rápida pesquisa de sites populares mostra tamanhos de 13 a 16 pixels no desktop: corresponder a esse tamanho físico é um bom mínimo para texto no celular.

Isso significa que você precisa usar um tamanho de pixel maior no celular: `16px` no Chrome para desktop é bastante legível, mas mesmo com uma boa visão é difícil ler `16px` no Chrome para Android. Você pode definir diferentes tamanhos de pixel de fonte para diferentes tamanhos de viewport usando [consultas de mídia](https://developers.google.com/web/fundamentals/design-and-ux/responsive#apply_media_queries_based_on_viewport_size). `20px` para dispositivos móveis, mas você deve testar isso com amigos ou colegas que têm visão reduzida.

O [documento não usa tamanhos de fonte legíveis](https://developer.chrome.com/docs/lighthouse/seo/font-size/). A auditoria do Lighthouse pode ajudá-lo a automatizar o processo de detecção de texto muito pequeno.

### Forneça espaço suficiente entre as entradas {: #size-margins-correctly}

Adicione margem suficiente para fazer as entradas funcionarem bem como alvos de toque. Em outras palavras, almeje a largura de um dedo de margem.

### Certifique-se de que suas entradas estejam claramente visíveis {: #visible-inputs}

O estilo de borda padrão para entradas torna-as difíceis de ver. Eles são quase invisíveis em algumas plataformas como o Chrome para Android.

Além do preenchimento, adicione uma borda: em um fundo branco, uma boa regra geral é usar `#ccc` ou mais escuro.

<figure>{% Img src="image/admin/OgDJ5V2N7imHXSBkN4pr.png", alt="Captura de tela da forma estilizada no Chrome no Android.", width="250", height="525" %} <figcaption>Texto legível, bordas de entrada visíveis, preenchimento e margens adequados.</figcaption></figure>

### Use recursos integrados do navegador para avisar sobre valores de entrada inválidos {: #built-in-validation}

Os navegadores possuem recursos integrados para fazer a validação básica de formulários para entradas com um atributo `type`. Os navegadores avisam quando você envia um formulário com um valor inválido e definem o foco na entrada problemática.

<figure>{% Img src="image/admin/Phf9m5J66lIX9x5brzOL.png", alt="Captura de tela de um formulário de login no Chrome na área de trabalho mostrando o prompt do navegador e o foco para um valor de e-mail inválido.", width="300", height="290" %} <figcaption>Validação embutida básica pelo navegador.</figcaption></figure>

Você pode usar o `:invalid` seletor CSS inválido para destacar dados inválidos. Use `:not(:placeholder-shown)` para evitar a seleção de entradas sem conteúdo.

```css
input[type=email]:not(:placeholder-shown):invalid {
  color: red;
  outline-color: red;
}
```

Experimente maneiras diferentes de destacar entradas com valores inválidos.

## Use JavaScript onde necessário {: #javascript}

### Alternar exibição de senha {: #password-display}

Você deve adicionar um **ícone ou botão Mostrar senha** para permitir que os usuários verifiquem o texto que inseriram. [A usabilidade é prejudicada](https://www.nngroup.com/articles/stop-password-masking/) quando os usuários não conseguem ver o texto que inseriram. Atualmente não há uma maneira integrada de fazer isso, embora [haja planos para implementação](https://twitter.com/sw12/status/1251191795377156099). Você precisará usar JavaScript em vez disso.

<figure><img src="./show-password-google.png" width="350" alt="Formulário de login do Google com o ícone Mostrar ísenha."><figcaption> Formulário de login do Google: com o ícone <strong>Mostrar senha</strong> e link <strong>Esqueci a senha.</strong></figcaption></figure>

O código a seguir usa um botão de texto para adicionar a funcionalidade **Mostrar senha.**

HTML:

```html/2
<section>
  <label for="password">Password</label>
  <button id="toggle-password" type="button" aria-label="Show password as plain text. Warning: this will display your password on the screen.">Show password</button>
  <input id="password" name="password" type="password" autocomplete="current-password" required>
</section>
```

Aqui está o CSS para fazer o botão parecer texto simples:

```css
button#toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  /* Media query isn't shown here. */
  font-size: var(--mobile-font-size);
  font-weight: 300;
  padding: 0;
  /* Display at the top right of the container */
  position: absolute;
  top: 0;
  right: 0;
}
```

E o JavaScript para mostrar a senha:

```js
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');

togglePasswordButton.addEventListener('click', togglePassword);

function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordButton.textContent = 'Hide password';
    togglePasswordButton.setAttribute('aria-label',
      'Hide password.');
  } else {
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Show password';
    togglePasswordButton.setAttribute('aria-label',
      'Show password as plain text. ' +
      'Warning: this will display your password on the screen.');
  }
}
```

Aqui está o resultado final:

<figure>{% Img src="image/admin/x4NP9JMf1KI8PapQ9JFh.png", alt="Capturas de tela do formulário de login com Mostrar texto de senha 'botão', no Safari no Mac e no iPhone 7.", width="800", height="468" %} <figcaption>Formulário de login com o "botão" de texto <strong>{nbsp}Mostrar senha</strong>, no Safari no Mac e iPhone 7.</figcaption></figure>

### Torne as entradas de senha acessíveis {: #accessible-password-inputs}

Use `aria-describedby` para delinear regras de senha, fornecendo a ID do elemento que descreve as restrições. Os leitores de tela fornecem o texto do rótulo, o tipo de entrada (senha) e a descrição.

```html
<input type="password" aria-describedby="password-constraints" …>
<div id="password-constraints">Eight or more characters with a mix of letters, numbers and symbols.</div>
```

Ao adicionar a funcionalidade **Mostrar senha**, certifique-se de incluir um `aria-label` para avisar que a senha será exibida. Caso contrário, os usuários podem revelar inadvertidamente as senhas.

```html/1-2
<button id="toggle-password"
        aria-label="Show password as plain text.
                    Warning: this will display your password on the screen.">
  Show password
</button>
```

Você pode ver os dois recursos ARIA em ação na seguinte falha:

{% Glitch { id: 'sign-in-form', path: 'index.html', height: 480 } %}

[Criar formulários acessíveis](https://webaim.org/techniques/forms/) tem mais dicas para ajudar a tornar os formulários acessíveis.

### Valide em tempo real e antes do envio {: #validation}

Os elementos e atributos do formulário HTML têm recursos integrados para validação básica, mas você também deve usar JavaScript para fazer uma validação mais robusta enquanto os usuários estão inserindo dados e quando tentam enviar o formulário.

{% Aside 'warning' %} A validação do lado do cliente ajuda os usuários a inserir dados e pode evitar a carga desnecessária do servidor, mas você deve sempre validar e higienizar os dados em seu back-end. {% endAside %}

A [etapa 5](https://glitch.com/edit/#!/sign-in-form-codelab-5) do codelab do formulário de login usa a [API de validação de restrição](https://html.spec.whatwg.org/multipage/forms.html#constraints) (que é [amplamente suportada](https://caniuse.com/#feat=constraint-validation)) para adicionar validação personalizada usando a IU do navegador integrada para definir o foco e exibir prompts.

Saiba mais: [Use JavaScript para uma validação mais complexa em tempo real](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation).

### Analytics e RUM {: #analytics}

"O que você não pode medir, você não pode melhorar" é particularmente verdadeiro para formulários de inscrição e inscrição. Você precisa definir metas, medir o sucesso, melhorar seu site - e repetir.

O [teste de usabilidade com desconto](https://www.nngroup.com/articles/discount-usability-20-years/) pode ser útil para experimentar mudanças, mas você precisará de dados do mundo real para realmente entender como seus usuários experimentam seus formulários de inscrição e login:

- **Análise de página** : visualizações de página de inscrição e login, taxas de rejeição e saídas.
- **Análise de interação**: [funis de meta](https://support.google.com/analytics/answer/6180923?hl=en) (onde os usuários abandonam seu login ou fluxo de login?) E [eventos](https://developers.google.com/analytics/devguides/collection/gtagjs/events) (quais ações os usuários realizam ao interagir com seus formulários?)
- **Desempenho do site**: [métricas centradas no usuário](/user-centric-performance-metrics) (seus formulários de inscrição e login estão lentos por algum motivo e, em caso afirmativo, qual é a causa?).

Você também pode considerar a implementação de testes A/B para experimentar diferentes abordagens de inscrição e login, além de implementações graduais para validar as alterações em um subconjunto de usuários antes de liberar as alterações para todos os usuários.

## Diretrizes gerais {: #general-guidelines}

IU e UX bem projetadas podem reduzir o abandono do formulário de login:

- Não faça os usuários procurarem por login! Coloque um link para o formulário de login na parte superior da página, usando palavras bem conhecidas, como **Login** , **Criar conta** ou **Registrar**.
- Mantenha o foco! Os formulários de inscrição não são o lugar para distrair as pessoas com ofertas e outros recursos do site.
- Minimize a complexidade da inscrição. Colete outros dados do usuário (como endereços ou detalhes de cartão de crédito) apenas quando os usuários perceberem um benefício claro em fornecer esses dados.
- Antes que os usuários comecem em seu formulário de inscrição, deixe claro qual é a proposta de valor. Como eles se beneficiam com o login? Dê aos usuários incentivos concretos para concluir a inscrição.
- Se possível, permita que os usuários se identifiquem com um número de telefone celular em vez de um endereço de e-mail, já que alguns usuários podem não usar o e-mail.
- Torne mais fácil para os usuários redefinir suas senhas e faça o **link Esqueceu sua senha?** link óbvio.
- Link para seus termos de serviço e documentos de política de privacidade: deixe claro para os usuários desde o início como você protege seus dados.
- Inclua o logotipo e o nome de sua empresa ou organização em suas páginas de inscrição e login e certifique-se de que o idioma, as fontes e os estilos correspondam ao restante do seu site. Alguns formulários não parecem pertencer ao mesmo site de outro conteúdo, especialmente se tiverem um URL significativamente diferente.

## Continue aprendendo {: #resources}

- [Crie formulários incríveis](/learn/forms/)
- [Melhores práticas para design de formulários para celular](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [Controles de formulário mais capazes](/more-capable-form-controls)
- [Criação de formulários acessíveis](https://webaim.org/techniques/forms/)
- [Simplificação do fluxo de login usando a API de gerenciamento de credenciais](https://developer.chrome.com/blog/credential-management-api/)
- [Verifique os números de telefone na web com a API WebOTP](/web-otp/)

Foto de [Meghan Schiereck](https://unsplash.com/photos/_XFObcM_7KU) no [Unsplash](https://unsplash.com).
