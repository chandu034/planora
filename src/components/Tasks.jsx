import React, { useEffect, useState } from 'react';
import { Typography, Tag, Spin, Divider, Button, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
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

// Styled Components
const Section = styled.div`
  margin-bottom: 40px;
`;

const StyledActivityCard = styled.div`
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
  width: 90%;
  max-width: 400px;
  transition: transform 0.2s ease;
  border-left: 6px solid ${({ priority }) => PRIORITY_COLORS[priority]};

  &:hover {
    transform: translateY(-2px);
  }
`;

const DoneCard = styled(StyledActivityCard)`
  filter: grayscale(100%);
  opacity: 0.6;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const TimeText = styled.span`
  font-size: 0.9rem;
  color: #555;
`;

const ActivityName = styled.h3`
  margin: 8px 0;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 12px;
`;

const Tasks = () => {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [finishedTasks, setFinishedTasks] = useState({});
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

      // Filter and group active tasks (not done or not_task)
      const visibleActivities = allActivities.filter(
        (act) => act.status !== 'not_task' && act.status !== 'done'
      );

      const finished = allActivities.filter(act => act.status === 'done');

      const grouped = {};
      const finishedGrouped = {};

      visibleActivities.forEach((activity) => {
        const date = activity.date;
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(activity);
      });

      finished.forEach((activity) => {
        const date = activity.date;
        if (!finishedGrouped[date]) finishedGrouped[date] = [];
        finishedGrouped[date].push(activity);
      });

      Object.keys(grouped).forEach(date => {
        grouped[date].sort((a, b) =>
          dayjs(a.timeRange[0], 'HH:mm').diff(dayjs(b.timeRange[0], 'HH:mm'))
        );
      });

      Object.keys(finishedGrouped).forEach(date => {
        finishedGrouped[date].sort((a, b) =>
          dayjs(a.timeRange[0], 'HH:mm').diff(dayjs(b.timeRange[0], 'HH:mm'))
        );
      });

      setGroupedTasks(grouped);
      setFinishedTasks(finishedGrouped);
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
      fetchAllActivities(); // refresh
      if (newStatus === 'task') {
        message.success('Marked as Task!');
      } else if (newStatus === 'done') {
        message.success('Marked as Done!');
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
      <Title level={2} style={{ marginBottom: 32 }}>🗂️ Your Tasks</Title>
      {loading ? (
        <Spin size="large" />
      ) : Object.keys(groupedTasks).length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        Object.keys(groupedTasks)
          .sort((a, b) => dayjs(a).diff(dayjs(b)))
          .map((date) => (
            <Section key={date}>
              <Title level={4} style={{ marginBottom: 8 }}>
                {dayjs(date).format('dddd, MMMM D, YYYY')}
              </Title>
              <Divider style={{ margin: '10px 0 20px' }} />

              {groupedTasks[date].map((task, idx) => (
                <StyledActivityCard key={idx} priority={task.priority}>
                  <InfoRow>
                    <TimeText>{task.timeRange[0]} - {task.timeRange[1]}</TimeText>
                    <Tag color={PRIORITY_COLORS[task.priority]}>
                      {(task.priority || 'normal').toUpperCase()}
                    </Tag>
                  </InfoRow>

                  <ActivityName>{task.name}</ActivityName>

                  {/* If not yet classified */}
                  {!task.status && (
                    <ButtonGroup>
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => handleStatusUpdate(task.id, 'task')}
                      >
                        Task
                      </Button>
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => handleStatusUpdate(task.id, 'not_task')}
                      >
                        Not a Task
                      </Button>
                    </ButtonGroup>
                  )}

                  {/* If it's already marked as task */}
                  {task.status === 'task' && (
                    <ButtonGroup>
                      <Button
                        type="dashed"
                        onClick={() => handleStatusUpdate(task.id, 'done')}
                      >
                        Done
                      </Button>
                    </ButtonGroup>
                  )}
                </StyledActivityCard>
              ))}
            </Section>
          ))
      )}

      {/* Finished Tasks Section */}
      {Object.keys(finishedTasks).length > 0 && (
        <>
          <Divider />
          <Title level={3}>🎉 Finished Tasks</Title>

          {Object.keys(finishedTasks)
            .sort((a, b) => dayjs(a).diff(dayjs(b)))
            .map((date) => (
              <Section key={date}>
                <Title level={5} style={{ marginBottom: 8 }}>
                  {dayjs(date).format('dddd, MMMM D, YYYY')}
                </Title>
                <Divider style={{ margin: '10px 0 20px' }} />
                {finishedTasks[date].map((task, idx) => (
                  <DoneCard key={idx} priority={task.priority}>
                    <InfoRow>
                      <TimeText>{task.timeRange[0]} - {task.timeRange[1]}</TimeText>
                      <Tag color={PRIORITY_COLORS[task.priority]}>
                        {(task.priority || 'normal').toUpperCase()}
                      </Tag>
                    </InfoRow>
                    <ActivityName>{task.name}</ActivityName>
                  </DoneCard>
                ))}
              </Section>
            ))}
        </>
      )}
    </>
  );
};

export default Tasks;
