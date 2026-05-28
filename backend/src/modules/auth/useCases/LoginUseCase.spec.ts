import { LoginUseCase } from './LoginUseCase';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    loginUseCase = new LoginUseCase();
    
    process.env.ADMIN_EMAIL = 'admin@admin.com';
    process.env.ADMIN_PASSWORD = 'admin';
    process.env.JWT_SECRET = 'test_secret';
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.JWT_SECRET;
  });

  it('should be able to generate a token with valid credentials', async () => {
    const result = await loginUseCase.execute({
      email: 'admin@email.com',
      password: 'admin'
    });

    expect(result).toHaveProperty('token');
    expect(typeof result.token).toBe('string');
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      loginUseCase.execute({ email: 'wrong@email.com', password: 'admin' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should not be able to authenticate with wrong password', async () => {
    await expect(
      loginUseCase.execute({ email: 'admin@admin.com', password: 'wrong' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error if JWT_SECRET is not defined', async () => {
    delete process.env.JWT_SECRET;

    await expect(
      loginUseCase.execute({ email: 'admin@email.com', password: 'admin' })
    ).rejects.toThrow('JWT_SECRET is not defined');
  });
});