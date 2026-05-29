import { Button, Card, Typography, Alert, Form, Input } from "antd";
import { useLogin } from "./useLogin";

const { Title } = Typography;

export function Login() {
  const { loading, error, handleLogin } = useLogin();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="flex justify-center w-100 shadow-md">
        <Title level={2} className="text-center mb-6!">
          Native Tech Test
        </Title>

        {error && (
          <div className="mb-4">
            <Alert title={error} type="error" showIcon />
          </div>
        )}

        <Form name="login" onFinish={handleLogin} layout="vertical" size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Por favor, insira o email!" },
              { type: "email", message: "Insira um email válido!" },
            ]}
          >
            <Input placeholder="Digite seu email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Por favor, insira a senha!" }]}
          >
            <Input.Password placeholder="Digite sua senha" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" block loading={loading}>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
