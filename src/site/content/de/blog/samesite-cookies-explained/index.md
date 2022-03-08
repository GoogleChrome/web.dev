---
title: SameSite-Cookies erklärt
subhead: Sichern Sie Ihre Website, indem Sie lernen, wie Sie Ihre Cross-Site-Cookies explizit kennzeichnen.
authors:
  - rowan_m
date: 2019-05-07
updated: 2020-05-28
hero: image/admin/UTOC41rgCccAqVNbJlyK.jpg
description: Erfahren Sie, wie Sie Ihre Cookies für die Nutzung durch Erst- und Drittanbieter mit dem SameSite-Attribut versehen können. Sie können die Sicherheit Ihrer Website verbessern, indem Sie die Werte „Lax“ und „Strict“ für das SameSite-Attribut zum Schutz vor CSRF-Angriffen nutzen. Durch Angabe des neuen Attributs „None“ können Sie Ihre Cookies explizit für die webseitenübergreifende (cross-site) Nutzung kennzeichnen.
tags:
  - blog
  - security
  - cookies
  - chrome-80
feedback:
  - api
---

{% Aside %} Dieser Artikel ist Teil einer Reihe über `SameSite`-Cookie-Attribute betreffende Änderungen:

- [SameSite-Cookies erklärt](/samesite-cookies-explained/)
- [SameSite-Cookies-Rezepte](/samesite-cookie-recipes/)
- [Schemeful Same-Site](/schemeful-samesite) {% endAside %}

Cookies sind eine der verfügbaren Methoden, um Websites einen dauerhaften Status hinzuzufügen. Im Laufe der Jahre haben ihre Funktionen zugenommen und sie sind weiterentwickelt worden, wobei allerdings auch einige problematische Altlasten für die Plattform entstanden sind. Um dem entgegenzuwirken, ändern Browser (einschließlich Chrome, Firefox und Edge) ihr Verhalten und setzen datenschutzfreundlichere Standardeinstellungen durch.

Jedes Cookie ist ein `key=value`-Paar mit einer Reihe von Attributen, die steuern, wann und wo dieses Cookie verwendet wird. Sie haben diese Attribute wahrscheinlich bereits verwendet, um Dinge wie Ablaufdaten festzulegen oder anzugeben, dass das Cookie nur über HTTPS gesendet werden soll. Server setzen Cookies, indem sie in ihrer Antwort den treffend benannten `Set-Cookie`-Header senden. Für alle Details können Sie sich das Dokument [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1) durchlesen, aber hier vorerst eine kurze Erinnerung.

Angenommen, Sie haben einen Blog, in dem Sie Ihren Benutzern eine „Neuigkeiten“-Werbeaktion anzeigen möchten. Benutzer können die Werbeaktion ausblenden und sehen sie dann für eine Weile nicht mehr. Sie können diese Einstellung in einem Cookie speichern, den sie in einem Monat (2.600.000 Sekunden) ablaufen lassen und eine Übertragung ausschließlich über HTTPS zulassen. Dieser Header würde so aussehen:

```text
Set-Cookie: promo_shown=1; Max-Age=2600000; Secure
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jJ1fqcsAk9Ig3hManFBO.png", alt="Drei Cookies werden von einem Server in einer Antwort an einen Browser gesendet", width="800", height="276", style="max-width: 35vw" %}<figcaption> Server setzen Cookies mithilfe des <code>Set-Cookie</code>-Headers.</figcaption></figure>

Wenn sich Ihre Besucher eine Seite ansehen, die diese Anforderungen erfüllt, z. B. wenn eine sichere Verbindung besteht und das Cookie weniger als einen Monat alt ist, senden die Browser diesen Header in der Anfrage:

```text
Cookie: promo_shown=1
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rq21WQpOZFvfgS9bbjmc.png", alt="Drei Cookies werden in einer Anfrage von einem Browser an einen Server gesendet", width="800", height="165", style="max-width: 35vw" %}<figcaption> Ihr Browser sendet Cookies im <code>Cookie</code>-Header zurück.</figcaption></figure>

Sie können die für diese Site verfügbaren Cookies auch per JavaScript mit `document.cookie` hinzufügen und lesen. Durch eine Zuweisung an `document.cookie` wird ein Cookie mit diesem Schlüssel erstellt oder überschrieben. Sie können beispielsweise Folgendes in der JavaScript-Konsole Ihres Browsers versuchen:

```text
→ document.cookie = "promo_shown=1; Max-Age=2600000; Secure"
← "promo_shown=1; Max-Age=2600000; Secure"
```

Beim Lesen von `document.cookie` werden alle im aktuellen Kontext zugänglichen Cookies ausgegeben, wobei jedes Cookie durch ein Semikolon getrennt ist:

```text
→ document.cookie;
← "promo_shown=1; color_theme=peachpuff; sidebar_loc=left"
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mbV00Gy5VAPTUls0i7cM.png", alt="JavaScript greift auf Cookies im Browser zu", width="600", height="382", style="max-width: 35vw" %}<figcaption> JavaScript kann mit <code>document.cookie</code> auf Cookies zugreifen.</figcaption></figure>

Wenn Sie dies auf einer Auswahl beliebter Websites ausprobieren, werden Sie feststellen, dass die meisten von ihnen deutlich mehr als nur drei Cookies setzen. In den meisten Fällen werden diese Cookies bei jeder einzelnen Anfrage an eine dieser Domains gesendet, was eine Reihe von Auswirkungen hat. Die Upload-Bandbreite Ihrer Benutzer ist oft stärker eingeschränkt als die Download-Bandbreite, sodass der Overhead für alle ausgehenden Anfragen die Zeit bis zum ersten empfangenen Byte verzögert. Gehen Sie beim Festlegen der Anzahl und Größe der von Ihnen gesetzten Cookies zurückhaltend vor. Verwenden Sie das `Max-Age`-Attribut, um sicherzustellen, dass Cookies nicht länger als nötig vorhanden bleiben.

## Was sind Erstanbieter- und Drittanbieter-Cookies?

Wenn Sie einer Auswahl von Webseiten zurückkehren, die Sie bereits zuvor besucht haben, dann ist Ihnen wahrscheinlich aufgefallen, dass Cookies für eine Vielzahl von Domains vorhanden sind, und nicht nur für die, die Sie gerade besuchen. So werden Cookies für die Domain der aktuell besuchten und in der Adresszeile des Browsers angezeigten Seite, als **Erstanbieter**-Cookies bezeichnet. Cookies von anderen Domains als der aktuellen Webseite werden als **Drittanbieter**-Cookies bezeichnet. Dies sind keine absoluten Bezeichnungen, sondern sie sind relativ zum Kontext des Benutzers aufzufassen. Ein und derselbe Cookie kann entweder ein Erstanbieter- oder ein Drittanbieter-Cookie sein, je nachdem, auf welcher Website sich der Benutzer gerade befindet.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zjXpDz2jAdXMT83Nm3IT.png", alt="Drei Cookies werden über verschiedene Anfragen einer Seite an einen Browser gesendet", width="800", height="346", style="max-width: 35vw" %}<figcaption> Cookies auf einer Seite können von einer Vielzahl unterschiedlicher Domains stammen.</figcaption></figure>

Führen wir einmal das oben angefangene Beispiel weiter, und nehmen an, einer Ihrer Blog-Posts würde unter `/blog/img/amazing-cat.png` gehostet und ein Bild einer besonders tollen Katze enthalten. Weil es ein so tolles Bild ist, verwendet es eine andere Person direkt auf ihrer eigenen Website. Wenn ein Besucher Ihren Blog besucht hat und der Cookie die `promo_shown` vorhanden ist, dann wird, wenn sie `amazing-cat.png` auf der Website der anderen Person betrachten, das Cookie für das Bild in der Anfrage **mitübertragen**. Dies ist für niemanden besonders nützlich, da `promo_shown` für nichts auf der Webseite dieser anderen Person verwendet wird, es fügt der Anfrage lediglich Overhead hinzu.

Wenn dies also ein unbeabsichtigter Effekt ist, warum sollten Sie das tun? Dieser Mechanismus ermöglicht es Webseiten, Ihren Zustand beizubehalten, wenn sie in einem Drittanbieterkontext verwendet werden. Wenn Sie beispielsweise ein YouTube-Video auf Ihrer Website einbetten, sehen Besucher im Player die Option „Später ansehen“. Ist Ihr Besucher bereits bei YouTube angemeldet, wird diese Sitzung im eingebetteten Player durch einen Drittanbieter-Cookie zur Verfügung gestellt. Dies bedeutet, dass die Schaltfläche „Später ansehen“ das Video in einem Schritt speichert, anstatt ihn zur Anmeldung aufzufordern oder von Ihrer Seite weg zu YouTube zu navigieren.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/u9chHBLm3i27yFRwHx5W.png", alt="Dasselbe Cookie wird in drei verschiedenen Kontexten gesendet", width="800", height="433", style="max-width: 35vw" %}<figcaption> Beim Besuch verschiedener Seiten wird ein Cookie im Drittanbieterkontext gesendet.</figcaption></figure>

Eine der kulturellen Eigenschaften des Webs ist, dass es in der Regel offen ist. Dies ist einer der Gründe, aus denen so vielen Menschen ermöglicht wurde, dort ihre eigenen Inhalte und Apps zu erstellen. Andererseits hat dies jedoch auch eine Reihe von Sicherheits- und Datenschutzbedenken mit sich gebracht. Cross-Site Request Forgery-Angriffe (CSRF) beruhen darauf, dass Cookies für alle Anfragen mit beliebigen Zielen angehängt werden, unabhängig davon, wer diese Anfragen initiiert. Wenn Sie beispielsweise `evil.example` besuchen, kann diese Seite Anfragen für `your-blog.example` auslösen und Ihr Browser würde dazu ohne weiteres die zugehörigen Cookies anhängen. Wenn Ihr Blog also nicht sicherstellt, dass diese Anfragen korrekt validiert werden, dann kann `evil.example` Aktionen wie das Löschen von Beiträgen oder das Hinzufügen eigener Inhalte auslösen.

Benutzer werden sich auch immer mehr bewusst, wie Cookies verwendet werden können, um ihre Aktivitäten über mehrere Webseiten nachzuverfolgen. Bisher gab es für Sie jedoch keine Möglichkeit, Ihre Absicht mit dem Cookie explizit anzugeben. Ihr `promo_shown`-Cookie sollte nur in einem Erstanbieterkontext gesendet werden, während mit einem Sitzungscookie für ein Widget, das auf anderen Webseiten eingebettet werden soll, eine klare Absicht besteht, den Anmeldestatus in einem Drittanbieterkontext bereitzustellen.

## Geben Sie die Cookie-Verwendung explizit mit dem Attribut `SameSite` an

Durch die Einführung des `SameSite`-Attributs (definiert in [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00)) können Sie angeben, ob die Verwendung Ihres Cookies auf einen Erstanbieter- oder Same-Site-Kontext beschränkt werden soll. Es ist hilfreich, genau zu verstehen, was „Site“ hier bedeutet. Die Site ist die Kombination aus dem Domain-Suffix und dem Teil der Domain direkt davor. So ist beispielsweise die Domain `www.web.dev` Teil der `web.dev`-Site.

{% Aside 'key-term' %}

Wenn der Benutzer auf `www.web.dev` ist und ein Bild von `static.web.dev` abruft, dann stellt dies eine **Same-Site**-Anfrage dar.

{% endAside %}

Dies wird mithilfe der [öffentlichen Suffixliste](https://publicsuffix.org/) definiert, die nicht nur Top-Level-Domains wie `.com`, sondern auch Dienste wie `github.io` enthält. So wird es ermöglicht, dass `your-project.github.io` und `my-project.github.io` als separate Sites betrachtet werden können.

{% Aside 'key-term' %}

Wenn sich der Benutzer auf `your-project.github.io` befindet und ein Bild von `my-project.github.io` anfordert, ist dies eine **Cross-Site**-Anfrage.

{% endAside %}

Die Einführung des `SameSite` Attributs in ein Cookie bietet drei verschiedene Möglichkeiten, dieses Verhalten zu steuern. Sie können das Attribut nicht angeben, oder Sie können `Strict` oder `Lax` , um das Cookie auf Anfragen derselben Site zu beschränken.

Wenn Sie `SameSite` auf `Strict` stellen, wird Ihr Cookie nur in einem Erstanbieterkontext gesendet. Aus Benutzersicht wird das Cookie nur gesendet, wenn die Site für das Cookie mit der Site übereinstimmt, die derzeit in der URL-Leiste des Browsers angezeigt wird. Wenn also das `promo_shown`-Cookie wie folgt eingestellt wurde:

```text
Set-Cookie: promo_shown=1; SameSite=Strict
```

Wenn der Benutzer sich auf Ihrer Website aufhält, wird das Cookie wie erwartet mit der Anfrage gesendet. Wenn Sie jedoch einem Link zu Ihrer Site folgen, beispielsweise von einer anderen Site oder über eine E-Mail von einem Freund, wird bei dieser ersten Anfrage kein Cookie gesendet. Dies ist gut, wenn es um Cookies geht, die sich auf Funktionen beziehen, denen immer eine vorherige Navigation vorausgeht, wie zum Beispiel das Ändern eines Passworts oder eine Bestellung, ist jedoch zu restriktiv für `promo_shown`. Wenn Ihr Leser dem Link auf die Site folgt, möchte er, dass das Cookie gesendet wird, damit seine Präferenz angewendet werden kann.

Hier kommt `SameSite=Lax` zum Zug, indem es erlaubt, dass das Cookie bei dieser Top-Level-Navigation mitgesendet wird. Sehen wir uns das Beispiel mit der Katze aus dem oben stehenden Artikel noch einmal an, bei dem eine andere Website auf Ihren Inhalt verweist. Sie verwenden Ihr Foto der Katze direkt und stellen einen Link zu Ihrem ursprünglichen Artikel bereit.

```html
<p>Look at this amazing cat!</p>
<img src="https://blog.example/blog/img/amazing-cat.png" />
<p>Read the <a href="https://blog.example/blog/cat.html">article</a>.</p>
```

Und das Cookie wurde so gesetzt:

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

Wenn sich der Leser im Blog der anderen Person befindet, wird das Cookie **nicht gesendet**, wenn der Browser `amazing-cat.png` anfordert. Wenn der Leser jedoch dem Link zu `cat.html` in Ihrem Blog folgt, **enthält** diese Anfrage das Cookie. Dies macht `Lax` zu einer guten Wahl für Cookies, die das Aussehen einer Website betreffen, wobei `Strict` für Cookies nützlich ist, die Nutzeraktionen betreffen.

{% Aside 'caution' %}

Weder `Strict` noch `Lax` sind eine Komplettlösung für die Sicherheit Ihrer Webseite. Cookies werden als Teil der Anfrage des Benutzers gesendet und Sie sollten genauso behandelt werden wie jede andere Benutzereingabe. Das bedeutet, dass die Eingaben genauso bereinigt und validiert werden sollten. Verwenden Sie einen Cookie niemals um Daten zu speichern, die Sie als serverseitiges Geheimnis betrachten.

{% endAside %}

Schließlich besteht die Möglichkeit, den Wert nicht anzugeben, was bislang implizit bedeutete, dass das Cookie in allen Kontexten gesendet werden soll. Im neuesten Entwurf von [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03) wird dies durch die Einführung eines neuen Wertes von `SameSite=None` explizit festgelegt. Das bedeutet, dass Sie mit `None` klar kommunizieren können, dass Sie das Cookie absichtlich im Drittanbieterkontext senden möchten.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1MhNdg9exp0rKnHpwCWT.png", alt="Drei Cookies mit den kontextabhängigen Bezeichnungen „None“, „Lax“ oder „Strict“", width="800", height="456", style="max-width: 35vw" %}<figcaption> Geben Sie den Kontext eines Cookies explizit als <code>None</code> , <code>Lax</code> oder <code>Strict</code> an.</figcaption></figure>

{% Aside %}

Wenn Sie Dienste bereitstellen, der von anderen Websites genutzt werden, wie z. B. Widgets, eingebettete Inhalte, Partnerprogramme, Werbung oder Anmeldung auf mehreren Websites, sollten Sie `None` wählen, um sicherzustellen, dass Ihre Absicht klar ist.

{% endAside %}

## Änderungen am Standardverhalten ohne SameSite

Obwohl das `SameSite`-Attribut weithin unterstützt wird, wird es leider nicht von vielen Entwicklern genutzt. Die offene Standardeinstellung, mit der Cookies überall hingesendet werden können, sichert zwar in allen Anwendungsfällen die Funktion, aber die Benutzer sind anfällig für CSRF und unbeabsichtigte Informationslecks. Um Entwickler zu ermutigen, ihre Absicht zu äußern und den Benutzern ein sichereres Erlebnis zu bieten, enthält der IETF-Vorschlag [Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) zwei wichtige Änderungen:

- Cookies ohne `SameSite`-Attribut werden wie solche mit dem Attribut `SameSite=Lax` behandelt.
- Cookies mit `SameSite=None` müssen auch `Secure` angeben, sie erfordern also einen sicheren Kontext.

Chrome implementiert dieses Standardverhalten ab Version 84. [Firefox stellt](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ) sie zum Testen ab Firefox 69 bereit und wird sie in Zukunft zum Standardverhalten machen. Um dieses Verhalten in Firefox zu testen, öffnen Sie [`about:config`](http://kb.mozillazine.org/About:config) und legen Sie `network.cookie.sameSite.laxByDefault` fest. Auch für [Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) ist geplant, das Standardverhalten zu ändern.

{% Aside %}

Dieser Artikel wird aktualisiert, sobald weitere Browser Unterstützung ankündigen.

{% endAside %}

### `SameSite=Lax` in der Standardeinstellung

{% Compare 'worse', 'No attribute set' %}

```text
Set-Cookie: promo_shown=1
```

{% CompareCaption %}

Wenn Sie ein Cookie ohne festgelegtem `SameSite`-Attribut senden…

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Default behavior applied' %}

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

{% CompareCaption %}

Wird der Browser das Cookie so interpretieren, als wäre `SameSite=Lax` angegeben worden.

{% endCompareCaption %}

{% endCompare %}

Obwohl dies als eine sicherere Standardeinstellung gedacht ist, sollten Sie idealerweise dennoch ein explizites `SameSite`-Attribut festlegen, anstatt sich darauf zu verlassen, dass der Browser dieses für Sie anwendet. Dies macht Ihre Absicht für das Cookie deutlich und verbessert die Chancen auf ein übereinstimmendes Benutzererlebnis in allen Browsern.

{% Aside 'caution' %}

Das von Chrome angewendete Standardverhalten ist etwas toleranter als mit explizit angegebenem `SameSite=Lax`, da es das Senden bestimmter Cookies bei Top-Level-POST-Anfragen ermöglicht. Die genauen Details können Sie der [Ankündigung von blink-dev](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/YKBxPCScCwAJ) entnehmen. Dies ist als vorübergehende Lösung gedacht. Sie sollten für Ihre Cross-Site-Cookies aber dennoch die Einstellung `SameSite=None; Secure` nutzen.

{% endAside %}

### `SameSite=None` muss sicher sein

{% Compare 'worse', 'Rejected' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None
```

{% CompareCaption %}

Das Setzen eines Cookies ohne `Secure` **wird abgelehnt** .

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Accepted' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

{% CompareCaption %}

Sie müssen sicherstellen, dass Sie `SameSite=None` mit dem Attribut `Secure` koppeln.

{% endCompareCaption %}

{% endCompare %}

Sie können dieses Verhalten ab Chrome 76 testen, indem Sie `about://flags/#cookies-without-same-site-must-be-secure` aktivieren und ab Firefox 69 unter [`about:config`](http://kb.mozillazine.org/About:config) die Einstellung `network.cookie.sameSite.noneRequiresSecure` setzen.

Sie sollten diese Einstellungen beim Setzen neuer Cookies anwenden und vorhandene Cookies aktiv aktualisieren, auch wenn deren Ablaufdatum noch in der Ferne liegt.

{% Aside 'note' %}

Wenn Sie auf Dienste angewiesen sind, die Drittanbieterinhalte auf Ihrer Website bereitstellen, sollten Sie sich auch bei diesen Anbietern erkundigen, ob die entsprechenden Dienste aktualisiert wurden. Möglicherweise müssen Sie Ihre Abhängigkeiten oder Snippets aktualisieren, um sicherzustellen, dass Ihre Website das neue Verhalten übernimmt.

{% endAside %}

Beide Änderungen sind abwärtskompatibel mit Browsern, die die vorherige Version des `SameSite`-Attributs korrekt implementiert haben oder es überhaupt nicht unterstützen. Indem Sie diese Änderungen auf Ihre Cookies anwenden, erklären Sie explizit deren beabsichtigte Verwendung, anstatt sich auf das Standardverhalten des Browsers zu verlassen. Ebenso sollten alle Clients, die `SameSite=None` noch nicht erkennen, es einfach ignorieren und weiterarbeiten, als ob das Attribut nicht gesetzt wäre.

{% Aside 'warning' %}

Eine Reihe älterer Browserversionen, einschließlich Versionen der Browser Chrome, Safari und des UC-Browsers, sind mit dem neuen `None`-Attribut nicht kompatibel und könnten das Cookie ignorieren oder einschränken. Dieses Verhalten wurde in aktuellen Versionen behoben, Sie sollten jedoch Ihren Datenverkehr überprüfen, um festzustellen, ob Benutzer von Ihnen betroffen sind. Sie können die [Liste der bekannten inkompatiblen Clients auf der Chromium-Website](https://www.chromium.org/updates/same-site/incompatible-clients) einsehen.

{% endAside %}

## `SameSite`-Cookie-Rezepte

Weitere Informationen dazu, wie Sie Ihre Cookies genau aktualisieren, um diese Änderungen zu `SameSite=None` und den einhergehenden Unterschied im Browserverhalten zu berücksichtigen, finden Sie im Folgeartikel [SameSite-Cookie-Rezepte](/samesite-cookie-recipes) .

_Herzlichen Dank für Beiträge und Feedback von Lily Chen, Malte Ubl, Mike West, Rob Dodson, Tom Steiner und Vivek Sekhar_

_Cookie-Held-Bild von [Pille-Riin Priske](https://unsplash.com/photos/UiP3uF5JRWM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) auf [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
