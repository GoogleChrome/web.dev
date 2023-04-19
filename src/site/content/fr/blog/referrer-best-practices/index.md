---
layout: post
title: Bonnes pratiques concernant Referer et Referrer-Policy
subhead: Bonnes pratiques pour configurer votre Referrer-Policy et utiliser le referrer (référent) dans les requêtes entrantes.
authors:
  - maudn
date: 2020-07-30
updated: 2021-10-14
hero: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
thumbnail: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
description: "Envisagez de définir une Referrer-Policy strict-origin-when-cross-origin. Cela permet de conserver une grande partie de l'utilité du referrer, tout en atténuant le risque de fuite de données cross-origin."
tags:
  - blog
  - security
  - privacy
feedback:
  - api
---

## Sommaire

- Les fuites d'informations cross-origin inattendues entravent la confidentialité des internautes. Une Referrer-Policy protrectrice peut aider.
- Envisagez de configurer Referrer Policy `strict-origin-when-cross-origin`. Cela permet de conserver une grande partie de l'utilité du referrer, tout en atténuant le risque de fuite de données cross-origin.
- N'utilisez pas de referrers pour la protection contre la falsification de requête intersites (CSRF, Cross Site Request Forgery). Utilisez plutôt des [jetons CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation) et d'autres en-têtes comme couche de sécurité supplémentaire.

{% Aside %} Avant de commencer :

- Si vous n'êtes pas sûr de la différence entre "site" et "origin", consultez [Comprendre "same-site" et "same-origin"](/same-site-same-origin/).
- Il manque un R à l'en-tête `Referer` en raison d'une faute d'orthographe d'origine dans la spécification. L'en-tête `Referrer-Policy` et `referrer` dans JavaScript et le DOM sont correctement orthographiés. {% endAside %}

## Introduction à Referer et Referrer-Policy

Les requêtes HTTP peuvent inclure l'en-tête optionnel [`Referer`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referer), qui indique l'origine ou l'URL de la page Web à partir de laquelle la requête a été effectuée. L'en-tête [`Referrer-Policy`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy) définit quelles données sont mises à disposition dans l'en-tête `Referer`.

Dans l'exemple ci-dessous, l'en-tête `Referer` inclut l'URL complète de la page du `site-one` à partir de laquelle la requête a été faite.

<figure>{% Img src="image/admin/cXgqJfmD5OPdzqXl9RNt.jpg", alt="Requête HTTP incluant un en-tête Referer.", width="800", height="573" %}</figure>

L'en-tête `Referer` peut être présent dans différents types de requêtes :

- Requêtes de navigation, lorsqu'un utilisateur clique sur un lien
- Requêtes de sous-ressources, lorsqu'un navigateur fait la requête d'images, d'IFrames, de scripts et d'autres ressources dont une page a besoin

Pour les navigations et les IFrames, ces données sont également accessibles via JavaScript à l'aide de `document.referrer`.

La valeur `Referer` peut être pertinente. Par exemple, un service d'analyse peut utiliser la valeur pour déterminer que 50 % des visiteurs sur `site-two.example` proviennent de `social-network.example`.

Mais lorsque l'URL complète, y compris le chemin d'accès et la chaîne de requête, est envoyée dans le `Referer` **des origines**, cela peut **nuire à la confidentialité** et poser également **des risques de sécurité**. Examinez ces URL :

<figure>{% Img src="image/admin/oTUtfrwaGYYjlOJ6KRs6.jpg", alt="URL avec chemins, mappés à différents risques de confidentialité et de sécurité.", width="800", height="370" %}</figure>

Les URL 1 à 5 contiennent des informations privées, parfois même d'identification ou sensibles. La fuite silencieuse de ces informations des origines peut compromettre la confidentialité des internautes.

L'URL #6 est une [URL de capacité](https://www.w3.org/TR/capability-urls/). Vous ne voulez pas qu'elle arrive dans les mains de quelqu'un d'autre que l'utilisateur prévu. Si cela devait se produire, un acteur malveillant pourrait détourner le compte de cet utilisateur.

**Afin de restreindre les données referrer disponibles pour les requêtes de votre site, vous pouvez définir une Referrer-Policy.**

## Quelles sont les politiques disponibles et en quoi diffèrent-elles ?

Vous pouvez sélectionner l'une des huit politiques. Selon la politique, les données disponibles à partir de l'en-tête `Referer` (et `document.referrer`) peuvent :

- Ne présenter aucune donnée (aucun en-tête `Referer` n'est présent)
- Être uniquement l'[origine](/same-site-same-origin/#origin)
- Être l'URL complète : origine, chemin et chaîne de requête

<figure>{% Img src="image/admin/UR1U0HRP0BOF1e0XnyWA.jpg", alt="Données pouvant être contenues dans l'en-tête Referer et document.referrer.", width="800", height="255" %}</figure>

Certaines politiques sont conçues pour se comporter différemment selon le **contexte** : requête cross-origin ou same-origin, sécurité (si la destination de la requête est aussi sécurisée que l'origine), ou les deux. Ceci est utile pour limiter la quantité d'informations partagées entre les origines ou vers des origines moins sécurisées, tout en maintenant la qualité du referrer au sein de votre propre site.

Voici un aperçu montrant comment les Referrer-Policy restreignent les données d'URL disponibles à partir de l'en-tête Referer et de `document.referrer` :

<figure>{% Img src="image/admin/BIHWDY60CI317O7IzmQs.jpg", alt="Différentes Referrer-Policy et leur comportement, en fonction du contexte de sécurité et cross-origin.", width="800", height="537" %}</figure>

MDN fournit une [liste complète de politiques et d'exemples de comportement](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Directives).

Remarques :

- Toutes les politiques qui prennent en compte le schéma (HTTPS ou HTTP) (`strict-origin`, `no-referrer-when-downgrade` et `strict-origin-when-cross-origin`) traitent les requêtes d'une origine HTTP vers une autre origine HTTP de la même manière que les requêtes d'une origine HTTPS vers une autre origine HTTPS, même si HTTP est moins sécurisé. En effet, pour ces politiques, ce qui compte est de savoir si une **régression** de la sécurité a lieu, c'est-à-dire si la requête peut exposer des données d'une origine chiffrée à une origine non chiffrée. Une requête HTTP → HTTP n'est pas cryptée depuis le début, il n'y a donc pas de régression. Les requêtes HTTPS → HTTP, au contraire, présentent une régression.
- Pour les requêtes **same-origin**, le schéma (HTTPS ou HTTP) est le même. Par conséquent, il n'y a pas de régression de la sécurité.

## Referrer-Policy par défaut dans les navigateurs

*Depuis octobre 2021*

**Si aucune Referrer-Policy n'est définie, la politique par défaut du navigateur sera utilisée.**

<div>
  <table>
    <thead>
      <tr>
        <th>Navigateur</th>
        <th>
<code>Referrer-Policy</code> par défaut / Comportement</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Chrome</td>
        <td>La valeur par défaut est <code>strict-origin-when-cross-origin</code>.</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>La valeur par défaut est <code>strict-origin-when-cross-origin</code>.<br> À partir de la <a href="https://blog.mozilla.org/security/2021/10/05/firefox-93-features-an-improved-smartblock-and-new-referrer-tracking-protections/">version 93</a>, pour les utilisateurs utilisant la protection contre le pistage stricte et la navigation privée : les Referrer-Policy les moins restrictives <code>no-referrer-when-downgrade</code>, <code>origin-when-cross-origin</code> et <code>unsafe-url</code> sont ignorées pour les requêtes intersites. Ainsi, le referrer est toujours tronqué pour les requêtes intersites, quelle que soit la politique du site Web.</td>
      </tr>
      <tr>
        <td>Bord</td>
        <td>La valeur par défaut est <code>strict-origin-when-cross-origin</code>.</td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>La valeur par défaut est similaire à <code>strict-origin-when-cross-origin</code>, avec quelques spécificités. Consultez <a href="https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/">Prévention de la protection contre le suivi</a> pour plus de détails.</td>
      </tr>
    </tbody>
  </table>
</div>

## Configurer votre Referrer-Policy : les bonnes pratiques

{% Aside 'objective' %} Configurez explicitement une politique d'amélioration de la confidentialité, telle que `strict-origin-when-cross-origin` (ou plus stricte). {% endAside %}

Il existe différentes manières de définir des Referrer-Policy pour votre site :

- En tant qu'en-tête HTTP
- Dans votre [HTML](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Integration_with_HTML)
- De JavaScript [pour chaque requête](https://javascript.info/fetch-api#referrer-referrerpolicy)

Vous pouvez configurer différentes politiques pour différentes pages, requêtes ou éléments.

L'en-tête HTTP et l'élément meta sont tous deux au niveau de la page. L'ordre de priorité lors de la détermination de la politique effective d'un élément est :

1. Politique au niveau de l'élément
2. Politique au niveau de la page
3. Navigateur par défaut

**Exemple :**

`index.html` :

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
<img src="..." referrerpolicy="no-referrer-when-downgrade" />
```

L'image sera demandée avec une politique `no-referrer-when-downgrade`, tandis que toutes les autres requêtes de sous-ressources de cette page suivront la politique `strict-origin-when-cross-origin`.

## Comment voir la Referrer-Policy ?

Utiliser le site [securityheaders.com](https://securityheaders.com/) pour déterminer la politique qu'un site ou une page spécifique utilise.

Vous pouvez également utiliser les outils de développement de Chrome, Edge ou Firefox pour déterminer la Referrer-Policy utilisée pour une requête spécifique. Pour le moment, Safari n'affiche pas l'en-tête `Referrer-Policy`, mais affiche le `Referer` qui a été envoyé.

<figure>{% Img src="image/admin/8Qlu6ZzSVgL2f9iYIplJ.jpg", alt="Une capture d'écran du panneau Réseau des outils pour les développeurs Chrome, montrant Referer et Referrer-Policy.", width="800", height="416" %}<figcaption> Outils pour les développeurs Chrome, <b>panneau Réseau</b> avec une requête sélectionnée.</figcaption></figure>

## Quelle politique devez-vous définir pour votre site Web ?

Résumé : configurez explicitement une politique d'amélioration de la confidentialité, telle que `strict-origin-when-cross-origin` (ou plus stricte).

### Pourquoi "explicitement" ?

Si aucune Referrer-Policy n'est définie, la politique par défaut du navigateur sera utilisée. En effet, les sites Web s'en remettent souvent à la valeur par défaut du navigateur. Mais ce n'est pas idéal, car :

- Les politiques par défaut du navigateur sont soit `no-referrer-when-downgrade`, `strict-origin-when-cross-origin`, soit plus strictes, selon le navigateur et le mode (privé/incognito). Ainsi, votre site Web ne se comportera pas de manière prévisible sur tous les navigateurs.
- Les navigateurs adoptent des valeurs par défaut plus strictes telles que `strict-origin-when-cross-origin` et des mécanismes tels que le [tronquage du referrer](https://github.com/privacycg/proposals/issues/13) pour les requêtes cross-origin. Opter explicitement pour une politique d'amélioration de la confidentialité avant que les paramètres par défaut du navigateur ne changent vous donne le contrôle et vous aide à exécuter les tests comme bon vous semble.

### Pourquoi `strict-origin-when-cross-origin` (ou plus stricte) ?

Vous avez besoin d'une politique sécurisée, qui renforce la confidentialité et qui est utile. Ce que signifie "utile" dépend de ce que vous attendez du referrer :

- **Sécurisé** : si votre site Web utilise HTTPS ([sinon, faites-en une priorité](/why-https-matters/)), vous ne voulez pas que les URL de votre site Web fuitent dans les requêtes non HTTPS. Étant donné que n'importe qui sur le réseau peut les voir, cela exposerait vos utilisateurs à des attaques de connaisseurs. Les politiques `no-referrer-when-downgrade`, `strict-origin-when-cross-origin`, `no-referrer` et `strict-origin` résolvent ce problème.
- **Renforcement de la confidentialité** : pour une requête cross-origin, `no-referrer-when-downgrade` partage l'URL complète, ce qui n'améliore pas la confidentialité. `strict-origin-when-cross-origin` et `strict-origin` ne partagent que l'origine, et `no-referrer` ne partage rien du tout. Il vous reste donc `strict-origin-when-cross-origin`, `strict-origin` et `no-referrer` comme options d'amélioration de la confidentialité.
- **Utile** : `no-referrer` et `strict-origin` ne partagent jamais l'URL complète, même pour les requêtes cross-origin. Donc si vous en avez besoin, `strict-origin-when-cross-origin` est une meilleure option.

Tout cela signifie que **`strict-origin-when-cross-origin`** est généralement un choix judicieux.

**Exemple de configuration d'une politique `strict-origin-when-cross-origin` :**

`index.html` :

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

Ou côté serveur, par exemple dans Express :

```javascript
const helmet = require('helmet');
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));
```

### Que se passe-t-il si `strict-origin-when-cross-origin` (ou plus strict) ne s'adapte pas à tous vos cas d'utilisation ?

Dans ce cas, adoptez une **approche progressive** : configurez une politique protectrice comme `strict-origin-when-cross-origin` pour votre site Web et si besoin, une politique plus permissive pour des requêtes spécifiques ou des éléments HTML.

### Exemple : politique au niveau de l'élément

`index.html` :

```html/6
<head>
  <!-- document-level policy: strict-origin-when-cross-origin -->
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <head>
    <body>
      <!-- policy on this <a> element: no-referrer-when-downgrade -->
      <a src="…" href="…" referrerpolicy="no-referrer-when-downgrade"></a>
      <body></body>
    </body>
  </head>
</head>
```

Notez que Safari/WebKit peut plafonner `document.referrer` ou l'en-tête `Referer` pour les requêtes [intersites](/same-site-same-origin/#same-site-cross-site). Consultez les [détails](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/).

### Exemple : politique au niveau de la requête

`script.js` :

```javascript
fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
```

### Quels autres éléments devez-vous considérer ?

Votre politique doit dépendre de votre site Web et de vos cas d'utilisation. Cela dépend de vous, de votre équipe et de votre entreprise. Si certaines URL contiennent des données d'identification ou sensibles, définissez une politique protectrice.

{% Aside 'warning' %} Des données qui peuvent ne pas vous sembler sensibles peuvent l'être pour vos utilisateurs, ou ils ne souhaitent ou ne s'attendent simplement pas à ce qu'elles fuitent silencieusement cross-origin. {% endAside %}

## Utiliser le referrer des requêtes entrantes : bonnes pratiques

### Que faire si la fonctionnalité de votre site utilise l'URL de provenance des requêtes entrantes ?

#### Protéger les données des utilisateurs

Le `Referer` peut contenir des données privées, personnelles ou d'identification, alors assurez-vous de les traiter comme telles.

#### Gardez à l'esprit que le `Referer` que vous recevez peut changer

L'utilisation du referrer à partir de requêtes cross-origin entrantes présente quelques limitations :

- Si vous n'avez aucun contrôle sur l'implémentation de l'émetteur de la requête, vous ne pouvez pas faire d'hypothèses sur l'en-tête `Referer` (et `document.referrer`) que vous recevez. L'émetteur de la requête peut décider à tout moment de passer à une politique `no-referrer`, ou plus généralement à une politique plus stricte que ce qu'il utilisait auparavant, ce qui signifie que vous obtiendrez moins de données via le `Referer` qu'auparavant.
- Les navigateurs utilisent de plus en plus la Referrer-Policy `strict-origin-when-cross-origin` par défaut. Cela signifie que vous pouvez désormais recevoir uniquement l'origine (au lieu de l'URL de provenance complète) dans les requêtes cross-origin entrantes, si le site qui les envoie n'a pas défini de politque.
- Les navigateurs peuvent changer la façon dont ils gèrent `Referer`. Par exemple, à l'avenir, ils peuvent décider de toujours tronquer les referrers aux origines dans les requêtes de sous-ressources cross-origin, afin de protéger la confidentialité des utilisateurs.
- L'en-tête `Referer` (et `document.referrer`) peut contenir plus de données que vous n'en avez besoin, par exemple une URL complète lorsque vous voulez seulement savoir si la requête est de type cross-origin.

#### Alternatives au `Referer`

Vous devrez peut-être envisager des alternatives si :

- Une fonctionnalité essentielle de votre site utilise l'URL de provenance des requêtes cross-origin entrantes ;
- Et/ou si votre site ne reçoit plus la partie de l'URL de provenance dont il a besoin dans une requête cross-origin. Cela se produit lorsque l'émetteur de la requête a modifié sa politique ou lorsqu'il n'a défini aucune politique et que la politique par défaut du navigateur a changé (comme dans [Chrome 85](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default)).

Pour définir des alternatives, analysez d'abord quelle partie du referrer vous utilisez.

**Si vous n'avez besoin que de l'origine (`https://site-one.example`) :**

- Si vous utilisez le referrer dans un script qui a un accès de niveau supérieur à la page, `window.location.origin` est une alternative.
- S'ils sont disponibles, des en-têtes comme [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) et [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) vous donnent `Origin` ou décrivent si la requête est de type cross-origin, ce qui peut être exactement ce dont vous avez besoin.

**Si vous avez besoin d'autres éléments de l'URL (chemin, paramètres de requête…) :**

- Les paramètres de requête peuvent répondre à votre cas d'utilisation et cela vous évite le travail d'analyse du referrer.
- Si vous utilisez le referrer dans un script qui a un accès de niveau supérieur à la page, `window.location.pathname` peut être une alternative. Extrayez uniquement la section du chemin de l'URL et transmettez-la en tant qu'argument, afin que toute information potentiellement sensible dans les paramètres d'URL ne soit pas transmise.

**Si vous ne pouvez pas utiliser ces alternatives :**

- Vérifiez si vos systèmes peuvent être modifiés pour que l'émetteur de la requête (`site-one.example`) définisse explicitement les informations dont vous avez besoin dans une configuration quelconque. Avantages : plus explicite, plus respectueux de la vie privée pour les utilisateurs de `site-one.example`, plus à l'épreuve du temps. Inconvénients : potentiellement plus de travail de votre part ou pour les utilisateurs de votre système.
- Vérifiez si le site qui émet les requêtes peut accepter de définir une Referrer-Policy par élément ou par requête de `no-referrer-when-downgrade`. Inconvénients : potentiellement moins respectueux de la vie privée pour les utilisateurs de `site-one.example`, potentiellement non pris en charge par tous les navigateurs.

### Protection contre la falsification de requête intersites (CSRF)

Notez qu'un émetteur de requête peut toujours décider de ne pas envoyer le referrer en définissant une politique `no-referrer` (et un acteur malveillant pourrait même usurper le referrer).

Utilisez les [jetons CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation) comme protection principale. Pour une protection supplémentaire, utilisez [SameSite](/samesite-cookie-recipes/#%22unsafe%22-requests-across-sites), et au lieu de `Referer`, utilisez des en-têtes tels que [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) (disponible sur les requêtes POST et CORS) et [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) (si disponible).

### Informations d'identification

Assurez-vous de protéger les données personnelles ou sensibles des utilisateurs qui peuvent se trouver dans le `Referer`.

Si vous n'utilisez que l'origine, vérifiez si l'en- [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) pourrait être une alternative. Cela peut vous donner les informations dont vous avez besoin à des fins de débogage d'une manière plus simple et sans avoir besoin d'analyser le référent.

### Paiements

Les fournisseurs de paiement peuvent s'appuyer sur l'en-tête `Referer` des requêtes entrantes pour les contrôles de sécurité.

Par exemple :

- L'utilisateur clique sur un bouton **Acheter** `online-shop.example/cart/checkout`.
- `online-shop.example` redirige vers `payment-provider.example` pour gérer la transaction.
- `payment-provider.example` vérifie le `Referer` de cette requête par rapport à une liste de `Referer` autorisées configurées par les marchands. S'il ne correspond à aucune entrée de la liste, `payment-provider.example` rejette la requête. S'il correspond, l'utilisateur peut procéder à la transaction.

#### Bonnes pratiques pour les contrôles de sécurité des flux de paiement

**Résumé : en tant que fournisseur de paiement, vous pouvez utiliser le `Referer` comme moyen de contrôle de base contre les attaques naïves, mais vous devez absolument disposer d'une autre méthode de vérification plus fiable.**

L'en-tête `Referer` seul n'est pas une base fiable pour un contrôle : le site émettant la requête, qu'il soit un marchand légitime ou non, peut définir une politique `no-referrer` qui rendra les informations `Referer` indisponibles pour le fournisseur de paiement. Cependant, en tant que fournisseur de paiement, l'examen du `Referer` peut vous aider à repérer les attaquants naïfs qui n'ont pas défini une politique `no-referrer`. Vous pouvez donc décider d'utiliser le `Referer` comme premier contrôle de base. Pour ce faire :

- **Ne vous attendez pas à ce que le `Referer` soit toujours présent ; et s'il est présent, ne vérifie que la portion de données qu'il inclura au minimum : l'origine**. Lors de la définition de la liste des `Referer` autorisées, assurez-vous qu'aucun chemin n'est inclus, uniquement l'origine. Exemple : les valeurs `Referer` autorisées pour `online-shop.example` devraient être `online-shop.example`, et non `online-shop.example/cart/checkout`. Pourquoi ? Parce qu'en attendant soit pas de `Referer` du tout, soit une valeur `Referer` qui est l'origine du site Web émettant la requête, vous évitez les erreurs inattendues puisque vous **ne faites pas d'hypothèses sur la `Referrer-Policy`** que votre commerçant a définie ou sur le comportement du navigateur si le commerçant n'a pas défini de politique. Le site et le navigateur peuvent retirer le `Referer` envoyé dans la requête entrante pour ne garder que l'origine ou ne pas envoyer le `Referer` du tout.
- Si le `Referer` est absent ou s'il est présent et que votre vérification de base de l'origine du `Referer` a réussi : vous pouvez passer à votre autre méthode de vérification plus fiable (voir ci-dessous).

**Quelle est une méthode de vérification plus fiable ?**

Une méthode de vérification fiable consiste à laisser le demandeur **hacher les paramètres de la requête** avec une clé unique. En tant que fournisseur de paiement, vous pouvez alors **calculer le même hachage de votre côté** et n'accepter la requête que si elle correspond à votre calcul.

**Qu'arrive-t-il au `Referer` lorsqu'un site marchand HTTP sans Referrer-Policy redirige vers un fournisseur de paiement HTTPS ?**

Aucun `Referer` ne sera visible dans la requête adressée au fournisseur de paiement HTTPS, car la [plupart des navigateurs](#default-referrer-policies-in-browsers) utilisent `strict-origin-when-cross-origin` ou `no-referrer-when-downgrade` lorsqu'un site Web n'a pas de politique définie. Notez également que [le changement de Chrome vers une nouvelle politique par défaut](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default) ne changera pas ce comportement.

{% Aside %}

Si votre site Web utilise HTTP, [migrez vers HTTPS](/why-https-matters/).

{% endAside %}

## Conclusion

Une Referrer-Policy protectrice est un excellent moyen de donner plus de confidentialité à vos utilisateurs.

Pour en savoir plus sur les différentes techniques de protection de vos utilisateurs, consultez la collection [Safe and secure](/secure/) de web.dev !

*Avec un grand merci pour les contributions et les commentaires à tous les relecteurs, en particulier Kaustubha Govind, David Van Cleve, Mike West, Sam Dutton, Rowan Merewood, Jxck et Kayce Basques.*

## Ressources

- [Comprendre "same-site" et "same-origin"](/same-site-same-origin/)
- [Un nouvel en-tête de sécurité : Referrer-Policy (2017)](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- [Referrer-Policy sur MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)
- [En-tête Referer : problèmes de confidentialité et de sécurité sur MDN](https://developer.mozilla.org/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Modification de Chrome : intention d'implémentation Blink](https://groups.google.com/a/chromium.org/d/msg/blink-dev/aBtuQUga1Tk/n4BLwof4DgAJ)
- [Modification de Chrome : intention de livraison Blink](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/lqFuqwZDDR8)
- [Modification de Chrome : entrée d'état](https://www.chromestatus.com/feature/6251880185331712)
- [Modification de Chrome : article de blog sur la version bêta 85](https://blog.chromium.org/2020/07/chrome-85-upload-streaming-human.html)
- [Thread GitHub sur le tronquage du referrer : ce que font les différents navigateurs](https://github.com/privacycg/proposals/issues/13)
- [Spécification de Referrer-Policy](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-delivery)
