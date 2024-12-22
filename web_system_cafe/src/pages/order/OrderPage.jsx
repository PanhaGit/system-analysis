import { useEffect, useState } from "react";
import MainPage from "../../components/layouts/auth/MainPage";
import { Button, message, Modal, Space, Table } from "antd";
import { formatDate, request } from "../../store/Configstore";
import { LuView } from "react-icons/lu";

const OrderPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false,
    order_vuew_one: null,
  });

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const res = await request("order", "get");
      if (res && res.getAll) {
        setState((prevState) => ({
          ...prevState,
          list: res.getAll,
          loading: false,
        }));
      } else {
        message.warning("No data found.");
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    } catch (error) {
      message.error(
        "Failed to fetch categories. Please try again later.",
        error
      );
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const handleViewOne = async (id) => {
    try {
      const res = await request(`order/${id}`, "get");
      if (res) {
        setState((prev) => ({
          ...prev,
          order_vuew_one: res.order,
          modalVisible: true,
        }));
      } else {
        message.warning("Order not found.");
      }
    } catch (error) {
      message.error(`Failed to fetch order. Error: ${error.message}`);
    }
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <h1>Category Total: {state.list.length}</h1>
      </div>

      <Modal
        open={state.modalVisible}
        onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
        title="View Order"
        // footer={null}
      >
        {state.order_vuew_one ? (
          <div>
            <p>
              <strong>Customer ID:</strong> {state.order_vuew_one.customer_id}
            </p>
            <p>
              <strong>User ID:</strong> {state.order_vuew_one.user_id}
            </p>
            <p>
              <strong>Order Number:</strong> {state.order_vuew_one.order_num}
            </p>
            <p>
              <strong>Paid Amount:</strong> {state.order_vuew_one.paid_amount}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {state.order_vuew_one.payment_method}
            </p>
            <p>
              <strong>Remark:</strong> {state.order_vuew_one.remark}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {formatDate(state.order_vuew_one.created_at)}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      <Table
        dataSource={state.list}
        columns={[
          {
            key: "customer_id",
            dataIndex: "customer_id",
            title: "customer_id",
          },
          {
            key: "user_id",
            dataIndex: "user_id",
            title: "user_id",
          },
          {
            key: "order_num",
            dataIndex: "order_num",
            title: "order_num",
          },
          {
            key: "paid_amount",
            dataIndex: "paid_amount",
            title: "paid_amount",
          },
          {
            key: "payment_method",
            dataIndex: "payment_method",
            title: "payment_method",
          },
          {
            key: "remark",
            dataIndex: "remark",
            title: "remark",
          },
          {
            key: "create_by",
            dataIndex: "create_by",
            title: "Create By",
          },
          {
            key: "created_at",
            dataIndex: "created_at",
            title: "Created At",
            render: (value) => formatDate(value),
          },
          {
            title: "Action",
            key: "action",
            render: (item) => (
              <Space>
                <Button
                  type="primary"
                  icon={<LuView />}
                  onClick={() => handleViewOne(item.id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default OrderPage;
