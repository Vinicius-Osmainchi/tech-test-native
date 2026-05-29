import { Card, Row, Col, Statistic, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "./useDashboard";
import { EnvironmentOutlined } from "@ant-design/icons";

export function Dashboard() {
  const { data, loading, error } = useDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard de Clientes</h1>

      {error && (
        <div className="mb-6">
          <Alert title={error} type="error" showIcon />
        </div>
      )}

      <Row gutter={[16, 16]}>
        {data.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.city}>
            <Card
              hoverable
              className="transition-all duration-200 hover:-translate-y-1 shadow-sm"
              onClick={() => navigate(`/city/${encodeURIComponent(item.city)}`)}
            >
              <Statistic
                title={
                  <span className="flex items-center gap-2 text-gray-500 font-medium">
                    <EnvironmentOutlined className="text-blue-500" />
                    {item.city}
                  </span>
                }
                value={item.customers_total}
                suffix={<span className="text-xs text-gray-400 font-normal">clientes</span>}
                valueStyle={{ color: "#1f2937", fontWeight: "bold" }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
