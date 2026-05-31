export const apiErrorCodes = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

const apiErrorMessages: Record<string, string> = {
  [apiErrorCodes.INVALID_CREDENTIALS]: "E-mail ou senha incorretos.",
  [apiErrorCodes.INTERNAL_SERVER_ERROR]:
    "Não foi possível concluir o login. Tente novamente mais tarde.",
};

export const validationMessages = {
  emailRequired: "Por favor, insira o e-mail.",
  emailInvalid: "Insira um e-mail válido.",
  passwordRequired: "Por favor, insira a senha.",
  firstNameRequired: "Por favor, insira o nome.",
  lastNameRequired: "Por favor, insira o sobrenome.",
};

export const uiMessages = {
  loginFailed: "Não foi possível realizar o login. Tente novamente.",
  dashboardLoadFailed: "Não foi possível carregar os dados do dashboard.",
  cityCustomersLoadFailed: "Não foi possível carregar os clientes desta cidade.",
  customerLoadFailed: "Não foi possível carregar os detalhes do cliente.",
  customerUpdateFailed: "Não foi possível atualizar o cliente.",
  customerUpdateSuccess: "Cliente atualizado com sucesso!",
};

interface ApiErrorBody {
  code?: string;
  error?: string;
}

export function resolveApiErrorMessage(data: ApiErrorBody | undefined, fallback: string): string {
  if (!data) {
    return fallback;
  }

  if (data.code && apiErrorMessages[data.code]) {
    return apiErrorMessages[data.code];
  }

  return fallback;
}
