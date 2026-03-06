export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Mini Fintech API",
    version: "1.0.0",
    description: "API para processamento de transacoes financeiras com arquitetura hexagonal"
  },
  servers: [{ url: "/api", description: "Base path local" }],
  tags: [
    { name: "Users" },
    { name: "Cards" },
    { name: "Transactions" },
    { name: "Invoices" }
  ],
  components: {
    parameters: {
      transactionId: {
        name: "transactionId",
        in: "path",
        required: true,
        schema: { type: "string" }
      },
      cardId: {
        name: "cardId",
        in: "path",
        required: true,
        schema: { type: "string" }
      }
    },
    schemas: {
      // ... todos os schemas permanecem iguais
    }
  },
  paths: {
    "/users": { /* ... */ },
    "/cards": { /* ... */ },
    "/transactions": { /* ... */ },
    "/transactions/{transactionId}/cancel": {
      post: {
        tags: ["Transactions"],
        summary: "Cancelar transacao",
        parameters: [{ $ref: "#/components/parameters/transactionId" }],
        responses: {
          "200": {
            description: "Transacao cancelada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" }
              }
            }
          }
        }
      }
    },
    "/transactions/{transactionId}/chargeback": {
      post: {
        tags: ["Transactions"],
        summary: "Simular chargeback",
        parameters: [{ $ref: "#/components/parameters/transactionId" }],
        responses: {
          "200": {
            description: "Chargeback aplicado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" }
              }
            }
          }
        }
      }
    },
    "/cards/{cardId}/invoice": {
      get: {
        tags: ["Invoices"],
        summary: "Gerar ou consultar fatura mensal",
        parameters: [
          { $ref: "#/components/parameters/cardId" },
          {
            name: "referenceMonth",
            in: "query",
            required: true,
            schema: { type: "string", example: "2026-03" }
          }
        ],
        responses: {
          "200": {
            description: "Fatura do mes",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InvoiceResponse" }
              }
            }
          }
        }
      }
    }
  }
} as const;