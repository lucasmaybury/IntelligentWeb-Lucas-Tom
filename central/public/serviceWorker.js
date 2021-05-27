const cacheName = "spyChat-cache";

let urlsToCache = [
    "/",
    "/javascripts/db-methods/chat-db.js",
    "/javascripts/idb/index.js",
    "/javascripts/idb/wrap-idb-value.js",

    "/javascripts/canvas.js",
    "/javascripts/capture.js",
    "/javascripts/database.js",
    "/javascripts/fileUpload.js",
    "/javascripts/index.js",

    "/stylesheets/style.css",
];

/**
 * Installs the service worker
 */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log("[ServiceWorker] Cache has been opened");
            return cache.addAll(urlsToCache);
        })
    );
});

/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 *
 * /weather_data
 *      posts cities names to get data about the weather from the server. if offline, the fetch will fail and the
 *      control will be sent back to Ajax with an error
 *
 * all the other pages are searched for in the cache. If not found, they are returned
 */
self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetch', event.request.url);
    let dataUrl = ['/image'];
    if (dataUrl.some( url => event.request.url.indexOf(url) > -1)){
        // service worker  goes to the network and then caches the response
        // "Cache then network" strategy
        return fetch(event.request).then(function (response) {
            // note: if the network is down, response will contain the error
            // that will be passed to Ajax
            return response;
        })
    } else {
        //stale while revalidate strategy
        event.respondWith(
            caches.open(cacheName).then(function(cache) {
                return cache.match(event.request)
                    .then(function(response) {
                        let fetchPromise = fetch(event.request)
                            .then(networkResponse => {
                                cache.put(event.request, networkResponse.clone());
                                    return(networkResponse);
                            });
                        return response || fetchPromise;
                })
            })
        );
    }
});
