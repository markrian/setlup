/* eslint-env serviceworker, browser */

const version = 'VERSION';
const CACHE = `network-or-cache-${version}`;

self.addEventListener('install', event => {
    log('install', event);
    event.waitUntil(Promise.all([self.skipWaiting(), precache()]));
});

self.addEventListener('activate', event => {
    log('activate', event);
    event.waitUntil(self.clients.claim().then(clearOldCaches));
});

self.addEventListener('fetch', event => {
    const networkResponse = fetch(event.request);
    const cacheUpdate = networkResponse
        .then(response => updateCache(event.request, response.clone()))
        .catch(() => {});

    event.respondWith(
        waitFor(networkResponse)
            .catch(error => {
                log('fromCache', event.request, error.message);
                return fromCache(event.request);
            })
    );

    event.waitUntil(cacheUpdate);
});

function waitFor(promise, delay = 2000) {
    return new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            reject(new Error('waitFor timeout'));
        }, delay);

        promise.then(
            value => {
                clearTimeout(id);
                resolve(value);
            },
            reject
        );
    });
}

function updateCache(request, response) {
    return caches.open(CACHE).then(cache => {
        return cache.put(request, response)
            .then(
                () => log('updated cache', request, response),
                error => {
                    console.error(`Failed to update cache for ${request.url}`, error);
                    throw error;
                }
            );
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(cache =>
        cache.match(request).then(matching =>
            matching || Promise.reject(new Error('no-match'))
        )
    );
}

function clearOldCaches() {
    return caches.keys().then(keys =>
        Promise.all(
            keys.filter(key => key !== CACHE).map(key =>
                caches.delete(key).then(deleted => {
                    if (deleted) {
                        log(`deleted old cache ${key}`);
                    } else {
                        log(`did not delete non-existent cache ${key}`);
                    }
                })
            )
        )
    );
}

function precache() {
    fetch('manifest.json')
        .then(response => response.json())
        .then(manifest =>
            Object.keys(manifest).map(key => manifest[key])
                .filter(path => !/(service-worker|manifest)/i.test(path))
        )
        .then(paths => {
            paths.push('.');
            log(`precaching ${paths}`);
            return caches.open(CACHE).then(cache => {
                return cache.addAll(paths).then(() => log(`precached ${paths}`));
            });
        })
        .catch(log);
}

function log(...args) {
    console.log(`SW:${version}:`, ...args.map(arg => ((arg && arg.url) || arg)));
}
