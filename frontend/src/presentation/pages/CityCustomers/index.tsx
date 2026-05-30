import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Alert } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCityCustomers } from "./useCityCustomers";

export function CityCustomers() {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const { data, total, loading, error, currentPage, pageSize, handlePageChange } =
    useCityCustomers(cityName);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Nome", dataIndex: "first_name", key: "first_name" },
    { title: "Sobrenome", dataIndex: "last_name", key: "last_name" },
    { title: "E-mail", dataIndex: "email", key: "email" },
    { title: "Empresa", dataIndex: "company", key: "company" },
    { title: "Cargo", dataIndex: "title", key: "title" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/dashboard")}>
          Voltar para o Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 m-0">Clientes em {cityName}</h1>
      </div>

      {error && (
        <div className="mb-6">
          <Alert title={error} type="error" showIcon />
        </div>
      )}

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        onRow={(record) => ({
          onClick: () => navigate(`/customer/${record.id}`),
          className: "cursor-pointer hover:bg-gray-50",
        })}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        className="shadow-sm border border-gray-100 rounded-lg"
      />
    </div>
  );
}
