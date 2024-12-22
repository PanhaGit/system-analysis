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
import { formatDate, request } from "../../store/Configstore";
import { MdDelete, MdEdit } from "react-icons/md";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { Config } from "../../util/Config";

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
  const [filter, setFilter] = useState({
    search: "",
    category_id: "",
  });

  useEffect(() => {
    getAll();
    getCategory();
  }, []);

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
      const param = {
        ...filter,
      };
      const res = await request("product", "get", param);
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
  //seacrh
  const onFilter = () => {
    getAll();
  };
  const onClickOpenModal = () => {
    setState((pre) => ({
      ...pre,
      modal: true,
    }));

    formRef.resetFields();
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
      const id = formRef.getFieldValue("id");
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("category_id", item.category_id);
      formData.append("qty", item.qty || "");
      formData.append("product_in", item.product_in || "");
      formData.append("product_out", item.product_out || "");
      formData.append("description", item.description || "");
      formData.append("discount", item.discount || "");
      formData.append("id", id);

      // Check if the image exists and is valid
      if (item.image && item.image.file) {
        if (item.image.file.status === "removed") {
          // image_remove this key
          formData.append("image_remove", "1");
        } else if (item.image.file.originFileObj) {
          formData.append(
            "image",
            item.image.file.originFileObj,
            item.image.file.name
          );
        }
      }

      var url = "product";
      var method = "post";
      if (formRef.getFieldValue("id") != undefined) {
        url += "/" + formRef.getFieldValue("id");
        method = "post";

        formData.append("_method", "put");
      }
      setState((pre) => ({
        ...pre,
        loading: true,
      }));
      const res = await request(url, method, formData);

      if (res) {
        message.success(res.message);
        setState((prev) => ({ ...prev, modal: false }));
        getAll();
        formRef.resetFields();
        setFileList([]);
      }
    } catch (error) {
      console.error("Error during form submission:", error.response || error);
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
    formRef.setFieldsValue({
      ...item,
    });

    setState((prev) => ({
      ...prev,
      modal: true,
    }));

    if (item.image != "" && item.image != null) {
      const imageProduct = [
        {
          uid: "-1",
          name: item.image,
          status: "done",
          url: Config.image_path + item.image,
        },
      ];
      setFileList(imageProduct);
    }
  };

  return (
    <MainPage loading={state.loading}>
      <div className="flex justify-between items-center p-4 sticky top-0 my-2 bg-white rounded-md z-50">
        <p className="text-lg font-semibold font-battambang">
          ចំនួនផលិតផល : {state.list.length}
        </p>

        <Input.Search
          placeholder="Search products..."
          onChange={(event) =>
            setFilter((p) => ({ ...p, search: event.target.value }))
          }
          onSearch={onFilter}
          allowClear
          className="w-1/3"
        />

        <Select
          placeholder="Select category"
          className="w-48"
          allowClear
          onChange={(id) => setFilter((p) => ({ ...p, category_id: id }))}
        >
          {state.category?.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
        <Button onClick={onFilter} type="primary">
          Filter
        </Button>
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
        title={formRef.getFieldValue("id") ? "Edit Product" : "Add Product"}
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
              <Form.Item label="Product Image" name="image">
                <Upload
                  customRequest={(op) => op.onSuccess()}
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
            <Button type="primary" htmlType="submit" loading={state.loading}>
              {formRef.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
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
            key: "category_name",
            dataIndex: "category_name",
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
                // <p>{value}</p>
                <Image style={{ width: 50 }} src={Config.image_path + value} />
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
