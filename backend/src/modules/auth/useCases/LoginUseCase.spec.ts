import { LoginUseCase } from "./LoginUseCase";
import { apiErrorCodes } from "../../../shared/errors/apiErrorCodes";

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    loginUseCase = new LoginUseCase();
    process.env.ADMIN_EMAIL = "admin@email.com";
    process.env.ADMIN_PASSWORD = "admin";
    process.env.JWT_SECRET = "test_secret";
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.JWT_SECRET;
  });

  it("should generate a token with valid credentials", async () => {
    const result = await loginUseCase.execute({
      email: "admin@email.com",
      password: "admin",
    });

    expect(result).toHaveProperty("token");
    expect(typeof result.token).toBe("string");
    expect(result.token.split(".")).toHaveLength(3);
  });

  it("should reject invalid email", async () => {
    await expect(
      loginUseCase.execute({ email: "wrong@email.com", password: "admin" }),
    ).rejects.toMatchObject({
      message: "Invalid credentials",
      statusCode: 401,
      code: apiErrorCodes.INVALID_CREDENTIALS,
    });
  });

  it("should reject invalid password", async () => {
    await expect(
      loginUseCase.execute({ email: "admin@email.com", password: "wrong" }),
    ).rejects.toMatchObject({
      message: "Invalid credentials",
      statusCode: 401,
      code: apiErrorCodes.INVALID_CREDENTIALS,
    });
  });

  it("should throw when JWT_SECRET is not defined", async () => {
    delete process.env.JWT_SECRET;

    await expect(
      loginUseCase.execute({ email: "admin@email.com", password: "admin" }),
    ).rejects.toMatchObject({
      message: "JWT_SECRET is not defined",
      statusCode: 500,
    });
  });

  it("should throw when ADMIN_EMAIL or ADMIN_PASSWORD is not defined", async () => {
    delete process.env.ADMIN_EMAIL;

    await expect(
      loginUseCase.execute({ email: "admin@email.com", password: "admin" }),
    ).rejects.toMatchObject({
      message: "ADMIN_EMAIL or ADMIN_PASSWORD is not defined",
      statusCode: 500,
    });
  });
});
