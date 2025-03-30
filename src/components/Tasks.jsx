import React, { useEffect, useState } from 'react';
import { Typography, Tag, Spin, Divider, Button, message } from 'antd';
import { firestore } from '../firebase';
import { collection, getDocs, updateDoc, doc } from '@firebase/firestore';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Title } = Typography;

const PRIORITY_COLORS = {
  important: 'red',
  urgent: 'orange',
  normal: 'green',
  'not important': 'default',
};

const ActivityCard = styled.div`
  padding: 10px 12px;
  margin-bottom: 10px;
  border: 1px solid #d9d9d9;
  border-left: 4px solid ${({ priority }) => PRIORITY_COLORS[priority]};
  border-radius: 4px;
  background: #fafafa;
`;

const ButtonGroup = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 10px;
`;

const Tasks = () => {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAllActivities = async () => {
    setLoading(true);
    try {
      const ref = collection(firestore, 'activities');
      const snapshot = await getDocs(ref);
      const allActivities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter out not_task items
      const visibleActivities = allActivities.filter(
        (act) => act.status !== 'not_task'
      );

      // Group by date
      const grouped = {};
      visibleActivities.forEach((activity) => {
        const date = activity.date;
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(activity);
      });

      // Sort by time
      Object.keys(grouped).forEach(date => {
        grouped[date].sort((a, b) =>
          dayjs(a.timeRange[0], 'HH:mm').diff(dayjs(b.timeRange[0], 'HH:mm'))
        );
      });

      setGroupedTasks(grouped);
    } catch (err) {
      console.error('Error loading tasks:', err);
      message.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (activityId, newStatus) => {
    try {
      const activityRef = doc(firestore, 'activities', activityId);
      await updateDoc(activityRef, { status: newStatus });
      fetchAllActivities(); // refresh view
      if (newStatus === 'task') {
        message.success('Marked as Task!');
      } else {
        message.info('Marked as Not a Task.');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      message.error('Failed to update task status');
    }
  };

  useEffect(() => {
    fetchAllActivities();
  }, []);

  return (
    <>
      <Title level={2}>Your Tasks</Title>
      {loading ? (
        <Spin size="large" />
      ) : Object.keys(groupedTasks).length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        Object.keys(groupedTasks)
          .sort((a, b) => dayjs(a).diff(dayjs(b)))
          .map((date) => (
            <div key={date} style={{ marginBottom: 40 }}>
              <Title level={4}>{dayjs(date).format('dddd, MMMM D, YYYY')}</Title>
              <Divider />
              {groupedTasks[date].map((task, idx) => (
                <ActivityCard key={idx} priority={task.priority}>
                  <strong>{task.timeRange[0]} - {task.timeRange[1]}</strong><br />
                  {task.name}
                  <br />
                  <Tag color={PRIORITY_COLORS[task.priority]} style={{ marginTop: 5 }}>
                    {(task.priority || 'normal').toUpperCase()}
                  </Tag>

                  {/* Show buttons only if status is undefined */}
                  {!task.status && (
                    <ButtonGroup>
                      <Button type="primary" onClick={() => handleStatusUpdate(task.id, 'task')}>
                        Task
                      </Button>
                      <Button danger onClick={() => handleStatusUpdate(task.id, 'not_task')}>
                        Not a Task
                      </Button>
                    </ButtonGroup>
                  )}
                </ActivityCard>
              ))}
            </div>
          ))
      )}
    </>
  );
};

export default Tasks;
