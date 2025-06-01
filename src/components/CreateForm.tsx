import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Select, message } from 'antd';
import type { FieldMetadata } from '../api/types';

interface CreateFormProps {
  fields: FieldMetadata[];
  onItemCreated: (item: Record<string, any>) => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ fields, onItemCreated }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const getFieldComponent = (field: FieldMetadata) => {
    switch (field.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} />;
      case 'date':
        return <DatePicker style={{ width: '100%' }} />;
      case 'boolean':
        return (
          <Select placeholder="Select">
            <Select.Option value={true}>Yes</Select.Option>
            <Select.Option value={false}>No</Select.Option>
          </Select>
        );
      case 'select':
        return (
          <Select placeholder="Select" allowClear>
            {field.options?.map(option => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input />;
    }
  };

  const onFinish = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      const newItem = { ...values, id: Date.now().toString() };
      onItemCreated(newItem);
      message.success('Item created successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to create item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {fields.map(field => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.name}
          rules={[{ required: true, message: `Please input ${field.name}` }]}
        >
          {getFieldComponent(field)}
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Create Item
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateForm;