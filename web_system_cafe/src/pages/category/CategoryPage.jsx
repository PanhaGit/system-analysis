import { useEffect, useState } from "react";
import MainPage from "../../components/layouts/auth/MainPage";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import { formatDate, request } from "../../store/Configstore";
import { MdDelete, MdEdit } from "react-icons/md";
import { useForm } from "antd/es/form/Form";

const CategoryPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false, // Add modal visibility state
    currentCategory: null, // Track the category being edited (if any)
  });
  const [form] = useForm();

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const res = await request("category", "get");
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

  const onFinish = async (values) => {
    try {
      const id = state.currentCategory?.id;
      const endpoint = id ? `category/${id}` : "category";
      const method = id ? "put" : "post";

      const res = await request(endpoint, method, values);

      if (res) {
        message.success("Category saved successfully");
        setState((prev) => ({
          ...prev,
          modalVisible: false,
          currentCategory: null,
        }));
        getAll();
      }
    } catch (error) {
      message.error("Failed to save category. Please try again.", error);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      description: "Are you sure to remove this category?",
      okText: "Yes",
      onOk: async () => {
        try {
          const res = await request(`category/${id}`, "delete");
          if (res) {
            message.success(res.message);
            setState((prevState) => ({
              ...prevState,
              list: prevState.list.filter((item) => item.id !== id),
            }));
          }
        } catch (err) {
          message.error(`Failed to delete category: ${err.message}`);
        }
      },
    });
  };

  const handleAdd = () => {
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      currentCategory: null, // Reset for new category
    }));
    form.resetFields();
  };

  const handleEdit = (category) => {
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      currentCategory: category,
    }));
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <h1>Category Total: {state.list.length}</h1>
        <Button type="primary" onClick={handleAdd}>
          New Category
        </Button>
      </div>

      <Modal
        visible={state.modalVisible}
        onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
        onOk={() => form.submit()}
        title={state.currentCategory ? "Edit Category" : "Add Category"}
      >
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Category name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item
            name="status"
            label="status"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Select
              placeholder="Please Select"
              options={[
                {
                  value: 1,
                  label: "Active",
                },
                {
                  value: 0,
                  label: "UnActive",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={state.list}
        columns={[
          {
            key: "name",
            dataIndex: "name",
            title: "Name",
          },
          {
            key: "description",
            dataIndex: "description",
            title: "Description",
            render: (value) => <p className="w-72 font-battambang">{value}</p>,
          },
          {
            key: "create_by",
            dataIndex: "create_by",
            title: "Create By",
          },
          {
            key: "status",
            dataIndex: "status",
            title: "Status",
            render: (status) =>
              status === 1 ? (
                <span style={{ color: "green" }}>Active</span>
              ) : (
                <span style={{ color: "red" }}>Inactive</span>
              ),
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

export default CategoryPage;
