---
layout: post
title: 使用 React.lazy 和 Suspense 进行代码拆分
subhead: 永远不要向用户发送不必要的代码，所以请拆分您的代码包以确保不会发生这种情况！
hero: image/admin/Lk8KvDZcWntc7rtQzvv9.jpg
date: 2019-04-29
description: 通过 React.lazy 方法可以轻松地使用动态导入在组件级别对 React 应用程序进行代码拆分。将其与 Suspense 一起使用可向用户显示适当的加载状态。
authors:
  - houssein
  - jeffposnick
feedback:
  - api
---

{% Aside %}如果您尚不清楚代码拆分背后的基本理念，请先参考[通过代码拆分减少 JavaScript 有效负载](/reduce-javascript-payloads-with-code-splitting)指南。{% endAside %}

通过 **`React.lazy`** 方法可以轻松地使用动态导入在组件级别对 React 应用程序进行代码拆分。

```jsx
import React, { lazy } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));

const DetailsComponent = () => (
  <div>
    <AvatarComponent />
  </div>
)
```

## 为什么这很有用？

一个大型 React 应用程序通常由许多组件、实用方法和第三方库组成。如果不努力尝试仅在需要时才加载应用程序的不同部分，那么只要用户加载第一个页面，就会立即向用户发送一个很大的 JavaScript 代码包。这可能会大大影响页面性能。

`React.lazy` 函数提供了一个内置方法，可以将应用程序中的组件分离为单独的工作量很少的 JavaScript 块。然后将其与 `Suspense` 组件结合使用时，可以处理加载状态。

## Suspense

向用户发送较大 JavaScript 有效负载的问题在于页面完成加载所需的时间长度，尤其是在较弱的设备和网络连接上。这就是代码拆分和延迟加载非常有用的原因。

但是，通过网络获取代码拆分组件时，用户总是会遇到轻微延迟，因此显示有用的加载状态很重要。将 `React.lazy` 与 **`Suspense`** 组件一起使用有助于解决此问题。

```jsx
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));

const renderLoader = () => <p>Loading</p>;

const DetailsComponent = () => (
  <Suspense fallback={renderLoader()}>
    <AvatarComponent />
  </Suspense>
)
```

`Suspense` 接受一个 `fallback` 组件，它允许您将任何 React 组件显示为一个加载状态。以下示例说明了工作原理。仅当点击按钮时，才会显示头像，点击时会发出请求以检索暂停的 `AvatarComponent` 所需的代码。同时，显示 fallback 加载组件。

{% Glitch { id: 'react-lazy-suspense', path: 'src/index.css', height: 480 } %}

这里，构成 `AvatarComponent` 的代码很少，所以加载旋转图标只显示了很短时间。加载较大的组件可能需要更长的时间，尤其是在网络连接较弱的情况下。

为了更好地演示工作原理：

{% Instruction 'preview' %} {% Instruction 'devtools-network' %}

- 点击 **Throttling**（限制）下拉列表，该下拉列表默认设置为 **No throttling**（无限制）。选择 **Fast 3G**（快速 3G）。
- 点击应用程序中的 **Click Me**（点击我）按钮。

加载指示器现在将显示更长时间。 注意构成 `AvatarComponent` 的所有代码是如何以单独块的形式获取的。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ga9IsnuJoJdnUfE6sGee.png", alt="DevTools 网络面板显示正在下载一个 chunk.js 文件", width="800", height="478" %}</figure>

{% Aside %} 当组件在服务器端呈现时，React 目前不支持 Suspense。如果在服务器上呈现，请考虑使用其他库，例如 React 文档中推荐的 [`loadable-components`](https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/)。{% endAside %}

## 暂停多个组件

`Suspense` 的另一个功能是允许暂停加载多个组件，**即使它们已经被延迟加载**。

例如：

```jsx
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));
const InfoComponent = lazy(() => import('./InfoComponent'));
const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));

const renderLoader = () => <p>Loading</p>;

const DetailsComponent = () => (
  <Suspense fallback={renderLoader()}>
    <AvatarComponent />
    <InfoComponent />
    <MoreInfoComponent />
  </Suspense>
)
```

这是一种非常有用的方法，可以在仅显示单个加载状态的情况下延迟多个组件的呈现。一旦所有组件都完成获取，用户就会看到它们一起同时显示。

可以通过以下嵌入程序看到这一效果：

{% Glitch { id: 'react-lazy-suspense-multiple', path: 'src/index.css', height: 480 } %}

{% Aside %} 加载指示器显示有点太快？再次尝试在 DevTools 中模拟受限制的连接。{% endAside %}

如果不使用此功能，很容易遇到*交错加载*的问题，或者 UI 的不同部分一个接一个加载，每个部分都有自己的加载指示器。这会使用户体验更加痛苦。

{% Aside %}虽然已经可以使用 Suspense 拆分组件，并且可以轻松减少代码包的大小，但 React 团队仍在继续开发更多功能，以进一步扩展该组件。[React 16.x 路线图](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html)对此有更详细的介绍。{% endAside %}

## 处理加载失败

`Suspense` 允许在后台发出网络请求时显示暂时加载状态。但是如果这些网络请求由于某种原因失败，会发生什么情况？您可能处于离线状态，或者您的 Web 应用程序正在尝试延迟加载一个已过时并且在服务器重新部署后不再可用的[版本化 URL](/http-cache/#long-lived-caching-for-versioned-urls)。

React 有一个标准模式来优雅地处理这些类型的加载失败：使用错误边界。如[文档中](https://reactjs.org/docs/error-boundaries.html)所述，任何 React 组件都可以作为错误边界，只要其实现了生命周期方法 `static getDerivedStateFromError()` 和 `componentDidCatch()` 中的一个或两个均实现。

要检测和处理延迟加载失败，您可以包装您的 `Suspense` 组件，其中将父组件用作错误边界。在错误边界的 `render()` 方法中，如果没有错误，则可以按原样呈现子组件，如果出现问题，则呈现自定义错误消息：

```js
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));
const InfoComponent = lazy(() => import('./InfoComponent'));
const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));

const renderLoader = () => <p>Loading</p>;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return <p>Loading failed! Please reload.</p>;
    }

    return this.props.children;
  }
}

const DetailsComponent = () => (
  <ErrorBoundary>
    <Suspense fallback={renderLoader()}>
      <AvatarComponent />
      <InfoComponent />
      <MoreInfoComponent />
    </Suspense>
  </ErrorBoundary>
)
```

## 结论

如果您不确定从哪里开始对 React 应用程序进行代码拆分，请按照以下步骤操作：

1. 从路由级别开始。路由是识别应用程序拆分点的最简单方法。[React 文档](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting)展示了如何将 `Suspense` 与 [`react-router`](https://github.com/ReactTraining/react-router) 一起使用。
2. 确定网站页面上仅在特定用户交互（例如点击按钮）时呈现的大型组件。拆分这些组件将最大限度地减少 JavaScript 有效负载。
3. 考虑拆分不在屏幕内并且对用户不重要的任何其他组件。
