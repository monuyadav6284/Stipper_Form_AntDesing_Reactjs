import React, { useState, useEffect } from "react";
import { Table, Form, Input, Button, message, Modal } from "antd";
import "../App.css";

function Admin() {
  const [allData, setAllData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (loggedIn) {
      const keys = Object.keys(localStorage);
      const data = keys.map((key) => {
        const storedData = JSON.parse(localStorage.getItem(key));
        return storedData;
      });
      console.log(data); 
      const uniqueData = [];
      data.forEach((item) => {
        const index = uniqueData.findIndex((uItem) => uItem.id === item.id);
        if (index === -1) {
          uniqueData.push(item);
        } else {
          uniqueData[index].firstDose = "";
          uniqueData[index].date = "";
        }
      });
      setAllData(uniqueData);
    }
  }, [loggedIn]);
  

  const handleLogin = (values) => {
    const { email, password } = values;
    if (email === "admin@example.com" && password === "admin123") {
      setLoggedIn(true);
      message.success("Login successful!");
    } else {
      message.error("Invalid email or password.");
    }
  };

  const handleEdit = (record) => {
    setSelectedRow(record);
    setEditedData(record);
    editForm.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this record?",
      onOk: () => {
        localStorage.removeItem(record.id);
        message.success("Record deleted successfully!");

        setAllData(allData.filter((item) => item.id !== record.id));
      },
      onCancel() {},
    });
  };

  const handleEditModalCancel = () => {
    setSelectedRow(null);
    setEditModalVisible(false);
  };

  const handleEditModalSubmit = () => {
    editForm
      .validateFields()
      .then((values) => {
        const updatedData = { ...editedData, ...values };
        const updatedAllData = allData.map((item) =>
          item.id === editedData.id ? updatedData : item
        );
        localStorage.setItem(editedData.id, JSON.stringify(updatedData));
        setAllData(updatedAllData);
        message.success("Record updated successfully!");
        setEditModalVisible(false);
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  const columns = [
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",
    },
    {
      title: "date",
      dataIndex: "date", 
      key: "date",
    },
    {
      title: "firstDose", 
      dataIndex: "firstDose", 
      key: "firstDose",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record)} style={{ marginLeft: 8 }}>
            Delete
          </Button>
        </span>
      ),
    },
  ];
  
  if (!loggedIn) {
    return (
      <div
        style={{ width: 300, margin: "auto", marginTop: 100 }}
        className="login-form"
      >
        <h1>Login Admin</h1>
        <Form name="basic" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  console.log(allData);

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <Table columns={columns} dataSource={allData} className="table" />

      <Modal
        title="Edit Record"
        visible={editModalVisible}
        onCancel={handleEditModalCancel}
        footer={[
          <Button key="cancel" onClick={handleEditModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditModalSubmit}>
            Submit
          </Button>,
        ]}
      >
        <Form form={editForm} initialValues={editedData} layout="vertical">
          <Form.Item
            label="Fullname"
            name="fullname"
            rules={[{ required: true, message: "Please enter fullname" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Address"
            name="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please enter date" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="FirstDose"
            name="firstDose"
            rules={[{ required: true, message: "Please enter firstDose" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Admin;
