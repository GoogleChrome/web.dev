---
title: 什么是 FLoC？
subhead: FLoC 允许在不共享单个用户浏览行为的情况下进行广告选择。
authors:
  - samdutton
date: 2021-03-30
updated: 2021-10-29
hero: image/80mq7dk16vVEg8BBhsVe42n6zn82/GA543wiVTwpbwp6Zmw0H.jpg
thumbnail: image/80mq7dk16vVEg8BBhsVe42n6zn82/OuORgPSvN06ntXT5xOii.jpg
alt: 布赖顿码头上空的椋鸟群
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside %} 本文概述了 Chrome 中针对 FLoC 的第一个原始试验实现的 API 设计。

目前，旨在无需第三方 cookie 或其他跨网站跟踪机制即可实现基于兴趣的广告投放的 API 未来迭代正在开发中。{% endAside %}

FLoC 为基于兴趣的广告选择提供了一种隐私保护机制。

当用户在网上浏览时，他们的浏览器使用 FLoC 算法来计算其“兴趣群组”，它对于近期浏览历史记录相似的数千个浏览器来说是相同的。浏览器会定期在用户设备上重新计算其群组，而不会与浏览器供应商或其他任何人共享个人浏览数据。

{% Aside %}在 FLoC 初始试验期间，一次页面访问只会因为以下两个原因中的一个而包含在浏览器的 FLoC 计算中：

- 页面上使用了 FLoC API (`document.interestCohort()`)。
- Chrome 检测到页面[加载了广告或与广告相关的资源](https://github.com/WICG/floc/issues/82)。

对于其他聚类算法，试验可能会试用不同的纳入标准：这是原始试验过程的一部分。

在 Chrome 89 到 91 中运行的 FLoC 初始版本的原始试验[现已关闭](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561)。{% endAside %}

广告商（支付广告费用的网站）可以在他们自己的网站上包含代码，以收集群组数据并提供给他们的广告技术平台（提供广告投放软件和工具的公司）。例如，广告技术平台可能会从一家在线鞋店了解到群组 1101 和 1354 中的浏览器似乎对商店的户外装备感兴趣。广告技术平台还从其他广告商那里了解到这些群组的其他兴趣。

随后，当来自这些群组之一的浏览器从显示广告的网站（例如新闻网站）请求页面时，广告平台可以使用该数据来选择相关广告（例如来自鞋店的登山靴广告）。

隐私沙盒是一系列满足第三方用例的提案，无需第三方 cookie 或其他跟踪机制。有关所有提案的概述，请参阅[深入了解隐私沙盒](/digging-into-the-privacy-sandbox)。

**该提案需要您的反馈。**如果您有意见，请在 [FLoC Explainer](https://github.com/WICG/floc/issues/new) 存储库上[创建问题](https://github.com/WICG/floc)。如果您对 Chrome 对此提案的试验有任何反馈，请对[试验意图](https://groups.google.com/a/chromium.org/g/blink-dev/c/MmijXrmwrJs)发表回复。

## 为什么我们需要 FLoC？

许多企业依靠广告来为其网站吸引流量，许多发布商网站通过出售广告库存来资助内容。人们通常更喜欢看到相关和有用的广告，而且相关广告也为广告商带来更多业务，并[为托管它们的网站带来更多收入](https://services.google.com/fh/files/misc/disabling_third-party_cookies_publisher_revenue.pdf)。换句话说，广告空间在展示相关广告时更有价值。因此，选择相关广告会提高广告支持的网站的收入。反过来，这意味着相关广告有助于资助对用户有利的内容创作。

然而，人们担心定制广告对隐私产生影响，目前这些广告依赖于跟踪 cookie 和设备指纹识别等技术，这会将跨网站浏览历史记录透露给广告商或广告平台。FLoC 提案旨在允许以更好地保护隐私的方式进行广告选择。

## FLoC 可用于哪些方面？

- 向其浏览器属于某个被观察到经常访问某广告商网站的群组，或对相关主题表现出兴趣的人展示广告。
- 使用机器学习模型来预测用户将基于其群组进行转化的概率，为广告竞价行为提供参考。
- 向用户推荐内容。例如，假设某个新闻网站观察到他们的体育播客页面在群组 1234 和 7 的访问者中变得特别受欢迎。他们可以向来自这些群组的其他访问者推荐该内容。

## FLoC 的工作原理？

下面的示例描述了使用 FLoC 选择广告时的不同角色。

- 此示例中的**广告商**（支付广告费用的公司）是一家在线鞋类零售商：<br> **<u>shoestore.example</u>**

- 示例中的**发布商**（销售广告空间的网站）是一个新闻网站：<br> **<u>dailynews.example</u>**

- **广告技术平台**（提供广告投放软件和工具）是：<br> **<u>adnetwork.example</u>**

{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/wnJ1fSECf5STngywgE7V.png", alt="该图表分步显示使用 FLoC 选择和投放广告时的不同角色：FLoC 服务、浏览器、广告商、发布商（观察群组）、广告技术、发布商（展示广告）", width="800", height="359" %}

在此示例中，我们将用户称为 **Yoshi** 和 **Alex**。最初，他们的浏览器都属于同一个群组 1354。

{% Aside %} 这里，我们将用户称为 Yoshi 和 Alex，但这仅用于示例目的。FLoC 不会向广告商、发布商或广告技术平台透露姓名和个人身份。

不要将群组视为一群人，而是将其视为一组浏览活动。{% endAside %}

### 1. FLoC 服务

1. 浏览器使用的 FLoC 服务创建了一个包含数千个“群组”的数学模型，每个群组将对应于数千个具有相似的近期浏览历史记录的 Web 浏览器。[下方](#floc-server)给出了此机制的更多相关信息。
2. 每个群组都被指定一个编号。

### 2. 浏览器

1. Yoshi 的浏览器从 FLoC 服务中获取描述 FLoC 模型的数据。
2. Yoshi 的浏览器[使用 FLoC 模型的算法](#floc-algorithm)来计算哪个群组最能对应于自己的浏览历史记录，从而得出所属的群组。在此示例中，将是群组 1354。请注意，Yoshi 的浏览器不与 FLoC 服务共享任何数据。
3. 同样，Alex 的浏览器会计算其群组 ID。Alex 的浏览历史记录与 Yoshi 的不同，但非常相似，以至于他们的浏览器都属于群组 1354。

### 3. 广告商：<span style="font-weight:normal">shoestore.example</span>

1. Yoshi 访问 <u>shoestore.example</u>。
2. 该网站向 Yoshi 的浏览器询问其群组：1354。
3. Yoshi 浏览登山靴。
4. 该网站记录了来自群组 1354 的一个浏览器对登山靴表现出兴趣。
5. 该网站后来记录了群组 1354 以及其他群组对其产品的额外兴趣。
6. 该网站定期汇总有关群组和产品兴趣的信息，并将这些信息与其广告技术平台 <u>adnetwork.example</u> 共享。

现在轮到 Alex 了。

### 4. 发布商：<span style="font-weight:normal">dailynews.example</span>

1. Alex 访问 <u>dailynews.example</u>。
2. 该网站向 Alex 的浏览器询问其群组。
3. 该网站随后向其广告技术平台 <u>adnetwork.example</u> 发出广告请求，其中包括 Alex 的浏览器的群组：1354。

### 5. 广告技术平台：<span style="font-weight:normal">adnetwork.example</span>

1. <u>adnetwork.example</u> 可以将来自发布商 <u>dailynews.example</u> 和广告商 <u>shoestore.example</u> 的数据结合在一起，来选择适合 Alex 的广告：

- Alex 的浏览器的群组 (1354) 由 <u>dailynews.example</u> 提供。
- 有关群组和产品兴趣的信息来自 <u>shoestore.example</u>：“来自群组 1354 的浏览器可能对登山靴感兴趣。”

1. <u>adnetwork.example</u> 选择适合 Alex 的广告：<u>shoestore.example</u> 上的登山靴广告。
2. <u>dailynews.example</u> 显示广告 🥾。

{% Aside %} 当前的广告选择方法依赖于跟踪 cookie 和设备指纹等技术，广告商等第三方使用这些技术来跟踪个人浏览行为。

使用 FLoC，浏览器**不会**将其浏览历史记录与 FLoC 服务或任何其他人共享。用户设备上的浏览器计算出它属于哪个群组。用户的浏览历史记录永远不会离开设备。{% endAside %}

## 谁运行用于创建 FLoC 模型的后端服务？

每个浏览器供应商都需要自行选择如何将浏览器划分到不同的群组。Chrome 运行自己的 FLoC 服务；其他浏览器可能选择使用不同的聚类方法来实现 FLoC，并运行各自的服务来执行此操作。

## FLoC 服务如何使浏览器计算出其群组？{: #floc-server }

1. 浏览器使用的 FLoC 服务会创建一个多维数学模型来表示所有潜在的 Web 浏览历史记录。我们将这个模型称为“群组空间”。
2. 服务将该空间划分为数千个段。每个段代表数千个相似的浏览历史记录。这些分组不基于对任何实际浏览历史记录的了解，只是基于在“群组空间”中选择随机中心或用随机线切割空间。
3. 每个段都被指定一个群组编号。
4. Web 浏览器从其 FLoC 服务中获取描述“群组空间”的数据。
5. 当用户在网上浏览时，其浏览器会[使用一种算法](#floc-algorithm)来定期计算“群组空间”中最能与其浏览历史记录对应的区域。

<figure style="text-align: center">{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/32k5jByqLrgwSMwb9mqo.png", alt="由 FLoC 服务器创建的“浏览历史记录空间”图表，显示多个段，每个段都有一个群组编号。", width="400", height="359" %} <figcaption>FLoC 服务将“群组空间”划分为数千个段（这里只显示几个）。</figcaption></figure>

{% Aside %} 在此过程中，用户的浏览历史记录不会与 FLoC 服务或任何第三方共享。浏览器的群组由浏览器在用户的设备上计算。FLoC 服务不会获取或存储任何用户数据。{% endAside %}

## 浏览器的群组可以更改吗？

*可以*！浏览器的群组一定会发生变化！您可能不会每周访问相同的网站，浏览器的群组会反映这一点。

一个群组代表一组浏览活动，而不是一群人。群组的活动特征通常是始终不变的，并且群组对于广告选择很有用，因为它们将相似的近期浏览行为分组在一起。个人的浏览器会随着他们浏览行为的变化而进入或离开某个群组。最初，我们预计浏览器每 7 天重新计算一次其群组。

在上面的例子中，Yoshi 和 Alex 的浏览器的群组都是 1354。将来，如果 Yoshi 和 Alex 的兴趣发生变化，他们的浏览器可能会移至不同的群组。在下面的示例中，Yoshi 的浏览器移至群组 1101，Alex 的浏览器移至群组 1378。其他人的浏览器会随着浏览兴趣的变化而进入或离开群组。

<figure style="text-align: center">{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/LMkb62V3iJTqkOrFACnM.png", alt="由 FLoC 服务器创建的“浏览历史记录空间”图表，显示多个段，每个段都有一个群组编号。该图表显示，随着时间的推移，属于用户 Yoshi 和 Alex 的浏览器根据他们的浏览兴趣的变化从一个群组移至另一个群组。", width="800", height="533" %} <figcaption>Yoshi 和 Alex 的兴趣发生变化时，他们的浏览器群组可能也会变化。</figcaption></figure>

{% Aside %} 群组定义了一组浏览活动，而不是一群人。浏览器会随着其活动的变化而进入和离开群组。{% endAside %}

## 浏览器如何计算出其群组？{: #floc-algorithm }

如上所述，用户的浏览器从其 FLoC 服务中获取描述群组数学模型的数据：一个多维空间，表示所有用户的浏览活动。浏览器随后使用一种算法来计算出该“群组空间”的哪个区域（即，哪个群组）与它最近的浏览行为最匹配。

## FLoC 如何计算出正确的群组规模？

每个群组将包含数千个浏览器。

较小的群组规模可能对个性化广告更有用，但不太可能停止用户跟踪，反之亦然。将浏览器分配给群组的机制需要在隐私和实用性之间做出权衡。隐私沙盒使用 [k-anonymity](https://en.wikipedia.org/wiki/K-anonymity) 来允许用户“隐藏在人群中”。如果一个群组被至少 k 个用户共享，则该群组为 k-anonymous。k 值越大，群组的隐私保护程度越高。

## FLoC 可以用于根据敏感类别对人群进行分组吗？

用于构造 FLoC 群组模型的聚类算法设计为评估群组是否可能与敏感类别相关，而不会了解类别为何敏感。可能会披露种族、性别或病史等敏感类别的群组将被阻止。换句话说，在计算群组时，浏览器只会在不披露敏感类别的群组之间进行选择。

## FLoC 只是另一种在线对人群分类的方式吗？

使用 FLoC 时，用户的浏览器将与数千个其他用户的浏览器属于数千个群组中的一个。与第三方 cookie 和其他目标机制不同，FLoC 只披露用户浏览器所在的群组，而不是个人用户 ID。其他人无法通过它来区分群组中的个人。此外，用于计算浏览器群组的浏览活动信息保存在浏览器或设备本地，不会上传到其他地方。浏览器可以进一步利用其他匿名化方法，例如[差分隐私](https://en.wikipedia.org/wiki/Differential_privacy)。

## 网站是否必须参与并共享信息？

网站将能够选择加入或退出 FLoC，因此有关敏感主题的网站将能够阻止对网站的访问被包含在 FLoC 计算中。作为额外的保护，FLoC 服务的分析将评估群组是否可能披露有关用户的敏感信息，而不会了解该群组为何敏感。如果一个群组代表的访问敏感类别网站的人数多于典型人数，则整个群组将被删除。负面财务状况和心理健康属于该分析覆盖的敏感类别。

网站可以通过为页面设置 [Permissions-Policy](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/) 标题 `interest-cohort=()` 来[从 FLoC 计算中排除该页面](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/)。对于尚未排除的页面，如果在页面上使用 `document.interestCohort()`，则页面访问将包含在浏览器的 FLoC 计算中。在当前 [FLoC 原始试验](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561)期间，如果 Chrome 检测到页面[加载广告或与广告相关的资源](https://github.com/WICG/floc/issues/82)，也会将该页面包含在计算中。（[Chromium 中的广告标记](https://chromium.googlesource.com/chromium/src/+/master/docs/ad_tagging.md)解释了 Chrome 的广告检测机制的工作原理。）

私有 IP 地址提供的页面（例如 Intranet 页面）不会成为 FLoC 计算的一部分。

## FLoC JavaScript API 如何工作？

{% Aside %} 在 Chrome 89 到 91 中运行的 FLoC 初始版本的原始试验[现已关闭](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561)。{% endAside %}

FLoC API 非常简单：只是一个返回 promise 的方法，该 promise 解析为提供群组 `id` 和 `version` 的对象：

```javascript
const { id, version } = await document.interestCohort();
console.log('FLoC ID:', id);
console.log('FLoC version:', version);
```

提供的群组数据如下所示：

```js
{
  id: "14159",
  version: "chrome.2.1"
}
```

`version` 值让使用 FLoC 的网站可以知道群组 ID 引用的浏览器和 FLoC 模型。如下文所述， `document.interestCohort()` 返回的 promise 将拒绝未被授予 `interest-cohort` 权限的所有框架。

## 网站可以选择不包含在 FLoC 计算中吗？

网站可以通过 `interest-cohort` 权限策略来声明它不希望包含在用于群组计算的用户网站列表中。默认情况下，该策略为 `allow`。`document.interestCohort()` 返回的 promise 将拒绝未被授予 `interest-cohort` 权限的所有框架。如果主框架没有 `interest-cohort` 权限，那么页面访问不会包含在兴趣群组计算中。

例如，网站可以通过发送以下 HTTP 响应标头来选择退出所有 FLoC 群组计算：

```text
  Permissions-Policy: interest-cohort=()
```

## 用户能否让网站停止获取其浏览器的 FLoC 群组？

如果用户在 `chrome://settings/privacySandbox` 中禁用隐私沙盒，浏览器在被通过 JavaScript 询问时将不会提供用户的群组：`document.interestCohort()` 返回的 promise 将拒绝。

## 如何提出建议或提供反馈？

如果您对 API 有意见，请在 [FLoC Explainer](https://github.com/WICG/floc/issues/new) 存储库[上创建问题](https://github.com/WICG/floc)。

## 了解更多

- [深入了解隐私沙盒](/digging-into-the-privacy-sandbox/)
- [FLoC Explainer](https://github.com/WICG/floc)
- [FLoC 原始试验和聚类](https://sites.google.com/a/chromium.org/dev/Home/chromium-privacy/privacy-sandbox/floc)
- [FLoC API 的群组算法评估](https://github.com/google/ads-privacy/blob/master/proposals/FLoC/README.md)

---

照片由 [Unsplash](https://unsplash.com/photos/I5AYxsxSuVA) 上的 [Rhys Kentish](https://unsplash.com/@rhyskentish) 提供。
