import { Button, Form, Input, Steps, Select, DatePicker, Modal } from "antd";
import "../App.css";
import { React, useState } from "react";
import {
  CheckCircleFilled,
  LoginOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import Typography from "antd/es/typography/Typography";
import { v4 as uuidv4 } from "uuid";
function User() {
  const [curent, setcurent] = useState(0);
  const [loginData, setloginData] = useState(null);
  const [AppoimentData, setAppoimentData] = useState(null);

  const onFinishLoginData = (values) => {
    const uniqueId = uuidv4();
    const loginDataWithId = { ...values, id: uniqueId };
    if (!localStorage.getItem(`loginFormData_${uniqueId}`)) {
      localStorage.setItem(
        `loginFormData_${uniqueId}`,
        JSON.stringify(loginDataWithId)
      );
      setloginData(loginDataWithId);
      setcurent(curent + 1);
    }
  };
  const onFinishAppointmentData = (values) => {
    const uniqueId = uuidv4();
    const appointmentDataWithId = { ...values, id: uniqueId };
    if (!localStorage.getItem(`appointmentFormData_${uniqueId}`)) {
      localStorage.setItem(
        `appointmentFormData_${uniqueId}`,
        JSON.stringify(appointmentDataWithId)
      );
      setAppoimentData(appointmentDataWithId);
      setcurent(curent + 1);
    }
  };

  const handlePrevious = () => {
    setcurent(curent - 1);
  };
  const form = [
    <LoginForm onFinish={onFinishLoginData} initialValues={loginData} />,
    <Appointment
      onFinish={onFinishAppointmentData}
      initialValues={Appointment}
      handlePrevious={handlePrevious}
    />,
    <FinishData handlePrevious={handlePrevious} />,
  ];

  const deseble = (stepNumber) => {
    if (stepNumber === 0) {
      return false;
    }
    if (stepNumber === 1) {
      return loginData === null;
    }
    if (stepNumber === 2) {
      return AppoimentData === null || loginData === null;
    }
  };
  return (
    <div className="App">
      {/* <Admin loginData={loginData} AppoimentData={AppoimentData} /> */}
      <Steps style={{ padding: 30 }} onChange={setcurent} current={curent}>
        <Steps.Step
          disabled={deseble(0)}
          title="Register"
          icon={<LoginOutlined />}
        />
        <Steps.Step
          disabled={deseble(1)}
          title="Vaccination Information"
          icon={<ProfileOutlined />}
        />
        <Steps.Step
          disabled={deseble(2)}
          title="Finish"
          icon={<CheckCircleFilled />}
        />
      </Steps>
      {form[curent]}
    </div>
  );
}
function LoginForm({ onFinish, initialValues }) {
  const handleSubmit = (values) => {
    localStorage.setItem("loginFormData", JSON.stringify(values));

    onFinish(values);
    // console.log("value is store in local storage");
  };
  return (
    <>
      <Form
        style={{ position: "relative", top: 20 }}
        initialValues={initialValues}
        className="login-form"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="fullname"
          label="Fullname"
          rules={[
            {
              required: true,
              message: "Please input your fullname",
              whitespace: true,
              min: 3,
              max: 20,
            },
          ]}
        >
          <Input className="input-name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please input your email",
              whitespace: true,
            },
          ]}
        >
          <Input type="email" className="input-email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password",
              whitespace: true,
              min: 6,
              max: 10,
            },
          ]}
        >
          <Input.Password className="input-password" />
        </Form.Item>
        <Form.Item
          name="Address"
          label="Address"
          rules={[
            {
              required: true,
              message: "Please input your address",
              whitespace: true,
              min: 6,
              max: 100,
            },
          ]}
        >
          <Input className="input-group" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Continue
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

function Appointment({ onFinish, initialValues, handlePrevious }) {
  const { Option } = Select;

  const [form] = Form.useForm();

  const onFinishForm = () => {
    form
      .validateFields()
      .then(() => {
        const formValues = form.getFieldsValue();

        localStorage.setItem("appointmentFormData", JSON.stringify(formValues));

        onFinish(formValues);
        // console.log(" appoiment value");
      })
      .catch((errorInfo) => {
        // console.log("Validation Failed:", errorInfo);
      });
  };
  return (
    <>
      <Form
        form={form}
        style={{ width: 420, position: "relative", top: 20 }}
        onFinish={onFinishForm}
        initialValues={initialValues}
        className="login-form"
      >
        <div className="formGropu">
          <Form.Item
            label="FirstDose"
            name="firstDose"
            rules={[{ required: true, message: "Please select vaccine!" }]}
          >
            <Select
              showSearch
              style={{ width: 140, marginRight: "8px" }}
              placeholder="Select vaccine"
              optionFilterProp="children"
            >
              <Option value="jack">Sputnik V</Option>
              <Option value="lucy">Moderna</Option>
              <Option value="tom">Sinopharm</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker style={{ width: "100%" }} picker="date" />
          </Form.Item>
        </div>
        <Form.Item>
          <Button
            type="primary"
            style={{ margin: "22px", width: "80px" }}
            onClick={handlePrevious}
          >
            Previous
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ margin: "22px", width: "80px" }}
          >
            Continue
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

function FinishData() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="login-form">
      <h1 style={{ color: "green", fontSize: "50px" }}>Congratulations</h1>

      <Modal
        title="Complete"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Typography>your vaccine process is completed</Typography>
      </Modal>
    </div>
  );
}

export default User;
