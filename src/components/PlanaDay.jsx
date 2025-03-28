import React, { useState } from 'react';
import {
  DatePicker,
  TimePicker,
  Input,
  Select,
  Button,
  Form,
  Typography,
  Divider,
  Tag,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { firestore } from '../firebase';
import { collection, addDoc } from '@firebase/firestore';

const { Title } = Typography;
const { RangePicker } = TimePicker;

const PRIORITY_COLORS = {
  important: 'red',
  urgent: 'orange',
  normal: 'green',
  'not important': 'default',
};

const PlanaDay = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState([]);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const newActivity = {
        date: selectedDate.format('YYYY-MM-DD'),
        timeRange: values.timeRange.map((t) => t.format('HH:mm')),
        name: values.activity,
        priority: values.priority,
      };

      // Save to Firestore
      const ref = collection(firestore, 'activities');
      await addDoc(ref, newActivity);

      message.success('Activity added!');
      form.resetFields();

      setActivities((prev) =>
        [...prev, newActivity].sort((a, b) =>
          dayjs(a.timeRange[0], 'HH:mm').diff(dayjs(b.timeRange[0], 'HH:mm'))
        )
      );
    } catch (error) {
      console.error('Error adding activity:', error);
      message.error('Failed to add activity');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Plan Your Day</Title>

      {!selectedDate ? (
        <>
          <Title level={4}>Select a date to begin</Title>
          <DatePicker onChange={(date) => setSelectedDate(date)} />
        </>
      ) : (
        <>
          <Title level={4}>Planning for: {selectedDate.format('YYYY-MM-DD')}</Title>

          <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 400 }}>
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

          <Divider />

          <Title level={5}>Planned Activities</Title>
          {activities.length === 0 ? (
            <p>No activities added yet.</p>
          ) : (
            activities.map((act, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 12px',
                  marginBottom: 10,
                  border: `1px solid #d9d9d9`,
                  borderLeft: `4px solid ${PRIORITY_COLORS[act.priority]}`,
                  borderRadius: 4,
                  background: '#fafafa',
                }}
              >
                <strong>
                  {act.timeRange[0]} - {act.timeRange[1]}
                </strong>
                <br />
                {act.name}
                <br />
                <Tag color={PRIORITY_COLORS[act.priority]} style={{ marginTop: 5 }}>
                  {act.priority.toUpperCase()}
                </Tag>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default PlanaDay;
