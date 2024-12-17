import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { request } from "../../store/Configstore";
import dayjs from "dayjs";
import { MdDelete, MdEdit } from "react-icons/md";
import { useForm } from "antd/es/form/Form";
import MainPage from "../../components/layouts/auth/MainPage";

const EmployeesPage = () => {
  const [state, setState] = useState({
    list: [],
    modal: false,
    loading: false,
  });
  const [formRef] = useForm();

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      const res = await request("employees", "get");
      if (res) {
        setState((prev) => ({
          ...prev,
          list: res.employees,
          loading: false, // Set loading to false after fetching data
        }));
      }
    } catch (err) {
      message.error(err?.message || "Failed to fetch employees");
    }
  };

  const formatDate = (value) => dayjs(value).format("YYYY-MMM-DD");

  const onOpenModal = (item = null) => {
    setState((prev) => ({
      ...prev,
      modal: true,
      loading: false, // Ensure loading is set to false before opening the modal
    }));
    formRef.resetFields();

    if (item) {
      formRef.setFieldsValue({
        name: item.name || "",
        dob: item.dob ? dayjs(item.dob) : null,
        salary: item.salary || 0,
        bonus: item.bonus || 0,
        gender: item.gender || null,
        employment_date: item.employment_date
          ? dayjs(item.employment_date)
          : null,
        id: item.id,
      });
    }
  };

  const onCloseModal = () => {
    setState((prev) => ({
      ...prev,
      modal: false,
      loading: false, // Set loading to false when modal is closed
    }));
  };

  const onFinish = async (values) => {
    try {
      const id = formRef.getFieldValue("id"); // Get the ID
      const payload = {
        ...values,
        employment_date: values.employment_date
          ? dayjs(values.employment_date).format("YYYY-MM-DD")
          : undefined,
        dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : undefined,
      };

      const endpoint = id ? `employees/${id}` : "employees";
      const method = id ? "put" : "post";

      const res = await request(endpoint, method, payload);

      if (res) {
        message.success(
          id ? "Employee updated successfully" : "Employee added successfully"
        );
        getAll();
        onCloseModal();
      } else {
        message.error("Error in adding/updating employee");
      }
    } catch (err) {
      message.error(`Failed to add/update employee: ${err.message}`);
    }
  };

  const handleClickEdit = (item) => {
    onOpenModal(item);
  };

  const handleClickDelete = async (data) => {
    Modal.confirm({
      title: "Are you sure?",
      description: "Are you sure to remove?",
      okText: "Yes",
      onOk: async () => {
        try {
          const res = await request(`employees/${data.id}`, "delete");
          if (res) {
            message.success(res.message);
            setState((prevState) => ({
              ...prevState,
              list: prevState.list.filter((item) => item.id !== data.id),
            }));
          }
        } catch (err) {
          message.error(`Failed to delete employee: ${err.message}`);
        }
      },
    });
  };

  return (
    <MainPage loading={state.loading}>
      <div className="flex justify-between items-center py-2">
        <h1>បុគ្គលិកសរុប : {state.list.length}</h1>
        <Button
          type="primary"
          className="font-battambang"
          onClick={() => onOpenModal()} // Open modal for adding a new employee
        >
          បញ្ចូលបុគ្គលិកថ្មី
        </Button>
      </div>

      <Modal
        title={
          formRef.getFieldValue("id")
            ? "កែសម្រួលបុគ្គលិក"
            : "បញ្ចូលបុគ្គលិកថ្មី"
        }
        open={state.modal}
        footer={null}
        onCancel={onCloseModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input placeholder="Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="DOB" name="dob">
                <DatePicker placeholder="DOB" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Salary" name="salary">
                <InputNumber placeholder="Salary" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Bonus" name="bonus">
                <InputNumber placeholder="Bonus" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Gender" name="gender">
                <Select placeholder="Please select gender">
                  <Select.Option value={1}>Male</Select.Option>
                  <Select.Option value={0}>Female</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Employment Date" name="employment_date">
                <DatePicker
                  placeholder="Employment Date"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Space style={{ marginTop: 16 }}>
            <Button onClick={onCloseModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* Table for displaying employees */}
      <Table
        dataSource={state.list}
        loading={state.loading} // Show loading spinner while fetching data
        pagination={{
          pageSize: 7,
        }}
        columns={[
          {
            title: "Name",
            key: "name",
            dataIndex: "name",
          },
          {
            title: "Employment Date",
            key: "employment_date",
            dataIndex: "employment_date",
            render: (value) => formatDate(value),
          },
          {
            title: "Salary",
            key: "salary",
            dataIndex: "salary",
          },
          {
            title: "Bonus",
            key: "bonus",
            dataIndex: "bonus",
          },
          {
            title: "DOB",
            key: "dob",
            dataIndex: "dob",
            render: (value) => formatDate(value),
          },
          {
            title: "Gender",
            key: "gender",
            dataIndex: "gender",
            render: (value) => (value ? "Male" : "Female"),
          },
          {
            title: "Created By",
            key: "create_by",
            dataIndex: "create_by",
          },
          {
            title: "Created At",
            key: "created_at",
            dataIndex: "created_at",
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
                  onClick={() => handleClickEdit(item)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => handleClickDelete(item)}
                />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default EmployeesPage;
