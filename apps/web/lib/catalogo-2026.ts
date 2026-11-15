// Catálogo de Peças Moriá 2026 (do catálogo em imagem da Karina).
// Usado pelo botão "Importar catálogo 2026" em Minha Loja: cria as categorias,
// subcategorias e produtos que ainda não existem, sem apagar nada.

export type CatalogItem = {
  name: string;
  price: number | null; // null = sob consulta
  size?: string;
  description?: string;
  // Categorias extras além da sua (ex.: também aparece em Presentes).
  alsoIn?: string[];
  featured?: boolean;
};

export type CatalogCategory = {
  name: string;
  parent?: string; // nome da categoria principal, quando for subcategoria
  items: CatalogItem[];
};

const SOB_ENCOMENDA = "Peça feita à mão, sob encomenda. Formas e modelos sob disponibilidade.";
const INSPIRACAO = "Não encontrou o que procura? Envie uma foto de inspiração e a Moriá desenvolve para você.";
const FORMAS_PRATO = "Formas disponíveis: oval, orgânica ou desconstruída. Escolha a sua forma no pedido.";

function d(...parts: string[]) {
  return parts.join("\n\n");
}

export const CATALOGO_2026: CatalogCategory[] = [
  {
    name: "Linha Café",
    items: [
      { name: "Xícara Espresso 100ml + Pires", price: 85, size: "100 ml", description: d(SOB_ENCOMENDA, INSPIRACAO), featured: true },
      { name: "Xícara de Café 180ml + Pires", price: 95, size: "180 ml", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      {
        name: "Xícara de Café / Chá 250ml + Pires",
        price: 110,
        size: "250 ml",
        description: d(SOB_ENCOMENDA, INSPIRACAO),
        alsoIn: ["Presentes"],
      },
      { name: "Caneca Moriá 300ml", price: 100, size: "300 ml", description: d(SOB_ENCOMENDA, INSPIRACAO), alsoIn: ["Presentes"], featured: true },
      { name: "Copinho Moriá 150ml", price: 60, size: "150 ml", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Copo Moriá 300ml", price: 85, size: "300 ml", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Coador de Café", price: 100, description: d(SOB_ENCOMENDA, INSPIRACAO), alsoIn: ["Presentes"], featured: true },
    ],
  },
  { name: "Mesa Posta", items: [] },
  {
    name: "Pratos",
    parent: "Mesa Posta",
    items: [
      { name: "Pires", price: 50, description: d(FORMAS_PRATO, SOB_ENCOMENDA) },
      { name: "Prato de Sobremesa", price: 80, description: d(FORMAS_PRATO, SOB_ENCOMENDA) },
      { name: "Prato de Refeição", price: 100, description: d(FORMAS_PRATO, SOB_ENCOMENDA), featured: true },
      { name: "Prato Fundo / Massas", price: 120, description: d(FORMAS_PRATO, SOB_ENCOMENDA) },
    ],
  },
  {
    name: "Bowls",
    parent: "Mesa Posta",
    items: [
      { name: "Bowl 600ml", price: 100, size: "600 ml", description: d(FORMAS_PRATO, SOB_ENCOMENDA), featured: true },
      { name: "Bowl 1L", price: 120, size: "1 L", description: d(FORMAS_PRATO, SOB_ENCOMENDA) },
      { name: "Bowl 1,5L", price: 150, size: "1,5 L", description: d(FORMAS_PRATO, SOB_ENCOMENDA) },
    ],
  },
  { name: "Para Servir", items: [] },
  {
    name: "Bules e Jarras",
    parent: "Para Servir",
    items: [
      { name: "Bule Moriá", price: 170, description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Jarrinha 900ml", price: 140, size: "900 ml", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Jarra 1,4L", price: 300, size: "1,4 L", description: d(SOB_ENCOMENDA, INSPIRACAO) },
    ],
  },
  {
    name: "Bandejas e Petisqueiras",
    parent: "Para Servir",
    items: [
      { name: "Molheira Cumbuca 100ml", price: 80, size: "100 ml", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Bandeja Moriá com alça 28cm", price: 220, size: "28 cm", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Petisqueira Moriá 27cm", price: 200, size: "27 cm", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Boleira com pé 30cm", price: 330, size: "30 cm", description: d(SOB_ENCOMENDA, INSPIRACAO) },
    ],
  },
  {
    name: "Assadeiras e Formas",
    parent: "Para Servir",
    items: [
      { name: "Assadeira Quadrada com alça 22cm", price: 220, size: "22 cm", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Assadeira Oval com alça 30cm", price: 260, size: "30 cm", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Assadeira Retangular com alça 32cm", price: 270, size: "32 cm", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Forma para bolo / pudim 21cm", price: 220, size: "21 cm", description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Panela Caçarola 25cm", price: 390, size: "25 cm", description: d(SOB_ENCOMENDA, INSPIRACAO) },
    ],
  },
  {
    name: "Linha Cozinha",
    items: [
      { name: "Descanso de Colher", price: 50, description: d(SOB_ENCOMENDA, INSPIRACAO) },
      {
        name: "Porta-Utensílios 15cm",
        price: 140,
        size: "15 cm",
        description: d("Porta-utensílios: escolha o uso que preferir.", SOB_ENCOMENDA, INSPIRACAO),
      },
      { name: "Saleiro", price: 130, description: d(SOB_ENCOMENDA, INSPIRACAO) },
      { name: "Açucareiro", price: 130, description: d(SOB_ENCOMENDA, INSPIRACAO) },
      {
        name: "Manteigueira Tradicional ou Francesa",
        price: 140,
        description: d("Escolha o modelo no pedido: tradicional ou francesa.", SOB_ENCOMENDA, INSPIRACAO),
      },
      { name: "Queijeira", price: 215, description: d(SOB_ENCOMENDA, INSPIRACAO) },
    ],
  },
  {
    name: "Decoração",
    items: [
      {
        name: "Vaso",
        price: 180,
        size: "Vários tamanhos",
        description: d("Valor a partir de R$ 180,00, conforme tamanho e modelo.", SOB_ENCOMENDA, INSPIRACAO),
      },
      {
        name: "Centro de Mesa Moriá",
        price: 300,
        description: d("Valor a partir de R$ 300,00, conforme tamanho e modelo.", SOB_ENCOMENDA, INSPIRACAO),
      },
      { name: "Porta Joia 15cm", price: 80, size: "15 cm", description: d(SOB_ENCOMENDA, INSPIRACAO), alsoIn: ["Presentes"] },
    ],
  },
  {
    name: "Linha Infantil",
    items: [
      {
        name: "Kit Infantil",
        price: 165,
        size: "Prato 24 cm + caneca 100 ml",
        description: d(
          "Prato infantil 24 cm + canequinha infantil 100 ml.",
          "Personalização em pintura inclusa. Escolha o seu modelo.",
          SOB_ENCOMENDA
        ),
        alsoIn: ["Presentes"],
        featured: true,
      },
    ],
  },
  // Presentes: reúne peças de outras linhas (via alsoIn).
  { name: "Presentes", items: [] },
  {
    name: "Personalização",
    items: [
      {
        name: "Personalização simples",
        price: 15,
        size: "Por peça",
        description: d(
          "Nome, data ou frase pintados na peça. Valor adicional por peça.",
          "Adicione ao pedido junto com as peças e escreva no pedido o que deseja personalizar."
        ),
      },
      {
        name: "Detalhe em ouro líquido",
        price: 30,
        size: "Por peça",
        description: d(
          "Acabamento com detalhe em ouro líquido. Valor adicional por peça.",
          "Cotações especiais: consulte."
        ),
      },
    ],
  },
  {
    name: "Projetos Especiais",
    items: [
      {
        name: "Projeto especial sob medida",
        price: null,
        description: d(
          "Projetos especiais para empresas, casamentos e ocasiões especiais.",
          "Criamos peças personalizadas para cada ocasião, de acordo com a quantidade, o modelo e a personalização desejados.",
          "Envie sua ideia ou referência e consulte valores."
        ),
      },
    ],
  },
];

// Textos da loja que vêm do catálogo (usados só onde a loja ainda está vazia).
export const CATALOGO_INFO = {
  tagline: "Peças artesanais feitas à mão",
  about:
    "Cada peça é feita manualmente com dedicação e propósito. Utilitários que tornam o cotidiano mais bonito e especial. Por Karina Corrêa.",
  address: "Niterói – RJ",
  highlights: [
    { title: "Feito à mão", text: "Pequenas variações de forma, cor e acabamento fazem parte de cada peça." },
    { title: "Produção", text: "Até 60 dias úteis, conforme a quantidade de peças e os períodos em andamento." },
    { title: "Pagamento", text: "50% na confirmação do pedido e 50% antes da entrega ou envio. Pix." },
  ],
};

export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
