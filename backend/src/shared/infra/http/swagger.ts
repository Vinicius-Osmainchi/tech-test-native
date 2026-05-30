import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/openapi";

function getDocumentForRequest(request: Request) {
  const protocol = request.protocol;
  const host = request.get("host");

  return {
    ...openApiDocument,
    servers: [{ url: `${protocol}://${host}`, description: "Servidor atual" }],
  };
}

export function setupSwagger(app: Express): void {
  app.get("/docs/openapi.json", (request: Request, response: Response) => {
    response.json(getDocumentForRequest(request));
  });

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      swaggerOptions: {
        url: "/docs/openapi.json",
        persistAuthorization: true,
      },
    }),
  );
}
