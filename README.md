# Moriá Cerâmica

Loja virtual e gestão interna da Moriá Cerâmica (cerâmica artesanal, utilitária, feita à mão — por Karina Corrêa).

Projeto iniciado a partir da base do KeyStudio3D.

- `apps/web`: site (Next.js, exportado como estático) — loja pública em `/loja` e painel interno (produtos, catálogo, pedidos, clientes, estoque, financeiro). Publicado no Cloudflare Pages.
- `apps/api`: API (FastAPI) publicada como Firebase Cloud Functions, com dados no Firestore.
- Fotos: hospedadas no ImgBB e servidas redimensionadas pela Cloudflare (`apps/web/functions/img.js`).

## Cerâmica

- **Fornos** (`/maquinas`): fornos elétricos ou a gás, tornos e outros equipamentos, com potência e desgaste por hora.
- **Argilas e esmaltes** (`/materiais`) e **Estoque** por categoria (argila, esmalte, pigmento, embalagem, ferramenta).
- **Precificação**: argila por peso, outros materiais por peça, mão de obra e queima. O forno queima várias peças de uma vez, então cada peça paga a sua parte: `horas por queima x nº de queimas / peças por fornada`. A luz é `potência do forno x horas da peça x uso médio da potência`.
- **Pedidos**: Orçamento, Pedido, Pago, Modelagem, Queima, Esmaltação e acabamento, Embalagem, Entregue.

## Configuração

- Firebase: projeto `moria-ceramica` (`.firebaserc`). A API usa Cloud Functions, que exige o plano Blaze.
- Segredos da API (uma vez): `firebase functions:secrets:set <NOME>` para `JWT_SECRET`, `IMGBB_API_KEY`, `API_CORS_ORIGINS`, `DB_BACKEND` (valor `firestore`) e os demais listados em `apps/api/main.py`.
- Cloudflare Pages: pasta raiz `apps/web`, comando `npm run build`, saída `out`, variável `NEXT_PUBLIC_API_URL` com o endereço da API.
- A logo em `apps/web/public/brand/` veio da foto de perfil do Instagram (baixa resolução). Trocar pelo arquivo original quando disponível.
