# multi-vite demo setup

Vite 2 supports a very nice [multi-page](https://vitejs.dev/guide/build.html#multi-page-app) setup.
The given "multi-page" feature shares one main vite dev server for multiple nested pages, which may now use different `src,` `components,` etc.

Similar, but in contrast to that, a "multi-vite" setup should be able to serve multiple independent vite (or webpack, nuxt, [vite|vue]press) projects in parallel. A developer should even be able to add a new vite+vue3 setup to another existing legacy webpack+vue2 setup within the same webhost. Such a setup requires running a proxy (i.e.: Nginx) in front of all projects.

This repository aims to show a demo setup.

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
  plugins: [vue()],
  server: {
    port: 8082, // <-- port dedicated to admin
    hmr: {
      path: 'admin/'
    }
  }
}
```

```js
// ./repos/profile/vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
  server: {
    port: 8081, // <-- port dedicated to profile
    hmr: {
      path: 'profile/'
    }
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

Currently, vite needs two additional extra locations to provide access to its dev client, so we add:

```nginx
  location /@vite/ {
    proxy_pass http://host.docker.internal:8081; 
  }
  
  location /node_modules/ {
    proxy_pass http://host.docker.internal:8081; 
  }
```

The only caveat I found yet: (Re-)using one `/@vite/client` shared across all instances breaks isolation and carries a risk of future incompatibilities throughout instances.

---

## Roadmap

- configure the build setup
- eliminate extra locations for `/@vite/` and `/node_modules/`

## Changelog

### v0.0.0

- initially bootstrapped

---
