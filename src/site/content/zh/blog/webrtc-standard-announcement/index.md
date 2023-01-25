---
title: WebRTC 加入了 W3C 和 IETF 标准
subhead: 关于 WebRTC 的历史、架构、用例和未来的简要概述。
description: 关于 WebRTC 的历史、架构、用例和未来的简要概述。
date: 2021-01-26
updated: 2021-01-26
authors:
  - huib
tags:
  - blog
  - media
---

制定 Web 标准是一个漫长的过程，来保证跨浏览器的实用性、一致性和兼容性。今天，[W3C 和 IETF](https://www.w3.org/2021/01/pressrelease-webrtc-rec.html.en)标志着疫情期间可能最重要的标准之一 WebRTC 的完成。

{% Aside %}查看[与 WebRTC 实时通信](https://codelabs.developers.google.com/codelabs/webrtc-web) codelab，了解实现 WebRTC 的实践演练。 {% endAside %}

## 历史 {: #history }

WebRTC 是一个为浏览器、移动应用和桌面应用提供实时通信功能的平台，通常用于视频通话。该平台由一整套技术和标准组成。谷歌在 2009 年提出了创建 WebRTC 的概念，作为 Adobe Flash 以及无法在浏览器中运行的桌面应用程序的替代方案。上一代基于浏览器的产品是建立在专利授权的技术之上。有许多产品都是用了该技术，包括 Hangouts。谷歌随后收购了大量提供这些技术授权的公司，并将其作为开源 WebRTC 项目提供给公众。该代码库集成在 Chrome 中，并被大多数使用 WebRTC 的应用程序使用。与其他浏览器供应商和行业领导者（如 Mozilla、Microsoft、Cisco 和 Ericsson）一起，W3C 和 IETF 都开始了 WebRTC 的标准化。2013 年，Mozilla 和 Google [展示](https://blog.chromium.org/2013/02/hello-firefox-this-is-chrome-calling.html)了它们的浏览器之间的视频通话。通过标准的演变，许多架构讨论导致了跨浏览器的实现差异，并对兼容性和互操作性提出了挑战。随着标准在过去几年定稿，大多数分歧最终得到解决。WebRTC 规范现在通过[一整套平台测试](https://wpt.fyi/results/webrtc?label=experimental&label=master&aligned)和工具来解决兼容性问题，而各大浏览器也相应地调整了它们的实现。这结束了一个充满挑战的时期，Web 开发人员再也不用为不同的浏览器实现和规范更改来适应他们的服务了。

## 架构和功能 {: #architecture }

[`RTCPeerConnection` API](https://developer.mozilla.org/docs/Web/API/RTCPeerConnection) 是 WebRTC 规范的核心部分。 `RTCPeerConnection` 会处理不同端点上的两个应用程序的连接，以使用对等协议进行通信。`PeerConnection` API 与用于访问摄像头和麦克风的[`getUserMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia)，还有用于捕获屏幕内容的[`getDisplayMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getDisplayMedia)紧密交互。WebRTC 可以让您通过`DataChannel`发送和接收包含音视频内容以及任意二进制数据的流。用于处理、编码和解码音视频的媒体功能是任何 WebRTC 实现的核心。WebRTC 支持各种音频编解码器，其中最常用和最通用的是 Opus。WebRTC 实现需要支持 Google 的免费 VP8 视频编解码器和 H.264 来处理视频。WebRTC 连接始终是加密的，这是通过两个现有协议 DTLS 和 SRTP 来实现的。WebRTC 严重依赖现有标准和技术，从视频编解码器 (VP8, H264)、网络遍历 (ICE)、传输( RTP, SCTP) 到媒体描述协议 (SDP)。这与 50 多个 RFC 紧密相连。

## 用例：时间是关键 {: #use-cases }

WebRTC 被广泛用于对时间要求严格的应用程序，例如远程手术、系统监控和自动驾驶汽车的远程控制，以及基于 UDP 的语音或视频通话。这些应用几乎无法进行缓冲。Google、Facebook、Cisco、RingCentral 和 Jitsi 等公司出品的几乎所有基于浏览器的视频通话服务都使用了 WebRTC。Google Stadia 和 NVIDIA GeForce NOW 使用 WebRTC 将游戏流从云端传输到 Web 浏览器，用户几乎感觉不到延迟。

## 疫情期间视频通话性能成为了重点 {: #performance }

在过去的一年里，由于浏览器内视频通话数量的增加，WebRTC 在 Chrome 中的使用量增加了 100 倍。在意识到到视频通话已成为疫情期间许多人生活的基本组成部分后，浏览器供应商已开始优化视频通话所依赖的技术。这一点尤为重要，因为当员工和学生开始在家工作和学习时，要求大型会议以及视频会议中的视频效果的资源变得更加普遍。在过去的一年里，Chrome 对于视频通话的电池友好度提高了 30%，并且针对大量使用场景进行了更多优化。 Mozilla、Apple 和 Microsoft 都在疫情期间对 WebRTC 的实施[做出了重大改进](https://www.youtube.com/watch?v=YZROn-WsyO4)，特别是在确保它们遵守现在的正式标准方面。

## WebRTC 的未来 {: # future }

虽然 WebRTC 现在成为了 W3C 标准，但改进仍在继续。新的视频编解码器 AV1 可[节省高达 50% 的带宽](https://blog.google/products/duo/4-new-google-duo-features-help-you-stay-connected/)，已经加入了 WebRTC 和 Web 浏览器。开源代码库的持续改进，有望进一步减少延迟并提高可流式传输的视频质量。[WebRTC NV](https://www.w3.org/TR/webrtc-nv-use-cases/)发起了创建补充 API 以启用新用例的倡议。这些包括了对现有 API 的扩展，以提供对现有功能的更多控制，例如[可扩展视频编码](https://www.w3.org/TR/webrtc-svc/)以及提供访问[较低级别组件的](https://github.com/w3c/mediacapture-insertable-streams/blob/main/explainer.md) API。后者通过集成高性能自定义 WebAssembly 组件为 Web 开发人员提供了更大的创新灵活性。随着新兴的 5G 网络和对更多交互服务的需求，我们预计来年将看到基于 WebRTC 的服务持续增加。
