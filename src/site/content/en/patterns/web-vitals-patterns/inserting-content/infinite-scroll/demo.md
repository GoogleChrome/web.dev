---
patternId: web-vitals-patterns/infinite-scroll/infinite-scroll
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Infinite Scroll Demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        :root {
            --active-button-primary: #0080ff;
            --active-button-font:#ffffff;
            --disabled-button-primary: #f5f5f5;
            --disabled-button-secondary: #c4c4c4;
            --disabled-button-font: #000000;
        }
        /* --- Demo Setup ------------------------------------------------*/
        body {
            margin: 0;
            font-family: system-ui;
            text-align: center;
            scroll-behavior: auto;
            overscroll-behavior-y: none;
        }
        .item {
            height: 50vh;
            background-color: lightpink;
            margin: 1em;
            font-size: 5em;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .new {
            background-color: lightblue;
        }
        .footer {
            padding: 1em;
        }
        /* --- Infinite Scroll ---------------------------------------------*/
        #infinite-scroll-container {
            position: relative;
        }
        #sentinel {
            position: absolute;
            bottom: 150vh;
        }
        #infinite-scroll-button {
            cursor: pointer;
            border: none;
            padding: 1em;
            width: 100%;
            font-size: 1em;
        }
        #infinite-scroll-button:enabled {
            color: var(--active-button-font);
            background-color: var(--active-button-primary)
        }
        #infinite-scroll-button:disabled {
            color: var(--disabled-button-font);
            background-color: var(--disabled-button-primary);
            cursor: not-allowed;
            animation: 3s ease-in-out infinite loadingAnimation;
        }
        #infinite-scroll-button:enabled .disabled-text {
            display: none;
        }
        #infinite-scroll-button:disabled .active-text {
            display: none;
        }
        @keyframes loadingAnimation {
            0% {
                background-color: var(--disabled-button-primary);
            }
            50% {
                background-color: var(--disabled-button-secondary);
            }
            100% {
                background-color: var(--disabled-button-primary);
            }
        }
</style>
</head>
<body>
    <h1>Infinite Scroll</h1>
    <p>Server response delay:</p>
    <select name="delay-select" id="delay-select">
        <option value="0">0ms</option>
        <option value="50">50ms</option>
        <option value="500">500ms</option>
        <option value="5000">5000ms</option>
    </select>
    <div id="infinite-scroll-container">
        <div id="sentinel"></div>
        <div class="item">A</div>
        <div class="item">B</div>
        <div class="item">C</div>
        <div class="item">D</div>
        <div class="item">E</div>
        <button id="infinite-scroll-button" disabled>
            <span class="disabled-text">Loading more items...</span>
            <span class="active-text">Show more</span>
        </button>
        <div class="footer">This is a footer. | Lorum ipsum. | Lorum ipsum.</div>
    </div>
    <script>
        function infiniteScroll() {
            //------- Demo setup code -------------------------------------------------------
            const setupDemo = (() => {
                const selectEl = document.getElementById("delay-select");
                // Initialize select value
                const delay = new URL(window.location.href).searchParams.get("delay") || 50;
                selectEl.value = delay;
                // Add select handler
                selectEl.addEventListener('change', (e) => {
                    const delay = e.target.value;
                    let url = new URL(window.location.href);
                    url.searchParams.set("delay", delay);
                    window.location.href = url;
                });
                // When page is refreshed, scroll to top
                window.onbeforeunload = () => {
                    window.scrollTo(0, 0);
                };
            })();
            const fakeServer = (() => {
                const remainingItems = [...Array(10).keys()];
                const serverDelay = parseInt(document.getElementById("delay-select").value);
                return {
                    fakeRequest: async () => {
                        return new Promise((resolve) => {
                            const items = remainingItems.splice(0, 3);
                            const response = {
                                items: items,
                                hasMore: remainingItems.length > 0
                            }
                            setTimeout(() => resolve(response), serverDelay);
                        });
                    }
                }
            })();
            //------- Infinite scroll -------------------------------------------------------
            let responseBuffer = [];
            let hasMore;
            let requestPending = false;
            const loadingButtonEl = document.querySelector('#infinite-scroll-button');
            const containerEl = document.querySelector('#infinite-scroll-container');
            const sentinelEl = document.querySelector("#sentinel");
            const insertNewItems = () => {
                while (responseBuffer.length > 0) {
                    const data = responseBuffer.shift();
                    const el = document.createElement("div");
                    el.textContent = data;
                    el.classList.add("item");
                    el.classList.add("new");
                    containerEl.insertBefore(el, loadingButtonEl);
                    console.log(`inserted: ${data}`);
                }
                sentinelObserver.observe(sentinelEl);
                if (hasMore === false) {
                    loadingButtonEl.style = "display: none";
                    sentinelObserver.unobserve(sentinelEl);
                    listObserver.unobserve(loadingButtonEl);
                }
                loadingButtonEl.disabled = true
            }
            loadingButtonEl.addEventListener("click", insertNewItems);
            const requestHandler = () => {
                if (requestPending) return;
                console.log("making request");
                requestPending = true;
                fakeServer.fakeRequest().then((response) => {
                    console.log("server response", response);
                    requestPending = false;
                    responseBuffer = responseBuffer.concat(response.items);
                    hasMore = response.hasMore;
                    loadingButtonEl.disabled = false;;
                });
            }
            const sentinelObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0) {
                        observer.unobserve(sentinelEl);
                        requestHandler();
                    }
                });
            });
            const listObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 && entry.intersectionRatio < 1) {
                        insertNewItems();
                    }
                });
            }, {
                rootMargin: "0px 0px 200px 0px"
            });
            sentinelObserver.observe(sentinelEl);
            listObserver.observe(loadingButtonEl);
        }
        infiniteScroll();
    </script>
</body>
</html>