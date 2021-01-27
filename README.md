# multi-vite demo setup

Vite 2 supports a very nice [multi-page](https://vitejs.dev/guide/build.html#multi-page-app) setup.
The given "multi-page" feature shares one main vite dev server for multiple nested pages, which may now use different `src,` `components,` etc.

Similar, a "__multi-vite__" setup should be able to serve multiple independent vite (or webpack, nuxt, [vite|vue]press) projects in parallel. A developer should even be able to add a new vite+vue3 setup to another existing legacy webpack+vue2 setup within the same webhost. Such a setup requires running a proxy (i.e.: Nginx) in front of all projects and setting the [base](https://vitejs.dev/guide/build.html#base) according to your proxies location paths.

## Prerequisites

- [tmuxinator](https://github.com/tmuxinator/tmuxinator) to start the preconfigured tmux sessions.
- local Docker daemon up and running for demonstration purpose.
- ports 80 and 443 free to bind by Nginx.

## Usage

Yes, we still use Makefiles.

* `make install`: installs node_modules and configures docker-compose for Nginx
* `make start`: start the whole site in dev mode  
* `make stop`: stop the whole site

After start, you should be able to point your browser to both 

- http://localhost/admin/
- http://localhost/profile/

And edit components independently with superfast hmr.

## How it's working

For Demo, we set up a directory tree like this one:

```bash
├── Makefile
├── package.json
├── repos
│   ├── admin       // 1st repository serving an admin ui (as PWA for example)
│   └── profile     // 2nd repository serving a profile page (as SPA for example)
├── services
│   └── nginx       // nginx config consumed by docker container
└── yarn.lock
```

Configure all vite instances to serve a baseUrl from their directory.

```js
// ./repos/admin/vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  base: '/admin/',
  plugins: [vue()],
  server: {
    port: 8082 // <-- port dedicated to admin
  }
}
```

```js
// ./repos/profile/vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  base: '/profile/',
  plugins: [vue()],
  server: {
    port: 8081 // <-- port dedicated to profile
  }
}
```

And connect those instances under the same domain with an Nginx proxy config like so:

```nginx
  location /admin/ {
    proxy_pass http://host.docker.internal:8082;
  }

  location /profile/ {
    proxy_pass http://host.docker.internal:8081; 
  }
```

## Build

With the `base` option in place, there is no particular dev setup needed. Each run of:

```sh
$ yarn build
```

will build your project with a base path as prefix right into `./dist`. So, for example, the default index.html of _admin_ repository will render like:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/admin/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite App</title>
  <script type="module" crossorigin src="/admin/assets/index.068891ee.js"></script>
  <link rel="modulepreload" href="/admin/assets/vendor.cee31988.js">
  <link rel="stylesheet" href="/admin/assets/index.b77793a3.css">
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

To finally serve such a PWA on a production environment, Nginx will get configured with a location like:

```nginx
location /admin/ {
  alias /path/to/your/admin/dist;
  try_files $uri $uri/ /admin/index.html;
}
```

---

## Roadmap

- TBD

## Changelog

### v0.1.0

- since __vite@2.0.0-beta.50__: Droped extra locations for `/@vite/` and `/node_modules/` in favor of `base` option

### v0.0.0

- initially bootstrapped

---
