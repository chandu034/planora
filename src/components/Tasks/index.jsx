import React, { useEffect, useState } from 'react';
import { Typography, Spin, Divider, message } from 'antd';
import { firestore } from '../../firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc } from '@firebase/firestore';
import dayjs from 'dayjs';
import TaskSection from './TaskSection';
import DoneTaskCard from './DoneTaskCard';

const { Title } = Typography;

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

      const visible = allActivities.filter(act => act.status !== 'not_task' && act.status !== 'done');
      const done = allActivities.filter(act => act.status === 'done');

      const groupByDate = (arr) => {
        const grouped = {};
        arr.forEach(act => {
          const date = act.date;
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(act);
        });
        Object.keys(grouped).forEach(date => {
          grouped[date].sort((a, b) =>
            dayjs(a.timeRange[0], 'HH:mm').diff(dayjs(b.timeRange[0], 'HH:mm'))
          );
        });
        return grouped;
      };

      setGroupedTasks(groupByDate(visible));
      setFinishedTasks(groupByDate(done));
    } catch (err) {
      console.error('Error loading tasks:', err);
      message.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateDoc(doc(firestore, 'activities', id), { status });
      fetchAllActivities();
      message.success(`Marked as ${status}`);
    } catch {
      message.error('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'activities', id));
      fetchAllActivities();
      message.success('Task deleted');
    } catch {
      message.error('Failed to delete task');
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
        Object.keys(groupedTasks).sort().map(date => (
          <TaskSection
            key={date}
            date={date}
            tasks={groupedTasks[date]}
            onStatusChange={handleStatusUpdate}
          />
        ))
      )}

      {Object.keys(finishedTasks).length > 0 && (
        <>
          <Divider />
          <Title level={3}>🎉 Finished Tasks</Title>
          {Object.keys(finishedTasks).sort().map(date => (
            <div key={date}>
              <Title level={5}>{dayjs(date).format('dddd, MMMM D, YYYY')}</Title>
              <Divider style={{ margin: '10px 0 20px' }} />
              {finishedTasks[date].map((task, i) => (
                <DoneTaskCard
                  key={i}
                  task={task}
                  onDelete={() => handleDelete(task.id)}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Tasks;
