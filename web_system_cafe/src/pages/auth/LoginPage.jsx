import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin, Form, Input, Button } from "antd";
import { request } from "../../store/Configstore";
import { setAcccessToken, setProfile } from "../../store/profile";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const param = {
        email: values.email,
        password: values.password,
      };
      const res = await request("login", "post", param);
      console.log(res);
      if (res && !res.error) {
        setAcccessToken(res.token);
        setProfile(JSON.stringify(res.user));
        message.success(res.message);
        navigate("/");
      }
    } catch (error) {
      message.error(error.message || "ការចូលប្រើបានបរាជ័យ។");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Spin spinning={loading}>
          <div className="p-5">
            <Form
              name="login"
              onFinish={handleLogin}
              initialValues={{ email: "", password: "" }}
              layout="vertical"
            >
              <Form.Item
                className="font-battambang"
                label="អ៊ីម៉ែល"
                name="email"
                rules={[
                  { required: true, message: "សូមបញ្ចូលអ៊ីម៉ែលរបស់អ្នក!" },
                  { type: "email", message: "សូមបញ្ចូលអ៊ីម៉ែលដែលត្រឹមត្រូវ!" },
                ]}
              >
                <Input
                  type="email"
                  placeholder="បញ្ចូលអ៊ីម៉ែលរបស់អ្នក"
                  className="font-battambang"
                />
              </Form.Item>

              <Form.Item
                label="ពាក្យសម្ងាត់"
                name="password"
                className="font-battambang"
                rules={[
                  { required: true, message: "សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក!" },
                ]}
              >
                <Input.Password
                  placeholder="បញ្ចូលពាក្យសម្ងាត់របស់អ្នក"
                  className="font-battambang"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="font-battambang"
                  loading={loading}
                >
                  ចូលប្រើ
                </Button>
              </Form.Item>
            </Form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 font-battambang">
                មិនមានគណនីទេ?
                <a
                  href="/register"
                  className="text-blue-500 hover:underline font-battambang"
                >
                  ចុះឈ្មោះ
                </a>
              </p>
            </div>
          </div>
        </Spin>
      ) : (
        <div className="p-5">
          <Form
            name="login"
            onFinish={handleLogin}
            initialValues={{ email: "", password: "" }}
            layout="vertical"
          >
            <Form.Item
              label="អ៊ីម៉ែល"
              name="email"
              className="font-battambang"
              rules={[
                { required: true, message: "សូមបញ្ចូលអ៊ីម៉ែលរបស់អ្នក!" },
                { type: "email", message: "សូមបញ្ចូលអ៊ីម៉ែលដែលត្រឹមត្រូវ!" },
              ]}
            >
              <Input
                type="email"
                placeholder="បញ្ចូលអ៊ីម៉ែលរបស់អ្នក"
                className="font-battambang"
              />
            </Form.Item>

            <Form.Item
              label="ពាក្យសម្ងាត់"
              name="password"
              className="font-battambang"
              rules={[
                { required: true, message: "សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក!" },
              ]}
            >
              <Input.Password
                placeholder="បញ្ចូលពាក្យសម្ងាត់របស់អ្នក"
                className="font-battambang"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                className="font-battambang"
                htmlType="submit"
                block
                loading={loading}
              >
                ចូលប្រើ
              </Button>
            </Form.Item>
          </Form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 font-battambang">
              មិនមានគណនីទេ?
              <a
                href="/register"
                className="text-blue-500 hover:underline font-battambang"
              >
                ចុះឈ្មោះ
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
