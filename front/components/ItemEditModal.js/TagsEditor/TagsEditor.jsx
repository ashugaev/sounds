import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Form, Input, Button, Space,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const TagsEditor = inject('itemEditModalStore')(observer(({
  itemEditModalStore,
}) => {
  const { channelData: { channelCategories = {} } } = itemEditModalStore;

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
    <Form
      name="categories-editor-form"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{
        fieldKey: 2,
        isListField: true,
        key: 2,
        name: 2,
      }}
    >
      <Form.List
        name="categories-list"
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => {
              console.log('kek', fields, field);

              return (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...field}
                    name={[field.name, 'title']}
                    fieldKey={[field.name, 'name']}
                    rules={[{ required: true, message: 'Missing first name' }]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'last']}
                    fieldKey={[field.fieldKey, 'last']}
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              );
            })}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add category
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
}));

export default TagsEditor;
