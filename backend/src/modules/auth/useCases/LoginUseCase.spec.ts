import { LoginUseCase } from "./LoginUseCase";

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    loginUseCase = new LoginUseCase();
    process.env.JWT_SECRET = "test_secret";
  });

  afterEach(() => {
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
    ).rejects.toThrow("Invalid credentials");
  });

  it("should reject invalid password", async () => {
    await expect(
      loginUseCase.execute({ email: "admin@email.com", password: "wrong" }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("should throw when JWT_SECRET is not defined", async () => {
    delete process.env.JWT_SECRET;

    await expect(
      loginUseCase.execute({ email: "admin@email.com", password: "admin" }),
    ).rejects.toThrow("JWT_SECRET is not defined");
  });
});
