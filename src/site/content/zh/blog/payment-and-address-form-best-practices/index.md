---
title: 付款和地址表单最佳实践
subhead: 帮助用户尽可能快速轻松地填写地址和付款表单，最大限度提高转化率。
authors:
  - samdutton
scheduled: 'true'
date: 2020-12-09
updated: 2021-11-30
description: 帮助用户尽可能快速轻松地填写地址和付款表单，最大限度提高转化率。
hero: image/admin/dbYeeV2PCRZNY6RRvQd2.jpg
thumbnail: image/admin/jy8z8lRuLmmnyytD5xwl.jpg
alt: 一位正在使用支付卡在笔记本电脑上付款的商人。
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

精心设计的表单可以帮助用户和提高转化率。小小的改变可能会让结果大不相同！

{% Aside 'codelab' %}如果您希望通过便捷的教程学习这些最佳实践，请查看本博文的两个代码实验室：

- [付款表单最佳实践代码实验室](/codelab-payment-form-best-practices)
- [地址表单最佳实践代码实验室](/codelab-address-form-best-practices){% endAside %}

下面是付款表单的一个简单示例，其中演示了所有最佳实践：

{% Glitch { id: 'payment-form', path: 'index.html', height: 720 } %}

下面是地址表单的一个简单示例，其中演示了所有最佳实践：

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

## 清单

- [使用有意义的 HTML 元素](#meaningful-html)：`<form>`、`<input>`、`<label>` 和 `<button>`。
- [使用 `<label>` 标记每个表单字段](#html-label)。
- 使用 HTML 元素属性[访问内置浏览器功能](#html-attributes)，特别是 [`type`](#type-attribute) 和具有适当值的 [`autocomplete`](#autocomplete-attribute)。
- 对于不递增的数字，请避免使用 `type="number"`。您可以使用 `type="text"`和[`inputmode="numeric"`](#inputmode-attribute)。
- 如果 `input`、`select` 或 `textarea` 可使用[适当的自动完成值](#autocomplete-attribute)，则应使用。
- 为了帮助浏览器自动填充表单，请为输入的 `name` 和 `id` 属性提供[稳定值](#stable-name-id)，使其在页面加载或网站部署之间不会改变。
- 点击或单击后[禁用提交按钮](#disable-submit)。
- 在输入期间[验证](#validate)数据——不仅仅是在提交表单时。
- 将[顾客结账](#guest-checkout)设为默认设置，并在结账完成后简化帐户创建过程。
- 以清晰的步骤显示[结账流程进度](#checkout-progress)，并包含明确的号召性用语。
- 消除杂乱和干扰，[限制潜在的结账退出点](#reduce-checkout-exits)。
- 在结账时[显示完整的订单详细信息](#checkout-details)，简化订单调整操作。
- [不要索要不需要的数据](#unneeded-data)。
- [在单次输入中要求客户提供姓名](#single-name-input)，除非有充分的理由多次要求客户提供。
- 不要强制要求姓名和用户名[只能使用拉丁字符](#unicode-matching)。
- [允许使用多种地址格式](#address-variety)。
- 考虑[对 address 使用单个`textarea`](#address-textarea) 。
- 使用[自动填写账单地址](#billing-address)。
- 必要时实施[国际化和本地化](#internationalization-localization)。
- 考虑避免[查找邮政编码地址](#postal-code-address-lookup)。
- 使用[适当的支付卡自动填写值](#payment-form-autocomplete)。
- [让客户在单一输入中提供支付卡号](#single-number-input)。
- 如果[自定义元素](#avoid-custom-elements)会破坏自动填写体验，请避免使用。
- [现场和实验室测试](#analytics-rum)：页面分析、交互分析及真实用户性能测量。
- [在一系列浏览器、设备和平台上测试](#test-platforms)。

{% Aside %}本文介绍地址和付款表单的前端最佳实践，其中没有阐述如何在网站上实施交易。要了解在网站上添加支付功能的更多信息，请参阅 [Web 支付](/payments)。{% endAside %}

## 使用有意义的 HTML {: #meaningful-html}

使用为作业构建的元素和属性：

- `<form>`、`<input>`、`<label>` 和 `<button>`
- `type`、`autocomplete` 和 `inputmode`

这些元素和属性可启用内置浏览器功能，改善可访问性，并赋予标记含义。

### 按预期使用 HTML 元素 {: #html-elements}

#### 将表单放入 &lt;form&gt; 中 {: #html-form}

您可能不想将 `<input>` 元素包含在 `<form>` 中，而希望只使用 JavaScript 来处理数据提交。

不要这样做！

凭借 HTML `<form>`，您可以使用所有现代浏览器中一组强大的内置功能，还有利于屏幕阅读器和其他辅助设备访问您的站点。利用 `<form>`，您还可以更简单地为具有有限 JavaScript 支持的旧浏览器构建基本功能，而且，即使代码出现问题（或者少数用户实际上禁用了 JavaScript），您也可以启用表单提交。

如果有多个接受用户输入的页面组件，请确保将每个组件放在各自的 `<form>` 元素中。例如，如果在同一页面上进行搜索和注册，请分别将其放在各自的 `<form>` 中。

#### 使用 `<label>` 标记元素 {: #html-label}

要标记 `<input>`、`<select>` 或 `<textarea>`，请使用 [`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label)。

通过为标签的 `for` 属性赋予与 `id` 相同的值，将标签与输入相关联。

```html
<label for="address-line1">Address line 1</label>
<input id="address-line1" …>
```

对单一输入使用单个标签：不要试图使用一个标签来标记多个输入。这最适合浏览器和屏幕阅读器的方式。点击或单击标签会将焦点移至与其关联的输入，当*标签*或标签的*输入*获得焦点时，屏幕阅读器会读出标签文本。

{% Aside 'caution' %} 不要单独使用[占位符](https://www.smashingmagazine.com/2018/06/placeholder-attribute/)而不使用标签。开始在输入中输入文本时，占位符会被隐藏，因此很容易忘记输入的用途。如果使用占位符来显示日期等值的正确格式，情况也是如此。对手机用户来说，这更是一个问题，尤其是当他们分心或有压力时！{% endAside %}

#### 让按钮有用 {: #html-button}

使用 [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button) 创建按钮！也可以使用 `<input type="submit">`，但不要使用 `div` 或其他可创建按钮的一些随机元素。按钮元素提供可访问行为、内置表单提交功能，并且可以轻松设置样式。

为每个表单提交按钮赋予一个可说明功能的值。对于结账的每一个步骤，请使用描述性的号召用语，以显示进度并清楚地说明下一步。例如，在收货地址表单上为提交按钮添加标签**继续付款**，而不是**继续**或**保存**。

{: #disable-submit}

考虑在用户点击或单击提交按钮后将其禁用——尤其当用户付款或下订单时。即使工作正常，很多用户也可能反复单击按钮。这可能导致结账出错和增加服务器负载。

另一方面，不要禁用等待完整有效的用户输入的提交按钮。例如，不要因为缺少内容或内容无效而禁用**保存地址**按钮。这对用户没有帮助——他们可能会继续点击或单击按钮，并且会以为该按钮出了故障。如果用户尝试提交包含无效数据的表单，请说明发生的问题以及解决方法。在移动设备上，这一点尤其重要，因为在移动设备上输入数据更难，而且，在用户尝试提交表单时，他们的屏幕上可能看不到缺少或无效的表单数据。

{% Aside 'caution' %} 表单中的默认按钮类型是 `submit`。如果您想在表单中添加另一个按钮（例如，**显示密码**），请添加 `type="button"`。否则单击或点击按钮时将提交表单。

在任何表单字段获得焦点时按 `Enter` 键都会模拟单击表单中第一个 `submit` 按钮。如果在表单中的**提交**按钮之前包含一个按钮而不指定类型，那么该按钮将具有表单 (`submit`) 中按钮的默认类型，并且会在提交表单之前接收单击事件。有关示例，请参阅我们的[演示](https://enter-button.glitch.me/)：填写表单，然后按 `Enter` 键。{% endAside %}

### 充分利用 HTML 属性 {: #html-attributes}

#### 让用户便于输入数据

{: #type-attribute}

使用适当的输入 [`type` 属性](https://developer.mozilla.org/docs/Web/HTML/Element/input/email)，在移动设备上提供合适的键盘并启用浏览器的基本内置验证。

例如，为电子邮件地址使用 `type="email"`，为电话号码使用 `type="tel"`。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bi7J9Z1TLP4IQLyhbQm.jpg", alt="Android 手机的两张截屏，显示了适合输入电子邮件地址（使用 type=email）和电话号码（使用 type=tel）的键盘）。", width="800", height="683" %}<figcaption>适合输入电子邮件地址和电话号码的键盘。</figcaption></figure>

{: #inputmode-attribute}

{% Aside 'warning' %} 使用 type="number" 添加对数字进行增量加减的向上/向下箭头，但这对电话、支付卡或账号等数据没有意义。

对于此类数字，请将其类型设置为 `type="text"`（或者不设置属性，因为 `text` 是默认值）。对于电话号码，请使用 `type="tel"` 以在移动设备上获取相应的键盘。对于其他数字，请使用 `inputmode="numeric"` 以在移动设备上获取数字键盘。

为了确保移动用户使用合适的键盘，一些网站仍在使用 `type="tel"` 作为支付卡号。但是，`inputmode`现在已经[得到了广泛支持](https://caniuse.com/input-inputmode)，因此，您不必这样做——但是，您要检查用户的浏览器。{% endAside %}

{: #avoid-custom-elements}

对于日期，要尽量避免使用自定义 `select` 元素。如果实施不正确，它会破坏自动填充体验，而且在旧浏览器中无法工作。对于出生年份等数字，请考虑使用 `input` 元素（而不是 `select`），手动输入数字更简单且不易出错——尤其是在移动设备上。为了确保在移动设备上使用合适的键盘，请使用 `inputmode="numeric"`，同时使用文本或占位符添加验证以及格式提示，从而确保用户以正确的格式输入数据。

{% Aside %} 利用 [`datalist`](https://developer.mozilla.org/docs/Web/HTML/Element/datalist) 元素，用户可从列表中选择可用选项，并且可在用户输入文本提供匹配建议。对于 [simpl.info/datalist](https://simpl.info/datalist) 的 `text`、`range` 和 `color`，不妨试一试 `datalist`。对于出生年份输入，您可以在 [datalist-select.glitch.me](https://datalist-select.glitch.me)<br>中比较 `select` 与 `input` 和 `datalist`。{% endAside %}

#### 使用自动完成来提高可访问性并帮助用户避免重新输入数据 {: #autocomplete-attribute}

利用适当的 `autocomplete` 值，让浏览器能够安全存储数据和自动填充 `input`、`select` 和 `textarea` 值，从而帮助用户。这在移动设备上尤其重要，为了避免[表单放弃率过高](https://www.zuko.io/blog/8-surprising-insights-from-zukos-benchmarking-data)，这一点更是至关重要。自动完成还可以提供[多种可访问性优势](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html)。

如果表单字段有合适的自动完成值，则应使用。[MDN Web 文档](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete)提供了完整的值列表以及正确使用方法的说明。

{: #stable-name-id}

{% Aside %} 除了使用适当的自动完成值外，还可以通过为表单字段 `name` 和 `id` 属性提供[稳定值](#stable-name-id)来帮助浏览器自动填充表单。稳定值在页面加载或网站部署之间不会改变。{% endAside %}

{: #billing-address}

默认情况下，将账单地址设置为与送货地址相同。请提供编辑账单地址的链接（或使用 [`summary` 和 `details` 元素](https://simpl.info/details/)），让界面更一目了然，而不要在表单中显示账单地址。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TIan7TU8goyoOXwLPYyd.png", alt="显示更改账单地址链接的示例结账页面。", width="800", height="250" %}<figcaption>添加查看账单的链接。</figcaption></figure>

与处理送货地址一样，为账单地址使用适当的自动完成值，这样，用户便不必多次输入数据。如果不同部分具有相同名称的输入字段，但需要输入不同的值，则要向自动完成属性添加前缀词。

```html
<input autocomplete="shipping address-line-1" ...>
...
<input autocomplete="billing address-line-1" ...>
```

#### 帮助用户输入正确的数据 {: #validation}

尽量避免因客户“操作错误”而“责备”他们。您要帮助用户解决发生的问题，让他们更快速轻松地完成表单。客户完成结账流程就是在购买公司产品或服务，从而让您赚取利润——所以，您要帮助他们，而不能惩罚他们！

您可以向表单元素添加[约束属性](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation#Intrinsic_and_basic_constraints)来指定可接受的值，包括 `min`、`max` 和 `pattern`。元素的[有效状态](https://developer.mozilla.org/docs/Web/API/ValidityState)根据元素的值是否有效而进行自动设置，`:valid` 和 `:invalid` CSS 伪类可用于设置具有有效或无效值的元素样式。

例如，以下 HTML 指定 1900 年到 2020 年之间出生年份的输入。使用 `type="number"` 将输入值限制在 `min` 和 `max` 的指定范围内的数字。如果尝试输入超出范围的数字，则会将输入设置为无效状态。

{% Glitch { id: 'constraints', path: 'index.html', height: 170 } %}

以下示例使用 `pattern="[\d ]{10,30}"` 来确保支付卡号有效，同时允许使用空格：

{% Glitch { id: 'payment-card-input', path: 'index.html', height: 170 } %}

现代浏览器还会对 `email` 或 `url` 类型的输入进行基本验证。

{% Glitch { id: 'type-validation', path: 'index.html', height: 250 } %}

{% Aside %} 将 `multiple` 属性添加到类型为 `type="email"` 的输入，从而支持对单个输入中使用逗号分隔的多个电子邮件地址进行内置验证。{% endAside %}

在提交表单时，浏览器会自动将焦点设置在有问题或缺少必填值的字段中。不需要 JavaScript！

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mPyN7THWJNRQIiBezq6l.png", alt="桌面 Chrome 登录表单的截屏，显示浏览器提示和无效电子邮件值的焦点。", width="500", height= "483" %}<figcaption>浏览器的基本内置验证。</figcaption></figure>

内联验证并在用户输入数据时向其提供反馈，而不是在用户单击提交按钮时提供错误列表。如果您需要在表单提交后验证服务器上的数据，请列出发现的所有问题并清楚地突出显示所有包含无效值的表单字段，同时在每个有问题的字段旁显示一条消息，说明需要解决的问题。检查服务器日志和分析数据，查看是否存在常见错误——您可能需要重新设计表单。

当用户输入数据和提交表单时，您还要使用 JavaScript 进行更可靠的验证。使用[约束验证 API](https://html.spec.whatwg.org/multipage/forms.html#constraints)（已得到[广泛支持](https://caniuse.com/#feat=constraint-validation)）添加使用内置浏览器 UI 设置焦点和显示提示的自定义验证。

要了解更多信息，请参阅[使用 JavaScript 进行更复杂的实时验证](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation)。

{% Aside 'warning' %} 即使有客户端验证和数据输入限制，您仍必须确保在后端安全地处理用户的数据输入和输出。切勿相信用户输入：它可能是恶意的。要了解更多信息，请参阅 [OWASP 输入验证速查表](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)。{% endAside %}

#### 帮助用户避免漏填必需数据 {: #required}

对必需值使用 [`required` 属性。](https://developer.mozilla.org/docs/Web/HTML/Attributes/required)

提交表单时，[现代浏览器](https://caniuse.com/mdn-api_htmlinputelement_required)会自动提示并将焦点设置到缺少数据的 `required` 字段，您可以使用 [`:required` 伪类](https://caniuse.com/?search=required)来突出显示必填字段。不需要 JavaScript！

为每个必填字段的标签添加一个星号，并在表单开头添加解释星号含义的注释。

## 简化结账 {: #checkout-forms}

### 注意移动商务差距！{: #m-commerce-gap}

设想用户有*疲劳预算*。一旦达到用户的耐心用完，他们就会离开。

您需要减少障碍并保持专注，尤其是在移动设备上。很多站点在移动设备上获取更多*流量*，但在桌面设备上*获取更多转化*——这种现象就称为[移动商务差距](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs)。客户可能只是更喜欢在桌面上完成购买，但较低的移动转化率也是用户体验不佳的结果。您的工作是*最大限度*减少移动设备上的转化损失并*最大限度*提高桌面设备上的转化率。[研究表明](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs)，提供更好的移动表单体验是一个巨大的机会。

最重要的是，用户更可能放弃过于复杂冗长和不够简单明了的表单。当用户使用小屏幕设备，不够专注或比较匆忙时，更是如此。只要求客户提供尽可能少的数据。

### 将客户结账设置为默认操作 {: #guest-checkout}

对于在线商店，要减少表单障碍，最简单的方法是将客户结账设置为默认操作。不要强迫用户在购买前创建帐户。不允许客户结账是导致客户放弃购买的主要原因。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a7OQLnCRb0FZglj07N7z.png", alt="结账时放弃购买的原因。", width="800", height="503" %}<figcaption>由 <a href="https://baymard.com/checkout-usability">baymard.com/checkout-usability</a> 提供</figcaption></figure>

您可以在客户完成结账后提供帐户注册步骤。此时，您已经获得设置帐户所需的大部分数据，因此，用户可以轻松快捷的创建帐户。

{% Aside 'gotchas' %} 如果在用户完成结账后提供注册服务，请确保将用户刚刚完成的购买关联到他们新创建的帐户中！{% endAside %}

### 显示结账进度 {: #checkout-progress}

为了让客户觉得结账流程不那么复杂，您可以显示结账进度并明确告知下一步需要做什么。下面的视频展示了英国零售商 [johnlewis.com](https://www.johnlewis.com) 是如何实现这一目标的。

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/6gIb1yWrIMZFiv775B2y.mp4", controls=true, autoplay=true, muted=true, poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ViftAUUUHr4TDXNec0Ch.png", playsinline=true %} <figcaption>显示结账进度。</figcaption></figure>

您要让客户保持动力！对于付款的每一个步骤，您都要使用页眉和描述性的按钮值，明确告知客户现在需要做什么，以及接下来是哪一个结账步骤。

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/address-form-save.mp4" type="video/mp4">
   </source></video>
  <figcaption>为表单按钮指定有意义的名称，以显示接下来需要执行的操作。</figcaption></figure>

为表单输入使用 `enterkeyhint` 属性来设置移动键盘 Enter 键标签。例如，在多页表单中使用 `enterkeyhint="previous"` 和 `enterkeyhint="next"`，为表单中最后的输入使用 `enterkeyhint="done"`，为搜索输入使用 `enterkeyhint="search"`。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QoY8Oynpw0CqjPACtCdG.png", alt="Android 设备上地址表单的两张截屏，显示了 enterkeyhint 输入属性如何更改 Enter 键图标。", width="800", height=" 684" %}<figcaption>Android 设备上的输入 Enter 键按钮：“下一步”和“完成”。</figcaption></figure>

[Android 和 iOS 支持](https://caniuse.com/mdn-html_global_attributes_enterkeyhint)的 `enterkeyhint` 属性。您可以从 [enterkeyhint 解释器](https://github.com/dtapuska/enterkeyhint)中了解更多信息。

{: #checkout-details}

让用户在结账流程中可以轻松地来回切换，调整订单，即便他们已来到最后的付款步骤。完整显示订单的详细信息，而不仅仅是有限的摘要。让用户能够从付款页面轻松调整商品数量。在结账时，最关键的一点是避免中断转换进度。

### 排除干扰 {: #reduce-checkout-exits}

通过消除视觉混乱和产品促销等干扰因素来限制潜在的退出点。很多成功的零售商甚至会从结账步骤中移除导航和搜索功能。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UR97R2LqJ5MRkL5H4V0U.png", alt="两张移动截屏，显示了 johnlewis.com 上的结账进度。已排除搜索、导航和其他干扰因素。", width="800", height="683" %}<figcaption>为结账步骤移除了搜索、导航和其他干扰因素。</figcaption></figure>

让客户保持专注。现在不是诱使用户做其他事情的时候！

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lKJwd5e2smBfDjNxV22N.jpg", alt="移动设备上的结账页面截屏，展示了令人分心的免费贴纸促销活动。", width="350", height="735" %}<figcaption>不要分散客户完成购买的注意力。</figcaption></figure>

对于回头客，您可以通过隐藏他们不需要看到的数据来进一步简化结账流程。例如：以纯文本（而不是表单）形式显示送货地址，并允许用户通过链接进行更改。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xEAYOeEFYhOZLaB2aeCY.png", alt="结账页面上“查看订单”部分的截屏，以纯文本显示文字，并提供了更改送货地址、付款方式和账单地址的链接（未直接显示）。", width="450", height="219" %}<figcaption>隐藏客户不需要看到的数据。</figcaption></figure>

## 简化姓名和地址输入操作 {: #address-forms}

### 只要求客户提供需要的数据 {: #unneeded-data}

开始对姓名和地址表单进行编码之前，请确保了解需要哪些数据。不要索要不需要的数据！最简单的降低表单复杂性的方法是删除不必要的字段。这也有利于保护客户隐私，并且可以降低后端数据成本和需要承担的责任。

### 使用单一名称输入字段 {: #single-name-input}

除非有充分的理由单独存储名字、姓氏、称谓或其他姓名部分，否则，您要允许用户通过单一输入字段来输入他们的姓名。使用单一名称输入字段可以简化表单，而且您要启用剪切和粘贴，让自动填充更简单。

特别是，除非有充分的理由不这样做，否则不要为前缀或头衔（例如，先生、博士或阁下）添加单独的输入字段。用户可以根据需要输入他们的姓名。此外，`honorific-prefix` 自动完成目前在大多数浏览器中不起作用，因此，添加姓名前缀或头衔字段会破坏大多数用户的地址表单自动填充体验。

### 启用姓名自动填充

使用 `name` 作为全名：

```html
<input autocomplete="name" ...>
```

如果您确实有充分的理由拆分姓名部分，请确保使用适当的自动完成值：

- `honorific-prefix`
- `given-name`
- `nickname`
- `additional-name-initial`
- `additional-name`
- `family-name`
- `honorific-suffix`

### 允许国际名称 {: #unicode-matching}

您可能想要验证姓名输入，或限制允许姓名数据使用的字符。但是，您要尽可能让用户不受限制地使用字母。告诉用户您的姓名“无效”会让用户觉得您非常不礼貌！

对于验证，请避免使用仅匹配拉丁字符的正则表达式。仅支持拉丁字符会排除姓名或地址中包含非拉丁字母字符的用户。请改为允许 Unicode 字母匹配，并确保您的后端可靠地支持将 Unicode 字符作为输入和输出。现代浏览器对正则表达式中的 Unicode 字符支持良好。

{% Compare 'worse' %}

```html
<!-- 包含非拉丁字符（如 Françoise 或 Jörg）的姓名被视为"无效"。 -->
<input pattern="[\w \-]+" ...>
```

{% endCompare %}

{% Compare 'better' %}

```html
<!-- 接受 Unicode 字母。 -->
<input pattern="[\p{L} \-]+" ...>
```

{% endCompare %}

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/unicode-letter-matching.mp4" type="video/mp4">
   </source></video>
  <figcaption>Unicode 字母匹配与仅拉丁字母匹配对比。</figcaption></figure>

{% Aside %} 下面可以找到[关于国际化和本地化](#internationalization-localization)的更多信息，但是，请确保表单适用于您的用户所在的所有地区的姓名。例如，对于日语姓名，您要考虑设置一个姓名音标字段。这有助于客户支持人员在电话中说出客户的姓名。{% endAside %}

### 允许使用多种地址格式 {: #address-variety}

设计地址表单时，请记住，地址格式多种多样，令人眼花缭乱，即使在同一个国家/地区，也是如此。注意，不要臆断“正常”的地址格式。（如果您不相信，不妨看看[稀奇古怪的英国地址吧](http://www.paulplowman.com/stuff/uk-address-oddities/)！）

#### 创建灵活的地址表单 {:flexible-address}

不要强迫用户尝试将他们的地址压缩到不合适的表单字段中。

例如，不要坚持让用户在单独的输入字段中输入街道名称和门牌号，因为许多地址不使用这种格式，而且不完整的数据可能会破坏浏览器的自动填充功能。

使用 `required` 地址字段时要特别小心。例如，英国大城市的地址没有郡县，但许多网站仍强制要求用户输入一个郡县。

使用两个灵活的地址行可以很好地处理各种地址格式。

```html
<input autocomplete="address-line-1" id="address-line1" ...>
<input autocomplete="address-line-2" id="address-line2" ...>
```

添加标签来匹配：

```html/0-2,5-7
<label for="address-line-1">
Address line 1 (or company name)
</label>
<input autocomplete="address-line-1" id="address-line1" ...>

<label for="address-line-2">
Address line 2 (optional)
</label>
<input autocomplete="address-line-2" id="address-line2" ...>
```

要进行尝试，您可以重组和编辑下面嵌入的演示。

{% Aside 'caution' %} 研究表明，[**地址行 2** 可能会给用户造成问题](https://baymard.com/blog/address-line-2)。在设计地址表单时，请记住这一点——您要考虑替代方案，例如，使用单一 `textarea`（见下文）或其他选项。{% endAside %}

#### 考虑为地址使用单一 textarea {: #address-textarea}

最灵活的地址选项是提供单一 `textarea`。

`textarea` 方法适合任何地址格式，而且非常便于剪切和粘贴——但是，请记住，如果用户以前只使用过包含 `address-line1` 和 `address-line2` 的表单，textarea 就不一定符合您的数据要求。

对于 textarea，请使用 `street-address` 作为自动完成值。

这是一个表单示例，演示了使用单个`textarea`作为地址：

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

#### 实现地址表单的国际化和本地化 {: #internationalization-localization}

根据您的用户所在的地点，可能有必要考虑为地址表单实现[国际化和本地化](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites/)。

请注意，即使在同一语言区域中，地址部分的命名和地址格式也可能有所不同。

```text
    ZIP code: US
 Postal code: Canada
    Postcode: UK
     Eircode: Ireland
         PIN: India
```

如果提供的表单不适合填写地址或无法使用自己希望使用的字词，可能会令人厌烦或困惑。

您的站点可能需要为[多个区域](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites#determining-user-s-language-and-region)设置自定义地址表单，但是，也许利用技术来最大限度提高表单灵活性（如上所述）就足够了。如果不为地址表单实现本地化，请确保了解处理一系列地址格式的关键点：

- 避免设置过于具体的地址部分，例如坚持要求用户提供街道名称或门牌号。
- 尽可能避免将字段设置为 `required`。例如，许多国家/地区的地址没有邮政编码，农村地址可能没有街道或道路名称。
- 使用包容性命名：例如，使用“国家/地区”，而不是“国家”；使用“邮政编码/邮编”，而不是“邮编”。

保持灵活！[上面的简单地址表单示例](#address-textarea)稍微调整一下就适合许多语言区域。

#### 考虑避免查找地址邮政编码 {: #postal-code-address-lookup}

某些网站使用服务来根据邮政编码查找地址。对于某些用例，这可能是明智的，但是，您要注意潜在的缺点。

邮政编码地址建议并不适合所有国家/地区——在某些地区，邮政编码可能包含大量潜在地址。

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/long-list-of-addresses.mp4" type="video/mp4">
   </source></video>
  <figcaption>邮政编码可能包含很多地址！</figcaption></figure>

用户很难从一长串地址中进行选择——尤其是在移动设备上，当他们时间匆忙或压力较大时。让用户利用自动填充功能，并通过一次点击或单击来输入完整的地址可能更容易且不容易出错。

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/full-name-autofill.mp4" type="video/mp4">
   </source></video>
  <figcaption>单一名称输入支持一键（单击一次）地址输入。</figcaption></figure>

## 简化付款表单 {: #general-guidelines}

付款表格是结账过程中最关键的部分。设计不佳的支付表单是[导致客户放弃购买的常见原因](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs)。 [细节决定成败](https://en.wikipedia.org/wiki/The_devil_is_in_the_detail#cite_note-Titelman-1)：小小的不便就会导致用户放弃购买，尤其是在移动设备上。您的职责是要精心设计表单，尽可能让用户可以轻松输入数据。

### 避免让用户重复输入支付数据 {: #payment-form-autocomplete}

确保在支付卡表单中添加适当的 `autocomplete` 值，包括支付卡号、持卡人姓名以及到期年份和月份：

- `cc-number`
- `cc-name`
- `cc-exp-month`
- `cc-exp-year`

这样，浏览器便可以通过安全地存储支付卡详细信息和正确输入表单数据来帮助用户。如果没有自动完成功能，用户可能更需要保留支付卡详细信息的物理记录，或者在他们的设备上不安全地存储支付卡数据。

{% Aside 'caution' %} 不要添加支付卡类型选择器，因为从支付卡号即可推断出支付卡的类型。{% endAside %}

### 避免为支付卡日期使用自定义元素

如果设计不当，[自定义元素](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements)可能会中断自动填充，从而导致支付流程中断，而且这些元素在旧浏览器上可能无法使用。如果所有其他支付卡详细信息都可以通过自动完成获得，但由于自动填充无法处理自定义元素，导致用户不得不找出实体支付卡才能找到到期日期，那么您很可能会失去销售机会。请考虑使用标准 HTML 元素，并相应地设置样式。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1LIQm2Jt5PHxN0I7tni3.jpg", alt="显示导致自动填充中断的卡到期日自定义元素的付款表单截屏。", width="800", height="916" %}<figcaption>自动完成填写了除到期日期外的所有字段！</figcaption></figure>

### 为支付卡和电话号码使用单一输入字段 {: #single-number-input}

对于支付卡和电话号码，请使用单一输入字段：不要将号码分成几部分。这样，用户更容易输入数据，验证也更简单，同时更便于浏览器自动填充。考虑对其他数字数据（例如 PIN 和银行代码）采取相同的做法。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7cUwamPstwSQTlbmQ4CT.jpg", alt="显示将信用卡字段分成四个输入元素的付款表单截屏。", width="800", height="833" %}<figcaption>不要为信用卡号使用多个输入字段。</figcaption></figure>

### 仔细验证 {: #validate}

您要实时验证数据输入，并在提交表单之前再次验证。一种验证方法是为支付卡输入添加 `pattern` 属性。如果用户尝试使用无效值提交付款表单，浏览器会显示警告消息并将焦点设置到输入字段。不需要 JavaScript！

{% Glitch { id: 'payment-card-input', path: 'index.html', height: 170 } %}

但是，`pattern` 正则表达式必须足够灵活才能处理[支付卡号的长度范围](https://github.com/jaemok/credit-card-input/blob/master/creditcard.js#L35)：从 14 位（也可能更少）到 20 位（也可能更多）。您可以通过 [LDAPwiki](https://ldapwiki.com/wiki/Bank%20Card%20Number) 查找关于支付卡号结构的更多信息。

允许用户在输入新支付卡号时包含空格，因为这是数字在实体卡上的显示方式。这对用户更友好（您不必告诉他们“输入有错”），而且可以降低中断转化流程的几率，同时，在处理之前轻而易举就可以删除数字中的空格。

{% Aside %} 您可能希望使用一次性密码来进行身份或付款验证。但是，要求用户手动输入代码或从电子邮件或 SMS 文本中复制代码很容易出错，并且这会产生障碍。要了解启用一次性密码的理想方法，请参阅 [SMS OTP 表单最佳实践](/sms-otp-form)。{% endAside %}

## 在一系列设备、平台、浏览器和版本上进行测试 {: #test-platforms}

在用户最常用的平台上测试地址和付款表单极其重要，因为表单元素的功能和外观可能有所不同，而且视口大小的差异可能会导致定位出现问题。BrowserStack 支持对各种设备和浏览器上的[开源项目进行免费测试](https://www.browserstack.com/open-source)。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Uk7WhpDMuHtvjmWlFnJE.jpg", alt="iPhone 7 和 iPhone 11 上的付款表单 (payment-form.glitch.me) 的截屏。iPhone 11 上会显示“完成付款”按钮，但 iPhone 11 上不显示", width="800", height="707" %}<figcaption>iPhone 7 和 iPhone 11 上的同一页面。<br>对于较小的移动视口，请缩减边距，确保不遮住<strong>完成付款</strong>按钮。</figcaption></figure>

## 实施分析和 RUM {: #analytics-rum}

在本地测试可用性和性能可能有帮助，但是，您需要真实环境下的数据来客观了解您的付款和地址表单带给用户的体验。

为此，您需要分析和真实用户监控——实际用户体验的数据，例如加载结账页面需要多长时间，或完成支付需要多长时间：

- **页面分析**：包含表单的每个页面的页面浏览量、跳出率和退出率。
- **交互分析**：[目标渠道](https://support.google.com/analytics/answer/6180923?hl=en)和[事件](https://developers.google.com/analytics/devguides/collection/gtagjs/events)表明用户在何处放弃了结账流程，以及他们在与您的表单交互时执行了哪些操作。
- **网站性能**：以[用户为中心的指标](/user-centric-performance-metrics)，可以告诉您结账页面加载是否缓慢，如果是，还会告诉您是什么原因。

与服务器日志、转化数据和 A/B 测试结合使用时，页面分析、交互分析和真实用户性能测量非常有价值，可以让您回答这样的问题，例如：折扣代码能否增加收入，表单布局的变化是否提高了转化率。

不仅如此，这也确定工作优先事项，做出改变和奖励成功提供了坚实的基础。

## 继续学习 {: #resources}

- [登录表单最佳实践](/sign-in-form-best-practices)
- [注册表单最佳实践](/sign-up-form-best-practices)
- [使用 WebOTP API 验证 Web 上的电话号码](/web-otp)
- [创建令人惊艳的表单](/learn/forms/)
- [移动表单设计最佳实践](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [更强大的表单控件](/more-capable-form-controls)
- [创建可访问表单](https://webaim.org/techniques/forms/)
- [利用凭据管理 API 简化注册流程](https://developer.chrome.com/blog/credential-management-api/)
- [Frank 的邮政地址必修指南](http://www.columbia.edu/~fdc/postal/)为 200 多个国家/地区的地址格式提供了有用的链接和广泛的指导。
- [Country Lists](http://www.countries-list.info/Download-List) 提供了一个以多种语言和多种格式下载国家/地区代码和名称的工具。

照片：[@rupixen](https://unsplash.com/@rupixen)；来源：[Unsplash](https://unsplash.com/photos/Q59HmzK38eQ)。
