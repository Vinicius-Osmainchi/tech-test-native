import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../../shared/infra/http/app";
import { prisma } from "../../../shared/infra/database/prisma/client";

describe("ListCustomersByCityController", () => {
  let token: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = "test_secret";
    token = jwt.sign({ role: "admin" }, "test_secret", { expiresIn: "1d" });

    await prisma.customer.deleteMany({
      where: { email: { contains: "@paginated.com" } },
    });

    const customersToCreate = Array.from({ length: 15 }).map((_, index) => ({
      first_name: `Integration ${index}`,
      last_name: "Test",
      email: `int${index}@paginated.com`,
      city: "Paginated City",
    }));

    await prisma.customer.createMany({
      data: customersToCreate,
    });
  });

  afterAll(async () => {
    await prisma.customer.deleteMany({
      where: { email: { contains: "@paginated.com" } },
    });
    await prisma.$disconnect();
    delete process.env.JWT_SECRET;
  });

  it("should be able to list customers by city with pagination via API", async () => {
    const response = await request(app)
      .get("/customers")
      .query({ city: "Paginated City", page: 1, limit: 10 })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.customers).toHaveLength(10);
    expect(response.body.total).toBe(15);
  });

  it("should return 400 if city is not provided in query", async () => {
    const response = await request(app)
      .get("/customers")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("City is required");
  });
});
