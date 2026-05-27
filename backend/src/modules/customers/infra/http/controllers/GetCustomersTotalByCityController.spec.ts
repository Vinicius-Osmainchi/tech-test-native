import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../../../../shared/infra/http/app";
import { prisma } from "../../../../../shared/infra/database/prisma/client";

describe("GetCustomersTotalByCityController", () => {
  let token: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = "test_secret";
    token = jwt.sign({ role: "admin" }, "test_secret", { expiresIn: "1d" });

    await prisma.customer.deleteMany({
      where: { email: { contains: "@test.com" } },
    });

    await prisma.customer.createMany({
      data: [
        { first_name: "Integration", last_name: "A", email: "1@test.com", city: "Test City A" },
        { first_name: "Integration", last_name: "B", email: "2@test.com", city: "Test City A" },
        { first_name: "Integration", last_name: "C", email: "3@test.com", city: "Test City B" },
      ],
    });
  });

  afterAll(async () => {
    await prisma.customer.deleteMany({
      where: { email: { contains: "@test.com" } },
    });

    await prisma.$disconnect();
    delete process.env.JWT_SECRET;
  });

  it("should be able to get metrics grouped by city via API", async () => {
    const response = await request(app)
      .get("/customers/metrics/by-city")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ city: "Test City A", customers_total: 2 }),
        expect.objectContaining({ city: "Test City B", customers_total: 1 }),
      ]),
    );
  });
});
