import { useEffect, useState } from "react";
import MainPage from "../../components/layouts/auth/MainPage";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import { formatDate, request } from "../../store/Configstore";
import { MdDelete, MdEdit } from "react-icons/md";
import { useForm } from "antd/es/form/Form";

const CustomerPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false,
    currentCategory: null,
  });
  const [form] = useForm();

  useEffect(() => {
    getAll();
  }, []);

  // Function to fetch all customers
  const getAll = async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const res = await request("customer", "get");
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
      message.error("Failed to fetch customers. Please try again later.");
      console.error("Error fetching customers:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  // Function to handle form submission
  const onFinish = async (values) => {
    try {
      const id = state.currentCategory?.id; // Keep this as currentCategory
      const endpoint = id ? `customer/${id}` : "customer";
      const method = id ? "put" : "post";

      const res = await request(endpoint, method, values);

      if (res) {
        message.success("Customer saved successfully");
        setState((prev) => ({
          ...prev,
          modalVisible: false,
          currentCategory: null, // Reset currentCategory after saving
        }));
        getAll();
      }
    } catch (error) {
      console.error("Error while saving customer:", error);
      message.error("Failed to save customer. Please try again.");
    }
  };

  // Function to handle deletion of a customer
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      description: "Are you sure to remove this customer?",
      okText: "Yes",
      onOk: async () => {
        try {
          const res = await request(`customer/${id}`, "delete");
          if (res) {
            message.success(res.message);
            setState((prevState) => ({
              ...prevState,
              list: prevState.list.filter((item) => item.id !== id),
            }));
          }
        } catch (err) {
          message.error(`Failed to delete customer: ${err.message}`);
        }
      },
    });
  };

  // Function to handle adding a new customer
  const handleAdd = () => {
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      currentCategory: null, // Reset for new customer
    }));
    form.resetFields();
  };

  // Function to handle editing a customer
  const handleEdit = (customer) => {
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      currentCategory: customer,
    }));
    form.setFieldsValue({
      name: customer.name,
      tel: customer.tel,
      email: customer.email,
      address: customer.address,
    });
  };

  return (
    <MainPage loading={state.loading}>
      <div className="flex items-center justify-between py-2">
        <h1>Customer Total: {state.list.length}</h1>
        <Button type="primary" onClick={handleAdd}>
          Add Customer
        </Button>
      </div>

      {/* Modal for Add/Edit Customer */}
      <Modal
        visible={state.modalVisible}
        onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
        onOk={() => form.submit()}
        title={state.currentCategory ? "Edit Customer" : "Add Customer"}
      >
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Customer Name"
            rules={[{ required: true, message: "Please enter customer name" }]}
          >
            <Input placeholder="Customer name" />
          </Form.Item>

          <Form.Item
            name="tel"
            label="Telephone"
            rules={[{ required: true, message: "Please enter telephone" }]}
          >
            <Input placeholder="Telephone" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Table for displaying customers */}
      <Table
        dataSource={state.list}
        columns={[
          {
            key: "name",
            dataIndex: "name",
            title: "Name",
          },
          {
            key: "tel",
            dataIndex: "tel",
            title: "Telephone",
          },
          {
            key: "email",
            dataIndex: "email",
            title: "Email",
          },
          {
            key: "address",
            dataIndex: "address",
            title: "Address",
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
                  icon={<MdEdit />}
                  onClick={() => handleEdit(item)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => handleDelete(item.id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default CustomerPage;
