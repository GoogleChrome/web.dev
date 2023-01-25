---
layout: post
title: Eine Anleitung zum Ermöglichen einer Cross-Origin-Isolierung
authors:
  - agektmr
date: 2021-02-09
updated: 2021-05-06
subhead: Die Cross-Origin-Isolation ermöglicht es einer Webseite, leistungsstarke Funktionen wie SharedArrayBuffer zu verwenden. In diesem Artikel wird erläutert, wie Sie Cross-Origin-Isolierung auf Ihrer Website aktivieren.
description: Die Cross-Origin-Isolation ermöglicht es einer Webseite, leistungsstarke Funktionen wie SharedArrayBuffer zu verwenden. In diesem Artikel wird erläutert, wie Sie Cross-Origin-Isolierung auf Ihrer Website aktivieren.
tags:
  - security
---

In dieser Anleitung erfahren Sie, wie Sie die Cross-Origin-Isolierung aktivieren. Cross-Origin-Isolierung wird vorausgesetzt, wenn Sie [`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), [`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/), einen [hochauflösenden Timer mit mehr Genauigkeit](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/) oder das JS Self-Profiling API verwenden möchten.

Wenn Sie beabsichtigen, Cross-Origin-Isolierung zu aktivieren, dann schätzen Sie zuvor ab, welche Auswirkungen dies auf andere Cross-Origin-Ressourcen auf Ihrer Website hätte, wie z. B. auf platzierte Anzeigen.

{% Details %} {% DetailsSummary %} Stellen Sie fest, wo auf Ihrer Website `SharedArrayBuffer` verwendet wird.

Ab Chrome 92 funktionieren Funktionen, die `SharedArrayBuffer` nutzen, nicht mehr ohne Cross-Origin-Isolierung. Wenn Sie aufgrund einer `SharedArrayBuffer`-Deprecation-Meldung auf dieser Seite gelandet sind, scheint Ihre Website oder eine der darin eingebetteten Ressourcen `SharedArrayBuffer` zu verwenden. Um sicherzustellen, dass auf Ihrer Website keine Unterbrechungen aufgrund veralteter Funktionen auftreten, ermitteln Sie zunächst, wo sie verwendet wird.

{% endDetailsSummary %}

{% Aside 'objective' %}

- Aktivieren Sie die Cross-Origin-Isolierung, um `SharedArrayBuffer` weiternutzen zu können.
- Wenn Sie auf Drittanbietercode angewiesen sind, der `SharedArrayBuffer` nutzt, fordern Sie den Drittanbieter auf, Maßnahmen zu ergreifen. {% endAside %}

Wenn Sie sich nicht sicher sind, wo auf Ihrer Site ein `SharedArrayBuffer` verwendet wird, gibt es zwei Möglichkeiten, dies herauszufinden:

- Verwendung der Chrome-Entwicklertools
- (Erweitert) Nutzen von Deprecation Reporting

Wenn Sie bereits wissen, wo Sie `SharedArrayBuffer` nutzen, fahren Sie mit dem Artikel [Analysieren der Auswirkungen der Cross-Origin-Isolierung](#analysis) fort.

### Verwendung der Chrome-Entwicklertools

Die [Chrome-Entwicklertools](https://developer.chrome.com/docs/devtools/open/) ermöglichen es Entwicklern, Websites zu überprüfen.

1. [Öffnen Sie die Chrome-Entwicklertools](https://developer.chrome.com/docs/devtools/open/) auf der Seite, auf der Sie den Einsatz von `SharedArrayBuffer` vermuten.
2. Wählen Sie das **Konsolenfenster** aus.
3. Wenn die Seite `SharedArrayBuffer` nutzt, wird die folgende Meldung angezeigt:
    ```text
    [Deprecation] SharedArrayBuffer will require cross-origin isolation as of M92, around May 2021. See https://developer.chrome.com/blog/enabling-shared-array-buffer/ for more details. common-bundle.js:535
    ```
4. Der Dateiname und die Zeilennummer am Ende der Nachricht (z. B. `common-bundle.js:535`) geben an, woher der `SharedArrayBuffer` stammt. Wenn es sich um eine Bibliothek eines Drittanbieters handelt, wenden Sie sich an die Entwickler, um das Problem zu beheben. Wenn es als Teil Ihrer Website implementiert wurde, folgen Sie der Anleitung unten, um die Cross-Site-Isolierung zu aktivieren.

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/GOgkyjAabePTc8AG22F7.png", alt="DevTools-Konsolenwarnung bei Verwendung von SharedArrayBuffer ohne Cross-Origin-Isolation", width="800", height="163" %}<figcaption> DevTools-Konsolenwarnung, wenn SharedArrayBuffer ohne Cross-Origin-Isolierung verwendet wird.</figcaption></figure>

### (Erweitert) Nutzen von Deprecation Reporting

Einige Browser verfügen über [eine Funktion zur Berichterstattung über veraltete APIs](https://wicg.github.io/deprecation-reporting/) zu einem bestimmten Endpunkt.

1. [Richten Sie einen Berichtsserver für Meldungen zu veralteten APIs ein und rufen Sie die Berichts-URL ab](/coop-coep/#set-up-reporting-endpoint). Sie können dies erreichen, indem Sie entweder einen öffentlichen Dienst nutzen oder einen eigenen aufsetzen.
2. Legen Sie den folgenden HTTP-Header auf Seiten fest, die `SharedArrayBuffer` bereitstellen könnten und  verwenden Sie darin die Berichts-URL.
    ```http
    Report-To: {"group":"default","max_age":86400,"endpoints":[{"url":"THE_DEPRECATION_ENDPOINT_URL"}]}
    ```
3. Sobald der Header ausgegeben wird, sollte der von ihnen festgelegte Endpunkt mit dem Sammeln von Berichten über veraltete Software (Deprecation Reports) beginnen.

Sehen Sie sich hier eine Beispielimplementierung an: [https://cross-origin-isolation.glitch.me](https://cross-origin-isolation.glitch.me).

{% endDetails %}

## Analysieren Sie die Auswirkungen der Cross-Origin-Isolierung {: #analysis}

Wäre es nicht großartig, wenn Sie die Auswirkungen abschätzen könnten, die die Aktivierung von Cross-Origin-Isolierung auf Ihre Website haben würde, ohne dabei tatsächlich Fehler auf der Website hervorzurufen? Die HTTP-Header für [`Cross-Origin-Opener-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) sowie [`Cross-Origin-Embedder-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) ermöglichen Ihnen genau das.

1. Legen Sie in Ihrem Dokument auf oberster Websiteebene die Einstellung [`Cross-Origin-Opener-Policy-Report-Only: same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document) fest. Wie der Name andeutet, sendet dieser Header nur Berichte über die Auswirkungen, die `COOP: same-origin` auf Ihre Website haben **würde** – die tatsächliche Kommunikation mit Popup-Fenstern wird nicht ausgesetzt.
2. Setzen Sie die Einstellungen für die Berichterstellung und konfigurieren Sie einen Webserver zum Empfangen und Speichern der Berichte.
3. Legen Sie in Ihrem Dokument auf oberster Websiteebene die Einstellung [`Cross-Origin-Embedder-Policy-Report-Only: require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources). Auch dieser Header zeigt Ihnen die Auswirkungen der Aktivierung von `COEP: require-corp`, ohne die Funktion Ihrer Site tatsächlich zu beeinträchtigen. Sie können diesen Header so konfigurieren, dass Berichte an denselben Berichtsserver gesendet werden, den Sie im vorherigen Schritt eingerichtet haben.

{% Aside %} Sie können ebenfalls [die **Domain**-Spalte](https://developer.chrome.com/docs/devtools/network/#information) im **Netzwerk**-Panel der Chrome-Entwicklertools aktivieren, um einen grundlegenden Überblick über die betroffenen Ressourcen zu erhalten. {% endAside %}

{% Aside 'caution' %}

Das Aktivieren der Cross-Origin-Isolierung blockiert das Laden von Cross-Origin-Ressourcen, die Sie nicht explizit dafür aktivieren, und verhindert, dass Ihr Dokument auf oberster Websiteebene mit Popup-Fenstern kommunizieren kann.

Wir haben nach Möglichkeiten gesucht, `Cross-Origin-Resource-Policy` in einem größeren Maßstab bereitzustellen, da die Cross-Origin-Isolierung derzeit erfordert, dass alle Unterressourcen explizit dafür aktiviert werden müssen. Uns kam schließlich die Idee, in die entgegengesetzte Richtung zu gehen: [einen neuen „berechtigungslosen“ COEP-Modus](https://github.com/mikewest/credentiallessness/), der es ermöglicht, Ressourcen ohne CORP-Header zu laden, indem alle ihrer Berechtigungsinformationen entfernt werden. Wir finden noch im Detail heraus, wie dies funktionieren könnte, hoffen aber, dass es Ihnen erleichtern wird, sicherzustellen, dass all Ihre Unterressourcen den Header `Cross-Origin-Resource-Policy` senden.

Es ist weiterhin bekannt, dass der Header`Cross-Origin-Opener-Policy: same-origin` Fehler mit Integrationen verursacht, die auf Cross-Origin-Fensterinteraktionen angewiesen sind, beispielsweise OAuth oder Zahlungsdienste. Um dieses Problem zu mildern, untersuchen wir die Möglichkeit, die [Bedingung zu lockern](https://github.com/whatwg/html/issues/6364), um eine Cross-Origin-Isolierung von `Cross-Origin-Opener-Policy: same-origin-allow-popups` zuzulassen. Auf diese Weise ist die Kommunikation mit dem selbstständig geöffneten Fenster möglich.

Wenn Sie die Cross-Origin-Isolierung aktivieren möchten, diese Herausforderungen sie jedoch davon abhalten, empfehlen wir Ihnen, [sich für eine Origin-Trial anzumelden](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial) und zu warten, bis die neuen Modi verfügbar sind. Wir planen nicht, die Origin-Trial zu beenden, bevor diese neuen Modi verfügbar sind.

{% endAside %}

## Minderung der Auswirkungen der Cross-Origin-Isolierung

Nachdem Sie nun festgestellt haben, welche Ressourcen von der Cross-Origin-Isolierung betroffen sind, finden Sie hier allgemeine Richtlinien dazu, wie Sie diese Cross-Origin-Ressourcen tatsächlich aktivieren:

1. Legen Sie für Cross-Origin-Ressourcen wie Bilder, Skripts, Stylesheets, iframes und andere den Header [`Cross-Origin-Resource-Policy: cross-origin`](https://resourcepolicy.fyi/#cross-origin) fest. Setzen Sie für Same-Site-Ressourcen den Header [`Cross-Origin-Resource-Policy: same-site`](https://resourcepolicy.fyi/#same-origin).
2. Legen Sie das `crossorigin`-Attribut im HTML-Dokument auf oberster Websiteebene fest, wenn die Ressource per [CORS](/cross-origin-resource-sharing/) bereitgestellt wird (z. B. `<img src="example.jpg" crossorigin>`).
3. Wenn in iframes geladene Cross-Origin-Ressourcen eine weitere Ebene von iframes umfassen, wenden Sie die in diesem Abschnitt beschriebenen Schritte rekursiv an, bevor Sie fortfahren.
4. Sobald Sie bestätigt haben, dass alle Cross-Origin-Ressourcen aktiviert sind, setzen Sie für die in iframes geladenen Cross-Origin-Ressourcen den Header `Cross-Origin-Embedder-Policy: require-corp`.
5. Stellen Sie sicher, dass keine Cross-Origin-Popup-Fenster vorhanden sind, die eine Kommunikation über `postMessage()` erfordern. Es gibt keine Möglichkeit, diese funktional zu halten, wenn die Cross-Origin-Isolierung aktiviert ist. Sie können die Kommunikation über ein anderes Dokument regeln, für das keine Cross-Origin-Isolierung besteht, oder eine andere Kommunikationsmethode verwenden (z. B. HTTP-Anforderungen).

## Aktivieren von Cross-Origin-Isolierung

Nachdem Sie nun Vorkehrungen gegen unerwünschte Auswirkungen der Cross-Origin-Isolierung getroffen haben, finden Sie hier allgemeine Richtlinien zum Aktivieren der Cross-Origin-Isolierung:

1. Setzen Sie in Ihrem Dokument auf der obersten Websiteebene den Header `Cross-Origin-Opener-Policy: same-origin`. Wenn zuvor `Cross-Origin-Opener-Policy-Report-Only: same-origin` eingestellt war, ersetzen Sie es. Dadurch wird die Kommunikation zwischen dem Dokument auf Ihrer obersten Websiteebene und seinen Popup-Fenstern verhindert.
2. Setzen Sie in Ihrem Dokument auf der obersten Websiteebene den Header `Cross-Origin-Embedder-Policy: require-corp`. Wenn zuvor `Cross-Origin-Embedder-Policy-Report-Only: require-corp` eingestellt war, ersetzen Sie es. Dadurch wird das Laden von Cross-Origin-Ressourcen verhindert, für die keine Zustimmung vorliegt.
3. Stellen Sie sicher, dass `self.crossOriginIsolated` in der Konsole den Wert `true` ausgibt, um zu verifizieren, dass auf Ihrer Seite eine Cross-Origin-Isolierung besteht.

{% Aside 'gotchas' %}

Das Aktivieren der Cross-Origin-Isolierung auf einem lokalen Server kann mühsam sein, da einfache Server das Senden von Headern nicht unterstützen. Sie können Chrome mit einem Befehlszeilen-Flag von `--enable-features=SharedArrayBuffer` starten, um `SharedArrayBuffer` zu aktivieren, ohne dabei die Cross-Origin-Isolierung zu aktivieren. Erfahren Sie, [wie Sie Chrome auf entsprechenden Plattformen mit einem Befehlszeilen-Flag ausführen können](https://www.chromium.org/developers/how-tos/run-chromium-with-flags) .

{% endAside %}

## Ressourcen

- [Sorgen Sie für eine „Cross-Origin-Isolation“ Ihrer Website mit COOP und COEP](/coop-coep/)
- [SharedArrayBuffer-Aktualisierungen in Android-Chrome 88 und Desktop-Chrome 92](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
