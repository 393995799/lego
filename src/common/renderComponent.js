/**
 * @file 预览渲染组件
 * @author wuya
 */
import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

/**
 * @param {Array} instances - 实例对象数组
 */
export default function renderComponent(instances, context) {
  if (!instances) {
    return null;
  }
  const components = [];
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const {
      label,
      Component,
      isField,
      props,
      fieldProps,
      uuid,
      children,
      options = [],
      columns = [],
    } = instance;
    console.log(isField);
    if (isField) {
      const {
        title,
        label: id,
        rules,
        initialValue,
        labelCol,
        wrapperCol,
      } = fieldProps;
      const { form } = context;
      const { getFieldDecorator } = form;
      // 这里
      const temp = { ...props };
      if (options) {
        temp.options = options;
      }
      let c = (
        <Component {...temp}>{renderComponent(children, context)}</Component>
      );
      if (label === 'Button') {
        c = <Component {...temp}>{temp.children}</Component>;
      }
      if (label === 'Select') {
        c = (
          <Component {...temp}>
            {options.map(option => (
              <Option key={i} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Component>
        );
      }

      const fieldComponent = id
        ? getFieldDecorator(id, {
            rules,
            initialValue,
          })(c)
        : c;

      components.push(
        <Form.Item
          key={uuid}
          label={title}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          {fieldComponent}
        </Form.Item>,
      );
    } else {
      // 这里也很 low ....
      if (label === 'Table') {
        const { columns, dataSource } = instance;
        components.push(
          <Component
            key={uuid}
            {...props}
            columns={columns}
            dataSource={dataSource}
          >
            {renderComponent(children, context)}
          </Component>,
        );
      } else if (label === 'Modal') {
        const newProps = {...props};
        newProps.visible = false;

        components.push(
          <Component key={uuid} {...newProps}>
            {renderComponent(children, context)}
          </Component>,
        );
      } else {
        components.push(
          <Component key={uuid} {...props}>
            {renderComponent(children, context)}
          </Component>,
        );
      }
    }
  }
  return components;
}
