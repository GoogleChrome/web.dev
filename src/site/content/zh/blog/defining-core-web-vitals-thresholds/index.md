---
layout: post
title: 定义核心 Web 指标阈值
subhead: 核心 Web 指标阈值背后的研究和方法论
authors:
  - bmcquade
description: 核心 Web 指标阈值背后的研究和方法论
date: 2020-05-21
updated: 2022-07-18
hero: image/admin/WNrgCVjmp8Gyc8EbZ9Jv.png
alt: 核心 Web 指标阈值背后的研究和方法论
tags:
  - blog
  - performance
  - web-vitals
---

[核心 Web 指标](/vitals/#core-web-vitals)是一组实际指标，用于测量网络真实用户体验的重要方面。核心 Web 指标包括多项指标以及各项指标的目标阈值，可帮助开发者定性地了解他们的网站体验是"良好"、"需要改进"还是"欠佳"。这篇文章将解释核心 Web 指标阈值的一般选取方法，以及针对每个特定核心 Web 指标阈值的选取方法。

## 复习：核心 Web 指标和阈值

2020 年的核心 Web 指标为三大指标：Largest Contentful Paint 最大内容绘制 (LCP)、First Input Delay 首次输入延迟 (FID) 和 Cumulative Layout Shift 累积布局偏移 (CLS)。每项指标测量用户体验的不同方面：LCP 测量感知加载速度，并在页面的主要内容基本加载完成时，在页面加载时间轴中标记出相应的点；FID 测量响应度，并将用户首次尝试与页面交互的体验进行了量化；CLS 测量视觉稳定性，并对可见页面内容的意外布局偏移量进行了量化。

每项核心 Web 指标都有一个相关联的阈值，这些阈值将性能分为"良好"、"需要改进"或"欠佳"：

<style>
  .cluster > img {
    max-width: 30%;
  }
</style>
<div class="cluster">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="最大内容绘制阈值建议", width="400", height="350" %}
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="首次输入延迟阈值建议", width="400", height="350" %}
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="累积布局偏移阈值建议", width="400", height="350" %}
</div>

<div>
  <table>
    <tr>
      <th> </th>
      <th>良好</th>
      <th>欠佳</th>
      <th>百分位数</th>
    </tr>
    <tr>
      <td>最大内容绘制</td>
      <td>≤2500ms</td>
      <td>&gt;4000ms</td>
      <td>75</td>
    </tr>
    <tr>
      <td>首次输入延迟</td>
      <td>≤100ms</td>
      <td>&gt;300ms</td>
      <td>75</td>
    </tr>
    <tr>
      <td>累积布局偏移</td>
      <td>≤0.1</td>
      <td>&gt;0.25</td>
      <td>75</td>
    </tr>
</table>
</div>
<p data-md-type="paragraph">此外，为了对页面或网站的整体性能进行分类，我们取该页面或网站的所有页面浏览量的第 75 个百分位数。换句话说，如果一个网站有至少 75% 的页面浏览量达到"良好"阈值，则该网站在这项指标下就会被归类为性能"良好"。相反，如果有至少 25% 的页面浏览量达到"欠佳"阈值，则该网站会被归类为性能"欠佳"。因此，如果 LCP 的第 75 个百分位数为 2 秒，就会被归类为"良好"，而如果 LCP 的第 75 个百分位数为 5 秒，则会被归类为"欠佳"。</p>
<h2 data-md-type="header" data-md-header-level="2">核心 Web 指标阈值的标准</h2>
<p data-md-type="paragraph">在为核心 Web 指标建立阈值时，我们首先确定了每个阈值必须满足的标准。我在下方解释了我们在 Google 用于评估 2020 年核心 Web 指标阈值的标准。随后的部分将更详细地介绍我们是如何应用这些标准来为 2020 年的各项指标选取阈值的。在未来几年，我们预计会对标准和阈值进行改进和添加，从而进一步提高我们测量卓越的网络用户体验的能力。</p>
<h3 data-md-type="header" data-md-header-level="3">高质量的用户体验</h3>
<p data-md-type="paragraph">我们的主要目标是针对用户及他们的体验质量进行优化。鉴于此目标，我们要力图确保满足核心 Web 指标"良好"阈值的页面能够提供高质量的用户体验。</p>
<p data-md-type="paragraph">为了确定与高质量用户体验相关联的阈值，我们将目光投向人类感知和 HCI 研究。虽然这项研究有时会使用单个固定阈值来进行概括，但我们发现底层研究中通常会用范围值来表示。例如，研究会描述用户在失去注意力之前的等待时间通常为 1 秒，而底层研究实际会用一个从数百毫秒到数秒不等的范围来表示。聚合和匿名 Chrome 指标数据进一步支持了感知阈值会因用户和上下文而异的事实，这表明用户在中止页面加载前等待网页显示内容的时间不是唯一的。恰恰相反，该数据显示出了平滑且连续的分布。如需更深入地了解人类感知阈值和相关的 HCI 研究，请参阅 <a href="https://blog.chromium.org/2020/05/the-science-behind-web-vitals.html" data-md-type="link">Web 指标背后的科学</a>。</p>
<p data-md-type="paragraph">如果针对某一指标有相关的用户体验研究，并且对文献中的数值范围有合理共识，那么我们会用这个范围作为输入来指导我们的阈值选取过程。在没有相关的用户体验研究的情况下，例如对于像累积布局偏移这样的新指标，我们会转而对满足不同指标候选阈值的真实世界页面进行评估，从而确定一个能带来良好用户体验的阈值。</p>
<h3 data-md-type="header" data-md-header-level="3">可通过现有网络内容实现</h3>
<p data-md-type="paragraph">此外，为了确保网站所有者能够成功地优化他们的网站并满足"良好"阈值，我们要求这些阈值对于网络上现有的内容是可以实现的。例如，虽然零毫秒是理想的 LCP "良好"阈值，并且可以带来即时加载体验，但由于网络和设备处理延迟，零毫秒的阈值实际上在大多数情况下都无法实现。因此，对于核心 Web 指标来说，零毫秒不是一个合理的 LCP "良好"阈值。</p>
<p data-md-type="paragraph">在评估核心 Web 指标的候选"良好"阈值时，我们会根据 <a href="https://developer.chrome.com/docs/crux/" data-md-type="link">Chrome 用户体验报告</a> (CrUX) 中的数据验证这些阈值是否可以实现。为了确认一个阈值是可以实现的，我们要求目前至少有 10% 的<a href="/same-site-same-origin/#origin" data-md-type="link">域</a>满足"良好"阈值。此外，为了确保优化良好的网站不会因为实际数据的变化而被错误分类，我们还会验证优化良好的内容始终满足"良好"阈值。</p>
<p data-md-type="paragraph">相反地，我们通过确定当前只有少数域未能达到的性能水平来建立"欠佳"阈值。除非有"欠佳"阈值定义的相关研究，否则在默认情况下，性能表现最差的 10-30% 的域将被归类为"欠佳"。</p>
<h3 data-md-type="header" data-md-header-level="3">关于标准的最终总结</h3>
<p data-md-type="paragraph">在评估候选阈值时，我们发现这些标准有时会相互冲突。例如，一个阈值始终可实现和该阈值始终确保良好的用户体验之间可能存在矛盾。此外，鉴于人类感知研究通常提供一个范围值，而用户行为指标又显示了行为的逐渐变化，我们发现通常没有唯一"正确"的指标阈值。因此，我们针对 2020 年核心 Web 指标的方案就是选择最符合上述标准的阈值，同时认识到没有一个完美的阈值，并且我们有时可能需要从多个合理的候选阈值中进行选择。我们不会想弄清"完美的阈值是多少？"相反地，我们专注于认清"哪一个候选阈值最符合我们的标准？"</p>
<h2 data-md-type="header" data-md-header-level="2">百分位数的选择</h2>
<p data-md-type="paragraph">如前所述，为了对页面或网站的整体性能进行分类，我们使用该页面或网站的所有访问量的第 75 个百分位数。我们选择第 75 个百分位数是基于两个标准。首先，该百分位数应确保对页面或网站的大多数访问都达到了目标性能水平。其次，所选百分位数的值不应受到异常值的过度影响。</p>
<p data-md-type="paragraph">这些目标在某种程度上是相互矛盾的。为了满足第一个目标，通常最好选择一个更高的百分位数。但是，随着百分位数的增加，结果值受异常值影响的可能性也会增加。如果对网站的几次访问碰巧遇上了不稳定的网络连接，导致 LCP 样本过大，我们并不希望我们的网站分类被这些异常值样本而左右。例如，如果我们使用一个高百分位数（例如第 95 个百分位数）对一个有 100 次访问量的网站进行性能评估，那么只要有 5 个异常值样本，第 95 个百分位数的值就会受到异常值的影响。</p>
<p data-md-type="paragraph">鉴于这些目标有些不一致，经过分析，我们得出的结论是第 75 个百分位数达到了合理的平衡点。通过采用第 75 个百分位数，我们知道大多数网站访问（4 次中有 3 次）都达到了目标性能水平或更高。此外，第 75 个百分位数值受异常值影响的可能性较小。再回到我们之前的示例，对于一个有 100 次访问量的网站，其中的 25 次访问都需要报告大量异常值样本，才会使第 75 个百分位数值受到异常值的影响。虽然 100 个样本中有 25 个是异常值的情况可能存在，但与第 95 个百分位数的情况相比，这种可能性要小得多。</p>
<h2 data-md-type="header" data-md-header-level="2">最大内容绘制</h2>
<h3 data-md-type="header" data-md-header-level="3">体验质量</h3>
<p data-md-type="paragraph">我们通常认为用户在开始对一项任务失去注意力之前的等待时间为 1 秒。在仔细查验相关研究后，我们发现 1 秒是用来描述一个范围值的近似值，而这个范围值从数百毫秒到数秒不等。</p>
<p data-md-type="paragraph">1 秒阈值的两个常见引用来源是<a href="https://dl.acm.org/doi/10.1145/108844.108874" data-md-type="link">卡德等人</a>和<a href="https://dl.acm.org/doi/10.1145/1476589.1476628" data-md-type="link">米勒</a>。卡德通过引用纽厄尔的<a href="https://dl.acm.org/doi/book/10.5555/86564" data-md-type="link">认知统一理论</a>，定义了 1 秒的"立即响应"阈值。纽厄尔将立即响应解释为"必须在<em data-md-type="emphasis">大约一秒钟</em>内对某些刺激作出的响应（即大约从 0.3 秒到 3 秒）。"纽厄尔在此之前就"认知的实时约束"展开过讨论，其中指出"与环境交互引发的认知计算是以秒计的"，范围从大约 0.5 秒到 2-3 秒。1 秒阈值的另一个常见引用来源是米勒，他指出"如果响应延迟超过两秒（可能超出时长为一秒左右），那么人类可以通过且将会通过机器通信执行的任务将发生严重的特征改变。"</p>
<p data-md-type="paragraph">米勒和卡德的研究将用户在失去注意力之前的等待时间描述为一个从大约 0.3 秒到 3 秒的范围，也就表明我们的 LCP "良好"阈值应该在这个范围内。此外，考虑到目前的首次内容绘制"良好"阈值为 1 秒，并且最大内容绘制通常发生在首次内容绘制之后，我们可以进一步将 LCP 候选阈值的范围限制在 1 秒到 3 秒之间。为了在这个范围内选取最符合我们标准的阈值，我们研究了这些候选阈值的可实现性，如下所示。</p>
<h3 data-md-type="header" data-md-header-level="3">可实现性</h3>
<p data-md-type="paragraph">利用 CrUX 的数据，我们可以确定网络上满足 LCP 候选"良好"阈值的域所占的百分比。</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">被归类为"良好"（LCP 候选阈值）的 CrUX 域所占的百分比</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>1秒</th>
      <th>1.5 秒</th>
      <th>2 秒</th>
      <th>2.5 秒</th>
      <th>3 秒</th>
    </tr>
    <tr>
      <td><strong>手机端</strong></td>
      <td>3.5%</td>
      <td>13%</td>
      <td>27%</td>
      <td>42%</td>
      <td>55%</td>
    </tr>
    <tr>
      <td><strong>桌面端</strong></td>
      <td>6.9%</td>
      <td>19%</td>
      <td>36%</td>
      <td>51%</td>
      <td>64%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">虽然只有不到 10% 的域满足 1 秒阈值，但 1.5 秒到 3 秒之间的其他所有阈值也都满足我们的要求，即至少有 10% 的域满足"良好"阈值，因此这些阈值仍然是有效的候选值。</p>
<p data-md-type="paragraph">此外，为了确保所选取的阈值对于优化良好的网站始终都可实现，我们分析了全网表现最出色的网站的 LCP 性能，从而确定哪些阈值对于这些网站是始终都可实现的。具体来说，我们的目标是确定一个对于表现最出色的网站来说，始终可以在第 75 个百分位数实现的阈值。我们发现，1.5 秒和 2 秒的阈值并不是始终都可以实现的，而 2.5 秒的阈值是始终可以实现的。</p>
<p data-md-type="paragraph">为了确定 LCP 的"欠佳"阈值，我们利用 CrUX 数据来确定大多数域能够满足的阈值：</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">被归类为"欠佳"（LCP 候选阈值）的 CrUX 域所占的百分比</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>3 秒</th>
      <th>3.5 秒</th>
      <th>4 秒</th>
      <th>4.5 秒</th>
      <th>5秒</th>
    </tr>
    <tr>
      <td><strong>手机端</strong></td>
      <td>45%</td>
      <td>35%</td>
      <td>26%</td>
      <td>20%</td>
      <td>15%</td>
    </tr>
    <tr>
      <td><strong>桌面端</strong></td>
      <td>36%</td>
      <td>26%</td>
      <td>19%</td>
      <td>14%</td>
      <td>10%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">在阈值为 4 秒的情况下，大约 26% 的手机端域和 21% 的桌面端域将被归类为欠佳。这些百分比落在我们 10-30% 的目标范围内，因此，我们认为 4 秒是可接受的"欠佳"阈值。</p>
<p data-md-type="paragraph">因此，我们得出结论，对于最大内容绘制来说，2.5 秒是一个合理的"良好"阈值，4 秒是一个合理的"欠佳"阈值。</p>
<h2 data-md-type="header" data-md-header-level="2">首次输入延迟</h2>
<h3 data-md-type="header" data-md-header-level="3">体验质量</h3>
<p data-md-type="paragraph">研究得出的十分一致的结论是，我们的感知会认为长达 100 毫秒左右的视觉反馈延迟是由相关来源（例如用户输入）引起的。这表明 100 毫秒可能适合作为首次输入延迟"良好"阈值的最低标准：如果处理输入的延迟超过 100 毫秒，那么其他处理和渲染步骤就没有机会及时完成。</p>
<p data-md-type="paragraph">雅各布·尼尔森 (Jakob Nielsen) 撰写的<a href="https://www.nngroup.com/articles/response-times-3-important-limits/" data-md-type="link">响应时间：3 个重要界限</a>常常被引用，文章中将 0.1 秒定义为用户感觉到系统立即做出反应的界限。尼尔森引用了米勒和卡德，而后者引用了米肖特于 1962 年所著的<a href="https://psycnet.apa.org/record/1964-05029-000" data-md-type="link">《因果关系感知》</a> 。在米肖特的研究中，实验参与者看到"屏幕上有两个物体。物体 A 向物体 B 移动，然后在与 B 接触的那一刻停止，之后 B 开始远离 A。" 米肖特会改变物体 A 停止与物体 B 开始移动之间的时间间隔。米肖特发现，对于约 100 毫秒以内的延迟，参与者会认为是物体 A 导致了物体 B 的运动。对于约 100 毫秒到 200 毫秒的延迟，因果关系的感知是混合的，而对于超过 200 毫秒的延迟，物体 B 的运动不再被视为是由物体 A 引起的。</p>
<p data-md-type="paragraph">类似地，米勒将"对控制激活的响应"的响应阈值定义为"通常由按键、开关或其他控制部件的移动给出的操作指示，表明对象已经被物理激活。这种响应应该被......感知为操作者引起的机械动作的一部分。时间延迟：不超过0.1秒"，以及接下来的"按下按键和视觉反馈之间的延迟应不超过 0.1 秒至 0.2 秒"。</p>
<p data-md-type="paragraph">最近，在<a href="https://dl.acm.org/doi/10.1145/2611387" data-md-type="link">实现时间性的完美虚拟按钮</a>一文中，卡雷索亚 (Kaaresoja) 等人研究了在不同的延迟下，触摸触屏上的虚拟按钮和随后显示按钮被触摸的视觉反馈之间的同时性感知。当按下按钮和视觉反馈之间的延迟为 85 毫秒或更短时，参与者在 75% 的情况下报告视觉反馈是在按下按钮的同时出现的。此外，对于 100 毫秒或更短的延迟，参与者报告的按下按钮的感知质量始终很高，而感知质量在 100 毫秒到 150 毫秒的延迟下有所下降，并且在 300 毫秒的延迟下达到非常低的水平。</p>
<p data-md-type="paragraph">鉴于上述研究，我们得出结论，100 毫秒左右的延迟值范围是 Web 指标合适的首次输入延迟阈值。此外，鉴于用户在 300 毫秒或更长的延迟下报告了低质量级别，则 300 毫秒为合理的"欠佳"阈值。</p>
<h3 data-md-type="header" data-md-header-level="3">可实现性</h3>
<p data-md-type="paragraph">利用 CrUX 的数据，我们确定网络上的大多数域在第 75 个百分位数满足 FID 的 100 毫秒"良好"阈值：</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">满足 FID 100 毫秒阈值并被归类为"良好"的 CrUX 域所占的百分比</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th></th>
      <th>100ms</th>
    </tr>
    <tr>
      <td><strong>手机端</strong></td>
      <td>78%</td>
    </tr>
    <tr>
      <td><strong>桌面端</strong></td>
      <td>&gt;99%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">此外，我们观察到全网最出色的网站始终能够在第 75 个百分位数上（并且通常在第 95 个百分位数上）满足此阈值。</p>
<p data-md-type="paragraph">鉴于上述情况，我们得出结论，100 毫秒是合理的 FID "良好"阈值。</p>
<h2 data-md-type="header" data-md-header-level="2">累积布局偏移</h2>
<h3 data-md-type="header" data-md-header-level="3">体验质量</h3>
<p data-md-type="paragraph">累积布局偏移 (CLS) 是一项新指标，用于测量页面可见内容的偏移量。鉴于 CLS 是一项全新指标，我们不知道能够直接为该指标的阈值提供参考的研究。因此，为了确定一个符合用户期望的阈值，我们对具有不同布局偏移量的真实世界页面进行了评估，进而确定在对享受页面内容造成严重干扰之前，用户可接受的最大偏移量。在我们的内部测试中，我们发现 0.15 及以上的偏移水平始终被认为具有干扰性，而 0.1 及以下的偏移水平虽然可以被注意到，但不具有过度干扰性。因此，虽然零布局偏移是理想情况，但我们得出的结论是，0.1 及以下的值是 CLS 的候选"良好" 阈值。</p>
<h3 data-md-type="header" data-md-header-level="3">可实现性</h3>
<p data-md-type="paragraph">根据 CrUX 数据，我们可以看到近 50% 的域的 CLS 为 0.05 或更低。</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">被归类为"良好"（CLS 候选阈值）的 CrUX 域所占的百分比</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>0.05</th>
      <th>0.1</th>
      <th>0.15</th>
    </tr>
    <tr>
      <td><strong>手机端</strong></td>
      <td>49%</td>
      <td>60%</td>
      <td>69%</td>
    </tr>
    <tr>
      <td><strong>桌面端</strong></td>
      <td>42%</td>
      <td>59%</td>
      <td>69%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">虽然 CrUX 数据表明 0.05 可能是一个合理的 CLS "良好"阈值，但我们认识到，目前在某些用例中还难以避免干扰性的布局偏移。例如，对于如社交媒体嵌入这样的第三方嵌入内容，嵌入内容的高度有时在完成加载之前是未知的，这就可能导致布局偏移大于 0.05。因此，我们的结论是，虽然许多域都满足 0.05 的阈值，但将 CLS 阈值定为略微宽松一点的 0.1 能够在体验质量和可实现性之间取得更好的平衡。我们希望网络生态系统在未来能够确定一个针对由第三方嵌入引起的布局偏移的解决方案，这将使我们能够在核心 Web 指标的未来迭代中采用 0.05 或 0 这两个更为严格的 CLS "良好"阈值。</p>
<p data-md-type="paragraph">此外，为了决定 CLS 的"欠佳"阈值，我们利用 CrUX 数据来确定大多数域能够满足的阈值：</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">被归类为"欠佳"（CLS 候选阈值）的 CrUX 域所占的百分比</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>0.15</th>
      <th>0.2</th>
      <th>0.25</th>
      <th>0.3</th>
    </tr>
    <tr>
      <td><strong>手机端</strong></td>
      <td>31%</td>
      <td>25%</td>
      <td>20%</td>
      <td>18%</td>
    </tr>
    <tr>
      <td><strong>桌面端</strong></td>
      <td>31%</td>
      <td>23%</td>
      <td>18%</td>
      <td>16%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">在阈值为 0.25 的情况下，大约 20% 的手机端域和 18% 的桌面端域将被归类为欠佳。这些百分比落在我们 10-30% 的目标范围内，因此我们得出结论，0.25 是可接受的"欠佳"阈值。</p>
