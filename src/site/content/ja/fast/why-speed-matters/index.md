---
layout: post
title: スピードが重要な理由とは？
authors:
  - bojanpavic
  - ansteychris
  - jlwagner
description: ユーザーエクスペリエンスには、スピードが重要です。また、モバイルデバイスの遅さが原因で起こる遅延は、イライラするだけでなく、ビジネスにも悪影響となります。
web_lighthouse: 該当なし
date: 2019-05-01
updated: 2020-07-23
tags:
  - performance
---

消費者は、ますますモバイルに依存し、デジタルコンテンツやサービスにアクセスするようになっています。サイト分析を見れば、自分のデータもその傾向を物語っているかもしれません。消費者の要求は、これまで以上に厳しく、サイトの使用経験を評価する際は、競合他社と比較するだけでなく、日々使用するベスト・イン・クラスのサービスに対しても評価しているのです。

この記事では、パフォーマンスとビジネスの成功の関係について行われた調査を一部まとめて紹介していきます。

## パフォーマンスとは、ユーザーを手放さないこと

<figure data-float="right">
  <blockquote>
    <p>パフォーマンスは会社の収益に直接影響を及ぼしました。</p>
    <cite>
      <p data-md-type="paragraph"><a href="https://www.youtube.com/watch?v=Xryhxi45Q5M&amp;feature=youtu.be&amp;t=1366">Pinterest</a></p>
    </cite>
  </blockquote></figure>

パフォーマンスは、オンラインベンチャー企業が成功を目指すに際し、大きな役割を果たします。パフォーマンスの高いサイトは、パフォーマンスの低いサイトよりも、ユーザーを惹きつけ、保持することに長けています。

Pinterestは、知覚される待ち時間を40％削減し、[検索エンジンのトラフィックと登録数を15％増加させました](https://medium.com/@Pinterest_Engineering/driving-user-growth-with-performance-improvements-cfc50dafadd7)。

COOKは、ページ読み込みの平均時間を850ミリ秒短縮し、[コンバージョンを7％増加させ、バウンス率を7％減少させ、セッションあたりのページ数を10％増加させました](https://www.nccgroup.trust/globalassets/resources/uk/case-studies/web-performance/cook-case-study.pdf)。

また、いくつかの調査では、パフォーマンスの悪さがビジネス目標に悪影響を与える可能性が示唆されています。たとえば、[BBC](https://www.creativebloq.com/features/how-the-bbc-builds-websites-that-scale)は、サイトの読み込みにかかる時間が1秒増えるだけで、サイトを去るユーザーの数が10％増加していることを発見しました。

## パフォーマンスとは、コンバージョンを改善すること

ユーザーを保持することは、コンバージョンを改善する上で重要です。遅いサイトでは収益が打撃を受け、速いサイトではコンバージョン率が増加することが分かっています。

[Mobify](http://resources.mobify.com/2016-Q2-mobile-insights-benchmark-report.html)の場合、ホームページの読み込み速度が100ミリ秒短縮されるごとに、セッションベースのコンバージョンが1.11％増加し、年間の平均収益は38万ドル近くも増加しました。さらに、チェックアウトページの読み込み速度が100ミリ秒短縮されると、セッションベースのコンバージョンが1.55％増加し、その結果、年間の平均収益は53万ドル近くも増加しました。

[AutoAnything](https://www.digitalcommerce360.com/2010/08/19/web-accelerator-revs-conversion-and-sales-autoanything/)がページの読み込み時間を半減させたとき、売り上げは12％から13％に上昇しました。

小売業者の[Furniture Village](https://www.thinkwithgoogle.com/intl/en-gb/success-stories/uk-success-stories/furniture-village-and-greenlight-slash-page-load-times-boosting-user-experience/)は、サイトの速度について監査を実施し、発見した問題に対処するための計画を立てました。これにより、ページの読み込み時間が20％短縮され、コンバージョン率が10％増加しました。

## パフォーマンスで肝心なのは、ユーザーエクスペリエンス

ユーザーエクスペリエンスで肝心なのは、スピードです。ある[消費者調査](https://www.ericsson.com/en/press-releases/2016/2/streaming-delays-mentally-taxing-for-smartphone-users-ericsson-mobility-report)では、モバイルデバイスの遅さが引き起こす遅延に対するストレス反応が、ホラー映画を見たり、数学の問題を解いたりする場合と似たようなレベルであり、店で支払いをする際に列に並んで待つときよりも高いことが分かっています。

サイトの読み込みが始まると、ユーザーは、コンテンツが表示されるのを待つことになります。コンテンツが表示されるまでは、これと言って何のユーザーエクスペリエンスもありません。エクスペリエンスの無いこの時間は、高速接続の場合はほんの一瞬だけですが、接続速度が遅いと、ユーザーは待機することを余儀なくされます。ページのリソースが少しずつ読み込まれるにつれ、さらなる問題が発生する可能性があります。

<figure>{% Img src="image/admin/W0ctiX3cMOfWnNF6AQMg.png", alt="ページの読み込みを示した2つのフィルムストリップのリールの比較。1つ目は低速接続でのページ読み込みを示し、2つ目は高速接続でのページ読み込みを示している。", width="800", height="264" %}<figcaption>非常に遅い接続（上）と速い接続（下）でのページ読み込みの比較。</figcaption></figure>

パフォーマンスは、優れたユーザーエクスペリエンスの基本的な要素です。サイトに大量のコードがデプロイされていると、ブラウザはコードをダウンロードするためにユーザーのデータプランからメガバイトに相当するデータ量を使用しなくてはいけなくなります。モバイルデバイスのCPUパワーとメモリは限られています。私たちにとっては少量の最適化されていないコードでも、これらのデバイスを圧倒してしまうことがしばしばあります。これによりパフォーマンスが低下し、サイトは応答しなくなります。人間の一般的な行動を考えると、パフォーマンスの悪いアプリはすぐに破棄されてしまうでしょう。

## パフォーマンスとは、ユーザーを考慮すること

パフォーマンスの悪いサイトやアプリケーションは、ユーザーがより高いコストを支払う原因となる可能性があります。

[モバイルユーザーは引き続き世界中のインターネットユーザーの大部分を占めている](http://gs.statcounter.com/platform-market-share/desktop-mobile-tablet)こともあり、こうしたユーザーの多くがモバイルLTE、4G、3G、さらには2Gネットワークを使ってウェブにアクセスしていることを覚えておくことは重要です。CalibreのBenSchwarz氏が[この実社会におけるパフォーマンス調査](https://calibreapp.com/blog/beyond-the-bubble)で指摘するように、プリペイドデータプランのコストは減少しており、かつてはインターネットへのアクセスが高くついていた場所からでも、安価にアクセスできるようになっています。モバイルデバイスとインターネットアクセスはもはや贅沢ではありません。これらは、ますます複雑につながり合う世界で生活し、機能していくための一般的なツールと化しています。

[ページの合計サイズは少なくとも2011年以降着実に増加](http://beta.httparchive.org/reports/state-of-the-web#bytesTotal)しており、その傾向はどうやら続いているようです。通常のページがより多くのデータを送信するため、ユーザーは課金制のデータプランをより頻繁に補充する必要があり、それには、もちろん、コストがかかります。

ユーザーのお金を節約することに加え、高速で軽量なユーザーエクスペリエンスは、危機に直面しているユーザーにとっても重要であることがわかります。病院、診療所、危機管理センターなどの公共リソースには、危機の際に必要な重要かつ具体的な情報をユーザーに提供するオンラインリソースがあります。[ストレスの多い状況で重要な情報を効率的に提示するには設計が極めて重要](https://aneventapart.com/news/post/eric-meyer-designing-for-crisis)ですが、この情報を迅速に提供することの重要性は軽視できません。それは私たちの仕事の一部です。

## ウェブサイトのスピード改善に着手する {: #get-started}

Googleがすべてのウェブサイトで重視すべきだと信じる評価基準を[Core Web Vitals](/vitals/#core-web-vitals)に記載していますので、ぜひ一読してください。

<blockquote>
  <p>本日、この作業に基づいて、これらのページエクスペリエンス指標を組み込んだ今後の検索ランキングの変更を早期に確認します。Core Web Vitalsと既存のページエクスペリエンスのシグナルを組み合わせた新しいシグナルを導入し、ウェブページでのユーザーエクスペリエンスの品質に関する全体像を提供します。</p>
  <cite><a href="https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html">Evaluating page experience for a better web (より快適なウェブを目指したページ体験の評価)</a>、公式Googleウェブマスターセントラルブログ</cite>
</blockquote>

次は、スピードをアップさせて維持するためのヒントやコツを数多く紹介した[Fast load times](/fast/)をお読みください。
