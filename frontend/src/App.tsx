import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import { AppRoutes } from "./presentation/routes";

export function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <div className="min-h-screen bg-gray-100">
        <AppRoutes />
      </div>
    </ConfigProvider>
  );
}
