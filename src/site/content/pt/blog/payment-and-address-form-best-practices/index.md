---
title: Práticas recomendadas para formulários de pagamento e endereço
subhead: Maximize as conversões ajudando seus usuários a preencher o endereço e os formulários de pagamento da maneira mais rápida e fácil possível.
authors:
  - samdutton
scheduled: 'true'
date: 2020-12-09
updated: 2021-11-30
description: Maximize as conversões ajudando seus usuários a preencher o endereço e os formulários de pagamento da maneira mais rápida e fácil possível.
hero: image/admin/dbYeeV2PCRZNY6RRvQd2.jpg
thumbnail: image/admin/jy8z8lRuLmmnyytD5xwl.jpg
alt: Homem de negócios usando um cartão de pagamento para fazer um pagamento em um computador laptop.
tags:
  - blog
  - forms
  - identity
  - layout
  - mobile
  - payments
  - security
  - ux
codelabs:
  - codelab-payment-form-best-practices
  - codelab-address-form-best-practices
---

{% YouTube 'xfGKmvvyhdM' %}

Formulários bem projetados ajudam os usuários e aumentam as taxas de conversão. Uma pequena correção pode fazer uma grande diferença!

{% Aside 'codelab' %} Se você preferir aprender essas práticas recomendadas com um tutorial prático, confira os dois codelabs desta postagem:

- [Codelab de práticas recomendadas para formas de pagamento](/codelab-payment-form-best-practices)
- [Codelab de práticas recomendadas do formulário de endereço](/codelab-address-form-best-practices) {% endAside %}

Aqui está um exemplo de um formulário de pagamento simples que demonstra todas as práticas recomendadas:

{% Glitch { id: 'payment-form', path: 'index.html', height: 720 } %}

Aqui está um exemplo de um formulário de endereço simples que demonstra todas as práticas recomendadas:

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

## Lista de controle

- [Use elementos HTML significativos](#meaningful-html) : `<form>` , `<input>` , `<label>` e `<button>` .
- [Rotule cada campo do formulário com um `<label>`](#html-label) .
- Use atributos de elemento HTML para [acessar recursos integrados do navegador](#html-attributes) , em particular [`type`](#type-attribute) e [`autocomplete`](#autocomplete-attribute) com os valores apropriados.
- Evite usar `type="number"` para números que não devem ser incrementados, como números de cartão de pagamento. Em vez disso, use `type="text"` e [`inputmode="numeric"`](#inputmode-attribute) .
- Se um [valor de preenchimento automático apropriado](#autocomplete-attribute) estiver disponível para uma `input`, `select` ou área de `textarea`, você deve usá-lo.
- Para ajudar os navegadores a preencher automaticamente os formulários, forneça [valores estáveis aos](#stable-name-id) atributos de `name` e `id` entrada que não mudam entre carregamentos de página ou implantações de site da Web.
- [Desative os botões de envio](#disable-submit) depois de tocá-los ou clicá-los.
- [Valide os](#validate) dados durante a entrada, e não apenas no envio do formulário.
- Torne o [check-out de convidado](#guest-checkout) o padrão e simplifique a criação da conta assim que o check-out for concluído.
- Mostre o [andamento do processo de checkout](#checkout-progress) em etapas claras com frases chamativas claras.
- [Limite os potenciais pontos de saída de checkout](#reduce-checkout-exits), removendo a desordem e as distrações.
- [Mostre todos os detalhes do pedido](#checkout-details) na finalização da compra e facilite os ajustes do pedido.
- [Não peça dados desnecessários](#unneeded-data).
- [Peça nomes com uma única entrada, a](#single-name-input) menos que tenha um bom motivo para não fazê-lo.
- [Não imponha caracteres somente latinos](#unicode-matching) para nomes e nomes de usuário.
- [Permita uma variedade de formatos de endereço](#address-variety).
- Considere o uso de uma [única área`textarea` para o endereço](#address-textarea).
- Use o [preenchimento automático para o endereço de cobrança](#billing-address).
- [Internacionalize e localize](#internationalization-localization) quando necessário.
- Considere evitar a [pesquisa de endereço de código postal](#postal-code-address-lookup).
- Use [valores de preenchimento automático de cartão de pagamento apropriados](#payment-form-autocomplete).
- Use uma [única entrada para números de cartão de pagamento](#single-number-input).
- [Evite usar elementos personalizados](#avoid-custom-elements) se eles prejudicarem a experiência de preenchimento automático.
- [Teste em campo e também no laboratório](#analytics-rum): análise de página, análise de interação e medição de desempenho de usuário real.
- [Teste em uma variedade de navegadores, dispositivos e plataformas](#test-platforms).

{% Aside %} Este artigo é sobre as práticas recomendadas de front-end para endereços e formulários de pagamento. Ele não explica como implementar transações em seu site. Para saber mais sobre como adicionar a funcionalidade de pagamento ao seu site, consulte [Pagamentos pela web](/payments). {% endAside %}

## Use HTML significativo {: #meaningful-html}

Use os elementos e atributos construídos para o trabalho:

- `<form>`, `<input>`, `<label>` e `<button>`
- `type` , `autocomplete` e `inputmode`

Isso habilita a funcionalidade do navegador embutido, melhora a acessibilidade e adiciona significado à sua marcação.

### Use elementos HTML conforme pretendido {: #html-elements}

#### Coloque seu formulário em um &lt;form&gt; {: #html-form}

Você pode ficar tentado a não se incomodar em envolver seus `<input>` em um `<form>` e lidar com o envio de dados puramente com JavaScript.

Não faça isso!

Um `<form>` HTML dá acesso a um conjunto poderoso de recursos integrados em todos os navegadores modernos e pode ajudar a tornar seu site acessível para leitores de tela e outros dispositivos de assistência. Um `<form>` também facilita construir funcionalidades básicas para navegadores mais antigos com suporte limitado a JavaScript e para habilitar o envio de formulários mesmo se houver uma falha em seu código e para o pequeno número de usuários que realmente desabilitam o JavaScript.

Se você tiver mais de um componente de página para entrada do usuário, certifique-se de colocar cada um em seu próprio elemento `<form>` Por exemplo, se você tiver busca e inscrição na mesma página, coloque cada um em seu próprio `<form>` .

#### Use `<label>` para rotular os elementos {: #html-label}

Para rotular um `<input>`, `<select>` ou `<textarea>`, use um [`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label) .

Associar uma etiqueta com uma entrada, dando ao atributo `for` do rótulo o mesmo valor que o input `id`.

```html
<label for="address-line1">Address line 1</label>
<input id="address-line1" …>
```

Use um único rótulo para uma única entrada: não tente rotular várias entradas com apenas um rótulo. Isso funciona melhor para navegadores e melhor para leitores de tela. Um toque ou clique em um rótulo move o foco para a entrada com a qual está associado e os leitores de tela anunciam o texto do *rótulo* quando o rótulo ou a *entrada* do rótulo obtém o foco.

{% Aside 'caution' %} Não use [marcadores](https://www.smashingmagazine.com/2018/06/placeholder-attribute/) de posição sozinhos em vez de rótulos. Quando você começa a inserir texto em uma entrada, o marcador de posição fica oculto, então pode ser fácil esquecer para que serve a entrada. O mesmo é verdadeiro se você usar o espaço reservado para mostrar o formato correto para valores como datas. Isso pode ser especialmente problemático para usuários de telefones, principalmente se estiverem distraídos ou se sentindo estressados! {% endAside %}

#### Torne os botões úteis {: #html-button}

Use [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button) para botões! Você também pode usar `<input type="submit">`, mas não use um `div` ou algum outro elemento aleatório atuando como um botão. Os elementos de botão fornecem comportamento acessível, funcionalidade de envio de formulário integrada e podem ser estilizados facilmente.

Dê a cada botão de envio de formulário um valor que diga o que ele faz. Para cada etapa do checkout, use uma frase chamativa descritiva que mostre o progresso e torne a próxima etapa óbvia. Por exemplo, identifique o botão enviar em seu formulário de endereço de entrega **Prosseguir para o pagamento em** vez de **Continuar** ou **Salvar** .

{: #disable-submit}

Considere desativar um botão de envio depois que o usuário tocar ou clicar nele, especialmente quando o usuário estiver fazendo um pagamento ou fazendo um pedido. Muitos usuários clicam nos botões repetidamente, mesmo quando estão funcionando bem. Isso pode atrapalhar o checkout e aumentar a carga do servidor.

Por outro lado, não desative um botão de envio que aguarda uma entrada completa e válida do usuário. Por exemplo, não deixe um botão **Salvar endereço** desabilitado porque algo está faltando ou é inválido. Isso não ajuda o usuário, pois ele pode continuar a tocar ou clicar no botão e presumir que ele está quebrado. Em vez disso, se os usuários tentarem enviar um formulário com dados inválidos, explique o que está errado e o que fazer para corrigir. Isso é particularmente importante no celular, onde a entrada de dados é mais difícil e os dados do formulário ausentes ou inválidos podem não estar visíveis na tela do usuário no momento em que ele tenta enviar um formulário.

{% Aside 'caution' %} O tipo padrão de botão em um formulário é `submit`. Se você quiser adicionar outro botão em um formulário (para **Mostrar senha** , por exemplo), adicione `type="button"`. Caso contrário, clicar ou tocar no botão enviará o formulário.

Pressionar a `Enter` enquanto qualquer campo do formulário estiver em foco simula um clique no primeiro `submit` do formulário. Se você incluir um botão em seu formulário antes do botão **Enviar** e não especificar o tipo, esse botão terá o tipo padrão para botões em um formulário (`submit` ) e receberá o evento de clique antes do formulário ser enviado. Para ver um exemplo disso, veja nossa [demonstração](https://enter-button.glitch.me/): preencha o formulário e pressione `Enter`. {% endAside %}

### Aproveite ao máximo os atributos HTML {: #html-attribute}

#### Facilite a inserção de dados pelos usuários

{: #type-attribute}

Use o atributo de entrada [`type`](https://developer.mozilla.org/docs/Web/HTML/Element/input/email) apropriado para fornecer o teclado correto no celular e habilitar a validação embutida básica pelo navegador.

Por exemplo, use `type="email"` para endereços de e-mail e `type="tel"` para números de telefone.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bi7J9Z1TLP4IsQLyhbQm.jpg", alt="Duas capturas de tela de telefones Android, mostrando um teclado apropriado para inserir um endereço de e-mail (usando type=email) e para inserir um número de telefone (com type=tel).", width="800", height="683" %} <figcaption>Teclados apropriados para e-mail e telefone.</figcaption></figure>

{: #inputmode-attribute}

{% Aside 'warning' %} Usar type="number" adiciona uma seta para cima/para baixo para aumentar os números, o que não faz sentido para dados como telefone, cartão de pagamento ou números de conta.

Para números como esses, defina `type="text"` (ou deixe de fora o atributo, já que `text` é o padrão). Para números de telefone, use `type="tel"` para obter o teclado apropriado no celular. Para outros números, use `inputmode="numeric"` para obter um teclado numérico no celular.

Alguns sites ainda usam `type="tel"` para números de cartão de pagamento para garantir que os usuários móveis obtenham o teclado correto. No entanto, `inputmode` é [amplamente suportado agora](https://caniuse.com/input-inputmode) , então você não precisa fazer isso, mas verifique os navegadores de seus usuários. {% endAside %}

{: #avoid-custom-elements}

Para datas, tente evitar o uso de elementos de `select`. Eles interrompem a experiência de preenchimento automático se não forem implementados corretamente e não funcionam em navegadores mais antigos. Para números como o ano de nascimento, considere usar um elemento `input` em vez de `select`, uma vez que inserir dígitos manualmente pode ser mais fácil e menos propenso a erros do que selecionar em uma longa lista suspensa, especialmente no celular. Use `inputmode="numeric"` para garantir o teclado correto no celular e adicione dicas de validação e formato com texto ou um espaço reservado para garantir que o usuário insira os dados no formato apropriado.

{% Aside %} O elemento [`datalist`](https://developer.mozilla.org/docs/Web/HTML/Element/datalist) permite que um usuário selecione em uma lista de opções disponíveis e fornece sugestões correspondentes conforme o usuário insere o texto. Experimente o `datalist` para `text`, `range` e `color` em [simpl.info/datalist](https://simpl.info/datalist). Para a entrada do ano de nascimento, você pode comparar um `select` com um `input` e `datalist` em [datalist-select.glitch.me](https://datalist-select.glitch.me). {% endAside %}

#### Use o preenchimento automático para melhorar a acessibilidade e ajudar os usuários a evitar inserir dados novamente {: #autocomplete-attribute}

O uso de `autocomplete` apropriados permite que os navegadores ajudem os usuários armazenando dados com segurança e preenchendo automaticamente os valores de `input`, `select` e área de `textarea`. Isso é particularmente importante no celular e crucial para evitar [altas taxas de abandono de formulários](https://www.zuko.io/blog/8-surprising-insights-from-zukos-benchmarking-data). O preenchimento automático também oferece [vários benefícios de acessibilidade](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html) .

Se um valor de preenchimento automático apropriado estiver disponível para um campo de formulário, você deve usá-lo. [MDN web docs](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete) tem uma lista completa de valores e explicações de como usá-los corretamente.

{: #stable-name-id}

{% Aside %} Além de usar valores de preenchimento automático apropriados, ajude os navegadores a preencher formulários automaticamente, fornecendo aos campos de formulário [valores estáveis](#stable-name-id) de atributos `name` e `id` que não mudam entre carregamentos de página ou implantações de site. {% endAside %}

{: #billing-address}

Por padrão, defina o endereço de cobrança igual ao endereço de entrega. Reduza a confusão visual fornecendo um link para editar o endereço de cobrança (ou use [elementos de `summary` e `details`](https://simpl.info/details/)) em vez de exibir o endereço de cobrança em um formulário.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TIan7TU8goyoOXwLPYyd.png", alt="Exemplo de página de checkout mostrando o link para alterar o endereço de cobrança.", width="800", height="250" %} <figcaption>Adicione um link para revisar a cobrança.</figcaption></figure>

Use os valores de preenchimento automático apropriados para o endereço de cobrança, assim como você faz para o endereço de entrega, de forma que o usuário não precise inserir os dados mais de uma vez. Adicione uma palavra de prefixo aos atributos de preenchimento automático se você tiver valores diferentes para entradas com o mesmo nome em seções diferentes.

```html
<input autocomplete="shipping address-line-1" ...>
...
<input autocomplete="billing address-line-1" ...>
```

#### Ajude os usuários a inserir os dados corretos {: #validation}

Tente evitar "repreender" os clientes porque eles "fizeram algo errado". Em vez disso, ajude os usuários a preencher formulários com mais rapidez e facilidade, ajudando-os a corrigir os problemas à medida que acontecem. Com o processo de checkout, os clientes estão tentando dar dinheiro à sua empresa por um produto ou serviço, seu trabalho é ajudá-los, não puni-los!

Você pode adicionar [atributos de restrição](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation#Intrinsic_and_basic_constraints) aos elementos do formulário para especificar valores aceitáveis, incluindo `min`, `max` e `pattern`. O [estado de validade](https://developer.mozilla.org/docs/Web/API/ValidityState) do elemento é definido automaticamente dependendo se o valor do elemento é válido, como são as pseudoclasses CSS `:valid` e `:invalid` que podem ser usadas para estilizar elementos com valores válidos ou inválidos.

Por exemplo, o seguinte HTML especifica a entrada para um ano de nascimento entre 1900 e 2020. O uso de `type="number"` restringe os valores de entrada a apenas números, dentro do intervalo especificado por `min` e `max`. Se você tentar inserir um número fora do intervalo, a entrada será configurada para ter um estado inválido.

{% Glitch {id: 'constraints', path: 'index.html', height: 170}%}

O exemplo a seguir usa `pattern="[\d ]{10,30}"` para garantir um número de cartão de pagamento válido, permitindo também permite espaços:

{% Glitch {id: 'payment-card-input', path: 'index.html', height: 170}%}

Os navegadores modernos também fazem validação básica para entradas com o tipo `email` ou `url` .

{% Glitch {id: 'type-validation', path: 'index.html', height: 250} %}

{% Aside %} Adicione o `multiple` a uma entrada com `type="email"` para habilitar a validação integrada para vários endereços de e-mail separados por vírgula em uma única entrada. {% endAside %}

No envio do formulário, os navegadores definem automaticamente o foco nos campos com valores obrigatórios problemáticos ou ausentes. Não é necessário JavaScript!

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mPyN7THWJNRQIiBezq6l.png", alt="Captura de tela de um formulário de login no Chrome na área de trabalho mostrando o prompt do navegador e o foco para um valor de e-mail inválido.", width="500", height="483" %} <figcaption>Validação embutida básica pelo navegador.</figcaption></figure>

Valide inline e forneça feedback ao usuário à medida que ele insere os dados, em vez de fornecer uma lista de erros ao clicar no botão de envio. Se você precisar validar os dados em seu servidor após o envio do formulário, liste todos os problemas encontrados e destaque claramente todos os campos do formulário com valores inválidos, além de exibir uma mensagem integrada ao lado de cada campo problemático explicando o que precisa ser corrigido. Verifique os logs do servidor e os dados analíticos em busca de erros comuns. Talvez seja necessário reprojetar seu formulário.

Você também deve usar JavaScript para fazer uma validação mais robusta enquanto os usuários estão inserindo dados e no envio do formulário. Use a [API de validação de restrição](https://html.spec.whatwg.org/multipage/forms.html#constraints) (que é [amplamente suportada](https://caniuse.com/#feat=constraint-validation) ) para adicionar validação personalizada usando a IU do navegador integrada para definir o foco e exibir mensagens.

Saiba mais em [Use JavaScript para validação mais complexa em tempo real](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation).

{% Aside 'warning' %} Mesmo com a validação do lado do cliente e restrições de entrada de dados, você ainda deve garantir que seu back-end manipule com segurança a entrada e a saída de dados dos usuários. Nunca confie na entrada do usuário: ela pode ser maliciosa. Saiba mais em [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html). {% endAside %}

#### Ajude os usuários a evitar a perda de dados obrigatórios {: #required}

Use o [atributo `required`](https://developer.mozilla.org/docs/Web/HTML/Attributes/required) nas entradas de valores obrigatórios.

Quando um formulário é enviado, [os navegadores modernos](https://caniuse.com/mdn-api_htmlinputelement_required) automaticamente solicitam e definem o foco nos `required` com dados ausentes, e você pode usar a [pseudo classe `:required`](https://caniuse.com/?search=required) para destacar os campos obrigatórios. Não é necessário JavaScript!

Adicione um asterisco ao rótulo para cada campo obrigatório e adicione uma nota no início do formulário para explicar o que o asterisco significa.

## Simplifique o checkout {: #checkout-forms}

### Cuidado com a lacuna do comércio para celular! {: # m-commerce-gap}

Imagine que seus usuários tenham um *orçamento de fadiga*. Gaste-o e seus usuários irão embora.

Você precisa reduzir o atrito e manter o foco, especialmente no celular. Muitos sites obtêm mais *tráfego* no celular, mas mais *conversões* em computadores: um fenômeno conhecido como [lacuna do comércio para celular](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs). Os clientes podem simplesmente preferir concluir uma compra no computador, mas as taxas de conversão em dispositivos móveis mais baixas também são resultado da experiência do usuário insatisfatória. Seu trabalho é *minimizar*  as conversões perdidas no celular e *maximizar*  as conversões em computadores. [A pesquisa mostrou](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs) que há uma grande oportunidade de fornecer uma melhor experiência de formulários para celular.

Acima de tudo, os usuários estão mais propensos a abandonar formulários que parecem longos, complexos e sem um senso de direção. Isso é especialmente verdadeiro quando os usuários estão em telas menores, distraídos ou com pressa. Peça o mínimo de dados possível.

### Tornar o checkout de convidado o padrão {: #guest-checkout}

Para uma loja online, a maneira mais simples de reduzir o atrito com formulários é tornar o pagamento como convidado como padrão. Não force os usuários a criar uma conta antes de fazer uma compra. Não permitir o pagamento como convidado é citado como um dos principais motivos para o abandono do carrinho de compras.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a7OQLnCRb0FZglj07N7z.png", alt="Motivos para abandono do carrinho de compras durante a finalização da compra.", width="800", height="503" %} <figcaption>De <a href="https://baymard.com/checkout-usability">baymard.com/checkout-usability</a></figcaption></figure>

Você pode oferecer inscrição na conta após a finalização da compra. Nesse ponto, você já tem a maioria dos dados de que precisa para configurar uma conta, portanto, a criação da conta deve ser rápida e fácil para o usuário.

{% Aside 'gotchas' %} Se você oferecer inscrição após a finalização da compra, certifique-se de que a compra que o usuário acabou de fazer está vinculada à conta recém-criada! {% endAside %}

### Mostrar progresso do checkout {: #checkout-progress}

Você pode tornar o processo de checkout menos complexo mostrando o progresso e deixando claro o que precisa ser feito a seguir. O vídeo abaixo mostra como o varejista [johnlewis.com do](https://www.johnlewis.com) Reino Unido consegue isso.

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/6gIb1yWrIMZFiv775B2y.mp4", controls=true, autoplay=true, muted=true, poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ViftAUUUHr4TDXNec0Ch.png", playsinline=true %} <figcaption>Mostre o progresso do checkout.</figcaption></figure>

Você tem que manter o ímpeto! Para cada etapa do pagamento, use títulos de página e valores de botão descritivos que deixem claro o que precisa ser feito naquele instante e qual é a próxima etapa de checkout.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/address-form-save.mp4" type="video/mp4">
   </source></video>
  <figcaption>Dê aos botões de formulário nomes significativos que mostrem o que vem a seguir.</figcaption></figure>

Use o `enterkeyhint` nas entradas do formulário para definir o rótulo da tecla enter do teclado móvel. Por exemplo, use `enterkeyhint="previous"` e `enterkeyhint="next"` em um formulário de várias páginas, `enterkeyhint="done"` para a entrada final no formulário e `enterkeyhint="search"` para uma entrada de pesquisa.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QoY8Oynpw0CqjPACtCdG.png", alt="Duas capturas de tela de um formulário de endereço no Android mostrando como o atributo de entrada enterkeyhint altera o ícone do botão de tecla Enter.", width="800", height="684" %} <figcaption>Botões de tecla Enter no Android: 'próximo' e 'concluído'.</figcaption></figure>

O atributo `enterkeyhint` [é compatível com Android e iOS](https://caniuse.com/mdn-html_global_attributes_enterkeyhint). Você pode descobrir mais no [enterkeyhint explainer](https://github.com/dtapuska/enterkeyhint).

{: #checkout-details}

Torne mais fácil para os usuários irem e voltarem no processo de finalização da compra para facilmente retificarem seus pedidos, mesmo quando eles estiverem na etapa final de pagamento. Mostre todos os detalhes do pedido, não apenas um resumo limitado. Permita que os usuários ajustem facilmente as quantidades dos itens na página de pagamento. Sua prioridade na finalização da compra é evitar a interrupção do andamento da conversão.

### Remova distrações {: #reduce-checkout-exits}

Limite os pontos de saída potenciais, removendo confusão visual e distrações, como promoções de produtos. Muitos varejistas de sucesso removem até mesmo a navegação e a pesquisa do checkout.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UR97R2LqJ5MRkL5H4V0U.png", alt="Duas capturas de tela no celular mostrando o progresso no checkout do johnlewis.com. Pesquisa, navegação e outras distrações são removidas.", width="800", height="683" %} <figcaption>Pesquisa, navegação e outras distrações removidas do checkout.</figcaption></figure>

Mantenha a jornada no foco. Este não é o momento de apresentar tentações para os usuários fazerem outra coisa!

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lKJwd5e2smBfDjNxV22N.jpg", alt="Captura de tela da página de finalização de compra no celular, mostrando uma promoção de ETIQUETAS GRATUITAS que distrai.", width="350", height="735" %} <figcaption>Não distraia os clientes quando estão concluindo a compra.</figcaption></figure>

Para usuários recorrentes, você pode simplificar ainda mais o fluxo de checkout, ocultando dados que eles não precisam ver. Por exemplo: exiba o endereço de entrega em texto simples (não em um formulário) e permita que os usuários o alterem através de um link.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xEAYOeEFYhOZLaB2aeCY.png", alt="Captura de tela da seção 'Revisar pedido' da página de finalização da compra, mostrando texto sem formatação, com links para alterar o endereço de entrega, forma de pagamento e endereço de cobrança, que não são exibidos.", width="450", height="219" %} <figcaption>Oculte dados que os clientes não precisam ver.</figcaption></figure>

## Facilite a inserção de nome e endereço {: #address-forms}

### Peça apenas os dados de que você precisa {: #unneeded-data}

Antes de começar a escrever o código de seus formulários de nome e endereço, certifique-se de entender quais dados são necessários. Não peça dados de que não precisa! A maneira mais simples de reduzir a complexidade do formulário é remover campos desnecessários. Isso também é bom para a privacidade do cliente e pode reduzir custos e a responsabilidade com os dados de back-end.

### Use um único nome de entrada {: #single-name-input}

Permita que seus usuários insiram seus nomes usando uma única entrada, a menos que você tenha um bom motivo para armazenar nomes próprios, sobrenomes, títulos honoríficos ou outras partes de nomes separadamente. Usar uma única entrada de nome torna os formulários menos complexos, permite cortar e colar e simplifica o preenchimento automático.

Em particular, a menos que você tenha um bom motivo para não fazer isso, não se preocupe em adicionar uma entrada separada para um prefixo ou título (como Sra., Dr. ou Lord). Os usuários podem digitar isso com seus nomes, se quiserem. Além disso, o `honorific-prefix` atualmente não funciona na maioria dos navegadores e, portanto, adicionar um campo para prefixo de nome ou título interromperá a experiência de preenchimento automático de formulário de endereço para a maioria dos usuários.

### Habilitar preenchimento automático de nome

Use `name` para um nome completo:

```html
<input autocomplete="name" ...>
```

Se você realmente tem um bom motivo para dividir as partes do nome, certifique-se de usar os valores de preenchimento automático apropriados:

- `honorific-prefix`
- `given-name`
- `nickname`
- `additional-name-initial`
- `additional-name`
- `family-name`
- `honorific-suffix`

### Permitir nomes internacionais {: #unicode-matching}

Você pode querer validar suas entradas de nome ou restringir os caracteres permitidos para os dados de nome. No entanto, você precisa ser o menos restritivo possível com os alfabetos. É rude ouvir que seu nome é "inválido"!

Para a validação, evite usar expressões regulares que correspondam apenas a caracteres latinos. Somente latino exclui usuários com nomes ou endereços que incluem caracteres que não estão no alfabeto latino. Permita, em vez disso, a correspondência de letras Unicode e certifique-se de que seu back-end suporte Unicode com segurança tanto como entrada quanto como saída. O Unicode em expressões regulares é bem suportado por navegadores modernos.

{% Compare 'worse' %}

```html
<!-- Nomes com caracteres não latinos (como Françoise ou Jörg) são 'inválidos'. -->
<input pattern="[\w \-]+" ...>
```

{% endCompare %}

{% Compare 'better' %}

```html
<!-- Accepts Unicode letters. -->
<input pattern="[\p{L} \-]+" ...>
```

{% endCompare %}

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/unicode-letter-matching.mp4" type="video/mp4">
   </source></video>
  <figcaption>Correspondência de letras Unicode comparada à correspondência de letras apenas latinas.</figcaption></figure>

{% Aside %} Você pode descobrir mais sobre [internacionalização e localização](#internationalization-localization) abaixo, mas certifique-se de que seus formulários funcionem com nomes em todas as regiões onde você tem usuários. Por exemplo, para nomes japoneses, você deve considerar ter um campo para nomes fonéticos. Isso ajuda a equipe de suporte ao cliente a dizer o nome do cliente ao telefone. {% endAside %}

### Permitir uma variedade de formatos de endereço {: #address-variety}

Ao projetar um formulário de endereço, tenha em mente a variedade surpreendente de formatos de endereço, mesmo dentro de um único país. Tenha cuidado para não fazer suposições sobre endereços "normais". (Dê uma olhada no [UK Address Oddities!](http://www.paulplowman.com/stuff/uk-address-oddities/) se não estiver convencido!)

#### Flexibilize os formulários de endereço {:flexible-address}

Não force os usuários a tentar espremer seus endereços em campos de formulário onde não cabem.

Por exemplo, não insista em um número de casa e nome de rua em entradas separada visto que muitos endereços não usam esse formato e dados incompletos podem interromper o preenchimento automático do navegador.

Seja especialmente cuidadoso com campos de endereço `required`. Por exemplo, endereços em grandes cidades no Reino Unido não têm um condado, mas muitos sites ainda obrigam os usuários a informar um.

Usar duas linhas de endereço flexíveis pode funcionar bem o suficiente para uma variedade de formatos de endereço.

```html
<input autocomplete="address-line-1" id="address-line1" ...>
<input autocomplete="address-line-2" id="address-line2" ...>
```

Adicione rótulos para corresponder:

```html/0-2,5-7
<label for="address-line-1">
Linha de endereço 1 (ou nome da empresa)
</label>
<input autocomplete="address-line-1" id="address-line1" ...>

<label for="address-line-2">
Endereço linha 2 (opcional)
</label>
<input autocomplete="address-line-2" id="address-line2" ...>
```

Você pode experimentar combinar e editar o exemplo incorporado abaixo.

{% Aside 'caution' %} Pesquisas mostram que a [**Linha 2 do endereço** pode ser problemática para os usuários](https://baymard.com/blog/address-line-2). Tenha isso em mente ao projetar formulários de endereço: você deve considerar alternativas, como usar uma única área de `textarea` (veja abaixo) ou outras opções. {% endAside %}

#### Considere usar um único textarea para o endereço {: #address-textarea}

A opção mais flexível para endereços é fornecer um único `textarea`.

O `textarea` se ajusta a qualquer formato de endereço e é ótimo para recortar e colar, mas lembre-se de que pode não atender aos seus requisitos de dados e os usuários podem perder o preenchimento automático se anteriormente tiverem usado apenas formulários com `address-line1` e `address-line2` .

Para um textarea, use `street-address` como o valor de preenchimento automático.

Aqui está um exemplo de um formulário que demonstra o uso de uma única área `textarea` para o endereço:

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

#### Internacionalize e localize seus formulários de endereço {: #internacionalization-localization}

É especialmente importante que os formulários de endereço considerem a [internacionalização e a localização](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites/), dependendo de onde seus usuários estiverem localizados.

Esteja ciente de que a nomenclatura das partes do endereço varia, assim como os formatos dos endereços, mesmo dentro do mesmo idioma.

```text
    ZIP code: EUA
 Postal code: Canadá
    Postcode: Reino Unido
     Eircode: Irlanda
         PIN: Índia
```

Pode ser irritante ou confuso receber um formulário que não combina com seu endereço ou que não usa as palavras que você espera.

Personalizar formulários de endereço [para vários locais](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites#determining-user-s-language-and-region) pode ser necessário para o seu site, mas o uso de técnicas para maximizar a flexibilidade do formulário (conforme descrito acima) pode ser adequado. Se você não localizar seus formulários de endereço, certifique-se de entender as principais prioridades para lidar com uma variedade de formatos de endereço:

- Evite ser muito específico sobre partes do endereço, como insistir no nome de uma rua ou número de casa.
- Sempre que possível, evite tornar os campos `required`. Por exemplo, os endereços em muitos países não têm um código postal e endereços rurais podem não ter um nome de rua ou estrada.
- Use nomenclatura inclusiva: 'País/região' e não 'País'; 'ZIP/código postal' e não 'ZIP'.

Deixe flexível! O [exemplo de formulário de endereço simples acima](#address-textarea) pode ser adaptado para funcionar 'bem o suficiente' para muitos locais.

#### Considere evitar a pesquisa de endereço de código postal {: #postal-code-address-lookup}

Alguns sites usam um serviço para pesquisar endereços com base no código postal ou CEP. Isso pode ser sensato para alguns casos de uso, mas você deve estar ciente das potenciais desvantagens.

A sugestão de endereço de código postal não funciona para todos os países e, em algumas regiões, os códigos postais podem incluir um grande número de endereços potenciais.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/long-list-of-addresses.mp4" type="video/mp4">
   </source></video>
  <figcaption>CEPs ou códigos postais podem incluir muitos endereços!</figcaption></figure>

É difícil para os usuários selecionar a partir de uma longa lista de endereços, especialmente no celular se estiverem com pressa ou estressados. Pode ser mais fácil e menos sujeito a erros permitir que os usuários aproveitem o preenchimento automático e insiram seus endereços completos preenchidos com um único toque ou clique.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/full-name-autofill.mp4" type="video/mp4">
   </source></video>
  <figcaption>Uma única entrada de nome permite a entrada de endereço com um toque (um clique).</figcaption></figure>

## Simplifique os formulários de pagamento {: #general-guidelines}

Os formulários de pagamento são a parte mais crítica do processo de checkout. O design inadequado do formulário de pagamento é uma [causa comum de abandono do carrinho de compras](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs). O [diabo está nos detalhes](https://en.wikipedia.org/wiki/The_devil_is_in_the_detail#cite_note-Titelman-1): pequenas falhas podem levar os usuários a abandonar uma compra, principalmente no celular. Seu trabalho é projetar formulários para facilitar ao máximo a inserção de dados pelos usuários.

### Ajude os usuários a evitar inserir novamente os dados de pagamento {: #payment-form-autocomplete}

Certifique-se de adicionar os `autocomplete` apropriados nos formulários de cartão de pagamento, incluindo o número do cartão de pagamento, o nome no cartão e o mês e ano de validade:

- `cc-number`
- `cc-name`
- `cc-exp-month`
- `cc-exp-year`

Isso permite que os navegadores ajudem os usuários armazenando com segurança os detalhes do cartão de pagamento e inserindo corretamente os dados do formulário. Sem o preenchimento automático, é mais provável que os usuários mantenham um registro físico dos detalhes do cartão de pagamento ou armazenem dados do cartão de pagamento de maneira insegura em seus dispositivos.

{% Aside 'caution' %} Não adicione um seletor para o tipo de cartão de pagamento, pois isso sempre pode ser inferido a partir do número do cartão de pagamento. {% endAside %}

### Evite usar elementos personalizados para datas de cartão de pagamento

Se não forem projetados corretamente, os [elementos personalizados](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) podem interromper o fluxo de pagamento interrompendo o preenchimento automático e não funcionar em navegadores mais antigos. Se todos os outros detalhes do cartão de pagamento estiverem disponíveis no preenchimento automático, mas um usuário for obrigado a encontrar seu cartão físico de pagamento para procurar uma data de validade porque o preenchimento automático não funcionou para um elemento personalizado, você provavelmente perderá uma venda. Considere usar elementos HTML padrão em vez disso e estilize-os de acordo.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1LIQm2Jt5PHxN0I7tni3.jpg", alt="Captura de tela do formulário de pagamento mostrando elementos personalizados para a data de validade do cartão que interrompem o preenchimento automático.", width="800", height="916" %} <figcaption>O preenchimento automático preencheu todos os campos, exceto a data de validade!</figcaption></figure>

### Use uma única entrada para cartão de pagamento e números de telefone {: #single-number-input}

Para cartões de pagamento e números de telefone, use uma única entrada: não divida o número em partes. Isso facilitar para os usuários inserirem dados, torna a validação mais simples e permite que os navegadores sejam preenchidos automaticamente. Considere fazer o mesmo para outros dados numéricos, como PIN e códigos bancários.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7cUwamPstwSQTlbmQ4CT.jpg", alt="Captura de tela do formulário de pagamento mostrando um campo de cartão de crédito dividido em quatro elementos de entrada.", width="800", height="833" %} <figcaption>Não use várias entradas para um número de cartão de crédito.</figcaption></figure>

### Valide com atenção {: #validate}

Você deve validar a entrada de dados em tempo real e antes do envio do formulário. Uma maneira de fazer isso é adicionando um `pattern` a uma entrada de cartão de pagamento. Se o usuário tentar enviar o formulário de pagamento com um valor inválido, o navegador exibe uma mensagem de aviso e define o foco na entrada. Não é necessário JavaScript!

{% Glitch {id: 'payment-card-input', path: 'index.html', height: 170} %}

No entanto, seu `pattern` deve ser flexível o suficiente para lidar com a [variedade de comprimentos de número de cartão de pagamento](https://github.com/jaemok/credit-card-input/blob/master/creditcard.js#L35): de 14 dígitos (ou possivelmente menos) a 20 (ou mais). Você pode descobrir mais sobre a estruturação do número do cartão de pagamento no [LDAPwiki](https://ldapwiki.com/wiki/Bank%20Card%20Number) .

Permita que os usuários incluam espaços ao inserir um novo número de cartão de pagamento, pois é assim que os números são exibidos nos cartões físicos. Isso é mais amigável para o usuário (você não terá que dizer a eles "eles fizeram algo errado"), e é menos provável que interrompa o fluxo de conversão, é simples remover espaços nos números antes do processamento.

{% Aside %} Você pode usar uma senha de uso único para verificação de identidade ou pagamento. No entanto, pedir aos usuários para inserir manualmente um código ou copiá-lo de um e-mail ou de um texto SMS está sujeito a erros e é uma fonte de atrito. Aprenda sobre as melhores maneiras de habilitar senhas únicas nas [melhores práticas para formulários SMS OTP](/sms-otp-form) . {% endAside %}

## Teste em uma variedade de dispositivos, plataformas, navegadores e versões {: #test-plataforms}

É particularmente importante testar o endereço e os formulários de pagamento nas plataformas mais comuns para seus usuários, uma vez que a funcionalidade e a aparência do elemento do formulário podem variar, e as diferenças no tamanho da janela de visualização podem levar a um posicionamento problemático. O BrowserStack permite [o teste gratuito para projetos de código aberto](https://www.browserstack.com/open-source) em uma variedade de dispositivos e navegadores.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Uk7WhpDMuHtvjmWlFnJE.jpg", alt="Capturas de tela de um formulário de pagamento, payment-form.glitch.me, no iPhone 7 e 11. O botão Concluir pagamento é mostrado no iPhone 11, mas não no 7", width="800", height="707" %} <figcaption>A mesma página no iPhone 7 e no iPhone 11. <br> Reduza o preenchimento para janelas de visualização móveis menores para garantir que o botão <strong>Concluir pagamento</strong> não esteja oculto.</figcaption></figure>

## Implemente análises e RUM {: #analytics-rum}

Testar a usabilidade e o desempenho localmente pode ser útil, mas você precisa de dados do mundo real para entender corretamente como é a experiência dos usuários com seus formulários de pagamento e de endereço.

Para isso, você precisa de análises e monitoramento de usuário real: dados para a experiência de usuários reais, como quanto tempo as páginas de checkout levam para carregar ou quanto tempo o pagamento leva para ser concluído:

- **Análise da página**: visualizações de página, taxas de rejeição e saídas para cada página com um formulário.
- **Análise da interação** : [funis de objetivos](https://support.google.com/analytics/answer/6180923?hl=en) e [eventos](https://developers.google.com/analytics/devguides/collection/gtagjs/events) indicam onde os usuários abandonam seu fluxo de checkout e quais ações eles realizam ao interagir com seus formulários.
- **Desempenho do site** : [métricas centradas no usuário](/user-centric-performance-metrics) podem dizer se suas páginas de checkout demoram para carregar e, em caso afirmativo, qual é a causa.

Análise de página, análise de interação e medição de desempenho real do usuário tornam-se especialmente valiosos quando combinados com registros do servidor, dados de conversão e testes A/B, permitindo que você responda a perguntas como se os códigos de desconto aumentam a receita ou se uma mudança no layout do formulário melhora conversões.

Isso, por sua vez, oferece uma base sólida para priorizar esforços, fazer mudanças e recompensar o sucesso.

## Continue aprendendo {: #resources}

- [Práticas recomendadas para formulários de login](/sign-in-form-best-practices)
- [Práticas recomendadas para formulários de inscrição](/sign-up-form-best-practices)
- [Verifique os números de telefone na web com a API WebOTP](/web-otp)
- [Crie formulários incríveis](/learn/forms/)
- [Melhores práticas para design de formulários para celular](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [Controles de formulário mais capazes](/more-capable-form-controls)
- [Criação de formulários acessíveis](https://webaim.org/techniques/forms/)
- [Simplificando o fluxo de inscrição usando a API de gerenciamento de credenciais](https://developer.chrome.com/blog/credential-management-api/)
- [O Guia compulsivo de endereços postais de Frank](http://www.columbia.edu/~fdc/postal/) fornece links úteis e orientação abrangente para formatos de endereço em mais de 200 países.
- [Listas de países](http://www.countries-list.info/Download-List) tem uma ferramenta para baixar códigos e nomes de países em vários idiomas, em vários formatos.

Foto de [@rupixen](https://unsplash.com/@rupixen) no [Unsplash](https://unsplash.com/photos/Q59HmzK38eQ) .
