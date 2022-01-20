---
title: Referrer und Best Practices für Referrer-Richtlinien
subhead: Best Practices für das Festlegen Ihrer Referrer-Richtlinie (Referrer-Policy) und für die Nutzung von Referrern in eingehenden Anfragen.
authors:
  - maudn
date: 2020-07-30
updated: 2021-10-14
hero: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
thumbnail: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
description: Ziehen Sie in Erwägung eine Referrer-Richtlinie von „strict-origin-when-cross-origin“ festzulegen. Dies bewahrt einen großen Teil der Nützlichkeit des Referrers und verringert gleichzeitig das Risiko von Datenlecks zwischen verschiedenen Origins (cross-origin).
tags:
  - blog
  - security
  - privacy
feedback:
  - api
---

## Zusammenfassung

- Unerwartete Cross-Origin-Informationslecks beeinträchtigen die Privatsphäre der Webbenutzer. Eine schützende Referrer-Richtlinie kann dagegen helfen.
- Ziehen Sie in Erwägung, eine Referrer-Richtlinie von `strict-origin-when-cross-origin` festzulegen. Diese bewahrt einen großen Teil der Nützlichkeit des Referrers und verringert gleichzeitig das Risiko von Datenlecks zwischen verschiedenen Origins (cross-origin).
- Verwenden Sie zum Schutz vor Cross-Site Request Forgery (CSRF) keine Referrer. Nutzen Sie stattdessen für eine zusätzliche Sicherheitsebene [CSRF-Token](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation) und andere Header.

{% Aside %} Bevor wir beginnen:

- Wenn Ihnen der Unterschied zwischen „Site“ und „Origin“ (auch „Ausgangspunkt“) nicht klar ist, lesen Sie den Artikel [Verstehen von „Same-Site“ und „Same-Origin“](/same-site-same-origin/).
- Dem `Referer`-Header fehlt aufgrund eines Schreibfehlers in der ursprünglichen Spezifikation ein R. Der `Referrer-Policy`-Header, der `referrer` in JavaScript sowie der DOM-Referrer sind korrekt geschrieben. {% endAside %}

## Referer und Referrer-Richtlinie 101

HTTP requests may include the optional [`Referer` header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referer), which indicates the origin or web page URL the request was made from. The [`Referrer-Policy` header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy) defines what data is made available in the `Referer` header.

Im folgenden Beispiel enthält der `Referer`-Header die vollständige URL der Seite unter `site-one`, von der aus die Anfrage gestellt wurde.

<figure>{% Img src="image/admin/cXgqJfmD5OPdzqXl9RNt.jpg", alt="HTTP-Anfrage mit Referer-Header.", width="800", height="573" %}</figure>

Der `Referer`-Header kann in verschiedenen Arten von Anfragen vorhanden sein:

- Navigationsanfragen, wenn ein Benutzer auf einen Link klickt
- Anfragen zu Unterressourcen, wenn ein Browser Bilder, iframes, Skripte und andere Ressourcen anfordert, die von einer Seite benötigt werden.

Zur Navigation und für iframes können diese Daten auch per JavaScript mit `document.referrer` abgerufen werden.

Der `Referer`-Wert kann aufschlussreich sein. Beispielsweise könnte ein Analysedienst den Wert verwenden, um zu bestimmen, dass 50 % der Besucher auf `site-two.example` von `social-network.example` kamen.

Wenn jedoch die vollständige URL einschließlich des Pfads per`Referer` **zwischen verschiedenen Origins** geteilt wird, kann dies nicht nur die **Privatsphäre beeinträchtigen** sondern ebenfalls **Sicherheitsrisiken bergen**. Sehen Sie sich beispielsweise diese URLs an:

<figure>{% Img src="image/admin/oTUtfrwaGYYjlOJ6KRs6.jpg", alt="URLs mit Pfaden, die verschiedenen Datenschutz- und Sicherheitsrisiken zugeordnet sind.", width="800", height="370" %}</figure>

Die URLs #1 bis #5 enthalten private Informationen – manche sogar identifizierende oder vertrauliche. Wenn diese stillschweigend zu anderen Origins durchsickern, kann dies die Privatsphäre der Webbenutzer gefährden.

URL #6 ist eine [Funktions-URL](https://www.w3.org/TR/capability-urls/). Man möchte nicht, dass sie in die Hände von jemand anderem als dem gewünschten Benutzer fällt. In diesem Fall könnte ein böswilliger Akteur das Konto dieses Benutzers kapern.

**Um einzuschränken, welche Referrer-Daten für Anfragen von Ihrer Website zur Verfügung gestellt werden, können Sie eine Referrer-Richtlinie festlegen.**

## Welche Richtlinien gibt es und wie unterscheiden sie sich?

Sie können eine von acht Richtlinien auswählen. Abhängig von der Richtlinie können die im `Referer`-Header (und über `document.referrer`) verfügbaren Daten:

- Nicht vorhanden sein (kein `Referer`-Header vorhanden)
- Nur die [Origins](/same-site-same-origin/#origin) betreffen
- Die vollständige URL enthalten: Origin, Pfad und Query-String

<figure>{% Img src="image/admin/UR1U0HRP0BOF1e0XnyWA.jpg", alt="Daten, die im Referer-Header und in document.referrer enthalten sein können.", width="800", height="255" %}</figure>

Einige Richtlinien wurden so gestaltet, dass Sie je nach **Kontext** unterschiedliches Verhalten hervorrufen, beispielsweise im Kontext einer Cross-Origin- bzw. Same-Origin-Anfrage, wenn erhöht Wert auf die Sicherheit (das Ziel der Anfrage sollte genauso sicher sein wie die Origin) gelegt wird oder wenn beides der Fall ist. Dies ist nützlich, um die Menge an Informationen zu begrenzen, die über Origins hinweg (cross-origin) oder mit weniger sicheren Origins geteilt werden – während gleichzeitig die Vielfalt des Referrers auf Ihrer eigenen Site erhalten bleibt.

Hier ist eine Übersicht, die zeigt, wie Referrer-Richtlinien die im Referer-Header und über `document.referrer` verfügbaren URL-Daten einschränken:

<figure>{% Img src="image/admin/BIHWDY60CI317O7IzmQs.jpg", alt="Unterschiedliche Referrer-Richtlinien und ihr Verhalten, je nach Sicherheitseinstellungen und Cross-Origin-Kontext.", width="800", height="537" %}</figure>

MDN bietet eine [vollständige Liste mit Richtlinien und Verhaltensbeispielen](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Directives) an.

Dinge zu beachten:

- Alle Richtlinien, die das Schema (HTTPS vs. HTTP) berücksichtigen (`strict-origin`, `no-referrer-when-downgrade` und `strict-origin-when-cross-origin`) behandeln Anfragen von einer HTTP-Origin zu einer anderen HTTP-Origin genauso wie Anfragen von einer HTTPS-Origin zu einer anderen HTTPS-Oigin – auch wenn HTTP unsicherer ist. Der Grund dafür ist, dass es im Rahmen der Richtlinien entscheidend ist, ob ein Sicherheits-**Downgrade** stattfindet, also ob die Anfrage Daten einer verschlüsselten Origin einer unverschlüsselten Origin preisgeben kann. Eine HTTP → HTTP-Anfrage bleibt die ganze Zeit über unverschlüsselt, ein Downgrade findet nicht statt. Bei HTTPS → HTTP-Anfragen wird hingegen ein Downgrade durchgeführt.
- Wenn eine Anfrage eine **Same-Origin**-Anfrage ist, stimmt das Schema (HTTPS oder HTTP) überein, was bedeutet, dass kein Sicherheits-Downgrade vollzogen wird.

## Standardmäßige Referrer-Richtlinien in Browsern

*Stand Oktober 2021*

**Wenn keine Referrer-Richtlinie (Refferer-Policy) festgelegt wurde, wird die Standardrichtlinie des Browsers verwendet.**

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Browser</th>
        <th>Standardmäßige <code>Referrer-Policy</code> / Verhalten</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Chrome</td>
        <td>Die Standardeinstellung ist <code>strict-origin-when-cross-origin</code>.</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>Die Standardeinstellung ist <code>strict-origin-when-cross-origin</code>.<br> Ab <a href="https://blog.mozilla.org/security/2021/10/05/firefox-93-features-an-improved-smartblock-and-new-referrer-tracking-protections/">Version 93</a> gilt für Benutzer mit strengem Tracking-Schutz und des Inkognitomodus: Die weniger restriktiven Referrer-Richtlinien <code>no-referrer-when-downgrade</code>, <code>origin-when-cross-origin</code> und <code>unsafe-url</code> werden bei Cross-Site-Anfragen ignoriert. Dies bedeutet, dass der Referrer für Cross-Site-Anfragen, unabhängig von den Richtlinien der Website, stets gekürzt wird.</td>
      </tr>
      <tr>
        <td>Edge</td>
        <td>Die Standardeinstellung ist <code>strict-origin-when-cross-origin</code>.</td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>Die Standardeinstellung entspricht in etwa <code>strict-origin-when-cross-origin</code>, weist jedoch einige Besonderheiten auf. Weitere Informationen finden Sie unter <a href="https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/">Verhindern von durch Ausnutzen des Tracking-Schutzes durchgeführtem Tracking.</a>
</td>
      </tr>
    </tbody>
  </table>
</div>

## Festlegen Ihrer Referrer-Richtlinie: Best Practices

{% Aside 'objective' %} Legen Sie explizit eine den Datenschutz verbessernde Richtlinie wie `strict-origin-when-cross-origin` (oder eine strengere) fest. {% endAside %}

Es gibt verschiedene Möglichkeiten, die Referrer-Richtlinien Ihrer Website festzulegen:

- Per HTTP-Header
- In Ihrem [HTML](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Integration_with_HTML)-Code
- Auf [Anfragebasis](https://javascript.info/fetch-api#referrer-referrerpolicy) per JavaScript

Sie können unterschiedliche Richtlinien für verschiedene Seiten, Anfragen oder Elemente festlegen.

Der HTTP-Header und das Meta-Element befinden sich beide auf Seitenebene. Die bei der Bestimmung der für ein Element geltenden Richtlinie geltende Reihenfolge lautet:

1. Richtlinie für die Elementebene
2. Richtlinie für die Seitenebene
3. Standardeinstellung des Browsers

**Beispiel:**

`index.html`:

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
<img src="..." referrerpolicy="no-referrer-when-downgrade" />
```

Das Bild wird mit einer geltenden Richtlinie von `no-referrer-when-downgrade` angefordert, während alle anderen Unterressourcenanfragen dieser Seite der Richtlinie `strict-origin-when-cross-origin` folgen.

## Wie kann ich die Referrer-Richtlinie einsehen?

Die Website [securityheaders.com](https://securityheaders.com/) kann dabei helfen, die von einer bestimmten Website oder Seite angewendete Richtlinie zu bestimmen.

Sie können ebenfalls die Entwicklertools von Chrome, Edge oder Firefox nutzen, um die von einer bestimmten Anfrage genutzte Referrer-Richtlinie anzuzeigen. Zum Zeitpunkt der Erstellung dieses Artikels kann Safari den `Referrer-Policy`-Header nicht anzeigen, zeigt allerdings den gesendeten `Referer` an.

<figure>{% Img src="image/admin/8Qlu6ZzSVgL2f9iYIplJ.jpg", alt="Ein Screenshot des Netzwerk-Panels der Chrome-Entwicklertools mit Referrer und Referrer-Richtlinie.", width="800", height="416" %}<figcaption> Chrome-Entwicklertools, <b>Netzwerk</b>-Panel mit einer ausgewählten Anfrage.</figcaption></figure>

## Welche Richtlinie sollten Sie für Ihre Website festlegen?

Zusammenfassung: Legen Sie explizit eine den Datenschutz verbessernde Richtlinie wie `strict-origin-when-cross-origin` (oder eine strengere) fest.

### Warum „explizit“?

Wenn keine Referrer-Richtlinie festgelegt wurde, wird die Standardrichtlinie des Browsers verwendet – tatsächlich greifen Websites oft auf diese Standardrichtlinie des Browsers zurück. Dies ist jedoch nicht ideal, denn:

- Die Standardrichtlinien von Browsern sind entweder `no-referrer-when-downgrade`, `strict-origin-when-cross-origin` oder strengere – je nach Browser und Modus (privat/inkognito). Das Verhalten Ihrer Website in verschiedenen Browsern ist also nicht vorhersehbar.
- Browser verwenden strengere Standardeinstellungen wie `strict-origin-when-cross-origin` und Mechanismen wie [Referrer-Trimming](https://github.com/privacycg/proposals/issues/13) für Cross-Origin-Anfragen. Wenn Sie sich explizit für eine Datenschutzrichtlinie entscheiden, bevor sich die Browser-Standardeinstellungen ändern, haben Sie die Kontrolle und können nach Belieben Tests durchführen.

### Weshalb `strict-origin-when-cross-origin` (oder strenger)?

Sie benötigen eine sichere, datenschutzfreundliche und nützliche Richtlinie – was „nützlich“ dabei genau bedeutet, hängt davon ab, was Sie vom Referrer erwarten:

- **Sicherheit**: Wenn Ihre Website HTTPS verwendet ([wenn nicht, machen Sie dies zu einer Priorität](/why-https-matters/)), möchten Sie nicht, dass die URLs Ihrer Website an Nicht-HTTPS-Anfragen durchsickern. Da jeder im Netzwerk diese sehen kann, würde dies Ihre Benutzer Person-in-the-Middle-Angriffen aussetzen. Die Richtlinien `no-referrer-when-downgrade`, `strict-origin-when-cross-origin`, `no-referrer` und `strict-origin` lösen dieses Problem.
- **Verbesserung der Privatsphäre**: Bei einer Cross-Origin-Anfrage wird im Rahmen der Richtlinie `no-referrer-when-downgrade` die vollständige URL geteilt – dies schützt nicht die Privatsphäre. `strict-origin-when-cross-origin` und `strict-origin` teilen nur die Origin mit, und `no-referrer` gibt gar nichts preis. Damit bleiben Ihnen zum Schutz der Privatsphäre nur noch die Optionen `strict-origin-when-cross-origin`, `strict-origin` und `no-referrer` übrig.
- **Nützlich**: `no-referrer` und `strict-origin` teilen nie die vollständige URL, selbst bei Anfragen mit gleichem Ursprungspunkt. Wenn Sie dies benötigen, ist `strict-origin-when-cross-origin` bessere Option.

Daraus lässt sich schließen, dass **`strict-origin-when-cross-origin`** im Allgemeinen eine sinnvolle Wahl ist.

**Beispiel: Festlegen einer Richtlinie von `strict-origin-when-cross-origin`:**

`index.html`:

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

Oder serverseitig, zum Beispiel per Express-Framework:

```javascript
const helmet = require('helmet');
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));
```

### Was ist, wenn `strict-origin-when-cross-origin` (oder strenger) nicht für alle Ihre Anwendungsfälle geeignet ist?

Gehen Sie in diesem Fall **progressiv vor**: Legen Sie für Ihre Website eine schützende Richtlinie wie `strict-origin-when-cross-origin` und bei Bedarf eine eher tolerantere Richtlinie für spezifische Anfragen oder HTML-Elemente fest.

### Beispiel: Richtlinie für die Elementebene

`index.html`:

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

Beachten Sie, dass Safari/WebKit `document.referrer` oder den `Referer`-Header für [Cross-Site](/same-site-same-origin/#same-site-cross-site)-Anfragen blockieren könnte. Siehe [weitere Details](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/).

### Beispiel: Richtlinie für die Anfrageebene

`script.js`:

```javascript
fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
```

### Was sollten Sie weiteres beachten?

Ihre Richtlinie sollten Sie entsprechend Ihrer Website und den spezifischen Anwendungsfällen wählen – diese Entscheidung liegt bei Ihnen, Ihrem Team und Ihrem Unternehmen. Wenn einige der URLs identifizierende oder sensible Daten enthalten, stellen Sie eine Richtlinie ein, bei der der Fokus auf dem Datenschutz liegt.

{% Aside 'warning' %} Daten, die Ihnen nicht sensibel zu sein scheinen, können durchaus für Ihre Nutzer sensibel sein oder sie erwarten einfach, dass Daten dieser Art nicht stillschweigend anderen Origins (Cross-Origin) preisgeben werden. {% endAside %}

## Verwendung des Referrers aus eingehenden Anfragen: Best Practices

### Was ist zu tun, wenn die Funktionalität Ihrer Website die Referrer-URL eingehender Anfragen verwendet?

#### Schützen Sie die Benutzerdaten

Der `Referer` kann private, personenbezogene oder identifizierende Daten enthalten – stellen Sie also sicher, dass Sie diese auch als solche behandeln.

#### Denken Sie daran, dass sich von ihnen erhaltene `Referer` ändern können

Die Verwendung des Referrers aus eingehenden Cross-Origin-Anfragen bringt einige Einschränkungen mit sich:

- Wenn Sie keine Kontrolle über die Implementierung der für das Senden der Anfragen genutzten Software haben, können Sie auch keine Annahmen über den erhaltenen `Referer`-Header (sowie über `document.referrer`) anstellen. Der Emittent der Anfrage kann sich jederzeit entscheiden, zu einer `no-referrer`-Richtlinie oder einer insgesamt strengeren Richtlinie im Vergleich zu vorher zu wechseln. Damit würden Sie weniger Daten über den `Referer` erhalten als früher.
- Immer mehr Browser verwenden standardmäßig die Referrer-Richtlinie `strict-origin-when-cross-origin`. Dies bedeutet, dass Sie die Origin (anstelle der vollständigen Referrer-URL) mit eingehenden Cross-Origin-Anfragen jetzt möglicherweise nur noch mitgeteilt bekommen, wenn die Site, die diese sendet, keine Richtlinien festgelegt hat.
- Browser könnten in Zukunft die Art und Weise ändern, auf die sie mit dem `Referer` umgehen. Beispielsweise könnten sie in Zukunft beschließen, Referrerinhalte in Cross-Origin-Anfragen für Unterressourcen immer auf die Origins zu beschränken, um die Privatsphäre der Benutzer zu schützen.
- Der `Referer`-Header (sowie `document.referrer`) kann mehr Daten enthalten, als Sie benötigen, beispielsweise eine vollständige URL, wenn Sie lediglich wissen möchten, ob es sich um eine Cross-Origin-Anfrage handelt.

#### Alternativen zu `Referer`

Möglicherweise müssen Sie Alternativen in Betracht ziehen, wenn:

- Eine wesentliche Funktion Ihrer Website die Referrer-URL eingehender Cross-Origin-Anfragen nutzt;
- Und/oder wenn Ihre Website den benötigten Teil der Referrer-URL aus einer Cross-Origin-Anfrage nicht mehr erhält. Dies geschieht, wenn der Sender der Anfrage seine Richtlinie geändert hat oder wenn keine Richtlinie festgelegt wurde und die Richtlinie des Browsers geändert wurde (wie in [Chrome 85](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default)).

Um Alternativen zu definieren, analysieren Sie zuerst, welchen Teil des Referrers Sie verwenden.

**Wenn Sie lediglich die Origin benötigen (`https://site-one.example`):**

- Wenn Sie den Referrer in einem Skript verwenden, das Zugriff auf die oberste Ebene der Seite hat, ist `window.location.origin` eine Alternative.
- Wenn verfügbar, geben Header wie [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) und [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) die `Origin` an oder beschreiben, ob es sich um eine Cross-Origin-Anfrage handelt, was möglicherweise genau das ist, was Sie brauchen.

**Wenn Sie andere Elemente der URL benötigen (Pfad, Query-Parameter usw.):**

- Gibt es eventuell Anfrageparameter die auf Ihren Anwendungsfall zugeschnitten sind, was Ihnen das Parsen des Referrers erspart.
- Dann kann, wenn Sie den Referrer in einem Skript verwenden, das Zugriff auf die oberste Ebene einer Seite hat, `window.location.pathname` eine Alternative sein. Extrahieren Sie nur den Pfadabschnitt der URL und übergeben Sie ihn als Argument, damit keine potenziell sensiblen Informationen über die URL-Parameter weitergegeben werden.

**Wenn Sie diese Alternativen nicht verwenden können:**

- Prüfen Sie, ob Ihre Systeme so angepasst werden können, dass vom Sender der Anfrage (`site-one.example`) erwartet wird, dass die von Ihnen benötigten Informationen von ihm explizit in einer Art Konfiguration festlegt werden. Vorteile: expliziter, datenschutzfreundlicher für Benutzer von `site-one.example` und zukunftssicherer. Nachteile: möglicherweise mehr Arbeit von Ihrer Seite oder für die Benutzer Ihres Systems.
- Prüfen Sie, ob die Site, die die Anfragen versendet, zustimmt, eine Referrer-Richtlinie von `no-referrer-when-downgrade` auf Element- oder Anfragebasis festzulegen. Nachteile: potenziell weniger Datenschutz für Benutzer von `site-one.example`, möglicherweise nicht von allen Browsern unterstützt.

### Schutz vor Cross-Site Request Forgery (CSRF)

Beachten Sie, dass sich ein Sender einer Anfrage jederzeit entscheiden kann, keinen Referrer zu senden, indem er eine Richtlinie von `no-referrer` festlegt (außerdem könnte ein böswilliger Akteur den Referrer sogar fälschen).

Verwenden Sie [CSRF-Token](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation) als Ihren primären Schutz. Für zusätzliche Sicherheit sollten Sie [SameSite](/samesite-cookie-recipes/#%22unsafe%22-requests-across-sites) nutzen und anstelle des `Referer`-Headers Header wie den [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin)-Header (verfügbar bei POST- und CORS-Anfragen) sowie [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) (falls verfügbar) verwenden.

### Protokollierung

Stellen Sie sicher, sich eventuell im `Referer` befindende Benutzerdaten zu schützen.

Wenn Sie nur den Ursprungspunkt verwenden, prüfen Sie, ob der [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin)-Header eine Alternative sein könnte. Auf diese Weise erhalten Sie möglicherweise auf einfachere Weise die Informationen, die Sie zum Debuggen benötigen, ohne den Referrer analysieren zu müssen.

### Zahlungen

Zahlungsanbieter können für Sicherheitsüberprüfungen bei eingehenden Anfragen auf den `Referer`-Header setzen.

Zum Beispiel:

- Der Nutzer klickt unter `online-shop.example/cart/checkout` auf einen **Kaufen**-Button.
- `online-shop.example` leitet zum Verwalten der Transaktion auf `payment-provider.example` um.
- `payment-provider.example` gleicht den `Referer` dieser Anfrage mit einer Liste zulässiger `Referer`-Werte ab, die von den Händlern eingerichtet wurde. Wenn er mit keinem Listeneintrag übereinstimmt, dann lehnt `payment-provider.example` die Anfrage ab. Wenn es eine Übereinstimmung gibt, kann der Benutzer mit der Transaktion fortfahren.

#### Best Practices für Sicherheitsprüfungen bei Bezahlvorgängen

**Fazit: Als Zahlungsanbieter können Sie den `Referer` als grundlegenden Überprüfungsfaktor zur Verhinderung naiver Angriffe verwenden – Sie sollten jedoch zusätzlich unbedingt eine andere, zuverlässigere Überprüfungsmethode einsetzen.**

Der `Referer`-Header alleine stellt keine zuverlässige Basis für eine Sicherheitsprüfung dar, denn die Site von der die Anfrage ausgeht, könnte unabhängig davon, ob es sich um einen legitimen Händler handelt oder nicht, eine `no-referrer`-Richtlinie festgelegt haben, die die `Referer`-Informationen vor dem Zahlungsanbieter zurückhält. Als Zahlungsanbieter kann Ihnen ein Blick auf den `Referer`-Header jedoch zumindest dabei helfen naive Angreifer abzuwehren, die keine `no-referrer`-Richtlinie festgelegt haben. Es bietet sich also an, den `Referer` für eine erste grundlegende Sicherheitsprüfung zu nutzen. Sollten Sie dies tun, dann:

- **Erwarten Sie nicht, dass der `Referer` immer verfügbar ist; und sollte er verfügbar sein, dann durchsuchen Sie ihn nur nach dem Minimum an möglichen enthaltenen Informationen, also nach der Origin**. Wenn Sie die Liste mit erlaubten `Referer`-Werten festlegen, dann stellen Sie sicher, dass dort kein Pfad, sondern nur die Origin enthalten ist. Beispiel: Die erlaubten `Referer`-Werte für `online-shop.example` sollten die Angabe `online-shop.example` und nicht `online-shop.example/cart/checkout` beinhalten. Warum? Weil, wenn Sie entweder überhaupt keinen `Referer` erwarten oder Sie einen `Referer`-Wert erwarten, der der Origin der anfragestellenden Website entspricht, unerwartete Fehler vermieden werden können, da **keine Vermutungen darüber angestellt werden müssen, welche `Referrer-Policy`** von Ihrem Händler festgelegt wurde oder wie sich Browser verhalten könnten, wenn der Händler keine Richtlinie festgelegt hat. Sowohl die Site als auch der Browser könnten die Informationen des in der eingehenden Anfrage gesendeten `Referers` auf die Origin beschränken oder den `Referer` gar nicht senden.
- Wenn der `Referer` vorhanden ist oder wenn er vorhanden ist und zusätzlich Ihre einfache Sicherheitsprüfung der `Referer`-Origin erfolgreich war, können Sie den Benutzer zu einer weiteren zuverlässigeren Verifizierungsmethode weiterleiten (siehe unten).

**Welche zuverlässigeren Verifizierungsmethoden gibt es?**

Eine zuverlässige Verifizierungsmethode ist es, den Steller der Anfrage **einen Hash der Anfrageparameter** in Verbindung mit einem eindeutigen Schlüssel erstellen zu lassen. Sie können dann als Zahlungsanbieter **auf Ihrer Seite den gleichen Hash berechnen** und die Anfrage nur akzeptieren, wenn der Hash mit dem von Ihnen berechneten übereinstimmt.

**Was passiert mit dem `Referer`, wenn eine HTTP-Website eines Händlers ohne Referrer-Richtlinie Weiterleitungen zu einem HTTPS-Zahlungsanbieter durchführt?**

In der Anfrage an den HTTPS-Zahlungsanbieter wird kein `Referer` sichtbar sein, da die [meisten Browser](#default-referrer-policies-in-browsers) standardmäßig auf die Richtlinien `strict-origin-when-cross-origin` oder `no-referrer-when-downgrade` zurückgreifen, wenn eine Website keine Richtlinie festgelegt hat. Beachten Sie auch, dass [Chromes Wechsel zur Verwendung einer neuen Standardrichtlinie](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default) dieses Verhalten nicht ändert.

{% Aside %}

Wenn Ihre Website HTTP verwendet, [migrieren Sie zu HTTPS](/why-https-matters/).

{% endAside %}

## Fazit

Eine schützende Referrer-Richtlinie stellt eine großartige Möglichkeit dar, Ihren Benutzern mehr Privatsphäre zu bieten.

Um mehr über diverse Techniken zum Schutz Ihrer Benutzer zu erfahren, sehen Sie sich web.dev's Sammlung von Artikeln mit [Sicherheitsbezug](/secure/) an!

*Mit herzlichem Dank für Beiträge und Feedback an alle Rezensenten – insbesondere Kaustubha Govind, David Van Cleve, Mike West, Sam Dutton, Rowan Merewood, Jxck und Kayce Basques.*

## Ressourcen

- [Verstehen von „Same-Site“ und „Same-Origin“](/same-site-same-origin/)
- [Ein neuer Sicherheitsheader: Referrer-Richtlinie (2017)](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- [„Referrer-Richtlinie“ auf MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)
- [„Referer-Header: Datenschutz- und Sicherheitsbedenken“ bei MDN](https://developer.mozilla.org/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Chrome-Änderung: Blink – Implementierungsabsicht](https://groups.google.com/a/chromium.org/d/msg/blink-dev/aBtuQUga1Tk/n4BLwof4DgAJ)
- [Chrome-Änderung: Blink – Auslieferungsabsicht](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/lqFuqwZDDR8)
- [Chrome-Aktualisierung: Statuseintrag](https://www.chromestatus.com/feature/6251880185331712)
- [Chrome-Aktualisierung: Blogpost zur 85 Beta](https://blog.chromium.org/2020/07/chrome-85-upload-streaming-human.html)
- [GitHub-Thread zum Kürzen von Refferern: Wie sich verschiedene Browser verhalten](https://github.com/privacycg/proposals/issues/13)
- [Referrer-Richtlinien-Spezifikation](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-delivery)
