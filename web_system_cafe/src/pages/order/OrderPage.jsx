import { useEffect, useState } from "react";
import MainPage from "../../components/layouts/auth/MainPage";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import { request } from "../../store/Configstore";
import { LuView } from "react-icons/lu";
import dayjs from "dayjs";

const OrderPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false,
    order_vuew_one: [],
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
      const res = await request(`order_detail/${id}`, "get");
      console.log(res);
      if (res) {
        setState((prev) => ({
          ...prev,
          order_vuew_one: res.get_one,

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
        className="w-full overflow-hidden"
        open={state.modalVisible}
        onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
        title="View Order"
      >
        <Table
          className="overflow-x-auto"
          dataSource={state.order_vuew_one}
          columns={[
            {
              key: "p_category_name",
              dataIndex: "p_category_name",
              title: "Category Name",
            },
            {
              key: "user_name",
              dataIndex: "user_name",
              title: "Username",
            },
            {
              key: "order_num",
              dataIndex: "order_num",
              title: "Order Number",
            },
            {
              key: "paid_amount",
              dataIndex: "paid_amount",
              title: "Paid Amount",
            },
            {
              key: "payment_method",
              dataIndex: "payment_method",
              title: "Payment Method",
            },
            {
              key: "remark",
              dataIndex: "remark",
              title: "Remark",
            },
            {
              key: "created_at",
              dataIndex: "created_at",
              title: "Created At",
              render: (val) => {
                return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
              },
            },
          ]}
          pagination={false}
        />
      </Modal>

      <Table
        dataSource={state.list}
        columns={[
          {
            key: "customer_name",
            dataIndex: "customer_name",
            title: "Customer Name",
          },
          {
            key: "user_name",
            dataIndex: "user_name",
            title: "Name",
          },
          {
            key: "order_num",
            dataIndex: "order_num",
            title: "Order NO",
          },
          {
            key: "paid_amount",
            dataIndex: "paid_amount",
            title: "Paid Amount",
          },
          {
            key: "ayment_method",
            dataIndex: "payment_method",
            title: "Payment Method",
          },
          {
            key: "remark",
            dataIndex: "remark",
            title: "Remark",
          },
          {
            key: "create_by",
            dataIndex: "create_by",
            title: "Create By",
            render: (val) => {
              return <Tag color="geekblue">{val}</Tag>;
            },
          },
          {
            key: "created_at",
            dataIndex: "created_at",
            title: "Order Time",
            render: (value) => {
              return dayjs(value).format("YYYY-MM-DD HH:mm A");
            },
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
