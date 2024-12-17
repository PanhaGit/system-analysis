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
  Upload,
  Image,
  Row,
  Col,
} from "antd";
import { request } from "../../store/Configstore";
import { MdDelete, MdEdit } from "react-icons/md";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

const ProductPage = () => {
  const [state, setState] = useState({
    loading: true,
    list: [],
    category: [],
    modal: false,
  });
  const [formRef] = useForm();
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    getAll();
    getCategory();
  }, []);

  const formatDate = (value) => dayjs(value).format("YYYY-MMM-DD");
  const getCategory = async () => {
    try {
      const res = await request("category", "get");
      if (res) {
        setState((pre) => ({
          ...pre,
          category: res.getAll,
          loading: false,
        }));
      }
    } catch (error) {
      message.error(error);
    }
  };
  const getAll = async () => {
    try {
      const res = await request("product", "get");
      if (res) {
        setState((pre) => ({
          ...pre,
          list: res.getAll,
          loading: false,
        }));
      }
    } catch (error) {
      message.error(error);
    }
  };

  const onClickOpenModal = () => {
    setState((pre) => ({
      ...pre,
      modal: true,
    }));
  };

  // Image Preview
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const onFinish = async (item) => {
    try {
      var params = new FormData();
      params.append("name", item.name);
      params.append("category_id", item.category_id);
      params.append("qty", item.qty);
      params.append("product_in", item.product_in);
      params.append("product_out", item.product_out);
      params.append("description", item.description);
      params.append("discount", item.discount);
      params.append("id", formRef.getFieldValue("id"));
      params.append("image", formRef.getFieldValue("image"));

      if (item.image && item.image.file) {
        if (item.image.file.status === "removed") {
          params.append("image_remove", "1");
        } else if (item.image.file.originFileObj) {
          params.append(
            "image",
            item.image.file.originFileObj,
            item.image.file.name
          );
        }
      }

      const res = await request("product", "post", params);
      console.log(res); // Log the response from the server
      if (res.success) {
        message.success("Product added successfully");
        setState((prev) => ({ ...prev, modal: false }));
        getAll();
      } else {
        message.error("Failed to add product");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      description: "Are you sure to remove?",
      okText: "Yes",
      onOk: async () => {
        try {
          const res = await request(`product/${id}`, "delete");
          if (res) {
            message.success(res.message);
            setState((prevState) => ({
              ...prevState,
              list: prevState.list.filter((item) => item.id !== id),
            }));
          }
        } catch (err) {
          message.error(`Failed to delete product: ${err.message}`);
        }
      },
    });
  };

  const handleEdit = (item) => {
    alert(JSON.stringify(item));
    // setState((prev) => ({
    //   ...prev,
    //   modal: true,
    // }));
  };

  return (
    <MainPage loading={state.loading}>
      <div className="flex justify-between items-center p-4 my-2 bg-white rounded-md">
        <p className="text-lg font-semibold font-battambang">
          ចំនួនផលិតផល : {state.list.length}
        </p>

        <Input.Search
          placeholder="ស្វែងរកផលិតផល..."
          onSearch={(value) => console.log("Search:", value)}
          className="w-1/3"
        />

        <Button
          type="primary"
          className="font-battambang"
          onClick={onClickOpenModal}
        >
          បង្កើតផលិតផលថ្មី
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title="Add Product"
        footer={null}
        open={state.modal}
        onCancel={() => setState((prev) => ({ ...prev, modal: false }))}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  { required: true, message: "Please input the product name!" },
                ]}
              >
                <Input placeholder="Name of the product" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="category_id"
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Select placeholder="Select category">
                  {state.category?.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Quantity"
                name="qty"
                rules={[
                  { required: true, message: "Please input the quantity!" },
                ]}
              >
                <Input placeholder="Quantity" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Product In"
                name="product_in"
                rules={[
                  { required: true, message: "Please input the product in!" },
                ]}
              >
                <Input placeholder="Product in" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Product Out"
                name="product_out"
                rules={[
                  { required: true, message: "Please input the product out!" },
                ]}
              >
                <Input placeholder="Product out" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Discount" name="discount">
                <Input placeholder="Discount" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Description" name="description">
                <Input.TextArea placeholder="Product description" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Product Image"
                name={"image"}
                rules={[
                  { required: true, message: "Please input the product name!" },
                ]}
              >
                <Upload
                  customRequest={(op) => {
                    op.onSuccess();
                  }}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  maxCount={1}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
              </Form.Item>
              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Col>
          </Row>

          <Space>
            <Button
              htmlType="button"
              onClick={() => setState((prev) => ({ ...prev, modal: false }))}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* Table */}
      <Table
        dataSource={state.list}
        columns={[
          {
            key: "name",
            dataIndex: "name",
            title: "Name",
          },
          {
            key: "category_id",
            dataIndex: "category_id",
            title: "Category",
          },
          {
            key: "qty",
            dataIndex: "qty",
            title: "Qty",
          },
          {
            key: "product_in",
            dataIndex: "product_in",
            title: "Product In",
          },
          {
            key: "product_out",
            dataIndex: "product_out",
            title: "Product Out",
          },
          {
            key: "image",
            dataIndex: "image",
            title: "Image",
            render: (value) =>
              value ? (
                <Image
                  style={{ width: 50 }}
                  src={"http://localhost/laravel_api_image/" + value}
                />
              ) : (
                <div
                  style={{ backgroundColor: "#EEE", width: 40, height: 40 }}
                ></div>
              ),
          },
          {
            key: "description",
            dataIndex: "description",
            title: "Description",
            render: (value) => <p className="w-52 font-battambang">{value}</p>,
          },
          {
            key: "discount",
            dataIndex: "discount",
            title: "Discount",
          },
          {
            key: "create_by",
            dataIndex: "create_by",
            title: "Created By",
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

export default ProductPage;
