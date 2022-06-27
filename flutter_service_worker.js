'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "2ec83a0a912f7c8470da0c42701b857f",
"assets/assets/about.png": "bf1f2e4d1370cf197865eef43b7398ca",
"assets/assets/bappa.jpg": "888936f6c42c9072ee4e0cb3620b20b3",
"assets/assets/blue.jpg": "dc8c9d8db56a0ed7ea6a1b2f2096ed2d",
"assets/assets/blues.jpg": "e11a8c4d14461112a2470fb899a81998",
"assets/assets/card1.jpg": "269f7a9fd81996d6259d9a98c57e008b",
"assets/assets/coupon.PNG": "e3c7dd5a8b1eb8e3d0c972c8423a3ce0",
"assets/assets/customer.jpg": "0053821b7d63638d20a88b0e903b4e2d",
"assets/assets/darkblue.jpg": "dc8c9d8db56a0ed7ea6a1b2f2096ed2d",
"assets/assets/delivery.png": "9bcc4986c53898c0f8c3060b320a9613",
"assets/assets/flowerring.jpg": "03e0102e2b8a90d40ab103789d62e330",
"assets/assets/ganu.jpeg": "b97a7a8621a4d3abfa495f93d00e5754",
"assets/assets/goldheader.PNG": "1f302560fb5645b20514fb915245f3fc",
"assets/assets/goldring.PNG": "e986b27809fa739a12562e77f06157f0",
"assets/assets/jewel.jpg": "a94e554aa85d621775f062b324bc09f3",
"assets/assets/logo.png": "ee8cfc3cb14f8770d78a1fe485b67bed",
"assets/assets/logo1.jpg": "74d8abfa038a4a23e2daa98072da2e80",
"assets/assets/luxury-jewelry.jpg": "fc85f371824ebc56986a5152f0997d54",
"assets/assets/map.PNG": "60697293f066e23e40fe365ede2a81bc",
"assets/assets/necklace.png": "c3836637519974f2d9d3e5ffa9d0261d",
"assets/assets/or.PNG": "521a002a98259b8564f4d8274ba70123",
"assets/assets/pendant.png": "68541426e81bad085cf55f50db7bba5e",
"assets/assets/profile.PNG": "e45851c1f9712d23d1ff9d529933bb17",
"assets/assets/ring1.png": "07df1c030565bc45a45b047ec90a6f84",
"assets/assets/signin.PNG": "1fc84d3cac6c0246f51b4412d2356887",
"assets/assets/start.jpg": "3420c9c14885f9a742564bb2819a1e53",
"assets/assets/thali.jpg": "8a5b0c6e1ba5bf473074f4f6345bf6ad",
"assets/assets/tick.png": "e2226a5cf3b6c459c816f2bcb5c46c07",
"assets/assets/truckline.png": "9bcc4986c53898c0f8c3060b320a9613",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "551f3c88de7e58a9c7674c825cac70fd",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "b37ae0f14cbc958316fac4635383b6e8",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "5178af1d278432bec8fc830d50996d6f",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "aa1ec80f1b30a51d64c72f669c1326a7",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "60149d3b8c0de75ebfbeb5403fe2ec21",
"/": "60149d3b8c0de75ebfbeb5403fe2ec21",
"main.dart.js": "263ea3f71d9912fd8bbe4e6e5887d22a",
"manifest.json": "9ad2d21c8334df118a3262ed5db1f3bd",
"version.json": "9b16028c023a6fafd5aa3fe7f60d5294"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
