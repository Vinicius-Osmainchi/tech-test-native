export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Tech Test Native — API",
    description:
      "API REST para consulta e edição de clientes. Autenticação JWT obrigatória nas rotas de clientes.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
      description:
        "Mesma origem do Swagger (use http://localhost:8080/docs no Docker ou http://localhost:3000/docs local)",
    },
  ],
  tags: [
    { name: "Auth", description: "Autenticação" },
    { name: "Customers", description: "Clientes" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@email.com" },
          password: { type: "string", example: "admin" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      CityTotal: {
        type: "object",
        properties: {
          city: { type: "string", example: "Warner, NH" },
          customers_total: { type: "integer", example: 20 },
        },
      },
      CustomerListItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          first_name: { type: "string" },
          last_name: { type: "string" },
          email: { type: "string", format: "email" },
          gender: { type: "string" },
          company: { type: "string" },
          title: { type: "string" },
          city_id: { type: "integer" },
        },
      },
      CustomerDetail: {
        type: "object",
        properties: {
          id: { type: "integer" },
          first_name: { type: "string" },
          last_name: { type: "string" },
          email: { type: "string", format: "email" },
          gender: { type: "string" },
          company: { type: "string" },
          city: { type: "string" },
          title: { type: "string" },
        },
      },
      UpdateCustomerRequest: {
        type: "object",
        properties: {
          first_name: { type: "string" },
          last_name: { type: "string" },
          email: { type: "string", format: "email" },
          gender: { type: "string" },
          company: { type: "string" },
          city: { type: "string" },
          title: { type: "string" },
        },
      },
      PaginatedCustomers: {
        type: "object",
        properties: {
          customers: {
            type: "array",
            items: { $ref: "#/components/schemas/CustomerListItem" },
          },
          total: { type: "integer" },
        },
      },
    },
  },
  paths: {
    "/login": {
      post: {
        tags: ["Auth"],
        summary: "Autenticar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Token JWT",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          "401": {
            description: "Credenciais inválidas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/customers/totals-by-city": {
      get: {
        tags: ["Customers"],
        summary: "Total de clientes por cidade",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de totais",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/CityTotal" },
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/customers": {
      get: {
        tags: ["Customers"],
        summary: "Listar clientes por cidade (paginado)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "city",
            in: "query",
            required: true,
            schema: { type: "string" },
            example: "Warner, NH",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10, minimum: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Clientes paginados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedCustomers" },
              },
            },
          },
          "400": {
            description: "Parâmetros inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/customers/{id}": {
      get: {
        tags: ["Customers"],
        summary: "Consultar cliente por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Detalhes do cliente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CustomerDetail" },
              },
            },
          },
          "404": {
            description: "Cliente não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Customers"],
        summary: "Atualizar cliente",
        description: "Emite o evento WebSocket `customer_updated` após sucesso.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCustomerRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Cliente atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CustomerDetail" },
              },
            },
          },
          "404": {
            description: "Cliente não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
} as const;
