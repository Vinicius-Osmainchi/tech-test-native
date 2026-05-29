import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Spin } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useCustomerDetails } from "./useCustomerDetails";

export function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { form, loading, saving, error, success, onFinish } = useCustomerDetails(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 m-0">Editar Cliente #{id}</h1>
      </div>

      {error && (
        <div className="mb-4">
          <Alert title={error} type="error" showIcon />
        </div>
      )}

      {success && (
        <div className="mb-4">
          <Alert title="Cliente atualizado com sucesso!" type="success" showIcon />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="first_name" label="Nome" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="last_name" label="Sobrenome" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="email" label="E-mail" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="company" label="Empresa">
              <Input />
            </Form.Item>

            <Form.Item name="title" label="Cargo">
              <Input />
            </Form.Item>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
              Salvar Alterações
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
