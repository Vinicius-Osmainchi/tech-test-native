import request from "supertest";
import { app } from "../../../shared/infra/http/app";

describe("LoginController", () => {
  beforeEach(() => {
    process.env.ADMIN_EMAIL = "admin@admin.com";
    process.env.ADMIN_PASSWORD = "admin";
    process.env.JWT_SECRET = "test_secret";
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.JWT_SECRET;
  });

  it("should be able to authenticate and return a valid token", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@admin.com",
      password: "admin",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 401 when using invalid credentials", async () => {
    const response = await request(app).post("/login").send({
      email: "wrong@admin.com",
      password: "admin",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
});
