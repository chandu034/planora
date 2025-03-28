import React from 'react';
import {
  Form,
  Input,
  Select,
  TimePicker,
  Button,
  Divider,
  Typography,
  Tag,
} from 'antd';
import styled from 'styled-components';

const { Title } = Typography;
const { RangePicker } = TimePicker;

const PRIORITY_COLORS = {
  important: 'red',
  urgent: 'orange',
  normal: 'green',
  'not important': 'default',
};

const FormContainer = styled.div`
  max-width: 400px;
`;

const ActivityCard = styled.div`
  padding: 10px 12px;
  margin-bottom: 10px;
  border: 1px solid #d9d9d9;
  border-left: 4px solid ${({ priority }) => PRIORITY_COLORS[priority]};
  border-radius: 4px;
  background: #fafafa;
`;

const PlannerForm = ({ selectedDate, activities, onAddActivity }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onAddActivity(values, form);
  };

  return (
    <>
      <Title level={4}>Planning for: {selectedDate.format('YYYY-MM-DD')}</Title>

      <FormContainer>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="timeRange" label="Time Range" rules={[{ required: true }]}>
            <RangePicker format="HH:mm" />
          </Form.Item>

          <Form.Item name="activity" label="Activity Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Study, Gym, Meeting" />
          </Form.Item>

          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="important">Important</Select.Option>
              <Select.Option value="urgent">Urgent</Select.Option>
              <Select.Option value="normal">Normal</Select.Option>
              <Select.Option value="not important">Not Important</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Activity
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>

      <Divider />

      <Title level={5}>Planned Activities</Title>
      {activities.length === 0 ? (
        <p>No activities added yet.</p>
      ) : (
        activities.map((act, index) => (
          <ActivityCard key={index} priority={act.priority}>
            <strong>
              {act.timeRange[0]} - {act.timeRange[1]}
            </strong>
            <br />
            {act.name}
            <br />
            <Tag color={PRIORITY_COLORS[act.priority]} style={{ marginTop: 5 }}>
              {act.priority.toUpperCase()}
            </Tag>
          </ActivityCard>
        ))
      )}
    </>
  );
};

export default PlannerForm;
