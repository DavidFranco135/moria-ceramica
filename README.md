# Moriá Cerâmica

Loja virtual e gestão interna da Moriá Cerâmica (cerâmica artesanal, utilitária, feita à mão — por Karina Corrêa).

Projeto iniciado a partir da base do KeyStudio3D.

- `apps/web`: site (Next.js, exportado como estático) — loja pública em `/loja` e painel interno (produtos, catálogo, pedidos, clientes, estoque, financeiro). Publicado no Cloudflare Pages.
- `apps/api`: API (FastAPI) publicada como Firebase Cloud Functions, com dados no Firestore.
- Fotos: hospedadas no ImgBB e servidas redimensionadas pela Cloudflare (`apps/web/functions/img.js`).

## Pendências de configuração

- `.firebaserc`: ID do projeto Firebase.
- Cloudflare Pages: variável `NEXT_PUBLIC_API_URL` com o endereço da API.
- Logo oficial em `apps/web/public/brand/` (as atuais são provisórias).
