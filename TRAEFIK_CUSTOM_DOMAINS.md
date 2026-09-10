# CampusCV Production Traefik Custom Domain Architecture

This document explains how Traefik is configured to dynamically handle thousands of custom user domains on CampusCV without manually creating individual static configuration files (e.g. `johnkumar.yml`, `rahul.yml`) per student.

---

## 1. System Architecture Overview

```
                          Incoming Request: https://john.dev
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   Traefik Reverse Proxy   │ (Host Network Mode)
                        │    - Ports 80 & 443       │
                        │    - Let's Encrypt ACME   │
                        └─────────────┬─────────────┘
                                      │ (Passes Host: john.dev)
                                      ▼
                        ┌───────────────────────────┐
                        │  Next.js (127.0.0.1:3000) │
                        │  - Edge Middleware        │
                        │  - Hostname Resolver      │
                        │  - Existing Renderer      │
                        └───────────────────────────┘
```

---

## 2. Dynamic Traefik Configuration (`traefik_dynamic.yml`)

Add this configuration to your Traefik dynamic configuration directory (`/etc/traefik/dynamic/campuscv.yml`):

```yaml
http:
  routers:
    # 1. Main CampusCV App Router
    campuscv-app:
      rule: "Host(`portfolio.campuscv.com`)"
      entryPoints:
        - "websecure"
      service: "campuscv-nextjs"
      tls:
        certResolver: "letsencrypt"

    # 2. Dynamic Catch-All Custom Domains Router
    # Handles ANY verified custom domain pointing their A or CNAME record to the server
    campuscv-custom-domains:
      rule: "HostRegexp(`{domain:[a-zA-Z0-9-.]+}`)"
      priority: 10 # Lower priority than explicit campuscv.com routes
      entryPoints:
        - "websecure"
      service: "campuscv-nextjs"
      tls:
        certResolver: "letsencrypt"

    # 3. HTTP to HTTPS Redirection (Port 80 -> 443)
    http-catchall:
      rule: "HostRegexp(`{host:.+}`)"
      entryPoints:
        - "web"
      middlewares:
        - "redirect-to-https"
      service: "noop"

  middlewares:
    redirect-to-https:
      redirectScheme:
        scheme: "https"
        permanent: true

  services:
    campuscv-nextjs:
      loadBalancer:
        servers:
          - url: "http://127.0.0.1:3000"
    noop:
      loadBalancer:
        servers: []
```

---

## 3. How TLS / SSL Provisioning Works

1. User points their domain A record (`@` -> `YOUR_SERVER_IP`) or CNAME (`www` -> `portfolio.campuscv.com`).
2. When the user or visitor accesses `https://johnkumar.com`, Traefik receives the TLS handshake via SNI.
3. Traefik's built-in ACME HTTP-01 / TLS-ALPN-01 resolver challenges Let's Encrypt, issues the certificate automatically, and caches it in `acme.json`.
4. Traefik forwards the request to Next.js on `127.0.0.1:3000` with the intact `Host: johnkumar.com` header.
5. CampusCV's `domainResolver.ts` loads the student's portfolio and renders it seamlessly with full HTTPS support.
