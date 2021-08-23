function infiniteScroll() {
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