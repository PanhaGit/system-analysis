import { useEffect, useState } from "react";
import { request } from "../../store/Configstore";
import { Row, Col, Card } from "antd";
import MainPage from "../../components/layouts/auth/MainPage";

const DashboardPage = () => {
  const [state, setState] = useState({
    customer: [],
    employees: [],
    order: [],
    product: [],
    category: [],
    loading: true,
  });

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      const res = await request("dashboard", "get");
      if (res) {
        setState((pre) => ({
          ...pre,
          customer: res.customer,
          employees: res.employees,
          order: res.order,
          product: res.product,
          category: res.category,
          loading: false,
        }));
      }
    } catch (err) {
      console.log(err);
      console.error(err);
    }
  };

  // Calculate gender counts
  const maleCount = state.employees.filter((emp) => emp.gender === 1).length;
  const femaleCount = state.employees.filter((emp) => emp.gender === 0).length;

  const cardData = [
    {
      title: "Customer List",
      count: state.customer.length,
      bgColor: "#ff9800",
    },
    {
      title: "Employees",
      count: `${state.employees.length} (Male: ${maleCount}, Female: ${femaleCount})`,
      bgColor: "#4caf50",
    },
    { title: "Orders", count: state.order.length, bgColor: "#2196f3" },
    { title: "Products", count: state.product.length, bgColor: "#9c27b0" },
    { title: "Categories", count: state.category.length, bgColor: "#f44336" },
  ];

  return (
    <MainPage loading={state.loading}>
      <div>
        <Row gutter={[16, 16]} className="p-4">
          {cardData.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                style={{
                  backgroundColor: item.bgColor,
                  color: "#fff",
                  border: "none",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <h1 className="text-white font-bold text-xl mb-4">
                  {item.title}
                </h1>
                <p className="text-white text-lg font-semibold">
                  {item.count} {index === 0 || index === 1 ? "នាក់" : "items"}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </MainPage>
  );
};

export default DashboardPage;
